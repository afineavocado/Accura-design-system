#theme #design-system #tokens #accura

# Accura — Theme Reference

Accura is a **re-theme of the Agentic Design System**, not a fork.

- **Rules** — naming conventions, semantic layer, paired-surface rule, spacing scale, layout, dark mode — are inherited **unchanged** from `agentic-design-system.md`. Do not duplicate or restate them here.
- **Values** — the primitives below — are what makes Accura look like Accura. This file is the Accura equivalent of `agentic-theme.md`.

> A theme = **{ brand ramp · neutral ramp · radius base · spacing base · type ratio }**

Because the semantic and component tiers **alias** primitives, editing this layer re-themes the whole system downstream with no semantic edits.

**Figma source:** `[Accura] Agentic Design System`
Primitives `VariableCollectionId:1:2` (mode: Value) · Semantics `1:129` (Light/Dark) · Components `17:4484` (Light)
228 primitives · 114 semantics · 45 component tokens · 17 text styles

---

## Theme at a glance

| Lever | Agentic | **Accura** | Changed? |
|---|---|---|---|
| **Brand hue** | Blue — anchor `/500` `#2b7fff` | **Green — anchor `/800-base` `#008852`** | ✅ **changed** |
| **Neutral** | Zinc `/50–/950` | Zinc `/50–/950` — identical hexes | — |
| **Radius base** | `8px` | `8px` | — |
| **Spacing base** | `4px` linear | `4px` linear | — |
| **Type** | Inter | **SF Pro** | ✅ **changed** |

**Only two of the five levers moved.** Everything else is Agentic as-is.

Mood: **cool-neutral, modern, professional** — same skeleton as Agentic, with a deep green brand and a system-native typeface.

---

## 1. Brand ramp — Green

**Anchor = `/800-base` = `#008852`.** This is the deliberate deviation from Agentic's `/500` rule.

| Step | Hex | Role |
|---|---|---|
| 25 | `#f0faf4` | extra step — lightest wash |
| 50 | `#e6f7ee` | info/brand-subtle bg |
| 100 | `#c3ead5` | secondary fill |
| 150-lightshade | `#b5e5d1` | extra step |
| 200 | `#9cddbb` | |
| 300 | `#70d1a0` | |
| 400 | `#4bc68b` | |
| 500 | `#17bb77` | ⚠️ **not** the anchor — see below |
| 600 | `#0dac6c` | |
| 700 | `#00995e` | |
| **800-base** | **`#008852`** | **brand/primary · ring · anchor** |
| 900 | `#175e41` | primary-hover |
| 950-darkshade | `#00393f` | |
| 975 | `#0f172a` | ⚠️ slate, not green — see Open Questions |

### Why the anchor moved to /800

`agentic-theme.md` defines the acceptance test for a brand anchor: measure it against white, then

- **≥ 4.5:1** → ✅ perfect — fill *and* small text
- **3:1 – 4.5:1** → ⚠️ fill only, bump to a darker step for text/icons
- **< 3:1** → ❌ reject

Measured against white (`#ffffff`):

| Candidate | Hex | Ratio | Verdict |
|---|---|---|---|
| `brand/500` | `#17bb77` | **2.50:1** | ❌ **reject** — below the 3:1 hard floor |
| `brand/700` | `#00995e` | **3.67:1** | ⚠️ fill only |
| **`brand/800-base`** | **`#008852`** | **4.59:1** | ✅ **perfect — fill + small text** |
| `brand/900` | `#175e41` | **7.74:1** | ✅ AAA |

Green is intrinsically lighter than blue at the same ramp step, so `/500` cannot clear the floor. Anchoring at `/800` is **the rule being applied correctly, not broken.**

**Consequence — Accura needs no fill-vs-text split.** Agentic must remap `color/text/link` and `color/icon/info` to `blue/600` because `blue/500` (3.8:1) fails as text. Accura's anchor already clears 4.5:1, so the brand colour is safe as fill *and* as text. Use `/900` where AAA is required.

---

## 2. Neutral ramp — Zinc

**Unchanged from Agentic.** Identical hexes, identical roles.

| Step | Hex | Role (light · dark) |
|---|---|---|
| 50 | `#fafafa` | surface/raised · sidebar bg · **inverted (dark)** |
| 100 | `#f4f4f5` | background/muted · accent |
| 200 | `#e4e4e7` | border/default |
| 300 | `#d4d4d8` | input/border |
| 400 | `#a1a1aa` | text/disabled · placeholder (dark) |
| 500 | `#71717a` | text/secondary · placeholder (light) |
| 600 | `#52525b` | input/border (dark) |
| 700 | `#3f3f46` | input/bg (dark) · border (dark) |
| 800 | `#27272a` | surface/overlay (dark) · surface/muted (dark) |
| 900 | `#18181b` | default/foreground · surface/default (dark) · **inverted (light)** |
| 950 | `#09090b` | background/default (dark — page canvas) |

**Dark-mode zinc elevation:** `950` page → `900` cards/dialogs → `800` dropdowns/disabled → `700` active inputs.

---

## 3. Status ramps

**Unchanged from Agentic** — all three anchors identical.

| Status | Anchor `/500` | Notes |
|---|---|---|
| **Danger** — Red | `#ef4444` | `brand/destructive` + `status/danger` both anchor here |
| **Success** — Green | `#22c55e` | icons remap to `/700` (`#15803d`) for AA |
| **Warning** — Yellow | `#eab308` | dark text (zinc/900) — yellow fails WCAG with white; icons/text remap to `/700` |

> ⚠️ `color/green` (status) and `color/brand` (green) are **different ramps**. Status green is Tailwind green; brand green is Accura's. Never substitute one for the other — a success badge is `color/status/success`, a primary button is `color/brand/primary`.

**Chart series** — unchanged:
`1 #e76e50` · `2 #2a9d90` · `3 #274754` · `4 #e8c468` · `5 #f4a362` (coral · teal · dark-teal · gold · peach)

**Retained accent — Blue** (`/50–/950`, `500 = #2b7fff`): Agentic's former brand ramp, kept as a plain accent family. Available for informational use; not the brand.

### Additional ramps — not in Agentic

Two Untitled UI ramps exist in Accura with an extra `/25` step:

| Ramp | `/500` | Steps |
|---|---|---|
| **Orange** | `#ef6820` | 25 · 50 · 100–950 |
| **Violet** | `#875bf7` | 25 · 50 · 100–950 |

Neither is currently mapped to a semantic token. Their intended role is undocumented — see Open Questions.

---

## 4. Radius

**Unchanged from Agentic.** shadcn `--radius` calc pattern — one base, ± offsets.

```
sm  = base − 4   →  4px
md  = base − 2   →  6px
lg  = base       →  8px   ← anchor (radius/base)
xl  = base + 4   → 12px
```

| Token | Value | |
|---|---|---|
| none | `0px` | |
| sm | `4px` | |
| md | `6px` | |
| **base / lg** | **`8px`** | anchor |
| xl | `12px` | |
| 2xl | `14px` | custom — large cards |
| 3xl | `18px` | custom |
| 4xl | `21px` | custom |
| full | `9999px` | pills, avatars |

---

## 5. Spacing

**Unchanged from Agentic.** Linear +4px (8-point grid), not geometric.

```
0 · 4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 36 · 40 · 44 · 48 · 56 · 64 · 80 · 96 · 112 · 128
```

Base unit = **4px** · half-steps `px(1) · 0-5(2) · 1-5(6) · 2-5(10) · 3-5(14)`

> Figma naming uses a hyphen (`spacing/0-5`) where the Agentic doc writes a dot (`spacing/0.5`). Same value — Figma-safe naming only.

---

## 6. Typography

| Aspect | Agentic | **Accura** |
|---|---|---|
| **Sans (UI)** | Inter | **`SF Pro`** ✅ changed |
| **Mono** | Roboto Mono | `Roboto Mono` |
| **Serif** | Georgia | `Georgia` |
| **Size scale** | 12 · 14 · 16 · 18 · 20 · 24 · 30 · 36 · 48 · 60 · 72 · 96 · 128 | identical |
| **Weights** | thin 100 → black 900 | identical |
| **Line height** | none 100 · tight 125 · snug 137.5 · normal 150 · relaxed 162.5 · loose 200 | identical |
| **Letter spacing** | tighter −2.5 → widest 10 | identical |

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

> ⚠️ **Figma says SF Pro; `agentic-ui`/Storybook loads Inter.** Design and code currently disagree on the UI typeface. One of the two must move — see Open Questions.

---

## 7. Other primitives

| Group | Status vs Agentic |
|---|---|
| **Motion durations** | identical — instant 0 · fast 100 · normal 200 · slow 300 · slower 500 |
| **Motion easing** | ⚠️ `standard` = `cubic-bezier(0.2, 0, 0, 1)` — Agentic doc specifies `cubic-bezier(0.4, 0, 0.2, 1)`. `enter` / `exit` / `linear` match. |
| **Opacity** | identical — 0–100 in tens, plus 75 |
| **Z-index** | identical — base 0 · raised 10 · dropdown 20 · sticky 30 · overlay 40 · modal 50 · toast 60 |
| **Breakpoints** | identical (sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536), **plus** `breakpoint/frame/*` variables (mobile 390 · tablet 768 · laptop 1024 · desktop 1280 · large 1440) — prose in Agentic, real variables in Accura |
| **Layout grid** | **more complete than Agentic** — full `layout/grid/{columns,gutter,margin}/{mobile,tablet,desktop}` set, plus `container/max-width 1400` and `container/padding/{mobile 16, desktop 32}` |
| **Shadow** | Agentic stores shadows as **effect styles only**. Accura *additionally* has `shadow/*` string primitives (`none · sm · default · md · lg · xl · 2xl · inner`). Missing `2xs`/`xs`; adds `inner`. |

---

## Deviation summary

| # | Deviation | Verdict |
|---|---|---|
| 1 | Brand hue green, anchor `/800-base` | ✅ **Correct** — required to clear the 3:1 contrast floor |
| 2 | `font-family/sans` = SF Pro | ✅ Intentional theme choice — but code disagrees (Q3) |
| 3 | Brand ramp steps `25`, `150-lightshade`, `950-darkshade`, `975` | ⚠️ Naming breaks convention (Q1) |
| 4 | `brand/975 = #0f172a` — slate, not green | ⚠️ Wrong family (Q2) |
| 5 | Orange + Violet ramps | ⚠️ Unmapped, undocumented (Q4) |
| 6 | `motion/easing/standard` differs | ⚠️ Unexplained (Q5) |
| 7 | Extra semantics: `sidebar/active`, `sidebar/active/foreground`, `border/info` | ⚠️ Not in Agentic (Q6) |
| 8 | Shadow primitives alongside effect styles | ⚠️ Two sources for one value (Q7) |
| 9 | Neutral · radius · spacing · status · chart · type scale | ✅ Identical — no drift |

---

## Open questions

Unresolved. Do not silently "fix" these — each needs a decision.

**Q1 — Ramp step naming.** `150-lightshade`, `800-base`, `950-darkshade` carry descriptive suffixes. The Agentic rule is `[category]/[scale-name]/[step]` with a bare numeric step; `agentic-design-system.md` lists `padding-16px`-style value-in-name as an explicit anti-pattern. Rename to bare steps, or document the suffixes as an accepted Accura convention?

**Q2 — `brand/975 = #0f172a`.** Slate, not green — it does not belong to this ramp. It is actively used as a text colour in the product files (`[Accura One] Website Design` binds headings to `Brand/975`). Move it to the neutral family, or replace those usages with `color/background/default/foreground` (`zinc/900`)?

**Q3 — SF Pro vs Inter.** Figma primitives say SF Pro; `agentic-ui` Storybook loads Inter via `preview-head.html`. Design and code will not match until one moves. Which is authoritative?

**Q4 — Orange and Violet.** Present as full ramps, mapped to no semantic token. Intended for a status/category use not yet built, or leftovers from an Untitled UI import? If unused, they are dead weight.

**Q5 — `motion/easing/standard`.** `cubic-bezier(0.2, 0, 0, 1)` vs Agentic's `cubic-bezier(0.4, 0, 0.2, 1)`. Deliberate feel change, or a typo?

**Q6 — Extra semantics.** `sidebar/active` + `/foreground` and `border/info` exist in Accura only. Genuine gaps Agentic should adopt, or Accura-local additions?

**Q7 — Shadow duality.** Values live as both effect styles and string primitives. Two sources for one value drift apart. Which is authoritative?

**Q8 — Two Accura libraries.** `[Accura One] WebApp` consumes `[Accura] Agentic Design System`; `[Accura One] Website Design` consumes `[Accura] Agentic Design System (beta) (Copy)`. Two libraries means silent drift between product files. Which is canonical, and can the other be retired?

**Q9 — `background/muted/foreground` has no primary-strength pair.** `background/muted` (`#f4f4f5`) pairs only with a muted `#71717a` foreground (4.4:1 — fails AA in light mode). The documented workaround is to use `background/default/foreground` instead, which contradicts the paired-surface rule. Note `background/accent` has identical fills with a primary-strength foreground — the pairing exists but is scoped to hover states. Inherited from Agentic, not Accura-specific.

---

## How to re-theme

Same 5-lever workflow as `agentic-theme.md`:

1. **Brand** → pick a hue, regenerate the full ramp, **validate the anchor against white** (≥3:1 floor, ≥4.5:1 ideal). Move the anchor step if the hue can't clear the floor at `/500` — as Accura does at `/800`.
2. **Neutral** → swap zinc for slate/stone/gray. Highest mood-impact per effort.
3. **Radius** → change `radius/base`; sm/md/xl follow the calc offsets.
4. **Spacing** → change the 4px base or retune semantic mappings.
5. **Type** → swap `font-family/sans` and/or pick a new size-scale ratio.

---

*Rules & semantic mappings: `Agentic-design-system/agentic-design-system.md` (inherited unchanged).*
*Theme pattern this file follows: `Agentic-design-system/agentic-theme.md`.*
*Values source of truth: Figma `[Accura] Agentic Design System` → Primitives collection.*
