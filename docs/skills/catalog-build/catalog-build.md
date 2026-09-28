---
name: catalog-build
description: Build a /catalog page for a design system or product prototype. Every layout, template, pattern and component rendered live, with a status badge and a permanent ID the user can copy and give to an agent. Use when the user asks for a catalog, a component/pattern overview, "a place to see my components and templates", status badges per module, or IDs to reference patterns by. Next.js App Router + Storybook CSF3 projects.
---

# Catalog build — every component, pattern and template, with an ID

**What the user gets:** one page (`/catalog`) listing everything the product has, rendered live,
each with a status badge and a **Copy ID** button. They say "use `acc-tpl-record-list` with
`agt-cmp-badge#success`" and the agent knows exactly which files, import and story that means.

**Reference build:** Accura, 2026-09-28. `accura-ui/src/app/catalog/` and
`docs/machine-readable/build-catalog.mjs` are the working original. Every template here was
copied from it, and `templates/build-catalog.mjs` reproduces Accura's `catalog.json` exactly.

**What this is not.** Storybook stays: it is where components are built and verified. The catalog
is the overview for choosing. It renders the *same* stories, so the two cannot drift apart.

---

## 0. Fit check: read before promising anything

| Needs | Check | If not |
|---|---|---|
| Next.js App Router | `src/app/` exists | Page templates need porting; the build script still works |
| Storybook CSF3 stories that import **only types** from Storybook | `grep -h "^import" src/stories/*.tsx \| grep storybook` shows only `import type` | A story importing runtime Storybook code (`fn`, `expect`) will not render outside Storybook. Render that one from a pattern preview instead |
| shadcn-style `@/components/ui` | `components.json` | Replace Badge/Button/Select/Sheet/Tabs imports in `catalog-view.tsx` |
| Token names | the project's `tokens.css` | Every `var(--…)` in `catalog-view.tsx` is Agentic-family. Map each one. **An unknown var() fails silently** |

Agentic, Accura and Enpath all pass all four as-is.

## 1. Decide with the user first (plan, then wait for approval)

Do not start building until these are answered. Offer the defaults.

1. **ID prefixes.** `{product}-{type}-{name}`. One prefix for the upstream shell it was themed from
   (`agt`), one for the product (`acc`, `enp`). Types: `cmp` component · `pat` pattern ·
   `lay` layout · `tpl` template. A story follows `#`: `agt-cmp-badge#success`.
2. **Status values.** Default: `draft` / `in-review` / `stable` / `deprecated`. Components take
   status from the project's Storybook status table if one exists; `stable` = verified there.
3. **Modules.** The folder whose subfolders are the product's modules (e.g. `app/prototype/accura/`).
4. **Templates.** List the page types that repeat across modules (list, detail, create/edit,
   settings, dashboard) and confirm the list.
5. **Local only, or deployed?** Deploying makes it public unless protected. See §9.

## 2. Inventory: read the code, not the docs

- **Components:** `components/ui/*.tsx`, each with its story.
- **Patterns:** shared compositions *outside* `components/ui`. Grep the whole prototype for the
  nouns (`audit`, `signature`, `status`, `empty`, `pagination`). A pattern that lives as a private
  helper inside one page cannot get an ID until it is extracted: flag it, do not register a
  function nothing can import.
- **Templates:** one representative route per page type, plus the other routes of that type as
  examples.
- **Layouts:** the shell (sidebar, header) every page sits in.

Write down what you find that contradicts the docs. The import scan in step 4 will surface more.

## 3. Give every item an ID

**Project has `*.meta.json`:** add `catalogId` after `name`. Round-trip first to prove the
formatting survives, so the diff is one line per file:

```bash
node -e 'const fs=require("fs");for(const f of fs.readdirSync(".")){const s=fs.readFileSync(f,"utf8");
if(JSON.stringify(JSON.parse(s),null,2)+"\n"!==s)console.log("differs",f)}'   # must print nothing
```

Then insert the key (inherited components `agt-`, ones written in this product `acc-`), and add
`"catalogId"` to the project's meta template so new components get one.

**No metadata:** list components in the entries file instead, one entry each, with `"type": "component"`, `files: [tsx]`, `storyFile`, `exports`, `status`.

**Patterns, layouts, templates:** copy `templates/catalog-entries.json` to
`docs/machine-readable/catalog-entries.json` and replace the examples. Per entry:

- `files`: real paths from the repo root. `exports`: the names a caller imports. **Required when
  several patterns share one file**, or each gets credited with every module importing that file.
- `preview`: the route a template or layout card renders. Pick one that actually uses the pattern.
- `note`: say the uncomfortable thing ("documented as the master, imported by no module").
  It shows on the card.
- `status`: honest. Nothing is `stable` unless someone verified it in the browser.

## 4. The build script

Copy `templates/build-catalog.mjs` to `docs/machine-readable/build-catalog.mjs`. Edit **only
CONFIG**: app folder, metaDir (or `null`), entries file, status table (or `null`) and its column
indexes, modules folder, prefixes, output folder, `@/` root. Run it.

- It fails loudly on missing files, bad or duplicate IDs, unknown statuses, and `uses` or `replacedBy` pointing
  at IDs that do not exist.
- It warns on a component missing from the status table. That is a finding about the tracking
  doc: report it, do not edit the doc unasked.
- **Read the `usedIn` column before trusting it.** An empty one on a documented pattern means no
  module imports it. On Accura that was `PhaseGateStepper`, the documented master. Write it into
  the entry's `note`.

Outputs: `<app>/src/app/catalog/catalog.json` (the index agents read) and
`stories.generated.ts` (story modules keyed by ID). Both generated, both committed.

## 5. The page

Copy `templates/app-catalog/*` to `<app>/src/app/catalog/`, then resolve every `ADAPT:`
(`grep -rn ADAPT`): product name, module labels, route prefix, Badge variants and `shape`,
Shell/Local names, Storybook port, token names.

What each file does:

| File | Role |
|---|---|
| `page.tsx` | route + tab title |
| `catalog-view.tsx` | filters (search, layer, module, status, type tabs), cards, Copy ID, details sheet |
| `story-preview.tsx` | renders a CSF story without Storybook: meta + story args, render, decorators in Storybook's order, through one static `Layer` component (creating components during render fails the React lint) |
| `pattern-previews.tsx` | sample props for patterns that have no story, keyed by ID |
| `catalog-types.ts` | types for catalog.json, labels, the `id#story` rule (Default story = bare ID) |

## 6. Pattern previews

One entry per renderable pattern in `pattern-previews.tsx`: the real component, sample data from
the product's own domain. Overlays render their trigger, with `open` held in state. Hooks go in a small
wrapper component. Page-wide pieces get `w-max shrink-0` so they scroll instead of wrapping.
Hooks with nothing to show get no entry; the card says "Behaviour only".

## 7. Agent rule and docs

- **`CLAUDE.md`**, a section *Catalog IDs*: when the user names an ID, look it up in
  `catalog.json` and use exactly that item. Never substitute something similar. Say so if it is
  `draft`, `deprecated` or has a `note`. An unknown ID is an error to report. New items get an ID
  when added, then rerun the script. IDs are permanent.
- Add the catalog to the *what else has to change* table: a component or pattern change also
  needs `build-catalog.mjs --check`.
- **`llms.txt`**: a *Catalog* section pointing at `catalog.json` first.
- **README** table row, **CHANGELOG** entry (it affects everyone: new field in every meta.json).

## 8. Verify: numbers, not impressions

| Gate | Command | Blind to |
|---|---|---|
| Index fresh | `node docs/machine-readable/build-catalog.mjs --check` | whether statuses are true |
| Types + lint | `npx tsc --noEmit -p .` · `npx eslint src/app/catalog` | rendering |
| Renders | `node docs/skills/catalog-build/templates/verify-catalog.mjs <app> <url> <shot-dir>`: cards, failed stories, errors, overflow, Copy ID round-trip, screenshots | visual quality, so **look at the screenshots** |
| Production build | stop dev, `npx next build` | runtime |

**Plant a failure before trusting a green gate**: point a `uses` at a missing ID and append a byte
to `stories.generated.ts`; `--check` must exit 1 on both.

**Always run the production build.** Importing the stories puts every story file under
`next build`'s type check for the first time. On Accura, 25 errors in 6 story files broke a build
that had passed the day before. Build once with `src/app/catalog` moved aside: if that passes, the
catalog exposed them. Fix the stories, do not switch type checking off:

- Render-only stories on a component with required props: `type Story = StoryObj<typeof Component>`
  instead of `StoryObj<typeof meta>`. No rendered change.
- A story exported under a global's name (`export const Promise`) shadows the global inside its own
  render: it threw on click. Use `globalThis.Promise`.
- A type error can be a real bug. Accura's `Avatar` took no children, so `<AvatarFallback>` in two
  stories never rendered. Read each one before silencing it.

## 9. Tab icon and deployment

**Icon:** Next file convention. `src/app/icon.png` (512², the product mark alone: a wordmark is
unreadable at 16px) plus a matching `favicon.ico`. Replace the default `favicon.ico` too, or
browsers that prefer it keep showing Next's triangle.

```python
# from the white logo PNG: crop the mark by alpha bbox, centre at 64% on a rounded square
# in the colour the logo sits on in the app (Accura: --color-sidebar-background)
icon.save('src/app/icon.png'); icon.save('src/app/favicon.ico', sizes=[(16,16),(32,32),(48,48)])
```

**Deploy as its own site from the same repo.** Do not split it into another repo: it renders the
real components, and a copy drifts. Add a switch to `src/app/page.tsx`:

```tsx
export default function RootPage() {
  redirect(process.env.CATALOG_SITE === "1" ? "/catalog" : "/<home route>")
}
```

Then on Vercel: **Add New → Project →** the same repo · Root Directory = the app folder ·
env `CATALOG_SITE=1`. The prototype routes stay reachable there: template previews load them.

- **Branch previews are private** (Vercel Authentication). To publish without merging, set the
  catalog project's **Settings → Git → Production Branch** to the catalog branch.
- Storybook links show only in development, or when `NEXT_PUBLIC_STORYBOOK_URL` names a deployed
  Storybook. Never ship links to localhost.
- The catalog lives at `/catalog`, beside the app, not under a module route. Tell the user the exact URL.

## 10. Traps that each cost a round on Accura

- **Stale dev server.** Next served old output after edits twice. After changing the
  catalog: `pkill -f "next dev"`, `rm -rf .next`, restart, *then* screenshot. Never `next build`
  under a running dev server.
- **Template iframes are blank on first load.** Each route compiles on first request. Wait ~15s
  before judging.
- **Fixed-position stories escape the card** (sidebars, overlays). The preview box has
  `[transform:translateZ(0)]`, which makes it their containing block. Full-screen stories render at
  200% and scale to 50%.
- **Centred content wider than the card is cut on both sides.** Use `items-center-safe
  justify-center-safe` (Tailwind 4).
- **A flex item with `w-max` still shrinks.** Add `shrink-0`.
- **Status badge wraps under a long ID.** `shrink-0 whitespace-nowrap`.
- **A Radix Select with many stories scrolls.** Test scripts choose by keyboard, not by clicking an
  option.
- **Someone else may be in the same checkout.** Before committing, `git branch --show-current`.
  Stage your own files by name, never `git add -A`. A file with someone else's uncommitted edit
  plus yours: stage only your hunk (`git hash-object -w` a HEAD copy with your change, then
  `git update-index --cacheinfo`).

## 11. Keeping it true

Rerun `build-catalog.mjs` after adding or renaming a component, story, pattern or template, and
commit its outputs with the change. Statuses move when the status table moves; the page never holds
any. An item is never deleted from the catalog: it becomes `deprecated` with a `replacedBy`.
