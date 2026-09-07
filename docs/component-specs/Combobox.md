# Combobox

A searchable, filterable dropdown control — for single selection, multi-selection with chips, search-as-you-type, or free-form tag entry. Built on Base UI Combobox. Two component sets: `combobox-trigger` is the input that opens the dropdown; `combobox-field` is the full form control with label and description.

> **Shared sub-components:** `label`, `menu-dropdown`, `menu-dropdown-item` — see `_Form-shared.md`

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `combobox-trigger` | `75:9166` | 13 | The trigger input — sub-component of `combobox-field` |
| `combobox-field` | `148:2191` | 4 | Complete form field — label + trigger + description. **Use this in almost every case.** |

---

## Variant Matrices

### `combobox-trigger` — `Type × State`

| Property | Options | Default |
|---|---|---|
| `Type` | `Basic`, `Search`, `Time-picker`, `Tag Input` | `Basic` |
| `State` (Basic) | `Default`, `Hover`, `Open`, `Filled`, `Filled-chips`, `Invalid`, `Disabled` | `Default` |
| `State` (Search) | `Default`, `Hover`, `Open`, `Filled`, `Invalid`, `Disabled` | `Default` |
| `State` (Time-picker) | `Default`, `Hover`, `Open`, `Filled`, `Invalid`, `Disabled` | `Default` |
| `State` (Tag Input) | `Default`, `Hover`, `Open`, `Filled-chips`, `Invalid`, `Disabled` | `Default` |

`Basic(7) + Search(6) + Time-picker(6) + Tag Input(6) = 25 variants`

> **Figma status:** `Type=Time-picker` ✅ built in Figma (node `401:2567`, 6 variants). `Type=Tag Input` is code-only — not yet in Figma component set.

### `combobox-field` — `State`

| Property | Options | Default |
|---|---|---|
| `State` | `Default`, `Open`, `Disabled`, `Invalid` | `Default` |

`State(4) = 4 variants`

---

## Type Guide

### `Type=Basic` — click to open

The trigger looks and behaves like `select-trigger` — it shows a placeholder and a chevron icon. The user clicks to open the dropdown. The dropdown may or may not include search (controlled by `menu-dropdown Type`). Use Basic when the list is moderate in length and the click-to-open affordance is clear.

`State=Filled-chips` is exclusive to Basic — it shows selected items as chips inside the trigger, enabling multi-select.

### `Type=Search` — search-as-you-type

The trigger is visually a search input with a leading search icon. The user types into it and the dropdown filters in real time. Use Search when the list is long (>15 items) or when the primary user action is typing rather than browsing.

### `Type=Time-picker` — time selection trigger

The trigger visually matches `Type=Basic` — a placeholder text and a trailing chevron icon. Clicking opens the `menu-dropdown Type=os-time-menu` panel (two scrollable columns: HH and MM). Use Time-picker when the user must select a time from a structured hour/minute picker rather than typing free text.

No `State=Filled-chips` — the filled state shows the selected time as plain text (e.g. `12:00`).

### `Type=Tag Input` — free-form chip creation

The trigger looks like `Type=Basic, State=Filled-chips` — an input with chips inside. The user types freely and presses `Enter` (or `,`) to create a new chip from whatever they typed. No predefined options list is required, though an optional suggestions dropdown may accompany it. Use Tag Input when the user invents the values themselves (labels, keywords, email addresses, custom tags) rather than picking from a fixed list.

`State=Filled-chips` is the only filled state — there is no `State=Filled` for Tag Input because every confirmed value becomes a chip immediately.

---

## Structure

### `combobox-trigger` — Type=Basic

```
combobox-trigger            — H AUTO-LAYOUT, fill: color/input/bg
                              stroke: color/input/border, radius: radius/lg
                              padding: spacing/component/md (L/R) · no T/B padding
                              gap: spacing/component/sm · height: 36px
  ├─ placeholder            — TEXT
  └─ icon-chevron           — INSTANCE (chevron-down, 16×16)
       └─ Icon              — VECTOR
```

### `combobox-trigger` — Type=Basic, State=Filled-chips

```
combobox-trigger            — H AUTO-LAYOUT, fill: color/input/bg
                              stroke: color/input/border, radius: radius/lg
                              padding: spacing/component/xs-plus (all sides)
                              gap: spacing/component/xs
  └─ chips-area             — FRAME
       ├─ chip-1            — INSTANCE, fill: color/background/muted
       │    ├─ label        — TEXT, fill: color/background/muted/foreground
       │    └─ icon-close   — INSTANCE
       │         └─ Icon    — VECTOR, stroke: color/background/muted/foreground
       ├─ chip-2            — INSTANCE (same structure)
       └─ placeholder       — TEXT, fill: color/input/placeholder
```

### `combobox-trigger` — Type=Search

```
combobox-trigger            — H AUTO-LAYOUT, fill: color/input/bg
                              stroke: color/input/border, radius: radius/lg
                              padding: spacing/component/sm (L/R) · no T/B padding
                              gap: spacing/component/sm · height: 36px
  ├─ icon-search            — INSTANCE (search icon, 16×16)
  ├─ placeholder            — TEXT
  └─ icon-chevron           — INSTANCE (chevron-down, 16×16)
```

### `combobox-trigger` — Type=Time-picker

Identical structure to `Type=Basic` — placeholder text + trailing chevron. No search icon, no chips. Opens `menu-dropdown Type=os-time-menu` on click.

```
combobox-trigger            — H AUTO-LAYOUT, fill: color/input/bg
                              stroke: color/input/border, radius: radius/lg
                              padding: spacing/component/md (L/R) · no T/B padding
                              gap: spacing/component/sm · height: 36px · width: 280px
  ├─ placeholder            — TEXT, fill: color/input/placeholder
  └─ icon-chevron           — INSTANCE (chevron-down, 16×16)
       └─ Icon              — VECTOR, stroke: color/icon/default
```

> **Figma node:** `401:2567` — 6 state variants (Default, Hover, Open, Filled, Invalid, Disabled).

### `combobox-trigger` — Type=Tag Input

Identical structure to `Type=Basic, State=Filled-chips`. No chevron icon — the trigger is not a button that opens a dropdown, it is a growing input that accepts chips.

```
combobox-trigger            — H AUTO-LAYOUT wrap, fill: color/input/bg
                              stroke: color/input/border, radius: radius/lg
                              padding: spacing/component/xs-plus (all sides)
                              gap: spacing/component/xs · min-height: 36px
  ├─ chips-area             — FRAME (wrapping flex)
  │    ├─ chip-N            — INSTANCE (repeating per tag)
  │    │    ├─ label        — TEXT, fill: color/background/muted/foreground
  │    │    └─ icon-close   — INSTANCE (X icon, 12×12)
  │    │         └─ Icon    — VECTOR, stroke: color/background/muted/foreground
  │    └─ input             — TEXT (inline input, grows with typing)
  └─ (no chevron)
```

### `combobox-field`

```
combobox-field              — V AUTO-LAYOUT, gap: spacing/component/xs
  ├─ label                  — INSTANCE (label component — see _Form-shared.md)
  ├─ combobox-trigger       — INSTANCE
  └─ menu-dropdown          — INSTANCE (Open state only)
  or
  └─ description            — TEXT (Default / Disabled / Invalid states)
```

---

## Token Bindings

### `combobox-trigger` — container per state

| Type  | State          | Fill                       | Stroke                  | Effect       |
| ----- | -------------- | -------------------------- | ----------------------- | ------------ |
| Both  | `Default`      | `color/input/bg`     | `color/input/border`    | —            |
| Both  | `Hover`        | `color/input/bg`     | `color/border/hover`    | —            |
| Both  | `Open`         | `color/input/bg`     | `color/border/focus`    | `focus/ring` |
| Both  | `Filled`       | `color/input/bg`     | `color/input/border`    | —            |
| Basic | `Filled-chips` | `color/input/bg`     | `color/input/border`    | —            |
| Both  | `Invalid`      | `color/input/bg`     | `color/border/error`    | —            |
| Both  | `Disabled`     | `color/surface/muted` | `color/border/disabled` | —            |

### `combobox-trigger` — internal layers

| Layer | Property | Token | Notes |
|---|---|---|---|
| `placeholder` | Fill | `color/input/placeholder` | Default / Hover / Open / Invalid / Filled-chips |
| `placeholder` | Fill | `color/background/default/foreground` | Filled (shows selected value) |
| `placeholder` | Fill | `color/text/disabled` | Disabled |
| `icon-search` VECTOR | Stroke | `color/icon/default` | Active states |
| `icon-search` VECTOR | Stroke | `color/icon/disabled` | Disabled |
| `icon-chevron` VECTOR | Stroke | `color/icon/default` | Active states |
| `icon-chevron` VECTOR | Stroke | `color/icon/disabled` | Disabled |
| chip `label` | Fill | `color/background/muted/foreground` | Filled-chips |
| chip container | Fill | `color/background/muted` | Filled-chips |
| chip `icon-close` VECTOR | Stroke | `color/background/muted/foreground` | Paired-surface rule |
| container | Radius | `radius/lg` | All states (note: larger than input/select which use `radius/md`) |
| container | paddingLeft / paddingRight | `spacing/component/sm` (Search) · `spacing/component/md` (Basic) | |
| container | padding (Filled-chips / Tag Input) | `spacing/component/xs-plus` (all sides) | |
| container | gap | `spacing/component/sm` | |

### `combobox-trigger` — Tag Input per state (same fill/stroke pattern as Basic)

| State | Fill | Stroke | Effect |
|---|---|---|---|
| `Default` | `color/input/bg` | `color/input/border` | — |
| `Hover` | `color/input/bg` | `color/border/hover` | — |
| `Open` | `color/input/bg` | `color/border/focus` | `focus/ring` |
| `Filled-chips` | `color/input/bg` | `color/input/border` | — |
| `Invalid` | `color/input/bg` | `color/border/error` | — |
| `Disabled` | `color/surface/muted` | `color/border/disabled` | — |

Tag Input chip tokens are identical to `Basic, State=Filled-chips` — see chip layer rows above.

> **`radius/lg` vs `radius/md`:** Combobox uses `radius/lg` (8px) while `input` and `select-trigger` use `radius/md` (6px). This is intentional — the combobox trigger has a slightly rounder feel to signal that it is an interactive search or selection control, not a plain text input.

### `combobox-field` — description and label per state

| State | `label` variant | `description` fill |
|---|---|---|
| `Default` | `label state=Default` | `color/text/secondary` |
| `Open` | `label state=Default` | hidden (menu-dropdown shown) |
| `Disabled` | `label state=Disabled` | `color/text/disabled` |
| `Invalid` | `label state=Invalid` | `color/text/invalid` |

---

## Behavior

Source: Base UI Combobox (`base-ui.com/react/components/combobox`).

### Open / Close

- `Type=Basic`: clicking the trigger opens the dropdown (same affordance as select)
- `Type=Search`: clicking the input field opens the dropdown (`openOnInputClick=true` — Base UI default); the user can also start typing immediately to filter
- The dropdown closes when: an item is selected · `Escape` is pressed · the user clicks outside · the field loses focus (when `modal=false`, which is the default)

### Filtering

- `Type=Search`: the user types into the trigger and the dropdown filters items in real time using `Intl.Collator` string comparison
- Default filter strategy: `contains` — matches the query anywhere in the item label
- `autoHighlight=false` by default — the first matching item is NOT automatically highlighted; the user must arrow-navigate or click to select
- `highlightItemOnHover=true` by default — hovering an item highlights it

### Selection

**Single selection (default):**
- Clicking or pressing `Enter` on an item selects it, closes the dropdown, and updates the trigger to show the selected value
- The selected item shows `State=Selected` in `menu-dropdown-item`

**Multi-selection (`State=Filled-chips`):**
- Enabled via `multiple` prop on the root component
- Each selected item appears as a chip inside the trigger
- Clicking the chip's close icon (×) removes that item from the selection
- The placeholder remains visible alongside chips to invite further selection
- The dropdown stays open after each selection so the user can pick multiple items

### Tag Input — chip creation

- The user types a value and presses `Enter` or `,` to confirm it as a chip
- The input clears immediately after confirmation, ready for the next tag
- Duplicate values are silently ignored — the same tag cannot appear twice
- An optional suggestions dropdown may appear as the user types (same as `Type=Search` filtering); selecting a suggestion creates a chip from that suggestion's value
- Without suggestions, the dropdown does not open — the trigger is visually identical to a multi-line input

### Tag Input — chip removal

- Clicking the chip's `×` icon removes that chip
- Pressing `Backspace` with an empty input removes the last chip
- No confirmation required — removal is immediate

### Focus loop

- `loopFocus=true` by default — arrow key navigation loops from the last item back to the input and vice versa

### Keyboard

| Key | Action |
|---|---|
| `Arrow Down` | Open dropdown / move focus to next item |
| `Arrow Up` | Open dropdown / move focus to previous item |
| `Enter` | Select highlighted item · Confirm typed tag (Type=Tag Input) |
| `,` | Confirm typed tag (Type=Tag Input only) |
| `Backspace` | Remove last chip when input is empty (Type=Tag Input + Filled-chips) |
| `Escape` | Close dropdown |
| Typing | Filter items in real time (Type=Search · Type=Tag Input with suggestions) |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `combobox` on the trigger input |
| Expanded | `aria-expanded="true"` when open |
| Options list | `role="listbox"` |
| Each option | `role="option"` with `aria-selected` |
| Autocomplete | `aria-autocomplete="list"` (Type=Search) |
| Required | `aria-required="true"` |
| Invalid | `aria-invalid="true"` |
| Label | Associated via `aria-labelledby` |

---

## Usage Rules

> **The single most important rule: use `combobox-field`, not `combobox-trigger`.**
>
> `combobox-trigger` is a sub-component — it is the input control only, with no label or description. Placing it directly in a layout produces an unlabelled, contextless control. Use `combobox-field` for every standard form use case.

> **Use `Type=Tag Input` when: the user creates the values themselves.** Labels, keywords, email addresses, custom filters — anything where the vocabulary is open and not predefined. Tag Input has no options list requirement.

> **Choose combobox over select when: the list is long, the user needs to search, or multi-select is required.**
>
> - **Long list (>15 items):** select forces the user to scroll a full list; combobox lets them filter by typing. Use `Type=Search`.
> - **Search / filter:** the user's primary action is typing a term to narrow options. Use `Type=Search`.
> - **Multi-select:** the user picks several values at once (e.g. tags, team members, permissions). Use `Type=Basic, State=Filled-chips`.
> - **Short, stable list (≤15 items, no search needed):** use `select-field` instead — select has a simpler visual and clearer affordance for fixed-option pickers.

> **`Type=Basic` vs `Type=Search` — how to decide:**
>
> - `Type=Basic` — use when the user primarily browses the list (click, scan, pick). The trigger looks like `select-trigger`. Appropriate when the list fits comfortably in the dropdown without filtering.
> - `Type=Search` — use when the user primarily types to narrow results. The trigger shows a search icon. Required when the list is long or the items are not easily scannable.
> - Never use `Type=Basic` for a list where the user is expected to type — it shows no search affordance and the user will not discover filtering.
> - Never use `Type=Search` for a list of 5 items — the search input adds cognitive overhead without benefit.

- Use `State=Filled-chips` only with `multiple=true` in the implementation — single-select combobox should always show the value as plain text (`State=Filled`), not chips
- Chips show `color/background/muted` fill — they are secondary UI elements, not primary actions. Do not use brand or accent fills on chips.
- The `description` below the field explains what kind of selection is expected — "Select all that apply" or "You can add up to 5 tags"
- In `State=Invalid`, the description must state a specific error: "At least one option is required" not just "Invalid"

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Assigning team members to a task — large org, user types a name to filter hundreds of people
- Tag or label picker in a note-taking or project tool — multi-select with chips, large tag vocabulary
- Language or locale selector in account settings — 100+ languages, search is the only sensible UX
- "CC" or recipient field in an email composer — add multiple addresses as chips
- Framework or technology filter in a job board — long list of options, user types to narrow

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Type=Basic` | Moderate-length list where the user browses to pick — click to open, scan the list | Status picker (10 options) · Priority selector · Sprint assignment |
| `Type=Basic, State=Filled-chips` | Multi-select from a predefined list — each chosen value shown as a chip | Permission assignment · Team member picker (org directory) |
| `Type=Search` | Long list (15+ items) where typing to filter is the primary interaction | Country search · User/member search · Framework filter · Language selector |
| `Type=Tag Input` | Free-form chip creation — user invents the values, no predefined list needed | Labels · Keywords · Email recipients ("To:", "CC:") · Custom filters |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Long list or user types to filter (>15 items) | `combobox` | `select` |
| User must pick multiple values from a fixed list | `combobox` (`Type=Basic, State=Filled-chips`) | `select` or `checkbox` |
| User creates free-form values (labels, emails, keywords) | `combobox` (`Type=Tag Input`) | `input` |
| Short fixed list (≤ ~10 items), no typing, pick one | `select` | `combobox` |
| 2–5 mutually exclusive options that benefit from being fully visible | `radio` | `combobox` |

---

## Do Not

| ❌ Wrong                                                                      | ✅ Correct                                                                        |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Use `combobox-trigger` directly in a form layout                             | Use `combobox-field` — it includes the label and description                     |
| Use `Type=Search` for a list of fewer than ~8 items                          | Use `Type=Basic` or `select-field` — search adds no value for short lists        |
| Use `Type=Basic` for a list of 20+ items without search                      | Use `Type=Search` — users cannot browse 20+ items efficiently                    |
| Use `State=Filled-chips` for single selection                                | `State=Filled-chips` is for multi-select only                                    |
| Use `Type=Tag Input` when the user must pick from a fixed list               | Use `Type=Basic, State=Filled-chips` for predefined options                      |
| Use `Type=Basic` or `Type=Search` when the user must create free-form values | Use `Type=Tag Input` — it is designed for open vocabulary entry                  |
| Use select when the user must pick multiple values                           | Use `combobox-field` with `State=Filled-chips`                                   |
| Override `combobox-trigger` fills from inside `combobox-field`               | Change the `combobox-trigger` State prop — never reach inside the instance       |
| Mix `Type=Search` trigger with `menu-dropdown Type=List` (no search bar)     | Match: Search trigger → Search dropdown · Basic trigger → List or Group dropdown |
