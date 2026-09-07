import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Archive, Share2, Trash2 } from 'lucide-react';

// Source: tooltip.meta.json — Figma 74:1682 (bubble) + 74:1699 (tooltip)
//
// Tokens:
//   tooltip/bg → --tooltip-bg: #18181b — always dark, fixed regardless of theme
//   tooltip/fg → --tooltip-fg: #ffffff — always white, fixed regardless of theme
//   No border, no shadow. Padding: spacing/component/md (12px) × xs-plus (6px).
//   Radius: radius/md. Text: label/sm (text-xs font-medium leading-none).
//
// TooltipProvider: delayDuration=700ms (Radix default), skipDelayDuration=300ms.
// Place once at app root — shown in decorator here.
//
// Cross-check (meta.json Side variants):
//   Top ✓  Bottom ✓  Left ✓  Right ✓
// Composition slots:
//   Icon-only button ✓  Disabled-in-span ✓  Keyboard shortcut ✓

const meta = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center justify-center p-20">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Side=Top (default) ────────────────────────────────────────────────────────

export const Top: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Side=Top (default)</Button>
      </TooltipTrigger>
      <TooltipContent side="top">Supplementary context</TooltipContent>
    </Tooltip>
  ),
};

// ─── Side=Bottom ──────────────────────────────────────────────────────────────

export const Bottom: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Side=Bottom</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">Appears below the trigger</TooltipContent>
    </Tooltip>
  ),
};

// ─── Side=Left ────────────────────────────────────────────────────────────────

export const Left: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Side=Left</Button>
      </TooltipTrigger>
      <TooltipContent side="left">Appears to the left</TooltipContent>
    </Tooltip>
  ),
};

// ─── Side=Right ───────────────────────────────────────────────────────────────

export const Right: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Side=Right</Button>
      </TooltipTrigger>
      <TooltipContent side="right">Appears to the right</TooltipContent>
    </Tooltip>
  ),
};

// ─── Icon-only buttons ────────────────────────────────────────────────────────
// Primary use case — labels icon-only buttons for keyboard and mouse users.
// Tooltip provides the accessible name that the visible UI omits.

export const IconButtons: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--spacing-component-sm)]">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Archive">
            <Archive className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Archive</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive" size="icon" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    </div>
  ),
};

// ─── Keyboard shortcut hint ────────────────────────────────────────────────────

export const ShortcutHint: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--spacing-component-sm)]">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bold</Button>
        </TooltipTrigger>
        <TooltipContent>Bold — ⌘B</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Save</Button>
        </TooltipTrigger>
        <TooltipContent>Save — ⌘S</TooltipContent>
      </Tooltip>
    </div>
  ),
};

// ─── Disabled button in span ───────────────────────────────────────────────────
// Disabled elements don't fire mouse events — wrap in <span tabIndex={0}>.
// Tooltip explains what's required to enable the action.

export const DisabledButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <Button disabled className="pointer-events-none">
            Publish
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        Complete all required fields to publish
      </TooltipContent>
    </Tooltip>
  ),
};

// ─── All sides side by side ────────────────────────────────────────────────────

export const AllSides: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--spacing-component-xl)]">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="capitalize">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Side={side.charAt(0).toUpperCase() + side.slice(1)}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
