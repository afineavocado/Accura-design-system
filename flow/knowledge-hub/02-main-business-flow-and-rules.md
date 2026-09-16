# Knowledge Hub — main business flow and business rules

## 1. Scope and confidence

This document models the expected business behavior behind the supplied screens. Items marked **[Assumption]** are inferred and must be confirmed with Product, Quality, Legal, and Engineering before implementation.

The current UI visibly supports browsing folders and seeing a file row. Amit's brief adds the intended business purpose: provide basic templates and documents, initially as placeholders, and make document templates free to platform users.

## 2. Domain framing

The domain is not simply “file storage.” It is a knowledge-access and document-governance problem in a quality and laboratory software context. Users may need to answer four questions quickly:

1. **Relevance:** Is this resource for my standard, role, workflow, or module?
2. **Currency:** Is it current, reviewed, effective, or superseded?
3. **Authority:** Is it an Accura template, an external reference, or a controlled customer document?
4. **Action:** Can I preview, download, copy, adapt, or use it as evidence?

The business flow should preserve those distinctions even if the first release keeps the visual interaction simple.

## 3. Main user flow — discover and use a resource

### Primary actor

Platform user looking for a reusable template, guide, standard-related reference, or software documentation.

### Happy path

1. User selects `Knowledge Hub` from the persistent navigation.
2. System loads the root Knowledge Hub index.
3. System displays available folders, currently including `Accura Software`, `GMP PICS`, `ISO 13485`, `ISO 15189`, `ISO 17025`, `ISO 9001`, and `User Guides`.
4. User selects a folder.
5. System loads the folder contents and displays its title plus resource rows.
6. User selects a resource, such as `sample.md`.
7. System presents the resource through the supported action: preview, open, or download. **[Assumption — the screenshots do not show this state.]**
8. User reads or downloads the resource and returns to the folder or hub.

### Alternate and exception paths

- **Empty folder:** Show a clear empty state, explain whether content is coming soon, and provide a route back to folders. **[Assumption]**
- **Resource unavailable:** Show an error with retry and a safe return path; do not leave the user on a blank page. **[Assumption]**
- **Restricted resource:** Explain that access is restricted and identify the next action, such as request access or contact an administrator. **[Assumption]**
- **Superseded resource:** Keep the resource discoverable only if policy permits, show its superseded status, and direct the user to the current version. **[Assumption]**
- **Unsupported format:** Show the file type and offer download if preview is unavailable. **[Assumption]**
- **Back navigation:** `Back to folders` returns to the folder index; browser back should not lose the user's place. **[Assumption]**

## 4. Recommended content information architecture

The screenshot shows a standard-centric folder structure. It is a reasonable starting point for expert users, but the content should also support intent-based discovery.

### Proposed top-level classification

1. **Start here** — orientation, how to use the hub, glossary, and recommended resources.
2. **Templates & checklists** — reusable Accura-owned assets.
3. **Standards & regulatory references** — ISO, GMP PICS, and related materials, with jurisdiction and version metadata.
4. **User Guides** — how to use Accura Software and its modules.
5. **Examples & learning resources** — illustrative, non-controlled examples and training material.

### Proposed secondary dimensions

- Standard or framework: ISO 9001, ISO 13485, ISO 15189, ISO 17025, GMP PICS, or other.
- Quality activity: document control, deviations, CAPA, change management, training, audit, risk, or reporting.
- Resource type: template, guide, checklist, example, reference, regulation, or software documentation.
- User role: quality manager, laboratory manager, auditor, trainer, document owner, or general user. **[Assumption]**
- Lifecycle status: draft, published, under review, superseded, or archived. **[Assumption]**

This allows the same resource to be found by both “I need ISO 17025 material” and “I need a CAPA template.”

## 5. Business rules

### Access and commercial intent

- **BR-001 — Free template intent:** Accura-owned document templates intended for the Knowledge Hub are available at no charge to eligible platform users. **[Brief]**
- **BR-002 — Define “anyone”:** “Anyone on the platform” should mean a clearly defined access population—e.g. every authenticated platform user, every tenant user, or the public internet. The current material does not decide this. **[Open question]**
- **BR-003 — Access must be explicit:** Every folder and resource must have an access scope, even if the first version defaults to platform-wide access. **[Assumption]**
- **BR-004 — No accidental tenant leakage:** Customer-specific or controlled documents must never appear in the platform-wide Knowledge Hub unless explicitly published with the correct scope. **[Assumption]**
- **BR-005 — License is separate from price:** Free access does not automatically mean permission to redistribute, modify, claim authorship, or use external standards outside their license. External references need source attribution and license handling. **[Domain recommendation]**

### Content governance

- **BR-006 — Placeholder labeling:** Placeholder resources must be visibly labeled as placeholders or examples and must not look like approved operational documents. **[Assumption]**
- **BR-007 — Ownership:** Each published resource must have an accountable owner or maintainer. **[Assumption]**
- **BR-008 — Reviewability:** Standards, regulatory, and quality guidance resources must have a review date or review cadence. **[Domain recommendation]**
- **BR-009 — Version clarity:** A resource that changes materially must receive a new version/revision and retain enough history to explain what changed. **[Assumption]**
- **BR-010 — Superseded content:** A superseded resource should not silently replace the current resource. Its status and successor should be visible where policy allows. **[Domain recommendation]**
- **BR-011 — Effective-date semantics:** Any displayed date must be labeled as `Published`, `Last updated`, `Effective`, or `Reviewed`; an unlabeled date is insufficient for controlled knowledge. **[Domain recommendation]**
- **BR-012 — Approval boundary:** Knowledge Hub resources are not automatically part of a customer's controlled QMS just because they are downloaded. The product should distinguish reference/download from adoption/approval into Documents. **[Assumption]**

### Interaction and retrieval

- **BR-013 — Folder semantics:** A folder is a navigational collection, not a substitute for resource classification. Resources should carry their own type, topic, standard, and lifecycle metadata. **[Domain recommendation]**
- **BR-014 — Resource action:** Each resource should expose a clear primary action—preview/open or download—and any secondary actions should be discoverable and permission-aware. **[Assumption]**
- **BR-015 — Empty states:** A folder with no published resources must explain why it is empty; an empty screen without context is not a valid business state. **[Assumption]**
- **BR-016 — Searchability:** As the library grows, users should be able to search by title, file name, standard, resource type, topic, and related module. **[Assumption]**
- **BR-017 — Traceability:** Publish, update, supersede, archive, download, and permission changes should be auditable events. **[Domain recommendation]**
- **BR-018 — Notification meaning:** The visible notification badge `10` must not be used to imply Knowledge Hub changes unless its event model is defined. **[Open question]**

## 6. Content owner / administrator flow [Assumption]

1. Content owner creates or selects a folder.
2. Content owner uploads or links a resource.
3. System requires minimum metadata: title, resource type, source/owner, access scope, lifecycle status, and date semantics.
4. If the content is external or standards-related, system requires attribution/license data and a review date.
5. Content owner submits the resource for review when it is governed content.
6. Authorized reviewer approves, rejects, or requests changes.
7. Approved content is published and appears in the appropriate folder/index.
8. Later updates create a new revision or supersede the existing resource according to policy.
9. Archive preserves audit history and prevents accidental use of obsolete material.

## 7. Validation questions before implementation

- Is Knowledge Hub access platform-wide, tenant-scoped, role-scoped, or a combination?
- Which resources are Accura-owned templates versus licensed external standards/reference materials?
- Is the intended action preview, download, “use as template,” or all three?
- What does the date in the current row represent?
- Can folders be nested, and who manages their order and naming?
- Are Knowledge Hub resources controlled documents, informational references, or both?
- What minimum metadata is required before a placeholder can become published content?
- What event should generate the notification badge?
- Is there a requirement to connect a Knowledge Hub resource into Documents, Training, CAPA, Deviations, or Change Management?
