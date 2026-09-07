'use client';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Source: checkbox.meta.json — verified against Figma 59:18266 (checkbox-box) + 59:18336 (checkbox-item)
// shadcn ships only Checkbox — no CheckboxItem wrapper. Compose: Checkbox + Label + description p.
//
// Tokens (all 8 states):
//   Unchecked:        border color/input/border
//   Hover:            bg color/background/accent · border color/brand/primary
//   Focus:            ring color/ring 2px OUTSIDE
//   Checked:          bg color/brand/primary · check color/brand/primary/foreground
//   Indeterminate:    bg color/brand/primary · dash color/brand/primary/foreground
//   Disabled:         bg color/background/muted · border color/border/disabled
//   Checked Disabled: same bg/border + check color/background/muted/foreground
//   Invalid:          border color/border/error (via aria-invalid)
//
// Cross-check (meta.json variants):
//   State: Unchecked ✓ Checked ✓ Indeterminate ✓ Disabled ✓ CheckedDisabled ✓ Invalid ✓
//   Description: True ✓ False ✓

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { checked: false, disabled: false },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Unchecked (default) ───────────────────────────────────────────────────────

export const Default: Story = {};

// ─── Checked ──────────────────────────────────────────────────────────────────

export const Checked: Story = {
  args: { checked: true },
};

// ─── Indeterminate ────────────────────────────────────────────────────────────
// Programmatic state — shows dash (Minus icon). Represents partial child selection.
// Same fill as Checked (color/brand/primary) but different indicator.

export const Indeterminate: Story = {
  args: { checked: 'indeterminate' },
};

// ─── Disabled (unchecked) ─────────────────────────────────────────────────────
// fill: color/background/muted · border: color/border/disabled — no opacity approach.

export const Disabled: Story = {
  args: { disabled: true },
};

// ─── Checked Disabled ─────────────────────────────────────────────────────────
// Pre-selected and locked. Check icon uses color/background/muted/foreground.

export const CheckedDisabled: Story = {
  args: { checked: true, disabled: true },
};

// ─── Invalid ──────────────────────────────────────────────────────────────────
// border: color/border/error via aria-invalid="true".

export const Invalid: Story = {
  render: () => (
    <Checkbox aria-invalid="true" />
  ),
};

// ─── Description=False — label only ───────────────────────────────────────────
// H layout, gap spacing/component/sm (8px). min-h-[44px] for touch target.

export const WithLabel: Story = {
  render: () => (
    <div className="flex min-h-[44px] items-center gap-[var(--spacing-component-sm)]">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="cursor-pointer text-sm font-medium text-[var(--color-background-default-foreground)]">
        Accept terms and conditions
      </Label>
    </div>
  ),
};

// ─── Description=True — label + description ───────────────────────────────────
// text-content: V layout, gap spacing/component/xxs (2px).
// Description: color/background/muted/foreground (normal state).

export const WithDescription: Story = {
  render: () => (
    <div className="flex min-h-[44px] items-start gap-[var(--spacing-component-sm)]">
      <Checkbox id="marketing" className="mt-0.5 shrink-0" />
      <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
        <Label htmlFor="marketing" className="cursor-pointer text-sm font-medium text-[var(--color-background-default-foreground)]">
          Marketing emails
        </Label>
        <p className="text-sm text-[var(--color-background-muted-foreground)]">
          Receive occasional product updates and promotions.
        </p>
      </div>
    </div>
  ),
};

// ─── Disabled with description ────────────────────────────────────────────────
// Both label and description: color/text/disabled.

export const DisabledWithDescription: Story = {
  render: () => (
    <div className="flex min-h-[44px] items-start gap-[var(--spacing-component-sm)]">
      <Checkbox id="locked" disabled className="mt-0.5 shrink-0" />
      <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
        <Label htmlFor="locked" className="text-sm font-medium text-[var(--color-text-disabled)]">
          Required setting
        </Label>
        <p className="text-sm text-[var(--color-text-disabled)]">
          This option is managed by your organization.
        </p>
      </div>
    </div>
  ),
};

// ─── Invalid with description ─────────────────────────────────────────────────
// border: color/border/error. Label + description: color/text/invalid.

export const InvalidWithDescription: Story = {
  render: () => (
    <div className="flex min-h-[44px] items-start gap-[var(--spacing-component-sm)]">
      <Checkbox id="consent" aria-invalid="true" className="mt-0.5 shrink-0" />
      <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
        <Label htmlFor="consent" className="text-sm font-medium text-[var(--color-text-invalid)]">
          Consent required
        </Label>
        <p className="text-sm text-[var(--color-text-invalid)]">
          You must accept before continuing.
        </p>
      </div>
    </div>
  ),
};

// ─── Group of checkboxes ──────────────────────────────────────────────────────
// Multiple independent checkboxes — notification preferences pattern.

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)]">
      {[
        { id: 'email', label: 'Email updates', description: 'Receive product news and announcements.' },
        { id: 'sms', label: 'SMS alerts', description: 'Get text alerts for important events.' },
        { id: 'digest', label: 'Weekly digest', description: 'A summary every Monday morning.' },
      ].map(({ id, label, description }) => (
        <div key={id} className="flex min-h-[44px] items-start gap-[var(--spacing-component-sm)]">
          <Checkbox id={id} className="mt-0.5 shrink-0" />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <Label htmlFor={id} className="cursor-pointer text-sm font-medium text-[var(--color-background-default-foreground)]">
              {label}
            </Label>
            <p className="text-sm text-[var(--color-background-muted-foreground)]">{description}</p>
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── All states side by side ───────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {[
        { label: 'Unchecked', props: {} },
        { label: 'Checked', props: { defaultChecked: true } },
        { label: 'Indeterminate', props: { checked: 'indeterminate' as const } },
        { label: 'Disabled', props: { disabled: true } },
        { label: 'Chk Disabled', props: { checked: true, disabled: true } },
        { label: 'Invalid', props: { 'aria-invalid': 'true' as const } },
      ].map(({ label, props }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <Checkbox {...props} />
          <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
        </div>
      ))}
    </div>
  ),
};
