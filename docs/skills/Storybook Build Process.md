# Storybook Build Process

**Pipeline — no exceptions, no skipping:**
```
Figma spec → .tsx tokens fixed → Figma parity confirmed → Story written → Story verified
```

Each phase gate must pass before the next starts. A component is not done until all four columns in `Tracking/Storybook Status.md` are ✅.

**Paths:**
| | |
|---|---|
| Stories | `agentic-ui/src/stories/*.stories.tsx` |
| Components | `agentic-ui/src/components/ui/<name>.tsx` |
| Artifacts | `Agentic-design-system/Machine Readable/artifacts/` |
| Status tracker | `Tracking/Storybook Status.md` — update every component, same session |

---

## Fixing a visual bug — inspect first, verify yourself (read this before touching code)

UI is **frames inside frames**. The property that *causes* a visual problem usually lives on a **different layer** than where the symptom shows up. Component libraries (Base UI, Radix, shadcn) split one visual element into Trigger → Positioner → Popup → Portal → internal anchor — the controlling "knob" is rarely where you'd expect. Changing the outer prop while the truth lives on an inner (or sibling) element is the #1 time-waster.

**The mandatory order — do not change code before step 1:**

1. **Measure the live DOM before guessing.** Open the running story and inspect the *actual rendered values* — which element has the width/position/var, what it computes to. Don't reason from a mental model of how you think the component is built.
   ```js
   // via Chrome MCP javascript_tool on the story iframe:
   // http://localhost:6006/iframe.html?id=<story-id>&viewMode=story
   const el = document.querySelector('<selector>');
   el.getBoundingClientRect();              // real size/position
   getComputedStyle(el).width;              // resolved value
   el.style.getPropertyValue('--anchor-width'); // library CSS vars
   ```
   One measurement that says "anchor=230 but trigger=280" beats four rounds of screenshots.

2. **Fix at the layer that owns the property** — not the layer where the symptom appears. If a value comes from a sibling/anchor element, that's where the fix goes.

3. **Verify the fix yourself in the browser** — re-measure and confirm the numbers before reporting done. HMR does **not** reliably hot-reload `*.tsx` component edits in this setup; **fully restart Storybook** (`pkill -f storybook && npm run storybook`) and hard-refresh, or you'll be looking at a stale build (a frequent false "still broken").

4. **When you need the user's eyes, give a number, not a vibe.** "The dropdown should read 280px = the field width" — verifiable without front-end knowledge. Never offload visual verification onto a non-front-end user as the primary check.

**Why this matters:** record where the controlling property lives in the component's `meta.json` (e.g. "dropdown width comes from the Positioner `anchor`, not the Popup") so the next fix doesn't re-discover it.

---

## Phase 0 — Infrastructure (one-time, already done)

`preview-head.html` loads Inter and sets `--font-inter` / `--font-roboto-mono`. `preview.tsx` imports `globals.css` → `tokens.css`. Storybook version: `10.4.1` with `@storybook/nextjs-vite`. Start: `npm run storybook` → `http://localhost:6006`.

If Storybook shows system font or wrong colors after a fresh install — restart fully (`pkill -f storybook && npm run storybook`) and hard-refresh the browser (`Cmd+Shift+R`).

---

## Phase 1 — Spec-fix the .tsx

Read the spec. Fix the tokens. Confirm in Storybook. Only then move to Phase 2.

### 1.1 — Scan for shadcn defaults

```bash
grep -n "bg-primary\|text-foreground\|bg-muted\|border-border\|ring-ring\|bg-background\|bg-secondary" \
  src/components/ui/<name>.tsx
```

Any match = spec-fix required. These are shadcn's generic token names — they do not map to our semantic layer.

### 1.2 — Read the full spec before touching code

Open both files completely. Do not skim.

```
Component Markdown/<Name>.md          → structure, layout, spacing, behavior
artifacts/components/<name>.meta.json → token bindings per variant/state
```

Extract from **Structure section:**
- Every layer name and its type (FRAME, TEXT, INSTANCE, SLOT)
- Which slots are optional vs. always present
- Layout model: horizontal / vertical auto-layout, gap, padding

Extract from **Token Bindings section:**
- Fill, stroke, radius per variant and state
- Spacing tokens for padding and gap
- Text color per layer per state (placeholder, value, description, disabled, invalid)
- Icon stroke color per state

> Missing either section means missing token fixes and missing stories. Both are required — no exceptions.

### 1.3 — Fix the .tsx — one variant at a time

```
1. Read spec token name (from .md or meta.json)
2. Confirm the CSS variable exists in tokens.css:
   grep -n "<token-name>" agentic-ui/src/app/tokens.css
3. Write class using var(--exact-token-name)
4. Save → verify in Storybook Controls
5. Only move to the next variant when this one passes
```

---

### Token rules

**Colors and radius — use CSS variables:**
```
bg-[var(--color-brand-primary)]
border-[var(--color-input-border)]
rounded-[var(--radius-md)]
```

**Spacing — use Tailwind utilities, never CSS variable arbitrary values:**
CSS variables for spacing are unreliable inside CVA strings in Tailwind v4 JIT. Colors and radius are fine as CSS vars because they are theme-adaptive. Spacing is not — use Tailwind utilities directly.

| Token | Value | Tailwind utility |
|---|---|---|
| `spacing/component/xxs` | 2px | `gap-0.5` / `p-0.5` |
| `spacing/component/xs` | 4px | `gap-1` / `p-1` |
| `spacing/component/xs-plus` | 6px | `gap-1.5` / `p-1.5` |
| `spacing/component/sm` | 8px | `gap-2` / `p-2` |
| `spacing/component/md` | 12px | `gap-3` / `p-3` |
| `spacing/component/lg` | 16px | `gap-4` / `p-4` |
| `spacing/component/xl` | 24px | `gap-6` / `p-6` |
| `spacing/component/2xl` | 32px | `gap-8` / `p-8` |

**Common shadcn → Agentic replacements:**

| shadcn default | Agentic token |
|---|---|
| `bg-primary` | `bg-[var(--color-brand-primary)]` |
| `text-primary-foreground` | `text-[var(--color-brand-primary-foreground)]` |
| `bg-muted` | `bg-[var(--color-surface-muted)]` |
| `text-muted-foreground` | `text-[var(--color-surface-muted-foreground)]` |
| `bg-background` | `bg-[var(--color-background-default)]` |
| `text-foreground` | `text-[var(--color-background-default-foreground)]` |
| `border-input` | `border-[var(--color-input-border)]` |
| `ring-ring` | `ring-[var(--color-ring)]` |
| `bg-destructive` | `bg-[var(--color-brand-destructive)]` |
| `bg-secondary` | `bg-[var(--color-surface-accent)]` |
| `disabled:opacity-50` | `disabled:opacity-[calc(var(--opacity-disabled)/100)]` |

**Typography — Tailwind utilities only:**

| Figma style | Tailwind classes |
|---|---|
| `label/sm` | `text-xs font-medium leading-none` |
| `label/md` | `text-sm font-medium leading-none` |
| `body/sm` | `text-sm` |
| `heading/sm` | `text-base font-semibold leading-snug` |

**Icons — always `@untitledui/icons`:**
PascalCase, no `Icon` suffix. Never `lucide-react`.
```tsx
import { ChevronDown, SearchLg, X } from '@untitledui/icons'
```

**`aria-invalid` — always `|| undefined`, never pass `false`:**
CSS `[&[aria-invalid]]` matches any element that **has** the attribute, including `aria-invalid="false"`. Passing `false` in React still renders the attribute and triggers the red border.
```tsx
// ✅ attribute absent from DOM when false — no red border
aria-invalid={someCondition || undefined}

// ❌ renders aria-invalid="false" — still triggers [aria-invalid] CSS selector
aria-invalid={someCondition}
```

**CVA structure:**
- Mutually exclusive options → `variant`
- Additive modifier (on/off) → `boolean prop`

---

### Cross-component token inheritance

If a component's `.tsx` borrows another component's CVA (e.g. `buttonVariants` inside `PaginationLink`), verify the borrowed tokens match this component's spec before keeping the dependency. A borrowed variant that looks visually similar is not necessarily correct — it may resolve to the wrong semantic token.

- Tokens match spec → keep the dependency
- Tokens differ → remove the dependency, write token classes directly from this component's spec

This is the most common source of silent token mismatches — the component renders, but with the wrong semantic tokens.

---

### Story className overrides — audit the story files, not just the component

When a story passes `className` directly to a component (e.g. `<DialogFooter className="flex-col gap-[var(--spacing-component-xs)]">`), it overrides the component's defaults. **This is invisible to a grep on the component `.tsx` file.**

A component-file audit that finds correct tokens does NOT guarantee the stories are correct. A complete spacing/token audit must check story files too:

```bash
grep -n "gap-\|px-\|py-\|p-\[" src/stories/<Name>.stories.tsx
```

Flag any story-level spacing class that doesn't match the spec for that context:
- Footer button gap → `spacing/component/sm` (8px)
- Form field label-to-input gap → `spacing/component/xs` (4px) — correct
- Section gap → `spacing/component/lg` (16px)

If a story-level className is wrong, fix it in the story file. If the component default is wrong, fix the component. Never "fix" a correct component to match a wrong story.

---

### Native OS inputs — never use for custom UI

`<input type="time">`, `<input type="date">`, `<input type="color">`, and native `<select>` all render OS/browser-controlled dropdowns, wheels, and pickers. These are painted by the operating system outside the webpage's rendering context — **no CSS can reach them**. No token, no class, no `appearance` override will style them to match our design system.

**Rule:** If the Figma spec shows a custom-styled picker, dropdown, or time selector, always build a custom component. Never attempt to patch a native OS input — it will never match.

**Custom picker pattern:**
```
Trigger  → Input-styled container + leading icon (Clock, Calendar, etc.)
Dropdown → @radix-ui/react-popover with color/surface/overlay tokens
Content  → Scrollable columns or custom grid, fully token-bound
Sync     → If combining text input + picker: typing updates picker state,
           picker selection updates input text (bidirectional)
```

---

### 1.4 — Parity check

For every variant in the Controls panel, verify against the Figma frame:

| Check | What to verify |
|---|---|
| Fill / background | Correct token — not hardcoded hex or shadcn default |
| Border | Correct color, width, and alignment per variant and state |
| Border radius | Correct per size |
| Spacing | Padding and gap match `meta.json > tokens` |
| Typography | Inter, correct size and weight |
| States | Default / Hover / Focus / Disabled / Invalid all render correctly |
| Token source | All colors use `var(--token-name)` — no shadcn class names |

Fix → save → recheck before moving to the next variant. **Do not move to Phase 2 until every variant passes.**

---

## Phase 2 — Write the story

### 2.1 — One story file per shadcn component

Figma sometimes combines what shadcn ships as separate files. **One `.stories.tsx` per `.tsx` component file — never combine.**

When a Figma `Type` variant maps to a different shadcn component (not just a different prop value), that's a separate story file.

| Figma component set | shadcn files | Story files |
|---|---|---|
| `input` (Type=Input / Textarea) | `input.tsx` + `textarea.tsx` | `Input.stories.tsx` + `Textarea.stories.tsx` |
| `alert` + `alert-dialog` | `alert.tsx` + `alert-dialog.tsx` | `Alert.stories.tsx` + `AlertDialog.stories.tsx` |

### 2.2 — Read artifacts and cross-check

```
artifacts/components/<name>.meta.json   → category, argTypes, default args
artifacts/examples/<name>.examples.tsx  → ready-made JSX for every story
```

**Never write story JSX from scratch.** Use `examples.tsx` verbatim. If an example is missing, add it to `examples.tsx` first, then use it in the story.

**Cross-check before opening the story file:**

Write this table out explicitly — do not do it mentally. Every row must be ✓ before any story is written.

```
Variants (meta.json > variants > [prop] > values):
  Value 1 → examples.tsx key? ✓/✗
  Value 2 → examples.tsx key? ✓/✗
  ...

Slots (meta.json > composition):
  slot-name → examples.tsx key? ✓/✗
  ...

Visually distinct states:
  Disabled → story? ✓/✗
  Invalid  → story? ✓/✗
  ...
```

Any ✗ → add the missing example to `examples.tsx` first, then write the story.

### 2.3 — Story file structure

```
src/stories/<PascalCaseName>.stories.tsx
```

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComponentName } from '@/components/ui/component-name';

const meta = {
  title: '<Category>/<ComponentName>',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    // enum    → control: 'select', options: Object.values(reactValues)
    // boolean → control: 'boolean'
    // string  → control: 'text'
  },
  args: { /* defaults from meta.json > variants[x].default */ },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};                                          // controls-driven
export const Outline: Story = { render: () => <JSX from examples.tsx /> }; // render-driven
```

**Category → title prefix:**

| `category` value | Title prefix |
|---|---|
| `actions` | `Actions/` |
| `forms` | `Forms/` |
| `feedback` | `Feedback/` |
| `overlay` | `Overlay/` |
| `navigation` | `Navigation/` |
| `data-display` | `Data/` |
| `layout` | `Layout/` |
| `display` | `Display/` |
| `chat` | `Chat/` |

**Special patterns:**
- Dialog, Sheet, Drawer — examples include their own triggers, copy them directly.
- Toast — add `<Toaster />` in `decorators`, not inside individual story renders.
- Components with `SidebarProvider`, `TooltipProvider` etc. — wrap in a decorator, not per-story.

---

## Phase 3 — Verify the story

Run through every item. All must pass before marking Story verified.

- [ ] Renders without console errors
- [ ] Font is Inter (not system fallback)
- [ ] Controls panel: every variant × size × state matches Figma — color, border, radius, spacing, text
- [ ] Hover / Focus / Disabled / Invalid states all render correctly
- [ ] All `meta.json > variants` appear as Controls
- [ ] All named stories match the correct Figma variant
- [ ] All composition slots have a story (leading-icon, trailing-button, etc.)
- [ ] Overlays, popovers, and drawers open and close correctly
- [ ] A11y panel: no critical violations

---

## Phase 4 — Update status

**Required immediately after completing each phase. Do not batch.**

| Phase finished | Column to mark ✅ | Also update |
|---|---|---|
| .tsx spec-fixed | `.tsx` tokens | Add brief notes to the row |
| Parity confirmed | `Figma parity` | |
| Story written | `Story written` | |
| Phase 3 checklist passed | `Story verified` | Update Summary counts at the bottom |

---

## Troubleshooting

| Symptom | Root cause | Fix |
|---|---|---|
| System font instead of Inter | `preview-head.html` missing or Storybook not restarted | Hard restart + `Cmd+Shift+R` |
| Blue/gray shadcn colors | `.tsx` still uses `bg-primary`, `text-foreground` etc. | Phase 1.3 — replace all shadcn defaults |
| Missing variant in Controls | CVA variant not added during spec-fix | Add the missing variant branch to CVA |
| Wrong spacing or height | Size tokens not applied | Check `meta.json > tokens` for size-specific values |
| Disabled state looks like default | `disabled:` modifier classes not added | Apply token + opacity per spec |
| Invalid state missing | `aria-invalid:` modifier classes not added | Wire `aria-invalid` to border/text tokens |
| Missing slot stories | Structure section of spec not read | Re-read Structure — slots come from there, not Token Bindings |
| Custom picker shows OS UI | Native input used (`type="time"` / `type="date"`) | Replace with custom Radix Popover component |
| Token correct but wrong state | Borrowed CVA from another component | Verify token resolves to the correct value for this component's context |
