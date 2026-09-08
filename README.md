# Accura Design System

A **re-theme of the Agentic Design System** — not a fork of its rules.

Naming conventions, the semantic token layer, the paired-surface rule, the spacing scale and dark-mode architecture are all inherited from Agentic **unchanged**. Only the primitive and semantic *values* differ.

> A theme = **{ brand ramp · neutral ramp · radius base · spacing base · type ratio }**

Of those five levers, Accura moves **two**: the brand hue and the typeface.

---

## What's here

| Path | What it is |
|---|---|
| **`llms.txt`** | **Agent entry point** — indexes every file and states the read order. |
| **`CLAUDE.md`** | Agent instructions and the rules-vs-values precedence. |
| **`accura-theme.md`** | The theme reference — every token value, every deviation from Agentic, the reasoning, and 11 open questions. |
| **`docs/design-system-rules.md`** | The inherited ruleset, vendored from Agentic. **Contains Agentic's values — see its override header.** |
| `docs/skills/` | 7 process skills — audit, build, token binding, documentation, Storybook, theming. |
| `docs/component-specs/` | 38 component spec files (36 components + template + shared form parts). |
| `docs/machine-readable/` | 36 `meta.json` artifacts, component directory, quick reference, validation scripts. |
| `docs/tracking/` | Storybook and audit status. ⚠️ Reflects Agentic's status, not Accura's. |
| `tokens/` | DTCG token JSONs + Style Dictionary build. ⚠️ Agentic's exported values — see `llms.txt`. |
| **`accura-ui/`** | Component library + Storybook. Same components as `agentic-ui`, Accura tokens. |
| `CHANGELOG.md` | Every Accura-specific change, breaking ones called out. |

The repository is **self-contained** — no external vault, no absolute paths. A fresh agent can clone it and work.

---

## Quick start

```bash
cd accura-ui && npm install --legacy-peer-deps && npm run storybook
```

Storybook runs on **http://localhost:6007** (Agentic's uses 6006, so both can run side by side for comparison).

---

## The theme in one table

| Lever | Agentic | Accura |
|---|---|---|
| Brand hue | Blue — anchor `/500` `#2b7fff` | **Green — anchor `/800-base` `#008852`** |
| Neutral | Zinc `/50–/950` | Zinc — identical |
| Radius base | `8px` | **`12px`** — Accura is a rounder system |
| Spacing base | `4px` linear | `4px` linear — identical |
| Type | Inter | Figma **SF Pro** · code **Inter** ⚠️ |

Beyond the primitive levers, Accura also diverges at the semantic tier — a **dark teal sidebar** (`#00393f`) and **pill buttons** (`radius 9999`). Those are easy to miss, because comparing primitives alone reports no change.

---

## Why the brand anchors at /800

Agentic's rule is that brand primary anchors at `/500`. Accura anchors at `/800-base`. That looks like a violation and isn't.

The inherited theme rule requires a brand anchor to clear **3:1 against white** (WCAG 1.4.11), ideally 4.5:1:

| Candidate | Hex | vs white | Verdict |
|---|---|---|---|
| `brand/500` | `#17bb77` | **2.50:1** | ❌ rejected — below the floor |
| `brand/800-base` | `#008852` | **4.59:1** | ✅ fill **and** small text |

Green is intrinsically lighter than blue at the same ramp step, so `/500` can't clear the floor. Moving the anchor is the rule working as designed — and it makes Accura's brand *more* accessible than Agentic's blue (3.8:1, fill-only).

---

## Two things to know before contributing

**1. `accura-ui` is a fork.** All 36 components are duplicated from `agentic-ui`. A component fix here does not reach Agentic, and vice versa. Only tokens were meant to diverge.

**2. `tokens.css` is generated, not hand-written.** It comes from the Figma variables in `[Accura] Agentic Design System`. Edit the Figma variable and regenerate; hand edits get overwritten.

---

## Open questions

`accura-theme.md` logs 11 unresolved questions rather than silently resolving them. The load-bearing ones:

- **Q8 — two Accura libraries have measurably drifted.** `[Accura One] WebApp` and `[Accura One] Website Design` consume *different* libraries whose shared token names now hold different values (sidebar background, button radius). One should be retired.
- **Q11 — the focus ring may fail WCAG.** `color/ring` is `brand/500` at 2.50:1 against white, below the 3:1 floor for non-text indicators.
- **Q10 — status borders are very pale.** `border/error` is red/300 (`#fca5a5`).

---

*Design system rules: [`docs/design-system-rules.md`](docs/design-system-rules.md) — vendored from Agentic, values overridden by `accura-theme.md`
Agent entry point: [`llms.txt`](llms.txt) · [`CLAUDE.md`](CLAUDE.md)
Values source of truth: Figma `[Accura] Agentic Design System`*
