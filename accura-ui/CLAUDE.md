@AGENTS.md

---

## Design System — Read Before Any UI Work

This repo implements the **Agentic Design System**. The full spec lives in a separate Obsidian vault (not in this repo — kept out due to size):

`/Users/mac/Downloads/Obsidian/Working process - L&D/Agentic-design-system/`

**Start here:** `llms.txt` in that folder — it's the navigation index for everything: token rules, component markdown specs (33 files), machine-readable `.meta.json` artifacts, Storybook status, tracking docs.

Before writing or modifying any UI code:
1. Read `llms.txt` to find the relevant spec file(s).
2. Read the component's markdown spec (`Component Markdown (reference)/[Name].md`) and/or its `Machine Readable/artifacts/components/[name].meta.json` for variants, tokens, and behavior.
3. Use only `var(--...)` tokens already defined in `src/app/tokens.css` — never hardcode hex/px values for colors, spacing, radius, etc.
4. Cross-check against `Tracking/Storybook Status.md` for known parity gaps before assuming a story is "verified."
