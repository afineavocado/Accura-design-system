# Document functional specification mapping

Updated 2026-09-14. Source: `accura-discovery/Documents Module Functional Specification.pdf` (six pages). Scope remains the Normal Document happy path in `docs/demo-design-contract.md`; this is not full production implementation.

| Specification | Prototype behavior |
| --- | --- |
| Normal Document approval | Draft → In Review → In Approval (QA) → Approved; one selectable reviewer and one selectable QA approver. |
| Effective date | Defaults to approval timestamp + 14 calendar days. QA can override before signing. Approved and Effective remain separate indicators. |
| Office source | Accepts DOC/DOCX, XLS/XLSX, PPT/PPTX. Original bytes retained in browser IndexedDB and downloadable. No file replacement after submission. |
| Conversion at submission | Changes from draft source preview to a simulated review PDF at submission. Actual Office conversion is not connected. |
| Approved document | PDF fixture gains header/footer, first metadata page, and final approval record. Paginated HTML preview is explicitly simulated. |
| Download stamping | Stamp is generated only in the downloaded PDF fixture, not the inline preview. |
| Document relationships | Separate editable related review documents and reference documents in Draft; linked records afterward. |
| Supporting attachments | Up to five pre-approved attachments stored locally; accessible after submission and excluded from the approval workflow. |

## Shared interface

Reuses Accura primitives, semantic tokens, shared workflow/signature components, global notification/account header, and the 65/35 responsive detail layout. Existing non-demo prototypes are not replaced.

## Verification

- Browser walkthrough: create, select Priya Nair / Emily Zhang, link CAPA document, attach a test file, submit, sign review, sign QA, refresh.
- Approval on September 14 produced September 28 as the default effective date. Reviewer and QA names persisted into signatures and audit activity.
- Approved preview: metadata, content, approval record pages verified; desktop and 390px mobile inspected.
- ESLint, TypeScript, and whitespace checks passed. Pure-function smoke checks passed for date rollover, PDF page counts, and download-only stamping.

## Explicit limitations

Office rendering/conversion, production electronic signatures, server-side audit persistence, and print integration are not implemented. Sample original download is a Word-readable RTF `.doc`, not a generated DOCX. Uploaded file bytes are local to this browser; the preview/PDF uses fixture content, not converted upload contents.

External/Pre-approved intake, multiple reviewers, new revision/superseding, Obsolete, rejection and exception flows remain Post-Demo Backlog. They are not silently added to the agreed demo path.
