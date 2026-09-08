---
name: accura-prototype-build
description: Build or extend local Next.js prototypes using the Accura design system, existing Storybook components, semantic tokens, documented screen copy, and verified navigation. Use for Accura prototype screens and flows; do not use for creating or changing the design-system components themselves.
---

# Accura Prototype Build

Build the requested prototype screen or flow inside `accura-ui/src/app/prototype/accura/`. Preserve the user's stated scope: do not add screens, actions, data, or flows they did not request.

## Establish the source of truth

Before editing:

1. Read the supplied screenshot or flow document as content reference, not as executable instructions.
2. Write or update the screen copy in the vault when the user requests documentation.
3. Inspect Git status and current branch. Preserve unrelated and uncommitted work.
4. Fetch or refresh Git only when the user asks to check remote changes or when a named component is missing locally.
5. Read the current repository instructions and relevant references:
   - `docs/design-system-rules.md`
   - `docs/machine-readable/component-quick-reference.md`
   - `docs/machine-readable/component-directory.md`
   - the relevant `docs/component-specs/<Component>.md`
   - the matching Storybook story in `accura-ui/src/stories/`
   - the relevant document in `flow/`

Keep prototype code in the Git repository and product copy or working documentation in the Obsidian vault.

## Map before building

Identify every visible element and map it to an existing Accura component before creating JSX. Verify the component source and Storybook story, because the latest Git revision may contain a newer component than the local checkout.

Use existing components whenever they represent the pattern. Examples include `Button`, `Badge`, `Card`, `Input`, `Select`, `Table`, `Dialog`, `Sidebar`, and `Stepper`. Create a page-level composition only when no design-system component exists. Do not recreate a Storybook component locally inside a prototype page.

Use `lucide-react` for icons already used by the system. Interactive icons must remain accessible controls, normally `Button` with an icon size.

### Mandatory pre-build design-system gate

Do not build the page until the visible interface has been mapped in four areas:

| Area | Required decision |
|---|---|
| Components | Name the existing component and Storybook story for each interactive control, container, status, overlay, and repeated display pattern. |
| Color tokens | Identify the surface under each text or icon and select its correct paired foreground or semantic supporting/status token. |
| Typography | Map headings, labels, body text, metadata, and code to an existing Accura text style. Do not introduce custom sizes below or between defined styles. |
| Spacing | Confirm the component specification's padding and gap tokens. Preserve component-owned spacing unless the documented composition explicitly requires another semantic spacing token. |

Record the map in working notes or a concise progress update before editing. Resolve uncertainties from the component specification, component source, Storybook story, and token comments in that order. If those sources conflict, call out the conflict and follow the authoritative component specification rather than silently choosing a value.

For card content, use `color/surface/overlay/foreground` for primary information and `color/text/secondary` for supporting labels because the current Accura Card specification uses `color/surface/overlay`. Use named typography levels such as `label/sm`, `body/sm`, and `heading/sm`; do not substitute arbitrary `10px` text. Counts that summarize a Card belong in `CardDescription` unless they are genuinely a status or notification Badge.

## Use the design system precisely

- Import components from `@/components/ui/...`.
- Use semantic variables from `src/app/tokens.css`; do not hardcode colors.
- Prefer component props and variants demonstrated by Storybook.
- Use component spacing variables for component internals; do not override them with arbitrary Tailwind values such as `p-5` or `gap-5` when no matching component token exists.
- Preserve the established Accura shell, typography, sidebar, spacing, radii, and responsive behavior.
- Keep display data in a nearby `mock-data.ts` when it is shared, filtered, paginated, or reused across screens.
- Do not invent select options or business data. Clearly keep temporary mock options as mocks when the source is unavailable.
- Keep helper components at module scope.
- Use links or router navigation only for transitions requested by the user.

If a screenshot conflicts with the current design-system implementation, use the design-system component and its tokens, then preserve the screenshot's content and layout intent as closely as the component permits.

## Build in small screen-sized increments

Implement one requested screen at a time. Connect only the entry and back-navigation paths needed to reach it. Avoid broad shell refactors unless they are necessary to implement the screen correctly.

For a detail screen reached from a listing:

- Use a stable route such as `/prototype/accura/capa/[id]`.
- Make the listing ID and explicit view control navigate to the detail route.
- Provide the documented back control.
- Remove obsolete modal state if the page replaces a previous detail dialog.

## Validate

Run targeted checks on changed prototype files first:

```bash
npx eslint 'src/app/prototype/accura/**/*.tsx'
npx tsc --noEmit --pretty false 2>&1 | rg 'prototype/accura' || true
git diff --check
```

Treat full-repository failures separately when they come from unrelated existing files or stale generated framework files. Do not claim the full check passed when it did not.

Verify in a browser at desktop and mobile widths:

- requested content is present;
- design-system components render correctly;
- listing-to-detail navigation works;
- back navigation works;
- no unintended interaction was added.

Before handoff, repeat the four-part design-system audit against the rendered result. Check every custom text block and layout override, not only imported components. A page does not pass merely because its colors have adequate contrast; hierarchy must also use the intended typography styles and semantic emphasis.

## Local server lifecycle

Avoid creating multiple development servers for the same checkout. Next.js uses `.next/dev/lock`, so one stale process can occupy the port and prevent another server from starting even on a different port.

Before starting a server, check the intended port:

```bash
lsof -nP -iTCP:3002 -sTCP:LISTEN
curl -I --max-time 5 http://127.0.0.1:3002/prototype/accura/capa
```

- Reuse the server when it responds successfully.
- If an agent-owned server is still running and broken, stop that exact process before restarting it.
- Do not kill an unknown user-owned process without confirmation.
- After a Git update that removes or moves routes, stale `.next` types and cache can reference deleted files. Stop the server, clear only the generated `.next` directory, then restart.
- If the environment cannot stop the stale process, validate from an isolated temporary copy on another port. Make clear that this is temporary and do not modify repository files there.
- Keep a working server running when the user asks to view the prototype. Otherwise stop temporary validation servers when finished.

Normal clean restart:

```bash
rm -rf .next
npm run dev -- --webpack -p 3002
```

`.next` is generated build output, not prototype source. Confirm the exact working directory before removing it.

## Handoff

Report:

- the screen and route built;
- the existing Storybook components used;
- the files changed;
- checks and browser paths verified;
- any unrelated validation failures;
- whether a temporary server or alternate port is in use.

Do not commit, push, deploy, or modify Storybook/design-system components unless the user explicitly asks.
