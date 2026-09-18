# Dashboard Module — Shared Files & Decision Change Log

> **Purpose of this document.** Serves as the *living registry* of all shared system files, design components, mock data sources, architectural decisions, and version change logs for the Accura Dashboard Module.
>
> **Companion files:**
> - `Dashboard_Module_Metadata_and_Functional_Spec.md` (executive summary, architecture, widget specs, and metadata dictionary).
> - `Dashboard_Module_Business_Flow.md` (end-to-end user workflows, operational personas, event triggers, and state machine updates).

---

## 1. Directory of Shared Files & System Dependencies

The Dashboard Module is an aggregation layer that integrates with components, tokens, and data models across the Accura codebase and discovery repository:

### 1.1 Application Shell & Navigation

| File Path | Description | Integration with Dashboard |
| :--- | :--- | :--- |
| `Accura-design-system/accura-ui/src/app/prototype/accura/app-sidebar.tsx` | Global navigation sidebar (`AppSidebar`). | Hosts `platformNav` containing the primary `Dashboard` nav item (`icon: LayoutDashboard`, routes to `/prototype/accura/dashboard`). |
| `Accura-design-system/accura-ui/src/app/prototype/accura/page.tsx` | Root prototype index route. | Redirects users upon workspace entry. Updated to route directly to `/prototype/accura/dashboard`. |
| `Accura-design-system/accura-ui/src/components/application-header.tsx` | Application top navigation bar. | Displays current logged-in user profile, avatar initials, workspace switcher, and notification dropdown. |
| `Accura-design-system/accura-ui/src/app/prototype/accura/shell-mock-data.ts` | Global mock data for authenticated session. | Supplies `prototypeUser` (Dr. Sarah Chen, QA Approver) and `prototypeNotifications` consumed by the Dashboard greeting and triage. |

---

### 1.2 Upstream Operational Module Data Sources

| File Path | Module | Consumed Data & Attributes |
| :--- | :--- | :--- |
| `Accura-design-system/accura-ui/src/app/prototype/accura/documents/mock-data.ts` | **Documents** | `DemoDocument`, `stages`, `workflowVariants`, `useStatusVariants`. Feeds Documents RAG status, "2 pending approvals", "124 Active \| 6 Pending", and "SOP Review — 28 Sep". |
| `Accura-design-system/accura-ui/src/app/prototype/accura/capa/mock-data.ts` | **CAPA** | `CapaRecord`, `capaStatuses`, `capaStatusVariant`. Feeds CAPA RAG status, "2 approaching due date", "12 Open \| 2 Due Soon", "CAPA #104", and "CAPA Due — 30 Sep". |
| `Accura-design-system/accura-ui/src/app/prototype/accura/training/mock-data.ts` | **Training** | `TrainingUser`, `userStatuses`, `Assignment`. Feeds Training RAG status, "86% Current \| 3 Overdue", and supervisory alert "Training — 3 people overdue". |
| `Accura-design-system/accura-ui/src/app/prototype/accura/training/training-shell.tsx` | **Training** | Sub-navigation tabs and cohort filtering logic for delinquent trainees. |

---

### 1.3 Shared UI Components & Design System Masters

| File Path | Component Master | Usage in Dashboard |
| :--- | :--- | :--- |
| `Accura-design-system/accura-ui/src/components/ui/card.tsx` | `Card`, `CardHeader`, `CardContent` | Standard container for the 4 dashboard widgets, providing consistent border, background, and elevation tokens. |
| `Accura-design-system/accura-ui/src/components/ui/table.tsx` | `Table`, `TableHeader`, `TableRow`, `TableCell` | Powers the structured 3-column table in *Quality at a Glance*. |
| `Accura-design-system/accura-ui/src/components/ui/badge.tsx` | `Badge` | Powers status pill indicators and RAG status dot tokens. |
| `Accura-design-system/accura-ui/src/components/record-workflow.tsx` | `ElectronicSignatureModal` | Reusable 21 CFR Part 11 modal opened when resolving actions directly from *My Actions* deep links. |
| `Accura-design-system/accura-ui/src/components/record-audit-drawer.tsx` | `RecordAuditDrawer` | Universal history drawer recording signature receipts executed during task resolution. |
| `Accura-design-system/accura-ui/src/components/record-row-action.tsx` | `RecordRowAction` | Responsive table row action pattern for navigating into record details. |

---

### 1.4 Authoritative Governance & Specifications

| File Path | Document | Contract / Rationale |
| :--- | :--- | :--- |
| `Accura-design-system/docs/demo-design-contract.md` | **Demo Design Contract** | Defines the happy-path scope lock, 21 CFR Part 11 signing requirements, shared layout masters, and reusable action patterns. |
| `Accura One - Product Brief.md` | **Product Brief** | Core product mission: accessible, compliant eQMS for growing life-sciences organizations. |
| `accura-discovery/product-knowledge.md` | **Product Knowledge Base** | Defines the core personas (QA Manager, Process Owner, Action Owner) and module lifecycle flows. |
| `accura-discovery/Setting Module/Setting_Module_Metadata_and_Screens.md` | **Settings Master Spec** | Establishes the design tokens (hex palette, typography, radii) and application shell geometry. |

---

## 2. Architectural Decision Register (ADR)

### Decision D1: Strict Mathematical RAG Calculation vs. Mockup Discrepancy
- **Context:** In the discovery screenshot for *Quality at a Glance*, the `Training` row showed a green dot 🟢 alongside the text `3 overdue`. However, the explicit written rule states: *"Red - Has overdue Items (at least 1)"*.
- **Decision:** Enforce the strict mathematical rule in the functional specification. If any module has $\ge 1$ overdue item, its RAG indicator **must evaluate to 🔴 Red**. The screenshot dot was treated as an unlinked static visual mockup.
- **Rationale:** In an eQMS subject to FDA and ISO audits, presenting an overdue training status as "Green" creates severe regulatory non-compliance liability.

### Decision D2: Action Queue Horizon (14 Calendar Days)
- **Context:** The prompt specified: *"Actions items to completed by the Logged in user in the next 14d from today."*
- **Decision:** Filter *My Actions* to records where `DueDate <= Today + 14 days`, plus any unresolved overdue items (`DueDate < Today`).
- **Rationale:** 14 days represents an optimal tactical operational window in regulated life sciences, allowing sprint planning and preventing last-minute compliance scrambles without causing cognitive fatigue.

### Decision D3: Upcoming Milestones Lookahead (30 Calendar Days)
- **Context:** The prompt specified: *"Show any Items due within the next 30d from today."*
- **Decision:** Filter *Upcoming Items* to records where `Today <= TargetDate <= Today + 30 days`, ordered chronologically ascending.
- **Rationale:** 30 days matches standard GxP audit preparation cycles, management review scheduling, and annual SOP periodic review notice windows.

### Decision D4: Standardized Dual-Metric Architecture for "My Quality System"
- **Context:** Screenshot 3 displayed paired metrics across 6 modules (`124 Active | 6 Pending`, `86% Current | 3 Overdue`, `12 Open | 2 Due Soon`, etc.).
- **Decision:** Standardized the schema to `[Primary Metric (Throughput/Volume)] | [Secondary Metric (Attention/Risk)]`.
- **Rationale:** Gives leadership immediate visibility into both the active scale of operations and the specific subset requiring vigilance.

### Decision D5: Direct Action Deep-Linking Contract
- **Context:** Note on Screenshot 2: *"And each item should be clickable directly into the action."*
- **Decision:** Clicking an item in *My Actions* must deep-link directly into the active workflow gate of the target record with the persistent action bar ready to execute (e.g. `Sign review` or `Sign approval`).
- **Rationale:** Minimizes click friction for daily compliance sign-offs and prevents workflow abandonment.

### Decision D6: Action-inbox layout replaces the four-widget grid
- **Context:** Spec §1.3 defines four widgets (*Quality at a Glance*, *My Actions*, *My Quality System*, *Upcoming Items*). Two of them list the same six modules, and on screen they disagreed (CAPA "On track" in one, "3 Due soon" in the other — audit B-01). Three layouts were prototyped after Mobbin research: 2×2 grid, Vanta-style cards + rail, action inbox.
- **Decision:** One page, top to bottom: **notification → Overview (6 metric cards) → Records table (tabs My actions | Upcoming)**. Widgets 1+3 merge into the Overview cards; widgets 2+4 become the two tabs. Content column capped at **1100px** and centred, matching the Knowledge Hub page.
- **Rationale:** One card per module gives one answer per module. The table follows the list-page anatomy the other modules already use, so it needs no new patterns.
- **Deviation:** departs from spec §1.3 (four separate widgets). Confirmed by Chi, 2026-09-18.

### Decision D7: Overview cards — number first, no bar, filtered click-through
- **Anatomy:** icon circle (brand /800 fill, /50 icon, `radius/full`) · module name · status badge (On track / Due soon / Overdue) · **big number** (`display/md` 36px, Albert Sans) · description underneath with its numbers in bold, e.g. *overdue · of **5** users*.
- **Removed after review:** the progress bar (always green, filled with what was fine while the number counted problems; meant something different on every card), the split status bar, and the per-status count row.
- **Click:** each built module's card opens its list **pre-filtered to exactly the records it counts** — Training `?status=Overdue`, CAPA `?due=14d`, Documents `?workflow=In QA Approval`.
- **Unbuilt modules** (Non-Conformance, Audits, Risks): same card, dimmed to 60%, not clickable, labelled *Module not built · sample data*.

### Decision D8: Records table
- **Tabs:** My actions | Upcoming. A record never appears in both (Upcoming = next 30 days minus My actions). *Waiting on others* was prototyped and dropped.
- **Columns:** Record (links to the module record, with a detail line) · Status · Priority · Module · Due date · eye-icon row action (shared `RecordRowAction`, same as Documents).
- **Status colour** comes from the owning module's own status→variant map, never re-chosen on the dashboard. Unbuilt modules use neutral `secondary`.
- **Priority** (new rule, not in the spec): **High** = late or due ≤ 2 days · **Medium** = waiting on your sign-off, or due ≤ 7 days · **Low** = everything else. The spec's five dot tiers (§2.2.3) collapsed to three so one filter holds them.
- **Filter:** one *All priorities* select, on the same row as the record count.
- **Due date:** date plus "In N days" / "N days late"; undated sign-offs show *No due date · Waiting N days*.

### Decision D9: Summary as a notification
- The sentence *"You have 1 overdue, 1 waiting on your sign-off and 1 due this week."* renders as an `Alert` — destructive when anything is overdue, warning otherwise — and is hidden when nothing needs the user.

---

## 3. Version History & Changelog

### v1.0 — 2026-09-17 15:00 (Initial Specification & Artifact Baseline)

**Source:** Accura Dashboard discovery requirements and 4 design screenshots (Trello card `6aaa4a20e2483025ca2954ba`).

#### Deliverables Produced
1. `Dashboard_Module_Metadata_and_Functional_Spec.md`:
   - Documented Executive Summary and Dual-Persona Architecture (Executive Oversight vs. Individual Execution).
   - Formulated mathematical RAG calculation engine for *Quality at a Glance* (Green, Yellow, Red thresholds).
   - Documented query rules, color taxonomy, and deep-link behavior for *My Actions* (14-day window).
   - Formulated the dual-metric calculation matrix for *My Quality System* across 6 quality modules.
   - Documented temporal filtering and event streams for *Upcoming Items* (30-day window).
   - Authored complete TypeScript global state interfaces and entity-level metadata dictionaries.
2. `Dashboard_Module_Business_Flow.md`:
   - Documented closed-loop operational workflow model connecting metrics to 21 CFR Part 11 electronic signatures.
   - Documented 4 detailed user journey flows: Morning Triage (QA Director), Action Execution (Reviewer), 30-Day Planning (Compliance Officer), and System Monitoring.
   - Defined real-time transactional event bus triggers vs. scheduled midnight rollup engine.
   - Established RBAC data visibility matrix and 48-hour escalation policies.
3. `Dashboard_Module_Changelog.md`:
   - Cataloged all shared files, mock data sources, components, and governance contracts across the repository.
   - Recorded 5 key Architectural Decisions (ADR D1 through D5).
   - Grouped all documents under the dedicated Obsidian Vault folder: `Dashboard Module/`.

### v1.1 — 2026-09-18 (Prototype built and design confirmed)

**Branch:** `chi-dashboard` (GitHub clone). **Route:** `/prototype/accura/dashboard`.

#### Added
- `accura-ui/src/app/prototype/accura/dashboard/` — `page.tsx` (re-exports the inbox layout), `inbox/page.tsx`, `inbox/inbox-data.ts`, `dashboard-shell.tsx`, `mock-data.ts`. Numbers for Documents, CAPA and Training are **derived** from those modules' mock data; Non-Conformance, Audits and Risks are dashboard-local samples. "Today" is frozen at 2026-09-17.
- `dashboard/cards/page.tsx` — the earlier cards + rail layout, kept for reference, not linked.
- `Dashboard_Module_Audit.md` — audit of the spec against the codebase (A-01…A-07, B-01…B-11, C-01…C-04).
- ADRs D6–D9 above.

#### Changed — shared and other modules' files
- `app-sidebar.tsx` — Dashboard nav item links to `/prototype/accura/dashboard` (was `#`).
- `prototype/accura/page.tsx` — root redirects to the Dashboard (was CAPA). ⚠️ Conflicts with `accura-ui/CLAUDE.md` ("no landing page") — needs sign-off.
- `capa/page.tsx` — new **Due date** filter (*All due dates* / *Due within 14 days*); status and due filters can be pre-set from the URL (`?status=`, `?due=14d`).
- `training/page.tsx` — status filter can be pre-set from the URL (`?status=`). Diệp's module — tell Diệp before merging.
- `documents/page.tsx` — workflow filter can be pre-set from the URL (`?workflow=`).
- URL filters are read from page `searchParams` props, **not** `useSearchParams`: that hook needs a Suspense boundary, and inside one every Radix `Select` trigger rendered blank.

#### Open
- **Token gap:** brand /50 has no semantic token; the icon borrows `button/secondary/bg-hover`. Fails contrast in dark mode (2.25:1). Needs a Figma variable (e.g. `color/brand/subtle`).
- **B-01:** CAPA RAG uses a 7-day window, the card count 14 days.
- **A-06:** Documents have no due date, so their RAG can only be green.
- **Deviations now exists on `main`** — the Non-Conformance card could link to it instead of showing sample data.
