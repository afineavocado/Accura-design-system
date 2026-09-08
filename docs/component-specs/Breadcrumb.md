# Breadcrumb

Navigation trail showing the user's location within a hierarchy. Built from two sub-components assembled in example frames — there is no fixed composite component.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `_breadcrumb-item` | `291:223` | 16 | Individual link or current-page label |
| `_breadcrumb-separator` | `52:13919` | 3 | Chevron, slash, or dot divider between items |

---

## Variant Matrix

### `_breadcrumb-item`

| Property | Options | Default |
|---|---|---|
| `Current` | `True`, `False` | `False` |
| `Icon` | `True`, `False` | `False` |
| `State` | `Default`, `Hover`, `Focus`, `Disabled` | `Default` |

`Current(2) × Icon(2) × State(4) = 16 variants`

### `_breadcrumb-separator`

| Property | Options | Default |
|---|---|---|
| `Type` | `Chevron`, `Slash`, `Dot` | `Chevron` |

---

## Structure

### `_breadcrumb-item`

```
_breadcrumb-item                — HORIZONTAL, gap: spacing/component/xs
  ├─ icon                       — INSTANCE (placeholder icon) — visible when Icon=True
  └─ label                      — TEXT
```

### `_breadcrumb-separator`

```
_breadcrumb-separator
  ├─ Type=Chevron               — INSTANCE (chevron-right icon)
  ├─ Type=Slash                 — TEXT "/"
  └─ Type=Dot                   — TEXT "·"
```

---

## Why No Composite Component

Breadcrumb is a list pattern, not a slotted shell. The number of items is indeterminate (2–5+ items per trail) and the separator always alternates between items — two properties that make a fixed-slot component either dishonest (fixed depth) or over-engineered (Depth=2/3/4/5 variants). Example frames communicate the assembly rule more clearly than any fixed component would.

---

## Token Bindings

### `_breadcrumb-item` — label text per state

| `Current` | `State` | Token |
|---|---|---|
| `False` | `Default` | `color/text/secondary` |
| `False` | `Hover` | `color/background/default/foreground` |
| `False` | `Focus` | `color/background/default/foreground` |
| `False` | `Disabled` | `color/text/disabled` |
| `True` | `Default` | `color/background/default/foreground` |
| `True` | `Hover` | `color/background/default/foreground` |
| `True` | `Focus` | `color/background/default/foreground` |
| `True` | `Disabled` | `color/text/disabled` |

> `color/background/default/foreground` is correct here — breadcrumb items sit on the page canvas, not on a component surface. Do not use `color/surface/default/foreground`.

### `_breadcrumb-item` — icon stroke

The leading icon is a **paired icon** — it tracks the label's foreground per state (system Paired icon rule / `currentColor`), never a fixed `color/icon/*`.

| `Current` | `State` | Icon stroke = label fg |
|---|---|---|
| `False` | `Default` | `color/text/secondary` |
| `False` | `Hover` / `Focus` | `color/background/default/foreground` |
| `True` | `Default` / `Hover` / `Focus` | `color/background/default/foreground` |
| any | `Disabled` | `color/text/disabled` |

Icon stroke is bound on the VECTOR nodes inside the icon instance — never on the instance frame itself.

### `_breadcrumb-item` — focus state

| Property | Value |
|---|---|
| Stroke | `color/ring` |
| Stroke weight | 2px |
| Stroke align | `OUTSIDE` |
| Corner radius | `radius/sm` (all 4 corners individually) |

`radius/sm` (8px) is used on Focus to match the rounded corners of the focus ring. Without it the ring appears as a sharp rectangle around inline text. `radius/md` or above would make the item feel button-like — `radius/sm` is the correct choice for inline text elements.

### `_breadcrumb-item` — spacing

| Property | Token |
|---|---|
| Gap (icon → label) | `spacing/component/xs` (4px) |

### `_breadcrumb-separator` — icon and text

| Type | Layer | Token |
|---|---|---|
| `Chevron` | chevron-right VECTOR stroke | `color/background/default/foreground` |
| `Slash` | "/" TEXT fill | `color/background/muted/foreground` |
| `Dot` | "·" TEXT fill | `color/background/muted/foreground` |

Chevron uses the full foreground token (more visual weight as a directional marker). Slash and Dot use the muted foreground — confirmed from Figma `52:13919`.

---

## Example Frames

Three example frames live in the "Breadcrumb" section below the component sets:

| Example | Description |
|---|---|
| `example--basic` | 3-item trail — Default link → Chevron → Default link → Chevron → Current page |
| `example--with-icon` | Same as basic but first item uses `Icon=True` (home icon) |
| `example--slash-divider` | 3-item trail using `Type=Slash` separator |

### Assembly rule

```
_breadcrumb-item (Current=False)
  _breadcrumb-separator
  _breadcrumb-item (Current=False)
  _breadcrumb-separator
  _breadcrumb-item (Current=True)
```

- Separator always sits between two items — never at start or end
- Last item is always `Current=True, State=Default` (non-interactive)
- `Icon=True` is typically used only on the first item (home / root)
- Gap between instances in the trail: `spacing/component/xs` (4px) — bound on the example frames

---

## Behavior

### Navigation

- Every `_breadcrumb-item` where `Current=False` is a clickable link — clicking navigates to that level
- `Current=True` is the active page — it is a non-interactive label (`<span>` not `<a>`), never receives focus, and is never underlined
- `State=Disabled` items are rendered but not clickable — use sparingly (e.g. a level that exists but the user doesn't have access to)

### States

| State | Trigger | What changes |
|---|---|---|
| `Default` | Resting | `color/text/secondary` label (non-current) |
| `Hover` | Mouse over | Label brightens to `color/background/default/foreground` |
| `Focus` | Keyboard tab | `color/ring` stroke, 2px outside, `radius/sm` |
| `Disabled` | Prop set | `color/text/disabled`; no pointer events |

### Truncation (implementation)

When the trail is too long for the available width, collapse middle items behind an ellipsis indicator:

```
Home  /  …  /  Settings  /  Notifications
```

shadcn provides `BreadcrumbEllipsis` as a **display-only component** — it renders the `…` indicator but has no built-in expand/collapse logic. Expand-on-click behavior is implementation-defined:

- Common pattern: clicking `BreadcrumbEllipsis` toggles a state flag that renders the full trail
- Alternative: open a dropdown showing the hidden items as links
- Collapse threshold: typically triggered when the breadcrumb container overflows — detect with a `ResizeObserver` or define a fixed max-item count

In Figma, represent the collapsed state as a separate example frame using a `_breadcrumb-item` with `Icon=False` and label text "…" in place of the middle items.

### Icon usage

`Icon=True` is typically applied only to the first item to provide a home/root anchor. Using icons on multiple items adds visual noise without navigation benefit.

---

## Accessibility

| Property | Value |
|---|---|
| Role | `<nav aria-label="breadcrumb">` wraps the trail |
| Current page | `aria-current="page"` on the last `<a>` or `<span>` |
| Separators | `aria-hidden="true"` — decorative, not read by screen readers |
| Keyboard | Tab stops on each non-current link only; current page item is not focusable |

---

## Touch Target

`_breadcrumb-item` renders at ~21px height — well below the 44px WCAG 2.5.5 minimum. **Implementation note:** wrap each item in a container with `min-height: 44px` and `display: flex; align-items: center` to meet touch target requirements. This is not fixable in Figma.

---

## Usage Rules

- Use breadcrumb when the page is 2+ levels deep in a hierarchy and the user benefits from knowing where they are
- Always end the trail with `Current=True` — the active page
- Use `Icon=True` only on the first item if you need a home/root visual anchor
- `Type=Chevron` is the default separator — use `Type=Slash` for a lighter, more typographic feel
- Do not use `Type=Dot` in dense navigation — it reads as ambiguous punctuation

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- A settings page at "Settings / Notifications / Email" shows the full path so users can step back to any level
- An e-commerce PDP shows "Home / Women / Shoes / Running" above the product title
- A file manager displays the folder path "Drive / Projects / 2026 / Q1" above the file list
- A docs site shows "Docs / Components / Breadcrumb" at the top of each article page
- A support portal shows "Help Centre / Billing / Refunds" so users know how they arrived at the article
- A long hierarchy trail collapses middle items with an ellipsis to avoid wrapping on narrow viewports

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Current=False` (\_breadcrumb-item) | Navigable ancestor links in the trail | "Home" · "Products" · "Settings" — any level the user can click back to |
| `Current=True` (\_breadcrumb-item) | The active page — non-interactive, always the last item | "Running Shoes" · "Email Notifications" · "Q1 Report" |
| `Icon=True` (\_breadcrumb-item) | First item only, to provide a home/root visual anchor | Home icon on the first crumb in a root-level trail |
| `Chevron` (\_breadcrumb-separator) | Default — clear directional separator for most contexts | Standard product, docs, and settings breadcrumbs |
| `Slash` (\_breadcrumb-separator) | Lighter, more typographic feel — file paths and dev tools | File system paths · Code documentation · Terminal-style UIs |
| `Dot` (\_breadcrumb-separator) | Compact inline trails where space is very tight | Narrow widgets only — avoid in standard navigation contexts |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Shows user's current location in a page hierarchy | `breadcrumb` | `pagination` |
| Navigates between numbered pages of a dataset | `pagination` | `breadcrumb` |
| Site-level navigation to different top-level routes | `navigation-menu` | `breadcrumb` |
| Switches between content sections on the same page | `tabs` | `breadcrumb` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| `color/surface/default/foreground` on label | `color/background/default/foreground` — breadcrumb sits on canvas, not a surface |
| `color/icon/*` on current-page item icon | Same `color/background/default/foreground` as the label — icon matches text |
| Put a separator after the last item | Separator only between items, never trailing |
| Make `Current=True` focusable | Current page is non-interactive — remove from tab order |
| Build a fixed composite `breadcrumb` component | Use example frames — the item count is variable by nature |
| Use `cornerRadius` binding | Always bind all 4 corners individually (`topLeftRadius` etc.) |

---

## Open Questions

None.
