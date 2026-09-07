# [Component Name]

[One sentence describing what it is and what it supports. Example: "A clickable action element. Supports 6 visual types, 5 states, and 8 sizes including icon-only variants."]

---

## Variant Matrix

List every variant property, its options, and its default.

| Property | Options | Default |
|---|---|---|
| `Type` | `Default`, `Outline`, `Ghost` | `Default` |
| `State` | `Enabled`, `Hover`, `Focus`, `Disabled`, `Active` | `Enabled` |
| `Size` | `SM`, `MD`, `LG` | `MD` |

> If not all combinations exist, add a table showing which combos are valid:
>
> | Variant | Shape=Default | Shape=Pill | Shape=Dashed |
> |---|---|---|---|
> | `Default` | ✅ | ✅ | — |
> | `Status` | — | ✅ only | — |

---

## Sizes

_Skip this section if the component has no Size variant._

| Size | Height | Height token | Padding H token | Padding H | Gap token | Gap | Text style |
|---|---|---|---|---|---|---|---|
| `SM` | 24px | `component/height-sm` | `spacing/component/xs` | 4px | `spacing/component/xs` | 4px | `label/sm` |
| `MD` | 32px | `component/height-md` | `spacing/component/sm` | 8px | `spacing/component/xs` | 4px | `label/md` |
| `LG` | 40px | `component/height-lg` | `spacing/component/sm` | 8px | `spacing/component/sm` | 8px | `label/md` |

[Note width behaviour: auto (hug content) / fixed square / fill container]

[Note icon size if applicable: N × Npx]

---

## Component Properties

Every prop on the component — variants, booleans, text content, swappable slots.

| Property | Type | Default | Notes |
|---|---|---|---|
| `Type` | VARIANT | `Default` | Visual style |
| `State` | VARIANT | `Enabled` | Interaction state |
| `Size` | VARIANT | `MD` | Size scale |
| `Label` | TEXT | `"Label"` | Editable text content |
| `Leading Icon` | BOOLEAN | `false` | Show/hide leading icon slot |
| `Trailing Icon` | BOOLEAN | `false` | Show/hide trailing icon slot |
| `Icon swap` | INSTANCE_SWAP | placeholder | Swappable icon component |

Property types:
- `VARIANT` — enum, switches visual/state/size
- `BOOLEAN` — toggles a layer on/off
- `TEXT` — editable content layer
- `INSTANCE_SWAP` — swappable sub-component (icon, avatar, etc.)
- `SLOT` — open-ended content zone; designer drops content in at use time

**When to use each:**
| Situation | Use |
|---|---|
| Content options are finite and known | `INSTANCE_SWAP` or `VARIANT` |
| Show / hide a fixed layer | `BOOLEAN` |
| Content is unpredictable, varies per use case | `SLOT` |
| Swapping between specific known components | `INSTANCE_SWAP` |

### If this component has slots

**Slot count — consult shadcn/Tailwind first**
Check what the shadcn component typically renders as children. Match that as the starting slot count in Figma.

```
## Slots

| Slot name | Accepts | Count in Figma | Notes |
|---|---|---|---|
| `content` | Any content | 1 | Open-ended — form, list, text, anything |
| `cell` | `table-cell` only | 2–3 | Typed — must be replaced with a table-cell instance |
```

**Open-ended vs typed — always document this:**
- **Open-ended**: drawer body, dialog body, card body, popover, tab panel — designer puts anything in
- **Typed**: table row cells, list items — slot must be replaced with a specific component type; call this out explicitly so designers and devs know the constraint

**Slot count guidance:**
```
## Slot count — Figma vs code

The Figma component shows [N] slot(s). This is a design-time starting point — not a system limit.

- **In Figma** — add more instances manually in your mockup if you need more than [N].
- **In code** — fully flexible. Pass any number of children.
- **Recommended range** — [X–Y]. [Brief rationale.]
- **Slot accepts** — [open-ended / typed: must be `component-name`]
```

Keep the recommended range honest — design guidance, not a hard rule. The Figma slot count is always a convenience, never a code constraint.

---

## Structure

Component anatomy — layers, visibility, what each boolean prop controls.

### [Variant group A — e.g. text variant]
```
component-name
  ├─ leading-icon — hidden by default, shown via Leading Icon prop
  ├─ label — always visible
  └─ trailing-icon — hidden by default, shown via Trailing Icon prop
```

### [Variant group B — e.g. icon-only variant]
```
component-name
  └─ icon — always visible, not wired to a boolean prop
```

> [Note any naming differences or structural exceptions between variants or sizes.]

---

## Token Bindings

### Per [Type / Variant] — fills, strokes, fg

| Type | Fill token | Border token | Text/icon fg token |
|---|---|---|---|
| `Default` | `component/default/bg` | — | `component/default/fg` |
| `Outline` | — (transparent) | `color/border/default` | `color/background/default/foreground` |
| `Ghost` | — (transparent) | — | `component/ghost/fg` |

> Icon color always follows the text fg token — never use `color/icon/*` inside a filled component.

### Per State — [include only if the component has interaction states]

| State | Token | Notes |
|---|---|---|
| `Enabled` | `component/token/default` | — |
| `Hover` | `component/token/hover` | — |
| `Focus` | `color/ring` as border stroke | Except Destructive — see below |
| `Active` | `component/token/active` | — |
| `Disabled` | `component/token/disabled` | — |

> [Note any per-type state exceptions. Example: Destructive Focus uses `focus/destructive` effect style instead of `color/ring`.]

### Size tokens — all variants share

| Property | Token |
|---|---|
| `height` | `component/height-sm` / `component/height-md` / `component/height-lg` |
| `padding-left` / `padding-right` | `spacing/component/xs` (SM) · `spacing/component/sm` (MD / LG) |
| `gap` | `spacing/component/xs` |
| `border-radius` | `radius/md` (Default) · `radius/full` (Pill) |

### Effect styles — [include only if shadows apply]

| State | Variants | Effect style |
|---|---|---|
| `Enabled`, `Hover`, `Active` | All except Ghost, Link | `shadows/2xs` |
| `Focus` | `Destructive` only | `focus/destructive` |

### [Special elements] — [include only if the component has unique sub-elements]

For elements that don't follow the standard fill/fg pattern — e.g. status dots, badge rings, tracks.

| Element | Property | Token |
|---|---|---|
| `element-name` | `fill` | `color/status/success` |
| `element-name` | `border-radius` | `radius/full` |
| `element-name` | `stroke` | `color/background/default` |

---

## Sub-components — [include only if component embeds other components]

| Sub-component | Variants | When it appears |
|---|---|---|
| `_sub-component` | `Type=A`, `Type=B` | When `Badge=True` |

[Brief note on the sub-component: size, token bindings, any override behaviour.]

---

## Accessibility

> **How to write this section:**
> Use WAI-ARIA APG and shadcn/ui as knowledge sources to understand standard patterns — not as a specification to import wholesale. Document only what our system actually specifies. Remove any row that contradicts a decision already made in Behavior or Usage Rules. If something is genuinely undecided or unclear for our system, put it in Open Questions instead of guessing.
>
> Knowledge sources: WAI-ARIA APG — https://www.w3.org/WAI/ARIA/apg/patterns/ · shadcn/ui — https://ui.shadcn.com/docs/components/[name] · Figma audit output

| Property | Value |
|---|---|
| Role | `[button / checkbox / dialog / listbox / tab / …]` |
| Touch target | Minimum 44 × 44px — visual size may be smaller, hit area must be padded up |
| Focus indicator | `color/ring` stroke · 2px offset · required on all interactive states |
| Keyboard | [e.g. Tab to focus · Space or Enter to activate] |
| Screen reader name | [e.g. Visible label · Icon-only: tooltip text is the accessible name] |

> Do not remove or hide the focus ring for aesthetic reasons — it is a WCAG requirement.
> [Add any component-specific accessibility notes, e.g. required tooltip for icon-only, announce on change, etc.]

---

## Behavior

> **How to write this section:**
> Base this entirely on what exists in Figma and what we have decided for our system. Use shadcn/ui and WAI-ARIA APG to fill gaps in understanding, but only document states and rules that are true for our component. If a standard pattern does not apply here (e.g. no hover state, not interactive), say so explicitly rather than omitting it silently. If an interaction detail is undecided, put it in Open Questions.
>
> Knowledge sources: shadcn/ui — https://ui.shadcn.com/docs/components/[name] · WAI-ARIA APG — https://www.w3.org/WAI/ARIA/apg/patterns/ · Figma audit output

What triggers each state and any interaction rules.

| State | Triggered by | Notes |
|---|---|---|
| `Hover` | Mouse over | Desktop only — touch devices skip directly to Active |
| `Focus` | Tab key · click without drag | Always shows focus ring |
| `Active` | Mousedown · touch start | Held until pointer release |
| `Disabled` | `Disabled` prop true | No hover, focus, or active — not interactive |
| `Loading` | Async action in progress | Interaction locked — do not allow re-trigger while loading |

> [Add any component-specific behavior: toggle logic, expand/collapse, selection persistence, multi-select, etc.]
> [Note if Hover state does not exist, e.g. mobile-only components.]

### Motion — [remove this sub-section if the component does not animate]

| Transition | Token | Properties |
|---|---|---|
| Enter / show | `motion/enter` | [e.g. opacity 0→1 · translateY +4px→0] |
| Exit / hide | `motion/exit` | [e.g. opacity 1→0] |
| Expand | `motion/expand` | [e.g. height auto→0 · opacity] |

> Reduced motion: skip all transforms and opacity transitions — show the end state immediately.
> Never animate color or fill changes — only geometry and opacity.

---

## Usage Rules

Semantic intent — when to use this component and which variant means what.

- `[Variant]` = [what it communicates / when to reach for it]
- `[Variant]` ≠ [what it is NOT for — common confusion]
- [Any constraints: one per page, surface pairing, icon rules, etc.]

---

## Best Practice

> **How to write this section:**
> Pull real-world use cases from the shadcn component page (Examples tab + Usage section) and common product UI patterns.
>
> References to check before writing:
> - shadcn: `https://ui.shadcn.com/docs/components/[component-name]`
> - Radix UI (for behaviour layer): `https://www.radix-ui.com/primitives/docs/components/[name]`
> - WAI-ARIA APG (for accessible pattern examples): `https://www.w3.org/WAI/ARIA/apg/patterns/`
>
> Rules:
> - Write 3–6 **concrete** UI scenarios, not abstract principles. A designer should recognise them from real products.
> - Every variant must have at least 2 real examples — one obvious, one less obvious.
> - The "Compared to similar components" table is mandatory. It is the most important part of this section for AI component selection.
> - Do not repeat what is already in Usage Rules. Usage Rules = semantic meaning. Best Practice = concrete situation + decision.

### Use cases

Concrete UI situations where this component is the right choice:

- [Scenario — e.g. "Showing an unread message count on a nav icon"]
- [Scenario]
- [Scenario]
- [Add 3–6 total]

### Per-variant examples

| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `[Variant A]` | [One-line when-to-use] | [Example 1] · [Example 2] · [Example 3] |
| `[Variant B]` | [One-line when-to-use] | [Example 1] · [Example 2] |

### Compared to similar components

> Fill this table any time two components could plausibly solve the same problem.
> Frame it as a decision signal, not a prohibition — both may be valid, just in different contexts.

| If the situation is… | Use | Not |
|---|---|---|
| [Concrete signal that makes this component right] | `this-component` | `similar-component` |
| [Concrete signal that makes the alternative right] | `similar-component` | `this-component` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Raw frame with hardcoded values | `component-name` with correct variant |
| Override fill directly on instance | Switch the variant prop |
| `color/icon/*` on icon inside component | Use the container's `/foreground` token |
| [Specific wrong usage for this component] | [What to do instead] |

---

## Open Questions

_Remove this section when all questions are resolved._

Things not yet decided for this component. Resolve before writing the implementation spec or handing off to engineering.

**[Question title]**

[What the question is, why it matters, and what context is needed to answer it.]

Questions to answer:
- [Specific question 1]
- [Specific question 2]
