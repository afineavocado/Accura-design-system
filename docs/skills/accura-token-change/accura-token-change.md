---
name: accura-token-change
description: How to add, rename or retire a token in Accura — every file it has to land in, in order, and the checks that prove it landed. Use whenever a screen needs a value the semantic layer does not carry.
---

# Adding a token

Five tokens were added between 2026-09-15 and 09-17. Each went into `tokens.css`, each went into
the CHANGELOG, and **none of them went anywhere else** — so `accura-decisions.md` claimed four
Accura-only tokens while listing five and knowing about none of the new ones, and the semantic list
in `docs/design-system-rules.md` had never heard of them. This is the order that prevents that.

---

## 0. First ask whether it should exist

A new token is a new word in the vocabulary, and every module has to learn it. Before adding:

- **Does a semantic already mean this?** Read the candidates' `$description` in
  `tokens/semantics.tokens.json` — each carries Intent / Use when / Do not use / Use instead.
- **Is the value already a primitive that was never mapped?** The orange and violet ramps sat in
  Figma and in the export for months with no semantic pointing at them. Mapping one of those is
  cheaper and truer than inventing a value.
- **Are you reaching for a status token as decoration?** That is the symptom that says a semantic
  is missing. `surface/brand-subtle` exists because modules wanting a green band were using
  `status/success/subtle`, which means *this succeeded*.

If the answer is "a module needed a colour and none fit", write down which module and why — that
sentence becomes the `$description` and the CHANGELOG entry.

---

## 1. The export — `tokens/semantics.tokens.json`

Add it here **first**, aliasing a primitive, never a raw hex:

```json
"brand-subtle": {
  "$value": "{color.green.50}",
  "$type": "color",
  "$description": "Intent:      …\nUse when:    …\nDo not use:  …\nUse instead: …\nNote:        Accura-only; added <date> because …\nStatus:      active"
}
```

Primitives go in `primitives.tokens.json`, component tokens in `components.tokens.json`. The
`$description` follows the file's own six-line shape — **Do not use** and **Use instead** are the
two that stop the token being misapplied, so they are not optional.

## 2. The runtime — `accura-ui/src/app/tokens.css`

`tokens.css` is what ships. Add the token to the `:root` block, and **add a dark-mode value in the
`.dark` block** — a `green/50` band is correct in light and glare in dark. An alias
(`var(--color-green-50)`) is fine; parity resolves it.

## 3. The documentation — three places, all of them

| File | What goes in |
|---|---|
| `docs/design-system-rules.md` | the token's name in the Layer 2 semantic list, **and** a row in the light/dark value table. If it has no `/foreground` pair, add it to the exception list beside `color/background/subtle` |
| `accura-decisions.md` §7 | a row in **Accura-only tokens** if it does not exist in Agentic |
| `CHANGELOG.md` | what it is, what modules were doing without it, and why the alternative was wrong |

If the token resolves an open question in `accura-decisions.md`, **do not close the question** — note
the state and leave it. A use being found is not an answer to what the value was for.

## 4. Prove it

```bash
node tokens/token-parity.mjs              # must compare one more than before
node docs/machine-readable/drift-check.mjs
```

`token-parity` walks the **export** and looks each token up in the CSS, so a token that ships only
in `tokens.css` used to be invisible to it. It now prints a `⚠ ships in tokens.css with no entry in
the export` list — if your new token appears there, step 1 was skipped. Verified 2026-09-17 by
planting `--color-planted-token` and watching it appear.

---

## Storybook

**Nothing to do.** `.storybook/preview.tsx` imports `src/app/globals.css`, which `@import`s
`./tokens.css` — the same file the app uses, so a new token is available in Storybook the moment it
is in `tokens.css`. There is no second copy to update.

The one caveat is mechanical: **Storybook does not reliably hot-reload token edits.** Restart it and
re-measure in the browser rather than trusting what is on screen.

---

## Renaming or retiring

- **Renaming** is a repo-wide grep, not an edit: `grep -rn "old-name" accura-ui/src docs tokens`.
  The name appears in the CSS, the export, both docs, and every consumer.
- **Retiring** sets `"Status: deprecated"` in the `$description` with what to use instead, and the
  token stays until no consumer references it. Deleting it first turns every consumer into a
  silent `var()` that resolves to nothing — which is exactly how `--color-border-brand` rendered
  invisible borders in Change Control for a week.
