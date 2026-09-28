#!/usr/bin/env node
/**
 * build-catalog.mjs — generates the catalog index the /catalog page and agents read.
 * Template from docs/skills/catalog-build. Edit CONFIG only; the rest is project-neutral.
 *
 *   node <path>/build-catalog.mjs          write the outputs
 *   node <path>/build-catalog.mjs --check  fail if they are stale (use as a gate)
 *
 * Inputs, each owned elsewhere — this script only reads them:
 *   component metadata   meta.json files with a catalogId (CONFIG.metaDir), or, if a project
 *                        has none, `type: "component"` entries in the entries file
 *   entries file         patterns, layouts, templates (hand-written)
 *   status table         optional markdown table of per-component pipeline steps
 *   story files          story names are read from the file, never from metadata
 *   app source           which modules import what, by named import
 *
 * Outputs (generated, never edit by hand):
 *   <outDir>/catalog.json            the index
 *   <outDir>/stories.generated.ts    story modules keyed by catalog ID
 *
 * Deterministic: no timestamps, stable order, so a rerun with no input change writes nothing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ═══ CONFIG — the only part to edit per project ═════════════════════════════
const here = path.dirname(fileURLToPath(import.meta.url));
const CONFIG = {
  // Repo root, relative to this script.
  root: path.resolve(here, '../..'),
  // The Next.js app (the folder holding package.json and src/).
  app: 'accura-ui',
  // Folder of *.meta.json with a `catalogId` field. null = components come from the entries file.
  metaDir: 'docs/machine-readable/artifacts/components',
  // Hand-written patterns / layouts / templates (and components, if metaDir is null).
  entriesFile: 'docs/machine-readable/catalog-entries.json',
  // Optional pipeline table. null = no pipeline badges; component status comes from the entry.
  statusTable: {
    file: 'docs/tracking/Storybook Status.md',
    // 0-based cell index of each step, counting the component-name cell as 0.
    columns: { tokens: 1, storyWritten: 3, storyVerified: 4 },
    // Which step makes a component `stable`.
    stableWhen: 'storyVerified',
  },
  // Where modules live. The first folder under it is the module name; files directly in it are shared.
  modulesDir: 'accura-ui/src/app/prototype/accura',
  // ID prefixes. `shell` = inherited from an upstream system, `local` = this product's own.
  products: { agt: 'shell', acc: 'local' },
  // Output folder, inside the app so the page can import it.
  outDir: 'accura-ui/src/app/catalog',
  // The app's `@/` import alias points here.
  aliasRoot: 'accura-ui/src',
};
// ════════════════════════════════════════════════════════════════════════════

const check = process.argv.includes('--check');
const root = CONFIG.root;
const abs = (p) => path.join(root, p);
const rel = (p) => path.relative(root, p).split(path.sep).join('/');
const errors = [];
const warnings = [];
const TYPES = { cmp: 'component', pat: 'pattern', lay: 'layout', tpl: 'template' };
const idRe = new RegExp(`^(${Object.keys(CONFIG.products).join('|')})-(${Object.keys(TYPES).join('|')})-[a-z0-9-]+$`);

// ── Status table → pipeline per component ────────────────────────────────────
const mark = (c) => (c.includes('✅') ? 'done' : c.includes('⚠️') ? 'inherited' : c.includes('❌') ? 'no' : 'n/a');
const pipeline = new Map();
if (CONFIG.statusTable && fs.existsSync(abs(CONFIG.statusTable.file))) {
  const cols = CONFIG.statusTable.columns;
  const width = Math.max(...Object.values(cols)) + 1;
  for (const line of fs.readFileSync(abs(CONFIG.statusTable.file), 'utf8').split('\n')) {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < width || cells[0].startsWith('---') || /^component$/i.test(cells[0])) continue;
    const key = cells[0].replace(/\*/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    pipeline.set(key, Object.fromEntries(Object.entries(cols).map(([k, i]) => [k, mark(cells[i])])));
  }
}

// ── Story files → export names and Storybook IDs ─────────────────────────────
const kebab = (s) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function readStories(file) {
  const src = fs.readFileSync(abs(file), 'utf8');
  const title = src.match(/title:\s*['"]([^'"]+)['"]/)?.[1];
  const base = title ? title.split('/').map(kebab).join('-') : null;
  return {
    title,
    stories: [...src.matchAll(/^export const (\w+)/gm)].map(([, n]) => ({
      export: n,
      name: n.replace(/([a-z0-9])([A-Z])/g, '$1 $2'),
      storybookId: base ? `${base}--${kebab(n)}` : null,
    })),
  };
}

// ── App source → which modules import which names from which file ────────────
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : /\.(tsx?|mts)$/.test(d.name) ? [p] : [];
  });
const stripExt = (p) => p.replace(/\.(tsx?|mts)$/, '');
const importsByFile = new Map(); // target (abs, no ext) → Map(module → Set(names))
for (const file of walk(abs(CONFIG.modulesDir))) {
  const segs = path.relative(abs(CONFIG.modulesDir), file).split(path.sep);
  const mod = segs.length > 1 ? segs[0] : null; // files directly in modulesDir are shared, not a module
  if (!mod) continue;
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/import\s+(?:type\s+)?([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g)) {
    const spec = m[2];
    const target = spec.startsWith('@/') ? abs(path.join(CONFIG.aliasRoot, spec.slice(2)))
      : spec.startsWith('.') ? path.resolve(path.dirname(file), spec) : null;
    if (!target) continue;
    const names = (m[1].match(/\{([\s\S]*)\}/)?.[1] ?? '')
      .split(',').map((n) => n.replace(/^\s*type\s+/, '').split(/\s+as\s+/)[0].trim()).filter(Boolean);
    const key = stripExt(target);
    if (!importsByFile.has(key)) importsByFile.set(key, new Map());
    const byMod = importsByFile.get(key);
    if (!byMod.has(mod)) byMod.set(mod, new Set());
    names.forEach((n) => byMod.get(mod).add(n));
  }
}
// Several items can share one file; with exportNames, only modules importing those names count.
const modulesUsing = (files, exportNames) => {
  const set = new Set();
  for (const f of files)
    for (const [mod, names] of importsByFile.get(stripExt(abs(f))) ?? [])
      if (!exportNames?.length || exportNames.some((n) => names.has(n))) set.add(mod);
  return [...set].sort();
};
const importPath = (file) =>
  file.startsWith(CONFIG.aliasRoot + '/') ? '@/' + stripExt(file.slice(CONFIG.aliasRoot.length + 1)) : undefined;

// ── Entries file ─────────────────────────────────────────────────────────────
const source = JSON.parse(fs.readFileSync(abs(CONFIG.entriesFile), 'utf8'));
const statuses = source.statuses;
const items = [];

// Components: from meta.json, or from entries when the project has no metadata.
function componentItem({ id, name, description, category, tsx, storyFile, exports, props, status, extra }) {
  if (!fs.existsSync(abs(tsx))) errors.push(`${id}: component file not found ${tsx}`);
  if (!storyFile || !fs.existsSync(abs(storyFile))) { errors.push(`${id}: story file not found ${storyFile}`); return; }
  const { title, stories } = readStories(storyFile);
  const pipe = CONFIG.statusTable ? pipeline.get(name.toLowerCase().replace(/[^a-z0-9]/g, '')) ?? null : null;
  if (CONFIG.statusTable && !pipe) warnings.push(`${id}: no row in ${CONFIG.statusTable.file}`);
  items.push({
    id,
    type: 'component',
    layer: CONFIG.products[id.split('-')[0]],
    name: title ? title.split('/').pop() : name,
    description,
    category,
    status: status ?? (pipe?.[CONFIG.statusTable?.stableWhen] === 'done' ? 'stable' : 'in-review'),
    pipeline: pipe,
    files: [tsx, storyFile],
    exports,
    import: importPath(tsx),
    props,
    stories,
    usedIn: modulesUsing([tsx]),
    ...extra,
  });
}

if (CONFIG.metaDir) {
  for (const f of fs.readdirSync(abs(CONFIG.metaDir)).filter((f) => f.endsWith('.meta.json')).sort()) {
    const metaPath = path.join(CONFIG.metaDir, f);
    const meta = JSON.parse(fs.readFileSync(abs(metaPath), 'utf8'));
    if (!meta.catalogId) { errors.push(`${f}: no catalogId`); continue; }
    // Paths in meta.json are relative to the app. Some metas say `file`, the schema `tsxFile`.
    const tsx = meta.implementation?.tsxFile ?? meta.implementation?.file;
    if (!tsx) { errors.push(`${f}: no implementation.tsxFile`); continue; }
    componentItem({
      id: meta.catalogId,
      name: meta.name,
      description: meta.description,
      category: meta.category,
      tsx: path.join(CONFIG.app, tsx).split(path.sep).join('/'),
      storyFile: meta.storybook?.file && path.join(CONFIG.app, meta.storybook.file).split(path.sep).join('/'),
      exports: meta.implementation?.exports ?? [],
      props: Object.values(meta.variants ?? {}).filter((v) => v.reactProp).map((v) => ({
        prop: v.reactProp,
        values: v.reactValues ? [...new Set(Object.values(v.reactValues).map(String))] : v.values,
        default: v.reactValues?.[v.default] ?? v.default,
      })),
      extra: { meta: metaPath },
    });
  }
}

for (const e of source.entries) {
  if (e.type === 'component') {
    if (CONFIG.metaDir) { errors.push(`${e.id}: components come from meta.json when metaDir is set`); continue; }
    componentItem({ id: e.id, name: e.name, description: e.description, tsx: e.files[0], storyFile: e.storyFile, exports: e.exports ?? [], props: e.props ?? [], status: e.status, extra: e.note ? { note: e.note } : {} });
    continue;
  }
  for (const f of e.files) if (!fs.existsSync(abs(f))) errors.push(`${e.id}: file not found ${f}`);
  if (!statuses[e.status]) errors.push(`${e.id}: unknown status ${e.status}`);
  // A template's `files` is its canonical example page, not something imported; its users are its examples.
  const imported = e.exports ? modulesUsing(e.files, e.exports) : [];
  const fromExamples = (e.examples ?? [])
    .map((r) => r.replace(/^\//, '').split('/'))
    .map((segs) => segs[CONFIG.modulesDir.replace(new RegExp(`^${CONFIG.aliasRoot}/app/?`), '').split('/').filter(Boolean).length])
    .filter(Boolean);
  items.push({
    ...e,
    layer: CONFIG.products[e.id.split('-')[0]],
    import: e.exports ? importPath(e.files[0]) : undefined,
    usedIn: [...new Set([...imported, ...fromExamples])].sort(),
  });
}

// ── Integrity ────────────────────────────────────────────────────────────────
const ids = new Map();
for (const it of items) {
  if (!idRe.test(it.id)) errors.push(`bad ID format: ${it.id} (expected ${idRe.source})`);
  if (ids.has(it.id)) errors.push(`duplicate ID: ${it.id}`);
  if (!statuses[it.status]) errors.push(`${it.id}: unknown status ${it.status}`);
  ids.set(it.id, it);
}
for (const it of items) for (const u of it.uses ?? []) if (!ids.has(u)) errors.push(`${it.id}: uses unknown ID ${u}`);
for (const it of items) if (it.replacedBy && !ids.has(it.replacedBy)) errors.push(`${it.id}: replacedBy unknown ID ${it.replacedBy}`);

for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  console.error('✗ catalog not built:\n  ' + errors.join('\n  '));
  process.exit(1);
}

const order = { layout: 0, template: 1, pattern: 2, component: 3 };
items.sort((a, b) => order[a.type] - order[b.type] || a.id.localeCompare(b.id));
const catalog = {
  $comment: `GENERATED by ${rel(fileURLToPath(import.meta.url))}. Do not edit.`,
  idFormat: `{product}-{type}-{name} · product: ${Object.entries(CONFIG.products).map(([k, v]) => `${k} (${v})`).join(' | ')} · type: cmp component | pat pattern | lay layout | tpl template · a story follows #, e.g. ${items.find((i) => i.type === 'component')?.id ?? 'xxx-cmp-button'}#secondary`,
  statuses,
  counts: Object.fromEntries(Object.keys(order).map((t) => [t, items.filter((i) => i.type === t).length])),
  items,
};

const storyItems = items.filter((i) => i.type === 'component');
const ts = [
  `// GENERATED by ${rel(fileURLToPath(import.meta.url))}. Do not edit.`,
  '// Story modules keyed by catalog ID, so the catalog renders the same stories Storybook does.',
  ...storyItems.map((it, n) => `import * as s${n} from "${importPath(it.files[1])}";`),
  '',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any',
  'export const storyModules: Record<string, Record<string, any>> = {',
  ...storyItems.map((it, n) => `  "${it.id}": s${n},`),
  '};',
  '',
].join('\n');

let stale = 0;
for (const [file, content] of [
  [abs(path.join(CONFIG.outDir, 'catalog.json')), JSON.stringify(catalog, null, 2) + '\n'],
  [abs(path.join(CONFIG.outDir, 'stories.generated.ts')), ts],
]) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) continue;
  stale++;
  if (check) { console.error(`✗ stale: ${rel(file)}. Run node ${rel(fileURLToPath(import.meta.url))}`); continue; }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`wrote ${rel(file)}`);
}
if (check && stale) process.exit(1);
console.log(`✓ catalog: ${items.length} items (${Object.entries(catalog.counts).map(([k, v]) => `${v} ${k}`).join(', ')})${stale ? '' : ', up to date'}`);
