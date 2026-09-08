# Checkbox

A binary selection control used to toggle an option on or off. Supports 8 states and an optional description line below the label, with a Focus variant on both the sub-component and the item itself.

---

## Variant Matrix

### checkbox-item (main component — `59:18336`)

| Property | Options | Default |
|---|---|---|
| `State` | `Unchecked`, `Hover`, `Focus`, `Checked`, `Indeterminate`, `Disabled`, `Checked Disabled`, `Invalid` | `Unchecked` |
| `Description` | `True`, `False` | `False` |

All 8 states × 2 description values = 16 variants.

### checkbox-box (sub-component — `59:18266`)

| Property | Options | Default |
|---|---|---|
| `State` | `Unchecked`, `Hover`, `Focus`, `Checked`, `Indeterminate`, `Disabled`, `Checked Disabled`, `Invalid` | `Unchecked` |

8 variants.

---

## Component Properties

### checkbox-item

| Property | Type | Default | Notes |
|---|---|---|---|
| `State` | VARIANT | `Unchecked` | Interaction and validation state |
| `Description` | VARIANT | `False` | Shows/hides the description text line |

### checkbox-box

| Property | Type | Default | Notes |
|---|---|---|---|
| `State` | VARIANT | `Unchecked` | Interaction and validation state |

---

## Structure

### checkbox-item

```
checkbox-item                     — HORIZONTAL, gap: spacing/component/sm (8px)
  ├─ checkbox-box                 — INSTANCE 16×16px
  └─ text-content                 — VERTICAL, gap: spacing/component/xxs (2px)
       ├─ label                   — always visible
       └─ description             — visible when Description=True
```

### checkbox-box

```
checkbox-box                      — 16×16px, radius: checkbox/radius
  ├─ check    (VECTOR)            — visible in Checked, Checked Disabled
  └─ dash     (RECTANGLE)         — visible in Indeterminate
```

---

## Token Bindings

### checkbox-box — per State

| State | Fill | Stroke | Stroke weight | Stroke align | Effect style |
|---|---|---|---|---|---|
| `Unchecked` | — (transparent) | `color/input/border` | 1px | INSIDE | — |
| `Hover` | `color/background/accent` | `color/brand/primary` | 1px | INSIDE | — |
| `Focus` | — (transparent) | `color/ring` | 2px | OUTSIDE | — |
| `Checked` | `color/brand/primary` | — | — | — | — |
| `Indeterminate` | `color/brand/primary` | — | — | — | — |
| `Disabled` | `color/background/muted` | `color/border/disabled` | 1px | INSIDE | — |
| `Checked Disabled` | `color/background/muted` | `color/border/disabled` | 1px | INSIDE | — |
| `Invalid` | — (transparent) | `color/border/error` | 1px | INSIDE | — |

### checkbox-box — inner elements

| Element | Node | Property | Token |
|---|---|---|---|
| `check` | VECTOR | stroke | `color/brand/primary/foreground` (Checked) |
| `check` | VECTOR | stroke | `color/background/muted/foreground` (Checked Disabled) |
| `check` | VECTOR | stroke weight | 1.5px |
| `check` | VECTOR | stroke align | CENTER |
| `dash` | RECTANGLE | fill | `color/brand/primary/foreground` |
| `dash` | RECTANGLE | border-radius | `checkbox/radius` |

All variants: `border-radius → checkbox/radius` (**4px**) bound on all four corners.

> ⚠️ **Do not rebind this to `radius/md`.** `radius/md` is `10px` after the base-12 rescale, and CSS clamps
> `border-radius` to half the shorter side — on a 16×16 box that renders a perfect circle, making the
> checkbox indistinguishable from a RadioGroup item. Shape is the only cue that tells the user whether the
> choice is exclusive. `checkbox/radius` exists in Figma's Components collection. See accura-theme.md §4 and §7.

### checkbox-item — text tokens per State

| State | `label` color | `description` color |
|---|---|---|
| `Unchecked`, `Hover`, `Focus`, `Checked`, `Indeterminate` | `color/background/default/foreground` | `color/background/muted/foreground` |
| `Invalid` | `color/text/invalid` | `color/text/invalid` |
| `Disabled`, `Checked Disabled` | `color/text/disabled` | `color/text/disabled` |

### checkbox-item — text styles

| Layer | Text style |
|---|---|
| `label` | `label/md` (14px / Medium) |
| `description` | `body/sm` (14px / Regular) |

### checkbox-item — spacing

| Property | Token | Value |
|---|---|---|
| Gap between `checkbox-box` and `text-content` | `spacing/component/sm` | 8px |
| Gap between `label` and `description` | `spacing/component/xxs` | 2px |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `checkbox` |
| Touch target | Visual box is 16×16px — wrap the full label row in `min-h-[44px]` in implementation |
| Focus indicator | `color/ring` stroke · 2px · OUTSIDE (on `checkbox-item` frame and `checkbox-box`) |
| Keyboard | `Tab` to focus · `Space` to toggle |
| Screen reader name | Visible label text is the accessible name |

Focus is expressed on both `checkbox-item` and `checkbox-box`. Use `State=Focus` on `checkbox-item` to depict keyboard focus in a static mockup. The `checkbox-box` sub-component also has its own `State=Focus` for cases where only the indicator needs to show focus.

---

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| `Unchecked` | Default / untoggled | Empty box, default border |
| `Hover` | Mouse over the item | Box fill shifts to accent, border to primary — desktop only |
| `Focus` | Tab key or click without drag | 2px `color/ring` OUTSIDE on the item frame and box |
| `Checked` | User selects | Box fills with primary, check icon appears |
| `Indeterminate` | Partial child selection (programmatic) | Same fill as Checked, dash icon instead of check |
| `Disabled` | `disabled` prop / form disabled | No hover, focus, or active — muted fill, muted border, disabled text |
| `Checked Disabled` | Pre-selected and non-editable | Checked visual + disabled token treatment |
| `Invalid` | Form validation failure | Error border on box — label and description switch to `color/text/invalid` |

In `Invalid` state, both label and description use `color/text/invalid` — no hierarchy between them. Pair with an error message below the field in implementation (outside this component).

---

## Usage Rules

- Use `checkbox-item` in forms and settings — never `checkbox-box` alone in page-level compositions.
- Use `checkbox-box` standalone only when building a custom list row where the surrounding layout handles label rendering.
- `Indeterminate` is a programmatic state — never set it manually in static designs unless specifically depicting a partial-selection scenario (e.g. "select all" with mixed child states).
- `Checked Disabled` = pre-selected, locked. Use when a value is required and cannot be changed by the user (e.g. mandatory consent).
- `Description=True` adds a supporting line — use it for options that need a brief explanation. Keep descriptions to one line (≤ ~60 characters) to avoid excessive vertical stacking.

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- "Accept terms and conditions" — a single required consent field at the bottom of a form
- File manager or media library: selecting multiple items for bulk actions (delete, move, download)
- Notification preferences list: "Email updates", "SMS alerts", "Weekly digest" — check any combination
- Filter panels: selecting multiple categories, tags, or attributes to refine a list
- Settings screen: desktop display preferences ("Show hard disks", "Show external drives") — each is independently toggled and submitted with a Save action

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Description=False` | Short, self-explanatory option labels — no clarification needed | "Accept terms" · "Remember me" · "Select all" |
| `Description=True` | Option needs a supporting line to clarify scope or consequence | "Marketing emails — Receive news and promotions" · "Two-factor auth — Adds an extra sign-in step" |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| User selects multiple items from a list in a form (submitted on Save) | `checkbox` | `switch` |
| Single mandatory consent in a form ("I agree to the terms") | `checkbox` | `switch` |
| Effect should apply immediately on toggle, no submit button | `switch` | `checkbox` |
| User picks exactly one option from a visible short list (2–5) | `radio` | `checkbox` |
| User must pick one or more from a long searchable list | `combobox` | `checkbox` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Raw 16×16 frame with hardcoded border | Use `checkbox-box` instance |
| Override box fill on the `checkbox-item` instance | Switch the `State` prop |
| Use `checkbox-box` State=Focus in a static composition to show "selected" | Focus ≠ Checked — use `State=Checked` |
| Use `color/status/danger` for the error state border | The box uses `color/border/error` — status tokens are for badges/alerts |
| Use `color/icon/*` for the check or dash icon | Inner icons use the container's `/foreground` token |
