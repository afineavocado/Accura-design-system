# Input

A single-line text input control. Built on the native HTML `<input>` element, wrapped in shadcn's Input component. Two component sets: `input` is the raw control; `input-field` is the full form control with label and description.

> **Separated:** `textarea` (multi-line) now has its own doc → see `Textarea.md`

> **Shared sub-components:** `label` — see `_Form-shared.md`

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `input` | `49:10806` | 12 | Raw input control — use standalone only when building a fully custom field wrapper |
| `input-field` | `49:10848` | 4 | Complete form field — label + input + description. **Use this in almost every case.** |

---

## Variant Matrices

### `input` — `Type × State`

| Property | Options | Default |
|---|---|---|
| `Type` | `Input`, `Textarea` | `Input` |
| `State` | `Default`, `Hover`, `Focused`, `Filled`, `Disabled`, `Invalid` | `Default` |

`Type(2) × State(6) = 12 variants`

### `input-field` — `State`

| Property | Options | Default |
|---|---|---|
| `State` | `Default`, `Filled`, `Disabled`, `Invalid` | `Default` |

`State(4) = 4 variants`

---

## Structure

### `input` — Type=Input

```
input                       — H AUTO-LAYOUT, fill: color/input/bg
                              stroke: color/input/border, radius: radius/md
                              padding: spacing/component/xs (T/B) · spacing/component/md (L/R)
                              gap: spacing/component/sm · height: 36px
  ├─ leading-icon           — INSTANCE (placeholder icon, 16×16) — optional
  ├─ placeholder            — TEXT
  ├─ trailing-text          — TEXT — optional label/unit (e.g. "kg", "USD")
  ├─ trailing-icon          — INSTANCE (placeholder icon, 16×16) — optional
  └─ trailing-button        — INSTANCE (button, outline style) — optional
```

### `input` — Type=Textarea

```
input                       — V AUTO-LAYOUT, fill: color/input/bg
                              stroke: color/input/border, radius: radius/md
                              padding: spacing/component/sm (T/B) · spacing/component/md (L/R)
                              height: 120px
  ├─ leading-icon           — INSTANCE (placeholder icon, 16×16) — hidden by default (Leading Icon prop)
  ├─ header                 — FRAME — hidden by default (Header prop)
  │    ├─ header-icon       — INSTANCE (placeholder icon, 16×16), stroke: color/icon/default
  │    ├─ header-label      — TEXT, fill: color/background/default/foreground
  │    └─ header-trailing-icon — INSTANCE (placeholder icon, 16×16), stroke: color/icon/default
  ├─ placeholder            — TEXT, fill: color/input/placeholder
  ├─ footer                 — FRAME (always present)
  │    ├─ counter           — TEXT — hidden by default (Trailing Text prop), fill: color/text/secondary
  │    └─ action            — INSTANCE (Button, Type=Primary) — hidden by default (Trailing Button prop)
  └─ trailing-icon          — INSTANCE (placeholder icon, 16×16) — hidden by default (Trailing Icon prop)
```

> **Textarea vs Input slots:** Textarea shares `Leading Icon`, `Trailing Icon`, `Trailing Text`, and `Trailing Button` boolean props with Input. It adds a `Header` prop unique to the Textarea. The footer `action` is a **primary button** — unlike Input's `trailing-button` which is outline.

### `input-field`

```
input-field                 — V AUTO-LAYOUT, gap: spacing/component/xs
  ├─ label                  — INSTANCE (label component — see _Form-shared.md)
  ├─ input                  — INSTANCE (input component)
  └─ description            — TEXT
```

---

## Token Bindings

### `input` — container per state

| State | Fill | Stroke |
|---|---|---|
| `Default` | `color/input/bg` | `color/input/border` |
| `Hover` | `color/input/bg` | `color/border/hover` |
| `Focused` | `color/input/bg` | `color/border/focus` |
| `Filled` | `color/input/bg` | `color/input/border` |
| `Disabled` | `color/surface/muted` | `color/border/disabled` |
| `Invalid` | `color/input/bg` | `color/border/error` |

### `input` — internal layers

| Layer | Property | Token | Notes |
|---|---|---|---|
| `placeholder` | Fill | `color/input/placeholder` | All states except Disabled |
| `placeholder` | Fill | `color/text/disabled` | Disabled state |
| `placeholder` | Fill | `color/background/default/foreground` | Filled state (shows typed value) |
| `trailing-text` | Fill | `color/background/muted/foreground` | Resting states |
| `trailing-text` | Fill | `color/text/disabled` | Disabled state |
| `leading-icon` VECTOR | Stroke | `color/icon/default` | Resting + Focused + Filled |
| `leading-icon` VECTOR | Stroke | `color/icon/disabled` | Disabled state |
| `trailing-icon` VECTOR | Stroke | `color/icon/default` | Resting + Focused + Filled |
| `trailing-icon` VECTOR | Stroke | `color/icon/disabled` | Disabled state |
| `header > header-icon` VECTOR | Stroke | `color/icon/default` | Textarea only |
| `header > header-trailing-icon` VECTOR | Stroke | `color/icon/default` | Textarea only |
| `header > header-label` | Fill | `color/background/default/foreground` | Textarea only |
| `footer > counter` | Fill | `color/text/secondary` | Textarea only — hidden by default |
| `footer > action` | Fill | `button/primary/bg/bg` | Textarea only — primary button, hidden by default |
| container | Radius | `radius/md` | All states |
| container | paddingTop / paddingBottom | `spacing/component/xs` (Input) · `spacing/component/sm` (Textarea) | |
| container | paddingLeft / paddingRight | `spacing/component/md` | Both types |
| container | gap | `spacing/component/sm` | Both types |

> **Focus state:** uses `focus/ring` effect style + `color/border/focus` stroke. This is the correct pattern for input controls — not the `color/ring` stroke used by buttons. The ring appears as an outer glow while the border changes color simultaneously.

### `input-field` — description per state

| State | `label` variant | `description` fill |
|---|---|---|
| `Default` | `label state=Default` | `color/text/secondary` |
| `Filled` | `label state=Default` | `color/text/secondary` |
| `Disabled` | `label state=Disabled` | `color/text/disabled` |
| `Invalid` | `label state=Invalid` | `color/text/invalid` |

---

## Behavior

### Focus and interaction

- Clicking anywhere inside the input field moves focus to the `<input>` element and shows the Focused state (blue border + focus/ring glow)
- `Type=Input`: single line — pressing Enter submits the associated form (implementation-defined)
- `Type=Textarea`: multiline — pressing Enter inserts a newline; form submit requires a separate submit button
- The `disabled` prop prevents all interaction and applies `pointer-events: none`; visually renders as `State=Disabled`
- The `aria-invalid` prop marks the field as invalid for screen readers; visually renders as `State=Invalid`

### Placeholder vs value

- Placeholder text (`color/input/placeholder`) is visible in `State=Default` — it disappears as soon as the user types
- Filled state (`color/background/default/foreground`) shows the typed value — the layer is still named `placeholder` in Figma but serves as the value display

### Trailing slots

- `trailing-button` — use for actions directly tied to the input (e.g. "Copy", "Show password", "Search"). The button is always `Type=Outline` — it shares the input border height at 36px
- `trailing-icon` — use for a status icon or decorative affordance with no click action
- `trailing-text` — use for units, currency labels, or format hints (e.g. "USD", "kg", ".com")
- Only one trailing slot should be visible at a time — combinations are unsupported

### Resize (Textarea)

- The browser renders a diagonal grip icon in the bottom-right corner of every `<textarea>` by default — this is the native resize handle, not a design system element
- **Keep the resize handle** — users can drag it to increase the textarea height, which is useful for notes, comments, and description fields
- To remove it, add `resize-none` to the textarea className — only do this when a fixed height is strictly required by the layout
- Height in Figma is fixed at 120px for design representation; in code the height is user-controlled via the resize handle or via `rows` prop / CSS `min-height`
- The resize handle is not tokenised and cannot be styled with design system tokens — it renders in the browser's native UI color

### Keyboard

| Key | Action |
|---|---|
| `Tab` | Move focus into / out of the input |
| `Shift+Tab` | Move focus backwards |
| `Enter` | Submit form (Input) / insert newline (Textarea) |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `textbox` (Input) / `textbox` with `aria-multiline="true"` (Textarea) |
| Label | Associated via `htmlFor` → `id` pairing between `<label>` and `<input>` |
| Invalid | `aria-invalid="true"` on the `<input>` |
| Required | `required` or `aria-required="true"` on the `<input>` |
| Disabled | `disabled` attribute — also removes from tab order |
| Description | `aria-describedby` pointing to the description element |

---

## Usage Rules

> **The single most important rule: use `input-field`, not `input`.**
>
> `input` is a raw control with no label or description. A form field without a visible label is inaccessible and fails WCAG 1.3.1. The only valid reason to use `input` standalone is when you are building a completely custom field wrapper that provides its own label association — for example, an inline edit control inside a table cell.

- Use `input-field` for every standard form field — it wraps the label, input, and description in a single composable unit
- Use `Type=Input` for any single-line entry: name, email, password, search, number, date
- Use `Type=Textarea` for multi-line entry: notes, comments, descriptions, addresses
- Do not use `Type=Textarea` for structured multi-value entry (e.g. adding multiple tags or emails) — use `combobox-trigger Type=Basic, State=Filled-chips` instead
- Show `description` text to explain format requirements ("Must be at least 8 characters") or constraints — not as a repeat of the label
- In `State=Invalid`, both label and `description` use `color/text/invalid` — the description IS the error message (e.g. "Email must contain @"), not supporting context, so it carries the same signal as the label
- `trailing-button` is for input-bound actions only — if the action opens a modal or navigates away, use a standalone button next to the field instead

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- User registration or account setup forms: name, email, phone, username fields
- Login forms where a single line of text is collected (email + password)
- Search bars paired with a button — use `trailing-button` with the input
- Address entry: street, city, postcode — each as a separate `input-field`
- API key or token display fields where the user reads or copies a value
- Notes, comments, or bio fields that require multi-line entry (`Type=Textarea`)

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Type=Input` | Single-line text, number, email, password, or search entry | Login email field · Username on signup · Search bar · Postcode |
| `Type=Textarea` | Free-form multi-line prose — the user needs more than one line | Comment box · Product description · Support message · User bio |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| User must type a free-form value — anything goes | `input` | `select` or `combobox` |
| User enters a verification or PIN code in individual slots | `input-otp` | `input` |
| User needs to pick one value from a fixed list (no typing) | `select` | `input` |
| User needs to pick from a long list or select multiple values | `combobox` | `input` |
| User needs to add multiple tag-like values (email recipients, labels) | `combobox` (`Type=Basic, State=Filled-chips`) | `input` |
| User must enter an exact number (quantity, amount, port) | `input` (`type="number"`) | `slider` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use `input` standalone in a form | Use `input-field` — it includes the label and description |
| Use `Type=Textarea` for tag / multi-value entry | Use `combobox-trigger` with `State=Filled-chips` |
| Put multiple trailing slots in the same variant | One trailing slot at a time — icon OR text OR button |
| Show a generic "Invalid" description in the Invalid state | Write the specific error: "Email must contain @" |
| Use `color/input/placeholder` for the value in Filled state | `color/background/default/foreground` — Filled shows real content |
| Override `input` fills from inside `input-field` | Change the `input` State prop — never reach inside the instance |
