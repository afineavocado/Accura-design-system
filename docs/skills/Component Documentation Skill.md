# Component Documentation Skill

A structured process for writing component markdown files. Follow every time a component is documented — after audit, after build, or when a doc is missing.

---

## Rule Zero — Library Reference First

**Before writing the Behavior section, always fetch the actual library docs.**

shadcn docs often defer detail to the underlying primitive. Always go one level deeper:

| shadcn component | Underlying library | What to verify |
|---|---|---|
| Tooltip | Radix UI Tooltip | `delayDuration` (700ms default), `skipDelayDuration` (300ms), `disableHoverableContent` |
| Dialog / Alert Dialog | Radix UI Dialog | Focus trap, close trigger, animation |
| Drawer | Vaul | `closeThreshold` (0.25 default), `dismissible`, `snapPoints` |
| Calendar | React DayPicker | Selection modes, range click behavior, `resetOnSelect`, keyboard nav |
| Select / Combobox | Radix UI Select / cmdk | Open/close, keyboard, search behavior |
| Accordion | Radix UI Accordion | `type="single"` vs `"multiple"`, `collapsible` |
| Tabs | Radix UI Tabs | `activationMode="automatic"` vs `"manual"` |
| Breadcrumb | shadcn only | `BreadcrumbEllipsis` is display-only — no built-in expand/collapse |
| Toast | Sonner | Duration, position, swipe-to-dismiss |
| Popover / Dropdown | Radix UI Popover | Positioning, flip, same-width, modal |

**Reference chain:**
1. Fetch the shadcn component page → note which primitive it wraps
2. Fetch the primitive docs directly → capture default values and exact behavior
3. If the behavior is not in either, check the primitive's GitHub source for default constants

Do NOT write timing values, thresholds, or click-sequence behavior from memory — always verify.

---

## Step 1 — Before Writing

1. Read `agentic-design-system.md` token rules if not already loaded this session
2. Check `Tracking/Audit Status.md` — confirm the component has been audited and all issues resolved
3. Fetch the relevant library docs for this component (see Rule Zero above)
4. Check `Component Markdown/` — if a doc already exists, read it first (may be stale, not blank)

---

## Step 2 — Document Template

Every component doc must include all required sections in this order. Optional sections are noted.

```markdown
# [Component Name]

One sentence describing what it is and what it's for. Include the shadcn/library it's built on.

---

## Component Sets

| Set | ID | Variants | Purpose |
|---|---|---|---|
| `name` | `00:000` | N | Description |

---

## Variant Matrix

### `component-name` — `Prop1 × Prop2`

| Property | Options | Default |
|---|---|---|
| `Prop1` | `A`, `B` | `A` |
| `Prop2` | `X`, `Y`, `Z` | `X` |

`Prop1(2) × Prop2(3) = 6 variants`

---

## Structure

[Layer tree using backtick code block. Show: node name, type (FRAME / TEXT / INSTANCE / SLOT), key tokens inline as comments. Depth: stop at 4–5 levels.]

```
component                       — VERTICAL AUTO LAYOUT, radius/lg, fill: color/surface/default
  ├─ header                     — FRAME, padding: spacing/component/lg
  │    ├─ title                 — TEXT
  │    └─ description           — TEXT
  └─ content                    — SLOT, padding: spacing/component/lg
```

---

## Token Bindings

[Table per layer or region. Columns: Layer | Property | Token | Notes]

### [Region name]

| Layer | Property | Token | Notes |
|---|---|---|---|
| container | Fill | `color/surface/overlay` | Floating overlay — not page canvas |
| container | Stroke | `color/border/default` 1px INSIDE | |
| container | Radius (all 4) | `radius/lg` | |

---

## Behavior

[See Step 3 — must be library-verified. Never written from memory.]

---

## Accessibility

| Property | Value |
|---|---|
| Role | |
| Keyboard | |
| Focus | |
| ARIA | |

---

## Usage Rules

- Bullet list. When to use, when not to use, compositional rules.

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| wrong thing | right thing |
```

---

## Optional Sections

Include these when relevant — insert between Token Bindings and Behavior:

| Section | When to include |
|---|---|
| **Design Decisions** | When a token choice or structure choice is non-obvious and needs rationale (e.g. why `color/surface/overlay` not `color/surface/default`) |
| **Why No Composite Component** | When the component is a list pattern assembled from example frames (e.g. Breadcrumb) |
| **Example Frames** | When the doc covers example assemblies that live outside the component set |
| **Direction Guide / Type Guide** | When a variant dimension represents a fundamentally different layout or context |
| **Touch Target** | When any variant renders below 44×44px — always flag with implementation note |

---

## Step 3 — Writing the Behavior Section

### Required subsections (use only what applies to this component)

**Open / Close** — for overlays, drawers, dialogs, popovers, tooltips
- What triggers open (click, hover, focus)
- What triggers close (Escape, backdrop, button, blur)
- Timing delays (fetch from library docs — do not guess)
- Animation direction and duration if specified in library

**State transitions** — for interactive leaf components (buttons, inputs, toggles, tabs)
- What user action moves between states (hover, focus, active, disabled)
- Whether states are independent per item or coupled across siblings

**Selection behavior** — for date pickers, selects, checkboxes, radios
- Exact click sequence (first click, second click, third click)
- Reset behavior — is it default or opt-in?
- Cite the prop name and default value from library docs

**View switching** — for multi-view components (calendar month-year selector, wizard)
- What triggers the view change
- What the user sees first
- How they return to the previous view
- Whether it is in-panel or an overlay

**Scroll** — for components with scrollable regions
- Which region scrolls
- What stays fixed

**Drag / gesture** — for drawer, carousel, sortable
- Threshold values (fetch from library source — do not guess)
- Snap behavior
- What happens below threshold

**Keyboard** — table format
```
| Key | Action |
|---|---|
| `Tab` | Move focus to next item |
| `Enter` / `Space` | Select |
| `Escape` | Close / cancel |
| `Arrow keys` | Navigate between items |
```

### Format rules for Behavior

- State each fact in one sentence
- If a value comes from a library default, cite it inline: `(Radix UI default: 700ms)`
- If behavior is implementation-defined (not in the library), say so explicitly
- If an opt-in prop changes the behavior, document the prop name
- No vague phrases like "typically" or "usually" — if you don't know, say "implementation-defined"

---

## Step 4 — After Writing

1. **Update Tracking/Audit Status.md** — confirm the doc date matches the last audit date
2. **Cross-check the Do Not table** — every fix made during audit should appear as a row
3. **Check section order** — Component Sets → Variant Matrix → Structure → Token Bindings → [optional] → Behavior → Accessibility → Usage Rules → Do Not
4. **Verify all token names** — spot-check 2–3 tokens against `agentic-design-system.md` to confirm they exist

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---|---|
| Writing Behavior from general UI knowledge | Always fetch library docs first |
| Skipping Behavior entirely | Required section — every doc needs it |
| Documenting a stale state (post-rebuild, pre-audit) | Mark with `⚠️ STALE` at top, fix before finalising |
| Token names that don't match our collection | Cross-check against `agentic-design-system.md` |
| Mixing `color/background/*` and `color/surface/*` without rationale | Document why in Design Decisions |
| Leaving "implementation-defined" behaviors vague | Name at least one concrete implementation pattern |
| Documenting composite behavior before sub-components | Document leaf/sub-components first, composite last |
