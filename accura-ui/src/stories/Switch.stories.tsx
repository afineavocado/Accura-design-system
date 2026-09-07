'use client';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Source: switch.meta.json — verified against Figma 67:88 (switch) + 270:110 (switch-item)
// shadcn provides only the raw Switch toggle. switch-item patterns are composed inline.
//
// Cross-check (meta.json variants):
//   Size: Default ✓  Sm ✓
//   Checked: True ✓  False ✓
//   State: Default ✓  Disabled ✓  (Focus is interaction — shown via keyboard)
//   ItemType: Basic ✓  Description ✓  Choice Card ✓
//   ItemState: Default ✓  Disabled ✓  Invalid ✓

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['default', 'sm'] },
  },
  args: {
    checked: false,
    disabled: false,
    size: 'default',
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Raw switch — Default ──────────────────────────────────────────────────────
// Unchecked: track = color/border/default · Checked: track = color/brand/primary
// Thumb: always color/background/default · no shadow

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

// ─── Size=Sm ───────────────────────────────────────────────────────────────────
// Track: 28×16px · Thumb: 12×12px · translate-x-3 (12px) on checked

export const Small: Story = {
  args: { size: 'sm' },
};

export const SmallChecked: Story = {
  args: { size: 'sm', checked: true },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────
// opacity/disabled (0.6) on entire component — no fill change

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

// ─── switch-item — Type=Basic ─────────────────────────────────────────────────
// H layout, gap spacing/component/sm (8px). min-h-[44px] for touch target.
// Label: color/background/default/foreground.

export const ItemBasic: Story = {
  render: () => (
    <div className="flex min-h-[44px] w-80 items-center justify-between gap-[var(--spacing-component-sm)]">
      <Label htmlFor="notifications" className="cursor-pointer">
        Enable notifications
      </Label>
      <Switch id="notifications" />
    </div>
  ),
};

// ─── switch-item — Type=Description ───────────────────────────────────────────
// H layout: switch (right) + content (left: label + description, V layout).
// Description: color/background/muted/foreground.

export const ItemDescription: Story = {
  render: () => (
    <div className="flex min-h-[44px] w-80 items-center justify-between gap-[var(--spacing-component-sm)]">
      <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
        <Label htmlFor="sync" className="cursor-pointer">
          Share across devices
        </Label>
        <p className="text-sm text-[var(--color-background-muted-foreground)]">
          Sync your focus session to all signed-in devices.
        </p>
      </div>
      <Switch id="sync" />
    </div>
  ),
};

// ─── switch-item — Type=Choice Card ───────────────────────────────────────────
// Card wrapper: border/default 1px · radius/lg · padding spacing/component/lg.
// Focus: border changes to color/border/focus (no outer ring — border is always visible).

export const ItemChoiceCard: Story = {
  render: () => (
    <div className="w-80 flex items-center justify-between gap-[var(--spacing-component-sm)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] p-[var(--spacing-component-lg)]">
      <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
        <Label htmlFor="advanced" className="cursor-pointer">
          Advanced mode
        </Label>
        <p className="text-sm text-[var(--color-background-muted-foreground)]">
          Show advanced configuration controls.
        </p>
      </div>
      <Switch id="advanced" />
    </div>
  ),
};

// ─── switch-item — State=Disabled ─────────────────────────────────────────────
// Label + description: color/text/disabled. Switch at opacity/disabled.

export const ItemDisabled: Story = {
  render: () => (
    <div className="flex min-h-[44px] w-80 items-center justify-between gap-[var(--spacing-component-sm)]">
      <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
        <Label htmlFor="locked" className="text-[var(--color-text-disabled)]">
          Locked setting
        </Label>
        <p className="text-sm text-[var(--color-text-disabled)]">
          Managed by your organization.
        </p>
      </div>
      <Switch id="locked" disabled />
    </div>
  ),
};

// ─── switch-item — State=Invalid ──────────────────────────────────────────────
// Label: color/text/invalid. Description: color/text/secondary. Switch indicator unchanged.

export const ItemInvalid: Story = {
  render: () => (
    <div className="flex min-h-[44px] w-80 items-center justify-between gap-[var(--spacing-component-sm)]">
      <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
        <Label htmlFor="terms" className="text-[var(--color-text-invalid)]">
          Accept terms
        </Label>
        <p className="text-sm text-[var(--color-text-secondary)]">
          You must accept the terms to continue.
        </p>
      </div>
      <Switch id="terms" />
    </div>
  ),
};

// ─── Choice Card — State=Invalid ──────────────────────────────────────────────
// Card border: color/border/error (1px). Label: color/text/invalid. Description: color/text/secondary.

export const ItemChoiceCardInvalid: Story = {
  render: () => (
    <div className="w-80 flex items-center justify-between gap-[var(--spacing-component-sm)] rounded-[var(--radius-lg)] border border-[var(--color-border-error)] p-[var(--spacing-component-lg)]">
      <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
        <Label htmlFor="terms-card" className="text-[var(--color-text-invalid)]">
          Accept terms
        </Label>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Required before continuing.
        </p>
      </div>
      <Switch id="terms-card" />
    </div>
  ),
};

// ─── All sizes side by side ────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-[var(--color-text-secondary)]">Default</p>
        <div className="flex items-center gap-3">
          <Switch aria-label="Default unchecked" />
          <Switch defaultChecked aria-label="Default checked" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-[var(--color-text-secondary)]">Sm</p>
        <div className="flex items-center gap-3">
          <Switch size="sm" aria-label="Small unchecked" />
          <Switch size="sm" defaultChecked aria-label="Small checked" />
        </div>
      </div>
    </div>
  ),
};
