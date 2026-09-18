# Dashboard Module — Metadata & Functional Specification

> **Purpose of this document.** Serves as the *original / source-of-truth* specification for the Dashboard Module on Accura One. Defines the executive summary, information architecture, business rules, data calculations, component specifications, and comprehensive metadata dictionary. Use it to build, verify, and diff the dashboard implementation and prevent requirement drift.
>
> **Companion files:**
> - `Dashboard_Module_Business_Flow.md` (end-to-end user workflows, operational personas, event triggers, and state machine updates).
> - `Dashboard_Module_Changelog.md` (shared files registry, architectural decisions, and version change history).
>
> **Regulated Domain Context:** GxP / ISO 13485 / 21 CFR Part 11 compliant electronic Quality Management System (eQMS).

---

## 1. Executive Summary & Dashboard Architecture

### 1.1 Purpose & Role in Accura One

The Accura Dashboard functions as the centralized operational cockpit for growing life-science organizations. In a regulated environment, compliance failures frequently stem from obscured deadlines, untracked action items, and delayed approvals. 

The Dashboard eliminates operational blindness by fulfilling two complementary needs simultaneously:

1. **Executive / Macro Oversight (System Health):** Instant visibility into cross-module compliance posture, bottlenecks, and overdue items across the entire organization (*Quality at a Glance* and *My Quality System*).
2. **Individual / Tactical Execution (Personal Work Queue):** Immediate focus on time-sensitive tasks requiring the logged-in user's direct intervention within the immediate execution horizon (*My Actions* and *Upcoming Items*).

### 1.2 Dual-Persona Architecture

The information architecture balances two primary user mindsets:

| Persona Dimension | Macro Health Layer | Micro Execution Layer |
| :--- | :--- | :--- |
| **Primary Beneficiary** | Quality Director, QA Manager, Executive Leadership | Process Owner, Action Owner, Reviewer, Approver |
| **Core Question Answered** | *"Is our quality system audit-ready, and where are the organizational bottlenecks?"* | *"What do I specifically need to sign, review, or complete today?"* |
| **Consuming Widgets** | 1. **Quality at a Glance**<br>3. **My Quality System** | 2. **My Actions ("Needs your attention")**<br>4. **Upcoming Items ("Coming Up")** |
| **Data Scope** | Tenant-wide aggregate (all departments, all users) | User-scoped (tasks assigned to or awaiting the current user) + 30-day cross-module milestone timeline |
| **Action Outcome** | Module-level drilldown, resource reallocation, audit risk mitigation | Workflow gate advancement, E-signature completion, task closure |

### 1.3 High-Level Component Layout Architecture

The Dashboard architecture organizes four distinct functional widgets into a balanced workspace:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    ACCURA DASHBOARD                                    │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ 1. Quality at a Glance                    │ 2. My Actions ("Needs your attention")     │
│    • Information Radiator (Table)         │    • Prioritized personal task queue       │
│    • Dynamic RAG Status (Green/Yellow/Red)│    • Filtered to logged-in user            │
│    • "Needs attention" highlight per area │    • Time horizon: <= 14 days + overdue    │
│    • System-wide health monitoring        │    • Direct deep-link into workflow gate   │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ 3. My Quality System                      │ 4. Upcoming Items ("Coming Up")            │
│    • Macro operational volume & status    │    • 30-day forward calendar timeline      │
│    • 6 core modules represented           │    • Chronological milestone sequence      │
│    • Standardized dual-metric pairs       │    • SOP reviews, audits, CAPA deadlines,  │
│    • Filtered click-through navigation    │      supplier & management reviews         │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

---

## 2. Functional Specification & Business Logic

### 2.1 Widget 1: Quality at a Glance (Cross-Module Information Radiator)

#### 2.1.1 Functional Purpose
Acts as the organization's primary **Information Radiator**. It computes and displays the real-time health of all six core quality modules using a standardized Red-Amber-Green (RAG) status model and a concise summary of items requiring immediate oversight.

#### 2.1.2 Covered Modules (Areas)
1. **Documents** (Document Control & SOPs)
2. **Training** (Training & Assessments)
3. **CAPA** (Corrective and Preventive Actions)
4. **Non-Conformances** (Deviations and Non-Conformance reports)
5. **Audits** (Internal, Supplier, and External Audits)
6. **Risks** (Risk Management & FMEA Assessments)

#### 2.1.3 RAG Status Calculation Engine
For each module $M$, the system evaluates live transactional records against the current date ($T_{\text{today}}$):

$$\text{OverdueCount}(M) = \sum \text{Records in } M \text{ where } \text{Status} \ne \text{Closed} \land \text{DueDate} < T_{\text{today}}$$

$$\text{DueSoonCount}(M) = \sum \text{Records in } M \text{ where } \text{Status} \ne \text{Closed} \land T_{\text{today}} \le \text{DueDate} \le (T_{\text{today}} + 7\text{ days})$$

| Status Level | Indicator | Trigger Condition | Operational Meaning |
| :--- | :---: | :--- | :--- |
| **Green** | 🟢 | $\text{OverdueCount}(M) == 0 \land \text{DueSoonCount}(M) == 0$ | **Healthy:** All items on schedule. No overdue items and no items expiring within 7 days. |
| **Yellow / Amber** | 🟠 | $\text{OverdueCount}(M) == 0 \land \text{DueSoonCount}(M) > 0$ | **Warning:** No overdue items currently, but at least 1 item is due within $\le 7$ days. |
| **Red** | 🔴 | $\text{OverdueCount}(M) \ge 1$ | **Critical Risk:** At least 1 item is past its committed due date. Regulatory non-compliance risk. |

> [!IMPORTANT]
> **Audit Reconciliation Note (Mockup vs. Business Rule):**
> In the discovery screenshot, `Training` displayed a green dot alongside the text `3 overdue`. Per the authoritative business rule (*"Red - Has overdue Items (at least 1)"*), **any module with overdue items must render 🔴 Red**. The green dot in the mockup was a static design placeholder; the algorithmic RAG rule defined above is the binding source-of-truth.

#### 2.1.4 "Needs Attention" Text Generation Logic
The third column generates a dynamic, context-aware summary phrase following this priority waterfall:

```
IF OverdueCount > 0 THEN
    RETURN "{OverdueCount} overdue"
ELSE IF DueSoonCount > 0 THEN
    RETURN "{DueSoonCount} approaching due date" (or "{DueSoonCount} due this week")
ELSE IF PendingApprovalsCount > 0 THEN
    RETURN "{PendingApprovalsCount} pending approvals"
ELSE IF OpenItemsCount > 0 THEN
    RETURN "{OpenItemsCount} open"
ELSE IF NextScheduledEventDate IS NOT NULL THEN
    RETURN "Next {EventType} in {DaysUntil} days"
ELSE
    RETURN "All items current"
```

#### 2.1.5 Interactive Behavior
- **Row Click:** Clicking any module row navigates to that module's listing page, automatically pre-filtering by the items flagged in the "Needs attention" column (e.g., clicking CAPA opens `/prototype/accura/capa?filter=approaching_due`).
- **Header Action Icon:** A popout/expand icon (`Layers` / `ExternalLink`) in the card header enables toggling into an expanded audit-readiness view.

---

### 2.2 Widget 2: My Actions ("Needs your attention")

#### 2.2.1 Functional Purpose
Provides a personalized, high-priority work queue for the **currently authenticated user**. It answers: *"What specific tasks are gating quality workflows that require my signature, review, or input in the next 14 days?"*

#### 2.2.2 Query & Filtering Rules
A record qualifies for the logged-in user's action queue if and only if all of the following criteria are met:
1. **User Association:** 
   - `CurrentAssigneeId == CurrentUser.Id`, OR
   - User is designated as the active gate owner (e.g., `ReviewerId == CurrentUser.Id` when `WorkflowStage == "In Review"`, or `QAApproverId == CurrentUser.Id` when `WorkflowStage == "In QA Approval"`), OR
   - User is a supervisor/lead responsible for overdue subordinates (e.g., Training oversight).
2. **Terminal State Exclusion:** Record `Status` is NOT `Approved`, `Closed`, `Superseded`, or `Obsolete`.
3. **Execution Horizon:** 
   - Item is already **overdue** ($\text{DueDate} < T_{\text{today}}$), OR
   - Item is due within the next **14 calendar days** ($T_{\text{today}} \le \text{DueDate} \le T_{\text{today}} + 14\text{d}$).

#### 2.2.3 Action Item Taxonomy & Visual Urgency Semantics
Each item displays a colored priority indicator and a structured title string:

| Dot Indicator | Urgency / Category | Trigger Criteria | Typical Copy Format | Example |
| :---: | :--- | :--- | :--- | :--- |
| 🔴 | **Critical / Overdue / Imminent** | Overdue OR due in $\le 2$ days | `[Record ID] — Due in [X] days` | `CAPA #104 — Due in 2 days` |
| 🟠 | **Awaiting Signature / Approval** | Workflow gate blocked awaiting user's 21 CFR Part 11 signature | `[Record ID] — Awaiting your approval` | `SOP-023 — Awaiting your approval` |
| 🟠 | **Supervisory Compliance Alert** | Team members under user's oversight have overdue actions | `Training — [X] people overdue` | `Training — 3 people overdue` |
| 🟡 | **Review Due This Week** | Task due within 3–7 days | `[Record Type] — Review due this week` | `Risk Assessment — Review due this week` |
| 🔵 | **Closure / Verification** | Post-implementation verification or corrective action closure | `[Record ID] — Corrective actions awaiting closure` | `Audit #12 — Corrective actions awaiting closure` |

#### 2.2.4 Direct Action Deep-Linking Contract
The specification requires: *"And each item should be clickable directly into the action."*
- Clicking an item does **not** land on a generic listing page.
- It initiates a **deep-link navigation** directly into the specific record detail page with the required action gate active:
  - `SOP-023`: Opens `/prototype/accura/documents/SOP-023` with the persistent bottom action bar highlighted and the `Sign review` or `Sign final approval` modal primed.
  - `CAPA #104`: Opens `/prototype/accura/capa/CAPA-0104` directly focused on the action plan or verification step.
  - `Training`: Opens `/prototype/accura/training` filtered by the user's non-compliant direct reports.
  - `Audit #12`: Opens `/prototype/accura/audits/AUD-012` focused on the findings closure tab.

---

### 2.3 Widget 3: My Quality System (Macro System Status)

#### 2.3.1 Functional Purpose
Delivers a high-level operational summary across all six core modules, showing total system throughput versus items requiring vigilance.

#### 2.3.2 Standardized Dual-Metric Architecture
Each module displays a fixed two-part metric line separated by a divider pipe (`|`):
$$\text{[Primary Metric (Volume / Compliance)]} \quad \mathbf{|} \quad \text{[Secondary Metric (Watchlist / Critical)]}$$

| Module | Primary Metric (Volume / Compliance) | Calculation Logic | Secondary Metric (Watchlist / Critical) | Calculation Logic |
| :--- | :--- | :--- | :--- | :--- |
| **Documents** | `124 Active` | Count of records where `UseStatus == "Effective"` | `6 Pending` | Count of records where `WorkflowStage IN ("Draft", "In Review", "In QA Approval")` |
| **Training** | `86% Current` | $\frac{\text{Users with "Up to date"}}{\text{Total Active Users}} \times 100$ | `3 Overdue` | Count of active users with `UserStatus == "Overdue"` (or overdue assignments) |
| **CAPA** | `12 Open` | Count of CAPAs where `Status != "Close"` | `2 Due Soon` | Count of open CAPAs where `DueDate <= Today + 14d` |
| **Non-Conformance** | `7 Open` | Count of deviations where `Status != "Closed"` | `1 Critical` | Count of open deviations where `Severity == "Critical"` (or "High") |
| **Audits** | `3 Active` | Count of audits currently in execution (`Status == "Active"`) | `1 Upcoming` | Count of audits scheduled in the next 30 days |
| **Risks** | `18 Active` | Count of active risk assessments in the register | `2 Reviews Due` | Count of risk records where `PeriodicReviewDate <= Today + 30d` |

#### 2.3.3 Metric Drilldown Interactions
Clicking either side of the dual-metric pair opens the corresponding module listing pre-filtered to that specific cohort:
- Clicking `6 Pending` in Documents $\to$ navigates to `/prototype/accura/documents?tab=pending`.
- Clicking `1 Critical` in Non-Conformance $\to$ navigates to `/prototype/accura/deviations?severity=Critical`.
- Clicking `3 Overdue` in Training $\to$ navigates to `/prototype/accura/training?status=Overdue`.

---

### 2.4 Widget 4: Upcoming Items ("Coming Up / Next 30 days")

#### 2.4.1 Functional Purpose
A forward-looking milestone calendar across all quality domains. It ensures the organization has operational visibility into regulatory audits, document reviews, and cross-departmental deadlines 30 days in advance.

#### 2.4.2 Temporal Filtering & Sorting
- **Date Horizon:** Displays records where:
  $$T_{\text{today}} \le \text{EventDate} \le (T_{\text{today}} + 30\text{ calendar days})$$
- **Sort Order:** Strict chronological ascending order ($\text{EventDate}$ earliest to latest).
- **Date Formatting:** Clean, human-readable format without unnecessary year repetition (e.g., `24 Sep`, `28 Sep`, `4 Oct`, `10 Oct`).

#### 2.4.3 Supported Event Streams
1. **Audits:** Scheduled internal audits, customer audits, ISO/regulatory inspections (`Internal Audit — 24 Sep`).
2. **Periodic Document Reviews:** Biannual/annual SOP validity reviews required by GxP (`SOP Review — 28 Sep`).
3. **CAPA Deadlines:** Regulatory target completion dates for corrective action plans (`CAPA Due — 30 Sep`).
4. **Supplier Assessments:** Scheduled qualification and performance reviews for critical vendors (`Supplier Review — 4 Oct`).
5. **Management Reviews:** Periodic quality governance meetings mandated by ISO 13485 / FDA QSR (`Management Review — 10 Oct`).

---

## 3. Comprehensive Metadata & Data Schema Dictionary

This section defines the precise schema contracts required to power all four widgets on the Accura Dashboard.

### 3.1 Global Dashboard Aggregation Contract (TypeScript Data Model)

```typescript
export interface AccuraDashboardState {
  currentDate: string; // ISO 8601 (e.g. "2026-09-17")
  currentUser: {
    id: string;
    name: string;
    role: string;
    department: string;
  };
  qualityAtAGlance: ModuleHealthItem[];
  myActions: ActionQueueItem[];
  myQualitySystem: QualitySystemMetric[];
  upcomingItems: UpcomingMilestone[];
}

export type HealthStatusLevel = "green" | "yellow" | "red";

export interface ModuleHealthItem {
  area: "Documents" | "Training" | "CAPA" | "Non-Conformances" | "Audits" | "Risks";
  status: HealthStatusLevel;
  needsAttentionText: string;
  overdueCount: number;
  dueSoonCount: number;
  targetRoute: string;
}

export type ActionUrgencyVariant = "red" | "orange" | "yellow" | "blue";

export interface ActionQueueItem {
  id: string;
  recordKey: string;          // e.g. "CAPA #104", "SOP-023", "Audit #12"
  module: "Documents" | "Training" | "CAPA" | "Non-Conformances" | "Audits" | "Risks";
  title: string;              // e.g. "Due in 2 days", "Awaiting your approval"
  fullDisplayText: string;    // e.g. "CAPA #104 — Due in 2 days"
  urgency: ActionUrgencyVariant;
  dueDate: string;            // ISO Date
  targetUrl: string;          // Direct deep-link URL into the active gate
  actionRequired: "sign_approval" | "sign_review" | "investigate" | "close" | "supervise_training";
}

export interface QualitySystemMetric {
  module: "Documents" | "Training" | "CAPA" | "Non-Conformance" | "Audits" | "Risks";
  primaryLabel: string;       // e.g. "124 Active", "86% Current", "12 Open"
  primaryValue: number;
  secondaryLabel: string;     // e.g. "6 Pending", "3 Overdue", "1 Critical"
  secondaryValue: number;
  primaryFilterUrl: string;
  secondaryFilterUrl: string;
}

export interface UpcomingMilestone {
  id: string;
  module: "Documents" | "Training" | "CAPA" | "Non-Conformance" | "Audits" | "Risks" | "Governance";
  eventTitle: string;         // e.g. "Internal Audit", "SOP Review", "CAPA Due"
  displayDate: string;        // e.g. "24 Sep", "28 Sep", "4 Oct"
  targetDate: string;         // ISO Date (e.g. "2026-09-24")
  targetUrl: string;
}
```

---

### 3.2 Entity-Level Metadata Mapping Matrix

To support dynamic aggregation, each operational module in Accura must maintain the following core schema attributes:

| Module / Entity | Field Name | Data Type | Permitted Values / Format | Dashboard Attribute Powered |
| :--- | :--- | :--- | :--- | :--- |
| **Documents** | `id` / `code` | `string` | `"SOP-023"`, `"POL-001"` | My Actions record key |
| | `title` | `string` | Free text | Search & navigation context |
| | `workflow_stage` | `enum` | `"Draft"`, `"In Review"`, `"In QA Approval"`, `"Approved"` | Quality System (`Pending`), Quality at a Glance |
| | `use_status` | `enum` | `"Not effective"`, `"Pending effective"`, `"Effective"`, `"Superseded"`, `"Obsolete"` | Quality System (`124 Active`) |
| | `current_assignee_id` | `string` | User UUID | My Actions filter (`CurrentUser.Id`) |
| | `next_action_due` | `ISO Date` | `"2026-09-19"` | My Actions urgency, RAG calculation |
| | `periodic_review_date` | `ISO Date` | `"2026-09-28"` | Upcoming Items (`SOP Review — 28 Sep`) |
| **CAPA** | `key` / `id` | `string` | `"CAPA-0104"` / `"CAPA #104"` | My Actions record key |
| | `status` | `enum` | `"Draft"`, `"In Review"`, `"In Approval"`, `"Action in Progress"`, `"Final Approval"`, `"Close"` | Quality System (`12 Open`) |
| | `due_date` | `ISO Date` | `"2026-09-19"` | My Actions (`Due in 2 days`), RAG calculation |
| | `owner_id` / `approver`| `string` | User UUID | My Actions user matching |
| | `severity` | `enum` | `"Minor"`, `"Major"`, `"Critical"` | RAG status severity weight |
| **Training** | `user_status` | `enum` | `"Up to date"`, `"Pending"`, `"Overdue"` | Quality System (`86% Current \| 3 Overdue`), RAG trigger |
| | `assignment_due_date` | `ISO Date` | `"2026-09-15"` | RAG status trigger (turns module Red) |
| | `supervisor_id` | `string` | User UUID | My Actions (`Training — 3 people overdue`) |
| **Non-Conformance** | `id` | `string` | `"NC-2026-042"` | Quality at a Glance |
| | `status` | `enum` | `"Open"`, `"Under Investigation"`, `"QA Review"`, `"Closed"` | Quality System (`7 Open`) |
| | `severity` | `enum` | `"Low"`, `"Medium"`, `"High"`, `"Critical"` | Quality System (`1 Critical`) |
| | `due_date` | `ISO Date` | `"2026-09-25"` | Quality at a Glance (`1 open`) |
| **Audits** | `id` | `string` | `"AUD-012"` / `"Audit #12"` | My Actions record key |
| | `type` | `enum` | `"Internal"`, `"Supplier"`, `"External"` | Upcoming Items title |
| | `status` | `enum` | `"Scheduled"`, `"Active"`, `"Report Pending"`, `"CAPA Followup"`, `"Closed"` | Quality System (`3 Active`) |
| | `scheduled_start_date`| `ISO Date` | `"2026-09-24"` | Upcoming Items (`Internal Audit — 24 Sep`) |
| | `corrective_actions_due`| `number` | Count $\ge 0$ | My Actions (`Corrective actions awaiting closure`) |
| **Risks** | `id` | `string` | `"RA-2026-0012"` | My Actions record key |
| | `status` | `enum` | `"Draft"`, `"Active"`, `"Archived"` | Quality System (`18 Active`) |
| | `periodic_review_date` | `ISO Date` | `"2026-09-20"` | My Actions (`Review due this week`), Quality System (`2 Reviews Due`) |
| | `responsible_lead_id` | `string` | User UUID | My Actions user matching |

---

## 4. Cross-Module Calculation Rules

### 4.1 Training Compliance Percentage Formula
$$\text{Compliance Rate} = \left( \frac{\text{Total Active Users with } \text{user\_status} == \text{"Up to date"}}{\text{Total Active Enrolled Users}} \right) \times 100$$
- Expressed as an integer percentage (e.g., `86% Current`).
- If any enrolled training assignment is past its due date without completion, the user is marked `Overdue`.
- Total overdue count is the sum of unique users in `Overdue` status.

### 4.2 CAPA Open & Due Soon Formulas
- **Open CAPAs:** Any CAPA where `status != "Close"`.
- **Due Soon CAPAs:** Any open CAPA where:
  $$T_{\text{today}} \le \text{due\_date} \le (T_{\text{today}} + 14\text{ days})$$

### 4.3 Risk Assessment Reviews Due Formula
- **Reviews Due:** Any active risk assessment where:
  $$\text{periodic\_review\_date} \le (T_{\text{today}} + 30\text{ days})$$
- If $\text{periodic\_review\_date} < T_{\text{today}}$, the review is overdue and triggers a 🔴 Red status in Quality at a Glance.
- If $T_{\text{today}} \le \text{periodic\_review\_date} \le T_{\text{today}} + 7\text{d}$, it triggers a 🟡 Yellow status.
