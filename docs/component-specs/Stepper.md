# Stepper

A horizontal or vertical progress indicator for a multi-step process. Shows which steps are done, which is active, and which remain. Also known as *Progress Steps*.

**Code-only — no Figma component set.** Built for Accura; not inherited from Agentic. shadcn/ui has no stepper, so this is a custom component like `Item` and `Sidebar`.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| — | — | — | Code-only. Add a Figma set if the component needs design-side variants. |

---

## Variant Matrix

### `Stepper` — `orientation`

| Property | Options | Default |
|---|---|---|
| `orientation` | `horizontal`, `vertical` | `horizontal` |

Step status is **derived**, never passed:

| Index vs `currentStep` | Status |
|---|---|
| `< currentStep` | `complete` |
| `= currentStep` | `current` |
| `> currentStep` | `upcoming` |

`currentStep` is **1-based** — `currentStep={2}` means step 2 is active. Deriving status this way makes contradictory states impossible.

---

## Structure

```
stepper                          — OL, flex. row (horizontal) / col (vertical)
  └─ step                        — LI, flex row, items-center
       ├─ indicator              — 24×24, radius/full, grid place-center
       │    └─ check | number    — Check icon (complete) or step number
       ├─ label                  — TEXT, text-sm
       └─ connector              — line, flex-1 (horizontal) / w-px h-full (vertical)
```

The connector is rendered by every step **except the last**. Its colour is driven by the *preceding* step's status: once a step is complete, the line leaving it is brand-coloured.

---

## Token Bindings

### Indicator — per status

| Status | Fill | Border | Content |
|---|---|---|---|
| `complete` | `color/brand/primary` | none | Check icon · `color/brand/primary/foreground` |
| `current` | `color/background/default` | 2px `color/brand/primary` | number · `color/brand/primary` |
| `upcoming` | `color/background/muted` | 2px **`stepper/border`** | number · `color/text/secondary` |

### Label — per status

| Status | Colour | Weight |
|---|---|---|
| `complete` | `color/background/default/foreground` | normal |
| `current` | `color/background/default/foreground` | **semibold** |
| `upcoming` | `color/text/secondary` | normal |

### Component token — `stepper/border`

`stepper/border` → `color/zinc/300` → `#d4d4d8`

It aliases a **primitive directly**, which the inherited ruleset forbids. Accura treats the component tier as another semantic layer, so this is allowed — see `accura-theme.md` §7. The value exists because no semantic carries it with the right meaning: `color/border/default` (`#e4e4e7`) is invisible against the `#f4f4f5` fill, and `color/border/hover` / `color/input/border` mean hover state and input boundary.

> Created in Figma's Components collection 2026-09-08 — it survives token re-export.

### Connector

| Preceding step | Colour |
|---|---|
| `complete` | `color/brand/primary` |
| `current` or `upcoming` | `color/border/default` |

### Layout

| Property | Token | Value |
|---|---|---|
| Indicator size | — | 24 × 24px (`h-6 w-6`) |
| Indicator radius | `radius/full` | 9999 |
| Indicator ↔ label gap | `spacing/component/sm` | 8px |
| Step ↔ connector gap | `spacing/component/md` | 12px |
| Connector thickness | — | 2px |
| Indicator border | — | 2px on `current` and `upcoming`; none on `complete` |
| Vertical step spacing | `spacing/component/lg` | 16px |

---

## Behavior

**Display-only by default.** The Stepper reports progress; it does not navigate.

**Optional navigation** — when `onStepClick` is provided, each step becomes a `<button>`:
- Only `complete` and `current` steps are clickable. `upcoming` steps are `disabled` — a user cannot skip ahead.
- Without `onStepClick`, steps render as plain text with no interactive affordance.

**No internal state.** `currentStep` is fully controlled by the caller.

**Orientation**
- `horizontal` — connectors stretch to fill available width; labels sit inline to the right of each indicator.
- `vertical` — connectors run down the left edge under each indicator; labels sit to the right. Steps stack with a fixed gap.

### Keyboard — only when `onStepClick` is set

| Key | Action |
|---|---|
| `Tab` | Move to the next clickable step |
| `Enter` / `Space` | Activate the focused step |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `<ol>` — an ordered list is the correct semantic for a sequence |
| Current step | `aria-current="step"` on the active `<li>` |
| Label | `aria-label` on the `<ol>`, default `"Progress"` |
| Status | Each step carries a visually hidden status word so screen readers hear "Draft, completed" rather than a bare number |
| Icon | Check icon is `aria-hidden` — the status text carries the meaning |
| Focus | `color/ring`, 2px, `focus-visible` only — inherits the system focus treatment |

The step number is decorative when a label is present; the label is the accessible name.

---

## Usage Rules

- Use for a **known, ordered, finite** sequence — approval flows, onboarding, checkout.
- Keep to **3–7 steps**. Beyond that, labels crowd on horizontal layouts; switch to `vertical`.
- Labels should be **1–3 words**. Long labels break horizontal alignment.
- `currentStep` is 1-based and should stay within `1…steps.length`.
- Prefer `vertical` in side panels, narrow columns and on mobile.
- A Stepper shows **position in a process**, not completion percentage — use `Progress` for that.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Passing a `status` per step | Pass `currentStep` — status is derived |
| Using it for percentage or loading | Use `Progress` |
| Making `upcoming` steps clickable | Only `complete` and `current` are navigable |
| 10+ steps horizontally | Switch to `vertical`, or group the stages |
| A `<div>` list | `<ol>` / `<li>` — the order is meaningful |
| Colouring the connector from the *following* step | It reflects the **preceding** step's status |
| `color/status/success` for the complete state | `color/brand/primary` — this is brand progress, not a success state |
