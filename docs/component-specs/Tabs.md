# Tabs

A navigation component for switching between content sections. Built from two composable component sets: `tab-trigger` (individual tab items) and `tab-list` (the container that holds triggers).

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `tab-trigger` | `59:17766` | 7 | Individual clickable tab item |
| `tab-list` | `59:17793` | 3 | Container that holds tab triggers |

---

## Variant Matrix

### tab-trigger

| Property | Options | Default |
|---|---|---|
| `Type` | `Default`, `Line` | `Default` |
| `State` | `Default`, `Hover`, `Active`, `Disabled` | `Default` |

> `Type=Line` has no `Hover` state — line tabs are flat and stateless outside of Active.

### tab-list

| Property | Options | Default |
|---|---|---|
| `Variant` | `Default`, `Line` | `Default` |
| `Orientation` | `Horizontal`, `Vertical` | `Horizontal` |

> `Variant=Line` only supports `Orientation=Horizontal`.

---

## Visual Hierarchy

- **`Default`** — pill/background style. Active trigger has a filled surface and shadow. Use when tabs are the primary navigation element and need visual weight.
- **`Line`** — flat/underline style. Active state communicated through the indicator line only — no background fill or shadow at any state. Use when tabs are secondary, embedded in a dense layout, or need to stay visually light.

Choose `Default` when the tabs command attention. Choose `Line` when they should recede.

---

## Structure

### tab-trigger
```
tab-trigger
  ├─ icon — optional leading icon (14×14, stroke-based)
  ├─ label — always visible
  └─ indicator — always present in all Line states; opacity 1 when Active, opacity 0 when Default/Disabled
```

> The `indicator` exists in all three `Type=Line` states to keep heights consistent (all 24px). It is not present in `Type=Default` variants.

> The `icon` is an optional leading slot (stroke-based `Icon Placeholder`, 14×14). Its stroke **must match the label's state foreground token** — never `color/icon/*` (see per-state table + Do Not). Bound via `setBoundVariableForPaint` on the VECTOR strokes.

### tab-list
```
tab-list
  ├─ slot-1 — tab-trigger instance
  ├─ slot-2 — tab-trigger instance
  └─ slot-3 — tab-trigger instance
```

> Swap each slot with a `tab-trigger` instance. Set its `Type` and `State` props directly.

---

## Component Properties

### tab-trigger

| Property | Type | Default | Notes |
|---|---|---|---|
| `Type` | VARIANT | `Default` | Visual style and hierarchy |
| `State` | VARIANT | `Default` | Interaction state |

### tab-list

| Property | Type | Default | Notes |
|---|---|---|---|
| `Variant` | VARIANT | `Default` | Must match the `Type` of triggers inside |
| `Orientation` | VARIANT | `Horizontal` | Layout direction |
| `slot-1` | SLOT | — | First tab-trigger — **typed**: must be replaced with a `tab-trigger` instance only |
| `slot-2` | SLOT | — | Second tab-trigger — **typed**: must be replaced with a `tab-trigger` instance only |
| `slot-3` | SLOT | — | Third tab-trigger — **typed**: must be replaced with a `tab-trigger` instance only |

> These are native Figma SLOT nodes. They are **typed** — the slot must always be filled with a `tab-trigger` instance. Do not drop other components into these slots.

---

## Token Bindings

### tab-trigger — per Type × State

Icon stroke **always equals the Text fg** for that state (they are one unit — never split them).

| Type | State | Root fill | Shadow | Text fg + icon stroke |
|---|---|---|---|---|
| `Default` | `Default` | — (transparent) | — | `color/text/secondary` |
| `Default` | `Hover` | `color/surface/accent` | — | `color/text/secondary` |
| `Default` | `Active` | `color/surface/default` | `shadows/2xs` | `color/surface/default/foreground` |
| `Default` | `Disabled` | — (transparent) | — | `color/text/disabled` |
| `Line` | `Default` | — (transparent) | — | `color/text/secondary` |
| `Line` | `Active` | — (transparent) | — | `color/surface/default/foreground` |
| `Line` | `Disabled` | — (transparent) | — | `color/text/disabled` |

### tab-trigger — indicator (`Type=Line` only)

| State | Fill token | Opacity |
|---|---|---|
| `Default` | `color/brand/primary` | 0% |
| `Active` | `color/brand/primary` | 100% |
| `Disabled` | `color/brand/primary` | 0% |

> The indicator is always present in the layout — opacity controls visibility, not display. Height is **2px hardcoded** (no token). This keeps all three Line states at a consistent 24px height.

### tab-list — per Variant

| Variant | Root fill | Root stroke |
|---|---|---|
| `Default` | `color/surface/raised` | — |
| `Line` | — (transparent) | `color/border/default` (bottom only) |

### Size tokens — tab-trigger `Type=Default`

| Property | Token | Value |
|---|---|---|
| `padding-left` / `padding-right` | `spacing/component/md` | 12px |
| `padding-top` | `spacing/component/xs-plus` | 6px |
| `gap` (icon ↔ label) | `spacing/component/xs-plus` | 6px |
| `icon` size | — (no token) | 14 × 14px |
| `border-radius` | `radius/md` | — |
| `text-style` | `label/sm` | — |

### Size tokens — tab-trigger `Type=Line`

| Property | Token | Value |
|---|---|---|
| `padding-left` / `padding-right` | `spacing/component/md` | 12px |
| `padding-top` | `spacing/component/sm` | 8px |
| `gap` (icon ↔ label) | `spacing/component/xs` | 4px |
| `icon` size | — (no token) | 14 × 14px |
| `border-radius` | — | none |
| `text-style` | `label/sm` | — |

### Size tokens — tab-list

| Property | Token | Value |
|---|---|---|
| `padding` (all sides) | `spacing/component/xxs` | 2px |
| `gap` | `spacing/component/xxs` | 2px |
| `border-radius` | `radius/lg` | — |

---

## Accessibility

> **How to write this section:**
> Based on our system decisions. Tabs follow the WAI-ARIA composite widget pattern — the tablist is one focusable unit, arrow keys navigate inside it. No `State=Focus` variant was added to `tab-trigger` (Option B — the active state serves as the selected indicator, focus ring is handled at the tablist level or by the browser).

| Property | Value |
|---|---|
| Role — container | `role="tablist"` on the `tab-list` element |
| Role — item | `role="tab"` on each `tab-trigger` |
| Role — panel | `role="tabpanel"` on each content panel |
| Selected state | `aria-selected="true"` on the active tab · `aria-selected="false"` on all others |
| Disabled | `aria-disabled="true"` on disabled tabs — keeps them in the DOM and readable |
| Linking | `aria-controls="[panel-id]"` on each tab · `aria-labelledby="[tab-id]"` on each panel |
| Focus | Tab key moves focus to the tablist as a single unit — not to individual triggers |
| Keyboard | Arrow keys navigate between triggers · active trigger follows focus (automatic activation) |
| Orientation | `aria-orientation="vertical"` on vertical tab-list — changes arrow key axis to Up/Down |

> No Focus state variant in `tab-trigger`. Shadcn/ui applies `focus-visible:ring-2 focus-visible:ring-ring` via CSS, which resolves to our `color/ring` token — matching every other interactive component in the system. No custom Figma variant is needed. Do not suppress the browser focus outline on the tablist.

---

## Behavior

> Based on our system. `tab-trigger` has no Hover state for `Type=Line` and no Focus state for either type.

### State triggers

| State | Triggered by | Notes |
|---|---|---|
| `Default` | Idle — not active, not hovered | Transparent background |
| `Hover` | Mouse over (`Type=Default` only) | `color/surface/accent` fill |
| `Active` | Tab is the currently selected section | One tab must always be Active |
| `Disabled` | Tab is unavailable | Visible but not interactive — no hover, no activation |

### Keyboard navigation (composite widget)

Tabs use the **automatic activation** pattern — arrow key focus and selection move together:

| Key | Action |
|---|---|
| `Tab` | Moves focus into the tablist (to the currently active tab) |
| `ArrowRight` / `ArrowDown` | Moves to the next tab and activates it |
| `ArrowLeft` / `ArrowUp` | Moves to the previous tab and activates it |
| `Home` | Moves to the first tab |
| `End` | Moves to the last tab |
| `Tab` (again) | Moves focus out of the tablist and into the active panel |

> Shadcn/ui Tabs uses automatic activation by default — this is confirmed and matches our Behavior section.
> Horizontal tab-list uses Left/Right arrows. Vertical tab-list uses Up/Down arrows.
> Disabled tabs are skipped during arrow key navigation.
> Focus does not wrap — at the first tab, Left/Up has no effect; at the last tab, Right/Down has no effect.

### One active tab at a time

Only one trigger can be `State=Active` in a tab-list. In Figma, set this manually per instance. In code, this is managed by the Tabs component state.

### Orientation

`Orientation=Vertical` on `tab-list` stacks triggers top-to-bottom. Arrow key navigation axis changes to Up/Down. The content panel sits to the right of the tab-list.

---

## Usage Rules

- Always pair `tab-list Variant` with the `tab-trigger Type` inside — `Variant=Default` holds `Type=Default` triggers, `Variant=Line` holds `Type=Line` triggers
- Never mix `Type=Default` and `Type=Line` triggers inside the same `tab-list`
- Always set exactly one trigger to `State=Active` — zero or two active states are both wrong
- `State=Disabled` tabs stay visible — use sparingly, and never disable all tabs
- `tab-list Variant=Line` has a bottom border — place it flush against its content panel, not floating or inside a card
- `Type=Default` for primary page-level navigation · `Type=Line` for secondary navigation inside panels, cards, or dense layouts

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- A dashboard page has "Overview", "Analytics", "Reports", and "Settings" sections — one is visible at a time
- A user profile page separates "Activity", "Projects", and "Teams" into distinct tab panels
- A settings page organises "Account", "Password", and "Notifications" so users can jump directly to a section
- A code editor shows "index.tsx", "styles.css", and "types.ts" in a tab bar above the editor panel
- A detail card uses line tabs to switch between "Summary" and "Details" without adding visual weight
- An admin panel uses vertical tabs to navigate between configuration categories in the left column

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Default` (tab-trigger) + `Default` (tab-list) | Primary page-level navigation where tabs need visual weight — pill/background style | Dashboard sections · Main content views · Top-level page tabs |
| `Line` (tab-trigger) + `Line` (tab-list) | Secondary navigation inside panels, cards, or dense layouts — flat underline style | Tabs inside a card · Filter tabs in a sidebar · Sub-navigation within a settings section |
| `Horizontal` orientation | Standard left-to-right tab row — the default for most UIs | Page header tabs · Card header tabs · Editor tab bar |
| `Vertical` orientation | Side-by-side layout where the content panel sits to the right of the tab list | Admin config panel · Multi-section settings page · Sidebar-driven content switching |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Switching between mutually exclusive sections on the same page | `tabs` | `accordion` |
| Expandable Q&A or stacked sections where multiple can be open | `accordion` | `tabs` |
| Site-level navigation to different pages or routes | `navigation-menu` | `tabs` |
| Navigating between numbered pages of a dataset | `pagination` | `tabs` |
| Too many sections to fit in a tab row (8+) | `select` or `navigation-menu` | `tabs` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Mixing `Type=Default` and `Type=Line` in the same list | One type per list, matched to list Variant |
| `Type=Default` for secondary embedded tabs | `Type=Line` — lower visual weight |
| Shadow on any `Type=Line` trigger | `Type=Line` has no shadow at any state |
| `color/background/*` on trigger or list fills | `color/surface/*` — these are component surfaces |
| `color/icon/*` on indicator or label | Use the state's fg token |
| Zero or two active triggers in a list | Exactly one trigger must be `State=Active` |
| Removing the indicator from Default/Disabled Line states | Keep it at opacity 0 — it holds the height |

---

## Slot count — Figma vs code

The `tab-list` Figma component shows 3 slots. This is a representative example for design purposes — not a system limit.

- **In Figma** — add more `tab-trigger` instances manually in your mockup if you need more than 3. The component set cannot have infinite slots; use it as a starting point.
- **In code** — fully flexible. Pass any number of tab items as children.
- **Recommended range** — 2–7 tabs. Below 2 is a layout decision, not a tab pattern. Beyond 7, users struggle to scan and choose — consider whether a different navigation pattern (sidebar nav, select) better fits the content structure. 5–6 is the sweet spot for most product UIs.
- **Slot accepts** — `tab-trigger` instances only. This is a typed slot — do not place any other component inside it.

This principle applies to all slot-based components in this system (button-group, item-group, nav-panel, sidebar-menu): the Figma slot count is a design-time convenience, never a code constraint.
