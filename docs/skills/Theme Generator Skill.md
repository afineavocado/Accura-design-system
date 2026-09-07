#skill #theme #tokens

# Theme Generator Skill

Turn one or more input colors into a compliant, ready-to-apply theme. Use whenever someone wants to re-skin the system (new brand, new accent, alternate theme).

**Source of truth for the standard:** `agentic-theme.md` → *Ramp contrast standard*. Read it first. This skill is the *procedure*; that file is the *spec*.

---

## Input contract

A full theme = **{ brand · neutral · radius base · spacing base · type base + ratio }** (per `agentic-theme.md`). Accept any subset. Two input families:

**Color inputs** — require an explicit **role**. If given bare hexes, ask which role each plays. These go through the contrast gate.

| Role | Maps to primitive ramp | Notes |
|---|---|---|
| Brand | `color/blue/*` (the brand ramp) | The main one. Drives primary, ring, links, info. |
| Neutral | `color/zinc/*` | Optional. Biggest mood shift. |
| Status (danger/success/warning) | `color/red` / `green` / `yellow` | Rarely re-themed — keep semantic meaning. |

A "3-color" request usually = brand + 2 accents/status. Confirm before generating.

**Dimensional inputs** — single base values; no contrast gate. The rest of the scale derives automatically.

| Input | Maps to | Derivation |
|---|---|---|
| Radius base | `radius/base` | sm/md/xl follow shadcn calc offsets (base −4 / −2 / +4). Sanity: 0 = sharp, 8 = friendly, 12–16+ = soft. |
| Spacing base | `spacing` unit (default 4px) | Linear, no ratio. Smaller = denser, larger = airier. |
| Type base + ratio | `font-size/base` + scale ratio | base (16px) × ratio per step. Ratios: 1.125 subtle · 1.25 balanced · 1.333 dramatic. |

Sanity-check dimensional inputs (not contrast): don't shrink touch targets below 44px, don't drop body type below ~14px.

---

## Procedure

### 0. Guided intake — ask, don't assume

**Always run this first. Ask one question at a time and wait for the answer before the next.** Do not start generating until intake is complete. If the user already gave some inputs upfront, skip those questions and confirm the rest.

1. **Which levers?** Ask which to theme (multi-select):
   `Brand · Neutral · Status · Radius · Spacing · Type`
2. **Collect each selected lever, one at a time:**
   - **Brand / Neutral / Status** → ask for the hex(es) and confirm the role of each.
   - **Radius** → ask for the base px (e.g. 8).
   - **Spacing** → ask for the base unit px (default 4).
   - **Type** → ask for base size px (default 16) and the scale ratio (1.125 / 1.25 / 1.333).
3. **Play back the collected inputs** as a summary and ask for confirmation.
4. Only then proceed to step 1.

Keep it conversational — never dump all questions at once. Color inputs continue to step 1 (contrast gate); dimensional inputs skip to step 4.

> **Dimensional inputs (radius / spacing / type) skip steps 1–2.** No contrast gate, no ramp. Just set the base value in `Tokens/primitives.tokens.json` (`radius/base`, the `spacing` base unit, or `font-size/base` + apply the ratio across the size scale), then continue from step 4 (rebuild). Derived steps follow automatically — don't hand-edit them.

### 1. Gate each input on contrast (before anything else) — color inputs only
Run the exact WCAG check — don't eyeball. Compute contrast of the input (as `/500`) vs **white** and vs **page bg**.

```bash
node -e 'const h=process.argv[1];const f=h.replace("#","").match(/../g).map(x=>parseInt(x,16)/255).map(c=>c<=.03928?c/12.92:((c+.055)/1.055)**2.4);const L=.2126*f[0]+.7152*f[1]+.0722*f[2];const w=(1.05)/(L+.05);console.log(h,"vs white =",w.toFixed(2)+":1")' "#2b7fff"
```

Verdict per the standard:
- **≥ 4.5:1** → ✅ perfect (fill + small text)
- **3:1–4.5:1** → ⚠️ fill only; text/icon/link must use `/600`–`/700`
- **< 3:1** → ❌ reject → **recommend nearest compliant hue** (lower lightness, keep hue/chroma close) and re-check.

### 2. Generate the full `50–950` ramp
Never ship just `/500`. Generate all 11 steps from the anchor hue using OKLCH lightness steps (match the existing zinc/blue lightness curve). Tools: uicolors.app, Radix, or a generation script. Preserve the role mapping in `agentic-theme.md` (e.g. `/600` = hover/icon-info, `/700` = active).

### 3. Write tokens
Edit `Tokens/primitives.tokens.json` — replace the ramp's 11 hex values. Do **not** touch semantics/components (they alias primitives and cascade automatically).

### 4. Rebuild + dark mode
```bash
cd Tokens && node sd.build.mjs        # regenerates output/css/variables.css (light-only)
```
Then update the `.dark {}` block in `agentic-ui/src/app/tokens.css` for any ramp steps used in dark overrides (see the dark-mode table in `agentic-theme.md`).

### 5. Update the reference + verify
- Update the affected ramp table(s) in `agentic-theme.md` and the "Theme at a glance" row.
- Eyeball in Storybook (toggle light/dark) — check Button, Badge, links, focus ring.

---

## Output

Report per input color: contrast verdict, the final 11-step ramp (hex), and any `/500`→`/600-700` mitigation applied. State which files changed and whether `sd.build.mjs` + the `.dark` block were updated.

---

## Rules

- **Contrast gate is mandatory** — never apply a `/500` under 3:1.
- **Whole ramp, never one step** — a lone `/500` breaks hover/subtle states.
- **Primitive layer only** — never hardcode hex into semantics/components.
- **Status colors keep their meaning** — re-theme brand/neutral freely; change status only on explicit request.
- **Yellow exception** — warning fills use dark text (zinc/900); icons/text use `/700`. Any low-luminance status color follows the same darker-step rule.
- **Propose before applying** — show the generated ramps + verdicts and wait for approval before editing token files.
