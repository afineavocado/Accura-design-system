/**
 * drift-check.mjs — detect docs/token drift across the design system.
 *
 * Run:  node docs/machine-readable/drift-check.mjs   (from the repo root)
 *
 * Checks (drift = a doc restates a fact owned authoritatively elsewhere):
 *   1. llms.txt — every referenced file path resolves
 *   2. Component count — doc claims ("N components") match actual meta.json count
 *   3. accura-theme.md — every hex value exists in primitives.tokens.json
 *   4. Figma Dark mode ↔ tokens.css .dark block  (only if figma-cli is connected)
 *   5. Storybook stories — every story file has a matching meta.json (catches undocumented components)
 *   6. Docs — px values restated beside a token name still match that token
 *
 * Exit code 1 if any drift is found (so CI can gate on it).
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', '..');        // repo root — this script lives at docs/machine-readable/
let problems = 0;
const ok = (m) => console.log('  ✓ ' + m);
const bad = (m) => { console.log('  ✗ ' + m); problems++; };
const section = (t) => console.log('\n' + t);

// ── 1. llms.txt referenced paths resolve ─────────────────────────────────────
section('1. llms.txt — referenced paths exist');
const llms = fs.readFileSync(path.join(root, 'llms.txt'), 'utf8');
const ticks = [...llms.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
// Only check directory paths (contain "/") with a file extension or trailing slash —
// these are the drift-prone references (folder renames/deletions). Bare filenames and
// story titles are skipped.
const looksLikePath = (s) => !s.includes('\n') && s.includes('/') && (/\.(md|json|tsx?|css|mjs|txt|html)$/.test(s) || /\/$/.test(s));
const skipIt = (s) =>
  /[\[\]*<>]/.test(s) || s.includes('...') || /^https?:/.test(s) ||
  /^(Screens|UI Template)\//.test(s);   // story titles + the external (out-of-repo) UI Template catalog
const paths = [...new Set(ticks.filter((s) => looksLikePath(s) && !skipIt(s)))];
let miss = 0;
for (const p of paths) if (!fs.existsSync(path.join(root, p))) { bad(`dead path: ${p}`); miss++; }
if (miss === 0) ok(`${paths.length} referenced paths all resolve`);

// ── 2. Component count: doc claims vs meta.json files ────────────────────────
section('2. Component count — docs vs meta.json files');
const metaDir = path.join(root, 'docs/machine-readable/artifacts/components');
const metaCount = fs.readdirSync(metaDir).filter((f) => f.endsWith('.meta.json')).length;
// Require plural "components" so "44 component tokens" doesn't match as a component count.
const claims = [...new Set([...llms.matchAll(/(\d+)\s+(?:documented\s+)?components\b/gi)].map((m) => +m[1]))];
const wrong = claims.filter((c) => c !== metaCount);
if (wrong.length === 0) ok(`meta.json count ${metaCount} matches doc claim(s): ${claims.join(', ') || 'none'}`);
else bad(`meta.json count is ${metaCount} but docs claim: ${wrong.join(', ')}`);

// ── 3. accura-theme.md hexes exist in primitives ─────────────────────────────
section('3. accura-theme.md — hex values exist in primitives.tokens.json');
const theme = fs.readFileSync(path.join(root, 'accura-theme.md'), 'utf8');
const prim = fs.readFileSync(path.join(root, 'tokens/primitives.tokens.json'), 'utf8').toLowerCase();
const hexes = [...new Set([...theme.matchAll(/#[0-9a-f]{6}/gi)].map((m) => m[0].toLowerCase()))];
const orphans = hexes.filter((h) => !prim.includes(h));
if (orphans.length === 0) ok(`all ${hexes.length} theme hexes found in primitives`);
else orphans.forEach((h) => bad(`theme hex ${h} not in primitives.tokens.json`));

// ── 4. Figma Dark mode ↔ tokens.css .dark  (optional — needs figma-cli) ──────
section('4. Figma Dark mode ↔ tokens.css .dark block (needs figma-cli)');
const figmaCli = path.join(os.homedir(), 'figma-cli', 'src', 'index.js');
const evalCode = `
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const sem = cols.find(c=>c.name==="Semantics"), comp = cols.find(c=>c.name==="Components");
if(!sem) return "NO_SEMANTICS";
const lm = sem.modes.find(m=>m.name==="Light").modeId, dm = sem.modes.find(m=>m.name==="Dark").modeId;
const all = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(all.map(v=>[v.id,v]));
const hx=x=>Math.round(x*255).toString(16).padStart(2,"0"); const toHex=c=>"#"+hx(c.r)+hx(c.g)+hx(c.b);
function res(val,mode){let v=val,g=0;while(v&&v.type==="VARIABLE_ALIAS"&&g++<12){const t=byId[v.id];if(!t)return "?";const mid=(t.valuesByMode[mode]!==undefined)?mode:Object.keys(t.valuesByMode)[0];v=t.valuesByMode[mid];}return (v&&v.r!==undefined)?toHex(v):"?";}
const out=[];
for(const id of sem.variableIds){const v=byId[id];if(v.resolvedType!=="COLOR")continue;out.push(v.name+"|"+res(v.valuesByMode[lm],lm)+"|"+res(v.valuesByMode[dm],dm));}
for(const id of comp.variableIds){const v=byId[id];if(v.resolvedType!=="COLOR")continue;const own=v.valuesByMode[Object.keys(v.valuesByMode)[0]];out.push(v.name+"|"+res(own,lm)+"|"+res(own,dm));}
return out.join("\\n");
`;
try {
  const raw = execFileSync('node', [figmaCli, 'eval', evalCode], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  if (/Not connected|fetch failed|NO_SEMANTICS/.test(raw)) throw new Error('not connected');
  const rows = raw.split('\n').filter((l) => l.includes('|')).map((l) => l.split('|'));
  // Parse tokens.css :root + .dark
  const css = fs.readFileSync(path.join(root, 'accura-ui/src/app/tokens.css'), 'utf8');
  const di = css.indexOf('.dark');
  const parse = (t) => { const m = {}; const re = /--([\w-]+):\s*([^;]+);/g; let x; while ((x = re.exec(t))) m['--' + x[1]] = x[2].trim().toLowerCase(); return m; };
  const rootMap = parse(css.slice(0, di)), darkMap = parse(css.slice(di));
  let mismatch = 0;
  for (const [name, , fdark] of rows) {
    const v = '--' + name.replace(/\//g, '-');
    const cssLight = rootMap[v];
    if (cssLight === undefined) continue;
    const effDark = darkMap[v] !== undefined ? darkMap[v] : cssLight;
    if (fdark.toLowerCase() !== effDark) { bad(`${name}: figma=${fdark} css=${effDark}`); mismatch++; }
  }
  if (mismatch === 0) ok(`all ${rows.length} dark color tokens match Figma`);
} catch {
  console.log('  — SKIPPED: figma-cli not connected. Connect (cd ~/figma-cli && node src/index.js connect --safe) and re-run.');
}

// ── 5. Storybook stories ↔ meta.json (catch undocumented components) ──────────
section('5. Storybook stories — every story is owned by a meta.json');
const storiesDir = path.join(root, 'accura-ui/src/stories');
// Authoritative link: each meta.json declares the story file it owns via storybook.file.
// Match on that (by basename) rather than guessing from filenames — a meta named
// a meta named e.g. radio-group.meta.json legitimately owns RadioGroup.stories.tsx.
const ownedStories = new Set();
for (const f of fs.readdirSync(metaDir).filter((f) => f.endsWith('.meta.json'))) {
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(metaDir, f), 'utf8'));
    const file = meta?.storybook?.file;
    if (file) ownedStories.add(path.basename(file));
  } catch { bad(`meta.json unreadable: ${f}`); }
}
// Top-level only — screens/ live in a subfolder and are prototypes, not components.
const storyFiles = fs.existsSync(storiesDir)
  ? fs.readdirSync(storiesDir).filter((f) => f.endsWith('.stories.tsx'))
  : [];
let undoc = 0;
for (const f of storyFiles) {
  if (!ownedStories.has(f)) { bad(`story "${f}" is not owned by any meta.json — undocumented component`); undoc++; }
}
if (undoc === 0) ok(`all ${storyFiles.length} story files are owned by a meta.json`);

// ── 6. Resolved px values restated in docs ───────────────────────────────────
// Docs name a token and restate its value as a convenience:
//   padding: spacing/component/lg (16px)   ·   | `radius/lg` | 8px |
// The name is right forever; the number is a hand-typed snapshot that goes stale the
// moment a primitive changes — which is what a re-theme does by definition.
//
// This MUST cover every doc, not just the component specs. Scoped to component-specs
// alone it checked 12 of 171 restatements — 7% — and reported green. A gate that is
// not looking is worse than no gate.
//
// Exclusions mirror sync-doc-values.mjs exactly; if they drift apart, the script will
// rewrite something this check then flags, or vice versa.
section('6. Docs — restated px values match the token they name');
{
  const SKIP = ['docs/design-system-rules.md'];   // vendored; its override table depends on the body keeping Agentic's values
  const IGNORE_MARK = 'sync-doc-values:ignore';   // per-line opt-out, e.g. prose quoting a stale value as an example

  const flatT = {};
  for (const tf of ['primitives.tokens.json', 'semantics.tokens.json']) {
    const p = path.join(root, 'tokens', tf);
    if (!fs.existsSync(p)) continue;
    (function walk(n, trail = []) {
      for (const [k, v] of Object.entries(n)) {
        if (v && v.$value !== undefined) flatT[trail.concat(k).join('/')] = String(v.$value);
        else if (v && typeof v === 'object') walk(v, trail.concat(k));
      }
    })(JSON.parse(fs.readFileSync(p, 'utf8')));
  }
  const resolveT = (name) => {
    let v = flatT[name], g = 0;
    while (v && /^\{.*\}$/.test(v) && g++ < 10) v = flatT[v.replace(/[{}]/g, '').replace(/\./g, '/')];
    const m = v === undefined ? null : String(v).match(/^(\d+(?:\.\d+)?)(px)?$/);
    return m ? m[1] : null;
  };

  const dirs = ['docs/component-specs', 'docs/skills', 'docs/machine-readable', 'docs/tracking'];
  const loose = ['docs/design-system-rules.md', 'docs/content-guidelines.md', 'llms.txt'];
  const docs = [];
  for (const d of dirs) {
    const dp = path.join(root, d);
    if (fs.existsSync(dp)) for (const fn of fs.readdirSync(dp)) if (fn.endsWith('.md')) docs.push(path.join(d, fn));
  }
  for (const fn of loose) if (fs.existsSync(path.join(root, fn))) docs.push(fn);

  const re = /((?:radius|spacing|font-size)\/[a-z0-9/-]+)`?\s*[(|]\s*(\d+)px/gi;
  let seen = 0, stale = 0, skippedLines = 0;
  for (const rel of docs) {
    if (SKIP.includes(rel)) continue;
    for (const line of fs.readFileSync(path.join(root, rel), 'utf8').split('\n')) {
      if (line.includes(IGNORE_MARK)) { skippedLines++; continue; }
      for (const m of line.matchAll(re)) {
        const actual = resolveT(m[1]);
        if (actual === null) continue;
        seen++;
        if (actual !== m[2]) { bad(`${rel}: "${m[1]}" written as ${m[2]}px but the token is ${actual}px`); stale++; }
      }
    }
  }
  if (stale === 0) ok(`${seen} restated px values all match their token` + (skippedLines ? ` (${skippedLines} ignore-marked, ${SKIP.length} file excluded)` : ''));
  else console.log('     → fix with: node docs/machine-readable/sync-doc-values.mjs --write');
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('\n' + (problems === 0 ? '✅ No drift detected.' : `❌ ${problems} drift issue(s) found.`));
process.exit(problems === 0 ? 0 : 1);
