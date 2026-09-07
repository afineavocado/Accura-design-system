# Form Shared Sub-components

Sub-components shared across `input-field`, `select-field`, and `combobox-field`. These are never used standalone — they exist only inside the field-level components. Document is referenced by `Input.md`, `Select.md`, and `Combobox.md`.

---

## Component Sets

| Set | ID | Variants | Used by |
|---|---|---|---|
| `label` | `150:569` | 3 | `input-field`, `select-field`, `combobox-field` |
| `menu-dropdown-item` | `75:7538` | 5 | `menu-dropdown` |
| `menu-dropdown` | `148:928` | 3 | `select-field` (Open state), `combobox-field` (Open state) |

---

## `label`

### Variant Matrix

| Property | Options | Default |
|---|---|---|
| `label state` | `Default`, `Disabled`, `Invalid` | `Default` |

`label state(3) = 3 variants`

### Structure

```
label                       — H AUTO-LAYOUT, gap: spacing/component/xs
  ├─ label-text             — TEXT
  └─ label-required         — TEXT  (the asterisk — hidden when field is not required)
```

### Token Bindings

| Variant | `label-text` fill | `label-required` fill |
|---|---|---|
| `label state=Default` | `color/background/default/foreground` | `color/status/danger` |
| `label state=Disabled` | `color/text/disabled` | `color/text/disabled` |
| `label state=Invalid` | `color/text/invalid` | `color/text/invalid` |

> `label-required` uses `color/status/danger` in Default state — this is the asterisk (*) marking a required field. In Invalid and Disabled states it follows the field state token.

### Usage Rules

- The `label state` prop is controlled by the parent field component — never set it manually on the instance
- Switch to `label state=Disabled` when the parent field is Disabled
- Switch to `label state=Invalid` when the parent field is Invalid
- `label-required` is only visible when the field is marked required — toggle visibility via the parent's boolean prop
- Never override `label-text` or `label-required` fills directly on the instance — change the `label state` prop instead

---

## `menu-dropdown-item`

### Variant Matrix

| Property | Options | Default |
|---|---|---|
| `State` | `Default`, `Hover`, `Selected`, `Focused`, `selected time`, `Disabled` | `Default` |

`State(6) = 6 variants`

### Structure

```
menu-dropdown-item          — H AUTO-LAYOUT, radius: radius/md
                              padding: spacing/component/xxs (T/B) · spacing/component/sm (L/R)
                              gap: spacing/component/sm
  ├─ icon-leading           — INSTANCE (placeholder icon, 16×16)
  └─ label                  — TEXT
```

### Token Bindings

| State | Container fill | `icon-leading` VECTOR stroke | `label` fill |
|---|---|---|---|
| `Default` | transparent | `color/icon/default` | `color/background/default/foreground` |
| `Hover` | `color/background/accent` | `color/background/accent/foreground` | `color/background/accent/foreground` |
| `Selected` | transparent | `color/brand/primary` | `color/brand/primary` |
| `Focused` | `color/background/accent` | `color/background/accent/foreground` | `color/background/accent/foreground` |
| `selected time` | `color/brand/primary` | — (no icon) | `color/brand/primary/foreground` |
| `Disabled` | transparent | `color/icon/disabled` | `color/text/disabled` |

> **`State=selected time`** — used exclusively inside `menu-dropdown Type=os-time-menu` for the active hour or minute value. Fills with `color/brand/primary` (unlike `State=Selected` which keeps transparent background). No `icon-leading` — label only. Figma node: `408:1905`, size 48×32px.

> **Paired-surface rule on Hover and Focused:** the container fills with `color/background/accent`, so icon and label must use `color/background/accent/foreground` — not `color/icon/default`. The icon stroke binding is on the VECTOR node inside the icon instance, never on the instance frame.

> **Selected uses brand/primary directly on text** — not a foreground pairing — because the container stays transparent. `color/brand/primary` on text is legible on the default background.

### Usage Rules

- Assembled inside `menu-dropdown` — never placed directly in a layout
- State is set at runtime; in Figma set `State` prop to preview interaction states
- `icon-leading` is visible by default — hide it via boolean prop if the option set has no icons (all items must be consistent — either all show icons or none do)
- `State=Selected` marks the currently chosen option — only one item should be Selected at a time in a single-select dropdown

---

## `menu-dropdown`

### Variant Matrix

| Property | Options | Default |
|---|---|---|
| `Type` | `List`, `Search`, `Group`, `os-time-menu` | `List` |

`Type(4) = 4 variants`

### Structure

```
Type=List
menu-dropdown               — V AUTO-LAYOUT, fill: color/surface/overlay
                              stroke: color/border/default, radius: radius/lg
                              padding: spacing/component/xxs (all), gap: spacing/component/xxs
  ├─ menu-dropdown-item ×5  — INSTANCE
  └─ Slot ×6                — SLOT (for additional items)

Type=Search
menu-dropdown
  ├─ search-bar             — FRAME, H AUTO-LAYOUT
  │    ├─ icon-search       — INSTANCE (search icon)
  │    └─ placeholder       — TEXT, fill: color/input/placeholder
  ├─ menu-dropdown-item ×5  — INSTANCE
  └─ Slot ×6                — SLOT

Type=Group
menu-dropdown
  ├─ _menu-dropdown-label   — INSTANCE (group heading)
  ├─ menu-dropdown-item ×2  — INSTANCE
  ├─ separator              — INSTANCE
  ├─ _menu-dropdown-label   — INSTANCE (second group heading)
  ├─ menu-dropdown-item ×2  — INSTANCE
  └─ Slot ×6                — SLOT

Type=os-time-menu                  — H AUTO-LAYOUT, fill: color/surface/overlay
                                     stroke: color/border/default, radius: radius/lg
                                     padding: spacing/component/xxs (2px all), gap: spacing/component/xxs
                                     size: 124×130px
  ├─ hour                          — FRAME, V AUTO-LAYOUT, 48×126px, gap: 2px
  │    ├─ _menu-dropdown-label     — INSTANCE (label "HH"), 48×24px
  │    │    └─ label               — TEXT, fill: color/text/secondary
  │    └─ menu-dropdown-item ×3    — INSTANCE (State=Default or State=selected time)
  │         padding: spacing/component/sm (8px) L/R · spacing/component/xxs (2px) T/B
  ├─ separator                     — INSTANCE (menu-dropdown-item used as ":" divider), 20×126px
  │    └─ label                    — TEXT ":"
  └─ minute                        — FRAME, V AUTO-LAYOUT, 48×126px, gap: 2px
       ├─ _menu-dropdown-label     — INSTANCE (label "MM"), 48×24px
       └─ menu-dropdown-item ×3    — INSTANCE (State=Default or State=selected time)
```

> **Figma node:** `401:2598`. The `os-time-menu` variant is used exclusively inside the calendar Date-Time Picker — never as a standalone dropdown.
> The middle child (separator) reuses `menu-dropdown-item` as a structural separator showing `:` between the hour and minute columns.

### Token Bindings

| Layer | Property | Token |
|---|---|---|
| container | Fill | `color/surface/overlay` |
| container | Stroke | `color/border/default` 1px INSIDE |
| container | Radius (all 4) | `radius/lg` |
| container | Padding (all sides) | `spacing/component/xxs` |
| container | Gap | `spacing/component/xxs` |
| `search-bar` placeholder | Fill | `color/input/placeholder` |
| `search-bar` icon-search VECTOR | Stroke | `color/icon/default` |

> Container uses `color/surface/overlay` — this is a floating panel that appears above the page canvas. Never use `color/background/default` or `color/surface/default` here.

### Usage Rules

- Use `Type=List` for a plain list of options (the default for select and basic combobox)
- Use `Type=Search` when the dropdown has a built-in search bar at the top — pair with `combobox-trigger Type=Search`
- Use `Type=Group` when options are logically grouped with section headings and a separator
- The 6 SLOT rows exist to represent additional list items beyond the 5 pre-built instances — swap them for `menu-dropdown-item` instances when representing longer lists in Figma
- Never use `menu-dropdown` as a standalone floating element — it is always attached to a trigger (`select-field` Open state or `combobox-field` Open state)

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Set `label state` manually on the instance inside a field | Let the parent field component control the `label state` prop |
| Override `label-text` fill directly on the label instance | Change `label state` to Default / Disabled / Invalid |
| Use `color/icon/default` on icon-leading in Hover / Focused states | `color/background/accent/foreground` — container is filled, must pair |
| Use `menu-dropdown` standalone on the canvas | Always attach to a field's Open state |
| Use `color/background/default` or `color/surface/default` on menu-dropdown fill | `color/surface/overlay` — it is a floating overlay |
| Mix icon-leading visibility — some items with icons, some without | All items in a list must be consistent: all icons or no icons |
