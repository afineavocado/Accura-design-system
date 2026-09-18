# Documents — module spec

**As-built**, read from the code on 2026-09-17. Chi built this module; it was integrated on
2026-09-14 and realigned to the house patterns the same week. The discovery material it was built
from — a functional specification PDF, product knowledge, a session log and a post-demo backlog —
lived in `flow/documents-discovery/` and was **removed on 2026-09-17** once this file existed; it is
recoverable from git history. Three further documents sat beside the code and overlapped this one —
`README.md`, `FUNCTIONAL-SPEC-MAPPING.md` and `TRAINING-MAPPING.md`. They were **folded in here and
deleted on 2026-09-18** (§6.7); what they carried that this file did not now lives in §4 and §7. A
short stub remains in the code folder pointing here.

Files — `accura-ui/src/app/prototype/accura/documents/` (2,639 lines):

| File | Lines | What |
|---|---|---|
| `document-detail.tsx` | 944 | the detail page, every state |
| `mock-data.ts` | 536 | seeds, vocabularies, and all the derived logic |
| `document-files.tsx` | 533 | file upload, preview, version history |
| `page.tsx` | 313 | the registry |
| `store.ts` | 112 | `localStorage`-backed store |
| `components.tsx` · `file-storage.ts` · `layout.tsx` · `[id]/page.tsx` | 201 | shared bits and routing |

---

## 1. Shape — two statuses at once

This is the module's defining idea, and the one to understand before reading a screen: a document
carries a **workflow status** and a **use status**, and they answer different questions.

**Workflow status** — where the revision is in its approval: `Draft` → `In Review` →
`In QA Approval` → `Approved`.

**Use status** — whether the document may be used, derived by `getUseStatus()`, never stored:

| Use status | Badge | When |
|---|---|---|
| `Not effective` | secondary | approved but the effective date has not arrived |
| `Pending effective` | blue | approved, effective date in the future |
| `Effective` | success | approved and in force |
| `Superseded` | secondary, struck through | a newer revision took over |
| `Obsolete` | destructive | withdrawn |
| `External record` | secondary | category is Pre-approved / External |

Two further axes sit beside the statuses: **`category`** (`Normal` or `Pre-approved / External` —
external skips review) and **`lifecycle`** (`Current`, `Superseded`, `Obsolete`).

`nextAction(doc)` derives what the reader should do, and the order of its checks is the business
rule in miniature: retired documents offer *View history*; a returned draft offers *Revise and
resubmit*; an external draft offers *Sign and submit*; otherwise it maps the workflow status.

---

## 2. Data model — `mock-data.ts`

```
DemoDocument  id · name · type · department · revision · status · file · sample
              effectiveDate · signatures[] · activity[] · content
              relatedDocuments[] · referredDocuments[]
              category? · lifecycle? · author? · owner?
              previousRevision? · supersededBy?
              obsolete? { reason · name · timestamp }
              returned?  { reason · name · timestamp · fromStatus }
              uploadHistory? [{ file · sourceKey · sample · timestamp }]
```

**6 seeds** covering `Draft`, `In Review`, `In QA Approval`, `Approved`, plus 4 `contextSeeds` for
revision history. Timestamps are ISO 8601 UTC. `displayDate` and `displayTime` are the module's
formatters — since 2026-09-17 both render the house format.

**Persistence:** `store.ts` writes to `localStorage` under the key **`accura-documents-demo-v1`**,
so created documents and signatures survive a reload. `file-storage.ts` keeps uploaded file bytes in
**IndexedDB**, separately and on the same origin — which is why demo records survived the
`documents-demo` → `documents` migration on 2026-09-14 instead of needing reseeding. Deviations chose the opposite —
in-memory, resets on reload — and both choices are deliberate.

---

## 3. Screens

**Registry** — search, filters, `ListSummary`, `TablePagination`, clickable rows, `RecordRowAction`
in the last column. It separates the two statuses into their own columns; a superseded document
stays reachable, its badge struck through and muted.

**Detail** — 70/30 `RecordDetailLayout`. Left: the document, its file and its content. Right rail:
details and links. A persistent elevated task bar carries the action. Signatures and history live
in the **shared `RecordAuditDrawer`**, not in permanent cards on the page.

**Files** — upload, preview, and version history, including the uploaded-file record and sample
documents.

**Signing** — the shared `ElectronicSignatureModal`, with the module's own record label. Documents
was the first consumer; the props that let other modules re-use it (`description`, `reasonLabel`,
`recordLabel`, `attestationSubject`) were extracted from its hardcoded copy on 2026-09-16.

---

## 4. Confirmed rules

From `docs/demo-scope.md`, confirmed 2026-09-12 and refined against the functional specification on
2026-09-14. That file was folded into this one and deleted on 2026-09-17; these are its Document
rules, unchanged.

- **Effective date defaults to approval + 14 days**, QA may override during final review. *Approved*
  and *Effective* stay separate states.
- **Conversion to PDF happens on submission**, not on approval. Approval adds the header/footer and
  the first/last metadata pages; download stamping happens only at download.
- **Review and QA users may download the original but cannot replace it.**
- **Pre-approved attachments: maximum five**, separate from workflow-controlled content.
- **One reviewer and one QA approver** per draft for this demo, plus related review documents and
  reference documents.
- `Pending effective` is a **derived** label, not a workflow gate and not a status the specification
  supplies. Approved + future effective date = Pending effective; Approved + reached = Effective;
  before approval = Not effective. No extra signature or release action exists.
- **Layout:** 70/30 desktop columns; the right column starts with Document details, then Document
  links. The current task lives in a persistent bottom action bar, not the side rail — outside the
  scroll container but inside the content column. File preview and attachments stay in the left
  column. Approved hides the task bar.
- **Audit Trail is the single history surface** for signatures, status changes and record events.
  No persistent Signatures or Activity cards on the detail page.
- **The old prototypes are gone for good.** `documents-demo`, `documents-audit`, `documents-new` and
  `documents-draft-new` were removed at the owner's request; do not recreate those routes.

### 4.1 Where Documents deliberately differs from the house patterns

From `TRAINING-MAPPING.md`, written during the 2026-09-12 integration and **corrected against the
code on 2026-09-18** — two of its five claims had gone stale, which is why it is restated here
rather than pointed at.

- **The module title and the Create CTA live in page content**, not the global header. This was the
  owner's explicit instruction. Training's header was not rewritten to match.
- **One listing, no segmented views.** Training splits into Users, Roles, Courses, Assessments and
  Review because it has five entities; Documents has one.
- **The desktop toolbar is constrained to 75–80% width and wraps** rather than stretching across
  the full table.
- **The domain rules are not Training's.** `Draft` → `In Review` → `In QA Approval` → `Approved`,
  Approved is not Effective, QA sets the effective date. No due dates, scores or assessments.

Two claims from that file are **retracted**:

- ~~"Documents retains the agreed 65:35 detail layout."~~ It renders **70/30** —
  `document-detail.tsx` passes `ratio="70/30"` to `RecordDetailLayout`, whose own default is 65/35.
  The 65:35 figure was repeated in three documents and was wrong in all three.
- ~~"Training relies on the Card primitive's 16px default; Documents keeps an explicit 24px."~~
  Written before the September spacing passes. Do not act on it without measuring both.

## 5. Deferred — not built, by decision

Scope was locked to one happy path per module on 2026-09-12. These are retained for later and must
not block or expand it; reopen only when asked.

- Rejection and resubmission screens, rejection reason capture, invalidated-signature presentation
- Pre-approved / External intake with acknowledgement signature and no review route
- New-version creation and supersession; Obsolete and comment workflows
- Replaced draft DOCX history, version comparison, historical-record navigation
- Effective-date boundaries, changes after approval, and supersession timing when a newly approved
  revision is not yet effective
- User mistakes, failed authentication, recovery paths, exceptional permissions
- Role-specific listing views, advanced filters, SLA/due dates, escalation
- Multi-reviewer workflows — excluded from the one-reviewer MVP
- Production Office conversion, approved-PDF templates, print pipeline, download stamping. The
  prototype's fixtures illustrate timing only; they are not compliance controls.

---

## 6. Questions

**6.1 The functional specification is a PDF, and nothing checks the prototype against it.**
Still true. The hand trace now lives in §7 of this file rather than beside the code, and the PDF it
traces is only in git history (6.6) — so the trace cannot be re-derived, only trusted. The spec
sections it does not cover (pre-approved / external intake, new-version creation and supersession,
obsolete and comment workflows) are deferred in §5 under the happy-path lock. `post-demo-backlog.md`
no longer exists; §5 is where that list went.

**6.2 Supersession timing is an interim assumption.** Approving a Normal replacement supersedes the
previous revision **immediately**, while the new effectiveness defaults to approval + 14 days. The
handoff notes say plainly that this can leave **no effective revision** during the gap. Real rule?

**6.3 Six seeds cover four of the six use statuses.** `Superseded` and `Obsolete` exist as
`contextSeeds` and in derived state, but no seed sits in `Not effective` or `External record` as its
primary display state, so those badges are hard to review.

**6.4 The sortable table header renders `font-semibold` (600)** where every other listing renders
500 — flagged during the 2026-09-14 integration and never resolved, because it is Chi's module.

**6.5 Two statuses on one record is the module's best idea and its least documented one.** Nothing
outside the code explains that `getUseStatus()` is derived, which is exactly the kind of rule that
gets re-implemented differently in a second module.

**6.7 ~~Three documents beside the code overlap this one.~~ — ANSWERED 2026-09-18: fold in.**
`documents/README.md`, `FUNCTIONAL-SPEC-MAPPING.md` and `TRAINING-MAPPING.md` were merged into this
file and deleted. What moved: the functional-spec trace → §7, the `localStorage` key and the
IndexedDB file store → §2, the deliberate divergences from Training → §4.1. What was dropped: two
verification logs dated 2026-09-12 and 2026-09-14, the happy-path walkthrough (§3), and the
`documents-demo` promotion history (§4).

Deleting them mattered more than keeping them, because **three of their facts had gone stale** —
all three stated a 65:35 detail layout against a 70/30 implementation, and all three pointed at
`docs/demo-design-contract.md`, which does not exist. A stale file that reads as current is worse
than no file. `documents/README.md` survives as a three-line stub pointing here, so Chi's agent
still finds its bearings on opening the folder.

**6.6 The client's functional specification was a PDF and is now only in git history.** It was
deleted with the rest of `flow/documents-discovery/` when this file replaced it. If the PDF is still
the contract, it should come back as a source document rather than be reconstructed from this
summary: `git show HEAD~1:"flow/documents-discovery/Documents Module Functional Specification.pdf"`.

---

## 7. Functional specification — hand traced

From `FUNCTIONAL-SPEC-MAPPING.md`, folded in on 2026-09-18. Source: *Documents Module Functional
Specification*, six pages, supplied as a PDF and last mapped on 2026-09-14.

⚠️ **This table is the only surviving trace of that PDF.** The file was deleted with the rest of
`flow/documents-discovery/` and exists only in git history (6.6). Nothing checks the trace, and it
cannot be re-derived from this repository — treat a disagreement between this table and the code as
an open question, not as licence to change either one.

| Specification | What the prototype does |
|---|---|
| Normal Document approval | `Draft` → `In Review` → `In QA Approval` → `Approved`; one selectable reviewer and one selectable QA approver |
| Effective date | Defaults to the approval timestamp + 14 calendar days. QA may override before signing. `Approved` and `Effective` stay separate indicators |
| Office source | Accepts DOC/DOCX, XLS/XLSX, PPT/PPTX. Original bytes retained in IndexedDB and downloadable. The source cannot be replaced after submission |
| Conversion at submission | The draft source preview becomes a simulated review PDF at submission. Real Office conversion is not connected |
| Approved document | The PDF fixture gains a header and footer, a first metadata page, and the final approval record. The paginated HTML preview is explicitly simulated |
| Download stamping | The stamp is generated only in the downloaded PDF, never in the inline preview |
| Document relationships | Related review documents and reference documents are editable in `Draft`, and become linked records afterwards |
| Supporting attachments | Maximum five pre-approved attachments, stored locally, reachable after submission and outside the approval workflow |

### What is explicitly not implemented

Office rendering and conversion, production electronic signatures, server-side audit persistence,
and any print integration. The sample original is a Word-readable RTF with a `.doc` extension, not a
generated DOCX. Uploaded bytes stay in the browser; the preview and PDF use fixture content rather
than the converted upload.

**None of this is a compliance control.** The signature confirmation is not real authentication, not
a binding signature, and not a claim of 21 CFR Part 11. No passwords are collected. Identity
verification, immutable record linkage, protected audit storage and validation all belong to the
production integration.

### Verified 2026-09-14

Create → select reviewer and QA approver → link a CAPA document → attach a file → submit → sign
review → sign QA → refresh. Approving on 14 September produced 28 September as the default effective
date, and both names persisted into the signatures and the audit trail. The approved preview's
metadata, content and approval-record pages were checked on desktop and at 390px.

Recorded as history. It has not been re-run since, and the module has changed since — the shared
signature modal's props were extracted on 2026-09-16 and the date formatters were unified on
2026-09-17.
