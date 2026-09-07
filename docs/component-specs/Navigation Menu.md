# Navigation Menu

A horizontal site navigation bar with dropdown panels. Built on [Radix UI NavigationMenu](https://www.radix-ui.com/primitives/docs/components/navigation-menu), wrapped by shadcn. Consists of three components: a trigger/link button (`nav-button`), a dropdown panel (`nav-panel`), and an individual link item inside the panel (`nav-panel-link`).

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `nav-button` | `127:193` | 8 | Clickable item in the nav bar — either a dropdown trigger or a direct link |
| `nav-panel` | `127:353` | 3 | Dropdown panel that opens below a trigger button |
| `nav-panel-link` | `127:157` | 4 | Individual link row inside a nav panel |

---

## Variant Matrix

### `nav-button` — `Type × State × Open`

| Property | Options | Default |
|---|---|---|
| `Type` | `Trigger`, `Link` | `Trigger` |
| `State` | `Default`, `Focus`, `Hover`, `Disabled` | `Default` |
| `Open` | `true`, `false` | `false` |

`Type(2) × State(4) × Open(2) = 16 variants`  
> `Open` only applies to `Type=Trigger`. All `Type=Link` variants have `Open=false` (no open state).

**`Type=Trigger`** — opens a `nav-panel` dropdown on click/hover. Has a leading `icon`, a `label`, and a trailing **`ChevronDown`** icon (Lucide `chevron-down`). When `Open=true`, the `ChevronDown` rotates 180° to indicate the panel is open.

**`Type=Link`** — navigates directly to a route. Has a leading `icon` and a `label`. No chevron, no dropdown.

---

### `nav-panel` — `Layout`

| Property | Options | Default |
|---|---|---|
| `Layout` | `List`, `Grid`, `Featured` | `List` |

`Layout(3) = 3 variants`

**`Layout=List`** — single column of up to 3 `nav-panel-link` instances, plus 2 extra SLOTs for additional content.

**`Layout=Grid`** — two columns (`column-left`, `column-right`), each holding up to 3 `nav-panel-link` instances and 1 extra SLOT.

**`Layout=Featured`** — a `featured` SLOT on the left (for imagery or a callout) alongside a single column of 3 `nav-panel-link` instances and 1 extra SLOT.

---

### `nav-panel-link` — `State`

| Property | Options | Default |
|---|---|---|
| `State` | `Default`, `Focus`, `Hover`, `Disabled` | `Default` |

`State(4) = 4 variants`

---

## Structure

### `nav-button` — Type=Trigger

```
nav-button                      — H AUTO-LAYOUT, radius: radius/md
                                  fill: color/background/default
                                  padding T/B: spacing/component/sm · L/R: spacing/component/md
                                  gap: spacing/component/xs
  ├─ icon                       — INSTANCE (Icon Placeholder, 16×16)
  │    └─ placeholder › Icon    — VECTOR, stroke: varies by state
  ├─ label                      — TEXT, fill: varies by state
  └─ chevron-down               — INSTANCE (Icon Placeholder, 16×16)
       └─ Icon                  — VECTOR, stroke: varies by state
                                  Lucide icon: ChevronDown
                                  Open=false → 0° rotation
                                  Open=true  → 180° rotation (points up)
```

### `nav-button` — Type=Link

```
nav-button                      — same container, no chevron
  ├─ icon                       — INSTANCE (Icon Placeholder, 16×16)
  └─ label                      — TEXT, fill: varies by state
```

### `nav-panel` — Layout=List

```
nav-panel                       — V AUTO-LAYOUT, fill: color/surface/overlay
                                  stroke: color/border/default 1px INSIDE
                                  radius: radius/base · effect: shadows/shadow
                                  padding: spacing/component/lg (all sides)
                                  gap: spacing/component/sm
  ├─ link-1                     — INSTANCE (nav-panel-link)
  ├─ link-2                     — INSTANCE (nav-panel-link)
  ├─ link-3                     — INSTANCE (nav-panel-link)
  ├─ extra-4                    — SLOT (optional extra content)
  └─ extra-5                    — SLOT (optional extra content)
```

### `nav-panel` — Layout=Grid

```
nav-panel                       — H AUTO-LAYOUT, same container tokens
  ├─ column-left                — FRAME, V AUTO-LAYOUT, gap: spacing/component/sm
  │    ├─ link-1/2/3            — INSTANCE (nav-panel-link)
  │    └─ extra-2               — SLOT
  └─ column-right               — FRAME, V AUTO-LAYOUT, gap: spacing/component/sm
       ├─ link-4/5/6            — INSTANCE (nav-panel-link)
       └─ extra-3               — SLOT
```

### `nav-panel` — Layout=Featured

```
nav-panel                       — H AUTO-LAYOUT, same container tokens
  ├─ featured                   — SLOT (160px wide, for image or featured card)
  └─ links-column               — FRAME, V AUTO-LAYOUT, gap: spacing/component/sm
       ├─ link-1/2/3            — INSTANCE (nav-panel-link)
       └─ extra-1               — SLOT
```

### `nav-panel-link`

```
nav-panel-link                  — V AUTO-LAYOUT, radius: radius/md
                                  padding T/B: spacing/component/sm · L/R: spacing/component/md
                                  gap: spacing/component/xs
  ├─ title                      — TEXT, fill: varies by state
  └─ description                — TEXT, fill: varies by state
```

---

## Token Bindings

### `nav-button` — by state

| Layer | Property | Default | Focus | Hover | Disabled |
|---|---|---|---|---|---|
| root | Fill | `color/background/default` | `color/background/default` | `color/background/accent` | `color/background/default` |
| root | Stroke | — | `color/ring` 2px OUTSIDE | — | — |
| root | Radius | `radius/md` | `radius/md` | `radius/md` | `radius/md` |
| `label` | Fill | `color/background/default/foreground` | `color/background/default/foreground` | `color/background/default/foreground` | `color/text/disabled` |
| `icon › Icon` | Stroke | `color/background/default/foreground` | `color/background/default/foreground` | `color/background/accent/foreground` | `color/icon/disabled` |
| `chevron-down › Icon` | Stroke | `color/background/default/foreground` | `color/background/default/foreground` | `color/background/accent/foreground` | `color/icon/disabled` |

> `chevron-down` is only present in `Type=Trigger`. `Type=Link` has no chevron.  
> The `chevron-down` icon is **Lucide `ChevronDown`**. It rotates 180° when `Open=true` — use a CSS/Framer `rotate` transform, not a separate icon swap.

### `nav-panel` — container (all layouts)

| Property | Token |
|---|---|
| Fill | `color/surface/overlay` |
| Stroke | `color/border/default` 1px INSIDE |
| Radius | `radius/base` |
| Effect | `shadows/shadow` |
| Padding (all sides) | `spacing/component/lg` (16px) |
| Gap between children | `spacing/component/sm` (8px) |

### `nav-panel-link` — by state

| Layer | Property | Default | Focus | Hover | Disabled |
|---|---|---|---|---|---|
| root | Fill | — (transparent) | — (transparent) | `color/background/accent` | — (transparent) |
| root | Stroke | — | `color/ring` 2px OUTSIDE | — | — |
| root | Radius | `radius/md` | `radius/md` | `radius/md` | `radius/md` |
| `title` | Fill | `color/surface/default/foreground` | `color/surface/default/foreground` | `color/surface/default/foreground` | `color/text/disabled` |
| `description` | Fill | `color/text/secondary` | `color/text/secondary` | `color/text/secondary` | `color/text/disabled` |

---

## Behavior

### Architecture

Navigation Menu is built on **Radix UI NavigationMenu**. The shadcn wrapper re-exports `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, and `NavigationMenuLink`.

```tsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    {/* Trigger → opens a panel */}
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        {/* nav-panel content here */}
      </NavigationMenuContent>
    </NavigationMenuItem>

    {/* Link → direct navigation */}
    <NavigationMenuItem>
      <NavigationMenuLink href="/about">About</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Open / Close

**Open trigger:** hovering a `NavigationMenuTrigger` opens the associated `NavigationMenuContent` panel after a delay of **200ms** (Radix UI default: `delayDuration={200}`). Clicking also opens it.

**Close trigger:** moving the cursor away from both the trigger and the open panel closes it after **300ms** (`skipDelayDuration={300}` — the grace period that prevents the panel from closing while moving the cursor toward it).

**Escape:** pressing `Escape` closes the open panel and returns focus to the trigger.

**One panel at a time:** only one `NavigationMenuContent` is open at a time. Opening a second trigger closes the first.

### Panel animation

Radix UI NavigationMenu uses the `data-motion` attribute on the content for enter/exit animation direction (`from-start`, `from-end`). Shadcn wires CSS animations to these attributes. Panels animate in from the direction of the previously active trigger (left or right).

### Viewport

Shadcn's `NavigationMenuViewport` renders the panel content inside a shared viewport element positioned below the trigger list. The viewport repositions horizontally to align with the active trigger. This keeps the dropdown anchored to the nav bar rather than appearing inline.

### Keyboard

| Key | Action |
|---|---|
| `Tab` | Move focus between nav items |
| `Enter` / `Space` | Activate focused trigger (open panel) or follow focused link |
| `Escape` | Close the open panel, return focus to its trigger |
| `Arrow Right` / `Arrow Left` | Move focus between items in the trigger list |
| `Arrow Down` | Move focus into the open panel content |
| `Home` / `End` | Move focus to first / last item in the trigger list |

---

## Slots

`nav-panel` variants include SLOT nodes for content beyond the standard `nav-panel-link` instances:

| Variant | Slot name | Typical use |
|---|---|---|
| `Layout=List` | `extra-4`, `extra-5` | Call-to-action link, section label, separator |
| `Layout=Grid` | `extra-2` (left), `extra-3` (right) | CTA link or supplementary content per column |
| `Layout=Featured` | `featured` (160px, left), `extra-1` (links column) | Featured image, product card, hero callout |

The `featured` SLOT in `Layout=Featured` is 160px wide and holds visual content — an image, a feature card, or a promotional block. It is not a `nav-panel-link`.

---

## Accessibility

| Property | Value |
|---|---|
| Role | `NavigationMenu` renders `<nav>` with `aria-label="Main"` by default (customise via `aria-label`) |
| Trigger | `NavigationMenuTrigger` renders `<button aria-expanded aria-controls>` — expanded state announced automatically |
| Panel | `NavigationMenuContent` renders with `aria-labelledby` pointing to its trigger |
| Links | `NavigationMenuLink` renders `<a>` — use `asChild` with your router link for SPA navigation |
| Focus trap | Panel is NOT a modal — focus is not trapped; Tab moves through all panel links |
| Live region | None — panel open/close is conveyed via `aria-expanded` on the trigger |

### Keyboard
*(See Keyboard table in Behavior section above.)*

---

## Usage Rules

- Use `Type=Trigger` only when there is a `nav-panel` to open — never use a trigger with no associated content
- Use `Type=Link` for top-level routes that navigate directly without a dropdown (About, Pricing, Contact)
- Choose `Layout=List` for ≤ 5 links; `Layout=Grid` for 6–12 links grouped in two columns; `Layout=Featured` when one nav section has a strong visual anchor (product screenshot, featured article)
- Always provide both `title` and `description` in `nav-panel-link` — a link with no description is harder to scan in a dense panel
- Keep nav bar items to 5–7 triggers/links — more than 7 creates cognitive overload and horizontal crowding
- Place `<NavigationMenu>` once per page — typically in the site header layout, not inside a page component

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- A SaaS app header has "Products", "Solutions", and "Pricing" — Products and Solutions each expand to a panel of sub-links
- A marketing site top nav includes "Features" (opens a grid of feature links), "Docs" (direct link), and "Blog" (direct link)
- A platform nav bar shows "Integrations" with a featured panel highlighting a new integration alongside a list of categories
- An enterprise app header organises a large link library into two columns under each top-level trigger
- A documentation site uses a nav bar with trigger buttons that reveal categorised article links in a list panel
- A commerce site's top nav shows "Collections" with a featured image panel linking to seasonal categories

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Trigger` (nav-button) | Top-level nav item that opens a dropdown panel of sub-links | "Products" with a panel of product categories · "Solutions" with use-case links |
| `Link` (nav-button) | Top-level route that navigates directly without a dropdown | "Pricing" · "About" · "Contact" |
| `List` (nav-panel) | ≤5 sub-links in a single column | Simple product tier list · Short docs category list |
| `Grid` (nav-panel) | 6–12 sub-links grouped in two columns | Full feature index · Large integration directory |
| `Featured` (nav-panel) | One nav section has a strong visual anchor alongside sub-links | New product highlight with screenshot · Featured article with cover image |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Horizontal top nav bar with dropdown panels for site-level navigation | `navigation-menu` | `sidebar` |
| Persistent vertical nav along the left edge of a product layout | `sidebar` | `navigation-menu` |
| Within-page section switching that stays on the same URL | `tabs` | `navigation-menu` |
| Shows the user's current location in a page hierarchy | `breadcrumb` | `navigation-menu` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Use `Type=Trigger` with no dropdown content | Either add a `nav-panel`, or switch to `Type=Link` |
| Put more than 3 `nav-panel-link` instances per column without extra SLOTs | Use the available SLOT nodes for overflow or switch to Grid layout |
| Override fills inside `nav-panel-link` from the `nav-panel` parent | Change the `nav-panel-link` State prop — never repaint children from the parent |
| Use `color/surface/*` tokens on `nav-button` | `nav-button` sits on the page canvas — use `color/background/*` tokens |
| Nest a `NavigationMenuTrigger` inside `NavigationMenuContent` | Navigation menus are one level deep — no nested dropdowns |
| Use `NavigationMenuLink` without `asChild` in a Next.js/React Router project | Wrap with `asChild` + your router's `<Link>` to get proper SPA navigation without full-page reload |
