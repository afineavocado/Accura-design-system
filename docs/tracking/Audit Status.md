# Audit Status

Tracks which components have been audited, what rules were active at the time, and what needs re-auditing when new rules are added.

**Rule:** Any component audited before a new check was added to Component Audit Skill.md is marked `needs re-audit` for that check.

---

## Rule Changelog

| # | Rule added | Date | What it catches |
|---|---|---|---|
| R1 | Unbound fills / strokes / radius | — | Tokens not bound at all |
| R2 | Wrong semantic group (surface vs background) | — | Token from wrong group for context |
| R3 | Paired-surface rule | Session 2 | `/foreground` token used on wrong background surface |
| R4 | State-aware token correctness (2i) — Invalid | Session 2 | `danger-subtle/foreground` on default bg → should be `color/text/invalid` |
| R5 | State-aware token correctness (2i) — Warning | 2026-05-26 | Warning text on default bg → `color/text/warning` |
| R6 | State-aware token correctness (2i) — Success | 2026-05-26 | Success text on default bg → `color/text/success` |
| R7 | Icon info token | 2026-05-26 | Info icons should use `color/icon/info`, not `color/icon/brand` |
| R8 | Sub-component fill override | 2026-05-26 | Fills/strokes inside an embedded sub-component (button, icon, etc.) must not be overridden by the parent — change the sub-component's Variant prop instead |

---

## Component Audit Log

| Component                  | Variants | Last audited | Rules active | Needs re-audit                                                                             |
| -------------------------- | -------- | ------------ | ------------ | ------------------------------------------------------------------------------------------ |
| `switch` (67:88)           | 12       | 2026-05-28   | R1–R8        | Clean — 0 issues                                                                           |
| `switch-item` (270:110)    | 12       | 2026-05-28   | R1–R8        | R8 reviewed: fills on embedded switch root are intentional (standard composition)          |
| `radio` (96:33420)         | 5        | 2026-05-28   | R1–R8        | Clean — 0 issues                                                                           |
| `radio-item` (96:33437)    | 10       | 2026-05-28   | R1–R8        | Clean — 0 issues (no fill overrides on embedded radio)                                     |
| `checkbox-box` (59:18266)  | 8        | 2026-05-28   | R1–R8        | Clean — 0 issues                                                                           |
| `checkbox-item` (59:18336) | 16       | 2026-05-28   | R1–R8        | R8 reviewed: fills on embedded checkbox-box root are intentional; State props corrected    |
| `alert` (74:1777)          | 12       | 2026-05-28   | R1–R8        | Warning primitive tokens (`color/yellow/*`) accepted as design decision — not a bug        |
| `alert-dialog` (152:3240)  | 8        | 2026-05-28   | R1–R8        | Footer button fills intentional — parent sets root fill on button instances (required)      |
| `tab-trigger` (59:17766)   | 7        | 2026-05-28   | R1–R8        | Clean — 0 issues (no embedded sub-components)                                              |
| `tab-list` (59:17793)      | 3        | 2026-05-28   | R1–R8        | R8 reviewed: fill on embedded tab-trigger root is intentional; State=Active prop corrected |
| `separator` (75:11717)     | 2        | 2026-05-26   | R1–R7        | R8 not applicable — no sub-components                                                      |
| `accordion` (27:3059)      | 3        | 2026-05-28   | R1–R8        | — R8 clean: chevron stroke bound on VECTOR per Icon Placeholder rule, not an override      |
| `calendar-day` (27:3095)   | 9        | 2026-05-27   | R1–R8        | —                                                                                          |
| `calendar-month` (159:15346) | 4      | 2026-05-27   | R1–R8        | —                                                                                          |
| `_calendar-preset` (159:15381) | 4    | 2026-05-27   | R1–R8        | —                                                                                          |
| `calendar` (28:4073)       | 6        | 2026-05-27   | R1–R8        | —                                                                                          |
| `date-picker` (58:15976)   | 12       | 2026-05-26   | R1–R8        | —                                                                                          |
| `button-group` (52:11151)  | 4        | 2026-05-27   | R1–R8        | —                                                                                          |
| `tooltip` (74:1699)        | 4        | 2026-05-27   | R1–R8        | —                                                                                          |
| `bubble` (74:1682)         | 1        | 2026-05-27   | R1–R8        | —                                                                                          |
| `_breadcrumb-item` (291:223) | 16     | 2026-05-27   | R1–R8        | —                                                                                          |
| `_breadcrumb-separator` (52:13919) | 3 | 2026-05-27 | R1–R8        | —                                                                                          |
| `drawer` (74:691)          | 3        | 2026-05-27   | R1–R8        | —                                                                                          |
| `label` (150:569)          | 3        | 2026-05-27   | R1–R8        | —                                                                                          |
| `menu-dropdown-item` (75:7538) | 5    | 2026-05-27   | R1–R8        | —                                                                                          |
| `menu-dropdown` (148:928)  | 3        | 2026-05-27   | R1–R8        | —                                                                                          |
| `input` (49:10806)         | 12       | 2026-05-27   | R1–R8        | —                                                                                          |
| `input-field` (49:10848)   | 4        | 2026-05-27   | R1–R8        | —                                                                                          |
| `select-trigger` (74:757)  | 6        | 2026-05-27   | R1–R8        | —                                                                                          |
| `select-field` (146:3751)  | 4        | 2026-05-27   | R1–R8        | —                                                                                          |
| `combobox-trigger` (75:9166) | 13     | 2026-05-27   | R1–R8        | —                                                                                          |
| `combobox-field` (148:2191) | 4       | 2026-05-27   | R1–R8        | —                                                                                          |
| `_input-otp-slot` (58:17340) | 5      | 2026-05-27   | R1–R8        | —                                                                                          |
| `input-otp` (58:17437)     | 12       | 2026-05-27   | R1–R8        | —                                                                                          |
| `_pagination-item` (59:17863) | 11     | 2026-05-27   | R1–R8        | —                                                                                          |
| `pagination` (59:18253)    | 8        | 2026-05-27   | R1–R8        | —                                                                                          |
| `_item-image` (65:572)     | 1        | 2026-05-27   | R1–R8        | —                                                                                          |
| `item` (65:815)            | 54       | 2026-05-27   | R1–R8        | —                                                                                          |
| `toast` (105:666)          | 5        | 2026-05-27   | R1–R8        | —                                                                                          |
| `table-head` (105:25960)   | 3        | 2026-05-27   | R1–R8        | —                                                                                          |
| `table-cell` (105:29158)   | 47       | 2026-05-27   | R1–R8        | —                                                                                          |
| `_table-row` (124:8531)    | 12       | 2026-05-27   | R1–R8        | —                                                                                          |
| `progress` (110:8283)      | 9        | 2026-05-27   | R1–R8        | —                                                                                          |
| `nav-button` (127:193)     | 8        | 2026-05-27   | R1–R8        | —                                                                                          |
| `nav-panel` (127:353)      | 3        | 2026-05-27   | R1–R8        | —                                                                                          |
| `nav-panel-link` (127:157) | 4        | 2026-05-27   | R1–R8        | —                                                                                          |
| `card` (297:4933)          | 10       | 2026-05-27   | R1–R8        | —                                                                                          |
| `dialog` (266:131)         | 4        | 2026-05-27   | R1–R8        | —                                                                                          |
| `empty` (97:34667)         | 3        | 2026-05-27   | R1–R8        | —                                                                                          |
| `sidebar-menu-1` (95:15354) | 6       | 2026-05-28   | R1–R8        | Fixed: sidebar/active→accent, bgDefaultFg icons→sidebarFg, badge token, spacing primitives |
| `_sidebar-menu-2` (95:15549) | 3      | 2026-05-28   | R1–R8        | Fixed: sidebar/active→accent |
| `sidebar` (95:18202)       | 6        | 2026-05-28   | R1–R8        | Fixed: all token issues + spacing; logo fill override removed (branding asset — no token binding); doc written        |
| `_sidebar-group-label` (95:14510) | 1  | 2026-05-28   | R1–R8        | Clean — no issues |
| `_sidebar-badge` (95:14511) | 1       | 2026-05-28   | R1–R8        | Fixed: sidebarPrimary→brandPrimary on badge fill |
| `button` (12:2893)         | 165      | 2026-05-28   | R1–R8        | Clean — 0 issues; uses Components-collection button/* tokens throughout                    |
| `badge` (107:40465)        | 42       | 2026-05-28   | R1–R8        | Clean — 0 issues across all 9 Variant types × Shape × Size                                |
| `avatar` (60:18486)        | 12       | 2026-05-28   | R1–R8        | R3 fixed: Fallback label → color/surface/muted/foreground; R8 fixed: badge fill override  |
| `_avatar-badge` (60:18573) | 2        | 2026-05-28   | R1–R8        | Clean — 0 issues                                                                           |
| `sheet` (98:57748)         | 2        | 2026-05-28   | R1–R8        | Footer button fills intentional — parent sets root fill on button instances (required)      |
| `slider` (67:9199)         | 6        | 2026-05-28   | R1–R8        | Clean — 0 issues; track/range/thumb tokens all correct                                     |

---

## How to use this file

**When you add a new rule to Component Audit Skill.md:**
1. Add a row to the Rule Changelog with today's date
2. Scan the Component Audit Log — any component last audited before that rule was added gets marked `needs re-audit`
3. Re-audit those components before the next build session

**When you audit a component:**
1. Add or update its row in the Component Audit Log
2. List the highest rule number active at time of audit (e.g. R1–R6)
3. Clear any `needs re-audit` flags that were resolved

**When a new component is built:**
1. Add it to the log immediately after audit, even if no issues were found
2. Record the date so future rule additions can be traced back
