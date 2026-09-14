<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Accura demo scope — 2026-09-12

Before module UI work, read `../docs/demo-scope.md` for scope and
`../docs/skills/accura-prototype-build/accura-prototype-build.md` for the patterns.
The user has locked the demo to one happy path per module. Prioritize the shared phase-gate stepper, electronic-signature modal, and 65/35 detail layout. Keep global notification/account, module heading + create CTA, desktop search/filter at 70–80% of its content column, and common record-link/menu/hover behavior.
Defer rejection, mistakes, exceptions, and alternate flows to Post-Demo Backlog; do not investigate them or ask questions that block demo work. Older discovery audits do not override this scope lock. Reuse existing components/tokens and do not delete existing non-demo implementations merely because they are deferred.
