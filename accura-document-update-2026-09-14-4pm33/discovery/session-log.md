# Session Log

## 2026-09-14 — Latest Document UI batches confirmed

User confirmed all changes in the latest two reviewed batches. Detailed source of truth: `../Accura-design-system/docs/demo-design-contract.md`, “Confirmed review batch: listing, signing and Draft actions”.

- Listing: non-actionable Next action cells now `-`; External subtitle only `Externally approved`; returned Draft subtitle only `Returned`, with historical attribution retained elsewhere.
- Review/QA bottom buttons are content-width and horizontal, retaining responsive wrap and existing signing flow.
- Shared E-signature modal follows the supplied identity/role/date/password/checkbox/action layout while retaining record/meaning context, required reasons and truthful demo-credential guidance. Signature receipt time remains execution time, not the displayed opening timestamp.
- Removed visible `simulated` wording from Document previews, not technical limitations or real-authentication safeguards.
- Draft Mark as Obsolete disabled; out-of-gate approval/rejection/obsolete guarded. Save/Cancel/valid signed Submit and read-only actions retained.
- Superseded uses strike-through and disabled-opacity token in shared UseBadge (listing/detail); history remains navigable.
- Rationale: improve scan priority, distinguish retired from active Draft, reduce redundant copy and align shared action/signature patterns.
- Limits: no new approval of older proposed selector/copy details; interim rules remain provisional. No production compliance claim. Next: await next requested fix; no code changes, commit or push in this logging turn.

## 2026-09-14 — Correction and detailed Create / New version record

- User clarified that “log all” meant specific layout/flow adjustments from the pasted Create/External and New version discussion, not blanket approval of the module. The earlier full-confirmation interpretation below is superseded.
- Added the detailed decision register in `../Accura-design-system/docs/demo-design-contract.md`: C1 shared Create/category and category-specific signed routes; C2 70/30 layout, bottom task bar and audit; V1 New version entry, source-revision context, prefill, identity/date/signature rules and actions; A1 interim assumptions.
- Recorded exact proposed placement, control alternatives and copy separately from confirmed direction. Radio cards versus segmented selection, exact helper/title text and optional listing shortcut are not silently marked approved. External New version remains a prototype assumption pending separate confirmation.
- Preserved later corrections: every submit requires signature; External still has Draft → Submitted / Signed → Approved with no QA; Normal replacement defaults to approval +14 days; Cancel retains Draft.
- Logging quality rule: include screen/state, trigger, placement, fields/actions, outcome, rationale, evidence/status and superseded decision. Never use a broad scope statement as proof that every detail is approved or built.
- Next: continue only the user's requested fix. No prototype edits, commit or push in this documentation update; no re-verification of full code/spec parity was performed.

## 2026-09-14 — Historical broad confirmation summary (superseded by correction above)

The assistant previously interpreted the request as full prototype confirmation. The user subsequently narrowed it; this historical summary must not be used as blanket approval. Use the detailed decision register and explicit per-item confirmations instead.

### Confirmed baseline

- One canonical `/prototype/accura/documents` route with retained mock data; no parallel legacy audit/demo routes.
- Unified revision listing, Documents/Create heading, responsive search/filter, separate Workflow and Use status, revision/category context, next action/assignee and owner. No due date or segmented listing tabs.
- Normal/External category, signed External submission without QA, signed Normal submission and approval/rejection, distinct revision identity/New version, Superseded, Obsolete and returned Draft context. Use `In QA Approval` and aligned types/departments.
- Detail heading/badges/metadata hierarchy; full-width stepper with assignees; 70/30 content/details-and-links layout; retained attachments; no duplicate module heading, demo-session copy, Controlled use or Approval route cards.
- Elevated persistent bottom task bar; neutral Automatic effective-date badge; QA override; separate Approved/Pending effective/Effective meanings.
- Shared signature modal and Audit Trail drawer, with signature/history events rather than persistent signature cards; preserve signature evidence and document/PDF metadata.
- Shared `RecordRowAction`: fitting table keeps inline ghost action at row end. Actual horizontal overflow enables white padded container + shadow/md sticky at the visible right edge, revealed by row hover/focus, accessible on touch. Ghost button styling is independent of container styling.
- Shared `ActionGroup`: equal token height, font and padding within a group (detail header verified at 40px/14px); text width follows content. Reuse components rather than replace base Table/Button or duplicate per module.

### Assumptions and limits retained

- Replacement approval immediately supersedes the previous approved revision; the new Normal revision defaults to approval +14 days with QA override. This interim rule may leave no effective revision during the gap.
- Author/Owner remain separate domain concepts, mapped to the same person in mock data. Prototype signatures/PDF behavior do not establish production integration or regulatory compliance.
- Confirmation covers reviewed implementation, not all older audit suggestions or automatic migration of other modules. Authoritative consolidated rules: `../Accura-design-system/docs/demo-design-contract.md`.

### Next actions

- Continue with the user's next requested fix. Preserve this baseline; no new changes, commit or push implied by logging.

## 2026-09-14 — Document business rules; UI pending review

- Confirmed all submission routes require signing, including Normal author submission and External acknowledgement; approval/rejection decisions also signed.
- Explicitly reopened External, revision/Superseded, Obsolete and returned Draft context.
- Interim assumption retained: old approved revision becomes Superseded on new approval; new Normal revision defaults to approval +14 days with QA override. External has no Reviewer/QA gate.
- Revision identities and signature history must remain separate; rejection invalidates prior approval/submission signatures without deleting evidence. Draft upload replacement retains previous upload history.
- Author/Owner mock mapping is the same person, not a universal domain equivalence.
- Next: user tests prototype; do not log new UX/layout as confirmed yet.

## 2026-09-14 — Document prototype confirmed: bottom actions and use status

- User reviewed the prototype and authorized recording the latest changes. Canonical route remains `/prototype/accura/documents`.
- Current task is a persistent bottom action bar within the content area, outside the document scroll container; it must not cover sidebar or final content. This supersedes the earlier placement below Document links.
- Use existing Accura Button/Checkbox/Input controls, surface/overlay with its paired foreground, border/default top edge and shadow/lg upward elevation. QA date/override context is on the left, signing CTA on the right; Draft has Cancel, Save as Draft and Submit for Review. Review has Sign review. Approved has no task bar. Signing still opens the signature modal.
- Pending effective is a derived Use status UI label, NOT an extra workflow state explicitly named by the specification. QA approval sets Workflow to Approved. If the effective date is still future, Use status is Pending effective; once the date is reached it is Effective, without another signing step. Before approval, use status is Not effective.
- Source rule: Functional Specification page 3 sets the normal-document effective date to approval +14 days, with QA override. The prototype evaluates date availability on render; a production scheduler/timezone policy is not implemented or newly agreed.
- Keep pre-approved attachments (maximum five, outside the main document review workflow), as confirmed by the user.
- Horizontal Document stepper uses narrower first/last step tracks so the sequence fills more of the card width. Keep assignees, semantic states and the vertical mobile variant.
- Existing 70/30 information layout and unified Audit Trail remain unchanged. No new routes or alternate workflows authorized.

## 2026-09-14 — Document 70/30 information layout

- Moved Document details and Document links to the top of the right 30% rail, in that order. File preview and attachments remain left (70%).
- Removed Controlled use and Approval route cards. Draft reviewer/QA selectors are retained inside Document details; pending task actions stay below links.
- Narrow-rail fields stack vertically for readability. Shared RecordDetailLayout supports an explicit 70/30 option; other modules retain their default layout.

## 2026-09-14 — Unified signature and activity audit trail

- User requested signatures as audit logs instead of a separate detail card to avoid long, fragmented information sections.
- Document now combines existing signature receipts and activity in one newest-first Audit Trail; matched signing/activity events appear once, with signer/role, UTC timestamp including seconds, signature meaning, record/revision and status transition.
- Removed the persistent Signatures card only. Signature storage, signing workflow and approved PDF signature pages are unchanged.
- Added shared `RecordAuditDrawer` / `RecordAuditEvent` in `accura-ui/src/components/record-audit-drawer.tsx`. Future modules reuse it through their own data adapters; existing CAPA/Training implementations were not changed in this task.
- Updated demo-design-contract.md as the shared rule: no separate Signatures/Activity history cards; no fabricated verification hashes or badges.

## 2026-09-14 — Document detail hierarchy and audit drawer

- Removed redundant module heading/create CTA and demo-session copy on detail/create pages only; listing unchanged.
- Placed workflow/use badges beside the left-aligned record title, with ID/revision/type metadata underneath.
- Kept the stepper and assignees without the Workflow heading/waiting subtitle.
- Reformatted information cards with divided headers and responsive label/value grids, following CAPA Details. Draft fields remain editable.
- Automatic effective-date badge is neutral gray, followed by “: Approval Date plus 14 Days”.
- Replaced the Activity card with a right-side Audit Trail Sheet, opened beside the record heading. No business-flow changes.

## 2026-09-14 — Consolidated Document prototype

- User requested removal of old Document prototypes and promotion of the refined `documents-demo` to `/prototype/accura/documents`.
- Only `Accura-design-system/accura-ui/src/app/prototype/accura/documents` remains active. All future Document development belongs here; do not recreate parallel prototype routes.
- Removed the original documents implementation and documents-audit, documents-new, documents-draft-new from the source tree. Former documents-demo route no longer exists; no legacy redirects.
- Made seed data self-contained before removing the old dependency. Sidebar now links to the canonical documents route.
- Kept localStorage key `accura-documents-demo-v1` and IndexedDB unchanged to retain existing demo records, signatures and attachments on the same browser/origin.
- Old implementation folders are recoverable temporarily at `/private/tmp/accura-removed-document-prototypes-UCXxRV`, outside the repository and app routes. Other modules and shared components were preserved.

## 2026-09-12 — Happy-path demo scope locked

- User confirmed one happy path per module; design only its screens/statuses. Questions about rejection, wrong actions, and exceptions are deferred to Post-Demo Backlog without further analysis.
- Prioritize three reusable masters: phase-gate stepper with current assignee, electronic-signature modal, and 65/35 detail layout with audit rail.
- Shared shell: notification/account in global header, module heading with create CTA, desktop toolbar at 70–80% of its containing column, record-name navigation and consistent menu/hover behavior.
- Recorded the reusable master specification in `../Accura-design-system/docs/demo-design-contract.md`; linked it from workspace and repo AGENTS.md so future agents see the scope before older audits.
- Documentation/specification updated. This entry does not claim new code or Figma masters were built.

## 2026-08-31 - Initial Accura Discovery Setup

### Learned

- Accura is a modern eQMS for growing regulated life-science organizations, especially startups and SMEs moving away from paper, spreadsheets, SharePoint, or local document storage.
- The product promise is "quality management, made simple": fast implementation, compliance by design, simple by default, modular/scalable, and accessible without enterprise complexity.
- Initial demo scope focuses on five core modules: Document Control, Deviations, Change Control, CAPA, and Training & Assessment.
- Risk Management, Audit Management, and Supplier Quality are deferred until after the initial demo.
- CAPA is the first UX focus because it is currently the clearest workflow and can establish reusable patterns for other modules.
- The client wants designer input on consistent progress/status display, audit trail display, electronic signature experience, field grouping, and cross-module pattern consistency.
- Core compliance expectations include audit trail, electronic signature / non-repudiation, access control, traceability, long retention, and possible data residency constraints.
- Generative AI is intentionally avoided in core workflows due to compliance risk, data residency, variable outputs, and token cost risk.
- Internal target appears to be backend/data readiness around 2026-09-09 to 2026-09-10 and a demo on 2026-09-14.

### Blind Spots

- Whether CAPA MVP includes explicit Root Cause Analysis and Verification of Effectiveness stages. User confirmed this needs verification before finalizing CAPA UX.
- Canonical CAPA and cross-module status/state model.
- Permission matrix across QA, CAPA owner, action owner, admin, document creator, approver, and consultant.
- Exact launch compliance markets and standards.
- Dashboard priorities and demo story.
- Document Control requirements, especially already-approved document upload and PDF-only constraints.

### Next Actions

- Confirm whether CAPA should be modeled around the full lifecycle: intake, containment/risk, root cause analysis, action plan, implementation, verification of effectiveness, and closure.
- Use CAPA as the first reusable design-system workflow pattern.
- Prepare a compact CAPA flow map or UX critique only after the CAPA lifecycle question is answered.
- Keep Document Control notes in backlog until requirements stabilize.

## 2026-09-10 - Document Listing UX And Domain Audit

### Learned

- The listing currently behaves as a small mixed-state repository with metadata search and a workflow-status filter.
- It combines three conflicting user jobs: finding effective instructions, completing assigned approval work, and auditing the complete document repository.
- SOP-003 shows that Author is not the active assignee; SOP-004 shows that Draft hides a QA return/rejection.
- Approval, effectiveness, current revision, and attention/urgency need separate domain concepts.
- The listing has no next-action owner, SLA/overdue, periodic-review, or explicit current-version signal.
- Sorting icons are non-functional and pagination is displayed for a single page.

### Blind Spots

- Role-based visibility of draft/review documents.
- Canonical workflow and lifecycle states, including scheduled effectiveness and supersession.
- Row identity across document families and revisions.
- Document owner versus author versus active assignee.
- Approval SLA, periodic review, escalation, and training-release rules.
- Exact launch market and regulated product scope.

### Next Actions

- Review and approve `document-listing-ux-domain-audit-2026-09-10.md` before any implementation.
- Run a business-rule workshop covering visibility, lifecycle, versioning, ownership, rejection, and due dates.
- Decide whether the first landing experience prioritizes Effective Documents, My Work, or All Records by role.
- Do not change prototype flow/backend/API until the user approves the report direction.

## 2026-09-10 - Audit Prototype UI/UX Comparison

### Learned

- The audit listing changes the screen from a passive metadata repository into a more decision-oriented operational list.
- Separating `Workflow` from `Use status` is the most important improvement because approval progress and permission to use a document answer different user questions.
- `Next action` and its assignee are more operationally useful than showing only the historical author.
- Replacing Author with Document owner improves accountability, but the data model currently mixes people and teams and still needs confirmation.
- Explicit `Current revision` improves version awareness, but this label may be misleading on non-effective records; `Latest revision` may be safer until the row model is confirmed.
- Global notification and account context create a reusable cross-module shell and make record-related activity visible without consuming listing space.
- Removing unsupported due-date content improves demo credibility, although it leaves workflow urgency unresolved.

### Blind Spots

- The single All Records listing still mixes controlled-document retrieval with approval work and QA oversight.
- Standard users may still see non-effective records without a sufficiently strong safe-use boundary.
- Row open behavior, truncation, responsive behavior, empty/error/loading states, and filter persistence are not demonstrated by the static design.
- Pagination is only an improvement if the total and controls are backed by real data and behavior.

### Next Actions

- Preserve the split between workflow and controlled-use state.
- Rename or validate `Current revision` against the agreed document-family/revision model.
- Confirm whether owner may be a person, team, or both, and display the entity type consistently.
- Validate the listing with three role scenarios before adding role-aware views: employee finding an SOP, reviewer finding assigned work, and QA locating an exception.

## 2026-09-11 - Returned Draft Screen UI/UX Audit

### Learned

- SOP-004 is not an ordinary new draft; it is revision v2.0 returned by QA after entering the approval workflow.
- User confirmed that rejection transitions the document back to the canonical `Draft` state. `Returned by QA` should therefore be presented as context/attention metadata, not as a separate canonical workflow state.
- The persistent rejection banner communicates who rejected the record, when, and why, but the rest of the screen still uses a generic edit-form mental model.
- The requested correction concerns document content and a reference, while the wireframe shows no uploaded document or direct way to replace/edit it.
- Required Document Type and Department appear empty even though the record already contains SOP and Manufacturing; submission appears available despite these blockers.
- `Resubmit for Review` is clearer than `Submit for Review` because it preserves the record's history while the document remains in Draft. Whether the approval chain restarts remains to be confirmed.

### Blind Spots

- Whether QA rejection returns the revision to the full review chain or only to QA after correction.
- Whether changing document content invalidates prior reviewer signatures.
- Whether the document is edited in Accura or externally and uploaded as a replacement file.
- Which metadata and approvers remain editable after the approval workflow has started.

### Next Actions

- Reframe the screen around “resolve QA feedback and resubmit,” while retaining the editable Draft state.
- Show revision, workflow state, file identity, requested changes, and submission blockers prominently.
- Replace ambiguous or visually editable locked controls with explicit read-only values.
- Confirm resubmission routing, signature invalidation, and file-versioning rules with PO, QA consultant, and Dev before implementing advanced resolution tracking.

## 2026-09-11 - Document State Machine Scan

### Learned

- The diagram defines four main statuses: Draft, In Review, In Approval, and Approved.
- Rejection by either Reviewer or QA returns the document to Draft and assigns it back to the creator. Reviewer rejection explicitly requires a reason; the QA rejection path does not visibly connect through that step even though the current wireframe includes a QA reason.
- The only path out of Draft re-enters In Review, so a rejected document is shown as restarting the review path when resubmitted.
- Approval triggers system conversion to read-only PDF; an earlier approved version is then marked Superseded.
- Normal users see/download only the latest version, while additional role permission exposes previous versions and history.

### Blind Spots

- The diagram itself leaves draft-file handling unresolved: replace the previous draft upload or create a new draft/version.
- It does not define whether prior review signatures are invalidated, how multiple reviewers aggregate, or whether approval equals effectiveness.
- The QA rejection-reason requirement is visually ambiguous in the diagram and should be made explicit.
- Cancel behavior and retention/audit behavior for cancelled drafts are not defined.

### Next Actions

- Treat Draft as the canonical state and rejection as transition/attention context in listing and detail UI.
- Revisit the audit listing's `Returned` workflow badge; it should be Draft plus a `Needs revision` or `Returned by QA` indicator.
- Confirm file replacement/versioning, signature invalidation, effectiveness, and cancellation rules before finalizing detail-screen actions.

## 2026-09-11 - Document Workflow Rules Confirmed

### Learned

- Approved and Effective are separate: QA sets the Effective Date, and an approved document may remain not effective until the date arrives.
- A corrected DOCX replaces the active draft file while the previous draft is preserved as a historical record/log.
- Rejection invalidates the signatures and approval validity attached to the rejected submission/version.
- Document MVP has one Reviewer only.
- Cancel saves/preserves the Draft and keeps it visible on the listing page.

### UX Implications

- Listing and detail screens must show workflow state separately from use/effectiveness state.
- Approved records need a scheduled-not-effective presentation before the Effective Date, followed by Effective when the date is reached.
- Draft replacement needs a visible active-file state plus access to historical draft uploads through history/audit UI.
- Returned Draft UI must not display prior signatures as valid; it should communicate that review must be performed again.
- Cancel should use exit/save language that does not imply deletion or rollback.

### Remaining Blind Spots

- Effective Date timezone and the exact system event that changes use status to Effective.
- Whether an Effective Date may be changed after approval and what reapproval that requires.
- Whether QA rejection uses the same mandatory reason-capture rule as Reviewer rejection.
