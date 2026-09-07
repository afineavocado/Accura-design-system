# Avatar

A circular user representation. Supports 2 types (photo and initials fallback), 3 sizes, and an optional online/offline status indicator.

---

## Variant Matrix

| Property | Options | Default |
|---|---|---|
| `Type` | `Image`, `Fallback` | `Image` |
| `Size` | `SM`, `Default`, `LG` | `SM` |
| `Badge` | `False`, `True` | `False` |

All 12 combinations are valid.

---

## Sizes

| Size | Dimensions | Text style |
|---|---|---|
| `SM` | 32 × 32px | `label/sm` |
| `Default` | 40 × 40px | `label/md` |
| `LG` | 56 × 56px | `label/md` |

All sizes are fixed square. Avatar never hugs or fills — always switch via the `Size` variant prop.

---

## Component Properties

| Property | Type | Default | Notes |
|---|---|---|---|
| `Type` | VARIANT | `Image` | `Image` shows a photo fill · `Fallback` shows initials |
| `Size` | VARIANT | `SM` | Controls dimensions and text style |
| `Badge` | VARIANT | `False` | `True` shows the `avatar-indicator` sub-component |

> `Badge` is a VARIANT (`True`/`False`), not a BOOLEAN prop. Use "Set variant" in Figma, not a boolean toggle.

---

## Structure

### Type=Image
```
avatar
  └─ (image fill — no child layers)
```

### Type=Fallback
```
avatar
  └─ label — initials text, always visible
```

### Badge=True (either Type)
```
avatar
  ├─ label — present on Fallback only
  └─ avatar-indicator — instance, positioned bottom-right
```

---

## Token Bindings

### Per Type — fills & radius

| Type | Fill token | Radius token |
|---|---|---|
| `Image` | — (image fill, no color token) | `radius/full` |
| `Fallback` | `color/surface/muted` | `radius/full` |

### Fallback — text

| Element | Token |
|---|---|
| `label` fill | `color/surface/muted/foreground` |
| `label` text style | `label/sm` (SM) · `label/md` (Default / LG) |

### Sub-component — `avatar-indicator`

| Variant | Element | Token |
|---|---|---|
| `type=online` | fill | `color/status/success` |
| `type=offline` | fill | `color/status/offline` |

Both variants use `radius/full`. No stroke — the indicator is a pure filled dot.

| Size | Dimensions |
|---|---|
| `size=Default` | 8 × 8px |
| `size=large` | 12 × 12px |

> Size pairing: use `size=Default` with `Size=SM` avatars, `size=large` with `Size=Default` and `Size=LG` avatars.

---

## Sub-components

| Sub-component | Figma ID | Variants | When it appears |
|---|---|---|---|
| `avatar-indicator` | `60:18573` | `type=online` / `type=offline` × `size=Default` / `size=large` | When `Badge=True` |

- `type=online` — user is active and connected. Fill: `color/status/success`.
- `type=offline` — user is absent or unavailable. Fill: `color/status/offline`.

Do not use `avatar-indicator` as a standalone component outside of `avatar`.

---

## Accessibility

| Property | Value |
|---|---|
| Role | `img` |
| Touch target | SM (32px) ⚠️ needs 6px padding · Default (40px) ⚠️ needs 2px · LG (56px) ✅ |
| Screen reader name | Full name as `alt` or `aria-label` — never just initials |
| Badge | Pair `avatar-indicator` with an accessible status label (e.g. `aria-label="Online"` on the avatar wrapper) — dot color alone is not screen-reader accessible |

---

## Behavior

| State | Notes |
|---|---|
| Static (default) | No interactive states — avatar is display-only unless wrapped in a button or link |
| Interactive | If clickable, wrap in a button or anchor and add focus/hover states at the wrapper level — not on the avatar component itself |

---

## Usage Rules

- Use `Image` when a photo URL is available — always prefer it over `Fallback`
- Use `Fallback` when no photo exists — show 1–2 initials (first + last name initial)
- `Badge=True` with `type=online` — user is active/connected
- `Badge=True` with `type=offline` — user is absent/unavailable
- Match `avatar-indicator` size to the avatar size: `size=Default` (8px) for `Size=SM`, `size=large` (12px) for `Size=Default` and `Size=LG`
- Size choice follows context: `SM` in dense lists and table rows · `Default` in cards and comment threads · `LG` in profile headers

## Best Practice

### Use cases

Concrete UI situations where this component is the right choice:

- User profile headers where a photo or initials identifies the account owner at a glance
- Comment threads and activity feeds where each entry is attributed to a specific person
- Team member lists and collaborator panels in project or document views
- Table rows representing people (paired with name and role text)
- Chat interfaces where each message is associated with its sender
- Dropdown or popover triggers that open a user account menu

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `Image` | A verified photo URL is available — always prefer this over Fallback | Profile header · Comment attribution · Team member card |
| `Fallback` | No photo exists or fails to load — show 1–2 initials | New user who skipped photo upload · SSO user with no avatar on file · Deleted account placeholder |
| `SM` (32px) | Dense contexts where the avatar supports other content rather than leads it | Table rows · Notification list items · Compact activity feeds |
| `Default` (40px) | Standard use — comfortable size for lists, cards, and comment threads | Comment threads · Card headers · Settings profile row |
| `LG` (56px) | The avatar is the primary visual anchor of the view | Profile page header · Account settings page · User detail modal |
| `Badge=True` | A presence or availability signal is needed alongside the identity | Chat participant list (online/offline) · Collaboration toolbar · "Who's viewing" panel |

### Compared to similar components

| If the situation is… | Use | Not |
|---|---|---|
| Showing a user's identity (photo or initials) | `avatar` | A raw circle frame with image fill |
| Showing online/offline presence status overlaid on a user identity | `avatar` with `Badge=True` + `avatar-indicator` | `badge` as a standalone element |
| Showing a category label, count, or status chip unrelated to a person | `badge` | `avatar` |
| Showing a small thumbnail for a product, file, or non-person entity | `item` (`Type=Image`) | `avatar` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Raw circle frame with image fill | `avatar` component, `Type=Image` |
| `color/background/muted` on fallback fill | `color/surface/muted` — avatar is a component surface |
| Three or more characters in `label` | 1–2 initials only |
| Detaching `avatar-indicator` to customise it | Switch `type=` variant instead |
| Avatar as interactive element without a focus ring | Wrap in a button/link at implementation level |
| Using `avatar-indicator` standalone outside an avatar | It is a sub-component — only use inside `avatar` |
