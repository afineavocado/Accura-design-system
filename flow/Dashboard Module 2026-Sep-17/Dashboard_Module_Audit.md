# Dashboard Module — Audit (2026-09-17)

Audit of the three spec files in this folder against the running prototype code (`accura-ui/src/app/prototype/accura/`) and the Accura design-system rules. Prototype: `http://localhost:3003/prototype/accura/dashboard` (Obsidian Vault clone, branch `Dashboard`).

Severity: **A** = blocks a correct build · **B** = spec inconsistency, needs a product decision · **C** = housekeeping.

## A — Spec vs. the data that exists

| # | Finding | Evidence | Prototype does |
|---|---|---|---|
| A-01 | Spec example records don't exist. `SOP-023`, `CAPA #104`/`CAPA-0104`, `AUD-012`, `AUD-2026-003` are not in any mock data. | Documents: SOP-001…005, POL-001. CAPA: CAPA-0003…0009. No Audits module. | Uses real IDs: `SOP-002` (In QA Approval, Sarah Chen), `CAPA-0005`. |
| A-02 | Spec numbers are hand-typed and contradict module data (breaks "derive, never re-type"). | Spec: 124 Active / 6 Pending docs, 12 open CAPA, 86% / 3 overdue training. Data: 6 docs, 5 open CAPA, 5 trainees with **1** overdue → **60%** current. | Derives Documents, CAPA, Training from module mock data. |
| A-03 | Current user has no CAPA actions. Spec says Sarah Chen gets CAPA work; CAPA mock names **Sarah Johnson** as owner and approver. Shell notification still points Sarah Chen at CAPA-0005. | `capa/mock-data.ts` `sharedRecordData` | Shows CAPA-0005 (mirrors the notification) and flags it. |
| A-04 | Drill-down filters are not supported. `?status=Overdue`, `?filter=approaching_due`, `?tab=pending` — no listing reads search params. | `grep searchParams` on capa/training/documents pages → none. | Links to unfiltered listings. |
| A-05 | Routes for Non-Conformance, Audits, Risks (`/deviations`, `/audits/...`) don't exist; sidebar calls the module **Deviations**, spec calls it Non-Conformance(s). | `app-sidebar.tsx` | Rows marked "Module not built", not linked. |
| A-06 | Documents have **no due date** (`next_action_due`, `periodic_review_date` are in §3.2 but not in `DemoDocument`). Documents RAG can only ever be green; "SOP Review — 28 Sep" cannot be generated. | `documents/mock-data.ts` type | Documents RAG fixed green; no SOP review milestone. |
| A-07 | CAPA `dueDate` is a display string (`"Oct 1, 2026"`), not ISO — violates "store data, not display". | `capa/mock-data.ts` | Parsed at runtime; should be migrated. |

## B — Internal spec inconsistencies (need a decision)

| # | Finding |
|---|---|
| B-01 | "Due soon" has three windows: RAG = 7 d (§2.1.3), CAPA Quality System = 14 d (§2.3.2, §4.2), Business Flow §3.2 = 7 d. Live result: CAPA shows **On track** in Glance but **3 Due soon** in Quality System. |
| B-02 | Glance RAG table says Yellow triggers are shown as 🟠 in the table but 🟡 in Business Flow §3.2 ("Yellow status"). Pick one name. |
| B-03 | My Actions urgency tiers leave gaps: red ≤ 2 d, yellow 3–7 d, nothing for 8–14 d although the horizon is 14 d. Approval items have no due date at all, so they can't be ranked by §5 "overdue rises to top". |
| B-04 | Orange is used for two meanings (awaiting signature, supervisory alert). Emoji dots are colour-only — fails "do not use color alone". Prototype uses Badge with a text label. |
| B-05 | Changelog D1 (overdue ⇒ Red) is correct, but Business Flow §2.1 still lists Training as 🔴 while §2.2 lists "Training — 3 people overdue" as 🟠. |
| B-06 | Business Flow §2.2 step 3 describes the document detail as "Left 70% PDF, right 30% details + persistent bottom bar with Effective Date". The RecordDetailLayout master puts gate/approval route in the rail, not metadata. |
| B-07 | Audits "Upcoming" = next 30 d, but Glance says "Next audit in 21 days" while Upcoming lists an audit on 24 Sep (7 d). Same data, two answers. |
| B-08 | CAPA Due milestone "30 Sep" matches CAPA-0009, which is **Closed**. |
| B-09 | Training RAG formula uses `DueDate` but Training status is per user; §4.1 defines overdue by user. Specify which is counted. |
| B-10 | Out-of-scope features stated as behaviour: header "expanded audit-readiness view" icon (undefined), 48 h escalation notifications, header Quality Alert banner (no component), auto-export to Management Review pack. |
| B-11 | RBAC §4: "Department Head … option to filter by department" — no filter is designed on any widget. |

## C — Housekeeping

| # | Finding |
|---|---|
| C-01 | Changelog §1.4 cites `docs/demo-design-contract.md` — moved into `docs/skills/accura-prototype-build/`. `accura-discovery/...` paths are outside this repo. |
| C-02 | Changelog §1.3 lists `record-row-action.tsx` and `record-audit-drawer.tsx` as used; the dashboard needs neither. |
| C-03 | Area naming drifts: "Non-Conformances" (§2.1.2, TS type) vs "Non-Conformance" (§2.3, TS type). Two different union types for the same field. |
| C-04 | Date format: spec wants `24 Sep`; `en-GB` locale renders `24 Sept` — handled explicitly in the prototype. |

## What was built (final, confirmed 2026-09-18)

See `Dashboard_Module_Changelog.md` → ADR D6–D9 and v1.1 for the full record.

- **Layout:** notification → Overview (6 cards) → Records table. Content capped at 1100px, centred.
- **Overview cards:** icon circle · name · status badge · big number · description. Documents, CAPA, Training open their list pre-filtered to the records counted; Non-Conformance, Audits, Risks are dimmed sample cards.
- **Records:** tabs My actions | Upcoming; columns Record · Status · Priority · Module · Due date · eye action; priority filter.
- **Addresses from this audit:** A-01 (real record IDs used), A-02 (numbers derived, not typed), A-04 (list filters now read from the URL for Training, CAPA, Documents), A-05 (unbuilt modules labelled, never linked), B-04 (status never colour-only — every badge has text).
- **Still open:** A-03, A-06, A-07, B-01…B-03, B-05…B-11, C-01…C-03.
