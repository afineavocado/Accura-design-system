# Accordion

A vertically stacked set of interactive headings that each reveal a section of content. Built on Radix UI Accordion.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `accordion` | `27:3059` | 3 | Single accordion item — compose multiple instances at page level |

---

## Variant Matrix

### `accordion` — `State`

| Property | Options | Default |
|---|---|---|
| `State` | `Closed`, `Open`, `Disabled` | `Closed` |

`State(3) = 3 variants`

> The Figma component is one accordion **item**. A full accordion list is assembled by stacking multiple instances. No composite accordion-list component exists — compose at the page level.

---

## Structure

```
accordion                         — VERTICAL AUTO LAYOUT, fill: none, stroke: color/border/default 1px INSIDE
  ├─ trigger                      — FRAME, HORIZONTAL, padT/B: spacing/component/lg, gap: spacing/component/sm
  │    ├─ label                   — TEXT, fill: color/surface/default/foreground
  │    └─ chevron                 — INSTANCE (Icon Placeholder, stroke-based)
  │         └─ Icon               — VECTOR, stroke: color/surface/default/foreground
  └─ content                      — FRAME, VERTICAL, padB: spacing/component/lg  [Open state only]
       └─ content-text            — TEXT, fill: color/text/secondary
```

**Layout notes:**
- Trigger has no horizontal padding — it spans full width, with no left/right inset
- Content has no top padding — body text sits flush below the trigger's bottom padding
- The bottom border separator comes from the container's stroke, not a child element

---

## Token Bindings

### Container

| Layer | Property | Token | Notes |
|---|---|---|---|
| `accordion` | Fill | none | No background — transparent |
| `accordion` | Stroke | `color/border/default` 1px INSIDE | Bottom separator line between items |
| `accordion` | Corner radius | none (0px) | No rounding on the item frame |

### Trigger

| Layer | Property | Token | Notes |
|---|---|---|---|
| `trigger` | Padding top | `spacing/component/lg` | 16px |
| `trigger` | Padding bottom | `spacing/component/lg` | 16px |
| `trigger` | Padding left/right | none (0px) | Full-width, no horizontal inset |
| `trigger` | Gap | `spacing/component/sm` | 8px between label and chevron |
| `label` | Fill | `color/surface/default/foreground` | Default + Open states |
| `label` | Fill | `color/text/disabled` | Disabled state |

### Chevron icon

| Layer | Property | Token | Notes |
|---|---|---|---|
| `chevron / Icon` (VECTOR) | Stroke | `color/surface/default/foreground` | Default + Open states — bound on VECTOR, not instance fill |
| `chevron / Icon` (VECTOR) | Stroke | `color/text/disabled` | Disabled state |

> Chevron is an Icon Placeholder instance (stroke-based). Color is set on the `VECTOR` node's strokes — never on the instance fill.

### Content

| Layer | Property | Token | Notes |
|---|---|---|---|
| `content` | Padding bottom | `spacing/component/lg` | 16px — only present in Open state |
| `content-text` | Fill | `color/text/secondary` | Body copy uses secondary text, not primary |

---

## Behavior

### Open / Close

- Clicking a trigger toggles its item open or closed.
- `type="single"` (Radix UI default): only one item can be open at a time — opening a new item closes the current one.
- `type="multiple"`: multiple items can be open simultaneously.
- `collapsible` prop (boolean, default: `false`): when `false`, an open item cannot be closed by clicking its trigger again. Set `collapsible={true}` to allow all items to close.

### State transitions

- States are per-item — each item is independently Closed, Open, or Disabled.
- Disabled items cannot be opened or focused. The trigger is visually de-emphasised using `color/text/disabled`.
- No hover or focus state variant exists in Figma — these are implementation-level states (CSS only).

### Keyboard

| Key | Action |
|---|---|
| `Space` / `Enter` | Toggle focused item open or closed |
| `Tab` / `Shift+Tab` | Move focus between focusable elements on the page |
| `Arrow Down` | Move focus to the next accordion trigger |
| `Arrow Up` | Move focus to the previous accordion trigger |
| `Home` | Move focus to the first accordion trigger |
| `End` | Move focus to the last accordion trigger |

*(Source: Radix UI Accordion keyboard spec)*

### Animation

- Radix UI exposes `--radix-accordion-content-width` and `--radix-accordion-content-height` CSS variables on the Content element — use these to animate open/close height transitions.
- Animation timing is implementation-defined (not set by Radix defaults).

---

## Accessibility

| Property | Value |
|---|---|
| Role | `button` on trigger, `region` on content |
| Keyboard | Full keyboard nav — see Keyboard table above |
| Focus | Focus ring required on trigger — use `color/ring` (2px outside) |
| ARIA | `aria-expanded` on trigger, `aria-controls` linking trigger to content panel |

---

## Usage Rules

- Use accordion when content can be progressively disclosed — when showing all sections at once creates cognitive overload.
- Compose at page level: place multiple `accordion` instances in a vertical stack with no gap (`itemSpacing: 0`) — the bottom border on each item creates the visual separation.
- Do not set a fill on the accordion container — it is intentionally transparent.
- Use `type="single"` for FAQ-style lists where only one answer should be visible. Use `type="multiple"` when users may need to compare multiple sections simultaneously.
- Set `collapsible={true}` unless a default-open item must always remain visible.
- Do not use accordion for primary navigation — use a sidebar or nav menu component.
- Content text uses `color/text/secondary` — if the content includes headings or structured UI, override selectively inside the content slot.

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- FAQ pages where users scan question headings and only open relevant answers
- Settings panels with multiple grouped sections (Notifications, Privacy, Billing) where users rarely need all groups open at once
- Help centre or onboarding documentation that groups topics into collapsible categories
- Subscription or pricing pages that reveal plan details on demand without overwhelming the page
- Form sections with optional advanced configuration hidden by default
- Mobile views where vertical space is constrained and progressive disclosure is essential

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Closed` | Default resting state — content is hidden, trigger is visible | FAQ list at page load · Settings categories before any interaction · Collapsed filter panel |
| `Open` | User has expanded the item to read its content | Active answer on a FAQ page · Expanded billing section in account settings · Open notification preferences panel |
| `Disabled` | A section is unavailable in the current context (permissions, plan tier, incomplete prerequisite) | Locked plan features on a free tier · Incomplete step in a wizard · Read-only archived record |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Stacked sections where each reveals long-form content, multiple can be open | `accordion` | `tabs` |
| Mutually exclusive views where only one panel is visible at a time and sections have equal weight | `tabs` | `accordion` |
| Top-level app navigation with persistent sections | `sidebar` | `accordion` |
| A single disclosure toggle (one item, no stack) | `button` + conditional render | `accordion` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Set a fill on the chevron instance to change icon color | Bind stroke on the `Icon` VECTOR node inside the instance |
| Add horizontal padding to the trigger | Leave trigger at 0 horizontal padding — it spans full width |
| Add a corner radius to the accordion item | Radius is 0 — no rounding on the item frame |
| Set fill on the accordion container | Container is transparent — no fill |
| Use `color/surface/default/foreground` for secondary body copy | Use `color/text/secondary` for content body text |
| Build a raw chevron frame to replace the Icon Placeholder | Use the Icon Placeholder instance and bind the VECTOR stroke |
