# Knowledge Hub — trace and tracking log

## Log metadata

- **Artifact folder:** `flow/knowledge-hub` — renamed from `Knowledge Hub 2026-09-15 11-53` on 2026-09-15
- **Created:** 2026-09-15 11:53 (+07:00)
- **Scope:** documentation only; no product code or UI was changed.
- **Evidence set:** two supplied Knowledge Hub screenshots plus Amit's brief in the user request.

## Entries

| Timestamp (+07:00) | Actor | Event | Evidence / output | Status |
|---|---|---|---|---|
| 2026-09-15 11:53 | Codex | Initialized documentation folder | `Knowledge Hub 2026-09-15 11-53/` | Complete |
| 2026-09-15 11:53 | Codex | Recorded visual source 1 | Root folder index screenshot; folders and global navigation transcribed | Complete |
| 2026-09-15 11:53 | Codex | Recorded visual source 2 | `Accura Software` contents screenshot; `sample.md` and `Sep 13, 2026` transcribed | Complete |
| 2026-09-15 11:53 | Codex | Separated evidence from inference | Added `Observed`, `Brief`, `Assumption`, and `Open question` labels | Complete |
| 2026-09-15 11:53 | Codex | Created origin record | `01-origin.md` | Complete |
| 2026-09-15 11:53 | Codex | Created business-flow record | `02-main-business-flow-and-rules.md` | Complete |
| 2026-09-15 11:53 | Codex | Created tracking record | `03-log.md` | Complete |

## Decision and assumption register

| ID | Item | Source / rationale | State | Owner to validate |
|---|---|---|---|---|
| A-001 | Templates are intended to be free to platform users | Amit's brief | Assumption carried from brief; scope of “anyone” unresolved | Product / Commercial |
| A-002 | A file row opens, previews, or downloads a resource | Interaction is not shown in supplied screens | Unverified | Product / Engineering |
| A-003 | `Sep 13, 2026` is a resource date, but its semantic label is missing | Direct screenshot observation | Unverified | Product / Content owner |
| A-004 | Some folders represent standards or regulatory references | Folder names `GMP PICS` and ISO standards | Domain inference | Quality / Legal |
| A-005 | Customer-controlled documents need a separate access/governance boundary | Regulated-document domain expectation | Recommended rule | Product / Quality / Security |
| A-006 | Placeholder content should be visibly labeled | Amit describes current resources as placeholders | Recommended rule | Product / Content owner |
| A-007 | Future scale will require search, filters, and richer metadata | Current screens show only folders and one basic row | UX recommendation | Product / Engineering |

## Open follow-up queue

- Confirm access model: platform-wide, tenant, role, or mixed.
- Confirm supported resource actions: preview, download, use as template, copy link.
- Define metadata minimums and lifecycle states.
- Define licensing/attribution handling for ISO, GMP PICS, and other external materials.
- Define who owns, reviews, approves, publishes, updates, supersedes, and archives content.
- Define whether Knowledge Hub content can be promoted into the controlled `Documents` module.
- Define notification semantics for new or changed Knowledge Hub resources.

## Change log

| Timestamp (+07:00) | Actor | Change | Files affected | Reason / source | Validation needed | Status |
|---|---|---|---|---|---|---|
| 2026-09-15 15:27 | Chi | Built a reviewable prototype of all three Knowledge Hub levels | `accura-ui/src/app/prototype/accura/knowledge-hub/`, `app-sidebar.tsx` | Review UX/UI against the locked design-system patterns before instructing Amit | Chi and Amit review | Open |
| 2026-09-15 15:37 | Chi | Added UI build instructions for Amit | `04-ui-build-instructions.md` | UX audit of the supplied screens against `accura-prototype-build.md` and `content-guidelines.md` | Amit review | Open |
| 2026-09-15 16:17 | Chi | Renamed the artifact folder to `flow/knowledge-hub` | this folder, `01-origin.md`, `03-log.md` | Matches the `flow/documents-discovery` convention; the timestamp in the old name had already gone stale against its own contents | — | Confirmed |
| _YYYY-MM-DD HH:MM_ | _name_ | _what changed_ | _file(s)_ | _ticket, decision, screenshot, or interview_ | _reviewer / test_ | _Open / Confirmed / Rejected_ |
