# Loading — handover

| | |
|---|---|
| **From → To** | Chi → Diệp |
| **Date** | 2026-10-07 |
| **Branch** | `loading` |
| **Status** | Shared components built, documented and verified. **Not yet applied to any module** — that is the next step, module by module |
| **Rules live in** | `docs/skills/accura-prototype-build/accura-design-patterns.md` → **Loading**. This file explains the change; that section is the rule. If they ever disagree, the patterns doc wins and this file is stale |

---

## 0. In one minute

- Accura now has **one way to show loading**, for every module. Six cases: app load, page load, widget load, refresh, button action, long task.
- **One timing rule** for all of them: a loader appears only after **300ms** and, once shown, stays at least **500ms**. It lives in `@/hooks/use-delayed-loading` — never write your own timers.
- **Shared components changed**: `Button` (new `loading` prop), `Progress` (indeterminate now animates), `Skeleton` and `Toast` (reduced motion). **None of these break existing code** — section 1 shows why.
- **New**: `Spinner` (component library) and four app-level pieces — `PageBusy`, `RouteProgressBar`, `AppSplash`, `WidgetError`.
- **Your module (Training) is untouched.** Nothing changes on screen until you adopt the pieces. Section 4 is the recipe; section 5 is a prompt you can give your agent.
- To see everything working: `npm run dev` → `http://localhost:3001/prototype/accura/dashboard/loading`, pick **Slow**, click scenarios 1–6.

---

## 1. What changed in shared code — does it affect you?

| File | Change | Before → after | Breaks existing code? | You need to do |
|---|---|---|---|---|
| `components/ui/button.tsx` | New props `loading`, `loadingLabel` | No loading state → disabled at once, Spinner after 300ms, same width | **No.** `loading` defaults to `false`; a button without it renders the exact same DOM (verified: `Default` and `WithLeadingIcon` stories unchanged). 43 files import Button | Nothing. Use `loading` for new async actions instead of hand-built spinners |
| `components/ui/progress.tsx` | Indeterminate animates | `value={null}` showed an **empty** track → 40% fill sweeping the track | **No.** Determinate values render as before (measured 40 / 60 / 100%). Training uses Progress twice (`training/assessments/page.tsx`, `training/assessments/[id]/page.tsx`), both with a number | Nothing |
| `components/ui/skeleton.tsx` | `motion-reduce:animate-none` | Kept pulsing under reduced motion → stops | **No.** Only users with reduced motion on see a difference | Nothing |
| `components/ui/toast.tsx` | Loading icon is now `Spinner` | Inline `Loading02` → same icon via `Spinner`, stops under reduced motion | **No.** Same icon, size and colour | Nothing |
| `components/ui/spinner.tsx` | **New** | — | — | Use it for small "working" indicators. In buttons use `Button loading` instead |
| `app/globals.css` | `@theme` block with `--animate-progress-indeterminate` + keyframes | — | **No** | After pulling: `rm -rf .next` and restart `npm run dev`, or the sweep will not show (see §10) |
| `hooks/use-delayed-loading.ts` | **New** — `useDelayedLoading`, `useLoadPhase`, `LOADING_DELAY_MS = 300`, `LOADING_MIN_VISIBLE_MS = 500` | — | — | Use it for any loader you build |
| `components/page-busy.tsx` · `route-progress-bar.tsx` · `app-splash.tsx` · `widget-error.tsx` | **New**, app-level | — | — | Adopt per §4 |

Docs updated in the same change: specs (`Spinner.md` new; `Button.md`, `Progress.md`, `Skeleton.md`, `Toast.md`), their `.meta.json`, stories (`Spinner` new; `Button` + `Loading`/`LoadingOnClick`; `Skeleton` + `InsideCard`), `Storybook Status.md`, `llms.txt`, `README.md`, `CLAUDE.md`, `AI-Readiness.md`, `CHANGELOG.md`, and the **Loading** section of the patterns doc.

---

## 2. The pieces — what each is for

| Piece | Import | Use for | Do not use for |
|---|---|---|---|
| `Spinner` | `@/components/ui/spinner` | Small areas: input, pill, standalone in an empty area | Inside a Button (use `loading`), whole pages |
| `Button` `loading` | `@/components/ui/button` | Save / Export / Approve / any short async action | Long tasks the user can leave running |
| `Skeleton` | `@/components/ui/skeleton` | First load of a region whose layout is known | Refreshing data already on screen |
| `Progress value={null}` | `@/components/ui/progress` | Work running with no percentage | Page loads (use skeletons) |
| `PageBusy` | `@/components/page-busy` | Tab / filter / sort / reload on a page already showing data | First load, a single widget |
| `RouteProgressBar` | `@/components/route-progress-bar` | Navigation between pages — mounted once, app-wide | Anything inside a page |
| `AppSplash` | `@/components/app-splash` | Only while the session is checked, before the shell can draw | Waiting for data |
| `WidgetError` | `@/components/widget-error` | One widget failed; others are fine | Whole-page failure, empty results (use `Empty` / `ListEmptyState`) |
| `useLoadPhase` | `@/hooks/use-delayed-loading` | Swapping a skeleton for content without a flash or a jump | — |
| `toast.loading` + `Progress` | `sonner` + Progress | Long tasks (report, big upload) | Short actions |

---

## 3. The behaviour (summary — full rule in the patterns doc)

| # | Case | What the user sees |
|---|---|---|
| 1 | App load | Teal splash, logo, sweep bar, *Signing you in…* — only during the session check. Then the shell, then skeletons |
| 2 | Page load | Sidebar + header stay. 2px brand bar at the top of the window. Skeletons that match the final layout; real table headers |
| 3 | Widget load | Each widget loads alone. Failure → *Couldn't load X* + **Try again**, inside that widget only |
| 4 | Refresh | Old data stays. **All page content** (title, toolbar, tables) dims to 50% and locks. *Updating…* pill centred on the **visible** content. Sidebar + header stay sharp |
| 5 | Button action | Disabled at once. After 300ms Spinner replaces the label; **width unchanged**. Toast when done |
| 6 | Long task | Toast with a **full-width** percentage bar + *you can keep working*. **No action button until done**; then the same toast shows **Download** |

Under 300ms nothing appears at all. That is intended.

---

## 4. Applying it to a module — recipe

> **Before you start:** prototype data is mock and synchronous, so loaders never appear on their own. Whether module prototypes should *simulate* latency is an open decision (D6 in §8) — until it is settled, wire the states (so they are ready) but do not add fake delays to module screens.

**Step 1 — Buttons.** Find every async action button (submit, sign, export). Replace any hand-built "Saving…" / spinner with:

```tsx
<Button loading={isSaving} loadingLabel="Saving changes" onClick={save}>Save changes</Button>
```

**Step 2 — Refresh (`PageBusy`).** Wrap the page content **below the header**, inside the element that scrolls. `PageBusy` renders one `div`, so pass it the layout classes its children relied on (`flex flex-col gap-…`), or the spacing collapses.

| Module | Where page content renders | What scrolls | Put `PageBusy` |
|---|---|---|---|
| **Training** | `training/training-shell.tsx` — `<section … overflow-y-auto>` around `{children}` | that `<section>` | Inside the section around `{children}`, with `className="flex flex-col gap-[var(--spacing-component-lg)]"` (the section's own gap). Needs a `busy` prop on `TrainingShell`, set by the page |
| Settings | `settings/settings-shell.tsx` — `<div className="mx-auto … max-w-[960px] …">` inside the scrolling `<section>` | that `<section>` | Replace that `div` with `PageBusy`, keeping its classes. `busy` prop on the shell |
| Dashboard | `dashboard/dashboard-shell.tsx` — content column `div` (holds the greeting) | `<main>` | Replace the column `div` with `PageBusy`, keeping its classes — exactly as `dashboard/loading/demo-shell.tsx` does |
| Documents · Knowledge Hub · Deviations | `layout.tsx` renders `{children}` straight into the scrolling `<main>` | `<main>` | In each **page**, around what the page renders (the layout does not know the page's refresh state) |
| CAPA · Change Control | Each page builds its own shell; content sits in a `<section>` after the header | the `<section>` (CAPA list) or `<main>` | In each page, around the section's contents, passing the section's `flex flex-col gap-…` |

Line numbers drift — find the element by the description above, not by line.

Then hold the old rows until new ones arrive: the tab/filter control updates at once, the table follows when the refresh lands (see `refresh()` in `dashboard/loading/page.tsx`).

**Step 3 — First load of a region.** Use `useLoadPhase(isLoading)`: `"wait"` → render the skeleton with `className="invisible"`; `"loader"` → skeleton; `"content"` → content. Skeleton boxes must match the real line heights (wrap an `h-4` bone in an `h-5` line box for `text-sm`).

**Step 4 — Widget errors.** Render `<WidgetError what="open CAPAs" onRetry={reload} />` inside the widget's own container, in place of its content.

**Step 5 — Long tasks.** Copy the toast pattern from the patterns doc: fresh id per task, `classNames: { content: "min-w-0 flex-1" }`, `Progress` in the description, `toast.success(…, { id, action })` only when done.

**Do not** touch `components/ui/*`, `globals.css` or the hook while applying — if something there seems wrong, raise it (§8).

---

## 5. Prompt for your agent

Paste as-is, changing the module name:

> Apply Accura's loading behaviour to the **Training** module only (`accura-ui/src/app/prototype/accura/training/`).
> First read, in this order: `docs/handover/loading.md` (sections 1–4 and 7), the **Loading** section of `docs/skills/accura-prototype-build/accura-design-patterns.md`, and `accura-ui/src/app/prototype/accura/dashboard/loading/page.tsx` + `demo-shell.tsx` as the reference implementation.
> Use only the shared pieces: `Button` `loading`, `Skeleton`, `Spinner`, `Progress`, `PageBusy`, `WidgetError`, and `useLoadPhase` / `useDelayedLoading` from `@/hooks/use-delayed-loading`. Do not write your own timers, spinners, overlays or opacity values. Do not edit anything in `components/ui/`, `components/*.tsx`, `hooks/` or `globals.css`. Do not add simulated delays — wire the loading states only.
> Put `PageBusy` where section 4 of the handover says for Training, passing the layout classes of the element it wraps.
> Before writing code, list every place you will change and what you will use there, and wait for my approval.
> After: run `npx tsc --noEmit -p accura-ui`, restart the dev server (`rm -rf .next && npm run dev`), and report measured numbers — no layout shift (heights before/after), button widths unchanged while loading.

---

## 6. How to check your work

- [ ] `npx tsc --noEmit -p .` in `accura-ui` — 0 errors
- [ ] `node docs/machine-readable/validate-artifacts.mjs` and `node docs/machine-readable/drift-check.mjs` pass
- [ ] Restarted the dev server after pulling (`rm -rf .next`)
- [ ] Reference: on the demo page at **Fast**, no loader appears in any scenario; at **Slow**, each matches §3
- [ ] Heights of a region are identical in loading and loaded states (demo: tiles 131px, table 393px)
- [ ] A loading button keeps its width (demo: Export CSV 112px before and during)
- [ ] During refresh: sidebar and header **not** dimmed; content not focusable by Tab; pill centred on screen when scrolled
- [ ] Long-task toast: no button while running; bar width = toast content width

---

## 7. Drift guards — things that look harmless and are not

| ❌ Don't | ✅ Do | Why |
|---|---|---|
| `setTimeout(…, 300)` of your own | `useDelayedLoading` / `useLoadPhase` | One rule; change it in one place |
| `<Button disabled><Spinner/> Saving…</Button>` | `<Button loading loadingLabel="Saving changes">` | Handles width, delay, accessibility |
| `opacity-50` + overlay written by hand | `PageBusy` | Dims, locks, centres the pill, announces |
| `Loader2` from lucide, a CSS ring | `Spinner` | One spinner in the system |
| Reusing a toast `id` | `` `task-${crypto.randomUUID()}` `` | Sonner merges options — an old **Download** appears mid-progress |
| Skeleton row with bones stacked directly | Bones inside real line-height boxes | Otherwise the row is 4px shorter and the table jumps |
| "Retry" | "Try again" | `docs/content-guidelines.md` |
| Editing the shared components while applying | Raise it with Chi | They affect every module |

---

## 8. Open decisions — please do not decide these alone

| # | Decision | Notes |
|---|---|---|
| D1 | **Skeleton contrast on cards** | `color/background/muted` `#f4f4f5` on `color/surface/overlay` `#fff` ≈ **1.1:1**. Needs a token decision and a **Figma variable** (`tokens.css` is generated). Story `Skeleton / InsideCard` shows it |
| D2 | **One "busy" dimming token** | `PageBusy` uses `opacity-50` (placeholder); disabled uses `--opacity-disabled` (60). A token, once agreed, replaces the 50 |
| D3 | **Spinner in Figma** | Its own Figma component, or code-only like Skeleton? |
| D4 | **Wiring `RouteProgressBar` and `AppSplash`** | Built, not mounted. App Router has no navigation events — needs a small "navigation start" hook. Only worth it once data is real |
| D5 | **Long-task trigger button** | In the demo, *Generate audit report* also spins (`loading`) for the whole task while the toast shows progress — two indicators. Proposal: button returns at once, toast owns progress |
| D6 | **Simulated latency in module prototypes** | Without it the loaders never show in modules. Options: none (current), a shared dev-only delay, or demo-only |
| D7 | **Table counts and actions during loading** | Demo keeps tab counts "(5)" "(6)" and *Export CSV* live while the table is still loading |

---

## 9. Differences from the demo as Chi first showed it

All deliberate. If you compare with an older screenshot, these are expected:

| What | Before | Now | Why |
|---|---|---|---|
| Button spinner timing | Spinner at once | Disabled at once, spinner after 300ms | The shared timing rule (decided 2026-10-07) |
| Refresh lock | Locked when the dim appeared (after 300ms) | Locked at once; dim + pill after 300ms | No input on stale data |
| Widget error copy | *Couldn't load X · The rest of the page is unaffected. · Retry* | *Couldn't load X · Try again* | Content guidelines; the middle line was demo explanation. Also: the error tile no longer grows the row (154px → 131px like its neighbours) |
| *Updating…* centre | Centre of the visible content area | Centre of the visible part of the **content column** | Same when content is taller than the screen; differs only when content is shorter |

Everything else was measured equal between the old prototype and the shared components (splash colours and sizes, route bar 2px, skeleton heights, pill 120×30 with the same colours, button widths, toast bar width).

---

## 10. Merging next to the `catalog` branch

`origin/catalog` (2 commits, not yet in `main`, last 2026-09-28) touches 8 of the same files. A dry-run merge
(`git merge-tree`, nothing written) of this change with it gave:

| File | Result | What to do |
|---|---|---|
| `CHANGELOG.md` | **Conflict** — both add an entry at the top of `[Unreleased]` | Keep **both** entries, newest first |
| `llms.txt` | **Conflict** — the spec / meta count lines | Keep this side's counts (**41** spec files, **39** meta files) **and** catalog's `` `catalogId`, `` in the meta line |
| `CLAUDE.md`, `README.md`, `button` / `progress` / `skeleton` / `toast` `.meta.json` | Merge cleanly | — |
| Code (`components/`, `hooks/`, stories) | No overlap | — |

`spinner.meta.json` already carries `"catalogId": "acc-cmp-spinner"` (Accura-written components use `acc-cmp-`, like `record-row-action`), so catalog's `build-catalog.mjs` accepts it. **After both are merged, run `node docs/machine-readable/build-catalog.mjs` once** — the generated catalog is stale until it includes Spinner. On the dry-run merge it then reported *54 items … 39 component, up to date*.

---

## 11. Gotchas we hit

- **Restart after pulling.** A running `next dev` did not pick up the new `@theme` block in `globals.css` — the indeterminate sweep was missing until a restart. `rm -rf .next && npm run dev`. Storybook: `pkill -f "storybook dev" && npm run storybook`.
- **Radix Tabs switch on `mousedown`**, not `click` — scripted `element.click()` on a tab does nothing.
- **Hidden browser panes freeze CSS transitions** — `getComputedStyle().opacity` reads 1 instead of 0.5 mid-transition. Turn the transition off before measuring.
- **Measuring a spinning icon** with `getBoundingClientRect` gives the rotated box (e.g. 20px for 14px). Use computed `width`.
- **`Progress` ignores `max` when drawing** (pre-existing, not part of this change): `value={2} max={5}` draws 2%, not 40% — see the `StepTracker` story. Pass a percentage until it is fixed.

---

## 12. Files in this change

```
accura-ui/src/components/ui/spinner.tsx            new
accura-ui/src/components/ui/button.tsx             loading / loadingLabel
accura-ui/src/components/ui/progress.tsx           indeterminate animation
accura-ui/src/components/ui/skeleton.tsx           reduced motion
accura-ui/src/components/ui/toast.tsx              Spinner for loading icon
accura-ui/src/app/globals.css                      @theme: progress-indeterminate
accura-ui/src/hooks/use-delayed-loading.ts         new
accura-ui/src/components/page-busy.tsx             new
accura-ui/src/components/route-progress-bar.tsx    new
accura-ui/src/components/app-splash.tsx            new
accura-ui/src/components/widget-error.tsx          new
accura-ui/src/stories/Spinner.stories.tsx          new
accura-ui/src/stories/Button.stories.tsx           + Loading, LoadingOnClick
accura-ui/src/stories/Skeleton.stories.tsx         + InsideCard
accura-ui/src/stories/Progress.stories.tsx         comment
accura-ui/src/app/prototype/accura/dashboard/loading/   demo: page.tsx, demo-shell.tsx
docs/component-specs/Spinner.md                    new
docs/component-specs/{Button,Progress,Skeleton,Toast}.md
docs/machine-readable/artifacts/components/spinner.meta.json   new
docs/machine-readable/artifacts/components/{button,progress,skeleton,toast}.meta.json
docs/skills/accura-prototype-build/accura-design-patterns.md   + Loading section
docs/tracking/Storybook Status.md · docs/tracking/AI-Readiness.md
docs/handover/loading.md                           this file
CHANGELOG.md · llms.txt · README.md · CLAUDE.md
```
