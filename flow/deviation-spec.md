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
> **Coverage.** Seven of nine screens, plus both registry filter menus. Captures supplied
> 2026-09-15 in three batches. The two unobserved states are named in §7 so the gap is visible
> rather than assumed.
>
> ⚠️ **Read §10.14 and §10.2 before trusting anything written here about rejection.** The third
> batch of captures overturned a finding and an entire assessment section that the first two had
> supported. Both are struck through rather than deleted, because the reasoning that produced
> them was the reasoning available at the time and will recur.

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
> filters two different things — see §10.13.

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
| QA reviewer | search input, full width | ✱ | placeholder `Search QA personnel...`; helper: *The QA reviewer signs the final approval alongside the deviation owner.* **Not present in the first capture of this screen, only the third.** Separate from Reviewers, and required |
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

**No cancel or reject control appears anywhere on this screen** — see §10.14.

No inline audit-trail block; history is reached only through `View audit trail` in the header.

---

## 5. Screen — Deviation detail · `Investigation In Progress`

Sample record `ACME-DEV-2026-0001`, title `desc`. Single column, every block full width and
open. Stepper on step 3.

### 5.1 `Incident Details` — read-only

As §4.1, plus one field not present in any earlier capture: **`QA REVIEWER`**, rendering `—`
when unset. Note that the same screen renders unset values elsewhere as italic *Not provided*
(§8.21).

`IMPACTED PRODUCTS (1)` carries forward as the same read-only inset card.

### 5.2 `Review Details` — now locked

`IMMEDIATE ACTION TAKEN` → *Not provided*. The block is read-only from this state on.

### 5.3 `Risk Analysis` — editable, rich text

Label `Risk analysis` with a **red required asterisk**. The control is a **rich-text editor**,
not a textarea: a toolbar of bold, italic, underline, bulleted list, numbered list, insert
table, and clear formatting sits above the input. Placeholder: *"Assess the risk arising from
this deviation. You can add tables or paste one from Word..."*

The Word reference is the tell — investigators paste formatted risk tables out of existing
documents, so the field has to survive that.

### 5.4 `Investigation Report` — editable

| Element | Control | Observed |
|---|---|---|
| `Impact analysis` ✱ | textarea | placeholder `Analyse the impact of the deviation...` |
| `Root cause analysis` ✱ | textarea | placeholder `Document the root cause analysis...` |
| `Supporting files` | `+ Attach files` | text-style action |
| `Save investigation report` | text-style action | saves without changing status |

The independent save mirrors `Save impacted products` at `In Review` (§4.2): a block can be
persisted without advancing the lifecycle.

### 5.5 `Associated CAPAs` — present already, and interactive

Appears at **this** state, one earlier than either brief implies. Count `0 CAPAs` right-aligned.

Description: *"No CAPAs associated yet. Search and select a CAPA (or create a new one) to move
this deviation to CAPA Pending."* — so **linking a CAPA is what advances the state**, not a
separate Next button.

Controls: `Associate a CAPA` search field, placeholder `Search CAPAs to add...`, helper
*"Selecting a CAPA associates it immediately."*, and `+ Create new CAPA`.

### 5.6 `Signatures`

Present from this state, carrying the department owner's signature captured at the `In Review`
gate. Rendered as a tinted card with a coloured left border.

### 5.7 Actions

Bottom bar, left to right: **`Reject — send back one stage`** (text style) · **`Cancel
deviation`** (text style) · **`Done`** (solid green, right-aligned).

`Done` is the same label at both captured states, rather than a state-specific verb.

---

## 6. Screen — Deviation detail · `CAPA Pending`

Same record, stepper on step 4. Identical single-column layout; every prior block now read-only,
including Risk Analysis and Investigation Report, both showing *Not provided*.

`Associated CAPAs` becomes the working block. Count `1 CAPA`. The linked row shows:

- CAPA reference `ACME/CAPA/2026/000019` as a link, title `Test`, relationship `Associated`
- an amber **`In progress`** status badge, echoed from the CAPA module
- a **`Mark completed`** text action
- an **`✕`** to remove the association

The `Associate a CAPA` search and `+ Create new CAPA` remain below, so more than one CAPA can
be linked.

Actions unchanged: `Reject — send back one stage` · `Cancel deviation` · `Done`.

> ⚠️ `Mark completed` sets the status of a **CAPA** from inside a deviation. Business Flow
> invariant §9.6 says the deviation stores the reference and never duplicates CAPA state. A
> control that writes CAPA status from the deviation screen is either a violation of that
> invariant or a cross-module action the briefs do not describe.

---

## 7. Screen — Deviation detail · `In Approval`

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

## 7b. Dialog — Electronic signature (Reject and Cancel)

Captured 2026-09-16. One dialog serves both actions; only the description, the
reason label and the confirm button differ.

**Header.** Title `Electronic Signature — 21 CFR Part 11`, then a line naming
the consequence:

| Action | Description |
|---|---|
| Reject | *Rejecting sends this deviation back one stage for rework and requires a mandatory reason and your electronic signature.* |
| Cancel | *Cancelling requires a mandatory comment and your electronic signature.* |

**Identity block** — three read-only inputs on a muted ground, two across then
one full width:

| Field | Observed |
|---|---|
| `Full Name` | `amit@accura.one` — an email, not a name (§10.29) |
| `Role at Sign-off` | `—` (§10.30) |
| `Time and Date` | `16-09-2026 11:18:24` — DD-MM-YYYY (§10.31) |

**Inputs.**

- `Reason for rejection` ✱ / `Reason for cancellation` ✱ — textarea, placeholder
  `Add a comment...`
- `Enter password` — masked input, placeholder `Enter your password`
- Attestation checkbox: *By entering my credentials, I confirm that this action
  complies with formal requirements as equivalent to my handwritten signature.*

**Footer.** `Cancel` (quiet) · `Sign & reject` / `Sign & cancel` — solid green,
rendering muted until the form is valid.

> Confirms "send back **one stage**" in the product's own words, which settles
> the question §13 left open about whether `In Approval` can return two stages.
> It cannot.

---

## 8. Screen — Deviation Audit Trail (drawer)

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

## 9. Screens not supplied

No capture exists for these, and nothing here should be assumed about them:

`Draft` · `Cancelled` · the Overdue treatment on a record that is actually overdue.

---

## 10. Findings — screens vs briefs

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

**14. ~~`In Review` has no cancel or reject control.~~ — RETRACTED 2026-09-15.**
~~Both briefs make rejection one of the two decisions at this gate; the screen shows only
`Approve & sign`, so either the path is somewhere not captured, or `Cancelled` is unreachable from
the state that owns it.~~

The `Investigation In Progress` and `CAPA Pending` captures show **`Reject — send back one stage`**
and **`Cancel deviation`** side by side in the action bar. Both controls exist and they are
distinct actions.

**What the mistake was:** treating a control missing from one capture as a missing capability,
then building on it, rather than marking it unverified. Both controls are text-style and
bottom-left — exactly where a crop loses them.

**What survives** is a finding about the *brief*, not the product: neither brief mentions a reject
or send-back transition anywhere, and Business Flow §5 Step 5 routes a refusing signatory into
cancellation. The product is ahead of its own documentation.

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

**21. Empty values render two different ways on one screen.** `QA REVIEWER` shows `—` while
`IMMEDIATE ACTION TAKEN` shows italic *Not provided*, a few hundred pixels apart.

**22. `Risk analysis` is a rich-text field, not a textarea.** Bold, italic, underline, lists,
insert table, clear formatting — and the placeholder says *"You can add tables or paste one from
Word"*. No other field in the module has formatting. Investigators evidently paste risk tables out
of existing documents, which is a content requirement, not a nicety.

**23. `Associated CAPAs` appears at `Investigation In Progress`,** one state earlier than either
brief implies, and linking a CAPA is what advances the record: *"Search and select a CAPA (or
create a new one) to move this deviation to CAPA Pending."* There is no separate advance button
for that transition.

**24. `Mark completed` sets CAPA status from inside the deviation.** Business Flow invariant §9.6
says the deviation stores the reference and never duplicates CAPA state. Either the invariant is
violated, or this is a cross-module write the briefs do not describe.

**25. The primary action is `Done` at every open state,** not a state-specific verb. The briefs
specify `Approve & sign — advance to investigation` at `In Review` (§13.9) — so either the label
changed, or it differs per state and `Done` covers the middle three.

**27. `Classification` options are ordered `Unplanned`, `Planned`** on screen; brief §13.2 lists
`Planned`, `Unplanned`. Unplanned first is the sensible default — most deviations are unplanned —
but the brief is the vocabulary source, so the order is left as the brief has it and logged here.

**28. `QA reviewer` was absent from the first capture of Create** and present in the third. Either
the screen changed between captures or the field was cut off. It is required, so it is not a
detail: a prototype built from the first capture alone would omit a mandatory field.

**26. Three investigation fields are required** — `Risk analysis`, `Impact analysis`,
`Root cause analysis` all carry the red asterisk. Neither brief marks any of them required.

**29. `Full Name` in the signature dialog shows an email,** `amit@accura.one`.
The same raw-identity problem as `RAISED BY` (§10.8), but on the field a
regulator reads to know who signed.

**30. `Role at Sign-off` is empty** — `—`. Part 11 §11.50 requires a signature
to carry the signer's identity and the meaning of the signing; a blank role
weakens the first half, and the deviation's own Signatures block does render
roles elsewhere.

**31. A third date format.** The dialog stamps `16-09-2026 11:18:24`
(DD-MM-YYYY). The detail grid uses ISO, signatures use `Sep 11, 2026, 12:11 PM`,
the registry uses `Oct 11, 2026`. Four formats in one module.

**11. `Risk Analysis` is its own top-level block,** separate from `Investigation Report`, although
the brief groups both under the investigation stage.

**12. CAPA ID formats will not resolve across modules.** Deviations reference
`ACME/CAPA/2026/000017`; our CAPA prototype uses `CAPA-0003`.

---

## 11. Reusable in our prototype

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

## 12. Assessment — how this compares to other eQMS products

> Not observation. This section compares the documented flow against common practice in
> MasterControl, Veeva Vault QMS, TrackWise, ETQ Reliance and similar, and against ICH Q9/Q10 and
> 21 CFR 211.192.

### 12.1 What is conventional and correct

- The `Deviation → investigation → CAPA → approval → closed` chain is the industry-standard shape.
- **Referencing the CAPA by ID with a live status echo, never duplicating its state** (Business
  Flow §7, invariant §9.6) is the correct integration pattern. Systems that copy CAPA status into
  the parent record drift; this one does not.
- Signatures as a **visible lifetime ledger with per-role meaning statements** is good Part 11
  practice — better than burying signature meaning in a modal nobody re-reads.
- One accumulating page rather than tabbed stages keeps prior context visible during sign-off.

### 12.2 ~~Gap A — there is no way to send a record back~~ — RETRACTED 2026-09-15

~~A signatory who judges the root-cause analysis inadequate has one option: cancel the deviation.
Every mature eQMS separates reject-for-rework from cancel/void. Accura already solves this in
Documents; Deviation is the odd one out.~~

**Wrong.** The product has both, in the same action bar, at every state captured:
`Reject — send back one stage` and `Cancel deviation`. The two-verb split this section called
missing is implemented.

The reasoning was sound; the evidence was not. It rested on one sentence of the brief and one
screenshot where the controls were not visible, and I treated two weak signals pointing the same
way as confirmation.

**What remains true, and is worth raising with the brief's author:**

- Neither brief documents the reject transition. Anyone building from the briefs alone would not
  implement it.
- Business Flow §5 Step 5 actively describes the wrong behaviour.
- `Reject` moves exactly **one** stage. Whether a signatory at `In Approval` can return a record
  to `Investigation In Progress` — two stages back, where the fault usually is — is not visible
  from these captures.

§13 was the design proposal for this gap. Retained as a record of the reasoning; not to be built.

### 12.3 Gap B — classification is captured but never used *(product decision)*

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

### 12.4 Gap C — impacted products are free text *(traceability)*

`Product (id or name)` and `Batch number` are plain text inputs (§4.2). The system therefore cannot
reliably answer *"show me every deviation affecting batch B-123"* — the question an inspector asks
and the question that matters during a recall. Peer systems bind these to actual batch/lot records.

The captured data already shows the cost: `PRODUCT IMPACTED: No` sits a few lines above
`IMPACTED PRODUCTS (1)` on the same screen (§10.15).

### 12.5 Three smaller divergences

**No due-date management.** The date drives the entire Overdue rule but has no field on Create
(§8.2), no extension-with-justification flow, and no escalation beyond a badge. In peer systems an
extension is itself an auditable, approved event.

**No links between quality events.** *Duplicate* is a listed cancellation reason, but nothing can
point at the original — nor at a related complaint, change control, or prior deviation. That
linkage is how repeat-offender trends are found.

**No periodic review of long-running records.** A deviation sitting in Investigation for 90 days
only accumulates an Overdue badge; there is no check-in obligation.

---

## 13. ~~Proposal — the return transition (Gap A)~~ — SUPERSEDED 2026-09-15

> ⚠️ **Do not build this.** The product already has `Reject — send back one stage` (§5.7). This
> section solved a gap that does not exist — see §12.2. It is kept because the questions it raises
> still need answering against the real control: where a return is allowed from, whether prior
> signatures survive it, and what the stepper shows afterwards.

Modelled on the Documents `returned` pattern so the two modules behave alike.

### 13.1 It is not a seventh state

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

### 13.2 Where it is allowed

| From | Returns to | Why |
|---|---|---|
| `In Approval` | `Investigation In Progress` | RCA or impact analysis inadequate |
| `In Approval` | `CAPA Pending` | investigation sound, corrective plan insufficient |
| `CAPA Pending` | `Investigation In Progress` | CAPA cannot be framed on the evidence given |
| `Investigation In Progress` | `In Review` | triage was wrong — wrong owner, wrong scope |

`In Review` keeps **no** return path. It is the entry gate: an invalid or duplicate report there is
genuinely `Cancelled`, which is what that state is for. Giving one state both actions is what
created the confusion in the first place.

### 13.3 Rules

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

### 13.4 On screen

- A destructive `Alert` at the top of the detail page while `returned` is set and the record has
  not advanced past that state: **"Returned from In Approval by Sarah Johnson (QA)"**, with
  timestamp and reason, and the note that prior signatures are historical.
- The block the return targets is editable again; everything before it stays locked.
- Next action reads **`Revise and resubmit`**, matching Documents.
- Registry: `Returned` shown as a **badge beside the status**, not as a status value — the record
  genuinely *is* in `Investigation In Progress`. This also avoids repeating §10.13, where `Overdue`
  and `Cancelled` were folded into the Status filter.

### 13.5 Cost

Small. `RecordSignatureDialog` already has `reasonRequired`; `Alert` exists; the annotation shape
is copied from `DemoDocument`. The real work is the four transition rules and deciding whether
`In Approval` returns to a fixed target or lets the signatory choose.

### 13.6 Open question for the brief's author

**Was the cancel-as-rejection wording deliberate, or shorthand?** If a real reviewer today cancels
deviations to send them back, the production data may contain cancelled records that were never
invalid — which would matter for any trend analysis built on that field.


---

## 14. Scope decision — cancel and return in the prototype

**Decided 2026-09-15.** The PO wants the happy path. Neither cancel nor return is a happy path, so
the question is not which to build but **what not to lock in while building neither.**

### 14.1 What peer products do

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

### 14.2 What the prototype does — REVISED 2026-09-15

The original decision scoped cancel to `In Review` only, believing it was the only state offering
it. §5.7 shows `Cancel deviation` at `Investigation In Progress` and `CAPA Pending` too, beside
`Reject — send back one stage`.

| | Decision |
|---|---|
| Overdue | **Not a status.** Red `Overdue` text beneath the due date, on the field that causes it; never a badge in the Status column, never an option in the Status filter. A badge beside the status reads as a seventh state, which brief §6 says it is not. |
| `Cancel deviation` | **Build, on every open state.** Matches the product, and takes the product's own label rather than the invented `Cancel as invalid or duplicate`. |
| `Reject — send back one stage` | **Build.** It exists; omitting it would misrepresent the flow. Inert until the logic phase, like the other actions. |
| `Cancelled` as a record state | **Displayable.** One seeded record, a badge, a read-only detail screen. |
| The return design in §13 | **Do not build.** Superseded by the real control. |

**Superseded reasoning:** the original §14.3 argued that omitting cancel from `In Approval` cost
nothing and avoided encoding "refuse to sign destroys the record". That held only while rejection
was believed absent. With `Reject` present, cancel is no longer the only exit.

### 14.3 ~~Why `In Approval` gets no cancel button~~ — superseded by §14.2

Adding it costs one button and encodes *refuse to sign = destroy the record* into the artefact the
development team will copy. Omitting it costs nothing the demo needs. If the flow is later built
properly, §11 is the design; nothing here forecloses it.

### 14.4 Still open regardless of scope

**§11.6 stands and is not a design question.** If reviewers today cancel deviations in order to
send them back, production `Cancelled` records include records that were never invalid — and any
trend analysis on that field is wrong. For the brief's author, whatever the prototype does.
