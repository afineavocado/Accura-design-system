# Create New CAPA

## Page Content

### Navigation

- Page section: `CAPA`
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
- Action button: `+ Add Action`

### Page Actions

- `Cancel`
- `Save as Draft`
- `Submit`

## Component Map

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

## Token Map

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

## Navigation Behavior

```text
/prototype/accura/capa
  Create CAPA -> /prototype/accura/capa/new

/prototype/accura/capa/new
  Back to CAPAs -> /prototype/accura/capa
```
