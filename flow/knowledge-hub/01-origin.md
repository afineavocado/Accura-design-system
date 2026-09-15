# Knowledge Hub — origin, metadata & functional information

## 1. Provenance and scope

- **Artifact folder:** `flow/knowledge-hub` — renamed from `Knowledge Hub 2026-09-15 11-53` on 2026-09-15
- **Created at:** 2026-09-15 11:53 (+07:00, Asia/Ho_Chi_Minh)
- **Status:** working documentation reconstructed from the supplied screenshots and Amit's brief; not a confirmed product specification.
- **Primary visual sources:**
  - `/var/folders/sx/g9x_5vr5507bwrvx_733rgyw0000gn/T/codex-clipboard-f26e2e12-8116-4fa6-89dd-a81209580614.png` — Knowledge Hub folder index.
  - `/var/folders/sx/g9x_5vr5507bwrvx_733rgyw0000gn/T/codex-clipboard-9382dbf4-c9aa-4121-af3f-bed992a89f90.png` — contents of `Accura Software`.
- **Source brief:** Amit says that the modules are connected to the backend and that a Resource/Knowledge Hub has been added for basic templates and documents. The current resources are placeholders, with the intention that document templates will be free to anyone on the platform.

### Evidence labels

- **Observed:** directly visible in a screenshot.
- **Brief:** stated in Amit's update.
- **Assumption:** inferred to make the flow or domain model workable; must be validated.
- **Open question:** a decision or behavior not determined by the supplied material.

The brief is product context, not a set of detailed UI instructions. The screenshots are visual evidence, not a complete behavioral specification.

## 2. Product intent

Knowledge Hub is a shared reference-material area where platform users can browse folders and access reusable templates, guides, and domain documents. The visible design currently emphasizes simple folder navigation and low-friction access.

From a regulated-quality and laboratory perspective, the hub should eventually distinguish between:

1. **Accura-owned reusable assets** — templates, checklists, examples, and user guides.
2. **External reference material** — standards, regulations, or guidance that may have licensing, copyright, jurisdiction, and version-validity constraints.
3. **Controlled operational documents** — documents that are used as part of a customer's quality system and may require tenant-level permissions, approval, effective dates, and revision history.

This separation is a domain recommendation, not a claim that the current screenshots already implement it.

## 3. Screen inventory

### 3.1 Screen A — Knowledge Hub folder index

#### Global shell metadata — observed

| Element | Value / label | Type | Notes |
|---|---|---|---|
| Brand | `ACCURA` with shield mark | Brand identity | Persistent left navigation header. |
| Primary navigation | `Dashboard`, `Documents`, `Training`, `Deviations`, `CAPA`, `Change Management`, `Reports` | Navigation links | Other product modules are visible in the same shell. |
| Current navigation item | `Knowledge Hub` | Selected navigation item | Highlighted near the bottom of the navigation. |
| Secondary navigation | `Settings`, `Logout` | Navigation/action links | Persistent. |
| Page header | `Knowledge Hub` | Global page title | Shown in the top horizontal bar and again in page content. |
| Notification | Bell icon with badge `10` | Status/notification affordance | Meaning, read state, and destination are not visible. |
| Main heading | `Knowledge Hub` | H1 | Repeats the global title. |
| Supporting copy | `Shared reference material and guides. Select a folder to view its files.` | Introductory copy | Sets the basic interaction expectation. |

#### Folder collection — observed

| Display name | Object type | Visible treatment | Expected immediate purpose |
|---|---|---|---|
| `Accura Software` | Folder | Green outline folder icon in a rounded card | Open folder to see resources. |
| `GMP PICS` | Folder | Same | Open folder to see resources. |
| `ISO 13485` | Folder | Same | Open folder to see resources. |
| `ISO 15189` | Folder | Same | Open folder to see resources. |
| `ISO 17025` | Folder | Same | Open folder to see resources. |
| `ISO 9001` | Folder | Same | Open folder to see resources. |
| `User Guides` | Folder | Same | Open folder to see resources. |

#### Layout and presentation metadata — observed

- Folder cards are arranged in a three-column responsive-looking grid.
- Each card contains a folder icon and a folder name.
- The page has a large empty state/working area below the current set of folders; no additional explanatory panel is visible.
- No visible search field, filter, sort control, folder count, resource count, category label, or “recently added” section appears on this screen.

#### Functional information — observed or directly implied by copy

- Selecting a folder should navigate to that folder's file list.
- The screen represents a root-level folder index rather than a file list.
- The user can return to the module from the persistent navigation.

#### Functional information — not confirmed

- Whether a card is activated by clicking anywhere on the card or only on the folder name/icon.
- Whether folders can contain nested folders.
- Whether the grid order is curated, alphabetical, recently updated, or backend-defined.
- Whether the user can search across all folders.
- Whether folder access varies by account, organization, role, geography, or subscription.

### 3.2 Screen B — folder contents

#### Header and navigation metadata — observed

| Element | Value / label | Type | Notes |
|---|---|---|---|
| Back affordance | `‹  Back to folders` | Breadcrumb/back navigation | Returns toward the folder index. Exact history behavior is not confirmed. |
| Folder title | `Accura Software` | H1 | Identifies the selected folder. |
| File row | `sample.md` | Resource item | A placeholder Markdown file is visible. |
| Date | `Sep 13, 2026` | Resource metadata | The semantic meaning is not labeled; likely updated, published, or uploaded date. |
| Trailing affordance | Small neutral mark at the end of the row | Unknown | The screenshot does not make its action or icon semantics clear. |

#### Resource row metadata — observed

- A document/file icon precedes the file name.
- The resource is displayed as a single horizontal row inside a rounded bordered container.
- The file name is `sample.md`; it is explicitly placeholder-like.
- One date is shown on the right side.

#### Resource behavior — implied but unverified

- Selecting the file likely opens a preview, downloads it, or opens a resource detail view. This is an **assumption** and needs product confirmation.
- The trailing affordance may expose actions such as preview, download, copy link, or more options. This is an **open question**.

## 4. Copywriting register

| Location | Exact visible copy | Source status |
|---|---|---|
| Global/page title | `Knowledge Hub` | Observed |
| Page description | `Shared reference material and guides. Select a folder to view its files.` | Observed |
| Folder name | `Accura Software` | Observed |
| Folder name | `GMP PICS` | Observed |
| Folder name | `ISO 13485` | Observed |
| Folder name | `ISO 15189` | Observed |
| Folder name | `ISO 17025` | Observed |
| Folder name | `ISO 9001` | Observed |
| Folder name | `User Guides` | Observed |
| Back navigation | `Back to folders` | Observed |
| Placeholder resource | `sample.md` | Observed |
| Resource date | `Sep 13, 2026` | Observed |
| Navigation labels | `Dashboard`, `Documents`, `Training`, `Deviations`, `CAPA`, `Change Management`, `Reports`, `Knowledge Hub`, `Settings`, `Logout` | Observed |
| Notification badge | `10` | Observed; meaning unknown |

## 5. Recommended metadata model for the next iteration

The following fields are recommended for a domain-appropriate Knowledge Hub. They are not visible in the screenshots and should therefore be treated as proposed product metadata.

### 5.1 Folder / collection metadata

| Field | Purpose |
|---|---|
| `folderId`, `parentFolderId` | Stable identity and optional hierarchy. |
| `name`, `shortDescription` | Scannable label and user-oriented explanation. |
| `domain` | E.g. quality system, laboratory, software, training, regulatory reference. |
| `contentTypeSummary` | E.g. templates, guides, standards, examples. |
| `resourceCount` | Helps users judge whether a folder is populated. |
| `accessScope` | Public-to-platform, organization-only, role-restricted, or private. |
| `owner` / `maintainer` | Accountability for content quality. |
| `lastReviewedAt`, `reviewCadence` | Prevents stale regulated guidance. |
| `sortOrder` | Makes curated information architecture explicit. |

### 5.2 Resource / file metadata

| Field | Purpose |
|---|---|
| `resourceId`, `fileName`, `fileType`, `fileSize` | Identification and predictable handling. |
| `title`, `summary` | Human-readable meaning beyond the file name. |
| `resourceType` | Template, guide, checklist, example, standard, regulation, reference, or software documentation. |
| `topicTags` | Supports search and cross-domain retrieval. |
| `version`, `revision`, `status` | Distinguishes draft, published, superseded, and archived content. |
| `effectiveDate`, `publishedAt`, `lastUpdatedAt` | Makes date semantics explicit. |
| `reviewedBy`, `approvedBy` | Supports governance when content is controlled. |
| `jurisdiction`, `language` | Important for standards and regulatory materials. |
| `license`, `sourceAttribution` | Prevents “free” from being mistaken for unrestricted redistribution. |
| `accessScope` | Allows future tenant/role controls. |
| `previewSupported`, `downloadAllowed` | Clarifies the primary action. |
| `relatedModules` | Connects a resource to Documents, Training, CAPA, Deviations, or Change Management. |

## 6. UX and domain notes captured for follow-up

- A folder-only landing page is easy to scan, but it hides the user's most important decision criteria: what is inside, who it is for, whether it is current, and whether it is safe/authorized to reuse.
- Standards-based folder names are understandable to specialists but can be opaque to new users. A short description or “what you will find here” label would reduce interpretation effort.
- The current file row lacks visible file type, version, resource category, summary, and explicit action. Those fields are especially important in quality, laboratory, and regulated contexts.
- The distinction between a free platform resource and a controlled customer document should be made explicit in the information architecture and access model.
- Date labels should use an explicit prefix such as `Last updated`, `Published`, or `Effective from`; otherwise users may interpret a stale reference as current.
- For a growing library, search, filters, breadcrumbs, empty states, loading states, and a “recently added/updated” view will likely become necessary.
