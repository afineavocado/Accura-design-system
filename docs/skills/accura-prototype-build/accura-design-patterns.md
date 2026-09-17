---
name: accura-design-patterns
description: The design patterns this prototype has settled on — page anatomy, create and edit screens, tables, cards, data shape, record masters, known component gaps and floors. Read before building any Accura prototype screen. Companion to accura-prototype-build, which covers how to work rather than what to build.
---

# Accura prototype — design patterns

**What this is.** The decisions the CAPA, Documents, Training and Deviation prototypes have
settled on. Each one replaced something that went wrong, and most exist because a screen was
built without checking what already existed.

**How to use it.** Read the section for the thing you are building *before* writing JSX, not
after. If a pattern here conflicts with what you were about to do, the pattern wins — or you say
out loud why it should not, and the answer goes in this file.

**What it is not.** Not the component library. Components, their props and their tokens live in
`accura-ui/src/components/ui/`, their stories in `accura-ui/src/stories/`, and their written
specs in `docs/component-specs/`. **Always look at the component and its story before this file** —
this records how screens compose them, not what they are.

**Execution rules** — planning, the pre-build gate, validation, server lifecycle — are in
`accura-prototype-build.md`.

---

Decided while building the CAPA, Documents and Training prototypes. Each replaced something
hand-rolled. Follow them; if a screen needs to break one, say so out loud.

## The mistake these mostly prevent

**A component carries its own styling. Dropping it into a context that assumes inheritance
silently overrides that context.** Three separate bugs, one cause:

| Symptom | Cause |
|---|---|
| A required asterisk rendered **black** while every other module's was red | hand-rolled inside a `<Label>`, inheriting the label colour instead of using a token |
| A 12px summary row became **36px tall**, its text full-strength instead of secondary | a ghost `Button` used as a text action — it brings its own colour and height |
| `Workflow: In Approval` clipped to **`Workflow: In…`** with a gap before the chevron | a prefixed label doubled the string inside a fixed-width trigger that clips (`[&>span]:line-clamp-1`) |

When something looks wrong in a shared context, check what the **child** is imposing before
changing the parent.

---

## Page anatomy

Top to bottom, every list screen is the same four bands.

**1 · Shell and navigation**

| Concern | Pattern |
|---|---|
| Sidebar + header | One shared shell per module (`training/training-shell.tsx`, `documents/layout.tsx`). **Never build the sidebar in a page** — CAPA did, four times, and Training was invisible from CAPA until it moved to `prototype/accura/app-sidebar.tsx` |
| Nav items | One `platformNav` array. Adding a module is one line, not one edit per page |
| Active state | Matches the href **and everything under it**, so the module stays lit on detail routes |
| Module tabs | `Tabs variant="line"`, each `TabsTrigger asChild` around a `Link`, `value={pathname}` — real navigation, design-system styling |
| Unbuilt routes | A "not built in this prototype" notice, never a 404. A dead end reads as broken; a notice reads as scoped |

**2 · Module title — in the app header bar**

Pass `title` to `ApplicationHeader`. The bar's left side is otherwise empty, so the title costs
no vertical space there; in page content it costs a whole row.

| | Token | Size / weight | Font |
|---|---|---|---|
| Module name — header bar | `heading/md` | 18px / 600 | **Albert Sans** |
| Record title — detail pages | `heading/lg` | 20px / 600 | **Albert Sans** |
| Card title — `CardTitle` | `heading/sm` | 16px / 600 | Inter |

**Why 18 and not 16:** `accura-decisions.md` — *"at or above 18px is display, below is sans."* A 16px
title is `heading/sm`, deliberately Inter, so it **cannot** be Albert Sans. **Why not 20:** detail
pages use 20px for the record title; the module name should sit below the record in hierarchy.
`<h1>` then inherits `font-heading` from the base rule — no font class needed.

> A module title once vanished from CAPA and Training entirely: its `<h1>` was removed from the
> header on the reasoning that titles belong in page content, without the page-content heading
> ever being added. Check where a title actually lives before removing one.

**3 · Toolbar — search, filters, primary action, one row**

```tsx
<div className="flex w-full flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[var(--spacing-component-sm)]">
    {/* search, then filters */}
  </div>
  <Button asChild className="shrink-0">…</Button>
</div>
```

- **Search flexes, filters are fixed.** `min-w-[240px] flex-1 sm:max-w-[380px]` on the search
  wrapper; `w-[160px]` per `SelectTrigger`. A search on a fixed `basis` cannot shrink, so one
  pixel of overflow wraps the whole row — that happened twice.
- **The action is a sibling of the filter group, not a member.** As a member it drops to its own
  line the moment the filters overflow.
- **`Create` belongs on the toolbar**, not beside the heading — it acts on the list, so it sits
  with the other controls that act on the list.
- **Filter copy names the set**: `All departments`, never `Department: All`. See the clipping
  case above. `Choice` in Documents takes `allLabel` for this; the stored value stays `"All"`, so
  filter logic is untouched and form selects omit it.
- Verified one row at 1500 / 1200 / 1000px in all three modules.

**4 · Summary row — between toolbar and table**

`ListSummary` in `prototype/accura/list-summary.tsx`, on every list.

```tsx
<ListSummary showing={visible.length} total={all.length} noun="training roles" onClear={…} />
```

- **The copy states what is true.** Unfiltered, a count — `8 courses`. Filtered, how many of how
  many — `1 of 8 courses`. Documents once read `3 documents · All records` *while filtered*.
- **`Clear filters` is link-styled** — 12px, `brand/primary` — not a Button, and only present
  when something is filtered.
- `aria-live="polite"` on the count, so filtering is announced.

---

## Create and edit screens

Not previously written down, which is how Create Deviation drifted from CAPA and Training before
being pulled back. All three now agree:

```tsx
<div className="mx-auto flex w-full max-w-5xl flex-col gap-[var(--spacing-layout-sm)]">
  <div className="flex flex-col gap-[var(--spacing-component-sm)]">
    <Button asChild variant="link" className="h-auto w-fit p-0 text-sm no-underline hover:no-underline">
      <Link href={basePath}><ChevronLeft className="size-4" />Back to X</Link>
    </Button>
    <h1 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">
      Create New X
    </h1>
  </div>

  <Card>
    <CardHeader><CardTitle className="text-xl">Section</CardTitle></CardHeader>
    <CardContent className="gap-[var(--spacing-component-lg)]">
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <Label required htmlFor="x">Label</Label>
        <Input id="x" placeholder="…" />
      </div>
    </CardContent>
  </Card>

  <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-component-sm)] pb-[var(--spacing-layout-md)]">
    <Button variant="ghost">Cancel</Button>
    <Button variant="outline">Save as Draft</Button>
    <Button>Submit</Button>
  </div>
</div>
```

| Concern | Rule |
|---|---|
| Width | `max-w-5xl`, centred. A form at full page width has unreadable line lengths |
| Rhythm | `spacing/layout/sm` between the title group, each card, and the footer |
| Title | `text-2xl` in page content — **not** the header bar, which carries the module name. The only screens with two headings |
| Back link | `Button variant="link"` stripped to `h-auto w-fit p-0`, grouped with the title at `spacing/component/sm` |
| Card title | `CardTitle className="text-xl"`. Do not nest your own heading inside `CardTitle` |
| Field | `flex flex-col gap-[var(--spacing-component-sm)]` — 8px between label, control and description. Was `xs` (4px) until 2026-09-15; the library said 4px, every screen copied it faithfully, and it read as the label touching its control. Changed in the stories, the specs and the prototypes together |
| Between fields | **Nothing on `CardContent`.** It already lays out as a column at `spacing/component/lg`. `space-y-*` there stacks margins on top of that gap and silently doubles it to 32px |
| Footer | Right-aligned, outside the card, `Cancel` ghost → `Save as Draft` outline → primary |
| Draft vs submit | `Save as Draft` skips validation; the primary runs it. Two buttons because they are two contracts |

⚠️ **One unresolved difference.** CAPA puts a `<Separator />` between `CardHeader` and
`CardContent`; Training and Deviation do not. `RecordSection` does not either, so the majority is
no separator — but CAPA has not been changed.

---

## Tables and lists

**Default to a table.** Cards earn their place only when the object has an image, a status
needing colour, or a preview. A training role is name + description + two counts — tabular.
Counts belong in **numeric columns**, not footer prose: they sort, they scan, and a `0` becomes
visible. Roles and Courses were both converted from the product's card grid on that reasoning.

**But a table needs rows worth comparing.** Fixed, small, non-sortable sets are lists — two rows
do not need a header. Course detail's `Assessment methods` and `Linked roles` are lists; its
`Assessments` is a table, because rounds accumulate.

**Clickable rows** — the row is a convenience target; **the first cell always carries the real
control.**

```tsx
const onClick = useRowClick<HTMLTableRowElement>(() => router.push(href))
<TableRow className="cursor-pointer" onClick={onClick}>
  <TableCell><Link href={href} className="font-medium text-[var(--color-brand-primary)] hover:underline">{name}</Link>
```

- Helper: `prototype/accura/row-click.ts`. The `closest("a, button")` guard stops a click on the
  inner control firing twice.
- **`<Link>` when it navigates, `<button>` when it opens a panel.**
- **Never** `role="button"` / `tabIndex` / `onKeyDown` on a `TableRow` — that reimplements what
  the inner control does natively and announces the whole row as one target.

**Do not override `TableCell` or `TableHead` in markup.** CAPA did, and it hid three divergences
at once: 6px vertical padding against the component's 16px, 12px text where the default is 14px,
and uppercase headers where the others are sentence case. If a module genuinely needs denser
rows, that is a `density` variant on the component — not markup in one module.

**Pagination**: `TablePagination` + `usePagination` from `prototype/accura/table-pagination.tsx`.
The hook clamps `page` into range when a filtered set shrinks.

---

## Cards

- **Every section card is `Card` / `CardHeader` / `CardTitle` / `CardContent`.** A hand-rolled
  card used `surface/default` where `Card` uses `surface/overlay` — identical in light mode,
  divergent in dark.
- **`CardTitle` is the one section-title token** — `heading/sm`, 16px / 600. Do not introduce a
  second title size.
- **Card padding is 16px** (`spacing/component/lg`), the component default. ⚠️ `Card.md` said
  24px; `card.tsx` and `card.meta.json` said 16px, and the outlier was a **vendored** spec. See
  `accura-decisions.md` **Q12**.
- A table **inside** a card gets its own surface: `radius/md` + `border/default` on `CardContent`
  — **one step below the parent's `radius/lg`**. A table on the page background takes `radius/lg`.

---

## Data

- **One `mock-data.ts` per module.** Typed unions for every status set, plus a
  `Record<Status, BadgeVariant>` map — **status colour is data, never markup.**
- **Derive, never re-type.** `assignedRoles` is a `filter()` over `trainingRoles`. Two
  hand-written copies of the same record drift.
- **Store data, not display.** Timestamps as ISO; views format. A pre-formatted date string can
  neither be sorted nor reformatted.
- Comment *why* a row exists when it demonstrates something — a role with `0` users, a
  self-signed record.

### Dates and times — one format

**Store ISO 8601.** `YYYY-MM-DD` for a date, `2026-09-20T08:45:00Z` for a timestamp. It sorts, it
is unambiguous, and it is the only form a view can reformat. This is the *"store data, not
display"* rule above, stated for the case that keeps breaking it.

| | Format | Example |
|---|---|---|
| Date | `en-US`, short month, numeric day | `Oct 1, 2026` |
| Timestamp | the same date, then 24-hour time, seconds, explicit zone | `Sep 20, 2026, 08:45:00 UTC` |
| Empty | the em dash | `—` |

A **named month** rather than digits: `03/04/2026` reads as two different days depending on which
side of the Atlantic the auditor sits, and these are regulated records. **Seconds and the zone
label** stay on timestamps — Part 11 §11.50 wants the execution time legible. Numeric day rather
than `01`, because a leading zero buys nothing in prose.

Use `en-US`, not `en-GB`: en-GB abbreviates September to `Sept` and en-US to `Sep`, which is why
the same month is spelled two ways today depending on which function rendered it.

> ⚠️ **Not yet applied. Fix when the prototypes are done, in one pass** — it touches four modules
> and two shared components, so doing it mid-build means re-measuring screens that are still
> moving. As of 2026-09-17 the product has four renderings and two storage shapes:
>
> | Where | Renders | Change |
> |---|---|---|
> | Deviations `displayDate` | `Oct 01, 2026` | `day: "2-digit"` → `"numeric"` |
> | Documents `displayDate` | `Oct 1, 2026` | ✓ already correct |
> | Documents `displayTime` | `20 Sept 2026, 08:45` | → `en-US`, add seconds |
> | `RecordAuditDrawer` | `20 Sept 2026, 08:45:00 UTC` | → `en-US` (shared: moves three modules) |
> | Documents empty date | `Not set` | → `—` |
> | CAPA, Change Control | store `"Oct 1, 2026"` | → store ISO |
>
> Change Control's 28 **audit timestamps** were converted to ISO on 2026-09-17; its display dates
> and its seven comment timestamps were not.

---

## Record masters

Cross-module component specs, written for the demo build and confirmed 2026-09-12. Moved here
from `docs/demo-design-contract.md`, which kept scope decisions and pattern specs in one file —
so the patterns went stale without saying so.

**Where a master conflicts with the page-anatomy rules above, the rules above win.** They were
measured against the running prototypes; these were written before three modules existed.
Superseded lines are struck through rather than deleted, so the original decision stays readable.

## 3. Master: PhaseGateStepper

Purpose: show progress, the current gate, and the person whose action moves the record forward.

- Shared anatomy: stage label; completed/current/upcoming visual state; current assignee name and role; concise pending action.
- For Document: Draft → In Review → In Approval → Approved.
- Current-stage copy: `Waiting for Tom Bradley · Reviewer` or `Waiting for Dr. Sarah Chen · QA Approver`; if assigned to the signed-in user, `Your action: Review document`.
- Completed stages show completion through an icon and text. Upcoming stages are visually quiet. Do not use color alone.
- The user-facing term is `Waiting for` or `Assigned to`, not `Blocked by`: waiting for a normal approval is not an error.
- A stage click must not change workflow state or bypass a gate. Only the prescribed successful action advances the demo.
- Reuse the existing Stepper primitive, typography, icons, and tokens. Allow module-specific stage/assignee data rather than duplicating the composition.
- Demo states needed: each happy-path stage current, and completed. Rejection/exception variants are deferred.

## 4. Master: ElectronicSignatureModal

Purpose: provide one consistent signing experience at each prescribed signing gate.

Anatomy in order:

1. Action-specific title: `Sign review approval` or `Sign final approval`.
2. Record context: module, record ID, title, and revision being signed.
3. Read-only signer name/account and role.
4. Explicit meaning of the signature: review approval, final approval, or another meaning already defined by the module's demo path.
5. The established authentication control for the product. Never present a typed display name or checkbox alone as identity authentication.
6. A clear statement of signing intent; a checkbox is a product choice, not proof of regulatory compliance.
7. Secondary `Cancel` and primary `Sign and approve`, with contextual wording for the gate.

On success: show the resulting workflow state and append/display the signature in the shared Audit Trail drawer with signer, execution timestamp including timezone, meaning, and record/revision association. The signing timestamp is assigned on execution, not prefilled as an editable user value. Distinguish a prototype simulation from verified production signing behavior.

For Document, Effective Date belongs to the QA final-approval step. Show it in the approval context/summary without adding a permanently visible date field to every module's signing modal.

Reuse Dialog, Button, Input, and existing authentication/signature patterns. Preserve focus management and keyboard behavior. Design the happy-path signing state and successful result; do not expand into failed-authentication or rejection flows for this demo.

Regulatory reference: 21 CFR 11.50 covers signer name, execution date/time, and signature meaning; 11.70 covers signature-to-record linkage; 11.200 covers signature components and controls. This master is a UI specification supporting those requirements, not a standalone Part 11 compliance certification. Production authentication, linkage, and record controls remain implementation responsibilities.

Sources:
- https://www.law.cornell.edu/cfr/text/21/11.50
- https://www.law.cornell.edu/cfr/text/21/11.70
- https://www.law.cornell.edu/cfr/text/21/11.200

## 4b. Master: the audit trail entry

One treatment, three modules. `components/record-audit-drawer.tsx` renders it for Deviations and
Documents; Training's `history-panel.tsx` renders the same entry inside its own sheet.

Each entry, in this order:

1. **Actor name** — `text-sm font-medium`.
2. **Who and when, one line** — `role · account · timestamp`, `text-xs`, `--color-text-secondary`.
   Timestamp in a `<time dateTime>`, UTC, seconds included.
3. **The action** — `text-sm`, the module's own wording (`Status changed`, `Deviation created`).
4. **The transition, as a `StateChange` pill** — `components/state-change.tsx`. Reads
   `Status  ~~old~~ → new`: the old value struck through in danger text, the new value in the
   direction's tone, the whole thing in a tinted rounded-full border. This mirrors the live
   product's Assessment Audit Trail — it is observed, not invented.
5. **Signature, only when one was taken** — `Signature recorded` badge, then the meaning.

`direction` colours the pill: `forward` success, `backward` warning, `cancel` danger. Training
only moves forward and omits it. Deviations derives it from `lifecycle` indices — a lower index is
backward, `Cancelled` leaves the sequence. **A return rendered in green, with the stage it
returned to struck out in red, reads as an approval.** That is why the prop exists.

Do not print the record ID on every entry: the sheet description already names the record, and
repeating it per row is most of what made the list long.

## 5. Master: RecordDetailLayout

- Full-width shared application shell and page heading above the content.
- PhaseGateStepper spans the detail content above the two columns.
- Desktop columns: fractional tracks calculated from available space after the column gap, rather than two percentage widths plus an overflowing gap. **The current ratio is 70/30** — see the canonical section above; this line records the technique, not the numbers.
- Main column card order: primary record content/file; supporting metadata; references/linked records. Use module-specific content slots in this shared structure.
- Side rail contains the current gate/responsible person/next action and approval route. Signature records and activity history belong only in the Audit Trail drawer. Do not repeat the entire metadata form in the rail.
- Primary task CTA appears once in the shared action area; do not create competing copies in several cards. The master should allow the module's agreed action and label.
- Reuse Card and semantic spacing/typography tokens. Separate cards when they answer different user questions, not for every field. **Card padding is the 16px default** — see *Cards*.
- At widths that cannot support readable columns, stack main content before the audit rail. Do not shrink both columns until names and controls become unreadable.

## 6. Shared shell and listing rules

- Global header always holds notification and account. ~~Module-specific page titles belong in the content heading.~~ **Superseded:** the module title lives in the header bar at `heading/md` — see *Page anatomy*.
- ~~Page heading contains module name and create CTA in the same positions across modules.~~ **Superseded:** `Create` sits on the toolbar, the title in the header bar. Detail screens still show the record title/ID and its contextual action, without duplicate primary CTAs.
- ~~Desktop search/filter group occupies approximately 70–80% of the content-column width.~~ **Superseded:** the toolbar is full width — the cap forced Documents' filters onto a second row. Search flexes to 380px; filters are fixed. See *Page anatomy · Toolbar*.
- On narrow screens controls may wrap and use the available width. Keep labels readable rather than forcing the desktop percentage.
- The table can use the full content width. Keep search/filter logically grouped with the table, with consistent vertical spacing across modules.
- Record name is always the primary detail link; support keyboard focus and normal link behavior. Hovering a row gives a subtle shared surface highlight, not a workflow change.
- If the entire row is clickable in a module, its record link still exists; action-menu clicks must not trigger row navigation. Prefer the same row interaction policy across all modules.
- Row actions use the same menu trigger, placement, and ordering convention. Expose only actions on the agreed demo path; no speculative menu items.
- Preserve one shared listing for the current Document demo. Do not add Effective/My Work/All Records segmented views as part of this standardization.
- Reuse existing Accura design-system components and tokens. Maintain one composition per master, configured with module data.

## 7. Definition of done for future master implementation

- One reusable master per pattern, with configurable labels/content/assignees rather than page-specific copies.
- Demonstrate the masters using the existing Document happy path first.
- Verify stage labels, current assignee, signing context/result, 70/30 layout, toolbar width, record link, menu, and row hover.
- Keep non-demo questions out of the active implementation plan. Prototype validation covers the intended demo navigation and basic component accessibility, not an exhaustive exception matrix.

## Known component gaps — hand-rolled, and why

Patterns the design system cannot express, hand-rolled and logged so the next person finds a
decision rather than a mystery — not a licence to hand-roll anything else.

**This list is maintained, not closed. Add to it the moment you hand-roll something.** It said
"two" until 2026-09-16, while a third had been rendering in Training for weeks — and the audit
trail was redesigned from scratch because a stated count reads as a complete inventory. If you
hand-roll a pattern and do not log it here, the next agent will not find it: private helpers in
module files are invisible to every documented lookup path.

**Segmented control** — *choose one of N, all options visible, and the choice changes the form.*

- Built as `Button`s with `role="radio"` + `aria-checked`, `variant` swapped for state. See the
  Automatic Assessment Trigger card in `training/courses/new/page.tsx`. **Still the only use.**
- **Not `ButtonGroup`** — its spec says the actions it groups are *"mutually independent"*. It
  groups actions, not choices.
- ⚠️ **A `ToggleGroup` was built for Create Deviation on 2026-09-15 and removed the same day.**
  Pills there were the wrong call: four of them in a column read as a wall of buttons, and a plain
  `RadioGroup` is what the form actually wanted. **The trigger for building this component is a
  choice that *restructures the form beneath it*, not simply a choice with few options.** Ordinary
  single-select fields take `RadioGroup` or `Select`.

**State change pill** — *`Status  ~~old~~ → new`, the audit trail transition.*

- **No longer hand-rolled, and no longer a gap** — `components/state-change.tsx`, shared by the
  audit drawer and Training's history panel. Logged here because it *was* one, privately, inside
  `training/history-panel.tsx`, and that is what made it invisible. Anatomy in §4b.

**Vertical section-nav rail** — *icon-only stack, fixed to the edge, with a current item.*

- Hand-rolled in `change-control/[id]/page.tsx` (`ScrollToSectionNav`). **Not `ButtonGroup`** — its
  spec groups actions that are *"mutually independent"*, and this is navigation with a **current**
  item (`aria-pressed`). The same distinction the segmented control makes above: ButtonGroup groups
  actions, not choices.
- It does borrow ButtonGroup's treatment, deliberately: `radius/md` container, 1px border, a
  separator between children. The buttons are ghost `Button`s, so focus, hover and disabled come
  from the system rather than from hand-written classes.
- Active state is `surface/brand/subtle` — **not** `status/success/subtle`. Being on a section is
  not a success.
- Closing the gap means a real component: a vertical nav rail whose items have a selected state.
  One use so far.

**Row overflow menu** — *View / Edit / Delete on a table row.*

- Built on raw `@radix-ui/react-popover` in Change Control, and again as `settings/row-menu.tsx` in
  Chi's Settings module, whose own log calls it prototype-only. `RecordRowAction` only opens a
  record, so it does not cover this.
- **Two modules have now hand-rolled it.** That is the threshold Settings' log itself names: if a
  second screen needs it, it becomes a `DropdownMenu` in `components/ui/`.
- ⚠️ Change Control's copy was removed on 2026-09-17 when the actions column was dropped, so the
  live example is Settings'.

**Field wrapper for `Select`** — *label + required + error, the way `ComboboxField` does it.*

- `ComboboxField` bundles label, description, required and invalid; `Select` has no equivalent, so
  every form writes its own `SelectField`. Change Control's create screen has one.
- Field-level error text has no shared component either — `FieldError` is local to that file, and
  `deviations/new` has no validation at all, so there is no house pattern to copy.

**Combobox option with a qualifier** — *`Amit Kothari · Quality Assurance` on one line.*

- `ComboboxOption.label` is a plain string, rendered in both the list item and the chip, so name
  and qualifier cannot take different weight.
- Closing it means an optional `sublabel`: beneath the label in the list, omitted from the chip,
  matched by the filter. Raised and deferred 2026-09-14.

---

## Floors

| Rule | Why |
|---|---|
| Nothing below **12px** | `label/sm` / `body/xs` is the floor. `text-[10px]` and `text-[11px]` were both found and removed |
| Albert Sans starts at **18px** | the base layer applies `font-heading` to `h1`–`h3`, so anything smaller needs `font-sans` or it silently violates the theme. `CardTitle` renders a `div` and is safe by construction |
| Spacing on the 4px scale | `spacing/component/*` = 2·4·8·12·16·24·32. `px-2.5`, `p-5` and `p-10` were all found and removed |
| No decorative strokes | there is no timeline component in Accura, and `border-l-2` already means *selected row* (`table.tsx:78`) |

## Shared prototype components

Anything used twice lives in `prototype/accura/`, not in a page:

`app-sidebar.tsx` · `row-click.ts` · `table-pagination.tsx` · `list-summary.tsx` ·
`capa/capa-header.tsx` · `components/state-change.tsx`

**A convention that lives only as a local helper cannot be reused; it gets reinvented.**
`RequiredLabel` existed as six identical private helpers, invisible from outside — which is how
Documents came to write its own and get the colour wrong. It is now a `required` prop on `Label`.
