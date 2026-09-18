# Session wrap — bring every document up to date

**Trigger:** the user says *wrap the session*, *wrap up*, or *we're done today*. That phrase is the
whole instruction. Do not ask which documents; finding them is the job.

**Why this exists.** On 2026-09-18 an end-of-day check found five stale facts across `llms.txt`
and `CLAUDE.md` — a warning about a file deleted the day before, a count off by five, a rule the
day's decisions had reversed — and only because the user asked. The rules for what to update were
already written down (`CLAUDE.md` → *When you change something*). Nothing ran them.

---

## 1. Find what changed

```bash
git log --oneline origin/main..HEAD      # committed, not pushed
git status --short                       # not committed
git diff --stat origin/main              # every file touched this session
```

Work from the file list, not from memory of the conversation. The session summary misses the
change made in passing, and that is the one that goes stale.

## 2. Map each change to the documents it owns

Walk `CLAUDE.md` → *When you change something, what else has to change* against the list. It is
the authority; the rows below are the ones it does not spell out.

| Changed | Also update |
|---|---|
| A prototype screen | its `flow/<module>-spec.md` — the section for that screen |
| A shared prototype component (`prototype/accura/*.tsx`) | `accura-design-patterns.md` → *Shared prototype components* · `llms.txt` |
| A rule learned the hard way | `accura-design-patterns.md` if it is about the UI; `accura-prototype-build.md` if it is about how to work |
| A file added, moved, renamed or deleted | `llms.txt` · `README.md` if it is in a table there · grep the old path repo-wide |
| A count — components, stories, specs, `meta.json`, tokens | every file that states it: `README.md` · `llms.txt` · `AI-Readiness.md` · `Storybook Status.md` · `CLAUDE.md` |
| A decision on something flagged open | the question's entry, marked answered with the date · every file quoting the old position |
| Where the work stands | `.claude/commands/accura.md` → *Where the work is* |
| How I should work | `~/.claude/projects/…/memory/accura.md` — that file only |

## 3. Update — concise, and in the document's own shape

- **If the document has a template, follow it.** Component specs: `docs/component-specs/_template.md`.
  `meta.json`: `docs/machine-readable/meta-artifact-template.md`. Module specs: the section shape
  the other `flow/*-spec.md` files already use. CHANGELOG: *what changed, what it was before, why*.
- **If it has no template, match its existing entries** — length, heading level, tone.
- **Say it once.** Link to the file that owns a fact rather than restating it; restated values are
  what drift. Never hand-type a px value beside a token name — `sync-doc-values` generates those.
- **The CHANGELOG is for the design system, not a work diary.** Only changes that affect someone
  who did not make them. Never rewrite a past entry; append a dated correction.
- **No em dash in UI copy.** In docs it is fine.

## 4. Sweep for stale facts

Changes are not the only thing that goes out of date — a new fact makes an old one wrong somewhere
else. Before gating, grep for:

- **every count** you changed, as its old number
- **every path** that moved, by its old name
- **every rule** the session reversed, by its wording

On 2026-09-18 this found `llms.txt` still warning that `chat-bubble.tsx` existed with no story, a
day after the component was deleted.

## 5. Gate

```bash
node docs/machine-readable/sync-doc-values.mjs --write
node docs/machine-readable/drift-check.mjs
node docs/machine-readable/validate-artifacts.mjs
node tokens/token-parity.mjs
node accura-ui/src/app/prototype/accura/change-control/check-mock-data.mjs
```

A red gate that was red before the session is not the session's to fix — but if it is not already
in `CLAUDE.md` → *Known debt*, it goes there now.

## 6. Commit

Saying *wrap* authorises committing the documentation. It does **not** authorise pushing; git's
network is blocked here and the user pushes from GitHub Desktop.

## 7. Report — short

- **Updated:** each document, one line each, with what changed in it
- **Deliberately not updated,** and why — a one-line reason per file
- **Not looked at:** anything visual. Visual review is the user's
- **To push:** the commit count

No summary of the session's work; the user was there.
