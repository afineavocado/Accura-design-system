# Meta Artifact Template (v3)

> ⚠️ **File key above is Agentic's (`YWfTOUTpFZ0BNxHobfUqme`). Accura's file is `32llw6anFsjPISJrrp1and`.**
> Node IDs are per-file and will not resolve across them — see `docs/machine-readable/figma-ids.md`.


Changes from v2:
- **`storybook`** block — story file path + named exports (required now that Storybook is complete)
- **`implementation`** block — tsx file path, package dependencies, key implementation notes
- **`typeGuide`** inside `behavior` — captures per-type prose explanations from markdown Type Guide sections
- **`invalidState`** inside `tokens.states` — explicit invalid border + ring tokens (critical for form fields)
- **`knownIssues`** inside `meta` — documented bugs, limitations, or workarounds
- **`changelog`** inside `meta` — notable changes to this component over time
- **`darkMode`** inside `meta` — tokens or behaviors that differ in dark mode
- **Removed** `examples` field pointing to examples.tsx (deleted — examples now live in stories)
- **Updated** `generation-rules` to include Storybook changes as a regeneration trigger

---

## File Paths

```
docs/machine-readable/artifacts/components/[component].meta.json
src/stories/[Component].stories.tsx
```

---

## JSON Template

```json
{
  "name": "[component-name]",
  "type": "component",
  "id": "[figma-node-id]",

  "meta": {
    "sourceMarkdown": "docs/component-specs/[Component].md",
    "storyFile": "src/stories/[Component].stories.tsx",
    "artifactStatus": "ready",
    "lastAuditDate": "YYYY-MM-DD",
    "auditRules": "R1–R8",
    "version": "1.0",
    "openQuestions": [],
    "notes": [],
    "knownIssues": [
      {
        "issue": "[Description of the bug or limitation]",
        "workaround": "[What to do instead, or null if none]",
        "date": "YYYY-MM-DD"
      }
    ],
    "changelog": [
      {
        "date": "YYYY-MM-DD",
        "change": "[What changed — e.g. checkmark removed from SelectItem, selected state now uses color/brand/primary text]",
        "breaking": false
      }
    ],
    "darkMode": {
      "notes": "[Any tokens or behaviors that differ between light and dark mode, or 'No dark mode differences' if none]",
      "pairedSurfaceRisk": "[Tokens that could resolve differently in dark mode — e.g. surface/default/foreground on overlay background]"
    }
  },

  "description": "[One-sentence description of what this component is and does.]",
  "category": "[actions | forms | display | layout | navigation | overlay | feedback | custom]",
  "shadcnBase": "[shadcn-component-name | custom]",
  "primitiveBase": "[Radix UI primitive name | @base-ui/react | input-otp | react-day-picker | none]",

  "implementation": {
    "tsxFile": "src/components/ui/[component].tsx",
    "packageDeps": ["[package-name@version]"],
    "exports": ["[ComponentName]", "[ComponentNameVariants]"],
    "notes": [
      "[Key implementation decision — e.g. 'Uses ring-2 on slot + z-10 pattern (shadcn), no overflow-hidden on group']",
      "[Another note — e.g. 'Dropdown width hardcoded to 280px — CSS var --anchor-width unreliable in Base UI']"
    ]
  },

  "links": {
    "figma": "https://www.figma.com/design/YWfTOUTpFZ0BNxHobfUqme?node-id=[id]",
    "shadcn": "https://ui.shadcn.com/docs/components/[component]",
    "radix": "https://www.radix-ui.com/primitives/docs/components/[primitive]",
    "storybook": "http://localhost:6006/?path=/docs/[category]-[component]--docs"
  },

  "relationships": {
    "subComponents": [
      {
        "name": "[component-name]",
        "id": "[figma-node-id]",
        "role": "[what it does inside this component]",
        "overrideRule": "[never override fills | swap variant prop only | open]"
      }
    ],
    "usedBy": ["[parent-component-name]"],
    "relatedComponents": [
      {
        "name": "[component-name]",
        "reason": "[why they are used together or compared]"
      }
    ],
    "mustBeChildOf": [],
    "mustNotBeChildOf": [],
    "composedWith": [],
    "requires": [],
    "triggers": [],
    "blocksWhen": [],
    "exposesState": []
  },

  "componentSets": {
    "[set-name]": {
      "id": "[figma-node-id]",
      "variants": 0,
      "purpose": "[what this set does]"
    }
  },

  "variants": {
    "[VariantName]": {
      "type": "enum",
      "values": ["[Figma Option 1]", "[Figma Option 2]"],
      "default": "[Figma Default]",
      "reactProp": "[reactPropName]",
      "reactValues": {
        "[Figma Option 1]": "[react-value-1]",
        "[Figma Option 2]": "[react-value-2]"
      },
      "intent": {
        "[Figma Option 1]": "[When and why to use this option — matches Type Guide prose from markdown]"
      },
      "dimensions": {
        "[Figma Option 1]": {
          "height": 40,
          "width": null,
          "paddingH": 16,
          "paddingV": 8,
          "radius": 8
        }
      }
    }
  },

  "componentProperties": {
    "[Property Name]": {
      "type": "TEXT | BOOLEAN | INSTANCE_SWAP | SLOT | VARIANT",
      "default": "[default value]",
      "reactProp": "[optional — maps to code prop]",
      "group": "[optional — groups related props]",
      "visibleWhen": "[optional — e.g. 'Type=Icon']"
    }
  },

  "tokens": {
    "container": {
      "[State or Variant]": {
        "fill": "[token-name | transparent]",
        "stroke": "[token-name]",
        "strokeWeight": 1,
        "strokeAlign": "inside | outside | center",
        "radius": "[token-name]",
        "shadow": "[effect-style-name | none]",
        "opacity": 1
      }
    },
    "typography": {
      "[layer-name]": {
        "[State or Variant]": {
          "fill": "[token-name]"
        }
      }
    },
    "icons": {
      "[layer-name]": {
        "[State or Variant]": {
          "stroke": "[token-name]",
          "fill": "[token-name | none]"
        }
      }
    },
    "spacing": {
      "paddingTop": "[token-name]",
      "paddingBottom": "[token-name]",
      "paddingLeft": "[token-name]",
      "paddingRight": "[token-name]",
      "gap": "[token-name]"
    },
    "states": {
      "focus": {
        "indicator": "ring | border | inset-shadow",
        "token": "[token-name]",
        "weight": 2,
        "align": "outside | inside",
        "glowToken": "[token-name | null]",
        "glowOpacity": "20%",
        "notes": "[e.g. 'ring-2 ring-offset-0 z-10 pattern — shadcn approach for InputOTP slots']"
      },
      "invalid": {
        "borderToken": "[token-name — e.g. color/border/error]",
        "ringToken": "[token-name — e.g. color/border/error (same as border, not color/ring)]",
        "ringGlow": "color-mix(in_srgb,[token]_20%,transparent)",
        "notes": "[e.g. 'Uses [&[aria-invalid]] compound selector to beat data-[state=open] specificity']"
      },
      "disabled": {
        "opacity": null,
        "fillOverride": "[token-name | none]",
        "borderOverride": "[token-name | none]",
        "textOverride": "[token-name | none]"
      }
    }
  },

  "composition": {
    "structure": "[Brief layer tree — e.g. root > header > [media, title, description] + content > [btn-primary, btn-outline]]",
    "slots": [
      {
        "name": "[slot-name]",
        "accepts": "[open-ended | typed: component-name]",
        "required": false,
        "multiple": false,
        "defaultContent": "[what ships in the slot by default]"
      }
    ],
    "subComponents": ["[sub-component-name]"],
    "layoutMode": "HORIZONTAL | VERTICAL | NONE",
    "alignment": "[CENTER | MIN | MAX | SPACE_BETWEEN]",
    "rules": ["[Important structural rule]"]
  },

  "behavior": {
    "interactionModel": "[stateless | controlled | uncontrolled | controlled+uncontrolled]",
    "typeGuide": {
      "[TypeValue]": "[Full prose explanation of when and why to use this type — matches Type Guide section in markdown. E.g. 'Type=Basic: click to open, browse the list. Use when the list is moderate in length and the click-to-open affordance is clear.']"
    },
    "openState": {
      "trigger": "[what opens it]",
      "closeTriggers": ["Escape", "backdrop click", "close button"],
      "delay": "[e.g. 700ms Radix default | 300ms system override | none]"
    },
    "focusManagement": {
      "trapFocus": false,
      "initialFocus": "[first focusable element | trigger | custom]",
      "returnFocus": "[trigger element on close]"
    },
    "animation": {
      "dataAttributes": ["data-state=open", "data-state=closed"],
      "description": "[how it animates]"
    },
    "scrollBehavior": "[none | body scrolls | internal scroll]",
    "keyboardPattern": {
      "[Key]": "[Action]"
    }
  },

  "accessibility": {
    "role": "[role or none]",
    "ariaAttributes": {
      "aria-labelledby": "[auto | manual | not-needed]",
      "aria-describedby": "[auto | manual | not-needed]",
      "aria-expanded": "[when applicable | not-used]",
      "aria-selected": "[when applicable | not-used]",
      "aria-invalid": "[when applicable | not-used]",
      "aria-required": "[when applicable | not-used]",
      "aria-disabled": "[when applicable | not-used]"
    },
    "liveRegion": {
      "used": false,
      "politeness": "polite | assertive",
      "announces": "[what it announces]"
    },
    "screenReaderName": "[How the accessible name is derived]",
    "focusIndicator": "[Description — e.g. 'color/ring 2px outside | color/border/error 2px outside when invalid']",
    "touchTarget": "[Touch target rule or size — e.g. '44×44px met natively at Size=Large; pad at sm/default']",
    "requiredMarkup": ["[HTML attribute or element that must always be present]"]
  },

  "storybook": {
    "file": "src/stories/[Component].stories.tsx",
    "title": "[Category]/[ComponentName]",
    "stories": [
      "[Default]",
      "[Filled]",
      "[Invalid]",
      "[Disabled]"
    ],
    "decorators": ["[e.g. TooltipProvider wrapping | SidebarProvider | none]"],
    "notes": "[e.g. 'Invalid+focus: red ring via [&[aria-invalid]] compound selector — verified 2026-06-03']"
  },

  "constraints": {
    "usage": [
      "[When to use this component — positive rule]"
    ],
    "doNot": [
      "[Do not do X — negative rule with reason]"
    ],
    "combinations": {
      "required": [
        "[If variant X then Y must also be present]"
      ],
      "forbidden": [
        "[X cannot be combined with Y]"
      ]
    }
  },

  "bestPractice": {
    "useCases": [
      "[Concrete UI situation where this component is the right choice]"
    ],
    "variantExamples": {
      "[VariantValue]": {
        "whenToUse": "[When and why to reach for this variant]",
        "examples": ["[Real UI example 1]", "[Real UI example 2]"]
      }
    },
    "compositionPatterns": null,
    "comparedTo": [
      {
        "situation": "[The situation or decision point]",
        "use": "[this component / variant]",
        "notInstead": "[the component to avoid + brief reason]"
      }
    ],
    "references": {
      "shadcn": "https://ui.shadcn.com/docs/components/[component]",
      "radix": null
    }
  }
}
```

---

## Field Reference — What's New in v3

### `meta.knownIssues`

Document bugs and limitations with workarounds so future sessions don't re-investigate them.

```json
"knownIssues": [
  {
    "issue": "Dropdown width hardcoded to 280px — CSS var --anchor-width from Base UI Positioner doesn't resolve reliably on Popup element.",
    "workaround": "w-[280px] hardcoded on Combobox.Popup. If container width changes, update both the story wrapper and popupClass.",
    "date": "2026-06-03"
  }
]
```

### `meta.changelog`

Log breaking changes and notable updates. Mirrors CHANGELOG.md entries for this specific component.

```json
"changelog": [
  {
    "date": "2026-06-03",
    "change": "SelectItem: removed checkmark indicator. Selected state now uses color/brand/primary text (transparent bg). Spec: State=Selected → fill transparent, label fill color/brand/primary.",
    "breaking": false
  }
]
```

### `meta.darkMode`

Flag tokens or behaviors that resolve differently in dark mode. Helps catch paired-surface bugs before they ship.

```json
"darkMode": {
  "notes": "Panel link text uses color/surface/overlay/foreground (fixed from surface/default/foreground). Both resolve to #18181B in light mode but differ in dark.",
  "pairedSurfaceRisk": "color/surface/overlay/foreground — correct paired surface is color/surface/overlay (panel background)"
}
```

### `implementation`

Documents the code reality — what file, what packages, what decisions were made that aren't obvious from the spec.

```json
"implementation": {
  "tsxFile": "src/components/ui/input-otp.tsx",
  "packageDeps": ["input-otp@^1.0.0"],
  "exports": ["InputOTP", "InputOTPGroup", "InputOTPSlot", "InputOTPSeparator"],
  "notes": [
    "Active slot uses ring-2 ring-offset-0 z-10 (shadcn pattern) — NOT inset shadow. No overflow-hidden on group.",
    "Slot corner radius = radius/md - 1px via calc() so inset follows group border inner edge."
  ]
}
```

### `tokens.states.invalid`

Explicit invalid state token spec. Critical for form fields — ensures the red ring uses the correct token and compound selector approach.

```json
"invalid": {
  "borderToken": "color/border/error",
  "ringToken": "color/border/error",
  "ringGlow": "color-mix(in_srgb,var(--color-border-error)_20%,transparent)",
  "notes": "Uses [&[aria-invalid]] compound selector to beat data-[state=open] and focus-visible specificity. Blue ring must NOT appear when invalid."
}
```

### `behavior.typeGuide`

Captures the Type Guide prose from markdown so Claude doesn't need to load the markdown to understand type distinctions.

```json
"typeGuide": {
  "Basic": "Click to open, browse the list. Use when list is moderate length and click-to-open affordance is clear. State=Filled-chips exclusive to Basic for multi-select.",
  "Search": "Search-as-you-type. Trigger shows search icon, dropdown filters in real time. Use when list > 15 items or user's primary action is typing.",
  "Tag Input": "Free-form chip creation. Enter or comma confirms chip. Backspace removes last chip. No predefined options list required. Use when user invents values."
}
```

### `storybook`

References the Storybook story file and named exports. Enables navigation and verification without loading files.

```json
"storybook": {
  "file": "src/stories/Select.stories.tsx",
  "title": "Forms/Select",
  "stories": ["Default", "Filled", "Disabled", "Invalid", "WithField", "WithFieldInvalid", "WithFieldDisabled", "WithGroups", "WithSeparator", "AllStates"],
  "decorators": ["none"],
  "notes": "Invalid+open: red border + red ring glow using [&[aria-invalid][data-state=open]] compound selector."
}
```

---

## Regeneration Trigger Rule

Regenerate the meta.json for a component any time **any** of the following change:

| Change | Regenerate? |
|---|---|
| Token rebound in Figma | ✅ Yes |
| Variant added or renamed | ✅ Yes |
| Markdown doc updated | ✅ Yes |
| `.tsx` component file changed | ✅ Yes |
| Story added or changed | ✅ Yes — update `storybook.stories` |
| Bug fixed or workaround found | ✅ Yes — add to `meta.knownIssues` |
| Breaking change made | ✅ Yes — add to `meta.changelog` |
| Audit run | ✅ Yes — update `meta.lastAuditDate` |

---

## Completion Checklist (v3)

- [ ] JSON parses cleanly
- [ ] `meta.artifactStatus` correctly set
- [ ] `meta.lastAuditDate` and `meta.auditRules` filled
- [ ] `meta.knownIssues` — any documented bugs or workarounds added
- [ ] `meta.changelog` — any recent changes logged
- [ ] `meta.darkMode` — paired-surface risks noted
- [ ] `implementation.tsxFile` correct path
- [ ] `implementation.packageDeps` lists all non-standard packages
- [ ] `implementation.notes` documents non-obvious code decisions
- [ ] `variants` — exact Figma names, correct reactProp/reactValues
- [ ] `variants.[x].intent` — matches Type Guide prose from markdown
- [ ] `tokens.container` — per-state fill/stroke/radius/shadow
- [ ] `tokens.states.focus` — token, weight, alignment, glow
- [ ] `tokens.states.invalid` — borderToken, ringToken, ringGlow, notes
- [ ] `tokens.states.disabled` — fill/border/text overrides
- [ ] `composition.slots` — all SLOT nodes with accepts/required
- [ ] `behavior.typeGuide` — one entry per Type variant with prose explanation
- [ ] `behavior.openState` — delay documented if non-default
- [ ] `behavior.keyboardPattern` — all relevant keys
- [ ] `accessibility.focusIndicator` — includes invalid state behavior
- [ ] `storybook.file` — correct path
- [ ] `storybook.stories` — all named exports listed
- [ ] `storybook.notes` — any verification notes (e.g. invalid ring confirmed)
- [ ] `constraints.doNot` — extracted from markdown Do Not table
- [ ] `bestPractice.useCases` — 3–6 concrete situations
- [ ] `bestPractice.variantExamples` — every type with usage distinction
- [ ] `bestPractice.comparedTo` — covers all relatedComponents
- [ ] Validation passes: `node "docs/machine-readable/validate-artifacts.mjs"`
