# Document ↔ Training pattern mapping

Updated 2026-09-12 against GitHub `afineavocado/Accura-design-system`, main commit `c6f7868` (Build the Training review queue). Local main was fast-forwarded from `9a17c41`; pre-existing Document prototypes and uncommitted instructions were preserved.

## Applied to Document Demo

| Area | Training reference | Document change / rationale |
| --- | --- | --- |
| Navigation | `../app-sidebar.tsx` | Reuse `AppSidebar` and `AppNavItems`, including collapse/expand, Platform group, footer and active descendant routes. Replace the Documents placeholder in the shared nav with this demo route; Training and Document can now navigate to each other. |
| Shell | `../training/training-shell.tsx` | Same viewport-height frame, fixed header region, independently scrolling content, `background/muted` page surface, 16px mobile / 24px desktop inset. Consistent spatial context between modules. |
| Record interaction | `../training/page.tsx`, `../row-click.ts` | Brand-primary medium-weight name link + secondary metadata; whole row is a convenience click using `useRowClick`. Link and menu button clicks do not trigger the row handler. Real links retain keyboard and copy-link behavior. |
| Pagination | `../table-pagination.tsx` | Replace custom footer/state with `TablePagination` + `usePagination`. Same Rows per page, count, numbered pages, previous/next and safe filtered page bounds. |
| Search | `../training/page.tsx` | Search input uses `type=search`, a vertically centered muted search icon and existing Input/Select controls. |
| Status styling | `../training/mock-data.ts` | Move workflow/use-status → Badge variant mapping into typed maps in Document `mock-data.ts`; presentation no longer repeats status-color logic. |
| Card headings | `../training/courses/[id]/page.tsx` | Keep Card/Header/Title/Content. Explicit Inter (`font-sans`) for semantic 16px headings, avoiding the global Albert Sans h2 rule. Main text uses overlay foreground, supporting text uses secondary, minimum 12px. |
| Reference/back links | Training course detail | Use brand-primary links consistently, rather than neutral text that looks non-interactive. |
| Audit events | `../training/history-panel.tsx` | Remove decorative left timeline borders. Events remain a simple spaced sequence with action, actor and UTC timestamp. Signatures remain tied to revision. |

## Intentional differences — do not copy blindly

- **Header:** Training currently puts “Training” in its global header. Document keeps notification/account and puts its module title + Create CTA in page content, per the user's explicit contract. Training's header was not rewritten.
- **Sections/tabs:** Training has different entities (Users, Roles, Courses, Assessments, Review). Document stays one listing; no segmented views are introduced.
- **Toolbar:** keep Document's 75–80% desktop-width constraint. Controls wrap instead of being stretched across the full table.
- **Detail columns:** Training rails are fixed at 320px. Document retains its fractional layout after the gap, stacked on mobile — see `docs/skills/accura-prototype-build/accura-prototype-build.md` · Record masters for the current ratio.
- ~~**Card density:** Document retains explicit `spacing/component/xl` (24px).~~
  **Superseded 2026-09-14.** Document now uses the Card primitive's 16px default, matching
  Training and CAPA. The explicit overrides were removed. Note that `docs/component-specs/Card.md`
  still specifies 24px while `card.tsx` implements 16px — a design-system gap, logged for the
  Figma ↔ code reconciliation pass, not resolved here.
- **Domain:** preserve Draft → In Review → In Approval → Approved; Approved is not Effective; QA sets Effective Date. No Training due dates, scores, assessments, rejection or extra workflows were added.
- **Unbuilt navigation:** the shared sidebar's other `#` placeholders are inherited, not new implemented modules. No logout or settings behavior is implied.

## Verification

- ESLint targeted to Document files, shared record composition and shared sidebar; TypeScript no-emit.
- Browser: collapse/expand; Document → Training → Document; numbered pagination and page-size selection; filter while on a later page; click a non-link cell to detail; open row menu without leaving listing; Open document navigation.
- Desktop and 390px mobile detail/layout; preserved notification/account and vertical mobile stepper. No browser console errors observed on Document during these checks.
- Existing happy-path signing code, storage key and mock records were not replaced.

## Maintenance

Read the current repo guide at `docs/skills/accura-prototype-build/accura-prototype-build.md`, and `docs/demo-scope.md` for what is in scope. New shared navigation goes in `platformNav`, not a Document-local sidebar. Keep user exceptions above explicit; visual consistency is not a reason to change domain rules.
