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

## Status — 35 stories

| Component | .tsx tokens | Figma parity | Story written | Story verified |
|---|---|---|---|---|
| **Sidebar** | ✅ | ✅ | ✅ | ✅ |
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

**Summary: 1 verified · 34 inherited-unverified · 0 missing stories.**

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

- **ChatBubble** — story removed by decision. `chat-bubble.tsx` and its spec still exist; `chat-bubble.meta.json` still references the deleted story and fails `validate-artifacts.mjs`.
- **`button.figma.tsx`** — a Code Connect stub, not a component. No story expected.
- **`label`** — a shared sub-component documented in `docs/component-specs/Form-shared.md`. No story expected.
- **27 TypeScript errors** across story files, inherited from the fork (Storybook 10 made `args` required on `Story`). Excluded from the Next.js build; not yet fixed at source.

---

*Verify per `docs/skills/Storybook Build Process.md`. Storybook does not reliably hot-reload `.tsx` or token edits — fully restart and measure in the browser. Record numbers, not impressions.*
