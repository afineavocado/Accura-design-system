# Slider

A range input control that lets users select a value by dragging a thumb along a track. Supports horizontal and vertical orientations, with Default, Disabled, and Focus states.

---

## Variant Matrix

**Component set:** `slider` · ID `67:9199` · 6 variants

| Property | Options | Default |
|---|---|---|
| `Orientation` | `Horizontal`, `Vertical` | `Horizontal` |
| `State` | `Default`, `Disabled`, `Focus` | `Default` |

All 2 orientations × 3 states = 6 variants.

No Size variant — the track thickness (8px) and thumb size (20×20px) are fixed across all uses.

---

## Component Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `Orientation` | VARIANT | `Horizontal` | Layout direction of the track |
| `State` | VARIANT | `Default` | Interaction state |

No boolean props, no text content, no instance swaps — this is a pure shape component. Value percentage is represented visually by the `range` layer width (horizontal) or height (vertical).

---

## Structure

All variants share the same 3-layer structure. Layers are not auto-layout children — they are absolutely positioned within the variant frame.

```
slider                        — variant frame (280×20px horizontal · 20×160px vertical)
  ├─ track    (RECTANGLE)     — full-width/height background bar · 8px thick · radius/full
  ├─ range    (RECTANGLE)     — filled portion · same thickness · radius/full · overlays track
  └─ thumb    (ELLIPSE)       — drag handle · 20×20px · sits at the end of range
```

**Horizontal:** track is 280px wide × 8px tall. Thumb is vertically centered on the track.

**Vertical:** track is 8px wide × 160px tall. Thumb is horizontally centered on the track.

The `range` layer represents the current value — its width (horizontal) or height (vertical) is set by the designer to show a specific percentage in static mockups. In code this is driven by the value prop.

---

## Token Bindings

### Fills — all variants

| Layer | Token | Notes |
|---|---|---|
| `track` | `color/surface/muted` | Unfilled portion of the track — component-level neutral fill |
| `range` | `color/brand/primary` | Filled/selected portion — always brand primary |
| `thumb` | `color/background/default` | White fill — contrasts against track and range |

### Strokes — per State

| State | Layer | Token | Weight | Align |
|---|---|---|---|---|
| `Default` | `thumb` | `color/brand/primary` | 2px | INSIDE |
| `Disabled` | `thumb` | `color/brand/primary` | 2px | INSIDE |
| `Focus` | `thumb` | `color/ring` | 2px | OUTSIDE |

`track` and `range` have no stroke.

### Radius — all variants

| Layer | Token | Value |
|---|---|---|
| `track` | `radius/full` | 9999px |
| `range` | `radius/full` | 9999px |
| `thumb` | — | ELLIPSE shape — inherently circular, no radius binding needed |

### Disabled state

| Property | Token | Value |
|---|---|---|
| Variant-level opacity | `opacity/disabled` | 60% |

The Disabled variant applies `opacity/disabled` to the entire variant frame. No fill or stroke tokens change — only opacity. This matches the shadcn pattern: `disabled:opacity-50`.

---

## Accessibility

| Property | Value |
|---|---|
| Role | `slider` |
| Touch target | Thumb is 20×20px — minimum 44×44px hit area required in implementation (`min-w-[44px] min-h-[44px]` or wrapper padding) |
| Focus indicator | `color/ring` stroke · 2px · OUTSIDE · on the `thumb` ELLIPSE |
| Keyboard | `Tab` to focus · Arrow keys to increment/decrement · `Home`/`End` for min/max |
| Screen reader | `aria-valuenow`, `aria-valuemin`, `aria-valuemax` — implementation responsibility |

The `State=Focus` variant shows the focus ring on `thumb` only — not on the full slider frame. This matches browser behavior where focus lands on the thumb handle, not the track.

No Hover state exists in this component. shadcn's CSS hover treatment (thumb scale) is an implementation concern — it does not require a Figma variant.

---

## Behavior

| State | Triggered by | Notes |
|---|---|---|
| `Default` | Resting / interactive | Track + range shown at chosen value percentage |
| `Focus` | `Tab` key · click on thumb | `color/ring` stroke (2px, outside) on thumb only |
| `Disabled` | `disabled` prop | Entire component at 60% opacity · not interactive · no hover or focus |

The slider has no Hover variant. Hover feedback (cursor change, thumb scale) is handled in CSS only.

**Value representation in Figma:** set the `range` layer's width (horizontal) or height (vertical) manually to depict a specific value. Example: 70% value on a 280px horizontal track = `range` width 196px, thumb positioned at x=186.

---

## Usage Rules

- Use `Orientation=Horizontal` for standard left-to-right value selection (volume, price range, progress).
- Use `Orientation=Vertical` for vertical controls — equaliser-style or height-constrained layouts.
- Always pair with a visible label and a value readout in implementation — the slider alone does not communicate the current value to screen readers.
- Do not use the slider for binary on/off selection — use a Toggle instead.
- Do not use for navigation or progress indication — use a Progress component for read-only values.

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Volume or playback speed control — user drags to an approximate level, exact value matters less than feel
- Brightness or display contrast setting in system preferences
- Price range filter on an e-commerce search results page — "Min $0 — Max $500"
- AI model temperature or creativity parameter — 0.0 to 1.0, continuous approximate value
- Image editing: opacity, blur radius, or saturation — visual feedback updates in real time as the user drags

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Orientation=Horizontal` | Standard left-to-right value selection — the default for almost all cases | Volume control · Price range · Opacity slider · AI temperature |
| `Orientation=Vertical` | Height-constrained layouts or vertical equivalents like equaliser bands | Audio equaliser · Column height selector in a chart builder |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Approximate value in a continuous range, precision not required | `slider` | `input` (number) |
| Exact numeric value required (quantity, port number, amount) | `input` (`type="number"`) | `slider` |
| Binary on/off control | `switch` | `slider` |
| Read-only progress display (upload %, task completion) | `progress` | `slider` |
| User picks from a small discrete set of named levels | `radio` | `slider` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Raw rectangle as track with hardcoded color | Use `slider` instance, set `State` and `Orientation` |
| Set `range` fill directly as an override | The fill is always `color/brand/primary` — do not override per-instance |
| Use `color/background/muted` on track | `color/surface/muted` — track is a component-level surface, not page canvas |
| Manually draw a focus ring for keyboard states | Use `State=Focus` — the ring is bound to `color/ring` and pre-configured |
| Use a range with height > track height | Range and track must share the same thickness (8px) |
