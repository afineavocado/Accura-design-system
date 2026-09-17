# Knowledge Hub — module spec

**As-built**, read from the code on 2026-09-17. Built for UX review, **not a confirmed
specification** — its own README says so. Its source material — `01-origin.md`,
`02-main-business-flow-and-rules.md`, `03-log.md`, `04-ui-build-instructions.md` — lived in
`flow/knowledge-hub/` and was **removed on 2026-09-17** once this file existed; it is recoverable
from git history.

Files — `accura-ui/src/app/prototype/accura/knowledge-hub/` (537 lines):
`mock-data.ts` (381) · `page.tsx` · `[folder]/` · `layout.tsx` · `README.md`.

Reached from **Knowledge Hub** in the sidebar **footer**, not the module list.

---

## 1. Shape — a library, not a workflow

No lifecycle, no statuses, no signatures. Three levels:

| Level | Route | What it is |
|---|---|---|
| L1 | `/knowledge-hub` | folder index, grouped, each card carrying a description, a resource count and a review date |
| L2 | `/knowledge-hub/[folder]` | resource table with toolbar and `ListSummary`, plus empty and no-match states |
| L3 | `/knowledge-hub/[folder]/[resource]` | `RecordDetailLayout` at 70/30 — measured 70.0 / 30.0 with a 24px gap at 1440px |

**Seven folders in two groups.** *Standards and regulatory*: `iso-9001` (3 resources),
`iso-13485` (2), `iso-15189` (2), `iso-17025` (4), `gmp-pics` (1). *Using Accura*:
`accura-software` (1), `user-guides` (2). Fifteen resources in total.

---

## 2. Data model — `mock-data.ts`

```
Folder     slug · title · group · description · resources[] · review date
Resource   slug · title · fileName · fileType · resourceType · authority
           reviewedAgainst · lastUpdated · placeholder · summary
```

Two closed vocabularies, both exported:

- **`ResourceType`** — `Template` · `Checklist` · `Guide` · `Example`
- **`Authority`** — `Accura template` · `Guidance` · `External reference`

`authority` is the load-bearing one: it separates what Accura wrote from what it is quoting.
`reviewedAgainst` names the standard edition a resource was checked against.

---

## 3. What is evidence and what is proposed

The README draws this line and it should survive into any rewrite:

- **Observed** — the seven folder names and `sample.md`, from the supplied screenshots.
- **Proposed, awaiting confirmation** — everything else, in particular the standard editions
  (`ISO 9001 : 2015`, `ISO/IEC 17025 : 2017`), the resource and authority vocabularies, and every
  review date.

---

## 4. Questions

**4.1 Is any of this confirmed?** The module was built for review against supplied screenshots, and
its own README says it is not a specification. Nothing since has confirmed the vocabularies.

**4.2 Copyright on quoted standards.** Folders are named for ISO standards and resources carry
`reviewedAgainst` editions. What the product may reproduce from a standard, as opposed to point at,
is a legal question the prototype cannot answer by rendering it.

**4.3 Who maintains a resource, and how does it go stale?** Every card shows a review date, but
nothing sets one, and there is no owner, no version and no review workflow — while the rest of the
product is built on exactly those.

**4.4 It sits in the sidebar footer**, beside Settings and Log Out, rather than in the module list
with Documents and CAPA. Is it a module or a utility?

**4.5 No search across folders.** L2 filters within a folder; there is no way to find a template
without knowing which standard it belongs to, which is how someone would actually look for one.
