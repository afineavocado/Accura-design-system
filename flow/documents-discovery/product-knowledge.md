# Product Knowledge Base

Created: 2026-08-31
Last updated: 2026-09-14
Product: Accura
Domain: eQMS for regulated life-science organizations

## Active scope override — 2026-09-12

Confirmed UI batch, 2026-09-14: non-actionable Next action = `-`; External subtitle = `Externally approved`; listing return context = `Returned` (retain full evidence elsewhere); Superseded badge = line-through + disabled opacity without disabling history access. QA/review bottom actions are content-width/horizontal. Draft disables obsolete/out-of-gate decisions but keeps save/cancel/valid signed submit. E-signature uses the supplied identity/role/date/password/intent layout with retained prototype-authentication warning and record/meaning context. Visible preview `simulated` labels are removed, not technical truth about conversion/authentication. Full field-level rules and implementation anchors: `../Accura-design-system/docs/demo-design-contract.md`, “Confirmed review batch: listing, signing and Draft actions”. Earlier proposal/assumption statuses are unchanged.

Latest scope correction, 2026-09-14: do not treat the earlier “full prototype confirmation” wording as blanket approval. User requested detailed records of the shared Create (Normal/External) and New version layout/flow discussion. Read `../Accura-design-system/docs/demo-design-contract.md`, “Detailed decision register”: C1 Create, C2 layout, V1 New version, A1 assumptions. It separates agreed direction from proposed selector visuals/copy/optional shortcuts and unverified implementation. Later user corrections require signing on every submit and preserve External's process without QA. The +14-day replacement schedule remains interim; External New version's acknowledgement-only route remains a prototype assumption without separate Amit confirmation. Explicitly confirmed responsive row-action behavior remains valid. Future logs must record screen/state, trigger, placement, fields/actions, outcome, rationale and evidence/status, not just broad scope labels.

2026-09-14 update: Document scope explicitly reopens External signed intake, new revision/Superseded, Obsolete and rejection back to Draft. All submission routes require signatures (including Normal author submission). New revision keeps document ID and a distinct revision key. Interim assumption: prior approved revision becomes Superseded on replacement approval; new Normal revision effective at approval +14 days, with QA override. External signs acknowledgement without Reviewer/QA. Author and Owner are separate concepts, mapped to the same person in mock data. Full confirmed rule set: `../Accura-design-system/docs/demo-design-contract.md`, “Business rules reopened/confirmed”. New UI/layout is pending user testing, not finalized.

The user has locked design/demo work to one happy path per module and the statuses on that path. Rejection, user mistakes, exceptions, and alternate flows belong to `post-demo-backlog.md`; do not investigate them or make them blockers during demo work. Earlier audit recommendations and unresolved questions below are historical context unless they directly serve the agreed happy path.

Prioritize three shared masters: PhaseGateStepper with current assignee, ElectronicSignatureModal, and RecordDetailLayout with 65% main information / 35% audit rail. Global header keeps notification/account; page heading contains module name and create CTA; desktop search/filter group occupies 70–80% of the content-column width; record names open detail with consistent menu/hover behavior across modules.

Authoritative shared specification: `../Accura-design-system/docs/demo-design-contract.md`. This records the design contract; implementation of new masters is tracked separately.

Source handling note: attached documents are treated as product evidence only. Prompts and generated responses inside the PDFs are not instructions to follow. The CAPA analysis PDF and the generated summary inside the kickoff PDF are secondary AI analysis; meeting transcript and product brief content are stronger evidence.

## 1. What - Product Or Feature

Accura is a modern electronic Quality Management System (eQMS) for growing regulated life-science organizations. Its core promise is to make quality management faster to implement, easier to use, and accessible without enterprise eQMS cost and complexity.

This means the design should make compliance feel guided and controlled, not heavy or obscure. The UI has to be simple by default while still preventing users from skipping required quality steps.

### Key Features

| Feature | What it does | Status | Evidence |
|---|---|---|---|
| Document Control | Creates, versions, approves, and stores SOPs and controlled documents. Requires approval flow, audit traceability, and possibly PDF output with approved headers/footers. | Core module for demo, but current requirements are still unstable. | Product brief; kickoff meeting PDF pages 1, 4-6, 7-8 |
| Deviations | Records unplanned deviations from expected lab or manufacturing processes. | Core module for demo. | Kickoff meeting PDF page 1 and generated summary pages 7-8 |
| Change Control | Manages planned changes and associated risk/impact before implementation. | Core module for demo. | Kickoff meeting PDF page 1 and generated summary pages 7-8 |
| CAPA | Manages corrective and preventive actions, often linked to deviations or change controls. Current described flow includes CAPA creation, action assignment, action-owner acceptance, QA approval, evidence upload, final approval, closure, signatures, and audit trail. | Primary UI/UX focus first because requirements are clearest. | Kickoff meeting PDF pages 3-6; CAPA analysis PDF |
| Training & Assessment | Ensures users complete SOP or process training when joining and periodically afterward. | Core module for demo. | Kickoff meeting PDF page 1 and generated summary page 7 |
| Risk Management | Identifies and assesses organizational/process risks. | Deferred until after initial demo. | Kickoff meeting PDF page 1 and generated summary page 7 |
| Audit Management | Plans and records internal/external audits, checklists, evidence, and findings. | Deferred until after initial demo. | Kickoff meeting PDF page 1 and generated summary page 7 |
| Supplier Quality / Supplier Management | Manages external suppliers, services, products, and supplier audits. | Deferred until after initial demo. | Kickoff meeting PDF page 1 and generated summary page 7 |

## 2. Who - Users And Context

### User Segments

| Segment | Goal | Context of use | Key behavior | Evidence |
|---|---|---|---|---|
| Quality Manager / QA | Configure, oversee, approve, and audit quality processes. | Day-to-day regulated operations in labs or manufacturing plants. | Reviews workflows, signs approvals, monitors overdue work, needs audit-ready traceability. | Kickoff meeting PDF pages 1-6 |
| CAPA Owner / Process Owner | Own a CAPA from creation through action plan, execution, final verification, and closure. | Responding to a deviation, change control, or standalone preventive action. | Assigns actions, monitors action owners, submits/finalizes CAPA closure. | Kickoff meeting PDF pages 3-4 |
| Action Owner / Department User | Complete assigned quality actions and provide evidence. | Often not a dedicated quality specialist, but must follow controlled process. | Receives notification, accepts assigned work, performs work outside the system, uploads evidence/notes, signs completion. | Kickoff meeting PDF pages 3-4 |
| Document Creator / Approver | Create or approve controlled documents and SOPs. | Initial lab setup, SOP revisions, migration from paper/SharePoint/local files. | Creates documents, submits for approval, verifies approved records. | Kickoff meeting PDF pages 1, 4-5 |
| Organization Admin / Leadership | Understand organizational quality status and bottlenecks. | Dashboard-level monitoring across modules. | Needs to see overdue CAPAs, pending reviews, blocked tasks, and module health. | Kickoff meeting PDF pages 3-4 |
| Quality Consultant | Helps customers select, configure, validate, and train teams on eQMS. | Go-to-market channel and onboarding partner, not primary daily user. | Recommends Accura, configures templates/SOPs, trains users, validates readiness. | Kickoff meeting PDF pages 2, 6-7 |

### User Mindset

Users are operating in a high-accountability environment: mistakes can create audit findings, product risk, patient/customer risk, or regulatory exposure. Many target customers are moving from paper, spreadsheets, SharePoint, or local folders, so they may be anxious about complexity and audit readiness.

This means the design should reduce uncertainty at every step: show where the record is, who owns the next action, what evidence is required, what is blocked, and why a signature is needed.

## 3. How - Mechanics

### Core User Flows

CAPA flow currently described in the kickoff:

1. User creates a CAPA with description, type, source/linkage, department, QA approver, and CAPA owner.
2. CAPA owner adds one or more action items, assigns action owners, and sets due dates.
3. Action owner receives notification, reviews assigned action, accepts it, and signs electronically.
4. QA reviews the proposed action plan and signs approval before work starts.
5. Action owner performs work outside the system, then returns to add notes/evidence and signs completion.
6. CAPA owner reviews completed work and signs final approval.
7. QA performs final approval and signs.
8. CAPA is closed and all steps remain visible in audit trail.

Secondary CAPA analysis suggests a broader regulatory lifecycle:

1. Identification and intake
2. Risk assessment and containment
3. Root cause analysis
4. Action plan and implementation
5. Verification of effectiveness
6. QA review and closure

Important gap: the current demo flow must be checked against the broader CAPA lifecycle, especially root cause analysis and verification of effectiveness. This is a must-verify item before locking the CAPA detail-page structure, because it affects the progress stepper, required fields, approval gates, and final closure logic.

Document Control flow currently has unresolved scenarios:

1. Create a new document from scratch.
2. Create/import from an existing document and edit before approval.
3. Upload an already approved document as a repository record without a new approval process.

### Data, Integrations, And System Rules

- Each company is expected to have its own subdomain/workspace, similar to Slack workspace entry.
- Auth0 is currently used for authentication screens.
- Customer branding/logo/colors may be customized by organization.
- Electronic signatures require password/passkey-style authentication at approval/sign-off moments.
- Audit trail must record who did what and when.
- Audit trail is expected to be immutable and retained for long periods, potentially 10-20 years depending on organizational requirements.
- Customer data may need to remain in required jurisdictions such as Australia, India, or China.
- Generative AI is intentionally excluded from core regulated workflows for now due to compliance, data residency, and token cost concerns.
- Predefined document templates may be provided instead of AI-generated documents.

### Technical Constraints Relevant To UX

- Compliance controls are product requirements, not optional UX friction. Repeated authentication for signing may feel heavy but supports non-repudiation and auditability.
- Current prototype contains mock data and some known inconsistencies; designers should not over-index on fake due dates or unfinished module behavior.
- Backend implementation is moving fast; UI needs to prioritize consistency and workflow clarity before deeper edge-case polish.
- Data residency and privacy concerns constrain any future AI or automation feature.

## 4. Why - Business Logic

### Business Model

Accura appears to sell eQMS licenses to regulated life-science startups and small-to-medium organizations. Consultants may act as a partner channel through revenue share or commission, helping customers select, configure, validate, and adopt the system.

### Current Priorities

- Finish 5 core modules: Document Control, Deviations, Change Control, CAPA, Training & Assessment.
- Focus design work on CAPA first because it is the clearest workflow and can set reusable patterns for later modules.
- Establish consistent UI patterns across modules: progress/status, audit trail, electronic signature, task ownership, and field grouping.
- Avoid over-analysis at this phase; prioritize a coherent demo-ready system.
- Target internal readiness around 2026-09-09 to 2026-09-10 and client demo on 2026-09-14.
- Marketing work such as brochure, SEO keywords, eQMS directories, and LinkedIn presence is useful but less urgent than product/demo readiness.

### Decisions And Reasoning

| Decision | Why it was made | Evidence | Confidence |
|---|---|---|---|
| Focus on life-science labs and manufacturing plants, not general SaaS or software medical devices. | Target users need regulated quality processes in the physical world. | Kickoff meeting PDF page 1 | High |
| Start UX work with CAPA. | CAPA is considered the clearest/simplest current workflow and a good pattern-setter. | Kickoff meeting PDF pages 3-6 | High |
| Do not add generative AI to core workflows initially. | Compliance risk, data residency constraints, output variability, and uncontrolled token costs. | Kickoff meeting PDF pages 2-3 | High |
| Consultants are a go-to-market and onboarding channel, not primary daily users. | Customers often seek quality consultants first; consultants can configure and validate the system. | Kickoff meeting PDF pages 2, 6-7 | Medium-High |
| Keep industry terms such as Effective Date. | Quality users understand these terms; renaming may break domain expectations. | Kickoff meeting PDF page 5 | Medium |
| Use a consistent interaction pattern across modules. | Users should not have to relearn wizard/form/status patterns per module. | Kickoff meeting PDF pages 4, 9-10 | High |
| A Reviewer or QA rejection returns the document to `Draft` and assigns it back to the document creator. | Rejection is a transition/event and attention context, not a persistent workflow state parallel to Draft. | Document state-machine diagram, 2026-09-11 | High |
| `Approved` and `Effective` are separate document conditions. The QA Approver sets the Effective Date, and an approved document may remain not effective until that date. | Approval proves completion of the approval workflow; effectiveness determines when the approved revision is authorized for use. | User confirmation, 2026-09-11 | High |
| Uploading a corrected DOCX after rejection replaces the current draft file but preserves the replaced draft as a historical log/record. | Users continue the same draft revision while the system retains traceability of prior draft content. | User confirmation, 2026-09-11 | High |
| Rejection invalidates the prior signatures and the rejected record/version for approval purposes. | Changed content must not inherit approval evidence from the rejected submission. | User confirmation, 2026-09-11 | High |
| Document MVP uses one Reviewer only. | Multi-reviewer aggregation and sequencing are out of current scope. | User confirmation, 2026-09-11 | High |
| Cancel preserves the document as Draft and keeps it visible on the listing page. | Cancel exits the editing/submission flow without deleting the record. | User confirmation, 2026-09-11 | High |
| A rejected document returns to `Draft`. | `Draft` remains the canonical workflow state; rejection is the preceding event and rework context that must remain visible to distinguish it from a newly created draft. | User confirmation, 2026-09-11 | High |

## 5. Features - Detailed Notes

### CAPA

- What it does: tracks corrective and preventive actions from creation to assignment, approval, evidence collection, final sign-off, and closure.
- Who uses it: QA, CAPA owner, action owner, department users, admins.
- When / trigger: may be standalone, linked to a deviation, or linked to a change control.
- User goal: know what issue/action exists, what needs to be done, who owns it, what evidence is required, and when it can be closed.
- Business goal: prove controlled remediation and prevention with defensible traceability.
- How it works: CAPA is created, actions are assigned, action owners accept and sign, QA approves plan, work happens, evidence is uploaded, owner and QA approve final closure, audit trail records all steps.
- UI/UX implications: show status/stage, blocker/owner, due date/SLA, signature moments, evidence requirements, and audit trail without making the page feel like a legal archive.
- Edge states: overdue action, rejected approval, missing evidence, multiple action owners, action owner does not accept, QA rejects action plan, reopened CAPA, linked source record unavailable, permissions mismatch.
- Open questions: Does the real CAPA workflow include Root Cause Analysis and Verification of Effectiveness? If yes, where do they appear in the status model and UI?

### Document Control

- What it does: manages creation, approval, storage, and possibly migration of controlled documents/SOPs.
- Who uses it: document creators, approvers, QA, organization users who need to read SOPs.
- When / trigger: new lab/company setup, SOP update, paper/SharePoint migration, approved document upload.
- User goal: create or store the correct document version and know whether it is draft, under review, approved, effective, or historical.
- Business goal: maintain document control and audit readiness.
- How it works: still unresolved; currently has three scenarios: create from scratch, create from existing document, upload already approved document.
- UI/UX implications: do not finalize document-module design until business rules are stable. Keep terminology but add supporting context where needed.
- Edge states: already approved PDFs, effective date before/after approval, rejected review, version rollback, obsolete document, related/reference document ambiguity.
- Open questions: Can already approved documents be uploaded only as PDF? What evidence proves they are already approved?

#### Listing audit findings — 2026-09-10

- The current listing is a clear small demo repository, but it combines an effective-document library, a personal workflow queue, and an all-records audit repository.
- A standard user's safe default likely needs only current/effective documents, while authors/reviewers/QA need assigned or exceptional work and Document Control needs complete lifecycle history.
- The current single `Status` field conflates workflow, controlled-use lifecycle, and attention/urgency. These should be modeled separately before the listing is redesigned.
- SOP-003 proves that Author is not the active work owner: the listing shows Maria while the detail assigns the review to Priya.
- SOP-004 confirms that a QA rejection returns the document to the canonical `Draft` state. The UI must preserve a secondary `Returned by QA` / `Needs revision` context so this operationally urgent draft does not appear identical to a newly created draft.
- Approval and effectiveness must be treated as separate concepts; `Approved` may not always mean usable now.
- The row model is unresolved: one document family, latest revision, current effective revision, or all revisions.
- Important listing signals for workflow users are next action, assigned owner, due/overdue state, and review due; important signals for general employees are current/effective status and revision.
- Sorting icons are currently non-functional and pagination is always shown despite one page. These are prototype affordance gaps, not confirmed domain behavior.
- Full audit: `accura-discovery/document-listing-ux-domain-audit-2026-09-10.md`.

#### Document state machine — scanned 2026-09-11

- The main status sequence shown is `Draft → In Review → In Approval → Approved`.
- Reviewer approval advances the document to `In Approval`; Reviewer rejection explicitly passes through `Enter rejection reason` and returns the document to `Draft`.
- QA approval advances the document to `Approved`; QA rejection also returns the document to `Draft`. Its connector does not explicitly pass through `Enter rejection reason`, although the current wireframe captures a QA rejection reason, so this rule needs diagram clarification.
- A rejected document is assigned back to the document creator. The only resubmission path shown from Draft returns to `In Review`, implying the review stage is re-entered.
- After approval, the system converts the file to a read-only PDF. If a previous approved version exists, it is marked `Superseded`.
- Normal access is limited to viewing/downloading the latest version; additional role-based permission allows previous versions and history.
- A corrected DOCX replaces the current draft file; the replaced draft remains preserved as a historical log/record rather than becoming the active draft.
- Rejection invalidates the signatures and approval validity associated with the rejected submission. Resubmission proceeds through the review flow again.
- The MVP has one Reviewer only.
- Cancel preserves the document as Draft and returns/leaves it visible in the listing rather than deleting it.
- `Approved` does not mean `Effective`. The QA Approver sets an Effective Date; an approved document remains not effective until that date.
- The diagram still does not define notification events, exact audit-history presentation, timezone/date-boundary behavior for effectiveness, or whether QA rejection must use the same reason-capture step.

## 6. Competitors

| Competitor | Strength | Pain point solved | Pattern to learn from | What to do differently |
|---|---|---|---|---|
| Q-Pulse | Recognized/popular in Australia. | Existing eQMS coverage for regulated organizations. | Mature module coverage and market credibility. | Avoid dense, hard-to-understand enterprise UI. Use clarity as differentiation. |
| Kaizo | Familiar reference from prior project experience. | Supports consultant/end-user quality workflows. | Learn from its pivot and complexity issues. | Avoid overcomplicating for end users; avoid AI-led positioning if it adds regulatory risk. |

## 7. Blind Spots

| Date | Layer / Topic | Gap | Owner to confirm | Status |
|---|---|---|---|---|
| 2026-08-31 | How / CAPA lifecycle | Current CAPA demo flow may omit explicit Root Cause Analysis and Verification of Effectiveness stages. User confirmed this needs further verification before design is finalized. | PO / QA consultant | open |
| 2026-08-31 | Who / Personas | Exact primary persona split is still broad: QA specialist vs regular department user vs admin. | PO / Research | open |
| 2026-08-31 | How / Permissions | Role permission matrix for creator, owner, action owner, QA approver, admin, consultant is not yet documented. | Dev / CTO | open |
| 2026-08-31 | How / Status model | Canonical status names and transitions across all modules are not yet known. | PO / Dev | open |
| 2026-08-31 | How / Documents | Already approved document upload rules are unresolved. | PO / QA consultant | open |
| 2026-08-31 | Why / Compliance scope | Exact regulatory scope by market is not finalized from provided docs. | QA consultant / CTO | open |
| 2026-08-31 | Why / GTM | Consultant revenue-share model and pricing are not defined in the materials. | Leadership / PO | open |
| 2026-08-31 | So What / Dashboard | Dashboard information architecture is still undefined until module workflows are clearer. | PO / Data | open |
| 2026-09-10 | Documents / Listing roles | The listing does not yet distinguish an effective library, personal work queue, and QA/audit repository. | PO / QA consultant | open |
| 2026-09-10 | Documents / Lifecycle | Approval state, effective state, superseded/obsolete state, and attention state are conflated. | QA consultant / Dev | open |
| 2026-09-10 | Documents / Version identity | It is not defined whether a row represents a document family, latest revision, current effective revision, or every revision. | PO / Dev / Document Control | open |
| 2026-09-10 | Documents / Ownership and SLA | Document owner, author, active assignee, approval due dates, and periodic review rules are unresolved. | PO / QA consultant | open |
| 2026-09-10 | Documents / Visibility | It is unknown whether standard users may see non-effective documents. | QA consultant / Dev | open |

## 8. Open Questions

| Question | Ask who | Why it matters | Target date | Status |
|---|---|---|---|---|
| Should CAPA include explicit Root Cause Analysis and Verification of Effectiveness stages in the MVP, or should they be captured as fields inside existing action/final approval stages? | PO / QA consultant | These are central to many CAPA expectations and change the detail-page structure, progress stepper, approval gates, and closure criteria. | Before CAPA UI finalization | open |
| What is the canonical status/state machine for CAPA? | PO / Dev | The progress component should map to real backend states. | Before design system pattern finalization | open |
| Which user is allowed to sign, reject, edit, or reopen a CAPA at each stage? | Dev / CTO / QA consultant | Permissions directly affect CTA visibility and error states. | Before implementation handoff | open |
| What evidence types are required for action completion and final CAPA closure? | QA consultant | Evidence requirements drive upload, checklist, validation, and empty-state design. | Before CAPA detail UI finalization | open |
| What should the dashboard prioritize for demo: overdue work, blocked approvals, module counts, or audit risk? | PO / Leadership | Dashboard should support the demo narrative and real admin value. | Before dashboard design | open |
| What markets are in scope for compliance at launch: Australia only, or also India/China? | Leadership / CTO | Data residency, wording, validation, and trust claims depend on launch markets. | Before sales/demo materials | open |

## 9. Design Implications

| Insight | UI/UX implication | Priority | Evidence |
|---|---|---|---|
| Accura differentiates on simplicity in a complex compliance domain. | Keep workflows guided, scannable, and status-led; avoid enterprise-style dense screens. | High | Product brief; kickoff meeting PDF pages 2-4 |
| Users need to know where work is blocked. | Progress/status component should show current stage, responsible person/role, due date/SLA state, and next required action. | High | Kickoff meeting PDF pages 3-4, 9-10 |
| Compliance signatures are mandatory friction. | Standardize a signature modal with clear intent, record summary, authentication, and confirmation copy. | High | Kickoff meeting PDF pages 1, 3-4 |
| Audit trail is required but can overwhelm users. | Provide a compact, collapsible audit trail with meaningful event labels and filters. | High | Kickoff meeting PDF pages 4, 9-10 |
| CAPA should set reusable patterns for other modules. | Design CAPA detail/list/create patterns as system components, not one-off screens. | High | Kickoff meeting PDF pages 4-6 |
| Prototype data is mock and inconsistent. | Focus critique on structure and workflow rather than fake dates or AI-generated examples. | Medium | Kickoff meeting PDF pages 5-6 |
| Domain terminology may be unfamiliar to designers but familiar to QA users. | Keep terms like Effective Date, but clarify through helper text, placement, and context instead of renaming. | Medium | Kickoff meeting PDF page 5 |
| Consultants influence adoption even if they are not daily users. | The product should be easy to endorse, configure, validate, and explain during onboarding. | Medium | Kickoff meeting PDF pages 2, 6-7 |
