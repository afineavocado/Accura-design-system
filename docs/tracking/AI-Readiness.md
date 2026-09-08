# AI-Readiness — Accura

Assessed against the 15-factor framework used for Agentic
(`Agentic-design-system/AI Readiness/AI-Readiness Roadmap.md`), re-scored for **Accura's own
state**. Agentic's score does not transfer: it certifies Agentic's Figma file and Agentic's
values.

**Assessed:** 2026-09-08

---

## Counts, measured not claimed

| | Accura |
|---|---|
| Component specs (`docs/component-specs/*.md`) | 39 |
| `.meta.json` artifacts | 37 |
| Storybook stories | 36 |
| `.tsx` components | 39 |
| `.examples.tsx` | **0** |
| Tokens | 228 primitives · 115 semantics · 47 components = **390** |
| CSS custom properties | 345 (450 declarations incl. `.dark`) |
| Components audited R1–R8 **in Accura's Figma** | **0** |
| Stories verified **against Accura** | 3 |

---

## 15-Factor Assessment

| # | Factor | Status | State in Accura |
|---|---|---|---|
| 1 | Machine-readable metadata | 🟡 | 37 `.meta.json` present, but **inherited from Agentic** and re-verified only for the components touched since the fork. One orphan: `chat-bubble.meta.json` points at a deleted story. |
| 2 | Code-first usage examples | ❌ | **None.** Agentic has 33 `.examples.tsx`; Accura has 0. Largest single gap. |
| 3 | Design decisions with rationale | ✅ | Inherited docs plus `accura-theme.md` §1–§8, which records *why* each value moved and logs 11 open questions. |
| 4 | `llms.txt` | ✅ | Present and accurate as of this assessment (counts corrected 2026-09-08). |
| 5 | Consistent naming | ✅ | Inherited unchanged — kebab-case, `Type=` / `Size=` / `State=`. |
| 6 | Semantic props and variants | ✅ | Inherited unchanged. |
| 7 | Three-tier token architecture | ✅ | Primitives → Semantics → Components, live in Figma and exported. Accura permits component→primitive aliases (`stepper/border`) and fixed values (`checkbox/radius`) — a deliberate, documented rule deviation. |
| 8 | Composition explicit | ✅ | Structure + slot sections in every spec. |
| 9 | DTCG tokens | ✅ | 390 tokens across 3 DTCG files, Style Dictionary v5 → CSS + Tailwind v4 + ES module. |
| 10 | Figma Code Connect | ✖ | Not applicable — needs a published npm package linked to the Figma file. Same as Agentic. |
| 11 | Programmatically accessible examples | 🟡 | 36 stories build and run, but **only 3 verified against Accura's values**. The other 33 carry Agentic's verification, which does not transfer — the brand ramp, sidebar, button radius, status borders and now the radius scale and heading font all changed. |
| 12 | Accessibility structured | ✅ | Accessibility sections in every spec. |
| 13 | Usage tracking | 🟡 | **Now unblocked.** Agentic marked this ❌ "requires code repo"; Accura has one (public GitHub). Not built. |
| 14 | Source of truth hierarchy | ✅ | `CLAUDE.md` + `llms.txt` + the override table at the top of `docs/design-system-rules.md`. |
| 15 | Breaking changes + migration | ✅ | `CHANGELOG.md`, built from real git history. |

**Score: 9 ✅ · 3 🟡 · 1 ❌ · 1 ✖ · 1 (F13) newly unblocked**

Agentic scored 13 ✅. The gap is not regression — it is that **verification is per-system**, and
Accura has not yet re-earned the ticks it inherited.

---

## Why documents drift here — root cause, 2026-09-08

The question that prompted this assessment: *"all I do is change token values, the aliases
don't change — what causes the drift?"*

**The alias graph never drifts.** Figma → `*.tokens.json` → `tokens.css` propagates on its own.
Changing `radius/base` correctly re-resolves every downstream alias with no edits.

Drift comes from **denormalised copies of resolved values**, and there are exactly three kinds:

| Kind | Example | Rots when |
|---|---|---|
| Resolved value restated beside a token name | `radius: radius/lg (8px)` in a spec | any primitive value changes |
| Counts | `llms.txt`: "470 CSS custom properties" (actual 345), "46 component tokens" (actual 47) | anything is added or removed |
| Vendored upstream values | Agentic's radius scale inside `docs/design-system-rules.md` | Accura's values move away from Agentic's |

The token *name* in those docs stays correct forever. The number in parentheses is a snapshot
that goes stale silently — nothing errors, nothing fails to build, and a reader trusts it.

**A value-only change is therefore the operation that produces the most doc drift**, which is
exactly why it feels safe. The base-12 radius rescale invalidated 8 restated values across 8
specs in one edit.

### Why nothing caught it

`docs/machine-readable/drift-check.mjs` existed to prevent this and **had never once run in
Accura**. It computed the repo root as its own parent directory — correct when the script sat at
`Machine Readable/` in Agentic, wrong at `docs/machine-readable/` here — so it crashed on line 1
looking for `docs/llms.txt`. It also still pointed at `agentic-theme.md`, `Tokens/`,
`agentic-ui/src/app/tokens.css` and `agentic-ui/src/stories`.

This is the **third** fork-broken script found, after `validate-artifacts.mjs` (hardcoded
`agentic-ui` path) and `validate-contrast.mjs` (matched `.foreground`, which the export writes as
`-foreground`, so it reported success while checking zero pairs).

> **Lesson for any fork:** a validation script that fails open is worse than no script. All three
> reported success or silence while checking nothing. When forking, run every script and confirm
> it *finds* something before trusting a green result.

Fixed 2026-09-08: paths corrected, plus a new **check 6** that verifies every px value restated
beside a token name still matches that token. It immediately found two stale values that manual
grep had missed (`Button-group.md`, `Empty.md`).

**Run it before every commit that touches tokens or specs:**

```bash
node docs/machine-readable/drift-check.mjs
```

---

## Priority gaps

1. **F2 — no `.examples.tsx`.** 0 of 39. This is what an agent reads to learn correct composition; specs describe, examples demonstrate.
2. **F11 — 33 stories unverified against Accura.** Tracked in `docs/tracking/Storybook Status.md`.
3. **R1–R8 audits — zero run against Accura's Figma file.** Tracked in `docs/tracking/Audit Status.md`.
4. **F1 — `chat-bubble.meta.json` orphan.** The one error `validate-artifacts.mjs` still reports.
5. **11 open questions** in `accura-theme.md` (Q1–Q11) remain unresolved by design.

---

## Health check — run all four

```bash
node docs/machine-readable/drift-check.mjs          # docs vs tokens
node docs/machine-readable/validate-artifacts.mjs   # meta.json integrity
cd tokens && node validate-contrast.mjs             # paired-surface contrast
cd accura-ui && npx tsc --noEmit                    # app typecheck
```
