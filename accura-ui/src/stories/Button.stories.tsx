import { Ellipsis, Plus, Trash2 } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Source: button.meta.json (category, variants, argTypes, defaults)
// Patterns: button.examples.tsx (leadingIcon, iconOnly, destructiveConfirmation)

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'link', 'destructive', 'destructiveSecondary'],
      description: 'Visual style — maps to Figma Type property',
    },
    size: {
      control: 'select',
      // meta.json > variants.Size.reactValues
      options: ['sm', 'default', 'lg', 'icon-sm', 'icon', 'icon-lg'],
      description: 'Size — sm / default / lg for text buttons; icon-sm / icon / icon-lg for icon-only',
    },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    size: 'default',
    children: 'Save changes',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Variant stories ---

export const Default: Story = {};

export const DestructiveSecondary: Story = {
  args: { variant: 'destructiveSecondary', children: 'Reject' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Cancel' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Back' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Dismiss' },
};

export const Link: Story = {
  args: { variant: 'link', children: 'Go to dashboard' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete project' },
};

// Low-emphasis destructive — for a destructive action that shares the footer with
// a primary one that must stay dominant.
export const DestructiveSecondary: Story = {
  args: { variant: 'destructiveSecondary', children: 'Reject' },
};

// The pairing this variant exists for. Solid red beside solid green measures
// 1.20:1 — the two fills are near-identical in lightness, so the meaning rides
// entirely on hue and collapses for red-green colour blindness (1 in 12 men).
export const RejectVersusApprove: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold text-[var(--color-background-default-foreground)]">
          Correct — one primary, one low-emphasis destructive
        </p>
        <div className="flex justify-end gap-[var(--spacing-component-sm)]">
          <Button variant="destructiveSecondary" size="sm">Reject</Button>
          <Button size="sm">Approve &amp; Sign</Button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-[var(--color-text-secondary)]">
          Avoid — two solid fills compete, and neither reads as the default path
        </p>
        <div className="flex justify-end gap-[var(--spacing-component-sm)]">
          <Button variant="destructive" size="sm">Reject</Button>
          <Button size="sm">Approve &amp; Sign</Button>
        </div>
      </div>
    </div>
  ),
};

// --- Size stories ---

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
};

export const Large: Story = {
  args: { size: 'lg', children: 'Large' },
};

// --- State stories ---

export const Disabled: Story = {
  args: { disabled: true },
};

// --- Pattern stories (from button.examples.tsx) ---

// Leading icon — PlusIcon before label
export const WithLeadingIcon: Story = {
  render: () => (
    <Button>
      <Plus aria-hidden="true" />
      Add member
    </Button>
  ),
};

// Icon-only — always needs a tooltip (accessibility rule)
export const IconOnly: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" aria-label="More actions">
            <Ellipsis aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>More actions</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

// Destructive + confirmation — irreversible actions require AlertDialog
export const DestructiveWithConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 aria-hidden="true" />
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the project and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete project</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
