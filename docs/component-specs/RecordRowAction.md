# RecordRowAction

The last column of a record listing. Renders one ghost icon button that opens the row's record, and
pins itself to the right edge of the scrollport when the table is wider than its container. Two
exports: `RecordRowAction` (the cell) and `RecordRowActionHeading` (its header cell).

> **Source: the code, not Figma.** This component has no Figma node and never had one — it was
> written in the prototype, used by two modules, and promoted to `components/ui/` on 2026-09-18.
> Every token below was read from `record-row-action.tsx`. The three-stage generation process in
> `docs/machine-readable/generation-rules.md` opens with a Figma inspection, which is not available
> here and is not a blocker: values come from the code.

---

## Variant Matrix

None. The component takes no variant props — its two appearances are a **response to the table it
sits in**, not a choice the caller makes.

| Appearance | When | What changes |
|---|---|---|
| Inline | the table fits its container | a plain cell with a centred ghost button |
| Pinned | the table overflows horizontally | the cell sticks to the right edge on an overlay surface with a shadow, and on hover-capable pointers it is revealed by row hover or focus |

The switch is read from `useTableOverflow()`, the shared hook in `components/ui/table.tsx`. A caller
cannot force either appearance, and that is deliberate: two listings side by side would otherwise
disagree about whether the action floats.

---

## Sizes

One size, derived rather than chosen:

| Property | Token |
|---|---|
| Column `width` / `min-width` | `button/size/button-height-default` plus twice `spacing/component/md` |
| Cell padding | `spacing/component/md` |
| Button | `Button` `size="icon"` `variant="ghost"` — height is `button/size/button-height-default` |
| Icon | lucide `Eye`, inheriting the Button's icon size |

That resolves to 40 + 12 + 12 = **64px** today. The column is exactly as wide as the button plus its
padding, so the pinned overlay covers the cell and nothing else.

---

## Component Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `href` | `string` | required | Where the row's record lives. Rendered by `next/link` |
| `label` | `string` | required | The accessible name. Also the `title` — the icon has no visible text |

`RecordRowActionHeading` takes no props.

---

## Structure

```
RecordRowAction  → TableCell[data-record-row-action]
  └─ div[data-record-action-container]
       └─ Button variant=ghost size=icon asChild
            └─ Link href
                 └─ Eye (aria-hidden)

RecordRowActionHeading → TableHead scope=col
  └─ span.sr-only "Open record"
```

The two `data-` attributes carry no styling of their own. They exist so a screen audit can find
every instance of the pattern in rendered DOM, which is how the two hand-rolled copies in the
prototype were found.

---

## Token Bindings

### Cell — always

| Property | Token |
|---|---|
| `width` / `min-width` | `button/size/button-height-default` + 2 × `spacing/component/md` |
| `padding` | `spacing/component/md` |

### Container — pinned only

| Property | Token |
|---|---|
| `background` | `color/surface/overlay` |
| `color` | `color/surface/overlay/foreground` |
| `padding` | `spacing/component/md` |
| `box-shadow` | `shadow/md` |

`color/surface/overlay` and its `/foreground` are a **paired surface** — never set one without the
other. The container floats above rows whose background it does not control, which is exactly the
case the pairing rule exists for.

### Heading — pinned only

| Property | Token |
|---|---|
| `background` | `color/surface/raised` |

The heading pins to `surface/raised` rather than `surface/overlay` because it sits in the header
row, which already renders `surface/raised`; matching it is what makes the pin invisible until a
row scrolls under it.

---

## Accessibility

| Property | Value |
|---|---|
| Role | native `<a>` inside `<td>` — no added role |
| Accessible name | the `label` prop, as `aria-label` and `title`. The `Eye` icon is `aria-hidden` |
| Header | `<th scope="col">` containing visually hidden text `Open record`, so the column is announced rather than read as blank |
| Focus indicator | `Button`'s own ring — not suppressed by the hover reveal |
| Keyboard | Tab reaches the link in row order. `tr:focus-within` reveals the pinned cell, so tabbing to it never focuses something invisible |
| Touch | the hover reveal is behind `@media (hover: hover) and (pointer: fine)`. Coarse pointers always see the action |

**The hover reveal is progressive enhancement and must stay that way.** The cell renders at
`opacity-100` and `pointer-events-auto`; only a fine, hovering pointer opts into hiding it. Inverting
that — hiding by default and revealing on hover — is what makes an action unreachable by touch and
keyboard, and it is the reason this component exists rather than a plain cell.

---

## Behavior

| Trigger | Result |
|---|---|
| Table narrower than its container | inline cell, no sticky, no overlay, no reveal |
| Table wider than its container | cell sticks right at `z-10`, overlay surface and shadow applied |
| Row hover, fine pointer | pinned cell fades in |
| Focus inside the row | pinned cell fades in, via `tr:focus-within` |
| Click the link | `event.stopPropagation()` — the row's own click handler does not also fire |

That last row is the one to keep. These listings make the whole row clickable with `useRowClick`;
without the stop, opening the record would fire the row handler as well and the two could disagree
about the destination.

No motion tokens are bound. The reveal is an opacity change with no declared transition.

---

## Usage Rules

- Use it as the **last column** of a record listing, paired with `RecordRowActionHeading` in the
  header row. One without the other leaves the columns misaligned.
- **One action only.** This is the *view the record* affordance. A row needing two or more actions
  needs an overflow menu, which the system does not have — see Open Questions.
- The `label` must name the record, not the verb alone: `Open SOP-002 · v3.0`, not `Open`. A screen
  reader listing the links on the page otherwise reads the same word once per row.
- It must not be the only route into the record. The record's name in the first column is the
  primary link; this is a convenience at the far edge of a wide table.

---

## Best Practice

### Use cases

- A document or record registry wide enough to scroll horizontally, where the row's name has
  scrolled out of sight by the time the reader reaches the right edge
- A folder listing whose columns vary with content, so overflow cannot be predicted at design time
- Any listing already using `useRowClick`, where a visible affordance is needed to say the row is
  openable

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| One row action, and the table may overflow | `record-row-action` | a bare `Button` in a `TableCell` |
| One row action, table can never overflow | a `Button` in a `TableCell` | `record-row-action` — the hook and overlay buy nothing |
| Two or more row actions | an overflow menu | `record-row-action` — it renders exactly one |
| The action changes the record rather than opening it | a `Button` in the row, labelled with the verb | `record-row-action` — the eye icon means *view* |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| A hand-rolled sticky cell in a module | `RecordRowAction` — two modules had one before this was promoted |
| `RecordRowAction` without `RecordRowActionHeading` | both, in the same table |
| `label="Open"` | `label="Open <record name>"` |
| Hiding the cell by default and revealing on hover | render visible; let the hover media query opt into hiding |
| Overriding the column width to fit more columns | leave it — it is sized to its button |

---

## Open Questions

**There is still no overflow menu in the system.**

`accura-design-patterns.md` logs "no row overflow menu" as a gap, and two modules hand-rolled one
before this component existed. `RecordRowAction` renders exactly one action and does not close that
gap. If a listing needs *Open · Duplicate · Archive*, there is nothing to reach for.

Questions to answer:
- Does the prototype need more than one row action anywhere, or is one enough for every listing?
- If a menu is built, does it replace this component, or sit beside it as a second column?

**The pinned appearance has never been audited at 390px.**

Both consumers were checked on desktop. The sticky cell plus overlay on a narrow viewport, where
every table overflows, is the case most likely to look wrong and has not been measured.
