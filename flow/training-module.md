# Training Module

The Training module of Accura One: what exists today, what was designed, and what is still
undecided.

**Captured** 2026-09-10 from the running product, with design work from the same day.
**Prototype:** `accura-ui/src/app/prototype/accura/training/` — mock data lives in
`mock-data.ts` and is the single source for screen content. It is not restated here.
**Domain reference:** [`domain/training-module.md`](domain/training-module.md) — what a training
module is for, the regulatory basis, and the workflow the brief describes.

Open questions are collected in §9 and referenced inline as **Q1–Q24**.

---

## 1. The brief in short

A Training Manager defines **training roles** (job families), attaches **courses** to them, and
each course carries one or more **assessment methods** — acknowledge, read & acknowledge, quiz,
written, or on-the-job. Assigning a user to a role gives them its courses.

Assessments are triggered three ways: on a **specific date**, on a **recurring period**, or
**manually**. A document revision retrains everyone bound to that document.

The trainee completes the assessment, uploads evidence, and signs. The Training Manager is
notified, reviews, and signs off.

> The brief's closing sentence: *"…supports both automated/document-based training **and**
> training that requires human verification, particularly on-the-job training."*
>
> **The first half is built. The second is not.** See §8.

---

## 2. Object model — three levels, two names

```
Training Role ──< Course ──< Assessment Method     (definitions)
                              │
                              ▼
                          Assessment                (a scheduled round)
                              │
                              ▼
                      Participant Progress          (one person's record)
```

| Level | What it is | Called |
|---|---|---|
| 1 | type + material — *Read & acknowledge SOP-002 v3.0* | **Assessment Method** |
| 2 | a round sent to everyone in the linked roles | **Assessment** |
| 3 | one person's completion, evidence and signature | **Participant Progress** |

**One word spans two levels, and the product uses it for both.** This is the single most
consequential naming problem in the module — see **Q1**, and the decision recorded there.

---

## 3. Navigation and sitemap

**Tabs:** `Users · Roles · Courses · Assessments` — with `Review` proposed and not built (§8).

### Manager / admin

```
Training
├── Users ──────────→ User detail ──→ History record panel
├── Roles ──────────→ Role detail ──→ Edit role
│                     └─ Create role
├── Courses ────────→ Course detail ─→ Edit course
│                     ├─ Create course
│                     └─ Create assessment (a round)
├── Assessments ────→ Assessment detail → Participant Progress → approve / reject
└── Review          (proposed) everything awaiting this manager's signature
```

### Trainee

**No trainee screens exist.** No "my training", no completion flow, no read-and-acknowledge
screen. `Assigned Assessments` on the user detail is the trainee's own to-do list viewed by
someone else; shown to the person it belongs to, it is the missing screen. See **Q6**.

### Where actions live

| Screen | Scoped by | Answers |
|---|---|---|
| User detail | by person | "is this person compliant?" |
| Assessment detail → Participant Progress | by round | "everyone who did SOP-014" |
| **Review** (proposed) | by *awaiting me* | "what needs me today?" |

The **Assessments tab is the wrong level for approval** — it lists rounds, not people. You
approve individuals inside a round.

> **Review is where the manager's core job happens. If it is not built, approval has nowhere
> to live.** It is the highest-priority gap in the module. Whether it belongs inside Training or
> as a platform-wide task box is **Q7** — every module has approvals, and this would be the
> fifth such tab.

---

## 4. As built

### 4.1 Users tab

Search · status filter (`All · Up to date · Pending · Overdue`) · table.

**Columns:** `Name` (email beneath) · `Department` · `Access level` · `Status`

`Status` is derived, not stored — it answers *does this person have outstanding assignments?*

### 4.2 Roles tab

Search · `Create Role` · two-column **card grid**.

Card: name · description · footer `N course` · `N user`. The counts are the role's whole
purpose — courses in, users out.

**Role detail:** back link · name · `Edit role` · a `DESCRIPTION` card · `Courses (n)` ·
`Assigned Users (n)`. Both lists are links. No way to add from here — that is inside Edit.

**Create / Edit Training Role:** one form, two modes. `Role name`\* · `Description`\* ·
`Courses` (search-to-add, chips) · `Assigned users` (search-to-assign, chips).
This is where both relationships are edited, and nowhere else.

### 4.3 Courses tab

Search · `Create Course` · card per course.

Card: name · description · **method chips** · `+ Create Assessment` (plain text, top-right) ·
footer `N assessment(s)` · `N role(s)` · trigger summary.

**Course detail:** `Edit course` + `+ Create Assessment`. Cards: `DESCRIPTION` /
`AUTOMATIC TRIGGER` · `Assessment Methods (n)` (chip + downloadable document) ·
`Linked Roles (n)` · `Assessments (n)` (name, `1/1 completed`).

**Create / Edit Course:** three cards — `Course Details` (name\* · description\* ·
`Linked roles`), `Assessments` (inline method blocks: type select + document search),
`Automatic Assessment Trigger` (segmented: `No automatic trigger` · `Specific date` ·
`Recurring period`).

**Create Assessment:** reached from a course. `Assessment name`\* (pre-generated) ·
`Due date`\* · `Notes` · `Assign to`\* pre-filled from the course's linked roles.

### 4.4 Assessments tab

Search · status filter · table.

**Columns:** `ASSESSMENT` · `COURSE` · `DUE DATE` · `PROGRESS` · `STATUS`

`PROGRESS` is participants completed over participants assigned. Every row observed was
already `Completed`; no `Pending review` state appears, though the brief requires sign-off.

**Assessment detail:** stepper (`Assigned → In Progress → Completed`) · `Course Details` ·
`Assessments (n)` — which contains **methods**, not rounds (**Q1**) · `Participant Progress`
per person · `View Audit Trail`.

### 4.5 What the product gets right

Training roles with description, users and courses · courses linked to roles · acknowledge and
read & acknowledge with attached documents · evidence upload on completion · the Users view ·
all three trigger modes · create and edit as one form · `Assign to` pre-filled from roles ·
an append-only audit trail that resolves names.

---

## 5. Final designs

Built in `prototype/accura/training/`. Each entry records **what changed and why** — the screen
content itself is in the prototype.

### 5.1 Users list

Table, unchanged in shape. Row click and the name both navigate; the name is a real `<a>`.

### 5.2 User detail

**Read-only.** No approve, no reject, no checkboxes. Actions live in Review and on Participant
Progress.

Two-column: `Assigned Assessments` and `Training History` in the main column; `General info`
and `Assigned roles` in a 280px right rail. Roles answer *why this person owes these things* —
context, not content.

| Decision | Why |
|---|---|
| **Overdue sits on the due date, not the status** | overdue is a fact about a date and coexists with any unfinished state; as a mutually-exclusive status it could not |
| **`Signed off by`, not `Approved by`** | no approval event exists (§8). The column shows whoever actually signed — when that is the trainee, the record was never reviewed |
| **Type + document version on every history row** | without the version a record cannot evidence training on the *current* procedure (**Q5**) |
| **`Superseded` links to its replacement** | out-of-date alone is alarming; out-of-date *with the replacement already running* closes the loop — and surfaces the case that should alarm you, superseded with **no** replacement |
| **`Completed` does not appear in Assigned Assessments** | it belongs in history; a record in both lists is the same record twice |

### 5.3 History record panel

A **panel, not a page** — the row is one record in a list being scanned, and a full page loses
the reader's place. It targets the **Participant Progress** record, which is the only level that
answers a question about an individual (**Q8**).

Content order answers the audit question top to bottom: **who was trained, on what, which
version, proved how, signed by whom.**

| Block | Why there |
|---|---|
| `Trained on` — document · version · currency check | **first, not metadata.** An acknowledgement not bound to a version evidences nothing. Turns amber when superseded, naming whether retraining was assigned |
| `Assessment` — method chip · `Assigned` `Due` `Completed` `Via role` in a 2×2 | the dates only mean something against each other |
| `Evidence` | the artefact, where the method produces one |
| `Signatures` — one entry per signing event, with role | self-signed versus reviewed becomes visible instead of inferred |
| `Audit trail` — collapsed, expands newest-first | the escape hatch, not the content |
| `Export record` | the artefact handed to an auditor |

- State changes render **`~~old~~ → new`** — the product's own pattern, from its audit trail.
- The actor on `Created` is **System**, with the trigger named (**Q9**).
- **`Via role`** answers *why does this person owe this?* It is also the mechanism that lets a
  role change without touching history — see **Q12**.

**Renders as two events today**, not four: `Opened document` is unconfirmed and the manager
sign-off does not exist. That gap is the point, not a flaw in the design.

### 5.4 Roles

**List: table, not the card grid.** The counts are the role's meaning, and as numeric columns
they sort. Cards bury them in footer prose and stop scanning at a dozen roles. The product
already conceded this — the *edit* screen uses search-to-add, the pattern that scales.

**Columns:** `Training role` (description beneath) · `Courses` · `Users` · `Assessments`
(`Assessments` is derived, an addition). A `0` in `Users` renders in `text/tertiary` — a role
with courses but nobody in it is a real finding.

**Detail:** the `DESCRIPTION` card is removed — one line of prose does not need a surface; it is
the subline under the title. `Courses (n)` carries `Assessment method` and `Linked document`
**with version**, plus a superseded predecessor beneath it.

> **`Assigned users` status is scoped to this role's courses**, not the person's overall
> training. The Users tab shows a global status; on a role screen that is misleading — someone
> can be `Overdue` because of a different role. Scoped, it answers what the screen is for:
> **who is behind on this role.** `Outstanding` reads `3 of 4`, so `0 of 4` scans as *nothing
> owed*. This needs a per-user, per-role rollup that does not exist today.

**Create / Edit:** frame follows Create CAPA. Courses and users use `ComboboxField` with
`multiple`. The primary button is disabled until at least one course is selected — a role with
no courses is an empty obligation.

**Removing an assigned user is confirmed; adding is not.** `AlertDialog`, `Type=Destructive`:

> **Remove Amit Kothari from QA analyst?**
> 2 assignments not started will be withdrawn.
> 1 in progress will be cancelled — any evidence already uploaded is discarded.
> 4 completed records are kept. Training history is evidence and is never deleted.

Counts, not *"Are you sure?"*. Order: what is lost, then what is kept. Zero counts are omitted.
The last line states the rule at the moment it is relevant. See **Q12**.

### 5.5 Courses

**List: table.** `Course` · `Assessment methods` (chips) · `Assessments` · `Roles` · `Trigger`.

- Methods stay as chips — the one thing the card layout did well.
- **`Trigger` is a badge with the detail beneath**, plus a filter. Selecting `No automatic
  trigger` answers *which courses never assign themselves*. Labels are **the product's own**
  (`Specific date` · `Recurring period` · `No automatic trigger`); shortening them is a copy
  decision that must change the form and the table together (**Q10**).
- `0` in `Roles` in `text/tertiary` — a course no role links to is trained by nobody.
- Each row carries `Create Assessment` as a real button, not the card's plain text.

**Detail:** main column + 320px right rail, matching the User detail. `Assessments` (the table —
rows that grow, columns worth comparing) in the main column; `Assessment methods` and
`Linked roles` as **lists** in the rail — two rows do not need a header, and nothing here sorts.
Methods are outlined panels at `radius/md`; linked roles are plain rows, identical to
`Assigned roles` on the user detail.

**Create / Edit Course:** three cards.
- Documents appear **only** for `Acknowledge` and `Read & acknowledge`; the rest capture a response.
- Document options are **pinned to a version** — `SOP-002 v3.0 · Document control` (**Q5**).
- The definition-level control is **`+ Add assessment method`** (**Q1**).
- Edit confirms **unlinking a role** ("12 users stop being assigned this course from now on")
  and **removing a method** ("assessments already sent keep the methods they were sent with").

**Create Assessment:** `Assign to` names its provenance — *"Pre-filled from QA analyst"* — and
flags hand edits: *"1 assigned by hand — their record will not trace back to a role."* (**Q11**)

### 5.6 Assessments

**List.** `Assessment` (ID beneath) · `Course` · `Due date` · `Progress` · `Status`.

- **`Progress` carries a bar** beneath the fraction. `18 of 31` gives the number; the bar gives
  the proportion, which is what the column is scanned for. `0 of 28` renders as an empty track —
  *not started*, rather than missing data.
- **Overdue sits on the date, not the status** — the same rule as the user detail. A round can be
  overdue and still in progress. Rounds sort **overdue first**.
- Both `Assessment` and `Course` link, to different levels.

> The `COURSE` column restates half the assessment name, because names are auto-generated as
> `{course} - Assessment {n}`. Making it a link at least gives it a job. Fixing it properly means
> either shortening the generated name or dropping the column — a decision that waits on whether
> names become custom (**Q24**).

**Detail.** Header: back link · name · ID · course link · `View Audit Trail` · `Export`.
Main column holds `Participant progress`; a 320px right rail holds `Details` then
`Assessment methods`.

| Decision | Why |
|---|---|
| **The stepper is removed** | replaced by the status badge, `11 of 12 completed` and a bar, in `Details`. Stays true at every ratio, where three steps cannot express a partial group (**Q19**) |
| **`Assessment methods (n)`, not `Assessments (n)`** | this is the one screen where both levels appear at once, so it is where the naming has to be right (**Q1**) |
| **One `Notes` field** | the product showed `NOTES` and `DESCRIPTION` with nothing explaining which was which (**Q22**). The description belonged to the course, which is one click away |
| **`Course Details` split** | that card mixed round fields with course fields under a course-sounding heading. `COURSE` became the header link; `DUE DATE`, `CREATED` and `NOTES` became `Details` |
| **`Signed off by` names who actually signed** | four self-signed, one `Not signed`. Names, not `auth0|…` (**Q2**) |

**Audit trail** opens as a Sheet, reusing the history record panel's pattern — newest first,
state changes as `~~old~~ → new`, `Export Audit Report` in the footer. Two differences from the
product's:

- **`Created` is attributed to `System`**, with the trigger named — *"Triggered by SOP-001 v2.0 ·
  assigned to 12 users via QA analyst"*. The product attributes creation to the trainee, who did
  not create their own assignment (**Q9**). This trail is also the only evidence that the
  document-revision automation fired (§7).
- **It is unambiguously round-level** — several people plus the system. The product's
  single-participant trail cannot be told apart from a personal record (**Q20**). If the intent
  was participant-level, this is the wrong home and the history record panel is the right one.

**There is no action on this screen.** A manager who has found the problem can open the person's
record, and that is all — no chase, no remind, no approve. §8 landing where it hurts most.

### 5.7 Review queue

**Built 2026-09-11.** The manager's core job, and the module's largest gap until now (§8).
Prototyped as the post-review future state — no approval event exists in the data model yet.

**Selection-first**, the pattern most eQMS use: tick rows, act from a toolbar.

> **The checkbox is scope and nothing else.** An earlier build made it mean *approved*, so
> ticking a rejected row silently turned it into an approval. Decisions now come only from an
> explicit `Approve` or `Reject`, which removes the collision by construction rather than by rule.

**What reaches the queue.** Only methods that are not self-evidencing — `Practical`, `Written`,
and failed quizzes (Q10). Acknowledgements and passed quizzes never arrive, which is what stops
the queue filling with records nobody needs to read.

**Columns:** ☐ · `Person` · `Assessment` (method chip, score if failed) · `Waiting` · `Evidence` ·
record state.

- **`Waiting` is the primary column and the sort.** *9 days* is the fact that matters — someone
  finished and has been sitting unsigned since. Oldest first, so the worst case is row one.
- **`Evidence` is visible before opening** — a filename, `Written answer`, `10 answers`. You can
  see what reviewing will involve, and a row missing evidence where evidence is expected shows.
- Decided rows lock: checkbox disabled, excluded from `select all`.

### Approve requires opening. Reject does not.

The load-bearing decision on this screen.

| Action | Gate | Why |
|---|---|---|
| **Approve** | **must open the record** | approving attests the evidence is satisfactory. The row shows a *filename*, not the evidence — `gowning-checklist.pdf` says a file exists, not whether the gowning was correct |
| **Reject** | none | rejection causes are often administrative and visible from the row: wrong document version, superseded SOP, sent to the wrong person |

The toolbar states it rather than failing silently: `Approve` is disabled while the selection
contains unopened rows, with *"2 not opened yet — open to approve"* beside the count. Rows carry
an `Opened` marker once viewed.

> Without this gate, `select all → Approve` would be a two-click path to approving evidence
> nobody looked at — the most audit-exposed interaction in the module.

**The record panel is read-only** — record, evidence, waiting, and a `Close`. Decisions are made
on the selection, never in two places.

### Signing

**Both decisions are signed.** Rejecting changes a record's state and writes to a permanent
training history, exactly as approving does.

- **`Dialog`, not `AlertDialog`** — closing without signing loses nothing, which is the ×
  test in `AlertDialog.md`.
- One signature covers the batch (Part 11 §11.200); the **meaning is recorded with it**
  (§11.50): *"Approve 3 training completions"*, or *"Reject 1 training completion — Wrong
  document version"*.
- Identity block — name, email, role at sign-off, timestamp stamped when the dialog opens.
- **The attestation gates the button.** A signature nobody affirmed is not a signature.

**Rejecting is two short steps** — reason, then sign — rather than one long dialog. The reason is
a radio list (Q15), chosen so all four options are visible at once, and it travels into the
signature's meaning.

**Bulk reject shares one reason.** Correct for a batch with a common cause; when reasons differ,
reject separately.

**Self-approval is handled:** the reviewer's own records are excluded and the screen says where
they went — *"2 of your own records need another manager's sign-off"* (Q6).

**The empty state is the normal state** — a well-run queue is empty, so it reads *"Nothing
awaiting your review"*, not as an error.

### Open on this screen

- **`select all` includes a failed assessment.** Lena's 4-of-10 quiz is swept in with everything
  else; the approve gate happens to cover it, but whether failed records should be excluded from
  `select all` outright is undecided.
- **Nothing here exists in the data model** — no approval event, and `Awaiting review` is not a
  state records enter. See §8.

### 5.8 Shared patterns

Pagination on every listing (`Rows per page` 5·10·20). Row-click plus a real control in the
first cell. `CardTitle` as the one section-title token. Full pattern list, including two
hand-rolled components and why, is in
`docs/skills/accura-prototype-build/accura-prototype-build.md`.

---

## 6. Status inventory

### Participant record — one person, one assessment

```
Assigned → In progress → Awaiting review → Approved
                              └──────────→ Rejected → back to In progress
```

> **The product's record moves only `Pending → Completed`.** `Assigned`, `In progress` and
> `Awaiting review` are the round's vocabulary or proposed. See **Q3**.

### User — training standing

`Up to date` · `Pending` · `Overdue` — product-native, and the Users tab filter.
`Up to date` means *zero outstanding assignments*, not *trained on current versions* — a
distinction that matters after a document revision (**Q13**).

### Assessment round

`Assigned → In progress → Completed`. **Identical vocabulary to the participant record, one
level up.** A round is `Completed` when every participant is — not the same event (**Q3**).

### Not statuses, though they use the same pill

`Superseded` (the document moved on) · `Rejected` (a review outcome) · assessment-method chips.

### Provenance

| | Source |
|---|---|
| `In progress`, `Completed` | **named in the brief** |
| `Assigned` | implied by the brief, named by the product |
| `Up to date` · `Pending` · `Overdue` | **the product's own** |
| `Awaiting review` · `Approved` · `Rejected` · `Superseded` | **proposed during design work** |

---

## 7. Cross-module — Documents

The document list already carries `VERSION`, `STATUS` (`Effective` · `Superseded` · `Draft`),
`EFFECTIVE DATE` and `REVIEW DATE` — everything Training needs to bind a course to a version.

**It is already wrong in the live data.** `SOP-001` moved v1.0 → v2.0 with v1.0 marked
`Superseded`. Amit's acknowledgement still reads `Completed`, and **the record does not say
which version he acknowledged**, so whether the automation fired cannot be determined from the
product at all.

### The retraining trigger needs a decision the brief does not make

The brief describes the retrigger as unconditional — every document update, every time. In
practice:

| Question | Belongs on | Because |
|---|---|---|
| Minor revision — retrain or not? | the **document** | a typo fix is not a procedure change |
| Redo the whole course, or just re-acknowledge? | the **assessment method** | a quiz and an acknowledgement are not equivalent work |
| Does this assessment follow the document at all? | the **assessment** | a document attached for reference should not retrigger |

Two defects on the document list itself: `Raised by` shows an `auth0|…` identity (**Q2**), and
the review date is in the past on an `Effective` document with nothing flagging it.

---

## 8. Brief versus built

### In the brief, absent from the product

**Manager review and sign-off.** The brief:

> *"The Training Manager will then receive a notification and review the assessment. They can
> sign off to confirm that the user has completed the required training."*

The audit trail settles it — the complete history of a finished assessment is:

```
Created
Signed (Assessment Completion)   Amit Kothari
Status  Pending → Completed
```

**One signature, by the trainee, on their own work.** No notification, no review, no manager
event. Not merely un-surfaced — it does not happen.

**On-the-job handling.** The brief names it as the case review exists for — the one assessment
type that structurally requires a second person — and it has no distinct treatment.

**Version-bound records.** See §7 and **Q5**.

### Attribution — who added what

| | Source |
|---|---|
| `Up to date` · `Pending` · `Overdue` · `Assigned` · the audit trail · assessment IDs · all three trigger modes | **the product's own additions** |
| Review queue · `Rejected` · `Superseded` · record-level overdue · `Export record` · `Via role` · provenance flags · the trainee screens | **proposed during design work** |
| Review · sign-off · notification · on-the-job handling | **the brief's, and missing** |

### Two questions to put back to the brief's author

1. **Was manager review descoped deliberately, or is it still expected?** It is half the brief
   and the reason on-the-job training is mentioned at all.
2. **Is the document-revision trigger running?** It cannot be observed while records are not
   version-bound.

---

## 9. Open questions

Grouped by theme. **Resolved** items keep their decision so it is not re-litigated.

### Naming and vocabulary

**Q1 — One word, two levels.** *Assessment* means both a **method** (a type plus a document,
part of the course definition) and a **round** (a due date, assigned people, something that gets
completed). Both appear as buttons, and on the Course detail the two cards sit adjacent.

> **RESOLVED 2026-09-10.** `+ Create Assessment` keeps its name — it creates a round, which is
> what a user means. The definition-level control becomes **`+ Add assessment method`**, matching
> the `Assessment Methods (n)` card it feeds. **Still to fix:** the assessment detail card headed
> `Assessments (1)` contains *methods* — the one screen where both levels appear at once.

**Q2 — Signatures do not identify the signer.** `Signed by auth0|6a7d4c2ce723991a0afec0c9`.
Part 11 requires the signature to identify the individual. **The data exists** — the audit trail
renders `Amit Kothari · amit@accura.one` on the same page where Participant Progress shows the
raw identity. One component is not reading it. Same defect in CAPA's `Raised by`.

**Q3 — Round and participant share one vocabulary.** Both use `Assigned → In progress →
Completed`, but a round is `Completed` when *every* participant is. The audit trail also calls
the participant's first state `Pending` where the stepper calls it `Assigned`.

**Q4 — Three names for one object.** Tab `Roles`, form `Training Role`, action `Edit role`,
brief *training role*. Pick one and use it everywhere, including the tab.

### Evidence and records

**Q5 — Nothing is bound to a document version.** The picker attaches a document, not a version;
the course shows no version; the completed record does not say which version was acknowledged.
**This is the root of the module's biggest evidential gap** — §5.3's `Trained on` block, §7's
supersede case and the brief's central automation all depend on this one field.
*Fix: the picker resolves to a version, and the record stores it.*

**Q6 — No trainee screens.** No self-view, no completion flow. The brief also never says who
signs off a Training Manager's own training — self-approval is an audit finding in a GxP system.

**Q7 — Where does the approval queue belong?** Every module has approvals; a Review tab inside
Training would be the fifth such tab. Platform-wide task box, or per-module?

**Q8 — Training History links to the wrong level.** Clicking a completed row opens the *course*,
showing the round's data rather than this person's record.

**Q9 — `Created` is attributed to the trainee.** Amit did not create his own assignment; a
schedule or a role did. An audit trail attributing an automated action to the person it was done
*to* misstates who acted — and it is the same trail that would evidence the document-revision
automation firing.

### Workflow the brief does not settle

**Q10 — RESOLVED 2026-09-11. Which assessment methods require review?**
The brief states review and sign-off without exception, but splits the module into automated and
human-verified training. The line falls where the trainee's own click stops being evidence.

> **Decision: behaviour is fixed by assessment type. No per-method setting.**
>
> | Method | Completion | Why |
> |---|---|---|
> | `Acknowledge` · `Read & acknowledge` | trainee signature is sufficient | the act **is** the evidence |
> | `Quiz` | trainee signature, **if auto-graded against a pass mark** | the score is the evidence |
> | `Written` · `Practical` (on-the-job) | **manager sign-off** | someone must read the answer or witness the task |
>
> A per-method toggle was proposed and **rejected as unnecessary**: it would have added a control
> with nothing behind it until review exists. The cost, accepted knowingly: organisations that
> require sign-off on *every* GxP SOP acknowledgement cannot express that without a code change.
>
> **This setting decides what enters the Review queue** — only sign-off methods generate review
> work, which is what stops the queue filling with acknowledgements nobody needs to read.
>
> **The requirement must be captured on the record, not read live.** If the rule changes later,
> records completed under the old rule keep their original requirement — the same principle as
> `Via role`, and as Edit Course's *"assessments already sent keep the methods they were sent
> with."* Otherwise a rule change retroactively rewrites whether past records were compliant.
>
> **Depends on Q14:** `Quiz` is only self-evidencing when auto-graded and passed. A failed quiz,
> or one whose answers need reading, has no defined route while Q14 is open.

**Q11 — `Assign to` is a snapshot.** Editing the pre-filled list means a person can be assigned
while belonging to no linked role, leaving `Via role` with nothing to point at. Assignments need
a provenance flag: *via QA analyst* versus *added manually*. The prototype warns; the data model
does not yet record it.

**Q12 — What happens when a user or course is removed from a role?**

> **Recommendation.** 21 CFR Part 11 §11.10(e) forbids obscuring previously recorded
> information, so the structure is not a choice: **role membership is current state; a training
> record is a historical event.** Removing someone changes what they owe *from now on*; it
> cannot reach backwards, because the record stores the role as a field at the moment of
> assignment — which is what `Via role` is for.
>
> | Case | Handling |
> |---|---|
> | Completed | untouched, permanently. Often relabelled `Historical` |
> | Not started | withdrawn, logged in the audit trail |
> | **In progress** | **the only genuine variation** — cancel, or allow completion. Usually configurable |
>
> Two patterns worth adopting: **effective-dated membership** rather than deletion (*"was Amit
> in QA analyst on 9 September?"* stays answerable), and **logging the removal itself** as an
> auditable event with counts.
>
> **Must be confirmed against the implementation:** whether removal deletes rows or ends a
> membership cannot be told from the UI.
>
> *Cross-vendor patterns above are general knowledge, not verified research. The regulatory
> constraint is verifiable.*

**Q13 — Does `Up to date` mean what it says?** The product defines it as zero outstanding
assignments; the brief uses the phrase for document currency. After a revision, someone can be
`Up to date` while trained on a superseded version.

**Q14 — What happens to a failed auto-graded quiz?** A pass needs no human, so a fail is not
*awaiting review* — it is a fail. Whether it reassigns automatically or waits is unspecified.

**Q15 — Does rejection exist?** The brief describes review and sign-off only. Currently designed
as an explicit `Rejected` status with a required structured reason — Part 11 does not require
one, but an auditor seeing *rejected then approved* will ask what changed.

**Q16 — Batch signing.** A manager approving 40 records would enter their password 40 times.
Part 11 §11.200 allows lighter subsequent signings within one continuous session, and a bulk
approval should take **one** signature covering the batch. Neither is in the brief, and both are
the difference between a design that demos and one a manager can use on a Monday.

**Q17 — No overdue treatment.** Nothing shows what an overdue assignment looks like or what
happens when one passes its date.

**Q18 — Can two rounds of the same course be open at once?** If allowed, a trainee sees the same
course twice with different due dates and no explanation. If not, `+ Create Assessment` should
warn or be disabled while a round is open — it does neither.

### Interface

**Q19 — Should the round stepper exist?** It renders three steps for a lifecycle with two states
(`In progress` is derived, never stored), disagrees with the audit trail on the first step's
name, and **cannot express a partial group** — which is what a round always is. `1 / 1
completed` in the header says the same thing and stays true at every ratio.
**Recommended: replace it with the count plus a progress bar.**

**Q20 — Is the audit trail the round's or the participant's?** Title and ID say round; the events
say participant. One participant hides the difference. **This blocks §5.3** — the history record
panel needs the participant's trail.

**Q21 — The trigger renders as grey footer text**, sharing its styling with the counts beside it,
though it is the brief's central mechanism. *Addressed in the prototype as a badge with a filter;
whether to shorten the labels is still open.*

**Q22 — Two description fields.** The assessment detail shows `NOTES: desc` and
`DESCRIPTION: How to user eQMS` with no explanation of which is which.

**Q23 — `Amit Kothari ()`.** The user chip renders empty parentheses — a field the template
expects is absent. Same class as **Q2**.

**Q24 — Assessment name drift.** The form generates `How to user eQMS - Assessment`; the detail
shows `… - Assessment -1`. The name the user approved is not the name stored.

---

## 10. Copy issues

| Where | Reads | Should read |
|---|---|---|
| Users list, first column | `Course` | `Name` — the column contains people |
| Course card | `How to user eQMS` | `How to use eQMS` — data typo, on every screen |
| Course card | `+ Create Assessment` as plain text | a real button — the most consequential control on the screen |
| Create Course | `0 assessments` beside the empty-state sentence | one or the other |
| Course detail | `Edit course` vs `Create Course` | consistent casing (**Q4**) |
| Roles list footer | `1 course` · `2 course` | pluralise |
| CAPA listing | rows-per-page `1-5` / `1-10` | the number alone — the control sets a page size |
| Assessment detail | `Assessments (1)` containing methods | `Assessment methods (1)` (**Q1**) |

---

## 11. What is not built

| | |
|---|---|
| ~~**Review tab**~~ | **built 2026-09-11 (§5.7)** — as the future state; the workflow behind it still does not exist |
| **Trainee screens** | the whole other role (**Q6**) |
| **The workflow behind Review** | no approval event in the data model, and `Awaiting review` is not a state records enter. §5.7 is a design of the target state |
| **Role-scoped rollup** | `Outstanding` and role-scoped `Status` (§5.4) and the removal-dialog counts all need the same per-user, per-role query |
