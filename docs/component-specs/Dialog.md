# Dialog

A modal overlay that interrupts the user to present focused content or collect input. Built on [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog), wrapped by shadcn. Renders as a full-screen backdrop with a centered popup panel; focus is trapped inside until dismissed.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `dialog` | `266:131` | 4 | Full dialog composition — backdrop + popup panel |

---

## Variant Matrix

### `dialog` — `Type`

| Property | Options | Default |
|---|---|---|
| `Type` | `Form`, `No close button`, `Sticky footer`, `Scrollable` | `Form` |

`Type(4) = 4 variants`

---

## Type Guide

**`Type=Form`** — A simple dialog with a `content` header (title + description), two input fields, two content slots, and an inline `footer` with cancel and action buttons. Use for short, focused data-collection tasks: editing a name, entering a URL, confirming with a text field.

**`Type=No close button`** — A dialog with only a `content` section (title + description) and no footer or close button. Dismissal is only via Escape or clicking the backdrop. Use for informational prompts where no action is required, or for multi-step flows where navigation is handled programmatically.

**`Type=Sticky footer`** — A taller dialog with a sticky `heading` (title + description + close button), a scrollable `body`, and a sticky `footer` with a distinct background and top border. The footer stays visible as body content scrolls. Use for longer forms, terms and conditions, rich content review, or any dialog where the action buttons must always be reachable.

**`Type=Scrollable`** — Same sticky `heading` structure but no footer. The `body` scrolls freely. Use for read-only content that may be long — changelogs, privacy policies, previews — where the only exit is the close button or Escape.

---

## Structure

### `Type=Form`

```
dialog                          — COMPONENT, no fill (transparent wrapper)
  ├─ backdrop                   — FRAME, fill: color/background/inverted
  │                               (full-bleed dark overlay behind popup)
  └─ popup                      — FRAME, V AUTO-LAYOUT
                                  fill: color/surface/default
                                  stroke: color/border/default 1px INSIDE
                                  radius: radius/lg
                                  padding (all sides): spacing/component/lg (16px)
                                  gap: spacing/component/lg (16px)
       ├─ content               — FRAME, V AUTO-LAYOUT, gap: spacing/component/xs (4px)
       │    ├─ title            — TEXT, fill: color/surface/default/foreground
       │    └─ description      — TEXT, fill: color/text/secondary
       ├─ input-field           — INSTANCE (input-field component)
       ├─ Slot 1                — SLOT (custom content placeholder)
       ├─ Slot 2                — SLOT (custom content placeholder)
       ├─ input-field           — INSTANCE (input-field component)
       └─ footer                — FRAME, H AUTO-LAYOUT, gap: spacing/component/sm (8px)
            ├─ cancel           — INSTANCE (button, Outline)
            └─ action           — INSTANCE (button, Primary)
```

### `Type=No close button`

```
dialog
  ├─ backdrop                   — same as Form
  └─ popup                      — same container tokens as Form
       └─ content               — FRAME, V AUTO-LAYOUT, gap: spacing/component/xs
            ├─ title            — TEXT, fill: color/surface/default/foreground
            └─ description      — TEXT, fill: color/text/secondary
```

> No footer, no close button. Dismiss via Escape or backdrop click only.

### `Type=Sticky footer` / `Type=Scrollable`

```
dialog
  ├─ backdrop                   — same
  └─ popup                      — FRAME, V AUTO-LAYOUT, no root padding, no gap
                                  fill: color/surface/default
                                  stroke: color/border/default 1px INSIDE
                                  radius: radius/lg
       ├─ heading               — FRAME, V AUTO-LAYOUT
       │                          padding T/B: spacing/component/xl (24px)
       │                          padding L/R: spacing/component/lg (16px)
       │                          gap: spacing/component/xs (4px)
       │    ├─ title            — TEXT, fill: color/surface/default/foreground
       │    ├─ description      — TEXT, fill: color/text/secondary
       │    └─ action           — INSTANCE (Ghost Icon button — close ×)
       ├─ body                  — FRAME, V AUTO-LAYOUT, scrollable
       │                          padding L/R: spacing/component/lg (16px)
       │                          gap: spacing/component/xs (4px)
       │    └─ description      — TEXT, fill: color/text/secondary
       └─ footer                — FRAME, H AUTO-LAYOUT          ← Sticky footer only
                                  fill: color/background/subtle
                                  stroke: color/border/subtle (top border)
                                  padding (all sides): spacing/component/lg (16px)
                                  gap: spacing/component/xs (4px)
            ├─ cancel           — INSTANCE (button, Outline)
            └─ action           — INSTANCE (button, Primary)
```

> `Type=Scrollable` has no `footer` — only `heading` + `body`.

---

## Token Bindings

### `backdrop`

| Property | Token | Notes |
|---|---|---|
| Fill | `color/background/inverted` | Dark semi-transparent scrim behind the popup |

### `popup` — all Types

| Property | Token |
|---|---|
| Fill | `color/surface/default` |
| Stroke | `color/border/default` 1px INSIDE |
| Radius (all 4) | `radius/lg` |

### `popup` padding — by Type

| Type | Padding | Token |
|---|---|---|
| `Form`, `No close button` | All sides 16px | `spacing/component/lg` |
| `Sticky footer`, `Scrollable` | None on popup root — applied per section | — |

### `heading` (Sticky footer / Scrollable only)

| Property | Token |
|---|---|
| Padding T/B | `spacing/component/xl` (24px) |
| Padding L/R | `spacing/component/lg` (16px) |
| Gap | `spacing/component/xs` (4px) |

### `content` / `heading` text layers

| Layer | Token |
|---|---|
| `title` | `color/surface/default/foreground` |
| `description` | `color/text/secondary` |

### `footer` — Sticky footer only

| Property | Token | Notes |
|---|---|---|
| Fill | `color/background/subtle` | Subtle tint distinguishes sticky footer from scrollable body |
| Stroke | `color/border/subtle` | Top separator line |
| Padding (all sides) | `spacing/component/lg` (16px) | |
| Gap | `spacing/component/xs` (4px) | |

### `footer` — Form (inline)

| Property | Token |
|---|---|
| Gap | `spacing/component/sm` (8px) |

---

## Behavior

### Architecture

Dialog is built on **Radix UI Dialog** (`@radix-ui/react-dialog`). Shadcn re-exports `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, and `DialogClose`.

```tsx
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription, DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes to your profile here.</DialogDescription>
    </DialogHeader>
    {/* form fields, content */}
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Open / Close

**Open:** controlled via `open` + `onOpenChange` props, or uncontrolled via `defaultOpen`. Typically triggered by a `<DialogTrigger>`.

**Close triggers (Radix UI defaults):**
- Clicking the `backdrop` (`DialogOverlay`) — dismisses by default
- Pressing `Escape` — always dismisses
- Clicking a `<DialogClose>` button (the × in `heading`, or the cancel button wrapped in `DialogClose`)

**Prevent backdrop close:** pass `onInteractOutside={(e) => e.preventDefault()}` on `DialogContent` to disable backdrop dismiss — use only when the task requires explicit confirmation (e.g. destructive actions).

### Focus trap

Radix UI traps focus inside `DialogContent` when open (Radix UI default). Tab cycles through all focusable elements inside the dialog. Focus is returned to the trigger element when the dialog closes.

**Initial focus:** by default, focus moves to the first focusable element inside `DialogContent`. Override with `autoFocus` on a specific element.

### Scroll behavior

**`Type=Form` / `Type=No close button`:** no internal scroll — popup grows with content. If content exceeds the viewport, the popup itself may overflow; avoid putting long content in these types.

**`Type=Scrollable`:** the `body` section scrolls independently. `heading` stays fixed at the top. Apply `overflow-y: auto` and a `max-height` to `body` in code.

**`Type=Sticky footer`:** same as Scrollable — `body` scrolls, `heading` and `footer` stay fixed. Apply `overflow-y: auto` + `max-height` to `body`; `footer` uses `position: sticky` or flex layout to remain visible.

### Animation

Radix Dialog uses `data-state="open"` / `data-state="closed"` on `DialogContent` and `DialogOverlay`. Shadcn wires CSS keyframe animations to these attributes. Default: fade-in + slight scale-up on open, reverse on close.

---

## Accessibility

| Property | Value |
|---|---|
| Role | `DialogContent` renders `role="dialog"` with `aria-modal="true"` |
| Label | `aria-labelledby` automatically points to `<DialogTitle>` |
| Description | `aria-describedby` automatically points to `<DialogDescription>` |
| Focus trap | Active while dialog is open — Tab stays inside (Radix UI default) |
| Focus return | Returns to trigger element on close (Radix UI default) |
| Escape | Always closes the dialog (Radix UI default) |
| `DialogTitle` | Required — do not omit; screen readers announce it on open. Use `<VisuallyHidden>` if a visible title isn't desired |
| `DialogDescription` | Recommended — omit only if the dialog's purpose is fully clear from the title alone |

### Keyboard

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move focus between focusable elements inside the dialog |
| `Escape` | Close the dialog |
| `Enter` / `Space` | Activate the focused button |

---

## Slots

`Type=Form` provides `Slot 1` and `Slot 2` between the input fields for additional content — checkboxes, selects, helper text rows, or any custom form element.

---

## Usage Rules

- Use dialogs for tasks that **require the user's full attention** before returning to the page — editing, confirming, collecting input
- Use `Type=Form` for short forms (2–4 fields); use `Type=Sticky footer` for longer forms where the submit button must always be visible
- Use `Type=No close button` only when the flow is linear and has no cancel path — rare; most dialogs should be dismissible
- Use `Type=Scrollable` for read-only long content (terms, changelogs, previews) — not for forms
- Always include `<DialogTitle>` — even if hidden with `<VisuallyHidden>` — so screen readers can announce the dialog purpose
- Keep dialog content focused on **one task** — if a dialog needs multiple independent sections, consider a drawer or a separate page instead
- The `cancel` button in `footer` should always be wrapped in `<DialogClose>` — it must dismiss the dialog, not just be a button
- Do not nest dialogs — open only one dialog at a time; if a secondary confirmation is needed, use an Alert Dialog over the existing dialog

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- User clicks "Edit profile" and must save or cancel before returning to the page
- User triggers a destructive action (delete record, revoke access) that requires a short confirmation form before proceeding
- An onboarding flow needs to collect a name and email before the user can continue
- A "Create workspace" action requires 2–3 fields that should not navigate the user away
- Terms of service must be reviewed and accepted before an action completes
- A file upload triggers a rename dialog that must be resolved before the upload proceeds

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Form` | Short, focused data-collection tasks with 2–4 fields and inline footer buttons | Edit display name · Set a due date · Rename a file |
| `No close button` | Linear flows with no cancel path, or informational prompts where no action is required | Session expired notice · Programmatically-advanced wizard step · Mandatory notice acknowledgement |
| `Sticky footer` | Longer forms or content reviews where the action buttons must always stay reachable | Multi-field create form · Terms and conditions acceptance · Settings review before publish |
| `Scrollable` | Read-only long content where the only exit is dismiss | Changelog · Privacy policy · Preview of generated content |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| User must make a decision or complete a task before returning to the page | `dialog` | `sheet` |
| Simple "Are you sure?" with no form fields | `alert-dialog` | `dialog` |
| Secondary task that benefits from staying spatially connected to page content | `sheet` | `dialog` |
| Non-blocking status update that auto-dismisses | `toast` | `dialog` |
| Bottom-anchored quick action on mobile | `drawer` | `dialog` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use a dialog for simple confirmations ("Are you sure?") | Use Alert Dialog — it's semantically distinct and has `role="alertdialog"` |
| Use `Type=No close button` for destructive actions | Always provide an explicit exit path for destructive flows |
| Put a very long form in `Type=Form` | Use `Type=Sticky footer` so action buttons stay reachable |
| Omit `<DialogTitle>` | Always include it — use `<VisuallyHidden>` if not visually desired |
| Override fills inside `cancel` or `action` buttons from the dialog parent | Change the button's variant prop — never repaint sub-component internals |
| Disable backdrop dismiss (`onInteractOutside`) without providing another dismiss path | If backdrop click is blocked, the close button in `heading` must be present |
| Open a dialog from inside another dialog | One dialog at a time — use Alert Dialog stacked over if a second confirmation is critical |
