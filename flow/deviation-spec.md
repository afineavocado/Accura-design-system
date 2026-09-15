# Deviation Module — As-Built Screen Spec

> **What this is.** A record of what the **existing Accura One product** renders on each Deviation
> screen, taken from four screenshots supplied 2026-09-15. It documents what is *there*, not what
> should be there.
>
> **What it is not.** Not a design proposal, and not the source of truth for behaviour. The briefs
> are: `flow/brief/Deviation_Module_Business_Flow.md` (lifecycle, actors, transitions) and
> `flow/brief/Deviation_Module_Metadata_and_Screens.md` (field schema, copy). Where the screens and
> the briefs disagree, both are recorded here and the conflict is listed in §7 — **unresolved, not
> reconciled.**
>
> **Structure.** §1–9 are **as-built** — observation only. §10–11 are **assessment**: how the flow
> compares to other eQMS products, and a proposal for the one gap that is a correctness problem.
> §12 is the **scope decision** for the prototype. They are clearly separated so the record stays
> usable even if the assessment is rejected.
>
> **Coverage.** Five of nine screens, plus both registry filter menus. Captures supplied
> 2026-09-15 in two batches. The four unobserved states are named in §7 so the gap is visible
> rather than assumed.

---

## 1. Global shell

**Sidebar** (dark teal, collapsible — collapse control top-right of the rail):

`Dashboard` · `Documents` · `Training` · **`Deviations`** · `CAPA` · `Change Management` · `Reports`
Pinned to the bottom: `Knowledge Hub` · `Settings` · `Logout`

Active item is a filled lighter-teal block with the label in white. Every item carries a leading icon.

> ⚠️ This nav is **wider than our prototype's** — `Dashboard`, `Change Management`, `Reports`,
> `Knowledge Hub`, `Settings` and `Logout` do not exist in `app-sidebar.tsx`.

**Header bar** (white, full width): module title `Deviations` on the left, persistent across all
Deviation screens including the detail page. Right side carries a notification bell with a count
badge (`8` in the supplied captures). No account chip is visible in these screenshots.

---

## 2. Screen — Registry (list)

**Toolbar**, one row: search field (`Search deviations...`, leading magnifier) · `Status: All`
select · `Severity: All` select · `Create Deviation` button, right-aligned, solid green with a
leading `+`.

- Filter copy uses the **`Label: value` prefix** form, and the prefix repeats on **every option
  inside the menu**, not just the trigger — `Status: All`, `Status: Draft`, `Status: In Review`…
- Both menus render as **native OS selects** (macOS chrome, system highlight colour, a checkmark
  on the current value), not as styled design-system components.
- **Only two filters.** The brief's `Category` and `Department` are not present.
- No summary/count row between the toolbar and the table.

**`Status` menu — nine options, in order:**

`Status: All` · `Draft` · `In Review` · `Investigation In Progress` · `CAPA Pending` ·
`In Approval` · `Approved` · `Cancelled` · **`Overdue`**

**`Severity` menu — four options:** `Severity: All` · `High` · `Medium` · `Low`

> ⚠️ `Overdue` and `Cancelled` sit in the same list as the six lifecycle states, so one control
> filters two different things — see §8.13.

**Table columns**, in order: `DEVIATION ID` · `SHORT DESCRIPTION` · `STATUS` · `OWNER` ·
`CATEGORY` · `SEVERITY` · `DUE DATE`. Headers are uppercase.

**Status badges observed:** `In Approval` (light green, outlined) · `Approved` (solid green) ·
`In Review` (amber). No `Overdue` or `Cancelled` badge appears in the captured data.

**Rows — six records, verbatim:**

| Deviation ID | Short description | Status | Owner | Category | Severity | Due date |
|---|---|---|---|---|---|---|
| `ACME/DEV/2026/000006` | Test Deviation to cancel | In Approval | amit@accura.one | Minor | Low | Oct 11, 2026 |
| `ACME/DEV/2026/000005` | Test to attach file and delete | Approved | amit@accura.one | Minor | Low | Oct 11, 2026 |
| `ACME/DEV/2026/000004` | Test Deviation - JK 1109 | Approved | John Baker (Dept Owner) | Minor | Medium | Oct 11, 2026 |
| `ACME/DEV/2026/000003` | Production staff fall near machine that makes Pizza | Approved | amit@accura.one | Critical | High | Oct 10, 2026 |
| `ACME-DEV-2026-0002` | desc | Approved | amit@accura.one | Minor | Medium | Oct 08, 2026 |
| `ACME-DEV-2026-0001` | desc | In Review | amit@accura.one | Minor | Medium | Oct 08, 2026 |

Long descriptions wrap to a second line rather than truncating.

**Owner** renders as a raw email for five of six rows; one row renders `Full Name (Role)`.

**Footer:** `Rows per page` select (10) · `6 deviations` · pager with a single page.

---

## 3. Screen — Create New Deviation

`< Back to Deviations` link, then the page title **Create New Deviation** in page content. The
header bar still reads `Deviations`.

**One card, titled `Incident Details`,** holding every field. Required markers are red asterisks
after the label.

| Field | Control | Required | Observed detail |
|---|---|---|---|
| Title / short description | text input, full width | ✱ | placeholder `Short description of the incident` |
| Department | select, half width | ✱ | placeholder `Select department` |
| Deviation owner | text input, half width | ✱ | pre-filled `amit@accura.one` |
| Reviewers | search input, full width | — | placeholder `Search reviewers to add...`; helper text below: *Add zero or more reviewers. Selecting a name adds it immediately.* |
| Classification | pill group | ✱ | `Planned` · `Unplanned` — none selected |
| Category | pill group | ✱ | `Major` · `Minor` · `Critical` — none selected |
| Severity | pill group | ✱ | `High` · `Medium` · `Low` — none selected |
| Incident type | select, half width | ✱ | placeholder `Select incident type` |
| Product impacted? | pill group | — | `Yes` · `No` — **`No` pre-selected**, solid green |
| Incident details | textarea, resizable | ✱ | placeholder `Describe the incident in detail...` |
| Attachments | `+ Attach files` action | — | plain text-style control, no drop zone shown |

Layout alternates full-width and two-column rows; the pill groups pair Classification/Category and
Severity/Incident type side by side.

**Footer actions**, bottom-right, outside the card: `Cancel` (ghost) · `Save as Draft` (outlined) ·
`Submit for Review` (solid green).

> ⚠️ **No `Due Date` field.** The registry, the detail grid and the entire Overdue rule depend on it.

---

## 4. Screen — Deviation detail · `In Review`

Sample record `ACME-DEV-2026-0001`, title `desc`.

**Header row:** `< Back to Deviations`, record title with an amber `In Review` badge beside it.
Right-aligned: Deviation ID as muted text, then `View audit trail` (outlined, leading clock icon).

**Stepper:** step 1 `Draft` green filled with a checkmark; step 2 `In Review` green outlined with
the numeral `2` — current; steps 3–6 grey with numerals. Only the connector between 1 and 2 is
solid green; the rest are grey.

### 4.1 `Incident Details` — read-only

Same grid as every other state — uppercase micro-cap labels above values. `DATE RAISED`
`2026-09-09` · `RAISED BY` `auth0|6a7d4c2ce723991a0afec0c9` · `DUE DATE` `2026-10-08` ·
`DEPARTMENT` `Quality Control` · `OWNER` `amit@accura.one` · `CLASSIFICATION` `Unplanned` ·
`CATEGORY` `Minor` · `SEVERITY` `Medium` · `INCIDENT TYPE` `Process` · `PRODUCT IMPACTED` `No` ·
`REVIEWERS` `Sarah Johnson (QA)` · `DETAILS` `desc`.

**New here:** a final full-width row `IMPACTED PRODUCTS (1)` — count in the label — holding an
inset card on a muted ground: `ID` · `Batch B-123` on one line, `desc` beneath. A **read-only
preview of the list that is edited further down the same page.**

### 4.2 `Review Details` — editable

The first editable block in the lifecycle. Labels here are **sentence case at body size**, not the
uppercase micro-caps used by read-only grids.

| Element | Type | Observed |
|---|---|---|
| `Immediate action taken` | textarea, full width, resizable | placeholder `Describe any immediate containment / correction taken...` |
| `Impacted products` | list header | count `1 product` right-aligned on the same line |
| Product row | inset card on muted ground | heading `Product 1`, `✕` remove icon top-right |
| ↳ `Product (id or name)` | text input, half width | `ID` |
| ↳ `Batch number` | text input, half width | `B-123` |
| ↳ `Description` | textarea, full width, resizable | `desc` |
| `+ Add Impacted Product` | text-style action | bottom-left, below the card |
| `Save impacted products` | text-style action | beside it, muted — persists the list without changing status |

Both list actions render as plain text, not buttons — `Save impacted products` reads as the
less-prominent of the two.

### 4.3 Actions

**Primary, bottom-right:** `Approve & sign — advance to investigation` — solid green pill.

**No cancel or reject control appears anywhere on this screen** — see §8.14.

No inline audit-trail block; history is reached only through `View audit trail` in the header.

---

## 5. Screen — Deviation detail · `In Approval`

Sample record `ACME/DEV/2026/000006`.

**Header row:** `< Back to Deviations`, then the record title **Test Deviation to cancel** with an
`In Approval` badge beside it. Right-aligned: the Deviation ID as muted text, then a
`View audit trail` button (outlined, leading clock icon).

**Stepper** — its own full-width card directly under the header. Six steps, connected by rules:

| # | Label | State shown |
|---|---|---|
| 1 | Draft | green filled, checkmark |
| 2 | In Review | green filled, checkmark |
| 3 | Investigation In Progress | green filled, checkmark |
| 4 | CAPA Pending | green filled, checkmark |
| 5 | In Approval | green outlined, numeral `5` — current |
| 6 | Approved | grey, numeral `6` |

Completed connectors are solid green; the connector after the current step is grey and dashed.

**Content blocks** — stacked full-width cards, each a titled section:

**`Incident Details`** — read-only grid, four columns. Labels are uppercase micro-caps above values.
Fields: `DATE RAISED` `2026-09-11` · `RAISED BY` `auth0|6a7d4c2ce723991a0afec0c9` · `DUE DATE`
`2026-10-11` · `DEPARTMENT` `Manufacturing` · `OWNER` `amit@accura.one` · `CLASSIFICATION`
`Unplanned` · `CATEGORY` `Minor` · `SEVERITY` `Low` · `INCIDENT TYPE` `Document` ·
`PRODUCT IMPACTED` `No` · `REVIEWERS` `Sarah Johnson (QA)` · `DETAILS` `13434`.

`REVIEWERS` and `DETAILS` each occupy their own full-width row below the grid.

**`Review Details`** — `IMMEDIATE ACTION TAKEN` → *Not provided* (italic, muted).

**`Risk Analysis`** — `RISK ANALYSIS` → `1231241`. A block of its own, not nested under
Investigation Report.

**`Investigation Report`** — `IMPACT ANALYSIS` → *Not provided* · `ROOT CAUSE ANALYSIS` →
*Not provided*.

**`Associated CAPAs`** — count `1 CAPA` right-aligned in the card header. One inset row on a muted
background: CAPA reference `ACME/CAPA/2026/000017` as a green link, title `Test`, relationship
label `Associated`, and a solid green `Completed` status badge right-aligned.

**`Signatures`** — one card per captured signature, tinted light green with a solid green left
border:

| Role heading | Identity · timestamp | Statement (italic, quoted) |
|---|---|---|
| Department owner approval | `auth0\|6a7d…0c9` · Sep 11, 2026, 12:11 PM | *"I approve this deviation and authorise advancing it to investigation."* |
| Deviation owner approval | `auth0\|6a7d…0c9` · Sep 11, 2026, 12:11 PM | *"As deviation owner, I approve the investigation and its outcome."* |

**Signing bar** — bottom of the page, right-aligned: the notice `Owner signed. Sign for each
reviewer:` followed by the button `Sign as Sarah Johnson (QA)` (white, outlined, elevated).

---

## 6. Screen — Deviation Audit Trail (drawer)

Opens as a **right-side overlay** covering roughly a third of the viewport; the page behind dims
and stays in place. Header: title `Deviation Audit Trail`, subtitle `ACME/DEV/2026/000006`, close
`X` top-right. The list scrolls; `Export Audit Report` (solid green) is pinned bottom-right.

**Entry anatomy:** circular avatar with initials (`AK`) · actor name **Amit Kothari** ·
`amit@accura.one` · timestamp `Sep 11, 2026, 12:11 PM` · action line · optional change chip.

**Change chip:** a bordered pill reading `Status`, then the old value struck through in red, an
arrow, and the new value in green — e.g. `Status  ~~CAPA Pending~~ → In Approval`.

**Action lines observed:** `Signed (Owner Approval)` with a second line `Owner Approval` ·
`Status changed` · `Updated` · `Status changed (Department Owner Approval)` with a second line
`Department Owner Approval`.

Entries are separated by hairline rules and ordered newest first.

---

## 7. Screens not supplied

No capture exists for these, and nothing here should be assumed about them:

`Draft` · `Investigation In Progress` · `CAPA Pending` · `Approved` (closed) · `Cancelled` · the
Overdue treatment on a record that is actually overdue.

---

## 8. Findings — screens vs briefs

Recorded, not resolved.

**1. Both Deviation ID formats are live.** Four records use `ACME/DEV/2026/000006`, two use
`ACME-DEV-2026-0002`. The brief permits both (§12) without deciding. This is real data, not a
mock-up inconsistency.

**2. Create has no Due Date field** — confirmed visually. Yet every record shows one, the registry
sorts on it, and the Overdue rule depends on it. Origin unknown: auto-calculated, set at triage, or
a field missing from the form.

**3. The registry has two filters, not four.** `Category` and `Department` are columns but not
filters, though the brief lists both as core attributes.

**4. The audit trail is NOT empty.** The brief states an empty state of `No history recorded yet.`
on both `In Approval` (§7.4) and `Approved` (§8). The live drawer shows a full history. **The brief's
sample was wrong**, and would have had us build an empty state that contradicts its own invariant
§9.7 (append-only) and 21 CFR Part 11 §11.10(e).

**5. Audit entries appear duplicated.** `CAPA Pending → In Approval`, `Investigation In Progress →
CAPA Pending`, `In Review → Investigation In Progress` and `Signed (Owner Approval)` each appear
**twice**, all stamped `12:11 PM`. Either every transition is written twice, or the drawer renders
the list twice. Under an append-only audit policy a duplicate entry is a compliance defect, not a
cosmetic one.

**6. A layout bug in the drawer.** One change chip overlaps the timestamp and action line of the
entry below it — the chip escapes its entry's bounds.

**7. Date formats are inconsistent within one screen.** The Incident Details grid renders ISO
(`2026-09-11`, `2026-10-11`); signatures and audit entries render `Sep 11, 2026, 12:11 PM`; the
registry renders `Oct 11, 2026`.

**8. Raw Auth0 IDs are shown to users.** `RAISED BY` and every signature identity render
`auth0|6a7d4c2ce723991a0afec0c9`. The brief (Business Flow §7) says identities resolve to `email`
or `Full Name (Role)`. The same screen proves it is possible — `REVIEWERS` renders
`Sarah Johnson (QA)`.

**9. Owner rendering is mixed in one column.** Five rows show a raw email, one shows
`John Baker (Dept Owner)`.

**10. The Department Owner statement is filed under In Approval.** Its wording — *"…authorise
advancing it to investigation"* — belongs to the `In Review` gate. So a signature captured at step 2
is displayed inside the step-5 Signatures block. Consistent with the brief, but it means Signatures
is a lifetime ledger, not a list of approval-stage signatures.

**13. `Overdue` and `Cancelled` are options in the `Status` filter,** alongside the six lifecycle
states. The control answers two questions at once: *where is this record in its lifecycle* and *is
it late / void*. A record that is both `In Review` and overdue can only be found under one of them.
Same shape as `UseStatus` absorbing `Superseded`/`Obsolete` in Documents.

**14. `In Review` has no cancel or reject control.** Business Flow §5 Step 2 makes rejection one of
the two decisions at this gate — *"Invalid / duplicate / non-applicable → transition to
`Cancelled`"* — and §3 draws the arrow. Metadata §4.4 names a "Cancel / Reject path". The screen
shows only `Approve & sign`. Either the path is somewhere not captured, or **`Cancelled` is
unreachable from the state the brief says owns it**, which would make that filter option dead.

**15. `PRODUCT IMPACTED` is `No` while `IMPACTED PRODUCTS (1)` lists a product** — both on the same
screen, a few lines apart. Either the flag and the list are independent by design, or the flag is
stale; as shown, the record contradicts itself.

**16. Impacted products render twice on one page** — read-only inside `Incident Details`, editable
inside `Review Details`. Defensible (locked context above, workspace below), but it doubles the
block's vertical cost and the two can visibly disagree until `Save impacted products` is pressed.

**17. `Save impacted products` is a text-style action.** A control that writes to a regulated record
reads as less prominent than `+ Add Impacted Product` beside it, and gives no indication of whether
unsaved edits exist.

**18. Label casing splits by editability** — read-only grids use uppercase micro-caps, editable
blocks use sentence-case body labels. Consistent across every capture, so it appears deliberate.

**19. The brief's inline audit block does not exist.** Metadata §4.4 places a `Deviation Audit
Trail` block with `Export Audit Report` on the `In Review` screen. Live, history is only in the
drawer behind `View audit trail`.

**20. Filters are native OS selects.** Both menus render with macOS system chrome and the prefix
repeated on every option (`Status: Draft`, `Status: In Review`). Not design-system components.

**11. `Risk Analysis` is its own top-level block,** separate from `Investigation Report`, although
the brief groups both under the investigation stage.

**12. CAPA ID formats will not resolve across modules.** Deviations reference
`ACME/CAPA/2026/000017`; our CAPA prototype uses `CAPA-0003`.

---

## 9. Reusable in our prototype

| Need | Existing |
|---|---|
| 6-step lifecycle header | `stepper.tsx` |
| Multi-signature dialog | `RecordSignatureDialog` in `record-workflow.tsx` |
| Read-only titled blocks | `RecordSection` |
| Audit drawer + export | `RecordAuditDrawer` |
| Registry behaviour | `useRowClick` · `TablePagination` · `ListSummary` · `Choice` |

Genuinely new: the dynamic **Impacted Products** list with independent save, and the
**Associated CAPAs** row with a live status echo.

The Impacted Products list is now fully specified by §4.2 — per-row `Product (id or name)`,
`Batch number`, `Description`, a `✕` per row, `+ Add Impacted Product`, and a save that does not
advance status. It is the only block in the module with no existing equivalent in our prototype.


---

## 10. Assessment — how this compares to other eQMS products

> Not observation. This section compares the documented flow against common practice in
> MasterControl, Veeva Vault QMS, TrackWise, ETQ Reliance and similar, and against ICH Q9/Q10 and
> 21 CFR 211.192.

### 10.1 What is conventional and correct

- The `Deviation → investigation → CAPA → approval → closed` chain is the industry-standard shape.
- **Referencing the CAPA by ID with a live status echo, never duplicating its state** (Business
  Flow §7, invariant §9.6) is the correct integration pattern. Systems that copy CAPA status into
  the parent record drift; this one does not.
- Signatures as a **visible lifetime ledger with per-role meaning statements** is good Part 11
  practice — better than burying signature meaning in a modal nobody re-reads.
- One accumulating page rather than tabbed stages keeps prior context visible during sign-off.

### 10.2 Gap A — there is no way to send a record back *(correctness)*

Business Flow §5 Step 5: *"A signatory refusing to sign may return the record via a cancellation
action → `Cancelled`."*

So a QA manager at `In Approval` who judges the root-cause analysis inadequate has one option:
**cancel the deviation.** But a deviation records an event that actually happened. `Cancelled` means
*this report was invalid or duplicate* — not *this investigation was sloppy*. The two are being
collapsed into one terminal state.

Consequences, both bad:

- The record is wrongly cancelled, and a real quality event disappears from the system — an
  inspection finding waiting to happen; or
- Reviewers sign inadequate work, because the alternative is destructive.

Every mature eQMS separates **reject/return for rework** from **cancel/void**. Return moves the
record to an earlier state with a mandatory reason and a signature; cancel ends it.

**Accura already solves this elsewhere.** The Documents module has a `returned` annotation that
sends a record back to `Draft` carrying `reason`, `name`, `timestamp` and `fromStatus`, renders a
destructive `Alert` — *"Returned to Draft by …"* — sets the next action to `Revise and resubmit`,
marks prior signatures historical, and writes `Rejection signed — returned to Draft` to the audit
trail. Training's review queue likewise keeps Reject distinct from Cancel. **Deviation is the odd
one out inside Accura's own product.** Proposal in §11.

### 10.3 Gap B — classification is captured but never used *(product decision)*

The form collects `Category` (Minor / Major / Critical) and `Severity` (High / Medium / Low), and
**nothing branches on either.** A Minor/Low planned deviation walks the same six states, full RCA,
CAPA gate and multi-signature approval as a Critical/High one.

Risk-proportionate handling is what ICH Q9 expects and what peer systems implement: minor
deviations typically close on QA review alone, with no formal investigation and no CAPA. Forcing
the full path on everything has a predictable failure mode — **people stop logging minor
deviations**, and the system loses the data it exists to collect.

Related framing problem: state 4 is named **`CAPA Pending`**, which presents a CAPA as the default
outcome. The brief does allow an explicit *"no CAPA required"* decision, but it sits inside a state
named after the thing being declined. Regulators cite over-CAPA-ing as well as under-CAPA-ing; a
justified no-CAPA decision should be an equal first-class outcome.

This one changes the state machine, so it is a product decision, not a prototype fix.

### 10.4 Gap C — impacted products are free text *(traceability)*

`Product (id or name)` and `Batch number` are plain text inputs (§4.2). The system therefore cannot
reliably answer *"show me every deviation affecting batch B-123"* — the question an inspector asks
and the question that matters during a recall. Peer systems bind these to actual batch/lot records.

The captured data already shows the cost: `PRODUCT IMPACTED: No` sits a few lines above
`IMPACTED PRODUCTS (1)` on the same screen (§8.15).

### 10.5 Three smaller divergences

**No due-date management.** The date drives the entire Overdue rule but has no field on Create
(§8.2), no extension-with-justification flow, and no escalation beyond a badge. In peer systems an
extension is itself an auditable, approved event.

**No links between quality events.** *Duplicate* is a listed cancellation reason, but nothing can
point at the original — nor at a related complaint, change control, or prior deviation. That
linkage is how repeat-offender trends are found.

**No periodic review of long-running records.** A deviation sitting in Investigation for 90 days
only accumulates an Overdue badge; there is no check-in obligation.

---

## 11. Proposal — the return transition (Gap A)

Modelled on the Documents `returned` pattern so the two modules behave alike.

### 11.1 It is not a seventh state

`Returned` is **an annotation plus a backward transition**, not a new lifecycle state. The stepper
keeps six steps. This matters: adding a seventh box would break invariant §9.2 ("no skipping")
and imply a state records can sit in.

```ts
returned?: {
  reason: string        // mandatory, free text
  name: string          // who returned it
  role: string
  timestamp: string
  fromStatus: Status    // the state it was returned FROM
}
```

The record's `status` moves to the target state; `returned` describes how it got there.

### 11.2 Where it is allowed

| From | Returns to | Why |
|---|---|---|
| `In Approval` | `Investigation In Progress` | RCA or impact analysis inadequate |
| `In Approval` | `CAPA Pending` | investigation sound, corrective plan insufficient |
| `CAPA Pending` | `Investigation In Progress` | CAPA cannot be framed on the evidence given |
| `Investigation In Progress` | `In Review` | triage was wrong — wrong owner, wrong scope |

`In Review` keeps **no** return path. It is the entry gate: an invalid or duplicate report there is
genuinely `Cancelled`, which is what that state is for. Giving one state both actions is what
created the confusion in the first place.

### 11.3 Rules

1. **Reason is mandatory.** The signature dialog already supports this — `reasonRequired` on
   `RecordSignatureDialog` (`record-workflow.tsx`), built for exactly this case.
2. **Return is signed.** It is a decision on a regulated record, and Documents signs its rejection.
   Statement: *"I am returning this deviation for further work. It has not been approved."*
3. **Prior signatures become historical.** They stay visible in the ledger — an append-only trail
   must not lose them — but are marked superseded and do not count toward the next approval. The
   record must be re-signed on its way back up. This is Documents' rule verbatim.
4. **Steps after the new current step revert to *Not started*.** The stepper shows honest present
   state; the round trip lives in the audit trail, not in the stepper.
5. **Audit entry names both ends**, e.g. `Returned to Investigation In Progress from In Approval —
   Sarah Johnson (QA)`, with the reason.
6. **`Cancelled` narrows** to invalid, duplicate, or out-of-scope reports only. Update Business
   Flow §5 Step 5, which currently routes a refusal to sign into cancellation.

### 11.4 On screen

- A destructive `Alert` at the top of the detail page while `returned` is set and the record has
  not advanced past that state: **"Returned from In Approval by Sarah Johnson (QA)"**, with
  timestamp and reason, and the note that prior signatures are historical.
- The block the return targets is editable again; everything before it stays locked.
- Next action reads **`Revise and resubmit`**, matching Documents.
- Registry: `Returned` shown as a **badge beside the status**, not as a status value — the record
  genuinely *is* in `Investigation In Progress`. This also avoids repeating §8.13, where `Overdue`
  and `Cancelled` were folded into the Status filter.

### 11.5 Cost

Small. `RecordSignatureDialog` already has `reasonRequired`; `Alert` exists; the annotation shape
is copied from `DemoDocument`. The real work is the four transition rules and deciding whether
`In Approval` returns to a fixed target or lets the signatory choose.

### 11.6 Open question for the brief's author

**Was the cancel-as-rejection wording deliberate, or shorthand?** If a real reviewer today cancels
deviations to send them back, the production data may contain cancelled records that were never
invalid — which would matter for any trend analysis built on that field.


---

## 12. Scope decision — cancel and return in the prototype

**Decided 2026-09-15.** The PO wants the happy path. Neither cancel nor return is a happy path, so
the question is not which to build but **what not to lock in while building neither.**

### 12.1 What peer products do

Across MasterControl, Veeva Vault QMS, TrackWise and ETQ Reliance these are **two distinct verbs**,
not two labels for one action:

| | Reject / Send back | Cancel / Void |
|---|---|---|
| Means | the work is not good enough | the record should not exist |
| Who | any approver, as a workflow verdict | usually QA or admin only |
| Where | any review or approval gate | typically early states only |
| Result | returns to an earlier state | terminal |
| Requires | a reason | a reason, often a coded one |

Two details worth carrying over:

- **Cancel is permission-gated; reject is not.** Rejecting is a normal part of an approver's job.
  Voiding a quality record is an administrative act, and in most systems an ordinary reviewer
  cannot perform it.
- **Cancel is usually unavailable late in the flow.** A record deep in approval is finished or
  corrected, not voided. The brief offering cancellation through `In Approval` (§6) is the
  unusual part.

### 12.2 What the prototype does

| | Decision |
|---|---|
| Overdue | **Not a status.** Rendered as red `Overdue` text beneath the due date — on the field that causes it — never as a badge in the Status column and never as an option in the Status filter. A badge sitting beside the status reads as a seventh state, which is the exact thing brief §6 says it is not. |
| Cancel on `In Review` | **Build it.** The one place it is honest — a duplicate or out-of-scope report caught at triage genuinely should not exist, and Business Flow §5 Step 2 treats it as a real decision there rather than a fallback. Reason required. |
| Cancel on `In Approval`, `CAPA Pending`, `Investigation In Progress` | **Do not build.** Not a design statement — scope. A signatory who will not sign does nothing in a happy-path demo, which is accurate. |
| `Cancelled` as a record state | **Displayable.** One seeded record, a badge, a read-only detail screen. `Cancelled` is already an option in the live Status filter (§8.13), so it will be clicked. Showing a state is cheap; building the transition into it is not. |
| Return / send back (§11) | **Deferred.** Designed, not built. |

**Button copy: `Cancel — invalid or duplicate`,** not bare `Cancel`. The label carries the meaning
at zero cost and stops the control reading as "reject this work" — the same move as `All statuses`
over `Status: All`.

### 12.3 Why `In Approval` gets no cancel button

Adding it costs one button and encodes *refuse to sign = destroy the record* into the artefact the
development team will copy. Omitting it costs nothing the demo needs. If the flow is later built
properly, §11 is the design; nothing here forecloses it.

### 12.4 Still open regardless of scope

**§11.6 stands and is not a design question.** If reviewers today cancel deviations in order to
send them back, production `Cancelled` records include records that were never invalid — and any
trend analysis on that field is wrong. For the brief's author, whatever the prototype does.
