#!/usr/bin/env node
/**
 * verify-catalog.mjs — loads /catalog in headless Chromium and reports numbers, not impressions.
 * Template from docs/skills/catalog-build. Needs `playwright` in the app's node_modules
 * (`npm i -D playwright && npx playwright install chromium` if it is not there).
 *
 *   node verify-catalog.mjs <app-dir> [url] [screenshot-dir]
 *   node verify-catalog.mjs accura-ui http://localhost:3001/catalog /tmp/shots
 *
 * Checks: card count, stories that failed to render, console and page errors, horizontal
 * overflow, the Copy ID button (clipboard must equal the ID shown), and saves screenshots.
 * First load compiles every template route: the wait is long on purpose.
 */
import { createRequire } from 'node:module';
import path from 'node:path';

const [appDir = '.', url = 'http://localhost:3000/catalog', shots = '.'] = process.argv.slice(2);
const require = createRequire(path.resolve(appDir, 'package.json'));
const { chromium } = require('playwright');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.grantPermissions(['clipboard-read', 'clipboard-write']);
const page = await context.newPage();
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message.slice(0, 200)));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(15000); // template iframes compile their routes on first load

const report = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('main article')];
  return {
    cards: cards.length,
    storiesFailed: cards.filter((c) => c.textContent.includes('did not render outside Storybook')).map((c) => c.id),
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
  };
});

// Copy ID on the first card with a story picker (labelled "<name> story"; a preview's own
// dropdowns must not be mistaken for it).
const picker = page.getByRole('combobox', { name: / story$/ });
const card = page.locator('main article').filter({ has: picker }).first();
if (await card.count()) {
  await card.getByRole('combobox', { name: / story$/ }).click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const shown = (await card.locator('p.font-mono').textContent())?.trim();
  await card.getByRole('button', { name: /Copy ID/ }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  report.copyId = { shown, copied, match: shown === copied };
}

await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: path.join(shots, 'catalog-top.png') });
const sections = page.locator('main > section');
for (let i = 0; i < (await sections.count()); i++)
  await sections.nth(i).screenshot({ path: path.join(shots, `catalog-section-${i}.png`) });
report.errors = [...new Set(errors)];
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(report.storiesFailed.length || report.errors.length || report.copyId?.match === false ? 1 : 0);
