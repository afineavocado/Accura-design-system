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
- **`flow/capa-prototype-spec.md`** — single source of truth for CAPA prototype scope, canonical mock data, routes, screen copy, status support, audit trail and electronic-signature flow.

- **`font-family/display` = Albert Sans in Figma** (Primitives, 228 → 229) and the heading text styles bound to it: `display/lg` `md` `sm`, `heading/xl` `lg` `md`. `heading/sm` (16) and `heading/xs` (14) deliberately stay on `font-family/sans` — at those sizes they read as labels, and `heading/sm` is `CardTitle`, which would have put Albert Sans on every card. **This closes the headings half of the Figma↔code type mismatch** (`accura-theme.md` §6); only body remains split (Figma SF Pro vs code Inter). ⚠️ Setting `fontName` on a text style silently clears its `fontWeight` binding — it did so on 5 of the 6 styles and they had to be re-bound. Always re-verify all four axes after touching `fontName`.
- **`Button` variant `Destructive Secondary`** (`destructiveSecondary`) — low-emphasis destructive, for a destructive action sharing a footer with a primary one that must stay dominant (CAPA `Reject` beside `Approve & Sign`). Solid destructive beside solid primary measures **1.20:1** between the two fills — near-identical lightness, so the meaning rides entirely on hue and collapses under red-green colour blindness (1.48:1). Five new component tokens mirroring `button/secondary` on the red ramp. Two deliberate token choices: label is **red/900** not `status/danger-subtle/foreground` (red/700 is 4.47:1 on the pressed fill and misses AA), and border is **red/500** not `color/border/error` (red/300 is 1.90:1 on white, failing the 3:1 control-boundary floor — this does not resolve Q10). **Code-only** — Figma's button set still has 6 Types. Component tokens: 47 → 52.
- **`checkbox/radius` component token** (`4px`). Created in Figma's Components collection (46 → 47) and synced to code. **Aliases nothing** — it is a fixed value, the second deliberate break from the inherited "component tokens must alias semantics" rule after `stepper/border`.
- **Albert Sans for headings** — `h1`–`h3` and the four overlay titles (Dialog, AlertDialog, Sheet, Drawer) now render in Albert Sans; body, labels, inputs, buttons and `h4`–`h6` stay on Inter. Wired at `--font-heading` in `globals.css`, which already existed but was pointing at Inter and consumed nowhere. **Code-only** — Figma has no `font-family/display` primitive, so this is a second accepted Figma↔code type mismatch (`accura-theme.md` §6). Albert Sans loads in **both** `.storybook/preview-head.html` and `src/app/layout.tsx`; changing one without the other desynchronises Storybook from the app.

### Fixed
- **AlertDialog taught the wrong destructive pattern.** The `Default` story paired destructive content ("Delete workspace? … cannot be undone") with the primary green confirm, contradicting `AlertDialog.md`, which files "Publish this draft?" under `Type=Default` and "Delete workspace?" under `Type=Destructive`. Being first on the Docs page, it was the most likely thing to be copied. `Default` now confirms a reversible publish; the delete case moved to a new `DeleteWorkspace` story. `AlertDialogAction` also gained real `variant`/`size` props — the previous `className={buttonVariants({ variant: 'destructive' })}` route emitted two competing fills and was decided by CSS source order rather than intent.
- **Sheet and Dialog close buttons were bare 16×16 icons**, not the Ghost Icon buttons their specs called for. No hit area, no ghost hover, opacity-based states. Both now use a Button instance at `icon-sm` (36×36). `Sheet.md` corrected from 32×32, a size Button does not provide.
- **`validate-contrast.mjs` was reporting success while checking nothing.** It collects pairs by looking for token paths ending `.foreground`, but the Figma re-export collapses those to `-foreground`. Zero paths matched, so it printed `0 pairs checked · 0 fail` and exited clean. Now accepts both spellings: 24 pairs, 19 pass, 5 warn, 0 fail.
- **`validate-artifacts.mjs` failed all 36 artifacts** — it resolved story paths against an `agentic-ui` folder that does not exist here. Now points at `accura-ui`; errors down to 1 real one.
- **`item.tsx` broke the production build.** It called `Avatar` with shadcn's compound children (`AvatarImage` / `AvatarFallback`) while Accura's `Avatar` takes props. `avatar.tsx` exports both APIs, which is how they were mixed. Rewritten to the props form.
- **Sidebar stories would not render.** They imported Untitled UI icon names (`BarChart01`, `Settings01`, `File06`, `Menu01`) from `lucide-react`, which does not export them. 35 such imports across 8 files — also breaking Dialog, Sheet, Toast, ButtonGroup and Item. Each name now comes from the package that exports it.

### Changed
- **Radius scale rescaled to base 12** — `radius/base` `8px` → **`12px`**, making radius the third changed primitive lever. Set in Figma and pulled into code by re-export. The shadcn ±4 / ±2 offsets are preserved (`sm 8 · md 10 · lg 12 · xl 16`), so shadcn components still behave; the irregular top end (`14 / 18 / 21`) was regularised to `20 / 24 / 28`. Buttons are unaffected — they were already pill `9999`.

  | | none | sm | md | base | lg | xl | 2xl | 3xl | 4xl | full |
  |---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
  | before | 0 | 4 | 6 | 8 | 8 | 12 | 14 | 18 | 21 | 9999 |
  | after | 0 | 8 | 10 | 12 | 12 | 16 | 20 | 24 | 28 | 9999 |

  **Side effect worth knowing:** CSS clamps `border-radius` to half the shorter side, so Badge at Small (16px) and Medium (20px) heights now renders as a full pill rather than a rounded rectangle. Accepted as consistent with pill buttons; if rounded-rect badges are wanted, Badge needs its own radius token the way Checkbox now has one.
- **CAPA prototype mock data unified** — listing, supported detail pages, audit trail and electronic signature now share canonical records. The listing shows all six workflow statuses; only Draft, In Review and In Approval link to detail pages. CAPA status badges now use the Medium size.
- **CAPA prototype documentation consolidated** — listing, create, detail, audit trail, electronic signature and overall flow copy now live in one specification. The document distinguishes designed detail states (Draft and In Review), the reused In Approval layout, and listing-only statuses without detail designs.
- **Stepper layout reworked** — labels moved below the indicator, the current label changed to `color/brand/primary`, and an optional `description` line was added per step (`color/text/secondary` for complete/current, `color/text/tertiary` for upcoming). Applies to both orientations.
- **Sidebar rebuilt to the Accura design** — two variants only (`Default`, `DefaultCollapsed`), Dashboard + CAPA nav, Setting / Log Out footer, ACCURA wordmark, and a direction-aware collapse chevron. Expanded width 240px → **256px** per Figma `95:15648`.
- `*.stories.tsx` and `.storybook` excluded from the Next.js typecheck. Stories are not part of the deployed app and Storybook compiles them through vite.

### Removed
- Six superseded CAPA prototype documents: `flow/capa-listing.md`, `flow/create-capa.md`, `flow/capa-detail.md`, `flow/audit-trail-record.md`, `flow/e-signature.md` and `flow/prototype-flow.md`. Their content is preserved in `flow/capa-prototype-spec.md`.
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
