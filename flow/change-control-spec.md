# Change Control — module spec

**As-built**, read from the code on 2026-09-17, after the listing audit but before detail and
create have been audited. Chi built this module; it arrived as `change-control-export/` and was
imported onto branch `change-control/import`.

Where this file says *observed*, it is describing what the code does — not what the product should
do. There is no Change Control brief in `flow/brief/`, and the export's `backlog.md` (named in its
merge notes as holding the behaviour spec, decisions and open questions) **was not included**. Ask
Chi for it; several questions below are probably answered there.

Files — `accura-ui/src/app/prototype/accura/change-control/`:

| File | Lines | What |
|---|---|---|
| `mock-data.ts` | 755 | statuses, types, seven seed records |
| `page.tsx` | ~560 | the registry |
| `[id]/page.tsx` | 3,482 | the detail page, all seven states, six dialogs |
| `new/page.tsx` | 623 | create, and edit via `?mode=edit&id=` |
| `change-control-header.tsx` | 51 | `ApplicationHeader` wrapper |

---

## 1. Lifecycle

Seven statuses, in `changeControlStatuses`, and the array **is** the order — `statusOrder` and
`atOrAfter()` derive position from its index, so nothing stores a step number.

| # | Status | Badge variant |
|---|---|---|
| 1 | `Draft` | `secondary` |
| 2 | `Impact Assessment` | `orange` |
| 3 | `QA Approval` | `blue` |
| 4 | `Action in Progress` | `warning` |
| 5 | `Pending Closure` | `dashed` |
| 6 | `Final QA Approval` | `violet` |
| 7 | `Closed` | `success` |

`orange` did not exist in our `Badge` and was added on import, with three orange tokens and
`--color-border-brand` — see the CHANGELOG entry for 2026-09-17.

There is no `Cancelled` and no return path in the data model. Rejection is offered in the UI at two
gates (below) but `AuditTrailItem.from/to` is the only record of movement, and nothing in the code
moves a record backwards.

---

## 2. Data model — `mock-data.ts`

### `ChangeControlRecord`

Always present: `key` · `id` (`CC-YYYY-NNN`) · `title` · `status` · `dateRaised` ·
`targetImplementationDate` · `owner` · `affectedDepartments: string[]`.

Optional, and only populated from `Impact Assessment` onward: `raisedBy` · `department` · `type` ·
`classification` · `category` · `description` · `riskAssessment` · `departmentAssessments` ·
`changeActions` · `auditTrail`.

### `DepartmentAssessment`

`department` · `impacted: boolean` · `status: "Pending" | "Impacted" | "Not Impacted" | "Signed"` ·
`impactSummary` · `reason?` · `signer?` · `priority?`.

`pendingAssessmentsFor(affectedDepartments)` mints one `Pending` row per department. Its comment
records a real defect it exists to prevent: without a roster, a record already past Draft falls
back to the Draft-only "not submitted yet" placeholder.

Note both `impacted: boolean` and `status` carry impact, and can disagree. `status` is what the UI
reads in most places.

### `ChangeAction`

`id` · `department?` · `title` · `owner` · `dueDate` · `priority: Low | Medium | High | Critical` ·
`status: Open | In Progress | Done` · `evidenceStatus: Missing | Attached` · `evidenceFiles?` ·
`comments?` (`ChangeActionComment`: author, timestamp, text) · `completedAt?`.

### `AuditTrailItem`

`actor` · `timestamp` (display string, e.g. `Sep 19, 2026 9:30 AM`) · `action` · `from?` · `to?`.
Newest first in the seed data. Entries without `from`/`to` (e.g. `Created Change Control`) always
display; entries with them are filtered by `visibleAuditTrailItems()` so a trail never shows a
transition past the record's current status.

### Seed records

Seven, one per status:

| ID | Status | Title | Owner | Depts |
|---|---|---|---|---|
| CC-2026-001 | Impact Assessment | Update tablet coating process parameters | John Baker | 3 |
| CC-2026-002 | QA Approval | Revise purified water sampling point | Anna Hoang | 2 |
| CC-2026-003 | Draft | Update tablet coating process parameters | John Baker | 3 |
| CC-2026-004 | Action in Progress | Qualify backup incubator for microbiology | Lisa Tran | 3 |
| CC-2026-005 | Pending Closure | Retire temporary gowning room procedure | John Smith | 2 |
| CC-2026-006 | Final QA Approval | Approve new balance calibration interval | Priya Shah | 2 |
| CC-2026-007 | Closed | Close cold-room alarm threshold update | Anna Hoang | 3 |

CC-2026-001 and CC-2026-003 share a title deliberately — the same change at two stages.

### Persistence

`localStorage`, unlike Deviations which is in-memory by choice:

- `accura-change-control-records` — records created or edited, read by all three screens
- `accura-deleted-change-control-record-ids` — tombstones, **written by nothing any more** (§7.1)

Stored records are merged ahead of the seeds by id, then tombstones are subtracted.

---

## 3. Screen — registry (`page.tsx`)

Shell: `AppSidebar` · `ChangeControlHeader` · a section at `spacing/component/lg`, `xl` at `lg:`.

**Toolbar** — search (flexes to 380px, placeholder *Search ID, title, owner, or department…*),
`Status: All` select, `All departments` select (options derived from the records, excluding any
starting with `+`), and `Create Change Control` right-aligned. Search matches id, title, owner and
department names.

**Summary row** — `ListSummary`, "N of M change controls" with Clear filters.

**Table** — seven columns after the audit: `ID` · `TITLE` · `CHANGE OWNER` · `DATE RAISED` ·
`TARGET IMPL.` · `AFFECTED DEPTS` · `STATUS`. Fixed layout. Sticky header. Rows are clickable
(`useRowClick`); the ID cell keeps the real link.

- **ID** — brand-coloured, `font-medium`
- **TITLE** — `TruncatedTitle`, clamped with a tooltip
- **CHANGE OWNER** — `Avatar` (sm) + name
- **AFFECTED DEPTS** — outline pill per department, `+N` overflow pill with a tooltip listing the
  rest, clipped at `max-h-[68px]`. **This is the column that sets row height: 77px, against 44–52px
  in every other listing.** A redesign was drafted and deferred (§7.2)
- **STATUS** — pill badge from `changeControlStatusVariant`

**Empty state** — `Empty` with *No change controls found* and a Clear filters button.

**Footer** — `TablePagination`, the shared one.

---

## 4. Screen — create and edit (`new/page.tsx`)

One screen for both. `?mode=edit&id=CC-YYYY-NNN` loads the record and switches the middle button to
`Save Changes`.

**Fields.** All required and validated on submit with *This field is required*, **except Risk
assessment**, which carries no asterisk and is not in the validation map. (An earlier draft of this
spec said all nine were required; it was wrong.)

| Field | Control | Options |
|---|---|---|
| Title | Input | — |
| Target implementation date | DatePicker | — |
| Department | Select | Production · Quality Assurance · Packaging · Engineering · Quality Control · Development |
| Change owner | Select | John Baker · Anna Hoang ×3 · John Smith · Lisa Tran |
| Change type | Select | Document · Process · Equipment · Facility · Utility · Computer System · Material · Supplier · Regulatory · Temporary · Emergency · Analytical Method |
| Classification | Select | Permanent · Temporary · Emergency |
| Category | Select | Minor · Major · Critical |
| Description | Textarea | — |
| Risk assessment | Textarea | — |

**Actions** — `Cancel` (ghost, back to the registry) · `Save as Draft` / `Save Changes` (outline) ·
`Submit for Impact Assessment` (primary).

`Save as Draft` writes a `Draft` record. Submit writes `Impact Assessment` and seeds the roster
with `pendingAssessmentsFor()`.

**`randomAffectedDepartments()`** — the form has one Department field, so on save the record is
given that department plus **0–2 others picked at random**, to imitate the multi-department seeds.
A created record therefore shows departments nobody chose, and re-saving reshuffles them (§7.3).

---

## 5. Screen — detail (`[id]/page.tsx`)

One page serving all seven states, ~3,500 lines. Layout: header, stepper, a scroll-spy nav, the
sections, then the action bar.

### 5.1 Stepper

Seven steps from `changeControlWorkflowSteps`, each with a derived caption from `stepDescription()`:

| Step | Caption |
|---|---|
| Draft | `Created by {raisedBy}` |
| Impact Assessment | `{declared}/{total} Impact Assessed` |
| QA Approval | `Approved by {actor who moved it to Action in Progress}` |
| Action in Progress | `{done}/{total} Actions Submitted` |
| Pending Closure | `Submitted by {actor}` |
| Final QA Approval | `Approved by {actor}` |
| Closed | `Closed by {actor}` |

Every unknown value renders `--` (two hyphens, not an em dash — inconsistent with the rest of the
product, §7.4). Actors are looked up out of the audit trail by their `to` status, so the stepper
and the trail can never disagree.

### 5.2 Section nav

`ScrollToSectionNav`, smooth-scrolling to `details` · `impact-assessment` · `change-actions` ·
`evidence`. The last two appear conditionally: Change Actions at `QA Approval` or once actions
exist, Evidence at `Action in Progress` or later.

### 5.3 Details

Two groups of read-only `DetailField`s, labels in caps: `RAISED BY` · `DATE RAISED` ·
`TARGET IMPLEMENT DATE` · `ORIGINAL DEPARTMENT` · `OWNER` · `TYPE` · `CLASSIFICATION` ·
`CATEGORY`, then `TITLE` · `DESCRIPTION` · `RISK ASSESSMENT`. Missing values render `-`.

### 5.4 Affected departments and impact assessment

One `AssessmentCard` per department, each a small state machine:
`default → impacted | not-impacted → actions`.

- **Impacted** — an impact summary, then one or more action drafts (description, owner, due date,
  priority), then sign. Errors: `missing-action`, `incomplete-action`
- **Not impacted** — a reason, then sign
- Signed cards collapse to `SignedDepartmentCard` and are read-only

Point of contact defaults per department from `pointOfContactOptions` — Michael Chen (Production) ·
Sarah Johnson (QA Approver) · David Lee (Engineering).

### 5.5 Change actions

`ChangeActionsSection` lists the actions gathered from every impacted department, with priority
dots, owner, due date, an `Open / In Progress / Done` badge, evidence state, and comments. At
`Action in Progress` each becomes an `ActionExecutionCard` — evidence upload, a note, then a
signature to mark it done.

### 5.6 Evidence

Files from **completed** actions only, each row showing filename, department and the action it came
from. The section hides itself when empty.

### 5.7 Audit trail

A right-hand `Sheet` titled *Audit trail*, newest first, filtered by `visibleAuditTrailItems()`.
**It is this module's own sheet, not the shared `RecordAuditDrawer`** (§7.5).

### 5.8 Action bar, per status

| Status | Bar |
|---|---|
| Draft | Cancel · Save as Draft · **Submit for Impact Assessment** |
| Impact Assessment | Cancel · **Submit for QA Approval** — hidden entirely until every department has signed |
| QA Approval | *Awaiting QA approval of the proposed change actions.* + **QA Reject** (destructive) · **QA Approve** |
| Action in Progress | **No bar.** Progress is made inside each action card |
| Pending Closure | *All actions are complete…* + **Sign off & Submit for Final QA** |
| Final QA Approval | *Awaiting final QA approval and closure.* + **Reject** (destructive) · **Approve & Close** |
| Closed | No bar |

### 5.9 Signature dialogs

Six, all bespoke to this module: department assessment · action execution · QA decision · change
owner sign-off · submit for QA approval · final QA decision. Each collects a note or reason, a
password and a confirmation checkbox, and refuses to submit until all three are present.

**None of them uses the shared `ElectronicSignatureModal`** (§7.6).

---

## 6. Identity

The header hardcodes **Sarah Johnson · QA Approver · SJ** as the signed-in user, and the dialogs
sign as whoever the context implies. There is no user switching, so a single session signs at every
gate regardless of role.

---

## 7. Findings

**7.1 The delete path is gone, and its tombstone key is orphaned.** The registry's row overflow
menu (View / Edit / Delete) was removed on request 2026-09-17. Delete now has no entry point
anywhere in the module, and `accura-deleted-change-control-record-ids` is read but never written.
Edit survives on the detail page. *Decide: restore delete on the detail page, or drop the key.*

**7.2 Affected departments sets the row height.** 77px rows against 44–52px elsewhere, because the
chips wrap; and `max-h-[68px]` silently clips anything past two lines, with no `+N` for what it
cut. A one-line treatment (first chip + `+N more`) was mocked up and deferred.

**7.3 Created records get random departments.** `randomAffectedDepartments()` adds 0–2 departments
the user never selected. Fine as seeding, wrong as behaviour — the create form should either ask
for the full list (multi-select) or record only the one department it asks for.

**7.4 `--` and `-` as empty values.** The stepper uses `--`, Details uses `-`, and the rest of the
product uses `—`. Three conventions in one module.

**7.5 The audit trail is a fourth implementation.** Deviations and Documents share
`RecordAuditDrawer`; Training has its own; this is a fourth. Since 2026-09-16 the shared one renders
the house entry (name · role · account · timestamp, action, `StateChange` pill) and takes a
`transitionDirection`. This module's `from`/`to` maps onto that directly.

**7.6 Six hand-rolled signature dialogs. FIXED 2026-09-17** — all six now wrap the shared
`ElectronicSignatureModal` through one local `ChangeControlSignature` adapter, keeping each gate's
own title, meaning, action label and reason copy. Original finding: The shared `ElectronicSignatureModal` carries the Part 11
title, identity block, meaning, credential and attestation, and now takes per-action copy
(`description`, `reasonLabel`, `reasonPlaceholder`, `recordLabel`, `attestationSubject`). Six
bespoke dialogs is six places for the regulated wording to drift.

**7.7 The row menu has no home in the design system.** View / Edit / Delete on a table row was built
on raw `@radix-ui/react-popover`; `RecordRowAction` only opens a record. This is a real component
gap, like the segmented control — worth logging rather than papering over. (Currently moot: the
menu was removed.)

**7.8 `impacted` and `status` can disagree** on `DepartmentAssessment`. Two fields carrying one
fact.

**7.9 A `setState` inside an effect** hydrates records from `localStorage` on all three screens —
the pattern our linter rejects at error level. React's adjust-during-render or a lazy initialiser
is the fix; it is how the signature dialog's reset was written.

**7.10 No rejection destination.** QA Reject and final Reject exist as buttons, but no status
represents a rejected record and no code moves one backwards. Where does a rejected change control
go? *Likely answered in `backlog.md`.*

**7.11 Six duplicate `Anna Hoang` entries** in the create form's owner list — three identical
labels with different values and mismatched initials (`CH` for Anna Hoang).

**7.12 All three screens are now audited.** Create (623 lines) turned out to be the cleanest file in
the module — 16 spacing tokens to 1 literal, type and weights already matching `deviations/new`, no
hardcoded colour. Fixed on 2026-09-17: labels to sentence case, the `Separator` under the card title
removed (no other create screen has one), `max-w-[900px]`/`[860px]` to the house `max-w-5xl` — both
screens now measure 976px — the last `leading-[14px]`, em dashes out of prose and dialog titles, and
empty optional fields now save as `undefined` instead of `"-"`, which had been defeating the detail
page's own em dash. Detail was audited and fixed the same day: the six
dialogs above, 21 `font-semibold` → `font-medium`, 34 arbitrary `leading-[Npx]` → scale utilities,
a seventh private `RequiredLabel` → `Label required`, two hand-drawn panels → `Card`, off-scale
`p-5` and `p-[14px]` removed, 48 spacing literals → tokens, and `--` → `—`.

**7.13 The 600 weight that remains is component-owned.** After the page was fixed, `14px/600` and
`18px/600` still render — from `Stepper` (lines 108–109) and `ApplicationHeader` (line 173), both
shared. The system runs two weights; three components disagree. Fixing it changes Deviations and
Training too, so it is a design-system decision, not a Change Control one. `--color-border-brand`, referenced six times
in the detail page, resolved to nothing until it was added on import.

---

## 8. Open questions for Chi or the PO

1. Where is `backlog.md`? It is named in the merge notes as the behaviour spec and open questions.
2. What happens to a rejected change control (7.10)?
3. Should affected departments be a multi-select on create (7.3)?
4. Is delete expected to exist, and where (7.1)?
5. Are the six signature dialogs deliberate, or should they move to the shared modal (7.6)?
