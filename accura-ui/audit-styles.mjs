/**
 * Enumerate every distinct text style actually rendered, with a sample and a
 * count, across any number of pages side by side.
 *
 *   node audit-styles.mjs http://localhost:3001/a http://localhost:3001/b
 *
 * Why this exists: an audit that measures the properties you thought to check
 * can only confirm the things you thought of. A hand-written one passed this
 * listing while its description column rendered at font-weight 500 and every
 * sibling used 400 — the property was never on the list, and `font-medium` is
 * a real utility, so a grep for hardcoded values could not see it either.
 *
 * Nothing is chosen in advance here. If a size, weight or colour is on screen
 * it appears in the output, and "⚠ only here" marks a style that exists in one
 * page and none of the others — which is usually either a deliberate feature
 * of that screen or a mistake, and the sample column tells you which.
 */
import { chromium } from 'playwright';

const [,, ...urls] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewportSize: { width: 1500, height: 1400 } });

const styles = async (url) => {
  await p.goto(url, { waitUntil: 'networkidle' });
  return p.evaluate(() => {
    const seen = new Map();
    const root = document.querySelector('table')?.closest('section, main, body') || document.body;
    for (const el of root.querySelectorAll('*')) {
      const text = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (!text) continue;
      const cs = getComputedStyle(el);
      const key = `${cs.fontSize}/${cs.fontWeight} ${cs.color}`;
      if (!seen.has(key)) seen.set(key, { n: 0, eg: text.slice(0, 28) });
      seen.get(key).n++;
    }
    return [...seen].map(([k, v]) => ({ style: k, count: v.n, sample: v.eg }))
      .sort((a, b) => b.count - a.count);
  });
};

const all = [];
for (const u of urls) all.push([u.split('/').pop(), await styles(u)]);

const keys = [...new Set(all.flatMap(([, s]) => s.map(x => x.style)))].sort();
const name = (u) => u.padEnd(12);
console.log('\nstyle'.padEnd(34) + all.map(([n]) => name(n)).join('') + 'sample');
for (const k of keys) {
  const counts = all.map(([, s]) => String(s.find(x => x.style === k)?.count ?? '·'));
  const present = counts.filter(c => c !== '·').length;
  const flag = present === 1 && all.length > 1 ? '  ⚠ only here' : '';
  const sample = all.flatMap(([, s]) => s).find(x => x.style === k)?.sample ?? '';
  console.log(k.padEnd(34) + counts.map(c => c.padEnd(12)).join('') + sample + flag);
}
await b.close();
