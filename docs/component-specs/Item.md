# Item

A compact, repeatable list-row component that represents a single selectable or informational entry — a notification, a file, a user in a group, a settings option. Designed to be flat and tightly grouped: items appear inside lists, feeds, menus, or as rows inside a `card`. They are not self-contained information blocks — they are list elements. Six layout Types control the leading element; three Variants control the container surface; three Sizes control density. Two component sets: `_item-image` is the image sub-component used by `Type=Image`; `item` is the full row — always use this.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `_item-image` | `65:572` | 1 | Image placeholder sub-component — assembled inside `item` |
| `item` | `65:815` | 54 | Full list row — use this |

---

## Variant Matrices

### `item` — `Type × Variant × Size`

| Property | Options | Default |
|---|---|---|
| `Type` | `Default`, `Icon`, `Avatar`, `Image`, `Header`, `Link` | `Default` |
| `Variant` | `Default`, `Outline`, `Muted` | `Default` |
| `Size` | `Default`, `Sm`, `Xs` | `Default` |

`Type(6) × Variant(3) × Size(3) = 54 variants`

> **Note:** `Type=Header` and `Type=Link` only have `Variant=Default` in the smaller sizes (Sm / Xs). The Variant dimension applies in full across `Type=Default`, `Icon`, `Avatar`, `Image`.

---

## Type Guide

**`Type=Default`** — Text-only leading. Title + description fill the full content width. Use when no media or avatar is needed — the simplest, most neutral list row.

**`Type=Icon`** — A 16×16 icon (`placeholder` instance) precedes the content block. Use when items map to an identifiable category or action that benefits from visual scannability (e.g. file type, action type, feature name).

**`Type=Avatar`** — A 40×40 avatar precedes the content. Use for people-centric lists: team members, assignees, contacts, conversation threads.

**`Type=Image`** — A 32×32 image thumbnail (`media` instance) precedes the content. Use for entity lists where a product image, logo, or preview gives context (products, brands, files).

**`Type=Header`** — A large image header (`header` frame, full width) sits above the content row. Use as a card-like row with a cover image — article previews, featured content, rich list entries. Has no action-slot.

**`Type=Link`** — Content + a trailing chevron-right icon. The whole row is the call-to-action — no button. Use for navigation lists, settings rows, disclosure rows. The trailing icon signals "tap to open" rather than a discrete button action.

---

## Variant Guide

**`Variant=Default`** — No container fill, no stroke. The row blends into whatever surface it sits on (a card, a list panel, the page). Use in most cases — the content speaks for itself.

**`Variant=Outline`** — White fill (`color/surface/default`) + `color/border/default` stroke, `radius/lg`. Creates a card-like boundary. Use when items need visual separation from each other or from the page background, or when placed directly on a canvas without a wrapping list container.

**`Variant=Muted`** — Muted fill (`color/surface/muted`), no stroke, `radius/lg`. A subtle background tint without a hard border. Use for zebra-striping alternatives, highlighted rows, or items in a sidebar context.

---

## Size Guide

| Size | Container padding / gap | Approx. height |
|---|---|---|
| `Default` | `spacing/component/md` (12px) all sides + gap | 61–181px depending on Type |
| `Sm` | `spacing/component/sm` (8px) all sides + gap | 52–147px |
| `Xs` | `spacing/component/xs-plus` (6px) all sides + gap | 48–116px |

> **For `Type=Header`**, padding applies to `content-row` (not the outer container). The `header` image frame has no padding — it bleeds to the container edge.

---

## Structure

### `item` — Type=Default

```
item                        — H AUTO-LAYOUT, fill: varies, stroke: varies, radius: radius/lg
                              padding: per size · gap: per size
  ├─ content                — FRAME, no fill, gap: spacing/component/xxs
  │    ├─ title             — TEXT, fill: color/surface/default/foreground
  │    └─ description       — TEXT, fill: color/surface/muted/foreground
  └─ action-slot            — INSTANCE (button, Outline style)
```

### `item` — Type=Icon

```
item                        — H AUTO-LAYOUT, fill: varies, stroke: varies, radius: radius/lg
  ├─ placeholder            — INSTANCE (icon placeholder, 16×16)
  │    └─ Icon              — VECTOR, stroke: color/surface/default/foreground
  ├─ content                — FRAME, no fill, gap: spacing/component/xxs
  │    ├─ title             — TEXT
  │    └─ description       — TEXT
  └─ action-slot            — INSTANCE (button)
```

### `item` — Type=Avatar

```
item                        — H AUTO-LAYOUT, fill: varies, stroke: varies, radius: radius/lg
  ├─ avatar                 — INSTANCE (avatar component, 40×40, radius/full)
  │                           fill: color/surface/muted (fallback bg)
  ├─ content                — FRAME, no fill, gap: spacing/component/xxs
  │    ├─ title             — TEXT
  │    └─ description       — TEXT
  └─ action-slot            — INSTANCE (button)
```

### `item` — Type=Image

```
item                        — H AUTO-LAYOUT, fill: varies, stroke: varies, radius: radius/lg
  ├─ media                  — INSTANCE (_item-image, 32×32, radius/md)
  │                           fill: IMAGE (Figma image fill — placeholder for implementation)
  ├─ content                — FRAME, no fill, gap: spacing/component/xxs
  │    ├─ title             — TEXT
  │    └─ description       — TEXT
  └─ action-slot            — INSTANCE (button)
```

### `item` — Type=Header

```
item                        — V AUTO-LAYOUT, fill: varies, stroke: varies, radius: radius/lg
                              (no container padding — header bleeds to edge)
  ├─ header                 — FRAME, fill: color/surface/muted
  │                           full-width image area — 120px (Default) · 96px (Sm) · 72px (Xs)
  └─ content-row            — FRAME, no fill, padding + gap: per size
       └─ content           — FRAME, no fill, gap: spacing/component/xxs
            ├─ title        — TEXT
            └─ description  — TEXT
```

> `Type=Header` has **no action-slot** — the Variant matrix applies only to the container fill/stroke. If an action is needed, use a button below the item, outside the component.

### `item` — Type=Link

```
item                        — H AUTO-LAYOUT, fill: varies, stroke: varies, radius: radius/lg
                              align items: TOP (not center) — chevron anchors to top edge
  ├─ content                — FRAME, no fill, gap: spacing/component/xxs
  │    ├─ title             — TEXT
  │    └─ description       — TEXT
  └─ action-slot            — INSTANCE (chevron-right icon, 16×16, no fill/stroke on container)
       └─ Icon              — VECTOR, stroke: color/surface/default/foreground
```

> `Type=Link` uses a bare icon as the action-slot — not a button. The entire row is the interactive target; the chevron signals navigation rather than a discrete action.
>
> **Alignment is top-left** (`counterAxisAlignItems = MIN`). When `description` wraps to multiple lines, a center-aligned chevron drifts away from the title. Top alignment pins the chevron to the title baseline regardless of how tall the content grows. All other Types use center alignment.

---

## Token Bindings

### Container — per Variant

| Variant | Fill | Stroke | Radius |
|---|---|---|---|
| `Default` | — (transparent) | — | `radius/lg` |
| `Outline` | `color/surface/default` | `color/border/default` | `radius/lg` |
| `Muted` | `color/surface/muted` | — | `radius/lg` |

### Container — padding and gap per Size

| Size | All padding sides | Gap between children |
|---|---|---|
| `Default` | `spacing/component/md` | `spacing/component/md` |
| `Sm` | `spacing/component/sm` | `spacing/component/sm` |
| `Xs` | `spacing/component/xs-plus` | `spacing/component/xs-plus` |

> `Type=Header` applies these values to `content-row`, not the outer container.

### Text tokens

| Layer | Token | Notes |
|---|---|---|
| `title` TEXT | `color/surface/default/foreground` | Primary text — all Types and Variants |
| `description` TEXT | `color/surface/muted/foreground` | Supporting text — all Types and Variants |

### Leading element tokens

| Type | Layer | Token |
|---|---|---|
| Icon | `placeholder > Icon` VECTOR stroke | `color/surface/default/foreground` |
| Avatar | `avatar` fill | `color/surface/muted` (fallback bg, from avatar source) |
| Image | `media` fill | IMAGE fill — implementation replaces with actual src |
| Header | `header` fill | `color/surface/muted` (placeholder bg) |
| Link | `action-slot > Icon` VECTOR stroke | `color/surface/default/foreground` |

### `action-slot` (button sub-component)

The `action-slot` is a button INSTANCE. Its fills and strokes come from the button source component's own tokens — never override them from within `item`.

| Property | Token |
|---|---|
| Fill | `button/outline/bg/bg` |
| Stroke | `button/outline/border/default` |
| Label fill | `button/outline/fg/fg` |

> Never reach inside `action-slot` to repaint its label or icon. If a different button style is needed, change the button's `Type` variant prop on the instance.

---

## Behavior

### Architecture

`item` is a **presentational list-row component** — it has no built-in state management, routing, or click handling. Interactivity is entirely an implementation concern. In Figma it is a static design token; in code the parent supplies `onClick`, `href`, or any selection logic.

### Row interaction models

There are two distinct interaction models depending on Type:

**Discrete action (`Type=Default`, `Icon`, `Avatar`, `Image`, `Header`)**
The row itself is non-interactive. The `action-slot` button is the sole interactive target. The row does not receive focus or hover styling — only the embedded button does.

**Full-row action (`Type=Link`)**
The entire row is the interactive target — wrap it in an `<a>` or `<button>` in implementation. The trailing chevron-right icon signals navigation ("tap to open") rather than a discrete action. There is no separate button; the row itself handles the click/tap.

### `action-slot` visibility

The `action-slot` is conditionally rendered:
- **Show** when the item has a discrete action (e.g. Edit, Remove, View)
- **Hide** for `Type=Link` — the row is the action; a button would duplicate the target
- **Hide** for `Type=Header` — no action-slot exists in this Type
- **Hide** when the item is read-only or informational (e.g. a status row)

In Figma, toggle visibility on the `action-slot` layer. In implementation, conditionally render the button.

### `description` visibility

The `description` TEXT layer is optional. Hide it when:
- Items are atomic and self-explanatory (single-line command palettes, simple pickers)
- Space is so constrained that a second line causes density problems at `Size=Xs`

### Image and header fills

`Type=Image` (`media` INSTANCE) and `Type=Header` (`header` FRAME) use muted fill placeholders in Figma. In implementation:
- Replace the IMAGE fill in `media` with the actual image src (product photo, logo, thumbnail)
- Replace the muted fill in `header` with a real cover image
- Both should include appropriate `alt` text for accessibility

### Keyboard

| Key | Action |
|---|---|
| `Tab` | Move focus to `action-slot` button (or to the `<a>` / `<button>` row for `Type=Link`) |
| `Enter` / `Space` | Activate the focused action-slot button or full-row link |

> For `Type=Link`, the entire row is the focus target — not a child element. For other Types, only the `action-slot` button receives focus; the row content is not keyboard-navigable on its own.

---

## Accessibility

| Property | Value |
|---|---|
| `Type=Link` row | Wrap in `<a href="...">` or `<button>` — gives it an accessible role and focus target |
| `action-slot` button | Uses the button component's built-in accessible label — ensure the label text is descriptive, not just "Edit" without context |
| `Type=Image` media | Provide `alt` text describing the image content (`alt="Product: Blue Widget"`) |
| `Type=Header` cover | Provide `alt` text or `aria-hidden="true"` if the image is purely decorative |
| `Type=Avatar` | Avatar component handles its own accessible label — confirm the name is exposed via `aria-label` or visible text |
| `description` when hidden | If `description` is conditionally hidden, ensure the `title` alone is still sufficient to identify the item |

---

## Usage Rules

> **Typical use cases:**
>
> - **Navigation menus** — `Type=Icon` or `Type=Link` rows listing destinations, each with an icon and label
> - **Activity feeds** — `Type=Avatar` rows showing who did what, with a timestamp in the description
> - **Compact settings lists** — `Type=Icon` or `Type=Default` rows inside a `card`, each a toggle or disclosure row
> - **File or folder listings** — `Type=Image` rows with a thumbnail, filename, and file size
> - **User or member groups** — `Type=Avatar` rows listing team members with role in the description

---

> **Item vs Card — when to use which:**
>
> | | `item` | `card` |
> |---|---|---|
> | Purpose | A single entry in a list | A self-contained block of independent information |
> | Structure | Flat — icon / avatar / image + title + description + action | Sectioned — `card-header`, `card-content`, `card-footer` |
> | Design | Compact, repeatable, grouped tightly | Padded shell (24px), spaced sections (16px gap), border + shadow |
> | Standalone? | Rarely — lives inside a list, feed, menu, or card | Yes — placed directly on the page canvas or in a grid |
> | Use case | Navigation menu row, activity feed entry, settings list row | Metric panel, product listing, profile summary, settings category |
>
> **Rule:** if the content is one entry in a repeating list → `item`. If the content is a complete, independently meaningful block → `card`. When a card contains a list of entries, put `item` rows inside `card-content`.

---

> **Always use `item`, never `_item-image` standalone.**
>
> `_item-image` is the image placeholder sub-component. Placing it directly in a layout produces a non-functional visual with no content or action.

> **Choose the Type by what the leading element communicates, not by aesthetics.**
>
> - `Type=Default` — no leading context needed; text is self-sufficient
> - `Type=Icon` — item maps to a category, type, or action recognisable by icon
> - `Type=Avatar` — item represents a person or user entity
> - `Type=Image` — item represents a product, file, or visual entity
> - `Type=Header` — item needs a large cover image (article, feature, rich content)
> - `Type=Link` — item is a navigation row; tapping the whole row goes somewhere

> **Choose Variant by surface context:**
>
> - `Variant=Default` — inside a bordered list container or card that already defines the boundary
> - `Variant=Outline` — standalone on open canvas, or when each item needs its own card boundary
> - `Variant=Muted` — subtle row tint for alternating rows, active/highlighted states, or sidebar items

> **Choose Size by information density and available space:**
>
> - `Size=Default` — standard use; comfortable reading with full description line
> - `Size=Sm` — compact lists, secondary panels, sidebars
> - `Size=Xs` — very dense lists, mobile views, inline pickers

- The `description` layer is optional in implementation — hide it when items are atomic (single-line lists, command palettes)
- The `action-slot` is optional in implementation — hide it when the row itself is the action (`Type=Link`) or when no action is available
- Do not change the button inside `action-slot` to a destructive style by overriding fills — swap the `action-slot` INSTANCE to the appropriate button variant instead
- For `Type=Image`, replace the IMAGE fill in `media` in implementation with the actual image source — the muted placeholder is for design representation only
- `Type=Header`'s `header` frame represents a cover image — replace the muted fill with a real image in implementation

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Navigation menus where each row lists a destination with an icon and label
- Activity feeds showing who performed an action, with a timestamp or status in the description
- Settings lists inside a card — each row is a toggle, disclosure, or option
- File or folder browsers with a thumbnail, filename, and file size on each row
- Team or member group lists showing user avatars, names, and roles
- Command palettes or search result lists where each result is a compact, tappable row

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Type=Default` | No leading media needed — text alone is sufficient to identify the item | Simple settings rows · Text-only options list · Command palette entries |
| `Type=Icon` | Items map to a recognisable category, action type, or feature | App navigation menu · File type list · Feature settings with category icons |
| `Type=Avatar` | Each item represents a person or user entity | Team member list · Assignee picker · Chat conversation list · Activity feed |
| `Type=Image` | Each item represents a product, file, brand, or visual entity | Product picker · File browser · Brand or integration list |
| `Type=Header` | Item needs a large cover image — editorial or feature-rich content | Article preview · Featured course row · Rich onboarding card |
| `Type=Link` | The entire row navigates somewhere — no discrete button action needed | Settings disclosure rows · Navigation list in a sheet · Mobile-style menu rows |
| `Variant=Default` | Item is inside a bordered list container or card that already defines boundaries | Items inside a `card` · Rows inside a panel with its own border |
| `Variant=Outline` | Item stands alone on open canvas or needs its own card-like boundary | Standalone selection cards · Items placed directly on page background |
| `Variant=Muted` | Subtle row tint for alternating rows, highlighted active state, or sidebar context | Active/selected row highlight · Zebra-stripe alternative · Sidebar active item |
| `Size=Default` | Standard density — comfortable reading with full description line | Main navigation lists · Activity feeds · Settings panels |
| `Size=Sm` | Compact density — secondary panels, sidebars, nested lists | Sidebar sub-items · Compact pickers · Secondary settings |
| `Size=Xs` | Maximum density — very tight spaces or mobile views | Inline pickers · Dense command palettes · Mobile list views |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A single repeatable row in a vertical list | `item` | `card` |
| A self-contained block of independent information (metric, product, profile) | `card` | `item` |
| Many rows of uniform structured data with column headers and sorting | `table` | `item` |
| A navigation row that opens a new view when tapped | `item` (`Type=Link`) | `button` as a full-width row |
| A full app navigation panel with grouped sections | `sidebar` | a stack of `item` rows |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use `_item-image` directly in a layout | Use `item` — the image sub-component has no standalone behavior |
| Use `Type=Avatar` for a non-person entity | Use `Type=Image` for products, files, logos |
| Use `Type=Link` when a specific button action is needed | Use `Type=Default/Icon/Avatar/Image` with `action-slot` |
| Use `Type=Header` for standard list rows | `Type=Header` is for editorial/rich content rows with a cover image |
| Override fills inside `action-slot` from the `item` parent | Change the button's variant prop — never repaint its internals |
| Use `Variant=Outline` inside a component that already provides its own border | Use `Variant=Default` — double borders look broken |
| Stack `Variant=Outline` items without any gap | Add a gap or use a list container — adjacent borders merge visually |
| Put a description that repeats the title | Description adds context the title doesn't carry: role, date, status, count |
