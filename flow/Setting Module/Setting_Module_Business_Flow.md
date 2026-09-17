# Setting Module — Main Business Flow

> **Purpose of this document.** Serves as the *original / source-of-truth* for the Setting Module business flow on Accura One. Use it to review and diff the prototype after any AI-Agent modification. Any drift between prototype behavior and the flow described here must be justified or rolled back.
>
> **Scope.** End-to-end configuration flow, actors, configuration phases, data consumption model, and cross-module integrations.
>
> **Companion file:** `Setting_Module_Metadata_and_Screens.md` (per-screen field schema, control types, current data values, and CTA copy).
> **Log:** `Setting_Module_Log.md` (spec and prototype changes, decisions and open questions).

---

## 1. Purpose of the Module

The Setting Module implements the **System Configuration & Master Data Engine** for Accura One. Unlike operational modules (Documents, Training, Deviations, CAPA, Change Management), Settings does not manage transactional or lifecycle records. Instead, it:

- Standardizes **lookup dictionaries** (dropdown values, classification labels, root-cause methods) consumed by all operational modules.
- Establishes **organizational foundation** (Business Units, Departments, Record Numbering rules, system Preferences).
- Governs **user access** through a two-tier RBAC model (per-module scoped roles + global cross-cutting roles).

Design principles:

- **Foundation-first:** Settings must be configured before operational modules can function correctly. No record can be created without the lookup values (types, severities, sources) that Settings defines.
- **Static lookup model:** All configuration tables are master/lookup data (NAME + DESCRIPTION). They supply dropdown options; they do not contain embedded business logic, SLA calculations, or workflow triggers at this layer.
- **Admin-gated:** Only Admin-role users can create, edit, or delete configuration values. Operational staff interact with the values only as read-only selectors through the consuming modules.
- **Non-destructive constraint:** Deleting a lookup value that is referenced by live operational records must trigger a referential-integrity constraint warning — the value cannot be silently removed.

---

## 2. Configuration Phases (Flow Model)

The Setting module is operated sequentially in four phases during system onboarding, and maintained on-demand thereafter.

```
[Phase 1: System Baseline — Organisation]
   │ ├── Preferences (Time Zone: Australia/Sydney, Language: English, Date: DD-MMM-YYYY, Time: 12-hour)
   │ ├── Business Units (Optional grouping, e.g. Sydney / AU) & Departments (with Search bar)
   │ └── Record Numbering (Prefix, Separator, Seq Length, Year checkbox, Sub-type checkbox)
   ▼
[Phase 2: Master Data Configuration — per operational module]
   │ ├── Documents → Document Types (Name + Abbreviation Badge → drives Document ID)
   │ ├── Training  → Delivery Types + Assessment Methods
   │ ├── Deviations / NC → Types (10), Categories (3), Severities (3: Low/Med/High),
   │ │                     Root Cause Categories (5: Human Error, Equipment/Facility...),
   │ │                     Root Cause Methods (4: 5 Whys, Fishbone, Fault Tree Analysis, FMEA)
   │ ├── CAPA → Sources (6), Classifications (2), Priorities (4: Low → Critical)
   │ └── Change Management → Change Types (6), Categories (3: Minor, Major, Critical)
   ▼
[Phase 3: User & Access Governance (RBAC)]
   │ ├── Review Roles & Permissions matrix (read-only reference: scoped per-module + global cards)
   │ └── Manage Users → Add User (Name*, Email*, Module role pill toggles, Global role checkboxes)
   ▼
[Phase 4: Data Consumption by Operational Modules]
      └── Documents, Training, Deviations, CAPA, Change Management
          pull lookup values as dropdowns, chips, and badge selectors
```

---

## 3. Actors & Responsibilities

| Actor | Primary responsibility | Phases they act on |
|---|---|---|
| **Admin** | Full configuration authority — manages Organisation baseline, Document Types, all lookup tables, and all user accounts / role assignments. | Phases 1, 2, 3 |
| **Super QA User** | Can act as QA Approver across all operational modules; does not configure Settings directly. | Phase 4 (consuming side) |
| **Super User** | Can act as Reviewer across all operational modules; does not configure Settings directly. | Phase 4 (consuming side) |
| **Operational staff** (any module role) | Reads lookup values through operational module forms; cannot edit Settings directly. | Phase 4 (consuming side) |
| **System** | Applies Record Numbering rules automatically when a new operational record is created; enforces referential constraints on lookup value deletion. | All phases |

---

## 4. Detailed Configuration Steps

### Phase 1 — System Baseline (Khởi tạo nền móng tổ chức)

**Goal:** Establish shared organizational standards so that all records, audit timestamps, and assignments are consistent and legally coherent.

| Step | Configuration item | What to set (UI verified) | Why it matters |
|---|---|---|---|
| 1.1 | **Preferences** | Time Zone (`Australia/Sydney`), Language (`English`), Date Format (`DD-MMM-YYYY`), Time Format (`12-hour`) | Audit Trail timestamps must be accurate and legally defensible (21 CFR Part 11); UI consistency across users. |
| 1.2 | **Business Units** | Optional branch/location groupings (e.g., `Sydney` / `AU`) | Top-level organizational grouping for enterprise filtering. |
| 1.3 | **Departments** | Department names and descriptions (e.g., `Engineering`, `Quality Control`, `Reg Affairs`). Features inline search bar. | Assigns record ownership, routes documents to department heads, and filters reports. |
| 1.4 | **Record Numbering** | Org Prefix (`ACME` mandatory), Separator (`Hyphen (-)`), Sequence Length (`6 digits`), Year flag (✅), Sub-type flag (✅) | Defines auto-generated ID structure: `{Prefix}-{DocType}-{SubType}-{Year}-{Sequence}` (live preview: `ACME-SOP-GEN-2026-000001`). |

**Exit condition:** Preferences saved, at least one Business Unit (if used), active Departments created, and Record Numbering rule configured before any operational records are initiated.

---

### Phase 2 — Master Data Configuration (Cấu hình từ điển dữ liệu phân hệ)

**Goal:** Populate lookup dictionaries for each operational module so that users encounter valid dropdown options during record creation.

#### 2a — Documents

| Configuration item | Required fields | Current verified records | Purpose in the consuming module |
|---|---|---|---|
| **Document Types** | Name `(*)`, Abbreviation `(*)` unique (green badge), Description | Standard Operating Procedure (`SOP`), Work Instruction (`WI`), Policy (`POL`), Form (`FRM`), Specification (`SPEC`) | Abbreviation combines with Record Numbering prefix + year + sequence to generate the Document ID (e.g., `ACME-SOP-GEN-2026-000001`). |

#### 2b — Training

| Configuration item | Required fields | Current verified records | Purpose in the consuming module |
|---|---|---|---|
| **Delivery Types** | Name `(*)`, Description | Classroom, Online / e-Learning, Virtual Classroom, Read & Understand | Classifies how a training session is delivered; selected during Training course setup. |
| **Assessment Methods** | Name `(*)`, Description | Quiz, Practical Demonstration, Written Assessment, On the job training | Defines how trainee competency is evaluated; assigned to each training course or SOP read-and-attest workflow. |

#### 2c — Deviations / NC

| Configuration item | Required fields | Current verified records | Purpose in the consuming module |
|---|---|---|---|
| **Types** | Name `(*)` | Document, Process, Equipment, Facility, Utility, Computer System, Material, Supplier, Regulatory, Analytical Method (10 records) | Populates the "Incident Type" dropdown when a Deviation record is logged. |
| **Categories** | Name `(*)`, Description | Minor, Major, Critical (3 records, ascending impact) | GMP impact classification on Deviation create form. |
| **Severities** | Name `(*)`, Description | Low, Medium, High (3 records, ascending severity) | Populates the "Severity" field on Deviation records; pure text labels, no numeric scoring. |
| **Root Cause Categories** | Name `(*)`, Description | Human Error, Equipment / Facility, Process / Method, Material, Environmental (5 records) | Groups root causes by operational domain during the Investigation step of a Deviation lifecycle. |
| **Root Cause Methods** | Name `(*)`, Description | 5 Whys, Fishbone (Ishikawa), Fault Tree Analysis, FMEA (4 records) | Investigation technique selector during RCA; ensures only approved methodologies are recorded. |

#### 2d — CAPA

| Configuration item | Required fields | Current verified records | Purpose in the consuming module |
|---|---|---|---|
| **Sources** | Name `(*)` unique, Description | Deviation, Audit, Complaint, Risk Assessment, Management Review, Standalone (6 records) | Populates the "CAPA Source" dropdown — defines originating event triggering the CAPA. |
| **Classifications** | Name `(*)`, Description | Corrective Action, Preventive Action (2 records) | Groups CAPA records by action type; supports Root Cause Trend Analysis reporting. |
| **Priorities** | Name `(*)`, Description | Low, Medium, High, Critical (4 records, ascending urgency) | Urgency label for CAPA triage; pure text lookup, no automated SLA countdowns at this layer. |

#### 2e — Change Management

| Configuration item | Required fields | Current verified records | Purpose in the consuming module |
|---|---|---|---|
| **Change Types** | Name `(*)`, Description | Document Change, Process Change, Equipment Change, Facility Change, System Change, Supplier Change (6 records) | Classifies the asset or operational scope impacted by a Change Request. |
| **Categories** | Name `(*)`, Description | Minor, Major, Critical (3 records, ascending impact) | Labels the scale/impact tier of the change; used for routing and statistical reporting. |

**Exit condition:** Each operational module has at least one valid record in every lookup table it references before go-live.

---

### Phase 3 — User & Access Governance (Quản trị nhân sự & phân quyền)

**Goal:** Onboard user accounts with correct module-specific and global roles before operational workflows begin.

| Step | Action | Detail |
|---|---|---|
| 3.1 | **Review Roles & Permissions matrix** | Admin consults the read-only reference guide showing scoped per-module roles (green badges) and cross-cutting global roles (cards). |
| 3.2 | **Create user accounts** | Admin clicks `Add user` to open the modal: inputs `Name *` and `Email *`. |
| 3.3 | **Assign per-module roles** | In the modal's Module Roles section, toggle interactive pill buttons per module (e.g., `Documents: Author`, `Deviation: QA Approver`). |
| 3.4 | **Assign global roles (if applicable)** | In the modal's Global Roles section, select checkboxes for `Admin`, `Super QA User`, and/or `Super User`. |
| 3.5 | **Verify role coverage** | Confirm that every active module has at least one user assigned to each required lifecycle role (Creator, Reviewer/Owner, QA Approver). |

**Exit condition:** All required workflow roles per active module are covered by onboarded user accounts.

---

### Phase 4 — Data Consumption (Tiêu thụ dữ liệu tại phân hệ vận hành)

Once Phases 1–3 are complete, operational modules consume Settings data seamlessly:

- **Form dropdowns / chips** dynamically pull active lookup records.
- **Auto-generated record IDs** apply the Record Numbering rule + Document Type abbreviation + sub-type.
- **Workflow assignees** (Owner, Reviewer, QA Approver) resolve from the Users list with verified module roles.
- **Audit Trail timestamps and date formatting** strictly follow Preferences configuration.

---

## 5. RBAC Model — Role Architecture

### 5.1 Per-Module Roles (Scoped)

A user may hold different roles across different modules independently (e.g., Author in Documents, Reviewer in CAPA).

| Module | Available Roles (UI verified) |
|---|---|
| **Documents** | Author, Reviewer, QA Approver |
| **Training** | Training Creator, Approver |
| **Change Control** | Change Owner, Change Reviewer, QA Approver |
| **Deviation** | Deviation Creator, Deviation Owner, Deviation Reviewer, QA Approver |
| **CAPA** | CAPA Creator, CAPA Owner, CAPA Reviewer (Action Approver), QA Approver |

### 5.2 Global Roles (Cross-cutting)

| Global Role | Scope | Capability |
|---|---|---|
| **Admin** | System-wide | Create users, define user roles, and manage all system configuration in Settings. |
| **Super QA User** | All modules | Can act as the QA Approver for every module in the system. |
| **Super User** | All modules | Can act as the Reviewer for every module in the system. |

---

## 6. Data Consumption Matrix

| Settings Configuration | Consuming Module(s) | Operational Touchpoint |
|---|---|---|
| Record Numbering + Document Types (Abbreviation) | Documents, CAPA, Deviation | Auto-generates unique record ID at creation (e.g., `ACME-SOP-GEN-2026-000001`). |
| Business Units & Departments | All modules | Ownership assignment, responsibility routing, report filtering. |
| Preferences (Time Zone, Date/Time Format) | All modules | Formats Audit Trail timestamps, record dates, and UI language system-wide. |
| Training Delivery Types & Assessment Methods | Training Module | Delivery method and competency assessment selectors at training course publication. |
| Deviation / NC Types, Categories, Severities | Deviation Module | Incident Type, Category, Severity dropdowns on Create Deviation form. |
| Deviation / NC Root Cause Categories & Methods | Deviation Module | RCA category + investigation technique selectors during Investigation step. |
| CAPA Sources, Classifications, Priorities | CAPA Module | Source, Classification, Priority dropdowns at CAPA record creation. |
| Change Management Types & Categories | Change Control Module | Change Type and Category dropdowns on Change Request creation. |
| Users & Role Assignments | All approval/review workflows | Determines who can Approve, Review, or Reject; resolves assignee display names. |

---

## 7. Exception & Constraint Rules

### Referential Integrity — Delete Guard
- **Rule:** If a lookup value (e.g., a Deviation Type, CAPA Source, or Document Type) is referenced by one or more active operational records, the system must block deletion and display a constraint warning.
- **Effect:** Admins must either reassign existing records to another value or archive/close referencing records before the lookup entry can be removed.

### Abbreviation Uniqueness — Document Types
- **Rule:** Each Document Type `ABBREVIATION` must be unique across the organization. Duplicate abbreviations would cause conflicting Document IDs.
- **Effect:** The system enforces uniqueness validation on save; duplicate abbreviations return a validation error.

### Admin-only Write Access
- **Rule:** All Settings sub-screens (except Users › Roles & Permissions which is read-only for all) are writable only by users with the `Admin` global role.
- **Effect:** Non-Admin users navigating to Settings see data in read-only mode or are restricted.

---

## 8. Invariants & Non-Negotiable Rules

1. **Settings is configuration, not workflow.** No lookup table edit in Settings creates, advances, or closes an operational record. Changes propagate only to future dropdown selections.
2. **Lookup tables are text-only.** NAME and DESCRIPTION are plain text. There are no numeric fields, date ranges, SLA day counts, or boolean toggles in standard lookup table schemas.
3. **Record Numbering is system-enforced.** ID generation is automated on record creation; users cannot manually edit or override an auto-generated ID in operational modules.
4. **Roles & Permissions is read-only.** The role definition matrix cannot be modified through the UI. Available roles per module are hard-coded in the product; only role *assignment* (Users tab) is user-configurable.
5. **Preferences apply system-wide.** Timezone and date format settings affect every module's Audit Trail, timestamps, and displayed dates uniformly.
6. **Phase order is operationally mandatory.** While individual settings screens can be visited in any order, operational modules will render empty dropdowns and broken ID formats without complete Phase 1–3 configuration.

---

## 9. Review Checklist (use after AI-Agent prototype changes)

- [ ] Settings Index page renders 7 cards matching §1.
- [ ] Organisation section includes Record Numbering, Business Units, Departments, Preferences (§4 Phase 1).
- [ ] Record Numbering includes Prefix, Separator, Seq Length, Year checkbox, Sub-type checkbox, and live preview block.
- [ ] Departments table features a search bar; Business Units supports Add Unit.
- [ ] Preferences has 4 select dropdowns (Time Zone, Language, Date Format, Time Format) with `Save Preferences` CTA.
- [ ] Document Types table enforces Abbreviation as unique uppercase badge and drives Document ID generation (§2a).
- [ ] Deviations / NC has 5 tabs with verified records: Types (10), Categories (3), Severities (3: Low/Med/High), Root Cause Categories (5), Root Cause Methods (4: includes Fault Tree Analysis).
- [ ] CAPA Sources shows 6 records; Classifications shows 2; Priorities shows 4 (Low → Critical) without SLA inputs.
- [ ] Change Management shows Change Types (6) and Categories (Minor, Major, Critical).
- [ ] Users table shows Name, Email, Roles (inline text with ·), and Actions; `Add user` modal features interactive pill toggles and global checkboxes.
- [ ] Roles & Permissions is read-only — green badges for module roles, cards for global roles (§5).
- [ ] Referential-integrity constraint check is triggered upon attempting to delete an active lookup item (§7).
