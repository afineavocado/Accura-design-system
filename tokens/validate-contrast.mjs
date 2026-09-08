/**
 * validate-contrast.mjs
 * Checks WCAG AA contrast for every semantic bg/fg token pair.
 *
 * Usage: node validate-contrast.mjs
 *
 * WCAG AA thresholds:
 *   Normal text  → 4.5:1
 *   Large text / UI components (icons, borders) → 3:1
 */

import { readFileSync } from 'fs';

// ─── Load token files ──────────────────────────────────────────────────────────
const prims = JSON.parse(readFileSync('primitives.tokens.json', 'utf8'));
const sems  = JSON.parse(readFileSync('semantics.tokens.json',  'utf8'));

// ─── Flatten (handles mixed nodes) ────────────────────────────────────────────
function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && '$value' in v) {
      out.set(path, v['$value']);
      for (const [ck, cv] of Object.entries(v))
        if (!ck.startsWith('$') && cv && typeof cv === 'object')
          flatten({ [ck]: cv }, path, out);
    } else if (v && typeof v === 'object') {
      flatten(v, path, out);
    }
  }
  return out;
}
const primMap = flatten(prims);
const semMap  = flatten(sems);

// ─── Resolve alias chain to hex ───────────────────────────────────────────────
function resolve(val, depth = 0) {
  if (depth > 10 || typeof val !== 'string') return val;
  const m = val.match(/^\{(.+)\}$/);
  if (!m) return val;
  return resolve(primMap.get(m[1]) ?? semMap.get(m[1]) ?? val, depth + 1);
}

// ─── WCAG contrast maths ──────────────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
function linearise(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(linearise);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(hex1, hex2) {
  const l1 = luminance(hex1), l2 = luminance(hex2);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

// ─── Collect pairs ────────────────────────────────────────────────────────────
const pairs = [];
for (const [path, val] of semMap) {
  // DTCG forbids a node being both token and group, so the Figma export collapses
  // `x/foreground` onto its parent as `x-foreground`. Accept both spellings.
  const isNested = path.endsWith('.foreground');
  const isFlat = path.endsWith('-foreground');
  if (!isNested && !isFlat) continue;
  const bgPath = isNested ? path.slice(0, -'.foreground'.length) : path.slice(0, -'-foreground'.length);
  const bgVal  = semMap.get(bgPath);
  if (!bgVal) continue;
  const bgHex = resolve(bgVal);
  const fgHex = resolve(val);
  if (!bgHex?.startsWith('#') || !fgHex?.startsWith('#')) continue;
  pairs.push({ bg: bgPath, fg: path, bgHex, fgHex, ratio: contrast(bgHex, fgHex) });
}

// ─── Report ───────────────────────────────────────────────────────────────────
const AA_NORMAL = 4.5;
const AA_LARGE  = 3.0;

const pass   = pairs.filter(p => p.ratio >= AA_NORMAL);
const warn   = pairs.filter(p => p.ratio >= AA_LARGE && p.ratio < AA_NORMAL);
const fail   = pairs.filter(p => p.ratio < AA_LARGE);

console.log('\n══════════════════════════════════════════════════════');
console.log('  Token Contrast Validation — WCAG AA');
console.log('══════════════════════════════════════════════════════\n');

if (fail.length) {
  console.log(`🔴  FAIL (below 3:1 — breaks UI components and large text)\n`);
  fail.forEach(p => {
    console.log(`  ${p.ratio.toFixed(2)}:1  ${p.bg}`);
    console.log(`         bg ${p.bgHex}  ·  fg ${p.fgHex}\n`);
  });
}

if (warn.length) {
  console.log(`🟡  WARN (3–4.5:1 — passes large text / UI, fails normal text)\n`);
  warn.forEach(p => {
    console.log(`  ${p.ratio.toFixed(2)}:1  ${p.bg}`);
    console.log(`         bg ${p.bgHex}  ·  fg ${p.fgHex}\n`);
  });
}

if (pass.length) {
  console.log(`✅  PASS (≥ 4.5:1 — normal text + UI)\n`);
  pass.forEach(p =>
    console.log(`  ${p.ratio.toFixed(2).padStart(5)}:1  ${p.bg}`)
  );
}

console.log('\n──────────────────────────────────────────────────────');
console.log(`  ${pairs.length} pairs checked · ${pass.length} pass · ${warn.length} warn · ${fail.length} fail`);
console.log('──────────────────────────────────────────────────────\n');

if (fail.length > 0) process.exit(1);
