# Button Group

A bordered container that visually groups related ghost buttons into a single connected control. Used for segmented actions, toolbar clusters, and paired controls where the actions are related but mutually independent.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `button-group` | `52:11151` | 4 | Grouped button container — horizontal or vertical, 2 or 3 buttons |

---

## Variant Matrix

| Property | Options | Default |
|---|---|---|
| `Orientation` | `Horizontal`, `Vertical` | `Horizontal` |
| `Number` | `2`, `3` | `2` |

`Orientation(2) × Number(2) = 4 variants`

---

## Structure

```
button-group                    — AUTO LAYOUT (HORIZONTAL or VERTICAL), radius/md, stroke: color/border/default
  ├─ button                     — INSTANCE (Type=Ghost, State=Enabled)
  ├─ separator                  — INSTANCE (_breadcrumb-separator or separator component)
  ├─ button                     — INSTANCE
  ├─ separator                  — INSTANCE (Number=3 only)
  └─ button                     — INSTANCE (Number=3 only)
```

- **Horizontal** variants use `Type=Ghost, Size=Default` buttons — text + optional icon
- **Vertical** variants use `Type=Ghost, Size=Icon Large` buttons — icon only (44×44px)
- Separators sit between every pair of buttons — never at start or end

---

## Token Bindings

### Container frame

| Property | Token | Value |
|---|---|---|
| Fill | `color/surface/default` | Component surface — adapts to any parent surface |
| Stroke | `color/border/default` | 1px · INSIDE |
| Radius (all 4 corners) | `radius/md` | 10px |
| Padding | none (0px) | Buttons fill edge-to-edge |
| Gap | none (0px) | Buttons are flush — separator provides the visual divide |

### Button instances

Button instances own their own token bindings — `button-group` does not override any internal fills or spacing. Use the button component's `Type`, `State`, and `Size` props to change appearance.

| Orientation | Button type used |
|---|---|
| `Horizontal` | `Type=Ghost, Size=Default` |
| `Vertical` | `Type=Ghost, Size=Icon Large` |

### Separator instances

| Property | Token |
|---|---|
| Fill | `color/border/default` |

Separators are 1px wide (Horizontal) or 1px tall (Vertical) — they render as a hairline rule between buttons.

---

## Usage Rules

- Use `button-group` when actions are related and the grouped visual treatment communicates their relationship — not for unrelated buttons placed near each other
- `Orientation=Horizontal` is for text-label actions (Bold / Italic / Underline, Export / Preview / Share)
- `Orientation=Vertical` is for icon-only stacked controls (zoom in / zoom out, align top / align bottom)
- `Number=2` is the default — use `Number=3` only when all three actions are equally important and distinct
- Do not mix text buttons and icon buttons within the same group — pick one type per group
- The button-group has no disabled state at the container level — disable individual buttons by switching their `State` prop

---

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Formatting controls where options are complementary but independent (Bold / Italic / Underline in a rich text editor)
- View-mode toggles where the user picks one display mode at a time (List view / Grid view / Table view)
- Zoom and transform controls in a canvas or map toolbar (Zoom in / Zoom out)
- Alignment controls in a design or layout tool (Align left / Align center / Align right)
- Export or share actions that are closely related but individually invokable (Export / Preview / Share)

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Orientation=Horizontal` | Text-label actions where the labels communicate the distinction | Bold / Italic / Underline · Export / Preview / Share · Month / Week / Day in a calendar |
| `Orientation=Vertical` | Icon-only stacked controls where vertical real estate is better than horizontal | Zoom in / Zoom out on a map · Align top / center / bottom in a layout panel |
| `Number=2` | Two clearly paired complementary actions | List view / Grid view · Expand / Collapse |
| `Number=3` | Three equally weighted actions in the same cluster | Left / Center / Right alignment · Previous / Current / Next period |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A single isolated action | `button` | `button-group` (grouping a lone button adds visual noise with no meaning) |
| Mutually exclusive selection where one option must always be active (like tabs) | `tabs` or a segmented control | `button-group` (button-group doesn't manage selected state) |
| More than 3 related actions | A dropdown menu | `button-group` with 4+ items (too wide and visually cluttered) |
| Navigation between routes | `navigation-menu` | `button-group` (button-group is for actions, not route navigation) |

---

## Behavior

### Individual button states

Each button inside the group manages its own state independently — hover, focus, active, and disabled states on one button do not affect its siblings.

| State | How to apply |
|---|---|
| Hover / Focus / Active | Handled by the embedded `button` component automatically |
| Disabled | Set the individual button's `State=Disabled` prop — not a group-level control |
| All disabled | Set each button to `State=Disabled` individually |

### No group-level toggle

`button-group` is not a segmented control — it does not manage selected/active state across buttons. If you need mutually exclusive selection (only one button active at a time), handle selection state in code and reflect it by switching the active button's `Type` or `State` prop.

### Separator behavior

The separator between buttons is purely visual — it has no interactive behavior, receives no focus, and is always `aria-hidden`. It renders as a 1px line using `color/border/default`.

### Orientation switching

- `Orientation=Horizontal`: buttons read left-to-right, text labels visible
- `Orientation=Vertical`: buttons stack top-to-bottom, icon-only (44×44px each)
- Do not switch orientation at runtime — choose the correct variant at design time

---

## Accessibility

| Property | Value |
|---|---|
| Role | `group` with `aria-label` describing the group purpose |
| Individual buttons | Each button needs its own `aria-label` (especially icon-only in Vertical) |
| Separator | `aria-hidden="true"` — decorative only |
| Keyboard | Standard tab order through each button |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| `color/background/default` on container fill | `color/surface/default` — group is a component surface, not page canvas |
| Override button fills from button-group | Change the button's `Type` or `State` prop instead |
| Place non-Ghost buttons inside button-group | Ghost type only — the group border provides the visual container |
| Use button-group for navigation | Use tab-list or nav-button instead |
| More than 3 buttons | Split into separate groups or use a different pattern |
