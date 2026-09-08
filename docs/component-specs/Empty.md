# Empty

A placeholder component displayed when a list, panel, or section has no content. Combines an icon container, a title, a description, and optional action buttons to communicate the empty state and guide the user toward a next step. Three container Variants control whether the empty state brings its own visual boundary or inherits its surface from the parent context. No underlying Radix primitive — purely presentational.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `empty` | `97:34667` | 3 | Empty state placeholder — icon + title + description + actions |

---

## Variant Matrix

### `empty` — `Variant`

| Property | Options | Default |
|---|---|---|
| `Variant` | `Default`, `Outline`, `Background` | `Default` |

`Variant(3) = 3 variants`

---

## Variant Guide

**`Variant=Default`** — No fill, no stroke, no radius. The component is transparent — it inherits whatever surface it sits on. Use when the empty state lives inside an existing container (a `card`, a `sheet`, a `dialog`) that already provides the background and border. The component provides only the content, not the shell.

**`Variant=Outline`** — No fill, `color/border/default` stroke, `radius/lg`. Creates a bordered enclosure around the empty state. Use when the empty state occupies a clearly defined area that needs its own boundary — a bordered list zone, a data table with no rows, a dashed dropzone area.

**`Variant=Background`** — `color/background/subtle` fill, no stroke, `radius/lg`. A soft tinted container. Use when the empty state is the primary content of a page section or sidebar that has no other framing — the subtle tint grounds the component on the canvas without a hard border.

---

## Structure

```
empty                           — COMPONENT, V AUTO-LAYOUT, CENTER×CENTER
                                  padding (all sides): spacing/component/2xl (32px)
                                  gap: spacing/component/lg (16px)
                                  fill / stroke / radius: per Variant (see Token Bindings)

  ├─ header                     — FRAME, V AUTO-LAYOUT, CENTER×CENTER
  │                               gap: spacing/component/sm (8px)
  │
  │    ├─ media                 — FRAME, H AUTO-LAYOUT, CENTER×CENTER
  │    │                           36×36px · radius: radius/lg
  │    │                           fill: color/background/subtle (Default, Outline)
  │    │                           fill: color/surface/default (Background)
  │    │    └─ folder           — INSTANCE (icon placeholder)
  │    │         └─ Icon        — VECTOR, stroke: color/background/default/foreground
  │    │
  │    ├─ title                 — TEXT, fill: color/background/default/foreground
  │    └─ description           — TEXT, fill: color/text/secondary

  └─ content                    — FRAME, H AUTO-LAYOUT, CENTER×CENTER
                                  gap: spacing/component/sm (8px)
       ├─ btn-primary           — INSTANCE (button, Primary)
       └─ btn-outline           — INSTANCE (button, Outline)
```

---

## Token Bindings

### Root container — per Variant

| Variant | Fill | Stroke | Radius |
|---|---|---|---|
| `Default` | — (transparent) | — | — |
| `Outline` | — | `color/border/default` | `radius/lg` |
| `Background` | `color/background/subtle` | — | `radius/lg` |

### Root container — spacing

| Property | Token | Value |
|---|---|---|
| Padding (all sides) | `spacing/component/2xl` | 32px |
| Gap (header → content) | `spacing/component/lg` | 16px |

### `header`

| Layer | Property | Token | Value |
|---|---|---|---|
| root | Gap | `spacing/component/sm` | 8px |
| `media` | Fill (Default, Outline) | `color/background/subtle` | Subtle tint |
| `media` | Fill (Background) | `color/surface/default` | Component surface — lifts slightly above the subtle bg |
| `media` | Radius | `radius/lg` | 12px |
| `media` | Dimensions | — | 36×36px |
| `folder > Icon` | Stroke | `color/background/default/foreground` | Foreground on default canvas |
| `title` | Fill | `color/background/default/foreground` | Primary text |
| `description` | Fill | `color/text/secondary` | Supporting text |

> **`media` fill changes between Variants:** In `Default` and `Outline`, the icon container sits on a neutral or bordered surface — `color/background/subtle` provides a quiet tint. In `Background`, the whole component already uses `color/background/subtle` as its fill, so the icon container steps up to `color/surface/default` to remain visually distinct.

### `content`

| Property | Token | Value |
|---|---|---|
| Gap | `spacing/component/sm` | 8px |

### `btn-primary` / `btn-outline` (sub-components)

Fills, strokes, and label colors are owned by the button source component — never override them from within `empty`.

| Layer | Token |
|---|---|
| `btn-primary` fill | `button/primary/bg/bg` |
| `btn-outline` fill | `button/outline/bg/bg` |
| `btn-outline` stroke | `button/outline/border/default` |

---

## Behavior

### Architecture

`empty` is a **purely presentational component** with no underlying Radix primitive or built-in state. It is conditionally rendered by the parent whenever data is absent.

```tsx
// Typical conditional render pattern
{items.length === 0 && (
  <EmptyState
    icon={<FolderIcon />}
    title="No Projects Yet"
    description="Get started by creating your first project."
    primaryAction={{ label: "Create Project", onClick: handleCreate }}
    secondaryAction={{ label: "Import Project", onClick: handleImport }}
  />
)}
```

### When to show

Render the empty state when:
- A list, table, or feed returns zero items
- Search or filter returns no results
- An inbox, calendar, or queue has no entries
- The user has not yet performed a first action (onboarding state)

Do not show the empty state while data is loading — use a skeleton or loading indicator instead. Replace the empty state immediately when the first item is created.

### Icon customisation

The `media` frame holds a single icon instance (`folder` by default). Replace it with an icon appropriate to the context:

| Context | Icon |
|---|---|
| Empty file list | `file` or `folder` |
| No search results | `search` or `search-x` |
| Empty inbox | `inbox` |
| No events / calendar | `calendar` |
| No notifications | `bell` |
| No team members | `users` |
| No data / analytics | `bar-chart` |

In Figma, swap the `folder` instance for any icon from the icon placeholder set. In code, pass the icon as a prop or slot.

### Button visibility

`btn-primary` and `btn-outline` are both shown by default but should be conditionally rendered:

| Scenario | Buttons to show |
|---|---|
| User can create a new item | `btn-primary` (create action) + `btn-outline` (secondary action) |
| User can perform one action only | `btn-primary` only |
| Read-only context (no permission to create) | No buttons — or a text link to request access |
| Filtered empty (clear filter to see results) | `btn-outline` only ("Clear filters") |

---

## Accessibility

| Property | Value |
|---|---|
| Role | No implicit role — renders as a `<div>`. Add `role="status"` if the empty state appears dynamically after a search or filter action |
| Icon | `aria-hidden="true"` on the icon — the title and description carry the message |
| `title` | Should be descriptive enough to stand alone as the accessible label |
| `description` | Provides context — include the next step, not just a restatement of the title |
| Action buttons | Use the button component's built-in accessible label — ensure label text describes the action, not just "Click here" |

---

## Usage Rules

- Use `Variant=Default` inside containers that already provide a surface — cards, sheets, dialogs, drawers
- Use `Variant=Outline` for empty states that occupy a bordered area — table bodies, list panels, dropzone areas
- Use `Variant=Background` for page-level or sidebar empty states where no other framing is present
- Always provide a `title` and `description` — the title states what is missing; the description explains what to do next
- Replace the icon with one contextually relevant to the empty state — the default folder icon is a placeholder
- Do not show the empty state during loading — show a skeleton loader first, then transition to the empty state if results are empty
- Keep `description` short — one sentence or two short sentences maximum
- Do not modify fills inside `btn-primary` or `btn-outline` from the `empty` parent — change the button variant prop instead

---

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- A project list that has no projects yet — first-use onboarding state with a "Create Project" CTA
- A search results panel that returns zero matches — with a "Clear filters" or "Try different keywords" action
- An inbox or notification feed that has been fully read or cleared ("You're all caught up.")
- A team members table where no members have been invited yet ("Invite your team to get started.")
- A calendar or event list with no upcoming events ("No events scheduled — add one to get started.")
- A filtered data table that returns nothing after applying active filters

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Default` | Empty state lives inside a container that already provides a surface | Inside a `card`, `sheet`, `dialog`, or `drawer` |
| `Outline` | Empty state needs its own clear boundary in an open layout | Empty table body · Bordered list zone · Dashed dropzone area |
| `Background` | Empty state is the primary content of a page section with no other framing | Full-page empty state · Sidebar with no items · Stand-alone panel on a canvas |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Data is still loading and content is expected to appear | `skeleton` | `empty` (showing empty state during a load is a false negative — the data hasn't arrived yet) |
| Something went wrong and the page has content but an error occurred | `alert` Variant=Destructive | `empty` (alert communicates failure; empty communicates absence) |
| The list has items but the user needs to be prompted to add more | An inline CTA or `button` | `empty` (empty state is for zero-item states, not low-count nudges) |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Show the empty state while data is loading | Show a skeleton or spinner first; render empty state only after load completes with zero results |
| Use the same folder icon for every empty state | Use a context-specific icon — inbox, calendar, search, etc. |
| Put a long paragraph in `description` | Keep it to one or two short sentences — the user needs a clear next step, not an explanation |
| Show two action buttons when only one action is available | Conditionally render; show `btn-primary` alone when there's no valid secondary action |
| Override button fills from within `empty` | Change the button's variant prop — never repaint sub-component internals |
| Use `Variant=Background` inside a card | Use `Variant=Default` — the card already provides the surface; a subtle fill inside it creates an unintended double-layer |
