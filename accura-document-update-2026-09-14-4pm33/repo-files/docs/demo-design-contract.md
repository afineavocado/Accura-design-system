# Accura — Demo design contract

Confirmed by user: 2026-09-12.
Status: approved scope and reusable component specification; not a claim that new Figma/code masters have been implemented.

## Canonical Document prototype — 2026-09-14

### Confirmed review batch: listing, signing and Draft actions — 2026-09-14

Status: user confirmed the latest two implementation batches after prototype review. Applies to `/prototype/accura/documents` and the shared components used there. This does not promote older unconfirmed Create/New version presentation proposals or interim business assumptions to final rules.

1. **Listing / Next action:** show the literal `-` instead of `No action required` or `View history` for Approved or retired records. Do not show a next-assignee subtitle for these rows. Keep actionable labels/assignees for active Draft, Review and QA states. Record links and Audit Trail access remain available; the dash does not delete history. Reason: visually prioritize rows requiring work.
2. **Listing / External use-status copy:** show only `Externally approved`, removing the appended `· no effective date`. This is a copy reduction, not a change to External effective-date rules.
3. **Review/QA bottom task actions:** Reject and Sign review/Sign final approval use ordinary content-width Button sizing, side by side in the same flex row, consistent with other status pages. Remove the primary button's full-width/minimum-width expansion; preserve wrapping when necessary on narrow screens and the existing signature triggers. QA effective-date context remains in the bar.
4. **Shared E-signature presentation:** use the supplied modal pattern: title `Electronic Signature — 21 CFR Part 11`, identity-verification subtitle, read-only Full Name and Role at Sign-off side by side, read-only Time and Date beneath, password-style credential input, intent checkbox, Cancel and signing CTA. Keep compact record/revision and action-specific signature meaning; retain required reason input for rejection/obsolete. Cancel is ghost. The displayed opening time is context only; the receipt timestamp is assigned on signing. The prototype still accepts `demo` with explicit guidance not to enter a real password; it is not real authentication or a compliance certification. Exact legal-attestation wording from the screenshot was not copied as a claim of compliance.
5. **Visible Document preview copy:** remove `Simulated`/`simulated` from PDF preview text, its accessible label and Word sample rendering label. Preserve truthful prototype guidance and technical documentation of unimplemented conversion/authentication. This does not claim real PDF conversion and does not authorize deleting technical limitations from docs or unrelated modules.
6. **Draft actions:** Mark as Obsolete is visible but disabled in Draft. Do not enable approval/rejection/retirement decisions outside their valid gate; the signing callback guards against these decisions while Draft. Save as Draft, Cancel (retain Draft) and valid signed Submit remain available. New version remains an Approved entry point. Audit/view/download are not disabled just because the record is Draft. This supersedes the earlier enabled Draft Mark as Obsolete behavior; Approved obsolete behavior is unchanged.
7. **Superseded badge:** shared Document UseBadge displays Superseded with line-through and the design-system disabled-opacity token, making it quieter than Draft in listing and detail. This is presentation only: historical record navigation remains enabled; do not disable the whole row or erase the historical approval status.
8. **Returned label:** in the listing Workflow cell, show only `Returned` beneath Draft instead of `Returned by <full name>`. Preserve the return actor, reason, gate and time in underlying data/detail/audit context. Do not replace Draft with a new Rejected workflow state.

Implementation anchors: `accura-ui/src/app/prototype/accura/documents/{page,components,document-detail,document-files}.tsx` and `accura-ui/src/components/record-workflow.tsx`. Latest checks: ESLint passed for both batches; TypeScript passed for the first batch. User review supplies visual acceptance; these checks are not a full production workflow test. No commit/push implied by this confirmation.

### Decision scope correction — 2026-09-14

The earlier statement “full Document confirmation” was too broad and is withdrawn. The user clarified that the log should capture specific layout/flow adjustments based on the Create/External and New version proposal. Record approval at decision level, not module level. The detailed register below distinguishes user-confirmed direction, interim assumptions and proposal details that have not separately been confirmed. Logging a proposal does not authorize implementing it. Existing explicit confirmations (including responsive row actions) remain valid. This is not production integration or compliance validation.

### Detailed decision register: shared Create and New version

Source: the user-pasted proposal beginning “một màn Create dùng chung cho hai loại document”, subsequent corrections that all submissions require signatures and External still has a process, and the latest request for a detailed log. The pasted proposal is historical design rationale, not proof that every suggested control/copy was approved or implemented. Code/prototype parity was not re-audited during this documentation-only update.

#### C1. Shared Create — agreed direction; exact selector treatment remains proposal

- Use one Create document layout for Normal and Pre-approved / External, rather than treating External as an unrelated module. Category determines processing route; Document type remains SOP/POL/WI/FRM and must not be conflated with category.
- Proposed selector placement: directly under Create document heading, before upload/form. Proposed treatment: two radio cards or a two-option selection with short route descriptions, not an on/off switch. Radio-card versus segmented visual treatment and exact description copy are not separately confirmed by the user.
- Rationale: expose the route choice before data entry; reuse common fields and avoid an unnecessary navigation step. Do not claim the demo's existing two-step flow is defective: that flow was not directly tested in the original proposal.
- Shared fields: name, document type, department, source file and document links. Normal shows one Reviewer and one QA Approver. External must not ask for Reviewer/QA or show an internal QA approval route.
- Normal CTA intent: submit for review, opening the signing modal first. The original proposal omitted author signing in its shorthand flow; the later user correction takes precedence. Normal route: Draft → signed submission → In Review → signed review approval → In QA Approval → signed QA approval → Approved.
- External CTA intent: Sign and submit → acknowledgement signature → Approved, with Submitted / Signed retained as process/audit context. User explicitly confirmed `Draft → Submitted / Signed → Approved`; do not interpret “no QA” as “no process” or unsigned upload. Representing Submitted / Signed as an audit event rather than a persistent waiting gate is the recorded prototype interpretation, not a newly verified backend state model.
- Normal effective date: approval +14 days, with QA override. External: no Normal effective-date calculation in the current direction. Signature meaning is upload acknowledgement, not an invented QA signature.
- Proposed External helper copy: “Your signature acknowledges this upload. No internal review or QA approval is required.” Exact copy and replacing a stepper with this line remain presentation proposals; do not invent Review/QA gates either way.
- Keep category visible in record context so Approved External is not confused with internally QA-approved Normal. The proposal says not to apply Normal's QA metadata/header/footer to External; actual file-generation behavior must be checked against the functional spec/code before changes. No conversion or PDF output was verified by this log.

#### C2. Shared layout — previously explicitly confirmed

- Detail/Create omit the duplicate Documents module heading/create section. Put record title and badges together on the left; ID, revision and category/context go below the title. Global header retains notification/account.
- Desktop left 70%: upload/source file or preview, then pre-approved attachments. Right 30%: Document details first, Document links second. Narrow metadata cards use label/value layout and divided headers. Do not restore Controlled use or Approval route cards.
- Persistent bottom action bar carries the current task, with white overlay surface/elevation and no overlap of sidebar/final content. Audit Drawer is the history surface for signatures and events, not a permanent Signatures card.
- Default effective-date readout: neutral Automatic badge followed by `: Approval Date plus 14 Days`. This is date-policy display, not a workflow status.

#### V1. New version — agreed direction and detailed proposed layout

- Entry context: an Approved document; New version is a separate action from Create unrelated document, and reuses the Draft layout. Place it in the detail heading action area, not the bottom task bar: it starts new work rather than completing the current gate. Exact label `Create new version` in the proposal versus `New version` in the prototype is not a mandate to rename it.
- Optional listing-menu shortcut was only proposed. Do not add it automatically, especially since the reviewed row action is Open record.
- Proposed new-Draft heading context: `Create new version` + Draft badge; below, `SOP-001 · v3.0 · Based on v2.0`. Proposed helper: “You’re preparing a new revision. The previous revision is retained.” Preserve the source-revision meaning; exact title/helper copy remains unconfirmed.
- Proposed left-column sequence: prior source file available for download → upload revised source → updated preview. Proposed right column: prefilled editable metadata → document links. Reuse 70/30 rather than a new page structure. This sequence is recorded intent, not a claim that all current controls were checked.
- Keep Document ID unchanged/read-only; allocate a distinct revision identity and increment revision automatically, not by free-text entry. Keep the old record/history; do not overwrite its identity or signatures.
- Metadata and links can be prefilled for review. Reviewer/QA prefilling from the prior Normal revision was proposed as an input-saving convenience, not evidence that those assignments are always still valid. Do not silently treat prefilled people as newly signed approvals.
- Never copy valid signatures or the old effective date into the new revision. New Normal effective date is calculated from its own approval (+14 days, QA override). Its workflow restarts in Draft.
- Normal bottom actions: Cancel / Save as Draft / Submit for Review; submit requires a new author signature. Cancel retains the draft in the listing, per the later confirmed rule, rather than discarding it.
- Normal flow: Approved v2.0 → New version → Draft v3.0 → revised upload → signed submission → Review → QA approval → Approved v3.0. Rationale: make continuity and the exact revision explicit while reducing repeated metadata entry.

#### A1. Interim assumptions — retain these labels

- On replacement approval, the old approved revision becomes Superseded immediately; the replacement Normal revision defaults to effective at approval +14 days (QA override). User asked to keep this interim schedule and revisit later. There may be a period with no effective revision. Do not silently keep the old revision effective or prematurely label the new one Effective to hide the gap.
- External New version retaining category and the acknowledgement-only route was raised as needing Amit confirmation in the original proposal. The current prototype follows category-specific workflow, but there is no separate Amit confirmation in the supplied exchange. Preserve as a prototype assumption, not a final production rule.
- Author and Owner are distinct concepts; mapping them to the same mock person is a prototype assumption only.

#### Logging rules for subsequent agents

- For each decision record: affected screen/state, trigger, location/order, visible fields/actions, resulting state, rationale, evidence/status and what it supersedes. Use “confirmed”, “interim assumption”, “proposal” or “verified implementation” deliberately; do not substitute one for another.
- Read this register before deriving tasks from the historical proposal. Later explicit user corrections override earlier assistant suggestions (notably author signing and External process). No broad “entire module approved” inference.
- Do not add optional shortcuts, choose an unconfirmed selector variant, change copy or alter a business rule solely because it appears in a logged proposal. Check the current implementation before claiming parity. This log update authorizes documentation only.

### Previously discussed baseline — consult decision-level status above

- Canonical route remains `/prototype/accura/documents`; do not recreate the retired demo/audit routes. Preserve existing mock data and browser storage.
- Listing: Documents heading + Create Document; no compare CTA, concept tag, segmented tabs or due-date column. Keep a single revision-record listing. Search/filter stays approximately 70–80% on desktop and wraps on smaller screens.
- Information hierarchy: document name links to the specific revision; ID/type/category are supporting text. Keep Revision, Workflow, Use status, Next action/assignee and Document owner information. Search/filter covers category, type, department, workflow and use status. Use `In QA Approval`; distinguish Normal/External category from SOP/POL/WI/FRM type, using the prototype's aligned department data.
- Workflow and usability remain separate: Approved is not necessarily Effective; Pending effective is derived from a future effective date, not an extra approval gate. Superseded/Obsolete stay visible as use conditions; returned Draft shows return context, not a separate current Rejected workflow state.
- Detail: no duplicate Documents heading/create section. Title and badges align left, ID/revision/category/current-or-historical context below. Keep global notification/account. Remove demo-session text and redundant Workflow/waiting heading; keep full-width phase stepper with stage assignees.
- Desktop detail is 70/30: preview/content and pre-approved attachments left; Document details then Document links at the top of the right rail. Informational cards use divided headers and label/value layout. No Controlled use, Approval route or persistent Signatures/Activity cards.
- Effective-date display uses a neutral Automatic badge followed by `: Approval Date plus 14 Days`. Retain QA override and distinct Pending effective/Effective presentation.
- Task actions remain in the persistent elevated bottom bar, within the content column, without covering final content or the sidebar. All required signing uses the shared signature modal. Audit Trail drawer holds signatures and record history; metadata on exported/approved files is not removed by this UI consolidation.
- Retain pre-approved attachments (up to five) separately from the document's approval workflow, plus related/reference document links. Normal/External creation, New version, Superseded, Obsolete and returned Draft contexts are included in this confirmed prototype scope.
- Reuse shared components/tokens for future modules; do not automatically migrate their flows or claim they have been implemented. The specific rules below govern table actions, grouped buttons, signatures and audit history.

### Shared responsive table actions and action sizing — confirmed

- All modules should reuse `RecordRowAction` for record-opening table actions. It composes the existing TableCell and ghost Button; it does not replace those primitives.
- Shared Table measures actual horizontal overflow, including after resize. Only overflowing tables pin the action cell to the visible right edge and reveal its overlay surface with shadow/md on row hover or keyboard focus. Touch keeps it visible. Ghost buttons gain their background only on button hover/active, using existing Button tokens.
- Fitting tables show the action normally at the end of every row: no sticky positioning, elevated panel or hover-only hiding. Standard row-hover feedback is unchanged.
- Independent buttons in one action container use `ActionGroup` with one size (default for page-heading actions). Height, typography and padding follow the same Button size tokens, including nested triggers; icon actions use the matching square size. Text widths remain content-driven. Do not confuse this with the existing connected, bordered `ButtonGroup` pattern.
- Floating action container and icon button are separate layers: keep the container's white overlay surface, padding and shadow/md when visible; only the inner button is ghost. Activate sticky behavior from actual horizontal overflow, not a fixed viewport breakpoint. When the table fits again, restore ordinary inline actions with no floating surface.
- Document is the first consumer. Other module screens are not implicitly migrated.

### Business rules reopened/confirmed — 2026-09-14 (prototype UI confirmed)

The user explicitly reopened Normal/External intake, new revision, Superseded, Obsolete and rejection/returned Draft. These override the earlier deferred-scope notes only for Document. The reviewed prototype UX/layout is confirmed; provisional domain assumptions below are not promoted to final production rules.

- Every route's submission and approval/rejection decision requires an electronic signature, including Normal author submission and External acknowledgement. Saving/exiting a draft is not submission.
- Normal: Draft → In Review → In QA Approval → Approved. One reviewer and one QA approver.
- External: Draft → Submitted / Signed → Approved, through signed author acknowledgement; no Reviewer or QA gate. Submitted / Signed is retained as an audit event, not an invented waiting task. Do not apply Normal's effective-date calculation to External intake.
- New revision retains the Document ID but has a distinct revision identity, restarts its category's workflow and does not inherit valid signatures. Previous content and signatures remain historical records.
- Confirmed interim assumption: when the replacement revision becomes Approved, the prior approved revision becomes Superseded immediately. The new Normal revision still defaults to approval +14 days (QA override retained). This can leave a period with no effective revision; do not silently treat Pending effective as Effective. Revisit only if the product rule changes.
- Superseded and Obsolete are record-use conditions, separate from approval progress. Neither is available for controlled use; both remain searchable/read-only.
- Rejection returns to Draft with signer, time, source gate and reason. Prior submission/approval signatures lose validity but remain in history; resubmission requires a fresh author signature.
- Replacing the active draft file preserves the prior file as a historical upload record. Cancel retains the draft.
- Author is the creator/signing identity; Owner is responsibility. Prototype assumption: the same named person fills both roles, without implying these fields are universally interchangeable.
- Obsolete is an author action with a reason; the prototype uses signed confirmation consistently with the user's decision-signing rule. No role-management implementation is implied.

Latest confirmed Document layout: use 70/30 desktop columns. The right 30% column starts with Document details, then Document links. Current task lives in a persistent bottom action bar, not the side rail. Remove Controlled use and Approval route cards; Draft reviewer/QA selectors live within Document details. File preview and attachments stay in the left 70% column. Use single-column metadata fields in the narrow rail. This overrides earlier Document 65/35/card placement rules; shared layout defaults for other modules remain unchanged.

### Confirmed bottom action bar and use-status rules

- Keep the action bar outside the document scroll container but within the content column: always visible, no sidebar overlap, no hidden last field/attachment. Reuse Button, Checkbox and Input; surface/overlay and paired foreground, border/default top edge, upward shadow/lg elevation.
- Draft: Cancel (retains draft), Save as Draft, Submit for Review. Review: Sign review. QA: effective date plus override on the left, Sign final approval on the right. Keep copy compact. Signing opens the existing confirmation modal. Approved hides the task bar.
- Pending effective is a derived Use status label, not an added workflow gate or a status name explicitly supplied by the PDF. Approved + future effective date = Pending effective; Approved + reached effective date = Effective. Before approval = Not effective. No additional signature/release action is introduced.
- Default effective date remains approval +14 days with QA override. Prototype evaluation occurs on render; no backend scheduler or new timezone policy is implied.
- Retain pre-approved attachments per the specification. Horizontal stepper fills more width using narrower outer step tracks, while retaining labels/assignees and the vertical mobile layout.

### Shared audit presentation — applies to all modules

- Audit Trail is the single history surface for signatures, status changes and other record events. Do not build persistent Signatures or Activity cards on detail pages; keep current status, assignee and actionable information there.
- Reuse `accura-ui/src/components/record-audit-drawer.tsx` (`RecordAuditDrawer`, `RecordAuditEvent`) with a module-specific event adapter. Document is the first consumer; other modules are not migrated automatically.
- Signature events retain signer, role, execution timestamp with seconds/timezone, signature meaning and record/revision linkage. Show before/after status when known. Sort all events newest first; combine a signature and its corresponding workflow event without hiding unrelated activity.
- Moving presentation must not delete signature receipts, alter signing behavior, or remove signatures from the approved document/PDF. Never fabricate hashes or Verified badges without verification data.
- Open with View audit trail near the record heading. Use the shared right-side Sheet, scrollable body, keyboard close and focus return.

Detail presentation update: Document detail/create pages omit the module heading/create CTA (listing keeps them). Record title and workflow/use badges are left-aligned together; ID/revision metadata sits below. Omit demo-session copy and the Workflow/waiting heading above the stepper while retaining assignees in its steps. Informational cards use divided headers and label/value grids. Effective-date default uses a neutral Automatic badge plus “: Approval Date plus 14 Days”. Activity is available through a right-side Audit Trail drawer, not a persistent card. These explicit user changes override the original detail heading/rail guidance below.

The user explicitly requested removal of old Document prototypes. The former `documents-demo` implementation is now the only active implementation at `accura-ui/src/app/prototype/accura/documents`, served at `/prototype/accura/documents`. Do not recreate `documents-demo`, `documents-audit`, `documents-new`, or `documents-draft-new` routes. Preserve browser storage keys for existing demo data. This supersedes earlier instructions to keep parallel Document prototypes.

## Functional specification refinement — 2026-09-14

The user requested refinement against `accura-discovery/Documents Module Functional Specification.pdf` (Document Module Requirements, 6 pages). Within the locked Normal Document happy path, this supersedes earlier timing assumptions:

- Effective date defaults to approval +14 days for the MVP; QA may override during final review. Approved and Effective remain separate.
- Conversion to PDF occurs on submission, not on approval. Approval adds header/footer and first/last metadata pages; download stamping happens only at download.
- Review/QA users may download the original but cannot replace it. Add pre-approved attachments (maximum five), separate from workflow-controlled content.
- Draft supports selecting one reviewer/one QA approver for this demo, plus related review documents and reference documents.
- External intake, new-version/superseded and obsolete flows in the PDF remain deferred branches unless explicitly reopened. Real conversion, stamping and electronic signature integrations are not implied by a prototype.

The UI implementation still demonstrates file conversion/signatures with labelled fixtures. The older sections below describe the original master contract; apply the newer rules above where they differ.

## 1. Scope lock

Design exactly one agreed happy path per module, using the screens and statuses shown in the demo script. Do not draw every possible page/state for every module. Prioritize reusable masters that Amit can apply to Document, CAPA, Deviation, and Change Control.

Questions about rejection, wrong user actions, exceptions, alternative routes, and edge cases are Post-Demo Backlog. Capture at most one short backlog item and continue; do not investigate, ask follow-up questions, design extra screens, or implement that branch during demo work. Keep basic accessibility and the existing behavior of shared controls.

This scope decision takes precedence over older discovery audits recommending broad edge-state research or blocking design until every business rule is resolved. Preserve earlier confirmed business facts for future work. Do not delete existing screens or branches unless explicitly requested.

## 2. Demo path

Document: listing → create/edit Draft → upload DOCX and metadata → assign one Reviewer and one QA Approver → submit → In Review → reviewer signs approval → In Approval → QA sets Effective Date and signs final approval → Approved → view the read-only PDF.

Approved and Effective remain separate. Use the QA-set Effective Date in the demo data and show the corresponding use status. No additional release action, timezone policy, or historical-version branch should be invented to complete the demo.

For other modules, reuse their agreed demo path and stage labels. The Document stage list is not a universal workflow. If another module has no agreed script, finish the shared masters without inventing a new module state machine.

## 3. Master: PhaseGateStepper

Purpose: show progress, the current gate, and the person whose action moves the record forward.

- Shared anatomy: stage label; completed/current/upcoming visual state; current assignee name and role; concise pending action.
- For Document: Draft → In Review → In Approval → Approved.
- Current-stage copy: `Waiting for Tom Bradley · Reviewer` or `Waiting for Dr. Sarah Chen · QA Approver`; if assigned to the signed-in user, `Your action: Review document`.
- Completed stages show completion through an icon and text. Upcoming stages are visually quiet. Do not use color alone.
- The user-facing term is `Waiting for` or `Assigned to`, not `Blocked by`: waiting for a normal approval is not an error.
- A stage click must not change workflow state or bypass a gate. Only the prescribed successful action advances the demo.
- Reuse the existing Stepper primitive, typography, icons, and tokens. Allow module-specific stage/assignee data rather than duplicating the composition.
- Demo states needed: each happy-path stage current, and completed. Rejection/exception variants are deferred.

## 4. Master: ElectronicSignatureModal

Purpose: provide one consistent signing experience at each prescribed signing gate.

Anatomy in order:

1. Action-specific title: `Sign review approval` or `Sign final approval`.
2. Record context: module, record ID, title, and revision being signed.
3. Read-only signer name/account and role.
4. Explicit meaning of the signature: review approval, final approval, or another meaning already defined by the module's demo path.
5. The established authentication control for the product. Never present a typed display name or checkbox alone as identity authentication.
6. A clear statement of signing intent; a checkbox is a product choice, not proof of regulatory compliance.
7. Secondary `Cancel` and primary `Sign and approve`, with contextual wording for the gate.

On success: show the resulting workflow state and append/display the signature in the shared Audit Trail drawer with signer, execution timestamp including timezone, meaning, and record/revision association. The signing timestamp is assigned on execution, not prefilled as an editable user value. Distinguish a prototype simulation from verified production signing behavior.

For Document, Effective Date belongs to the QA final-approval step. Show it in the approval context/summary without adding a permanently visible date field to every module's signing modal.

Reuse Dialog, Button, Input, and existing authentication/signature patterns. Preserve focus management and keyboard behavior. Design the happy-path signing state and successful result; do not expand into failed-authentication or rejection flows for this demo.

Regulatory reference: 21 CFR 11.50 covers signer name, execution date/time, and signature meaning; 11.70 covers signature-to-record linkage; 11.200 covers signature components and controls. This master is a UI specification supporting those requirements, not a standalone Part 11 compliance certification. Production authentication, linkage, and record controls remain implementation responsibilities.

Sources:
- https://www.law.cornell.edu/cfr/text/21/11.50
- https://www.law.cornell.edu/cfr/text/21/11.70
- https://www.law.cornell.edu/cfr/text/21/11.200

## 5. Master: RecordDetailLayout

- Full-width shared application shell and page heading above the content.
- PhaseGateStepper spans the detail content above the two columns.
- Desktop columns: 65% main information and 35% audit rail, calculated from available space after the column gap. Use 65:35 fractional tracks rather than two percentage widths plus an overflowing gap.
- Main column card order: primary record content/file; supporting metadata; references/linked records. Use module-specific content slots in this shared structure.
- Side rail contains the current gate/responsible person/next action and approval route. Signature records and activity history belong only in the Audit Trail drawer. Do not repeat the entire metadata form in the rail.
- Primary task CTA appears once in the shared action area; do not create competing copies in several cards. The master should allow the module's agreed action and label.
- Reuse Card and semantic spacing/typography tokens. Separate cards when they answer different user questions, not for every field.
- At widths that cannot support readable columns, stack main content before the audit rail. Do not shrink both columns until names and controls become unreadable.

## 6. Shared shell and listing rules

- Global header always holds notification and account. Module-specific page titles belong in the content heading.
- Page heading contains module name and create CTA in the same positions across modules. On detail screens, also show the current record title/ID and its contextual action without creating duplicate primary CTAs.
- Desktop search/filter group occupies approximately 70–80% of the available content-column width, left aligned. Default target: 75%. Do not stretch it to the entire table width and do not interpret the rule as each individual input taking 75%.
- On narrow screens controls may wrap and use the available width. Keep labels readable rather than forcing the desktop percentage.
- The table can use the full content width. Keep search/filter logically grouped with the table, with consistent vertical spacing across modules.
- Record name is always the primary detail link; support keyboard focus and normal link behavior. Hovering a row gives a subtle shared surface highlight, not a workflow change.
- If the entire row is clickable in a module, its record link still exists; action-menu clicks must not trigger row navigation. Prefer the same row interaction policy across all modules.
- Row actions use the same menu trigger, placement, and ordering convention. Expose only actions on the agreed demo path; no speculative menu items.
- Preserve one shared listing for the current Document demo. Do not add Effective/My Work/All Records segmented views as part of this standardization.
- Reuse existing Accura design-system components and tokens. Maintain one composition per master, configured with module data.

## 7. Definition of done for future master implementation

- One reusable master per pattern, with configurable labels/content/assignees rather than page-specific copies.
- Demonstrate the masters using the existing Document happy path first.
- Verify stage labels, current assignee, signing context/result, 65/35 layout, 75% toolbar, record link, menu, and row hover.
- Keep non-demo questions out of the active implementation plan. Prototype validation covers the intended demo navigation and basic component accessibility, not an exhaustive exception matrix.
