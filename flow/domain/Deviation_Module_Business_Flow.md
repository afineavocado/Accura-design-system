# Deviation Module — Main Business Flow

> **Purpose of this document.** Serves as the *original / source-of-truth* for the Deviation Module business flow on Accura One. Use it to review and diff the prototype after any AI-Agent modification. Any drift between prototype behavior and the flow described here must be justified or rolled back.
>
> **Scope.** End-to-end lifecycle, actors, state transitions, guards/rules, exception states, cross-module integrations (CAPA, Audit Trail, Reports).
> **Companion file:** `Deviation_Module_Metadata_and_Screens.md` (per-status field schema, copywriting, controls).

---

## 1. Purpose of the Module

The Deviation Module implements the **Deviation Management Lifecycle** under standard QMS/GMP quality-control practices. It captures any non-conformance or unplanned event from initial detection through investigation, CAPA linkage, multi-signature approval, and archival — producing a fully auditable, immutable record dossier.

Design principles:
- **Sequential lifecycle**: the record advances through fixed status states; no skipping.
- **Multi-signature compliance**: In Approval requires signatures from Department Owner, Deviation Owner, and each named Reviewer.
- **Immutable audit trail**: every state change and field edit is written to the Deviation Audit Trail and can be exported.
- **CAPA linkage**: Corrective/Preventive Actions live in the CAPA module; the deviation references them by ID and never duplicates their state.

---

## 2. Lifecycle States (Status Model)

Six primary lifecycle states + two system-monitored exception states.

| # | Status | Nature | Description |
|---|---|---|---|
| 1 | `Draft` | Editable | Initial creation and logging of the deviation event before formal submission. |
| 2 | `In Review` | Editable (Reviewer) | Initial assessment and verification by the Department Owner or QA Reviewer (Triage & Containment). |
| 3 | `Investigation In Progress` | Editable (Owner + Investigators) | Execution of root-cause analysis (RCA) and impact assessment. |
| 4 | `CAPA Pending` | Editable | Investigation completed; awaiting formulation or linkage of Corrective and Preventive Actions in the CAPA module. |
| 5 | `In Approval` | Read-only + Signature | Formal sign-off routing among designated Department Head, Deviation Owner, and Reviewers (Final Sign-off Gateway). |
| 6 | `Approved` | Immutable (Closed) | All reviews, root causes, corrective actions finalized and authorized. Record is closed. |

**System / Exception states**

| Status | Trigger | Description |
|---|---|---|
| `Overdue` | Automatic — `today > Due Date` AND status ≠ `Approved` | Warning flag applied by the system; record continues in its current lifecycle state but is highlighted for escalation. |
| `Cancelled` | Manual — by Reviewer during `In Review`, or by approver during review/approval | Deviation voided or closed as non-applicable (invalid report, duplicate, non-conformance out of scope). Terminal state. |

---

## 3. State Diagram (Textual)

```
      [+ Create Deviation]
              │
              ▼
         [ Draft ]
              │ (Submit for Review)
              ▼
       [ In Review ] ──────(Reject / Duplicate)──────► [ Cancelled ]
              │
              │ (Accept & Assign — Approve & sign)
              ▼
 [ Investigation In Progress ] ────────────────────────► [ Cancelled ]
              │
              │ (Root Cause Analysis complete)
              ▼
       [ CAPA Pending ] ─── (Link to CAPA Module) ────► [ Cancelled ]
              │
              │ (Action plan defined & CAPA linked)
              ▼
       [ In Approval ] ── (multi-signature workflow) ──► [ Cancelled ]
              │
              │ (Final signature — QA / Dept Head sign-off)
              ▼
       [ Approved ]   (Closed — immutable dossier)


 * Automatic monitor: (status ≠ Approved) AND (today > Due Date) → [ Overdue ] badge
```

---

## 4. Actors & Responsibilities

| Actor | Primary responsibility | States they can act on |
|---|---|---|
| **Reporter / Any operator** | Detects and logs the deviation. Creates the Draft. | `Draft` |
| **Department Owner (Dept Head)** | Triage validity, assign Owner, provide first approval signature. | `In Review`, `In Approval` |
| **QA Coordinator / QA Reviewer** | Initial triage & containment assessment; QA reviewer signature. | `In Review`, `In Approval` |
| **Deviation Owner** | Primary responsible party for the record throughout the lifecycle; performs RCA; drives CAPA formulation; provides Deviation-Owner signature. | `Investigation In Progress`, `CAPA Pending`, `In Approval` |
| **Reviewer(s)** (0..n) | Optional named reviewers added at creation; each contributes a signature in the final approval gateway. | `In Approval` |
| **QA Manager** | Final release/close-out authority; provides QA sign-off. | `In Approval` |
| **System** | Auto-assigns Deviation ID on Submit; monitors `Due Date`; writes to Audit Trail. | All states |

---

## 5. Detailed Business Steps

### Step 1 — Initiation & Logging (Khởi tạo)
- **Entry action:** User clicks `+ Create Deviation`.
- **Status on save-as-draft:** `Draft`.
- **Actor:** Any operations / production personnel who detects the event.
- **Behavior:**
  - Fill the Create New Deviation form (see companion file: *Create New Deviation — Field Schema*).
  - `Save as Draft` — persists without validation of required fields; no Reviewer notification.
  - `Submit for Review` — runs full validation, system assigns a Deviation ID (`ACME/DEV/YYYY/######`), status becomes `In Review`, and Reviewers + Owner receive notification.
- **Key inputs:** Short Description, Department, Deviation Owner, Classification, Category, Severity, Incident Type, Product Impacted flag, Incident Details, optional Attachments and Reviewers.
- **Exit condition:** valid Submit → `In Review`.

### Step 2 — Triage & Screening (Xem xét ban đầu)
- **Status:** `In Review`.
- **Actor:** Department Owner OR QA Coordinator.
- **Workspace:** Triage & Containment.
- **Behavior:**
  - Validate that the reported event is a genuine, in-scope deviation.
  - Confirm / (re)assign the Owner responsible for the record.
  - Enter `Immediate action taken` (containment, quarantine, line-stop, etc.).
  - Maintain `Impacted products` dynamic list (Product ID/Name, Batch number, Description; add / remove / save independently).
  - Decision:
    - **Invalid / duplicate / non-applicable →** transition to `Cancelled` (terminal).
    - **Valid →** `Approve & sign — advance to investigation` (electronic signature) → status becomes `Investigation In Progress`.
- **Exit conditions:** approve & sign → `Investigation In Progress`; reject → `Cancelled`.

### Step 3 — Root Cause Analysis (Điều tra nguyên nhân)
- **Status:** `Investigation In Progress`.
- **Actor:** Deviation Owner in coordination with relevant technical / operations teams.
- **Behavior:**
  - Site investigation; collect evidence and attach supporting documents.
  - Perform Root Cause Analysis (RCA).
  - Perform Impact Analysis on affected product lots, records, or related systems / equipment.
- **Exit condition:** RCA & Impact Analysis complete → `CAPA Pending`.

### Step 4 — CAPA Alignment (Xác định hành động khắc phục & phòng ngừa)
- **Status:** `CAPA Pending`.
- **Actor:** Deviation Owner and QA Lead.
- **Behavior:**
  - Decide whether corrective / preventive action is required.
  - If required, create or link a CAPA record via the CAPA module in the sidebar; the CAPA reference (`ACME/CAPA/YYYY/######`) is bound to the deviation.
  - Establish target completion milestones for the corrective plan.
- **Exit condition:** Action plan defined and CAPA linked (or explicit no-CAPA-needed decision recorded) → `In Approval`.

### Step 5 — QA Sign-off & Final Approval (Phê duyệt)
- **Status:** `In Approval`.
- **Actors:** Department Owner, Deviation Owner, all named Reviewers, and QA Manager (as applicable).
- **Workspace:** Final Sign-off Gateway — every prior data block is consolidated read-only for review.
- **Behavior — Multi-signature workflow:**
  - Each signatory reviews the full consolidated dossier and executes an electronic signature carrying identity, timestamp, and a legal commitment statement.
  - Standard signature declarations:
    - Department Owner: *"I approve this deviation and authorise advancing it to investigation."*
    - Deviation Owner: *"As deviation owner, I approve the investigation and its outcome."*
    - Reviewer (each): *"As reviewer (<Name> (<Role>)), I approve this deviation."*
  - Primary CTA cycles through pending signatories, e.g. `Sign as Sarah Johnson (QA)`.
  - When the **final required signature** is captured, status auto-transitions to `Approved`.
- **Exit condition:** all mandatory signatures collected → `Approved`. A signatory refusing to sign may return the record via a cancellation action → `Cancelled`.

### Step 6 — Resolution & Closure (Đóng sai lệch)
- **Status:** `Approved`.
- **Actor:** None editable — system only.
- **Behavior:** Record is officially finalized. All data blocks are locked (immutable). Available only for read-back, attachment download, CAPA cross-navigation, and audit-trail export. Serves as the Closed Record Dossier for reports and periodic inspection.

---

## 6. Exception & Monitoring Rules

### Overdue monitor
- **Rule:** If `status ∉ {Approved, Cancelled}` AND `today > Due Date`, the system attaches an **Overdue** badge to the record on the registry and in the detail header.
- **Effect:** Visibility / escalation flag only — the underlying lifecycle status is not altered. The record continues to progress normally; the badge is cleared when the record reaches `Approved` or when Due Date is extended (if allowed by SOP).

### Cancellation
- **Trigger:** Manual by Reviewer (in `In Review`) or by approver during later phases (up to and including `In Approval`) when the deviation is deemed invalid, duplicate, out-of-scope, or superseded.
- **Effect:** Terminal state. Record remains searchable in the registry with reason of cancellation captured in the audit trail. No further editing.

### Audit-trail policy
- Every field edit, status transition, signature, attachment upload/removal, and cancellation is logged with actor identity, timestamp, and before/after values (where applicable).
- The Deviation Audit Trail block appears on every status. `Export Audit Report` exports the full log for periodic inspection.

---

## 7. Cross-Module Integrations

| Integration | Direction | Behavior |
|---|---|---|
| **CAPA Module** | Deviation → CAPA (create/link) and Deviation ← CAPA (status echo) | During `CAPA Pending`, users navigate to the CAPA module to create or select a CAPA. The linked CAPA reference and its current status (e.g., `Completed`) are shown in the Associated CAPAs block. |
| **Reports Module** | Deviation → Reports | Approved records feed periodic quality reports and are searchable for inspection. |
| **Audit Trail** | Deviation → Audit Trail | All events are streamed to the record's audit trail and can be exported. |
| **Document Module** | Deviation → Attachments | Supporting evidence uploaded on the deviation is stored via the document/attachment service; download link is preserved in the closed dossier. |
| **User / Auth (Auth0)** | Auth0 → Deviation | Owner, Raised By, Reviewers, and Signatures are resolved from Auth0 identity (`auth0|<id>`) and rendered as `email` or `Full Name (Role)`. |

---

## 8. Registry (List) View — Baseline

The top-level Deviations registry lists records with these core columns:

- `Deviation ID` — system-generated unique identifier (e.g., `ACME/DEV/2026/000006`).
- `Short Description` — summary title of the non-conformance.
- `Status` — current lifecycle phase (Draft, In Review, Investigation In Progress, CAPA Pending, In Approval, Approved), plus `Overdue` / `Cancelled` badges as applicable.
- `Owner` — assigned lead or department representative.
- `Category` — Minor / Major / Critical.
- `Severity` — Low / Medium / High.
- `Due Date` — target completion date.

Primary CTAs on the registry:
- `+ Create Deviation` — open the Create New Deviation form (Step 1).
- Row click → open Detail Page for that record (context: current status).

---

## 9. Invariants & Non-Negotiable Rules

1. **Deviation ID is immutable** once assigned on Submit; it never changes across the lifecycle.
2. **No skipping states.** Status can only advance to the next state defined in §3, except transitions to `Cancelled`.
3. **`Approved` is terminal and immutable.** No field, attachment, signature, or status may be changed after the final signature.
4. **`In Approval` freezes data.** All input controls become read-only; only signature and cancel actions are permitted.
5. **Multi-signature completeness.** Status cannot advance to `Approved` while any required signature is pending.
6. **CAPA reference integrity.** Deviation stores the CAPA ID; the CAPA record's status is displayed live and never duplicated in the deviation.
7. **Audit trail is append-only.** Entries cannot be edited or deleted, including after cancellation.
8. **Draft privacy.** A Draft is not visible to Reviewers and does not trigger notifications until Submit for Review.

---

## 10. Review Checklist (use after AI-Agent prototype changes)

Use this checklist to diff the prototype against this spec:

- [ ] All six lifecycle statuses plus `Overdue` and `Cancelled` are present and named exactly as in §2.
- [ ] Status transitions follow §3 with no shortcuts.
- [ ] Actors in §4 map correctly to the CTAs available on each status.
- [ ] Create Deviation validates only on Submit — Save as Draft skips validation (§5 Step 1).
- [ ] Deviation ID is generated on Submit, not on Save as Draft.
- [ ] `In Review` supports Immediate Action textarea and dynamic Impacted Products list with add/remove/save-independently.
- [ ] `In Approval` renders all prior data as read-only; multi-signature workflow with per-role commitment statements is present.
- [ ] Final signature auto-advances to `Approved`; no manual "close" button.
- [ ] `Approved` hides all inputs and signature buttons; only download, CAPA navigation, and audit export remain.
- [ ] Overdue badge respects the rule `today > Due Date AND status ≠ Approved/Cancelled` and does not alter the underlying status.
- [ ] Every state transition and edit produces an Audit Trail entry with actor + timestamp.
- [ ] CAPA reference on the deviation matches the CAPA module and echoes its current status.
