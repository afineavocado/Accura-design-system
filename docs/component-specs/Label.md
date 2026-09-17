# Label

The text that names a form field, with the required marker. Three states and an optional asterisk.
Built on Radix `LabelPrimitive.Root`, so `htmlFor` gives it the native label behaviour — clicking it
focuses the field.

Until 2026-09-17 this component had no spec of its own: it was two code samples inside
`Form-shared.md`, which describes the field *anatomy* rather than this component's API. Seven
consumers hand-rolled the asterisk in that time.

**Source of truth:** `accura-ui/src/components/ui/label.tsx`, then `src/stories/Label.stories.tsx`.
Anatomy and the Figma structure are in `Form-shared.md` → *label*; this file is the component.

---

## Variant Matrix

| Property | Options | Default |
|---|---|---|
| `state` | `default`, `disabled`, `invalid` | `default` |
| `required` | `true`, `false` | `false` |

There is no size variant. The label is always `text-sm` / `font-medium` / `leading-none` — the
type is the component's, not the page's.

---

## Anatomy

```
label                    — inline flex, gap: spacing/component/xs (4px), items-center
  ├─ label-text          — the children
  └─ label-required      — the asterisk, rendered only when `required`
       ├─ "*"            — aria-hidden
       └─ "(required)"   — sr-only, so assistive tech hears the requirement
```

---

## Tokens

| Part | State | Token |
|---|---|---|
| `label-text` | `default` | `color/background/default/foreground` |
| `label-text` | `disabled` | `color/text/disabled` |
| `label-text` | `invalid` | `color/text/invalid` |
| `label-required` | `default` | `color/status/danger` |
| `label-required` | `disabled` | `color/text/disabled` |
| `label-required` | `invalid` | `color/text/invalid` |
| gap | all | `spacing/component/xs` |

The marker follows the field's state **except** in `default`, where it is `color/status/danger`
rather than the label's own foreground. That exception is the whole reason the hand-rolled copies
were wrong: inheriting the label colour renders a black asterisk.

---

## In code

```tsx
<Label htmlFor="document-name" required>Document name</Label>
<Label htmlFor="reviewer" required state="invalid">Reviewer</Label>
<Label htmlFor="note">Additional note (optional)</Label>
```

`state` is set by the form, not guessed by the label — pass `invalid` when the field is invalid so
the two agree.

---

## Usage Rules

- **Never hand-roll the asterisk.** `required` exists. Seven consumers wrote their own, one of them
  black because it inherited the label colour, and the seventh appeared in Change Control on
  2026-09-17 — three days after the prop shipped.
- **`required` on the label is presentation only.** It renders the marker and the `sr-only` text; it
  does not make the field required. Set `required` / `aria-required` on the input as well.
- **Do not restyle the text from the page.** No `text-*`, `font-*` or colour class on the instance —
  the label carries one type treatment on purpose, and a page that overrides it is the start of two
  label styles.
- **Always pair with `htmlFor`.** A label with no association is decorative text that happens to sit
  above a field.
- Optional fields say so in the label text — `Additional note (optional)` — rather than being
  distinguished by the absence of a marker, which no one can see.

---

## Related

- `Form-shared.md` — the field anatomy this label sits inside, and the shared error/description parts
- `Input.md`, `Combobox.md`, `Select.md`, `Textarea.md` — the controls it names

---

## Verification

**Not verified against Figma** (`150:569`). The implementation was written from `Form-shared.md`'s
anatomy on 2026-09-14 and the states table above is read from `label.tsx`. Counted in the
verification debt in `docs/tracking/AI-Readiness.md`.
