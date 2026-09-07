# Switch

A toggle control for binary on/off choices. Built from two component sets: `switch` (the visual toggle indicator) and `switch-item` (the full row with label, optional description, and optional card surface).

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `switch` | `67:88` | 12 | The toggle indicator — track + thumb |
| `switch-item` | `270:110` | 12 | Full row: switch + label + optional description |

---

## Variant Matrix

### switch

| Property | Options | Default |
|---|---|---|
| `Size` | `Default`, `Sm` | `Default` |
| `Checked` | `True`, `False` | `False` |
| `State` | `Default`, `Disabled`, `Focus` | `Default` |

All 2 sizes × 2 checked × 3 states = 12 variants.

### switch-item

| Property | Options | Default |
|---|---|---|
| `Type` | `Basic`, `Description`, `Choice Card` | `Basic` |
| `State` | `Default`, `Disabled`, `Invalid`, `Focus` | `Default` |

All 3 types × 4 states = 12 variants.

> `Type=Basic` is a single-line row — label only, no description layer. `Type=Description` adds a description line. `Type=Choice Card` wraps both in a bordered card surface.

---

## Sizes

### switch

| Size | Track W × H | Thumb size | Radius |
|---|---|---|---|
| `Default` | 44 × 24px | 20 × 20px | `radius/full` |
| `Sm` | 28 × 16px | 12 × 12px | `radius/full` |

---

## Component Properties

### switch

| Property | Type | Default | Notes |
|---|---|---|---|
| `Size` | VARIANT | `Default` | Track + thumb scale |
| `Checked` | VARIANT | `False` | Whether the switch is toggled on |
| `State` | VARIANT | `Default` | Interaction state |

### switch-item

| Property | Type | Default | Notes |
|---|---|---|---|
| `Type` | VARIANT | `Basic` | Layout type — Basic, Description, or Choice Card |
| `State` | VARIANT | `Default` | Interaction and validation state |

---

## Structure

### switch

```
switch                          — track FRAME, radius/full
  └─ thumb                      — FRAME, radius/full — slides left (unchecked) / right (checked)
```

### switch-item — Type=Basic

```
switch-item                     — HORIZONTAL, gap: spacing/component/sm
  ├─ switch                     — INSTANCE
  └─ label                      — TEXT, always visible
```

### switch-item — Type=Description

```
switch-item                     — HORIZONTAL
  ├─ switch                     — INSTANCE
  └─ content                    — VERTICAL
       ├─ label                 — TEXT, always visible
       └─ description           — TEXT, always visible
```

### switch-item — Type=Choice Card

```
switch-item                     — HORIZONTAL, border + radius/lg, padding: spacing/component/lg
  ├─ switch                     — INSTANCE
  └─ content                    — VERTICAL
       ├─ label                 — TEXT
       └─ description           — TEXT
```

---

## Token Bindings

### switch — per Checked × State

| Checked | State | Track fill | Thumb fill | Stroke | Stroke weight | Stroke align | Opacity |
|---|---|---|---|---|---|---|---|
| `False` | `Default` | `color/border/default` | `color/background/default` | — | — | — | — |
| `True` | `Default` | `color/brand/primary` | `color/background/default` | — | — | — | — |
| `False` | `Disabled` | `color/border/default` | `color/background/default` | — | — | — | `opacity/disabled` |
| `True` | `Disabled` | `color/brand/primary` | `color/background/default` | — | — | — | `opacity/disabled` |
| `False` | `Focus` | `color/border/default` | `color/background/default` | `color/ring` | 2px | OUTSIDE | — |
| `True` | `Focus` | `color/brand/primary` | `color/background/default` | `color/ring` | 2px | OUTSIDE | — |

All variants: track and thumb both use `radius/full`. Thumb fill is always `color/background/default` regardless of checked state.

Disabled uses `opacity/disabled` on the entire switch frame — no separate token for track or thumb.

### switch-item — text tokens per State

| State | `label` | `description` |
|---|---|---|
| `Default`, `Focus` | `color/background/default/foreground` | `color/background/muted/foreground` |
| `Disabled` | `color/text/disabled` | `color/text/disabled` |
| `Invalid` | `color/text/invalid` | `color/text/secondary` |

In `Invalid` state, label uses `color/text/invalid` to carry the error signal · description stays `color/text/secondary` to remain readable as supporting context. Do not use `color/status/danger-subtle/foreground` — that token requires a `danger-subtle` background; switch-item stays on `color/background/default`.

### switch-item — Choice Card frame per State

| State | Card stroke | Stroke weight | Stroke align | Card fill | Radius | Padding |
|---|---|---|---|---|---|---|
| `Default` | `color/border/default` | 1px | INSIDE | — | `radius/lg` | `spacing/component/lg` |
| `Disabled` | `color/border/disabled` | 1px | INSIDE | — | `radius/lg` | `spacing/component/lg` |
| `Invalid` | `color/border/error` | 1px | INSIDE | — | `radius/lg` | `spacing/component/lg` |
| `Focus` | `color/border/focus` | 1px | INSIDE | — | `radius/lg` | `spacing/component/lg` |

> Choice Card Focus uses `color/border/focus` (1px, INSIDE) — not the 2px OUTSIDE ring. Because the card always has a visible border, focus is indicated by changing the border color rather than adding an outer ring. Basic and Description Focus show no frame-level focus ring — focus is expressed through the embedded `switch` sub-component's own 2px ring.

### switch-item — spacing

| Type | Property | Token |
|---|---|---|
| Basic | gap (switch → label) | `spacing/component/sm` |
| Choice Card | padding (all sides) | `spacing/component/lg` |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `switch` (WAI-ARIA) — announces as "on" or "off" |
| Touch target | `switch` Default is 44×24px — height is below 44px; wrap item row in `min-h-[44px]` in implementation |
| Focus indicator | `color/ring` · 2px · OUTSIDE on `switch` sub-component · Choice Card focus changes border to `color/border/focus` |
| Keyboard | `Tab` to focus · `Space` to toggle |
| Screen reader name | Visible label text is the accessible name |
| State announcement | `aria-checked="true"` / `aria-checked="false"` — browser announces "on"/"off" |

---

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| `Default / Checked=False` | Initial state | Track uses muted border fill — unchecked appearance |
| `Default / Checked=True` | User toggles on | Track fills with `color/brand/primary` |
| `Disabled` | `disabled` prop | Entire switch at `opacity/disabled` — no hover, focus, or toggle |
| `Focus` | Tab key | 2px `color/ring` OUTSIDE on switch frame |
| `Invalid` | Form validation failure | switch-item label switches to `color/text/invalid` · description stays `color/text/secondary` — the switch indicator itself does not change appearance |

Switch is always a binary control — it has no indeterminate state. Toggling is immediate; no confirmation step.

---

## Usage Rules

- Use `switch-item` in forms and settings — never `switch` alone in a row where a label is expected.
- `Type=Basic` — single-line setting with a short, self-explanatory label. Use when no supporting context is needed.
- `Type=Description` — use when the label needs a clarifying sentence. Keep descriptions to one line.
- `Type=Choice Card` — use when the option is significant enough to warrant a distinct card surface (e.g. plan features, major preferences). Cards add visual weight — use sparingly.
- `Invalid` state indicates the switch value fails validation (e.g. a required toggle was left off). Pair with an error message below the field in implementation.
- Do not use `switch` as a substitute for a checkbox. Switch = immediate effect on toggle. Checkbox = value submitted with a form.

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Notification settings: "Enable push notifications" — toggling applies immediately, no Save button
- Account security preferences: "Two-factor authentication" — on/off, effect is instant
- App-level feature flags in a settings panel: "Show beta features", "Enable dark mode"
- Focus mode features: "Share across devices" — toggling syncs state across the user's devices right away
- Privacy controls: "Allow analytics data collection" — the change takes effect on toggle

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Type=Basic` | Short, self-explanatory setting — label alone communicates the full meaning | "Dark mode" · "Email notifications" · "Auto-save" |
| `Type=Description` | Setting needs a clarifying sentence to explain scope, impact, or current behavior | "Share across devices — Sync your focus session to all signed-in devices" |
| `Type=Choice Card` | High-stakes or visually prominent preference that warrants a card surface — used sparingly | Plan feature toggle ("Unlimited members") · Onboarding preference with description |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Instant effect on toggle, no form submit | `switch` | `checkbox` |
| Form field submitted with a Save button (preferences page with explicit save) | `checkbox` | `switch` |
| Single required consent ("I agree to terms") | `checkbox` | `switch` |
| Multi-select list of items | `checkbox` | `switch` |
| Mutually exclusive options (pick exactly one) | `radio` | `switch` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Raw frame with hardcoded track fill | Use `switch` instance |
| `switch` alone in a form row without a label | Use `switch-item` |
| `color/status/danger-subtle/foreground` for Invalid text | `color/text/invalid` — danger-subtle/foreground requires a danger-subtle background |
| Override track fill directly on instance | Switch the `Checked` prop |
| Choice Card Focus with 2px OUTSIDE ring | Choice Card uses `color/border/focus` 1px INSIDE — the border changes colour, no outer ring |
