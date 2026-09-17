# Setting Module — Metadata & Screen Functional Spec

> **Purpose of this document.** Serves as the *original / source-of-truth* for every screen the Setting Module renders, including navigation structure, field schema, UI control type, current data values, and available actions. Use it to review and diff the prototype after any AI-Agent modification.
>
> **Companion file:** `Setting_Module_Business_Flow.md` (configuration flow, actors, data consumption matrix).
> **Log:** `Setting_Module_Log.md` (spec and prototype changes, decisions and open questions).
>
> **Convention.**
> - `(*)` = required; `—` = optional / currently empty.
> - `read-only` = value cannot be edited on this screen.
> - All screens are accessible at `https://demo.accura.one/settings`.
> - Active demo user: `amit@accura.one` (Member).

---

## Table of Contents

1. Settings — Top-Level Navigation (Index Page)
2. Screen — Organisation › Record Numbering
3. Screen — Organisation › Business Units
4. Screen — Organisation › Departments
5. Screen — Organisation › Preferences
6. Screen — Documents › Document Types
7. Screen — Training › Delivery Types
8. Screen — Training › Assessment Methods
9. Screen — CAPA › CAPA Sources
10. Screen — CAPA › Classifications
11. Screen — CAPA › Priorities
12. Screen — Change Management › Change Types
13. Screen — Change Management › Categories
14. Screen — Deviations / NC › Types
15. Screen — Deviations / NC › Categories
16. Screen — Deviations / NC › Severities
17. Screen — Deviations / NC › Root Cause Categories
18. Screen — Deviations / NC › Root Cause Methods
19. Screen — Users › Users
20. Screen — Users › Roles & Permissions
21. Universal UX Patterns — Lookup Tables & Modals
22. Data Consumption Matrix Reference
23. Review Checklist

---

## 1. Settings — Top-Level Navigation (Index Page)

**Screen role.** Entry point for the entire Settings module. Presents a card grid where each card represents a configuration section with its sub-screen count.

**Page heading:** "Settings" — *"Select a module to configure its settings."*

**Card grid (in order, left-to-right, top-to-bottom):**

| Card | Sub-settings count | Icon |
|---|---|---|
| **Organisation** | 4 settings | 🏠 Home |
| **Documents** | 1 setting | 📄 Document |
| **Training** | 2 settings | 📡 Signal |
| **CAPA** | 3 settings | 🔄 Sync |
| **Change Management** | 2 settings | 🔀 Shuffle |
| **Deviations / NC** | 5 settings | ⚠️ Warning |
| **Users** | 2 settings | 👤 Person |

**Card interaction.** Click card → navigates to the section's first sub-screen with left sidebar showing all sub-screens.

**Sidebar navigation (global):** Dashboard, Documents, Training, Deviations, CAPA, Change Management, Reports, Knowledge Hub, **Settings** (active/highlighted), Logout.

---

## 2. Screen — Organisation › Record Numbering

**Navigation path.** Settings → Organisation → Record Numbering (active) | Business Units | Departments | Preferences.

**Screen role.** Defines the auto-generation pattern for record IDs across all operational modules. The organisation prefix and document type are mandatory parts of every record number; separator, sequence length, year, and document sub-type are optional.

**UX pattern.** Form layout with live preview block (not a data table).

### 2.1 Field Schema

| Field | Control Type | Required | Current Value | Functional Purpose |
|---|---|---|---|---|
| **Organisation Prefix** | Text Input | `(*)` | `ACME` | Appears at the start of every record number (mandatory). |
| **Document Type** | Read-only info block | Auto | *"Always included (e.g. SOP, WI, POL) — configured under Documents → Document Types."* | Pulled automatically from the Document Types abbreviation; not editable here. |
| **Separator** | Select Dropdown | — (optional) | `Hyphen (-)` | Character between segments of the record number. |
| **Sequence Length** | Select Dropdown | — (optional) | `6 digits (000001)` | Number of digits in the sequential counter portion. |
| **Include year in record number** | Checkbox | — (optional) | ✅ Checked | Appends the 4-digit year (e.g., `2026`) to the ID structure. |
| **Include document sub-type** | Checkbox | — (optional) | ✅ Checked | Appends a sub-type code (e.g., `GEN`) after the document type abbreviation. |

### 2.2 Live Preview

| Label | Sample Output |
|---|---|
| **PREVIEW** | `ACME-SOP-GEN-2026-000001` |

Format structure: `{Prefix}-{DocType}-{SubType}-{Year}-{Sequence}` (segments depend on which optional checkboxes are enabled).

### 2.3 Action Button

| Button | Behavior |
|---|---|
| **`Save Record Numbering`** | Persists the current configuration. Green primary button. |

---

## 3. Screen — Organisation › Business Units

**Navigation path.** Settings → Organisation → Business Units (active).

**Screen role.** Optional groupings of departments or teams within the organisation. Business Units serve as the top-level organisational hierarchy node.

**Heading:** "Business Units" — *"Optional groupings of departments or teams within your organisation."*

**Primary CTA.** `Add Unit` (green primary button, top-right).

### 3.1 Field Schema

| Column | Data Type | Required | Current Records | Functional Purpose |
|---|---|---|---|---|
| **NAME** | Text / String | `(*)` | Sydney | Name of the business unit / branch. |
| **DESCRIPTION** | Text / String | — | AU | Short identifier or description of the unit. |
| **ACTIONS** | Interactive Buttons | — | Edit \| Delete | Row-level management. |

---

## 4. Screen — Organisation › Departments

**Navigation path.** Settings → Organisation → Departments (active).

**Screen role.** Manages the departments used across the organisation. Department values populate the "Department" dropdown on operational module forms (e.g., Deviation creation) and drive ownership assignment.

**Heading:** "Departments" — *"Manage the departments used across your organisation."*

**Primary CTA.** `Add department` (green primary button, top-right).

**Search bar.** `Search departments...` — text input above the data table. This is the **only lookup screen** in the Settings module with a search bar.

### 4.1 Field Schema

| Column | Data Type | Required | Current Records | Functional Purpose |
|---|---|---|---|---|
| **NAME** | Text / String | `(*)` | Engineering, Quality Control, Reg Affairs | Department name used in all operational modules. |
| **DESCRIPTION** | Text / String | — | Engineering Desc, Quality Control, Regulatory Affairs | Descriptive label for the department. |
| **ACTIONS** | Interactive Buttons | — | Edit \| Delete | Row-level management. |

---

## 5. Screen — Organisation › Preferences

**Navigation path.** Settings → Organisation → Preferences (active).

**Screen role.** Controls how dates, times, and language are displayed across the QMS. These values affect Audit Trail timestamps, record date fields, and the entire UI language.

**Heading:** "Preferences" — *"How dates, times and language are displayed across your QMS."*

**UX pattern.** Form layout with 4 select dropdowns stacked vertically (not a data table).

### 5.1 Field Schema

| Field | Control Type | Current Value | Functional Purpose |
|---|---|---|---|
| **Time Zone** | Select Dropdown | `Australia/Sydney` | Sets the timezone for all system timestamps and audit trail entries. |
| **Language** | Select Dropdown | `English` | Sets the UI language across the entire QMS. |
| **Date Format** | Select Dropdown | `DD-MMM-YYYY (31-Dec-2026)` | Controls how dates are rendered in records, reports, and audit trails. |
| **Time Format** | Select Dropdown | `12-hour (2:30 PM)` | Controls time display format (12-hour vs 24-hour). |

### 5.2 Action Button

| Button | Behavior |
|---|---|
| **`Save Preferences`** | Persists the current preferences. Green primary button. |

---

## 6. Screen — Documents › Document Types

**Navigation path.** Settings → Documents → Document Types (active, only sub-screen).

**Screen role.** Defines and manages controlled document type classifications used across the QMS. The `ABBREVIATION` value participates directly in Document ID generation (e.g., `ACME-SOP-2026-000001`).

**Heading:** "Document Types" — *"Configure the document types used across the QMS. The abbreviation drives Document ID generation (e.g. SOP-001)."*

**Primary CTA.** `Add Type` (green primary button, top-right).

### 6.1 Field Schema

| Column | Data Type | Required | Current Records | Functional Purpose |
|---|---|---|---|---|
| **NAME** | Text / String | `(*)` | Standard Operating Procedure, Work Instruction, Policy, Form, Specification | Full name of the document classification. |
| **ABBREVIATION** | Text / Green Badge (Uppercase) | `(*)` Unique | `SOP`, `WI`, `POL`, `FRM`, `SPEC` | Short code rendered as a green pill badge; used as the type prefix in auto-generated Document IDs. Must be unique. |
| **DESCRIPTION** | Text / String | — | Controlled procedures for operational processes; Step-by-step instructions for specific tasks; High-level organisational directives and principles; Blank templates used to record data and evidence; Technical requirements and acceptance criteria | Describes the scope and purpose of the document type. |
| **ACTIONS** | Interactive Buttons | — | Edit \| Delete | Row-level management. |

### 6.2 Row-Level Actions

| Action | Behavior |
|---|---|
| **Edit** | Opens a form to update the Name, Abbreviation, or Description. |
| **Delete** | Removes the type from the system lookup. Constraint warning if existing documents reference this type. |

---

## 7. Screen — Training › Delivery Types

**Navigation path.** Settings → Training → Delivery Types (active) | Assessment Methods.

**Screen role.** Establishes the recognized training delivery formats (methods by which training is delivered to personnel). Values populate dropdowns in the Training module.

**Heading:** "Delivery Types" — *"Methods by which training is delivered to personnel."*

**Primary CTA.** `Add Type` (green primary button, top-right).

### 7.1 Field Schema

| Column | Current Records | Description |
|---|---|---|
| **NAME** | Classroom | In-person instructor-led training |
| | Online / e-Learning | Self-paced digital course |
| | Virtual Classroom | Live remote instructor-led session |
| | Read & Understand | Read a controlled document and attest understanding |
| **ACTIONS** | Edit \| Delete | Row-level management. |

---

## 8. Screen — Training › Assessment Methods

**Navigation path.** Settings → Training → Assessment Methods (active).

**Screen role.** Defines the recognized methods used to assess training completion and competency. Values are assigned to individual training courses or document read-and-understand workflows.

**Heading:** "Assessment Methods" — *"Methods used to assess training completion and competency."*

**Primary CTA.** `Add Method` (green primary button, top-right).

### 8.1 Field Schema

| Column | Current Records | Description |
|---|---|---|
| **NAME** | Quiz | Multiple-choice or short-answer knowledge check |
| | Practical Demonstration | Observed hands-on demonstration of competency |
| | Written Assessment | Long-form written evaluation |
| | On the job training | Competency assessed during supervised on-the-job performance |
| **ACTIONS** | Edit \| Delete | Row-level management. |

---

## 9. Screen — CAPA › CAPA Sources

**Navigation path.** Settings → CAPA → CAPA Sources (active) | Classifications | Priorities.

**Screen role.** Defines the originating events or triggers that justify opening a CAPA record. Values populate the "Source" field when creating a new CAPA.

**Heading:** "CAPA Sources" (no subtitle text).

**Primary CTA.** `Add Source` (green primary button, top-right).

### 9.1 Field Schema

| NAME (current records) | DESCRIPTION | ACTIONS |
|---|---|---|
| Deviation | — | Edit \| Delete |
| Audit | — | Edit \| Delete |
| Complaint | — | Edit \| Delete |
| Risk Assessment | — | Edit \| Delete |
| Management Review | — | Edit \| Delete |
| Standalone | — | Edit \| Delete |

---

## 10. Screen — CAPA › Classifications

**Navigation path.** Settings → CAPA → Classifications (active).

**Screen role.** Groups CAPA records by the nature of the problem (Corrective vs. Preventive). Supports Root Cause Trend Analysis and departmental responsibility allocation.

**Heading:** "CAPA Classifications" (no subtitle text).

**Primary CTA.** `Add Classification` (green primary button, top-right).

### 10.1 Field Schema

| NAME (current records) | DESCRIPTION | ACTIONS |
|---|---|---|
| Corrective Action | — | Edit \| Delete |
| Preventive Action | — | Edit \| Delete |

---

## 11. Screen — CAPA › Priorities

**Navigation path.** Settings → CAPA → Priorities (active).

**Screen role.** Establishes urgency and importance levels for corrective/preventive actions. Values populate the "Priority" dropdown when creating or editing CAPA records. This is a pure lookup/master data table — no SLA day-count fields or automated rule triggers.

**Heading:** "CAPA Priorities" (no subtitle text).

**Primary CTA.** `Add Priority` (green primary button, top-right).

### 11.1 Field Schema (order: ascending severity)

| NAME (current records) | DESCRIPTION | ACTIONS |
|---|---|---|
| Low | — | Edit \| Delete |
| Medium | — | Edit \| Delete |
| High | — | Edit \| Delete |
| Critical | — | Edit \| Delete |

---

## 12. Screen — Change Management › Change Types

**Navigation path.** Settings → Change Management → Change Types (active) | Categories.

**Screen role.** Classifies the object or scope impacted by a Change Request. Values populate the "Change Type" dropdown in the Change Management module.

**Heading:** "Change Types" (no subtitle text).

**Primary CTA.** `Add Type` (green primary button, top-right).

### 12.1 Field Schema

| NAME (current records) | DESCRIPTION | ACTIONS |
|---|---|---|
| Document Change | — | Edit \| Delete |
| Process Change | — | Edit \| Delete |
| Equipment Change | — | Edit \| Delete |
| Facility Change | — | Edit \| Delete |
| System Change | — | Edit \| Delete |
| Supplier Change | — | Edit \| Delete |

---

## 13. Screen — Change Management › Categories

**Navigation path.** Settings → Change Management → Categories (active).

**Screen role.** Labels the scale or character of a change request. Used for filtering, reporting, and routing to the appropriate approval level.

**Heading:** "Change Categories" (no subtitle text).

**Primary CTA.** `Add Category` (green primary button, top-right).

### 13.1 Field Schema (order: ascending impact)

| NAME (current records) | DESCRIPTION | ACTIONS |
|---|---|---|
| Minor | — | Edit \| Delete |
| Major | — | Edit \| Delete |
| Critical | — | Edit \| Delete |

---

## 14. Screen — Deviations / NC › Types

**Navigation path.** Settings → Deviations / NC → Types (active) | Categories | Severities | Root Cause Categories | Root Cause Methods.

**Screen role.** Classifies the domain, object, or area where a deviation or non-conformance occurred. Values populate the "Incident Type" dropdown in the Deviation module.

**Heading:** "Deviation Types" (no subtitle text).

**Primary CTA.** `Add Type` (green primary button, top-right).

### 14.1 Field Schema

| NAME (current records) | DESCRIPTION | ACTIONS |
|---|---|---|
| Document | — | Edit \| Delete |
| Process | — | Edit \| Delete |
| Equipment | — | Edit \| Delete |
| Facility | — | Edit \| Delete |
| Utility | — | Edit \| Delete |
| Computer System | — | Edit \| Delete |
| Material | — | Edit \| Delete |
| Supplier | — | Edit \| Delete |
| Regulatory | — | Edit \| Delete |
| Analytical Method | — | Edit \| Delete |

---

## 15. Screen — Deviations / NC › Categories

**Navigation path.** Settings → Deviations / NC → Categories (active).

**Screen role.** GMP impact classification for deviations. Values populate the "Category" field on the Deviation create form.

**Heading:** "Deviation Categories" (no subtitle text).

**Primary CTA.** `Add Category` (green primary button, top-right).

### 15.1 Field Schema (order: ascending impact)

| NAME (current records) | DESCRIPTION | ACTIONS |
|---|---|---|
| Minor | — | Edit \| Delete |
| Major | — | Edit \| Delete |
| Critical | — | Edit \| Delete |

---

## 16. Screen — Deviations / NC › Severities

**Navigation path.** Settings → Deviations / NC → Severities (active).

**Screen role.** Defines the risk-severity labels assignable to a deviation. Values populate the "Severity" dropdown in the Deviation module. Pure text-label lookup table — no numeric risk matrix or scoring.

**Heading:** "Severities" (no subtitle text).

**Primary CTA.** `Add Severity` (green primary button, top-right).

### 16.1 Field Schema (order: ascending severity)

| NAME (current records) | DESCRIPTION | ACTIONS |
|---|---|---|
| Low | — | Edit \| Delete |
| Medium | — | Edit \| Delete |
| High | — | Edit \| Delete |

---

## 17. Screen — Deviations / NC › Root Cause Categories

**Navigation path.** Settings → Deviations / NC → Root Cause Categories (active).

**Screen role.** Defines the high-level groupings for root cause investigation. Values populate the "Root Cause Category" selector during deviation investigations.

**Heading:** "Root Cause Categories" (no subtitle text).

**Primary CTA.** `Add Category` (green primary button, top-right).

### 17.1 Field Schema

| NAME (current records) | DESCRIPTION | ACTIONS |
|---|---|---|
| Human Error | — | Edit \| Delete |
| Equipment / Facility | — | Edit \| Delete |
| Process / Method | — | Edit \| Delete |
| Material | — | Edit \| Delete |
| Environmental | — | Edit \| Delete |

---

## 18. Screen — Deviations / NC › Root Cause Methods

**Navigation path.** Settings → Deviations / NC → Root Cause Methods (active).

**Screen role.** Lists the investigation techniques approved for use in Root Cause Analysis. Values are selectable when logging the investigation approach on a deviation record.

**Heading:** "Root Cause Methods" (no subtitle text).

**Primary CTA.** `Add Method` (green primary button, top-right).

### 18.1 Field Schema

| NAME (current records) | DESCRIPTION | ACTIONS |
|---|---|---|
| 5 Whys | — | Edit \| Delete |
| Fishbone (Ishikawa) | — | Edit \| Delete |
| Fault Tree Analysis | — | Edit \| Delete |
| FMEA | — | Edit \| Delete |

---

## 19. Screen — Users › Users

**Navigation path.** Settings → Users → Users (active) | Roles & Permissions.

**Screen role.** Manages the list of user accounts in the organization and assigns per-module or global roles to each person.

**Heading:** "Users" — *"Add users and assign their per-module and global roles."*

**Primary CTA.** `Add user` (green primary button, top-right).

### 19.1 Field Schema

| Column | Data Type | Required | Current Records | Functional Purpose |
|---|---|---|---|---|
| **NAME** | Text / String | `(*)` | Sarah Johnson, James O'Brien | Full name of the user account. |
| **EMAIL** | Email / String | `(*)` Unique | sarah.johnson@example.com, james.obrien@example.com | Email for authentication, login, and notifications. |
| **ROLES** | Inline text (· separated) | `(*)` | `Documents: QA Approver · CAPA: QA Approver · Super QA User`; `Documents: Author · Deviation: Deviation Creator` | Aggregated set of granted roles displayed as `<Module>: <Role>` entries separated by `·` interpuncts, plus global role labels. |
| **ACTIONS** | Interactive Links | — | Edit \| Delete | Account lifecycle and role adjustments. |

### 19.2 Add User Modal

**Modal title:** "Add user"

**Identity fields (top row):**

| Field | Control Type | Required |
|---|---|---|
| **Name** | Text Input | `(*)` |
| **Email** | Text Input | `(*)` |

**Module Roles section — interactive pill/chip toggle buttons (multi-select per module):**

| Module | Available Role Toggles |
|---|---|
| Documents | `Author` · `Reviewer` · `QA Approver` |
| Training | `Training Creator` · `Approver` |
| Change Control | `Change Owner` · `Change Reviewer` · `QA Approver` |
| Deviation | `Deviation Creator` · `Deviation Owner` · `Deviation Reviewer` · `QA Approver` |
| CAPA | `CAPA Creator` · `CAPA Owner` · `CAPA Reviewer (Action Approver)` · `QA Approver` |

**Global Roles section — checkboxes with description text:**

| Checkbox | Role | Description |
|---|---|---|
| ☐ | **Admin** | Create users, define user roles, and manage system configuration. |
| ☐ | **Super QA User** | Can act as the QA Approver for every module. |
| ☐ | **Super User** | Can act as the reviewer for every module. |

**Buttons:** `Cancel` (ghost/text) + `Add user` (green primary).

---

## 20. Screen — Users › Roles & Permissions

**Navigation path.** Settings → Users → Roles & Permissions (active).

**Screen role.** Read-only reference guide for the RBAC model. Administrators consult this screen to understand role definitions before assigning roles in the Users tab.

**Heading:** "Roles & Permissions" — *"Fine-grained roles are scoped per module. A user can hold different roles in different modules (e.g. Author in Documents, Reviewer in CAPA)."*

> **Read-only screen.** No Add, Edit, or Delete controls are present.

### 20.1 Block 1 — Per-Module Roles (table with green pill badges)

| MODULE | ROLES (green pills) |
|---|---|
| Documents | `Author` · `Reviewer` · `QA Approver` |
| Training | `Training Creator` · `Approver` |
| Change Control | `Change Owner` · `Change Reviewer` · `QA Approver` |
| Deviation | `Deviation Creator` · `Deviation Owner` · `Deviation Reviewer` · `QA Approver` |
| CAPA | `CAPA Creator` · `CAPA Owner` · `CAPA Reviewer (Action Approver)` · `QA Approver` |

### 20.2 Block 2 — Global Roles (card list with title + description)

**Section heading:** "Global Roles" — *"Cross-cutting roles that apply across all modules."*

| Role | Description |
|---|---|
| **Admin** | Create users, define user roles, and manage system configuration. |
| **Super QA User** | Can act as the QA Approver for every module. |
| **Super User** | Can act as the reviewer for every module. |

---

## 21. Universal UX Patterns — Lookup Tables & Modals

### 21.1 Standard Lookup Table Pattern

All sub-screens (except Organisation › Record Numbering, Organisation › Preferences, Users, and Roles & Permissions) share this UX:

| Element | Description |
|---|---|
| **Table layout** | Three columns: NAME, DESCRIPTION, ACTIONS (Document Types adds ABBREVIATION as a 4th column). |
| **Primary CTA** | Green primary button, top-right corner. Label is dynamic: `Add Type`, `Add Method`, `Add Source`, `Add Classification`, `Add Priority`, `Add Category`, `Add Unit`, `Add department`, `Add Severity`, `Add Root Cause Category`, `Add Root Cause Method`, `Add user`. |
| **Edit action** | Inline row action — opens update form for that record. |
| **Delete action** | Inline row action — removes from lookup. Constraint check for referenced records. |
| **Back navigation** | `< All Settings` — breadcrumb/link to Settings index, present on every sub-screen. |

### 21.2 Standard Create Modal (Lookup Items)

Used by all lookup table Add CTAs except `Add user`:

| Element | Detail |
|---|---|
| **Modal title** | `Add {Entity}` (e.g., "Add Priority", "Add Source") |
| **Field 1** | `Name *` — Text Input, required (asterisk on label) |
| **Field 2** | `Description` — Text Input, optional (placeholder text: `Optional`) |
| **Buttons** | `Cancel` (ghost/text, left) + `Add {Entity}` (green primary, right) |
| **Close behavior** | No X button in modal corner; Cancel is the only dismiss action. |

### 21.3 Form-Based Screens (Non-Table)

Two screens use a form layout instead of a data table:

| Screen | Pattern |
|---|---|
| **Record Numbering** | Mix of text inputs, select dropdowns, and checkboxes + a live preview block + `Save Record Numbering` button. |
| **Preferences** | Four stacked select dropdowns + `Save Preferences` button. |

### 21.4 Heading Subtitle Behavior

| Section | Has subtitle text? |
|---|---|
| Organisation (all screens) | ✅ Yes |
| Documents | ✅ Yes |
| Training | ✅ Yes |
| CAPA (all tabs) | ❌ No subtitle |
| Change Management (all tabs) | ❌ No subtitle |
| Deviations / NC (all tabs) | ❌ No subtitle |
| Users (both tabs) | ✅ Yes |

### 21.5 Screen Heading Title Format

All screens use the format `{Section Name} {Tab Name}`:
- "Deviation Types", "Deviation Categories", "CAPA Sources", "CAPA Priorities", "Change Types", "Change Categories", "Root Cause Categories", "Root Cause Methods", "Document Types", "Delivery Types", "Assessment Methods", "Business Units", "Record Numbering", "Preferences".

---

## 22. Data Consumption Matrix Reference

Settings data is consumed as static lookup values (dropdowns, chip selectors) by operational modules. No settings value triggers runtime logic autonomously.

| Settings Configuration | Consuming Module(s) | Operational Use |
|---|---|---|
| Record Numbering + Document Types (Abbreviation) | Documents, CAPA, Deviation | Auto-generates unique record ID at creation (e.g., `ACME-SOP-GEN-2026-000001`). |
| Business Units & Departments | All modules | Ownership assignment, responsibility routing, report filtering. |
| Preferences (Timezone, Date/Time Format) | All modules | Formats Audit Trail timestamps, record dates, and UI language. |
| Training Delivery Types & Assessment Methods | Training Module | Delivery method and competency assessment selectors at training creation. |
| Deviation / NC Types, Categories, Severities | Deviation Module | Incident Type, Category, Severity dropdowns on Create Deviation form. |
| Deviation / NC Root Cause Categories & Methods | Deviation Module | RCA category + investigation technique selectors during Investigation step. |
| CAPA Sources, Classifications, Priorities | CAPA Module | Source, Classification, Priority dropdowns at CAPA creation. |
| Change Management Types & Categories | Change Control Module | Change Type and Category dropdowns on Change Request creation. |
| Users & Role Assignments | All approval/review workflows | Determines who can Approve, Review, or Reject; resolves assignee display names. |

---

## 23. Review Checklist (use after AI-Agent prototype changes)

- [ ] Settings Index page shows 7 cards with correct names and sub-setting counts (§1).
- [ ] Organisation has 4 sub-screens: Record Numbering, Business Units, Departments, Preferences (§2–§5).
- [ ] Record Numbering shows live preview and includes Sub-type checkbox (§2).
- [ ] Departments is the only lookup screen with a search bar (§4).
- [ ] Preferences uses form layout with 4 dropdowns + `Save Preferences` (§5).
- [ ] Document Types has 4 columns: NAME, ABBREVIATION (green badge), DESCRIPTION, ACTIONS — 5 records (§6).
- [ ] Training Delivery Types has 4 records; Assessment Methods has 4 records (§7, §8).
- [ ] CAPA Sources has 6 records; Classifications has 2; Priorities has 4 (Low→Critical ascending) — all text-label-only (§9–§11).
- [ ] Change Types has 6 records; Categories shows Minor, Major, Critical (not Emergency) (§12, §13).
- [ ] Deviation Types has 10 records matching Deviation Module spec (§14).
- [ ] Deviation Categories shows Minor, Major, Critical; Severities shows Low, Medium, High (§15, §16).
- [ ] Root Cause Categories shows 5 records: Human Error, Equipment/Facility, Process/Method, Material, Environmental (§17).
- [ ] Root Cause Methods shows 4 records including Fault Tree Analysis; Fishbone uses "(Ishikawa)" not "Diagram / Ishikawa" (§18).
- [ ] Users table shows NAME, EMAIL, ROLES (inline text with ·), ACTIONS — 2 records (§19).
- [ ] Add User modal has Name*, Email*, Module Roles (pill toggles), Global Roles (checkboxes) (§19.2).
- [ ] Roles & Permissions is read-only — no Add/Edit/Delete controls; green pills for module roles, card layout for global roles (§20).
- [ ] Create modal pattern: Name* + Description (Optional) + Cancel + `Add {Entity}` — no X close button (§21.2).
- [ ] CAPA/Change Management/Deviations headings have no subtitle text (§21.4).
- [ ] `< All Settings` back navigation present on every sub-screen.
- [ ] Delete actions include constraint check before removing referenced values.
