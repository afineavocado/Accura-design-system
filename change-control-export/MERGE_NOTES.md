# Change Control — Merge Notes

## 1. Drop-in folder

Copy `change-control/` as-is into the target repo at:

```
src/app/prototype/accura/change-control/
```

It's self-contained (5 files: the list page, `[id]` detail page, `new` create/edit form,
`mock-data.ts`, and `change-control-header.tsx`). It only imports shared design-system
components that should already exist in the main prototype (Alert, Avatar, Badge, Button,
Card, Checkbox, DatePicker, Dialog, Input, Label, Select, Separator, Sheet, Sidebar,
Stepper, Table, Textarea, Tooltip, plus `app-sidebar.tsx`) — nothing else needs copying.

## 2. Two shared files need a manual merge (do NOT overwrite)

Two files outside the `change-control/` folder picked up small, additive changes needed
for Change Control's badges and signature-dialog borders. If the main prototype already
has its own `tokens.css` / `badge.tsx`, don't replace them wholesale — just add these
pieces. Full reference copies of both files (as they stand in this build) are included
here as `tokens.css.reference` and `badge.tsx.reference` in case a diff is easier than
copy-pasting the snippets below.

### `src/app/tokens.css`

Add this block wherever the file's "Accura-only tokens" section lives (or create one) —
all of it is additive, nothing here replaces an existing token:

```css
/* --- Accura-only tokens (not present in Agentic) --- */
/* Orange ramp — exists in Figma primitives (color/orange/50, /300, /700) but was
   unmapped. Surfaced here for the Change Control "Impact Assessment" status badge
   (badge-status-CC, node 6780-9358). */
--color-orange-50: #fef6ee;
--color-orange-300: #f7b27a;
--color-orange-700: #b93815;
--color-border-info: #8ec5ff;
/* Referenced by every Change Control e-sign dialog's "Record" panel border and by
   the Impact Assessment card's active/assessing border, but never generated —
   var(--color-border-brand) silently resolved to nothing. Value confirmed against
   the Impact Assessment card's active-state stroke in Figma (node 6780-7449):
   #008852, same as color/brand/primary. */
--color-border-brand: #008852;
```

(The violet ramp and `--color-text-tertiary` sitting next to this block in the reference
file are pre-existing / used by CAPA, not Change Control — safe to skip if the target repo
already has them.)

### `src/components/ui/badge.tsx`

In the `variant` map inside `badgeVariants`, add the `orange` variant (used for the
"Impact Assessment" status badge):

```ts
orange:
  "bg-[var(--color-orange-50)] border-[var(--color-orange-300)] text-[var(--color-orange-700)]",
```

And make sure the existing `success` and `blue` variants use the border tokens (small
edit if the target file doesn't already wire these):

```ts
success:
  "bg-[var(--color-status-success-subtle)] border-[var(--color-border-success)] text-[var(--color-status-success-subtle-foreground)]",
blue:
  "bg-[var(--color-status-info-subtle)] border-[var(--color-border-info)] text-[var(--color-status-info-subtle-foreground)]",
```

## 3. Status badge → variant mapping

`changeControlStatusVariant` in `mock-data.ts` (already included, nothing to do) maps:

| Status | Badge variant |
|---|---|
| Draft | default |
| Impact Assessment | orange |
| QA Approval | blue |
| Action in Progress | warning |
| Pending Closure | dashed |
| Final QA Approval | violet |
| Closed | success |

## 4. After merging

- Run `npx tsc --noEmit --pretty false` — should be clean.
- Visit `/prototype/accura/change-control` and click through all 7 seed records
  (`CC-2026-001` … `CC-2026-007`) to confirm every status badge renders with its
  correct color and every section (Details / Affected Departments / Change Actions /
  Evidence) shows the pale-green header consistent with the rest of the target prototype.
- Full behavior spec, decisions, and known-open questions: see `backlog.md` at the
  repo root of the source project (not included in this export — ask for it if needed).
