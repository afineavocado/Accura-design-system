# Document happy-path prototype

Route: http://localhost:3001/prototype/accura/documents

Training alignment: see [TRAINING-MAPPING.md](./TRAINING-MAPPING.md) for the 2026-09-12 update against remote main `c6f7868`, shared patterns adopted, and deliberate domain differences.

This is the only active Document prototype, promoted from `documents-demo` on 2026-09-14 at the user's request. Develop only in this `documents` folder. Legacy routes were removed, not redirected.
Read the repository `docs/demo-scope.md` before expanding scope.

## Walkthrough

1. Create Document → Use sample Word file → enter a document name; choose reviewer/QA, links and optional pre-approved attachments (max 5).
2. Submit for Review. The demo account follows the selected person at each gate. PDF fixture appears at submission.
3. Sign review → type `demo` → confirm intent → Sign and approve.
4. QA checks the default Effective date (approval +14 days), optionally overrides it, then signs final approval with the same simulated confirmation.
5. Approved is read-only. A future effective date shows Pending effective; a reached date shows Effective.
6. Back to Documents shows the updated workflow, use status, and next action.

Save as Draft and Cancel both retain the draft in the listing. Browser-local state intentionally retains the key `accura-documents-demo-v1` and the existing IndexedDB file store so saved demo records, signatures, and file bytes survive migration on the same origin/browser.

## Shared masters

Signature and activity history now share `src/components/record-audit-drawer.tsx`. Do not add a separate Signatures/Activity detail card. Use a module-specific adapter to pass signer, role, timestamp, meaning, record/revision and status changes into one chronological drawer. Original signature receipts still feed the approved PDF.

`src/components/record-workflow.tsx` exports:

- PhaseGateStepper: configurable stages, current assignee, no gate-skipping navigation; horizontal desktop / vertical mobile.
- ElectronicSignatureModal: record + revision, signer/account/role, signature meaning, explicit intent, simulated authentication; emits a signature receipt.
- RecordDetailLayout: fractional desktop columns after a 24px token gap, stacked on narrow screens. Ratio per the prototype-build skill · Record masters (70/30).
- RecordSection: shared Card composition with heading and optional description.

Existing primitives / stories: Stepper (Feedback/Stepper), Dialog (Overlay/Dialog), Card (Layout/Card), Button, Badge, Input, Select, Checkbox, Table, Sidebar, Toaster. ApplicationHeader reuses the existing notification panel and account identity. There is no standalone Popover component in this checkout, so the row action composition uses installed Radix Popover with Accura Button and semantic surface/border/radius tokens.

The Card specification says 24px padding while the implementation defaults to 16px — a
design-system gap, logged for the Figma ↔ code pass. **Detail compositions use the 16px
default**, matching Training and CAPA; the explicit 24px overrides were removed on 2026-09-14. Card primary text uses `color/surface/overlay/foreground`; metadata uses `color/text/secondary`. Typography uses existing 20px page heading, 18px preview heading, 16px card title, 14px body, 12px metadata. Other component-owned spacing is preserved.

Listing is one all-record table. Desktop toolbar uses 75–80% width and wraps; record names and row Open document controls share the same detail destination. The standard TableRow hover is preserved. Workflow and Use status remain separate. No due date is introduced.

## Deliberate demo boundaries

- One selectable reviewer and one selectable QA approver, using a small list of existing demo people; no alternate routing flows.
- No rejection, exception, superseding, multi-reviewer or permission-management screens. These stay Post-Demo Backlog.
- Source and attachment bytes are retained in browser IndexedDB for download. No file is uploaded to a server, parsed, or converted. Sample Word is a Word-readable RTF fixture (.doc); PDF preview/download are explicitly labelled fixtures. Approved PDF has example metadata pages/header/footer; a timestamp stamp is generated on Download PDF only.
- Signature confirmation is not real authentication, a binding signature, or a claim of 21 CFR Part 11 compliance. No passwords are collected. Server-side identity verification, immutable record linkage, protected audit storage and validation belong to the production integration.
- Notification contents are a fixture, not a live notification service. Navigation now reuses the shared AppSidebar: Training and CAPA are linked; other unbuilt destinations retain the shared prototype placeholders.
- Seed records reuse existing project content; all participants use the same demo route for easy comparison. New references are empty, not fabricated links.

## Verification (2026-09-12)

- Targeted ESLint and TypeScript no-emit checks.
- Browser: create/sample → submit → reviewer signature → QA effective date + signature → Approved / Pending effective.
- Refresh retains status and both signature records.
- Search, row Open document menu, back navigation, and notification panel.
- Desktop detail and signature dialog; 390px mobile listing/detail with vertical stepper and no page-wide horizontal overflow (the table scrolls independently).

Use this scope and the repository demo contract for subsequent edits; do not reopen Post-Demo Backlog while polishing the happy path.
