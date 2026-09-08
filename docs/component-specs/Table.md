# Table

A semantic data table built on shadcn's Table, which renders standard HTML `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, and `<td>` elements. Purely presentational — sorting, filtering, and pagination are implementation concerns supplied by the parent (e.g. TanStack Table). Three component sets cover the header cell, data cell, and row; the full table is assembled manually from these sets inside a container FRAME.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `table-head` | `105:25960` | 3 | Column header cell — shows label + optional sort indicator |
| `table-cell` | `105:29158` | 47 | Data cell — 25 content Types across Default and Compact sizes |
| `_table-row` | `124:8531` | 12 | Row container — wraps cells; carries row-level fill and stroke |

> There is no `table` component set. The full table is assembled as a FRAME containing `_table-row` instances. See **Table Assembly** below.

---

## Variant Matrices

### `table-head` — `Sort`

| Property | Options | Default |
|---|---|---|
| `Sort` | `None`, `Asc`, `Desc` | `None` |

`Sort(3) = 3 variants`

---

### `table-cell` — `Type × Size`

| Property | Options | Default |
|---|---|---|
| `Type` | `Text`, `Icon-Text`, `Checkbox-Text`, `Radio-Text`, `Toggle-Text`, `Avatar-Text`, `Avatar-Checkbox`, `Avatar-Radio`, `Avatar-Toggle`, `Badge`, `Input`, `Select`, `Trend-Up`, `Trend-Down`, `Button`, `Action-dropdown`, `Drag`, `Checkbox-Only`, `Radio-Only`, `Toggle-Only`, `Star-Ratings`, `Slot-1`, `Slot-2`, `Slot-3`, `Slot-4` | `Text` |
| `Size` | `Default`, `Compact` | `Default` |

`47 variants total` — `Avatar-Text`, `Input`, and `Select` are Default-size only; all other Types have both sizes.

---

### `_table-row` — `Type × State × Size`

| Property | Options | Default |
|---|---|---|
| `Type` | `Regular`, `Header`, `Footer` | `Regular` |
| `State` (Regular) | `Default`, `Hover`, `Selected` | `Default` |
| `State` (Footer) | `Default`, `Hover` | `Default` |
| `State` (Header) | `Default` only | — |
| `Size` | `Default`, `Compact` | `Default` |

`Regular(3) + Header(1) + Footer(2) × 2 sizes = 12 variants`

---

## Type Guides

### `table-head` — Sort

**`Sort=None`** — Column is not sortable, or sort is inactive. Label only; no icon.

**`Sort=Asc`** — Column sorted ascending. Label + upward chevron icon.

**`Sort=Desc`** — Column sorted descending. Label + downward chevron icon.

---

### `table-cell` — Content Types

| Type | Leading element | Content | Use for |
|---|---|---|---|
| `Text` | — | Primary text + optional supporting text | Plain text data |
| `Icon-Text` | 16×16 icon | Text | Data with a recognisable category icon |
| `Checkbox-Text` | Checkbox | Text | Multi-select rows with label |
| `Radio-Text` | Radio | Text | Single-select rows with label |
| `Toggle-Text` | Toggle/Switch | Text | Row-level boolean setting |
| `Avatar-Text` | Avatar | Text + supporting text | Person entity rows |
| `Avatar-Checkbox` | Avatar | Checkbox | Person with selection |
| `Avatar-Radio` | Avatar | Radio | Person with single-select |
| `Avatar-Toggle` | Avatar | Toggle | Person with toggle |
| `Badge` | — | Badge chip + optional icons | Status, tag, or category labels |
| `Input` | — | Text input (Default size only) | Inline editable field |
| `Select` | — | Select trigger (Default size only) | Inline dropdown selector |
| `Trend-Up` | Arrow-up icon | Percentage label | Positive metric change |
| `Trend-Down` | Arrow-down icon | Percentage label | Negative metric change |
| `Button` | — | Action button | Single row-level action |
| `Action-dropdown` | — | Dropdown trigger (⋯) | Multiple row-level actions |
| `Drag` | Drag handle icon | — | Drag-to-reorder rows |
| `Checkbox-Only` | — | Checkbox only | Selection without label |
| `Radio-Only` | — | Radio only | Single-select without label |
| `Toggle-Only` | — | Toggle only | Boolean without label |
| `Star-Ratings` | — | 5 star icons | Rating display |
| `Slot-1–4` | — | 1–4 SLOT placeholders | Custom / implementation-defined content |

---

### `_table-row` — Type

**`Type=Regular`** — Standard data row. Transparent fill (inherits table surface). States: Default, Hover (`color/background/accent`), Selected (`color/background/accent` + `color/brand/primary` left border).

**`Type=Header`** — Column header row. Fill: `color/surface/raised`. State: Default only. Contains `table-head` cell instances.

**`Type=Footer`** — Summary/total row. Fill: `color/surface/raised`. States: Default, Hover.

---

## Structure

### Table assembly (FRAME — not a component)

```
Example-Table                   — FRAME, no fill, stroke: color/border/default 1px
                                  radius: radius/base (12px) ← required for all tables
                                  V AUTO-LAYOUT or stacked, no gap
  ├─ _table-row (Type=Header)   — INSTANCE, fill: color/surface/raised
  ├─ _table-row (Type=Regular)  — INSTANCE, no fill (× N data rows)
  └─ _table-row (Type=Footer)   — INSTANCE, fill: color/surface/raised (optional)
```

> **`radius/base` is the canonical table radius.** Every table assembled in this system uses `radius/base` on the outer FRAME container. This is established by `Example-Table` on the Table page. Do not use `radius/lg`, `radius/md`, or a hardcoded value — always bind the container's corner radius to `radius/base`.

---

### `table-head`

```
table-head                      — FRAME, fill: color/surface/raised, stroke: color/border/default
  ├─ label                      — TEXT, fill: color/surface/raised/foreground
  └─ icon                       — INSTANCE (chevron, 16×16) — Sort=Asc / Sort=Desc only
       └─ Icon                  — VECTOR, stroke: color/surface/raised/foreground
```

---

### `table-cell` — representative types

```
Type=Text
  ├─ content                    — TEXT, fill: color/surface/default/foreground
  └─ supporting-text            — TEXT, fill: color/text/secondary

Type=Icon-Text
  ├─ icon-slot                  — INSTANCE (icon placeholder, 16×16)
  │    └─ Icon                  — VECTOR, stroke: color/surface/default/foreground
  ├─ content                    — TEXT, fill: color/surface/default/foreground
  └─ supporting-text            — TEXT, fill: color/text/secondary

Type=Trend-Up
  ├─ icon-slot                  — INSTANCE (arrow-up icon)
  │    └─ Icon                  — VECTOR, stroke: color/icon/success
  └─ label                      — TEXT, fill: color/text/success

Type=Trend-Down
  ├─ icon-slot                  — INSTANCE (arrow-down icon)
  │    └─ Icon                  — VECTOR, stroke: color/icon/danger
  └─ label                      — TEXT, fill: color/text/invalid

Type=Star-Ratings
  └─ Lucide Icons / star-filled — INSTANCE × 5
       ├─ [INSTANCE fill]       — color/surface/default (icon frame background)
       └─ shape                 — BOOLEAN_OPERATION, fill: color/chart/4

Type=Badge
  └─ badge-slot                 — FRAME, fill: color/background/default, stroke: color/input/border
       ├─ leading-icon › Icon   — VECTOR, stroke: color/surface/default/foreground
       ├─ content               — TEXT, fill: color/surface/default/foreground
       └─ trailing-icon › Icon  — VECTOR, stroke: color/surface/default/foreground

Type=Button
  └─ trailing-button            — INSTANCE (button, Outline style)
       fill: button/outline/bg/bg · stroke: button/outline/border/default
       label fill: button/outline/fg/fg

Type=Slot-1  (1 × 24×24 SLOT — cell: 56px wide)
Type=Slot-2  (2 × 24×24 SLOTs — cell: 84px wide)
Type=Slot-3  (3 × 24×24 SLOTs — cell: 112px wide)
Type=Slot-4  (4 × 24×24 SLOTs — cell: 140px wide)
```

### `table-cell` — Slot types: example content

Slot types are open placeholders — place any instance that fits the use case. The examples below are common patterns, not requirements.

| Slot type | Example content | Notes |
|---|---|---|
| `Slot-1` | Single progress bar | Inline completion or health indicator |
| `Slot-1` | Single badge / status pill | When the built-in Badge type doesn't fit |
| `Slot-1` | Single avatar | Outside the Avatar-Text pattern |
| `Slot-1` | Sparkline / mini chart | Trend over time in a narrow column |
| `Slot-2` | Two buttons (e.g. Edit + Delete) | Use `Size=Small` — the only button size for slot cells |
| `Slot-2` | Two icon buttons (e.g. View + Archive) | Use `Size=Small`, `Type=Ghost` or `Type=Outline` |
| `Slot-2` | Two badges / status tags | Side-by-side category labels |
| `Slot-2` | Two avatars (co-assignees) | Small team or pair |
| `Slot-3` | Three icon buttons (View + Edit + Delete) | Use `Size=Small` |
| `Slot-3` | Three status badges | Triple-tag rows |
| `Slot-3` | Three avatars | Small team display |
| `Slot-4` | Four icon buttons | Full row action set, use `Size=Small` |
| `Slot-4` | Four avatars | Group / team of four |
| `Slot-4` | Four status indicators | Multi-dimension status row |

> **Button size rule:** When placing buttons into any Slot cell, always use `Size=Small`. Do not use Icon Small, Default, or Large — only Small fits the 48px (Default) and 40px (Compact) row heights without crowding.

---

### `_table-row`

```
_table-row                      — H AUTO-LAYOUT, fill: varies, stroke: color/border/default
  ├─ cell-1                     — INSTANCE (table-cell or table-head)
  ├─ cell-2                     — INSTANCE
  ├─ cell-3                     — INSTANCE
  └─ cell-4                     — INSTANCE
```

> In `Type=Selected`, the row adds a `color/brand/primary` left-side stroke to signal the active selection.

---

## Token Bindings

### Table container (assembly FRAME)

| Property | Token |
|---|---|
| Fill | — (transparent) |
| Stroke | `color/border/default` 1px |
| Radius | `radius/base` — **all tables must use this** |

### `table-head` — per Sort

| Layer | Token |
|---|---|
| Container fill | `color/surface/raised` |
| Container stroke | `color/border/default` |
| `label` TEXT fill | `color/surface/raised/foreground` |
| `icon › Icon` stroke (Sort=Asc/Desc) | `color/surface/raised/foreground` |

### `table-cell` — shared tokens

| Layer | Token | Notes |
|---|---|---|
| `content` / `label` TEXT fill | `color/surface/default/foreground` | Primary cell text |
| `supporting-text` TEXT fill | `color/text/secondary` | Secondary / muted text |
| `trailing-text` TEXT fill | `color/text/secondary` | e.g. input unit suffix |
| Icon strokes (general) | `color/surface/default/foreground` | Icons on surface/default background |
| Container `itemSpacing` | `spacing/component/sm` (8px) | Most multi-element types |
| Container `itemSpacing` | `spacing/component/xs` (4px) | Trend-Up, Trend-Down |
| Container `itemSpacing` | `spacing/component/xxs` (2px) | Star-Ratings |
| `toggle-slot` / `switch` padding | `spacing/component/xxs` (2px) all sides | Toggle wrapper inset |

### `table-cell` — type-specific tokens

| Type | Layer | Token |
|---|---|---|
| Trend-Up | `icon-slot › Icon` stroke | `color/icon/success` |
| Trend-Up | `label` TEXT fill | `color/text/success` |
| Trend-Down | `icon-slot › Icon` stroke | `color/icon/danger` |
| Trend-Down | `label` TEXT fill | `color/text/invalid` |
| Star-Ratings | `star INSTANCE` fill | `color/surface/default` (icon frame bg) |
| Star-Ratings | `shape` fill | `color/chart/4` (the star color) |
| Badge | `badge-slot` fill | `color/background/default` |
| Badge | `badge-slot` stroke | `color/input/border` |
| Button | `trailing-button` | button/outline/* tokens (never override) |

### `_table-row` — per Type and State

| Type | State | Container fill | Container stroke |
|---|---|---|---|
| Regular | Default | — (transparent) | `color/border/default` |
| Regular | Hover | `color/background/accent` | `color/border/default` |
| Regular | Selected | `color/background/accent` | `color/border/default` + `color/brand/primary` left |
| Header | Default | `color/surface/raised` | `color/border/default` |
| Footer | Default | `color/surface/raised` | `color/border/default` |
| Footer | Hover | `color/background/accent` | `color/border/default` |

---

## Behavior

### Architecture

shadcn Table is a **purely presentational component set** — it renders semantic HTML elements with no built-in state, sorting, filtering, or pagination. All interactive behavior is implementation-defined.

| shadcn component | HTML rendered |
|---|---|
| `<Table>` | `<table>` |
| `<TableHeader>` | `<thead>` |
| `<TableBody>` | `<tbody>` |
| `<TableFooter>` | `<tfoot>` |
| `<TableRow>` | `<tr>` |
| `<TableHead>` | `<th>` |
| `<TableCell>` | `<td>` |
| `<TableCaption>` | `<caption>` |

### Sorting

`Sort=Asc` / `Sort=Desc` on `table-head` are visual states only — they communicate current sort direction but carry no click handler. In implementation, the column header `<th>` receives an `onClick` that updates a sort key in the parent's state. The parent then re-renders with the new `Sort` variant and re-orders the data.

Use TanStack Table (`@tanstack/react-table`) for sort, filter, and column management in data-heavy views.

### Row selection

`State=Selected` on `_table-row` is a visual state — the row carries no selection logic. In implementation, selection is tracked in parent state (a `Set<id>` or similar). The `Checkbox-Only` or `Checkbox-Text` cell types in each row wire to that state.

### Hover state

`State=Hover` is applied in Figma for design representation only. In code, hover is handled via CSS (`:hover` pseudo-class or `onMouseEnter`/`onMouseLeave`). Do not pass `State=Hover` as a static prop in implementation.

### Inline editing (Input / Select types)

`Type=Input` and `Type=Select` represent cells that are editable in place. In implementation these render an `<input>` or `<select>` directly inside the `<td>`. Editing triggers update the row's data model on `onChange` or `onBlur`.

### Drag to reorder (Drag type)

`Type=Drag` shows a drag handle icon. In implementation, wire to a drag-and-drop library (e.g. dnd-kit) that manages row reordering. The handle should have `role="button"` and `aria-label="Drag to reorder"`.

---

## Accessibility

| Property | Value |
|---|---|
| Table landmark | `<table>` is a native landmark — no additional role needed |
| Column headers | `<th scope="col">` — essential for screen readers to associate data cells with their column |
| Row headers | `<th scope="row">` — use on the first cell of each row when the row has a meaningful identifier |
| Sort state | `aria-sort="ascending"` / `aria-sort="descending"` / `aria-sort="none"` on sortable `<th>` |
| Selected row | `aria-selected="true"` on the `<tr>` for `State=Selected` rows |
| Drag handle | `role="button"` + `aria-label="Drag to reorder"` on the drag handle element |
| Caption | Use `<TableCaption>` when the table's purpose is not clear from surrounding context |

### Keyboard

| Key | Action |
|---|---|
| `Tab` | Move focus between interactive cells (checkboxes, buttons, inputs, drag handles) |
| `Enter` / `Space` | Activate focused checkbox, radio, button, or toggle |
| `Arrow keys` | Within a focused input or select, standard field behavior |
| (Sort header) `Enter` | Toggle sort direction on a focused sortable column header |
| (Drag) `Space` | Pick up / drop a row using keyboard drag (dnd-kit implementation) |
| (Drag) `Arrow keys` | Move the picked-up row up/down |

---

## Usage Rules

> **The table container FRAME must always use `radius/base`.** This is the canonical table radius established by `Example-Table` on the Table page. Apply it to the four corner radii of the outermost FRAME, not to individual rows or cells. Rows have no radius of their own — they rely on the container's `overflow: hidden` to clip the corners.

> **Choose `table-cell` Type by the data being displayed, not aesthetics.**
>
> - `Type=Text` — plain string data; most common cell type
> - `Type=Trend-Up` / `Type=Trend-Down` — percentage change with semantic color coding (success/danger)
> - `Type=Badge` — categorical status that needs a visual chip
> - `Type=Button` / `Type=Action-dropdown` — row-level actions; use Button for one action, Action-dropdown for two or more
> - `Type=Drag` — only when row order is user-controlled
> - `Type=Slot-1–4` — implementation-defined content; document what goes in each slot

> **Use `Size=Compact` for dense data views; `Size=Default` for comfortable reading.**
>
> - `Size=Default` (48px row height) — standard tables, entity lists, data grids
> - `Size=Compact` — secondary panels, in-panel sub-tables, mobile-width tables

- Always use `Type=Header` for the top row — never use a Regular row to fake a header
- Always use `Type=Footer` for totals/summaries — never use a Regular row styled differently
- The `table-head` `Sort=None` variant is for non-sortable columns; only show `Sort=Asc`/`Sort=Desc` on columns that are actively sorted
- `Type=Input` and `Type=Select` are Default size only — do not use in Compact tables
- Star-Ratings is a display-only type — not interactive in the Figma component
- Never add radius to individual `_table-row` instances — the container FRAME handles the corner radius

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Invoice or transaction lists where each row has a fixed set of columns (date, amount, status, actions)
- User or member management panels with sortable columns and row-level actions
- Product inventory tables with filtering, inline editing, and status badges per row
- Analytics dashboards displaying metric breakdowns by dimension (channel, campaign, cohort)
- Order management views combining avatar, status badge, trend indicators, and action dropdowns
- Admin data grids that require drag-to-reorder rows and column sorting

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `table-head Sort=None` | Column is informational and not sortable | ID column · Avatar column · Fixed category labels |
| `table-head Sort=Asc` | Column is actively sorted ascending | Date oldest-first · Name A–Z · Amount low-to-high |
| `table-head Sort=Desc` | Column is actively sorted descending | Date newest-first · Amount high-to-low · Score top-ranked |
| `table-cell Type=Text` | Plain string or number data | Customer name · Order number · Description field |
| `table-cell Type=Avatar-Text` | Row represents a person entity | Team member list · Assignee column · Customer table |
| `table-cell Type=Badge` | Categorical status that needs a visual chip | Order status (Pending/Shipped/Cancelled) · Priority label · Tag column |
| `table-cell Type=Trend-Up / Trend-Down` | Percentage change with semantic positive/negative color | Revenue growth · Conversion rate delta · MoM change |
| `table-cell Type=Button` | Single row-level action | Edit row · View details · Download |
| `table-cell Type=Action-dropdown` | Two or more row-level actions | Edit · Duplicate · Archive · Delete |
| `table-cell Type=Input` | Cell content is directly editable in place | Inline quantity editor · Editable price field |
| `table-cell Type=Drag` | Row order is user-controlled | Reorderable task list · Priority-sorted queue |
| `_table-row Size=Default` | Standard data density — readable without strain | Main entity lists · Customer tables · Dashboard grids |
| `_table-row Size=Compact` | High data density needed — secondary or nested panels | Sub-table inside a panel · Mobile-width table · Analytics breakdown |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Many rows of uniform structured data with column headers and sorting | `table` | `item` list |
| A vertical list of richer entries with image, multi-line text, and action button | `item` | `table` |
| A single self-contained block of information (metric, profile, settings) | `card` | `table` |
| A small set of non-tabular key-value pairs within a panel | `card` with `card-content` | `table` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Apply `radius/lg` or a hardcoded radius to the table container | Always use `radius/base` — matches the system's Example-Table canonical pattern |
| Apply radius to individual `_table-row` instances | Radius belongs on the outer container FRAME only |
| Use a Regular row as the column header | Use `_table-row Type=Header` containing `table-head` cells |
| Use a Regular row for totals | Use `_table-row Type=Footer` |
| Show `Sort=Asc` / `Sort=Desc` on non-sortable columns | Use `Sort=None` — never imply sort affordance where there is none |
| Use `Type=Button` for two or more row actions | Use `Type=Action-dropdown` — multiple actions belong in a dropdown |
| Override fills inside `trailing-button` from the row or cell parent | Button sub-components own their token bindings — change the variant prop |
| Use `Type=Input` or `Type=Select` in Compact size tables | These types are Default-size only |
| Build a table without a `<TableHeader>` in the HTML | Always render `<thead>` with `<th scope="col">` — screen readers require it |
