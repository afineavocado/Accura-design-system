# Meta Artifact Requirements

Meta artifacts convert component markdown into machine-readable component knowledge.

They are not implementation files and they are not replacements for the source markdown. They are structured extraction files that let future tools generate Storybook stories, Code Connect mappings, code examples, audits, and AI-readable component indexes.

## Trigger Rule — When to Regenerate

**Any time a component is touched, regenerate its meta.json in the same session. No exceptions.**

"Touched" means: spacing fix applied, token rebound, variant added, doc updated, audit run, structure changed, story added or changed, bug fixed, breaking change made.

Full trigger table in `meta-artifact-template.md → Regeneration Trigger Rule`.

Never let the markdown doc and meta.json drift apart. If the doc changes and the JSON isn't regenerated, the JSON is stale and must be marked `needs audit`.

---

## Three-Stage Generation Process

Every meta artifact must be produced through these three stages in order. Do not skip or reorder.

### Stage 1 — Figma Inspection (source of truth)

Run a figma-cli inspection of the component before writing anything. Capture:

- Every bound variable ID on every node
- Resolve each ID to its token name
- Record: fill, stroke (color + weight + align), corner radius, all 4 padding sides, `itemSpacing` for every frame with children, opacity bindings if present

Do not write any token into the doc or JSON from memory. If a token was not seen in the inspection, it does not go in.

**Token categories checklist — every auto-layout frame must account for all of these:**

| Category | What to check |
|---|---|
| Fill | bound variable ID → token name, or explicitly `transparent` |
| Stroke | color token + weight (px) + alignment (INSIDE / OUTSIDE / CENTER) |
| Corner radius | bound variable or explicitly `none` |
| Padding top / bottom | bound variable or `0` |
| Padding left / right | bound variable or `0` |
| `itemSpacing` / gap | bound variable or `0` — **do not skip, even if 0** |
| Opacity | bound variable if present; omit only if no binding exists |

### Stage 2 — Markdown Doc (human-readable spec)

Write the Token Bindings section from the inspection data. Rules:

- Every frame in the structure tree must have a token bindings row
- Gaps and padding must appear as structured table rows — not prose descriptions
- If a frame has nested children with their own gaps, document each frame separately
- If a layout difference exists between variant combinations (e.g. flat vs nested), call it out explicitly with a `when:` condition

### Stage 3 — meta.json (machine-readable extraction)

Extract from the completed, Figma-verified markdown. Rules:

- `tokens` object must cover every category from Stage 1
- Gap tokens must appear as a structured `gaps` object, not embedded in prose
- `when:` conditions from the markdown must be preserved in the JSON (e.g. `"when": "Has Icon=True OR Has Action=True"`)
- If the markdown has a ⚠️ flag on a token (primitive, unresolved), carry that flag into `constraints` — do not silently omit it
- Set `artifactStatus` from the markdown state, not from the roadmap

---

## Backlog Priority

Not all existing artifacts have been re-inspected through the full 3-stage process. Handle the backlog as follows:

- **Components we touch in a session** → always run all 3 stages and regenerate the meta.json
- **High-risk components** (complex auto-layout, many nested frames) → prioritise for re-inspection: `input`, `select`, `combobox`, `item`, `card`, `dialog`, `table`, `tabs`
- **Low-risk components** (simple or few frames) → `separator`, `badge`, `label`, `progress` — regenerate opportunistically

An artifact generated before the 3-stage process was established is not guaranteed to have complete gap/padding coverage. Do not treat existing `ready` status as confirmation of completeness for those components.

---

## Collaboration Rule

Before generating or changing a batch of meta artifacts, Codex must show the planned batch and wait for approval.

The approval request must include:

- components included in the batch
- source markdown files used
- schema changes, if any
- React/shadcn API assumptions, if any
- expected artifact status for each component

Existing project documents remain read-only unless the user approves a specific edit.

## Output Location

All generated artifacts must live under:

```txt
codex plan/artifacts/
```

Required output files for each component:

```txt
codex plan/artifacts/components/[component].meta.json
codex plan/artifacts/examples/[component].examples.tsx
```

Shared support files:

```txt
codex plan/artifacts/schema/component-meta.schema.json
codex plan/artifacts/review-report.md
```

## Artifact Status

Every meta artifact must include `artifactStatus`.

| Status | Use when |
|---|---|
| `ready` | Source markdown is complete enough and no unresolved audit/product questions remain |
| `needs review` | Artifact is generated, but product/API/accessibility questions remain |
| `needs audit` | Source markdown explicitly says a Figma audit is required before approval |
| `stale` | Source markdown explicitly says it should not be used because the component is stale or being rebuilt |
| `blocked` | Artifact cannot be generated because required source material is missing |

## Required Fields

Every `[component].meta.json` must include:

| Field | Purpose |
|---|---|
| `name` | kebab-case component name |
| `sourceMarkdown` | source markdown path used for extraction |
| `artifactStatus` | current approval/readiness state |
| `description` | one-sentence component summary |
| `category` | component group such as `actions`, `forms`, `display`, `layout`, `navigation`, `overlay` |
| `shadcnBase` | nearest shadcn/Radix base component or `custom` |
| `variants` | variant names, options, defaults, and React prop mapping |
| `tokens` | token bindings extracted from markdown |
| `accessibility` | role, keyboard, screen reader, touch target, and focus rules |
| `constraints` | usage rules and do-not rules that tools must enforce |
| `examples` | linked `.examples.tsx` file and named exports |
| `bestPractice` | extracted from the **Best Practice** section in the markdown — see schema below |

### `bestPractice` field schema

Extract directly from the markdown Best Practice section. Required sub-fields:

```json
"bestPractice": {
  "useCases": [
    "Concrete UI scenario 1",
    "Concrete UI scenario 2"
  ],
  "variantExamples": {
    "VariantA": {
      "whenToUse": "One-line when-to-use",
      "examples": ["Example 1", "Example 2", "Example 3"]
    },
    "VariantB": {
      "whenToUse": "One-line when-to-use",
      "examples": ["Example 1", "Example 2"]
    }
  },
  "comparedTo": [
    {
      "situation": "Concrete signal that makes this component right",
      "use": "this-component",
      "notInstead": "similar-component"
    },
    {
      "situation": "Concrete signal that makes the alternative right",
      "use": "similar-component",
      "notInstead": "this-component"
    }
  ],
  "references": {
    "shadcn": "https://ui.shadcn.com/docs/components/[name]",
    "radix": "https://www.radix-ui.com/primitives/docs/components/[name]"
  }
}
```

Rules:
- `useCases` — minimum 3 items, maximum 6. Concrete scenarios only, not abstract principles.
- `variantExamples` — every variant that has a usage distinction must appear. Skip variants that are purely visual (e.g. `Disabled`) with no usage difference.
- `comparedTo` — mandatory when 2+ components in the system could plausibly solve the same problem. Leave as empty array `[]` only if the component has no plausible alternatives.
- `references.shadcn` — always include. Use `null` only for fully custom components with no shadcn base.
- `references.radix` — include only when there is a Radix UI primitive that drives the component's behaviour.

### `variantExamples` key format rules

**Use bare values when there is only one variant dimension:**
```json
"variantExamples": {
  "Default": { ... },
  "Destructive": { ... }
}
```
This is correct when `variants` has a single property (e.g. `Variant`) whose values are unambiguous on their own.

**Use `Property=Value` format when there are multiple variant dimensions or when the value name alone is ambiguous:**
```json
"variantExamples": {
  "Type=Input": { ... },
  "State=Filled": { ... }
}
```
Use this when the markdown source itself uses `Property=Value` notation in the Per-variant table, or when two variant dimensions share value names (e.g. both `Type` and `State` could have a `Default` value).

**No variants — composable primitives (e.g. Skeleton, Separator):**

Set `variantExamples: null` and add a `compositionPatterns` sibling field instead:
```json
"bestPractice": {
  "useCases": [...],
  "variantExamples": null,
  "compositionPatterns": {
    "Circle + text lines": {
      "whenToUse": "User or entity placeholder",
      "examples": ["Avatar + name + email row"]
    }
  },
  "comparedTo": [...],
  "references": { ... }
}
```

**Sub-types that are separate components — not Figma variants:**

Some components have sub-types that map to different Figma component sets or shadcn components (e.g. `alert` vs `alert-dialog`). These are NOT variant values and must NOT appear as `variantExamples` keys. Document the distinction in `useCases` and `comparedTo` instead.

## Recommended Fields

Use these when available:

| Field | Purpose |
|---|---|
| `figmaNodeId` | Figma component or component-set node ID |
| `componentSets` | multiple related Figma sets, such as `switch` and `switch-item` |
| `componentProperties` | Figma text, boolean, slot, and instance-swap props |
| `composition` | layers, slots, sub-components, and structural rules |
| `availability` | invalid or unsupported variant combinations |
| `review` | notes, open questions, assumptions, and audit blockers |

## `relationships` — Extended Schema

The `relationships` field has two layers. Both are required when applicable:

**Structural** (who embeds whom):
- `subComponents` — components embedded inside this one
- `usedBy` — parent components that embed this one
- `relatedComponents` — components commonly used alongside

**Behavioral/contextual** (composition and interaction contracts):
- `mustBeChildOf` — required parent components. Empty `[]` = no constraint.
- `mustNotBeChildOf` — forbidden parents (e.g. Toaster must not be inside a page component)
- `composedWith` — components typically assembled with this one (e.g. Input composedWith Label)
- `requires` — providers, contexts, or placement constraints
- `triggers` — events or actions this component fires
- `blocksWhen` — conditions that make it non-interactive
- `exposesState` — states surfaced to parent or context

All behavioral fields default to `[]`. Never omit them — empty arrays are valid and meaningful (they confirm the field was considered, not skipped).

Full schema in `meta-artifact-template.md`.

## Extraction Rules

- Extract facts from component markdown first.
- Use the roadmap only to decide what to work on next. Do not use roadmap status to set artifact readiness.
- Use source component markdown to set artifact status.
- Do not invent missing token names.
- Do not silently resolve open questions.
- If a React API is assumed but not implemented yet, record it in `review.notes`.
- If source markdown explicitly says Figma and markdown disagree, mark `needs audit`.
- If source markdown explicitly says it is stale, mark `stale` and do not generate a `ready` artifact.

## Variant Requirements

Each variant entry must include:

```json
{
  "type": "enum",
  "values": ["Default", "Disabled"],
  "default": "Default"
}
```

When mapping to code, also include:

```json
{
  "reactProp": "variant",
  "reactValues": {
    "Default": "default",
    "Disabled": "disabled"
  }
}
```

Use Figma names in `values`. Use React/shadcn names in `reactValues`.

## Token Requirements

The `tokens` object should preserve design-system token names exactly as written.

Good:

```json
{
  "fill": "color/surface/muted",
  "fg": "color/surface/muted/foreground",
  "radius": "radius/full"
}
```

Bad:

```json
{
  "fill": "#F4F4F5",
  "fg": "dark text",
  "radius": "rounded"
}
```

Use `"transparent"` only when the markdown explicitly says transparent/no fill.

## Accessibility Requirements

Accessibility metadata must include the parts relevant to the component:

- role
- keyboard behavior
- screen reader name or announcement
- focus indicator
- touch target requirements
- disabled behavior
- dynamic content announcement rules, if relevant

If a component has no interaction, say that explicitly.

## Example Requirements

Each `.examples.tsx` file should:

- import from `@/components/ui/[component]`
- use shadcn/Radix-style props where possible
- include the core variants and important accessibility examples
- avoid visual-only examples that contradict usage rules
- export both an object and a render helper:

```tsx
export const buttonExamples = {};
export function ButtonExamples() {}
```

Example files define intended API contracts before the real React package exists. Any assumed wrapper API must be noted in the matching meta artifact.

## Validation

After generating artifacts, run:

```sh
node "codex plan/validate-artifacts.mjs"
```

The artifact batch is not complete until validation passes.
