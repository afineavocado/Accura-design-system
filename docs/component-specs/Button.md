# Button

A clickable action element. Supports 6 visual types, 5 states, and 6 sizes including icon-only variants.

---

## Variant Matrix

| Property | Options | Default |
|---|---|---|
| `Type` | `Default`, `Outline`, `Secondary`, `Ghost`, `Link`, `Destructive`, `Destructive Secondary` | `Default` |
| `State` | `Enabled`, `Hover`, `Focus`, `Disabled`, `Active` | `Enabled` |
| `Size` | `Small`, `Default`, `Large`, `Icon Small`, `Icon Default`, `Icon Large` | `Default` |

---

## Sizes

> ⚠️ **Accura override — the Radius column below is Agentic's.**
> In Accura both `button/size/Button radius 1` and `radius 2` resolve to **`9999` (pill)**, not 12px/8px.
> **Accura buttons are fully rounded.** The token *names* are unchanged; only the values differ.
> See `accura-theme.md` §4 and §7. Everything else in this table — heights, padding, text styles — is correct for Accura.

| Size | Height | Radius token | Radius *(Agentic)* | Padding H token | Padding H | Text style |
|---|---|---|---|---|---|---|
| `Small` | 36px | `button/size/Button radius 2` | 8px → **9999** | `button/size/Button-padding-small` | 12px | `label/sm` |
| `Default` | 40px | `button/size/Button radius 2` | 8px → **9999** | `button/size/Button-padding-default` | 16px | `label/md` |
| `Large` | 44px | `button/size/Button radius 1` | 12px → **9999** | `button/size/Button-padding-default` | 16px | `label/md` |
| `Icon Small` | 36 × 36px | `button/size/Button radius 2` | 8px → **9999** | — | — | — |
| `Icon Default` | 40 × 40px | `button/size/Button radius 2` | 8px → **9999** | — | — | — |
| `Icon Large` | 44 × 44px | `button/size/Button radius 1` | 12px → **9999** | — | — | — |

`Large` (44px) and `Icon Large` (44 × 44px) meet the WCAG 2.5.5 minimum touch target. Smaller sizes need a compensating invisible hit area in implementation.

Width is auto (hug content) for all text sizes. Icon sizes are fixed square.

Gap between icon and label: `button/size/Button spacing` → `spacing/component/xs` (4px) — all sizes.

---

## Component Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `Type` | VARIANT | `Default` | Visual style |
| `State` | VARIANT | `Enabled` | Interaction state |
| `Size` | VARIANT | `Default` | Size scale |
| `Label` | TEXT | `"Label"` | Button label text |
| `Leading Icon` | BOOLEAN | `false` | Show/hide leading icon |
| `Trailing Icon` | BOOLEAN | `false` | Show/hide trailing icon |
| `Icon leading swap` | INSTANCE_SWAP | placeholder | Swap leading icon component |
| `Icon trailing swap` | INSTANCE_SWAP | placeholder | Swap trailing icon component |
| `Icon swap` | INSTANCE_SWAP | placeholder | Swap icon (icon-only sizes) |

---

## Structure

### Text button (Small / Default / Large)
```
button
  ├─ leading-icon — hidden by default, shown via Leading Icon prop
  ├─ label
  └─ trailing-icon — hidden by default, shown via Trailing Icon prop
```

### Icon-only button (Icon Small / Icon Default / Icon Large)
```
button
  └─ icon — always visible, not wired to a boolean prop
```

> Icon-only sizes use an `icon` slot (always visible). Text sizes use `leading-icon` / `trailing-icon` (boolean controlled). These are different slots — do not confuse them.

---

## Token Bindings

### Per Type — fills, strokes, fg

| Type | Fill token | Border token | Text/icon fg token |
|---|---|---|---|
| `Default` | `button/primary/bg/bg` | — | `button/primary/fg/fg` |
| `Secondary` | `button/secondary/bg/bg` | — | `button/secondary/fg/fg` |
| `Outline` | `button/outline/bg/bg` | `button/outline/border/default` | `button/outline/fg/fg` |
| `Ghost` | — (transparent) | — | `button/ghost/fg/fg` |
| `Link` | — (transparent) | — | `button/link/fg/default` |
| `Destructive` | `button/destructive/bg/bg` | — | `button/destructive/fg/fg` |
| `Destructive Secondary` | `button/destructive-secondary/bg/bg` | `button/destructive-secondary/border/default` | `button/destructive-secondary/fg/fg` |

### Destructive Secondary — low-emphasis destructive

| State | Fill | Label | Border |
|---|---|---|---|
| `Enabled` | `button/destructive-secondary/bg/bg` (red/100) | `button/destructive-secondary/fg/fg` (red/900) | `button/destructive-secondary/border/default` (red/500) |
| `Hover` | `button/destructive-secondary/bg/hover` (red/50) | unchanged | unchanged |
| `Active` | `button/destructive-secondary/bg/active` (red/200) | unchanged | unchanged |
| `Focus` | — | — | red glow, identical to `Destructive` |

Structure mirrors `Secondary` (brand 100 / 50 / 200 / 900) on the red ramp — this variant
is to `Destructive` what `Secondary` is to `Default`.

**When to use.** A destructive action that shares a footer with a primary action which must
stay dominant — CAPA `Reject` beside `Approve & Sign`, or `Return for revision` beside
`Approve`.

**Why not two solid fills.** Solid `Destructive` beside solid `Default` measures **1.20:1**
between the two fills — near-identical lightness, so the meaning rides entirely on hue. Under
deuteranopia (1 in 12 men) they resolve to `#939338` and `#747455`: two olive pills, 1.48:1
apart. Two maximum-weight buttons also leave no default path, on a control that ends in a
21 CFR Part 11 signature.

**Why not `Outline`.** On the CAPA detail screen `Outline` already carries *View audit trail*
(navigation) and *Cancel* (dismiss). An outline `Reject` would look identical to a read-only
nav action, under-signalling a formal, signed, audit-logged decision.

**Two token choices worth knowing:**
- Label is **red/900, not red/700**. `color/status/danger-subtle/foreground` is red/700, which
  measures **4.47:1** on the pressed red/200 fill and misses AA. red/900 holds ≥ 6.93:1 across
  all three states.
- Border is **red/500 via `color/brand/destructive`**, not `color/border/error` (red/300).
  red/300 is **1.90:1** against white and fails the 3:1 floor WCAG 1.4.11 sets for a control
  boundary. red/500 is 3.76:1. This does **not** resolve **Q10** — `border/error` is still pale
  wherever else it is used.

Mode-invariant — no `.dark` override, exactly like `Secondary`.

Verified in-browser: rest 8.20:1 · hover 9.16:1 · active 6.93:1 · focus ring identical to `Destructive`.

### Per State — border overrides (Outline only)

| State      | Border token                     |
| ---------- | -------------------------------- |
| `Enabled`  | `button/outline/border/default`  |
| `Hover`    | `button/outline/border/hover`    |
| `Focus`    | `color/ring` — overrides border, 2px OUTSIDE (same as all non-Destructive types) |
| `Active`   | `button/outline/border/active`   |
| `Disabled` | `button/outline/border/disabled` |

### Link type — fg per state

| State | Token |
|---|---|
| `Enabled` | `button/link/fg/default` |
| `Hover` | `button/link/fg/hover` |
| `Active` | `button/link/fg/active` |
| `Disabled` | `button/link/fg/disabled` |

### Focus state — ring

All types except Destructive use `color/ring` as a border stroke on the Focus state — 2px weight, `OUTSIDE` alignment.
Destructive uses the `focus/destructive` effect style instead (no ring stroke).

> Outline Focus replaces the `button/outline/border/*` stroke with `color/ring` — it does not stack both.

### Size tokens — all types share

| Property | Token |
|---|---|
| `border-radius` | **Accura: both tokens → `radius/full` = `9999` (pill), every size.** `button/size/Button radius 1` (Large / Icon Large) · `button/size/Button radius 2` (Small / Default / Icon Small / Icon Default). *(Agentic maps these to `radius/xl` 12px and `radius/base` 8px — not Accura.)* |
| `height` | `button/size/Button-height-small` (36px) · `Button-height medium` (40px) · `Button-height-large` (44px) |
| `padding-left` / `padding-right` | `button/size/Button-padding-default` → `spacing/4` 16px (Default / Large) · `button/size/Button-padding-small` → `spacing/3` 12px (Small) |
| `gap` | `button/size/Button spacing` → `spacing/component/xs` (4px) |

### Effect styles (shadows)

| State | Type | Effect style |
|---|---|---|
| `Enabled`, `Hover`, `Active` | All except Ghost, Link | `shadows/2xs` |
| `Focus` | `Destructive` | `focus/destructive` |
| `Focus` | All except Destructive | `color/ring` stroke — no shadow |
| Any | `Ghost`, `Link` | — (no shadow, no effect) |

---

## Accessibility

| Property | Value |
|---|---|
| Role | `button` · Link type renders as `<a>` → role becomes `link` |
| Keyboard — button types | Tab to focus · Enter or Space to activate |
| Keyboard — Link type | Tab to focus · Enter to activate · **Space does not activate** (native link behaviour) |
| Touch target | Small (36px) ⚠️ needs 4px padding · Default (40px) ⚠️ needs 2px padding · Large (44px) ✅ |
| Screen reader name | Visible label text · Icon-only → tooltip text must serve as `aria-label` |
| Disabled | Use `disabled` attribute — removes from tab order, browser handles announcement |
| Discoverable disabled | Use `aria-disabled="true"` instead when the button should remain in the tab order (e.g. Submit inactive until form is valid — pair with a tooltip explaining why) |
| Loading | `aria-busy="true"` + `disabled` during loading — prevents double-submit and announces busy state |
| Opens a menu | Add `aria-haspopup="menu"` when the button triggers a dropdown or context menu |
| Focus ring | `color/ring`, 2px, OUTSIDE on all types · Destructive Focus uses `focus/destructive` effect style instead |

---

## Behavior

### States

| State      | Trigger                   | Notes                                                                    |
| ---------- | ------------------------- | ------------------------------------------------------------------------ |
| `Enabled`  | Default                   | Base fill + `shadows/2xs` (except Ghost, Link)                           |
| `Hover`    | Cursor over / touch hover | Bg overlay, shadow maintained                                            |
| `Focus`    | Tab key or click          | `color/ring` stroke appears · Destructive: `focus/destructive` effect    |
| `Active`   | Mouse/touch down          | Pressed fill, shadow removed                                             |
| `Disabled` | `disabled` attribute      | Muted appearance · no hover/focus/active states · removed from tab order |

### Width

- Text sizes (Small / Default / Large) — hug content by default, can fill a container when placed in a full-width layout
- Icon sizes (Icon Small / Icon Default / Icon Large) — fixed square, never stretch

### Link type — semantic difference

`Type=Link` renders as `<a>` in code via `asChild`. This changes behaviour:
- Role is `link`, not `button` — screen readers announce accordingly
- Space does not activate it — only Enter
- Use for navigation only — if the action modifies data, use Ghost or Outline instead

### Loading state

No Figma variant — implementation concern only.

- Replace label with spinner + short status text ("Saving…", "Generating…")
- Set `aria-busy="true"` and `disabled` on the button during the operation
- Restore both when the operation completes
- Never leave a button in loading state indefinitely — always resolve to success, error, or restored state

### Focus management

When a button opens an overlay (dialog, sheet, drawer):
- Focus moves into the overlay on open
- Focus must return to the triggering button when the overlay closes
- Designers: spec the return target explicitly in interaction flows — do not leave it implied

---

## Usage Rules

### By type

**`Default`** — The principal call to action. Highest visual emphasis.
- Use once per page or section — never two Default buttons side by side
- In a dialog or wizard, the Default button is the confirm/forward action
- Exception: a temporary flow launched on top of a page (e.g. a side panel opening over a page that already has a Default button) may briefly have two — this is acceptable

**`Secondary`** — A lighter-weight branded action that pairs with a Default button.
- Always use alongside a Default button, never in isolation
- Typical labels: "Import", "Preview", "Export" — parallel positive actions that are less important than the primary
- Do not use Secondary for cancel, back, or dismiss actions — use Outline instead
- Secondary is a colored button (brand/secondary fill); it signals "positive but secondary", not "exit this flow"

**`Outline`** — Neutral bordered button for cancel, back, or parallel uncolored actions.
- Use for cancel/back/dismiss labels: "Cancel", "Back", "Discard", "Close"
- Can be used alone or alongside a Default button
- Preferred over Secondary for three or more footer actions — Secondary's colored fill is too heavy at that scale

**`Ghost`** — Least prominent. Supplementary or low-priority actions.
- Use for cancel actions in progressive flows (where users have to find it deliberately)
- Use for toolbar actions and card actions where primary actions already exist elsewhere on the page
- Works well flush against a container edge or inline with other components
- Avoid as a standalone CTA — it disappears in empty space

**`Link`** — Navigation only. Takes the user to a new page or route.
- Use when the outcome is navigation, not an in-page action
- Do not use `Link` type for actions that modify data or trigger processes — use `Ghost` or `Outline` instead

**`Destructive`** — For actions that permanently delete or remove data.
- Use for "Delete", "Remove", "Stop", "Revoke"
- Not for warnings or error states — use `color/status/danger` tokens for those
- Always pair with a confirmation dialog for irreversible actions

---

### Size guidance

| Our size | Height | Radius | Padding H | shadcn equivalent | When to use |
|---|---|---|---|---|---|
| `Small` | 36px | 8px | 12px | `sm` | Compact layouts, dense rows, secondary actions in toolbars |
| `Default` | 40px | 8px | 16px | `default` | Standard product UI — most common size |
| `Large` | 44px | 12px | 16px | `lg` | Prominent CTAs, hero sections, onboarding flows |
| `Icon` sizes | square | matches text size | — | `icon` (40×40) | Toolbars, icon-only actions — always add a tooltip |

Only `Large` (44px) and `Icon Large` (44×44px) natively meet the WCAG 2.5.5 44px touch target. Use Small and Medium with padding compensation on touch surfaces.

---

### Button groups

- Include only one Default button per group — all others should be lower emphasis
- Buttons in a group should be the same width (determined by the longest label)
- Do not group more than three buttons — beyond that, use a dropdown menu
- Keep calls to action related — only group buttons that act on the same thing

---

### Labels

- Use **{verb} + {noun}** format wherever possible — "Delete Project", "Save Changes", "Add Member"
- Short common actions are exceptions — "Done", "Cancel", "Back", "Close" are fine alone
- Never truncate a button label — wrap to a second line if needed
- Icon-only buttons must always have a tooltip — even universally recognised icons

---

### Implementation notes

- Switch `Type` for visual intent — never override fills manually
- Focus ring uses `color/ring` as a stroke except `Destructive` which uses `focus/destructive` effect style
- Icon-only sizes use a dedicated `icon` slot — not the `leading-icon` boolean slot

---

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Submitting a form (creating a project, saving settings, sending a message)
- Triggering a destructive action that opens a confirmation dialog (deleting a record, revoking access)
- Providing the primary call-to-action in a hero section or onboarding step
- Opening an overlay — a dialog, sheet, or drawer — via a clearly labelled button
- Performing a toolbar or in-context action (formatting text, adding a row, running a filter)
- Navigating to a new route when the destination is the primary next step in a flow (Type=Link only)

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Default` | The single most important action on the current view | "Create Project" in an empty state · "Save Changes" in settings · "Confirm" in a dialog footer |
| `Outline` | Neutral cancel/back/dismiss, or parallel uncolored actions | "Cancel" next to "Save Changes" · "Back" in a multi-step wizard · "Import" in a page header |
| `Secondary` | Lighter-weight branded parallel action alongside Default — NOT cancel | "Preview" next to "Publish" · "Export" next to "Generate" |
| `Ghost` | Low-priority supplementary action in a dense or contextual space | "Edit" inside a card · "Clear" in a filter bar · toolbar icon actions |
| `Link` | Pure navigation — takes the user to a new route | "View documentation" · "See all results" · "Go to billing" |
| `Destructive` | Permanently removes or irreversibly modifies data | "Delete Project" · "Revoke API key" · "Remove member" |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| User needs to navigate to a different page or route | `button` Type=Link | `navigation-menu` (use nav-menu for multi-item top nav; Link button for single inline link) |
| Two or more related actions that belong together visually (Bold / Italic, Grid / List) | `button-group` | `button` placed side by side without grouping |
| Inline anchor text within a paragraph | `button` Type=Link or a plain `<a>` | `button` Type=Default (fills draw too much weight in running text) |

---

## Do Not

| ❌ Wrong                                   | ✅ Correct                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| Two `Default` buttons side by side        | One `Default` + one `Outline` or `Ghost`                                      |
| `Secondary` button used alone             | `Secondary` only alongside a `Default` button                                 |
| `Secondary` for cancel/back/dismiss       | `Outline` for cancel/back — Secondary is a colored button, not a neutral exit |
| `Link` type to trigger a data action      | `Ghost` or `Outline` — `Link` is navigation only                              |
| `Destructive` for error or warning states | `color/status/danger` tokens for status, `Destructive` for delete CTAs        |
| More than 3 buttons in a group            | Use a dropdown menu for 4+ actions                                            |
| Icon-only button without a tooltip        | Always add a tooltip — icon meaning is never guaranteed                       |
| Raw frame with hardcoded background color | `button` component, correct `Type`                                            |
| Override fill color directly on instance  | Switch `Type` variant prop                                                    |
| `color/icon/*` on icon inside button      | Use container's `/foreground` token                                           |
| Icon sizes with `leading-icon` slot       | Use `icon` slot — always visible, no boolean prop                             |
