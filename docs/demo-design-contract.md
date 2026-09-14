# Accura — Demo design contract

Confirmed by user: 2026-09-12.
Status: approved scope and reusable component specification; not a claim that new Figma/code masters have been implemented.

## Canonical Document prototype — 2026-09-14

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
- Desktop columns: fractional tracks calculated from available space after the column gap, rather than two percentage widths plus an overflowing gap. **The current ratio is 70/30** — see the canonical section above; this line records the technique, not the numbers.
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
- Verify stage labels, current assignee, signing context/result, 70/30 layout, toolbar width, record link, menu, and row hover.
- Keep non-demo questions out of the active implementation plan. Prototype validation covers the intended demo navigation and basic component accessibility, not an exhaustive exception matrix.
