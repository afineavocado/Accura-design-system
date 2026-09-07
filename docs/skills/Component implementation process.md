# Component Implementation Process

How to correctly implement a shadcn component to match the Agentic Design System Figma spec.

---

## The Rule

**Fix the component first. Build the gallery second.**

```
❌ Wrong:  Build gallery → see issues → fix reactively
✅ Correct: Fix component → build gallery → verify
```

Skipping the fix step is the single reason most corrections happen. shadcn defaults are generic — they never match our spec out of the box.

---

## Step 1 — Read the Spec (2 min)

Open the component's markdown file:
`Obsidian/Working process - L&D/Agentic-design-system/Component Markdown/[Name].md`

Extract these values before touching any code:

| What to find | Where in the file |
|---|---|
| Height per size | Sizes table — "Height" column |
| Padding H and V | Sizes table — "Padding H token" column, or Structure section |
| Border radius per size | Sizes table — "Radius token" or Token Bindings |
| Gap between children | Sizes table or Structure section |
| Text style per size | Sizes table — "Text style" column |
| Fill per variant | Token Bindings → "Per Variant — fills" table |
| Border per variant/state | Token Bindings → "Per State" table |
| Text/icon fg per variant | Token Bindings — "fg token" column |
| Disabled state tokens | Token Bindings — Disabled row |
| Focus state tokens | Token Bindings — Focus row or Behavior section |
| Invalid state tokens | Token Bindings — Invalid row |

Write the values down or keep the file open as you work.

---

## Step 2 — Map Tokens to Tailwind Classes

Convert each token to its Tailwind utility. Reference:

| Token | Tailwind class |
|---|---|
| `color/brand/primary` | `bg-primary` |
| `color/brand/primary/foreground` | `text-primary-foreground` |
| `color/surface/muted` | `bg-muted` |
| `color/surface/muted/foreground` | `text-muted-foreground` |
| `color/background/default` | `bg-background` |
| `color/border/default` | `border-border` |
| `color/border/focus` | `border-ring` |
| `color/input/border` | `border-input` |
| `color/ring` | `ring-ring` |
| `color/text/disabled` | `text-muted-foreground` |
| `color/background/muted` | `bg-muted` |
| `color/brand/destructive` | `bg-destructive` |
| `color/brand/destructive/foreground` | `text-destructive-foreground` |
| `radius/md` | `rounded-md` |
| `radius/lg` | `rounded-lg` |
| `radius/xl` | `rounded-xl` |
| `radius/full` | `rounded-full` |
| `spacing/component/xs` | `gap-1` / `p-1` / `px-1` / `py-1` (4px) |
| `spacing/component/sm` | `gap-2` / `p-2` / `px-2` / `py-2` (8px) |
| `spacing/component/md` | `gap-3` / `p-3` / `px-3` / `py-3` (12px) |
| `spacing/component/lg` | `gap-4` / `p-4` / `px-4` / `py-4` (16px) |
| `spacing/component/xl` | `gap-6` / `p-6` / `px-6` / `py-6` (24px) |

Heights in Tailwind:
- 36px → `h-9`
- 40px → `h-10`
- 44px → `h-11`
- 16px → `h-4`
- 20px → `h-5`
- 24px → `h-6`

---

## Step 3 — Fix the `.tsx` Component File

File location: `accura-ui/src/components/ui/[component].tsx`

Go through the shadcn default class string and replace every value that doesn't match the spec.

**Most common gaps between shadcn defaults and our spec:**

| What shadcn has | What we usually need |
|---|---|
| `h-10` (40px) | Match spec exactly — often `h-9` (36px) or `h-11` (44px) |
| `rounded-md` | Check — might be `rounded-lg` or `rounded-xl` per size |
| `gap-2` | Check spacing token |
| `px-4 py-2` | Check padding tokens — often different per size |
| `text-sm` | Match text style: `text-xs` for sm size, `text-sm` for md/lg |
| `disabled:opacity-50` | Replace with `disabled:bg-muted disabled:text-muted-foreground disabled:border-border` |
| `focus-visible:ring-ring` only | Add `focus-visible:border-ring` — border must also turn blue |
| No `aria-invalid` handling | Add `aria-invalid:border-destructive` |

**Focus state pattern for inputs and textareas:**
```
focus-visible:outline-none
focus-visible:border-[var(--color-border-focus)]
focus-visible:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]
```

This gives: blue border + soft blue outer glow, matching the Figma `focus/ring` effect style.

> ⚠️ Never use Tailwind `ring-*` utilities on inputs. `ring-2` without a correctly resolved color
> defaults to a black box-shadow. Use a direct arbitrary `[box-shadow:...]` value instead.
> Never use `border-ring` or `ring-ring` — these fall back to black in Tailwind v4 when the
> color isn't in the standard palette. Always reference CSS variables directly with `var(--token)`.

**Focus state pattern for buttons:**
```
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-[var(--color-ring)]
focus-visible:ring-offset-2
focus-visible:ring-offset-background
```

---

## Step 4 — Build the Gallery Section

Add the component to `accura-ui/src/app/page.tsx`.

Show in this order:
1. **All variants** (Default, Secondary, Outline, Ghost, Destructive, etc.)
2. **All states** (Default, Filled, Disabled, Invalid — as a 2-col grid)
3. **All sizes** (sm, default, lg — in a row, aligned center)
4. **Addon patterns** if applicable (leading icon, trailing icon, trailing button, trailing text)

Use `max-w-2xl` and `grid grid-cols-2 gap-x-8 gap-y-4` for state grids.
Use `flex flex-wrap gap-3 items-center` for variant/size rows.

---

## Step 5 — Visual Check

Open `http://localhost:3000` and verify each state:

| State | What to check |
|---|---|
| Default | Correct border color, placeholder color, background |
| Filled | Text color matches spec, border same as default |
| Disabled | Background turns muted gray, text dims, cursor changes |
| Invalid | Border turns red/destructive, error text is red |
| Focus | Click in — border turns blue, soft blue ring appears |
| Hover | (CSS only, can't show in gallery) — check in browser by hovering |

If something looks wrong → go back to Step 3 and fix the component. Never patch the gallery with one-off className overrides.

---

## What Not To Do

| ❌ Don't | ✅ Do instead |
|---|---|
| Add `className="border-red-500"` directly on a gallery Input | Fix `aria-invalid:border-destructive` in `input.tsx` |
| Use `opacity-50` for disabled state | Use `disabled:bg-muted disabled:text-muted-foreground` |
| Skip checking the markdown spec | Always read the spec first — shadcn defaults are never correct |
| Hardcode hex values in className | Use the token-mapped Tailwind utility |
| Fix the gallery and leave the component wrong | Fix the component — the gallery is just a mirror |

---

## Component Status Tracker

Track which components have been spec-fixed:

| Component | `.tsx` fixed | Gallery built | Visually verified |
|---|---|---|---|
| Button | ✅ | ✅ | ✅ |
| Badge | ✅ | ✅ | ⚠️ needs check |
| Input | ✅ | ✅ | ⚠️ needs check |
| Textarea | ✅ | ✅ | ⚠️ needs check |
| Checkbox | ❌ | ❌ | ❌ |
| Radio | ❌ | ❌ | ❌ |
| Select | ❌ | ❌ | ❌ |
| Switch | ❌ | ❌ | ❌ |
| Slider | ❌ | ❌ | ❌ |
| Alert | ❌ | ❌ | ❌ |
| Toast / Sonner | ❌ | ❌ | ❌ |
| Dialog | ❌ | ❌ | ❌ |
| Sheet | ❌ | ❌ | ❌ |
| Tabs | ❌ | ❌ | ❌ |
| Accordion | ❌ | ❌ | ❌ |
| Avatar | ❌ | ❌ | ❌ |
| Card | ❌ | ❌ | ❌ |
| Progress | ❌ | ❌ | ❌ |
| Skeleton | ❌ | ❌ | ❌ |
| Tooltip | ❌ | ❌ | ❌ |
| Breadcrumb | ❌ | ❌ | ❌ |
| Pagination | ❌ | ❌ | ❌ |
| Separator | ❌ | ❌ | ❌ |
| Table | ❌ | ❌ | ❌ |
