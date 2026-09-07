

A date and range selection control built from four composable component sets. `calendar` is the top-level container; the three sub-components (`calendar-day`, `calendar-month`, `_calendar-preset`) handle individual cell rendering.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `calendar-day` | `27:3095` | 9 | Individual day cell — used inside every `week` row |
| `calendar-month` | `159:15346` | 4 | Month pill — used in Month-Year Selector view |
| `_calendar-preset` | `159:15381` | 4 | Preset shortcut row — used in Presets view |
| `calendar` | `28:4073` | 6 | Top-level container — assembles the correct sub-components per Type |

---

## Variant Matrices

### `calendar-day` — `State × 9`

| State | Fill | Text |
|---|---|---|
| `Default` | transparent | `color/background/default/foreground` |
| `Outside` | transparent | `color/text/secondary` |
| `Today` | `color/background/accent` | `color/background/accent/foreground` |
| `Selected` | `color/brand/primary` | `color/brand/primary/foreground` |
| `Range-Start` | `color/brand/primary` | `color/brand/primary/foreground` |
| `Range-Middle` | `color/background/accent` | `color/background/accent/foreground` |
| `Range-End` | `color/brand/primary` | `color/brand/primary/foreground` |
| `Disabled` | transparent | `color/text/disabled` |
| `Booked` | transparent | `color/text/secondary` |

- Fixed size: 32 × 32px
- Radius: `radius/md` all 4 corners

### `calendar-month` — `State × 4`

| State | Fill | Text |
|---|---|---|
| `Default` | transparent | `color/background/default/foreground` |
| `Hover` | `color/background/accent` | `color/background/accent/foreground` |
| `Selected` | `color/brand/primary` | `color/brand/primary/foreground` |
| `Disabled` | transparent | `color/text/disabled` |

- Radius: `radius/md` all 4 corners
- No padding — size driven by parent grid

### `_calendar-preset` — `State × 4`

| State | Fill | Text |
|---|---|---|
| `Default` | transparent | `color/background/default/foreground` |
| `Hover` | `color/background/accent` | `color/background/accent/foreground` |
| `Selected` | `color/background/accent` | `color/background/accent/foreground` |
| `Disabled` | transparent | `color/text/disabled` |

- Radius: `radius/md` all 4 corners
- `paddingLeft`: `spacing/component/sm` (8px); vertical padding: 0

> Selected uses `color/background/accent` (not `color/brand/primary`) — preset selection is a soft highlighted state, not a terminal confirm action. Contrast with `calendar-month` where Selected is the primary brand fill.

### `calendar` — `Type × 6`

| Type | Description |
|---|---|
| `Default` | Single-month date picker |
| `Range` | Dual-month range picker — two `calendar` instances side by side |
| `Month-Year Selector` | Grid of month pills for switching the displayed month/year |
| `Presets` | Preset shortcuts + single-month calendar |
| `Date-Time Picker` | Calendar + time input field |
| `Booked Dates` | Single-month view with explicitly named week frames for programmatic slot control |

---

## Structure

### `calendar-day`

```
calendar-day                    — FRAME, 32×32, radius/md
  └─ day                        — TEXT
```

### `calendar-month`

```
calendar-month                  — FRAME, radius/md
  └─ label                      — TEXT
```

### `_calendar-preset`

```
_calendar-preset                — FRAME, radius/md, paddingLeft: spacing/component/sm
  └─ label                      — TEXT
```

### `calendar` — Type=Default / Type=Month-Year Selector / Type=Booked Dates

```
calendar                        — VERTICAL AUTO LAYOUT, radius/lg, stroke: color/border/default
                                  fill: color/surface/default, padding: spacing/component/md (all sides)
  ├─ header                     — FRAME (space-between)
  │    ├─ btn-prev              — INSTANCE (icon button, chevron-left)
  │    ├─ Year                  — FRAME
  │    │    ├─ month-label      — TEXT
  │    │    └─ chevron-down     — INSTANCE (icon)
  │    └─ btn-next              — INSTANCE (icon button, chevron-right)
  ├─ weekdays                   — FRAME (7 × day-header)
  │    └─ day-header ×7         — FRAME
  │         └─ label            — TEXT
  └─ week ×6                    — FRAME (7 × calendar-day)
       └─ calendar-day ×7       — INSTANCE
```

> **Booked Dates only:** week rows are named `week-1` through `week-6` (not `week`) to allow programmatic indexing. Header uses `btn-prev` / `btn-next` as siblings with a `label` text node instead of the `Year` sub-frame.

> **Month-Year Selector:** replaces week rows with `month-row-1` through `month-row-4` — each contains 3 `calendar-month` instances.

### `calendar` — Composite variants (Type=Range / Presets / Date-Time Picker)

These variants **embed** complete `calendar` instances as children. The outer frame has **no padding** — the embedded calendar's own padding handles all spacing. The outer container provides only the shared border and radius.

```
Type=Range
  ├─ calendar                   — INSTANCE (left month)
  ├─ divider                    — RECTANGLE
  └─ calendar                   — INSTANCE (right month)

Type=Presets
  ├─ presets                    — FRAME (vertical, 5 × _calendar-preset)
  ├─ separator                  — INSTANCE
  └─ calendar                   — INSTANCE

Type=Date-Time Picker
  ├─ calendar                   — INSTANCE
  ├─ separator                  — INSTANCE
  └─ footer                     — FRAME, padding: 12px, border-top: color/border/default
       ├─ label                 — TEXT "Time", fill: color/background/default/foreground
       └─ combobox-trigger      — INSTANCE (Type=Time-picker, State=Default)
            ├─ placeholder      — TEXT, fill: color/input/placeholder
            └─ icon-chevron     — INSTANCE (chevron-down, 16×16), stroke: color/icon/default
```

---

## Token Bindings

### `calendar` container — per variant

| Property | Default · Month-Year · Booked | Range · Presets · Date-Time |
|---|---|---|
| Fill | `color/surface/default` | `color/surface/default` |
| Stroke | `color/border/default` 1px INSIDE | `color/border/default` 1px INSIDE |
| Radius (all 4 corners) | `radius/lg` | `radius/lg` |
| Padding (all 4 sides) | `spacing/component/md` (12px) | 0 — embedded instances own their padding |
| `itemSpacing` | `spacing/component/xxs` (Default · Booked) · `spacing/component/sm` (Month-Year) | 0 |

### `calendar` internal layers

| Layer | Property | Token |
|---|---|---|
| `month-label` | Fill | `color/background/default/foreground` |
| `day-header` label | Fill | `color/text/secondary` |
| `week` / `week-N` frames | `itemSpacing` | `spacing/component/xxs` |
| `header`, `weekdays` frames | Fill | transparent |

---

## Design Decisions

**Why `color/surface/default` on the container**
The calendar is a component surface — it renders on top of the page canvas and must adapt to any parent background. `color/background/default` is reserved for page canvas only and was the previous (incorrect) token. `color/surface/default` is the correct semantic group for any component that floats above or is embedded within a layout.

**Why composite variants have no padding**
`Type=Range`, `Type=Presets`, and `Type=Date-Time Picker` embed full `calendar` instances as children. Each embedded instance already carries `spacing/component/md` padding on all sides. Adding outer padding on the composite wrapper would double-pad the edge content. The outer container provides only the shared border and radius.

**Why `Booked Dates` uses named week frames**
Programmatic calendar rendering (e.g. a booking widget) needs to target each week row by index. Named frames (`week-1` through `week-6`) allow runtime code to address specific rows without traversal. The generic `week` naming in other variants is sufficient since state is managed at the `calendar-day` level.

---

## Behavior

### Single date selection (Type=Default / Booked Dates)

| Action | Result |
|---|---|
| Click a `Default` day | Day → `Selected`; previously selected day → `Default` |
| Click `Today` day | Day → `Selected`; fills with `color/brand/primary` |
| Click `Outside` day | Navigates to that month and selects the day |
| Click `Disabled` or `Booked` day | No action — pointer-events: none |
| Click `btn-prev` / `btn-next` | Navigates one month backward / forward |
| Click `month-label` | Opens `Type=Month-Year Selector` overlay |

### Range selection (Type=Range)

| Click | Result |
|---|---|
| First click (no selection) | Sets `Range-Start` (`from`) on clicked day |
| Hover after first click | Days between start and hovered day show `Range-Middle` preview |
| Second click | Sets `Range-End` (`to`); days between become `Range-Middle` |
| Third click (default) | **Adjusts the nearest boundary** — if clicked day is closer to `from`, updates start; if closer to `to`, updates end |
| Click same day twice | Selects a single-day range (start = end, 0 nights) |

> **`resetOnSelect` mode (opt-in):** When `resetOnSelect={true}` is passed, a third click instead clears `to` and sets the clicked day as the new `from`, starting a fresh selection. Use this when you want clean re-selections rather than boundary adjustment.

Source: React DayPicker — `mode="range"` default behavior.

### Time picker (Type=Date-Time Picker)

The time field in `Type=Date-Time Picker` is a custom inline picker — **not the native OS time input**. It has two interaction modes that stay in sync:

**Type directly:**
- The input accepts free text in `HH:MM` format (24-hour)
- Typing a valid time (e.g. `14:30`) syncs the hour and minute columns in the popover
- Minutes snap to the nearest 5-minute interval

**Click the Clock icon:**
- Opens a popover with two scrollable columns: `HH` (00–23) and `MM` (00, 05, 10 … 55)
- Selecting a value in either column updates both the column highlight and the typed input
- `onOpenAutoFocus` is prevented — focus stays on the text input while the popover is open
- Popover closes when clicking outside

**Time trigger tokens (Input spec):**

| Layer | Property | Token |
|---|---|---|
| Container | Fill | `color/background/default` |
| Container | Stroke | `color/input/border` |
| Container | Radius | `radius/md` |
| Container | Height | 36px |
| Container | Padding H | `spacing/component/md` |
| Container | Gap | `spacing/component/sm` |
| Container focus | Stroke | `color/border/focus` + ring glow |
| `icon-clock` | Stroke | `color/icon/default` |
| Input text | Fill | `color/background/default/foreground` |
| Placeholder | Fill | `color/input/placeholder` |

**Time popover tokens:**

| Layer | Property | Token |
|---|---|---|
| Popover container | Fill | `color/surface/overlay` |
| Popover container | Stroke | `color/border/default` |
| Popover container | Radius | `radius/lg` |
| Popover container | Padding | `spacing/component/xxs` (2px all sides) |
| Popover column gap | Gap | `spacing/component/xxs` (2px between HH and MM columns) |
| Column item width | — | 48px (`w-12` — fills column width) |
| Column item default | Fill | transparent |
| Column item default | Text | `color/background/default/foreground` |
| Column item hover | Fill | `color/background/accent` |
| Column item selected | Fill | `color/brand/primary` |
| Column item selected | Text | `color/brand/primary/foreground` |
| Column label (HH / MM) | Fill | `color/text/secondary` |
| Column label (HH / MM) | Text style | `text-xs font-medium` |
| Column item focus ring | Ring | `color/ring` 2px outside |
| Column container | Height | `h-48` (192px, scrollable) |
| Column container | Gap between items | `spacing/component/xxs` (2px) |
| Column container | Scrollbar | Hidden (`scrollbar-none`) |
| Column container | Scroll behavior | Selected item auto-scrolls to center on open (`scrollIntoView block:center`) |

### Month-Year Selector (Type=Month-Year Selector)

**Trigger:**
Clicking the `month-label` / `chevron-down` in the calendar header (e.g. "May 2026 ▾") transitions the calendar body **in-place** from the day grid to the Month-Year Selector view. No overlay, no popover — the same panel swaps its content. The `chevron-down` icon rotates 180° to signal the open state.

**What the user sees first — months, not year:**
The selector opens showing all 12 month pills for the currently displayed year. Month selection is the primary action. Year navigation is secondary — the user steps forward/backward one year at a time using the `btn-prev` / `btn-next` arrows in the selector header.

The header shows two separate clickable buttons: **`"June ∨"`** (month) and **`"2026 ∨"`** (year). Each toggles its own selector grid independently.

```
Header buttons (always visible):
  [June ∨]  [2026 ∨]   — both always shown; active one gets accent highlight

Click "June ∨"  → view = "months"  → shows 4×3 month pill grid
  • Click a month pill → view returns to "days", displaying that month
  • Click "June ∨" again → toggles back to "days" with no change

Click "2026 ∨"  → view = "years"  → shows 4×3 year pill grid (12-year range)
  • Click a year pill → view = "months" (pick month for that year)
  • Click "2026 ∨" again → toggles back to "days" with no change

Prev / Next arrows:
  • days view   → navigate one month
  • months view → navigate one year
  • years view  → navigate 12 years
```

**Pill grid tokens (shared for month and year grids):**

| State | Fill | Text |
|---|---|---|
| Default | transparent | `color/background/default/foreground` |
| Hover | `color/background/accent` | `color/background/accent/foreground` |
| Selected (current month / year) | `color/brand/primary` | `color/brand/primary/foreground` |

**Active header button state:** the currently open grid's button gets `color/background/accent` fill to signal which view is active.

**Implementation note:**
Controlled view-state swap — the Calendar component holds `view: "days" | "months" | "years"` and renders the appropriate pill grid. React DayPicker's built-in caption and nav are hidden in single-month mode; a custom `CaptionWithToggle` component is rendered instead. Multi-month mode (Range) uses DayPicker's built-in caption styled with our tokens.

### Presets (Type=Presets)

- Click a `_calendar-preset` row → sets that preset's date range on the calendar to its right
- Clicked preset switches to `State=Selected`; previous selection returns to `Default`
- User can then refine the range by interacting with the calendar after preset selection

### Month navigation

- `btn-prev` / `btn-next` are icon buttons — clicking steps one month; holding is not required
- After navigation the `month-label` updates; `aria-live="polite"` announces the new month to screen readers
- Days from the previous / next month shown in `State=Outside` are non-selectable by default (implementation-configurable)

### Keyboard

| Key | Action |
|---|---|
| `Arrow keys` | Move focus between day cells |
| `Enter` / `Space` | Select focused day |
| `Page Up` | Previous month |
| `Page Down` | Next month |
| `Home` | First day of current month |
| `End` | Last day of current month |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `application` (interactive calendar widget) |
| Grid | `role="grid"` on weeks area, `role="row"` per week, `role="gridcell"` per day |
| Selected date | `aria-selected="true"` on selected `gridcell` |
| Disabled dates | `aria-disabled="true"` |
| Navigation | Arrow keys move focus between days; `Page Up`/`Down` for previous/next month |
| Month label | `aria-live="polite"` — announces month change to screen readers |
| Prev/Next buttons | `aria-label="Previous month"` / `"Next month"` |

---

## Usage Rules

- Use `Type=Default` for single date selection
- Use `Type=Range` for check-in/check-out or start/end date pairs
- Use `Type=Month-Year Selector` as a drill-down overlay when the user taps the month label — not as a standalone picker
- Use `Type=Presets` when offering quick selections (Last 7 days, Last 30 days, etc.) alongside a custom range
- Use `Type=Date-Time Picker` when both a date and time are required in one control
- Use `Type=Booked Dates` when specific days must be marked unavailable and week rows need programmatic control
- Never override `calendar-day` fills from the parent `calendar` — change the day's `State` prop instead

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Booking or reservation flow where the full month must be visible and unavailable dates are marked — `Type=Booked Dates`
- Dashboard analytics filter where the user picks a date range inline on the page — `Type=Range`, always visible
- Leave or absence request form with a start and end date — `Type=Range`
- Event scheduler that needs quick preset options ("Next 7 days", "This month") alongside a custom picker — `Type=Presets`
- Appointment booking widget that combines a date and time in one step — `Type=Date-Time Picker`
- Report or audit log page where the always-visible calendar is the primary navigation control

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Type=Default` | Single-date selection embedded in a page or panel | Appointment date · Task due date in a sidebar |
| `Type=Range` | Start + end date pair across two visible months | Hotel check-in / check-out · Leave request · Reporting period |
| `Type=Month-Year Selector` | Drill-down navigation — triggered by tapping the month label in any calendar header | Jump to a distant month in a booking flow |
| `Type=Presets` | Power users need fast shortcuts alongside the ability to pick a custom range | Analytics date filter ("Last 7 days", "Last 30 days", "Custom") |
| `Type=Date-Time Picker` | Both a date and a time are required in one combined control | Meeting scheduler · Reminder time · Scheduled publish |
| `Type=Booked Dates` | Specific days must be marked unavailable; week rows need programmatic control | Rental availability calendar · Appointment slot widget |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Always-visible date panel embedded in a page layout | `calendar` | `date-picker` |
| Date input that pops a calendar on demand (form field + trigger button) | `date-picker` | `calendar` |
| Multi-date or range selection displayed inline | `calendar` (`Type=Range`) | `date-picker` |
| User needs quick preset shortcuts alongside a custom range | `calendar` (`Type=Presets`) | `select` or `input` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| `color/background/default` on container fill | `color/surface/default` — calendar is a component surface, not page canvas |
| Padding on Range / Presets / Date-Time Picker outer frame | No padding — embedded `calendar` instances own their own padding |
| Override `calendar-day` fill from the `calendar` parent | Set the `calendar-day` `State` prop instead |
| Primitive tokens (`spacing/3`) for padding | `spacing/component/md` — same value, correct semantic collection |
| More than 5 preset rows in Type=Presets | Keep presets scannable — use a dropdown for longer lists |
