#theme #design-system #tokens #accura

# Accura — Theme Reference

Accura is a **re-theme of the Agentic Design System**, not a fork of its rules.

- **Rules** — naming conventions, semantic layer, paired-surface rule, spacing scale, layout, dark mode — are inherited **unchanged** from `agentic-design-system.md`. Do not duplicate or restate them here.
- **Values** — the tokens below — are what makes Accura look like Accura. This file is the Accura equivalent of `agentic-theme.md`.

> A theme = **{ brand ramp · neutral ramp · radius base · spacing base · type ratio }**

Because the semantic and component tiers **alias** primitives, editing the primitive layer re-themes everything downstream with no semantic edits.

**Figma source:** `[Accura] Agentic Design System`
Primitives `VariableCollectionId:1:2` (mode: Value) · Semantics `1:129` (Light/Dark) · Components `17:4484` (Light)
228 primitives local / 190 published · 114 semantics local / 113 published · 45 component tokens · 17 text styles

**Code:** `accura-ui/` — Storybook on **port 6007** (Agentic's runs on 6006, so both can run side by side).

---

## Theme at a glance

| Lever | Agentic | **Accura** | Changed? |
|---|---|---|---|
| **Brand hue** | Blue — anchor `/500` `#2b7fff` | **Green — anchor `/800-base` `#008852`** | ✅ **changed** |
| **Neutral** | Zinc `/50–/950` | Zinc `/50–/950` — identical hexes | — |
| **Radius base** | `8px` | `8px` | — |
| **Spacing base** | `4px` linear | `4px` linear | — |
| **Type** | Inter | Figma: **SF Pro** · Code: **Inter** | ⚠️ **split — see §6** |

Two of the five primitive levers moved. But the primitive layer is not the whole story — Accura also diverges at the **semantic and component tiers** (sidebar, status borders, button radius). Those are in §7 and are easy to miss, because a primitives-only comparison shows them as unchanged.

---

## 1. Brand ramp — Green

**Anchor = `/800-base` = `#008852`.** This is the deliberate deviation from Agentic's `/500` rule.

| Step | Hex | Role |
|---|---|---|
| 25 | `#f0faf4` | extra step — lightest wash |
| 50 | `#e6f7ee` | secondary button hover |
| 100 | `#c3ead5` | secondary button fill |
| 150-lightshade | `#b5e5d1` | `brand/secondary` |
| 200 | `#9cddbb` | secondary active |
| 300 | `#70d1a0` | primary-active (dark mode) |
| 400 | `#4bc68b` | primary-hover (dark mode) |
| 500 | `#17bb77` | **`color/ring`** · focus border · brand/primary (dark) |
| 600 | `#0dac6c` | |
| 700 | `#00995e` | link hover (dark) |
| **800-base** | **`#008852`** | **brand/primary · anchor** |
| 900 | `#175e41` | primary-hover (light) |
| 950-darkshade | `#00393f` | primary-active · **sidebar background** |
| 975 | `#0f172a` | ⚠️ slate, not green — see Q2 |

### Why the anchor moved to /800

`agentic-theme.md` defines the acceptance test for a brand anchor — measure against white, then:

- **≥ 4.5:1** → ✅ perfect — fill *and* small text
- **3:1 – 4.5:1** → ⚠️ fill only, bump to a darker step for text/icons
- **< 3:1** → ❌ reject

| Candidate | Hex | vs white | Verdict |
|---|---|---|---|
| `brand/500` | `#17bb77` | **2.50:1** | ❌ **reject** — below the 3:1 hard floor |
| `brand/700` | `#00995e` | **3.67:1** | ⚠️ fill only |
| **`brand/800-base`** | **`#008852`** | **4.59:1** | ✅ **perfect — fill + small text** |
| `brand/900` | `#175e41` | **7.74:1** | ✅ AAA |

Green is intrinsically lighter than blue at the same ramp step, so `/500` cannot clear the floor. Anchoring at `/800` is **the rule being applied correctly, not broken.**

**Consequence — Accura needs no fill-vs-text split.** Agentic must remap `color/text/link` and `color/icon/info` to `blue/600` because `blue/500` (3.8:1) fails as text. Accura's anchor already clears 4.5:1, so the brand colour is safe as fill *and* text. Use `/900` where AAA is required.

---

## 2. Neutral ramp — Zinc

**Unchanged from Agentic.** Identical hexes, identical roles.

| Step | Hex | Role (light · dark) |
|---|---|---|
| 50 | `#fafafa` | surface/raised · **sidebar foreground** · inverted (dark) |
| 100 | `#f4f4f5` | background/muted · accent |
| 200 | `#e4e4e7` | border/default |
| 300 | `#d4d4d8` | input/border |
| 400 | `#a1a1aa` | text/disabled · placeholder (dark) |
| 500 | `#71717a` | text/secondary · text/tertiary · placeholder (light) |
| 600 | `#52525b` | input/border (dark) |
| 700 | `#3f3f46` | input/bg (dark) · border (dark) |
| 800 | `#27272a` | surface/overlay (dark) · **sidebar bg (dark)** |
| 900 | `#18181b` | default/foreground · surface/default (dark) · inverted (light) |
| 950 | `#09090b` | background/default (dark — page canvas) |

**Dark-mode zinc elevation:** `950` page → `900` cards/dialogs → `800` dropdowns → `700` active inputs.

---

## 3. Status ramps

Primitive ramps are **unchanged from Agentic** — all three anchors identical.

| Status | Anchor `/500` | Notes |
|---|---|---|
| **Danger** — Red | `#ef4444` | `brand/destructive` + `status/danger` both anchor here |
| **Success** — Green | `#22c55e` | icons remap to `/700` (`#15803d`) for AA |
| **Warning** — Yellow | `#eab308` | dark text (zinc/900); icons/text remap to `/700` |

> ⚠️ The **status border semantics** are NOT unchanged — see §7. The ramps match; the semantic tokens that pick from them do not.

> ⚠️ `color/green` (status) and `color/brand` (green) are **different ramps**. A success badge is `color/status/success`; a primary button is `color/brand/primary`. Never substitute.

**Chart series** — unchanged:
`1 #e76e50` · `2 #2a9d90` · `3 #274754` · `4 #e8c468` · `5 #f4a362`

**Retained accent — Blue** (`500 = #2b7fff`): Agentic's former brand ramp, kept as a plain accent family. Used by `color/border/info`. Not the brand.

### Additional ramps — not in Agentic

| Ramp | `/500` | Steps |
|---|---|---|
| **Orange** | `#ef6820` | 25 · 50 · 100–950 |
| **Violet** | `#875bf7` | 25 · 50 · 100–950 |

Neither is mapped to any semantic token. See Q4.

---

## 4. Radius — primitives unchanged, button usage is not

Primitive scale is **identical to Agentic**:

```
sm  = base − 4   →  4px
md  = base − 2   →  6px
lg  = base       →  8px   ← anchor (radius/base)
xl  = base + 4   → 12px
```

`none 0` · `sm 4` · `md 6` · **`base/lg 8`** · `xl 12` · `2xl 14` · `3xl 18` · `4xl 21` · `full 9999`

> ⚠️ **But Accura's buttons are pills.** The component tokens `button/size/Button radius 1` and `radius 2` both resolve to **`9999`**, where Agentic uses `12px` and `8px`. Accura buttons are fully rounded by design. See §7.

---

## 5. Spacing

**Unchanged from Agentic.** Linear +4px (8-point grid).

```
0 · 4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 36 · 40 · 44 · 48 · 56 · 64 · 80 · 96 · 112 · 128
```

Base unit **4px** · half-steps `px(1) · 0-5(2) · 1-5(6) · 2-5(10) · 3-5(14)`

> Figma naming uses a hyphen (`spacing/0-5`) where the Agentic doc writes a dot (`spacing/0.5`). Same value — Figma-safe naming only.

---

## 6. Typography — Figma and code deliberately differ

| Aspect | Figma primitive | Code (`accura-ui`) |
|---|---|---|
| **Sans (UI)** | `SF Pro` | **`Inter`** |
| **Mono** | `Roboto Mono` | `Roboto Mono` |
| **Serif** | `Georgia` | `Georgia` |
| Size scale · weights · line-height · tracking | identical to Agentic | identical |

### Decision — code keeps Inter (resolved)

Figma's `font-family/sans` resolves to **SF Pro**; `accura-ui` loads **Inter** via `preview-head.html`. **The decision is to keep Inter in code and leave the Figma primitive on SF Pro for now.**

This is a **known, accepted mismatch**, not an oversight:
- Design mockups render in SF Pro; Storybook renders in Inter.
- Any pixel-perfect Figma↔Storybook parity check on type will show differences in letterform and metrics. Do not "fix" a component to close that gap.
- To retire the mismatch, change the Figma primitive `font-family/sans` → `Inter`. That re-themes all 17 text styles and every text node bound to them — a large, visible change to the design file. It has not been done.

### Text styles — 17

Bound on four axes: `fontFamily` → `font-family/*`, `fontWeight` → `font-weight/*`, `fontSize` → `font-size/*`, `letterSpacing` → `letter-spacing/*`.
**`lineHeight` is hardcoded px and must stay that way** — unitless ratios resolve to different px values per font size.

| Style | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|
| `display/lg` | 48 | Bold | −1.5 | 48 |
| `display/md` | 36 | Semibold | −1.5 | 45 |
| `display/sm` | 30 | Medium | 0 | 38 |
| `heading/xl` | 24 | Semibold | 0 | 33 |
| `heading/lg` | 20 | Semibold | 0 | 28 |
| `heading/md` | 18 | Semibold | 0 | 25 |
| `heading/sm` | 16 | Semibold | 0 | 22 |
| `heading/xs` | 14 | Semibold | 0 | 19 |
| `body/lg` | 18 | Regular | 0 | 29 |
| `body/md` | 16 | Regular | 0 | 24 |
| `body/sm` | 14 | Regular | 0 | 21 |
| `body/xs` | 12 | Regular | 0 | 18 |
| `label/lg` | 16 | Medium | 0 | 16 |
| `label/md` | 14 | Medium | 0 | 14 |
| `label/sm` | 12 | Medium | 0 | 12 |
| `code/md` | 14 | Roboto Mono | 0 | 23 |
| `code/sm` | 12 | Roboto Mono | 0 | 20 |

---

## 7. Semantic & component deviations

**These are the easy ones to miss.** The primitive ramps match Agentic, so a primitives-only comparison reports "no change" — but the semantic tokens that *pick from* those ramps differ. Verified by diffing Accura's resolved Figma values against Agentic's `tokens.css`.

### Sidebar — dark teal, not light

| Token | Agentic | **Accura** |
|---|---|---|
| `color/sidebar/background` | `#fafafa` (zinc/50) | **`#00393f`** (brand/950-darkshade) light · `#27272a` dark |
| `color/sidebar/foreground` | `#3f3f46` (zinc/700) | **`#fafafa`** (zinc/50) |

Accura's sidebar is a **dark teal panel with light text** — a major identity difference from Agentic's light sidebar. This is correct and intentional; it matches the product designs.

### Status borders — markedly paler

| Token | Agentic | **Accura** | Accura step |
|---|---|---|---|
| `color/border/error` | `#ef4444` | `#fca5a5` | red/**300** |
| `color/border/success` | `#15803d` | `#4ade80` | green/**400** |
| `color/border/warning` | `#a16207` | `#fde047` | yellow/**300** |

Accura picks 300/400 steps where Agentic picks 500/700. See Q10 — a red/300 error border is very faint for an error signal.

### Focus ring — uses `/500`, not the anchor

| Token | Light | Dark |
|---|---|---|
| `color/ring` | `#17bb77` | `#17bb77` |
| `color/border/focus` | `#17bb77` | `#17bb77` |

The ring uses `brand/500`, **not** the `/800` anchor. `#17bb77` measures **2.50:1 against white** — below the 3:1 WCAG 1.4.11 minimum for non-text UI indicators. See Q11.

### Button radius — pills

`button/size/Button radius 1` and `radius 2` both = **`9999`** (Agentic: `12px` / `8px`).

### Other

| Token | Agentic | Accura |
|---|---|---|
| `opacity/overlay` (dark) | `50` | `20` |
| `motion/easing/standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | `cubic-bezier(0.2, 0, 0, 1)` |

### Accura-only tokens

Only three tokens exist in Accura and not in Agentic:

| Token | Value |
|---|---|
| `color/border/info` | `#8ec5ff` (blue/300) |
| `color/text/tertiary` | `#71717a` (zinc/500) |
| `breadcrumb/breadcrumb` | `4` |

Plus two semantics Agentic lacks: `color/sidebar/active` and `color/sidebar/active/foreground`.

---

## 8. Code implementation — `accura-ui`

Forked from `agentic-ui`; identical components, Accura tokens.

| | |
|---|---|
| Storybook | `npm run storybook` → **6007** |
| Dev server | `npm run dev` → **3001** |
| Tokens | `src/app/tokens.css` — generated from the Figma variables, not hand-edited |
| Theme switching | `.dark` class via `@storybook/addon-themes` |

`tokens.css` carries **29 light overrides, 10 dark overrides, 5 dark overrides Agentic did not need** (`brand/primary`, `primary-hover`, `primary-active`, `icon/brand`, `opacity/overlay`), and 3 Accura-only tokens.

**Regenerating:** values are resolved from Figma through the alias chain per mode. Two traps, both hit during the first build:
1. **Component tokens have no Dark mode.** They alias semantics, which do — so resolve *through* the alias with the wanted mode. Falling back to the Light value writes light colours into `.dark` (white outline buttons, non-inverting tooltips).
2. **Figma names may contain spaces and mixed case** (`button/size/Button radius 1`). CSS custom properties allow neither. Normalise to lowercase-kebab, or PostCSS throws `Unknown word` and **discards the entire stylesheet** — the page loads with no CSS at all.

> ⚠️ **Fork cost.** `accura-ui` duplicates all 36 components. Any component fix must be applied in both `agentic-ui` and `accura-ui`, or they drift.

---

## Deviation summary

| # | Deviation | Verdict |
|---|---|---|
| 1 | Brand hue green, anchor `/800-base` | ✅ **Correct** — required to clear the 3:1 contrast floor |
| 2 | Sidebar dark teal `#00393f` + light foreground | ✅ Intentional brand identity |
| 3 | Button radius `9999` (pill) | ✅ Intentional |
| 4 | Figma SF Pro vs code Inter | ✅ Accepted mismatch (§6) |
| 5 | Status borders at 300/400 steps | ⚠️ Very pale for error signalling (Q10) |
| 6 | `color/ring` = `brand/500`, 2.50:1 | ⚠️ Likely WCAG 1.4.11 failure (Q11) |
| 7 | Brand ramp steps `25`, `150-lightshade`, `950-darkshade`, `975` | ⚠️ Naming breaks convention (Q1) |
| 8 | `brand/975 = #0f172a` — slate, not green | ⚠️ Wrong family (Q2) |
| 9 | Orange + Violet ramps unmapped | ⚠️ Undocumented (Q4) |
| 10 | `motion/easing/standard` differs | ⚠️ Unexplained (Q5) |
| 11 | `opacity/overlay` dark = 20 vs 50 | ⚠️ Unexplained |
| 12 | Neutral · radius · spacing · status ramps · chart · type scale | ✅ Identical — no drift |

---

## Open questions

Unresolved. Do not silently "fix" these — each needs a decision.

**Q1 — Ramp step naming.** `150-lightshade`, `800-base`, `950-darkshade` carry descriptive suffixes. The Agentic rule is `[category]/[scale-name]/[step]` with a bare numeric step. Rename, or document the suffixes as an accepted Accura convention?

**Q2 — `brand/975 = #0f172a`.** Slate, not green — it does not belong to this ramp. It is actively used as a text colour in `[Accura One] Website Design`, which binds headings to `Brand/975`. Move it to the neutral family, or replace those usages with `color/background/default/foreground`?

**Q4 — Orange and Violet.** Full ramps mapped to no semantic token. Intended for a status/category use not yet built, or leftovers from an Untitled UI import?

**Q5 — `motion/easing/standard`.** `cubic-bezier(0.2, 0, 0, 1)` vs Agentic's `cubic-bezier(0.4, 0, 0.2, 1)`. Deliberate feel change, or a typo?

**Q6 — Extra semantics.** `sidebar/active` + `/foreground` exist in Accura only. A genuine gap Agentic should adopt, or Accura-local?

**Q7 — Shadow duality.** Values live as both effect styles and string primitives. Two sources for one value drift apart. Which is authoritative?

**Q8 — Two Accura libraries. NOW PROVEN, not theoretical.**
`[Accura One] WebApp` consumes `[Accura] Agentic Design System`; `[Accura One] Website Design` consumes `[Accura] Agentic Design System (beta) (Copy)`. They have **measurably drifted**:

| Token | `[Accura] Agentic DS` | `(beta) (Copy)` |
|---|---|---|
| `color/sidebar/background` | `#00393f` dark teal | `#fafafa` light zinc |
| button radius | `9999` pill | `radius/xl` 12px |

Same token name, different values, feeding two different product files. **This file documents the non-Copy library.** Decide which is canonical and retire the other.

**Q9 — `background/muted/foreground` has no primary-strength pair.** `background/muted` (`#f4f4f5`) pairs only with a muted `#71717a` foreground (4.4:1 — fails AA in light mode). The documented workaround is `background/default/foreground`, which contradicts the paired-surface rule. `background/accent` has identical fills with a primary-strength foreground, but is scoped to hover. Inherited from Agentic, not Accura-specific.

**Q10 — Pale status borders.** `border/error` at red/300 (`#fca5a5`) is very light for an error indicator on white. Deliberate soft aesthetic, or should these track Agentic's 500/700 steps?

**Q11 — Focus ring contrast.** `color/ring` = `brand/500` `#17bb77` = **2.50:1 vs white**, below the 3:1 WCAG 1.4.11 floor for non-text indicators. The `/800` anchor (`#008852`) passes at 4.59:1. Should the ring move to the anchor?

---

## How to re-theme

Same 5-lever workflow as `agentic-theme.md`:

1. **Brand** → pick a hue, regenerate the full ramp, **validate the anchor against white** (≥3:1 floor, ≥4.5:1 ideal). Move the anchor step if the hue can't clear the floor at `/500` — as Accura does at `/800`.
2. **Neutral** → swap zinc for slate/stone/gray. Highest mood-impact per effort.
3. **Radius** → change `radius/base`; sm/md/xl follow the calc offsets.
4. **Spacing** → change the 4px base or retune semantic mappings.
5. **Type** → swap `font-family/sans` and/or pick a new size-scale ratio.

Then regenerate `accura-ui/src/app/tokens.css` from Figma — minding the two traps in §8.

---

*Rules & semantic mappings: `Agentic-design-system/agentic-design-system.md` (inherited unchanged).*
*Theme pattern this file follows: `Agentic-design-system/agentic-theme.md`.*
*Values source of truth: Figma `[Accura] Agentic Design System` → Primitives / Semantics / Components.*
