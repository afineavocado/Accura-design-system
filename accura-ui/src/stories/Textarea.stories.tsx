import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CircleCheck, Search } from 'lucide-react';

// Source: input.meta.json (Textarea = Type=Textarea in the Figma input component set)
// Spec: Component markdown/Input.md — Token Bindings section
// Note: Figma combines Input + Textarea into one component set.
//   shadcn ships them as two separate components: input.tsx + textarea.tsx.
//   This is the Textarea story — see Input.stories.tsx for the Input story.

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
  },
  args: {
    placeholder: 'Enter text…',
    className: 'w-80',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default — border: color/input/border ─────────────────────────────────────

export const Default: Story = {};

// ─── Filled — typed value, same border as Default ─────────────────────────────

export const Filled: Story = {
  args: {
    defaultValue:
      'This is a longer note that spans multiple lines to show how the textarea handles content.',
  },
};

// ─── Disabled — fill: color/background/muted · border: color/border/disabled ──

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'This field is locked.' },
};

// ─── Invalid — border: color/border/error (via aria-invalid) ──────────────────

export const Invalid: Story = {
  args: {
    defaultValue: 'Too short.',
    'aria-invalid': 'true' as unknown as boolean,
  },
};

// ─── With field (label + textarea + description) ───────────────────────────────
// Correct composition for any form field — Label + Textarea + <p> description.
// gap: spacing/component/xs (4px) between each element.

export const WithField: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <Label htmlFor="notes-story">Notes</Label>
      <Textarea id="notes-story" placeholder="Write a short note…" />
      <p className="text-sm text-[var(--color-text-secondary)]">
        Add context for reviewers.
      </p>
    </div>
  ),
};

// ─── With field — Invalid ──────────────────────────────────────────────────────

export const WithFieldInvalid: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <Label htmlFor="notes-invalid-story">Description</Label>
      <Textarea
        id="notes-invalid-story"
        defaultValue="Too short."
        aria-invalid="true"
      />
      <p className="text-sm text-[var(--color-text-invalid)]">
        Must be at least 20 characters.
      </p>
    </div>
  ),
};

// ─── With field — Disabled ─────────────────────────────────────────────────────

export const WithFieldDisabled: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <Label htmlFor="notes-disabled-story">Notes</Label>
      <Textarea
        id="notes-disabled-story"
        defaultValue="This field is locked."
        disabled
      />
      <p className="text-sm text-[var(--color-text-disabled)]">
        Managed by your organization.
      </p>
    </div>
  ),
};

// ─── With leading icon ────────────────────────────────────────────────────────
// leading-icon slot — top-left, token: color/icon/default.
// Positioned at top (not vertically centered — textarea is multi-line).

export const WithLeadingIcon: Story = {
  render: () => (
    <div className="relative w-80">
      <Search
        className="pointer-events-none absolute left-[var(--spacing-component-md)] top-[var(--spacing-component-sm)] h-4 w-4 text-[var(--color-icon-default)]"
        aria-hidden="true"
      />
      <Textarea className="pl-9" placeholder="Search notes…" />
    </div>
  ),
};

// ─── With trailing icon ───────────────────────────────────────────────────────
// trailing-icon slot — top-right, token: color/icon/default or status variant.

export const WithTrailingIcon: Story = {
  render: () => (
    <div className="relative w-80">
      <Textarea className="pr-9" placeholder="Type your message here." />
      <CircleCheck
        className="pointer-events-none absolute right-[var(--spacing-component-md)] top-[var(--spacing-component-sm)] h-4 w-4 text-[var(--color-icon-success)]"
        aria-hidden="true"
      />
    </div>
  ),
};

// ─── With header ──────────────────────────────────────────────────────────────
// header slot: header-icon + header-label + header-trailing-icon (Header boolean prop).
// In HTML, header sits above <textarea>. Wrapper owns border; textarea strips top border.

export const WithHeader: Story = {
  render: () => (
    // Wrapper owns the surface fill (color/input/bg); header is transparent and lays on top.
    <div
      className="flex w-80 flex-col overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-input-bg)] border border-[var(--color-input-border)] focus-within:border-[var(--color-border-focus)] focus-within:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]"
      style={{ resize: 'vertical', minHeight: '160px' }}
    >
      <div className="flex shrink-0 items-center gap-[var(--spacing-component-sm)] px-[var(--spacing-component-md)] py-[var(--spacing-component-xs)]">
        <Search className="h-4 w-4 shrink-0 text-[var(--color-icon-default)]" aria-hidden="true" />
        <span className="text-sm text-[var(--color-background-default-foreground)]">Notes</span>
      </div>
      <Textarea className="flex-1 resize-none rounded-none border-0 bg-transparent focus-visible:outline-none focus-visible:[box-shadow:none]" placeholder="Type your message here." />
    </div>
  ),
};

// ─── With footer (counter + action button) ────────────────────────────────────
// footer slot: counter text (color/text/secondary) + action primary Button.
// Matches the user's Figma design — "0/280" counter on left, primary button on right.
// In HTML, footer sits below <textarea>. Wrapper owns border; textarea strips bottom border.

export const WithFooter: Story = {
  render: () => {
    const max = 280;
    const [value, setValue] = React.useState('');
    return (
      // Outer wrapper owns border, radius, and resize handle.
      // resize-y puts the handle at the very bottom of the composition (after footer).
      // focus-within applies the focus ring to the whole block when textarea is active.
      <div
        className="flex w-80 flex-col overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-input-bg)] border border-[var(--color-input-border)] focus-within:border-[var(--color-border-focus)] focus-within:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]"
        style={{ resize: 'vertical', minHeight: '160px' }}
      >
        <Textarea
          className="flex-1 resize-none rounded-none border-0 bg-transparent focus-visible:outline-none focus-visible:[box-shadow:none]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your message here."
          maxLength={max}
        />
        <div className="flex shrink-0 items-center justify-between px-[var(--spacing-component-md)] py-[var(--spacing-component-xs)]">
          <span className="text-sm text-[var(--color-text-secondary)]">
            {value.length}/{max}
          </span>
          <Button size="sm">Label</Button>
        </div>
      </div>
    );
  },
};

// ─── With header + footer ─────────────────────────────────────────────────────
// Full composition: header + textarea + footer with counter + primary button.

export const WithHeaderAndFooter: Story = {
  render: () => {
    const max = 280;
    const [value, setValue] = React.useState('');
    return (
      <div
        className="flex w-80 flex-col overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-input-bg)] border border-[var(--color-input-border)] focus-within:border-[var(--color-border-focus)] focus-within:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]"
        style={{ resize: 'vertical', minHeight: '180px' }}
      >
        <div className="flex shrink-0 items-center gap-[var(--spacing-component-sm)] px-[var(--spacing-component-md)] py-[var(--spacing-component-xs)]">
          <Search className="h-4 w-4 shrink-0 text-[var(--color-icon-default)]" aria-hidden="true" />
          <span className="text-sm text-[var(--color-background-default-foreground)]">Notes</span>
        </div>
        <Textarea
          className="flex-1 resize-none rounded-none border-0 bg-transparent focus-visible:outline-none focus-visible:[box-shadow:none]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your message here."
          maxLength={max}
        />
        <div className="flex shrink-0 items-center justify-between px-[var(--spacing-component-md)] py-[var(--spacing-component-xs)]">
          <span className="text-sm text-[var(--color-text-secondary)]">
            {value.length}/{max}
          </span>
          <Button size="sm">Label</Button>
        </div>
      </div>
    );
  },
};

// ─── With character counter ────────────────────────────────────────────────────
// Covers the Figma `counter` slot — shows current / max character count.
// Positioned at bottom-right inside the textarea using absolute positioning.
// Textarea gets extra bottom padding to avoid text overlapping the counter.

export const WithCharacterCount: Story = {
  render: () => {
    const max = 160;
    const [value, setValue] = React.useState('');
    return (
      <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
        <Label htmlFor="bio-counter">Bio</Label>
        <div className="relative">
          <Textarea
            id="bio-counter"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write a short bio…"
            maxLength={max}
            className="pb-8"
          />
          <span className="pointer-events-none absolute bottom-[var(--spacing-component-sm)] right-[var(--spacing-component-md)] text-xs text-[var(--color-text-secondary)]">
            {value.length} / {max}
          </span>
        </div>
      </div>
    );
  },
};

// ─── All states side by side ───────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Textarea placeholder="Default" />
      <Textarea defaultValue="Filled value — shows typed content in default foreground color." />
      <Textarea placeholder="Hover — mouse over to see border change" />
      <Textarea placeholder="Focused — click to see blue border + ring" />
      <Textarea placeholder="Disabled" defaultValue="Disabled value." disabled />
      <Textarea
        defaultValue="Invalid value."
        aria-invalid="true"
      />
    </div>
  ),
};
