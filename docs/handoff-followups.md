# Documents handoff v2 — deferred follow-ups

Opened 2026-09-14, after adopting the coworker's Documents package wholesale
(commit `9660b49`, branch `documents/handoff-v2`).

The package was taken as-is on purpose: hand-merging ~350 lines of new
detail-screen logic to preserve small UI edits was the riskier trade. The cost is
that **the Documents module has reverted to her shell conventions**, which no
longer match Training and CAPA. Everything below is known, deliberate and not yet fixed.

---

## 1. Heading and toolbar — regressions to re-apply

Each of these was implemented before and was overwritten by the adoption.

| # | What reverted | Where | Original fix |
|---|---|---|---|
| 1 | `PageHeading` is back — its own `<h1>` + description inside page content | `documents/components.tsx` | `393016c` — title belongs in `ApplicationHeader` |
| 2 | `title="Documents"` removed from the header bar | `documents/layout.tsx` | `393016c` |
| 3 | `ListSummary` replaced by a hand-rolled summary row, copy `"N revision records · Filtered results"` | `documents/page.tsx` | `9f18d8b` |
| 4 | Filter copy back to the `Label: value` prefix (`Workflow: In...` clipping) instead of `allLabel` | `documents/components.tsx`, `page.tsx` | `9f18d8b` |
| 5 | `Create Document` button now lives inside `PageHeading` — removing #1 removes the button unless it is moved to the search row first | `documents/page.tsx` | `393016c` |
| 6 | Card padding: 5 explicit `spacing/component/xl` (24px) overrides, vs the 16px primitive default agreed in Q12 | `documents/document-detail.tsx` | `bff58f4`, Q12 |
| 7 | `Label` required-asterisk usage predates the shared `RequiredLabel` | `documents/*.tsx` | `1b927ca` |

Also reverted: the three module `.md` files that recorded the 16px decision
(`README.md`, `TRAINING-MAPPING.md`, `FUNCTIONAL-SPEC-MAPPING.md`).

---

## 2. Four design questions adopted by default

Taken as-is to keep the integration moving. None has been agreed.

**a. Revision is now in the URL.** `documentHref` produces
`/prototype/accura/documents/SOP-001--v1.0` and `…/ACME~WI~2026~000001--v1.0`.
Old `/documents/SOP-001` links no longer resolve, and `~` / `--` in a user-facing
URL is unusual. Verified working, but never discussed.

**b. `UseStatus` absorbs lifecycle.** The union gained `External record`,
`Superseded` and `Obsolete` alongside `Effective` / `Pending effective` /
`Not effective`. The Availability filter now answers two different questions —
"can I use it" and "where is it in its life". Training's status model keeps these apart.

**c. Superseded styling uses an inline `style` attribute** —
`opacity: calc(var(--opacity-disabled) / 100)` plus `line-through`. The only
styling in the prototype that bypasses className tokens.

**d. Summary copy diverges** — `"N revision records"` against the `ListSummary`
noun pattern standardised across all three modules. Folded into #3 above.

---

## 3. Interim assumptions from her own README

Her words, carried over unexamined: Normal replacement approval supersedes the
previous revision immediately, and new effectiveness defaults to approval + 14
days with QA override — **which can leave no effective revision during the gap**.
External new-version routing and Author/Owner mock equivalence are also labelled
assumptions.

---

## 4. Not taken from the package

- `application-header.tsx` — hers has no `title` prop; taking it would blank the
  heading in Training and CAPA as well as Documents.
- `docs/demo-design-contract.md` — split into `docs/demo-scope.md` + the
  prototype-build skill on 2026-09-14. Her README still calls it authoritative.
  Anything genuinely new in it has **not** yet been folded into the two successors.
- `AGENTS.md`, `app-sidebar.tsx` patch hunks — both changed on our side.
- `record-audit-drawer.tsx` — identical, nothing to take.

---

## 5. `drift-check` is red — one decision needed

`RecordRowAction.stories.tsx` came with the package and now fails **rule 5**:

```
✗ story "RecordRowAction.stories.tsx" is not owned by any meta.json
```

`src/stories/` is reserved for *design-system* components, each documented by a
`meta.json` with a Figma node ID. `record-row-action` is a **prototype** component —
its siblings `record-workflow.tsx`, `record-audit-drawer.tsx` and
`application-header.tsx` have no stories for exactly that reason.

So this is a question, not a mechanical fix:

- **Promote it** — it becomes a real design-system component, needs a Figma node, a
  spec in `docs/component-specs/` and a `meta.json`; or
- **Demote it** — move or delete the story, keep the component as prototype-only.

No `meta.json` was invented, and the story was not deleted. The gate stays red until
this is decided. Every other check passes.

---

## 6. Verified at adoption

Typecheck clean · ESLint clean on every changed file · production build passes
(22 routes) · dev server 200 on all three module listings and on revision-keyed
detail routes. **Not verified: anything visual.** Nobody has looked at the
Documents screens since the adoption.
