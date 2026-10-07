# Spinner

An indeterminate activity indicator for **small areas** — inside a button, an input, a status pill. It says "working" without saying how long.

> **Code-only component.** There is no Figma component set (`figmaNodeId: null`). Whether Spinner gets one is an open decision — see `docs/handover/loading.md`.

---

## What it is

The `Loading02` icon from `@untitledui/icons`, spinning. It is the same icon Toast already used for its loading state, so the system has one spinner, not two.

| Property | Value |
|---|---|
| Icon | `Loading02` (`@untitledui/icons`) |
| Colour | `currentColor` — inherits the foreground of whatever it sits in. No token of its own |
| Animation | `animate-spin`, stopped by `motion-reduce:animate-none` |

---

## Sizes

| Size | Box | When to use |
|---|---|---|
| `sm` | 14px | Inside a pill or next to `text-sm` copy — the PageBusy "Updating…" pill |
| `md` | 16px | **Default.** Matches Button's icon slot (`[&_svg]:size-4`) |
| `lg` | 24px | A standalone indicator in an empty area |

---

## Usage

```tsx
import { Spinner } from "@/components/ui/spinner"

<Spinner />                               // decorative — surrounding text says what is loading
<Spinner size="sm" label="Loading assignees" />  // the only signal — announced via role="status"
```

**In a button, do not place Spinner by hand — use `<Button loading>`.** It handles the delay, the width and the screen-reader label. See `Button.md` → *Loading state*.

---

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | |
| `label` | `string` | — | When set, renders `role="status"` with screen-reader-only text. Omit when visible text already names the wait |
| `className` | `string` | — | Colour comes from the parent; set `text-*` here only to override |

---

## Accessibility

| Property | Value |
|---|---|
| Role | None by default (`aria-hidden="true"` on the icon). `role="status"` when `label` is passed |
| Screen reader | Silent unless `label` is set. Prefer a visible label, or `aria-busy` on the region |
| Reduced motion | `motion-reduce:animate-none` — the icon stays visible but stops turning |

---

## Behavior

### Timing

Spinner itself has no timing. Whoever shows it should follow the shared rule in `@/hooks/use-delayed-loading`: **show only after 300ms, keep at least 500ms** — so fast work never flashes a spinner. `Button` `loading` and `PageBusy` already do this.

### Motion

Continuous rotation via `animate-spin`. Under `prefers-reduced-motion: reduce` it stops; the static icon still marks the busy state.

---

## Usage Rules

- **Small areas only.** For a region whose layout is known, use `Skeleton`. For a task with a measurable percentage, use `Progress`.
- **Never as a whole-page loader.** A page uses the shell plus skeletons; a refresh uses `PageBusy`.
- **One per busy thing.** Do not put a spinner in the button *and* in the area it updates.
- **No colour override for state.** It inherits; do not paint it brand green on a neutral surface to "make it pop".

---

## Best Practice

### Use cases

- A button whose action is in flight — via `<Button loading>`
- A combobox or search input fetching results
- The "Updating…" pill while a page refreshes (inside `PageBusy`)
- Toast's loading state (Toast uses Spinner)

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| A region's layout is known while its data loads | `skeleton` | `spinner` (skeleton holds the layout; a spinner in a blank box shifts it) |
| The task has a known percentage | `progress` | `spinner` |
| A page refreshes data already on screen | `PageBusy` (it contains a Spinner) | a spinner placed over the table by hand |
| A long task the user can leave running | `toast.loading` with a `Progress` in the description | a spinning button held for the whole task |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| `<Button disabled><Spinner /></Button>` hand-built | `<Button loading loadingLabel="Saving changes">` |
| Showing a spinner the instant work starts | Wait 300ms (`useDelayedLoading`), keep it ≥500ms once shown |
| A second spinner icon (`Loader2`, a CSS ring…) | This component — one spinner in the system |
| Spinner with no label and no surrounding text | Pass `label`, or put visible text beside it |
