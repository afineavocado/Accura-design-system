> # ⚠️ READ THIS FIRST — Accura overrides the values below
>
> This is the **inherited ruleset**, vendored unchanged from the Agentic Design System.
> Accura follows every **rule** here — naming, semantic layer, paired-surface rule, spacing
> scale, layout, dark-mode architecture. **Do not change them.**
>
> But this document also contains Agentic's **values**, and Accura's are different.
> **Where the two disagree, [`../accura-theme.md`](../accura-theme.md) wins.**
>
> | This file says | Accura actually uses | Where |
> |---|---|---|
> | Brand primary is always `/500` | anchor is **`/800-base`** (`#008852`) — green fails the 3:1 floor at `/500` | theme §1 |
> | Brand blue `#2b7fff` | brand green **`#008852`** | theme §1 |
> | `color/ring` → blue/500 | **`#17bb77`** (brand/500) | theme §7 |
> | Sidebar background zinc/50 `#fafafa` | **`#00393f`** dark teal, light foreground | theme §7 |
> | Sidebar accent zinc/100 | **`#175e41`** (brand/900) + white foreground | theme §7 |
> | Button radius `radius/xl` 12px / `radius/base` 8px | **`9999`** — Accura buttons are pills | theme §7 |
> | `border/error` red/500, `border/success` green/700, `border/warning` yellow/700 | red/**300**, green/**400**, yellow/**300** | theme §7 |
> | Font family Inter | Figma **SF Pro**, code **Inter** — accepted mismatch | theme §6 |
> | Contrast reference table (light mode) | computed against Agentic blue — **not valid for Accura** | theme §1 |
>
> The "Contrast Reference" section near the end of this file is Agentic-specific and must not
> be used to justify an Accura colour decision. Re-measure against Accura's values instead.
>
> Sync source: `Agentic-design-system/agentic-design-system.md` (github.com/afineavocado/agentic-design-system-main).
> If that upstream file changes, re-vendor this copy and re-check the table above.

---

Agentic is a design system for consistent, token-bound UI. Built on Tailwind CSS and shadcn/ui — tokens map directly to code without translation.

All spacing uses Tailwind's 4px base unit. Semantic tokens always reference primitives. Deprecated tokens are marked — do not use them. Always check the "Do not use" field before picking a token or icon.

---

## Source of Truth

| Layer | Authoritative source | On conflict |
|---|---|---|
| Token values (hex/px) | Figma variables (`YWfTOUTpFZ0BNxHobfUqme`) | Change Figma first |
| Token naming + semantic rules | This file | Update here, then sync Figma |
| Component variant structure | Figma ComponentSet | Figma is truth — docs must match |
| Component usage rules | Component markdown (`Component Markdown/`) | Docs are authoritative |
| Current binding state | figma-cli audit output | Audit → fix Figma → update markdown |

Fix the authoritative source first, then propagate. Never update a doc to match a known Figma error.

---

## Two-Layer System

```
Primitive layer  →  raw values — never referenced directly in components
Semantic layer   →  intent/meaning — the only layer components reference
```

**Figma collections:** `Primitives` (mode: Value) · `Semantics` (mode: Light / Dark) · `Component tokens` (optional)

---

## Layer 1 — Primitives

### Naming
```
[category]/[scale-name]/[step]
```

### Colors

Neutral palette: `zinc` scale. Mirror Tailwind exactly.
```
color/white · color/black
color/zinc/50 → zinc/950
color/blue/50 → blue/950
color/red/50 → red/950
color/green/50 → green/950
color/yellow/50 → yellow/950
```
✅ `color/zinc/900` ❌ `color/gray/900`, `Gray 900`, `neutral-dark`

#### Brand / Custom Colors

**Rule 1 — primary brand color is always `/500`.** The main brand color (buttons, links, CTAs) anchors at /500.
```
color/blue/500  →  brand primary blue (e.g. #2B7FFF)
```

**Rule 2 — build scale outward from /500 using perceptual lightness:**
```
/50  → ~95% lightness    /600 → ~46% (hover on light bg)
/100 → ~90%              /700 → ~37%
/200 → ~80%              /800 → ~27%
/300 → ~70%              /900 → ~18%
/400 → ~62% (hover dark) /950 → ~12%
/500 → ~55% ← anchor
```

**Rule 3 — hover derived from adjacent step, never hardcoded:**
- `/400` = hover on dark bg · `/600` = hover on light bg

❌ Never name brand primary anything other than `/500`. ❌ Never hardcode hover hex values.

#### Chart Colors
```
color/chart/1 → #E76E50 (coral)    color/chart/4 → #E8C468 (gold)
color/chart/2 → #2A9D90 (teal)     color/chart/5 → #F4A362 (peach)
color/chart/3 → #274754 (dark teal)
```
Data visualization only — do not use for UI status, brand, or surface tokens.

---

### Spacing

Tailwind scale, base unit 4px.
```
spacing/0 → 0px      spacing/3 → 12px    spacing/10 → 40px
spacing/px → 1px     spacing/4 → 16px    spacing/12 → 48px
spacing/0.5 → 2px    spacing/5 → 20px    spacing/16 → 64px
spacing/1 → 4px      spacing/6 → 24px    spacing/20 → 80px
spacing/1.5 → 6px    spacing/8 → 32px    spacing/24 → 96px
spacing/2 → 8px
```
✅ `spacing/4` (16px) ❌ `spacing/16px`, `space-md`, `padding-medium`

---

### Breakpoints

Mobile-first — base styles apply to all sizes, prefixed styles apply at that width and above.
```
sm: 640px   md: 768px   lg: 1024px   xl: 1280px   2xl: 1536px
```
**Figma frame targets:** Mobile 390px · Tablet 768px · Laptop 1024px · Desktop 1280px · 1440px (common target, maps to `xl:`)

- `lg:` is the primary layout switch point for sidebar/nav (shadcn pattern)
- Never hardcode breakpoint px values in CSS — always use Tailwind prefixes
- 1440px Figma frame → `xl:` in code (max-width constraint handles the 20px difference)

---

### Layout Grid

| Breakpoint | Columns | Gutter | Margin |
|---|---|---|---|
| Mobile (390) | 4 | 16px | 16px |
| Tablet (768) | 8 | 24px | 32px |
| Desktop (1280+) | 12 | 24px | 80px |

**Figma:** save as Grid Styles → `Grid/Mobile`, `Grid/Tablet`, `Grid/Desktop`. Apply to artboard frames only.

**Tailwind:**
```css
grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6
```
Column spans: `col-span-1` through `col-span-12` · `col-span-full` · `col-start-*` / `col-end-*`

- `grid` for page-level layouts · `flex` for component internals — never mix
- `col-span-*` must be multiples of the column count

---

### Container

```
layout/container/max-width → 1400px
layout/container/padding-x → 16px (mobile) · 32px (tablet+)
```
```
container mx-auto px-4 md:px-8 max-w-[1400px]
```
- Every page section wraps in a container — never full-bleed without intent
- 80px Figma margin = visual grid guide, NOT a CSS value
- Full-bleed sections: `w-full` outside, container inside for text content

---

### Z-Index

Always use named tokens — never hardcode.
```
z-index/base     → 0    (normal flow)
z-index/raised   → 10   (sticky headers, FABs)
z-index/dropdown → 20   (dropdowns, popovers)
z-index/sticky   → 30   (sticky sidebars)
z-index/overlay  → 40   (modal backdrops)
z-index/modal    → 50   (modals, dialogs, sheets)
z-index/toast    → 60   (Sonner — always highest)
```
Tailwind: `z-0 z-10 z-20 z-30 z-40 z-50 z-[60]`. Toasts need custom config entry.
- Figma: stacking = layer order, no variable binding needed
- Never skip levels · never use `z-index: 999`

---

### Border Radius

Single base value drives the full scale.
```
radius/base → 8px  (anchor — change to retheme all corners)
radius/none → 0px
radius/sm   → ≈5px  (×0.6)    radius/xl  → 12px (×1.5)
radius/md   → ≈6px  (×0.8)    radius/2xl → ≈14px (×1.8)
radius/lg   → 8px   (= base)  radius/3xl → ≈18px (×2.2)
                               radius/4xl → ≈21px (×2.6)
                               radius/full → 9999px
```
In Figma: set `radius/base` as Number variable. Other steps reference it as multiples.

---

### Font Size
```
font-size/xs → 12px    font-size/2xl → 24px    font-size/6xl → 60px
font-size/sm → 14px    font-size/3xl → 30px    font-size/7xl → 72px
font-size/base → 16px  font-size/4xl → 36px    font-size/8xl → 96px
font-size/lg → 18px    font-size/5xl → 48px    font-size/9xl → 128px
font-size/xl → 20px
```

### Font Weight
```
font-weight/thin        →  100
font-weight/extralight  →  200
font-weight/light       →  300
font-weight/normal      →  400
font-weight/medium      →  500
font-weight/semibold    →  600
font-weight/bold        →  700
font-weight/extrabold   →  800
font-weight/black       →  900
```

### Line Height

⚠️ **Do NOT bind to text styles** — unitless ratios resolve to different px values per font size. CSS/export reference only. Figma text styles use hardcoded px line-heights.
```
none 1.0 · tight 1.25 · snug 1.375 · normal 1.5 · relaxed 1.625 · loose 2.0
```
Stored as percentage integers in Figma (100, 125, 137.5, 150, 162.5, 200).

### Letter Spacing

Plain number variables — the unit comes from the text style, which applies them as **pixels** (verified: all text styles bind `letterSpacing` with px units, e.g. `display/lg` → `letter-spacing/tight` = −1.5px).
```
tighter -2.5 · tight -1.5 · normal 0 · wide 2.5 · wider 5 · widest 10
```

### Shadow

Stored as **Figma effect styles** (not variables). Apply via Effects panel.
```
shadows/2xs  → 0 1px 2px 0 (5%)
shadows/xs   → 0 1px 2px 0 (5%), 0 1px 3px 0 (10%)
shadows/sm   → 0 1px 3px 0 (10%), 0 1px 2px -1px (10%)
shadows/shadow → same as sm (Tailwind default)
shadows/md   → 0 4px 6px -1px (10%), 0 2px 4px -2px (10%)
shadows/lg   → 0 10px 15px -3px (10%), 0 4px 6px -4px (10%)
shadows/xl   → 0 20px 25px -5px (10%), 0 8px 10px -6px (10%)
shadows/2xl  → 0 25px 50px -12px (25%)
```

**Figma effect style IDs:** → see `figma-ids.md`

### Focus effect styles

Two additional effect styles exist for focus states — these are the ambient glow that pairs with the focus ring stroke, not the stroke itself.

```
focus/ring
Type:       DROP_SHADOW (used as outer glow — no offset, no blur, spread only)
Color:      zinc/500 @ 35% opacity
Spread:     3px
Use when:   Input, Checkbox, and form controls that use the focus state ring.
            Pair with: color/ring stroke (2px OUTSIDE).
            The stroke = the visible border color. This effect = the soft ambient glow around it.
Do not use: On buttons — buttons use color/ring stroke directly with no effect style.

focus/destructive
Type:       DROP_SHADOW
Color:      red @ 40% opacity
Spread:     3px
Use when:   Destructive button focus state ONLY — replaces color/ring stroke entirely.
            This effect IS the focus indicator for destructive buttons.
Do not use: On any other component — all other focus states use color/ring stroke.
```

> ⚠️ **Parity note:** In code, the glow is implemented as `color-mix(in_srgb,var(--color-ring)_20%,transparent)` (blue at 20%). In Figma, `focus/ring` uses zinc/500 at 35% (neutral gray). Visually close — acceptable as a known minor discrepancy.

### Opacity

Stored as integers (0–100) in Figma.
```
0 10 20 30 40 50 60 70 75 80 90 100
```

### Motion
```
instant 0ms · fast 100ms · normal 200ms · slow 300ms · slower 500ms
standard cubic-bezier(0.4,0,0.2,1) · enter cubic-bezier(0,0,0.2,1)
exit cubic-bezier(0.4,0,1,1) · linear linear
```

---

## Layer 2 — Semantics

### Naming
```
[category]/[role]/[variant?]/[state?]
```

### Colors — Semantic

shadcn pattern: `[token]` = fill · `[token]/foreground` = text/icon on that fill. Always define both. Exception: `color/background/subtle` is a tint with no foreground pair (intentional).

**Token list:**
```
color/background/default                      color/surface/default
color/background/default/foreground           color/surface/default/foreground
color/background/subtle  ← NO foreground pair color/surface/raised
color/background/muted                        color/surface/raised/foreground
color/background/muted/foreground             color/surface/muted
color/background/inverted                     color/surface/muted/foreground
color/background/inverted/foreground          color/surface/accent
color/background/accent                       color/surface/accent/foreground
color/background/accent/foreground            color/surface/overlay
                                              color/surface/overlay/foreground

color/text/secondary · disabled · invalid · warning · success · inverse
color/text/link · link-hover · link-active

color/border/subtle · default · hover · strong · focus · disabled · error · success · warning
color/input/bg · color/input/border · color/input/placeholder · color/ring

color/brand/primary · primary/foreground · primary-hover · primary-active
color/brand/secondary · secondary/foreground · secondary-hover · secondary-active
color/brand/destructive · destructive/foreground · destructive-hover · destructive-active

color/status/success · /foreground · -subtle · -subtle/foreground
color/status/warning · /foreground · -subtle · -subtle/foreground
color/status/danger · /foreground · -subtle · -subtle/foreground
color/status/info · /foreground · -subtle · -subtle/foreground
color/status/offline · /foreground

color/icon/default · muted · disabled · inverse · brand · danger · success · warning · info
color/chart/1–5

color/sidebar/background · foreground · primary · primary/foreground
color/sidebar/accent · accent/foreground · border · ring
```

**Critical rules:**
- Semantic tokens always reference primitives — never hardcode hex
- Every surface token needs a `/foreground` pair (exception: `color/background/subtle`)
- **`color/brand/destructive` ≠ `color/status/danger`** — destructive = delete button fill; danger = error status indicator. Never swap.
- **Paired-surface rule:** `[token]/foreground` is only valid when the background IS the matching `[token]`. Wrong surface = wrong value in dark mode.
- **`color/brand/destructive` is a fill, never a text color.** Use `color/text/invalid` for error text.
- **`color/surface/*`** = component surfaces · **`color/background/*`** = page-level structure. Use `color/surface/overlay` for dropdowns/popovers/menus. Use `color/surface/default` for dialogs, drawers, and cards — never swap these two.
- **`color/input/bg`** = active input fill (zinc/700 dark) — intentionally lighter than `color/surface/overlay` so inputs stand out from panels. `color/surface/muted` = disabled input fill.
- **`color/background/accent`** = interactive hover tint (ghost/outline hover, menu row hover) — not a CTA fill.
- **`color/status/warning/foreground`** uses `zinc/900` (dark text) — yellow fails WCAG with white.
- **Icons standalone:** use `color/icon/*` · **icons in filled containers:** use the container's `/foreground`. Never mix.
- **`color/icon/*`** aliases semantics, not primitives — colors update when semantic mappings change.
- **Icon Placeholder is stroke-based.** Set color on VECTOR/ELLIPSE `strokes`, not instance fill. See Icon section.
- **`color/input/border`** is zinc/300 — one step darker than `color/border/default` (zinc/200).
- **`color/ring`** = root focus color (blue/500). `color/border/focus` and `button/outline/border/focus` are direct aliases. Use the most specific alias available.
- Chart, sidebar, opacity tokens are scoped — do not use outside their context.
- Font-family values must be clean names (`Inter`, not the full CSS stack).

---

### Spacing — Semantic

```
spacing/component/xxs     →  {spacing/0.5} = 2px
spacing/component/xs      →  {spacing/1}   = 4px
spacing/component/xs-plus →  {spacing/1.5} = 6px
spacing/component/sm      →  {spacing/2}   = 8px
spacing/component/md      →  {spacing/3}   = 12px
spacing/component/lg      →  {spacing/4}   = 16px
spacing/component/xl      →  {spacing/6}   = 24px
spacing/component/2xl     →  {spacing/8}   = 32px

spacing/layout/xs      →  {spacing/4}   = 16px
spacing/layout/sm      →  {spacing/6}   = 24px
spacing/layout/md      →  {spacing/8}   = 32px
spacing/layout/lg      →  {spacing/12}  = 48px
spacing/layout/xl      →  {spacing/16}  = 64px
```

- Always use `spacing/component/*` for padding/gap INSIDE components — never primitive tokens
- Use `spacing/layout/*` for spacing BETWEEN components and page sections
- Never hardcode px values

---

### Layout — Semantic

**Flex vs Grid:**
- Flex = component internals (buttons, navbars, form rows, list items)
- Grid = page-level (dashboards, card grids, multi-column sections)
- Never mix: nav bar internal layout = flex, nav bar placement on page = grid

**Overflow:**
- `overflow-hidden` — clip (pair with `rounded-*`; never on containers with dropdowns/tooltips)
- `overflow-auto` — scroll (requires explicit `height` or `max-height`)
- `overflow-x-auto` — horizontal scroll (tables, code blocks)
- `overflow-y-auto` — vertical scroll (sidebars, list panels)
- **Scrollbar styling:** themed globally in `globals.css` (base layer). Thumb = `color/border/strong` (zinc/400 light · zinc/500 dark), transparent track, `radius/full`, 8px. Auto-switches in dark mode. Native OS scrollbars ignore tokens — never rely on them. Opt out per-element with `scrollbar-none` / `scrollbar-width: none` (e.g. calendar).

**Position:**
- `static` default · `relative` = positioning context for absolute children
- `absolute` = decorative overlays, badges, indicators only — never for layout
- `fixed` = global nav, FABs, Sonner toasts
- `sticky` = table headers, sidebar sections, in-page nav
- Never arbitrary `top`/`left` — use spacing tokens: `top-4`, `right-2`

---

### Opacity — Semantic

```
opacity/disabled → 60   (disabled form controls — cannot be used)
opacity/loading  → 50   (processing — will become active)
opacity/overlay  → 50   (modal backdrop scrim only — not modal content)
opacity/ghost    → 80   (interactive subtle elements)
opacity/active   → 80   (pressed/active state)
```

---

### Typography — Semantic

Defined as **Figma text styles** with hardcoded px line-heights. No `typography/` prefix.

```
display/lg  48px Bold  -1.5px  48lh    body/lg  18px Regular 0  29lh
display/md  36px SBold -1.5px  45lh    body/md  16px Regular 0  24lh
display/sm  30px Med   0       38lh    body/sm  14px Regular 0  21lh
                                        body/xs  12px Regular 0  18lh
heading/xl  24px SBold 0  33lh
heading/lg  20px SBold 0  28lh         label/lg 16px Medium  0  16lh
heading/md  18px SBold 0  25lh         label/md 14px Medium  0  14lh
heading/sm  16px SBold 0  22lh         label/sm 12px Medium  0  12lh
heading/xs  14px SBold 0  19lh
                                        code/md  14px RobotoMono 0  23lh
                                        code/sm  12px RobotoMono 0  20lh
```

**Figma text style IDs:** → see `figma-ids.md`

---

## Figma Variable Collections

```
Collection 1: Primitives  (mode: Value)
  → All raw values above

Collection 2: Semantics  (mode: Light / Dark)
  → Reference primitives only — never raw values
  → Every surface token must have a /foreground pair

Collection 3: Component tokens  (mode: Default — optional)
  → Component-specific overrides only
  → Alias Semantics — never alias primitives directly
```

Grid Styles and Z-Index are Figma-only (not variables). Z-index variables in Collection 1 are for code handoff only — in Figma, stacking = layer order.

---

## Collection 3 — Component Tokens (active)

### Button

| Token | Resolves to |
|---|---|
| `button/primary/bg/bg` | `color/brand/primary` |
| `button/primary/bg/hover` | `color/brand/primary-hover` |
| `button/primary/bg/active` | `color/brand/primary-active` |
| `button/primary/fg/fg` | `color/brand/primary/foreground` |
| `button/secondary/bg/bg` | `color/brand/secondary` |
| `button/secondary/bg/hover` | `color/brand/secondary-hover` |
| `button/secondary/bg/active` | `color/brand/secondary-active` |
| `button/secondary/fg/fg` | `color/brand/secondary/foreground` |
| `button/destructive/bg/bg` | `color/brand/destructive` |
| `button/destructive/bg/hover` | `color/brand/destructive-hover` → red/600 |
| `button/destructive/bg/active` | `color/brand/destructive-active` → red/700 |
| `button/destructive/fg/fg` | `color/brand/destructive/foreground` |
| `button/outline/bg/bg` | `color/background/default` |
| `button/outline/bg/hover` | `color/background/accent` |
| `button/outline/bg/active` | `color/background/accent` |
| `button/outline/fg/fg` | `color/background/default/foreground` |
| `button/outline/border/default` | `color/border/default` |
| `button/outline/border/hover` | `color/border/hover` |
| `button/outline/border/focus` | `color/ring` (direct alias) |
| `button/outline/border/active` | `color/border/strong` |
| `button/outline/border/disabled` | `color/border/disabled` |
| `button/ghost/bg/bg` | `color/background/default` (transparent) |
| `button/ghost/bg/hover` | `color/background/accent` |
| `button/ghost/bg/active` | `color/background/accent` |
| `button/ghost/fg/fg` | `color/background/default/foreground` |
| `button/link/fg/default` | `color/text/link` |
| `button/link/fg/hover` | `color/text/link-hover` |
| `button/link/fg/active` | `color/text/link-active` |
| `button/link/fg/disabled` | `color/text/disabled` |

**Button size tokens:**

| Token | Resolves to | Value | Notes |
|---|---|---|---|
| `button/size/Button radius 1` | `radius/xl` | 12px | Large / Icon Large |
| `button/size/Button radius 2` | `radius/base` | 8px | Small / Default / Icon S/D |
| `button/size/Button-height-small` | `spacing/9` | 36px | shadcn `sm` |
| `button/size/Button-height-default` | `spacing/10` | 40px | shadcn `default` |
| `button/size/Button-height-large` | `spacing/11` | 44px | shadcn `lg` — meets 44px |
| `button/size/Button spacing` | `spacing/component/xs` | 4px | Icon-to-label gap |
| `button/size/Button-padding-default` | `spacing/4` | 16px | Default / Large |
| `button/size/Button-padding-small` | `spacing/3` | 12px | Small |

### Badge

| Token | Resolves to | Value |
|---|---|---|
| `badge/Badge-height-small` | `spacing/4` | 16px |
| `badge/Badge-height-medium` | `spacing/5` | 20px |
| `badge/Badge-height-large` | `spacing/6` | 24px |

### Tooltip

| Token | Resolves to | Light value | Dark value | Notes |
|---|---|---|---|---|
| `tooltip/bg` | `color/background/inverted` | `#18181b` (zinc/900) | `#fafafa` (zinc/50) | Aliases semantic token — auto-inverts in dark mode |
| `tooltip/fg` | `color/background/inverted/foreground` | `#ffffff` | `#000000` | Paired foreground — auto-inverts with bg |

Aliases `color/background/inverted` — tooltip bg/fg auto-invert when the `.dark` class is applied. Light mode: dark bubble with white text. Dark mode: light bubble with black text. No component-level `dark:` override needed.

### Table

| Token | Resolves to | Value |
|---|---|---|
| `table/table-cell-compact` | `spacing/10` | 40px |
| `table/table-cell-default` | `spacing/12` | 48px |

---

## Figma Variable Type Rules

| Category | Figma type |
|---|---|
| Colors | Color |
| Spacing · radius · font size · font weight · opacity · motion duration | Number |
| Line height | Number (CSS reference only — do not bind to text styles) |
| Letter spacing | Number |
| Shadow · motion easing | String |
| Boolean toggle | Boolean |

---

## Component Naming in Figma

```
Main components  → kebab-case              button-group, input, field
Sub-components   → _ prefix + kebab-case  _button-group-separator
Variant names    → Property=Value          Orientation=Horizontal, State=Default
Internal layers  → lowercase-kebab        slot, field-start, footer, time-value
Frame names      → lowercase-kebab-case   button-primary, card-default
Layer names      → [role]/[element]        icon/leading, text/label, bg/fill
```

**Property naming:**
```
size → sm | md | lg | xl
variant → primary | secondary | ghost | destructive | outline
state → default | hover | focus | active | disabled | loading
intent → success | warning | danger | info
```

---

## Component-First Assembly Rule

If a matching component exists, use an instance — never build a raw frame that replicates it.

```
Need an interactive element?
  → Component exists? YES → instantiate, set variant props
                     NO  → raw frame + document why
```

Applies to: buttons, icon-buttons, inputs, toggles, checkboxes, badges, avatars.

Common violations: icon-button as plain frame → use `Button / Type=Ghost / Size=Icon`; divider as rectangle → use Separator; avatar circle → use Avatar component.

---

## Branding Slots — No Token Binding

Branding asset slots (logos, wordmarks) are exempt from all token binding rules. Only the **size** is constrained by the design system.

| Slot | Location | Size |
|---|---|---|
| `Logo` instance | `sidebar` header | 28 × 28px FIXED |

Do not bind tokens to branding slot fills or strokes. Do not flag unbound fills on branding slots.

---

## Container Component Rule

**Leaf component** — fixed internal structure, meaningful variants → build as component set.
Examples: `Input`, `Button`, `Badge`, `Avatar`, `Checkbox`, `Separator`

**Container component** — layout shell, children vary → build shell only + example frames.
Examples: `ButtonGroup`, `Field`, `Card`, `Dialog`, `Popover`, `Form`

**Rules for containers:**
- Never bake children into variants — variants describe container layout only (orientation, size, direction)
- Build the shell only — border, radius, layout mode, spacing, padding
- Build EXAMPLE FRAMES (not variants) for every composition
- Name examples clearly: `Example / With Input`, `Example / Separator`

**Variant vs Example:** If the doc gives a configuration a distinct name (Range Picker, Input, Date of Birth) → it's a **variant**. If children are truly variable → it's an **example frame**. Default to variants.

Common containers in shadcn/ui: `ButtonGroup Field FieldGroup Card Dialog Sheet Popover Tooltip Form InputGroup`

---

## Card Layout — Ground Rules

Cards are containers — we can't enumerate every possible card, so these rules let AI compose a *decent* card for any content without a catalog. Aligned with shadcn's Card model.

**Anatomy:** `Card > [CardHeader: CardTitle + optional action (right-aligned)] + CardContent + [CardFooter: actions]`. One title per card; one purpose per card.

**Padding — match density (the #1 thing to get right):**

| Card type | Padding | Token |
|---|---|---|
| Data · dashboard · KPI · form · list | **16px** | `spacing/component/lg` |
| Dense (sidebars, compact widgets) | 12px | `spacing/component/md` |
| Content · prose · feature/marketing | 24px | `spacing/component/xl` |

**Default to 16px.** 24px reads as "huge" on data-dense cards — reserve it for prose/feature cards. The `Card` component default is **16px** (`spacing/component/lg`) — override with `className="p-[var(--spacing-component-xl)]"` for prose/feature cards or `p-[var(--spacing-component-md)]` for dense ones.

**Spacing rhythm:** section gap inside a card = `spacing/component/lg` (16px); micro-gaps (label↔value, title↔description) = `spacing/component/xs` (4px). A grid of cards uses the **same gap as the card padding** (16px) so the whole page reads on one rhythm.

**Edge-to-edge children (tables, images, lists):** these should reach the card's edges, not float inside padding. Drop the horizontal padding on that child, *or* give the element its own border + radius so the card boundary frames it. Never leave a table floating with large padding and no border.

**Tokens (always semantic, never raw hex):** fill `color/surface/overlay` · border `color/border/default` · radius `radius/lg` · title `color/surface/overlay/foreground` · description `color/text/secondary`.

**For "decent by default":**
- One clear title; supporting copy in `CardDescription` (secondary color).
- Primary action right-aligned in the header **or** footer — not both.
- Split unrelated content into separate cards rather than one busy card.
- Cards stack/grid with consistent 16px gaps; align heights within a row.

---

## Anti-patterns — Never Do These

- ❌ `Blue` — not descriptive · `#3B82F6` — raw hex as name · `padding-16px` — value in name
- ❌ `MyButton/BG` — Pascal case for layers · `color-primary-button-hover-background` — too specific
- ❌ Skipping primitives — semantic tokens must reference primitives
- ❌ Hardcoding hex in semantic tokens · hardcoding radius px · defining surface without `/foreground` pair

---

## Token Descriptions — Anti-Hallucination Rules

AI does not hallucinate randomly — it hallucinates when context is missing. Every token description includes three things: what it is, when to use it, and explicitly when NOT to use it.

### Token description template

```
[Token name]
Intent:      What this token is designed for
Use when:    Specific UI contexts where this token applies
Do not use:  Contexts where this token looks similar but is wrong
Use instead: The correct token for those wrong contexts
Foreground:  The paired /foreground token (for surface tokens)
```

---

### Background tokens

```
color/background/default
Intent:      Page canvas background — the root surface of the application
Use when:    App root bg, main content area bg, page-level containers
Do not use:  Cards or component surfaces — use color/surface/default
Do not use:  Sidebar panel — use color/sidebar/background
Foreground:  color/background/default/foreground

color/background/default/foreground
Intent:      Primary text and icon color on the page canvas
Use when:    Body text, headings, default icons on color/background/default
Do not use:  Text on filled containers (buttons, badges) — use the container's /foreground token
Do not use:  Muted or secondary text — use color/text/secondary

color/background/subtle
Intent:      Near-invisible tint wash behind content — no foreground pair
Use when:    Subtle section backgrounds, highlight wash, zebra striping
Do not use:  As a container that needs readable text on top — it has no /foreground pair
Do not use:  Interactive hover states — use color/background/accent
Note:        No /foreground pair — intentional. This is a tint, not a filled surface.

color/background/muted
Intent:      Subdued surface, one step darker than the page canvas
Use when:    Disabled input backgrounds, table row alternates, empty state bg
Do not use:  Interactive hover — use color/background/accent
Do not use:  Cards or panels — use color/surface/default
Foreground:  color/background/muted/foreground

color/background/muted/foreground
Intent:      Text and icon color on muted surfaces
Use when:    Secondary labels, placeholder text, captions on color/background/muted
Do not use:  Primary body text — use color/background/default/foreground

color/background/inverted
Intent:      Dark background for high-contrast inverse surfaces
Use when:    Tooltips (dark variant), inline code, inverted banners
Do not use:  Primary page background — use color/background/default
Foreground:  color/background/inverted/foreground

color/background/inverted/foreground
Intent:      Text and icon on inverted (dark) surfaces
Use when:    Labels on color/background/inverted
Do not use:  On any light surface — contrast will fail

color/background/accent
Intent:      Interactive hover surface tint
Use when:    Ghost button hover, outline button hover, dropdown row hover, menu row hover
Do not use:  CTA button fills — use color/brand/primary
Do not use:  Active/selected nav items in sidebar — use color/sidebar/accent
Do not use:  Static backgrounds with no interaction
Foreground:  color/background/accent/foreground

color/background/accent/foreground
Intent:      Text and icon on interactive hover surfaces
Use when:    Labels and icons inside ghost/outline button hover states, hovered menu rows
Do not use:  On any surface other than color/background/accent
```

---

### Surface tokens

```
color/surface/default
Intent:      Component-level flat surface — cards, panels, content containers
Use when:    Card backgrounds, settings panels, list containers, flat sections
Do not use:  Page canvas — use color/background/default
Do not use:  Floating or elevated UI — use color/surface/overlay
Foreground:  color/surface/default/foreground

color/surface/default/foreground
Intent:      Text and icon on flat component surfaces
Use when:    Card body text, panel labels, list item text on color/surface/default
Do not use:  On floating elements — use color/surface/overlay/foreground

color/surface/raised
Intent:      Component surface with slight elevation — one step above default
Use when:    Raised cards, inline popovers, sticky headers that need subtle separation
Do not use:  Flat inline content — use color/surface/default
Do not use:  Fully floating UI (dropdowns, modals) — use color/surface/overlay
Foreground:  color/surface/raised/foreground

color/surface/raised/foreground
Intent:      Text and icon on raised surfaces
Use when:    Content on color/surface/raised
Do not use:  On overlay or flat surfaces

color/surface/muted
Intent:      Muted neutral component surface — not the page canvas, not a card, just a low-emphasis fill
Use when:    Avatar fallback circles, chips, subtle badge backgrounds, any component that needs a neutral tinted fill
Do not use:  Page-level muted sections — use color/background/muted
Foreground:  color/surface/muted/foreground

color/surface/muted/foreground
Intent:      Text and icons on a muted component surface
Use when:    Initials text inside avatar fallback, labels on chips or subtle badges
Do not use:  On any other surface — this pairs exclusively with color/surface/muted

color/surface/accent
Intent:      Low-emphasis component surface fill — used for subtle resting fills and hover states inside components
Use when:    Secondary badge fills, chip backgrounds, hover state of interactive rows (tab triggers, nav items, list rows)
Do not use:  Page-level sections — use color/background/accent for hover on page canvas elements
Do not use:  Active/selected states — use color/brand/primary or color/surface/raised
Foreground:  color/surface/accent/foreground

color/surface/accent/foreground
Intent:      Text and icons on an accent component surface
Use when:    Labels on secondary badges, text on chip fills, any content on color/surface/accent
Do not use:  On any other surface — pairs exclusively with color/surface/accent

color/surface/overlay
Intent:      Elevated floating surface — dropdowns and menus one step above cards
Use when:    Select dropdowns, combobox popups, date-picker calendars, popovers, command palettes, context menus
Do not use:  Dialogs, drawers — use color/surface/default (same elevation as cards; zinc/900 in dark)
Do not use:  Tooltips — use tooltip/bg (aliases color/background/inverted for auto-inversion)
Do not use:  Flat inline content or cards — use color/surface/default
Foreground:  color/surface/overlay/foreground

color/surface/overlay/foreground
Intent:      Text and icon on elevated floating surfaces
Use when:    Dropdown item labels, tooltip text, modal body text on color/surface/overlay
Do not use:  On any non-overlay surface
```

---

### Brand tokens

```
color/brand/primary
Intent:      Fill color for the primary action — the most important CTA
Use when:    Primary buttons, active states, key CTAs, selected toggles
Do not use:  Text color directly on light backgrounds — contrast may fail
Do not use:  Hover state — use color/brand/primary-hover
Use instead: color/text/link for inline text links
Foreground:  color/brand/primary/foreground

color/brand/primary/foreground
Intent:      Text and icon ON TOP of color/brand/primary fill
Use when:    Labels and icons inside primary buttons, filled primary badges
Do not use:  On any surface other than color/brand/primary
Use instead: color/background/default/foreground for text on neutral backgrounds

color/brand/primary-hover
Intent:      Primary button fill on hover — one step darker than primary
Use when:    Hover state of primary buttons and primary-filled elements only
Do not use:  Default state — use color/brand/primary
Do not use:  Active/pressed state — use color/brand/primary-active

color/brand/primary-active
Intent:      Primary button fill on press/active — two steps darker than primary
Use when:    Active/pressed state of primary buttons only
Do not use:  Default or hover state

color/brand/secondary
Intent:      Fill for secondary action elements — less prominent than primary
Use when:    Secondary buttons, secondary badges, less critical CTAs
Do not use:  Primary actions — use color/brand/primary
Foreground:  color/brand/secondary/foreground

color/brand/secondary/foreground
Intent:      Text and icon ON TOP of color/brand/secondary fill
Use when:    Labels inside secondary buttons or secondary-filled elements
Do not use:  On any surface other than color/brand/secondary

color/brand/secondary-hover
Intent:      Secondary button fill on hover — one step darker than secondary
Use when:    Hover state of secondary buttons and secondary-filled elements only
Do not use:  Default state — use color/brand/secondary
Do not use:  Active/pressed state — use color/brand/secondary-active

color/brand/secondary-active
Intent:      Secondary button fill on press/active — two steps darker than secondary
Use when:    Active/pressed state of secondary buttons only
Do not use:  Default or hover state

color/brand/destructive
Intent:      Fill for delete, remove, or permanently destructive actions
Use when:    Delete buttons, irreversible action CTAs, danger confirmation fills
Do not use:  Error state indicators or validation messages — use color/status/danger
Do not use:  Warning states — use color/status/warning
Foreground:  color/brand/destructive/foreground

color/brand/destructive/foreground
Intent:      Text and icon ON TOP of color/brand/destructive fill
Use when:    Labels inside destructive buttons
Do not use:  On any surface other than color/brand/destructive

color/brand/destructive-hover
Intent:      Destructive button fill on hover — one step darker than destructive (→ red/600)
Use when:    Hover state of destructive buttons only
Do not use:  Default state — use color/brand/destructive
Do not use:  Active/pressed state — use color/brand/destructive-active

color/brand/destructive-active
Intent:      Destructive button fill on press/active — two steps darker than destructive (→ red/700)
Use when:    Active/pressed state of destructive buttons only
Do not use:  Default or hover state
```

---

### Border tokens

```
color/border/subtle
Intent:      Near-invisible divider for low-emphasis separation
Use when:    Section dividers where a hard line would be too heavy, subtle table rules
Do not use:  Component borders that need to be clearly visible — use color/border/default

color/border/default
Intent:      Standard border for components and content areas
Use when:    Card borders, panel borders, section dividers, list separators
Do not use:  Input field borders — use color/input/border (intentionally one step darker)
Do not use:  Focus state — use color/border/focus

color/border/hover
Intent:      Border color on hover — slightly stronger than default
Use when:    Card or input border on hover state
Do not use:  Default (non-hovered) state — use color/border/default

color/border/strong
Intent:      High-emphasis border for active or selected states
Use when:    Active/selected input border, active/pressed button border
Do not use:  Default state borders — use color/border/default

color/border/focus
Intent:      Border color on keyboard focus — semantic alias of color/ring
Resolves to: color/ring → color/blue/500
Use when:    Generic interactive element border strokes on :focus (inputs, cards, custom components)
Do not use:  Inside button components — use the component token (button/outline/border/focus)
Note:        Direct alias of color/ring — same resolved value. Use whichever is most specific to the context.

color/border/disabled
Intent:      Border for disabled/inactive elements
Use when:    Disabled input borders, disabled button outlines
Do not use:  Default state borders — use color/border/default

color/border/error
Intent:      Border communicating a validation error
Use when:    Input border when field has an error, form control in invalid state
Do not use:  Warning state borders — use color/border/warning

color/border/success
Intent:      Border communicating a successful or valid state
Use when:    Input border when field passes validation, success confirmation borders
Do not use:  Info or neutral states

color/border/warning
Intent:      Border communicating a caution state
Use when:    Input border for cautionary validation, warning-state form controls
Do not use:  Error state borders — use color/border/error

color/input/bg
Intent:      Background fill for active (non-disabled) input-type components
Use when:    Text inputs, selects, textareas, comboboxes, search fields, date-pickers — any interactive input trigger
Do not use:  Disabled inputs — use color/surface/muted
Do not use:  Dropdown panels — use color/surface/overlay
Note:        White (#ffffff) in light mode · Zinc/700 (#3f3f46) in dark — intentionally lighter than color/surface/overlay (zinc/800) so inputs stand out from surrounding panels

color/input/border
Intent:      Input field boundary — intentionally one step darker than color/border/default
Use when:    Text inputs, selects, textareas, comboboxes, search fields
Do not use:  Non-input dividers — use color/border/default
Note:        Zinc/300 in light mode — the extra darkness helps define the input boundary clearly

color/input/placeholder
Intent:      Placeholder text color inside all input-type components
Use when:    The placeholder prop on inputs, selects, textareas, comboboxes, search fields
Do not use:  Actual typed content — use color/surface/default/foreground or color/background/default/foreground
Note:        Zinc/500 (#71717a) in light mode · Zinc/400 (#a1a1aa) in dark — lighter than default text to signal "not yet filled in"

color/ring
Intent:      Root focus color — the single semantic source for all focus ring strokes
Resolves to: color/blue/500
Use when:    Direct focus ring strokes on components (checkbox focus border, input ring, custom focus indicators)
Do not use:  Nothing — this is the canonical focus token. color/border/focus and button/outline/border/focus both alias this.
Note:        color/border/focus and button/outline/border/focus are direct aliases of color/ring. They all resolve to the same value — pick the most specific alias available for the context.
```

---

### Text tokens

```
color/text/secondary
Intent:      De-emphasised text — supporting content, not primary
Use when:    Subtitles, descriptions, metadata, timestamps, helper text
Do not use:  Primary body text — use color/background/default/foreground
Do not use:  Disabled text — use color/text/disabled

color/text/disabled
Intent:      Text on disabled elements — communicates "not interactive"
Use when:    Labels on disabled buttons, disabled input values, disabled form controls
Do not use:  Secondary or muted text that is still readable — use color/text/secondary
Do not use:  Placeholder text — use color/background/muted/foreground

color/text/invalid
Intent:      Error/invalid text rendered on a default (white/page) background
Use when:    Form field labels in Invalid state · alert title in Destructive variant · any primary error signal text sitting on color/background/default
Do not use:  Supporting context descriptions in Invalid state (Radio, Switch) — those stay color/text/secondary because they describe the option, not the error. Exception: Input/Textarea description IS the error message — both label and description use color/text/invalid there.
Do not use:  color/status/danger-subtle/foreground — that token is ONLY valid when the background is color/status/danger-subtle. Using it on a default background is a semantic mismatch that breaks in dark mode.
Do not use:  color/brand/destructive — that is a button fill, not a text color.
Alias:       Same primitive as color/border/error — red used consistently across borders and text in invalid context

color/text/warning
Intent:      Warning/cautionary text rendered on a default (white/page) background — no yellow surface behind it
Use when:    Form field labels in Warning state, any cautionary message text sitting on color/background/default
Do not use:  color/status/warning-subtle/foreground — only valid when the background is color/status/warning-subtle. If the surface is yellow, use that paired token instead.
Do not use:  color/yellow/* primitives — always reference a semantic token
Alias:       → color/yellow/700 (contrast-corrected — same step as color/icon/warning)

color/text/success
Intent:      Success/valid text rendered on a default (white/page) background — no green surface behind it
Use when:    Form field labels in Success/valid state, success confirmation text sitting on color/background/default
Do not use:  color/status/success-subtle/foreground — only valid when the background is color/status/success-subtle. If the surface is green-tinted, use that paired token instead.
Do not use:  color/green/* primitives — always reference a semantic token
Alias:       → color/green/700 (contrast-corrected — same step as color/icon/success)

color/text/inverse
Intent:      Text on dark/inverted surfaces
Use when:    Text on color/background/inverted, dark tooltips, dark banners
Do not use:  On light surfaces — contrast will fail

color/text/link
Intent:      Interactive link text color
Use when:    Inline text links, anchor tags, clickable text references
Do not use:  Button labels — use the button's /foreground token
Do not use:  Non-interactive text — use color/background/default/foreground

color/text/link-hover
Intent:      Link text color on hover — slightly darker or more saturated
Use when:    Hover state of color/text/link elements only
Do not use:  Default state links — use color/text/link

color/text/link-active
Intent:      Link text color on press/active
Use when:    Active/pressed state of color/text/link elements only
Do not use:  Default or hover state links
```

---

### Icon tokens

```
color/icon/default
Intent:      Standalone icon on the page canvas or light surface
Use when:    Decorative icons, leading icons in inputs, icons alongside body text
Do not use:  Icons inside filled containers (buttons, badges) — use the container's /foreground token
Do not use:  Disabled icons — use color/icon/disabled

color/icon/muted
Intent:      De-emphasised icon — secondary information, lower visual priority
Use when:    Supporting icons, trailing icons in less-important contexts
Do not use:  Primary action icons — use color/icon/default

color/icon/disabled
Intent:      Icon in a disabled or inactive state
Use when:    Icons inside disabled buttons, disabled inputs, disabled controls
Do not use:  Active icons — use color/icon/default

color/icon/inverse
Intent:      Icon on a dark or inverted background
Use when:    Icons on color/background/inverted, dark tooltips, inverted banners
Do not use:  On light backgrounds — contrast will fail

color/icon/brand
Intent:      Icon communicating a brand action or brand identity
Use when:    Brand-specific icons, icons that represent the primary CTA action
Do not use:  Status icons (error, success, warning) — use color/icon/danger etc.

color/icon/danger
Intent:      Icon communicating an error or destructive action
Use when:    Error state icons, delete/remove action icons, validation failure icons
Do not use:  Warning icons — use color/icon/warning
Do not use:  Inside filled destructive buttons — use color/brand/destructive/foreground

color/icon/success
Intent:      Icon communicating a successful or positive outcome
Use when:    Success confirmation icons, completed state icons, valid state icons
Do not use:  Info icons — use color/icon/default or color/icon/brand

color/icon/warning
Intent:      Icon communicating a cautionary or non-critical alert
Use when:    Warning state icons, approaching-limit indicators, optional review icons
Do not use:  Error icons — use color/icon/danger

color/icon/info
Intent:      Icon communicating informational or neutral-positive content
Use when:    Info alert icons, informational badge icons, help or guidance indicators
Do not use:  color/icon/brand — brand means "primary action", not "information". They resolve to similar blues but have distinct semantic intent.
Do not use:  color/icon/default — that is for generic standalone icons with no status meaning
Resolves to: color/blue/600 (one step darker than brand blue/500 — contrast-corrected for icon use)
```

---

### Status tokens

```
Pattern: each status token comes in 4 variants — `[status]` (solid fill), `[status]/foreground` (text/icon on solid), `[status]-subtle` (light tint), `[status]-subtle/foreground` (text on tint). Always use the paired foreground token on its matching background.

color/status/success / success/foreground / success-subtle / success-subtle/foreground
Intent:      Positive, completed, or healthy states
Use when:    Success alert bg, success badge fill, success row highlights
Do not use:  Brand/primary actions — use color/brand/primary

color/status/warning / warning/foreground / warning-subtle / warning-subtle/foreground
Intent:      Cautionary, non-critical states that need attention
Use when:    Warning alert bg, warning badge fill, approaching-limit indicators
Do not use:  Error or failure states — use color/status/danger
Note:        warning/foreground uses zinc/900 (dark text) — yellow fails WCAG with white

color/status/danger / danger/foreground / danger-subtle / danger-subtle/foreground
Intent:      Errors, failures, and validation problems
Use when:    Error alert bg (danger or danger-subtle), error badge fill, status indicator bg
Do not use:  Destructive action buttons — use color/brand/destructive
Do not use:  Cautionary non-error states — use color/status/warning
Do not use:  danger-subtle/foreground on a default/white background — that foreground is only valid ON a danger-subtle surface. For error text on a default background use color/text/invalid.

color/status/info / info/foreground / info-subtle / info-subtle/foreground
Intent:      Informational, neutral-positive, or in-progress messages
Use when:    Info alert bg, informational badge fill, neutral callout bg
Do not use:  Success, warning, or error states — use the appropriate status token

color/status/offline / offline/foreground
Intent:      User or entity offline / inactive / unavailable presence state
Resolves to: color/zinc/200 (offline fill) · color/zinc/900 (offline foreground)
Use when:    Offline presence dot in avatar-indicator, Offline badge variant, any UI element communicating that a user or entity is not currently available
Do not use:  color/status/danger — offline is a neutral unavailable state, not an error
Do not use:  color/background/muted — that is a page-level surface token; offline is scoped to status communication
Foreground:  color/status/offline/foreground (dark text/icon on the offline fill)
Note:        Does not follow the 4-variant pattern (no offline-subtle). The offline state needs only a solid indicator — a subtle tint variant would be too low-contrast to communicate presence state clearly.
```

---

### Sidebar tokens

```
All sidebar tokens are scoped to the sidebar component only — never use outside it.

color/sidebar/background + color/sidebar/foreground
Intent:      Sidebar panel bg + default text/icon for inactive elements
Use when:    Panel bg, header/footer zone, inactive nav labels, group section labels
Do not use:  background for main content area (use color/background/default); foreground for text on accent/primary fills (use paired /foreground)

color/sidebar/primary + color/sidebar/primary/foreground
Intent:      Workspace/brand logo block background + icon/initials on it
Use when:    The team switcher icon square in the sidebar header only
Do not use:  Active nav item background — that is color/sidebar/accent
Do not use:  Any nav row, list item, or button background

color/sidebar/accent + color/sidebar/accent/foreground
Intent:      Active nav item fill AND hover fill + text/icon on those states
Use when:    Currently selected nav row bg, hovered nav row bg, labels/icons inside those rows
Do not use:  The workspace logo block (use color/sidebar/primary); outside sidebar (use color/background/accent)
Do not use:  Default unselected nav text — use color/sidebar/foreground

color/sidebar/border
Intent:      Sidebar edge divider and internal section separators
Use when:    Right border of the sidebar panel, dividers between sidebar content groups
Do not use:  Content area borders — use color/border/default

color/sidebar/ring
Intent:      Focus ring for elements inside the sidebar
Use when:    Keyboard focus on sidebar nav items, sidebar buttons, sidebar inputs
Do not use:  Focus rings outside the sidebar — use color/ring
```

---

### Icon color rule

| Container background | Icon token |
|---|---|
| `color/brand/primary` | `color/brand/primary/foreground` |
| `color/brand/destructive` | `color/brand/destructive/foreground` |
| `color/background/accent` | `color/background/accent/foreground` |
| `color/sidebar/accent` | `color/sidebar/accent/foreground` |
| `color/status/danger` | `color/status/danger/foreground` |
| No fill (ghost, link, plain) | `color/icon/default` or `color/text/link` |

**Paired icon rule (leading/inline icon + label = one unit):** an icon sitting next to a label inside an interactive element — **tab, breadcrumb item, menu item, button, list row** — must **track the label's foreground token for every state** (the CSS `currentColor` model). They move together: if the label is `color/text/secondary` at rest and `color/surface/default/foreground` when active, the icon's stroke matches at each state. **Never give a paired icon a fixed `color/icon/*`** — it won't follow hover/active and breaks the "one unit" reading.

**When to use `color/icon/*` instead:** only for **standalone** icons whose color is set by their *own* role, not by an adjacent label — e.g. the leading search icon in an input field, status icons in an alert (`color/icon/danger` etc.), decorative icons beside body copy. Note `color/icon/default` resolves to **full foreground strength** (zinc/900 light), not a muted tone — for a muted standalone icon use `color/icon/muted`.

---

### Chart tokens

`color/chart/1–5` · Data series colors (coral, teal, dark teal, gold, peach) · ❌ UI status, brand, or surface fills · Alias chart primitives, not semantic colors.

---

### Opacity tokens

```
opacity/disabled  (0.6)
Intent:      Visual treatment for elements that cannot be interacted with
Use when:    Disabled buttons, disabled inputs, disabled form controls
Do not use:  Loading states — use opacity/loading
Do not use:  Ghost/subtle interactive elements — use opacity/ghost

opacity/loading  (0.5)
Intent:      Visual treatment for elements temporarily processing
Use when:    Buttons in loading state, skeleton shimmer overlays, processing indicators
Do not use:  Disabled elements — use opacity/disabled (loading will become active; disabled will not)

opacity/overlay  (0.5)
Intent:      Modal backdrop scrim opacity
Use when:    The dark overlay element behind modals, drawers, and dialogs
Do not use:  The modal content itself — only the backdrop element

opacity/ghost  (0.8)
Intent:      Subtle interactive element that is still fully functional
Use when:    Ghost buttons in their default state, subtle icon buttons
Do not use:  Disabled or loading states — those use their own tokens

opacity/active  (0.8)
Intent:      Visual treatment for interactive elements in a pressed or active state
Use when:    Active/pressed state of ghost buttons, icon buttons, and interactive elements where visual feedback is shown via opacity rather than color change
Do not use:  Disabled states — use opacity/disabled
Do not use:  Default or hover states — no opacity reduction needed there
```

---

## Deprecated Tokens — Required Documentation

If AI cannot see that a token is deprecated, it will use it confidently.

**Format:**
```
[Token name] ← DEPRECATED
Status: deprecated · Deprecated: [date] · Reason: [why]
Replaced by: [new token] · Migration: [old] → [new]
```

**Examples:**
```
color/brand/accent ← DEPRECATED (2025)
Replaced by: color/background/accent (+ /foreground)
Reason: Moved to background group — accent is an interactive surface, not a brand color

color/background/card ← DEPRECATED (v2.0)
Replaced by: color/surface/default
Reason: Consolidated into surface layer
```

---

## Dark Mode in Code

### How dark mode is activated

Dark mode is triggered by adding the `.dark` class to a parent element (typically `<html>`). This variant is configured in `src/app/globals.css`:

```css
@custom-variant dark (&:is(.dark *));
```

This tells Tailwind v4 that any `dark:` utility applies when the element is a descendant of `.dark`. Toggling `.dark` on `<html>` switches the entire app.

### Token overrides — `tokens.css`

All dark mode token values live in a `.dark {}` block appended to `src/app/tokens.css`, after the `:root {}` light-mode block. The Style Dictionary build (`node sd.build.mjs`) outputs **light-mode only** — the `.dark` block is **generated from the Figma Semantics + Components "Dark" mode** (the source of truth), not hand-authored. Only tokens whose dark value differs from light are overridden; the rest inherit `:root`. Component tokens (`--button-*`, `--tooltip-*`) need explicit dark overrides because SD emits resolved hex (no `var()` cascade). To regenerate: pull each token's Dark-mode value from Figma via figma-cli and rewrite the block.

Zinc elevation hierarchy in dark mode:

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-background-default` | #ffffff | #09090b (zinc/950) | Page canvas |
| `--color-surface-default` | #ffffff | #18181b (zinc/900) | Cards · dialogs · drawers |
| `--color-surface-overlay` | #ffffff | #27272a (zinc/800) | Dropdowns · popovers · menus |
| `--color-surface-muted` | #f4f4f5 | #27272a (zinc/800) | Disabled input fills |
| `--color-input-bg` | #ffffff | #3f3f46 (zinc/700) | Active input backgrounds |
| `--color-background-inverted` | #18181b | #fafafa (zinc/50) | Tooltip bg (auto-inverts) |
| `--color-input-border` | #d4d4d8 | #52525b (zinc/600) | Input field border |
| `--color-border-default` | #e4e4e7 | #3f3f46 (zinc/700) | Standard borders |
| `--color-border-disabled` | #e4e4e7 | #3f3f46 (zinc/700) | Disabled element borders |
| `--color-input-placeholder` | #71717a (zinc/500) | #a1a1aa (zinc/400) | Placeholder text |

### Tooltip auto-inversion

`tooltip/bg` aliases `color/background/inverted`. In light mode that's zinc/900 (dark bubble). In `.dark`, `color/background/inverted` is overridden to zinc/50 (light bubble). No component-level `dark:` class needed — the semantic alias cascades automatically.

### Adding new dark values

When a new semantic token needs a dark-mode override:
1. Add the light value to `:root {}` in `tokens.css` (and to `semantics.tokens.json` for SD)
2. Add the corresponding dark value to `.dark {}` in `tokens.css`
3. Re-export from Figma and run `node sd.build.mjs` to sync `output/css/variables.css` (light-mode only output)

---

## Icon Descriptions — Anti-Hallucination Rules

Icon name ≠ visual appearance. AI matches by name — ambiguous names produce wrong icons.

**Template:**
```
[Icon name]
Visual: literal shapes · Represents: concept/action
Use when: UI context · Do not use: similar wrong context
```

### Icon Placeholder — Stroke-Based Color Rule

`Icon Placeholder` — all icons are stroke-based (VECTOR/ELLIPSE nodes). Node ID → see `Machine Readable/figma-ids.md`.

**Apply color:**
1. Instance frame fill → **empty** (fill blocks the icon)
2. `findAll` VECTOR and ELLIPSE nodes inside
3. Rebind `strokes` via `setBoundVariableForPaint`

❌ Never set `instance.fills` · ❌ Never set `fills` on Vector nodes · ❌ Never hardcode hex strokes

```javascript
const strokeNodes = instance.findAll(n =>
  (n.type === 'VECTOR' || n.type === 'ELLIPSE') && n.strokes?.length > 0
);
for (const node of strokeNodes) {
  node.strokes = [figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }, 'color', fgVar
  )];
}
```

### Commonly Confused Icons

```
icon/font-style   → two letter A's (serif + cursive) · font family pickers
                    ❌ text formatting — use icon/text-format

icon/text-format  → letter A with underline/italic/bold indicators · text formatting toolbars
                    ❌ font family — use icon/font-style

icon/text-size    → two letter A's at different sizes · font size controls
                    ❌ style/format — use icon/font-style or icon/text-format
```

---

## Quick Reference

### Colors
| Tailwind | Figma variable |
|---|---|
| `bg-primary` | `color/brand/primary` |
| `text-primary-foreground` | `color/brand/primary/foreground` |
| `bg-destructive` | `color/brand/destructive` |
| `bg-accent` | `color/background/accent` |
| `text-accent-foreground` | `color/background/accent/foreground` |
| `bg-background` | `color/background/default` |
| `text-foreground` | `color/background/default/foreground` |
| `bg-muted` | `color/background/muted` |
| `text-muted-foreground` | `color/background/muted/foreground` |
| `ring` | `color/ring` |
| `disabled:opacity-60` | `opacity/disabled` (60) |

### Typography
| Tailwind | Figma | Value |
|---|---|---|
| `text-sm` | `font-size/sm` | 14px |
| `text-base` | `font-size/base` | 16px |
| `font-medium` | `font-weight/medium` | 500 |

### Spacing
| Tailwind | Figma | Value |
|---|---|---|
| `p-4` | `spacing/4` | 16px |
| `gap-2` | `spacing/2` | 8px |
| `gap-4` | `spacing/4` | 16px |
| `px-3 py-2` | `spacing/component/md + sm` | 12px + 8px |

### Radius · Layout · Z-Index
| Tailwind | Figma | Value |
|---|---|---|
| `rounded-lg` | `radius/lg` | 8px |
| `rounded-full` | `radius/full` | 9999px |
| `container mx-auto` | `layout/container/max-width` | 1400px |
| `grid grid-cols-12` | `Grid/Desktop` | 12 col · 24px gutter · 80px margin |
| `grid grid-cols-8` | `Grid/Tablet` | 8 col · 24px gutter · 32px margin |
| `grid grid-cols-4` | `Grid/Mobile` | 4 col · 16px gutter · 16px margin |
| `z-0/10/20/30/40/50/[60]` | base/raised/dropdown/sticky/overlay/modal/toast | — |

### Breakpoints
`sm: 640px · md: 768px · lg: 1024px (primary switch) · xl: 1280px · 2xl: 1536px`

---

## Accessibility

### Touch Target

Minimum **44 × 44px** (WCAG 2.5.5 AAA). Visual size may be smaller — add invisible padding in code: `min-h-[44px] min-w-[44px]`.

| Component | Visual | Meets 44px? |
|---|---|---|
| Button Large / Icon Large | 44px | ✅ |
| Button Medium / Icon Medium | 40px | ⚠️ pad 4px |
| Button Small / Icon Small | 36px | ⚠️ pad 8px |
| Checkbox box | 16px | ⚠️ pad full row |
| Close/dismiss icons | ~24px | ⚠️ must pad |

In Figma: annotate the touch area — do not visually represent it.

### Focus Indicator

Required on every focusable component (WCAG 2.4.7). Never remove for aesthetic reasons.

| Property | Value |
|---|---|
| Token | `color/ring` (blue/500) |
| Weight | **2px** (fixed — no token) |
| Alignment | **Outside** |

| Context | Token |
|---|---|
| General interactive elements | `color/ring` |
| Outline button border on focus | `button/outline/border/focus` |
| Input border on focus | `color/border/focus` |
| Sidebar elements | `color/sidebar/ring` |

Exception: Destructive button uses `focus/destructive` effect style, not the ring stroke.

### Contrast Reference (light mode)

WCAG thresholds: AA text 4.5:1 · AA large/UI 3:1 · AAA 7:1

| Token pair | Hex (bg/fg) | Ratio | AA text | UI/Large | AAA |
|---|---|---|---|---|---|
| `background/default → default/foreground` | #fff/#18181b | 17.7 | ✅ | ✅ | ✅ |
| `background/muted → muted/foreground` | #f4f4f5/#71717a | **4.4** | ⚠️ | ✅ | ❌ |
| `background/inverted → inverted/foreground` | #18181b/#fff | 17.7 | ✅ | ✅ | ✅ |
| `background/accent → accent/foreground` | #f4f4f5/#18181b | 16.1 | ✅ | ✅ | ✅ |
| `surface/default → default/foreground` | #fff/#18181b | 17.7 | ✅ | ✅ | ✅ |
| `surface/raised → raised/foreground` | #fafafa/#18181b | 17.0 | ✅ | ✅ | ✅ |
| `surface/overlay → overlay/foreground` | #fff/#18181b | 17.7 | ✅ | ✅ | ✅ |
| `brand/primary → primary/foreground` | #2b7fff/#fff | **3.8** | ❌ | ✅ | ❌ |
| `brand/secondary → secondary/foreground` | #dbeafe/#1447e6 | 5.6 | ✅ | ✅ | ❌ |
| `brand/destructive → destructive/foreground` | #ef4444/#fff | **3.8** | ❌ | ✅ | ❌ |
| `status/success → success/foreground` | #22c55e/#18181b | 7.8 | ✅ | ✅ | ✅ |
| `status/warning → warning/foreground` | #eab308/#18181b | 9.2 | ✅ | ✅ | ✅ |
| `status/danger → danger/foreground` | #ef4444/#fff | **3.8** | ❌ | ✅ | ❌ |
| `status/info → info/foreground` | #2b7fff/#fff | **3.8** | ❌ | ✅ | ❌ |
| `status/success-subtle → subtle/foreground` | #f0fdf4/#15803d | 4.8 | ✅ | ✅ | ❌ |
| `status/warning-subtle → subtle/foreground` | #fefce8/#a16207 | 4.8 | ✅ | ✅ | ❌ |
| `status/danger-subtle → subtle/foreground` | #fef2f2/#b91c1c | 5.9 | ✅ | ✅ | ❌ |
| `status/info-subtle → subtle/foreground` | #eef6ff/#1447e6 | 6.3 | ✅ | ✅ | ❌ |
| `sidebar/background → sidebar/foreground` | #fafafa/#3f3f46 | 10.0 | ✅ | ✅ | ✅ |
| `sidebar/accent → accent/foreground` | #f4f4f5/#18181b | 16.1 | ✅ | ✅ | ✅ |
| `background/default + text/secondary` | #fff/#52525b | 7.7 | ✅ | ✅ | ✅ |
| `background/default + text/disabled` | #fff/#a1a1aa | 2.6 | — | — | — |

**Known failures — accepted constraints:**

- **`background/muted/foreground` (4.4:1)** — misses AA by 0.1. Use only for supporting text at 16px+. Avoid for body copy.
- **`brand/primary`, `brand/destructive` (3.8:1)** — pass UI component threshold (3:1). Button label text at 14px technically needs 4.5:1. Accepted as brand palette constraint — do not use these fills for small body text outside buttons.
- **`status/danger`, `status/info` (3.8:1)** — pass for UI components. For text content, use the `*-subtle` pair.
- **`color/icon/success`, `color/icon/warning`** — remapped to green/700 and yellow/700. Standalone status icons on light bg now pass AA (5.0:1 and 4.9:1). Solid fill tokens remain at /500 for badge/alert backgrounds.
- **`text/disabled` (2.6:1)** — intentionally non-compliant. Disabled elements are exempt from WCAG 1.4.3.

---

## For AI Handoff

Include:
1. This file as `design-system-rules.md`
2. Exported variables JSON from Figma
3. Icon descriptions file (visual + do-not-use per icon)
4. Note: _"All spacing uses Tailwind's 4px base unit. Semantic tokens always reference primitives — never hardcode hex. Brand primary is always /500. Every surface token has a /foreground pair (exception: color/background/subtle is a tint, no foreground). Radius scale is relative to radius/base. Line-height variables are CSS reference only — text styles use direct px values. Standalone icons use color/icon/*; icons in filled containers use the container's /foreground. color/brand/destructive ≠ color/status/danger. color/ring is the root focus color (blue/500) — color/border/focus and button/outline/border/focus are direct aliases. Chart, sidebar, opacity tokens are scoped. Font-family values must be clean names (Inter, not a full CSS stack). Deprecated tokens are marked — always check. Flex for component layout, Grid for page layout. 1440px Figma = xl: in Tailwind. 80px Figma margin = visual guide, not CSS. z-index always uses named tokens."_
5. Ensure `tailwind.config.js` has exact custom hex values from the Primitive layer.
