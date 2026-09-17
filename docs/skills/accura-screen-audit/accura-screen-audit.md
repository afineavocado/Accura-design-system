---
name: accura-screen-audit
description: How to audit an Accura prototype screen against the design system — every state, every container, every slot, every token — and report numbers rather than impressions. Use after building or inheriting a screen. The patterns being audited against live in accura-design-patterns.md.
---

# Accura screen audit

An audit that checks the properties you thought of can only confirm the things you thought of.
This one enumerates instead, and it exists because a page passed three separate audits of mine on
2026-09-17 while its tables overrode the component's padding four times, its icons came from two
libraries, and one of its nav buttons pointed at an element that does not exist.

**Report numbers, not impressions.** Every claim below is a count or a measurement.

---

## 0. Enumerate the states first

List every route **and every state** the screen serves before looking at any of them. A detail page
with seven statuses is seven screens. Auditing two of them and generalising is how the Change
Actions section survived: it only renders from `QA Approval` onward, and the audit had been run on
a `Draft` and an `Impact Assessment` record.

```bash
# every seed record, every status
grep -o 'id: "[^"]*"' mock-data.ts
```

Open each one. If a state needs data the seeds do not have, say so in the report rather than
skipping it silently.

---

## 1. Structure — what is a container made of

For every bordered, padded or grouped thing on screen, name the component it should be:

```bash
grep -c "<Card" page.tsx                      # against
grep -c 'rounded-\[var(--radius' page.tsx     # hand-drawn panels
```

A hand-drawn `rounded-* border-*` div is a `Card` or an `Item` that was not used. **Then compare
the same concept across sections of the same screen**: Change Control renders a department as a
`Card` in Impact Assessment and as a bare header-plus-table in Change Actions. Both are "a
department"; only one looks like it.

---

## 2. Slots — what the page overrode inside a component

The highest-yield grep in this document:

```bash
grep -nE '<(TableCell|TableHead|CardContent|CardTitle|Label|Input|Badge|Button)[^>]*className="[^"]*\b(p|px|py|pt|pb|h|text|font|leading|rounded)-' page.tsx
```

Every hit is the page arguing with a component about its own internals. `TableCell` is `p-4` by
design; `className="h-12 py-0"` makes that table denser than every other table in the product, and
no token audit will see it because `py-0` is a real utility.

If the component's value is genuinely wrong, fix the component or its spec — never the instance.

---

## 3. Tokens

```bash
grep -oE '\b(gap|p|px|py|pt|pb|m|mt|mb|space-y|space-x)-[0-9.]+' page.tsx | sort | uniq -c
grep -oE '\[[0-9]+px\]' page.tsx | sort | uniq -c
grep -oE 'rounded-\[var\(--radius-[a-z]+\)\]' page.tsx | sort | uniq -c
grep -c 'font-semibold\|font-bold' page.tsx
grep -nE '#[0-9a-fA-F]{6}|rgb\(' page.tsx
```

Expect: spacing literals near zero, **one** radius per kind of object, no weight outside 400/500
unless a component owns it, no raw colour at all. Arbitrary `[Npx]` is legitimate for layout widths
and nothing else — `leading-[21px]` is a line-height token spelled by hand.

---

## 4. Icons

```bash
grep -h "from \"lucide-react\"\|from \"@untitledui/icons\"" *.tsx | sort -u
grep -oE 'h-[0-9] w-[0-9]|size-[0-9]' page.tsx | sort | uniq -c
```

**One library per prototype: lucide.** `@untitledui/icons` is used *inside* `components/ui/`, which
is not licence to use it in a screen. Sizes come from the scale — `size-4` (16px) inline,
`size-5` (20px) for a section glyph. Four different icon sizes on one page is a finding.

---

## 5. Semantics — is the token's meaning true

A colour can be correct and still be wrong:

- `status/*` tokens mean state. A green section header is not a success; a green nav item is not a
  success. Use `surface/brand/subtle`.
- `text/link` means "this navigates". Not a heading colour.
- `border/error` on something that is not in error.

Read every token name on the page as a sentence and ask whether it is true.

---

## 6. States the screenshot does not show

These need the browser, and they are where audits by reading fail completely:

- **Hover, focus, disabled** on every interactive element. A ghost button on a tinted band fills
  grey on hover; nothing in the source says so.
- **Empty.** Render the list with no rows. A section that returns `null` when empty will leave any
  nav item, anchor or count that was derived from *status* pointing at nothing.
- **Long content.** The longest title, the most chips, the most rows.

```js
// hover, measured
await btn.hover(); await page.waitForTimeout(300);
await btn.evaluate(e => getComputedStyle(e).backgroundColor)
```

---

## 7. Rendered type, enumerated

```bash
node audit-styles.mjs <url> <sibling-url> <sibling-url>
```

⚠️ **Know its blind spot.** It enumerates *text* styles only — size, weight, colour. It cannot see
padding, radius, borders, gaps, icon sizes or structure, and it reads one state per URL. A clean
table from this script means the type is consistent, nothing more. Passes 1–6 are not optional
because pass 7 was green.

---

## 8. Cross-module

The screen is not finished when it is internally consistent. Compare it with the module that does
the same job:

```bash
node audit-styles.mjs <this-screen> <deviations-equivalent> <capa-equivalent>
```

`⚠ only here` in that output is either a deliberate feature of this screen or a defect, and the
sample column usually tells you which.

---

## Report format

One table per pass, counts and measurements, each finding numbered so it can be quoted later. For
each: what it is, where (`file:line`), what the house does instead, and whether it is a **module
defect** or a **system gap**. A system gap goes in the known-gaps list in
`accura-design-patterns.md` — it is not something to fix in the screen.

State plainly what you did **not** check, and which states you could not reach.
