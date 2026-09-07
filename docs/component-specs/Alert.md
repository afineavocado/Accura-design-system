# Alert

Inline feedback banners for system-level messages. Three variants: Default (neutral), Destructive (error), Warning (caution). Non-blocking — does not steal focus or require a decision.

> **Separated:** `alert-dialog` (overlay modal) now has its own doc → see `AlertDialog.md`

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `alert` | `74:1777` | 12 | Inline banner — Default, Destructive, Warning |
| `alert-dialog` | `152:3240` | 8 | Overlay modal — Default or Destructive |

---

## Variant Matrix

### alert

| Property | Options | Default |
|---|---|---|
| `Variant` | `Default`, `Destructive`, `Warning` | `Default` |
| `Has Icon` | `True`, `False` | `True` |
| `Has Action` | `True`, `False` | `False` |

All 3 variants × 2 icon × 2 action = 12 variants.

### alert-dialog

| Property | Options | Default |
|---|---|---|
| `Align` | `Left`, `Center` | `Left` |
| `Footer` | `Inline`, `Full-width` | `Inline` |
| `Type` | `Default`, `Destructive` | `Default` |

All 2 align × 2 footer × 2 types = 8 variants.

---

## Structure

### alert

The internal layout differs by variant combination. Two distinct structures exist:

**Flat layout** — `Has Icon=False` + `Has Action=False`
```
alert                           — HORIZONTAL, radius/lg, padding: spacing/component/lg
                                  gap: spacing/component/sm (8px)
  ├─ title                      — TEXT
  └─ description                — TEXT
```

**Nested layout** — `Has Icon=True` OR `Has Action=True` (or both)
```
alert                           — HORIZONTAL, radius/lg, padding: spacing/component/lg
                                  gap: spacing/component/md (12px)
  ├─ icon                       — INSTANCE (Icon Placeholder) — present when Has Icon=True
  ├─ content                    — VERTICAL, gap: spacing/component/xxs (2px)
  │    ├─ title                 — TEXT
  │    └─ description           — TEXT
  └─ action-slot                — INSTANCE (Button) — present when Has Action=True
```

### alert-dialog

```
alert-dialog                    — VERTICAL, radius/lg, padding: spacing/component/xl
                                  gap: spacing/component/lg
  ├─ icon-container             — FRAME — present in Default and Destructive
  └─ content                    — VERTICAL
       ├─ title                 — TEXT
       ├─ description           — TEXT
       └─ footer                — buttons (Inline or Full-width layout)
```

---

## Token Bindings

### alert — frame per Variant

| Variant | Fill | Stroke | Stroke weight | Stroke align | Radius | Padding |
|---|---|---|---|---|---|---|
| `Default` | `color/background/default` | `color/border/default` | 1px | INSIDE | `radius/lg` | `spacing/component/lg` |
| `Destructive` | `color/background/default` | `color/border/error` | 1px | INSIDE | `radius/lg` | `spacing/component/lg` |
| `Warning` | `color/yellow/50` ⚠️ | `color/yellow/200` ⚠️ | 1px | INSIDE | `radius/lg` | `spacing/component/lg` |

### alert — gaps

| Layout | Property | Token | Value | Notes |
|---|---|---|---|---|
| Flat (no icon, no action) | Container gap (title ↔ description) | `spacing/component/sm` | 8px | title and description are direct children |
| Nested (icon or action present) | Container gap (icon ↔ content or content ↔ action) | `spacing/component/md` | 12px | icon + content frame + action are siblings |
| Nested | Content frame gap (title ↔ description) | `spacing/component/xxs` | 2px | tight stack inside the content frame |

> ⚠️ Warning variant uses primitive tokens (`color/yellow/50`, `color/yellow/200`). No semantic `color/status/warning-*` tokens have been confirmed for this context. Do not copy this pattern to new components — flag for a design decision on semantic warning tokens.

### alert — icon per Variant

| Variant | `icon` fill/stroke |
|---|---|
| `Default` | `color/background/default/foreground` |
| `Destructive` | `color/icon/danger` |
| `Warning` | `color/icon/warning` |

### alert — text per Variant

| Variant | `title` | `description` |
|---|---|---|
| `Default` | `color/background/default/foreground` | `color/background/muted/foreground` |
| `Destructive` | `color/text/invalid` | `color/text/secondary` |
| `Warning` | `color/yellow/900` ⚠️ | `color/yellow/800` ⚠️ |

In `Destructive`, title uses `color/text/invalid` to carry the error signal · description uses `color/text/secondary` to remain readable as supporting context. Do not use `color/status/danger-subtle/foreground` here — that token requires a `danger-subtle` background; alert sits on `color/background/default`.

### alert — action-slot button

`action-slot` is a **named FRAME** (not a native Figma SLOT node) that is shown or hidden via the `Has Action` boolean prop. It is **typed** — it must always contain a Button instance. Do not place any other component inside it.

When `Has Action=True`, the `action-slot` contains a button instance. The button manages its own token bindings — the alert component must not override any fill or stroke inside it.

| Layer inside action-slot | Correct token | Owner |
|---|---|---|
| `action-slot` fill | `button/primary/bg/bg` | Button component — do not touch |
| `action-slot › description` text | `button/primary/fg/fg` | Button component — do not touch |
| `action-slot › icon` stroke | `color/brand/primary/foreground` | Button component — do not touch |

> **The button's variant, not overrides, controls its appearance.** If the Destructive alert needs a different action style (e.g. a secondary or outline button), swap the button's `Type` prop. Never repaint a child layer inside the button instance to "match" the alert's color scheme — the button background and text are a coupled pair and must change together via the component's own tokens.

### alert — icon-container per Variant

`alert` does not apply a fill to the icon-container frame — the icon itself carries the semantic color.

### alert-dialog — frame

| Property | Value |
|---|---|
| Fill | `color/surface/overlay` |
| Stroke | `color/border/default` · 1px · INSIDE |
| Radius | `radius/lg` |
| Padding | `spacing/component/xl` |
| Gap | `spacing/component/lg` |

### alert-dialog — icon-container per Type

| Type | `icon-container` fill |
|---|---|
| `Default` | `color/background/muted` |
| `Destructive` | `color/status/danger-subtle` |

The icon-container fill matches the semantic surface — icon-container in Destructive sits on `danger-subtle`, so its icon may use `color/status/danger-subtle/foreground`.

### alert-dialog — text

| Layer | Token |
|---|---|
| `title` | `color/surface/overlay/foreground` |
| `description` | `color/text/secondary` |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `alert` or `alertdialog` (WAI-ARIA) |
| Live region | Inline `alert` should use `role="alert"` — browser announces content automatically on render |
| Focus management | `alert-dialog` must trap focus within the modal; first focusable element receives focus on open |
| Keyboard (dialog) | `Escape` to dismiss · `Tab` / `Shift+Tab` to move within footer buttons |
| Icon alt text | Decorative icons (`aria-hidden="true"`) — meaning conveyed by title text |
| Color contrast | `color/text/invalid` on `color/background/default` must meet 4.5:1 minimum |

---

## Behavior

| Variant | Triggered by | Notes |
|---|---|---|
| `Default` | Info / success messages | Neutral surface; no urgency |
| `Destructive` | Error or destructive action feedback | Red border + `color/text/invalid` text — signals failure or danger |
| `Warning` | Caution messages | Yellow surface with primitive tokens — see token note above |

`Has Action=True` adds a link or button inline within the banner — use for actionable feedback (e.g. "Retry", "Undo"). `Has Action=False` is for passive notification only.

`alert-dialog` is modal — it blocks all page interaction until the user dismisses it. Use only for messages that require an explicit user decision before proceeding.

---

## Usage Rules

- Use `alert` (inline) for feedback that does not block the user — form submission errors, async status, warnings about a section.
- Use `alert-dialog` only when the user must acknowledge or decide before continuing — destructive confirmations, critical errors that prevent further action.
- `Variant=Default` — general information or success. Pair with a relevant icon (check, info).
- `Variant=Destructive` — validation failures, errors, irreversible actions. Always include a clear title. Do not use for warnings that don't require action.
- `Variant=Warning` — caution states where action is optional but recommended. Note: Warning currently uses primitive tokens; treat as a known limitation.
- Do not use `alert` as a toast or snackbar — those require a separate component with auto-dismiss logic.
- `alert-dialog` with `Type=Destructive` — always include a cancel path so the user can exit without acting.

---

## Alert vs AlertDialog vs Dialog — Decision Guide

Three components handle overlapping concerns. The wrong choice produces an incorrect ARIA role, wrong keyboard behavior, or a misleading interaction model.

### The single question to ask first

> **Can the user exit without making a decision — and is that a valid outcome?**

- **Yes, exit is valid** — `dialog` (the × button and backdrop close are neutral exits)
- **No, they must choose** — `alert-dialog` (both buttons are choices, not escape hatches)
- **No modal needed** — `alert` inline (passive feedback, no blocking)

### Decision table

| Signal | `alert` (inline) | `alert-dialog` | `dialog` |
|---|---|---|---|
| Blocks the page? | ❌ No | ✅ Yes | ✅ Yes |
| Requires a user decision? | ❌ No | ✅ Always | Sometimes |
| Has a neutral close (× or backdrop)? | N/A | ❌ No (for destructive) | ✅ Yes |
| ARIA role | `role="alert"` | `role="alertdialog"` | `role="dialog"` |
| Screen reader announcement | Auto-announces on render | Announced, focus trapped | Announced, focus trapped |
| Both buttons are real choices? | N/A | ✅ Yes (cancel ≠ close) | ❌ No (cancel = close) |
| Has form fields or rich content? | ❌ No | ❌ No | ✅ Usually |

### Concrete decision rules

**Reach for `alert` (inline) when:**
- Feedback is passive — the user doesn't need to do anything to continue
- The message appears in context on the page without stealing focus
- Examples: form field error banner, async save failure, expiry warning, success confirmation

**Reach for `alert-dialog` when:**
- Both the confirm AND cancel buttons represent real decisions (not just "close the modal")
- The action is irreversible or high-stakes — delete, revoke, overwrite, reset
- The cancel path is meaningful, not just an escape hatch
- Technically: `role="alertdialog"` is the correct ARIA role — screen readers announce it as requiring a response
- Examples: "Delete workspace?", "Revoke admin access?", "Discard unsaved changes?"

**Reach for `dialog` when:**
- Content is complex — forms, multi-step flows, rich read-only content
- The user can legitimately close without deciding (clicking × means "I changed my mind, not making a change")
- The close button is a valid neutral exit, not forcing a choice
- Examples: Edit profile form, Create project, View terms of service

### The × button rule (most common mistake)

`AlertDialog` should not have a × close button on destructive actions because closing ≠ cancelling. If a user sees "Delete workspace?" and clicks ×, they have not chosen to cancel — they have deferred the decision. `AlertDialog` forces the decision into the explicit buttons. If you find yourself adding a × to an `AlertDialog`, you likely need a `Dialog` instead.

> **Exception:** Non-destructive `AlertDialog` (informational acknowledgement, terms acceptance) can have a × if closing and cancelling are equivalent — the user is not making an irreversible choice either way.

### Ant Design analogy (useful mental model)

| Our component | Ant Design equivalent |
|---|---|
| `alert` (inline) | `Alert` |
| `alert-dialog` | `Modal.confirm()` / `Modal.warning()` |
| `dialog` | `<Modal />` (component form) |
| `toast` | `message` / `notification` |

---

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Displaying a form submission error inline below the form header so the user sees it without scrolling
- Warning a user that their free trial expires in 3 days — a persistent banner they should read but don't have to act on immediately
- Confirming a destructive action (deleting a workspace) with a modal alert-dialog before it executes
- Announcing a new feature or policy change at the top of a settings page
- Surfacing an async error after a failed save, inline in the affected section
- Blocking the user from proceeding until they acknowledge a critical configuration problem (alert-dialog)

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Default` | Neutral information, success confirmation, or a general announcement | "Your changes have been saved." · "New integration available." · "Invite sent." |
| `Destructive` | Validation failure, API error, or confirmation that something irreversible occurred | "Payment failed — check your card details." · "Could not delete project — try again." |
| `Warning` | Caution state where action is optional but advisable | "Your API key expires in 7 days." · "This action affects all team members." |
| `alert` (inline) | Feedback that does not block the user from the rest of the page | Form error banner · Status update within a section |
| `alert-dialog` (modal) | Decision required before the user can continue | "Are you sure you want to delete this workspace?" confirmation modal |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Feedback that auto-dismisses after a completed action (save, copy, send) | `toast` | `alert` (alert is persistent; toast is transient) |
| The page has loaded but there is simply no data to show | `empty` | `alert` (alert signals something wrong or noteworthy, not an empty state) |
| User must make a choice before continuing (destructive confirm, required acknowledgement) | `alert-dialog` | `toast` (toast is non-blocking and cannot capture a decision) |
| Inline validation error on a single form field | Field-level error text | `alert` (alert is for section- or page-level messages, not per-field errors) |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| `color/status/danger-subtle/foreground` for Destructive title/description | `color/text/invalid` — alert sits on `color/background/default`, not `danger-subtle` |
| `color/brand/destructive` for Destructive text | `color/brand/destructive` is a button fill token, never a text color |
| Override `action-slot › description` fill to `color/text/invalid` | The button text is `button/primary/fg/fg` — the button owns that token. A blue button with red text is broken. Change the button's Variant prop instead |
| Override any fill inside the action-slot button instance | The button component owns all its internal fills and strokes. Reach in to repaint = contract violation |
| Raw frame with hardcoded yellow fill for Warning | Use `alert` instance `Variant=Warning` — even though it uses primitive tokens internally |
| `alert-dialog` for non-blocking messages | Use inline `alert` — modal dialogs should only block when a decision is required |
| Icon with `color/icon/*` in Default | Default icon uses `color/background/default/foreground` — match the text layer |

---

## Decisions

**`action-slot` stays as BOOLEAN-controlled FRAME — buttons only, no native SLOT.**

Decided 2026-05-28. The action in an alert is always a Button instance. No other component should be placed in `action-slot`. The current BOOLEAN-controlled FRAME enforces this constraint implicitly — no conversion to a native SLOT needed.
