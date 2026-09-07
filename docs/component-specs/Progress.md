# Progress

A horizontal progress bar for communicating operation completion percentage or indeterminate loading state. Built on [Radix UI Progress](https://www.radix-ui.com/primitives/docs/components/progress), wrapped by shadcn.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `progress` | `110:8283` | 9 | Progress bar — track + fill indicator |

---

## Variant Matrix

### `progress` — `State × Size`

| Property | Options | Default |
|---|---|---|
| `State` | `Loading`, `Complete`, `Indeterminate` | `Loading` |
| `Size` | `SM`, `MD`, `LG` | `MD` |

`State(3) × Size(3) = 9 variants`

---

## State Guide

**`State=Loading`** — Determinate progress. `value` is a number 0–99. The fill bar represents percentage complete. Pair with a programmatic `value` prop that updates as the operation advances.

**`State=Complete`** — `value=100`. Fill bar spans the full track width. Use this state when the operation finishes — transition from Loading to Complete by setting `value={100}`.

**`State=Indeterminate`** — `value` is `null` or `undefined`. Radix sets `data-state="indeterminate"` on the root and omits `aria-valuenow`. Use for operations with no measurable percentage — file processing, server-side jobs, unknown duration tasks. Requires a CSS animation on the indicator to communicate activity.

---

## Size Guide

| Size | Height | When to use |
|---|---|---|
| `SM` | 4px | Compact contexts — inline with text, inside table cells, tight layouts |
| `MD` | 8px | Default — general use, cards, panels |
| `LG` | 12px | Prominent status — onboarding steps, upload progress, large feature areas |

---

## Structure

```
progress                        — COMPONENT, H fill, radius: radius/full
                                  fill: color/background/muted
  └─ fill                       — FRAME, width driven by value%, radius: radius/full
                                  fill: color/brand/primary
```

The `fill` frame's width is set in code via CSS transform: `translateX(-${100 - value}%)`. In Figma the fill width is fixed per variant (representing a typical loaded state).

---

## Token Bindings

### Container (root COMPONENT)

| Property | Token | Notes |
|---|---|---|
| Fill | `color/background/muted` | Track background — muted to recede behind the indicator |
| Radius (all 4) | `radius/full` | Pill shape — matches fill layer |

### `fill` frame (indicator bar)

| State | Fill | Notes |
|---|---|---|
| `Loading` | `color/brand/primary` | Brand-colored progress indicator |
| `Complete` | `color/status/success` | Green fill signals successful completion — Figma confirmed `110:8283` |
| `Indeterminate` | `color/brand/primary` | Same as Loading; animation communicates activity |
| Radius (all 4) | `radius/full` | Must match container radius to avoid clipping artefacts |

> **Spec correction (2026-06-02):** Original markdown stated `color/brand/primary` for all states. Figma audit confirmed `State=Complete` uses `color/status/success`. Figma is authoritative.

### Dimensions

| Size | Height |
|---|---|
| `SM` | 4px |
| `MD` | 8px |
| `LG` | 12px |

Width: `fill` (fills parent container). The component itself has no fixed width in code — it stretches to its layout context.

---

## Behavior

### Architecture

`progress` is built on **Radix UI Progress** (`@radix-ui/react-progress`). The shadcn wrapper exposes the same props.

```tsx
import { Progress } from "@/components/ui/progress"

<Progress value={60} />                  // 60% complete
<Progress value={100} />                 // Complete
<Progress value={null} />                // Indeterminate
<Progress value={75} max={200} />        // Custom max
```

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number \| null` | `null` | 0–`max` for determinate; `null` for indeterminate |
| `max` | `number` | `100` | Maximum value — used to compute percentage |
| `getValueLabel` | `(value, max) => string` | `"${value}%"` | Custom accessible label for `aria-valuetext` |
| `className` | `string` | — | Applied to the root element |

### State transitions

`State=Loading → State=Complete`: update `value` to `100`. No separate state prop needed — the Figma State dimension is for design documentation only; in code it is entirely driven by `value`.

`State=Indeterminate`: pass `value={null}` (or omit `value`). Add a CSS keyframe animation to the indicator element — Radix does not include one by default. Target `[data-state="indeterminate"]` on the root or the indicator.

```css
/* Example indeterminate animation */
[data-state="indeterminate"] > [data-radix-progress-indicator] {
  animation: progress-indeterminate 1.5s ease-in-out infinite;
}
@keyframes progress-indeterminate {
  0%   { transform: translateX(-100%); }
  50%  { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}
```

### Value → width mapping

Radix sets a CSS custom property `--radix-progress-indicator-transform` on the indicator element. The shadcn wrapper uses `transform: translateX(var(--radix-progress-indicator-transform))` to drive the fill width. This means the fill always spans 100% of the track; its position is shifted left to simulate partial width, rather than being resized.

### Animation

Shadcn adds a CSS `transition` on the indicator for smooth value changes (Radix UI default: no animation). Transition applies to the `transform` property. Duration is implementation-defined — check `globals.css` or the Progress component styles in your project.

---

## Accessibility

| Property | Value |
|---|---|
| Role | `progressbar` (Radix sets `role="progressbar"` on the root) |
| `aria-valuemin` | `0` (always) |
| `aria-valuemax` | `max` prop value (default `100`) |
| `aria-valuenow` | `value` — omitted when `value` is `null` (indeterminate) |
| `aria-valuetext` | Output of `getValueLabel(value, max)` — default: `"${value}%"` |
| Indeterminate label | `aria-valuetext` is omitted; screen readers announce the `progressbar` role with no percentage — provide surrounding context text instead |

### Keyboard

Progress bars are not interactive — they have no keyboard interaction. Ensure surrounding context (label, description) communicates the current state to keyboard and screen reader users.

---

## Usage Rules

- Always pair with a visible label that names what is progressing — "Uploading…", "Processing files", "Step 2 of 5"
- Use `State=Indeterminate` when you cannot compute a percentage — never fake progress with a slow-moving determinate bar
- Use `State=Complete` as a final state before unmounting — give users a moment to register success before removing the component
- Keep the progress bar full-width of its container or a clearly intentional fixed width — avoid arbitrary partial widths in layout
- Use `Size=SM` only when horizontal space is genuinely constrained — `Size=MD` is the default for a reason
- Do not use progress for page load spinners — use a spinner or skeleton instead; progress implies measurable advancement

---

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Showing file upload completion percentage as a user uploads a document or image
- Tracking multi-step onboarding — "Step 2 of 5" with the bar showing 40% complete
- Displaying a profile completeness score ("Your profile is 70% complete")
- Showing a storage quota usage bar in account settings ("2.1 GB of 5 GB used")
- Indicating that a background server-side job is running when no percentage is available (Indeterminate)
- Confirming an import or export has finished by transitioning to State=Complete before unmounting

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `State=Loading` | Determinate progress — a known percentage that updates as the operation advances | File upload bar · Onboarding step tracker · Storage quota fill |
| `State=Complete` | Operation has finished — show briefly before unmounting to confirm success | Upload complete · Import finished · All steps done |
| `State=Indeterminate` | Operation is running but no percentage can be computed | Server-side processing · Background sync · Unknown-duration task |
| `Size=SM` | Compact contexts where the bar is a supporting detail | Inside a table cell · Inline with a label in a dense layout |
| `Size=MD` | General use — cards, panels, settings pages | Default for most progress bars |
| `Size=LG` | Prominent status — onboarding, large feature areas, hero progress | Onboarding wizard header · Upload progress in a full-panel uploader |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Loading duration is unknown and no percentage can be shown | `skeleton` (content placeholder) or a spinner | `progress` State=Indeterminate (use indeterminate progress only when an active operation is clearly running, not for passive page loads) |
| A single binary action (save, submit) needs a loading indicator | A loading `button` or spinner | `progress` (progress implies measurable advancement across stages, not a momentary action) |
| Content is loading on initial page load and the structure should be visible | `skeleton` | `progress` (skeleton preserves layout; progress does not) |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Animate `State=Indeterminate` by fake-advancing `value` from 0→99 | Pass `value={null}` and animate with CSS on `[data-state="indeterminate"]` |
| Use progress for a single binary action (save, submit) | Use a spinner or loading button — progress is for multi-step or measurable operations |
| Leave a complete progress bar visible indefinitely | Transition to Complete state, then unmount after a short delay (500–1000ms) |
| Override the fill color from a parent component | Change the `className` on `<Progress>` or extend the token — never paint over the sub-component |
| Omit a label | Always pair with surrounding text that names what is progressing |
