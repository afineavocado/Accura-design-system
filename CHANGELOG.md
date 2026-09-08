# Changelog

All notable changes to the Accura design system.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
**Rule: every breaking change is recorded here before it ships.**

Accura is a re-theme of the Agentic Design System. Changes inherited from Agentic upstream are not logged here — only what is specific to Accura.

---

## [Unreleased]

### Known issues
- `chat-bubble.meta.json` references `ChatBubble.stories.tsx`, which was removed. Either drop the component and its spec, or restore the story. Surfaced by `validate-artifacts.mjs` (1 remaining error).
- `docs/machine-readable/figma-ids.md` carries Agentic's node IDs. Spot-checks suggest IDs survived the file duplication (`sidebar` at `95:18202` is correct in both), but this has not been verified across all 32 entries.
- 27 pre-existing TypeScript errors in story files, inherited from the fork. Storybook 10 made `args` required on `Story`. Excluded from the Next.js build; not yet fixed at source.
- 11 open questions (Q1–Q11) recorded in `accura-theme.md`.

---

## 2026-09-08

### Added
- **`stepper/border` component token** (`#d4d4d8` / zinc/300) for the upcoming-step ring. **Aliases a primitive directly**, which the inherited ruleset forbids — Accura now treats the component tier as another semantic layer. Added in code first, then created in Figma and confirmed by re-export, so it is durable. Component tokens: 45 → 46.
- **Stepper component** — horizontal and vertical progress indicator for multi-step flows, built for the CAPA workflow. Spec, component, 7 stories and `meta.json`. Custom, since shadcn/ui has no stepper.
- **CAPA prototype flow** on branch `prototype/capa-flow` — listing, create form and mock data at `accura-ui/src/app/prototype/accura/`. Built against the real component library; deploys as three static routes.
- `flow/capa-listing.md` and `flow/create-capa.md` — screen content, fields and states for the CAPA screens.

### Fixed
- **`validate-contrast.mjs` was reporting success while checking nothing.** It collects pairs by looking for token paths ending `.foreground`, but the Figma re-export collapses those to `-foreground`. Zero paths matched, so it printed `0 pairs checked · 0 fail` and exited clean. Now accepts both spellings: 24 pairs, 19 pass, 5 warn, 0 fail.
- **`validate-artifacts.mjs` failed all 36 artifacts** — it resolved story paths against an `agentic-ui` folder that does not exist here. Now points at `accura-ui`; errors down to 1 real one.
- **`item.tsx` broke the production build.** It called `Avatar` with shadcn's compound children (`AvatarImage` / `AvatarFallback`) while Accura's `Avatar` takes props. `avatar.tsx` exports both APIs, which is how they were mixed. Rewritten to the props form.
- **Sidebar stories would not render.** They imported Untitled UI icon names (`BarChart01`, `Settings01`, `File06`, `Menu01`) from `lucide-react`, which does not export them. 35 such imports across 8 files — also breaking Dialog, Sheet, Toast, ButtonGroup and Item. Each name now comes from the package that exports it.

### Changed
- **Sidebar rebuilt to the Accura design** — two variants only (`Default`, `DefaultCollapsed`), Dashboard + CAPA nav, Setting / Log Out footer, ACCURA wordmark, and a direction-aware collapse chevron. Expanded width 240px → **256px** per Figma `95:15648`.
- `*.stories.tsx` and `.storybook` excluded from the Next.js typecheck. Stories are not part of the deployed app and Storybook compiles them through vite.

### Removed
- Three unrelated demo apps inherited from the fork — ElevenLabs, GrabFood, Simon (18 files).
- Five unused create-next-app placeholder SVGs from `public/`.
- `src/app/page.tsx` — an Agentic-era showcase built from 24 shadcn default classes rather than Accura tokens.
- `Screens/Northwind` templates and the `ChatBubble` story.

### Breaking
- **`color/sidebar/accent` → `color/brand/900` (`#175e41`)** and **`accent/foreground` → white**, in both modes. `sidebar/active` and `active/foreground` alias these in Figma, so they follow. Any sidebar built on the previous light-grey accent changes appearance.
- **`color/sidebar/ring` → `#17bb77`** in code. **Figma still says `#2b7fff`.** Regenerating `tokens.css` straight from Figma reverts this — update the Figma variable or re-apply after regenerating.

---

## 2026-09-07

### Added
- **Initial Accura design system** — theme reference plus the component library forked from `agentic-ui`.
- **`tokens/` re-exported from Accura's Figma file** — 228 primitives, 115 semantics (Light + Dark), 45 component tokens, aliases preserved as references.
- **Repository made self-contained** — vendored the inherited ruleset, 7 process skills, 38 component specs, 36 machine-readable artifacts, tracking docs and the token pipeline. Added `llms.txt` as the navigation index and `CLAUDE.md` as the agent entry point. Every absolute path replaced with a repo-relative one.
- **17 text styles** created in Figma, bound on four axes — `fontFamily`, `fontWeight`, `fontSize`, `letterSpacing`. `lineHeight` stays hardcoded px, since unitless ratios resolve differently per font size.
- Root `.gitignore` — `tokens/node_modules` is 58MB and nothing excluded it.

### Fixed
- **The DTCG token build did not work.** DTCG forbids a node being both a token and a group, but Figma has `color/background/default` alongside `color/background/default/foreground`, so Style Dictionary could not see any `/foreground` token. The inherited Agentic export fails the same way with 8 unresolved references — verified by building it. Children are now collapsed onto the parent segment (`color.background.default-foreground`), keeping the CSS variable name while staying reachable.
- Five chart colours were self-referential once collections shared a namespace (`color/chart/1` → `color/chart/1`). Those 10 are inlined as literals.

### Changed
- `docs/design-system-rules.md` opens with an **override table** naming every value where Accura differs from the inherited rules. Agentic's contrast table is computed against blue `#2b7fff` and is invalid here.

### Removed
- **`hypertokens-system-bundles.md`** — vendored by category without being read. It contradicted the theme in six places with no override header: `brand.primary` as blue/500, `border.error` at red/500 where Accura uses red/300, and a typography table whose `heading/lg` matched neither system. Every pairing in it was already specified authoritatively elsewhere.

### Notes
- **Brand anchors at `/800-base` (`#008852`), not `/500`.** This is the contrast rule applied correctly, not a violation — green measures 2.50:1 against white at `/500`, below the 3:1 floor, while `/800` reaches 4.59:1 and is safe as fill *and* small text.
- **Figma uses SF Pro; code uses Inter.** A recorded, accepted mismatch — not an oversight.
