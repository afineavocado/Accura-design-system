# Storybook Status — Accura

Tracks the Storybook pipeline per component **for Accura**. Update after completing each component — do not mark a column ✅ until that phase is genuinely done for *this* system.

> ⚠️ **Reset 2026-09-08.** This file previously carried Agentic's status, which claimed 35/35 verified. **That verification does not transfer.** Accura changed the brand ramp, the sidebar, the button radius and the status borders, so every "Figma parity" and "Story verified" tick had to be cleared. A story that renders correctly in Agentic can still be wrong in Accura.

**Pipeline order — no skipping:**
```
.tsx tokens → Figma parity → Story written → Story verified
```

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Done and confirmed **for Accura** |
| ⚠️ | Inherited from Agentic — plausible but unverified here |
| ❌ | Not done |
| — | Not applicable |

**What the columns mean in Accura:**

- **`.tsx` tokens** — the component references `var(--...)` rather than shadcn defaults. Inherited from Agentic's spec-fix pass and still valid, because Accura keeps the same token *names* and only changes their values.
- **Figma parity** — visually checked against **Accura's** Figma file (`32llw6anFsjPISJrrp1and`). Only done where marked.
- **Story written** — a `.stories.tsx` exists.
- **Story verified** — rendered and **measured** in the browser against Accura's tokens, both themes.

---

## Status — 38 stories

| Component | .tsx tokens | Figma parity | Story written | Story verified |
|---|---|---|---|---|
| **Sidebar** | ✅ | ✅ | ✅ | ✅ |
| **Stepper** | ✅ | — | ✅ | ✅ |
| **RecordRowAction** | ✅ | — | ✅ | ❌ |
| Accordion | ✅ | ⚠️ | ✅ | ❌ |
| Alert | ✅ | ⚠️ | ✅ | ❌ |
| AlertDialog | ✅ | ⚠️ | ✅ | ❌ |
| Avatar | ✅ | ⚠️ | ✅ | ❌ |
| Badge | ✅ | ⚠️ | ✅ | ❌ |
| Breadcrumb | ✅ | ⚠️ | ✅ | ❌ |
| Button | ✅ | ⚠️ | ✅ | ❌ |
| ButtonGroup | ✅ | ⚠️ | ✅ | ❌ |
| Calendar | ✅ | ⚠️ | ✅ | ❌ |
| Card | ✅ | ⚠️ | ✅ | ❌ |
| Checkbox | ✅ | ⚠️ | ✅ | ❌ |
| Combobox | ✅ | ⚠️ | ✅ | ❌ |
| DatePicker | ✅ | ⚠️ | ✅ | ❌ |
| Dialog | ✅ | ⚠️ | ✅ | ❌ |
| Drawer | ✅ | ⚠️ | ✅ | ❌ |
| Empty | ✅ | ⚠️ | ✅ | ❌ |
| Input | ✅ | ⚠️ | ✅ | ❌ |
| InputOTP | ✅ | ⚠️ | ✅ | ❌ |
| Item | ✅ | ⚠️ | ✅ | ❌ |
| NavigationMenu | ✅ | ⚠️ | ✅ | ❌ |
| Pagination | ✅ | ⚠️ | ✅ | ❌ |
| Progress | ✅ | ⚠️ | ✅ | ❌ |
| RadioGroup | ✅ | ⚠️ | ✅ | ❌ |
| Select | ✅ | ⚠️ | ✅ | ❌ |
| Separator | ✅ | ⚠️ | ✅ | ❌ |
| Sheet | ✅ | ⚠️ | ✅ | ❌ |
| Skeleton | ✅ | ⚠️ | ✅ | ❌ |
| Slider | ✅ | ⚠️ | ✅ | ❌ |
| Switch | ✅ | ⚠️ | ✅ | ❌ |
| Table | ✅ | ⚠️ | ✅ | ❌ |
| Tabs | ✅ | ⚠️ | ✅ | ❌ |
| Textarea | ✅ | ⚠️ | ✅ | ❌ |
| Toast | ✅ | ⚠️ | ✅ | ❌ |
| Tooltip | ✅ | ⚠️ | ✅ | ❌ |

**Summary: 2 verified · 34 inherited-unverified · 0 missing stories.**

 is code-only — there is no Figma set, so Figma parity reads `—` rather than ✅. Built and verified for Accura 2026-09-08.

---

## Highest-risk components to verify first

Accura's deviations are concentrated in a few places. Verify these before the rest:

| Priority | Component | Why |
|---|---|---|
| 1 | **Button** | radius is `9999` (pill) in Accura vs 8/12px in Agentic — every size variant differs |
| 2 | **Input · Select · Combobox · DatePicker** | `border/error`, `border/success`, `border/warning` moved to 300/400 steps — far paler than Agentic's 500/700 |
| 3 | **Any focused state** | `color/ring` is `brand/500` `#17bb77` at **2.50:1** against white — likely a WCAG 1.4.11 failure (Q11) |
| 4 | **Badge · Alert · Toast** | status fills and their paired foregrounds |
| 5 | **Dialog · Sheet · Toast · ButtonGroup · Item** | had broken icon imports until 2026-09-08 — they render now but have never been parity-checked |

---

## Known state

- **ChatBubble** — removed entirely on 2026-09-17: story (earlier, by decision), then the component, its spec and its `meta.json`. Nothing in the app or the prototypes used it.
- **RecordRowAction** — added 2026-09-18 on promotion from `components/` to `components/ui/`. No
  Figma node and never had one, so **Figma parity is not applicable**, not outstanding. Its tokens
  were read from the `.tsx`. Not verified in the browser: the pinned appearance at 390px has never
  been measured, which is logged as an open question in its spec.
- **`button.figma.tsx`** — a Code Connect stub, not a component. No story expected.
- ~~**`label`** — a shared sub-component documented in `Form-shared.md`. No story expected.~~
  **Superseded 2026-09-14.** `Label` now implements `required` and the three `label state`
  variants, and has `Label.stories.tsx` + `label.meta.json`. Verified in-browser against the
  spec's token bindings; **not yet audited R1–R8 against Figma `150:569`**.
- **27 TypeScript errors** across story files, inherited from the fork (Storybook 10 made `args` required on `Story`). Excluded from the Next.js build; not yet fixed at source.

---

---

## ⚠️ Three documents disagree about how many stories are verified

Recorded 2026-09-18, **not resolved** — the ticks are nobody's to change but the person who did or
did not run the verification.

| Says | Where |
|---|---|
| **2** — Sidebar and Stepper | the table above, counted from the `Story verified` column |
| 3 | `CLAUDE.md` → Known debt |
| 4 — Sidebar, Stepper, AlertDialog, Label | `llms.txt` |

The table is the artifact and the prose is derived from it, so both prose counts have been set to
**2 of 38**. But `AlertDialog` and `Label` are named specifically in `llms.txt`, and Label's note
below says it was verified in-browser — so the likelier reading is that **the table is missing two
ticks**, not that `llms.txt` invented them. Someone who knows whether those two were measured
should either tick the table or drop the names.

*Verify per `docs/skills/Storybook Build Process.md`. Storybook does not reliably hot-reload `.tsx` or token edits — fully restart and measure in the browser. Record numbers, not impressions.*
