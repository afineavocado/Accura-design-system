import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Empty } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Folder, Search, Inbox, Users, Calendar, Bell } from 'lucide-react';

// Source: empty.meta.json — Figma verified 97:34667
// Custom component — no shadcn/Radix base. Purely presentational.
//
// Tokens:
//   Default:    transparent · no border · no radius
//   Outline:    transparent · color/border/default 1px · radius/lg
//   Background: color/background/subtle fill · no border · radius/lg
//   media (icon container): 36×36px · radius/lg
//     Default/Outline: color/background/subtle fill
//     Background:      color/surface/default fill (steps up to stay distinct)
//   title: color/background/default/foreground
//   description: color/text/secondary
//   padding: spacing/component/2xl (32px) · gap: spacing/component/lg (16px)
//
// Cross-check (meta.json Variant values): Default ✓  Outline ✓  Background ✓
// Button visibility patterns: both ✓  primary only ✓  read-only ✓  filter only ✓

const meta = {
  title: 'Feedback/Empty',
  component: Empty,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'background'] },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    variant: 'default',
    title: 'Nothing here yet',
    description: 'Get started by adding your first item.',
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Variant=Default ──────────────────────────────────────────────────────────
// Transparent — inherits parent surface. Use inside cards, sheets, dialogs.

export const Default: Story = {
  render: () => (
    <Empty
      variant="default"
      icon={<Folder className="h-5 w-5 text-[var(--color-background-default-foreground)]" />}
      title="No projects yet"
      description="Get started by creating your first project workspace."
      primaryAction={<Button>Create project</Button>}
      secondaryAction={<Button variant="outline">Import project</Button>}
    />
  ),
};

// ─── Variant=Outline ──────────────────────────────────────────────────────────
// Bordered — for empty table bodies, list panels, dropzone areas.

export const Outline: Story = {
  render: () => (
    <Empty
      variant="outline"
      icon={<Inbox className="h-5 w-5 text-[var(--color-background-default-foreground)]" />}
      title="Your inbox is empty"
      description="You're all caught up. New messages will appear here."
    />
  ),
};

// ─── Variant=Background ───────────────────────────────────────────────────────
// Subtle tinted — for page-level or sidebar empty states.
// Media uses color/surface/default to stay distinct from the subtle bg.

export const Background: Story = {
  render: () => (
    <Empty
      variant="background"
      icon={<Search className="h-5 w-5 text-[var(--color-background-default-foreground)]" />}
      title="No results found"
      description="Try adjusting your search terms or filters."
      secondaryAction={<Button variant="outline">Clear filters</Button>}
    />
  ),
};

// ─── Primary action only ───────────────────────────────────────────────────────

export const PrimaryActionOnly: Story = {
  render: () => (
    <Empty
      variant="default"
      icon={<Folder className="h-5 w-5 text-[var(--color-background-default-foreground)]" />}
      title="No files yet"
      description="Upload your first file to get started."
      primaryAction={<Button>Upload file</Button>}
    />
  ),
};

// ─── Read-only — no action buttons ────────────────────────────────────────────

export const ReadOnly: Story = {
  render: () => (
    <Empty
      variant="outline"
      icon={<Users className="h-5 w-5 text-[var(--color-background-default-foreground)]" />}
      title="No team members"
      description="Ask your admin to invite you to a team to see members here."
    />
  ),
};

// ─── No icon ───────────────────────────────────────────────────────────────────

export const NoIcon: Story = {
  render: () => (
    <Empty
      variant="outline"
      title="No events scheduled"
      description="Add an event to your calendar to get started."
      primaryAction={<Button>Add event</Button>}
    />
  ),
};

// ─── All variants side by side ────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      {(['default', 'outline', 'background'] as const).map(variant => (
        <Empty
          key={variant}
          variant={variant}
          icon={<Bell className="h-5 w-5 text-[var(--color-background-default-foreground)]" />}
          title="No notifications"
          description="You're all caught up."
          primaryAction={<Button size="sm">View settings</Button>}
        />
      ))}
    </div>
  ),
};

// ─── Inside a card ─────────────────────────────────────────────────────────────
// Variant=Default is correct when the card provides the surface.

export const InsideCard: Story = {
  render: () => (
    <div className="w-80 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)]">
      <div className="p-[var(--spacing-component-lg)] border-b border-[var(--color-border-default)]">
        <p className="text-sm font-semibold text-[var(--color-surface-overlay-foreground)]">Team members</p>
      </div>
      <Empty
        variant="default"
        icon={<Users className="h-5 w-5 text-[var(--color-background-default-foreground)]" />}
        title="No members yet"
        description="Invite people to join your team."
        primaryAction={<Button size="sm">Invite member</Button>}
      />
    </div>
  ),
};
