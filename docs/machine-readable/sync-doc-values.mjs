/**
 * sync-doc-values.mjs — make restated px values in the docs derived, not authored.
 *
 * Component specs name a token and then restate its value as a convenience:
 *
 *     padding (all sides): spacing/component/lg (16px)
 *     | Radius | `radius/lg` | 8px |
 *
 * The token name is correct forever. The number in brackets is a hand-typed snapshot
 * that goes stale the moment a primitive changes — and a re-theme changes primitives
 * by definition, so one edit can invalidate every restatement in the system at once.
 * That is the single largest source of doc drift during a re-skin.
 *
 * This script rewrites those numbers from tokens/*.json so they stop being something
 * anyone maintains. It edits the existing specs in place; it creates no documents and
 * deletes nothing.
 *
 * Run:
 *   node "Machine Readable/sync-doc-values.mjs"           # dry run — shows what would change
 *   node "Machine Readable/sync-doc-values.mjs" --write   # apply
 *
 * Run it after ANY token value change, before committing. `drift-check.mjs` then
 * verifies the result, so the two together make this class of drift structurally
 * impossible rather than merely detectable.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', '..');   // this script lives at docs/machine-readable/
const WRITE = process.argv.includes('--write');

// ── Build the token lookup ───────────────────────────────────────────────────
// Primitives hold raw values; semantics alias them ({spacing.4}). Resolve through.

const flat = {};
for (const file of ['primitives.tokens.json', 'semantics.tokens.json']) {
  const p = path.join(root, 'tokens', file);
  if (!fs.existsSync(p)) continue;
  const json = JSON.parse(fs.readFileSync(p, 'utf8'));
  (function walk(node, trail = []) {
    for (const [k, v] of Object.entries(node)) {
      if (v && v.$value !== undefined) flat[trail.concat(k).join('/')] = String(v.$value);
      else if (v && typeof v === 'object') walk(v, trail.concat(k));
    }
  })(json);
}

/** Resolve a token name to its numeric px value, following {alias.chains}. */
function resolve(name) {
  let v = flat[name];
  let guard = 0;
  while (v && /^\{.*\}$/.test(v) && guard++ < 10) {
    v = flat[v.replace(/[{}]/g, '').replace(/\./g, '/')];
  }
  if (v === undefined) return null;
  const m = String(v).match(/^(\d+(?:\.\d+)?)(px)?$/);
  return m ? m[1] : null;
}

// ── The two restatement shapes ───────────────────────────────────────────────
// Only dimensional tokens. Colours are already named-only in these specs.

const GROUPS = '(?:radius|spacing|font-size)';
const PATTERNS = [
  // spacing/component/lg (16px)   ·   `radius/lg` (8px)
  { name: 'parenthetical', re: new RegExp(`(${GROUPS}\\/[a-z0-9\\/-]+\`?\\s*\\()(\\d+)(px\\))`, 'gi') },
  // | `radius/lg` | 8px |
  { name: 'table cell',    re: new RegExp(`(\\|\\s*\`${GROUPS}\\/[a-z0-9\\/-]+\`\\s*\\|\\s*)(\\d+)(px\\s*\\|)`, 'gi') },
];

/** Pull the token name back out of a matched fragment. */
const tokenIn = (s) => (s.match(new RegExp(`${GROUPS}\\/[a-z0-9\\/-]+`, 'i')) || [])[0];

// ── Sweep the specs ──────────────────────────────────────────────────────────

// Every doc that restates a dimensional token, not just the component specs — the
// ruleset, the skills and the tracking files carry the same liability. accura-theme.md
// is deliberately excluded: it is the values file, so stating values IS its job.
const SCAN_DIRS = ['docs/component-specs', 'docs/skills', 'docs/machine-readable', 'docs/tracking'];
const SCAN_FILES = ['docs/design-system-rules.md', 'docs/content-guidelines.md', 'llms.txt'];

// ── Exclusions — files where a stale-LOOKING value is correct ────────────────
// Three categories, all of which must NOT be rewritten:
//   1. Vendored upstream docs whose body deliberately holds the other system's values,
//      corrected by an override header at the top (SKIP list below).
//   2. Prose quoting a stale value as an EXAMPLE of drift (per-line IGNORE_MARK).
//   3. Changelogs and any dated record — a past entry describing a past state is
//      correct as written. Retro-editing it falsifies history. CHANGELOG.md is
//      deliberately absent from SCAN_DIRS/SCAN_FILES; do not add it.
// Rewriting any of these is a corruption, not a fix.
const SKIP = [
  // Vendored Agentic ruleset. Its body deliberately holds Agentic's values, and the
  // override table at the top reads "this file says radius/base = 8px → Accura uses
  // 12px". Rewrite the body and the header ends up correcting a value that no longer
  // exists there.
  'docs/design-system-rules.md',
];

// For one-off lines inside an otherwise-syncable file — e.g. prose that quotes a stale
// value as an EXAMPLE of drift. Put the marker anywhere on the line:
//     | Restated value | `radius: radius/lg (8px)` | <!-- sync-doc-values:ignore -->
const IGNORE_MARK = 'sync-doc-values:ignore';

const files = [];
for (const d of SCAN_DIRS) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.md')) files.push(path.join(d, f));
}
for (const f of SCAN_FILES) if (fs.existsSync(path.join(root, f))) files.push(f);

const skipped = files.filter((f) => SKIP.includes(f));
const scanned = files.filter((f) => !SKIP.includes(f));

let checked = 0, corrected = 0, unknown = 0, filesTouched = 0, ignored = 0;
const changes = [];

for (const file of scanned) {
  const full = path.join(root, file);
  const before = fs.readFileSync(full, 'utf8');
  // Line by line, so a single ignore-marked line can opt out without excluding the file.
  const after = before.split('\n').map((line) => {
    if (line.includes(IGNORE_MARK)) { ignored++; return line; }
    let out = line;
    for (const { re } of PATTERNS) {
      out = out.replace(re, (match, head, written, tail) => {
        const token = tokenIn(head);
        const actual = resolve(token);
        if (actual === null) { unknown++; return match; }   // not a token we own
        checked++;
        if (actual === written) return match;
        corrected++;
        changes.push(`  ${file}: ${token}  ${written}px → ${actual}px`);
        return head + actual + tail;
      });
    }
    return out;
  }).join('\n');

  if (after !== before) {
    filesTouched++;
    if (WRITE) fs.writeFileSync(full, after);
  }
}

// ── Report ───────────────────────────────────────────────────────────────────

console.log(`${WRITE ? 'APPLIED' : 'DRY RUN — nothing written'}\n`);
console.log(`  restatements found and verified : ${checked}`);
console.log(`  already correct                 : ${checked - corrected}`);
console.log(`  ${WRITE ? 'corrected' : 'would correct'}                      : ${corrected}`);
if (unknown) console.log(`  skipped (no such token)         : ${unknown}`);
if (ignored) console.log(`  lines with an ignore marker     : ${ignored}`);
if (skipped.length) console.log(`  files excluded by SKIP          : ${skipped.join(', ')}`);
console.log(`  files ${WRITE ? 'written' : 'affected'}                  : ${filesTouched}`);
if (changes.length) console.log('\n' + changes.join('\n'));
if (!WRITE && corrected) console.log('\nRe-run with --write to apply.');

process.exit(0);
