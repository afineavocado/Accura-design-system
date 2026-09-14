# Document prototype handoff — 14 Sep 2026, v2

Target: https://github.com/afineavocado/Accura-design-system

Base local commit: `c6f7868e249442857e7a7d79332030d0ab7baef7`.
This updated package supersedes the earlier handoff folder, which is retained as an archive. No commit, push or remote sync was performed. This is an integration package, not a standalone app.

## Contents and integration

- `repo-files/`: current source snapshots, with repository-relative paths. Includes Document module/mock data, shared header/audit/workflow/row-action components, shared Button/Table changes, Storybook example, sidebar/agent instructions and authoritative design contract.
- `patches/existing-files.patch`: tracked-file changes against the base commit (Button, Table, sidebar and app AGENTS). Prefer reviewing/applying this patch over overwriting these shared files.
- `discovery/`: product knowledge, session log, backlog and functional specification, supplied as reference material, not app source.
- `MANIFEST.sha256`: SHA-256 checksums of package files.

Owner workflow:

1. Use a clean checkout and create a feature branch. Compare the current destination with the base commit; this package does not know subsequent remote changes.
2. If integrating into the original base, run `git apply --check /absolute/path/to/package/patches/existing-files.patch`, then apply after review. Copy the remaining new files from `repo-files/`, preserving relative paths.
3. If the first handoff has already been merged, do NOT apply the base patch blindly. Diff/merge each corresponding snapshot in `repo-files/` against the destination instead. Never overwrite other contributors' shared Button/Table/sidebar changes. Do not both apply a patch and overwrite those files without reviewing.
4. Keep `discovery/` outside app runtime. Source notes may refer to the original sibling `accura-discovery` folder; the included reference copies resolve the information, not every original relative link.
5. Use existing package/lock files from the target repository. In `accura-ui`, install dependencies with `npm ci` if needed, run ESLint/TypeScript/build checks, then `npm run dev`. Open http://localhost:3001/prototype/accura/documents.

## Latest reviewed changes included

- Normal / External category-specific signed submission; one Normal reviewer + QA; new revision identity, Superseded, Obsolete and returned Draft contexts.
- Listing separates workflow/use status, hides non-actions behind `-`, uses `Externally approved` and short `Returned` copy. Superseded badge is struck through/muted but record remains accessible.
- 70/30 detail layout, details/links in right rail, persistent elevated task bar, audit drawer for signature/history rather than permanent signature cards.
- Ghost row-action button inside a white elevated right-sticky container only when actual horizontal overflow exists; ordinary inline actions otherwise. Shared grouped-button sizing; QA actions side by side.
- E-signature identity/role/date/password-style layout with record/meaning context and demo credential warning. Draft disables Mark as Obsolete, retaining Save/Cancel/valid signed Submit.

## Rules and limitations

Read `repo-files/docs/demo-design-contract.md` first, especially its detailed decision register and latest confirmed review batch. It separates confirmation from proposed copy/control variants and interim assumptions. Older module README/mapping documents are historical where they conflict with this contract; do not revive old routes or broad approval claims.

Normal replacement approval currently supersedes the previous revision immediately; new effectiveness defaults to approval +14 days (QA override). This interim assumption can leave no effective revision during the gap. External new-version routing and Author/Owner mock equivalence remain labelled assumptions.

Seed mock records, people and sample content are included as source. User-created browser records, signatures and uploaded files are NOT exported: they live in localStorage/IndexedDB on the original browser. Fresh browsers use seed data. No production database, real Office conversion, authentication, legally binding e-signature or production audit backend is supplied. Use `demo` in the signing field, never a real password.

Excluded: `.git`, `.next`, node_modules, environment/secrets, personal browser data and unrelated module changes. Shared primitives affect other consumers: regression-test their buttons/tables after merging.

## Review checklist

- Listing at wide and narrow widths: action placement, hover/focus and ghost-container distinction.
- Draft save and signed submit; review/QA signing; External signed acknowledgement.
- New revision identity/history, pending effective, Superseded/Obsolete display, returned Draft context.
- Disabled Draft obsolete, horizontal QA actions, signature modal, audit drawer and downloads.
- Run `npx tsc --noEmit --incremental false --pretty false` and targeted ESLint. Production `npm run build` must be run by integrator; not validated for this package.
