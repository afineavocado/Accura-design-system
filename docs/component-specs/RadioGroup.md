# Radio

A single-select control used within a radio group. Supports 2 layout types — a compact Basic row and a bordered Choice card — each with 4 states and an optional description line.

---

## Variant Matrix

### radio-item (main component — `96:33437`)

| Property | Options | Default |
|---|---|---|
| `State` | `Default`, `Checked`, `Disabled`, `Invalid`, `Focus` | `Default` |
| `Type` | `Basic`, `Choice card` | `Basic` |

All 5 states × 2 types = 10 variants.

### radio (sub-component — `96:33420`)

| Property | Options | Default |
|---|---|---|
| `State` | `Unchecked`, `Checked`, `Disabled`, `Focus`, `Invalid` | `Unchecked` |

5 variants.

> `radio-item` uses `Default` (not `Unchecked`) as its unselected state label — radio buttons belong to a group where "default" conveys the unselected position more naturally than "unchecked."

---

## Component Properties

### radio-item

| Property | Type | Default | Notes |
|---|---|---|---|
| `State` | VARIANT | `Default` | Interaction and validation state |
| `Type` | VARIANT | `Basic` | Layout type — compact row or bordered card |
| `Show description` | BOOLEAN | `true` | Shows/hides the description text line |

### radio

| Property | Type | Default | Notes |
|---|---|---|---|
| `State` | VARIANT | `Unchecked` | Interaction and validation state |

---

## Structure

### radio-item — Type=Basic

```
radio-item                        — HORIZONTAL, gap: spacing/component/md (12px)
  ├─ radio                        — INSTANCE 16×16px
  └─ text-block                   — VERTICAL, gap: spacing/component/xxs (2px)
       ├─ label                   — always visible
       └─ description             — shown when Show description=True
```

### radio-item — Type=Choice card

```
radio-item                        — HORIZONTAL, gap: spacing/component/md (12px)
                                    padding: spacing/component/lg (16px) all sides
                                    fill + border + radius/lg
  ├─ radio                        — INSTANCE 16×16px
  └─ text-block                   — VERTICAL, gap: spacing/component/xxs (2px)
       ├─ label                   — always visible
       └─ description             — shown when Show description=True
```

### radio (sub-component)

```
radio                             — 16×16px, radius/full
  └─ dot  (FRAME)                 — 8×8px, radius/full — visible in Checked only
```

---

## Token Bindings

### radio — per State

| State | Fill | Stroke | Stroke weight | Stroke align | Effect style |
|---|---|---|---|---|---|
| `Unchecked` | — (transparent) | `color/input/border` | 1px | INSIDE | — |
| `Checked` | — (transparent) | `color/brand/primary` | 1px | INSIDE | — |
| `Disabled` | — (transparent) | `color/border/disabled` | 1px | INSIDE | — |
| `Focus` | — (transparent) | `color/ring` | 2px | OUTSIDE | `focus/ring` |
| `Invalid` | — (transparent) | `color/border/error` | 1px | INSIDE | — |

All variants: `border-radius → radius/full`.

> Unchecked uses `color/input/border` (zinc/300), not `color/border/default` (zinc/200) — the radio circle is treated as an input boundary, one step darker to define it clearly.

### radio — inner element

| Element | Node | Property | Token |
|---|---|---|---|
| `dot` | FRAME | fill | `color/brand/primary` |
| `dot` | FRAME | border-radius | `radius/full` |
| `dot` | FRAME | size | 8×8px |

The dot is fill-based (FRAME), not stroke-based. Visible in `State=Checked` only.

### radio-item — Type=Basic fills and strokes

Basic variants have no fill, no stroke, and no border-radius on the row itself — only the embedded `radio` sub-component carries the visual state.

### radio-item — Type=Choice card per State

Choice cards have **no fill** — they render directly on the page background. The card border and optional `opacity/disabled` carry the full state signal.

| State | Card fill | Card stroke | Stroke weight | Stroke align | Opacity | Radius |
|---|---|---|---|---|---|---|
| `Default` | — | `color/border/default` | 1px | INSIDE | — | `radius/lg` |
| `Checked` | — | `color/brand/primary` | 1px | INSIDE | — | `radius/lg` |
| `Disabled` | — | `color/border/default` | 1px | INSIDE | `opacity/disabled` (0.6) on frame | `radius/lg` |
| `Invalid` | — | `color/border/error` | 1px | INSIDE | — | `radius/lg` |
| `Focus` | — | `color/border/focus` | 1px | INSIDE | — | `radius/lg` |

> **Disabled approach:** `opacity/disabled` is bound on the entire card frame. All child tokens remain at their default values — the uniform opacity reduces the whole card to 60%, making it visually disabled without color-matching tricks. This matches the Switch pattern.
>
> **Focus approach:** `color/border/focus` 1px INSIDE — consistent with all other bordered interactive components (Switch, Checkbox). Avoids OUTSIDE ring which would overlap adjacent cards in a tight list.
>
> ⚠️ **Focus/Checked overlap:** because Radix `RadioGroup` arrow keys move focus and selection together, `Focus` and `Checked` are usually true on the same card at once — see the note in the Behavior section below for when each is actually distinguishable.

### radio-item — Choice card spacing

| Property | Token | Value |
|---|---|---|
| Padding (all sides) | `spacing/component/lg` | 16px |
| Gap (radio → text-block) | `spacing/component/md` | 12px |

### radio-item — Basic spacing

| Property | Token | Value |
|---|---|---|
| Gap (radio → text-block) | `spacing/component/md` | 12px |

### radio-item — text-block spacing

| Property | Token | Value |
|---|---|---|
| Gap (label → description) | `spacing/component/xxs` | 2px |

### radio-item — text tokens per State

| State | `label` color | `description` color | Notes |
|---|---|---|---|
| `Default`, `Checked`, `Focus` | `color/surface/default/foreground` | `color/text/secondary` | Surface-agnostic — works regardless of page background |
| `Invalid` | `color/text/invalid` | `color/text/secondary` | Label signals error · description stays readable |
| `Disabled` (Basic) | `color/text/disabled` | `color/text/disabled` | Explicit disabled color for Basic type |
| `Disabled` (Choice card) | `color/surface/default/foreground` | `color/text/secondary` | Normal tokens — `opacity/disabled` on frame handles appearance |

> `color/surface/default/foreground` is used instead of `color/background/default/foreground` because Choice cards have no fill — they sit directly on the page background. The `surface/default` token is surface-agnostic and correct for both filled and unfilled contexts.

### radio-item — text styles

| Layer | Text style |
|---|---|
| `label` | `label/md` (14px / Medium) |
| `description` | `body/sm` (14px / Regular) |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `radio` (within a `radiogroup`) |
| Touch target | `radio` sub-component is 16×16px — the full item row provides the hit area; Basic rows need `min-h-[44px]` wrapper in implementation |
| Focus indicator | Basic: `color/ring` 2px OUTSIDE on the radio circle · Choice card: `color/border/focus` 1px INSIDE on card border |
| Keyboard | `Tab` to enter group · `Arrow` keys to move between options · `Space` to select |
| Screen reader name | Visible label text is the accessible name; wrap items in a `<fieldset>` + `<legend>` for the group label |

Choice card variants (69px height) meet the 44×44px touch target natively. Basic variants (~37px) require a `min-h-[44px]` wrapper.

Focus is expressed on `radio-item` directly — use `State=Focus` on the item to depict keyboard focus in a static mockup. The embedded `radio` sub-component also has its own `State=Focus` for cases where only the indicator needs to show focus.

---

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| `Default` | Unselected within group | Empty circle with input border |
| `Checked` | User selects this option | Dot appears, border switches to primary |
| `Disabled` | `disabled` prop / form disabled | No hover, focus, or active · Basic: `color/text/disabled` text, `color/border/disabled` radio · Choice card: `opacity/disabled` on entire card frame |
| `Invalid` | Form validation failure | Error border on circle and card outline — label switches to `color/text/invalid` · description stays `color/text/secondary` |
| `Focus` | Tab or arrow key navigation | Basic: 2px `color/ring` OUTSIDE on the radio circle · Choice card: 1px `color/border/focus` INSIDE on card border |

Radio buttons must always exist within a group — selecting one deselects all others in the same group. A single standalone radio is always wrong; use a checkbox instead.

> **Focus vs. Checked on Choice card — known overlap (2026-06-15):** Radix `RadioGroup` follows the native radio interaction model — **Arrow key navigation moves focus AND changes the selected value at the same time** (unlike Tabs/Menus, where focus and selection are independent). As a result:
> - Once a Choice card group has a selected value (the normal case — `defaultValue` set), arrowing onto a different card makes it **`Checked` and `Focus` simultaneously**. The card's border shows whichever of `color/brand/primary` (Checked) or `color/border/focus` (Focus) wins by CSS order — in practice the two states are visually indistinguishable on Choice card.
> - The dedicated `Focus` row in the per-state table above is only reachable as a **pure, non-Checked state** in the edge case where the group has **no selection yet** — the first `Tab` into an empty group focuses the first card without checking it.
> - The Basic type's `radio` circle still shows its own independent `color/ring` 2px OUTSIDE focus ring regardless of checked state — that indicator remains reliably visible.
> - **Implication:** don't rely on the Choice card border alone to communicate "this card has keyboard focus" in a group that already has a selection — the focused card and the checked card will look the same. If a screen needs to depict keyboard focus distinctly from selection on a Choice card, do so on an unselected group, or rely on the inner `radio` circle's ring.

`radio-item` has no Hover state. Hover treatment for radio options is handled at the radio-group level in implementation (e.g. row background shifts to `color/background/accent`), not at the individual item level.

---

## Usage Rules

- `Type=Basic` — default for form fields, settings, preference lists. Compact and low-visual-weight.
- `Type=Choice card` — use when each option needs more explanation or when the choice carries enough weight to justify a card surface. Cards also communicate that the selection has visual consequence (e.g. a plan tier, a layout option).
- Never use a single `radio-item` in isolation — always place inside a radio group. If only one option exists, use a checkbox.
- `Show description=True` (default) — keep descriptions short (one line, ~60 characters). Long descriptions break the rhythm of a list. If you need more than a line, reconsider using a card pattern with richer content.
- `Invalid` state: label uses `color/text/invalid` to signal the error · description stays `color/text/secondary` to remain readable as supporting context. Pair with an error message below the group (outside this component) in implementation.
- Choice cards have no fill — they are transparent and rely on the page background. `opacity/disabled` (0.6) is applied to the entire card frame for the Disabled state, making all elements uniformly dim without color-matching tricks.

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Pricing plan selection: Free, Plus, Pro — only one tier can be active, seeing all options at once matters
- Subscription billing cadence: Monthly, Yearly, Lifetime — 3 visible options, mutual exclusion is the entire point
- Notification delivery preference: Email, SMS, Push — user picks one channel
- Layout or display mode selector: Grid view, List view, Compact view
- Feedback form rating scale: Poor, Fair, Good, Excellent — visible options help calibrate the choice

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Type=Basic` | Compact preference list in a form or settings panel — low visual weight, options are self-explanatory | Notification channel · Sort order · Gender on profile form |
| `Type=Choice card` | Each option warrants a title + description, or the choice carries enough visual weight to justify a card | Pricing tier (Free / Pro / Enterprise) · Onboarding goal ("For personal use" / "For my team") · Subscription plan |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| 2–5 mutually exclusive options where seeing all at once aids the decision | `radio` | `select` |
| 5+ options or space is constrained | `select` | `radio` |
| Only one option exists (standalone binary) | `checkbox` | `radio` |
| User can pick multiple options from the list | `checkbox` | `radio` |
| Each option is a major feature tier with rich description | `radio` (`Type=Choice card`) | `checkbox` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Raw 16×16 circle with hardcoded border | Use `radio` instance |
| Standalone `radio-item` outside a group | Wrap in a `radiogroup` |
| Single radio option | Use a checkbox instead |
| `color/border/default` for Unchecked state | `radio` uses `color/input/border` — input boundary is intentionally one step darker |
| Add a fill to Choice card instances | Cards are intentionally transparent — fill is always absent |
| Use `color/icon/*` for the dot | The dot uses `color/brand/primary` directly as a fill |
