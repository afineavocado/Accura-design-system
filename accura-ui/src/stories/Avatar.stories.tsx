import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from '@/components/ui/avatar';

// Source: avatar.meta.json (category, variants, argTypes, defaults)
// Patterns: avatar.examples.tsx

const meta = {
  title: 'Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Avatar dimensions — sm=32px / default=40px / lg=56px',
    },
    badge: {
      control: 'select',
      options: [undefined, 'online', 'offline'],
      description: 'Presence indicator — online (green dot) / offline (gray dot) / none',
    },
    src: {
      control: 'text',
      description: 'Photo URL — shows image; falls back to initials on load error',
    },
    fallback: {
      control: 'text',
      description: '1–2 initials shown when no image is available',
    },
    name: {
      control: 'text',
      description: 'Full name — used as accessible alt/aria-label',
    },
    badgeLabel: {
      control: 'text',
      description: 'Accessible label for the indicator dot (e.g. "Online")',
    },
  },
  args: {
    size: 'sm',
    name: 'Ada Lovelace',
    fallback: 'AL',
    badge: undefined,
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Type stories ─────────────────────────────────────────────────────────────

export const WithImage: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    name: 'shadcn',
  },
};

export const Fallback: Story = {
  args: {
    fallback: 'GH',
    name: 'Grace Hopper',
  },
};

// ─── Size stories ─────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm"      fallback="SM" name="Small avatar" />
      <Avatar size="default" fallback="MD" name="Default avatar" />
      <Avatar size="lg"      fallback="LG" name="Large avatar" />
    </div>
  ),
};

export const SizesWithImage: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm"      src="https://github.com/shadcn.png" name="Small" />
      <Avatar size="default" src="https://github.com/shadcn.png" name="Default" />
      <Avatar size="lg"      src="https://github.com/shadcn.png" name="Large" />
    </div>
  ),
};

// ─── Badge / indicator stories ────────────────────────────────────────────────

export const Online: Story = {
  args: {
    fallback: 'DV',
    name: 'Dorothy Vaughan',
    badge: 'online',
    badgeLabel: 'Online',
  },
};

export const Offline: Story = {
  args: {
    fallback: 'MJ',
    name: 'Mary Jackson',
    badge: 'offline',
    badgeLabel: 'Offline',
  },
};

export const IndicatorSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Avatar size="sm"      fallback="SM" name="Small" badge="online"  badgeLabel="Online" />
        <span className="text-xs text-[var(--color-surface-muted-foreground)]">SM · 8px dot</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="default" fallback="MD" name="Default" badge="online" badgeLabel="Online" />
        <span className="text-xs text-[var(--color-surface-muted-foreground)]">Default · 12px dot</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg"      fallback="LG" name="Large" badge="online"  badgeLabel="Online" />
        <span className="text-xs text-[var(--color-surface-muted-foreground)]">LG · 12px dot</span>
      </div>
    </div>
  ),
};

export const OnlineVsOffline: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="default" fallback="ON" name="Online user"  badge="online"  badgeLabel="Online" />
      <Avatar size="default" fallback="OF" name="Offline user" badge="offline" badgeLabel="Offline" />
    </div>
  ),
};
