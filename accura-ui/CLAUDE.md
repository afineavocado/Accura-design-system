@AGENTS.md

---

## Design System — Read Before Any UI Work

This repo implements the **Accura design system** — a **re-theme of the Agentic Design System**, not a separate system.

That split matters:

| Layer | Source of truth | Applies to Accura? |
|---|---|---|
| **Rules** — naming, semantic layer, paired-surface rule, spacing scale, layout, dark mode | `../docs/design-system-rules.md` | **Inherited unchanged** |
| **Values** — brand ramp, sidebar, radius usage, type | `../accura-theme.md` | **Accura-specific** |

**Read `../accura-theme.md` before touching tokens.** It documents every deviation, the reasoning, and 11 open questions that must not be silently "fixed".

Everything lives in this repository — no external vault, no absolute paths.

**Start at `../llms.txt`** — the navigation index for the ruleset, component specs, machine-readable `.meta.json` artifacts, skills and tracking docs.

> ⚠️ `../docs/design-system-rules.md` carries Agentic's **values** as well as its rules. Follow the rules; take values from `../accura-theme.md`. Its override header lists every conflict.

### Before writing or modifying any UI code

1. Read `../llms.txt` to find the relevant spec file(s).
2. Read the component's spec (`../docs/component-specs/[Name].md`) and/or `../docs/machine-readable/artifacts/components/[name].meta.json` for variants, tokens and behaviour.
3. Use only `var(--...)` tokens already defined in `src/app/tokens.css` — never hardcode hex/px for colours, spacing or radius.
4. Cross-check `../docs/tracking/Storybook Status.md` for known parity gaps — but note it reflects **Agentic's** status, not Accura's.

---

## Accura-specific gotchas

**Do not "fix" these — they are intentional or accepted:**

- **Brand anchors at `/800-base` (`#008852`), not `/500`.** Green can't clear the 3:1 contrast floor at `/500` (2.50:1). `/800` measures 4.59:1. This is the contrast rule applied correctly.
- **The sidebar is dark teal** (`#00393f`) with light text — not Agentic's light zinc panel.
- **Buttons are pills** (`radius 9999`), not 8/12px.
- **Figma renders SF Pro; code renders Inter.** A known, accepted mismatch. Type will not match pixel-for-pixel between Figma and Storybook. Do not adjust components to close that gap.

**Two known risks, logged as open questions — flag, don't unilaterally change:**

- `color/ring` uses `brand/500` (`#17bb77`) = **2.50:1 vs white**, below the WCAG 1.4.11 3:1 floor for focus indicators (Q11).
- Status borders sit at 300/400 steps — `border/error` is red/300 (`#fca5a5`), very faint for an error signal (Q10).

---

## Tokens are generated, not hand-written

`src/app/tokens.css` is produced from the Figma variables in `[Accura] Agentic Design System`. If you hand-edit it, the next regeneration overwrites you. Change the Figma variable instead, then regenerate.

Two traps when regenerating (both were hit on the first build):

1. **Component tokens have no Dark mode** — they alias semantics, which do. Resolve *through* the alias with the wanted mode, or light values land in `.dark`.
2. **Figma names may contain spaces / mixed case** (`button/size/Button radius 1`) — invalid as CSS custom properties. Normalise to lowercase-kebab, or PostCSS discards the whole stylesheet and Storybook renders blank.

---

## ⚠️ Fork warning

This is a **fork** of `agentic-ui` — all 36 components are duplicated. A component fix here does **not** reach `agentic-ui`, and vice versa. Apply changes in both, or they drift. Only tokens were intended to diverge.
