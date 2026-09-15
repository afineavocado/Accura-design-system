# Accura — Demo scope

Confirmed by user: 2026-09-12.
Status: approved scope. What this demo covers and what is deliberately deferred.

> **The component specs that used to live here (§3–§7 — PhaseGateStepper,
> ElectronicSignatureModal, RecordDetailLayout, shell and listing rules) moved to
> `docs/skills/accura-prototype-build/accura-design-patterns.md` on 2026-09-14.** They are
> patterns, and patterns outlive a demo; keeping them in a scope document meant they went stale
> without anyone noticing. Some were superseded — the skill records which, and why.

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
