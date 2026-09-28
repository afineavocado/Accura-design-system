#!/usr/bin/env node
/**
 * build-catalog.mjs — generates the catalog index the /catalog page and agents read.
 *
 *   node docs/machine-readable/build-catalog.mjs          write the outputs
 *   node docs/machine-readable/build-catalog.mjs --check  fail if they are stale
 *
 * Inputs, each owned elsewhere — this script only reads them:
 *   artifacts/components/*.meta.json   component IDs (catalogId), description, props
 *   catalog-entries.json               patterns, layouts, templates (hand-written)
 *   docs/tracking/Storybook Status.md  the component pipeline columns
 *   accura-ui/src/stories/*.stories.tsx  the story names, read from the file, not the meta
 *   accura-ui/src/app/prototype/accura/  which modules import what
 *
 * Outputs (generated, never edit by hand):
 *   accura-ui/src/app/catalog/catalog.json        the index
 *   accura-ui/src/app/catalog/stories.generated.ts  story modules, keyed by catalog ID
 *
 * Deterministic: no timestamps, sorted keys, so a rerun with no input change writes nothing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const ui = path.join(root, 'accura-ui');
const metaDir = path.join(here, 'artifacts/components');
const outDir = path.join(ui, 'src/app/catalog');
const protoDir = path.join(ui, 'src/app/prototype/accura');
const check = process.argv.includes('--check');

const errors = [];
const warnings = [];
const rel = (p) => path.relative(root, p).split(path.sep).join('/');

// ── Storybook Status.md → pipeline per component ─────────────────────────────
const statusMd = fs.readFileSync(path.join(root, 'docs/tracking/Storybook Status.md'), 'utf8');
const mark = (cell) => (cell.includes('✅') ? 'done' : cell.includes('⚠️') ? 'inherited' : cell.includes('❌') ? 'no' : 'n/a');
const pipeline = new Map();
for (const line of statusMd.split('\n')) {
  const cells = line.split('|').slice(1, -1).map((c) => c.trim());
  if (cells.length !== 5 || cells[0] === 'Component' || cells[0].startsWith('---')) continue;
  const key = cells[0].replace(/\*/g, '').toLowerCase();
  pipeline.set(key, { tokens: mark(cells[1]), storyWritten: mark(cells[3]), storyVerified: mark(cells[4]) });
}

// ── Story files → export names and Storybook IDs ─────────────────────────────
const kebab = (s) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function readStories(file) {
  const src = fs.readFileSync(path.join(ui, file), 'utf8');
  const title = src.match(/title:\s*['"]([^'"]+)['"]/)?.[1];
  const names = [...src.matchAll(/^export const (\w+)/gm)].map((m) => m[1]);
  const base = title ? title.split('/').map(kebab).join('-') : null;
  return {
    title,
    stories: names.map((n) => ({ export: n, name: n.replace(/([a-z0-9])([A-Z])/g, '$1 $2'), storybookId: base ? `${base}--${kebab(n)}` : null })),
  };
}

// ── Prototype imports → which modules use which file ─────────────────────────
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : /\.(tsx?|mts)$/.test(d.name) ? [p] : [];
  });
}
const stripExt = (p) => p.replace(/\.(tsx?|mts)$/, '');
const importsByFile = new Map(); // resolved target (no ext) → Map(module → Set(imported names))
for (const file of walk(protoDir)) {
  const segs = path.relative(protoDir, file).split(path.sep);
  const mod = segs.length > 1 ? segs[0] : 'shared';
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/import\s+(?:type\s+)?([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g)) {
    const spec = m[2];
    let target;
    if (spec.startsWith('@/')) target = path.join(ui, 'src', spec.slice(2));
    else if (spec.startsWith('.')) target = path.resolve(path.dirname(file), spec);
    else continue;
    const names = (m[1].match(/\{([\s\S]*)\}/)?.[1] ?? '')
      .split(',').map((n) => n.replace(/^\s*type\s+/, '').split(/\s+as\s+/)[0].trim()).filter(Boolean);
    const key = stripExt(target);
    if (!importsByFile.has(key)) importsByFile.set(key, new Map());
    const byMod = importsByFile.get(key);
    if (!byMod.has(mod)) byMod.set(mod, new Set());
    for (const n of names) byMod.get(mod).add(n);
  }
}
// Modules that import any of `files`, or, when `exportNames` is given, any of those names from them.
// Several patterns share record-workflow.tsx; matching the file alone would credit each with all its users.
const modulesUsing = (files, exportNames) => {
  const set = new Set();
  for (const f of files)
    for (const [mod, names] of importsByFile.get(stripExt(path.join(root, f))) ?? [])
      if (!exportNames || exportNames.some((n) => names.has(n))) set.add(mod);
  set.delete('shared'); // prototype-root helpers are not a module
  return [...set].sort();
};

// ── Components from meta.json ────────────────────────────────────────────────
const items = [];
for (const f of fs.readdirSync(metaDir).filter((f) => f.endsWith('.meta.json')).sort()) {
  const meta = JSON.parse(fs.readFileSync(path.join(metaDir, f), 'utf8'));
  if (!meta.catalogId) { errors.push(`${f}: no catalogId`); continue; }
  // stepper.meta.json names it `file`, the schema says `tsxFile`; read either.
  const tsx = meta.implementation?.tsxFile ?? meta.implementation?.file;
  if (!tsx) { errors.push(`${f}: no implementation.tsxFile`); continue; }
  const storyFile = meta.storybook?.file;
  if (!storyFile || !fs.existsSync(path.join(ui, storyFile))) { errors.push(`${f}: story file missing (${storyFile})`); continue; }
  const { title, stories } = readStories(storyFile);
  const pipe = pipeline.get(meta.name.replace(/-/g, '')) ?? null;
  if (!pipe) warnings.push(`${f}: no row in Storybook Status.md, pipeline shown as unknown`);
  const props = Object.values(meta.variants ?? {})
    .filter((v) => v.reactProp)
    .map((v) => ({ prop: v.reactProp, values: v.reactValues ? [...new Set(Object.values(v.reactValues).map(String))] : v.values, default: v.reactValues?.[v.default] ?? v.default }));
  items.push({
    id: meta.catalogId,
    type: 'component',
    layer: meta.catalogId.startsWith('agt-') ? 'shell' : 'local',
    name: title ? title.split('/').pop() : meta.name,
    description: meta.description,
    category: meta.category,
    status: pipe?.storyVerified === 'done' ? 'stable' : 'in-review',
    pipeline: pipe,
    files: [rel(path.join(ui, tsx)), rel(path.join(ui, storyFile))],
    exports: meta.implementation?.exports ?? [],
    import: `@/components/ui/${path.basename(tsx, '.tsx')}`,
    props,
    stories,
    usedIn: modulesUsing([rel(path.join(ui, tsx))]),
    meta: rel(path.join(metaDir, f)),
  });
}

// ── Patterns, layouts, templates from catalog-entries.json ───────────────────
const source = JSON.parse(fs.readFileSync(path.join(here, 'catalog-entries.json'), 'utf8'));
for (const e of source.entries) {
  for (const file of e.files) if (!fs.existsSync(path.join(root, file))) errors.push(`${e.id}: file not found ${file}`);
  if (!source.statuses[e.status]) errors.push(`${e.id}: unknown status ${e.status}`);
  const fromExamples = (e.examples ?? []).map((r) => r.split('/')[3]).filter(Boolean);
  // A template's `files` is its canonical example page, not something imported; its users are its examples.
  const imported = e.exports ? modulesUsing(e.files, e.exports) : [];
  items.push({
    ...e,
    layer: 'local',
    import: e.files[0].startsWith('accura-ui/src/') && e.exports
      ? '@/' + stripExt(e.files[0].slice('accura-ui/src/'.length))
      : undefined,
    usedIn: [...new Set([...imported, ...fromExamples])].sort(),
  });
}

// ── Integrity ────────────────────────────────────────────────────────────────
const ids = new Map();
for (const it of items) {
  if (!/^(agt|acc)-(cmp|pat|lay|tpl)-[a-z0-9-]+$/.test(it.id)) errors.push(`bad ID format: ${it.id}`);
  if (ids.has(it.id)) errors.push(`duplicate ID: ${it.id}`);
  ids.set(it.id, it);
}
for (const it of items) for (const u of it.uses ?? []) if (!ids.has(u)) errors.push(`${it.id}: uses unknown ID ${u}`);

for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  console.error('✗ catalog not built:\n  ' + errors.join('\n  '));
  process.exit(1);
}

const order = { layout: 0, template: 1, pattern: 2, component: 3 };
items.sort((a, b) => order[a.type] - order[b.type] || a.id.localeCompare(b.id));

const catalog = {
  $comment: 'GENERATED by docs/machine-readable/build-catalog.mjs. Do not edit. Sources: meta.json catalogId, catalog-entries.json, Storybook Status.md.',
  idFormat: '{product}-{type}-{name} · product: agt (Agentic shell) | acc (Accura) · type: cmp component | pat pattern | lay layout | tpl template · a story or variant follows #, e.g. agt-cmp-badge#success',
  statuses: source.statuses,
  counts: Object.fromEntries(Object.keys(order).map((t) => [t, items.filter((i) => i.type === t).length])),
  items,
};

const storyItems = items.filter((i) => i.type === 'component');
const ts = [
  '// GENERATED by docs/machine-readable/build-catalog.mjs. Do not edit.',
  '// Story modules keyed by catalog ID, so the catalog renders the same stories Storybook does.',
  ...storyItems.map((it, n) => `import * as s${n} from "@/${it.files[1].replace('accura-ui/src/', '').replace(/\.tsx$/, '')}";`),
  '',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any',
  'export const storyModules: Record<string, Record<string, any>> = {',
  ...storyItems.map((it, n) => `  "${it.id}": s${n},`),
  '};',
  '',
].join('\n');

const outputs = [
  [path.join(outDir, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n'],
  [path.join(outDir, 'stories.generated.ts'), ts],
];

let stale = 0;
for (const [file, content] of outputs) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (current === content) continue;
  stale++;
  if (!check) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    console.log(`wrote ${rel(file)}`);
  } else console.error(`✗ stale: ${rel(file)}. Run node docs/machine-readable/build-catalog.mjs`);
}
if (check && stale) process.exit(1);
console.log(`✓ catalog: ${items.length} items (${Object.entries(catalog.counts).map(([k, v]) => `${v} ${k}`).join(', ')})${stale ? '' : ', up to date'}`);
