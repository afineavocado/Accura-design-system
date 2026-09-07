# Card

A structured container that presents an independent, self-contained block of heterogeneous information — product details, dashboard metrics, user profiles, settings panels. Built on [shadcn Card](https://ui.shadcn.com/docs/components/card), a purely presentational component with no underlying Radix primitive. A card is a shell: it owns the surface, border, radius, and padding, then delegates all interior content to its child sections.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `card` | `297:4933` | 10 | Full card shell with example content per layout type |

---

## Variant Matrix

### `card` — `Property 1`

| Property | Options |
|---|---|
| `Property 1` | `Form`, `Action`, `Info`, `Social media`, `Image-vertical`, `Image-down`, `Image-horizontal`, `Border`, `Tab`, `Item` |

`Property 1(10) = 10 variants`

> These variants are **example compositions** — fully assembled demonstrations of how different content types fit inside the card shell. They are not a closed set of modes. In practice, a card's interior is assembled freely from `card-header`, `card-content`, `card-footer`, and slot frames.

---

## Layout Guide

**`Form`** — card-header + card-content with input fields + card-footer with primary/outline buttons and helper text. Use for login, sign-up, settings forms, or any task that collects structured input inside a contained panel.

**`Action`** — card-header + single card-footer action button. The simplest card: a title, description, and one call-to-action. Use for confirmation prompts, upgrade nudges, or single-decision panels.

**`Info`** — card-header + two content slots + card-content description + card-footer avatar group. Use for metric panels, dashboard summaries, status cards, or any informational surface that combines a headline stat with supporting context.

**`Social media`** — card-header with avatar + username + follow button + an image + two content slots. Use for social feed items, post previews, or user-generated content cards.

**`Image-vertical`** — full-width image at top + two content slots + card-content with title, description, and action buttons. Use for product listings, article previews, or any card where the image is the primary visual hook.

**`Image-down`** — two content slots + card-content title/description + full-width image at bottom. Use when textual content leads and the image provides visual context below (e.g. a chart preview, a thumbnail reveal).

**`Image-horizontal`** — square image left + two content slots + card-content with title and action button. Use for compact product cards, search results, or horizontal list entries where image and text share equal weight.

**`Border`** — card-header + two content slots, with `color/border/strong` stroke instead of `color/border/default`. Use to visually emphasise a card against its surroundings — highlighted selection, active plan, featured item.

**`Tab`** — tab-list at top + card-header + two content slots. Use when the card presents multiple views switchable by tab (e.g. weekly vs. monthly metrics, details vs. activity log).

**`Item`** — card-header + two content slots + card-content with embedded `item` rows + card-footer with avatar group. Use for list-style cards: settings categories, team member panels, or any card that groups a set of list rows.

---

## Structure

### Shell — all variants

```
card                            — V AUTO-LAYOUT, fill: color/surface/overlay
                                  stroke: color/border/default 1px INSIDE
                                  radius: radius/lg (8px)
                                  padding (all sides): spacing/component/xl (24px)
                                  gap between sections: spacing/component/lg (16px)
```

> `Property 1=Border` uses `color/border/strong` instead of `color/border/default`.
> `Property 1=Image-vertical`, `Image-down`, `Image-horizontal` have no root padding — the image bleeds to the card edge; padding is applied inside `card-content` only.

### `card-header`

```
card-header                     — V AUTO-LAYOUT, no fill
                                  gap: spacing/component/xs (4px)
  ├─ title                      — TEXT, fill: color/surface/overlay/foreground
  └─ description                — TEXT, fill: color/text/secondary
```

Maps to shadcn `<CardHeader>` + `<CardTitle>` + `<CardDescription>`.

### `card-content`

```
card-content                    — V AUTO-LAYOUT, no fill
                                  gap: spacing/component/lg (16px) — default
                                  (spacing/component/xs in some variants — matches content density)
  └─ [content instances or text]
```

Maps to shadcn `<CardContent>`. Interior structure varies by variant — may contain input fields, descriptive text, item rows, or any other content.

### `card-footer`

```
card-footer                     — H AUTO-LAYOUT, no fill
                                  gap: spacing/component/sm (8px)
  └─ [action and cancel buttons, avatar groups, or helper text rows]
```

Maps to shadcn `<CardFooter>`. Typically holds the card's primary action(s).

### Slots (`Slot 1`, `Slot 2`)

Free-composition frames for content that doesn't fit the standard header/content/footer sections. Used across Info, Social media, Border, Tab, Item, and image variants. Replace with charts, stat blocks, image frames, badge rows, or any other content block.

---

## Token Bindings

### Shell — all variants

| Property | Token | Value |
|---|---|---|
| Fill | `color/surface/overlay` | White / elevated surface |
| Stroke | `color/border/default` | Standard border (all except Border variant) |
| Stroke | `color/border/strong` | Emphasis border (`Property 1=Border` only) |
| Radius (all 4 corners) | `radius/lg` | 8px |
| Padding (all sides) | `spacing/component/xl` | 24px |
| Gap between sections | `spacing/component/lg` | 16px |

### `card-header`

| Layer | Property | Token |
|---|---|---|
| root | Gap | `spacing/component/xs` (4px) |
| `title` | Fill | `color/surface/overlay/foreground` |
| `description` | Fill | `color/text/secondary` |

### `card-footer`

| Property | Token |
|---|---|
| Gap | `spacing/component/sm` (8px) |

### Image variants (no root padding)

Image-vertical, Image-down, Image-horizontal have no `paddingTop` on the root shell — the image bleeds edge-to-edge. The `card-content` frame inside applies `spacing/component/xl` padding independently.

---

## Behavior

### Architecture

shadcn `Card` is a **purely presentational component** — no Radix primitive, no state, no interactivity. It exports six sub-components used to compose the interior:

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Account settings</CardTitle>
    <CardDescription>Manage your account preferences.</CardDescription>
  </CardHeader>
  <CardContent>
    {/* form fields, stats, list rows, etc. */}
  </CardContent>
  <CardFooter>
    <Button>Save changes</Button>
  </CardFooter>
</Card>
```

### Composition model

The card is a **shell** — it owns:
- The surface (`fill`, `border`, `radius`)
- The outer padding (24px all sides)
- The vertical rhythm between sections (16px gap)

Everything inside the shell is independently composed. `CardHeader`, `CardContent`, and `CardFooter` are thin wrappers with their own padding and gap. Mix and match — not all sections are required in every card.

### No built-in state

Card has no hover, focus, active, or selected state out of the box. If a card needs to be interactive (clickable, selectable, expandable), wrap it in a `<button>` or `<a>`, or add state classes manually. shadcn does not provide a Card variant for interactive states — implement them with Tailwind utilities.

### Image bleed

For image cards (Image-vertical, Image-down, Image-horizontal), the image frame has no padding on the root card. Apply `overflow: hidden` and `rounded-lg` to the card in code to ensure the image respects the card's `radius/lg` corner at the bleed edge.

---

## Accessibility

| Property | Value |
|---|---|
| Role | No implicit role — `<div>` by default. Add `role="article"` for feed items, `role="region"` + `aria-label` for landmark sections |
| Interactive cards | Wrap in `<button>` or `<a>` — give an accessible name via `aria-label` or visible heading |
| Card heading | `<CardTitle>` renders `<div>` — promote to `<h2>`/`<h3>` via `asChild` prop when the card is a content section |
| Image alt text | All card images need `alt` — descriptive for content images, `alt=""` for decorative ones |
| Tab variant | Tab navigation is handled by the embedded `tab-list` component — no additional ARIA needed at the card level |

---

## Usage Rules

> **A card groups related content into one scannable unit — not a generic wrapper.**
>
> - Use a card when the content is independently meaningful: a metric, a product, a profile, a setting category
> - Do not wrap every section of a page in cards — use cards sparingly to create hierarchy, not as a default layout container

> **Typical use cases:**
>
> - **Metric panels** — a headline stat, supporting description, and a trend or sparkline in the slots
> - **E-commerce product listings** — image-vertical or image-horizontal with title, price, and add-to-cart in the footer
> - **Settings cards** — card-header with section name + card-content with toggle rows or input fields + save button in footer
> - **Dashboard summaries** — Info or Tab variant with stat blocks in slots, description in card-content
> - **Social feed items** — Social media variant with avatar, user name, follow action, and post image

- Always include `card-header` with at least a `title` — a card with no heading is not scannable
- `card-footer` is optional — omit it for read-only informational cards
- Use slots (`Slot 1`, `Slot 2`) for content that doesn't fit the text-only header/content/footer — charts, stat badges, image thumbnails
- Keep card width consistent within a grid — avoid mixing wide and narrow cards in the same row unless the layout explicitly calls for it
- For interactive cards, add `cursor-pointer` and a focus ring in code — the Figma component has no hover or focus variant

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Dashboard metric panels showing a headline stat, supporting description, and a trend sparkline
- E-commerce product listings with an image, title, price, and add-to-cart action
- Authentication forms (login, sign-up, password reset) contained in a centred card shell
- User profile summaries combining avatar, name, role, and quick-action buttons
- Settings category panels grouping related input fields under a titled section
- Social feed post previews with avatar, username, image, and engagement actions

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Form` | The card collects structured user input | Login form · Sign-up panel · Payment details card · API key settings |
| `Action` | The card presents a single decision or call-to-action | Upgrade nudge · Confirmation prompt · "Start free trial" panel |
| `Info` | The card summarises a metric or status with supporting context | Revenue panel · Active users widget · Server health card |
| `Social media` | The card is a social content preview with identity and media | Post preview · User profile card · Review card |
| `Image-vertical` | The image is the primary hook and leads the card content | Product listing · Article card · Course preview |
| `Image-down` | Text leads, image provides supporting context below | Blog summary · Announcement card with illustration |
| `Image-horizontal` | Image and text share equal weight in a compact format | Search result row · Compact product card · Horizontal article tile |
| `Border` | One card in a set needs visual emphasis (selected, featured, highlighted plan) | Active pricing tier · Selected team member · Featured integration |
| `Tab` | The card presents multiple switchable views of the same content | Weekly vs monthly metrics · Details vs activity log · Code vs preview |
| `Item` | The card groups a list of row entries under a titled section | Team members panel · Settings category with toggle rows · Notification list |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A self-contained block of independent information (metric, product, profile) | `card` | `item` |
| A single repeatable row in a list (one entry among many) | `item` | `card` |
| Structured tabular data with sortable columns and many uniform rows | `table` | `card` |
| A generic section wrapper for every page region | spacing + layout | `card` |
| A card that contains a list of entries | `card` with `item` rows inside `card-content` | nested `card` inside `card` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use a card as a generic page section wrapper | Use cards only when content is a self-contained, independently meaningful unit |
| Stack cards without any grid or gap | Use a consistent grid with `gap` — adjacent cards need breathing room |
| Override the card fill to `color/surface/default` or a background token | Keep `color/surface/overlay` — the card's elevated appearance relative to the page is intentional |
| Put a card inside a card | Nest `item` rows or other list components inside `card-content` instead |
| Use `Property 1=Border` for all cards to "make them stand out" | Border variant signals selection or emphasis — reserve it for one highlighted card in a set |
| Forget `overflow: hidden` on image-bleed variants in code | Image corners will overflow the card radius without it |
