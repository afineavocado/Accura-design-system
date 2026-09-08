# Sheet

A slide-in panel that appears from the edge of the viewport, overlaying the page without fully replacing it. Built on [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) (same primitive as Dialog), wrapped by shadcn as `Sheet`. The distinction from Dialog is positional — Sheet slides in from a screen edge and is typically used for secondary tasks, filters, navigation, or detail panels that benefit from staying spatially connected to the triggering context.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `sheet` | `98:57748` | 2 | Full sheet panel — header, body slot, footer |

---

## Variant Matrix

### `sheet` — `Side`

| Property | Options | Default |
|---|---|---|
| `Side` | `Horizontal`, `Vertical` | `Horizontal` |

`Side(2) = 2 variants`

**`Side=Horizontal`** — 380px wide, full viewport height. Maps to `side="left"` or `side="right"` in code. Use for side panels: filters, detail views, navigation drawers, settings panels.

**`Side=Vertical`** — Full viewport width, 423px tall. Maps to `side="top"` or `side="bottom"` in code. Use for bottom sheets on mobile-style layouts, command palettes, or contextual menus that span the full width.

---

## Structure

Both variants share identical layer structure — only dimensions differ.

```
sheet                           — COMPONENT, V AUTO-LAYOUT
                                  fill: color/surface/overlay
                                  stroke: color/border/default 1px
                                  radius: radius/lg
                                  no root padding · no gap

  ├─ sheet-header               — FRAME, H AUTO-LAYOUT
  │                               padding (all sides): spacing/component/lg (16px)
  │                               gap: spacing/component/md (12px)
  │    ├─ text-block            — FRAME, V AUTO-LAYOUT, gap: spacing/component/sm (8px)
  │    │    ├─ title            — TEXT, fill: color/surface/overlay/foreground
  │    │    └─ description      — TEXT, fill: color/text/secondary
  │    └─ close-button          — INSTANCE (Button, variant=Ghost, size=Icon Small — 36×36)

  ├─ sheet-body                 — SLOT, V AUTO-LAYOUT
  │                               padding (all sides): spacing/component/lg (16px)
  │                               radius: radius/md
  │                               (replace with any content)

  └─ sheet-footer               — FRAME, V AUTO-LAYOUT
                                  stroke: color/border/default (top separator)
                                  padding (all sides): spacing/component/lg (16px)
                                  gap: spacing/component/sm (8px)
       ├─ btn-primary           — INSTANCE (button, Primary, fill width)
       └─ btn-secondary         — INSTANCE (button, Outline, fill width)
```

### Dimensions

| Variant | Width | Height |
|---|---|---|
| `Side=Horizontal` | 380px | 720px (full viewport height) |
| `Side=Vertical` | 1200px (full viewport width) | 423px |

---

## Close button

The close control is a **Button instance** — `variant="ghost"`, `size="icon-sm"` — not a bare icon. It inherits ghost hover, focus ring and the pill radius from Button, so it cannot drift from the rest of the system.

> **Spec corrected 2026-09-08: 32×32 → 36×36.** Button has no 32×32 icon size — its icon sizes are 36 (Small), 40 (Default) and 44 (Large). The spec asked for a size the component set does not provide, so the code had been rendering a bare 16×16 icon instead. Icon Small is the closest real size.
>
> ⚠️ 36×36 is still below the WCAG 2.5.5 minimum of 44×44 — the same accepted constraint that applies to every Small button in the system. Add hit-area padding if the close control needs to meet AAA.

---

## Token Bindings

### Shell

| Property | Token |
|---|---|
| Fill | `color/surface/overlay` |
| Stroke | `color/border/default` 1px |
| Radius | `radius/lg` |

### `sheet-header`

| Layer | Property | Token |
|---|---|---|
| root | Padding (all sides) | `spacing/component/lg` (16px) |
| root | Gap | `spacing/component/md` (12px) |
| `text-block` | Gap | `spacing/component/sm` (8px) |
| `title` | Fill | `color/surface/overlay/foreground` |
| `description` | Fill | `color/text/secondary` |

### `sheet-body` (SLOT)

| Property | Token |
|---|---|
| Padding (all sides) | `spacing/component/lg` (16px) |
| Radius | `radius/md` |

### `sheet-footer`

| Layer | Property | Token |
|---|---|---|
| root | Stroke (top separator) | `color/border/default` |
| root | Padding (all sides) | `spacing/component/lg` (16px) |
| root | Gap | `spacing/component/sm` (8px) |
| `btn-primary` | Fill | `button/primary/bg/bg` |
| `btn-secondary` | Fill / Stroke | `button/outline/bg/bg` / `button/outline/border/default` |

Both footer buttons are full-width (`fill container`) — the sheet footer stacks them vertically.

---

## Behavior

### Architecture

Sheet is built on **Radix UI Dialog** with a `side` prop that controls which edge the panel slides in from. Shadcn re-exports `Sheet`, `SheetTrigger`, `SheetPortal`, `SheetOverlay`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`, and `SheetClose`.

```tsx
import {
  Sheet, SheetTrigger, SheetContent,
  SheetHeader, SheetTitle, SheetDescription,
  SheetFooter, SheetClose,
} from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button>Open filters</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
      <SheetDescription>Narrow your results.</SheetDescription>
    </SheetHeader>
    {/* sheet-body content */}
    <SheetFooter>
      <SheetClose asChild><Button variant="outline">Reset</Button></SheetClose>
      <Button>Apply</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### `side` prop

| Figma variant | Code value | Slides in from |
|---|---|---|
| `Side=Horizontal` | `side="right"` (default) or `side="left"` | Right or left edge |
| `Side=Vertical` | `side="bottom"` or `side="top"` | Bottom or top edge |

Default: `side="right"`.

### Open / Close

**Open:** via `SheetTrigger`, or controlled with `open` + `onOpenChange`.

**Close triggers:**
- Clicking the backdrop (`SheetOverlay`) — dismisses by default
- Pressing `Escape`
- Clicking `SheetClose` (the `close-button` in `sheet-header`, or any button wrapped in `SheetClose`)

**Prevent backdrop close:** pass `onInteractOutside={(e) => e.preventDefault()}` on `SheetContent`.

### Focus trap

Focus is trapped inside `SheetContent` while open (Radix UI Dialog default). Tab cycles through all focusable elements. Focus returns to the trigger on close.

### Animation

Slides in from the edge specified by `side`. Radix uses `data-state="open"` / `data-state="closed"` on `SheetContent`. Shadcn applies CSS translate animations matched to each side direction.

### Sheet vs Dialog

| | Sheet | Dialog |
|---|---|---|
| Position | Edge of viewport — slides in | Centered — fades in |
| Use for | Secondary tasks, filters, nav, detail panels | Focused interruptions, confirmations, short forms |
| Dismissal | Escape, backdrop, close button | Escape, backdrop, close button |
| Underlying primitive | Radix UI Dialog | Radix UI Dialog |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `role="dialog"` with `aria-modal="true"` (Radix UI Dialog default) |
| Label | `aria-labelledby` auto-points to `<SheetTitle>` |
| Description | `aria-describedby` auto-points to `<SheetDescription>` |
| Focus trap | Active while open |
| Focus return | Returns to trigger on close |
| Escape | Always closes |
| `SheetTitle` | Required — use `<VisuallyHidden>` if not visually shown |

### Keyboard

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move focus within the sheet |
| `Escape` | Close the sheet |
| `Enter` / `Space` | Activate focused button |

---

## Body Slot

`sheet-body` is a SLOT — replace it with any content appropriate to the sheet's purpose:

| Use case | Body content |
|---|---|
| Filter panel | Form fields, checkboxes, range sliders |
| Detail view | Read-only data, metadata, activity feed |
| Navigation drawer | `nav-panel-link` list, section headings |
| Settings panel | Toggle rows, select fields, `item` components |
| Command / search | Input field + result list |

The body has 16px padding on all sides and `radius/md` applied. Content placed in the slot inherits this padding context.

---

## Usage Rules

- Use Sheet for **secondary tasks** that don't require the user to lose context of the page behind — filters, quick edits, detail previews, navigation
- Use Dialog instead when the task is a **focused interruption** that requires the user's full attention before returning (confirmations, destructive actions, multi-step flows)
- Use `Side=Horizontal` for panels that are **spatially related to content on the left or right** — detail panels, sidebars, filter drawers
- Use `Side=Vertical` for panels that **span the full width** — bottom sheets on mobile-first layouts, global command palettes, contextual action menus
- Always include `<SheetTitle>` — even with `<VisuallyHidden>` — so screen readers announce the panel purpose
- The `sheet-footer` buttons are full-width by design — do not place footer buttons in a horizontal row inside a `Side=Horizontal` sheet; the narrow width makes vertical stacking the correct choice
- Keep `sheet-body` scrollable in code when content may exceed the available height — apply `overflow-y: auto` and let the header and footer remain fixed

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- User clicks "Filters" in a data table and a right panel slides in with filter controls, keeping the table visible behind it
- Selecting a row in a list opens a detail panel on the right showing the record's full information without navigating away
- A settings sidebar slides in from the right when the user clicks the gear icon in the top nav
- A mobile-style page uses a bottom sheet (`Side=Vertical`) as a global command palette that spans the full width
- An "Edit contact" action opens a side panel so the user can see the contact record while editing it
- A left-side navigation drawer slides in on a responsive layout when the hamburger menu is tapped

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Horizontal` | Panels that are spatially related to left/right content — 380px wide, full height | Filter drawer · Record detail panel · Settings sidebar · Edit form |
| `Vertical` | Panels that span the full viewport width — bottom or top edge, typically mobile-first | Bottom action sheet · Full-width command palette · Contextual action menu on mobile |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Secondary contextual task without losing page context | `sheet` | `dialog` |
| Blocking decision required before the user can proceed | `dialog` | `sheet` |
| Bottom-anchored panel on mobile with swipe-to-dismiss gesture | `drawer` | `sheet` |
| Destructive confirmation ("Delete account?") | `alert-dialog` | `sheet` |
| Persistent vertical nav along the left edge | `sidebar` | `sheet` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use Sheet for a destructive confirmation ("Delete account?") | Use Alert Dialog — Sheet is not semantically appropriate for critical decisions |
| Put full-page navigation inside a sheet | Use a dedicated navigation layout — sheets are for supplementary panels |
| Override fills inside `btn-primary` or `btn-secondary` from the sheet parent | Change the button variant prop — never repaint sub-component internals |
| Omit `<SheetTitle>` | Always include it, even hidden |
| Use `Side=Vertical` for a tall form | Use `Side=Horizontal` — vertical sheets are wide and short, not suited for tall content |
| Forget `overflow-y: auto` on `sheet-body` when content is long | Sheet body does not scroll by default in code — you must add it |
