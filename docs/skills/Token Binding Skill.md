#skill #figma #tokens

# Token Binding Skill

> **Localised for Accura.** Vendored from the Agentic Design System, with the radius values
> in the quick-reference table below updated to Accura's scale (`base 12`, not Agentic's
> `base 8`). Those numbers are maintained by `docs/machine-readable/sync-doc-values.mjs` —
> do not hand-edit them. **If this file is ever re-vendored from upstream, re-run that
> script**, or the table silently reverts to Agentic's values.
>
> Everything else here — the two binding APIs, the radius-corner gotcha, the verification
> gate — is system-agnostic and applies unchanged.

A standalone reference for binding design tokens to Figma nodes — during builds, fixes, and re-audits. Works alongside the Component Audit Skill (which checks correctness) and the Build Skill (which calls this during Phase 3).

---

## The Two APIs — Know Which to Use

This is the most common source of silent failures. Wrong API = binding appears to work but doesn't stick or errors silently.

| What you're binding | API | Target property examples |
|---|---|---|
| **Color** (fill, stroke) | `setBoundVariableForPaint` | `fills`, `strokes` |
| **Spacing / radius / opacity** | `setBoundVariable` | `paddingTop`, `paddingBottom`, `paddingLeft`, `paddingRight`, `itemSpacing`, `topLeftRadius`, `opacity` |

**Never mix them.** Using `setBoundVariable` for a color silently fails. Using `setBoundVariableForPaint` for spacing throws or does nothing.

---

## Helper Pattern — Use This Every Session

Build the lookup once, use everywhere:

```javascript
const allVars = await figma.variables.getLocalVariablesAsync();
const V = Object.fromEntries(allVars.map(v => [v.name, v]));

// Color fills and strokes
function paint(tokenName) {
  const variable = V[tokenName];
  if (!variable) { console.error('NOT FOUND: ' + tokenName); return null; }
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
    'color',
    variable
  );
}

// Spacing, radius, opacity
function bind(node, prop, tokenName) {
  const variable = V[tokenName];
  if (!variable) { console.error('NOT FOUND: ' + tokenName); return; }
  node.setBoundVariable(prop, variable);
}
```

Usage:
```javascript
// Color fill
node.fills = [paint('color/surface/default')];

// Color stroke
node.strokes = [paint('color/border/default')];
node.strokeWeight = 1;
node.strokeAlign = 'INSIDE';

// Spacing
bind(node, 'paddingLeft',   'spacing/component/md');
bind(node, 'paddingRight',  'spacing/component/md');
bind(node, 'paddingTop',    'spacing/component/sm');
bind(node, 'paddingBottom', 'spacing/component/sm');
bind(node, 'itemSpacing',   'spacing/component/xs');

// Radius — see gotcha below
bind(node, 'topLeftRadius',     'radius/md');
bind(node, 'topRightRadius',    'radius/md');
bind(node, 'bottomLeftRadius',  'radius/md');
bind(node, 'bottomRightRadius', 'radius/md');
```

---

## Bindable Properties

### Color
| Property | API call |
|---|---|
| `fills` | `node.fills = [paint('token')]` |
| `strokes` | `node.strokes = [paint('token')]` |

After setting strokes, always set `strokeWeight` and `strokeAlign` explicitly — they don't bind to tokens.

### Spacing
| Property | `setBoundVariable` prop key |
|---|---|
| Padding top | `paddingTop` |
| Padding bottom | `paddingBottom` |
| Padding left | `paddingLeft` |
| Padding right | `paddingRight` |
| Gap between children | `itemSpacing` |

### Radius
| Property | `setBoundVariable` prop key |
|---|---|
| Top-left corner | `topLeftRadius` |
| Top-right corner | `topRightRadius` |
| Bottom-left corner | `bottomLeftRadius` |
| Bottom-right corner | `bottomRightRadius` |

> ⚠️ **`cornerRadius` gotcha** — Figma stores radius as 4 individual corner properties. `setBoundVariable('cornerRadius', v)` and `boundVariables.cornerRadius` both behave inconsistently — **always bind all 4 corners individually**. When auditing, always check `boundVariables.topLeftRadius`, never `boundVariables.cornerRadius`.

### Opacity
| Property | `setBoundVariable` prop key |
|---|---|
| Node opacity | `opacity` |

Used for disabled states — bind the entire frame to `opacity/disabled` rather than changing individual child colors.

---

## Stroke Details

After binding a stroke color, set weight and alignment manually:

```javascript
node.strokes = [paint('color/border/default')];
node.strokeWeight = 1;
node.strokeAlign = 'INSIDE'; // or 'OUTSIDE' for focus rings
```

**Focus ring pattern — always `OUTSIDE`, weight `2`:**
```javascript
const ringVar = V['color/ring'];
if (ringVar) {
  node.strokes = [figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', ringVar
  )];
  node.strokeWeight = 2;
  node.strokeAlign = 'OUTSIDE';
}
```

**Destructive Focus — effect style, not ring:**
```javascript
const allStyles = await figma.getLocalEffectStylesAsync();
const destructiveStyle = allStyles.find(s => s.name === 'focus/destructive');
if (destructiveStyle) await node.setEffectStyleIdAsync(destructiveStyle.id);
```

---

## Icon Stroke Binding

Icons are stroke-based. Never apply a color fill to an icon instance frame — bind to the VECTOR nodes inside:

```javascript
const fgVar = V['color/icon/default'];
const strokeNodes = instance.findAll(n =>
  (n.type === 'VECTOR' || n.type === 'ELLIPSE') && n.strokes?.length > 0
);
for (const node of strokeNodes) {
  node.strokes = [figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }, 'color', fgVar
  )];
}
```

> When swapping icon components: save `componentPropertyReferences` before swap, restore after. Resize to 16×16 (12×12 for small variants). Set `layoutSizingHorizontal = 'FIXED'`, `layoutSizingVertical = 'FIXED'`. Then rebind stroke token.

---

## ⚠️ Confidence Rule — Spacing and Radius Scripts

**Any script that calls `setBoundVariable` for spacing or radius properties must be shown to the user for review before executing.**

Reading bindings = high confidence. Writing them back = lower confidence. Silent failures are possible if the node is inside an instance, locked, or in a context where the property doesn't apply.

Pattern: write the script → show it → wait for explicit approval → run.

This rule does not apply to color (`setBoundVariableForPaint`) — color rebinding is lower risk.

---

## Verification Gate

Run after every binding session to confirm zero unbound fills and strokes:

```javascript
const set = await figma.getNodeByIdAsync('SET_ID');
const issues = [];

function check(node) {
  // Fills
  if (node.fills?.length > 0 && node.fills[0].type === 'SOLID' && node.fills[0].opacity > 0) {
    if (!node.fills[0].boundVariables?.color)
      issues.push({ layer: node.name, type: node.type, problem: 'fill UNBOUND' });
  }
  // Strokes
  if (node.strokes?.length > 0 && node.strokes[0].type === 'SOLID') {
    if (!node.strokes[0].boundVariables?.color)
      issues.push({ layer: node.name, type: node.type, problem: 'stroke UNBOUND' });
  }
  // Radius
  if ((node.topLeftRadius || 0) > 0 && !node.boundVariables?.topLeftRadius)
    issues.push({ layer: node.name, type: node.type, problem: `radius UNBOUND: ${node.topLeftRadius}px` });

  // Recurse (stop at instance boundaries)
  if (node.type !== 'INSTANCE' && node.children) node.children.forEach(check);
}

set.children.forEach(check);
return issues.length === 0 ? '✅ All bindings clean' : issues;
```

---

## Token → Context Quick Reference

For semantic correctness rules (paired-surface, state-aware tokens, wrong group) — see **Component Audit Skill Step 2b and 2i**. This table covers binding context only.

### Color fills
| Context | Token |
|---|---|
| Component surface (card, panel, row) | `color/surface/default` |
| Elevated surface (table header, raised card) | `color/surface/raised` |
| Overlay (modal, dropdown, tooltip) | `color/surface/overlay` |
| Muted surface (avatar fallback, tag) | `color/surface/muted` |
| Page canvas background | `color/background/default` |
| Hover state background | `color/background/accent` |
| Disabled input background | `color/background/muted` |

### Color text / icon
| Context | Token |
|---|---|
| Text on component surface | `color/surface/default/foreground` |
| Text on page canvas | `color/background/default/foreground` |
| Secondary / supporting text | `color/text/secondary` |
| Disabled text | `color/text/disabled` |
| Invalid / error text | `color/text/invalid` |
| Standalone icon | `color/icon/default` |
| Icon inside filled container | container's `/foreground` token |

### Color strokes
| Context | Token |
|---|---|
| Default border | `color/border/default` |
| Input resting border | `color/input/border` |
| Focus ring | `color/ring` |
| Error / invalid border | `color/border/error` |
| Disabled border | `color/border/disabled` |
| Focus border (date-picker, select trigger) | `color/border/focus` |

### Spacing tokens
| px | Token |
|---|---|
| 2 | `spacing/component/xxs` |
| 4 | `spacing/component/xs` |
| 8 | `spacing/component/sm` |
| 12 | `spacing/component/md` |
| 16 | `spacing/component/lg` |
| 24 | `spacing/component/xl` |
| 32 | `spacing/component/2xl` |

Values below 2px — no token, leave hardcoded.

### Radius tokens
| Usage | Token | Value |
|---|---|---|
| Outer component corners | `radius/lg` | 12px |
| Inner elements, buttons, cells | `radius/md` | 10px |
| Pills, circles, full rounding | `radius/full` | 9999px |

### Opacity tokens
| Usage | Token |
|---|---|
| Disabled state (entire frame) | `opacity/disabled` |

---

## Related Skills

- **Component Audit Skill** — checks that tokens are correct and semantically valid (paired-surface, state-aware, wrong group)
- **Build component skill** — calls this skill during Phase 3
