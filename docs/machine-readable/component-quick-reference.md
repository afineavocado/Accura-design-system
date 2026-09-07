# Component Quick Reference

Scanned from all 35 component artifacts. Read before building any screen — covers what each component is for, the key usage rule, and the most common mistake.

**Source of truth:** all information here is extracted from `docs/machine-readable/artifacts/components/[name].meta.json`.  
Each entry links to its artifact file and Storybook story — open those for full token bindings, variant matrices, and accessibility specs.

---

## Actions

### `button-group`
**What it's for:** A bordered container that visually groups related ghost buttons into a connected control.

**Use when:** Formatting controls where options are complementary but independent (Bold / Italic / Underline in a rich text editor)

**Key rule:** Use only for related actions.

**vs `button-group (grouping a lone button adds visual noise with no meaning)`:** A single isolated action → use `button`

→ Artifact: `docs/machine-readable/artifacts/components/button-group.meta.json` · Storybook: `Actions/ButtonGroup`

---

### `button`
**What it's for:** A clickable action element. Supports 6 visual types, 5 states, and 6 sizes including icon-only variants.

**Use when:** Submitting a form (creating a project, saving settings, sending a message)

**Key rule:** Use maximum one Default button per page section.

**vs `navigation-menu (use nav-menu for multi-item top nav; Link button for single inline link)`:** User needs to navigate to a different page or route → use `button Type=Link`

→ Artifact: `docs/machine-readable/artifacts/components/button.meta.json` · Storybook: `Actions/Button`

---

## Forms

### `calendar`
**What it's for:** A date and range selection control built from composable calendar-day, calendar-month, preset, and calendar component sets.

**Use when:** Booking or reservation flow where the full month must be visible and unavailable dates are marked

**Key rule:** Use Default for single date selection.

**vs `date-picker`:** Always-visible date panel embedded in a page layout → use `calendar`

→ Artifact: `docs/machine-readable/artifacts/components/calendar.meta.json` · Storybook: `Forms/Calendar`

---

### `checkbox`
**What it's for:** A binary selection control used to toggle an option on or off, with optional description text.

**Use when:** Accept terms and conditions — a single required consent field at the bottom of a form

**Key rule:** Use checkbox-item in forms and settings.

**vs `switch`:** User selects multiple items from a list in a form (submitted on Save) → use `checkbox`

→ Artifact: `docs/machine-readable/artifacts/components/checkbox.meta.json` · Storybook: `Forms/Checkbox`

---

### `combobox`
**What it's for:** A searchable, filterable dropdown control — single selection, multi-selection, search-as-you-type, free-form tag entry, or time selection.

**Use when:** Assigning team members to a task — large org, user types a name to filter hundreds of people

**Key rule:** Use combobox-field, not combobox-trigger, for standard form use.

**vs `select`:** Long list or user types to filter (>15 items) → use `combobox`

> ⚠️ **Known issue:** Dropdown width hardcoded to 280px — CSS var --anchor-width from Base UI Positioner doesn't resolve reliably on Popup element. — w-[280px] hardcoded on Combobox.Popup. If container width changes, update both the story wrapper and popupClass.

→ Artifact: `docs/machine-readable/artifacts/components/combobox.meta.json` · Storybook: `Forms/Combobox`

---

### `date-picker`
**What it's for:** An input trigger that opens a calendar popup for selecting a single date, date range, or typed date input.

**Use when:** A booking form needs a 'Check-in date' field that opens a calendar on click

**Key rule:** Use Default for single-date fields.

**vs `calendar`:** Date field inside a form that opens a picker on demand → use `date-picker`

→ Artifact: `docs/machine-readable/artifacts/components/date-picker.meta.json` · Storybook: `Forms/DatePicker`

---

### `input-otp`
**What it's for:** A one-time password input built from individual slot cells grouped into a single control.

**Use when:** Email verification during signup — 'Enter the 6-digit code we sent to your email'

**Key rule:** Always use input-otp, never _input-otp-slot standalone.

**vs `input`:** User enters a structured verification or PIN code in individual slots → use `input-otp`

→ Artifact: `docs/machine-readable/artifacts/components/input-otp.meta.json` · Storybook: `Forms/InputOtp`

---

### `input`
**What it's for:** A single-line text input control. Built on the native HTML input element. Use for name, email, password, search, and any single-line text entry.

**Use when:** User registration or account setup forms: name, email, phone, username fields

**Key rule:** Use input-field for every standard form field.

**vs `select or combobox`:** User must type a free-form value — anything goes → use `input`

→ Artifact: `docs/machine-readable/artifacts/components/input.meta.json` · Storybook: `Forms/Input`

---

### `radio`
**What it's for:** A single-select control used within a radio group, with Basic row and Choice card layouts.

**Use when:** Pricing plan selection: Free, Plus, Pro — only one tier can be active, seeing all options at once matters

**Key rule:** Never use a single radio-item in isolation.

**vs `select`:** 2–5 mutually exclusive options where seeing all at once aids the decision → use `radio`

→ Artifact: `docs/machine-readable/artifacts/components/radio-group.meta.json` · Storybook: `Forms/RadioGroup`

---

### `select`
**What it's for:** A dropdown control for choosing one option from a predefined fixed list.

**Use when:** Country or region field in a checkout or address form — fixed list, user needs to scroll and pick one

**Key rule:** Use select-field, not select-trigger, for standard form use.

**vs `combobox`:** Fixed short list (≤ ~10 items), pick one, no typing needed → use `select`

→ Artifact: `docs/machine-readable/artifacts/components/select.meta.json` · Storybook: `Forms/Select`

---

### `slider`
**What it's for:** A range input control that lets users select a value by dragging a thumb along a track.

**Use when:** Volume or playback speed control — user drags to an approximate level, exact value matters less than feel

**Key rule:** Use for editable range values only.

**vs `input (number)`:** Approximate value in a continuous range, precision not required → use `slider`

→ Artifact: `docs/machine-readable/artifacts/components/slider.meta.json` · Storybook: `Forms/Slider`

---

### `switch`
**What it's for:** A toggle control for binary on/off choices, with a visual switch and a labeled switch-item row.

**Use when:** Notification settings: 'Enable push notifications' — toggling applies immediately, no Save button

**Key rule:** Use switch-item in forms and settings.

**vs `checkbox`:** Instant effect on toggle, no form submit → use `switch`

→ Artifact: `docs/machine-readable/artifacts/components/switch.meta.json` · Storybook: `Forms/Switch`

---

### `textarea`
**What it's for:** A multi-line text input for free-form prose. Built on the native HTML textarea element. Use for notes, comments, descriptions, and any content where the user needs more than one line.

**Use when:** Support ticket message field — long-form free text requiring multiple lines

**Key rule:** Use input-field, not textarea standalone, for all standard form fields.

**Don't:** Do not use Textarea for structured multi-value entry — use combobox (Filled-chips).

**vs `textarea`:** Single-line text: name, email, search, number → use `input`

→ Artifact: `docs/machine-readable/artifacts/components/textarea.meta.json` · Storybook: `Forms/Textarea`

---

## Display

### `accordion`
**What it's for:** A vertically stacked set of interactive headings that each reveal a section of content.

**Use when:** FAQ pages where users scan question headings and only open relevant answers

**Key rule:** Accordion is a single item — compose multiple instances at page level with no gap.

**vs `tabs`:** Stacked sections where each reveals long-form content, multiple can be open → use `accordion`

→ Artifact: `docs/machine-readable/artifacts/components/accordion.meta.json` · Storybook: `Display/Accordion`

---

### `avatar`
**What it's for:** A circular user representation with image, initials fallback, 3 sizes, and optional online/offline status indicator.

**Use when:** User profile headers where a photo or initials identifies the account owner at a glance

**Key rule:** Use Image when a photo URL is available.

**vs `a raw circle frame with image fill`:** Showing a user's identity (photo or initials) → use `avatar`

→ Artifact: `docs/machine-readable/artifacts/components/avatar.meta.json` · Storybook: `Display/Avatar`

---

### `badge`
**What it's for:** A small status label used to categorise, tag, or communicate state. Supports 11 visual variants, 3 shapes, and 3 sizes.

**Use when:** Displaying the status of a record in a table row ('Active', 'Expired', 'Pending review')

**Key rule:** Badge is non-interactive by default.

**vs `badge (badge has no interactive states and cannot be dismissed)`:** The label needs to be dismissible by the user (a selected filter chip, a tag in a combobox) → use `tag`

→ Artifact: `docs/machine-readable/artifacts/components/badge.meta.json` · Storybook: `Display/Badge`

---

## Feedback

### `alert`
**What it's for:** Inline feedback banners for system-level messages. Three variants: Default (neutral), Destructive (error), Warning (caution). Non-blocking — does not steal focus or require a decision.

**Use when:** Displaying a form submission error inline below the form header so the user sees it without scrolling

**Key rule:** Use inline alert for non-blocking feedback.

**vs `alert (alert is persistent; toast is transient)`:** Feedback that auto-dismisses after a completed action (save, copy, send) → use `toast`

→ Artifact: `docs/machine-readable/artifacts/components/alert.meta.json` · Storybook: `Feedback/Alert`

---

### `empty`
**What it's for:** A placeholder displayed when a list, panel, or section has no content. Icon + title + description + optional action buttons. Three Variants control container surface. Purely presentational — no Radix primitive.

**Use when:** A project list that has no projects yet — first-use onboarding state with a 'Create Project' CTA

**Key rule:** Variant=Default inside containers that already provide a surface (cards, sheets, dialogs).

**vs `empty (showing empty state during a load is a false negative — the data hasn't arrived yet)`:** Data is still loading and content is expected to appear → use `skeleton`

→ Artifact: `docs/machine-readable/artifacts/components/empty.meta.json` · Storybook: `Feedback/Empty`

---

### `progress`
**What it's for:** A horizontal progress bar for communicating operation completion percentage or indeterminate loading state. Built on Radix UI Progress. Tracks with a fill indicator driven by value 0–100 or null for indeterminate.

**Use when:** Showing file upload completion percentage as a user uploads a document or image

**Key rule:** Always pair with a visible label naming what is progressing.

**vs `progress State=Indeterminate (use indeterminate only when an active operation is clearly running)`:** Loading duration is unknown and no percentage can be shown → use `skeleton (content placeholder) or a spinner`

→ Artifact: `docs/machine-readable/artifacts/components/progress.meta.json` · Storybook: `Feedback/Progress`

---

### `skeleton`
**What it's for:** A loading placeholder that pulses while content is fetching. Code-only — no published Figma component. Compose multiple instances to mirror the real content layout.

**Use when:** Replacing a card grid while the list of items loads from an API

**Key rule:** Code-only — do not publish as a Figma component set.

**vs `skeleton (skeleton signals content is coming; empty signals there is nothing to come)`:** Data has loaded and there is simply nothing to show (zero items) → use `empty`

→ Artifact: `docs/machine-readable/artifacts/components/skeleton.meta.json` · Storybook: `Feedback/Skeleton`

---

### `toast`
**What it's for:** A temporary floating notification for system feedback — confirmations, errors, warnings, and async status. Built on Sonner (imperative API); dismissed automatically after a timeout or by the user.

**Use when:** Confirming a settings save ('Settings saved.') immediately after the user clicks Save

**Key rule:** Type=Loading must always have a dismiss path — pair with toast.promise() or call toast.dismiss(id) explicitly.

**vs `toast (toast auto-dismisses and may be missed)`:** A persistent message that stays on screen until the user acts (form error, expiry warning) → use `alert`

→ Artifact: `docs/machine-readable/artifacts/components/toast.meta.json` · Storybook: `Feedback/Toast`

---

## Overlay

### `alert-dialog`
**What it's for:** A modal overlay that requires an explicit user decision before the page can continue. Use when both confirm and cancel are real choices, not when cancel is simply 'close the modal'.

**Use when:** Confirming workspace or project deletion — irreversible, user must explicitly choose

**Key rule:** Use only when the user must make a decision before continuing.

**Don't:** Do not add a × close button to Type=Destructive — closing ≠ cancelling.

**vs `alert-dialog`:** Feedback that doesn't block the user → use `alert (inline)`

→ Artifact: `docs/machine-readable/artifacts/components/alert-dialog.meta.json` · Storybook: `Overlay/AlertDialog`

---

### `dialog`
**What it's for:** A modal overlay that interrupts the user to present focused content or collect input. Built on Radix UI Dialog. Renders a full-screen backdrop with a centered popup; focus is trapped inside until dismissed.

**Use when:** User clicks 'Edit profile' and must save or cancel before returning to the page

**Key rule:** Use dialogs for tasks that require the user's full attention before returning — editing, confirming, collecting input.

**vs `sheet`:** User must make a decision or complete a task before returning to the page → use `dialog`

→ Artifact: `docs/machine-readable/artifacts/components/dialog.meta.json` · Storybook: `Overlay/Dialog`

---

### `drawer`
**What it's for:** A sliding panel that emerges from an edge of the screen or centers responsively as an overlay.

**Use when:** User taps a 'Filter' button on a mobile search page — a bottom sheet slides up with filter controls

**Key rule:** Use Bottom for mobile-first flows.

**vs `sheet`:** Bottom-anchored panel on mobile with swipe-to-dismiss → use `drawer`

→ Artifact: `docs/machine-readable/artifacts/components/drawer.meta.json` · Storybook: `Overlay/Drawer`

---

### `sheet`
**What it's for:** A slide-in panel from the viewport edge for secondary tasks — filters, navigation, detail panels, settings. Built on Radix UI Dialog with a side prop. Shares the same primitive as Dialog but is positional rather than centered.

**Use when:** User clicks 'Filters' in a data table and a right panel slides in with filter controls, keeping the table visible behind it

**Key rule:** Use Sheet for secondary tasks that don't require the user to lose page context — filters, quick edits, detail previews, navigation.

**vs `dialog`:** Secondary contextual task without losing page context → use `sheet`

→ Artifact: `docs/machine-readable/artifacts/components/sheet.meta.json` · Storybook: `Overlay/Sheet`

---

### `tooltip`
**What it's for:** A floating label that appears on hover or focus to provide supplementary context.

**Use when:** Labelling an icon-only button so keyboard and mouse users know what it does ('Archive', 'Share', 'Delete')

**Key rule:** Use Side=Top by default.

**vs `tooltip (tooltip is read-only; interactive content inside it is inaccessible)`:** The hint contains interactive content (links, buttons, form fields) → use `popover`

→ Artifact: `docs/machine-readable/artifacts/components/tooltip.meta.json` · Storybook: `Overlay/Tooltip`

---

## Navigation

### `breadcrumb`
**What it's for:** Navigation trail showing the user's location within a hierarchy.

**Use when:** A settings page at 'Settings / Notifications / Email' shows the full path so users can step back to any level

**Key rule:** Use breadcrumb only for 2+ hierarchy levels.

**vs `pagination`:** Shows user's current location in a page hierarchy → use `breadcrumb`

→ Artifact: `docs/machine-readable/artifacts/components/breadcrumb.meta.json` · Storybook: `Navigation/Breadcrumb`

---

### `navigation-menu`
**What it's for:** A horizontal site navigation bar with dropdown panels. Built on Radix UI NavigationMenu. Three component sets: nav-button (trigger or link), nav-panel (dropdown panel), and nav-panel-link (link row inside panel).

**Use when:** A SaaS app header has 'Products', 'Solutions', and 'Pricing' — Products and Solutions each expand to a panel of sub-links

**Key rule:** Use Type=Trigger only when there is a nav-panel to open — never a trigger with no associated content.

**vs `sidebar`:** Horizontal top nav bar with dropdown panels for site-level navigation → use `navigation-menu`

→ Artifact: `docs/machine-readable/artifacts/components/navigation-menu.meta.json` · Storybook: `Navigation/NavigationMenu`

---

### `pagination`
**What it's for:** A navigation control for moving through multi-page data sets.

**Use when:** A search results page returns 200 records and shows 20 per page — Basic or More pagination sits below the result list

**Key rule:** Use pagination, never _pagination-item standalone.

**vs `tabs`:** Navigating between numbered pages of a dataset → use `pagination`

→ Artifact: `docs/machine-readable/artifacts/components/pagination.meta.json` · Storybook: `Navigation/Pagination`

---

### `sidebar`
**What it's for:** A composable, themeable application sidebar for primary navigation with collapsible state, mobile overlay, and keyboard shortcut.

**Use when:** Full application shells where primary navigation needs to be always accessible (dashboards, admin panels, SaaS apps)

**Key rule:** Always wrap in SidebarProvider — it owns collapse state and keyboard shortcut.

**vs `navigation-menu`:** Persistent full-app navigation with grouped sections, always visible or collapsible → use `sidebar`

→ Artifact: `docs/machine-readable/artifacts/components/sidebar.meta.json` · Storybook: `Navigation/Sidebar`

---

### `tabs`
**What it's for:** A navigation component for switching between content sections.

**Use when:** A dashboard page has 'Overview', 'Analytics', 'Reports', and 'Settings' sections — one is visible at a time

**Key rule:** Match tab-list Variant to tab-trigger Type.

**vs `accordion`:** Switching between mutually exclusive sections on the same page → use `tabs`

→ Artifact: `docs/machine-readable/artifacts/components/tabs.meta.json` · Storybook: `Navigation/Tabs`

---

## Layout

### `card`
**What it's for:** A structured container for self-contained, independently meaningful blocks of information. Built on shadcn Card — purely presentational, no Radix primitive. A shell that owns surface, border, radius, and padding; content is freely composed inside.

**Use when:** Dashboard metric panels showing a headline stat, supporting description, and a trend sparkline

**Key rule:** Use cards only when content is independently meaningful — a metric, product, profile, or setting category.

**vs `item`:** A self-contained block of independent information (metric, product, profile) → use `card`

→ Artifact: `docs/machine-readable/artifacts/components/card.meta.json` · Storybook: `Layout/Card`

---

### `item`
**What it's for:** A compact, repeatable list-row component for a single entry in a list, feed, or menu. Six leading Types, three container Variants, and three Sizes. Always use 'item' — never '_item-image' standalone.

**Use when:** Navigation menus where each row lists a destination with an icon and label

**Key rule:** Always use 'item' — never '_item-image' standalone.

**vs `card`:** A single repeatable row in a vertical list → use `item`

→ Artifact: `docs/machine-readable/artifacts/components/item.meta.json` · Storybook: `Layout/Item`

---

### `separator`
**What it's for:** A visual divider between sections of content. One token, two orientations, no states, no children.

**Use when:** Between a page header and its primary content body to signal a transition from navigation context to content

**Key rule:** Use only to communicate logical separation.

**vs `a card border or a raw 1px rectangle`:** An explicit visual line between two content regions on the same surface → use `separator`

→ Artifact: `docs/machine-readable/artifacts/components/separator.meta.json` · Storybook: `Layout/Separator`

---

## Data

### `table`
**What it's for:** A semantic data table. Purely presentational — renders HTML table elements. Three component sets: table-head (header cells), table-cell (47 content types), and _table-row (rows with state). No built-in sorting or filtering — use TanStack Table for that.

**Use when:** Invoice or transaction lists where each row has a fixed set of columns (date, amount, status, actions)

**Key rule:** Always use radius/base on the outer table container FRAME — never radius/lg, radius/md, or hardcoded values.

**vs `item list`:** Many rows of uniform structured data with column headers and sorting → use `table`

→ Artifact: `docs/machine-readable/artifacts/components/table.meta.json` · Storybook: `Data/Table`

---

## How to use this document

1. **Scan before building** — read through all components in the relevant category before writing any JSX
2. **Spot the component** — identify which system component matches your need
3. **Check the artifact** — open the linked `meta.json` for full token bindings and variant matrices  
4. **Verify in Storybook** — navigate to the Storybook path to see the component live before using it
5. **Read full spec if needed** — `docs/component-specs/[Name].md` for behavior, accessibility, and do-nots

**Do not duplicate content from this doc** — if something changes in a component, update `meta.json`. This document regenerates from it.
