#theme #design-system #tokens #accura

# Accura — Theme Reference

Accura is a **re-theme of the Agentic Design System**, not a fork of its rules.

- **Rules** — naming conventions, semantic layer, paired-surface rule, spacing scale, layout, dark mode — are inherited **unchanged** from [`docs/design-system-rules.md`](docs/design-system-rules.md) (vendored). Do not duplicate or restate them here.
- **Values** — the tokens below — are what makes Accura look like Accura. This file is the Accura equivalent of Agentic's `agentic-theme.md` (upstream, not vendored — its values do not apply here).

> A theme = **{ brand ramp · neutral ramp · radius base · spacing base · type ratio }**

Because the semantic and component tiers **alias** primitives, editing the primitive layer re-themes everything downstream with no semantic edits.

**Figma source:** `[Accura] Agentic Design System`
Primitives `VariableCollectionId:1:2` (mode: Value) · Semantics `1:129` (Light/Dark) · Components `17:4484` (Light)
228 primitives · 115 semantics (Light + Dark) · 52 component tokens · 17 text styles — all exported to `tokens/`

**Code:** `accura-ui/` — Storybook on **port 6007** (Agentic's runs on 6006, so both can run side by side).

---

## Theme at a glance

| Lever | Agentic | **Accura** | Changed? |
|---|---|---|---|
| **Brand hue** | Blue — anchor `/500` `#2b7fff` | **Green — anchor `/800-base` `#008852`** | ✅ **changed** |
| **Neutral** | Zinc `/50–/950` | Zinc `/50–/950` — identical hexes | — |
| **Radius base** | `8px` | **`12px`** | ✅ **changed** |
| **Spacing base** | `4px` linear | `4px` linear | — |
| **Type** | Inter | Body — Figma: **SF Pro** · Code: **Inter**<br>Headings — Code: **Albert Sans** (no Figma token) | ⚠️ **split — see §6** |

Three of the five primitive levers moved. But the primitive layer is not the whole story — Accura also diverges at the **semantic and component tiers** (sidebar, status borders, button radius). Those are in §7 and are easy to miss, because a primitives-only comparison shows them as unchanged.

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

Agentic's theme doc defines the acceptance test for a brand anchor — restated here in full, since that file is not vendored. Measure against white, then:

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

## 4. Radius — rescaled to base 12

**This is the third changed primitive lever.** Agentic anchors at `8px`; Accura anchors at
**`12px`**. Accura is deliberately a rounder system.

The shadcn offset relationships are preserved, so shadcn components that expect
`sm/md/lg/xl` to sit ±4 and ±2 around the anchor still behave:

```
sm  = base − 4   →   8px
md  = base − 2   →  10px
lg  = base       →  12px   ← anchor (radius/base)
xl  = base + 4   →  16px
```

| Token | Agentic | **Accura** | Consumed by |
|---|---:|---:|---|
| `none` | 0 | **0** | — |
| `sm` | 4 | **8** | breadcrumb |
| `md` | 6 | **10** | 42 uses — inputs, select, tabs, badge, tooltip, sidebar |
| `base` | 8 | **12** | 1 use |
| `lg` | 8 | **12** | 29 uses — cards, dialogs, sheets, drawers, toasts |
| `xl` | 12 | **16** | — |
| `2xl` | 14 | **20** | chat-bubble |
| `3xl` | 18 | **24** | — |
| `4xl` | 21 | **28** | — |
| `full` | 9999 | **9999** | pills, stepper, avatar |

The top of the scale (`2xl`–`4xl`) was regularised to +4 steps; Agentic's `14 / 18 / 21`
was irregular and nothing consumed `3xl` or `4xl`.

> ⚠️ **Buttons are pills regardless.** `button/size/Button radius 1` and `radius 2` both
> resolve to **`9999`**, where Agentic uses `12px` and `8px`. Unaffected by the rescale.

### Small-box clamping — read before raising `md` again

CSS clamps `border-radius` to **half the shorter side**. Anything ≤ 20px tall that uses
`radius/md` (10px) therefore renders as a **full pill**, not a rounded rectangle:

| Element | Size | Effect at md = 10 |
|---|---|---|
| **Checkbox** | 16×16 | Would be a circle → **indistinguishable from RadioGroup**. Broken out to `checkbox/radius` = 4. |
| Badge (Small) | height 16 | Clamps to a pill. Accepted — consistent with pill buttons. |
| Badge (Medium) | height 20 | Exactly a pill. Accepted. |
| Input, Select, Textarea | height 36 | 10px, no clamping. Intended. |

The checkbox case is the one that matters: a checkbox and a radio must be
distinguishable by shape alone, since that is the only cue that tells the user whether
the choice is exclusive.

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
| **Sans (UI / body)** | `SF Pro` | **`Inter`** |
| **Headings** | *no token — does not exist* | **`Albert Sans`** |
| **Mono** | `Roboto Mono` | `Roboto Mono` |
| **Serif** | `Georgia` | `Georgia` |
| Size scale · weights · line-height · tracking | identical to Agentic | identical |

### Decision — headings are Albert Sans, code-only (resolved 2026-09-08)

Figma has exactly three font-family primitives — `sans`, `mono`, `serif`. There is **no
display/heading token**, so headings and body both resolve to `font-family/sans`.
Accura splits them **in code only**:

| Surface | Font | Wired at |
|---|---|---|
| `h1`, `h2`, `h3` | Albert Sans | `globals.css` base layer |
| `DialogTitle`, `AlertDialogTitle`, `SheetTitle`, `DrawerTitle` | Albert Sans | `font-heading` class on each component |
| `h4`–`h6`, body, labels, inputs, buttons, table cells | Inter | unchanged |

`h4`–`h6` stay on Inter deliberately — at those sizes they read as labels, not titles.
`CardTitle` also stays on Inter: it is a component label, and switching it would put
Albert Sans on every card in the product.

**Why not a token.** Adding `font-family/display` would mean either editing Figma (out of
scope — this was scoped code-only) or hand-adding a token to `primitives.tokens.json`
that has no Figma counterpart. The second option creates silent drift: `tokens.css` is
generated by `tokens/sd.build.mjs`, so the next re-export would either drop the token or
resurrect a value nobody set in Figma. Instead the font lives in `globals.css` alongside
`--font-sans` / `--font-mono`, which is where the existing code-side font wiring already
sits.

**Consequence — this is now a second accepted Figma↔code mismatch.** A Figma mockup
renders every heading in SF Pro; Storybook renders `h1`–`h3` and overlay titles in Albert
Sans. Do not "fix" a component to close that gap. To retire it, create
`font-family/display` in Figma and rebind the `heading/*` and `display/*` text styles.

**Loading.** Albert Sans is a Google Font, loaded twice because Storybook and Next are
independent: `.storybook/preview-head.html` (Google Fonts `<link>`) and
`src/app/layout.tsx` (`next/font/google`). **Change one, change both** — otherwise
Storybook and the Next app disagree, and Storybook is where the system is reviewed.

Verified in-browser 2026-09-08 — computed `font-family`: `h1`/`h2`/`h3` Albert Sans;
`h4`/`p`/`button` Inter; Dialog, AlertDialog, Sheet and Drawer titles Albert Sans with
Inter descriptions in the same overlay.

### Decision — body copy keeps Inter (resolved)

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

Four tokens exist in Accura and not in Agentic:

| Token | Value | Source |
|---|---|---|
| `color/border/info` | `#8ec5ff` (blue/300) | Figma |
| `color/text/tertiary` | `#71717a` (zinc/500) | Figma |
| `breadcrumb/breadcrumb` | `4` | Figma |
| **`stepper/border`** | **`#d4d4d8` (zinc/300)** | Figma |
| **`checkbox/radius`** | **`4px`** | Figma |
| **`button/destructive-secondary/*`** (5) | red `100 / 50 / 200 / 900` + `brand/destructive` | **code only — not yet in Figma** |

Plus two semantics Agentic lacks: `color/sidebar/active` and `color/sidebar/active/foreground`.

> ✅ Both `stepper/border` and `checkbox/radius` exist in Figma's **Components** collection
> (47 tokens) and were confirmed present by re-export on 2026-09-08. They are durable — a
> re-export will not drop them.

### Rule deviation — component tokens may alias primitives

The inherited ruleset states:

> Collection 3: Component tokens → **Alias Semantics — never alias primitives directly**

**Accura does not follow this.** The component tier is treated as another semantic layer, so a component
token may alias a primitive where no semantic carries the right meaning.

`stepper/border` is the first case. The Stepper's upcoming indicator needs a ring that reads against a
`#f4f4f5` fill:

| Candidate | Value | Why it fails |
|---|---|---|
| `color/border/default` | `#e4e4e7` | measured — invisible against the muted fill |
| `color/border/hover` | `#d4d4d8` | right value, but means *hover state* on a static element |
| `color/input/border` | `#d4d4d8` | right value, but means *input boundary* |
| `color/border/strong` | `#a1a1aa` | too heavy |

The border ladder has a genuine gap between `default` (`#e4e4e7`) and `strong` (`#a1a1aa`). Rather than
add a semantic nobody else needed yet, or misuse a hover token on a static state, `stepper/border` aliases
`color/zinc/300` directly.

**Consequence:** an R1–R8 audit will flag this as a violation of the inherited rule. It is deliberate.
If the gap recurs for other components, promote it to a proper semantic instead of repeating the pattern.

`button/destructive-secondary/*` follows the same pattern as every other button variant —
`button/secondary` already aliases `color.brand.100 / 50 / 200 / 900` directly, so aliasing the
red ramp is consistent, not a new exception. Two of its five values were chosen *against* the
obvious semantic and the reasons are worth keeping:

| Token | Obvious choice | Actually used | Why |
|---|---|---|---|
| `fg/fg` | `status/danger-subtle/foreground` (red/700) | **red/900** | red/700 on the pressed red/200 fill is **4.47:1** — misses AA. red/900 holds ≥ 6.93:1 in all three states. |
| `border/default` | `color/border/error` (red/300) | **`brand/destructive`** (red/500) | red/300 is **1.90:1** on white, below the 3:1 floor WCAG 1.4.11 sets for a control boundary. red/500 is 3.76:1. |

> ⚠️ This does **not** resolve **Q10**. `color/border/error` is still red/300 everywhere else it
> is used. One component routed around it; the underlying question is still open.

> ⚠️ **Code-only.** Figma's button component set has 6 Types and does not include
> `Destructive Secondary`. Until it is built there, Figma is not the source of truth for Button.

`checkbox/radius` is the second case, and the reason is geometric rather than semantic. Every other form
control takes `radius/md`. After the base-12 rescale that is `10px`, and the checkbox is `16×16` — CSS
clamps `border-radius` to half the shorter side, so the checkbox would render as a perfect circle,
**visually identical to a radio button**. Shape is the only cue that tells a user whether a choice is
exclusive, so this is a comprehension failure, not a styling preference. No radius primitive can fix it:
the value has to stop tracking the scale. Pinned at `4px`.

---

## 8. Code implementation — `accura-ui`

Forked from `agentic-ui`; identical components, Accura tokens.

| | |
|---|---|
| Storybook | `npm run storybook` → **6007** |
| Dev server | `npm run dev` → **3001** |
| Tokens | `accura-ui/src/app/tokens.css` — generated from the Figma variables, not hand-edited |
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
| 4 | Figma SF Pro vs code Inter (body) | ✅ Accepted mismatch (§6) |
| 4b | Headings Albert Sans in code, no Figma token | ✅ Accepted, code-only (§6) |
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

Same 5-lever workflow Agentic uses:

1. **Brand** → pick a hue, regenerate the full ramp, **validate the anchor against white** (≥3:1 floor, ≥4.5:1 ideal). Move the anchor step if the hue can't clear the floor at `/500` — as Accura does at `/800`.
2. **Neutral** → swap zinc for slate/stone/gray. Highest mood-impact per effort.
3. **Radius** → change `radius/base`; sm/md/xl follow the calc offsets. Check every box ≤ 20px that uses `radius/md` — CSS clamps radius to half the shorter side, so small controls silently become pills (§4).
4. **Spacing** → change the 4px base or retune semantic mappings.
5. **Type** → swap `font-family/sans` and/or pick a new size-scale ratio. To change the
   heading font instead, edit `--font-heading` in `accura-ui/src/app/globals.css` and load
   the new family in **both** `.storybook/preview-head.html` and `src/app/layout.tsx` (§6).

Then regenerate `accura-ui/src/app/tokens.css` from Figma — minding the two traps in §8.

---

*Rules & semantic mappings: [`docs/design-system-rules.md`](docs/design-system-rules.md) — vendored, inherited unchanged. Its **values** are Agentic's; this file overrides them.*
*Theme pattern this file follows: `agentic-theme.md` upstream (github.com/afineavocado/agentic-design-system-main).*
*Values source of truth: Figma `[Accura] Agentic Design System` → Primitives / Semantics / Components.*
