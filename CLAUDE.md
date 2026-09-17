# Accura — Agent Instructions

**`README.md` says what this repository is, what is in it, and how to run it. Read that first;
this file does not repeat it.** What follows is only what an agent needs that a human reader
does not.

`llms.txt` indexes every file and states the read order.

## Values come from code, not from prose

| Question | Answer |
|---|---|
| What ships? | `accura-ui/src/app/tokens.css` — 360 tokens, the runtime source of truth |
| Does the export still agree? | `node tokens/token-parity.mjs` |
| Do the docs still agree? | `node docs/machine-readable/drift-check.mjs` |
| What does a component actually do? | `accura-ui/src/components/ui/<name>.tsx`, then its story |
| Does this *pattern* already exist? | grep `accura-ui/src/app/prototype/accura/` for the nouns |

Resolve any conflict in that order: **component → story → spec → meta.json.** The last two are
hand-written and have been wrong. On 2026-09-15 a form label gap was read from `Input.md`,
defended across three rounds of "this looks odd", and the answer was in the Storybook story the
whole time. When they disagree, say so out loud and fix the written one.

**That order only answers "does this component exist". It does not answer "does this pattern
exist."** Every path in it points at `components/ui/`, the stories and the specs — and a
composition assembled *out of* components (an audit entry, a state-change pill, a signature card,
a field description) almost always lives in whichever module needed it first, as a private helper
with no spec, no story and no entry anywhere. A component search comes back empty and reads like
permission to design one.

So before designing any multi-element pattern, grep the whole prototype for the nouns —
`audit`, `signature`, `status changed`, `line-through`, `description` — not just the component
directory. On 2026-09-16 the audit trail was redesigned from scratch while Training had been
rendering the product's own version for weeks; `StateChange`, `RequiredLabel` and
`FieldDescription` were all private helpers, and two of the three were reinvented before anyone
noticed. **"No component" and "no pattern" are different findings.**

Never hardcode a hex, px or radius. Use `var(--...)` from `tokens.css`.

## We do not work in Figma

Tokens were originally generated from a Figma file and the history still mentions it. Treat that
as provenance, not process. Nothing here requires opening Figma, and no task should be blocked on
it — if a value is in question, measure it in the browser or read it from `tokens.css`.

## Verify your own work

Storybook and Next both serve stale output after an edit. **Restart, then measure in the browser,
and report numbers rather than impressions.**

- `pkill -f "storybook dev" && npm run storybook`
- `rm -rf .next && npm run dev`
- ⚠️ `npm run build` deletes `.next/dev` under a running dev server. Stop dev first, or every
  route 500s with `ENOENT … routes-manifest.json`, which reads like a code error and is not.

Audit against what rendered, not against what you wrote, and compare with the sibling screen that already does the same job.

## Scope

- Build what was asked. Do not add screens, actions, data or flows nobody requested, and do not commit, push or deploy unless asked.
- No em dash in the copywriting
- When i said audit tokens, i mean all tokens : spacing, color, text style, font weight, typeface, components,.... everything must be correct and follow design system.

## Do not silently resolve open questions

`accura-decisions.md` logs 11 questions numbered Q1–Q12 (Q3 is unused). **Q8, Q11 and Q12 carry
decisions** — read the entry before assuming one is open. **Q10 does not**: it was answered in
conversation and never recorded, so it is still open.

`flow/training-module.md` logs 24 more, and `flow/deviation-spec.md` logs its own findings with
two retractions. Flag them; never "fix" one without being asked.

## When you change something, what else has to change

Work is not finished when the code runs. Each row is a thing that has gone stale here before.

| You changed | Also update | Check with |
|---|---|---|
| A **new token** | `tokens/*.json` first, then `tokens.css` (+ `.dark`) · `docs/design-system-rules.md` list **and** value table · `accura-decisions.md` §7 · CHANGELOG — the full order is `docs/skills/accura-token-change/` | `node tokens/token-parity.mjs` |
| A **token value** in `tokens.css` | `tokens/*.json` export · any doc restating it | `node tokens/token-parity.mjs` · `node docs/machine-readable/sync-doc-values.mjs --write` |
| A **component** in `accura-ui/src/components/ui/` | its story · `docs/component-specs/<Name>.md` · `docs/machine-readable/artifacts/components/<name>.meta.json` | `node docs/machine-readable/drift-check.mjs` |
| A **prototype screen** | the module's file in `flow/` | — |
| A **pattern** other screens should follow | `docs/skills/accura-prototype-build/accura-design-patterns.md` | — |
| **How to work** — an order, a gate, a trap | `docs/skills/accura-prototype-build/accura-prototype-build.md` | — |
| A **file's name or purpose** | `llms.txt` · `README.md` table | `drift-check` rule 1 (dead paths) |
| A **decision on an open question** | the `accura-decisions.md` entry · every file quoting it | grep the old value repo-wide before assuming one copy |
| **Scope** — what the demo covers | `docs/demo-scope.md` | — |

### CHANGELOG

Add an entry when the change **affects someone who did not make it**: a token value, a component's
API or behaviour, a rule, a decision on an open question, a file moving or being deleted. Say what
changed, what it was before, and why — the "before" is the part that turns out to matter.

Do not add an entry for prototype screens, copy tweaks, or internal refactors that change nothing
for a consumer. The changelog is for the design system, not a work diary.

**Never rewrite a past entry.** It records what was true when written. If it is wrong, append the
correction to it and date the correction.

### Before committing anything touching tokens or specs

```bash
node docs/machine-readable/sync-doc-values.mjs --write
node docs/machine-readable/drift-check.mjs
```

Restated px values are **generated** — never hand-type a number beside a token name. Changing a
token *value* never breaks the alias graph, which is why a value-only edit causes the most doc
drift.

## Three failures that have each happened more than once

**A green gate that is not looking.** Three inherited scripts reported success while checking
nothing — `drift-check` never ran, `validate-artifacts` had a hardcoded path, `validate-contrast`
checked 0 pairs. All fixed. **Never trust a green result until you have watched the check fail on
a planted error.**

**A second working copy.** A clone in `Documents/Codex/` re-implemented the same change twice and
git merged the result "cleanly" into a broken file. Deleted 2026-09-09. One clone, one branch.

**A stale build cache.** Covered above. It has twice made a working fix look broken, and on
another machine it appears as "git didn't pull the latest". It is `.next`, not git.

Related: untracked work is what tooling feels free to move — `flow/` once vanished because GitHub
Desktop stashed it on a branch switch. If it matters, commit it.

## Known debt — do not restate it as done

- **Verification:** `0` `.examples.tsx` · `4 of 37` stories verified · `0` R1–R8 audits ·
  `chat-bubble.meta.json` orphan. Full picture in `docs/tracking/AI-Readiness.md`.
- **Fork drift:** 11 of 39 components differ from `agentic-ui` and only `label.tsx` has a known
  reason. The rest are unaudited — diff before assuming one matches.
- `RecordRowAction.stories.tsx` has no `meta.json`, so `drift-check` rule 5 fails. Deferred
  deliberately until the modules are finished.

> **Accura scores 9 ✅ · 3 🟡 · 1 ❌ — it does not pass.** Agentic's 13 ✅ certifies *Agentic's*
> file. Never restate an inherited ✅ as if it were earned here.


