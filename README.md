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
| **`CLAUDE.md`** | Agent instructions — where values come from, how to verify, what not to touch. Deliberately does not repeat this file. |
| **`accura-theme.md`** | The theme reference — every token value, every deviation from Agentic, the reasoning, and 12 logged questions — 4 now decided. |
| **`docs/design-system-rules.md`** | The design rules, with Accura's values inline. Reasoning and open questions live in `accura-theme.md`. |
| `docs/skills/` | 7 process skills — audit, build, token binding, documentation, Storybook, component implementation, prototype build. |
| `docs/component-specs/` | 39 spec files — 37 components, plus `_template.md` and `Form-shared.md`. |
| `docs/machine-readable/` | 38 `meta.json` artifacts, component directory, quick reference, validation scripts. |
| `docs/tracking/` | Storybook and audit status. ⚠️ Reflects Agentic's status, not Accura's. |
| `tokens/` | DTCG export of Accura's tokens, plus `token-parity.mjs` — the check that says whether it still matches what ships. See `tokens/README.md`. |
| **`accura-ui/`** | Component library + Storybook. Same components as `agentic-ui`, Accura tokens. |
| **`flow/`** | Module specifications — what each prototype is, what the brief asked for, and the open questions. `training-module.md` (24 questions), `domain/training-module.md`, `capa-prototype-spec.md`, `deviation-spec.md` (as-built record of the live Deviation screens) and the source briefs in `flow/brief/`. |
| `docs/demo-scope.md` | What the demo covers and what is deferred. Component patterns live in the prototype-build skill. |
| `docs/team-workflow.md` | **(Tiếng Việt)** Branch + PR workflow for two people working on different modules. Daily routine, shared-file list, conflict handling. |
| `CHANGELOG.md` | Every Accura-specific change, breaking ones called out. |

The repository is **self-contained** — no external vault, no absolute paths. A fresh agent can clone it and work.

---

## Quick start

```bash
cd accura-ui && npm install

npm run storybook   # component library  → http://localhost:6007
npm run dev         # prototypes         → http://localhost:3001
```

> ⚠️ **If a route looks stale or "missing" after pulling, delete the build cache:**
> `rm -rf .next && npm run dev`. Next.js caches compiled routes in `accura-ui/.next`, which is
> gitignored — so a machine that has run this repo before can keep serving old pages while the
> files on disk are correct. This reads exactly like "git didn't pull the latest". It is not git.

> **The Next app lives in `accura-ui/`, not at the repo root.** Everything below assumes you are in that folder.
> No `--legacy-peer-deps` flag needed — `accura-ui/.npmrc` sets it. Storybook 10 declares peers against React 18 while this app runs React 19 and Next 16, so a plain install would otherwise fail with `ERESOLVE`.

Storybook uses 6007 because Agentic's uses 6006, so both can run side by side.

### Where to look

| | |
|---|---|
| **Every component** | Storybook, **:6007** — 37 stories. This is the design system. |
| **The prototypes** | **:3001** — three modules, one app. `/` redirects to CAPA. |

**All three share one sidebar**, so you can click between them. Add a module to `platformNav`
in `prototype/accura/app-sidebar.tsx`, never in a page.

```
/prototype/accura/capa                     CAPA — listing, create, detail
/prototype/accura/documents                Documents — listing, detail
/prototype/accura/training                 Training — Users
/prototype/accura/training/roles           Roles — list, detail, create, edit
/prototype/accura/training/courses         Courses — list, detail, create, edit
/prototype/accura/training/assessments     Assessments — list, detail
/prototype/accura/training/review          Review queue — approve / reject with e-signature
```

| Module | Spec | State |
|---|---|---|
| **CAPA** | `flow/capa-prototype-spec.md` | listing, create, detail |
| **Training** | `flow/training-module.md` | five tabs built. Trainee screens and the workflow behind Review are not |
| **Documents** | `accura-ui/src/app/prototype/accura/documents/README.md` | one happy path: Draft → In Review → In Approval → Approved |

**Before extending any prototype, read both skill files in
[`docs/skills/accura-prototype-build/`](docs/skills/accura-prototype-build/):
[`accura-design-patterns.md`](docs/skills/accura-prototype-build/accura-design-patterns.md) for
what to build, and
[`accura-prototype-build.md`](docs/skills/accura-prototype-build/accura-prototype-build.md) for
how to work.** The patterns file records the conventions every module follows — shared shell,
clickable rows, `CardTitle`, create-screen shape, tables versus lists — and the components that
are knowingly hand-rolled, with the reason.

> Documents persists to `localStorage` and `IndexedDB`, so it seeds fresh in a new browser and
> keeps anything you create. Training and CAPA are mock data only, reset on reload.

> There is **no home screen** beyond that redirect. The app exists to host the
> prototype; the component library lives in Storybook. If `/` 404s, you are on a
> commit before this was added — it is not a missing feature to build.

### Deploying

**Set the project's root directory to `accura-ui`.** This is the setting people miss.

The repository root holds the design system — `docs/`, `tokens/`, `flow/` — and has **no
`package.json`**. A platform pointed at the repo root finds no application, builds nothing,
and serves an empty site, so **every route returns 404 including `/`**. It looks like the app
is broken; it was never built.

| Setting | Value |
|---|---|
| Root directory | `accura-ui` |
| Framework | Next.js (auto-detected once the root is right) |
| Install / build | defaults — `.npmrc` handles the peer resolution |

A deployment serves **the prototypes** — CAPA, Documents and Training. Storybook is a separate
build (`npm run storybook`) and is not included; publishing the component library means a
second deployment.

> The prototype runs on mock data and includes a simulated 21 CFR Part 11 e-signature screen.
> It is a design artefact, not a working quality system — worth being deliberate about before
> putting it on a public URL.

---

## The theme in one table

| Lever | Agentic | Accura |
|---|---|---|
| Brand hue | Blue — anchor `/500` `#2b7fff` | **Green — anchor `/800-base` `#008852`** |
| Neutral | Zinc `/50–/950` | Zinc — identical |
| Radius base | `8px` | **`12px`** — Accura is a rounder system |
| Spacing base | `4px` linear | `4px` linear — identical |
| Type | Inter | Body **Inter** · headings **Albert Sans** |

Beyond the primitive levers, Accura also diverges at the semantic tier — a **dark teal sidebar** (`#00393f`) and **pill buttons** (`radius 9999`). Those are easy to miss, because comparing primitives alone reports no change.

---

## Why the brand anchors at /800

Agentic's rule is that brand primary anchors at `/500`. Accura anchors at `/800-base`. That looks like a violation and isn't.

The inherited theme rule requires a brand anchor to clear **3:1 against white** (WCAG 1.4.11), ideally 4.5:1:

| Candidate | Hex | vs white | Verdict |
|---|---|---|---|
| `brand/500` | `#17bb77` | **2.50:1** | ❌ rejected — below the floor |
| `brand/800-base` | `#008852` | **4.52:1** | ✅ fill **and** small text |

Green is intrinsically lighter than blue at the same ramp step, so `/500` can't clear the floor. Moving the anchor is the rule working as designed — and it makes Accura's brand *more* accessible than Agentic's blue (3.8:1, fill-only).

---

## Two things to know before contributing

**1. `accura-ui` is a fork.** All 39 components are duplicated from `agentic-ui`, and 11 of them have already diverged. A fix here does not reach Agentic, and vice versa. Only tokens were meant to differ — see `accura-ui/README.md` for which components drifted.

**2. `accura-ui/src/app/tokens.css` is what ships.** It was originally generated from a Figma
file, but that is provenance rather than process — nothing here requires opening Figma. The DTCG
export in `tokens/` is a snapshot; `node tokens/token-parity.mjs` says whether it still agrees
with what ships, and names every difference that has no recorded reason.

---

## Open questions

Questions are logged rather than silently resolved. `accura-theme.md` holds 11 about the
theme; `flow/training-module.md` holds 24 about the Training module. **Flag them — never "fix"
one without being asked.**

The load-bearing theme questions:

- ~~**Q8 — two Accura libraries have measurably drifted.**~~ **Resolved 2026-09-14: `[Accura One] WebApp` is canonical.** The `(beta) (Copy)` library it does not use is still live, so retiring it remains outstanding.
- ~~**Q11 — the focus ring may fail WCAG.**~~ **Accepted 2026-09-14:** the ring stays at `brand/500`, 2.50:1, knowingly below the 3:1 floor.
- **Q10 — status borders are very pale.** `border/error` is red/300 (`#fca5a5`).

---

*Design system rules: [`docs/design-system-rules.md`](docs/design-system-rules.md) — Accura's values inline; reasoning in `accura-theme.md`
Agent entry point: [`llms.txt`](llms.txt) · [`CLAUDE.md`](CLAUDE.md)
Values source of truth: `accura-ui/src/app/tokens.css` — check the export with `node tokens/token-parity.mjs`*
