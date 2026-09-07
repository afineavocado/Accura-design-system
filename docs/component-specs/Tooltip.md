# Tooltip

Floating label that appears on hover or focus to provide supplementary context for an element. Built from two components: `bubble` (the content pill) and `tooltip` (the full positioned composite with arrow).

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `bubble` | `74:1682` | 1 | Sub-component — the rounded pill with text label |
| `tooltip` | `74:1699` | 4 | Full tooltip — bubble + directional arrow, one per side |

---

## Variant Matrix

### `tooltip`

| Property | Options | Default |
|---|---|---|
| `Side` | `Top`, `Bottom`, `Left`, `Right` | `Top` |

4 variants — one per arrow direction.

---

## Structure

### `bubble` (sub-component)

```
bubble                          — HORIZONTAL, radius/md, padding: spacing/component/md × spacing/component/xs-plus
  └─ label                      — TEXT
```

### `tooltip`

```
tooltip                         — no layout, transparent fill
  ├─ bubble                     — INSTANCE of bubble sub-component
  └─ arrow                      — FRAME, transparent fill
       └─ arrow-shape           — VECTOR (the directional caret)
```

The outer `tooltip` frame has no fill and no layout mode — position of `bubble` and `arrow` is fixed per variant to reflect the correct side.

---

## Token Bindings

### Component tokens — tooltip-specific (Components collection)

| Token | Alias | Light | Dark |
|---|---|---|---|
| `tooltip/bg` | `color/background/inverted` | zinc/900 `#18181b` — dark bubble on light page | zinc/50 `#fafafa` — light bubble on dark page |
| `tooltip/fg` | `color/background/inverted/foreground` | white `#ffffff` — text on dark bubble | black `#000000` — text on light bubble |

These alias **semantic tokens** — `color/background/inverted` and its foreground pair. The tooltip auto-inverts per mode: dark label in light mode, light label in dark mode. This provides correct contrast against both page backgrounds without needing a separate dark-mode component token.

### `bubble` — fills

| Layer | Token |
|---|---|
| `bubble` fill | `tooltip/bg` |
| `label` fill | `tooltip/fg` |

### `bubble` — spacing

| Property | Token | Value |
|---|---|---|
| `paddingLeft` | `spacing/component/md` | 12px |
| `paddingRight` | `spacing/component/md` | 12px |
| `paddingTop` | `spacing/component/xs-plus` | 6px |
| `paddingBottom` | `spacing/component/xs-plus` | 6px |

### `bubble` — radius

| Property | Token |
|---|---|
| All 4 corners | `radius/md` |

### `tooltip` variants — fills

| Layer | Fill |
|---|---|
| Outer `tooltip` frame | Transparent — no fill |
| `arrow` frame | Transparent — no fill |
| `arrow-shape` (VECTOR) | `tooltip/bg` |

Arrow inherits the same `tooltip/bg` token so it always matches the bubble in both light and dark mode.

### `label` — text style

| Property | Value |
|---|---|
| Text style | `label/sm` |

---

## Behavior

### Show / hide

| Trigger | Action |
|---|---|
| Mouse enters trigger | Start **300ms** delay timer (`delayDuration=300` — system default); show when timer completes |
| Mouse leaves trigger during delay | Cancel timer — tooltip never shows |
| Mouse leaves trigger after shown | Hide immediately (no delay) |
| Move to a second trigger within **300ms** of leaving the first | Second tooltip opens immediately — no delay (`skipDelayDuration=300`) |
| Mouse moves from trigger into tooltip content | Tooltip **stays open** — hoverable content is enabled by default (`disableHoverableContent=false`) |
| Mouse leaves tooltip content | Hide immediately |
| Trigger receives keyboard focus | Show immediately — no delay |
| Trigger loses focus (blur) | Hide immediately |
| `Escape` key | Hide immediately |

Source: Radix UI Tooltip — Radix default is `delayDuration=700`. **This system overrides it to `300`** — set `<TooltipProvider delayDuration={300}>` at the app root. `skipDelayDuration` stays at `300`.

> If you want the tooltip to close when the mouse moves from trigger to content (no hoverable zone), set `disableHoverableContent={true}` on the Provider.

### Positioning

- Default side: `Top` — used unless there is insufficient viewport space
- Flip order: `Top` → `Bottom` → `Left` → `Right` — the tooltip repositions to the first side with enough room
- The `arrow-shape` always points toward the trigger regardless of which side is active
- Tooltip never clips outside the viewport — clamps to a safe inset if needed

### Z-index

Tooltip sits above all page content and overlays but below modal dialogs. Recommended z-index layer: `popover` (typically 1000–1100 depending on the project stack).

### No interactive content

Tooltip is read-only — do not place buttons, links, or form fields inside it. If interaction is needed, use a Popover instead.

---

## Accessibility

| Property | Value |
|---|---|
| Role | `tooltip` (WAI-ARIA) |
| Trigger | `aria-describedby` on the trigger element pointing to the tooltip `id` |
| Show on | Focus and hover |
| Dismiss | `Escape` key or moving focus away |
| Delay | 300ms show delay (`delayDuration=300` on `TooltipProvider`) — fast enough to feel responsive, slow enough to prevent flash on quick mouse pass |
| Never | Do not put interactive content inside a tooltip — use a popover instead |

---

## Usage Rules

- Use `Side=Top` by default — flip to other sides when there is insufficient space
- Tooltip text should be short — one line preferred, two lines maximum
- Do not use tooltips on mobile — hover is unavailable; use visible labels or a popover instead
- The trigger element must be focusable (button, link, input) — do not attach tooltips to non-interactive elements
- `bubble` is the source of truth for text and colour — never override its internal fills from the `tooltip` instance

---

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Labelling an icon-only button so keyboard and mouse users know what it does ("Archive", "Share", "Delete")
- Revealing the full text of a truncated cell or label when the container is too narrow to show it
- Surfacing a keyboard shortcut hint alongside a toolbar action ("Bold — ⌘B")
- Explaining an unfamiliar setting or field label with a one-line definition on hover
- Describing what a disabled button requires before it can be activated (wrap in a `<span>` since disabled elements don't fire hover events)
- Adding supplementary context to a data point or metric label without cluttering the UI permanently

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Side=Top` | Default — use unless there is insufficient space above the trigger | Icon button labels · Truncated text · Keyboard shortcut hints |
| `Side=Bottom` | Trigger is near the top of the viewport or inside a fixed top bar | Top navigation icon buttons · App header actions |
| `Side=Left` | Trigger is near the right edge and top/bottom are also constrained | Right-docked toolbar icons · Table action column |
| `Side=Right` | Trigger is near the left edge | Left sidebar icons · Collapsed navigation items |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| The hint contains interactive content (links, buttons, form fields) | `popover` | `tooltip` (tooltip is read-only; interactive content inside it is inaccessible) |
| The explanation is long (more than two lines) or needs formatting | `popover` | `tooltip` (tooltip should be one or two lines max; longer content needs a proper overlay) |
| The user must act on the information before continuing | `dialog` (alert-dialog) | `tooltip` (tooltips are purely supplementary and dismissible) |
| The label is for a mobile touch interface | Visible label text | `tooltip` (hover is unavailable on touch; tooltips are desktop-only) |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| `color/background/default/foreground` directly on bubble fill | `tooltip/bg` — use the component alias |
| `color/background/default` directly on label fill | `tooltip/fg` — use the component alias |
| `color/surface/overlay` for tooltip bubble | `tooltip/bg` — overlay is for light floating surfaces (dropdowns, modals), not dark tooltips |
| Interactive elements inside tooltip | Use a Popover component instead |
| Tooltip on a `<div>` or `<span>` without a role | Trigger must be natively focusable |
