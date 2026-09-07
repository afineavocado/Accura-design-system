# Drawer

A sliding panel that emerges from an edge of the screen (or centres as an overlay on large screens) to present supplementary content, forms, or actions without navigating away from the current view. Built on shadcn/ui Drawer (Vaul).

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `drawer` | `74:691` | 3 | Full drawer panel — Direction controls which edge it slides from |

---

## Variant Matrix

| Property | Options | Default |
|---|---|---|
| `Direction` | `Bottom`, `Right`, `Responsive` | `Bottom` |

`Direction × 3 = 3 variants`

---

## Structure

### Direction=Bottom

```
drawer                          — VERTICAL AUTO LAYOUT, radius/lg top · RAW:0 bottom
                                  fill: color/surface/default, stroke: color/border/default
  ├─ handle-bar                 — FRAME, paddingTop/Bottom: spacing/component/lg
  │    └─ handle                — FRAME, 100×8px, fill: color/background/muted, radius/full
  ├─ header                     — FRAME, padding: spacing/component/lg, gap: spacing/component/xxs
  │    ├─ title                 — TEXT
  │    └─ description           — TEXT
  ├─ content                    — SLOT, padding: spacing/component/lg (all sides)
  └─ footer                     — FRAME, padding: spacing/component/lg, gap: spacing/component/sm
       ├─ btn-primary           — INSTANCE (Type=Default, State=Enabled, Size=Default)
       └─ btn-outline           — INSTANCE (Type=Outline, State=Enabled, Size=Default)
```

### Direction=Right

```
drawer                          — VERTICAL AUTO LAYOUT, radius/lg left corners · RAW:0 right corners
                                  fill: color/surface/default, stroke: color/border/default
  ├─ header                     — FRAME, padding: spacing/component/lg, gap: spacing/component/xxs
  │    ├─ title                 — TEXT
  │    └─ description           — TEXT
  ├─ content                    — SLOT, padding: spacing/component/lg (all sides)
  └─ footer                     — FRAME, padding: spacing/component/lg, gap: spacing/component/sm
       ├─ btn-primary           — INSTANCE (Type=Default, State=Enabled)
       └─ btn-outline           — INSTANCE (Type=Outline, State=Enabled)
```

### Direction=Responsive

```
drawer                          — VERTICAL AUTO LAYOUT, radius/lg all 4 corners
                                  fill: color/surface/default, stroke: color/border/default
  ├─ header                     — FRAME, padding: spacing/component/lg, gap: spacing/component/xxs
  │    ├─ title                 — TEXT
  │    └─ description           — TEXT
  ├─ content                    — SLOT, padding: spacing/component/lg (all sides)
  └─ footer                     — FRAME, padding: spacing/component/lg, gap: spacing/component/sm
       ├─ btn-primary           — INSTANCE (Type=Default, State=Enabled)
       └─ btn-outline           — INSTANCE (Type=Outline, State=Enabled)
```

`Direction=Responsive` is `Bottom` on mobile viewports and switches to a centred floating panel (all-corner radius) on larger screens.

---

## Token Bindings

### Container

| Property | Token | Notes |
|---|---|---|
| Fill | `color/surface/default` | Drawer is a floating panel — matches shadcn --card (zinc/900 dark) |
| Stroke | `color/border/default` 1px INSIDE | Provides edge definition against backdrop |
| Radius — Direction=Bottom | `radius/lg` top-left · top-right · `0` bottom | Rounded cap on the exposed edge |
| Radius — Direction=Right | `radius/lg` top-left · bottom-left · `0` right | Rounded cap on the exposed edge |
| Radius — Direction=Responsive | `radius/lg` all 4 corners | Floats as a centred panel |

### handle (Direction=Bottom only)

| Layer | Property | Token |
|---|---|---|
| `handle-bar` | paddingTop / paddingBottom | `spacing/component/lg` |
| `handle` | Fill | `color/background/muted` |
| `handle` | Radius (all 4 corners) | `radius/full` |
| `handle` | Size | 100 × 8px (fixed) |

### header

| Layer | Property | Token |
|---|---|---|
| `header` frame | Padding (all 4 sides) | `spacing/component/lg` |
| `header` frame | `itemSpacing` (gap) | `spacing/component/xxs` |
| `title` | Fill | `color/background/default/foreground` |
| `description` | Fill | `color/background/muted/foreground` |

### content SLOT

| Property | Token |
|---|---|
| Padding (all 4 sides) | `spacing/component/lg` |

The `content` layer is a SLOT — replace its contents with your own layout.

### footer

| Layer | Property | Token |
|---|---|---|
| `footer` frame | Padding (all 4 sides) | `spacing/component/lg` |
| `footer` frame | `itemSpacing` (gap) | `spacing/component/sm` |
| `btn-primary` | Type | `Default` (primary fill) — FILL width |
| `btn-outline` | Type | `Outline` — FILL width |

---

## Direction Guide

| Direction | When to use |
|---|---|
| `Bottom` | Mobile-first flows — forms, filters, action menus. Handle bar signals draggability. |
| `Right` | Desktop side panels — detail views, settings, inspector panes. |
| `Responsive` | Components that must work across breakpoints — switches from Bottom (mobile) to centred floating panel (desktop). |

---

## Behavior

### Open / close

| Trigger | Action |
|---|---|
| Trigger element clicked | Drawer slides in from its edge; backdrop fades in |
| `Escape` key | Drawer slides out; focus returns to trigger |
| Backdrop (scrim) clicked | Drawer slides out; focus returns to trigger |
| `btn-outline` (Cancel) clicked | Drawer closes — wire to the same dismiss handler as Escape |
| `btn-primary` (Submit) clicked | Executes action; drawer closes on success (implementation-controlled) |

### Animation

- **Direction=Bottom:** slides up from the bottom edge; easing `ease-out` on enter, `ease-in` on exit
- **Direction=Right:** slides in from the right edge; same easing
- **Direction=Responsive:** Bottom animation on mobile, fade + scale from centre on desktop
- Recommended duration: 300ms enter · 200ms exit
- Backdrop: fade from `opacity: 0` to `opacity: 0.5` (implementation uses `color/background/overlay` or equivalent scrim token)

### Drag to dismiss (Direction=Bottom only)

- The `handle-bar` area is the drag affordance — user swipes down to dismiss
- Dismiss threshold: dragged past **25%** of the drawer height (`closeThreshold` defaults to `0.25` in Vaul)
- Below threshold: drawer snaps back to fully open position
- Configurable: `closeThreshold` accepts a value between 0 and 1 — set to `0.5` for a halfway threshold
- Drag-to-dismiss can be disabled entirely with `dismissible={false}`
- The `handle` pill does not need to be interactive in Figma — drag is a gesture, not a click

### Scroll

- `content` SLOT scrolls vertically when its content exceeds the available height
- `header` and `footer` remain fixed at top and bottom — they do not scroll with content
- Scroll indicator (fade or shadow) is implementation-defined; not represented in Figma

### Focus management

- On open: focus moves to the first focusable element inside the drawer (typically the first form field or `btn-primary`)
- Focus is trapped — `Tab` and `Shift+Tab` cycle only within the drawer while it is open
- On close: focus returns to the element that triggered the drawer

### Stacking

Only one drawer should be open at a time. Drawers do not nest. If a secondary action is needed from inside an open drawer, use a modal dialog or inline expansion instead.

---

## Accessibility

| Property | Value |
|---|---|
| Role | `dialog` with `aria-modal="true"` |
| Label | `aria-labelledby` pointing to the `title` element |
| Description | `aria-describedby` pointing to the `description` element (if present) |
| Focus | Focus trapped inside drawer while open; returns to trigger on close |
| Close | `Escape` key closes; clicking the backdrop (scrim) closes |
| Handle | `aria-hidden="true"` — decorative drag affordance, no interactive role |
| Scroll | If content overflows, the `content` slot scrolls; header and footer stay fixed |

---

## Usage Rules

- Use `Direction=Bottom` for mobile-first flows and short-form content (filters, quick settings, confirmation)
- Use `Direction=Right` for desktop side panels where the user continues to reference the main content
- Use `Direction=Responsive` when the same component must work on both mobile and desktop without a separate implementation
- The footer always holds the primary confirm action (`btn-primary`) above the cancel/secondary action (`btn-outline`) — never reverse this order
- Do not put navigation inside a drawer — use a nav panel or sidebar instead
- Keep `title` to one line; `description` to two lines maximum
- The `content` SLOT takes any layout — form fields, lists, media — but avoid deeply nested interactive trees

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- User taps a "Filter" button on a mobile search page — a bottom sheet slides up with filter controls
- A confirmation sheet asks "Are you sure you want to delete this?" before a destructive action on mobile
- A quick-settings tray opens from the bottom of a dashboard on a phone
- A right-side inspector panel slides in on a desktop canvas app when an object is selected
- A component that must work on both mobile and desktop uses the Responsive direction to show bottom on phone, floating panel on desktop
- An action menu with 2–4 primary choices slides up from the bottom of a mobile list view

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Bottom` | Mobile-first flows; short forms, filters, or action confirmations anchored to the bottom edge | Mobile filter panel · Quick share menu · Delete confirmation on phone |
| `Right` | Desktop side panels where the user continues to reference the main content | Object inspector · User detail sidebar · Settings panel on a wide layout |
| `Responsive` | Single component that must serve both mobile and desktop without separate implementations | Shared filter component used across breakpoints · Responsive settings panel |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Bottom-anchored panel on mobile with swipe-to-dismiss | `drawer` | `sheet` |
| Side panel on desktop that slides in from left or right | `sheet` | `drawer` |
| Centered blocking modal that requires a decision before continuing | `dialog` | `drawer` |
| Non-blocking status message that auto-dismisses | `toast` | `drawer` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| `color/background/default` on drawer fill | `color/surface/default` — drawer is a floating panel (matches shadcn --card) |
| Primitive spacing tokens (`spacing/4`) in SLOT padding | `spacing/component/lg` — same 16px, correct semantic collection |
| Custom button-like frames in footer | `btn-primary` and `btn-outline` instances — change their `State` prop, never override fills |
| Radius on the screen-edge corners (Direction=Bottom bottom corners) | Leave screen-edge corners at 0 — rounded corners only on the exposed cap |
| More than 2 footer actions | Use a single primary action + one dismiss; move additional actions into the content slot |
