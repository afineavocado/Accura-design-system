#theme #design-system #tokens #accura

# Accura — Theme Reference

Accura is a **re-theme of the Agentic Design System**, not a fork of its rules.

- **Rules** — naming conventions, semantic layer, paired-surface rule, spacing scale, layout, dark mode — are inherited **unchanged** from [`docs/design-system-rules.md`](docs/design-system-rules.md) (vendored). Do not duplicate or restate them here.
- **Values** — the tokens below — are what makes Accura look like Accura. This file is the Accura equivalent of Agentic's `agentic-theme.md` (upstream, not vendored — its values do not apply here).

> A theme = **{ brand ramp · neutral ramp · radius base · spacing base · type ratio }**

Because the semantic and component tiers **alias** primitives, editing the primitive layer re-themes everything downstream with no semantic edits.

## What this file is for, and what it is not

**It is not where values come from.** `accura-ui/src/app/tokens.css` is what ships; `tokens/*.json`
is the export, checkable with `node tokens/token-parity.mjs`. This file explains the *decisions* —
why the brand anchors where it does, what deviates from Agentic and why, and what is still open.

**The ramp tables are verified, not restated by hand.** `drift-check` rule 3 checks every
`| step | hex |` row against that step's own primitive, so a hex that is real but attached to the
wrong step now fails. Do not hand-edit a hex here to match something you saw; fix the primitive,
or say why the doc is right.

Counts, for orientation: 229 primitives · 115 semantics (light + dark) · 52 component tokens ·
17 text styles. Code lives in `accura-ui/`, Storybook on **port 6007**.

---

## Theme at a glance

| Lever | Agentic | **Accura** | Changed? |
|---|---|---|---|
| **Brand hue** | Blue — anchor `/500` `#2b7fff` | **Green — anchor `/800-base` `#008852`** | ✅ **changed** |
| **Neutral** | Zinc `/50–/950` | Zinc `/50–/950` — identical hexes | — |
| **Radius base** | `8px` | **`12px`** | ✅ **changed** |
| **Spacing base** | `4px` linear | `4px` linear | — |
| **Type** | Inter | Body — **Inter** in both<br>Headings — **Albert Sans** in both | — **matches, see §6** |

Three of the five primitive levers moved. But the primitive layer is not the whole story — Accura also diverges at the **semantic and component tiers** (sidebar, status borders, button radius). Those are in §7 and are easy to miss, because a primitives-only comparison shows them as unchanged.

---

> **The value tables moved.** Ramps, radius, spacing, the 17 text styles and the semantic
> deviations now live in `docs/design-system-rules.md` → *Accura values*, beside the rules that
> govern them. What stays here is why Accura differs from Agentic, and what is still unanswered.

> **Dark mode is not used.** The token pipeline generates a `.dark` block and every semantic has a
> dark value. No screen renders in dark mode and none is designed for it. Keep dark values correct
> when adding a token; do not audit or design against them.

---

### Why the anchor moved to /800

Agentic's theme doc defines the acceptance test for a brand anchor — restated here in full, since that file is not vendored. Measure against white, then:

- **≥ 4.5:1** → ✅ perfect — fill *and* small text
- **3:1 – 4.5:1** → ⚠️ fill only, bump to a darker step for text/icons
- **< 3:1** → ❌ reject

| Candidate | Hex | vs white | Verdict |
|---|---|---|---|
| `brand/500` | `#17bb77` | **2.50:1** | ❌ **reject** — below the 3:1 hard floor |
| `brand/700` | `#00995e` | **3.67:1** | ⚠️ fill only |
| **`brand/800-base`** | **`#008852`** | **4.52:1** | ✅ **perfect — fill + small text** |
| `brand/900` | `#175e41` | **7.74:1** | ✅ AAA |

Green is intrinsically lighter than blue at the same ramp step, so `/500` cannot clear the floor. Anchoring at `/800` is **the rule being applied correctly, not broken.**

**Consequence — Accura needs no fill-vs-text split.** Agentic must remap `color/text/link` and `color/icon/info` to `blue/600` because `blue/500` (3.8:1) fails as text. Accura's anchor already clears 4.5:1, so the brand colour is safe as fill *and* text. Use `/900` where AAA is required.

---

---

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

---

## Typography decisions

### Decision — headings are Albert Sans, now in Figma too (resolved 2026-09-08)

Originally shipped code-only, because Figma had exactly three font-family primitives —
`sans`, `mono`, `serif` — so headings and body both resolved to `font-family/sans`.
**`font-family/display` = `Albert Sans` now exists in the Primitives collection**, and the
heading text styles are bound to it. Figma and code agree on headings.

| Surface | Figma text style | Font | Wired at |
|---|---|---|---|
| Page `h1` | `display/lg` `md` `sm` (48/36/30) | Albert Sans | `globals.css` base layer |
| `h2`, `h3` | `heading/xl` `lg` (24/20) | Albert Sans | `globals.css` base layer |
| `DialogTitle`, `AlertDialogTitle`, `SheetTitle`, `DrawerTitle` | `heading/md` (18) | Albert Sans | `font-heading` class per component |
| Module title in the app header (prototypes) | `heading/md` (18) | Albert Sans | inherits from the base `h1`–`h3` rule |
| `CardTitle`, `h4`–`h6` | `heading/sm` `xs` (16/14) | **Inter** | unchanged |
| body, labels, inputs, buttons, table cells | `body/*` `label/*` | **Inter** | unchanged |

`heading/sm` and `heading/xs` deliberately stay on `font-family/sans`. At 16px and 14px
they read as labels rather than titles, and `CardTitle` is `heading/sm` — switching it
would put Albert Sans on every card in the product. **This boundary is the mapping between
Figma and code: styles at or above 18px are display, below are sans.**

> ⚠️ **Setting `fontName` on a text style silently clears its `fontWeight` binding.**
> It happened to 5 of the 6 styles when they were rebound and had to be re-bound
> afterwards. The theme requires all four axes (`fontFamily`, `fontWeight`, `fontSize`,
> `letterSpacing`) bound — always re-verify all four after touching `fontName`.

**No type mismatch remains.** Headings are Albert Sans in both; body is Inter in both.

**Loading.** Albert Sans is a Google Font, loaded twice because Storybook and Next are
independent: `.storybook/preview-head.html` (Google Fonts `<link>`) and
`src/app/layout.tsx` (`next/font/google`). **Change one, change both** — otherwise
Storybook and the Next app disagree, and Storybook is where the system is reviewed.

Verified in-browser 2026-09-08 — computed `font-family`: `h1`/`h2`/`h3` Albert Sans;
`h4`/`p`/`button` Inter; Dialog, AlertDialog, Sheet and Drawer titles Albert Sans with
Inter descriptions in the same overlay.

### Decision — body copy is Inter, in Figma and in code (resolved 2026-09-14)

`font-family/sans` is **`Inter`** in Figma; `accura-ui` loads **Inter** via `preview-head.html`
and `src/app/layout.tsx`. **There is no body-type mismatch, and SF Pro is not part of Accura.**

This supersedes the earlier "accepted mismatch" entry, which recorded Figma's primitive as
`SF Pro` and instructed agents not to close the gap. That instruction is withdrawn: a Figma↔code
type difference on body copy is now a **real defect**, not an accepted one, and should be
reported.

⚠️ **Two stale artefacts still say `SF Pro`** and will reintroduce it if used as a source:
`tokens/primitives.tokens.json` and `tokens/tokens.tokens.json` (both exported 2026-09-09,
before this was confirmed), along with the generated `tokens/output/css/*`. The runtime source of
truth, `accura-ui/src/app/tokens.css`, is already correct (`--font-family-sans: Inter`). Re-export
to clear them.

*Confirmed by the file owner 2026-09-14. Not independently verified here — figma-cli was not
connected, so this rests on that confirmation rather than a read of the variable.*

---

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

> ⚠️ **Fork cost.** `accura-ui` duplicates all 39 components. Any component fix must be applied in both `agentic-ui` and `accura-ui`, or they drift.

---

---

## Deviation summary

| #   | Deviation                                                       | Verdict                                                  |
| --- | --------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | Brand hue green, anchor `/800-base`                             | ✅ **Correct** — required to clear the 3:1 contrast floor |
| 2   | Sidebar dark teal `#00393f` + light foreground                  | ✅ Intentional brand identity                             |
| 3   | Button radius `9999` (pill)                                     | ✅ Intentional                                            |
| 4   | Body type — Inter in Figma and code                             | ✅ Resolved 2026-09-14, no mismatch (§6)                  |
| 4b  | Headings Albert Sans — `font-family/display` in Figma + code    | ✅ Resolved 2026-09-08, no longer a mismatch (§6)         |
| 5   | Status borders at 300/400 steps                                 | ⚠️ Very pale for error signalling (Q10)                  |
| 6   | `color/ring` = `brand/500`, 2.50:1                              | ⚠️ Likely WCAG 1.4.11 failure (Q11)                      |
| 7   | Brand ramp steps `25`, `150-lightshade`, `950-darkshade`, `975` | ⚠️ Naming breaks convention (Q1)                         |
| 8   | `brand/975 = #0f172a` — slate, not green                        | ⚠️ Wrong family (Q2)                                     |
| 9   | Orange + Violet ramps unmapped                                  | ⚠️ Undocumented (Q4)                                     |
| 10  | `motion/easing/standard` differs                                | ⚠️ Unexplained (Q5)                                      |
| 11  | `opacity/overlay` dark = 20 vs 50                               | ⚠️ Unexplained                                           |
| 12  | Neutral · radius · spacing · status ramps · chart · type scale  | ✅ Identical — no drift                                   |

---

---

## Open questions

Unresolved. Do not silently "fix" these — each needs a decision.

**Q1 — Ramp step naming.** `150-lightshade`, `800-base`, `950-darkshade` carry descriptive suffixes. The Agentic rule is `[category]/[scale-name]/[step]` with a bare numeric step. Rename, or document the suffixes as an accepted Accura convention?

**Q2 — `brand/975 = #0f172a`.** Slate, not green — it does not belong to this ramp. It is actively used as a text colour in `[Accura One] Website Design`, which binds headings to `Brand/975`. Move it to the neutral family, or replace those usages with `color/background/default/foreground`?

> **Q3 is not in use.** The number is skipped — it was removed at some point without
> renumbering. Left as a gap deliberately: renumbering would break every reference to Q4–Q12.

**Q4 — Orange and Violet.** Full ramps mapped to no semantic token. Intended for a status/category use not yet built, or leftovers from an Untitled UI import?

**Q5 — `motion/easing/standard`.** `cubic-bezier(0.2, 0, 0, 1)` vs Agentic's `cubic-bezier(0.4, 0, 0.2, 1)`. Deliberate feel change, or a typo?

**Q6 — Extra semantics.** `sidebar/active` + `/foreground` exist in Accura only. A genuine gap Agentic should adopt, or Accura-local?

**Q7 — Shadow duality.** Values live as both effect styles and string primitives. Two sources for one value drift apart. Which is authoritative?

**Q8 — RESOLVED 2026-09-14. Two Accura libraries, measurably drifted.**
`[Accura One] WebApp` consumes `[Accura] Agentic Design System`; `[Accura One] Website Design` consumes `[Accura] Agentic Design System (beta) (Copy)`. They have **measurably drifted**:

| Token | `[Accura] Agentic DS` | `(beta) (Copy)` |
|---|---|---|
| `color/sidebar/background` | `#00393f` dark teal | `#fafafa` light zinc |
| button radius | `9999` pill | `radius/xl` 12px |

Same token name, different values, feeding two different product files.

> **Decision: `[Accura One] WebApp` is canonical**, consuming `[Accura] Agentic Design System` —
> the library this file documents. `[Accura] Agentic Design System (beta) (Copy)` and the
> `[Accura One] Website Design` file that consumes it are **not** the source of truth for
> product values.
>
> **Not yet retired.** Until it is, the `(beta) (Copy)` library remains live and can be edited
> by anyone who opens the website file, so the two can drift further. Retiring it is the
> follow-up; naming the canonical one only stops *new* work going to the wrong place.

**Q9 — `background/muted/foreground` has no primary-strength pair.** `background/muted` (`#f4f4f5`) pairs only with a muted `#71717a` foreground (4.4:1 — fails AA in light mode). The documented workaround is `background/default/foreground`, which contradicts the paired-surface rule. `background/accent` has identical fills with a primary-strength foreground, but is scoped to hover. Inherited from Agentic, not Accura-specific.

**Q10 — Pale status borders.** `border/error` at red/300 (`#fca5a5`) is very light for an error indicator on white. Deliberate soft aesthetic, or should these track Agentic's 500/700 steps?

**Q11 — ACCEPTED 2026-09-14. Focus ring contrast.** `color/ring` = `brand/500` `#17bb77` =
**2.50:1 vs white**, below the 3:1 WCAG 1.4.11 floor for non-text indicators. The `/800` anchor
(`#008852`) would pass at 4.52:1.

> **Decision: the ring stays at `brand/500`.** Accepted knowingly.
>
> What this means in practice: the focus indicator does not meet 1.4.11, so keyboard focus is
> harder to see for low-vision users, and an accessibility audit will raise it. Every component
> that uses `focus-visible:ring-[var(--color-ring)]` is affected — it is one token, so reversing
> the decision later is a one-line change.
>
> Note the ring is the **only** place `brand/500` is used as a standalone indicator; everywhere
> else the brand anchors at `/800` precisely because `/500` fails the 3:1 floor (§brand).

**Q12 — Card padding: the vendored spec disagreed with the code, and the code won.**
`Card.md` specified `spacing/component/xl` (24px) for the root shell while `card.tsx` and
`card.meta.json` both implement `spacing/component/lg` (16px). Two of three artefacts agreed on
16px, and the outlier was a **vendored** spec — the file class that carries Agentic's values,
not Accura's. `Card.md` was corrected to 16px on 2026-09-14 and all three prototypes now use the
default.

> ⚠️ **Not confirmed against Figma.** This is one instance of the wider gap: Accura's tokens were
> hand-written to match Figma and never verified by export. If the Figma card is 24px, this
> decision is wrong and the code is the thing to change. Settle it during the Figma ↔ code
> reconciliation pass.

Image variants are unaffected — their 24px sits on the inner `card-content` frame, which is a
different surface and was never in dispute.

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
