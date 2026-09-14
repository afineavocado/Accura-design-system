# Deviation Module — Metadata & Screen Copywriting Spec

> **Purpose of this document.** Serves as the *original / source-of-truth* for every screen the Deviation Module renders (per lifecycle status), including field schema, UI control type, validation rules, defaults, labels, placeholders, and button copy. Use it to review and diff the prototype after any AI-Agent modification.
>
> **Companion file:** `Deviation_Module_Business_Flow.md` (lifecycle, actors, state transitions).
>
> **Convention.**
> - `(*)` = required; `—` = optional.
> - `read-only` = value is fixed from an earlier state and cannot be edited on this screen.
> - Sample values are drawn from the reference records `ACME/DEV/2026/000005` and `ACME/DEV/2026/000006`.

---

## Table of Contents
1. Global — Registry (List) View
2. Screen — Create New Deviation (status becomes `Draft` or `In Review`)
3. Screen — Deviation Detail · `Draft`
4. Screen — Deviation Detail · `In Review`
5. Screen — Deviation Detail · `Investigation In Progress`
6. Screen — Deviation Detail · `CAPA Pending`
7. Screen — Deviation Detail · `In Approval`
8. Screen — Deviation Detail · `Approved` (Closed)
9. Screen — Deviation Detail · `Cancelled`
10. Global — Overdue Behavior
11. Global — Lifecycle Header (Stepper) Copy
12. Data Attributes Reference (Registry-level)
13. Enum & Vocabulary Reference

---

## 1. Global — Registry (List) View

**Screen role.** Top-level dashboard listing every deviation record.

**Columns (in order).**

| Column | Source field | Format |
|---|---|---|
| Deviation ID | `Deviation ID` | `ACME/DEV/YYYY/######` (e.g., `ACME/DEV/2026/000006`) |
| Short Description | `Title / short description` | Text |
| Status | `Status` | Draft \| In Review \| Investigation In Progress \| CAPA Pending \| In Approval \| Approved \| Overdue (badge) \| Cancelled |
| Owner | `Owner` | `Full Name (Role)` or email — e.g., `John Baker (Dept Owner)` / `amit@accura.one` |
| Category | `Category` | Minor \| Major \| Critical |
| Severity | `Severity` | Low \| Medium \| High |
| Due Date | `Due Date` | Date (e.g., `Oct 11, 2026`) |

**Primary CTA.** `+ Create Deviation` — opens the Create New Deviation form.

**Row interaction.** Click row → open the Detail Page for that record (context reflects the record's current status).

---

## 2. Screen — Create New Deviation

**Screen role.** Initiation step of the QMS lifecycle. Records the full incident dossier before entering the quality-review workflow.

### 2.1 Field Schema

| Field | Control | Required | Values / Options | Default / Constraint |
|---|---|---|---|---|
| Title / short description | Text Input (single-line) | `(*)` | Free text | Summary title shown on the Dashboard. |
| Department | Select Dropdown | `(*)` | Quality Assurance, Quality Control, Manufacturing, Packaging, Engineering, Cold Chain Storage, Supply Chain, Regulatory Affairs | Identifies the responsible/originating department. |
| Deviation owner | Text / User Input | `(*)` | Email address of a user | Defaults to the creator's account (e.g., `amit@accura.one`). |
| Reviewers | Search & Multi-select (Chips) | — | Search-and-pick user accounts | 0..n reviewers; each selected user is added immediately as a chip. |
| Classification | Segmented control / Pill buttons | `(*)` | `Planned`, `Unplanned` | Whether the event was pre-planned or unexpected. |
| Category | Segmented control / Pill buttons | `(*)` | `Major`, `Minor`, `Critical` | GMP-standard impact classification. |
| Severity | Segmented control / Pill buttons | `(*)` | `High`, `Medium`, `Low` | Risk rating that drives triage priority. |
| Incident type | Select Dropdown | `(*)` | Document, Process, Equipment, Facility, Utility, Computer System, Material, Supplier, Regulatory, Planned, Analytical Method | Origin / object category of the event. |
| Product impacted? | Binary Toggle / Pill buttons | — | `Yes`, `No` | Default: `No`. When `Yes`, the system may reveal an additional field to pick affected batch/product. |
| Incident details | Textarea (multi-line) | `(*)` | Free text | Full context, sequence of events, and current status of the incident. |
| Attachments | File Uploader (`+ Attach files`) | — | Documents, images | Site evidence, equipment logs, or incident minutes. |

### 2.2 Action Buttons & Transition Logic

| Button | Behavior |
|---|---|
| **`Back to Deviations` / `Cancel`** | Discard the current input and navigate back to the Deviations registry. No data is saved. |
| **`Save as Draft`** | Persist entered data to the database with status `Draft`. Bypasses required-field validation so incomplete forms can be saved. Does **not** notify Reviewers. |
| **`Submit for Review`** | Runs full validation of all `(*)` fields. On success, the system assigns the official Deviation ID (e.g., `ACME/DEV/2026/xxxxxx`), transitions the record from `Draft` → `In Review`, and notifies the named Reviewers and Owner. |

---

## 3. Screen — Deviation Detail · `Draft`

**Screen role.** Pre-submission workspace. Same form as Create New Deviation, editable, with a Deviation ID placeholder until Submit is executed.

- **Lifecycle header stepper:** Step 1/6 — `Draft` *(In progress)*.
- **Fields:** identical to §2.1, all editable.
- **Buttons:** `Back to Deviations`, `Save as Draft`, `Submit for Review`.
- **Audit trail block:** visible; typically `No history recorded yet.` for a brand-new draft.

---

## 4. Screen — Deviation Detail · `In Review`

**Screen role.** Triage & Containment Workspace. Reviewer/QA validates the incident, records immediate containment, and either approves for investigation or cancels.

### 4.1 Lifecycle Header

| Field | Sample value |
|---|---|
| Record title | `desc` (short description as saved) |
| Deviation ID | `ACME-DEV-2026-0001` |
| Current status | `In Review` (Step 2/6 in the stepper) |

**Stepper snapshot:**
1. `Draft` — *(Completed)*
2. `In Review` — *(In progress)*
3. `Investigation In Progress` — *(Not started)*
4. `CAPA Pending` — *(Not started)*
5. `In Approval` — *(Not started)*
6. `Approved` — *(Not started)*

**Quick header action:** `[View audit trail]` — jumps to the change-history section.

### 4.2 Incident Details (Read-only grid — locked from Draft)

| Attribute | Sample value | Meaning |
|---|---|---|
| Date Raised | `2026-09-09` | Date event was logged to the system. |
| Raised By | `auth0|6a7d4c2ce723991a0afec0c9` | Identity of the account that created the deviation. |
| Due Date | `2026-10-08` | SLA deadline for the full lifecycle. |
| Department | `Quality Control` | Originating / responsible department. |
| Owner | `amit@accura.one` | Primary owner of the record. |
| Classification | `Unplanned` | Planned vs. unplanned nature. |
| Category | `Minor` | GMP impact category. |
| Severity | `Medium` | Risk rating. |
| Incident Type | `Process` | Origin/object category. |
| Product Impacted | `No` | Initial impact flag. |
| Reviewers | `Sarah Johnson (QA)` | Users authorized to review / sign. |
| Details | `desc` | Full incident description. |
| Impacted Products Preview | `ID · Batch B-123` | Compact summary of affected batches/products. |

### 4.3 Review Details — Interactive Form (Reviewer inputs)

| Element | Type | Copy / Behavior |
|---|---|---|
| **Immediate action taken** | Textarea | Placeholder: `Describe any immediate containment / correction taken…`. Captures containment or temporary corrections executed at the time of detection (e.g., line stop, batch quarantine). |
| **Impacted products** | Dynamic list | Per-row fields: `Product (id or name)`, `Batch number`, `Description`. |
| Row action `X` (icon) | Button | Remove the product row from the list. |
| Row action `+ Add Impacted Product` | Button | Add a new row for tracking. |
| List action `Save impacted products` | Button | Persist the impacted-product list independently, without transitioning status. |

### 4.4 Workflow Actions & Audit

| Element | Copy / Behavior |
|---|---|
| **Primary action** | `Approve & sign — advance to investigation` — captures the reviewer's electronic signature and transitions the record from `In Review` → `Investigation In Progress`. |
| **Cancel / Reject path** | Marks the deviation as invalid or duplicate and transitions to `Cancelled` (terminal). |
| **Deviation Audit Trail** | Log of all operations on the record. Empty state: `No history recorded yet.`. |
| **Export Audit Report** | Button that exports the audit history for quality inspection. |

---

## 5. Screen — Deviation Detail · `Investigation In Progress`

**Screen role.** RCA Workspace. Owner and technical/operations collaborators execute root cause analysis, impact assessment, and evidence collection.

- **Lifecycle stepper:** Step 3/6 — `Investigation In Progress` *(In progress)*.
- **Incident Details block:** unchanged, locked (read-only).
- **Review Details block:** carries forward the values captured in `In Review`, locked (read-only).
- **New editable blocks (surfaced on this status):**
  - **Root Cause Analysis** — textarea / structured RCA capture (5-Why, Fishbone, etc.).
  - **Risk Analysis** — free-text or structured risk score input.
  - **Impact Analysis** — textarea capturing effect on product lots, records, and related systems.
  - **Supporting Files** — file uploader for evidence and investigation attachments.
- **Primary action:** advance to `CAPA Pending` (requires that RCA + Impact Analysis are recorded).
- **Cancel path:** available up to and including this stage.
- **Deviation Audit Trail:** visible with `Export Audit Report`.

---

## 6. Screen — Deviation Detail · `CAPA Pending`

**Screen role.** CAPA Alignment gateway. Owner + QA Lead decide whether corrective/preventive action is required and link the CAPA record.

- **Lifecycle stepper:** Step 4/6 — `CAPA Pending` *(In progress)*.
- **All prior blocks (Incident Details, Review Details, Investigation Report):** locked (read-only).
- **New interactive block — Associated CAPAs:**
  - Action: `Link to CAPA Module` — navigates to the CAPA module to create or select the CAPA record.
  - Once linked, displays the CAPA reference (e.g., `ACME/CAPA/2026/000017`) and its current status (echoed live from CAPA, e.g., `Completed`).
  - Milestone dates for CAPA completion may be captured here.
- **Primary action:** advance to `In Approval` (requires an Associated CAPA reference OR an explicit "no CAPA required" decision recorded).
- **Cancel path:** available.
- **Deviation Audit Trail:** visible with `Export Audit Report`.

---

## 7. Screen — Deviation Detail · `In Approval`

**Screen role.** Final Sign-off Gateway. Consolidates all prior data as a read-only dossier and executes the multi-signature workflow.

### 7.1 Lifecycle Header

| Field | Sample value |
|---|---|
| Record title | `Test Deviation to cancel` |
| Deviation ID | `ACME/DEV/2026/000006` |
| Current status | `In Approval` (Step 5/6) |

**Stepper snapshot:**
1. `Draft` *(Completed)*
2. `In Review` *(Completed)*
3. `Investigation In Progress` *(Completed)*
4. `CAPA Pending` *(Completed)*
5. `In Approval` *(In progress)*
6. `Approved` *(Not started)*

**Quick actions:** `[< Back to Deviations]`, `[View audit trail]`.

### 7.2 Consolidated Dossier (Read-only) — reference sample record `ACME/DEV/2026/000006`

| Block | Attribute / Field | Sample value |
|---|---|---|
| Incident Details | Date Raised / Raised By | `2026-09-11` / `auth0|6a7d4c2ce723991a0afec0c9` |
| | Due Date | `2026-10-11` |
| | Department / Owner | `Manufacturing` / `amit@accura.one` |
| | Classification / Category | `Unplanned` / `Minor` |
| | Severity / Incident Type | `Low` / `Document` |
| | Product Impacted | `No` |
| | Reviewers | `Sarah Johnson (QA)` |
| | Details | `13434` |
| Review Details | Immediate Action Taken | `Not provided` |
| Risk Analysis | Risk Analysis | `1231241` |
| Investigation Report | Impact Analysis | `Not provided` |
| | Root Cause Analysis | `Not provided` |
| Associated CAPAs | CAPA Reference | `ACME/CAPA/2026/000017` (Test Associated — Status: `Completed`) |

### 7.3 Signatures Workflow (Multi-signature)

Every required signature carries: signer identity (Auth0 ID), timestamp, and a legal commitment statement.

**Completed signatures — sample:**

| Role | Signed by | Timestamp | Commitment statement |
|---|---|---|---|
| Department owner approval | `auth0|6a7d4c2ce723991a0afec0c9` | `Sep 11, 2026, 12:11 PM` | *"I approve this deviation and authorise advancing it to investigation."* |
| Deviation owner approval | `auth0|6a7d4c2ce723991a0afec0c9` | `Sep 11, 2026, 12:11 PM` | *"As deviation owner, I approve the investigation and its outcome."* |

**Pending signatures:**

- **System notice:** `Owner signed. Sign for each reviewer:`
- **Primary CTA:** `[Sign as Sarah Johnson (QA)]` — invokes electronic signature for the named reviewer. When the last required signature is captured, the record auto-transitions from `In Approval` → `Approved`.

### 7.4 Audit Trail & Reporting

- **Deviation Audit Trail** — history log of `ACME/DEV/2026/000006` (empty state: `No history recorded yet.`).
- **Action button:** `[Export Audit Report]` — exports the full change-history log for inspection/audit.

---

## 8. Screen — Deviation Detail · `Approved` (Closed)

**Screen role.** Closed Record Dossier. All data blocks locked in read-only mode; the record is the compliance evidence artifact for reports and periodic inspection.

### 8.1 Lifecycle Header

| Field | Sample value |
|---|---|
| Record title | `Test to attach file and delete` |
| Deviation ID | `ACME/DEV/2026/000005` |
| Status | `Approved` (Step 6/6 — lifecycle end point) |

**Stepper snapshot:** every step marked *(Completed)*, with step 6 *(Current — Completed)*.

**Quick actions:** `[Back to Deviations]`, `[View audit trail]`.

### 8.2 Archived Record Metadata (Immutable) — reference sample `ACME/DEV/2026/000005`

| Block | Attribute (Field) | Sample value |
|---|---|---|
| Incident Details | Date Raised / Raised By | `2026-09-11` / `auth0|6a7d4c2ce723991a0afec0c9` |
| | Due Date | `2026-10-11` |
| | Department / Owner | `Quality Control` / `amit@accura.one` |
| | Classification / Category | `Planned` / `Minor` |
| | Severity / Incident Type | `Low` / `Equipment` |
| | Product Impacted | `No` |
| | Reviewers | `Sarah Johnson (QA)`, `Lisa Chen (QC Lead)` |
| | Details | `test` |
| Review Details | Immediate Action Taken | `Not provided` |
| Risk Analysis | Risk Analysis | `1234` |
| Investigation Report | Impact Analysis | `Not provided` |
| | Root Cause Analysis | `Not provided` |
| | Supporting Files | `Test Document Form for Accura.docx` (downloadable attachment) |
| Associated CAPAs | CAPA Reference | `ACME/CAPA/2026/000016` (title: `Test for deviation JK1109` — Status: `Completed`) |

### 8.3 Electronic Signatures Audit (Compliance Evidence)

The `Signatures` block presents 100% of required signatures with identity, timestamp, and legal commitment statement.

| Role | Signed by | Timestamp | Statement |
|---|---|---|---|
| Department owner approval | `auth0|6a7d4c2ce723991a0afec0c9` | `Sep 11, 2026, 11:56 AM` | *"I approve this deviation and authorise advancing it to investigation."* |
| Deviation owner approval | `auth0|6a7d4c2ce723991a0afec0c9` | `Sep 11, 2026, 11:59 AM` | *"As deviation owner, I approve the investigation and its outcome."* |
| Reviewer — Lisa Chen (QC Lead) | `auth0|6a7d4c2ce723991a0afec0c9` | `Sep 11, 2026, 11:59 AM` | *"As reviewer (Lisa Chen (QC Lead)), I approve this deviation."* |
| Reviewer — Sarah Johnson (QA) | `auth0|6a7d4c2ce723991a0afec0c9` | `Sep 11, 2026, 11:59 AM` | *"As reviewer (Sarah Johnson (QA)), I approve this deviation."* |

### 8.4 Available Interactions

Because the record is closed, every input control and signature button is hidden. Users can only:

- **Download attachments** — click the file name in Supporting Files (e.g., `Test Document Form for Accura.docx`).
- **Trace the linked CAPA** — click the CAPA reference chip (e.g., `ACME/CAPA/2026/000016`) to open the associated CAPA record.
- **Export the audit report** — `[Export Audit Report]` in the Deviation Audit Trail block exports the full change history for periodic inspection.

---

## 9. Screen — Deviation Detail · `Cancelled`

**Screen role.** Terminal state for invalid, duplicate, or out-of-scope reports.

- **Lifecycle header:** Status badge = `Cancelled`. The stepper reflects the last active state before cancellation.
- **All data blocks:** locked (read-only) at their last-saved values.
- **Cancellation reason:** captured at the moment of cancellation and stored in the Audit Trail.
- **Available interactions:** view read-only dossier, download attachments, export audit report. No signature, no re-open.

---

## 10. Global — Overdue Behavior

- **Trigger:** `today > Due Date` AND `status ∉ {Approved, Cancelled}`.
- **UI treatment:** An `Overdue` badge is placed alongside the status on the registry row and in the detail-page header. The underlying lifecycle status is unchanged.
- **Cleared when:** the record reaches `Approved`/`Cancelled`, or when `Due Date` is updated to a future value per SOP.

---

## 11. Global — Lifecycle Header (Stepper) Copy

The stepper is present on every detail-page status and always renders the same six steps in this order:

1. `Draft`
2. `In Review`
3. `Investigation In Progress`
4. `CAPA Pending`
5. `In Approval`
6. `Approved`

Per-step state label conventions:

| State label | Applied to |
|---|---|
| *(Completed)* / *(Đã hoàn thành)* | Any step whose transition has been executed. |
| *(In progress)* / *(Đang thực hiện)* | The step matching the record's current status. |
| *(Not started)* / *(Chưa bắt đầu)* | Any step after the current status. |
| *(Current — Completed)* | Used only on step 6 when status = `Approved`. |

---

## 12. Data Attributes Reference (Registry-level)

| Attribute | Format / Available values | Meaning |
|---|---|---|
| `Deviation ID` | `ACME/DEV/YYYY/######` or `ACME-DEV-YYYY-####` | System-generated unique identifier per organization/year/sequence. |
| `Short Description` | Text | Summary title of the event/deviation. |
| `Status` | `Draft`, `In Review`, `Investigation In Progress`, `CAPA Pending`, `In Approval`, `Approved`, `Cancelled`, `Overdue` (badge) | Current lifecycle phase. |
| `Owner` | Email / Full Name + Title (e.g., `amit@accura.one`, `John Baker (Dept Owner)`) | Primary responsible party for the record. |
| `Category` | `Minor`, `Major`, `Critical` (GMP/QMS standard) | Impact classification. |
| `Severity` | `Low`, `Medium`, `High` | Risk-scoring rating. |
| `Due Date` | Date (e.g., `Oct 11, 2026`) | SLA completion deadline. |

---

## 13. Enum & Vocabulary Reference

### 13.1 Department
`Quality Assurance`, `Quality Control`, `Manufacturing`, `Packaging`, `Engineering`, `Cold Chain Storage`, `Supply Chain`, `Regulatory Affairs`.

### 13.2 Classification
`Planned`, `Unplanned`.

### 13.3 Category (Registry vs. Create form)
- **Create form:** `Major`, `Minor`, `Critical`.
- **Registry & Data Attributes:** `Minor`, `Critical` are the standard GMP labels; `Major` is also permitted per the Create form vocabulary. Keep both in sync in the prototype.

### 13.4 Severity
`High`, `Medium`, `Low`.

### 13.5 Incident Type
`Document`, `Process`, `Equipment`, `Facility`, `Utility`, `Computer System`, `Material`, `Supplier`, `Regulatory`, `Planned`, `Analytical Method`.

### 13.6 Product impacted
`Yes`, `No` (default `No`). When `Yes`, an additional field for selecting the impacted batch/product may be revealed.

### 13.7 Signature commitment statements (exact copy)
- **Department Owner:** *"I approve this deviation and authorise advancing it to investigation."*
- **Deviation Owner:** *"As deviation owner, I approve the investigation and its outcome."*
- **Reviewer (per named reviewer):** *"As reviewer (`<Name>` (`<Role>`)), I approve this deviation."*

### 13.8 System notices (exact copy)
- Audit trail empty state: `No history recorded yet.`
- Pending-signature notice on `In Approval`: `Owner signed. Sign for each reviewer:`
- Missing/not-entered value indicator (read-only dossier): `Not provided`

### 13.9 Button labels (exact copy)
- Registry: `+ Create Deviation`.
- Create / Draft form: `Back to Deviations`, `Cancel`, `Save as Draft`, `Submit for Review`, `+ Attach files`.
- In Review: `+ Add Impacted Product`, `Save impacted products`, `Approve & sign — advance to investigation`.
- In Approval: `Sign as <Name> (<Role>)`.
- Universal (detail pages): `[View audit trail]`, `[Export Audit Report]`, `[< Back to Deviations]`.

---

## 14. Review Checklist (use after AI-Agent prototype changes)

- [ ] Registry columns and order match §1.
- [ ] Create form fields, control types, required flags, and enum values match §2.1.
- [ ] `Save as Draft` writes without validation; `Submit for Review` runs full validation and mints the Deviation ID.
- [ ] `In Review` shows locked Incident Details grid (§4.2) plus editable Review Details form (§4.3).
- [ ] `Impacted products` supports add / remove / save-independently without status change.
- [ ] `Investigation In Progress` reveals RCA, Risk Analysis, Impact Analysis, and Supporting Files blocks with prior data locked.
- [ ] `CAPA Pending` shows Associated CAPAs block with link-to-CAPA action; linked CAPA status echoes live.
- [ ] `In Approval` renders the full consolidated dossier read-only (§7.2) plus the multi-signature workflow with exact commitment statements (§13.7).
- [ ] Auto-transition to `Approved` when the final required signature lands (no manual close button).
- [ ] `Approved` screen hides all inputs/signatures; only download, CAPA link, and audit export remain (§8.4).
- [ ] Stepper labels use the copy in §11 for each state condition.
- [ ] Overdue badge appears only per §10; underlying status is not mutated.
- [ ] All button labels match §13.9 verbatim.
