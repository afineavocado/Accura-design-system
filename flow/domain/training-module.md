# Training module — domain reference

What a training module is for in a regulated quality system, how the proposed workflow maps
onto standard eQMS practice, and what the proposal does not yet answer.

**Status:** domain analysis of a proposed workflow. Not a build spec, not agreed scope.
Screens are implied, not designed.

---

## 1. The one question this module exists to answer

Every design decision here traces back to a single auditor question:

> **"Show me that the person who performed this task was trained on the current version of
> the procedure for that task, before they performed it."**

Three clauses, each of which forces something into the data model:

| Clause | Forces |
|---|---|
| *this person* | training is per-user, not per-team |
| *the current version* | records must name a **document version**, not a document |
| *before they performed it* | records must be **timestamped**, and training has a valid-from date |

A record that says "Sarah completed SOP-012 training" fails all three. One that says
"Sarah acknowledged SOP-012 **v4** on 14 Mar 2026, 09:12, e-signed" answers the question.

---

## 2. Regulatory basis

The module is not a productivity feature; it is a compliance obligation.

| Source | Requirement |
|---|---|
| **21 CFR 211.25** (GMP) | Personnel shall have education, training and experience for their assigned functions. Training conducted by qualified individuals, **on a continuing basis**, with sufficient frequency. |
| **21 CFR 820.25** (device QSR) | Establish procedures for identifying training needs. All personnel trained. **Training shall be documented.** |
| **ISO 13485:2016 §6.2** | Determine competence, provide training, **evaluate the effectiveness of the training**, ensure personnel are aware of the relevance of their activities, maintain records. |
| **21 CFR Part 11** | Completion and sign-off are electronic signatures — identity, meaning, timestamp, non-repudiation. |

> **§6.2 is the clause the proposal does not yet meet.** It requires evaluating whether the
> training *worked*, not only that it happened. See §9.

---

## 3. Object model

The proposal describes five things. Standard eQMS practice separates them into **six**, and
the missing split is the most consequential gap.

```
User ──────< TrainingRole >────── Course ──────< Assessment          (definitions)
                                                     │
                                                     └── Document (versioned)

                              Assignment                              (instances)
                        user × assessment × due date
                        status · evidence · signature
```

### The definition / instance split

The proposal uses the word **assessment** for two different objects:

| | In the proposal | Actually is |
|---|---|---|
| *"each course can have one or more Assessments"* | a template authored once by an admin | **Assessment** — a definition |
| *"when a user receives an assessment, they can complete it"* | one row per user, with a due date, status, evidence and signature | **Assignment** — an instance |

They have different lifecycles, owners, permissions and states. Every eQMS separates them
(Veeva: *Training Requirement* vs *Training Assignment*; MasterControl: *Course* vs *Training
Task*).

**Why it matters for design:** they are different screens. "Course setup" edits definitions;
"My training" lists instances. A model that conflates them produces a UI that cannot express
"this course has 3 assessments, assigned to 40 people, 12 of whom are overdue."

### Terminology mapping

The proposal's **Training Role** is a well-established concept under other names. Worth
knowing the equivalents when validating against other platforms or talking to QA:

| Proposal | Common industry names |
|---|---|
| Training Role | **Curriculum**, Job Function, Training Group, Role-based training profile |
| Course | Course, Training Item, Learning Object |
| Assessment (definition) | Training Requirement, Training Item, Activity |
| Assignment (instance) | Training Assignment, Training Task, Training Record |

The proposal's instinct — that a training role is **separate from a person's job title** — is
correct and is the standard model. A job title is HR data; a training role is a compliance
bundle. One person can hold several.

---

## 4. The document-revision mechanic

This is the core automation of any eQMS training module, and the main reason the module is
worth building rather than tracking in a spreadsheet.

```
SOP-012 v3 → v4 approved
   ↓
find Courses linked to SOP-012
   ↓
find TrainingRoles linked to those Courses
   ↓
find Users in those roles
   ↓
create an Assignment per user, referencing v4 specifically
```

Two consequences the proposal does not state:

**A user can be trained but not current.** Someone who acknowledged v3 while v4 is live is
not untrained — they are **out of date**. That is a third state, distinct from *never trained*
and *trained*. Compliance reporting depends on it.

**The acknowledgement is version-bound.** The record stores the version acknowledged. This is
what makes it auditable, and it is why acknowledgement cannot simply be a boolean on the user.

---

## 5. Assessment types

The proposal names two and leaves the rest simple. The standard set, and what each needs:

| Type | User does | System needs |
|---|---|---|
| **Acknowledge** | confirms they are aware of a document | document version, timestamp, signature |
| **Read & acknowledge** | opens the document, then confirms | as above, optionally time-on-document |
| **Quiz / exam** | answers questions | question bank, pass mark, attempts allowed, score |
| **Classroom / instructor-led** | attends | session date, attendee list, trainer |
| **On-the-job / practical** | performs the task observed | **observer sign-off** — cannot be self-certified |
| **External certificate** | trains elsewhere | file upload, expiry date |

The proposal's "user provides a description and uploads files" collapses the last four into
one. Workable for a first build, but note that **on-the-job training is the case the proposal
explicitly cares about**, and it is the one type that structurally requires a second person's
signature — not just a manager reviewing afterwards.

---

## 6. Assignment lifecycle

```
                     ┌─────────────── document revised ───────────────┐
                     │                                                ▼
  Not started ──> In progress ──> Completed ──> Pending review ──> Approved
                     │                               │
                     │                               └──> Rejected ──> In progress
                     │
                     └──> Overdue  (an overlay on any incomplete state, not a stage)
```

- **Overdue** is a flag, not a step. An assignment can be *in progress and overdue*.
- **Rejected** returns to the user with the reviewer's reason. It is not a terminal state.
- **Approved** is the only state that satisfies the audit question in §1.
- A document revision does not reopen the old assignment — it creates a **new** one. The old
  record stays closed and auditable.

---

## 7. Who does what

| Role | Can |
|---|---|
| **Trainee** | see own assignments, complete them, upload evidence, sign |
| **Training manager** | review and sign off completions, see all users, assign manually, run reports |
| **Training admin** | create roles and courses, link documents, set schedules |
| **Observer** | sign off practical/on-the-job assessments (may not be the training manager) |
| **Auditor / QA** | read-only across everything, export records |

The proposal merges admin and manager. Fine for a first build; worth knowing they separate in
larger organisations, because the person who *designs* the curriculum is often not the person
who *verifies* competence.

---

## 8. Screens the workflow implies

Nothing here is designed yet — this is the surface area the model produces.

**Setup**
- Training roles — list, detail, link users, link courses
- Courses — list, detail, define assessments, link documents
- Training matrix — roles × courses grid. Not in the proposal, but it is how QA answers
  "what does this role require?" and how auditors read the system.

**Trainee**
- My training — assigned, due, overdue
- Assessment completion — read document → acknowledge → e-sign; or upload evidence

**Manager**
- Review queue — completions awaiting sign-off
- Users — list, then user detail: department, training roles, history, in progress, completed
- Assessment detail — evidence, status, approvals, audit trail

**Reporting**
- Compliance view — % current by role and department, overdue list

---

## 9. Open questions — the proposal does not yet answer these

Raised, not resolved. Each changes the data model or the screens.

**Q1 — Due dates.** "Assigned" is not enough. Standard practice is a due date, usually *N days
from assignment*, configurable per course, with a different window for retraining than for
initial training. Without it there is no overdue, no escalation and no compliance percentage.

**Q2 — Effectiveness check.** ISO 13485 §6.2(d) requires evaluating whether training was
effective, not just completed. The proposal has completion and sign-off but no effectiveness
step. This is a genuine regulatory gap, not a nice-to-have.

**Q3 — What happens when someone is overdue?** Notify the user? Escalate to their manager?
Block them from executing tasks that require the training? Systems range from a reminder email
to hard task-gating. This is a policy decision before it is a design one.

**Q4 — Initial training vs retraining.** Same course, different trigger, usually different due
window. Should the record distinguish them? Auditors often ask for retraining specifically.

**Q5 — Who signs the practical assessment?** The proposal says the training manager reviews.
For on-the-job training the person who *observed* the task may not be the manager. One
signature or two?

**Q6 — Does the trainee's completion require a Part 11 signature, or only the manager's
sign-off?** Both are attributable acts. The CAPA module already treats sign-off as a full
e-signature; consistency argues for the same here.

**Q7 — Retention and export.** How long are records kept, and what does the exported training
record look like? It is the artefact handed to an auditor.

**Q8 — Assessment versioning.** If a quiz is edited after people have taken it, do historical
records point at the old version? Same problem as document versioning, one level up.

---

## 10. Reuse from the CAPA module

Training is structurally close to CAPA: a record moves through stages, collects evidence,
and is signed off by a second party. Most of the hard components already exist.

| Need | Already built |
|---|---|
| Workflow stage display | `Stepper` — horizontal and vertical, with per-step description |
| Sign-off | electronic signature pattern (`flow/capa-prototype-spec.md` §Electronic Signature) |
| Evidence + reviewer decision | CAPA action cards — submitted evidence, locked, accept/reject |
| Change history | audit trail record pattern |
| Status vocabulary | `Badge` variants |

The main genuinely new surfaces are the **training matrix**, the **course/role linking UI**,
and the **compliance reporting view**.

---

## 11. Confidence

The regulatory citations in §2 are specific and checkable. The industry terminology in §3 and
the assessment types in §5 come from general knowledge of how these platforms model training
(Veeva Vault Training, MasterControl, Qualio, Greenlight Guru, Dot Compliance) — they are
**not** the result of reviewing those products for this document.

The brief asked for validation against other eQMS platforms. That validation has **not** been
done. Treat §3 and §5 as a starting hypothesis to check against real products, not as
established fact.
