# Pagination

A navigation control for moving through multi-page data sets. Built on shadcn's Pagination, which renders as semantic HTML `<nav>` / `<a>` elements with no interactive library dependency. Two component sets: `_pagination-item` is the individual page cell; `pagination` is the assembled control.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `_pagination-item` | `59:17863` | 11 | Individual page cell — assembled inside `pagination` |
| `pagination` | `59:18253` | 8 | Full control — use this, never the item directly |

---

## Variant Matrices

### `_pagination-item` — `Type × State`

| Property | Options | Default |
|---|---|---|
| `Type` | `Page`, `Prev`, `Next`, `Ellipsis` | `Page` |
| `State` (Page) | `Default`, `Hover`, `Active`, `Disabled` | `Default` |
| `State` (Prev / Next) | `Default`, `Hover`, `Disabled` | `Default` |
| `State` (Ellipsis) | — (single state) | — |

`Page(4) + Prev(3) + Next(3) + Ellipsis(1) = 11 variants`

### `pagination` — `Type`

| Property | Options | Default |
|---|---|---|
| `Type` | `Basic`, `More`, `Simple`, `Disabled`, `With Total`, `With Changer`, `With Jumper`, `Show All` | `Basic` |

`Type(8) = 8 variants`

---

## Type Guide

### `_pagination-item` Types

**`Type=Page`** — a numbered page button. `State=Active` marks the current page (brand fill). `State=Default` / `Hover` are navigable pages. `State=Disabled` is an unclickable page (rare — typically the whole control is disabled, not individual pages).

**`Type=Prev` / `Type=Next`** — Previous and Next arrow buttons (chevron icons). `State=Disabled` when the user is already at the first or last page.

**`Type=Ellipsis`** — a non-interactive "…" cell, indicating skipped pages in the sequence. No states — always the same visual.

---

### `pagination` Types

**`Type=Basic`** — Prev · 1 · 2 · **3** · 4 · 5 · Next. Five consecutive page buttons with no ellipsis — for datasets with a small, known page count where showing all pages at once is practical.

**`Type=More`** — Prev · 1 · … · 3 · **4** · 5 · … · 10 · Next. Ellipsis on one or both sides — for large page counts where only a window of nearby pages is shown. Most common pattern for large datasets.

**`Type=Simple`** — Prev · [1 / 10] · Next. A compact variant showing only the current page and total in a single indicator cell. Use in tight spaces (mobile, sidebars) where individual page buttons would not fit.

**`Type=Disabled`** — The entire `Basic` layout with all items in `State=Disabled` — when the list is loading or the control is temporarily unavailable.

**`Type=With Total`** — "Total 100 items" · Prev · 1 · 2 · **3** · 4 · 5 · Next. Adds a total-record-count label to the left of the control. Use when the user needs to know how many records exist, not just the page count.

**`Type=With Changer`** — Prev · 1 · 2 · **3** · 4 · 5 · Next · [10 / page ▼]. Adds a page-size dropdown to the right. Use when the user should be able to control how many rows per page they see.

**`Type=With Jumper`** — Prev · 1 · 2 · **3** · 4 · 5 · Next · Go to [ ] page. Adds a jump-to-page input to the right. Use in large datasets where direct navigation to a specific page by number is valuable.

**`Type=Show All`** — Combines `With Total` + `With Changer` + `With Jumper` in a single bar — the most feature-complete layout. Use for complex data tables where users need full control over pagination.

---

## Structure

### `_pagination-item`

```
_pagination-item            — 32×32px FRAME, fill: varies, stroke: varies, radius: radius/md
                              (no padding — content is centered via auto-layout)
  ├─ label                  — TEXT (Type=Page, Type=Ellipsis)
  │                           fill: varies per state
  └─ chevron-left / chevron-right  — INSTANCE (16×16px icon, Type=Prev / Type=Next)
       └─ Icon              — VECTOR, stroke: varies per state
```

### `pagination` — Type=Basic / Type=More / Type=Disabled

```
pagination                  — H AUTO-LAYOUT, no fill, no stroke
                              gap: spacing/component/xxs
  ├─ _pagination-item       — INSTANCE (Type=Prev)
  ├─ _pagination-item       — INSTANCE (Type=Page, State=Default) × N
  ├─ _pagination-item       — INSTANCE (Type=Ellipsis) — Type=More only
  ├─ _pagination-item       — INSTANCE (Type=Page, State=Active) — current page
  ├─ _pagination-item       — INSTANCE (Type=Page, State=Default) × N
  ├─ _pagination-item       — INSTANCE (Type=Ellipsis) — Type=More only
  └─ _pagination-item       — INSTANCE (Type=Next)
```

### `pagination` — Type=Simple

```
pagination                  — H AUTO-LAYOUT, gap: spacing/component/sm
  ├─ _pagination-item       — INSTANCE (Type=Prev)
  ├─ page-indicator         — FRAME, fill: color/background/default,
  │                           stroke: color/border/default, radius: radius/md
  │                           padding: spacing/component/xxs (T/B) · spacing/component/sm (L/R)
  │                           gap: spacing/component/xs-plus
  │                           layoutSizingVertical: FILL · layoutSizingHorizontal: HUG
  │                           (FILL height locks it to 32px — same as surrounding _pagination-item cells)
  │    ├─ current           — TEXT, fill: color/background/default/foreground (current page)
  │    ├─ separator         — TEXT, fill: color/background/muted/foreground ("/")
  │    └─ total             — TEXT, fill: color/background/muted/foreground (total pages)
  └─ _pagination-item       — INSTANCE (Type=Next)
```

### `pagination` — Type=With Total / Type=Show All (partial)

```
pagination                  — H AUTO-LAYOUT, gap: spacing/component/lg (With Total)
                                              gap: spacing/component/md  (Show All)
  ├─ total-label            — TEXT, fill: color/background/muted/foreground
  │                           (e.g. "Total 100 items")
  ├─ _pagination-item × N   — (same as Basic)
  └─ ...                    — (+ size-changer and jumper frames in Show All)
```

### `pagination` — Type=With Changer / Type=Show All (size-changer)

```
  └─ size-changer           — FRAME, fill: color/background/default,
                              stroke: color/border/default, radius: radius/md
                              paddingL / paddingR: spacing/component/sm
                              gap: spacing/component/xs-plus
       ├─ label             — TEXT, fill: color/background/default/foreground ("10 / page")
       └─ chevron-down      — INSTANCE (chevron-down icon, 16×16)
            └─ Icon         — VECTOR, stroke: color/icon/default
```

### `pagination` — Type=With Jumper / Type=Show All (jumper)

```
  └─ jumper                 — FRAME, H AUTO-LAYOUT, gap: spacing/component/sm
       ├─ label             — TEXT, fill: color/background/muted/foreground ("Go to")
       ├─ jumper-input      — FRAME, fill: color/background/default,
       │                       stroke: color/border/default, radius: radius/md, 48×32px
       └─ unit              — TEXT, fill: color/background/muted/foreground ("page")
```

---

## Token Bindings

### `_pagination-item` — per state

| Type | State | Container fill | Container stroke | `label` / `Icon` token |
|---|---|---|---|---|
| Page | `Default` | `color/background/default` | `color/border/default` | `color/background/default/foreground` |
| Page | `Hover` | `color/background/accent` | `color/border/default` | `color/background/accent/foreground` |
| Page | `Active` | `color/brand/primary` | — | `color/brand/primary/foreground` |
| Page | `Disabled` | `color/background/muted` | `color/border/disabled` | `color/text/disabled` |
| Prev / Next | `Default` | `color/background/default` | `color/border/default` | `color/background/default/foreground` (Icon stroke) |
| Prev / Next | `Hover` | `color/background/accent` | `color/border/default` | `color/background/accent/foreground` (Icon stroke) |
| Prev / Next | `Disabled` | `color/background/muted` | `color/border/disabled` | `color/icon/disabled` (Icon stroke) |
| Ellipsis | — | `color/background/default` | `color/border/default` | `color/background/muted/foreground` |

> **Paired-surface rule on Hover:** `color/background/accent` fill requires `color/background/accent/foreground` for all content (text and icon) — never `color/background/default/foreground` on an accent-coloured surface.

> **Disabled icon uses `color/icon/disabled`,** not the `/foreground` of the Disabled fill. This aligns with every other interactive control (input, select, combobox) where icons in Disabled state use the standalone `color/icon/disabled` token.

> **`Type=Ellipsis` label uses `color/background/muted/foreground`** — the "…" is non-interactive and secondary. It does not use `color/background/default/foreground` (that's for navigable pages).

### `_pagination-item` — layout

| Property | Token |
|---|---|
| Container size | 32×32px fixed |
| Container radius | `radius/md` |
| Icon size | 16×16px |

No padding tokens — the item is a fixed square. Content is centred via auto-layout.

### `pagination` — gap per type

| Type | Gap token |
|---|---|
| `Basic`, `More`, `Disabled` | `spacing/component/xxs` (2px) |
| `Simple`, `With Changer`, `With Jumper` | `spacing/component/sm` (8px) |
| `With Total` | `spacing/component/lg` (16px) |
| `Show All` | `spacing/component/md` (12px) |

---

## Behavior

Source: shadcn Pagination (`ui.shadcn.com/docs/components/pagination`).

### Architecture

shadcn Pagination is a **presentational component set** — it renders styled `<nav>`, `<ul>`, `<li>`, and `<a>` / `<button>` elements with no built-in routing or state management. Page state, URL updates, and data fetching are entirely implementation concerns.

Components:
- `<Pagination>` — `<nav aria-label="pagination">`
- `<PaginationContent>` — `<ul>` (flex row)
- `<PaginationItem>` — `<li>` wrapper
- `<PaginationLink>` — `<a>` with `isActive` prop for the current page
- `<PaginationPrevious>` / `<PaginationNext>` — `<a>` with chevron icons
- `<PaginationEllipsis>` — `<span>` with "…" (non-interactive)

### Current page

The `isActive` prop on `PaginationLink` renders `State=Active` styling (brand fill + brand/primary/foreground text). There is no built-in page tracking — the parent component supplies `isActive` based on its own routing state.

### Prev / Next disabled

`State=Disabled` on `Type=Prev` / `Type=Next` is applied via the `disabled` prop (or `aria-disabled="true"` on `<a>` elements, since `<a>` does not natively support `disabled`). In Figma, show Prev disabled when on page 1 and Next disabled when on the last page.

### Ellipsis

`Type=Ellipsis` is non-interactive — it has no click handler and does not accept keyboard focus. It represents a range of pages hidden from the visible window, not a button to reveal them.

### Page size changer (With Changer / Show All)

The `size-changer` is a visual mock of a select trigger — in implementation it is a `<select>` or combobox that controls the `pageSize` prop (e.g. 10 / 25 / 50 / 100 per page). Changing it resets to page 1.

### Jumper input (With Jumper / Show All)

The `jumper-input` accepts a page number and navigates on Enter or blur. Implementation should clamp the value to `1–totalPages` and reject non-numeric input silently.

### Keyboard

| Key | Action |
|---|---|
| `Tab` | Move focus between page items |
| `Enter` / `Space` | Activate focused page link |
| (Jumper) `Enter` | Submit page number and navigate |

---

## Accessibility

| Property | Value |
|---|---|
| Landmark | `<nav aria-label="pagination">` — announced as a navigation landmark |
| Current page | `aria-current="page"` on the active `<PaginationLink>` |
| Previous / Next disabled | `aria-disabled="true"` on the `<a>` (not `disabled` — `<a>` ignores the `disabled` attribute) |
| Ellipsis | `aria-hidden="true"` — decorative, not interactive |
| Icon buttons | `aria-label="Go to previous page"` / `aria-label="Go to next page"` — icons must have a text label for screen readers |
| Page number links | Visible digit text is sufficient; no additional `aria-label` needed |

---

## Touch Target

| Component | Size | Note |
|---|---|---|
| `_pagination-item` | 32×32px | 12px below WCAG 2.5.5 minimum — implementation should add 6px hit-area padding around each item or increase item size to 44px |

---

## Usage Rules

> **Always use `pagination`, never `_pagination-item` standalone.**
>
> `_pagination-item` is a display cell with no page logic of its own. Placing it directly in a layout produces a non-functional visual. Use `pagination` for every standard use case.

> **Choose the Type by dataset size and user need — not by aesthetics.**
>
> - `Type=Basic` — small, fixed page count (≤10 pages). All pages visible.
> - `Type=More` — large page count (>10 pages). Show a window of nearby pages with ellipsis.
> - `Type=Simple` — space-constrained (mobile, narrow sidebar). Prev/Next + page indicator only.
> - `Type=With Total` — when users need to know the total record count to make decisions.
> - `Type=With Changer` — when users benefit from controlling how many rows they see per page (data-heavy views, tables).
> - `Type=With Jumper` — when users need to jump to specific pages by number (reports, very large lists).
> - `Type=Show All` — feature-complete data tables where all pagination controls are needed.
> - `Type=Disabled` — loading state or temporarily unavailable result set.

- Show `Type=Prev, State=Disabled` when on page 1; show `Type=Next, State=Disabled` when on the last page — never hide Prev/Next entirely, just disable them
- Show `State=Active` on exactly one page item at a time — the current page
- The ellipsis (`Type=Ellipsis`) must always have at least one navigable page on each side — never place two ellipsis cells adjacent to each other
- Align the pagination control with the data table or list it controls — always place it below the content, right-aligned or centred per layout grid
- In `Type=Simple`, the page indicator ("1 / 10") is read-only in Figma — in implementation it updates dynamically as the user navigates
- `Type=With Changer` changes the page size — always reset to page 1 when the user changes it

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- A search results page returns 200 records and shows 20 per page — Basic or More pagination sits below the result list
- An admin data table with hundreds of rows lets users jump to a specific page with the Jumper variant
- A mobile article list uses Simple pagination (Prev / 1 of 12 / Next) where individual page buttons would not fit
- A reports table gives users a page-size dropdown so they can switch between 10, 25, and 50 rows per page
- A product listing shows "Total 847 items" alongside page controls so users can gauge result volume
- A feature-complete data grid combines total count, page-size changer, and jump-to input in a single Show All bar

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Basic` | Small, fixed page count (≤10 pages) where all pages can be shown at once | Short article list · Admin table with few records · Simple search results |
| `More` | Large page count (>10 pages) — shows a window of nearby pages with ellipsis | Long search results · Large user directory · Product catalogue |
| `Simple` | Space-constrained layouts — only Prev / current / total / Next | Mobile list view · Narrow sidebar panel · Compact widget table |
| `With Total` | User needs to know the total record count to make informed decisions | Reports page · Export preview · Filtered dataset where count validates the filter |
| `With Changer` | User benefits from controlling rows per page | Data-heavy admin table · Analytics export · Log viewer |
| `With Jumper` | Direct navigation to specific pages by number is valuable | Very large datasets · Numbered report pages · Audit log with 100+ pages |
| `Show All` | Feature-complete tables where users need full pagination control | Enterprise data tables · Advanced analytics grids · Complex admin views |
| `Disabled` | The data is loading or the control is temporarily unavailable | Loading state on initial table fetch · Search in progress |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Navigating between numbered pages of a dataset | `pagination` | `tabs` |
| Switching between content sections on the same page | `tabs` | `pagination` |
| Showing the user's location in a site hierarchy | `breadcrumb` | `pagination` |
| Navigating to different pages or routes in the top nav | `navigation-menu` | `pagination` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use `_pagination-item` directly in a layout | Use `pagination` — the item is a display-only sub-component |
| Hide Prev or Next when at the boundary | Disable them (`State=Disabled`) — removing them causes layout shift |
| Use `Type=Basic` for 50+ pages | Use `Type=More` with ellipsis — all 50 items visible is unusable |
| Use `Type=More` for 5 pages | Use `Type=Basic` — ellipsis adds confusion when all pages fit |
| Use `Type=Simple` for a desktop data table | Use `Type=Basic` or `Type=More` — Simple loses individual page access |
| Show two ellipsis cells side by side | Always have at least one page between the ellipsis and the boundary |
| Set `State=Active` on more than one page item | Exactly one active page at a time |
| Use `Type=Disabled` as the default empty state | Only when data is loading or the control is temporarily unavailable; for zero results, hide pagination entirely |
