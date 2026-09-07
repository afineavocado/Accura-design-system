# Component Directory

Auto-generated from `artifacts/components/[name].meta.json`. Lists all 35 components with their Figma node, Storybook path, and source files.

**Last updated:** 2026-06-03

---

## How to use

**Figma → Storybook:** Find the component in the table below → use the Storybook title to navigate in Storybook (`http://localhost:6006`).

**Storybook → Figma:** Find the Storybook title → use the Figma node ID to navigate: in Figma, press `Cmd+L` and paste `https://www.figma.com/design/YWfTOUTpFZ0BNxHobfUqme?node-id=[figma-node-id]`.

**Deep lookup:** Read `artifacts/components/[name].meta.json` for full token bindings, behavior, implementation notes, known issues, and all story names.

---

## Actions

| Component | Description | Figma Node | Storybook | tsx |
|---|---|---|---|---|
| Button | Primary interactive control — 6 variants, 3 sizes, icon support. | `12:2893` | `Actions/Button` | `button.tsx` |
| Button Group | Composable group of ghost buttons in a bordered container — horizontal or vertical. | `52:11151` | `Display/ButtonGroup` | `button-group.tsx` |

---

## Forms

| Component | Description | Figma Node | Storybook | tsx |
|---|---|---|---|---|
| Checkbox | Binary selection control — Default, Checked, Indeterminate states. | `59:18266` | `Forms/Checkbox` | `checkbox.tsx` |
| Combobox | Searchable dropdown — Basic, Search, Tag Input (free-form chips), multi-select. | `75:9166` | `Forms/Combobox` | `combobox.tsx` |
| DatePicker | Trigger + calendar popup for single date or range selection. | `58:15976` | `Forms/DatePicker` | `date-picker.tsx` |
| Input | Single-line text entry — 6 states, leading/trailing icon, trailing button. | `49:10806` | `Forms/Input` | `input.tsx` |
| Input OTP | Verification code slot group — 6 states, 3/3 and 6-slot layouts. | `58:17437` | `Forms/InputOTP` | `input-otp.tsx` |
| RadioGroup | Single-choice radio button group — basic and choice card layouts. | `96:33420` | `Forms/RadioGroup` | `radio-group.tsx` |
| Select | Fixed-list dropdown picker — 6 states, groups, separator. | `74:757` | `Forms/Select` | `select.tsx` |
| Slider | Range input — horizontal, vertical, range, with steps. | `67:9199` | `Forms/Slider` | `slider.tsx` |
| Switch | Toggle control — Default and Small sizes, item compositions. | `67:88` | `Forms/Switch` | `switch.tsx` |
| Textarea | Multi-line text input — header, footer, character count, resize. | `49:10806` | `Forms/Textarea` | `textarea.tsx` |

---

## Display

| Component | Description | Figma Node | Storybook | tsx |
|---|---|---|---|---|
| Avatar | User/entity avatar — image, fallback initials, online/offline indicator. | `60:18486` | `Display/Avatar` | `avatar.tsx` |
| Badge | Status label — 12 variants, 3 shapes, 3 sizes, icon slots. | `107:40465` | `Display/Badge` | `badge.tsx` |
| Calendar | Date and range selection — month/year selector, presets, date-time picker. | `28:4073` | `Display/Calendar` | `calendar.tsx` |
| Item | List row — 6 types (Default, Icon, Avatar, Image, Header, Link) × 3 variants × 3 sizes. | `65:815` | `Display/Item` | `item.tsx` |
| Separator | Horizontal or vertical divider line. | `75:11717` | `Layout/Separator` | `separator.tsx` |
| Skeleton | Loading placeholder — animate-pulse, composable shapes. | `—` | `Feedback/Skeleton` | `skeleton.tsx` |

---

## Feedback

| Component | Description | Figma Node | Storybook | tsx |
|---|---|---|---|---|
| Alert | Inline feedback banner — Default, Destructive, Warning; optional icon and action. | `74:1777` | `Feedback/Alert` | `alert.tsx` |
| Empty | Empty state — 3 variants (default/outline/background), icon, title, description, actions. | `97:34667` | `Display/Empty` | `empty.tsx` |
| Progress | Progress bar — sm/md/lg sizes, complete state, indeterminate. | `110:8283` | `Feedback/Progress` | `progress.tsx` |
| Toast | Transient notification — auto-dismiss, action button, multiple types. | `105:666` | `Feedback/Toast` | `sonner.tsx` |
| Tooltip | Hover/focus label — 4 sides, 300ms delay, icon-only button labelling. | `74:1699` | `Overlay/Tooltip` | `tooltip.tsx` |

---

## Overlay

| Component | Description | Figma Node | Storybook | tsx |
|---|---|---|---|---|
| Alert Dialog | Modal requiring explicit decision — Default/Destructive, Inline/Full-width footer. | `152:3240` | `Overlay/AlertDialog` | `alert-dialog.tsx` |
| Dialog | Modal with neutral close — forms, scrollable content, destructive confirm. | `266:131` | `Overlay/Dialog` | `dialog.tsx` |
| Drawer | Slide-in panel — bottom, right; responsive (Drawer on mobile, Dialog on desktop). | `74:691` | `Overlay/Drawer` | `drawer.tsx` |
| Sheet | Slide-in sheet — right, left, bottom, top sides. | `98:57748` | `Overlay/Sheet` | `sheet.tsx` |

---

## Navigation

| Component | Description | Figma Node | Storybook | tsx |
|---|---|---|---|---|
| Breadcrumb | Path hierarchy — slash/dot separators, ellipsis, icon. | `291:223` | `Navigation/Breadcrumb` | `breadcrumb.tsx` |
| Navigation Menu | Horizontal site nav — trigger + dropdown panels (List/Grid/Featured layouts). | `127:193` | `Navigation/NavigationMenu` | `navigation-menu.tsx` |
| Pagination | Page navigation — basic, with changer, with jumper, disabled states. | `59:18253` | `Navigation/Pagination` | `pagination.tsx` |
| Sidebar | Full application sidebar — Default/Floating, collapsible (icon mode), Cmd+B toggle. | `95:18202` | `Navigation/Sidebar` | `sidebar.tsx` |
| Tabs | Tab switching — Default (card) and Line variants, vertical, disabled. | `59:17793` | `Navigation/Tabs` | `tabs.tsx` |

---

## Layout

| Component | Description | Figma Node | Storybook | tsx |
|---|---|---|---|---|
| Accordion | Collapsible content sections. | `27:3059` | `Layout/Accordion` | `accordion.tsx` |
| Card | Content container — 10 layout compositions. | `297:4933` | `Layout/Card` | `card.tsx` |

---

## Data

| Component | Description | Figma Node | Storybook | tsx |
|---|---|---|---|---|
| Table | Data table — sort, selection, avatars, trend indicators. | `124:8531` | `Data/Table` | `table.tsx` |

---

## Notes

- **Figma file key:** `YWfTOUTpFZ0BNxHobfUqme`
- **Skeleton:** Code-only — no Figma component set. Figma page exists as reference layout documentation only.
- **Textarea:** Shares Figma component set (`49:10806`) with Input (`Type=Textarea` variant). Separate tsx and story files.
- **AlertDialog:** Shares Figma component set area with Alert but has its own node (`152:3240`). Separate tsx and story files.
- For full token bindings, variant matrices, and implementation details: read `artifacts/components/[name].meta.json`.
