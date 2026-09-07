# Badge

A small status label used to categorise, tag, or communicate state. Supports 11 visual variants, 3 shapes, 3 sizes, and optional leading/trailing icons.

---

## Variant Matrix

| Property | Options | Default |
|---|---|---|
| `Variant` | `Default`, `Secondary`, `Destructive`, `Outline`, `Success`, `Error`, `Warning`, `Blue`, `Online`, `Notification counters`, `Offline` | `Default` |
| `Shape` | `Default`, `Pill`, `Dashed` | `Default` |
| `Size` | `Small`, `Medium`, `Large` | `Small` |

### Shape availability per Variant

Not every Variant supports every Shape:

| Variant | Default shape | Pill shape | Dashed shape |
|---|---|---|---|
| `Default` | ✅ | ✅ | — |
| `Secondary` | ✅ | ✅ | — |
| `Destructive` | ✅ | ✅ | — |
| `Outline` | ✅ | ✅ | ✅ |
| `Success` | — | ✅ only | — |
| `Error` | — | ✅ only | — |
| `Warning` | — | ✅ only | — |
| `Blue` | — | ✅ only | — |
| `Online` | — | ✅ only | — |
| `Offline` | — | ✅ only | — |
| `Notification counters` | — | ✅ only (Small only) | — |

---

## Sizes

| Size | Height | Height token | Padding H token | Padding H | Gap token | Gap | Text style |
|---|---|---|---|---|---|---|---|
| `Small` | 16px | `badge/Badge-height-small` | `spacing/component/xs` | 4px | `spacing/component/xs` | 4px | `label/sm` |
| `Medium` | 20px | `badge/Badge-height-medium` | `spacing/component/sm` | 8px | `spacing/component/xs` | 4px | `label/sm` |
| `Large` | 24px | `badge/Badge-height-large` | `spacing/component/sm` | 8px | `spacing/component/xs` | 4px | `label/md` |

Width is auto (hug content) for all sizes. Icons: 12 × 12px across all sizes.

---

## Component Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `Variant` | VARIANT | `Default` | Visual style |
| `Shape` | VARIANT | `Default` | Border radius style |
| `Size` | VARIANT | `Small` | Size scale |
| `Leading icon` | BOOLEAN | `true` | Show/hide leading icon slot |
| `Trailing icon` | BOOLEAN | `false` | Show/hide trailing icon slot |
| `Leading icon swap` | INSTANCE_SWAP | placeholder | Swappable leading icon component |
| `Trailing icon swap` | INSTANCE_SWAP | placeholder | Swappable trailing icon component |

---

## Structure

### Standard badge (all variants except Online)
```
badge
  ├─ leading-icon — visible by default, wired to Leading icon prop
  ├─ label
  └─ trailing-icon — hidden by default, wired to Trailing icon prop
```

### Online / Offline variant
```
badge
  ├─ dot-slot — 6 × 6px status dot, always visible
  ├─ leading-icon — hidden by default, wired to Leading icon prop
  └─ label
```

> Both `Online` and `Offline` share this structure. The `dot-slot` color changes (`color/status/success` for Online, `color/status/offline` for Offline). The `leading-icon` slot exists but is hidden by default. There is no `trailing-icon` in either presence variant.

### Notification counters variant
```
badge
  └─ number — numeric count label, always visible
```

> `Notification counters` is a minimal pill badge — a number only, no icon slots. It is always `Size=Small` and `Shape=Pill`. Use it for unread counts and notification indicators.

---

## Token Bindings

### Per Variant — fills, strokes, fg

| Variant | Fill token | Border token | Text/icon fg token |
|---|---|---|---|
| `Default` | `color/brand/primary` | — | `color/brand/primary/foreground` |
| `Secondary` | `color/surface/accent` | `color/border/default` | `color/surface/accent/foreground` |
| `Destructive` | `color/brand/destructive` | — | `color/brand/destructive/foreground` |
| `Outline` (Default/Pill) | — (transparent) | `color/border/default` | `color/surface/default/foreground` |
| `Outline` (Dashed) | — (transparent) | `color/border/strong` | `color/surface/default/foreground` |
| `Success` | `color/status/success-subtle` | — | `color/status/success-subtle/foreground` |
| `Error` | `color/status/danger-subtle` | `color/border/error` | `color/status/danger-subtle/foreground` |
| `Warning` | `color/status/warning-subtle` | `color/border/warning` | `color/status/warning-subtle/foreground` |
| `Blue` | `color/status/info-subtle` | `color/border/subtle` | `color/status/info-subtle/foreground` |
| `Online` | — (transparent) | `color/border/default` | `color/surface/default/foreground` |
| `Offline` | — (transparent) | `color/border/default` | `color/surface/default/foreground` |
| `Notification counters` | `color/brand/primary` | — | `color/brand/primary/foreground` |

> Icon color always uses the same token as the text fg. Never use `color/icon/*` inside a badge.

### Per Shape — radius

| Shape | Radius token |
|---|---|
| `Default` | `radius/md` |
| `Pill` | `radius/full` |
| `Dashed` | `radius/md` |

> Dashed uses `radius/md` (same as Default) but with a dashed stroke pattern. The border token also changes from `color/border/default` to `color/border/strong`.

### Presence dot-slot tokens

| Variant | Element | Property | Token |
|---|---|---|---|
| `Online` | `dot-slot` | fill | `color/status/success` |
| `Online` | `dot-slot` | border-radius | `radius/full` |
| `Offline` | `dot-slot` | fill | `color/status/offline` |
| `Offline` | `dot-slot` | border-radius | `radius/full` |

### Size tokens — all variants share

| Property | Token |
|---|---|
| `height` | `badge/Badge-height-small` / `badge/Badge-height-medium` / `badge/Badge-height-large` |
| `padding-left` / `padding-right` | `spacing/component/xs` (Small) · `spacing/component/sm` (Medium / Large) |
| `gap` | `spacing/component/xs` (all sizes) |
| `border-radius` | `radius/md` (Default / Dashed) · `radius/full` (Pill) |

---

## Accessibility

| Property | Value |
|---|---|
| Role | No interactive role — badge renders as a `<div>` or `<span>` with no implicit role |
| Screen reader | Text content is read as-is — always include a visible label |
| Colour alone | Never rely on colour alone to communicate meaning — the label text must carry the semantic intent |
| Icon | Leading/trailing icons are decorative — mark with `aria-hidden="true"` in implementation |
| Presence dot | The `dot-slot` in Online and Offline variants is decorative — the label text ("Online", "Offline") carries the meaning. Mark dot with `aria-hidden="true"`. |
| Dynamic badges | `Notification counters`, `Online`, and `Offline` variants can update in real time. Wrap in `role="status"` or `aria-live="polite"` so screen readers announce the change. Static badges (Default, Secondary, Destructive, Outline, Success, Error, Warning, Blue) do not need `aria-live`. |

---

## Behavior

Badges are non-interactive by default — they have no hover, focus, or active states in Figma.

| Behaviour | Notes |
|---|---|
| Static display | Default — no interaction, no state change. No `aria-live` needed. |
| Dynamic count | `Notification counters` — the number updates in real time. Wrap with `role="status"` or `aria-live="polite"`. Cap display at "99+" to avoid layout overflow. |
| Dynamic presence | `Online` / `Offline` — status changes when user connects or disconnects. Wrap with `aria-live="polite"`. The dot color change alone is never sufficient — the label must also update. |

### No hover or focus states

Badge has no Hover, Focus, or Active variants. It is a pure display element. It is not a button, not a chip, not a filter control.

### Need a dismissible chip?

Use the **tag** component inside the combobox. Tag is a selected-value chip with a built-in remove action — it is the correct component for any "badge you can dismiss" pattern. Do not attempt to add dismiss functionality to badge.

### Need a clickable filter chip?

Tag also covers this. Badge is never clickable. If your design calls for a selectable or removable label, reach for tag — not a badge wrapped in a button.

---

## Usage Rules

Switch `Variant` for semantic meaning — never for visual preference alone.

### By variant

**`Default`** — Highlights important information, primary categories, or the current active state of an item. Uses the app's primary brand color — draws the most attention of any badge.
- Examples: "New Feature", "Status: Active", "Important"
- Use sparingly — one or two per view. If everything is important, nothing is.

**`Secondary`** — Neutral, supplementary context. Provides information without competing with primary elements. Lowest urgency of the filled variants.
- Examples: "Draft", "Category: General", background metadata tags

**`Outline`** — Lowest visual weight. Transparent background with a border — present but not prominent. Use when the badge needs to exist without drawing attention.
- Examples: Filter selections, ghost tags, secondary metadata

**`Destructive`** — Maximum urgency. Solid destructive fill with high-contrast foreground text. Reserved for things that are critically broken, gone, or require immediate user action. Keep text to 1–2 words.
- Examples: "Failed", "Deleted", "Rejected", "Blocked"
- Pair with a confirmation dialog when used alongside irreversible actions

**`Success`** — Positive or healthy state. Item is active, completed, or connected.
- Examples: "Active", "Connected", "Completed", "Live"

**`Error`** — Soft error state. Lighter than Destructive — for validation issues or recoverable errors that need visibility but are not critical.
- Examples: "Invalid", "Expired", "Limit Reached"

**`Warning`** — Caution state. Something needs attention but has not yet failed.
- Examples: "Expiring Soon", "Low Balance", "Needs Review"

**`Blue`** — Informational or in-progress state. Neutral signal, no urgency.
- Examples: "In Progress", "Pending", "Syncing", "Info"

**`Online`** — Presence or availability indicator. Uses a status dot instead of an icon. Not for system status — specifically for user or entity presence.
- Examples: "Online", "Available", "Active now"

**`Offline`** — User or entity is not currently available. Uses the same dot-slot structure as Online but with `color/status/offline` (neutral gray). Not for system errors — specifically for absence or unavailability.
- Examples: "Offline", "Away", "Unavailable"

**`Notification counters`** — Unread count or notification indicator. Always `Size=Small`, `Shape=Pill`. Contains only a number — no icons, no label prefix.
- Examples: "3", "12", "99+"
- Use `aria-live="polite"` — the count updates in real time
- Cap at "99+" to prevent layout overflow

### Shape intent

- **`Default` shape** — standard rounded rect, for inline content and general use
- **`Pill` shape** — fully rounded, softer — the required shape for all status and presence variants
- **`Dashed` shape** (`Outline` only) — signals something provisional, pending, or not yet confirmed. Use for placeholder states or items awaiting action.

---

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- Displaying the status of a record in a table row ("Active", "Expired", "Pending review")
- Labelling a list item with a category or tag ("Design", "Engineering", "Billing")
- Showing an unread notification count on a sidebar nav item or inbox icon
- Indicating user presence next to a name in a team list ("Online", "Away")
- Marking a new or recently changed item with a "New" or "Updated" label
- Flagging a failed or blocked state on a data record ("Failed", "Blocked")

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Default` | Highest-attention label — primary category or active state | "New Feature" · "Active" · "Important" |
| `Secondary` | Neutral metadata that provides context without competing for attention | "Draft" · "General" · "Category: Design" |
| `Outline` | Present but not prominent — ghost tags and secondary metadata | Filter chip selections · Secondary metadata tags · "Optional" labels |
| `Destructive` | Critical or irreversible — something is broken or gone | "Failed" · "Deleted" · "Rejected" · "Blocked" |
| `Success` | Positive or healthy state — item is active or complete | "Active" · "Connected" · "Completed" · "Live" |
| `Error` | Soft recoverable error — needs attention but not critical | "Invalid" · "Expired" · "Limit Reached" |
| `Warning` | Caution — something needs attention before it fails | "Expiring Soon" · "Low Balance" · "Needs Review" |
| `Blue` | Informational or in-progress — neutral signal, no urgency | "In Progress" · "Pending" · "Syncing" |
| `Online` | User or entity is currently available | "Online" · "Available" · "Active now" |
| `Offline` | User or entity is absent or unavailable | "Offline" · "Away" · "Unavailable" |
| `Notification counters` | Unread count on a nav item or icon | "3" · "12" · "99+" on a mail icon or sidebar item |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| The label needs to be dismissible by the user (a selected filter chip, a tag in a combobox) | `tag` (inside combobox) | `badge` (badge has no interactive states and cannot be dismissed) |
| The label needs to be clickable to trigger navigation or filtering | `tag` or a `button` Type=Ghost | `badge` (badge is display-only; wrapping in a button breaks accessible semantics) |
| The user's presence changes in real time and needs screen reader announcement | `badge` Variant=Online/Offline with `aria-live="polite"` | A static colored dot without a label (colour alone is never sufficient) |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Raw frame with hardcoded fill + border-radius | `badge` component with correct `Variant` |
| Override fill color directly on instance | Switch `Variant` prop |
| `Variant=Destructive` for soft error states | `Variant=Error` — Destructive is for critical/irreversible only |
| `Variant=Destructive` for positive labels like "Sale" or "New" | `Variant=Default` — red signals danger, not opportunity |
| `Variant=Error` when something is critically broken | `Variant=Destructive` — Error is for soft/recoverable errors |
| `Variant=Default` when providing neutral metadata | `Variant=Secondary` — Default draws too much attention |
| `Variant=Online` for system status | `Variant=Success` or `Variant=Error` — Online is for user/entity presence only |
| `Variant=Offline` for errors or system down | `Variant=Error` — Offline means absent/unavailable, not broken |
| `Variant=Notification counters` with text labels | Notification counters is numbers only — use `Variant=Default` for labelled badges |
| `Notification counters` without `aria-live` | Always wrap in `role="status"` or `aria-live="polite"` — counts update in real time |
| `Notification counters` showing raw numbers above 99 | Cap at "99+" — larger numbers cause layout overflow |
| `color/icon/*` on icon inside badge | Use the variant's fg token |
| Status variants (`Success`, `Error`, `Warning`, `Blue`, `Online`, `Offline`) with `Default` or `Dashed` shape | Pill shape only for all status/presence variants |
| `color/border/default` on Dashed Outline | Dashed uses `color/border/strong` |
| More than 2–3 words in a Destructive badge | Keep it short — "Failed", "Deleted", not "This action has failed" |
| Relying on color alone to communicate state | Always include a descriptive label — colour is supplementary |
| Badge with a dismiss `×` button | Use the `tag` component from combobox — that is what tag is for |
| Badge wrapped in `<button>` to make it clickable | Use `tag` — badge has no interactive states and should not gain them |

---

## Decisions

**1. Dynamic badge content — `aria-live` is required for dynamic variants.**

Decided 2026-05-28. The following variants update in real time and must be wrapped in `role="status"` or `aria-live="polite"` at the implementation level:
- `Notification counters` — the count changes as new notifications arrive
- `Online` / `Offline` — presence state changes when a user connects or disconnects

Static variants (Default, Secondary, Destructive, Outline, Success, Error, Warning, Blue) render fixed content and do not need `aria-live`.

The badge component itself does not render `aria-live` — the page or feature wrapping the badge is responsible for adding it.

**2. The presence dot — colour + label is sufficient.**

Decided 2026-05-28. The `dot-slot` in Online and Offline variants is a decorative visual element. The label text ("Online", "Offline", "Available") carries the full accessible meaning. Mark the dot with `aria-hidden="true"`. No additional `aria-label` on the dot is needed.
