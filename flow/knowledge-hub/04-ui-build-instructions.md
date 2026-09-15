# Knowledge Hub — UI build instructions

**For:** Amit · **From:** Chi · **Date:** 15 Sep 2026
**Companions:** `01-origin.md` (evidence) · `02-main-business-flow-and-rules.md` (rules) · `03-log.md` (decisions)
**Reference prototype:** `accura-ui/src/app/prototype/accura/knowledge-hub` — run `npm run dev`, open `/prototype/accura/knowledge-hub`

---

## 0. How to read this document

**This is a rearrange instruction, not a rebuild instruction.**

> Any section that exists on your Knowledge Hub screens today and is **not named in this document
> stays exactly where it is.** Apply the placement test in §3 to decide which column it belongs to.
> **Never delete a section because it does not appear in the prototype.** The prototype is a
> narrow demo built from two screenshots; your build is the complete product. Absence from the
> prototype is not evidence that something should go.

If you hand this to an agent, give it that paragraph first and keep it in the prompt.

Work in this order and stop at the end of Tier B. Tier C is blocked on a decision only you can make.

| Tier | What | When |
|---|---|---|
| **A** | Keep as-is | Do nothing |
| **B** | Apply now — none of it depends on what is inside a folder | This pass |
| **C** | Blocked — needs your answer to §8 Q1 first | Later |

Sections §1–§3 and §7 are **constant**: they apply to every module, not just this one. Only §4–§6
are specific to Knowledge Hub. Reuse the constant sections for the next module and the cost of
each handover drops to almost nothing.

---

## 1. Tier A — keep as-is

Do not change these. They are already right, and changing them costs review time for no gain.

- The folder grid as the hub entry point.
- `‹ Back to folders` as the return affordance.
- The overall simplicity. Knowledge Hub sits in the **footer navigation** — it is a reference
  utility, not a workflow module. It should stay lighter than Documents or CAPA.
- No search on the folder index. Seven curated folders do not need one. Search belongs one level
  down, where files accumulate.

---

## 2. Tier B — apply now (binding layer)

These come from the design system and are the same in every module. None of them depend on what a
folder contains, so none are blocked.

### 2.1 Layout shell

| Rule | Value |
|---|---|
| Detail screens use the shared two-column layout | **70 / 30** |
| Breakpoint where columns appear | **`xl` — 1280px.** Below that, stack |
| Stack order when narrow | **Main content first, side rail second.** Never rail-first |
| Gap between columns | **24px** (`spacing/layout/sm`) |
| Side rail | **Single column.** Never a multi-column field grid in the rail |
| Card padding | **16px**, the component default |

Implement the ratio as **fractional tracks**, not two percentage widths plus a gap — percentages
plus a gap overflow the row. In our stack that is
`xl:grid-cols-[minmax(0,70fr)_minmax(0,30fr)]`. Use whatever expresses "70fr / 30fr after the gap"
in yours. Measured in the prototype at 1440px: **70.0% / 30.0%, 24px gap.**

### 2.2 Things that belong to no column

Two categories are routinely put in the rail and should not be:

- **History, activity and signatures** → an audit drawer, not a persistent card.
- **The primary action** → appears **once**, in one shared action area. Never duplicated across
  several cards.

### 2.3 Typography and spacing floors

| | Size / weight |
|---|---|
| Module name — in the header bar | 18px / 600 |
| Record title — detail screens | 20px / 600 |
| Card / section title | 16px / 600 |

- **Nothing below 12px**, anywhere.
- Spacing on the **4px scale**: 2 · 4 · 8 · 12 · 16 · 24 · 32.

### 2.4 Copy fixes — content-independent, cheap, high value

1. **Remove the duplicated page title.** `Knowledge Hub` currently appears both in the header bar
   and as an `<h1>` in page content. Keep the header bar one, delete the content one. Keep the
   supporting sentence beneath it.
2. **Label every date.** `Sep 13, 2026` alone is not enough — a reader cannot tell whether it is
   published, updated, reviewed or effective. Use a column header or an inline prefix:
   `Last updated 13 Sep 2026`.
3. **One date format across the product.** Pick one and hold it — we use `13 Sep 2026`. Watch out
   for `toLocaleDateString` with a short month: it returns a four-letter `Sept`, which reads as a
   second format on the same screen. We hit this exact bug.
4. **Give the trailing row affordance a label.** The small mark at the end of the file row has no
   accessible name today. Use your standard row-action control with an explicit label.
5. **Empty states must say what to do next.** `No resources published yet` plus a route back beats
   a blank panel. A folder with nothing in it is a real state, not an error.
6. **Label placeholder content.** Your current resources are placeholders. Mark them `Sample` so
   they cannot be mistaken for approved material. This matters most in a live demo.
7. **Sentence case everywhere**; buttons start with a verb.

---

## 3. The placement test — which column a section belongs to

Use this instead of a list of sections. A list invites an agent to delete whatever is not on it; a
test correctly places sections we have never seen.

Ask in order, stop at the first match:

1. **Is it history, activity or a signature record?** → Neither column. Audit drawer.
2. **Is it the primary action?** → Neither column. One shared action area.
3. **Does it read and work in a single narrow column of roughly 300–380px?**
   - **No** — it needs width: file preview, a field grid of two or more columns, a table, long
     prose, or any conversation/long-input flow → **the 70 column**
   - **Yes** — short label/value list, reference links, a summary → **the 30 column**

**Why a test and not a list.** In our own build, Documents puts its metadata in the 30 column while
CAPA puts its metadata in the 70 column. Same kind of content, different columns — because what
decides is not *what the section is* but *whether it needs width*. Any list organised by content
type would be wrong in one of those two modules.

**The payoff:** run a comments/discussion section through the test. Question 3 answers "no" —
conversation plus a long input needs width — so it lands in the **70 column**. The test places a
section correctly that the prototype never modelled. That is the whole point.

---

## 4. Tier B — Knowledge Hub screens (proposed mapping)

**Proposed, not mandated.** Where your build already differs for a reason, keep your version and
tell me why — that is useful feedback, not a deviation to fix.

### L1 · Folder index

Each folder card currently shows an icon and a name. Add two things:

- **A one-line description** — "what you will find here". Standards-based folder names are clear to
  specialists and opaque to everyone else.
- **A resource count and a review date** — `4 resources · Reviewed 22 Jul 2026`.

This is also the cheapest fix for the biggest visual problem: the page is roughly 70% empty and each
card is a wide box holding ten characters. Filling the card is less work than rebuilding the grid.

**Group the folders.** `Accura Software` and `User Guides` are a different kind of object from a
standards collection. Mixing them into one flat grid makes the reader sort them mentally:

```
Standards and regulatory    ISO 9001 · ISO 13485 · ISO 15189 · ISO/IEC 17025 · GMP PIC/S
Using Accura                Accura Software · User Guides
```

### L2 · Folder contents

Move from a bare file row to a table, and add the columns a professional reader needs before
trusting a file:

| Column | Note |
|---|---|
| **Title** | The real link. Show the file name beneath it as secondary text |
| **Type** | Template · Checklist · Guide · Example |
| **Source** | See §5 — this one carries logic, it is not decoration |
| **Reviewed against** | Which standard edition the content was written for |
| **Last updated** | Labelled and in the product's one date format |

Add the standard toolbar above it: search plus filters on the left, one row. Search flexes
(`min-width 240px`, `max-width 380px`); filters are fixed width. Put the count row between the
toolbar and the table, stating what is true — `4 resources` unfiltered, `0 of 2 resources` when
filtered, with a `Clear filters` link only while something is filtered.

### L3 · Resource detail — new screen, optional this pass

This does not exist in your build yet, so it is an addition rather than a rearrange. Include it only
if you want the full flow reviewed.

- **70 column:** the preview.
- **30 column:** resource details as a single-column label/value list, then a short note on how the
  resource may be used.
- **Actions beside the record title**, not in a bottom bar — there is no multi-step task here.

---

## 5. The one rule that carries logic: Source gates the action

`Source` is not a badge for decoration. It decides whether `Use as template` is offered.

| Source | `Use as template` | `Download` |
|---|---|---|
| Accura template | ✅ | ✅ |
| Guidance | ✅ | ✅ |
| **External reference** | ❌ **hidden** | ✅ |

An external reference is published by someone else and kept under their licence. It can be read and
downloaded, but not adapted into a controlled document. "Free of charge" and "free to redistribute"
are different things — this is `BR-005` made visible in the interface.

You confirmed `Use as template` is generic to all resources. Keep its **placement uniform** and make
its **availability conditional**. Still open: whether it creates a Draft in your Documents module —
which gives an audit-time answer to *"where did this SOP come from?"* — or only downloads a copy,
which does not.

---

## 6. Do not touch

Named explicitly so no agent can reason its way into removing them:

- **Any section on your screens that this document does not mention.** Keep it, place it with §3.
- **Comments, discussion, or annotation**, if your build has any. Per the test these belong in the
  **70 column**. They were removed once during a previous handover; that must not repeat.
- **Permissions, access control and tenant scoping.** Not modelled in the prototype at all.
- **Backend wiring, routes and data contracts.**
- **Notification behaviour.** The badge `10` on the hub has undefined meaning (`BR-018`) — leave it
  alone rather than connecting it to Knowledge Hub events.

---

## 7. Acceptance checks

Run these before sending it back. They are measurable, so we do not have to trade impressions.

**The one that matters most:**

> **Count the sections on each screen before you start and after you finish. The two numbers must
> match.** If the second is lower, something was deleted — roll back and find it.

Then:

- [ ] At ≥1280px the detail screen shows two columns; measured ratio is **70/30 ±1%** with a 24px gap.
- [ ] Below 1280px the columns stack, **main content above the side rail**.
- [ ] The side rail is a single column at every width.
- [ ] No horizontal scrollbar on the page body at 1280px, 1000px and 375px.
- [ ] `Knowledge Hub` appears **once**, in the header bar.
- [ ] Every visible date carries a semantic label and uses one format.
- [ ] Every interactive control has an accessible name; the row affordance is reachable by keyboard.
- [ ] An empty folder and a no-results filter each show a message with a next action.
- [ ] Placeholder resources are labelled `Sample`.
- [ ] `Use as template` is hidden on `External reference` resources and present on the others.
- [ ] No history, activity or signature card is persistent on a detail screen.
- [ ] The primary action appears exactly once per screen.

---

## 8. Open — needs your answer, blocks Tier C

**Q1 is the one that matters.** Everything in Tier C waits on it.

**Q1 — What is actually inside a standards folder?** Open `ISO 17025` and tell me which it is:

| | Content | Consequence |
|---|---|---|
| **(a)** | The published ISO standard itself | Cannot be free to anyone — the text is copyrighted and sold per licence |
| **(b)** | Templates and guidance **Accura wrote**, mapped to that standard | Safe. Folder name should say so; everything in §4 applies directly |
| **(c)** | A specific customer's own documents | **Must not sit in a platform-wide hub** — that is the tenant-leakage case in `BR-004` |

The Source column in §5 is built so your answer can be applied as data, without restructuring any
screen.

**Regardless of the answer:** a folder named `ISO 17025` tells a specialist nothing. There are
editions 2005 and 2017, and they differ materially — using a template built for the superseded
edition is an audit finding. Two things follow, and both are safe to do now:

- **Put the edition in the name**: `ISO/IEC 17025 : 2017`.
- **Say on each resource which edition it was reviewed against.**

Expect both questions from any quality professional in a live demo: *"which edition?"* and *"do you
supply the standard itself?"* Worth having the answers ready either way.

**Also open, not blocking:**

- Does `Use as template` create a Draft in Documents, or only download? (§5)
- Should Knowledge Hub resources ever be promoted into the controlled Documents module? (`BR-012`)
- Confirmed separately: the module is **Change Management**, and Knowledge Hub stays in the **footer
  navigation**.

---

## 9. What I need back

1. Your answer to **Q1**.
2. A list of the sections currently on your Knowledge Hub screens — names and one line each, no
   code. This lets me write §4 and §6 from *what you actually have* instead of from what the
   prototype guessed, which is the change that prevents another deleted section.
3. Whether you or an agent will apply this — it changes how I write the next one.
