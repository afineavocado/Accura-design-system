# Separator

A visual divider between sections of content. One token, two orientations — no states, no children.

---

## Variant Matrix

### separator (`75:11717`)

| Property | Options | Default |
|---|---|---|
| `Orientation` | `Horizontal`, `Vertical` | `Horizontal` |

2 variants total.

---

## Component Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `Orientation` | VARIANT | `Horizontal` | Controls which axis the line runs along |

No boolean props, no text props, no instance swaps.

---

## Structure

Both variants are a single flat frame with no children. The fill is the line itself.

```
separator                — FRAME, no children
                           fill: color/border/default
                           1px on the separator axis
```

| Variant | Width | Height | The 1px axis |
|---|---|---|---|
| `Horizontal` | fills parent (set in instances) | 1px | Height |
| `Vertical` | 1px | manual (match adjacent content) | Width |

---

## Token Bindings

### Fill

| Property | Token | Notes |
|---|---|---|
| Fill | `color/border/default` | Both orientations — no per-variant difference |

No strokes, no effects, no border-radius, no opacity bindings.

---

## Sizing

The separator fills its parent on the spanning axis by default — matching the shadcn/Tailwind code behavior (`w-full` for horizontal, `h-full` for vertical). No manual resize needed.

| Orientation | Width | Height | Default in Figma | Code equivalent |
|---|---|---|---|---|
| `Horizontal` | **Fill container** | 1px fixed | `layoutSizingHorizontal = FILL` | `w-full h-[1px]` |
| `Vertical` | 1px fixed | **Fill container** | `layoutSizingVertical = FILL` | `w-[1px] h-full` |

Drop it inside any auto-layout frame and it stretches automatically. The spanning dimension is never a designer decision — it is always the full available space.

---

## Accessibility

| Property | Value |
|---|---|
| Role | `separator` (implicit on `<hr>`) |
| Keyboard | Not interactive — no focus, no activation |
| Screen reader | Renders as a dividing landmark; use `aria-orientation="vertical"` when orientation is vertical |
| Touch target | Not required — purely decorative/structural |

---

## Behavior

The separator is static. It has no states, no hover, no focus, no disabled. It is purely a visual element with no interaction.

It communicates hierarchy and grouping — "these things are related to each other; those things over there are separate."

---

## Usage Rules

- Use `Horizontal` to divide stacked sections (e.g. between form groups, below a page header, between list rows).
- Use `Vertical` to divide side-by-side elements within a row (e.g. between nav items, in a toolbar, between metadata pills).
- Do not use a separator as a design element for visual decoration — only to communicate a logical boundary between content groups.
- Do not stack two separators. If you feel you need two, the content structure needs rethinking (add a heading or more spacing instead).
- Prefer spacing alone for minor grouping. Reserve separator for cases where content groups are distinct enough that a line helps, not just separated.

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Between a page header and its primary content body to signal a transition from navigation context to content
- Between groups of form fields that belong to different logical sections (Personal info / Contact details / Preferences)
- Between items in a dropdown menu or command palette where grouping aids scanning
- Between nav items in a toolbar or horizontal nav strip to divide conceptually separate clusters
- Inside a `card` or panel to divide the header region from the body, or body from the footer
- In metadata rows (e.g. "Author · Date · Read time") to separate inline key-value pairs visually

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Horizontal` | Dividing stacked content — one section above, another below | Between form groups · Below a page title · Between dropdown menu sections · Card header / body boundary |
| `Vertical` | Dividing side-by-side elements within a single row | Between nav items in a toolbar · Between metadata pills · Between two columns in a stat row |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| An explicit visual line between two content regions on the same surface | `separator` | A card border or a raw 1px rectangle |
| A boundary that defines a card's surface (its own edge) | `card` border | `separator` |
| Grouping related items with implied proximity rather than a hard line | spacing / gap | `separator` |
| Dividing nav sections in an app-level sidebar | `separator` (horizontal, between groups) | `_sidebar-group-label` alone |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Raw 1px rectangle with hardcoded hex color | `separator` component — token-bound, fills automatically |
| Using a separator for pure visual decoration | Spacing or a background fill change instead |
| Two separators back to back | One separator — or a section heading |
| Manually fixing the width/height to a pixel value | Let it fill — the spanning dimension should always be 100% of the parent |
