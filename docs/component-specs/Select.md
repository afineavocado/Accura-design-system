# Select

A dropdown control for choosing one option from a predefined, fixed list. Built on Radix UI Select. Two component sets: `select-trigger` is the button that opens the dropdown; `select-field` is the full form control with label and description.

> **Shared sub-components:** `label`, `menu-dropdown`, `menu-dropdown-item` — see `_Form-shared.md`

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `select-trigger` | `74:757` | 6 | The clickable button that opens the dropdown — sub-component of `select-field` |
| `select-field` | `146:3751` | 4 | Complete form field — label + trigger + description. **Use this in almost every case.** |

---

## Variant Matrices

### `select-trigger` — `State`

| Property | Options | Default |
|---|---|---|
| `State` | `Default`, `Hover`, `Open`, `Filled`, `Disabled`, `Invalid` | `Default` |

`State(6) = 6 variants`

### `select-field` — `Field state`

| Property | Options | Default |
|---|---|---|
| `Field state` | `Default`, `Open`, `Disabled`, `Invalid` | `Default` |

`Field state(4) = 4 variants`

---

## Structure

### `select-trigger`

```
select-trigger              — H AUTO-LAYOUT, fill: color/input/bg
                              stroke: color/input/border, radius: radius/md
                              padding: spacing/component/sm (T/B) · spacing/component/md (L/R)
                              gap: spacing/component/sm · height: 36px
  ├─ value                  — FRAME (fills remaining width)
  │    └─ placeholder       — TEXT
  └─ icon                   — INSTANCE (chevron-down, 16×16)
       └─ Icon              — VECTOR
```

### `select-field`

```
select-field                — V AUTO-LAYOUT, gap: spacing/component/xs
  ├─ label                  — INSTANCE (label component — see _Form-shared.md)
  ├─ select-trigger         — INSTANCE
  └─ description            — TEXT  (hidden in Open state — dropdown replaces it visually)
```

---

## Token Bindings

### `select-trigger` — container per state

| State | Fill | Stroke |
|---|---|---|
| `Default` | `color/input/bg` | `color/input/border` |
| `Hover` | `color/input/bg` | `color/border/hover` |
| `Open` | `color/input/bg` | `color/border/focus` + `focus/ring` effect |
| `Filled` | `color/input/bg` | `color/input/border` |
| `Disabled` | `color/surface/muted` | `color/border/disabled` |
| `Invalid` | `color/input/bg` | `color/border/error` |

### `select-trigger` — internal layers

| Layer | Property | Token | Notes |
|---|---|---|---|
| `placeholder` | Fill | `color/input/placeholder` | Default / Hover / Open / Invalid |
| `placeholder` | Fill | `color/background/default/foreground` | Filled (shows selected value) |
| `placeholder` | Fill | `color/text/disabled` | Disabled |
| `icon` VECTOR | Stroke | `color/icon/default` | All states except Disabled |
| `icon` VECTOR | Stroke | `color/icon/disabled` | Disabled |
| container | Radius | `radius/md` | All states |
| container | paddingTop / paddingBottom | `spacing/component/sm` | |
| container | paddingLeft / paddingRight | `spacing/component/md` | |

### `select-field` — description and label per state

| State | `label` variant | `description` fill |
|---|---|---|
| `Default` | `label state=Default` | `color/text/secondary` |
| `Open` | `label state=Default` | hidden (menu-dropdown shown instead) |
| `Disabled` | `label state=Disabled` | `color/text/disabled` |
| `Invalid` | `label state=Invalid` | `color/text/invalid` |

---

## Behavior

Source: Radix UI Select primitive.

### Open / Close

- Clicking `select-trigger` opens the dropdown (Radix UI Select.Trigger)
- The dropdown closes when: an item is selected · `Escape` is pressed · the user clicks outside
- On open, the dropdown positions so the currently selected item appears over the trigger (`position="item-aligned"` — Radix UI default). Use `position="popper"` to align to the trigger's bottom edge instead
- Selecting an item closes the dropdown and updates the trigger's value display (placeholder → selected text, `color/input/placeholder` → `color/background/default/foreground`)

### Keyboard

| Key | Action |
|---|---|
| `Space` | Open select / select focused item |
| `Enter` | Open select / select focused item |
| `Arrow Down` | Open select / move focus to next item |
| `Arrow Up` | Open select / move focus to previous item |
| `Escape` | Close select, return focus to trigger |

(Radix UI Select keyboard behavior — verified against Radix UI docs.)

### Scroll

- The native scrollbar inside the dropdown is hidden by default
- When the option list overflows the viewport, `ScrollUpButton` and `ScrollDownButton` affordances appear — implementation-defined whether to use these or the Scroll Area primitive

---

## Accessibility

| Property | Value |
|---|---|
| Role | `combobox` on the trigger button |
| Expanded | `aria-expanded="true"` when open |
| Options list | `role="listbox"` |
| Each option | `role="option"` with `aria-selected` |
| Required | `aria-required="true"` on the trigger |
| Invalid | `aria-invalid="true"` on the trigger |
| Label | Associated via `aria-labelledby` pointing to the label element |

---

## Usage Rules

> **The single most important rule: use `select-field`, not `select-trigger`.**
>
> `select-trigger` is a sub-component — it is the clickable button only, with no label or description. Placing it directly in a layout produces an unlabelled control that is inaccessible and impossible for the user to understand without context. Use `select-field` for every standard form use case.

> **Choose select over combobox when: the list is short and fully known.**
>
> Select is for choosing from a fixed, predetermined set of options where the user benefits from seeing the full list at once. If the list has more than ~10–15 items, or if the user needs to search or type to filter, use `combobox-field` instead. If the user needs to select multiple values, use `combobox-field` with `Type=Basic, State=Filled-chips`.

- Use `select-field` for fields like: country, gender, status, priority, role — any field with a short, stable list of options
- Always provide a meaningful placeholder (e.g. "Select a country") — do not use a blank placeholder; the user must understand what they are selecting
- The `description` below the field should explain constraints or context — not repeat the label
- In `State=Invalid`, the description must state the specific error — "Please select an option" rather than "Invalid"
- In `State=Open` the description is hidden because the dropdown visually occupies that space — no information should be hidden there that the user needs to see before making a selection
- Do not use select for boolean choices (yes/no, on/off) — use a toggle or checkbox instead
- Do not use select when the user might want to type or create a new option — use combobox instead

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Country or region field in a checkout or address form — fixed list, user needs to scroll and pick one
- Timezone selector in account settings — short curated list, no typing required
- Status or priority picker in a project tool: To Do, In Progress, Done, Blocked
- Theme preference: Light, Dark, System — 3 options, no search needed
- Role assignment in a user management form: Admin, Editor, Viewer

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `State=Default` | Field rendered, no value chosen yet — placeholder shown | Empty "Select a country" on page load |
| `State=Open` | Actively showing the dropdown — use in mockups to preview the list | Design spec showing dropdown with fruit options |
| `State=Filled` | A value has been selected and is displayed in the trigger | "United States" after user picks a country |
| `State=Invalid` | Form submitted without a required selection, or value fails validation | "Please select a timezone" error state |
| `State=Disabled` | Field is locked — context determines the value or user lacks permission to change it | Read-only role display on a locked team member record |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Fixed short list (≤ ~10 items), pick one, no typing needed | `select` | `combobox` |
| Long list (10+ items) or user needs to search/filter | `combobox` | `select` |
| User must pick multiple values | `combobox` (`State=Filled-chips`) | `select` |
| 2–5 options where seeing all at once aids the decision | `radio` | `select` |
| Binary yes/no or on/off choice | `checkbox` or `switch` | `select` |
| User may need to type a value not in the list | `input` | `select` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use `select-trigger` directly in a form layout | Use `select-field` — it includes the label and description |
| Use select for a list of 20+ items | Use `combobox-field` with `Type=Search` — users need to filter |
| Use select for multiple selection | Use `combobox-field` with `State=Filled-chips` |
| Use select for yes/no choices | Use a checkbox or toggle |
| Blank placeholder | "Select a country" — always name what's being selected |
| Override `select-trigger` fills from inside `select-field` | Change the `select-trigger` State prop — never reach inside |
| Use `select-trigger` State=Open without showing `menu-dropdown` | Open state must always show the dropdown panel |
