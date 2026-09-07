#skill #figma #workflow

# Building Figma Components with Claude + figma-cli

---

## Connect

```bash
cd ~/figma-cli && node src/index.js eval "return figma.currentPage.name"
```

---

## Core Tool Rule

| Task | Tool |
|---|---|
| Create variant frames + text | `render-batch --as-component` |
| Place instances, combine, bind tokens, rename | `eval` only |

**Never use `eval` to create raw frames.**
**Never use `var:` in render-batch JSX** — bindings don't stick. All token binding happens in Phase 3.

---

## Page Layout

```
Page
└── Section  (Title Case — e.g. "Badge", "Navigation Menu")
    ├── _sub-component sets  (top, if any)
    ├── main component set   (x=40, y=60)
    └── example--basic       (below set, stacked)
        example--disabled
```

- Always wrap in a Section — never loose on canvas
- Section padding: 40px all sides
- Examples: `example--[name]` lowercase kebab, double dash

---

## Phase 1 — Pre-build

**1a. Classify**
- **Leaf** — fixed internal structure → build as component set
- **Container** — layout shell, children vary → shell only, no baked-in children

**1b. Confirm variant matrix**
Write out every variant combination before touching Figma. Get approval.
```
Type(2) × State(4) × Size(2) = 16 variants
Type=Trigger: State=Default/Hover/Disabled × Open=True/False × Size=Default/Compact
Type=Link:    State=Default/Hover/Active/Disabled × Size=Default/Compact
```

**1c. Decide slots**

Use a native Figma SLOT when content is open-ended and unpredictable. Decide before building.

| Situation | Use |
|---|---|
| Content varies per use case (drawer body, dialog, card) | Native **SLOT** |
| Finite known options | **INSTANCE_SWAP** or **VARIANT** |
| Show / hide a fixed layer | **BOOLEAN** |
| Fixed nested component | Embed directly |

**Slot count — consult shadcn/Tailwind first.** Match typical children count as the default:
- Drawer / Dialog: 1 slot (body) — open-ended
- Table row: 2–3 SLOT nodes, rest as visible cells — typed (`table-cell` only)
- Tab-list: 3 slots — typed (`tab-trigger` only)
- Card: 1 slot (body) — open-ended
- Button Group: 0 slots — use example frames instead

**Always document what replaces the slot** — open-ended (any content) or typed (specific component only).

**Creating slots in Figma:**
- UI: right-click a frame inside a component → **"Convert to slot"**
- Plugin API: `figma.createSlot()` does not exist — clone from an existing SLOT node:
```javascript
const sourceSlot = await figma.getNodeByIdAsync('KNOWN_SLOT_NODE_ID');
const slot = sourceSlot.clone();
slot.name = 'content';
parent.appendChild(slot);
```

**1d. Resolve tokens**
Map every context to a token before writing JSX. Don't guess during build.

| Context | Token |
|---|---|
| Component default bg | transparent (no fill) |
| Component surface | `color/surface/default` |
| Elevated surface (table header, sticky) | `color/surface/raised` |
| Floating overlay (dropdown, modal, tooltip) | `color/surface/overlay` |
| Muted component surface (avatar fallback, chip) | `color/surface/muted` |
| Hover bg | `color/background/accent` |
| Text on component | `color/surface/default/foreground` |
| Text on page canvas | `color/background/default/foreground` |
| Supporting / secondary text | `color/text/secondary` |
| Disabled text | `color/text/disabled` |
| Active / brand text | `color/brand/primary` |
| Border default | `color/border/default` |
| Icon standalone | `color/icon/default` |
| Icon in filled container | container's `/foreground` token |
| Disabled input bg | `color/background/muted` |

**Spacing:**
| px | Token |
|---|---|
| 2 | `spacing/component/xxs` |
| 4 | `spacing/component/xs` |
| 8 | `spacing/component/sm` |
| 12 | `spacing/component/md` |
| 16 | `spacing/component/lg` |
| 24 | `spacing/component/xl` |
| 32 | `spacing/component/2xl` |

Values below 2px have no semantic token — leave hardcoded.

---

## Phase 2 — Structure

Build frames and text only. No fills, no strokes, no `var:`. Tokens come in Phase 3.

**2a. Sub-components first**
If the component reuses a smaller piece, build it as a separate set with `_` prefix before the main component.

**2b. render-batch JSX**

```jsx
<Frame
  name="Type=Trigger, State=Default, Size=Default"
  flex="row"
  gap={4}
  px={12} py={8}
  rounded={6}
  items="center"
>
  <Text name="label" size={14} weight="medium">Label</Text>
  <Frame name="icon" w={16} h={16} />
</Frame>
```

Rules:
- Every `<Frame>` must have `name=""` — unnamed become "Frame" in Figma
- `rounded=` takes a number only — never `var:`
- Omit `h` on nested children to let them hug naturally
- Always use `--collection Semantics`

**2c. Combine as variants**
```javascript
const ids = ['65:662', '65:663', ...];
const nodes = await Promise.all(ids.map(id => figma.getNodeByIdAsync(id)));
const set = figma.combineAsVariants(nodes, figma.currentPage);
set.name = 'component-name';

// Fix auto-renamed props immediately:
for (const [key, def] of Object.entries(set.componentPropertyDefinitions)) {
  if (!key.startsWith('Property')) continue;
  const opts = def.variantOptions || [];
  if (opts.some(o => ['Trigger','Default','Link','Outline'].includes(o))) set.editComponentProperty(key, { name: 'Type' });
  else if (opts.includes('Hover') || opts.includes('Focus')) set.editComponentProperty(key, { name: 'State' });
  else if (opts.includes('SM') || opts.includes('Compact') || opts.includes('Small')) set.editComponentProperty(key, { name: 'Size' });
}

// Fix sizing locked to FIXED after combine:
for (const v of set.children) {
  v.primaryAxisSizingMode = 'AUTO';
  v.counterAxisSizingMode = 'FIXED';
}
```

**✅ Phase 2 gate — no unnamed frames before proceeding:**
```javascript
const set = await figma.getNodeByIdAsync('SET_ID');
const bad = [];
const walk = n => {
  if (n.name === 'Frame' || /^Frame \d+$/.test(n.name)) bad.push(n.id + ' → ' + n.name);
  n.children?.forEach(walk);
};
set.children.forEach(walk);
return bad.length === 0 ? '✅ clean' : bad;
```

---

## Phase 3 — Token Binding

One focused eval. Binds all fills, strokes, and spacing. Token correctness is caught in Phase 6 audit — Phase 3 goal is zero unbound.

> Full API reference, helper patterns, gotchas, and verification gate → **Token Binding Skill**. The patterns below are Phase 3 specific.

**3a. Build variable lookup**
```javascript
const allVars = await figma.variables.getLocalVariablesAsync();
const V = Object.fromEntries(allVars.map(v => [v.name, v]));

function paint(name) {
  const variable = V[name];
  if (!variable) { console.error('NOT FOUND: ' + name); return null; }
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r:0, g:0, b:0 } }, 'color', variable
  );
}
function bind(node, prop, name) {
  if (V[name]) node.setBoundVariable(prop, V[name]);
  else console.error('NOT FOUND: ' + name);
}
```

**3b. Fills and strokes per variant**
```javascript
const set = await figma.getNodeByIdAsync('SET_ID');
for (const v of set.children) {
  const isHover = v.name.includes('State=Hover');
  const bg = paint(isHover ? 'color/background/accent' : 'color/surface/default');
  if (bg) v.fills = [bg];

  const stroke = paint('color/border/default');
  if (stroke) { v.strokes = [stroke]; v.strokeWeight = 1; v.strokeAlign = 'INSIDE'; }
}
```

**3c. Spacing binding**

> ⚠️ render-batch always produces hardcoded pixel values — `gap={4}` becomes `itemSpacing = 4`. `var:` in JSX does not stick. **Every gap and padding set in render-batch must have a matching `bind()` call here.** Missing one means the audit will catch it as UNBOUND. This is the most common Phase 3 miss.

```javascript
// Bind ALL spacing set in render-batch — no exceptions
for (const v of set.children) {
  bind(v, 'paddingLeft',   'spacing/component/md');
  bind(v, 'paddingRight',  'spacing/component/md');
  bind(v, 'paddingTop',    'spacing/component/sm');
  bind(v, 'paddingBottom', 'spacing/component/sm');
  bind(v, 'itemSpacing',   'spacing/component/xs');
}
```

**3d. Focus ring**
```javascript
const ringVar = V['color/ring'];
for (const v of set.children) {
  if (!v.name.includes('State=Focus')) continue;
  const isDestructive = v.name.includes('Type=Destructive');
  if (!isDestructive && ringVar) {
    v.strokes = [figma.variables.setBoundVariableForPaint(
      { type: 'SOLID', color: { r:0,g:0,b:0 } }, 'color', ringVar
    )];
    v.strokeWeight = 2;
    v.strokeAlign = 'OUTSIDE';
  }
  // Destructive Focus: apply focus/destructive effect style via setEffectStyleIdAsync
}
```

**3e. Icon instance — stroke only, never fills**
```javascript
const iconMC = await figma.getNodeByIdAsync('159:34829'); // placeholder icon
const inst = iconMC.createInstance();
parent.appendChild(inst);
inst.resize(16, 16);
inst.layoutSizingHorizontal = 'FIXED';
inst.layoutSizingVertical = 'FIXED';

const fgVar = V['color/icon/default'];
inst.findAll(n => (n.type === 'VECTOR' || n.type === 'ELLIPSE') && n.strokes?.length > 0)
  .forEach(n => {
    n.strokes = [figma.variables.setBoundVariableForPaint(
      { type: 'SOLID', color: { r:0.5,g:0.5,b:0.5 } }, 'color', fgVar
    )];
  });
```

**⚠️ API bug — width + height binding mutually clear each other on ComponentSet variants.**
Setting `setBoundVariable('height', var)` clears any width binding and vice versa. Workaround: bind both dimensions in the original render-batch build — once bound from render-batch it holds.

**✅ Phase 3 gate — zero unbound fills/strokes:**
```javascript
const set = await figma.getNodeByIdAsync('SET_ID');
const unbound = [];
const check = n => {
  if (n.fills?.length > 0 && !n.fills[0].boundVariables?.color)
    unbound.push(n.name + ' — fill unbound');
  if (n.strokes?.length > 0 && !n.strokes[0].boundVariables?.color)
    unbound.push(n.name + ' — stroke unbound');
  n.children?.forEach(check);
};
set.children.forEach(check);
return unbound.length === 0 ? '✅ All tokens bound' : unbound;
```

---

## Phase 4 — Naming + Props

**4a. TEXT node semantic names**
Never find text nodes by `n.name` — always use `n.type === 'TEXT'` sorted by y-position.

| Role | Name |
|---|---|
| Single-line label | `label` |
| Primary heading | `title` |
| Supporting copy | `description` |
| Input placeholder | `placeholder` |
| Generic text | `content` |
| Caption / helper | `caption` |

```javascript
for (const v of set.children) {
  const texts = v.findAll(n => n.type === 'TEXT').sort((a, b) => a.y - b.y);
  if (texts[0]) texts[0].name = 'label';
  if (texts[1]) texts[1].name = 'description';
}
```

**4b. FRAME node semantic names**

| Layer role | Name |
|---|---|
| Text + description wrapper | `content` or `text-block` |
| Icon / image / avatar area | `media` |
| Buttons / actions area | `actions` |
| Single action container | `action-slot` |
| Track / bar | `track` |
| Fill / progress bar | `fill` |
| Thumb | `thumb` |

**4c. Wire boolean props**
```javascript
set.addComponentProperty('Icon', 'BOOLEAN', false);
set.addComponentProperty('Supporting Text', 'BOOLEAN', false);

const iconKey = Object.keys(set.componentPropertyDefinitions).find(k => k.startsWith('Icon'));
for (const v of set.children) {
  const iconLayer = v.findOne(n => n.name === 'icon');
  if (iconLayer && iconKey) iconLayer.componentPropertyReferences = { visible: iconKey };
}
```

**4d. Sub-component resting state check**
Embedded Checkbox, Radio, Toggle, Avatar — resting state bg must be transparent. Fix at source, not as an instance override.

**✅ Phase 4 gate:**
```javascript
const issues = [];
for (const v of set.children) {
  v.findAll(n => n.type === 'TEXT').forEach(t => {
    if (t.name === t.characters) issues.push(v.name + ' → "' + t.name + '" not renamed');
  });
  v.findAll(n => n.type === 'FRAME' && (n.name === 'Frame' || /^Frame \d+$/.test(n.name)))
    .forEach(f => issues.push(v.name + ' → ' + f.name + ' unnamed frame'));
}
return issues.length === 0 ? '✅ clean' : issues;
```

---

## Phase 5 — Section + Examples

```javascript
const section = figma.createSection();
section.name = 'Component Name'; // Title Case
figma.currentPage.appendChild(section);
section.appendChild(set);
set.x = 40; set.y = 60;         // relative to section — append first, then set x/y
exampleFrame.x = 40;
exampleFrame.y = set.y + set.height + 48;
section.resizeWithoutConstraints(totalW + 80, totalH + 80);
```

- Example names: `example--basic`, `example--disabled`, `example--with-icon`
- Use real component instances in examples — never raw frames

---

## Phase 6 — Audit

Run Component Audit Skill immediately after Phase 5.

```
audit [component-name]
```

Do not consider the component done until the audit reports zero 🔴 issues.

---

## Key Node IDs

| Component | ID |
|---|---|
| Icon placeholder | `159:34829` |
| chevron-left | `159:35297` |
| chevron-right | `159:35234` |
| chevron-down | `159:35236` |
| check | `159:34742` |
| search-lg | `159:34831` |
| search-sm | `159:34821` |

**Deleted — DO NOT USE:** `15:38855`, `15:1410`, `15:1412`, `15:1404`, `15:1398`

---

## Common Gotchas

| Issue | Fix |
|---|---|
| `var:` in render-batch JSX doesn't stick | Never use `var:` in JSX — bind everything in Phase 3 eval |
| `h="hug"` breaks nested frames | Omit `h` on child frames |
| combineAsVariants locks sizing to FIXED | Set `primaryAxisSizingMode = 'AUTO'` after combining |
| combineAsVariants renames props to "Property 1" | Rename immediately after combining |
| Icon instance shows as solid block | Never set `fills` on instance — bind stroke vectors only |
| `rounded=` rejects `var:` | Use px number in JSX, bind variable in Phase 3 |
| `primaryAxisSizingMode = 'HUG'` throws | Use `'AUTO'` not `'HUG'` |
| `resize()` overrides sizing modes | Call `resize()` BEFORE setting sizing mode |
| Section child coordinates wrong | Append to section first, THEN set x/y |
| `layoutSizingVertical = 'HUG'` on instance | Use `'FIXED'` — HUG overrides token-bound height |
| width + height binding mutually clear each other | Known API bug — bind both in render-batch, not eval |
| `figma.createSlot()` does not exist | Clone from an existing SLOT node instead |
| Spacing/radius rebinding — lower confidence | Always show script to user before running |
