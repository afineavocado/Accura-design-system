import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, Activity, Settings } from 'lucide-react';

// Source: tabs.meta.json (category, variants, tokens)
// Spec: Component markdown/Tabs.md — verified against Figma 59:17766 / 59:17793
//
// Two visual types — pass variant to both TabsList and TabsTrigger:
//   variant="default" — pill/background style (primary nav)
//   variant="line"    — flat underline style (secondary/embedded nav)
//
// Cross-check (meta.json):
//   Type: Default ✓  Line ✓
//   Orientation: Horizontal ✓  Vertical ✓
//   State: Active ✓  Disabled ✓  (Hover is interaction, not a separate story)

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default — Type=Default, Horizontal ───────────────────────────────────────
// TabsList: color/surface/raised · radius/lg · 2px padding + gap.
// Trigger Active: color/surface/default + shadows/2xs.
// Trigger Default: transparent · text color/text/secondary.
// Trigger Hover: color/surface/accent · text color/text/secondary.

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Overview content.</p>
      </TabsContent>
      <TabsContent value="activity" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Activity content.</p>
      </TabsContent>
      <TabsContent value="settings" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Settings content.</p>
      </TabsContent>
    </Tabs>
  ),
};

// ─── Line — Type=Line, Horizontal ─────────────────────────────────────────────
// TabsList: transparent · border-b color/border/default · no padding.
// Trigger: transparent at all states. Active: 2px brand/primary bottom indicator.
// No hover state — Type=Line has no hover (Figma confirmed: no Hover variant exists).

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="details" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="details" variant="line">Details</TabsTrigger>
        <TabsTrigger value="history" variant="line">History</TabsTrigger>
        <TabsTrigger value="comments" variant="line">Comments</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Details content.</p>
      </TabsContent>
      <TabsContent value="history" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">History content.</p>
      </TabsContent>
      <TabsContent value="comments" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Comments content.</p>
      </TabsContent>
    </Tabs>
  ),
};

// ─── With leading icons ───────────────────────────────────────────────────────
// Paired icon rule (Rule A): the icon tracks the label's color per state.
// Lucide icons render stroke="currentColor", so they inherit the trigger's text
// color automatically — secondary at rest, surface/default/foreground when active,
// text/disabled when disabled. No icon color class needed. Size 14px (size-3.5)
// matches the Figma spec; gap is owned by the component (6px Default / 4px Line).

export const WithIcon: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview"><LayoutGrid className="size-3.5" aria-hidden="true" />Overview</TabsTrigger>
        <TabsTrigger value="activity"><Activity className="size-3.5" aria-hidden="true" />Activity</TabsTrigger>
        <TabsTrigger value="settings"><Settings className="size-3.5" aria-hidden="true" />Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Overview content.</p>
      </TabsContent>
      <TabsContent value="activity" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Activity content.</p>
      </TabsContent>
      <TabsContent value="settings" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Settings content.</p>
      </TabsContent>
    </Tabs>
  ),
};

// ─── With leading icons — Line ────────────────────────────────────────────────

export const LineWithIcon: Story = {
  render: () => (
    <Tabs defaultValue="details" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="details" variant="line"><LayoutGrid className="size-3.5" aria-hidden="true" />Details</TabsTrigger>
        <TabsTrigger value="history" variant="line"><Activity className="size-3.5" aria-hidden="true" />History</TabsTrigger>
        <TabsTrigger value="comments" variant="line"><Settings className="size-3.5" aria-hidden="true" />Comments</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Details content.</p>
      </TabsContent>
      <TabsContent value="history" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">History content.</p>
      </TabsContent>
      <TabsContent value="comments" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Comments content.</p>
      </TabsContent>
    </Tabs>
  ),
};

// ─── Vertical — Type=Default, Vertical ────────────────────────────────────────
// orientation="vertical" on Tabs root — Radix handles arrow key axis (Up/Down).
// TabsList stacks triggers top-to-bottom. Content sits to the right.

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="account" orientation="vertical" className="flex gap-4 w-[480px]">
      <TabsList className="flex-col h-auto">
        <TabsTrigger value="account" className="w-full justify-start">Account</TabsTrigger>
        <TabsTrigger value="password" className="w-full justify-start">Password</TabsTrigger>
        <TabsTrigger value="notifications" className="w-full justify-start">Notifications</TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="account" className="mt-0">
          <p className="text-sm text-[var(--color-text-secondary)]">Manage your account details.</p>
        </TabsContent>
        <TabsContent value="password" className="mt-0">
          <p className="text-sm text-[var(--color-text-secondary)]">Change your password.</p>
        </TabsContent>
        <TabsContent value="notifications" className="mt-0">
          <p className="text-sm text-[var(--color-text-secondary)]">Configure notification preferences.</p>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

// ─── With disabled tab ────────────────────────────────────────────────────────
// State=Disabled: text color/text/disabled · pointer-events-none · no fill change.
// Disabled tabs remain visible — use sparingly, never disable all tabs.

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="general" className="w-96">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">General settings.</p>
      </TabsContent>
      <TabsContent value="team" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Team settings.</p>
      </TabsContent>
    </Tabs>
  ),
};

// ─── Line with disabled tab ───────────────────────────────────────────────────

export const LineWithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="summary" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="summary" variant="line">Summary</TabsTrigger>
        <TabsTrigger value="analytics" variant="line" disabled>Analytics</TabsTrigger>
        <TabsTrigger value="reports" variant="line">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="summary" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Summary content.</p>
      </TabsContent>
      <TabsContent value="reports" className="p-2">
        <p className="text-sm text-[var(--color-text-secondary)]">Reports content.</p>
      </TabsContent>
    </Tabs>
  ),
};

// ─── Both types side by side ──────────────────────────────────────────────────

export const BothTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      <div>
        <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Default (pill)</p>
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Overview</TabsTrigger>
            <TabsTrigger value="b">Activity</TabsTrigger>
            <TabsTrigger value="c">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Line (underline)</p>
        <Tabs defaultValue="a">
          <TabsList variant="line">
            <TabsTrigger value="a" variant="line">Overview</TabsTrigger>
            <TabsTrigger value="b" variant="line">Activity</TabsTrigger>
            <TabsTrigger value="c" variant="line">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  ),
};
