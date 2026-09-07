# accura-ui

Component library and Storybook for the **Accura design system** — a re-theme of the Agentic Design System.

Same components as `agentic-ui`, different tokens. The rules (naming, semantic layer, spacing scale, paired-surface) are inherited from Agentic unchanged; only the values differ.

---

## Run it

```bash
npm install --legacy-peer-deps
npm run storybook
```

| | Port | Why |
|---|---|---|
| Storybook | **6007** | Agentic's uses 6006 — both can run at once for comparison |
| Next dev | **3001** | Agentic's uses 3000 |

> `--legacy-peer-deps` is required: `@storybook/addon-themes@10.4.6` peer-requires `storybook@^10.4.6`, and the resolved tree doesn't satisfy it. This is inherited from `agentic-ui`.

---

## What's different from `agentic-ui`

Only `src/app/tokens.css`. Every component `.tsx` is identical.

| | Agentic | Accura |
|---|---|---|
| Brand primary | `#2b7fff` blue | **`#008852`** green |
| Brand anchor | `/500` | **`/800-base`** |
| Sidebar background | `#fafafa` light | **`#00393f`** dark teal |
| Button radius | `12px` / `8px` | **`9999px`** (pill) |
| Status borders | 500/700 steps | 300/400 steps (paler) |
| UI font | Inter | Inter *(Figma says SF Pro — known mismatch)* |

Full detail and rationale: **`../accura-theme.md`**.

---

## Tokens

`src/app/tokens.css` is **generated from the Figma variables**, not hand-edited. It carries 29 light overrides, 10 dark overrides, 5 dark overrides Agentic didn't need, and 3 Accura-only tokens.

Theme switching is class-based — `:root` for light, `.dark` for dark, toggled by `@storybook/addon-themes`.

### Regenerating — two traps

1. **Component tokens have no Dark mode.** They alias semantics, which do. Resolve *through* the alias chain with the wanted mode. Falling back to the Light value writes light colours into `.dark` — white outline buttons, tooltips that don't invert.

2. **Figma names can contain spaces and mixed case** (`button/size/Button radius 1`). CSS custom properties allow neither. Normalise to lowercase-kebab. Get this wrong and PostCSS throws `Unknown word` and **discards the entire stylesheet** — Storybook loads with no CSS and renders blank.

---

## Working on components

Read `CLAUDE.md` first. Short version:

- Use only `var(--...)` tokens from `src/app/tokens.css` — never hardcode hex or px for colour, spacing or radius.
- Spacing uses Tailwind utilities (`gap-2`, `p-4`), **not** CSS-variable arbitrary values — those are unreliable inside CVA strings in Tailwind v4 JIT.
- Icons come from `@untitledui/icons`, never `lucide-react`.
- `aria-invalid` must be `{condition || undefined}` — passing `false` still renders the attribute and triggers the invalid styling.

---

## ⚠️ This is a fork

`accura-ui` duplicates all 36 components from `agentic-ui`. **Any component fix must be applied in both repos**, or they drift apart. Only the tokens were meant to diverge.

If that becomes painful, the alternative is a shared component library with two token layers.
