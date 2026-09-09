# Accura Design System — Agent Instructions

This repository is **self-contained**. Everything needed is here; there are no absolute paths and no external vault.

## Before doing anything

Read **`llms.txt`** — it indexes every file and states the read order.

## The one rule that prevents most mistakes

`docs/design-system-rules.md` is vendored from the Agentic Design System and contains **both rules and Agentic's values**.

- Follow its **rules** exactly — naming, semantic layer, paired-surface rule, spacing scale, layout, dark mode.
- **Ignore its values.** `accura-theme.md` is the authority on brand colour, anchor step, ring, sidebar, button radius, status borders and type.

The override table at the top of `docs/design-system-rules.md` lists every known conflict. Agentic's contrast reference table is computed against blue `#2b7fff` and is **not valid for Accura**.

## Accura in one table

| | |
|---|---|
| Brand primary | `#008852` — anchored at `/800-base`, **not** `/500` |
| Why not /500 | green measures 2.50:1 vs white, below the 3:1 floor; `/800` is 4.59:1 |
| Neutral · radius · spacing | identical to Agentic |
| Sidebar | `#00393f` dark teal panel, light foreground |
| Buttons | pills — `radius 9999` |
| Font | Figma SF Pro · code Inter (accepted mismatch) |

## Working on code

```bash
cd accura-ui && npm install && npm run storybook   # → :6007
```

Read `accura-ui/CLAUDE.md` before writing any component. Key points:

- Use only `var(--...)` tokens from `accura-ui/src/app/tokens.css`. Never hardcode hex or px for colour, spacing or radius.
- Spacing uses Tailwind utilities (`gap-2`, `p-4`), **not** CSS-variable arbitrary values — unreliable inside CVA strings in Tailwind v4 JIT.
- `aria-invalid` must be `{condition || undefined}`; passing `false` still renders the attribute.
- `tokens.css` is **generated from Figma**. Hand edits get overwritten — change the Figma variable and regenerate.

## Verify your own work

Storybook does not reliably hot-reload `.tsx` or token changes. After editing, **fully restart** (`pkill -f "storybook dev" && npm run storybook`) and re-measure in the browser. Report numbers, not impressions.

## Do not silently resolve open questions

`accura-theme.md` logs 11 open questions (Q1–Q11) — the pale status borders, the focus-ring contrast, the two divergent Figma libraries, and others. These are deliberate, recorded decisions-in-waiting. Flag them; do not "fix" them without being asked.

## Known divergences from Figma

Only `color/sidebar/ring` still differs: Figma says blue `#2b7fff`, the code uses green `#17bb77`. That is deliberate. `sidebar/accent` and `sidebar/accent/foreground` have since been reconciled in Figma. See the table at the end of `llms.txt` — regenerating tokens.css from Figma would revert the ring.
