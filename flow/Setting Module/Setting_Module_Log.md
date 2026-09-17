# Setting Module — Log

> **One log for the Setting Module**: changes to the spec, changes to the prototype, and every decision or open question behind them.
>
> **Spec:** `Setting_Module_Business_Flow.md` · `Setting_Module_Metadata_and_Screens.md`
> **Code:** `accura-ui/src/app/prototype/accura/settings/`
> **Run:** `cd accura-ui && rm -rf .next && npm run dev` → http://localhost:3001/prototype/accura/settings
>
> Replaces `Setting_Module_Changelog.md` and `REVIEW-NOTES.md` (merged 2026-09-17, nothing dropped).

## How to use this log

- **New entries go at the top of §2.** Never rewrite a past entry — append a dated correction.
- Tag each entry: `[Spec]` spec documents changed · `[Prototype]` code changed · `[Decision]` a question was settled · `[Shared]` a file other modules use changed.
- **`[Shared]` changes are also recorded in the repo-wide `CHANGELOG.md`** (a component in `components/ui/`, a token, `app-sidebar.tsx`, a rule or pattern). Here, one line pointing to that entry is enough.
- A question is settled by updating its row in §1, not by deleting it.

---

## 1. Decisions and open questions

**State:** `Open` — needs an answer · `Mock` — prototype placeholder, needs confirmation · `Decided` — settled, with who and when · `Superseded` — replaced by a later entry.

### 1.1 Spec inconsistencies (audit, 2026-09-17)

| ID | Issue | Where | State | Validate with |
|---|---|---|---|---|
| A1 | Flow §9 says "7 cards matching §1", but Flow §1 has no cards (they are in Metadata §1) | Flow §9 | Open | Spec owner |
| A2 | Three different ID examples: `SOP-001`, `ACME-SOP-2026-000001`, `ACME-SOP-GEN-2026-000001` | Metadata §2, §6 | Open | Product |
| A3 | Document sub-type (`GEN`) is never defined anywhere | Metadata §2 | Open | Product |
| A4 | §21.1 lists CTAs `Add Root Cause Category/Method`; §17/§18 say `Add Category/Method` | Metadata §17, §18, §21.1 | Open | Spec owner |
| A5 | §21.5 `{Section} {Tab}` heading rule is broken by "Severities" (§16). Prototype keeps "Severities" as specced | Metadata §16, §21.5 | Open | Spec owner |
| A6 | Module names differ: Change Management / Change Control, Deviations / NC / Deviation, Settings / Setting. Prototype now uses the app sidebar's names — see v4 | Metadata §1, §5, §19–20 | Open — prototype chose, product must confirm | Product |
| A7 | "Only Departments has search" is a screenshot observation; Deviation Types (10 rows) has none | Metadata §4 | Superseded by v2 (search on lists > 8 rows) | — |
| A8 | CAPA / Change / Deviation tables show an empty Description on every row | Metadata §9–18 | Open | Product |

### 1.2 Undefined behaviour and prototype placeholders

| ID | Gap in spec | Prototype placeholder | State |
|---|---|---|---|
| B1 | Edit form not specified — can Abbreviation change once IDs exist? | Edit reuses the Add dialog, `Save changes`; Abbreviation editable | Mock |
| B2 | No copy for delete confirmation or the referential-integrity block (Flow §7) | In use → "Can't delete {name}" with only Close. Unused → "Delete {name}?" + destructive Delete | Mock |
| B3 | Standard create modal has no Abbreviation field, yet Document Types needs one | Document Types dialog adds `Abbreviation *`: uppercase, 2–6 chars, unique | Mock |
| B4 | Separator / Sequence Length options and prefix validation not listed | Separators Hyphen, Slash, Dot, None · lengths 4–8 · prefix 2–8 letters/numbers | Mock |
| B5 | Preferences option lists not listed | 5 sample time zones · English only · 4 date formats · 12/24-hour | Mock |
| B6 | No Edit/Delete User spec, email validation, minimum-role rule, or role-coverage check (Flow §3.5) | Same dialog for edit · email valid + unique · at least one role · remove = confirm · role coverage not built | Mock |
| B7 | Non-Admin read-only view undesigned; spec's demo user is a "Member" | Not built — demo user is Admin (Amit Kothari) | Open |
| B8 | "No X close button" conflicts with the design-system Dialog | Dialog keeps its X | Mock — follows design system |
| B9 | No empty / loading / sort / pagination rules | Empty-state row; no pagination (max 10 rows) | Mock |
| B10 | Uniqueness of lookup names not specified | Names unique within a table | Mock |
| B11 | Delete guard needs reference counts; spec has none | `inUse` counts invented on a few rows (SOP, Quality Control, Classroom…) | Mock |

### 1.3 Spec vs design system

| ID | Spec says | Prototype uses | State |
|---|---|---|---|
| C1/C2 | "Green badge/pill" | `Badge variant="success"` | Decided — design-system rule |
| C3 | Pill toggle buttons for module roles | `Checkbox` groups — no toggle component exists | Mock — build `ToggleGroup` if pills are required |
| C4 | CTA top-right beside heading | v1: toolbar row. **v2+:** in the page header, aligned with the title | Superseded by v2 |
| C5 | Edit \| Delete text links | v1: icon buttons. **v2+:** `⋯` row menu (`row-menu.tsx`) | Superseded by v2 |
| C6 | Uppercase column headers (NAME) | Sentence case; `TableHead` not overridden | Decided — design-system rule |

### 1.4 Deliberate departures from the spec (redesign)

Read these with the checklists in Metadata §23 and Flow §9 — those checklists describe the original design, so the items below will fail them **on purpose**.

| Checklist item | Prototype now | Entry | State |
|---|---|---|---|
| Settings index shows 7 cards | No index — `/settings` opens Organisation › Record Numbering; sections in a vertical menu | v3 | Open — needs product sign-off |
| `< All Settings` on every sub-screen | Removed — the section menu is always visible | v3 | Open |
| CAPA / Change / Deviations headings have no subtitle | Every page has a one-line description (new copy) | v2 | Open — copy needs review |
| Create modal has no X | Dialog keeps its X | v1 (B8) | Mock |
| Users ROLES is inline text with `·` | Role badges (global roles green) + Status column | v2 | Open |
| Edit \| Delete row links | `⋯` row menu | v2 | Open |
| Departments is the only searchable list | Search on Departments, Deviation Types, Users, any list > 8 rows | v2 | Open |
| — (not in spec) | Move up / Move down on ordered lists (Priorities, Categories, Severities) | v2 | Mock |
| — (not in spec) | User status Active / Invited, "Resend invite", "Invite user" copy | v2 | Mock |
| Section names "Change Management", "Deviations / NC" | "Change Control", "Deviations" (match app sidebar) | v4 | Open — see A6 |

### 1.5 Not done, on purpose

| Item | Why | State |
|---|---|---|
| Roles & Permissions as a role × module matrix | Roles differ per module (Author vs Deviation Creator); a grid would invent a mapping. Kept module table + global role cards | Open — build if product confirms a mapping |
| Proper `DropdownMenu` component | `row-menu.tsx` is a prototype-only Radix Popover styled from tokens. If kept, build it in `components/ui/` with spec + meta.json + story, then log it in `CHANGELOG.md` | Open |
| Mobile: active tab auto-scrolls into view | Off-screen active tab (e.g. Root Cause Methods) is not scrolled into view | Open — known issue |

---

## 2. Change history (newest first)

### 2026-09-17 — Log files merged `[Spec]`

- `Setting_Module_Changelog.md` and `REVIEW-NOTES.md` merged into this file. Audit, placeholders and redesign notes moved to §1; version history to §2. Nothing dropped.
- Spec headers now point here.

### 2026-09-17 — Moved into the repo `[Prototype]` `[Shared]`

- Prototype moved from a sandbox copy (`Obsidian Vault/Setting Module Prototype/`) into this repo on branch `chi-setting`.
- **Shared:** `prototype/accura/app-sidebar.tsx` — footer item was `"Setting"`, `href: "#"`; now `"Settings"`, `href: "/prototype/accura/settings"`. Recorded in `CHANGELOG.md` (2026-09-17).
- Removed the unused `settingsNav` list (left over from v2) from `mock-data.ts`.

### 2026-09-17 — v4: icons and names aligned with the app sidebar `[Prototype]`

| Section | Was | Now | Why |
|---|---|---|---|
| CAPA icon | RefreshCw | ClipboardCheck | RefreshCw means Change Control in the sidebar |
| Change icon | ArrowLeftRight | RefreshCw | Same as sidebar |
| Organisation icon | House | Building2 | House reads as "home" |
| Users icon | User | Users | A group, not one person |
| Section label | Change Management | Change Control | Matches sidebar + RBAC roles (Flow §5) — A6 |
| Section label | Deviations / NC | Deviations | Matches sidebar — A6 |
| App sidebar | Setting | Settings | Matches page title |

URLs keep the old slugs (`change-management`, `deviations`).

### 2026-09-17 — v3: two-level navigation `[Prototype]`

- Level 1: vertical settings menu with the 7 sections and icons.
- Level 2: line tabs for the section's pages, full content width; each tab is its own URL.
- Section click opens its first tab; `/settings` opens Organisation › Record Numbering.
- Single-page sections (Documents) show no tab bar.
- Tab labels short ("Sources"); page title keeps the full name ("CAPA Sources").
- Mobile: section Select + horizontally scrolling tabs.
- Was (v2): one flat grouped menu listing every page, no tabs.

### 2026-09-17 — v2: SaaS layout redesign `[Prototype]`

Based on Mobbin research — settings nav: incident.io, Vanta, Front · members: Copilot, StackAI · form cards: Plain, GitBook.

| Change | Was (v1 / spec) | Now |
|---|---|---|
| Navigation | Card index → section → tabs, `< All Settings` back link | Persistent grouped menu beside the app sidebar (reworked into two levels in v3) |
| Page header | CAPA/Change/Deviations had no subtitle; CTA on its own row | Title + one-line description + action aligned right |
| Row actions | Edit and Delete icon buttons | `⋯` menu (Edit, Delete in red) |
| Ordered lists | — | `#` column and Move up / Move down |
| Search | Departments only | Departments, Deviation Types, Users, any list > 8 rows |
| List summary | "3 categories" row above tables | Removed (user request, before v2) |
| Record Numbering | One form | Preview card on top, Format card below |
| Users | Name · Email · Roles text | User (name + email) · role badges · Status · search · `⋯` (Edit roles, Resend invite, Remove) · "Invite user" |
| Content width | 1100px centred (matched demo.accura.one) | 960px — the menu takes 240px |

### 2026-09-17 — v1: first prototype + spec audit `[Prototype]`

- Built all 20 screens: index, 14 lookup tables (one shared `LookupScreen`), Record Numbering with live preview, Preferences, Users with Add/Edit dialog, read-only Roles & Permissions.
- Add / Edit / Delete dialogs with validation and the delete guard (Flow §7), all in-memory.
- Audit of the spec recorded as A1–A8, B1–B9, C1–C6 (§1).
- Layout adjustments after first review: content capped at 1100px and centred (as in the demo), section tab line full width, CTA aligned with the title, list count row removed.

### 2026-09-16 17:17 — Spec v1.1: UI screenshot audit `[Spec]`

**Source:** 22 screenshots from the live Accura demo (`https://demo.accura.one/settings`), captured 2026-09-16.

**New sections added**

| # | Change | File |
|---|---|---|
| 1 | Added **Organisation** section (4 sub-screens): Record Numbering, Business Units, Departments, Preferences | Both |
| 2 | Record Numbering screen spec — Org Prefix, Document Type (auto), Separator, Sequence Length, Year checkbox, Sub-type checkbox, live Preview | Metadata |
| 3 | Business Units screen spec — lookup table, `Add Unit`, current: Sydney (AU) | Metadata |
| 4 | Departments screen spec — lookup table + **search bar** (unique to this screen), `Add department`, 3 current records | Metadata |
| 5 | Preferences screen spec — form layout (not table): Time Zone, Language, Date Format, Time Format + `Save Preferences` | Metadata |
| 6 | **Create Modal UX pattern** — 2 fields (Name `*`, Description `Optional`), Cancel + `Add {Entity}` buttons | Metadata |
| 7 | **Add User Modal** detail — Name `*`, Email `*`, Module Roles (pill toggles), Global Roles (checkboxes), Cancel + `Add user` | Metadata |

**Data corrections (PDF → UI)**

| # | Field | Was (PDF source) | Now (UI verified) | File |
|---|---|---|---|---|
| 8 | Change Mgmt Categories | "Major, Minor, Emergency" | Minor, Major, Critical | Metadata |
| 9 | CAPA Priorities order | "Critical, High, Medium, Low" | Low, Medium, High, Critical (ascending) | Metadata |
| 10 | Root Cause Categories | "Man, Machine, Material, Method, Environment" (5M) | Human Error, Equipment / Facility, Process / Method, Material, Environmental | Metadata |
| 11 | Root Cause Methods | 3 items | 4 items: 5 Whys, Fishbone (Ishikawa), **Fault Tree Analysis** (new), FMEA | Metadata |
| 12 | Doc Type: Form desc. | (not specified) | "Blank templates used to record data and evidence" | Metadata |
| 13 | Doc Type: Spec. desc. | (not specified) | "Technical requirements and acceptance criteria" | Metadata |
| 14 | Deviation Severities | "Critical, Major, Minor" (guessed) | Low, Medium, High (confirmed from UI) | Metadata |

**UX observations documented**

| # | Observation | File |
|---|---|---|
| 15 | Departments is the only lookup screen with a search bar | Metadata |
| 16 | Preferences + Record Numbering use form layout (dropdowns/inputs), not data tables | Metadata |
| 17 | Record Numbering has live preview block (`ACME-SOP-GEN-2026-000001`) | Metadata |
| 18 | CAPA, Change Management, Deviations/NC headings have **no subtitle text** | Metadata |
| 19 | Screen heading format: `{Section} {Tab}` (e.g., "Deviation Types", "CAPA Sources") | Metadata |
| 20 | ABBREVIATION column on Document Types renders as **green badge/pill** (uppercase) | Metadata |
| 21 | Users ROLES column uses inline text with `·` separator, not badge pills | Metadata |
| 22 | Roles & Permissions uses **green pill badges** for module roles, **card layout** for global roles | Metadata |
| 23 | Settings Index shows card grid with section name + `N settings` count + chevron icon | Metadata |
| 24 | Organisation sub-nav: Record Numbering, Business Units, Departments, Preferences (left sidebar) | Metadata |
| 25 | Phase 1 actual data: Org Prefix=ACME, Separator=Hyphen, Seq=6-digit, TZ=Australia/Sydney, Lang=English, DateFmt=DD-MMM-YYYY, TimeFmt=12-hour | Flow |

### 2026-09-16 16:41 — Spec v1.0: initial creation `[Spec]`

**Source:** `[Setting Module] Accura.pdf` (Gemini analysis export, 15 pages).

- Created `Setting_Module_Metadata_and_Screens.md` — screen-level metadata and field schema spec.
- Created `Setting_Module_Business_Flow.md` — module business flow, actors, data consumption model.
- Format follows the pattern of `Deviation_Module_Metadata_and_Screens.md` / `Deviation_Module_Business_Flow.md`.
- Organisation section (Preferences, Business Units, Departments, Record Numbering) was referenced in the business flow but not detailed as individual screens — flagged for future audit.

---

## 3. Reviewing the prototype

| Screen | Try |
|---|---|
| Organisation › Record Numbering | Change prefix / separator / length / checkboxes → preview updates; clear prefix → error |
| Organisation › Departments | Search |
| Organisation › Preferences | 4 selects + Save |
| Documents › Document Types | Add with a duplicate abbreviation (e.g. `SOP`) → blocked |
| Any lookup | `⋯` → Delete a value in use (SOP, Quality Control, Classroom…) → blocked; an unused one → confirm |
| CAPA › Priorities | `⋯` → Move up / Move down → `#` renumbers |
| Users › Users | Invite with nothing filled → 3 errors; valid invite → new row, status Invited |
| Users › Roles & Permissions | Read-only, no controls |

All data is in-memory; a reload resets to spec values. When checking against Metadata §23 or Flow §9, use §1.4 to tell a deliberate change from a bug.
