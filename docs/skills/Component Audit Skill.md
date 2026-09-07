# Component Audit Skill

A structured process for auditing Figma components after you build them. Claude inspects, reports, and fixes — you design and approve.

> Claude never executes fixes without showing the full report and getting your approval first.

**Trigger:** `"audit [component name]"` or `"check token bindings on [component]"`

---

## Step 1 — Locate the Component

```javascript
const sets = figma.currentPage.findAll(n => n.type === 'COMPONENT_SET');
return sets.map(s => ({ id: s.id, name: s.name, variantCount: s.children.length }));
```

Confirm which set to audit by ID or name.

---

## Step 2 — Full Inspection

### 2a. Token Bindings — Fills, Strokes & Radius
For every node with a fill or stroke: check `boundVariables.fills[i]` / `boundVariables.strokes[i]`. If unresolvable → flag `UNBOUND`.

> To fix unbound tokens found here → **Token Binding Skill**.

For corner radius: Figma stores radius as 4 individual corner bindings — **always check `boundVariables.topLeftRadius`**, never `boundVariables.cornerRadius` (which always returns undefined even when bound).

```javascript
const bv = node.boundVariables || {};
if (node.topLeftRadius > 0 && !bv.topLeftRadius) {
  flag({ layer: node.name, issue: 'cornerRadius UNBOUND', value: node.topLeftRadius });
}
```

### 2b. Wrong Semantic Group

| Node context | Correct token group | Wrong group |
|---|---|---|
| Component sitting on a surface | `color/surface/*` | `color/background/*` |
| Page-level container | `color/background/*` | `color/surface/*` |
| Floating overlay (modal, dropdown) | `color/surface/overlay` | anything else |
| Text on surface | `color/surface/*/foreground` | `color/background/*/foreground` |
| Standalone icon | `color/icon/*` | `color/brand/*` or raw |
| Icon inside filled container | container's `/foreground` | `color/icon/*` |
| Table header | `color/surface/raised` | `color/background/muted` |
| Table cell | `color/surface/default` | `color/background/default` |
| Disabled input bg | `color/background/muted` | any other |
| Primitive token used directly | ❌ always wrong | `color/zinc/900` etc. |

**Paired-surface rule — check before accepting any `/foreground` token as correct:**
A `[token]/foreground` is only valid when the node's background (or direct parent's background) uses the matching `[token]`. If the backgrounds don't match, the `/foreground` token is semantically wrong even if it's bound.

| `/foreground` token seen | Required background | If background is actually `color/background/default` — use instead |
|---|---|---|
| `color/status/danger-subtle/foreground` | `color/status/danger-subtle` | `color/text/invalid` |
| `color/status/danger/foreground` | `color/status/danger` | `color/text/invalid` |
| `color/status/warning-subtle/foreground` | `color/status/warning-subtle` | `color/text/warning` |
| `color/brand/primary/foreground` | `color/brand/primary` | `color/brand/primary` (text link color, rare) |
| `color/brand/destructive` (used on TEXT) | **never valid on text** | `color/text/invalid` |

Flag any mismatch as **🔴 Critical** — same severity as an unbound token.

### 2c. Layer Naming
TEXT nodes — flag any named after their content (e.g. `"Badge"`, `"Label"`, `"Secondary"`):

| Role | Expected name |
|---|---|
| Button text / primary label | `label` |
| Body / supporting copy | `description` or `supporting-text` |
| Input placeholder | `placeholder` |
| Generic content text | `content` |
| Heading | `title` |
| Caption | `caption` |

FRAME nodes — flag any named `"Frame"` or `"Frame 123"`. Expected: `content`, `text-block`, `actions`, `media`, `slot`, `track`, `fill`, `thumb`.

### 2d. Instance Issues

**Sub-component fill overrides — 🔴 Critical**

A sub-component (button, icon, checkbox, radio embedded inside a parent component) owns its own token bindings. The parent component must never override a sub-component's internal fills or strokes to express a different state. This is always wrong:

```
parent variant (Destructive)
  └─ action-slot (INSTANCE — button component)
       └─ description (TEXT)   ← fill overridden to color/text/invalid ❌
```

The button's text color is `button/primary/fg/fg` — that is the button's contract. Overriding it to `color/text/invalid` produces a button with a blue background and red text, and it silently breaks every theme that relies on those tokens being coupled.

**The correct pattern:** If a different button style is needed in a specific context, change the button's **Variant prop** (e.g. switch from Primary to Destructive). Never reach inside the instance and repaint a child layer.

**What R8 is and is NOT:**
- ✅ Parent sets fill on the **instance root** (e.g. `cancel.fills = [button/outline/bg/bg]`) — this is **normal Figma composition, never flag this**
- ❌ Parent reaches **inside** the instance and changes a TEXT or VECTOR child's fill — this is an R8 violation

> **NEVER clear fills on an instance root.** `fills = []` in the Figma API sets an explicit empty override, not "inherit from master" — it permanently removes the visual color.

**What to check:**
```javascript
// For each INSTANCE in the variant, walk its CHILDREN (not the instance root)
// Flag any TEXT or VECTOR node whose fill/stroke uses a token from the PARENT's semantic context
const instances = variant.findAll(n => n.type === 'INSTANCE');
for (const inst of instances) {
  for (const child of inst.findAll(n => n.type === 'TEXT' || n.type === 'VECTOR')) {
    const fill = child.fills?.[0];
    const token = fill?.boundVariables?.color ? varById[fill.boundVariables.color.id] : null;
    // Red flags: parent state tokens appearing inside a sub-component's children
    if (token && (token.startsWith('color/text/') || token.startsWith('color/background/'))) {
      flag({ layer: inst.name + ' › ' + child.name, issue: 'sub-component fill overridden: ' + token, severity: 'critical' });
    }
  }
}
```

**Resting state background:** does an embedded component (Checkbox, Radio, Toggle, Avatar) use `color/background/default` for its resting bg? Flag — resting state must be transparent to adapt to any surface.

### 2e. Instance Sizing — Height Token Override
For every INSTANCE with a token-bound height (`button/size/Button-height-*`, `input/height/*`):
- `layoutSizingVertical` must be `'FIXED'` — `'HUG'` silently overrides the height token
- `layoutSizingHorizontal` should be `'FILL'` inside auto-layout unless a fixed width is intentional

```javascript
const instances = variant.findAll(n => n.type === 'INSTANCE');
for (const inst of instances) {
  if (inst.boundVariables?.height && inst.layoutSizingVertical === 'HUG') {
    flag({ layer: inst.name, issue: 'layoutSizingVertical=HUG overrides token-bound height — use FIXED' });
  }
}
```

### 2f. Effect Styles (Shadows)
For every node with effects: check `node.effectStyleId`. If bound → resolve style name and verify it's in the valid set. If effects exist but no style ID → flag **UNBOUND**.

**Valid styles:** `shadows/2xs` · `shadows/xs` · `shadows/sm` · `shadows/shadow` · `shadows/md` · `shadows/lg` · `shadows/xl` · `shadows/2xl` · `focus/destructive` *(Destructive Focus state only)*

```javascript
const validShadows = new Set([
  'shadows/2xs','shadows/xs','shadows/sm','shadows/shadow',
  'shadows/md','shadows/lg','shadows/xl','shadows/2xl'
]);
if (styleId) {
  const style = await figma.getStyleByIdAsync(styleId);
  if (!validShadows.has(style?.name))
    flag({ layer: node.name, issue: 'wrong effect style: ' + style?.name });
} else if (node.effects?.length > 0) {
  flag({ layer: node.name, issue: 'shadow UNBOUND — hardcoded effect' });
}
```

### 2g. Touch Target
Identify rendered height/width for each size variant. Flag sizes below 44 × 44px — cannot be fixed in Figma, passes as an implementation note.

| Size | Height | Touch-safe? |
|---|---|---|
| Small / Icon Small | 36px | ⚠️ needs 4px hit-area padding in implementation |
| Default / Icon Default | 40px | ⚠️ needs 2px hit-area padding in implementation |
| Large / Icon Large | 44px | ✅ meets WCAG 2.5.5 AAA natively |

Report as `🟡 Warning`.

### 2h. Focus Indicator
For every **Focus** state variant: check `color/ring` stroke, 2px weight, outside align. Destructive exception: must use `focus/destructive` effect style — no ring stroke.

```javascript
const focusVariants = componentSet.children.filter(v => v.name.includes('State=Focus'));
const allVars = await figma.variables.getLocalVariablesAsync();
const ringVar = allVars.find(v => v.name === 'color/ring');

for (const variant of focusVariants) {
  const isDestructive = variant.name.includes('Type=Destructive');
  if (isDestructive) {
    const style = variant.effectStyleId
      ? await figma.getStyleByIdAsync(variant.effectStyleId) : null;
    if (style?.name !== 'focus/destructive')
      flag({ variant: variant.name, issue: 'Destructive Focus: missing focus/destructive effect style' });
  } else {
    const hasRing = (variant.boundVariables?.strokes || []).some(s => s.id === ringVar?.id);
    if (!hasRing) flag({ variant: variant.name, issue: 'Focus state missing color/ring stroke' });
    if (variant.strokeWeight !== 2) flag({ variant: variant.name, issue: `Focus ring weight ${variant.strokeWeight}px — must be 2px` });
    if (variant.strokeAlign !== 'OUTSIDE') flag({ variant: variant.name, issue: `Focus ring align ${variant.strokeAlign} — must be OUTSIDE` });
  }
}
```

Missing or wrong focus indicator = **🔴 Critical** — WCAG requirement.

### 2i. State-Aware Token Correctness

> **Gap the earlier checks miss:** Steps 2a–2b confirm a token is *bound* and from the *right group*, but they don't verify the correct token is used for a specific state. A label bound to `color/background/default/foreground` in an Invalid variant is bound and in the right group — but it's semantically wrong.

For every variant that represents a named state, check each text/stroke binding against the expected token for that state:

| State | Layer | Expected token |
|---|---|---|
| Default | label (primary text) | `color/background/default/foreground` |
| Default | description (supporting text) | `color/background/muted/foreground` |
| Invalid | label | `color/text/invalid` |
| Invalid | description | `color/text/invalid` |
| Warning | label | `color/text/warning` |
| Warning | description | `color/text/warning` |
| Success | label | `color/text/success` |
| Success | description | `color/text/success` |
| Disabled | label | `color/text/disabled` |
| Disabled | description | `color/text/disabled` |
| Disabled | card/container border | `color/border/disabled` |
| Focus | card/container border | `color/border/focus` |

**Rule:** In Invalid/Warning/Success state, label and description carry equal weight — no hierarchy, both use the same state token.
**Why not the `*-subtle/foreground` tokens?** Those foregrounds are only valid ON their matching subtle background. Form fields sit on `color/background/default` — using a mismatched foreground breaks dark mode. Use the standalone text tokens instead.

**Audit script pattern:**
```javascript
// Index 0 = label (topmost text), index 1 = description
const stateTokens = {
  Invalid:  { 0: 'color/text/invalid',                    1: 'color/text/invalid' },
  Warning:  { 0: 'color/text/warning',                    1: 'color/text/warning' },
  Success:  { 0: 'color/text/success',                    1: 'color/text/success' },
  Disabled: { 0: 'color/text/disabled',                   1: 'color/text/disabled' },
  Default:  { 0: 'color/background/default/foreground',   1: 'color/background/muted/foreground' },
};

for (const variant of set.children) {
  const state = Object.keys(stateTokens).find(s => variant.name.includes('State=' + s));
  if (!state) continue;

  const texts = variant.findAll(n => n.type === 'TEXT')
    .sort((a, b) => a.absoluteBoundingBox?.y - b.absoluteBoundingBox?.y);

  texts.forEach((t, i) => {
    const expected = stateTokens[state][i];
    if (!expected) return;
    const fill = t.fills?.[0];
    const bound = fill?.boundVariables?.color ? varById[fill.boundVariables.color.id] : 'UNBOUND';
    if (bound !== expected) {
      issues.push({ variant: variant.name, layer: t.name, current: bound, expected });
    }
  });
}
```

**Wrong but bound = 🔴 Critical** — just as bad as unbound; the component will render the wrong color in its state.

---

## Re-audit Trigger Rule

**When a new error class or token is added to this document, all previously audited components must be re-audited against the new rule.**

A component that passed audit last session may be wrong by a rule that didn't exist yet. Passing audit is not permanent — it is only valid relative to the rules that were active at the time.

**Trigger conditions:**
- A new semantic token is created (e.g. `color/text/warning`, `color/text/success`)
- A new check is added to Step 2 (e.g. paired-surface rule, state-aware check)
- A "do not use" rule is added to an existing token

**When triggered:**
1. Note which components were audited before this rule existed
2. Re-run Step 2 on those components specifically against the new check
3. Fix any newly discovered issues before moving on

**Components audited to date:** Radio, Checkbox, Switch, Alert, Button (doc only), Badge (doc only), Tabs (doc only)

---

## Step 3 — Audit Report Format

```
## Audit Report — [Component Name]
[variant count] variants · [issue count] issues found

### 🔴 Critical (wrong tokens — breaks in dark mode / theming)
| Variant | Layer | Current token | Should be |
|---|---|---|---|
| Type=Text, Size=Default | content (TEXT) | color/background/default/foreground | color/surface/default/foreground |

### 🔴 Focus Indicator (missing or wrong ring)
| Variant | Issue | Should be |
|---|---|---|
| Type=Default, State=Focus | Missing color/ring stroke | color/ring, 2px, outside |
| Type=Destructive, State=Focus | Missing focus/destructive effect | focus/destructive effect style |

### 🔴 State-Aware Token Mismatch (bound but wrong token for state)
| Variant | Layer | Current token | Expected for state |
|---|---|---|---|
| Type=Basic, State=Invalid | label | `color/background/default/foreground` | `color/status/danger-subtle/foreground` |

### 🟠 Instance Overrides
| Variant | Layer | Override | Recommendation |
|---|---|---|---|
| Type=Checkbox-Text | checkbox-slot | fill: color/surface/default | Fix at Checkbox source |

### 🟠 Instance Sizing (HUG overriding token-bound height)
| Variant | Layer | Issue | Should be |
|---|---|---|---|
| Orientation=Vertical | button | layoutSizingVertical=HUG | FIXED + correct size token |

### 🟠 Effect Styles (wrong or unbound shadows)
| Variant | Layer | Issue | Should be |
|---|---|---|---|
| Type=Card | card-surface | shadow UNBOUND | `shadows/md` effect style |

### 🟡 Naming
| Variant | Layer | Current name | Should be |
|---|---|---|---|
| Type=Badge | "Badge" (TEXT) | "Badge" | "label" |

### 🟡 Touch Target (implementation note — no Figma fix)
| Variant | Visual size | Note |
|---|---|---|
| Size=Small | 36 × 36px | Needs 4px hit-area padding |
| Size=Default | 40px | Needs 2px hit-area padding |

### ✅ Passing
- All stroke tokens bound · Boolean props wired · No raw primitives

---
Ready to fix? Reply "fix all" or specify categories.
```

---

## Step 4 — Fix Execution

Only after approval. Fix in this order:
1. **Source components first** — sub-components (Checkbox, Radio) before the parent
2. **Revert instance overrides** — if the source is now fixed
3. **Instance sizing** — set `layoutSizingVertical = 'FIXED'` on any HUG instance with a height token
4. **Token rebinding** — all unbound or wrong-group fills/strokes
5. **Effect styles** — apply correct `shadows/*` style, remove hardcoded effects
6. **Focus indicator** — bind `color/ring` (2px, outside) on non-Destructive Focus states; bind `focus/destructive` effect on Destructive Focus
7. **Text layer names** — semantic names
8. **Frame layer names** — remove "Frame" / "Frame N"
9. **Verify** — re-run and report: `✓ N fills rebound · ✓ N layers renamed · ✓ 0 issues remaining`

> Touch target issues are not fixed in Figma — pass as implementation notes.

---

## Step 5 — Documentation

After Step 4 fixes are verified, write the component markdown file. Follow **`Component Documentation Skill.md`** — it owns the required section list, template, Behavior/Accessibility minimums, and post-writing checklist.

---

## Token Quick Reference

### Background vs Surface
```
color/background/default        → page canvas ONLY
color/surface/default           → cards, panels, table cells, component surfaces
color/surface/raised            → table headers, sticky headers, elevated cards
color/surface/overlay           → dropdowns, modals, tooltips
```

### Text on surfaces
```
color/background/default/foreground   → text on page canvas
color/surface/default/foreground      → text inside components
color/surface/raised/foreground       → text in table headers
color/text/secondary                  → supporting/muted text (universal)
color/text/disabled                   → text on disabled elements
color/text/invalid                    → error text on default backgrounds (Invalid state labels, destructive alert text)
color/text/warning                    → warning text on default backgrounds (Warning state labels, cautionary messages)
color/text/success                    → success text on default backgrounds (Success/valid state labels)
```

> The `*-subtle/foreground` tokens (`danger-subtle/foreground`, `warning-subtle/foreground`, `success-subtle/foreground`) are ONLY valid when the surface fill is the matching `*-subtle` token. For text on a default/white background, always use the standalone `color/text/*` token instead.

### Icon rules
```
Standalone icon            → color/icon/default
Icon on filled bg          → use container's /foreground token
Icon in status context     → color/icon/success / danger / warning / info
```

### Sub-component resting state
```
Unchecked / Invalid bg     → transparent (no fill)
Hover bg                   → color/background/accent
Checked bg                 → color/brand/primary
Disabled bg                → color/background/muted
```

### Primitive tokens — always wrong in components
```
color/zinc/900 ❌   color/yellow/300 ❌   color/blue/500 ❌   #ffffff ❌
```

---

## Checklist — Run After Every Component Build

```
[ ] All fills bound to semantic tokens (no raw/unbound)
[ ] All strokes bound to semantic tokens
[ ] Token groups match context (surface vs background vs icon)
[ ] No primitive tokens used directly (color/zinc/*, color/yellow/*)
[ ] Sub-components have transparent resting state backgrounds
[ ] No sub-component fill overrides — never override a button/icon/checkbox internal fill from a parent variant (change the sub-component's Variant prop instead)
[ ] All TEXT nodes have semantic layer names (not content-based)
[ ] No FRAME nodes named "Frame" or "Frame N"
[ ] Boolean props wired to correct layer visibility
[ ] Supporting text hidden by default if controlled by prop
[ ] All shadows applied via effect style (shadows/2xs – shadows/2xl) — no hardcoded effects
[ ] All instances with token-bound heights use layoutSizingVertical=FIXED (never HUG)
[ ] Corner radius bound via topLeftRadius — check boundVariables.topLeftRadius (not boundVariables.cornerRadius)
[ ] Touch target — sizes below 44×44px noted; developer to add hit-area padding in implementation
[ ] Focus indicator — Focus state has color/ring stroke, 2px, outside (Destructive: focus/destructive effect style)
[ ] State-aware tokens — each state variant uses the correct semantic token per layer (Invalid → color/text/invalid; Warning → color/text/warning; Success → color/text/success; Disabled → color/text/disabled; Default → default/foreground / muted/foreground). Bound ≠ correct.
```

---

## Example Audit Output

```
## Audit Report — switch
8 variants · 8 issues found

### 🔴 Critical
| Variant | Layer | Current | Should be |
|---|---|---|---|
| State=Unchecked | track fill | rgb(34,197,94) hardcoded | transparent (unchecked) / color/brand/primary (checked) |
| State=Unchecked | thumb fill | rgb(255,255,255) hardcoded | color/brand/primary/foreground |
| State=Unchecked | track stroke | rgb(22,163,74) hardcoded | remove — fill-based component |
| all | row gap | 8px unbound | spacing/component/sm |
| all | track padding | 4px unbound | spacing/component/xs |
| all | track radius | 9999 unbound | radius/full |
| all | thumb radius | 9999 unbound | radius/full |

### 🟡 Naming
| Variant | Layer | Current | Should be |
|---|---|---|---|
| all | text node | "Label" | label |

### ✅ Passing
- Strokes: none (correct) · Boolean props: wired correctly

---
Ready to fix? Reply "fix all" or specify categories.
```

---

## What Claude Cannot Fix Automatically

- **Ambiguous colors** — `#f4f4f5` could be `color/background/muted` or `color/border/disabled` (same hex, different intent). Claude asks.
- **Missing text styles** — unrecognised size/weight combo. Claude asks which style to apply.
- **Wrong structure** — raw frame where a sub-component should be (e.g. hardcoded divider instead of `separator`). Claude flags and waits for approval before restructuring.

---

## Tips for Building Components Manually

1. **Name every layer** — `label`, `icon`, `track`, `thumb`, `text-block`, `actions` — never "Frame"
2. **Use auto-layout on every frame** — spacing variables require padding/gap properties to exist
3. **Don't use groups** — frames only, so fills and spacing are bindable
4. **Separate states as variants** — one ComponentNode per state in a ComponentSet
5. **Name variants correctly** — `State=Default`, `Type=Trigger`, `Size=MD` format

---

## Related Skills
- [[Build component skill]] — build process with phased approach
- [[design-system-rules]] — full token naming rules and semantic descriptions
