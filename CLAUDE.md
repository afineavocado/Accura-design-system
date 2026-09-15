# Accura — Agent Instructions

**`README.md` says what this repository is, what is in it, and how to run it. Read that first;
this file does not repeat it.** What follows is only what an agent needs that a human reader
does not.

`llms.txt` indexes every file and states the read order.

## Values come from code, not from prose

| Question | Answer |
|---|---|
| What ships? | `accura-ui/src/app/tokens.css` — 351 tokens, the runtime source of truth |
| Does the export still agree? | `node tokens/token-parity.mjs` |
| Do the docs still agree? | `node docs/machine-readable/drift-check.mjs` |
| What does a component actually do? | `accura-ui/src/components/ui/<name>.tsx`, then its story |

Resolve any conflict in that order: **component → story → spec → meta.json.** The last two are
hand-written and have been wrong. On 2026-09-15 a form label gap was read from `Input.md`,
defended across three rounds of "this looks odd", and the answer was in the Storybook story the
whole time. When they disagree, say so out loud and fix the written one.

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

Audit against what rendered, not against what you wrote, and compare with the sibling screen that
already does the same job.

## Do not silently resolve open questions

`accura-theme.md` logs 11 questions numbered Q1–Q12 (Q3 is unused). **Q8, Q11 and Q12 carry
decisions** — read the entry before assuming one is open. **Q10 does not**: it was answered in
conversation and never recorded, so it is still open.

`flow/training-module.md` logs 24 more, and `flow/deviation-spec.md` logs its own findings with
two retractions. Flag them; never "fix" one without being asked.

## Scope

Build what was asked. Do not add screens, actions, data or flows nobody requested, and do not
commit, push or deploy unless asked.
