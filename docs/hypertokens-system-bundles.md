# Hypertokens in Agentic Design System

**Bundles of semantic decisions that always travel together.**

Your system has hypertokens across three categories: colors, spacing, and typography. Each bundle pairs multiple decisions under one name so they can't drift apart.

---

## Color Bundles

### Background Layer (page canvas)

| Bundle name           | Fill           | Foreground     | Intent                                 |
| --------------------- | -------------- | -------------- | -------------------------------------- |
| `background.default`  | color/white    | color/zinc/900 | Page background + primary text         |
| `background.subtle`   | color/zinc/50  | color/zinc/900 | Alternating sections, hover rows       |
| `background.muted`    | color/zinc/100 | color/zinc/500 | Disabled inputs, skeleton, code blocks |
| `background.inverted` | color/zinc/900 | color/white    | Dark hero sections, inverted banners   |
| `background.accent`   | color/zinc/100 | color/zinc/900 | Ghost button hover, sidebar hover      |
|                       |                |                |                                        |

### Surface Layer (cards, panels, modals)

| Bundle name       | Fill           | Border               | Foreground     | Intent                            |
| ----------------- | -------------- | -------------------- | -------------- | --------------------------------- |
| `surface.default` | color/white    | color/border/default | color/zinc/900 | Standard card, flat container     |
| `surface.raised`  | color/white    | color/border/default | color/zinc/900 | Slightly elevated card/panel      |
| `surface.overlay` | color/zinc/900 | —                    | color/white    | Dropdown, modal backdrop, tooltip |
| `surface.muted`   | color/zinc/50  | color/border/subtle  | color/zinc/900 | Secondary panel, sidebar bg       |
| `surface.accent`  | color/zinc/100 | color/border/strong  | color/zinc/900 | Hover card, selected list item    |

### Brand Layer (actions, CTAs)

| Bundle name             | Fill           | Foreground     | Intent                                 |
| ----------------------- | -------------- | -------------- | -------------------------------------- |
| `brand.primary`         | color/blue/500 | color/white    | Primary button, active toggle, key CTA |
| `brand.primary-hover`   | color/blue/600 | color/white    | Hover state on primary                 |
| `brand.secondary`       | color/blue/50  | color/blue/700 | Secondary action, light brand surface  |
| `brand.secondary-hover` | color/blue/100 | color/blue/700 | Hover on secondary                     |
| `brand.destructive`     | color/red/500  | color/white    | Delete, remove, stop action            |

### Border Bundle (state-paired)

| State | Value | Intent |
|---|---|---|
| `border.default` | color/zinc/200 | Input at rest, checkbox outline, card border |
| `border.hover` | color/zinc/300 | Input on hover, interactive element hover |
| `border.focus` | color/ring | Focus ring (keyboard a11y) |
| `border.error` | color/red/500 | Form validation failure |
| `border.success` | color/green/700 | Validation success |
| `border.warning` | color/yellow/700 | Caution (not failure) |
| `border.disabled` | color/zinc/100 | Disabled input border |

### Text Bundles (supporting + semantic)

| Bundle name | Value | Intent |
|---|---|---|
| `text.primary` | color/zinc/900 | Primary body text (paired with background/default/foreground) |
| `text.secondary` | color/zinc/600 | Captions, metadata, timestamps, helper |
| `text.disabled` | color/zinc/400 | Disabled labels, unavailable menu items |
| `text.inverse` | color/white | Text on dark surfaces |
| `text.link` → `text.link-hover` | color/blue/500 → color/blue/600 | Inline links (always paired) |
| `text.invalid` | color/red/500 | Form field validation error text |

---

## Spacing Bundles

### Component-level spacing (always used together)

| Bundle                 | Y padding                  | X padding                   | Gap                         | Intent                                 |
| ---------------------- | -------------------------- | --------------------------- | --------------------------- | -------------------------------------- |
| **input.spacing**      | spacing/component/xs (4px) | spacing/component/md (12px) | spacing/component/sm (8px)  | Input field padding + internal gaps    |
| **button.spacing**     | spacing/component/xs (4px) | spacing/component/md (12px) | spacing/component/sm (8px)  | Button padding + icon/text gap         |
| **badge.spacing**      | spacing/component/xs (4px) | spacing/component/sm (8px)  | spacing/component/xs (4px)  | Badge padding + icon gap               |
| **card.spacing**       | —                          | —                           | spacing/component/lg (16px) | Card padding + content gap             |
| **form-group.spacing** | —                          | —                           | spacing/component/sm (8px)  | Label-to-input gap, field-to-field gap |

### Spacing hierarchy (tokens themselves bundle different sizes)

```
spacing/component/xxs  = 2px   (internal dot spacing, dot gaps)
spacing/component/xs   = 4px   (tight internal gaps, small padding)
spacing/component/sm   = 8px   (standard padding, control gaps, field spacing)
spacing/component/md   = 12px  (input/button padding, icon spacing)
spacing/component/lg   = 16px  (card padding, section gaps)
spacing/component/xl   = 24px  (page margin, large sections)
spacing/component/2xl  = 32px  (hero spacing)
```

**These are hypertokens too** — `spacing/component/sm` represents "all the places where 8px is the right choice" — you use one token, not scattered 8px values.

---

## Typography Bundles (implicit)

Your system uses Tailwind typography classes, but the pattern bundles are:

| Style | Font | Size | Weight | Line-height | Use |
|---|---|---|---|---|---|
| `heading/lg` | Inter | 32px | 600 | 1.2 | Page title |
| `heading/md` | Inter | 24px | 600 | 1.3 | Section title |
| `heading/sm` | Inter | 18px | 600 | 1.3 | Subsection title |
| `body/default` | Inter | 16px | 400 | 1.5 | Body text |
| `body/small` | Inter | 14px | 400 | 1.5 | Secondary text |
| `label/md` | Inter | 14px | 500 | 1 | Form labels |
| `label/sm` | Inter | 12px | 500 | 1 | Badge text, small labels |

*(These are implicit — not yet explicitly bundled in tokens.json, but your Tailwind classes enforce the pattern.)*

---

## How Bundles Work in Your System

### Example: Input component

When a developer or agent needs to build an input, they don't pick tokens individually:

**❌ Wrong (picking individually):**
```
Input padding: spacing/component/xs
Input gap: spacing/component/sm
Description gap: spacing/component/xs
Border: color/border/default
Fill: color/background/default
Text: color/background/default/foreground
```

**✅ Right (reading the bundle):**
```
Use input.spacing bundle: { py: xs, px: md, gap: sm }
Use background.default bundle: { fill: white, fg: zinc-900 }
Use border.default: color/zinc/200
```

The bundle makes it clear: "these three spacings always go together," and "fill + foreground always pair."

---

## Source of Truth

Each bundle has a canonical location:

| Bundle type | Source | How to update |
|---|---|---|
| Color bundles | `Tokens/semantics.tokens.json` | Edit the JSON → re-export from Figma |
| Spacing bundles | Component `meta.json` + `Component Markdown/` | Edit meta.json, then update component docs |
| Typography bundles | Tailwind config + `agentic-design-system.md` | Update Tailwind utilities, document in design system |

**Current state:** Bundles are **documented** in meta.json and tokens.json, but the source of truth for actual values is still Figma (for colors) or the built component (for spacing).

**Hypertoken-first approach would be:** Define bundles in a canonical schema first, then compile everything (Figma styles, CSS classes, meta.json, component code) FROM that one source. Single change = everything updates.

---

## Why This Matters for Agents

An AI agent reading your system can:

**Without bundles:**
```
Agent sees: "fill color is white, foreground is zinc-900, border is zinc-200"
Agent guesses: "are these related? are they always used together?"
Agent might miss: the pairing rules, the semantic intent
```

**With named bundles:**
```
Agent sees: "use background.default bundle" 
Agent knows: fill + foreground always pair, they're semantic (mode-aware in dark mode)
Agent builds: exactly what you specified
```

Bundles = **less guessing, more precision.**

---

## Next Steps (Hypertoken optimization)

To make your bundles more like Figma's vision:

1. **Extract all bundles into a canonical schema** (currently scattered across tokens.json and meta.json)
2. **Name bundles explicitly** for colors (already done) and spacing (partially done)
3. **Make compilation deterministic** — one source (the bundle schema) → outputs everything (CSS, Figma variables, meta.json)
4. **Validate that bundles stay together** — drift-check already does this for tokens; could extend to spacing bundles

This is the path from "well-documented system" to "hypertokens-first system."
