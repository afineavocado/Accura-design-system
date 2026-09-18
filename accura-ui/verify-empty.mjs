import { chromium } from "playwright-core";
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const base = "http://localhost:3001/prototype/accura";
const targets = [
  ["Change Control", "/change-control"], ["Deviations", "/deviations"],
  ["CAPA", "/capa"], ["Documents", "/documents"],
  ["Training · Users", "/training"], ["Training · Roles", "/training/roles"],
  ["Training · Courses", "/training/courses"], ["Training · Assessments", "/training/assessments"],
  ["Training · Review", "/training/review"], ["Knowledge Hub folder", "/knowledge-hub"],
  ["Settings · lookup", "/settings"],
];
const rows = [];
for (const [name, path] of targets) {
  await p.goto(base + path, { waitUntil: "networkidle", timeout: 120000 });
  if (path === "/knowledge-hub") {
    const l = await p.$("a[href*='/knowledge-hub/']");
    if (l) { await l.click(); await p.waitForLoadState("networkidle"); }
  }
  const box = await p.$("input[type=search], input[placeholder*='Search'], input[placeholder*='search']");
  if (!box) { rows.push({ screen: name, note: "no search box" }); continue; }
  await box.fill("zzzzznope");
  await p.waitForTimeout(800);
  rows.push(await p.evaluate((n) => {
    const t = document.querySelector("table");
    const title = [...document.querySelectorAll("p")].find(e => /^No .* found$|^Nothing awaiting/.test(e.textContent.trim()));
    const block = title?.closest("div")?.parentElement;
    const svg = block?.querySelector("svg");
    const ir = svg?.getBoundingClientRect();
    const br = block?.getBoundingClientRect();
    const btn = [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "Clear filters");
    const pag = [...document.querySelectorAll("*")].some(e => /Rows per page/i.test(e.textContent) && e.children.length < 6);
    return { screen: n, tableHidden: !t || !t.offsetParent, title: title?.textContent.trim() ?? "—",
             icon: ir ? `${ir.width}×${ir.height}` : "—", h: br ? Math.round(br.height) : null,
             clearBtn: !!btn, paginationShown: pag };
  }, name));
}
console.table(rows);
await b.close();
