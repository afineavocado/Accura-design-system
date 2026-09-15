#!/usr/bin/env node
/**
 * Token parity — do the exported JSON files still agree with what ships?
 *
 * `accura-ui/src/app/tokens.css` is the runtime source of truth. The DTCG JSON
 * in this folder is an export, and an export is only useful while it matches.
 * Nobody could tell whether it did without reading 350 values by hand, so this
 * does it: resolve every `{alias}` chain, compare against the `:root` block,
 * and fail on anything not in the allowlist below.
 *
 *   node tokens/token-parity.mjs
 *
 * A difference is not automatically a bug — some are deliberate. Each one in
 * KNOWN must say why, and anything else is drift that needs explaining or
 * fixing.
 */
import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(import.meta.dirname, "..");
const read = (p) => fs.readFileSync(path.join(repo, p), "utf8");

/** Differences that are expected. Anything not listed here fails the check. */
const KNOWN = {
  "color.sidebar.ring":
    "Deliberate: the export carries Agentic's blue #2b7fff; Accura's sidebar ring is green. Regenerating tokens.css from the export would revert it (CLAUDE.md, Known divergences).",
  "tooltip.bg":
    "Not a value difference — tokens.css aliases via var(--color-background-inverted) so the tooltip inverts with the theme. The export flattens it.",
  "tooltip.fg": "As tooltip.bg.",
  "breadcrumb.breadcrumb":
    "Unit formatting only: 4px in the export, unitless 4 in tokens.css.",
};

const flat = (o, trail = [], out = new Map()) => {
  for (const [k, v] of Object.entries(o)) {
    if (v && typeof v === "object" && "$value" in v)
      out.set([...trail, k].join("."), String(v.$value));
    else if (v && typeof v === "object") flat(v, [...trail, k], out);
  }
  return out;
};

const json = new Map();
for (const f of ["primitives", "semantics", "components"])
  for (const [k, v] of flat(JSON.parse(read(`tokens/${f}.tokens.json`))))
    json.set(k, v);

const resolve = (value, depth = 0) => {
  if (depth > 10) return `CYCLE(${value})`;
  const alias = /^\{(.+)\}$/.exec(value.trim());
  if (!alias) return value;
  const target = json.get(alias[1]);
  return target === undefined ? `UNRESOLVED(${alias[1]})` : resolve(target, depth + 1);
};

const css = read("accura-ui/src/app/tokens.css");
const light = css.slice(css.indexOf(":root"), css.indexOf(".dark"));
const shipped = new Map();
for (const m of light.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g))
  shipped.set(m[1], m[2].trim());

const key = (p) => p.toLowerCase().replace(/[\s_]+/g, "-").replace(/\./g, "-").replace(/-+/g, "-");
const tidy = (v) => v.replace(/\s/g, "").toLowerCase();

let compared = 0, agreed = 0;
const unexplained = [], explained = [];

for (const [dotted, raw] of json) {
  const k = key(dotted);
  const cssKey = [k, "color-" + k, "spacing-" + k].find((c) => shipped.has(c));
  if (!cssKey) continue;
  compared++;
  const exported = resolve(raw);
  const actual = shipped.get(cssKey);
  if (tidy(exported) === tidy(actual) || tidy(actual).includes(tidy(exported))) {
    agreed++;
    continue;
  }
  const line = `${dotted}\n      export ${exported}\n      ships  ${actual}`;
  (KNOWN[dotted] ? explained : unexplained).push(
    KNOWN[dotted] ? `${line}\n      why    ${KNOWN[dotted]}` : line
  );
}

console.log(`\nToken parity — tokens/*.json vs accura-ui/src/app/tokens.css\n`);
console.log(`  compared ${compared} · agree ${agreed} · known differences ${explained.length} · unexplained ${unexplained.length}`);

if (explained.length) {
  console.log(`\n  Known and accepted:`);
  explained.forEach((d) => console.log(`    • ${d}`));
}
if (unexplained.length) {
  console.log(`\n  ❌ Unexplained — the export and the shipped tokens disagree:`);
  unexplained.forEach((d) => console.log(`    ✗ ${d}`));
  console.log(`\n  Either regenerate the export, fix tokens.css, or add the token to KNOWN with a reason.`);
  process.exit(1);
}
console.log(`\n✅ The export matches what ships.\n`);
