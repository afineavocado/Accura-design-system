# Date Picker

An input trigger that opens a calendar popup for selecting a single date, date range, or typed date input. Built from one component set; the calendar popup is a `calendar` instance.

---

## Component Set

| Set | ID | Variants | Role |
|---|---|---|---|
| `date-picker` | `58:15976` | 12 | Trigger + popup container |

---

## Variant Matrix

| Property | Options |
|---|---|
| `Type` | `Default`, `Range`, `Input` |
| `State` | `Closed`, `Hover`, `Focus`, `Open` |

3 Types × 4 States = 12 variants.

| Type | Description |
|---|---|
| `Default` | Button-style trigger — click to open a single-month calendar |
| `Range` | Button-style trigger — click to open a two-month range calendar |
| `Input` | Input-style trigger with calendar icon — click to open single-month calendar |

---

## Structure

### State=Closed / Hover / Focus

```
date-picker                     — VERTICAL, no outer padding
  └─ trigger                    — HORIZONTAL, gap: spacing/component/sm, radius/md
       ├─ [icon]                — INSTANCE (chevron-down or calendar icon), 16×16px
       └─ placeholder           — TEXT, label/sm, color/input/placeholder
```

### State=Open

```
date-picker                     — VERTICAL, no outer padding
  ├─ trigger                    — same as above
  └─ calendar                   — INSTANCE of calendar component
```

> `Type=Default` and `Type=Input` show a single-month calendar popup.
> `Type=Range` shows a two-month calendar popup (520px wide).
> See [Calendar](Calendar.md) for calendar popup structure and token details.

### Icons per Type

| Type | Icon | Source |
|---|---|---|
| `Default` | `chevron-down` | System icon `159:35236` |
| `Range` | `Lucide Icons / calendar` | Lucide library |
| `Input` | `calendar` | System icon |

---

## Token Bindings

### trigger — per State

| State | Fill | Stroke | Stroke weight | Radius | Gap |
|---|---|---|---|---|---|
| `Closed` | `color/input/bg` | `color/input/border` | 1px | `radius/md` | `spacing/component/sm` |
| `Hover` | `color/input/bg` | `color/input/border` | 1px | `radius/md` | `spacing/component/sm` |
| `Focus` | `color/input/bg` | `color/border/focus` | 1px | `radius/md` | `spacing/component/sm` |
| `Open` | `color/input/bg` | `color/border/default` | 1px | `radius/md` | `spacing/component/sm` |

### trigger — text

| Layer | Token | All states |
|---|---|---|
| `placeholder` | `color/input/placeholder` | ✅ All 12 variants |

The trigger uses input semantic tokens — same token set as a text input field.

### calendar INSTANCE (State=Open)

| Property | Token |
|---|---|
| Fill | `color/background/default` |

The calendar component manages all its own internal token bindings.

---

## Date Format Rule

The trigger displays the selected date(s) using a fixed pattern — never a numeric-only format.

| | Pattern | Example |
|---|---|---|
| Single date | `MMM d, yyyy` | `Jun 18, 2026` |
| Range | `MMM d, yyyy – MMM d, yyyy` | `Jun 17, 2026 – Jul 14, 2026` |

**Library:** `date-fns` → `format(date, "MMM d, yyyy")`

**Why this pattern:**
- Unambiguous across locales — `06/07/2026` reads as June 7 in the US and July 6 in the UK; `Jun 7, 2026` reads the same everywhere
- Matches natural reading order (month, day, year) used in body copy and headings
- Consistent with how dates should be displayed anywhere else in the system — any new component showing a date should follow this same pattern

---

## Sizing

| Variant | Trigger width | Trigger height | Open height (total) |
|---|---|---|---|
| `Default` | 280px | 36px | 374px |
| `Range` | 280px (Closed/Hover/Focus) · 520px (Open) | 36px | 332px |
| `Input` | 280px | 36px | 374px |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `combobox` (trigger) · `dialog` or `grid` (popup) |
| Keyboard | `Enter` / `Space` to open · `Escape` to close · Arrow keys to navigate days inside popup |
| Screen reader | Announce selected date on close · Announce "Pick a date" when no value selected |
| Focus | Focus returns to trigger after date selection |
| Touch target | Trigger is 36px tall — below 44px minimum; implementation should add 4px hit-area padding |

---

## Usage Rules

- Use `Type=Default` for single-date fields (e.g. booking date, due date).
- Use `Type=Range` when two dates define a period (e.g. check-in / check-out, report window).
- Use `Type=Input` when the field lives inside a form row alongside other inputs — the calendar icon signals it opens a picker without relying on a chevron.
- Always pair with a visible label above the trigger — the placeholder alone is not sufficient for accessibility.
- `State=Closed` is the default resting state. Do not use `State=Open` as a starting state.

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- A booking form needs a "Check-in date" field that opens a calendar on click
- A task management form requires a "Due date" input alongside text fields
- A report filter asks for a "From / To" date range to scope the query
- An HR form collects a date of birth in a standard form row
- A scheduling tool needs a "Publish at" field combining date and time
- A content management form includes a "Expires on" date field beside other metadata inputs

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Default` | Single date fields in any form context — button-style trigger | Due date on a task · Start date on a project · Appointment booking date |
| `Range` | Selecting a start and end date that define a period | Report date range · Hotel check-in/check-out · Subscription billing window |
| `Input` | Form rows where the field must look like a text input alongside other inputs | Date of birth in a profile form · Expiry date in a settings panel · Filter row in a dense table toolbar |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Date field inside a form that opens a picker on demand | `date-picker` | `calendar` |
| Always-visible date display or selection embedded on a page | `calendar` | `date-picker` |
| Selecting a single time (no date) | a standalone time input | `date-picker` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Override `placeholder` text fill to `color/background/default/foreground` | `color/input/placeholder` — the trigger is an input field |
| Apply a fill to the icon instance frame | Icons are stroke-based — no fill on the instance frame |
| Use `Type=Range` for a single date | Use `Type=Default` |
| Embed `calendar` directly without the `date-picker` trigger | Always use the `date-picker` component — it owns the open/close interaction |
