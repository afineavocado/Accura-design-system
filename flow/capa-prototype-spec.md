# CAPA Prototype Specification

This document is the single source of truth for CAPA prototype scope, copywriting, mock data, routes, and supported interactions.

## Prototype Scope

### Designed detail states

| CAPA status | Listing | Detail page | Treatment |
|---|---|---|---|
| Draft | Available | Available | Use the approved Draft design. |
| In Review | Available | Available | Use the approved In Review detail design and review actions. |
| In Approval | Available | Available | Reuse the In Review layout. Change only the status badge and current Stepper stage. |
| Action in Progress | Available | Not available | Listing-only record until a detail design is supplied. |
| Final Approval | Available | Not available | Listing-only record until a detail design and badge treatment are supplied. |
| Close | Available | Not available | Listing-only record until a detail design is supplied. |

Listing-only records must not open the In Review detail UI as a substitute.

## Routes and Navigation

```text
/prototype/accura/capa
  Create CAPA -> /prototype/accura/capa/new
  Supported CAPA ID / View CAPA -> /prototype/accura/capa/[id]

/prototype/accura/capa/new
  Back to CAPAs -> /prototype/accura/capa

/prototype/accura/capa/[id]
  Back to CAPAs -> /prototype/accura/capa
  View audit trail -> Audit Trail Record sheet
  Approve & Sign -> Electronic Signature dialog
```

Global navigation copy:

- Dashboard
- CAPA
- Settings
- Logout

## Canonical Mock Data

The table below is the product-copy source of truth. The prototype's executable `mock-data.ts` should mirror it.

### CAPA Listing Records

| CAPA ID | Title | Status | Detail support | Due date | Owner | QA approver | Source | Source ID |
|---|---|---|---|---|---|---|---|---|
| CAPA-0003 | Draft CAPA | Draft | Designed | Oct 1, 2026 | Sarah Johnson | Sarah Johnson | Risk Assessment | RA-2026-0012 |
| CAPA-0005 | Test abc | In Review | Designed | Oct 1, 2026 | Sarah Johnson | Sarah Johnson | Risk Assessment | RA-2026-0012 |
| CAPA-0006 | Test abc | In Approval | Reuses In Review layout | Oct 1, 2026 | Sarah Johnson | Sarah Johnson | Risk Assessment | RA-2026-0012 |
| CAPA-0007 | Action follow-up | Action in Progress (1/2) | Listing only | Oct 15, 2026 | Sarah Johnson | Sarah Johnson | Risk Assessment | RA-2026-0012 |
| CAPA-0008 | Final review | Final Approval | Listing only | Oct 20, 2026 | Sarah Johnson | Sarah Johnson | Risk Assessment | RA-2026-0012 |
| CAPA-0009 | Closed CAPA | Close | Listing only | Sep 30, 2026 | Sarah Johnson | Sarah Johnson | Risk Assessment | RA-2026-0012 |

Team labels shown below people in the listing:

- Owner team: `QA`
- QA approver team: `QA`

### Canonical Detail Record

| Field | Value |
|---|---|
| CAPA ID | CAPA-0005 |
| Status | In Review |
| Title | Test abc |
| Source | Risk Assessment |
| Linked Source | RA-2026-0012 — Equipment f... |
| Type | Corrective Action |
| Department | Manufacturing |
| Owner | Sarah Johnson (QA) |
| QA Approver | Sarah Johnson (QA) |
| Raised By | auth0\|6a7d4c2ce723991a0af... |
| Date Raised | 2026-09-02 |
| Due Date | 2026-10-01 |

### Canonical Action Item

| Field | Value |
|---|---|
| Action count | 1 action |
| Title | Action 1 |
| Description | asdad |
| Status | Accepted |
| Owner | Sarah Johnson (QA) |
| Due date | 2026-09-16 |

### Signer Identity

| Field | Value |
|---|---|
| Full name | Sarah Johnson |
| Email | sarah.johnson@accura.one |
| Role at sign-off | QA Approver |
| Timestamp UTC preview | 2026-09-04 09:42:18 UTC |

The role and timestamp are previews before submission. A production record would store the server-side values captured at submit time.

### Audit Records

Audit record count: `2`

| Field | Record 1 | Record 2 |
|---|---|---|
| Initials | SJ | SJ |
| User | Sarah Johnson (QA) | Sarah Johnson (QA) |
| Timestamp | 2026-09-02 11:15:04 UTC | 2026-09-04 09:42:18 UTC |
| Activity | Created CAPA Draft record from linked RA-2026-0012 | Approved CAPA review with electronic signature |
| Hash | SHA256:646nh....4b12 | SHA256:82kmp....9f31 |
| Verification status | Verified | Verified |

## Status Badges

Use the Accura Badge component. Status badges are non-interactive and pill-shaped. Prototype pages select the component variant and must not override badge colors.

| CAPA status | Badge configuration | State intent |
|---|---|---|
| Draft | `variant="secondary" shape="pill" size="md"` | Neutral draft state |
| In Review | `variant="warning" shape="pill" size="md"` | Review requires attention |
| In Approval | `variant="blue" shape="pill" size="md"` | Provisional unique color until the final design is confirmed |
| Action in Progress | `variant="warning" shape="pill" size="md"` | Active action work with progress count |
| Final Approval | `variant="default" shape="pill" size="md"` | Distinct primary treatment not used by another CAPA status |
| Close | `variant="success" shape="pill" size="md"` | Completed or closed state |

## CAPA Listing

### Filters and Actions

- Search placeholder: `Search CAPA ID, title, or source...`
- Status filter default: `Status: All`
- Source filter default: `Source: All`
- Primary action: `Create CAPA`

### Columns

- CAPA ID
- Title
- Status
- Due date
- Owner
- QA approver
- Source
- Row action

### Pagination

- Default page size: `10`
- Previous and Next navigation
- Result count reflects the filtered records

### Detail Availability

- Draft, In Review, and In Approval records can open a detail page.
- Action in Progress, Final Approval, and Close remain visible in the listing but do not open a detail page yet.

## Create New CAPA

### Page Header

- Back action: `Back to CAPAs`
- Page title: `Create New CAPA`

### CAPA Details

All fields are required.

| Field | Control | Initial value or placeholder | State |
|---|---|---|---|
| Title | Text input | `Enter title` | Enabled |
| Type | Select | `Corrective Action` | Enabled, preselected |
| Source | Select | `Select CAPA source` | Enabled |
| Source Link | Select | `Select source link` | Disabled until a source is selected |
| Department | Select | `Select department` | Enabled |
| QA Approver | Select | `Select QA approver` | Enabled |
| Owner | Select | `John Doe (Owner)` | Enabled, preselected |
| Due Date | Date picker | `Select due date` | Enabled |

### Actions

- Section title: `Actions`
- Count: `0 actions`
- Supporting text: `No actions added yet. Add one or more actions with a description, owner and due date. All fields are required for each action.`
- Action: `+ Add Action`

### Page Actions

- `Cancel`
- `Save as Draft`
- `Submit`

The current prototype does not persist a newly created CAPA into the listing.

### Component Map

| Visible element | Accura design-system component | Configuration |
|---|---|---|
| Application navigation | `SidebarProvider` + `Sidebar` | Default desktop sidebar; CAPA item active |
| Back to CAPAs | `Button` | `variant="link"`, leading `ChevronLeft`, navigates to the CAPA listing |
| Page and section headings | Semantic headings | `h1` for page title, `CardTitle` for card sections |
| CAPA Details container | `Card` | Form composition with `CardHeader` and `CardContent` |
| Header divider | `Separator` | Horizontal |
| Title | `Input` | Standard text input |
| Type | `Select` | Fixed options; Corrective Action selected |
| Source | `Select` | Fixed source options |
| Source Link | `Select` | Disabled until Source has a value |
| Department | `Select` | Fixed department options |
| QA Approver | `Select` | Fixed approver options |
| Owner | `Select` | John Doe selected |
| Due Date | `DatePicker` | `type="input"` with calendar icon |
| Actions container | `Card` | Action-section composition |
| Add Action | `Button` | `variant="outline"` |
| Cancel | `Button` | `variant="ghost"` |
| Save as Draft | `Button` | `variant="outline"` |
| Submit | `Button` | Default primary button |

### Token Map

| UI role | Token |
|---|---|
| Main page canvas | `color/background/muted` |
| Top header | `color/background/default` |
| Primary page text | `color/background/default/foreground` |
| Supporting text and action count | `color/text/secondary` |
| Required markers | `color/text/invalid` |
| Card surface | `color/surface/overlay` |
| Card text | `color/surface/overlay/foreground` |
| Card and section borders | `color/border/default` |
| Input and select backgrounds | `color/input/bg` |
| Input and select borders | `color/input/border` |
| Input placeholders | `color/input/placeholder` |
| Disabled Source Link control | `color/surface/muted`, `color/border/disabled`, `color/text/disabled` |
| Keyboard focus | `color/ring` and `color/border/focus` |
| Primary Submit action | Button component tokens resolving to `color/brand/primary` and its paired foreground |
| Sidebar | Scoped `color/sidebar/*` tokens |
| Card radius | `radius/lg` |
| Form-control radius | `radius/md` |
| Card padding | `spacing/component/xl` |
| Field and card gaps | `spacing/component/lg` and `spacing/layout/sm` |

---

## CAPA Detail — In Review

### Page Header

- Back action: `Back to CAPAs`
- CAPA title: `Test abc`
- Action: `View audit trail`

### Workflow Progress

| Stage | Supporting text | State |
|---|---|---|
| Draft | Completed | Completed |
| In Review | by Sarah Johnson (QA) | Current |
| In Approval | by Sarah Johnson (QA) | Upcoming |
| Action in Progress | 0/0 Actions Submitted | Upcoming |
| Final Approval | by Sarah Johnson (QA) | Upcoming |
| Close | by Sarah Johnson (QA) | Upcoming |

### Review

`QA reviews the CAPA plan and can approve or reject it. Both require an electronic signature.`

Review actions:

- `Reject`
- `Approve & Sign`

## CAPA Detail — In Approval

The In Approval state reuses the In Review detail page without introducing a new layout.

Only these elements change:

- CAPA status: `In Approval`
- Stepper: In Review becomes completed
- Stepper: In Approval becomes current

All other visible content remains unchanged until an In Approval design is supplied.

## Audit Trail Record

### Sheet Header

- Title: `Audit Trail Record`
- CAPA ID: `CAPA-0005`
- Close control accessible name: `Close`

### Presentation

- Opens as a right-side Sheet above the CAPA detail page.
- The background page is dimmed while the Sheet is open.
- Audit records are separated by a divider.
- Each record shows an initials avatar and verification status.

### Footer

- Primary action: `Export Audit Report`

## Electronic Signature

The Dialog gates the In Review to In Approval state change. Nothing changes until the signature is submitted.

### Trigger

| Source | Control | Signature meaning |
|---|---|---|
| CAPA Detail — In Review | `Approve & Sign` | `Approve CAPA review` |
| CAPA Detail — In Review | `Reject` | `Reject CAPA review` |

### Header

- Title: `Electronic Signature — 21 CFR Part 11`
- Approve description: `Verify your identity to approve this regulated record.`
- Reject description: `Verify your identity to reject this regulated record.`
- Close control accessible name: `Close`

### Record Summary

| Label | Value |
|---|---|
| Record | CAPA-0005 |
| Signature meaning | Approve CAPA review |

### Re-authentication

- Label: `Re-enter Password`
- Placeholder: `Re-enter your password`
- Input type: password
- Passwords must never be pre-filled or remembered.

### Attestation

Unchecked by default:

`By entering my credentials, I confirm that this review complies with formal requirements as equivalent to my handwritten signature.`

### Footer

- Secondary action: `Cancel`
- Primary action: `Submit`

Cancel, the close control, Escape, or the backdrop dismisses the Dialog without changing the CAPA.

### Successful Approval

1. The Dialog closes.
2. CAPA-0005 moves from In Review to In Approval.
3. The Stepper marks In Review as completed.
4. The Stepper marks In Approval as current.

### Proposed Copy — Not Yet Designed

- Empty password: `Enter your password to sign.`
- Wrong password: `That password is not correct. Try again.`
- Repeated failures: `Too many attempts. Your signature was not recorded.`
- Missing attestation: `Confirm the attestation to sign.`
- Loading action: `Signing…`
- Confirmation toast: `Signed. CAPA-0005 moved to In Approval.`

The Reject destination remains unresolved. Confirm it against `Workflow/State Machine.png` before implementing the Reject transition.

## Reference Asset

- Workflow diagram: `Workflow/State Machine.png`
