import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

// Source: slider.meta.json — Figma verified 67:9199
//
// Tokens:
//   Track:  color/surface/muted · h-2 (8px) · radius/full
//   Range:  color/brand/primary · h-2 (8px) · radius/full
//   Thumb:  color/background/default fill
//           color/brand/primary border 2px (Default/Disabled)
//           color/ring border 2px OUTSIDE (Focus)
//   Disabled: opacity/disabled on entire component
//
// Cross-check (meta.json):
//   Orientation: Horizontal ✓  Vertical ✓
//   State: Default ✓  Disabled ✓  (Focus = interaction)
//   Range (two thumbs): code feature — story added

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    disabled: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
  args: { orientation: 'horizontal', disabled: false, min: 0, max: 100, step: 1, defaultValue: [40] },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default (controls-driven) ────────────────────────────────────────────────

export const Default: Story = {};

// ─── Horizontal with label ────────────────────────────────────────────────────

export const Horizontal: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-72">
      <div className="flex justify-between">
        <Label className="text-sm font-medium text-[var(--color-background-default-foreground)]">
          Volume
        </Label>
        <span className="text-sm text-[var(--color-text-secondary)]">60%</span>
      </div>
      <Slider defaultValue={[60]} max={100} step={1} />
    </div>
  ),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────
// opacity/disabled (0.6) on entire component — track, range, and thumb all dim.

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-72">
      <Label className="text-sm font-medium text-[var(--color-text-disabled)]">
        Volume (locked)
      </Label>
      <Slider defaultValue={[40]} max={100} step={1} disabled />
    </div>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────
// Track: 8px wide × full height. Thumb centered horizontally.

export const Vertical: Story = {
  render: () => (
    <div className="flex items-start gap-[var(--spacing-component-md)] h-40">
      <Label className="text-sm font-medium text-[var(--color-background-default-foreground)]">
        Gain
      </Label>
      <Slider orientation="vertical" defaultValue={[70]} max={100} step={1} className="h-full" />
    </div>
  ),
};

// ─── Range — two thumbs ───────────────────────────────────────────────────────
// Pass an array of two values to defaultValue. Not a Figma variant — code feature.

export const Range: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-72">
      <div className="flex justify-between">
        <Label className="text-sm font-medium text-[var(--color-background-default-foreground)]">
          Price range
        </Label>
        <span className="text-sm text-[var(--color-text-secondary)]">$20 – $80</span>
      </div>
      <Slider defaultValue={[20, 80]} max={100} step={1} />
    </div>
  ),
};

// ─── With steps ───────────────────────────────────────────────────────────────

export const WithSteps: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-72">
      <div className="flex justify-between">
        <Label className="text-sm font-medium text-[var(--color-background-default-foreground)]">
          AI temperature
        </Label>
        <span className="text-sm text-[var(--color-text-secondary)]">0.5</span>
      </div>
      <Slider defaultValue={[5]} min={0} max={10} step={1} />
    </div>
  ),
};
