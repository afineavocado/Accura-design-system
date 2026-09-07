# Toast

A temporary notification component for system feedback — confirmations, errors, warnings, and async operation status. Built on [Sonner](https://sonner.emilkowal.ski/) by Emil Kowalski, wrapped by shadcn. Renders as a floating overlay above all content; dismissed automatically after a timeout or by the user.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `toast` | `105:666` | 5 | Full notification row — always use this |

---

## Variant Matrix

### `toast` — `Type`

| Property | Options | Default |
|---|---|---|
| `Type` | `Default`, `Success`, `Error`, `Warning`, `Loading` | `Default` |

`Type(5) = 5 variants`

---

## Type Guide

**`Type=Default`** — No leading icon. Text-only notification. Use for neutral, informational messages where no status is implied — a setting saved, a copy action completed, a generic confirmation.

**`Type=Success`** — Check icon (`color/icon/success`). Use for completed operations where the user needs affirmative feedback: form submitted, file saved, payment processed, invite sent.

**`Type=Error`** — Alert icon (`color/icon/danger`). Use for failed operations. Always pair with a description that names what failed and, where possible, what the user can do next.

**`Type=Warning`** — Warning icon (`color/icon/warning`). Use for cautionary feedback — an action completed with caveats, something that may have unintended consequences, or a condition that needs the user's attention soon.

**`Type=Loading`** — Spinner icon (`color/surface/overlay/foreground`). Use for async operations in progress. Has no `action-btn` — only a `close-btn`. **Persists indefinitely** — must be programmatically dismissed when the operation completes. Always pair with `toast.promise()` or a manual `toast.dismiss(id)`.

---

## Structure

### Type=Default

```
toast                           — H AUTO-LAYOUT, 356px wide, fill: color/surface/overlay
                                  stroke: color/border/default 1px · radius: radius/lg
                                  paddingT/B: spacing/component/md · paddingL/R: spacing/component/lg
                                  gap: spacing/component/md
  ├─ icon-slot                  — FRAME, 16×16, no fill (empty — no icon in Default)
  ├─ content                    — FRAME, V AUTO-LAYOUT, gap: spacing/component/xxs
  │    ├─ title                 — TEXT, fill: color/surface/overlay/foreground
  │    └─ description           — TEXT, fill: color/text/secondary
  └─ actions                    — FRAME, H AUTO-LAYOUT, gap: spacing/component/sm
       ├─ action-btn            — INSTANCE (button, Type=Outline, Size=Small)
       └─ close-btn             — INSTANCE (button, Type=Ghost, Size=Icon Small)
```

### Type=Success / Type=Error / Type=Warning

```
toast                           — same container
  ├─ icon-slot                  — INSTANCE (icon placeholder, 16×16)
  │    └─ Icon                  — VECTOR, stroke: varies per type (see Token Bindings)
  ├─ content                    — FRAME, V AUTO-LAYOUT, gap: spacing/component/xxs
  │    ├─ title                 — TEXT, fill: color/surface/overlay/foreground
  │    └─ description           — TEXT, fill: color/text/secondary
  └─ actions                    — FRAME, H AUTO-LAYOUT, gap: spacing/component/sm
       ├─ action-btn            — INSTANCE (button, Type=Outline, Size=Small)
       └─ close-btn             — INSTANCE (button, Type=Ghost, Size=Icon Small)
```

### Type=Loading

```
toast                           — same container
  ├─ icon-slot                  — INSTANCE (icon placeholder, 16×16)
  │    └─ Icon                  — VECTOR, stroke: color/surface/overlay/foreground
  ├─ content                    — FRAME, V AUTO-LAYOUT, gap: spacing/component/xxs
  │    ├─ title                 — TEXT, fill: color/surface/overlay/foreground
  │    └─ description           — TEXT, fill: color/text/secondary
  └─ actions                    — FRAME, H AUTO-LAYOUT, gap: spacing/component/sm
       └─ close-btn             — INSTANCE (button, Type=Ghost, Size=Icon Small)
```

> `Type=Loading` has **no `action-btn`** — the action is the async operation itself. Only the close-btn is shown.

---

## Token Bindings

### Container — all Types

| Property | Token |
|---|---|
| Fill | `color/surface/overlay` |
| Stroke | `color/border/default` 1px |
| Radius | `radius/lg` |
| Padding top / bottom | `spacing/component/md` (12px) |
| Padding left / right | `spacing/component/lg` (16px) |
| Gap between children | `spacing/component/md` (12px) |

### Internal frames

| Frame | Property | Token |
|---|---|---|
| `content` | Gap | `spacing/component/xxs` (2px) |
| `actions` | Gap | `spacing/component/sm` (8px) |

### Text tokens

| Layer | Token | Notes |
|---|---|---|
| `title` | `color/surface/overlay/foreground` | Paired to `color/surface/overlay` container fill |
| `description` | `color/text/secondary` | Supporting text — universal secondary token |

### `icon-slot` — per Type

| Type | Token |
|---|---|
| `Default` | — (empty FRAME, no icon) |
| `Success` | `color/icon/success` |
| `Error` | `color/icon/danger` |
| `Warning` | `color/icon/warning` |
| `Loading` | `color/surface/overlay/foreground` (spinner — paired to container surface) |

> Status icons use standalone `color/icon/*` tokens — not `color/status/*-subtle/foreground`. The `*-subtle/foreground` tokens are only valid ON their matching subtle background. The toast container is `color/surface/overlay`, not a status surface.

### Sub-components

| Layer | Source component | Key token |
|---|---|---|
| `action-btn` | button, Type=Outline, Size=Small | `button/outline/fg/fg` (label + icons) |
| `close-btn` | button, Type=Ghost, Size=Icon Small | `button/ghost/fg/fg` (icon) |

> Never override fills or strokes inside `action-btn` or `close-btn` from the `toast` parent. Both sub-components own their token bindings. If a different button style is needed, change the sub-component's Variant prop.

---

## Behavior

### Architecture

`toast` is built on **Sonner** (by Emil Kowalski), wrapped by shadcn. It is an **imperative API** — there is no JSX to render at the call site. Instead, a single `<Toaster>` component is placed once in the root layout, and toasts are triggered by calling `toast()` anywhere in the application.

```tsx
// root layout — once only
import { Toaster } from "@/components/ui/sonner"
<Toaster />

// anywhere in the app
import { toast } from "sonner"
toast("Settings saved.")
toast.success("File uploaded.")
toast.error("Upload failed.", { description: "Check your network and try again." })
toast.warning("Session expires in 5 minutes.")
const id = toast.loading("Uploading…")
toast.dismiss(id)
```

### Toast types

| Figma Type | JS call | Behavior |
|---|---|---|
| `Default` | `toast(message)` | Neutral — auto-dismissed after 4000ms |
| `Success` | `toast.success(message)` | Auto-dismissed after 4000ms |
| `Error` | `toast.error(message)` | Auto-dismissed after 4000ms |
| `Warning` | `toast.warning(message)` | Auto-dismissed after 4000ms |
| `Loading` | `toast.loading(message)` | **Persists indefinitely** — no auto-dismiss |

### Auto-dismiss

Default duration: **4000ms** (Sonner default). Override per-call:

```tsx
toast.error("Something went wrong.", { duration: 6000 })
toast.success("Copied!", { duration: 2000 })
toast("Never dismiss this.", { duration: Infinity })
```

### Promise pattern

`toast.promise()` automatically transitions from `Type=Loading` to `Type=Success` or `Type=Error` based on the promise resolution:

```tsx
toast.promise(uploadFile(), {
  loading: "Uploading…",
  success: "File uploaded successfully.",
  error: "Upload failed.",
})
```

The Loading toast persists for the duration of the promise, then auto-dismisses after the success/error message is shown.

### Dismiss

**Auto-dismiss:** after `duration` ms (see above).
**Swipe:** users can swipe a toast to dismiss it. Swipe direction follows the toast position (swipe right for right-anchored, swipe down for bottom positions). `dismissible: true` by default.
**Close button:** `close-btn` (Ghost, Icon Small) is always visible in the Figma component. In code, pass `closeButton` prop to `<Toaster closeButton />` to enable globally, or pass `{ closeButton: true }` per toast.
**Programmatic:** `toast.dismiss(id)` or `toast.dismiss()` to clear all.

### Action button

The `action-btn` maps to Sonner's `action` option:

```tsx
toast("File deleted.", {
  action: {
    label: "Undo",
    onClick: () => restoreFile(),
  },
})
```

Clicking the action button **dismisses the toast** unless `event.preventDefault()` is called inside `onClick`.

### `<Toaster>` defaults

| Prop | Default | Notes |
|---|---|---|
| `position` | `bottom-right` | Options: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` |
| `visibleToasts` | `3` | Max toasts shown simultaneously; older ones are hidden beneath |
| `expand` | `false` | When `true`, toasts fan out on hover instead of stacking |
| `closeButton` | `false` | Pass `closeButton` prop to `<Toaster>` to enable globally |
| `richColors` | `false` | When `true`, Success/Error/Warning use colored fills matching the type |
| `offset` | `32px` | Distance from screen edge |
| `mobileOffset` | `16px` | Applied when screen width < 600px |
| `duration` | `4000` | Default ms; override per call |
| `hotkey` | `Alt + T` | Keyboard shortcut to focus the toaster region |

---

## Accessibility

| Property | Value |
|---|---|
| Region | `<Toaster>` renders as `role="region"` with `aria-label="Notifications"` |
| Live region | Toast messages are announced via `aria-live="polite"` — screen readers read them without interrupting the current focus |
| Error toasts | Consider `aria-live="assertive"` for critical errors — configure via Sonner's `toastOptions.aria` |
| Close button | Accessible label provided by the Ghost button source component |
| Hotkey | `Alt + T` focuses the Toaster region; users can then Tab to individual toasts |

### Keyboard

| Key | Action |
|---|---|
| `Alt + T` | Focus the toaster notification region |
| `Tab` | Move focus between the action button and close button within a toast |
| `Enter` / `Space` | Activate the focused button (action or close) |
| `Escape` | Dismiss the focused toast |

---

## Usage Rules

> **Choose Type by semantic meaning, not visual preference.**
>
> - `Type=Default` — neutral confirmation; no status implied
> - `Type=Success` — operation completed successfully
> - `Type=Error` — operation failed; user may need to act
> - `Type=Warning` — completed with a caveat, or attention needed
> - `Type=Loading` — operation in progress; must be programmatically resolved

> **Toasts are for system events, not user decisions or form errors.**
>
> - Use toasts for feedback the system gives after an action (save, upload, delete, sync)
> - Use Alert Dialog for decisions that require confirmation before acting
> - Use inline field validation for form input errors — not a toast

> **Always provide a resolution path for Loading and Error.**
>
> - `Type=Loading`: always pair with `toast.promise()` or call `toast.dismiss(id)` when done — a loading toast with no resolution is a bug
> - `Type=Error`: always write a description that names what failed and what the user can do — "Something went wrong" is not enough

- Set `duration` to match reading time: 2000ms for brief success confirmations, 4000ms (default) for standard messages, 6000ms or longer for error messages the user must read and act on
- Show at most one toast per user action — deduplicate at the call site if the action can fire multiple times
- The `action-btn` is for a single, immediately reversible action (Undo, Retry, View) — never use it for destructive confirmation
- Hide `description` only when the `title` is fully self-explanatory on its own
- Place `<Toaster>` once in the root layout — never inside a page component or route

---

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Confirming a settings save ("Settings saved.") immediately after the user clicks Save
- Reporting the result of an async file upload — transitioning from Loading to Success or Error via `toast.promise()`
- Notifying the user that a background sync completed or failed while they were working elsewhere on the page
- Providing an Undo action after a soft-delete ("Contact removed" + Undo button)
- Alerting the user to a session or quota warning that appeared while they were mid-task ("Storage 90% full.")
- Confirming a copy-to-clipboard or share-link action that has no visible side effect ("Link copied.")

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Default` | Neutral confirmation with no status implication | "Link copied." · "Comment posted." · "Preference saved." |
| `Success` | Operation completed successfully and the user should know | "File uploaded successfully." · "Payment processed." · "Invite sent." |
| `Error` | Operation failed — user may need to act | "Upload failed — check your connection." · "Could not send message." · "Session expired." |
| `Warning` | Completed with caveats, or attention needed soon | "Saved with warnings." · "Storage 90% full." · "Some recipients were skipped." |
| `Loading` | Async operation in progress; duration unknown | "Uploading…" · "Generating report…" · "Sending…" — always paired with `toast.promise()` |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A persistent message that stays on screen until the user acts (e.g. a form error, an expiry warning) | `alert` | `toast` (toast auto-dismisses and may be missed) |
| The user must make a decision before continuing (confirm a destructive action) | `dialog` (alert-dialog) | `toast` (toast is non-blocking and cannot capture a decision) |
| A form field validation error that the user needs to fix before submitting | Inline field error text | `toast` (toasts are for system-level feedback, not per-field input errors) |
| Feedback that must persist indefinitely (legal notice, critical outage banner) | `alert` | `toast` (even `duration: Infinity` toasts lack the persistent, in-context placement of an alert) |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use `Type=Loading` without a dismiss path | Always pair with `toast.promise()` or explicitly call `toast.dismiss(id)` |
| Use a toast to ask "Are you sure?" | Use Alert Dialog — toasts are not for decisions |
| Show multiple toasts for the same repeated event | Debounce or deduplicate at the call site |
| Write a description that repeats the title verbatim | Description adds next-step context, detail, or the cause of the issue |
| Override `action-btn` or `close-btn` fills from the toast parent | Change the button's variant prop — never repaint sub-component internals |
| Use `Type=Error` for form field validation errors | Use inline validation on the field — toasts are for system-level failures |
| Place `<Toaster>` inside a page or route component | Place it once in the root layout only |
| Use `duration: Infinity` without a programmatic dismiss | Any non-auto-dismissed toast must have a close button or action that dismisses it |
