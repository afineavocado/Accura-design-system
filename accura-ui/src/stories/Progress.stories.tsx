import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Progress } from '@/components/ui/progress';

// Source: progress.meta.json — Figma verified 110:8283
//
// Tokens:
//   Track: color/background/muted · radius/full
//   Fill (Loading/Indeterminate): color/brand/primary
//   Fill (Complete, value=100):   color/status/success  ← Figma confirmed, spec corrected
//
// Sizes: sm=4px · md=8px (default) · lg=12px
// State is driven by value: 0–99=Loading · 100=Complete · null=Indeterminate
//
// Cross-check (meta.json):
//   State: Loading ✓  Complete ✓  Indeterminate ✓
//   Size: SM ✓  MD ✓  LG ✓

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { value: 40, size: 'md' },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── State=Loading (controls-driven) ──────────────────────────────────────────

export const Default: Story = {};

// ─── State=Loading — 60% ──────────────────────────────────────────────────────

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <div className="flex justify-between">
        <span className="text-sm text-[var(--color-background-default-foreground)]">Uploading file…</span>
        <span className="text-sm text-[var(--color-text-secondary)]">60%</span>
      </div>
      <Progress value={60} />
    </div>
  ),
};

// ─── State=Complete (value=100) ────────────────────────────────────────────────
// Indicator: color/status/success (confirmed Figma — spec corrected from brand/primary).

export const Complete: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <div className="flex justify-between">
        <span className="text-sm text-[var(--color-background-default-foreground)]">Upload complete</span>
        <span className="text-sm text-[var(--color-text-secondary)]">100%</span>
      </div>
      <Progress value={100} />
    </div>
  ),
};

// ─── State=Indeterminate (value=null) ─────────────────────────────────────────
// Radix sets data-state="indeterminate". CSS animation needed for the sweep.
// See Progress.md for the keyframe pattern.

export const Indeterminate: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <span className="text-sm text-[var(--color-background-default-foreground)]">Processing files…</span>
      <Progress value={null} />
    </div>
  ),
};

// ─── All three sizes ───────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] w-80">
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-xs text-[var(--color-text-secondary)]">SM — 4px</span>
        <Progress value={60} size="sm" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-xs text-[var(--color-text-secondary)]">MD — 8px (default)</span>
        <Progress value={60} size="md" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-xs text-[var(--color-text-secondary)]">LG — 12px</span>
        <Progress value={60} size="lg" />
      </div>
    </div>
  ),
};

// ─── Step tracker (custom max) ────────────────────────────────────────────────

export const StepTracker: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
      <div className="flex justify-between">
        <span className="text-sm text-[var(--color-background-default-foreground)]">Step 2 of 5</span>
        <span className="text-sm text-[var(--color-text-secondary)]">40%</span>
      </div>
      <Progress value={2} max={5} size="lg" />
    </div>
  ),
};

// ─── Animated — value advances to completion ──────────────────────────────────

export const Animated: Story = {
  render: () => {
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
      const timer = setInterval(() => {
        setValue(prev => {
          if (prev >= 100) { clearInterval(timer); return 100; }
          return prev + 5;
        });
      }, 150);
      return () => clearInterval(timer);
    }, []);
    return (
      <div className="flex flex-col gap-[var(--spacing-component-xs)] w-80">
        <div className="flex justify-between">
          <span className="text-sm text-[var(--color-background-default-foreground)]">
            {value === 100 ? 'Upload complete' : 'Uploading…'}
          </span>
          <span className="text-sm text-[var(--color-text-secondary)]">{value}%</span>
        </div>
        <Progress value={value} />
      </div>
    );
  },
};
