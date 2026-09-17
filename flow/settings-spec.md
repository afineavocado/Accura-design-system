# Settings — module spec

**As-built**, read from the code on 2026-09-17. Chi built this module; it reached `main` on the same
day. Her own source documents are in `flow/Setting Module/` — a business flow, a metadata-and-screens
spec (v1.1, which `mock-data.ts` cites by section) and a build log. **This file describes what the
prototype does**; where the two differ, hers says what was intended and this one says what shipped.

Files — `accura-ui/src/app/prototype/accura/settings/` (1,525 lines):

| File | Lines | What |
|---|---|---|
| `mock-data.ts` | 328 | the section/tab tree, every lookup's rows, users, form options |
| `settings-shell.tsx` | 170 | two-level navigation and the page heading |
| `lookup-screen.tsx` | 371 | one screen driving **17** lookup tables |
| `users-screens.tsx` | 353 | Users and Roles & Permissions |
| `form-screens.tsx` | 231 | Record Numbering and Preferences |
| `row-menu.tsx` | 48 | row actions — prototype-only, **not** a design-system component |
| `[section]/page.tsx` · `[section]/[tab]/page.tsx` | 50 | routing |

---

## 1. Shape — sections and tabs, not records

Settings has no lifecycle and no records. It is a two-level tree: **7 sections**, each holding
tabs, and every tab is one of four kinds — `lookup`, `record-numbering`, `preferences`, `users`,
`roles`. `settingsSections` in `mock-data.ts` is the whole navigation model; the routes are
generated from it.

| Section | Route | Tabs |
|---|---|---|
| Organisation | `/organisation` | Record Numbering · Business Units (1 row) · Departments (3, searchable) · Preferences |
| Documents | `/documents` | Document Types (5, with abbreviations) |
| Training | `/training` | Delivery Types (4) · Assessment Methods (4) |
| CAPA | `/capa` | Sources (6) · Classifications (2) · Priorities (4, ordered) |
| Change Control | `/change-management` | Change Types (6) · Categories (3, ordered) |
| Deviations | `/deviations` | Types (10, searchable) · Categories (3, ordered) · Severities (3, ordered) · Root Cause Categories (5) · Root Cause Methods (4) |
| Users | `/users` | Users · Roles & Permissions |

`/prototype/accura/settings` redirects to `/organisation/record-numbering`.

**`ordered: true`** means the order carries meaning — Low → Critical — so those tables let a row be
moved. **`searchable: true`** adds a search field, on the two longest tables.

---

## 2. Data model — `mock-data.ts`

```
SettingsSection  slug · label · icon · tabs[]
  LookupTab      kind:"lookup" · slug · label · heading · subtitle? · entity · noun
                 searchable? · ordered? · withAbbreviation? · rows[]
  FormTab        kind:"record-numbering" | "preferences" | "users" | "roles"
  LookupRow      id · name · description · abbreviation? · inUse?
  SettingsUser   id · name · email · moduleRoles[] · globalRoles[] · status
```

`entity` and `noun` exist so one screen can say *"Add department"* and *"3 departments"* without
the screen knowing which table it is rendering.

**`inUse` is explicitly a mock** — the file says so. The source spec (§7) requires a delete guard
for values that live records reference, but supplies no counts, so six rows carry an invented one
purely so the guard can be reviewed.

**Users:** two seeds — Sarah Johnson (`Active`) and James O'Brien (`Invited`). Roles are strings on
the user, in two flavours: `moduleRoles` (`"Documents: QA Approver"`) and `globalRoles`
(`"Super QA User"`).

---

## 3. Screen — a lookup table

One component, 17 tabs. Search when the tab asks for it, a list summary, the rows, and a row menu.
Add and Edit are a `Dialog`; delete is an `AlertDialog`, and that is where `inUse` is read — a value
in use is meant to be refused rather than deleted.

Columns follow the tab: name, description, and `abbreviation` only where `withAbbreviation` is set
(Document Types). Ordered tables (Priorities, Categories, Severities) can move a row instead of
sorting by name.

## 4. Screen — Record Numbering

**The preview comes first**, before the fields that change it — `PREFIX-SOP-GEN-2026-0001`,
assembled live from: Organisation prefix (required) · Separator · Sequence length (4–8) · Include
year · Include document sub-type. One `Save Record Numbering` button, which sets a saved flag and
nothing else.

## 5. Screen — Preferences

A `Display` card of four selects: time zone (5 options, from `Australia/Sydney` to `UTC`), language
(English only), date format, time format. Same save behaviour.

## 6. Screens — Users and Roles

**Users** lists name, email, module roles, global roles and a status badge (`Active` / `Invited`),
with invite and edit dialogs and a delete confirmation. **Roles & Permissions** lists the role
catalogue — `moduleRoles` per module and `globalRoles`.

---

## 7. Questions

**7.1 Nothing persists.** Every screen keeps its state in React and resets on reload — no
`localStorage`, unlike Documents and Change Control. Deliberate, or not reached yet?

**7.2 `inUse` counts are invented.** The delete guard cannot be reviewed against real usage, and
nothing connects a lookup value to the modules that would reference it. Should a value in use be
blocked, warned, or reassigned?

**7.3 The lookup tables duplicate vocabulary the modules already hard-code.** Deviations' own
`mock-data.ts` carries its severities and classifications; Change Control carries its types and
categories; CAPA carries its priorities. Settings now lists all of them again, and the two sets can
disagree. Which is the source of truth?

**7.4 The row menu is hand-rolled**, on raw Radix, and Chi's own log says it is prototype-only.
Change Control had a second copy until it was deleted on 2026-09-17. This is a logged design-system
gap — the system has no row overflow menu.

**7.5 Roles are strings.** `"Documents: QA Approver"` is a module and a role in one value, parsed by
convention. Every other cross-reference in the product is an id.

**7.6 Settings is the least token-bound module in the prototype** — it shipped with 52 spacing
literals against 3 token uses. Converted on 2026-09-17 (4 literals left, all zeros), but it was
never audited screen by screen the way Deviations and Change Control were.

**7.7 No audit trail.** Changing a record-numbering scheme or deleting a controlled vocabulary is
exactly the kind of configuration change a regulated system records. Nothing here writes one.
