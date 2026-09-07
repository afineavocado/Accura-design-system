# Storybook Status

Tracks the full Storybook pipeline per component. Update this file after completing each component — do not mark a column ✅ until that phase is genuinely done.

**Pipeline order — no skipping:**
```
.tsx tokens fixed → Figma parity → Story written → Story verified
```

Each column must be ✅ before the next one starts.

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Done and confirmed correct |
| ⚠️ | Exists but needs attention / re-check |
| ❌ | Not done |
| — | No implementation yet — blocked |

**Story verified** = all 8 items in the Phase 3 checklist passed (renders without errors, correct font, correct colors, all controls work, all named stories correct, overlays open/close, a11y no critical violations).

---

## Status Table

| Component | `.tsx` tokens | Figma parity | Story written | Story verified | Notes |
|---|---|---|---|---|---|
| Button | ✅ | ✅ | ✅ | ⚠️ | Visual check pending. opacity-disabled token fixed. shadows/2xs not in tokens.css — blocked. focus/destructive fixed 2026-06-02: destructive variant now uses ring-0 + box-shadow 3px rgba(220,38,38,0.4) instead of blue color/ring. |
| Badge | ✅ | ✅ | ✅ | ✅ | Code audit clean 2026-06-03 — all 12 variants, 3 sizes, 2 shapes token-correct. 0 issues. Visual confirmed by user. |
| Input | ✅ | ⚠️ | ✅ | ❌ | .tsx fixed: 12 token issues. Stories: Default, Filled, Disabled, Invalid, Email, Password, WithField, WithFieldInvalid, WithFieldDisabled, WithLeadingIcon, WithTrailingText, WithTrailingIcon, WithTrailingButton, AllStates. All slots covered. Parity check pending. |
| Textarea | ✅ | ⚠️ | ✅ | ❌ | .tsx fixed: 11 token issues. Input.md updated with real Figma structure (verified via figma-cli). Stories: Default, Filled, Disabled, Invalid, WithField, WithFieldInvalid, WithFieldDisabled, WithLeadingIcon, WithTrailingIcon, WithHeader, WithFooter, WithHeaderAndFooter, WithCharacterCount, AllStates. Parity check pending. |
| Accordion | ✅ | ⚠️ | ✅ | ❌ | .tsx fixed: border token, label/disabled/content colors, spacing tokens, focus ring, lucide→@untitledui. Parity check pending. |
| Alert | ✅ | ⚠️ | ✅ | ❌ | .tsx fixed: warning variant added, all tokens corrected, flex-col layout, data-attr CSS selectors for text colors, icon color via [&_svg]. Parity check pending. |
| AlertDialog | ✅ | ⚠️ | ✅ | ❌ | alert-dialog.tsx fixed: overlay bg-black/80→background/inverted/50%, bg-background→surface/overlay, border token, shadow-lg removed, p-6→spacing/component/xl (24px), gap fixed, sm:responsive classes removed, title color added, description→text/secondary, mt-2 sm:mt-0 removed. alert-dialog.examples.tsx created. Stories: Default, Destructive, CenterAlign, FullWidthFooter, DestructiveCentered. Parity check pending. |
| Avatar | ✅ | ⚠️ | ✅ | ❌ | .tsx rewritten: size CVA (sm/default/lg), surface/muted tokens, online/offline indicator. Parity check pending. |
| Breadcrumb | ✅ | ⚠️ | ✅ | ❌ | .tsx fixed: lucide→@untitledui (ChevronRight, DotsHorizontal), BreadcrumbList gap+color, BreadcrumbLink default/hover/focus tokens, BreadcrumbPage text token, role=link removed. Separator markdown corrected (Slash/Dot use muted/foreground, confirmed Figma). Stories: Default, WithIcon, SlashSeparator, DotSeparator, WithEllipsis, WithDisabled, LongTrail, AllSeparators. Parity check pending. |
| Card | ✅ | ⚠️ | ✅ | ❌ | .tsx fixed: surface/overlay fill, border token, radius token, shadow removed, padding moved to shell, CardTitle text-base/semibold, CardDescription/secondary tokens, no padding on sub-components. Stories: Form, Action, Info, Border, SocialMedia, ImageVertical, ImageDown, ImageHorizontal, Item (placeholder — no Item component). Tab blocked (Tabs not built). Parity check pending. |
| Checkbox | ✅ | ⚠️ | ✅ | ❌ | checkbox.tsx fixed: lucide→Check+Minus from @untitledui, rounded-sm→radius/md, border-primary→color/input/border, ring-offset removed, ring token, disabled:opacity-50→explicit muted fill+disabled border, checked bg token, hover state added, aria-invalid border, Indeterminate Minus icon via group-data-[state] modifier. examples.tsx rewritten (CheckboxItem doesn't exist). Stories: Default, Checked, Indeterminate, Disabled, CheckedDisabled, Invalid, WithLabel, WithDescription, DisabledWithDescription, InvalidWithDescription, Group, AllStates. Figma verified 59:18266. Parity check pending. |
| Dialog | ✅ | ⚠️ | ✅ | ❌ | dialog.tsx fixed: lucide→XClose, overlay bg-black/80→background/inverted/50%, bg-background→surface/overlay, border token, shadow-lg removed (0 Figma effects), p-6→spacing/component/lg (16px), gap fixed, showClose prop added, DialogHeader/Footer spacing tokens, DialogTitle color token, DialogDescription text/secondary. Stories: Form, NoCloseButton, StickyFooter, Scrollable, Destructive. Figma verified 266:131. Parity check pending. |
| Drawer | ✅ | ⚠️ | ✅ | ❌ | drawer.tsx fixed: overlay bg-black/80→background/inverted/50%, bg-background→surface/overlay, border token, rounded-t-[10px]→radius/lg, mt-24 removed, handle-bar py-spacing/lg wrapper + bg-background/muted, DrawerHeader gap 1.5→xxs(2px) + p-4→spacing/lg, DrawerFooter flex-col gap-sm (Figma: VERTICAL) + p-spacing/lg mt-auto removed, title/description color tokens. showHandle prop added. Stories: Bottom, Right, Responsive, WithForm. Figma verified 74:691. Parity check pending. |
| Pagination | ✅ | ⚠️ | ✅ | ❌ | .tsx fixed: lucide→@untitledui (ChevronLeft, ChevronRight, DotsHorizontal), PaginationLink rewritten without buttonVariants (correct per-state tokens), Prev/Next icon-only (text sr-only), all disabled tokens corrected, gap/sizes fixed. Figma verified 59:17863. Stories: Basic, More, Simple, Disabled, WithTotal, WithChanger, WithJumper, ShowAll, FirstPage, LastPage. All 8 meta.json variants covered. Parity check pending. |
| Progress | ✅ | ⚠️ | ✅ | ❌ | progress.tsx fixed: bg-secondary→background/muted, bg-primary→brand/primary, h-4→h-2 (MD=8px default), size CVA (sm/md/lg), Complete state→color/status/success (Figma confirmed — spec corrected). Stories: Default, Loading, Complete, Indeterminate, Sizes, StepTracker, Animated. Figma verified 110:8283. Parity check pending. |
| RadioGroup | ✅ | ⚠️ | ✅ | ❌ | radio-group.tsx fixed: lucide Circle→div dot (8×8px, brand/primary fill), border-primary→color/input/border, checked border added, aria-invalid border, ring-offset removed, ring-ring→ring token, opacity-50→opacity/disabled. No separate radio.tsx needed (shadcn ships one file). radio.examples.tsx rewritten (RadioItem doesn't exist). Stories: Basic, BasicWithDescription, ChoiceCard, Disabled, ChoiceCardDisabled, Invalid, ChoiceCardInvalid, Horizontal. Figma verified 96:33420. Parity check pending. |
| Select | ✅ | ⚠️ | ✅ | ❌ | select.tsx fixed: lucide→@untitledui, h-10→h-9 (36px Figma), all trigger state tokens (border/input, hover, open/focus, disabled explicit tokens not opacity, invalid), SelectContent→surface/overlay, SelectItem→accent hover, SelectSeparator→border/default, ChevronDown icon token with group-disabled. examples.tsx rewritten (SelectField doesn't exist). Stories: Default, Filled, Disabled, Invalid, WithField, WithFieldInvalid, WithFieldDisabled, WithGroups, WithSeparator, AllStates. Figma verified 74:757. Parity check pending. |
| Separator | ✅ | ✅ | ✅ | ✅ | 1 fix: bg-border→bg-[color/border/default]. Figma verified 75:11717. Stories: Horizontal, Vertical, InFormSections, InMetadataRow, InCard. Parity confirmed. Story verified 2026-06-03. |
| Sheet | ✅ | ⚠️ | ✅ | ❌ | sheet.tsx fixed: lucide→XClose, overlay bg-black/80→background/inverted/50%, bg-background→surface/overlay, p-6 gap-4 shadow-lg removed (0 Figma effects), border token + radius per side (radius/lg on exposed edge only), close button ring/accent tokens, SheetHeader flex-col gap-sm + pr offset for close btn, SheetFooter flex-col border-t border/default + gap-sm (VERTICAL Figma confirmed), title/description tokens. Stories: Right, Left, Bottom, Top, ScrollableBody. Figma verified 98:57748. Parity check pending. |
| Slider | ✅ | ⚠️ | ✅ | ❌ | slider.tsx fixed: bg-secondary→surface/muted, bg-primary→brand/primary, border-primary→brand/primary, bg-background→background/default, ring-offset removed, ring token, opacity-50→opacity/disabled. Stories: Default, Horizontal, Disabled, Vertical, Range, WithSteps. Figma verified 67:9199. Parity check pending. |
| Switch | ✅ | ⚠️ | ✅ | ❌ | .tsx fixed: track tokens (border/default unchecked, brand/primary checked), thumb bg token, shadow-lg removed (not in Figma), opacity-50→opacity/disabled, ring-offset removed, Size=Sm added via CVA (28×16, 12×12 thumb, translate-x-3). examples.tsx rewritten (SwitchItem doesn't exist — all compositions inline). Stories: Default, Checked, Small, SmallChecked, Disabled, DisabledChecked, ItemBasic, ItemDescription, ItemChoiceCard, ItemDisabled, ItemInvalid, ItemChoiceCardInvalid, AllSizes. Figma verified 67:88. Parity check pending. |
| Tabs | ✅ | ⚠️ | ✅ | ❌ | .tsx rewritten: variant prop (default/line) on TabsList + TabsTrigger, all tokens corrected (surface/raised, surface/default, surface/accent, text/secondary, text/disabled, brand/primary indicator for Line), removed ring-offset, removed h-10. Stories: Default, Line, Vertical, WithDisabled, LineWithDisabled, BothTypes. All meta.json variants covered. Figma verified. Parity check pending. |
| Toast | ✅ | ⚠️ | ✅ | ❌ | sonner.tsx fixed: all 9 token issues (bg-background→surface/overlay, text-foreground→surface/overlay/foreground, border-border→border/default, shadow removed, description→text/secondary, actionButton→outline tokens, cancelButton→muted tokens, lucide→@untitledui/icons, icon colors set per type). Parity check pending. |
| Tooltip | ✅ | ⚠️ | ✅ | ❌ | tooltip.tsx fixed: border removed (no stroke in spec), bg-popover→tooltip/bg (--tooltip-bg #18181b), text-popover-foreground→tooltip/fg (--tooltip-fg #ffffff), shadow-md removed, rounded-md→radius/md token, px-3 py-1.5→spacing tokens, text-sm→text-xs font-medium leading-none (label/sm). Stories: Top, Bottom, Left, Right, IconButtons, ShortcutHint, DisabledButton, AllSides. Parity check pending. |
| Button Group | ✅ | ⚠️ | ✅ | ❌ | Custom component (no shadcn base). button-group.tsx: inline-flex + overflow-hidden + radius/md + surface/default fill + border/default border. Separators via CSS divide-x/divide-y (no explicit elements). Composable API — Ghost Button children. Figma verified 52:11151. Stories: HorizontalTwo, HorizontalThree, HorizontalIcons, TextFormatting, VerticalTwo, VerticalThree, AllVariants. Parity check pending. |
| Combobox | ✅ | ⚠️ | ✅ | ❌ | Built on @base-ui/react. Types: Basic, Search, Tag Input (free-form chips). Dropdown width fixed to w-[280px] (--anchor-width unreliable in Base UI). Parity check pending. |
| Calendar | ✅ | ⚠️ | ✅ | ❌ | Built on react-day-picker v8 + date-fns. Tokens: surface/default container, brand/primary selected, background/accent today/range-middle, text/secondary outside. Stories: Default, Range, NoSelection, WithDisabledDates, OutsideDaysHidden. Parity check pending. |
| Date Picker | ✅ | ⚠️ | ✅ | ❌ | Built on Calendar + @radix-ui/react-popover. Types: Default (single), Range (dual-month). Trigger state tokens per spec (Closed/Hover/Focus/Open). Stories: Default, RangeType, NoLabel, Disabled, AllTypes. Parity check pending. |
| Empty | ✅ | ⚠️ | ✅ | ❌ | empty.tsx: custom CVA component (no shadcn base). 3 variants (default/outline/background), icon slot, title, description, primaryAction, secondaryAction. Media fill switches between variants (background/subtle vs surface/default). Figma verified 97:34667. Stories: Default, Outline, Background, PrimaryActionOnly, ReadOnly, NoIcon, AllVariants, InsideCard. Parity check pending. |
| Input OTP | ✅ | ⚠️ | ✅ | ❌ | input-otp installed + built. Tokens: slot fills/strokes per state, group radius/md overflow-hidden, gap-2. Stories: SixSlot, ThreePlusThree, FourSlot, Disabled, Invalid, AllTypes. Figma verified. Parity pending. |
| Item | ✅ | ⚠️ | ✅ | ❌ | item.tsx: custom CVA (no shadcn base). 6 Types × 3 Variants × 3 Sizes. Icon+Link use items-start (Figma: align=MIN); others items-center. Header type uses V layout with cover image. Figma verified 65:815. Stories: TypeDefault, TypeIcon, TypeAvatar, TypeImage, TypeHeader, TypeLink, VariantOutline, VariantMuted, AllSizes, InsideCard. Card Item variant story can now use real Item component. Parity check pending. |
| Navigation Menu | ✅ | ⚠️ | ✅ | ❌ | Built on @radix-ui/react-navigation-menu. Exports: NavigationMenu, List, Item, Trigger, Content, Link, PanelLink, Viewport, Indicator. Tokens: bg/default trigger, accent hover, ring focus, surface/overlay panel, border/default panel border, shadow/sm. Stories: ListPanel, GridPanel, FeaturedPanel, LinkType, FullNavBar, DisabledLink. Parity check pending. |
| Sidebar | ✅ | ⚠️ | ✅ | ❌ | Custom composable component (shadcn sidebar pattern). Exports: SidebarProvider, Sidebar, SidebarHeader, SidebarLogo, SidebarBrand, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenuItem, SidebarSubItem, SidebarBadge, SidebarFooter, SidebarToggle. Tokens: sidebar/* scope. Keyboard: Cmd+B toggle. Stories: Default, WithSubItems, Collapsible, Floating. Parity check pending. |
| Skeleton | ✅ | ✅ | ✅ | ✅ | Code audit clean 2026-06-03 — single token correct, animate-pulse, rounded-md. Code-only (no Figma). |
| Table | ✅ | ⚠️ | ✅ | ❌ | table.tsx: shadcn HTML table elements. surface/raised bg header/footer, surface/raised/foreground th, surface/default/foreground td, border/default rows, accent hover, brand/primary selected border-l. Spacing: py-3 px-4 (Tailwind utilities). Figma verified 124:8531. Stories: Basic, WithSort, WithSelection, WithAvatars, WithTrends. Parity pending. |
| ChatBubble | ✅ | — | ✅ | ❌ | **Undocumented until 2026-07-02**; meta.json created same day. Custom chat kit: ChatBubble / TypingIndicator / SuggestionChip / ChatInput. Code spec-fixed 2026-07-02: lucide→@untitledui/icons, CSS-var spacing→Tailwind utilities, TypingIndicator now motion-reduce gated (verified in Storybook). Markdown spec written 2026-07-02. Remaining: no Figma component, not Phase-3 verified → artifactStatus = needs review. |

---

## Summary

Total tracked: **36 components** (33 original + AlertDialog split from Alert + ChatBubble added to tracking 2026-07-02)

> **Corrected 2026-07-02.** The previous Summary claimed "35/35 fully done, Story verified: 35" — this contradicted the table above and was wrong. The 2026-06-03 code audit confirmed `.tsx` tokens across the 35 built components, but Figma parity and Phase-3 story verification were **not** completed for most. Real per-column counts below.

- **Fully done (all 4 columns ✅):** 3 / 36 — Badge, Separator, Skeleton
- **`.tsx` tokens fixed:** 36 / 36 (ChatBubble spec-fixed 2026-07-02)
- **Figma parity confirmed:** 4 — Badge, Separator, Skeleton, Button
- **Story written:** 36 / 36
- **Story verified:** 3 — Badge, Separator, Skeleton (Button ⚠️ visual check pending; 31 others ❌ parity + verification pending)
- **Needs review:** 1 — ChatBubble (undocumented until 2026-07-02)
- **No implementation:** 0

**Session 2026-06-03 — audit pass completed:**
- Code audit run on all 35 components — all tokens correct
- Fixes applied: hardcoded shadows (4 files) → `var(--shadow-*)` tokens
- Invalid state focus rings fixed across 6 components (select, input, textarea, combobox, checkbox, radio-group) — blue ring → red ring using `[&[aria-invalid]]` compound selectors
- Dropdown menu sizing corrected: `radius/lg` container, `p-0.5` padding, `gap-0.5` between items, `h-8` item height, `px-2` item padding — applied to Select, Combobox, Tag Input suggestions
- Calendar: row spacing (2px via `[&_tbody_tr+tr]:mt-0.5`), outside day foreground on selected state, month/year selector (3-view: days/months/years), time picker (custom HH:MM popover, trailing clock icon)
- DatePicker: icon moved to trailing position
- InputOTP invalid: radius mismatch fixed (shadcn ring-2 pattern, per-slot borders, no overflow-hidden)
- Select: checkmark removed, selected state = `color/brand/primary` text per spec
- Drawer Responsive: rewrote to use `useIsDesktop()` — Dialog on desktop, Drawer on mobile
- AlertDialog FullWidthFooter story: footer gap fixed from `xs` to `sm` (8px)
- Navigation menu: `surface/default/foreground` → `surface/overlay/foreground` (paired-surface fix)
- Story className override audit rule added to Storybook Build Process

**Infrastructure:** `tokens.css` — 339 CSS variables. Spacing: Tailwind utilities only. Colors/radius: CSS vars.

---

## Update Rule

After finishing each component, update this file immediately — same session. Do not batch updates.

| When | What to update |
|---|---|
| `.tsx` spec-fix done | Mark `.tsx` tokens ✅, add date in Notes |
| Figma parity confirmed | Mark Figma parity ✅ |
| Story written (imports from examples.tsx) | Mark Story written ✅ |
| Phase 3 checklist all passed | Mark Story verified ✅, update Summary counts |
