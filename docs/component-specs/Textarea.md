# Textarea

A multi-line text input for free-form prose. Built on the native HTML `<textarea>` element, wrapped in shadcn's Textarea component. Two component sets: `input` (`Type=Textarea`) is the raw control; `input-field` is the full form control with label and description.

> **Shared sub-components:** `label` — see `_Form-shared.md`
> **Related:** `Input` (single-line text entry)

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `input` (Type=Textarea) | `49:10806` | 6 | Raw textarea control |
| `input-field` | `49:10848` | 4 | Complete form field — label + textarea + description |

---

## Variant Matrix

### `input` — Type=Textarea — `State`

| Property | Options | Default |
|---|---|---|
| `State` | `Default`, `Hover`, `Focused`, `Filled`, `Disabled`, `Invalid` | `Default` |

`State(6) = 6 variants` (Type is fixed to Textarea in this component)

### `input-field` — `State`

| Property | Options | Default |
|---|---|---|
| `State` | `Default`, `Filled`, `Disabled`, `Invalid` | `Default` |

`State(4) = 4 variants`

---

## Structure

### `input` — Type=Textarea

```
input                           — V AUTO-LAYOUT, fill: color/input/bg
                                  stroke: color/input/border, radius: radius/md
                                  padding: spacing/component/sm (T/B) · spacing/component/md (L/R)
                                  height: 120px (Figma fixed — user-resizable in code)
  ├─ leading-icon               — INSTANCE (placeholder icon, 16×16) — hidden by default (Leading Icon prop)
  ├─ header                     — FRAME — hidden by default (Header prop)
  │    ├─ header-icon           — INSTANCE (placeholder icon, 16×16), stroke: color/icon/default
  │    ├─ header-label          — TEXT, fill: color/background/default/foreground
  │    └─ header-trailing-icon  — INSTANCE (placeholder icon, 16×16), stroke: color/icon/default
  ├─ placeholder                — TEXT, fill: color/input/placeholder
  ├─ footer                     — FRAME (always present, hidden content by default)
  │    ├─ counter               — TEXT — hidden by default (Trailing Text prop), fill: color/text/secondary
  │    └─ action                — INSTANCE (Button, Type=Primary) — hidden by default (Trailing Button prop)
  └─ trailing-icon              — INSTANCE (placeholder icon, 16×16) — hidden by default (Trailing Icon prop)
```

> **Textarea vs Input slots:** Textarea shares `Leading Icon`, `Trailing Icon`, `Trailing Text`, and `Trailing Button` boolean props with Input. It adds a `Header` prop unique to Textarea. The footer `action` is a **primary button** — unlike Input's `trailing-button` which is outline.

### `input-field`

```
input-field                     — V AUTO-LAYOUT, gap: spacing/component/xs
  ├─ label                      — INSTANCE (label component — see _Form-shared.md)
  ├─ input (Type=Textarea)      — INSTANCE
  └─ description                — TEXT
```

---

## Token Bindings

### Container per state

| State | Fill | Stroke |
|---|---|---|
| `Default` | `color/input/bg` | `color/input/border` |
| `Hover` | `color/input/bg` | `color/border/hover` |
| `Focused` | `color/input/bg` | `color/border/focus` |
| `Filled` | `color/input/bg` | `color/input/border` |
| `Disabled` | `color/surface/muted` | `color/border/disabled` |
| `Invalid` | `color/input/bg` | `color/border/error` |

| Property | Token |
|---|---|
| Radius | `radius/md` |
| Padding top / bottom | `spacing/component/sm` (8px) |
| Padding left / right | `spacing/component/md` (12px) |
| Gap | `spacing/component/sm` |

> **Focus state:** uses `color/border/focus` stroke + focus ring glow (`color/border/focus` at 20% via `color-mix`). Invalid+focused: `color/border/error` border + red ring glow — blue ring must not appear on invalid fields.

### Internal layers

| Layer | Property | Token | Notes |
|---|---|---|---|
| `placeholder` | Fill | `color/input/placeholder` | Default / Hover / Focused / Invalid |
| `placeholder` | Fill | `color/text/disabled` | Disabled state |
| `placeholder` | Fill | `color/background/default/foreground` | Filled state (shows typed value) |
| `leading-icon` VECTOR | Stroke | `color/icon/default` | Resting + Focused + Filled |
| `leading-icon` VECTOR | Stroke | `color/icon/disabled` | Disabled state |
| `trailing-icon` VECTOR | Stroke | `color/icon/default` | Resting + Focused + Filled |
| `trailing-icon` VECTOR | Stroke | `color/icon/disabled` | Disabled state |
| `header > header-icon` VECTOR | Stroke | `color/icon/default` | Always icon/default — no state change |
| `header > header-trailing-icon` VECTOR | Stroke | `color/icon/default` | Always icon/default |
| `header > header-label` | Fill | `color/background/default/foreground` | |
| `footer > counter` | Fill | `color/text/secondary` | Character count label |
| `footer > action` | Fill | `button/primary/bg/bg` | Primary button — do not override internally |

### `input-field` — description per state

| State | `label` variant | `description` fill |
|---|---|---|
| `Default` | `label state=Default` | `color/text/secondary` |
| `Filled` | `label state=Default` | `color/text/secondary` |
| `Disabled` | `label state=Disabled` | `color/text/disabled` |
| `Invalid` | `label state=Invalid` | `color/text/invalid` |

In `State=Invalid`, description IS the error message — use `color/text/invalid`, same as the label.

---

## Behavior

### Focus and interaction

- Clicking anywhere inside the textarea moves focus to the `<textarea>` element — Focused state (blue border + focus ring glow)
- Pressing `Enter` inserts a newline — form submit requires a separate submit button
- `disabled` prevents all interaction and applies `pointer-events: none`
- `aria-invalid` marks the field as invalid for screen readers; visually renders as `State=Invalid`

### Resize

- The browser renders a native resize handle (diagonal grip) in the bottom-right corner by default
- **Keep the resize handle** — users can drag to increase height; essential for notes, comments, descriptions
- To remove: add `resize-none` to the textarea className — only when a fixed height is strictly required by the layout
- Height in Figma: fixed at 120px for design representation. In code: user-controlled via resize handle, `rows` prop, or CSS `min-height`
- The resize handle is not tokenised and cannot be styled with design system tokens

### Slots

- `Header` — optional label row above the text area. Use for rich controls (formatting toolbar, attachment). Toggle via `Header` boolean prop
- `Leading Icon` — decorative icon at top-left. Use sparingly — textarea is already large enough
- `Trailing Icon` — status icon at top-right
- `counter` (Trailing Text) — character count label in footer. Bind to `value.length`
- `action` (Trailing Button) — primary button in footer. Use for submit or auto-save actions directly tied to the textarea
- Only one trailing slot should be visible at a time

### Placeholder vs value

- Placeholder (`color/input/placeholder`) — visible when empty, disappears when user types
- Filled state shows typed value as `color/background/default/foreground` — the layer is still named `placeholder` in Figma

---

## Accessibility

| Property | Value |
|---|---|
| Role | `textbox` with `aria-multiline="true"` |
| Label | Associated via `htmlFor` → `id` pairing |
| Invalid | `aria-invalid="true"` on the `<textarea>` |
| Required | `required` or `aria-required="true"` |
| Disabled | `disabled` attribute — removes from tab order |
| Description | `aria-describedby` pointing to description element |

### Keyboard

| Key | Action |
|---|---|
| `Tab` | Move focus into / out of the textarea |
| `Shift+Tab` | Move focus backwards |
| `Enter` | Insert newline (not form submit) |

---

## Usage Rules

> **Use `input-field`, not `input` (Type=Textarea) standalone.** A textarea without a label is inaccessible and fails WCAG 1.3.1.

- Use Textarea for free-form multi-line prose: notes, comments, descriptions, bios, support messages
- Do not use Textarea for structured multi-value entry (tags, emails) — use `combobox` with `State=Filled-chips`
- Do not use Textarea for single-line entry — use `Input`
- Description text explains format requirements ("Max 500 characters") — not a repeat of the label
- In `State=Invalid`, description IS the specific error message ("Message must be at least 10 characters")
- Show character count in footer `counter` when there is a hard limit — bind to `value.length / maxLength`

---

## Best Practice

### Use cases

- Support ticket message field — long-form free text, user needs multiple lines
- Product description in a CMS — prose content with variable length
- User bio on a profile settings page — 2–4 lines typical
- "Notes" field on a record (contact, project, invoice) — open-ended annotation
- Commit message input in a dev tool — header line + extended body
- Address field when the full address is a single block

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `State=Default` | Empty field, ready for input | Empty "Notes" field on a new record |
| `State=Filled` | Content entered, not submitted | Typed commit message in a PR form |
| `State=Invalid` | Form submitted with validation failure | "Message is required" after empty submit |
| `State=Disabled` | Field locked — read-only context | Non-editable description on a locked project |
| `WithHeader` | Formatting controls or section label needed above the textarea | Markdown editor with bold/italic toolbar |
| `WithCharacterCount` | Hard character limit that the user needs to track | Bio field with 160-char limit |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Single-line text: name, email, search | `input` | `textarea` |
| Multi-line free prose | `textarea` | `input` |
| Multiple tag-like values (emails, labels) | `combobox` (Filled-chips) | `textarea` |
| Exact number or amount | `input` (type=number) | `textarea` |
| Rich text with formatting | Custom rich text editor | `textarea` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use `input` (Type=Textarea) standalone in a form | Use `input-field` — it includes label and description |
| Use Textarea for tag or multi-value entry | Use `combobox` with `State=Filled-chips` |
| Add `resize-none` by default | Keep resize handle — users need to expand notes and description fields |
| Show generic "Invalid" description | Write the specific error: "Message must be at least 10 characters" |
| Use `color/input/placeholder` for the value in Filled state | `color/background/default/foreground` — Filled shows real typed content |
| Override `input` fills from inside `input-field` | Change the `input` State prop — never reach inside the instance |
| Show multiple trailing slots simultaneously | One at a time — icon OR counter OR action |
