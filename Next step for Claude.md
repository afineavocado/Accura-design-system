Execute bullet by bullet, dont execute if the bullet require user decision
Delete this document after finish. Mark done with the one you fix

## Change-control
1. The list in change control need to show all statuses as mockdata, i dont see draft status. — **DONE.** All seven statuses are in the seed data (Draft is CC-2026-003) and the list renders all seven. The reason it could vanish in *your* browser: a `localStorage` tombstone written by the old row menu, which was removed on 17 Sep, so the record stayed hidden with no way back. Tombstones are gone.
2. The detail of each change control need to present all situation of every sections. — **DONE.** Microbiology now owns three actions (Open · In Progress · Done) with two comments and two files on one; priorities span Low–Critical; CC-2026-003 has no risk assessment so the empty state renders. `check-mock-data` still green.

## Prototype audit
1. are E-signature model consistent with one pattern ? If not, we need to doc them and switch them to 1 form — **DOCUMENTED, not unified** (your call). Three implementations: the shared modal (Documents, Deviations, Change Control), CAPA's own, and Training review's own. Table of every difference in `accura-design-patterns.md` §4. **Training's confirm button ignores the password** — that one is a defect, not a preference.
2. Audit all tokens, text hierchy, everything, check for em dash, use audit skill for the whole prototype — **DONE (mechanical pass).** Spacing literals across Training/Settings/CAPA/Knowledge Hub: 165 → 27, tokens 175 → 313. Every `h-N w-N` icon → `size-N` (59 occurrences, 23 files). Ten em dashes out of user-facing copy. Training's overdue/rejected text was `status/danger-subtle/foreground` on a white background — the paired-surface rule — now `text/invalid`, which is what Deviations already rendered.
3. Fix the time stamp, flag any data format that has different UI — **DONE, half flagged.** All four formatters unified on `en-US` (`Oct 8, 2026` · `Sep 20, 2026, 08:45:00 UTC`); `en-GB` was where `Sept` came from; Documents' empty date `Not set` → `—`. **Flagged, not converted:** 30 dates stored as display strings in Change Control and 6 in CAPA bypass every formatter — listed in `accura-design-patterns.md` → Dates and times.

## Flow document
There are two many documents in this folder Flow, and they dont follow anything. Also the mockdata file probably missing other module. Information of the document need to be keep precisely
1. Fill the mockdata file to following the prototype — **PARTLY ANSWERED** (two readings, see reply). Coverage measured: Deviations 10 seeds / 7 statuses ✓ · CAPA 6 / 6 (one reads `Close`, not `Closed`) · Documents 6 seeds but only 4 of its statuses · Settings 2 users (`Active`, `Invited`) · Knowledge Hub folders only · Training split across five arrays with four status vocabularies.
2. Read all documents in Flow, rewrite 1 doc for each module, show me the pattern and suggest me the template. — **DONE for the three modules that had none.** `settings-spec.md`, `knowledge-hub-spec.md`, `documents-spec.md` written as-built, each ending in numbered questions. CAPA left alone as you said. Deviations, Change Control and Training already have one; the source briefs stay where they are.

## Design system
**DONE.** `chat-bubble` deleted entirely — component, spec and meta.json — and removed from CLAUDE.md, AI-Readiness and Storybook Status. Verification and fork-drift left as they were. `validate-artifacts` now passes; `drift-check` is back to the single deferred `RecordRowAction` red.


## Tomorrow

1. ~~**Record the mock data for Deviations and Training.**~~ — **DONE 2026-09-18.** `flow/deviation-spec.md` §15 and `flow/training-spec.md` §12, in the same shape as the other five. Three corrections came out of writing them, below.

2. ~~**Clear the `RecordRowAction` red.**~~ **DONE 2026-09-18** — promoted to `components/ui/` with a spec and a `meta.json`. `drift-check` is green for the first time.

3. Still open, both need your decision:
   - **R1–R8 component audits.** The skill that defines them is Figma-only and we do not work in
     Figma. If they are permanently out of scope, the verification debt in `CLAUDE.md` and
     `docs/tracking/AI-Readiness.md` should say so rather than carry a ❌ against a process nobody
     can run.
   - ~~**Documents' three code-adjacent files.**~~ **ANSWERED 2026-09-18: folded in and deleted**,
     README kept as a stub for Chi. See `flow/documents-spec.md` §6.7.

somehow, the prototype in localhost is not the updated one, its the old one, can you check pls ?