# Skeleton

A loading placeholder that communicates content is on its way. Built on shadcn/ui `Skeleton` — a single animated element. Compose multiple instances to mirror the layout of the real content.

> **Code-only component.** There is no published Figma component set. The Skeleton page in Figma contains reference layout frames (Card + Image, Image + Text, Text, List, Simple text, Widget) for design documentation only — not for use as component instances.

---

## What it is

A `<div>` with three CSS properties:

| Property | Value |
|---|---|
| Background | `bg-muted` → `color/background/muted` |
| Animation | `animate-pulse` — subtle opacity pulse |
| Border radius | `rounded-md` by default — overridable via `className` |

No variants. No props. No tokens of its own.

---

## Usage

Import and compose. Each `<Skeleton>` is one bone in the loading layout. Match the dimensions and structure of the real content it replaces.

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

### Text lines

```tsx
<div className="space-y-2">
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

### Card with image

```tsx
<div className="flex flex-col gap-4 p-4">
  <Skeleton className="h-40 w-full rounded-md" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
</div>
```

### Avatar + name row

```tsx
<div className="flex items-center gap-3">
  <Skeleton className="h-10 w-10 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
</div>
```

### List rows

```tsx
<div className="space-y-3">
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex items-center gap-3 py-2 border-b border-border">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-16" />
    </div>
  ))}
</div>
```

---

## Sizing

Skeleton has no built-in size variants. Pass Tailwind size utilities via `className`:

| Need | Class |
|---|---|
| Fixed height | `h-4`, `h-8`, `h-40` etc. |
| Full width | `w-full` |
| Fractional width | `w-2/3`, `w-3/4` |
| Circle | `h-10 w-10 rounded-full` |
| Rounded rect | `rounded-md` (default) · `rounded-sm` · `rounded-lg` · `rounded-full` |

---

## Rules

- **Match the real layout** — each `<Skeleton>` should roughly match the size and position of the element it replaces. Off-size skeletons create layout shift on load.
- **Do not use `color/surface/muted`** — skeleton's background comes from `bg-muted` which maps to `color/background/muted` (page canvas). Using a surface token would be semantically wrong and wrong in dark mode.
- **Remove skeleton on data load** — render `<Skeleton>` only while data is `undefined` or `null`. Switch to real content when data is available.
- **Wrap with `aria-busy`** — add `aria-busy="true"` on the containing section while loading:

```tsx
<section aria-busy={isLoading} aria-label="Loading content">
  {isLoading ? <MySkeleton /> : <MyContent />}
</section>
```

- **Do not animate conditionally** — the CSS pulse runs automatically. Do not add or remove it based on state.
- **Do not use for infinite scroll** — for progressively loading lists, use a spinner at the bottom (`Progress` indeterminate or a spinner icon), not skeleton rows that keep appearing.

---

## Accessibility

| Property | Value |
|---|---|
| Role | None — skeleton is decorative |
| Screen reader | Hidden by default. Communicate loading state via `aria-busy="true"` on the parent container |
| Reduced motion | shadcn's `animate-pulse` respects `prefers-reduced-motion: reduce` via Tailwind — animation stops automatically |

---

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Replacing a card grid while the list of items loads from an API
- Showing placeholder rows in a table before row data has been fetched
- Holding the layout of a user profile (avatar + name + bio) while the profile data resolves
- Mimicking a form layout while the form's default values load from the server
- Preserving the visual structure of a dashboard widget while its metrics are fetching
- Replacing a full-page content area during initial navigation to prevent layout shift

### Per-variant examples

Skeleton has no built-in variants — it is a single composable primitive. The "variant" is the layout you build from it. Common patterns:

| Layout pattern | When to reach for it | Real UI examples |
|---|---|---|
| Circle + text lines | User or entity placeholder | Avatar + name + email row · Comment author block |
| Full-width rectangle | Image or media placeholder | Card cover image · Hero banner · Thumbnail |
| Multiple text lines (varying widths) | Text content placeholder | Article body · Description block · Multi-line card text |
| Row with circle + line | List item placeholder | Notification list · Contact list · Search results |
| Grid of rectangles | Card grid placeholder | Project grid · Product listing · Dashboard panels |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Data has loaded and there is simply nothing to show (zero items) | `empty` | `skeleton` (skeleton signals content is coming; empty signals there is nothing to come) |
| A specific operation has a known percentage of completion | `progress` | `skeleton` (progress communicates deterministic advancement; skeleton is for unknown-duration loads) |
| A single button or form action is in a loading state | Loading `button` with spinner | `skeleton` (skeleton replaces content layout, not interactive controls) |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| `color/surface/muted` fill | `bg-muted` (Tailwind class) — maps to `color/background/muted` |
| Custom animated fills or gradients | `animate-pulse` from shadcn — consistent across the system |
| Skeleton with fixed pixel widths for text lines | Use fractional widths (`w-3/4`, `w-full`) — text is fluid |
| Skeleton rows in infinite scroll bottom | Spinner / indeterminate `Progress` |
| Forgetting `aria-busy` on the container | Always mark the loading region for screen readers |
