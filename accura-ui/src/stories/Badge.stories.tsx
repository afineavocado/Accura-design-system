import { Check, Clock, Info, X } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from '@/components/ui/badge';

// Source: badge.meta.json (category, variants, argTypes, defaults)
// Patterns: badge.examples.tsx

const meta = {
  title: 'Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'dashed', 'success', 'error', 'warning', 'blue', 'online', 'offline', 'notification'],
      description: 'Visual style — maps to Figma Variant property',
    },
    shape: {
      control: 'select',
      options: ['default', 'pill'],
      description: 'Geometry — Default (rounded rect, radius/md) or Pill (fully rounded)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size — sm (16px) / md (20px) / lg (24px)',
    },
  },
  args: {
    // Defaults match CVA: variant=default, shape=default, size=sm
    variant: 'default',
    shape: 'default',
    size: 'sm',
    children: 'New Feature',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Variant stories ---

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Draft' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Blocked' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Metadata' },
};

export const Success: Story = {
  args: { variant: 'success', shape: 'pill', children: 'Active' },
};

export const Warning: Story = {
  args: { variant: 'warning', shape: 'pill', children: 'Expiring Soon' },
};

export const Error: Story = {
  args: { variant: 'error', shape: 'pill', children: 'Invalid' },
};

export const Blue: Story = {
  args: { variant: 'blue', shape: 'pill', children: 'In Progress' },
};

export const Online: Story = {
  args: { variant: 'online', shape: 'pill', children: 'Online' },
};

export const Offline: Story = {
  args: { variant: 'offline', shape: 'pill', children: 'Offline' },
};

export const Notification: Story = {
  args: { variant: 'notification', shape: 'pill', size: 'sm', children: '3' },
};

// --- Shape stories ---

export const Dashed: Story = {
  args: { variant: 'dashed', children: 'Pending' },
};

// --- Size stories ---

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge size="sm">Small 16px</Badge>
      <Badge size="md">Medium 20px</Badge>
      <Badge size="lg">Large 24px</Badge>
    </div>
  ),
};

// --- Icon stories (from badge.examples.tsx) ---

export const WithLeadingIcon: Story = {
  render: () => (
    <Badge variant="success" shape="pill">
      <Check aria-hidden="true" />
      Connected
    </Badge>
  ),
};

export const WithTrailingIcon: Story = {
  render: () => (
    <Badge variant="warning" shape="pill">
      Review
      <Clock aria-hidden="true" />
    </Badge>
  ),
};

export const InfoWithIcon: Story = {
  render: () => (
    <Badge variant="blue" shape="pill">
      <Info aria-hidden="true" />
      Info
    </Badge>
  ),
};

export const FailedWithIcon: Story = {
  render: () => (
    <Badge variant="error" shape="pill">
      <X aria-hidden="true" />
      Failed
    </Badge>
  ),
};
