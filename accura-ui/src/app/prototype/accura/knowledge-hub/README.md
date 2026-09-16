# Knowledge Hub prototype

Route: `/prototype/accura/knowledge-hub` — reached from **Knowledge Hub** in the sidebar footer.

Built for UX/UI review against the source-of-truth documents in `flow/knowledge-hub/`.
Not a confirmed specification.

## Screens

| Level | Route | What it demonstrates |
|---|---|---|
| L1 | `/knowledge-hub` | Folder index, grouped, each card carrying description + resource count + review date |
| L2 | `/knowledge-hub/[folder]` | Resource table with toolbar, `ListSummary`, empty and no-match states |
| L3 | `/knowledge-hub/[folder]/[resource]` | `RecordDetailLayout` at 70/30 — measured 70.0 / 30.0 with a 24px gap at 1440px |

## What is evidence and what is proposed

**Observed** — the seven folder names and `sample.md` come from the supplied screenshots.

**Proposed, needs Amit's confirmation** — everything else, in particular:

- **Standard editions** (`ISO 9001 : 2015`, `ISO/IEC 17025 : 2017`). Public fact for each standard,
  but whether a folder's content was actually written against that edition is unconfirmed.
- **`Source` column** (`Accura template` / `Guidance` / `External reference`). This is not
  decoration: it gates `Use as template`. An external reference is licensed to its publisher, so
  the detail page offers Download only. Confirm the real mix before trusting the split.
- **`Use as template`** creating a Draft in Documents. Amit confirmed the action is generic to all
  resources; the destination is still open.
- **Folder grouping** into *Standards and regulatory* / *Using Accura*. `Accura Software` and
  `User Guides` are a different kind of object from a standards collection, so they are banded
  separately rather than mixed into one flat grid.
- **All resource content** is placeholder, per Amit's brief, and is labelled `Sample` on every
  screen that shows it.

The one question that most changes this design is still open: **does a standards folder contain the
published standard, Accura-written material about it, or a customer's own document?** The Source
badge is built so that answer can be applied without restructuring anything.

## Deliberate pattern deviation — logged, not overlooked

`accura-prototype-build.md` says *"default to a table. Cards earn their place only when the object
has an image, a status needing colour, or a preview"*, and records that Roles and Courses were both
converted away from a card grid on that reasoning.

L1 keeps cards anyway. The reasoning:

- Seven curated folders is a fixed entry point, not a set of rows worth comparing or sorting.
- The card is no longer a bare label — it carries a description and two counts, which is what made
  the earlier card grids fail review.
- `demo-scope.md` locks scope to one happy path per module, and Knowledge Hub sits in the footer
  navigation as a reference utility. Rebuilding its entry point as a table is post-demo work.

Revisit if the folder set grows past roughly a dozen, or if folders gain a sortable attribute.

L2 and L3 follow the locked patterns without deviation.

## Known gaps

- No pagination on L2. Folders hold at most four resources; add `TablePagination` when real content
  lands.
- No audit trail. Knowledge Hub resources are reference material, not controlled records, so no
  `RecordAuditDrawer` is wired. Revisit if publish/supersede becomes an auditable event (BR-017).
- The sidebar still reads **Change Control**. Amit has confirmed **Change Management**; that rename
  touches shared files and is deliberately kept out of this diff.
