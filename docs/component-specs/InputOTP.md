# Input OTP

A one-time password input built from individual slot cells grouped into a single control. Built on the `input-otp` library by Guilherme Rodz, wrapped by shadcn. Two component sets: `_input-otp-slot` is the individual cell; `input-otp` is the assembled control.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `_input-otp-slot` | `58:17340` | 5 | Individual digit cell — assembled inside `input-otp` |
| `input-otp` | `58:17437` | 12 | Full OTP control — use this, never the slot directly |

---

## Variant Matrices

### `_input-otp-slot` — `State`

| Property | Options | Default |
|---|---|---|
| `State` | `Empty`, `Active`, `Filled`, `Disabled`, `Invalid` | `Empty` |

`State(5) = 5 variants`

### `input-otp` — `Type × State`

| Property | Options | Default |
|---|---|---|
| `Type` | `6-Slot`, `3+3`, `4-Slot` | `6-Slot` |
| `State` | `Empty`, `Filled`, `Disabled`, `Invalid` | `Empty` |

`Type(3) × State(4) = 12 variants`

---

## Type Guide

### `Type=6-Slot`
Six consecutive slots in a single group — the most common OTP pattern for 6-digit codes (email verification, authenticator apps).

### `Type=3+3`
Six slots split into two groups of three, separated by a dash — for codes visually formatted as `XXX–XXX`. Same total length as 6-Slot, different visual grouping.

### `Type=4-Slot`
Four consecutive slots in a single group — for 4-digit codes (PIN entry, short verification codes).

---

## Structure

### `_input-otp-slot`

```
_input-otp-slot             — 40×40px, fill: varies, stroke: varies (no radius)
  ├─ cursor                 — RECTANGLE, fill: color/background/default/foreground
  │                           (Active state only — blinking caret)
  └─ placeholder            — TEXT, fill: varies
                              (Filled state: typed digit · Disabled: masked · Invalid: digit)
```

### `input-otp` — Type=6-Slot / Type=4-Slot

```
input-otp                   — H AUTO-LAYOUT, no fill, no stroke
                              gap: spacing/component/sm
  └─ otp-group              — FRAME, stroke: varies, radius: radius/md
       ├─ _input-otp-slot   — INSTANCE × 6 (or × 4)
       └─ ...
```

### `input-otp` — Type=3+3

```
input-otp                   — H AUTO-LAYOUT, gap: spacing/component/sm
  ├─ otp-group              — FRAME, stroke: varies, radius: radius/md
  │    ├─ _input-otp-slot   — INSTANCE × 3
  │    └─ ...
  ├─ _input-otp-separator   — INSTANCE (dash "–" between groups)
  │    └─ separator         — TEXT, fill: color/background/muted/foreground
  └─ otp-group              — FRAME, stroke: varies, radius: radius/md
       ├─ _input-otp-slot   — INSTANCE × 3
       └─ ...
```

---

## Token Bindings

### `_input-otp-slot` — per state

| State | Container fill | Container stroke | `cursor` fill | `placeholder` fill |
|---|---|---|---|---|
| `Empty` | `color/input/bg` | `color/border/default` | — | — |
| `Active` | `color/input/bg` | `color/border/focus` | `color/background/default/foreground` | — |
| `Filled` | `color/input/bg` | `color/border/default` | — | `color/background/default/foreground` |
| `Disabled` | `color/surface/muted` | `color/border/disabled` | — | `color/text/disabled` |
| `Invalid` | `color/input/bg` | `color/border/error` | — | `color/background/default/foreground` |

> **No corner radius on `_input-otp-slot`.** The radius lives on `otp-group` (`radius/md`) — the slot cells are flush with each other inside the group, sharing borders. Adding radius to individual slots would break the connected-cell appearance.

> **`State=Active` uses `color/border/focus`.** This aligns with how all other interactive form controls signal keyboard focus — consistent with `input`, `select-trigger`, and `combobox-trigger` Open states.

### `otp-group` — stroke per state

| `input-otp` State | `otp-group` stroke |
|---|---|
| `Empty` | `color/border/default` |
| `Filled` | `color/border/default` |
| `Disabled` | `color/border/disabled` |
| `Invalid` | `color/border/error` |

### Separator

| Layer | Property | Token |
|---|---|---|
| `separator` TEXT | Fill | `color/background/muted/foreground` |

---

## Behavior

Source: `input-otp` library by Guilherme Rodz (`github.com/guilhermerodz/input-otp`).

### How the input works

Despite appearing as multiple individual cells, the component renders as a **single invisible HTML `<input>` element** underneath. The visual slot cells are a display layer only. This means:

- The browser treats the entire OTP control as one input field
- All standard text input keyboard shortcuts work (`Backspace`, `Delete`, `Arrow keys`, `Home`, `End`)
- The native device keyboard appears once (not per slot)
- Autofill and password managers treat it as a single field

### Slot states at runtime

| Action | Slot state |
|---|---|
| Field rendered, no input | All slots → `State=Empty` |
| User focuses the field | First unfilled slot → `State=Active` (cursor appears) |
| User types a digit | That slot → `State=Filled`; next slot → `State=Active` |
| All slots filled | All slots → `State=Filled`; no Active slot |
| `disabled` prop set | All slots → `State=Disabled` |
| `aria-invalid` set (validation fails) | All slots → `State=Invalid` |

### Copy-paste

- Pasting a string of digits automatically fills all slots from the paste — no manual slot-by-slot entry required
- iOS and Android copy-paste (including SMS autofill) is supported natively
- The `pasteTransformer` prop can strip formatting from pasted codes — e.g. converting `"123-456"` to `"123456"` before filling slots

### Pattern validation

- Default `inputMode="numeric"` — numeric keyboard on mobile
- The `pattern` prop accepts a regex — the library exports `REGEXP_ONLY_DIGITS` for digit-only inputs and `REGEXP_ONLY_DIGITS_AND_CHARS` for alphanumeric codes
- Characters not matching the pattern are rejected silently

### Caret

- The blinking caret in `State=Active` is a **fake caret** rendered in Figma as the `cursor` RECTANGLE
- In implementation the fake caret is enabled via the `hasFakeCaret` property on `InputOTPSlot` render props
- The real text cursor is hidden; the fake one animates with CSS

### Keyboard

| Key | Action |
|---|---|
| Any digit / character | Fill current slot, advance focus to next slot |
| `Backspace` | Clear current slot, move focus to previous slot |
| `Arrow Left` / `Arrow Right` | Move focus between slots |
| `Home` | Move focus to first slot |
| `End` | Move focus to last slot |
| `Tab` | Move focus out of the OTP field entirely |

---

## Accessibility

| Property | Value |
|---|---|
| Role | Single `<input>` element — `role="textbox"` |
| Length | `maxLength` prop defines total character count |
| Invalid | `aria-invalid="true"` applied to the input when validation fails |
| Disabled | `disabled` attribute — removes from tab order |
| Label | Associated via `htmlFor` → `id` — always provide a `<label>` ("Enter verification code") |
| Autocomplete | `autocomplete="one-time-code"` — enables SMS autofill on mobile browsers |

---

## Touch Target

| Component | Size | Note |
|---|---|---|
| `_input-otp-slot` | 40×40px | 4px below WCAG 2.5.5 minimum — implementation should ensure 44×44 hit area or increase slot size |

---

## Usage Rules

> **Always use `input-otp`, never `_input-otp-slot` standalone.**
>
> The slot sub-component has no input behavior on its own — it is a display cell. Placing it directly in a layout produces a non-functional visual with no way to enter text.

> **Choose the Type by code format, not by digit count.**
>
> - `Type=6-Slot` — when the code has no visual grouping (plain 6-digit code)
> - `Type=3+3` — when the code is formatted with a separator (e.g. `ABC–DEF`, `123–456`)
> - `Type=4-Slot` — for 4-digit codes (PIN, short verification)
>
> Do not use `Type=3+3` for a plain 6-digit code just because it "looks better" — the separator implies a specific format that the user will expect in the actual code.

- Always pair with a descriptive label: "Verification code", "Enter your PIN" — never leave the field unlabelled
- Always pair with a description below the field explaining where the code came from: "We sent a 6-digit code to your email"
- Show `State=Invalid` only after the user has submitted an incorrect code — not during typing
- In `State=Invalid`, add an error message below the field (use a text node outside the component — `input-otp` has no built-in description slot)
- Add a resend link or timer below the field — implementation-defined, not part of this component
- Use `autocomplete="one-time-code"` on the input in implementation — this enables SMS OTP autofill on iOS and Android

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Email verification during signup — "Enter the 6-digit code we sent to your email"
- Two-factor authentication (2FA) — one-time code from an authenticator app
- SMS-based login or phone number verification
- PIN entry for a locked account or secure action confirmation
- Password reset flows where a code is sent before the user can set a new password

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Type=6-Slot` | Standard 6-digit code with no visual grouping | Email verification code · Authenticator app TOTP · SMS OTP |
| `Type=3+3` | 6-character code that is formatted with a visible separator in the message | Invite codes displayed as `ABC–DEF` · Recovery codes printed in pairs |
| `Type=4-Slot` | Short 4-digit codes or numeric PINs | ATM-style PIN entry · App lock PIN · Short SMS verification |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| User enters a structured verification or PIN code in individual slots | `input-otp` | `input` |
| User enters any general text, password, or free-form value | `input` | `input-otp` |
| User needs to enter a numeric quantity or free number (not a code) | `input` (`type="number"`) | `input-otp` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use `_input-otp-slot` directly in a layout | Use `input-otp` — the slot is a display-only sub-component |
| Use `Type=3+3` for a plain 6-digit code | `Type=6-Slot` — the separator signals a formatted code |
| Show `State=Invalid` while the user is still typing | Only after submission of an incorrect code |
| Leave the OTP field without a label | Always provide a visible label and a description of the code source |
| Use `State=Active` in a static Figma frame that represents a resting state | `State=Empty` for resting · `State=Active` only to show the focused/in-progress interaction |
| Show a separate error message per slot | The entire group turns Invalid — one error message below the field covers the whole code |
