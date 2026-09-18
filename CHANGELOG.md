# Changelog

All notable changes to the Accura design system.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
**Rule: every breaking change is recorded here before it ships.**

Accura is a re-theme of the Agentic Design System. Changes inherited from Agentic upstream are not logged here — only what is specific to Accura.

---

## [Unreleased]

### 2026-09-22 — One electronic signature modal, with CAPA's presentation

**Changed**

- **`ElectronicSignatureModal` is now the only signature dialog.** CAPA and Training's review queue
  each had their own; both are deleted and rewired. Identity is four icon rows — Full name · Email ·
  Role at sign-off · Timestamp UTC, each a 36px circle in a two-column grid — above a record panel
  carrying the record and its signature meaning. The shared modal previously rendered read-only
  `<Input>`s for identity, which said *you could type here* about facts the signer cannot change.

  New `tone="danger"` tints the record panel for a rejection, because a reject signature that looks
  identical to an approve signature is the wrong affordance on a regulated record.

  Settled in the merge: `Re-enter password` and `required` · the prototype "do not enter a real
  password" warning **kept**, since the other two dialogs had none · CAPA's attestation sentence ·
  `Cancel` as `outline` · the title's em dash replaced with a hyphen · the timestamp moved to the
  house format. `actionLabel` still varies by gate; only the presentation was unified.

**Fixed**

- **Training's review queue could complete a signature with the password blank.** Its field was
  marked `required` and its confirm button checked the attestation only. Closed by the rewiring —
  the shared gate requires attestation **and** a non-empty credential.

- **Change Control's department action card.** Its composer was one pill containing a `+`, a bare
  `<input>` and a `↵`, placeholdered *Upload evidences or leave comments* — one field described as
  doing something it cannot do, and that string was also its accessible name. Now a `Textarea` with
  a separate **Attach evidence** button and a **Comment** button. `Marked as completed` (past tense,
  full card width) is now `Mark as completed`, right-aligned. The evidence chip's `Download` no
  longer swaps position with a destructive `Remove`. The comment list's decorative left rail is
  gone. Raw `<button>`s are `Button variant="ghost" size="icon"`.

  Revised again the same day: the **4px brand-green left rail is gone** — it was the only thing
  distinguishing an open card from a completed one, decoration doing the status `Badge`'s job.
  Button hierarchy is now three levels rather than two — `Attach evidence` ghost, `Comment`
  outline, `Mark as completed` primary; two primaries side by side gave no default path. And the
  card's spacing was **compounding**: `mt-lg` on three blocks on top of the card's own `gap-md`
  put 28px between every section. The `mt`s are gone and the title and byline are one block, so
  the card's gap spaces sections rather than lines.


### 2026-09-18 — R1–R8 auditing retired

**Removed**

- **R1–R8 is no longer carried as debt anywhere.** The process inspects **Figma** components, and
  this project does not work in Figma, so it was never something this repo could fail at — yet it
  had been a ❌ in `AI-Readiness.md` and "the largest gap in the system" in `Audit Status.md` since
  2026-09-08.

  Cleared in `CLAUDE.md`, `llms.txt`, `AI-Readiness.md` (inventory row and priority gap),
  `Storybook Status.md`, `accura-decisions.md`, and `meta.auditRules` / `meta.lastAuditDate` in all
  38 `.meta.json` files. **Thirty-five of those carried `R1–R8` / `2026-05-28`, which were
  Agentic's audits against Agentic's file** — an audit certifies only the file it ran against, so
  they never applied here.

  `Audit Status.md` is kept as provenance: the rules, and what was observed in the Figma file
  before the decision. Its "suggested audit order" and "before starting an audit" sections are
  gone. Nothing replaces the process — `token-parity`, `drift-check`, `audit-styles` and the screen
  audit skill already check in code and browser what R1–R8 checked in Figma.

### 2026-09-18 — One empty state, shared, across all eleven listings

**Added**

- **`prototype/accura/list-empty-state.tsx`** — `ListEmptySearch` (a filtered list with no matches)
  and `ListEmptySet` (nothing to filter). Every listing now renders it: Change Control, Deviations,
  CAPA, Documents, Training's five, Knowledge Hub and Settings' two. Nine were verified in the
  browser at zero results and render identically — title, `20×20` icon, `320px` block, `Clear
  filters`. Knowledge Hub and Settings are converted and typecheck but were not reachable by the
  verification script.

  Before: four treatments. `Empty` (Change Control, CAPA) · `Empty` with the wrong variant and an
  outline button (Knowledge Hub) · a `colSpan` row of grey text (Training ×5, Settings ×2) · a
  `div` under a still-visible header (Documents) · **nothing at all** in Deviations.

**Changed**

- **`Table` takes `scroll?: boolean`** (default `true`). `false` drops `overflow-auto` from the
  wrapper while keeping the wrapper, so `useTableOverflow` and `RecordRowAction` still work.
  Change Control's registry owns its own scroll viewport so the header can pin, and the two
  containers **rendered two scrollbars on the same table**. It is the only listing that does this.

- **`Empty`'s token bindings are real.** It hardcoded `p-8`, `gap-4` and `gap-2` where `Empty.md`
  documented `spacing/component/2xl`, `/lg` and `/sm`. Identical in pixels, which is why nobody
  caught it, and exactly the drift a token rename would have exposed. The 36px media square is
  `size-9`; 36px has no token and the spec now says so.


### 2026-09-18 — One empty state for filtered lists, and it is Change Control's

**Added**

- **`accura-design-patterns.md` → Tables and lists → Empty state.** A filtered list that comes back
  with nothing replaces the table with `Empty`: `min-h-80 justify-center`, a `size-5` `Search` icon
  in `color/icon/muted`, a title naming what was not found, a description saying what to try, and
  **`Clear filters` as a default-variant `Button` inside the empty state**. `ListSummary`'s clear
  affordance above the table is not a substitute — several listings have it and still leave the
  reader facing an empty table.

  The section also separates an empty **set** from an empty **search**: no records at all wants
  different copy and usually a create action, which Training's review queue is alone in getting
  right.

  Eight listings were measured in the browser at zero results and the inventory is in the section.
  Four treatments ship today: `Empty` (Change Control, CAPA), `Empty` with the wrong variant and an
  `outline` button (Knowledge Hub), a `colSpan` row of secondary text (Training ×5, Settings ×2), a
  `div` under a still-visible table header (Documents), and **nothing at all** in Deviations — a
  bare header with pagination still rendered beneath it.

**Fixed**

- **Change Control's own empty-state icon was `h-5 w-5`**, missed by the `size-N` pass, against the
  one-icon-unit rule it is now the reference for. That and the module's three other square
  `h-N w-N` classes converted. Eight remained repo-wide before this; the four left are in
  `app-sidebar.tsx`, which is shared with Chi and untouched.


### 2026-09-18 — Seeded Change Control records always come from the seeds

**Changed**

- **`accura-ui/src/app/prototype/accura/change-control/storage.ts`** is new and owns the module's
  persistence. The registry, the detail page and the create/edit page each carried their own copy
  of the read and write helpers; all three now import from it.

  **The rule: a seeded record is never written to `localStorage` and never read back from it.**
  Before, stored records were merged ahead of the seeds by id, so a stored copy of a seeded record
  shadowed the seed permanently, in one browser, with no way back. That hid `CC-2026-003` — the
  only `Draft` in the set — so the list appeared to have no Draft at all. It is the same defect as
  the tombstone list removed on 2026-09-17, in a different shape.

  Reading also **heals**: a seeded id still sitting in storage from before the rule is dropped on
  the next load, so nobody has to clear their browser by hand. Verified by planting a stored
  `CC-2026-003` titled "POISONED COPY" with status `Closed`, reloading, and watching the seed's
  real title and `Draft` come back with 0 records left in storage.

  **What it costs:** editing a seeded record works for the session but does not survive a reload —
  the screens hold the edited record in React state, and nothing persists it. Deliberate, and the
  same choice Deviations already made: refreshing is how the demo resets. Records you create are
  not seeded and persist exactly as before.

**Fixed**

- **The Change Control `STATUS` column was 150px against a 131px pill.** The table is
  `table-layout: fixed`, so the column could not grow to its content: `Impact Assessment` measured
  130.9px inside a 118px content box, overflowed its cell by 12.9px and sat **3.1px** from the
  table border instead of 16px. `Action in Progress` and `Final QA Approval` overflowed by 4.7px
  and 2.3px. Column widened to 168px — 131 + 2 × 16px padding, rounded up — and every pill now
  clears its padding, the tightest by 5.1px. Measured in the browser before and after; the other
  four listings were checked at the same time and are clear.


### 2026-09-18 — `RecordRowAction` promoted into the design system

**Added**

- **`accura-ui/src/components/ui/record-row-action.tsx`**, moved from `components/`, with
  `docs/component-specs/RecordRowAction.md` and
  `docs/machine-readable/artifacts/components/record-row-action.meta.json`. Story title moved from
  `Patterns/RecordRowAction` — the library's only `Patterns/` entry — to `Data/RecordRowAction`,
  beside `Data/Table`.

  It is the last column of a record listing: one ghost `Eye` button that opens the row's record,
  pinning itself to the right edge on an overlay surface when the table overflows. Two consumers,
  Documents and Knowledge Hub, were already importing it.

  **`drift-check` now reports no drift for the first time.** Rule 5 keys on story files, so a
  component sitting outside `components/ui/` with a story and no `meta.json` failed it; that red had
  been carried deliberately since it was raised. Confirmed the rule is genuinely looking by moving
  the new `meta.json` aside and watching rule 5 fail, then restoring it.

**Changed**

- **Component counts corrected across five files.** 38 components, 38 stories, 38 `.meta.json`, 40
  spec files. The counts in `docs/tracking/AI-Readiness.md` were **already wrong before this
  change** — it claimed 36 stories and 39 `.tsx` against 37 and 38 — so do not read the correction
  as caused by the promotion.
- **`README.md` no longer says all components are forked from `agentic-ui`.** 37 of 38 are;
  `record-row-action` was written here and has no upstream, which is also why its `meta.json` has a
  null `figmaNodeId` and skips Stage 1 of `generation-rules.md`.

**Known issue recorded, not fixed**

- **Three documents disagreed about how many stories are verified** — the `Storybook Status` table
  counts 2, `CLAUDE.md` said 3, `llms.txt` said 4 and named `AlertDialog` and `Label`. The prose has
  been set to the table's 2 and the disagreement written into `docs/tracking/Storybook Status.md`.
  It is likelier that the table is missing two ticks than that `llms.txt` invented the names, but
  ticking a verification column is not something to guess at.


### 2026-09-18 — Documents' three code-adjacent files folded into its spec and deleted

**Removed**

- **`accura-ui/src/app/prototype/accura/documents/FUNCTIONAL-SPEC-MAPPING.md` and
  `TRAINING-MAPPING.md` are gone**, and `documents/README.md` is now a fourteen-line stub pointing
  at `flow/documents-spec.md`. They were Chi's, written during the 2026-09-12 integration and last
  touched 2026-09-14, and they described the same module as the spec.

  The reason for deleting rather than leaving them: **three of their facts had gone stale and they
  read as current.** All three stated a 65:35 detail layout where `document-detail.tsx` passes
  `ratio="70/30"`; all three pointed at `docs/demo-design-contract.md`, and
  `FUNCTIONAL-SPEC-MAPPING.md` also at `post-demo-backlog.md` — neither file exists.

**Changed**

- **The functional-specification trace moved to `flow/documents-spec.md` §7** — eight rows mapping
  the client's six-page PDF to the prototype, plus the not-implemented list and the explicit
  statement that none of it is a 21 CFR Part 11 control. This matters because **the PDF itself is
  only in git history**: the trace cannot be re-derived, so §7 now says so at the top.
- **Documents' deliberate divergences from the house patterns moved to §4.1**, corrected against
  the code. Two of the five claims are retracted there rather than dropped: the 65:35 layout, and
  a Card-density comparison written before the September spacing passes.
- **The `localStorage` key `accura-documents-demo-v1` and the IndexedDB file store are recorded in
  §2**, which is why demo records survived the `documents-demo` → `documents` migration.
- Dropped, not moved: two verification logs (2026-09-12, 2026-09-14 — the second is kept in §7 as
  history, marked as not re-run), the happy-path walkthrough, and the promotion history.


### 2026-09-17 — `docs/demo-scope.md` folded into the module specs and deleted

**Changed**

- **Documents' confirmed rules moved to `flow/documents-spec.md` §4** — effective date at approval
  + 14 days with QA override, conversion to PDF on submission rather than approval, five
  pre-approved attachments, one reviewer and one QA approver, `Pending effective` as a derived
  label, the 70/30 layout with a persistent bottom action bar, and the audit drawer as the single
  history surface. They were the only copy: the discovery folder that also held them was deleted
  earlier the same day.
- **The deferred list moved to `flow/documents-spec.md` §5**, recovered from the deleted
  `post-demo-backlog.md` — rejection and resubmission, external intake, supersession, obsolete
  workflows, multi-reviewer, and the production conversion pipeline. Deferred by decision, not
  forgotten.
- **The scope lock moved into `CLAUDE.md` → Scope**: one agreed happy path per module, edge cases
  captured in a line and carried past rather than investigated.
- Four files referenced `demo-scope.md` — `README.md`, `CLAUDE.md`, `accura-ui/AGENTS.md` and the
  Knowledge Hub README. All updated; the "what else has to change" table now sends scope questions
  to the module's own spec.

### 2026-09-17 — Three new checks, and the process each one encodes

**Added**

- **`docs/skills/accura-screen-audit/`** — how to audit a prototype screen: enumerate every state
  before looking at any of them, grep for slot overrides (the highest-yield check, and the one no
  token audit can see), one icon library, read each token name as a sentence and ask whether it is
  true, and check hover, empty and long content in a browser. Written because three of my own
  audits passed a page whose tables overrode `TableCell`'s padding four times.
- **`docs/skills/accura-token-change/`** — the order a token has to land in: export first, runtime
  second with a dark value, then all three documents, then `token-parity`. Five tokens were added
  this week and each reached `tokens.css` and the CHANGELOG and nowhere else.
- **`change-control/check-mock-data.mjs`** — turns each sentence of the Change Control process
  brief into a rule the seed data must satisfy. Node imports the `.ts` directly, so it reads the
  same module the screens do. Proved by planting three failures.

### 2026-09-17 — Label gets a spec, the pairing check runs both ways, `tokens/output/` stops pretending

**Added**

- **`docs/component-specs/Label.md`.** It had no spec — two code samples inside `Form-shared.md`,
  which describes the field anatomy, not this component's API. Seven consumers hand-rolled the
  asterisk in the meantime, the seventh three days after `required` shipped.

**Changed**

- **Spec filenames match their components:** `Navigation Menu.md` → `NavigationMenu.md`,
  `Radio.md` → `RadioGroup.md`, `Button-group.md` → `ButtonGroup.md`, `Date-picker.md` →
  `DatePicker.md`, `Input-OTP.md` → `InputOTP.md`. The mapping was by eye; now it normalises.
- **`drift-check` rule 5 compares components, stories, specs and meta.json in both directions.**
  It ran one way — story → meta — so a component with no story, a meta whose story was deleted, or
  a component with no spec all passed. It now reports two real orphans: `chat-bubble` has a
  component and a meta and no story, and `RecordRowAction` has a story and no meta.
- **`tokens/output/` is gitignored.** It is a build artifact of `sd.build.mjs`; nothing imports it
  at runtime, and the committed copy was three tokens behind the export — a second CSS file that
  looked authoritative and was not. Rebuild with `cd tokens && node sd.build.mjs`.

### 2026-09-17 — `accura-theme.md` is now `accura-decisions.md`, and its values moved to the ruleset

**Changed**

- **The value tables moved into `docs/design-system-rules.md`** — the brand ramp, the neutral and
  status ramps, the orange and violet ramps, the 17 text styles, and the semantic deviations
  (sidebar, status borders, focus ring, button radius). They now sit beside the rules that govern
  them, in a section that says it wins where the vendored text disagrees. `Albert Sans` appeared 14
  times in the theme file and **zero** times in the ruleset, so anyone following the rules never
  saw the typeface decision.
- **`accura-theme.md` → `accura-decisions.md`.** What is left is why Accura differs from Agentic,
  the dated typography decisions, the deviation summary and Q1–Q11. Every reference across the
  repo was updated.
- **`drift-check` rule 3 follows the tables, not the filename.** It read `accura-theme.md`; had it
  been left alone it would have passed while checking a file that no longer holds a ramp table.
  It now reads `accura-decisions.md` plus the ruleset's Accura values section — scoped to that
  section, because the rest of the ruleset quotes Agentic's own hexes, which are not drift.
  Verified by planting `#008851` in the brand ramp and watching it fail.

**Noted, not changed**

- **Dark mode is not used.** `tokens.css` ships a `.dark` block and every semantic carries a dark
  value, because the pipeline generates both. No screen renders in dark mode and none is designed
  for it. Both documents now say so: keep dark values correct when adding a token, but do not
  audit, measure or design against dark mode.

### 2026-09-17 — A brand-tinted surface finally has a name

**Added**

- **`--color-surface-brand-subtle`** — aliases `color/green/50` (`#f0fdf4`) in light,
  `color/green/950` in dark. There was no semantic for "a brand-tinted surface", so a module that
  wanted a green section header reached for `color/status/success/subtle` — the same hex, but it
  means *this succeeded*. Spending a status colour on decoration leaves the vocabulary unavailable
  when a section actually needs to show state. Change Control's section headers use it now.

### 2026-09-17 — Badge gains `orange`, and three variants that shipped undocumented

**Added**

- **Badge variant `orange`** — `color/orange/50` fill, `/300` border, `/700` text. Change Control's
  `Impact Assessment` needed a mid-process colour that does not collide with `Warning`, which that
  module already uses for `Action in Progress`.
- **Four tokens:** `--color-orange-50 / -300 / -700`, which existed in Figma primitives but had
  never been mapped, and `--color-border-brand: #008852` (same hex as `color/brand/primary`), which
  Change Control referenced in six places while it silently resolved to nothing.

**Changed**

- **`Badge.md` and `badge.meta.json` now list `Dashed`, `Orange` and `Violet`.** All three exist in
  `badge.tsx`; none appeared in either document, so the spec described 11 variants where the
  component ships 14. `Violet` and `Dashed` are not new — only newly written down.

**Note.** The merge notes for Change Control also asked for `success` and `blue` to be rewired to
`color/border/success` and `color/border/info`. Not done: unlike the above, that changes badges
already rendering in every module, and it needs a decision rather than an import.
### 2026-09-17 — Settings item in the shared sidebar now links to the Setting Module

**Changed**

- **`prototype/accura/app-sidebar.tsx`: the footer item was `"Setting"` with `href: "#"`; it is
  now `"Settings"` with `href: "/prototype/accura/settings"`.** The label now matches the page
  title, and the item opens the new Setting Module prototype instead of doing nothing. Its active
  state follows the existing rule (the href and everything under it), so it stays lit on every
  settings page. Any module sharing the sidebar picks this up; nothing else in the file changed.
- The Setting Module keeps its own log at `flow/Setting Module/Setting_Module_Log.md`. It includes
  a prototype-only row menu (`settings/row-menu.tsx`) — **not** a design-system component. If a
  second screen needs it, it becomes a `DropdownMenu` in `components/ui/` and gets an entry here.
### 2026-09-16 — One audit trail, and a state-change pill that knows which way the record moved

**Added**

- **`components/state-change.tsx`** — `Status  ~~old~~ → new` in one tinted pill. It was a private
  helper inside Training's `history-panel.tsx`, invisible from outside, so when the shared audit
  drawer needed the same thing it was designed from scratch instead. Same reinvention the
  `RequiredLabel` helpers caused.
- **`direction` on `StateChange`** — `forward` (success, the previous and default behaviour),
  `backward` (warning), `cancel` (danger). Training's version hardcoded success because training
  only moves forward. Deviations rejects records back a stage, and a return rendered green with
  the stage it returned to struck out in red reads as an approval.

**Changed**

- **`RecordAuditDrawer` gained `transitionDirection`** and dropped the bare `from → to` text line
  in favour of the pill. Callers that omit it render every transition as forward, which is what
  Documents does today. Each entry also stops repeating the record ID the sheet header already
  names.
- **`ElectronicSignatureModal` accepts any non-empty password.** It required the literal string
  `demo`, and the only place that said so was a 12px line under the field — a filled-in form sat
  there with the confirm button disabled. Nothing was ever authenticated either way. Affects every
  module's signing dialog, Documents included.
- **`ElectronicSignatureModal` gained `description`, `reasonLabel`, `reasonPlaceholder`,
  `recordLabel` and `attestationSubject`,** all defaulting to the existing wording. `recordLabel`
  and `attestationSubject` were hardcoded to Documents' own copy — "Document · revision" and "I
  have reviewed this revision" — and appeared above a deviation ID.
- **The audit trail entry is now written down**, in `docs/skills/accura-prototype-build/accura-design-patterns.md` §4b.

**Correction, 2026-09-16** — this entry, and the guardrail it shipped in
`accura-prototype-build.md`, said a Combobox description had been overridden to `text-sm` from a
prototype page. That did not happen: no page passes a class to `ComboboxField`, and the fix was
made in the component (`d2a3d41`). What actually went wrong with that field was two different
things — `type="tag-input"` and `multiple` were used together, which are different controls and
the component silently prefers `type`; and the multi-select input inside `combobox.tsx` was
`text-xs` while the single-select branch of the same component was `text-sm`. The guardrail about
not styling a component's slots from the page still stands on its own; its example has been
replaced with the real one.

### 2026-09-15 — The rules moved into the repo, and say when to update what

**Changed**

- **`CLAUDE.md` now carries the durable rules**, and `/accura` — the personal session file, which
  is **not in git** — shrank to what is genuinely session-specific: where the work is, who owns
  which module, and how to run it. Ten of twelve topics used to appear in both, with the durable
  half living in the file that does not travel: Chi's agent and anyone cloning the repo had never
  seen a word of it, and when the two drifted, one session was right and every other was wrong.
- **New in `CLAUDE.md`: "When you change something, what else has to change."** A table mapping
  each kind of change to the files that go stale with it and the command that checks — token
  values, components, prototype screens, patterns, file names, decisions on open questions, scope.
  Every row is something that has gone stale here before.
- **And when to write a changelog entry:** when the change affects someone who did not make it —
  a token value, a component's API, a rule, a decision, a file moving. Not for prototype screens
  or copy tweaks. Say what it was before, because that is the part that turns out to matter. Never
  rewrite a past entry; append the correction and date it.
- The recurring-failure log and the known-debt list moved in too, so they travel with the clone.

### 2026-09-14 — Documents handoff v2 adopted wholesale

**Changed**

- **The `documents/` module is replaced by the coworker's 14 Sep package**, not merged.
  Her base `c6f7868` was 13 commits old and both sides had edited the same files; merging by
  hand risked breaking ~350 lines of new detail-screen logic to preserve UI edits that are small
  and enumerable. Brings a revision model (`recordKey`, `documentHref`, `isRetired`,
  `normalizeDocument`, lifecycle/category/returned/obsolete fields), atomic supersession on
  approval, cross-tab store sync, and the new shared `record-row-action.tsx`.
- **`button.tsx` and `table.tsx`** take her patch (applied cleanly — untouched on our side since
  her base). `table.tsx` gains `useTableOverflow`, which `RecordRowAction` depends on.
  ⚠️ Shared with CAPA and Training — their tables and buttons have **not** been re-checked visually.
- **`record-workflow.tsx`** taken: her Documents module needs the added `SignatureReceipt` fields
  and the `actionLabel` / `reasonRequired` props. Verified consumed only by Documents, so the
  Training and CAPA signature flows are untouched.

⚠️ **This reverted the Documents half of the cross-module alignment** — module heading, toolbar
copy, `ListSummary` row, `Create Document` placement, 16px card padding and the shared
`RequiredLabel`. All seven were re-applied on 2026-09-14/15 (see the entries below).

**Adopted by default, never agreed** — taken as-is to keep the integration moving:

- **Revision is in the URL.** `documentHref` produces `/documents/SOP-001--v1.0` and
  `/documents/ACME~WI~2026~000001--v1.0`. Old `/documents/SOP-001` links no longer resolve.
- **`UseStatus` absorbs lifecycle.** It gained `External record`, `Superseded` and `Obsolete`
  alongside the three effectiveness values, so the Use status filter now answers two questions.
  Training keeps these apart.
- **Superseded styling uses an inline `style` attribute** (`opacity` + `line-through`) — the only
  styling in the prototype that bypasses className tokens.
- **The summary noun is `revision records`, not `documents`** — deliberate: Documents lists
  revisions, so `SOP-001 v1.0` and `v2.0` are two rows.

**Her interim assumptions, carried over unexamined:** Normal replacement approval supersedes the
previous revision immediately, and new effectiveness defaults to approval + 14 days with QA
override — **which can leave no effective revision during the gap**. External new-version routing
and Author/Owner mock equivalence are also labelled assumptions.

`RecordRowAction.stories.tsx` has no `meta.json`, so `drift-check` rule 5 fails. `src/stories/` is
reserved for design-system components; this one is prototype-only. Promote or demote it — deferred
until the modules are finished.

Not taken: her `application-header.tsx` (no `title` prop — would blank the heading in all three
modules) and `docs/demo-design-contract.md` (split into `demo-scope.md` + the skill earlier the
same day).

**Added**

- `flow/documents-discovery/` — the package's reference material, which existed nowhere in the
  repo: the Documents Module functional specification PDF, product knowledge, session log,
  post-demo backlog, and her handoff README. Preserved before the package folder was deleted.

### 2026-09-14 — Team workflow written down

**Added**

- **`docs/team-workflow.md`** (Tiếng Việt) — branch-per-module + PR workflow for the two people
  building the prototypes. Covers one-time collaborator setup, the daily pull/branch/cache
  routine, the four shared files both sides touch (`app-sidebar.tsx`, `tokens.css`,
  `components/ui/*`, the root docs), and conflict handling. Folds in three failure modes this
  repo has already hit: uncommitted work lost to an automatic stash on branch switch, a stale
  `.next` misread as a broken pull, and agents editing files outside the request.
- Indexed in `README.md` and `llms.txt`.

### 2026-09-14 — Body type is Inter; the SF Pro mismatch is retired

**Changed**

- **`font-family/sans` is `Inter` in Figma as well as code** — confirmed by the file owner.
  `accura-theme.md` §6 had recorded Figma's primitive as `SF Pro` and the difference as a
  *known, accepted mismatch* with an explicit "do not fix a component to close that gap".
  **That instruction is withdrawn.** A body-type difference between Figma and Storybook is now a
  defect to report, not an accepted state. With headings (Albert Sans, resolved 2026-09-08),
  Accura's type now matches end to end.
- Propagated to `README.md`, `CLAUDE.md`, `docs/design-system-rules.md` (override header),
  `accura-ui/README.md` and `accura-ui/CLAUDE.md`, all of which described the mismatch as live.
  Finding 4 in `accura-theme.md`'s table moves from *accepted* to *resolved*.

⚠️ **`tokens/primitives.tokens.json` and `tokens/tokens.tokens.json` still carry `"SF Pro"`**
(exported 2026-09-09, before the confirmation), as does the generated `tokens/output/css/*`.
The runtime source of truth `accura-ui/src/app/tokens.css` is already `Inter`. Re-export to clear
them — until then those files will reintroduce SF Pro to anyone who trusts them.

*Not independently verified: figma-cli was not connected, so this rests on the owner's
confirmation rather than a read of the Figma variable.*

### 2026-09-14 — `Label` implements its required marker

**Added**

- **`Label` gains `required` and `state`**, implementing `label` from `Form-shared.md`. The spec
  had always defined `label-text` + `label-required` with three states; `label.tsx` was a bare
  Radix wrapper with neither. Token bindings now match the spec:

  | `label state` | `label-text` | `label-required` |
  |---|---|---|
  | Default | `color/background/default/foreground` | `color/status/danger` |
  | Disabled | `color/text/disabled` | `color/text/disabled` |
  | Invalid | `color/text/invalid` | `color/text/invalid` |

- `Label.stories.tsx` — 6 stories including all three states beside real fields.
- `label.meta.json` — the component had **no artifact at all**, being documented inside
  `Form-shared.md` rather than as a standalone spec. **Artifacts: 37 → 38.**

**Why it existed**

Because the component could not express "required", **every consumer invented it in markup** —
six identical local `RequiredLabel` helpers across the prototypes, plus one inline version in
Documents whose asterisk inherited the label colour and **rendered black** while the others were
red. The spec's own rule — *"never override `label-text` or `label-required` fills directly"* —
was unenforceable, because there was nothing to override.

This is the same shape as the other drift found today: **a convention that lives only in markup
gets reinvented, and one copy gets it wrong.** The difference is that this one had a spec all
along.

**Removed**

- `prototype/accura/required-label.tsx` — a workaround at the wrong layer, extracted earlier the
  same day and obsolete once the prop existed. 18 call sites across all three modules now use
  `<Label required>`.

**Fixed**

- The asterisk was **decorative but unlabelled** in all seven hand-rolled copies. It is now
  `aria-hidden` with an `sr-only` "(required)". Verified present on all 18 required fields.
- The prototypes had been using `color/text/invalid` for the Default asterisk where the spec says
  `color/status/danger`. Both resolve to `#ef4444` today, so nothing looked wrong — the kind of
  divergence that only surfaces when one token moves.

> ⚠️ **Not verified against Figma `150:569`.** The implementation follows `Form-shared.md`, which
> is a **vendored** spec. Same caveat as Q12: confirm during the Figma ↔ code pass.

Adding the story tripped `drift-check` check 5 — *every story is owned by a meta.json* — which is
what surfaced the missing artifact. The gate did its job.

### 2026-09-14 — Documents module, cross-module alignment

**Added**

- **Documents module prototype** at `/prototype/accura/documents` — listing, detail, file upload
  with simulated PDF generation, `localStorage` + IndexedDB persistence, six seed records.
  Workflow `Draft → In Review → In Approval → Approved`, with Approved and Effective kept
  separate. Delivered as a source handoff by a coworker and applied as given; its known issues
  were not silently fixed.
- **Three shared components** arrive with it: `application-header.tsx`,
  `record-audit-drawer.tsx`, `record-workflow.tsx`. The audit drawer is intended as the single
  history surface across modules.
- **Training review queue** at `/prototype/accura/training/review` — selection-first, approve
  requires opening the record, reject does not, and both decisions are signed. See
  `flow/training-module.md` §5.7.
- `docs/skills/accura-prototype-build/` gained the prototype conventions and two knowingly
  hand-rolled components with the reason for each. **Skills: 7 → 8.**

**Changed — cross-module alignment**

All three prototypes were measured screen by screen and brought into line. Every number below
is a computed value, not an estimate.

| | Before | After |
|---|---|---|
| Content inset | 24px, except CAPA detail at 48px | **24px** everywhere |
| Card padding | 16px, except Documents at 24px | **16px** everywhere |
| Search width | 730px (CAPA) · 380px (Training) · 317px (Documents) | **380px** everywhere |
| List `Create` action | 40px (CAPA, Documents) · 36px (Training) | **40px** everywhere |
| Detail back link | 14px, except CAPA detail at 12px | **14px** everywhere |
| Detail rail | 280px and 320px | **320px** |
| Detail page width | full, except CAPA detail centred at 1152px | **full width** |
| Audit trail trigger | `ScrollText` "View Audit Trail" · `Clock3` "View audit trail" | **`Clock3` "View audit trail"** |
| Module header | Documents had the shared header; CAPA and Training had plain titles | **`ApplicationHeader`** in all three |

- **`NotificationModule` gained `Training`** with a `GraduationCap` icon — additive, no existing
  usage affected.
- **`capa/capa-header.tsx`** extracted. CAPA had built its header three times, once per page —
  the same duplication that once left Training invisible from CAPA's sidebar.
- **Sidebar collapse chevron** now points the way the click goes, and its `aria-label` changes
  with it.

**Changed — `Card` root padding is 16px, and the spec was wrong**

`Card.md` specified `spacing/component/xl` (24px) for the root shell. `card.tsx` and
`card.meta.json` both implement `spacing/component/lg` (16px). Two of three artefacts agreed,
and the outlier was a **vendored** spec — the file class that carries Agentic's values rather
than Accura's. `Card.md` corrected to 16px; recorded as **Q12** in `accura-theme.md`.

> ⚠️ **Not confirmed against Figma.** If the Figma card is 24px, this is wrong and the code is
> what should change. One instance of the wider gap: Accura's tokens were hand-written to match
> Figma and never verified by export.

Image variants keep 24px — that padding is on the inner `card-content` frame, a different
surface, and was never in dispute.

**Fixed — documentation drift**

- **Stale counts.** `README.md` claimed 7 skills (8), 38 specs (39), 36 `meta.json` (37) and 36
  forked components (39). `llms.txt` claimed 351 CSS custom properties (355) and 456
  declarations (460).
- **`Q3` is missing from `accura-theme.md`** — the list runs Q1, Q2, Q4. Not referenced
  anywhere. Left as a gap with a note, because renumbering would break every reference to
  Q4–Q12.
- **Three prototypes, not one.** `README.md`, `llms.txt` and `accura-ui/CLAUDE.md` all described
  a CAPA-only app. `flow/` — the module specifications — was missing from the README contents
  table entirely.
- **The prototype skill quoted port 3002**; `package.json` uses 3001.
- **Documents' own notes** said 65/35 where the design contract says 70/30, and asserted 24px
  card padding. Both corrected, with the contract cited as the authority for the ratio.
- **`accura-ui/AGENTS.md` still says 65/35** — inside the coworker's patch, and her own known
  issue. Left for her.

`sync-doc-values.mjs` reports 147 restated values already correct, 0 rewritten.
`drift-check.mjs` passes all six checks, including 159 restated px values.


### Known issues
- `chat-bubble.meta.json` references `ChatBubble.stories.tsx`, which was removed. Either drop the component and its spec, or restore the story. Surfaced by `validate-artifacts.mjs` (1 remaining error).
- `docs/machine-readable/figma-ids.md` carries Agentic's node IDs. Spot-checks suggest IDs survived the file duplication (`sidebar` at `95:18202` is correct in both), but this has not been verified across all 32 entries.
- 27 pre-existing TypeScript errors in story files, inherited from the fork. Storybook 10 made `args` required on `Story`. Excluded from the Next.js build; not yet fixed at source.
- 11 open questions (Q1–Q11) recorded in `accura-theme.md`.

---

## 2026-09-09

### Fixed
- **Deploying the repo returned 404 on every route.** Two compounding causes, neither in the app code. The Next app lives in `accura-ui/`, and the **repo root has no `package.json`** — a platform pointed at the root finds no application, builds nothing, and serves an empty site, so even `/` 404s and it looks like the app is broken. And `npm install` fails with `ERESOLVE` without `--legacy-peer-deps` (Storybook 10 declares peers against React 18; this app runs React 19 / Next 16), so the build would fail at install even after the root was fixed. Added `accura-ui/.npmrc` with `legacy-peer-deps=true` so install works everywhere without anyone remembering a flag, and a **Deploying** section to the README stating that the platform's root directory must be `accura-ui`. The `--legacy-peer-deps` instruction was removed from `README.md`, `llms.txt`, `CLAUDE.md` and `accura-ui/CLAUDE.md`, since it is now automatic — leaving it would have been a second stale instruction to trip over.


### Fixed
- **A fresh agent cloning the repo hit a 404 at `/` and started building a landing page.** Not its fault: `accura-ui/src/app` had no root route, and **no document — `llms.txt`, `README.md`, `CLAUDE.md` or `accura-ui/CLAUDE.md` — named a URL or a port for the app.** Added `src/app/page.tsx` redirecting to `/prototype/accura/capa`, and documented the ports, the route list, and the fact that there is deliberately no home screen.
- **Same agent was guessing shadcn token names** — grepping for `--background-default`, `--card-radius`, `--border-default`, `--surface-default`, `--text-primary`. **None of those exist.** Accura uses `--color-background-default`, `--radius-lg`, `--color-border-default`, `--color-surface-default`, and has no `--text-primary` at all. This fails *silently*: `var(--text-primary)` resolves to nothing rather than erroring, so the screen looks roughly right and uses none of the system. The naming rule now leads `accura-ui/CLAUDE.md` with a shadcn→Accura mapping table, and is summarised in `llms.txt`.

  Both symptoms share one cause: the repo was self-contained but not **self-announcing**. `llms.txt` is a good index only if you know to open it first; from the code alone, shadcn's conventions are the obvious guess.


### Added
- **`docs/machine-readable/sync-doc-values.mjs`** — rewrites restated px values (`spacing/component/lg (16px)`, `| radius/lg | 8px |`) from `tokens/*.json`, across specs, skills, tracking and the ruleset. Makes those numbers **derived rather than authored**: a value-only edit used to invalidate ~150 hand-typed numbers silently, which is the single largest source of doc drift during a re-theme. Ported from Agentic with a fork-specific exclusion mechanism it did not have.

### Fixed
- **`drift-check.mjs` check 6 was fail-open.** It scanned `docs/component-specs` only — **12 of 171 restatements, 7%** — and reported green. Widened to every doc, honouring the same exclusions as the sync script. Verified by planting a wrong value in a file the old check never read: it is now caught and exits 1. This was a gate that passed by not looking, which is worse than no gate.
- **Two live wrong values** in `docs/skills/Token Binding Skill.md` — `radius/lg` written as 8px (Accura: 12px) and `radius/md` as 6px (Accura: 10px), inherited from Agentic. Token *names* were right so bindings were unaffected, but any agent reasoning about sizes from that table got Agentic's numbers. The file now carries a localisation note so a re-vendor does not silently revert it.
- **Six stale counts** — `llms.txt` claimed 345 CSS custom properties (351), 38 specs (39), 36 meta.json (37), 38 component files (39), 35 stories (36), and `variables.css` 403 props (391). `AI-Readiness.md`'s counts table still read 228 primitives / 47 component tokens (229 / 52). All re-measured, not estimated.

### Notes
- Three classes of document must **never** be rewritten by the sync script, now documented in it: vendored bodies corrected by an override header (`docs/design-system-rules.md`), prose quoting a stale value as an *example* of drift (per-line `<!-- sync-doc-values:ignore -->`), and changelogs — a dated entry describing a past state is correct as written.

---

## 2026-09-08

### Added
- **`stepper/border` component token** (`#d4d4d8` / zinc/300) for the upcoming-step ring. **Aliases a primitive directly**, which the inherited ruleset forbids — Accura now treats the component tier as another semantic layer. Added in code first, then created in Figma and confirmed by re-export, so it is durable. Component tokens: 45 → 46.
- **Stepper component** — horizontal and vertical progress indicator for multi-step flows, built for the CAPA workflow. Spec, component, 7 stories and `meta.json`. Custom, since shadcn/ui has no stepper.
- **CAPA prototype flow** on branch `prototype/capa-flow` — listing, create form and mock data at `accura-ui/src/app/prototype/accura/`. Built against the real component library; deploys as three static routes.
- **`flow/capa-prototype-spec.md`** — single source of truth for CAPA prototype scope, canonical mock data, routes, screen copy, status support, audit trail and electronic-signature flow.

- **`font-family/display` = Albert Sans in Figma** (Primitives, 228 → 229) and the heading text styles bound to it: `display/lg` `md` `sm`, `heading/xl` `lg` `md`. `heading/sm` (16) and `heading/xs` (14) deliberately stay on `font-family/sans` — at those sizes they read as labels, and `heading/sm` is `CardTitle`, which would have put Albert Sans on every card. **This closes the headings half of the Figma↔code type mismatch** (`accura-theme.md` §6); only body remains split (Figma SF Pro vs code Inter). ⚠️ Setting `fontName` on a text style silently clears its `fontWeight` binding — it did so on 5 of the 6 styles and they had to be re-bound. Always re-verify all four axes after touching `fontName`.
- **`Button` variant `Destructive Secondary`** (`destructiveSecondary`) — low-emphasis destructive, for a destructive action sharing a footer with a primary one that must stay dominant (CAPA `Reject` beside `Approve & Sign`). Solid destructive beside solid primary measures **1.20:1** between the two fills — near-identical lightness, so the meaning rides entirely on hue and collapses under red-green colour blindness (1.48:1). Five new component tokens mirroring `button/secondary` on the red ramp. Two deliberate token choices: label is **red/900** not `status/danger-subtle/foreground` (red/700 is 4.47:1 on the pressed fill and misses AA), and border is **red/500** not `color/border/error` (red/300 is 1.90:1 on white, failing the 3:1 control-boundary floor — this does not resolve Q10). **Code-only** — Figma's button set still has 6 Types. Component tokens: 47 → 52.
- **`checkbox/radius` component token** (`4px`). Created in Figma's Components collection (46 → 47) and synced to code. **Aliases nothing** — it is a fixed value, the second deliberate break from the inherited "component tokens must alias semantics" rule after `stepper/border`.
- **Albert Sans for headings** — `h1`–`h3` and the four overlay titles (Dialog, AlertDialog, Sheet, Drawer) now render in Albert Sans; body, labels, inputs, buttons and `h4`–`h6` stay on Inter. Wired at `--font-heading` in `globals.css`, which already existed but was pointing at Inter and consumed nowhere. **Code-only** — Figma has no `font-family/display` primitive, so this is a second accepted Figma↔code type mismatch (`accura-theme.md` §6). Albert Sans loads in **both** `.storybook/preview-head.html` and `src/app/layout.tsx`; changing one without the other desynchronises Storybook from the app.

### Fixed
- **AlertDialog taught the wrong destructive pattern.** The `Default` story paired destructive content ("Delete workspace? … cannot be undone") with the primary green confirm, contradicting `AlertDialog.md`, which files "Publish this draft?" under `Type=Default` and "Delete workspace?" under `Type=Destructive`. Being first on the Docs page, it was the most likely thing to be copied. `Default` now confirms a reversible publish; the delete case moved to a new `DeleteWorkspace` story. `AlertDialogAction` also gained real `variant`/`size` props — the previous `className={buttonVariants({ variant: 'destructive' })}` route emitted two competing fills and was decided by CSS source order rather than intent.
- **Sheet and Dialog close buttons were bare 16×16 icons**, not the Ghost Icon buttons their specs called for. No hit area, no ghost hover, opacity-based states. Both now use a Button instance at `icon-sm` (36×36). `Sheet.md` corrected from 32×32, a size Button does not provide.
- **`validate-contrast.mjs` was reporting success while checking nothing.** It collects pairs by looking for token paths ending `.foreground`, but the Figma re-export collapses those to `-foreground`. Zero paths matched, so it printed `0 pairs checked · 0 fail` and exited clean. Now accepts both spellings: 24 pairs, 19 pass, 5 warn, 0 fail.
- **`validate-artifacts.mjs` failed all 36 artifacts** — it resolved story paths against an `agentic-ui` folder that does not exist here. Now points at `accura-ui`; errors down to 1 real one.
- **`item.tsx` broke the production build.** It called `Avatar` with shadcn's compound children (`AvatarImage` / `AvatarFallback`) while Accura's `Avatar` takes props. `avatar.tsx` exports both APIs, which is how they were mixed. Rewritten to the props form.
- **Sidebar stories would not render.** They imported Untitled UI icon names (`BarChart01`, `Settings01`, `File06`, `Menu01`) from `lucide-react`, which does not export them. 35 such imports across 8 files — also breaking Dialog, Sheet, Toast, ButtonGroup and Item. Each name now comes from the package that exports it.

### Changed
- **Radius scale rescaled to base 12** — `radius/base` `8px` → **`12px`**, making radius the third changed primitive lever. Set in Figma and pulled into code by re-export. The shadcn ±4 / ±2 offsets are preserved (`sm 8 · md 10 · lg 12 · xl 16`), so shadcn components still behave; the irregular top end (`14 / 18 / 21`) was regularised to `20 / 24 / 28`. Buttons are unaffected — they were already pill `9999`.

  | | none | sm | md | base | lg | xl | 2xl | 3xl | 4xl | full |
  |---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
  | before | 0 | 4 | 6 | 8 | 8 | 12 | 14 | 18 | 21 | 9999 |
  | after | 0 | 8 | 10 | 12 | 12 | 16 | 20 | 24 | 28 | 9999 |

  **Side effect worth knowing:** CSS clamps `border-radius` to half the shorter side, so Badge at Small (16px) and Medium (20px) heights now renders as a full pill rather than a rounded rectangle. Accepted as consistent with pill buttons; if rounded-rect badges are wanted, Badge needs its own radius token the way Checkbox now has one.
- **CAPA prototype mock data unified** — listing, supported detail pages, audit trail and electronic signature now share canonical records. The listing shows all six workflow statuses; only Draft, In Review and In Approval link to detail pages. CAPA status badges now use the Medium size.
- **CAPA prototype documentation consolidated** — listing, create, detail, audit trail, electronic signature and overall flow copy now live in one specification. The document distinguishes designed detail states (Draft and In Review), the reused In Approval layout, and listing-only statuses without detail designs.
- **Stepper layout reworked** — labels moved below the indicator, the current label changed to `color/brand/primary`, and an optional `description` line was added per step (`color/text/secondary` for complete/current, `color/text/tertiary` for upcoming). Applies to both orientations.
- **Sidebar rebuilt to the Accura design** — two variants only (`Default`, `DefaultCollapsed`), Dashboard + CAPA nav, Setting / Log Out footer, ACCURA wordmark, and a direction-aware collapse chevron. Expanded width 240px → **256px** per Figma `95:15648`.
- `*.stories.tsx` and `.storybook` excluded from the Next.js typecheck. Stories are not part of the deployed app and Storybook compiles them through vite.

### Removed
- Six superseded CAPA prototype documents: `flow/capa-listing.md`, `flow/create-capa.md`, `flow/capa-detail.md`, `flow/audit-trail-record.md`, `flow/e-signature.md` and `flow/prototype-flow.md`. Their content is preserved in `flow/capa-prototype-spec.md`.
- Three unrelated demo apps inherited from the fork — ElevenLabs, GrabFood, Simon (18 files).
- Five unused create-next-app placeholder SVGs from `public/`.
- `src/app/page.tsx` — an Agentic-era showcase built from 24 shadcn default classes rather than Accura tokens.
- `Screens/Northwind` templates and the `ChatBubble` story.

### Breaking
- **`color/sidebar/accent` → `color/brand/900` (`#175e41`)** and **`accent/foreground` → white**, in both modes. `sidebar/active` and `active/foreground` alias these in Figma, so they follow. Any sidebar built on the previous light-grey accent changes appearance.
- **`color/sidebar/ring` → `#17bb77`** in code. **Figma still says `#2b7fff`.** Regenerating `tokens.css` straight from Figma reverts this — update the Figma variable or re-apply after regenerating.

---

## 2026-09-07

### Added
- **Initial Accura design system** — theme reference plus the component library forked from `agentic-ui`.
- **`tokens/` re-exported from Accura's Figma file** — 228 primitives, 115 semantics (Light + Dark), 45 component tokens, aliases preserved as references.
- **Repository made self-contained** — vendored the inherited ruleset, 7 process skills, 38 component specs, 36 machine-readable artifacts, tracking docs and the token pipeline. Added `llms.txt` as the navigation index and `CLAUDE.md` as the agent entry point. Every absolute path replaced with a repo-relative one.
- **17 text styles** created in Figma, bound on four axes — `fontFamily`, `fontWeight`, `fontSize`, `letterSpacing`. `lineHeight` stays hardcoded px, since unitless ratios resolve differently per font size.
- Root `.gitignore` — `tokens/node_modules` is 58MB and nothing excluded it.

### Fixed
- **The DTCG token build did not work.** DTCG forbids a node being both a token and a group, but Figma has `color/background/default` alongside `color/background/default/foreground`, so Style Dictionary could not see any `/foreground` token. The inherited Agentic export fails the same way with 8 unresolved references — verified by building it. Children are now collapsed onto the parent segment (`color.background.default-foreground`), keeping the CSS variable name while staying reachable.
- Five chart colours were self-referential once collections shared a namespace (`color/chart/1` → `color/chart/1`). Those 10 are inlined as literals.

### Changed
- `docs/design-system-rules.md` opens with an **override table** naming every value where Accura differs from the inherited rules. Agentic's contrast table is computed against blue `#2b7fff` and is invalid here.

### Removed
- **`hypertokens-system-bundles.md`** — vendored by category without being read. It contradicted the theme in six places with no override header: `brand.primary` as blue/500, `border.error` at red/500 where Accura uses red/300, and a typography table whose `heading/lg` matched neither system. Every pairing in it was already specified authoritatively elsewhere.

### Notes
- **Brand anchors at `/800-base` (`#008852`), not `/500`.** This is the contrast rule applied correctly, not a violation — green measures 2.50:1 against white at `/500`, below the 3:1 floor, while `/800` reaches 4.52:1 and is safe as fill *and* small text. (Written as 4.59:1 until 2026-09-15; recomputed and corrected. The conclusion is unchanged — it still clears 4.5:1.)
- **Figma uses SF Pro; code uses Inter.** A recorded, accepted mismatch — not an oversight.
