# Dashboard Module — Main Business Flow

> **Purpose of this document.** Serves as the *original / source-of-truth* for the Dashboard Module business flow and event-driven operational lifecycle on Accura One. Use it to review and diff the dashboard implementation, audit user interaction flows, verify automated recalculation triggers, and ensure zero requirement drift.
>
> **Scope.** End-to-end user workflows, daily triage routines, direct action execution loops, cross-module event triggers, midnight recalculation engines, role-based visibility (RBAC), and escalation paths.
>
> **Companion files:**
> - `Dashboard_Module_Metadata_and_Functional_Spec.md` (executive summary, information architecture, RAG logic, component specifications, and data dictionary).
> - `Dashboard_Module_Changelog.md` (shared files registry, architectural decisions, and version change history).

---

## 1. Role in the Accura One eQMS Operating Model

In a regulated life-sciences company (medical devices, pharmaceuticals, biotechnology), quality compliance is not static documentation—it is a continuous operational cycle. The Dashboard is the central nervous system of Accura One, serving as:

1. **The Daily Point of Entry:** The default landing page where every employee starts their workday.
2. **The Compliance Firewall:** Preventing items from slipping past statutory deadlines (ISO 13485, FDA 21 CFR Part 820/Part 11) by converting passive records into active, prioritized tasks.
3. **The Closed-Loop Execution Engine:** Connecting high-level metrics directly to atomic signing and approval gates with zero intermediate navigation friction.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           CLOSED-LOOP DASHBOARD CYCLE                             │
└───────────────────────────────────────────────────────────────────────────────────┘
         ▲                                                                   │
         │ (5) Real-Time State Recalculation                                  │ (1) Morning Triage
         │     Metrics & RAG status update instantly                         │     User reviews Dashboard
         │                                                                   ▼
┌──────────────────┐                                               ┌──────────────────┐
│  Accura Database │                                               │   My Actions /   │
│   & Audit Trail  │                                               │ Needs Attention  │
└──────────────────┘                                               └──────────────────┘
         ▲                                                                   │
         │ (4) Audit Receipt & 21 CFR 11 Log                                 │ (2) Deep-Link Click
         │     Cryptographic signature & timestamp                           │     Navigates directly
         │                                                                   ▼
┌──────────────────────────────────────┐                           ┌──────────────────┐
│ Electronic Signature & Gate Approval │ ◄──────────────────────── │  Record Detail   │
│ Persistent action bar execution      │   (3) Action Execution    │  Active Gate     │
└──────────────────────────────────────┘                           └──────────────────┘
```

---

## 2. Core User Personas & Daily Operating Flows

### 2.1 Flow 1: Morning Triage & Oversight (QA Director / Quality Manager)

**Actor:** Dr. Sarah Chen (QA Approver / Quality Manager)  
**Frequency:** Daily at 08:30 (Morning Standup / Executive Triage)  
**Primary Goal:** Verify overall organizational health, identify systemic bottlenecks, and address blocked approvals.

```
[Step 1: Open Dashboard]
   │ User logs in; default view loads Accura Dashboard.
   ▼
[Step 2: Inspect "Quality at a Glance"]
   │ Scans 6 module indicators:
   │ ├── Documents: 🟢 Green (2 pending approvals)
   │ ├── Training:  🔴 Red   (3 overdue) ──► CRITICAL ATTENTION REQUIRED
   │ ├── CAPA:      🟠 Amber (2 approaching due date)
   │ ├── Non-Conf:  🟢 Green (1 open)
   │ ├── Audits:    🟢 Green (Next audit in 21 days)
   │ └── Risks:     🟢 Green (1 review due)
   ▼
[Step 3: Root-Cause Analysis via Drill-Down]
   │ User clicks "Training" row (🔴 Red / 3 overdue).
   │ System routes to `/prototype/accura/training?status=Overdue`.
   │ QA Director identifies the 3 delinquent personnel and pings supervisors.
   ▼
[Step 4: Check Macro System Metrics ("My Quality System")]
   │ Observes:
   │ ├── Documents: 124 Active | 6 Pending (Normal operational load)
   │ ├── Non-Conformance: 7 Open | 1 Critical (Flags critical deviation for follow-up)
   │ └── CAPA: 12 Open | 2 Due Soon
   ▼
[Step 5: Triage Forward Horizon ("Upcoming Items")]
   │ Reviews 30-day timeline:
   │ ├── "Internal Audit — 24 Sep" (7 days away ──► prompts audit checklist review)
   │ └── "SOP Review — 28 Sep" (11 days away ──► confirms author is preparing revision)
```

---

### 2.2 Flow 2: Personal Action Execution & Deep-Link Resolution (Action Owner / Approver)

**Actor:** Tom Bradley (Reviewer) or Dr. Sarah Chen (QA Approver)  
**Frequency:** Continuous throughout the day  
**Primary Goal:** Clear personal gating tasks, sign off on reviews/approvals, and advance workflows.

```
[Step 1: Scan "My Actions — Needs your attention"]
   │ User inspects prioritized queue:
   │ ├── 🔴 CAPA #104 — Due in 2 days
   │ ├── 🟠 SOP-023 — Awaiting your approval
   │ ├── 🟠 Training — 3 people overdue
   │ ├── 🟡 Risk Assessment — Review due this week
   │ └── 🔵 Audit #12 — Corrective actions awaiting closure
   ▼
[Step 2: Initiate Direct Action]
   │ User clicks "SOP-023 — Awaiting your approval".
   │ System bypasses generic lists and executes deep link:
   │ ──► Target: `/prototype/accura/documents/SOP-023`
   ▼
[Step 3: Land on Active Gate with Action Bar]
   │ Record detail loads in canonical 70/30 layout:
   │ ├── Left 70%: PDF preview rendered with document revisions.
   │ ├── Right 30%: Document details and metadata cards.
   │ ├── PhaseGateStepper: Active stage highlighted ("In QA Approval").
   │ └── Persistent Bottom Bar: Elevated task bar displays:
   │     - QA Effective Date override selector (defaults to Approval + 14d).
   │     - Primary CTA: "Sign final approval".
   ▼
[Step 4: Execute Electronic Signature (21 CFR Part 11)]
   │ User clicks "Sign final approval".
   │ Shared ElectronicSignatureModal opens:
   │ ├── Full Name & Role read-only ("Dr. Sarah Chen · QA Approver").
   │ ├── Signing Meaning ("Final QA Approval").
   │ ├── Password / Authentication input.
   │ └── Attestation intent checkbox.
   │ User inputs credentials and confirms.
   ▼
[Step 5: State Invalidation & Return to Dashboard]
   │ Document advances: `Approved`, Use Status becomes `Pending effective`.
   │ Audit trail drawer records cryptographic signature receipt.
   │ User navigates back to Dashboard:
   │ ──► SOP-023 is removed from "My Actions".
   │ ──► Documents "Pending" count decrements from 6 to 5.
   │ ──► Documents "Needs attention" updates.
```

---

### 2.3 Flow 3: 30-Day Regulatory Preparedness (Compliance Officer)

**Actor:** Quality Compliance Lead / Auditor  
**Frequency:** Weekly  
**Primary Goal:** Ensure no regulatory inspection or audit findings occur due to missed schedule commitments.

```
[Step 1: Inspect "Upcoming Items — Coming Up / Next 30 days"]
   │ System displays chronological milestone feed:
   │ • Internal Audit — 24 Sep (7 days remaining)
   │ • SOP Review — 28 Sep (11 days remaining)
   │ • CAPA Due — 30 Sep (13 days remaining)
   │ • Supplier Review — 4 Oct (17 days remaining)
   │ • Management Review — 10 Oct (23 days remaining)
   ▼
[Step 2: Cross-Functional Alignment]
   │ User clicks "Internal Audit — 24 Sep".
   │ System opens Audit schedule `/prototype/accura/audits/AUD-2026-003`.
   │ User checks audit scope (Cleanroom HVAC, Calibration records),
   │ verifies designated lead auditor, and issues readiness notification.
   ▼
[Step 3: Management Review Agenda Compilation]
   │ User clicks "Management Review — 10 Oct".
   │ Data from "My Quality System" (CAPA volumes, Training %, Deviation criticalities)
   │ is automatically exported into the Management Review briefing pack.
```

---

## 3. Event-Driven Lifecycle & State Machine Updates

The Dashboard does not maintain a disconnected static database. It is a read-optimized aggregation layer updated via two complementary engines:

### 3.1 Real-Time Transactional Event Bus (Immediate Update)

Whenever any operational module completes a workflow transition, an event is emitted on the internal event bus. The dashboard state invalidates and recalculates relevant metrics immediately:

```
Operational Action in Sub-Module
   │
   ├── Document Module:
   │   ├── "Document_Submitted" ──► My Actions (+1 Review), Documents Pending (+1)
   │   ├── "Review_Signed"      ──► My Actions (Transfers from Reviewer to QA)
   │   └── "QA_Approved"        ──► My Actions (-1), Documents Pending (-1), Active (+1)
   │
   ├── CAPA Module:
   │   ├── "CAPA_Created"       ──► CAPA Open (+1), Quality at a Glance (+1 open)
   │   ├── "Action_Assigned"    ──► My Actions (+1 for Action Owner)
   │   ├── "Action_Completed"   ──► My Actions (Switches to CAPA Owner verification)
   │   └── "CAPA_Closed"        ──► CAPA Open (-1), Removed from My Actions
   │
   ├── Training Module:
   │   ├── "Assignment_Issued"  ──► Training Compliance % recalculates
   │   ├── "Course_Completed"   ──► Training Compliance % increases, Overdue decrements
   │   └── "DueDate_Elapsed"    ──► RAG status switches to 🔴 Red instantly
   │
   └── Deviation / NC Module:
       ├── "Deviation_Logged"   ──► Non-Conformance Open (+1)
       └── "Severity_Set_Crit"  ──► Non-Conformance Critical (+1), RAG alert raised
```

### 3.2 Scheduled Midnight Temporal Engine (Date-Boundary Rollup)

Certain metrics and status triggers depend purely on the passage of time rather than direct user interaction (e.g., an item crossing the overdue boundary at 00:00:01).

Every night at **00:00:00 system local time** (e.g., `Australia/Sydney` configured in Preferences), the Temporal Rollup Engine executes:

```
[00:00:00 Local Midnight Rollover]
   │
   ├── 1. Overdue Boundary Check:
   │   ├── Finds all records where DueDate < Today AND Status != Closed.
   │   ├── Automatically flags them as OVERDUE.
   │   └── Triggers module RAG status to 🔴 Red in "Quality at a Glance".
   │
   ├── 2. "Due Soon" (7-Day & 14-Day) Window Shifting:
   │   ├── Recalculates items where Today <= DueDate <= Today + 7d.
   │   │   └── Updates "Quality at a Glance" 🟠 Yellow status.
   │   ├── Recalculates items where Today <= DueDate <= Today + 14d.
   │   │   └── Ingests new qualifying items into "My Actions".
   │   └── Recalculates items where Today <= TargetDate <= Today + 30d.
   │       └── Ingests new qualifying milestones into "Upcoming Items".
   │
   ├── 3. Document Effective Date Transition:
   │   ├── Finds documents where UseStatus == "Pending effective" AND EffectiveDate <= Today.
   │   └── Automatically transitions UseStatus to "Effective".
   │
   └── 4. Compliance Percentage Aggregation:
       └── Computes fresh Training compliance percentage:
           (Active Up-to-date Users / Total Enrolled Users) * 100.
```

---

## 4. Role-Based Access Control (RBAC) & Visibility Matrix

Accura One enforces strict Role-Based Access Control. Dashboard content dynamically tailors itself based on the user's role:

| Dashboard Widget | System Admin / Quality Director | Department Head / QA Approver | Operational User / Action Owner |
| :--- | :--- | :--- | :--- |
| **Quality at a Glance** | Global tenant view (all 6 modules across entire company). | Global tenant view (standard visibility for cross-departmental awareness). | Global tenant view (information radiator is visible to all to promote quality culture). |
| **My Actions** | Executive approvals, escalations, system-level reviews. | Departmental reviews, QA approvals, team overdue training alerts. | Strictly personal action items assigned to this individual user (DOCX uploads, assigned CAPAs, own training). |
| **My Quality System** | Global tenant totals across all modules. | Global tenant totals with option to filter by their department. | Global tenant totals (read-only macro reference). |
| **Upcoming Items** | All tenant-level audits, reviews, and GxP milestones. | Departmental audits, SOP reviews, and team deadlines. | Organization-wide audits and personal upcoming deadlines. |

---

## 5. Escalation & Exception Handling Rules

When a quality item fails to progress, the Dashboard facilitates immediate escalation:

1. **48-Hour Overdue Alert:**
   - When an item in *My Actions* becomes overdue ($\text{DueDate} < T_{\text{today}}$), its priority dot turns 🔴 **Red**.
   - The item rises to the top of the *My Actions* list regardless of creation date.
   - If the item remains unresolved for $> 48$ hours, an escalation notification is dispatched to the user's Department Head and the QA Manager.

2. **Module Health Degradation Alert:**
   - If any module in *Quality at a Glance* turns 🔴 **Red**, a persistent alert banner appears in the application header for QA Director and Admin roles.
   - The banner indicates: `"Quality Alert: [Module] has [N] overdue items requiring immediate resolution."`

3. **Referential Integrity & Soft Deletion:**
   - If an operational record is archived or cancelled, it is immediately purged from *My Actions* and *Upcoming Items*.
   - System metrics in *My Quality System* decrement immediately.
   - The event is recorded in the central audit trail with user identity, reason, and timestamp.
