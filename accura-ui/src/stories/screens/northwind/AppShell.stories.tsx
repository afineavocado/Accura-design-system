import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NorthwindShell } from './Shell';

// ─── Northwind — App Shell ────────────────────────────────────────────────────
// The reusable app frame (sidebar + topbar) with an empty content area.
// Real screens render their content inside <NorthwindShell> — see Dashboard.

const meta = {
  title: 'Screens/Northwind/App Shell',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NorthwindShell active="Dashboard" title="Dashboard">
      <div className="flex h-full items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-default)] text-sm text-[var(--color-text-secondary)]">
        Content area — Dashboard / Orders / Customers screens render here
      </div>
    </NorthwindShell>
  ),
};
