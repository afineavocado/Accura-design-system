import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CircleAlert, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Source: alert.meta.json (category, variants, tokens)
// Patterns: alert.examples.tsx
// Note: AlertDialog is a separate component — alert-dialog.stories.tsx (not yet built).

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning'],
      description: 'Visual severity — default (neutral), destructive (error), warning (caution)',
    },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default variant ───────────────────────────────────────────────────────────
// Fill: color/background/default · Border: color/border/default
// Title: color/background/default/foreground · Description: color/background/muted/foreground

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="w-[400px]">
      <AlertTitle>System updated</AlertTitle>
      <AlertDescription>Your changes were saved successfully.</AlertDescription>
    </Alert>
  ),
};

// ─── Destructive variant ──────────────────────────────────────────────────────
// Fill: color/background/default · Border: color/border/error
// Title: color/text/invalid · Description: color/text/secondary · Icon: color/icon/danger

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertTitle>Unable to save</AlertTitle>
      <AlertDescription>Check the required fields and try again.</AlertDescription>
    </Alert>
  ),
};

// ─── Warning variant ──────────────────────────────────────────────────────────
// Fill: color/yellow/50 · Border: color/yellow/200
// Title: color/yellow/900 · Description: color/yellow/800 · Icon: color/icon/warning
// NOTE: Warning uses primitive yellow tokens — intentional design decision.

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="w-[400px]">
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>Free up space before uploading more files.</AlertDescription>
    </Alert>
  ),
};

// ─── With icon (nested layout) ────────────────────────────────────────────────
// Nested layout: flex-row wrapper (gap spacing/component/md) > icon + content div
// Content div: flex-col, gap spacing/component/xxs (2px) between title and description
// Icon color is set by the parent variant via [&_svg] selector

export const DefaultWithIcon: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <div className="flex flex-row items-start gap-[var(--spacing-component-md)]">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
          <AlertTitle>New integration available</AlertTitle>
          <AlertDescription>Connect your account to unlock additional features.</AlertDescription>
        </div>
      </div>
    </Alert>
  ),
};

export const DestructiveWithIcon: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <div className="flex flex-row items-start gap-[var(--spacing-component-md)]">
        <CircleAlert className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>Check your card details and try again.</AlertDescription>
        </div>
      </div>
    </Alert>
  ),
};

export const WarningWithIcon: Story = {
  render: () => (
    <Alert variant="warning" className="w-[400px]">
      <div className="flex flex-row items-start gap-[var(--spacing-component-md)]">
        <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
          <AlertTitle>API key expires in 7 days</AlertTitle>
          <AlertDescription>Rotate your key before it expires to avoid service interruption.</AlertDescription>
        </div>
      </div>
    </Alert>
  ),
};

// ─── With action ──────────────────────────────────────────────────────────────
// Action button sits below content in the flex-col content stack.
// Button is self-contained — alert must not override any button fills.

export const WithAction: Story = {
  render: () => (
    <Alert variant="warning" className="w-[400px]">
      <div className="flex flex-row items-start gap-[var(--spacing-component-md)]">
        <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <AlertTitle>Storage almost full</AlertTitle>
            <AlertDescription>You have used 90% of your storage quota.</AlertDescription>
          </div>
          <Button size="sm" className="self-start">Manage storage</Button>
        </div>
      </div>
    </Alert>
  ),
};

// ─── All variants side by side ────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <Alert>
        <div className="flex flex-row items-start gap-[var(--spacing-component-md)]">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Your changes were saved successfully.</AlertDescription>
          </div>
        </div>
      </Alert>
      <Alert variant="destructive">
        <div className="flex flex-row items-start gap-[var(--spacing-component-md)]">
          <CircleAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Payment failed — check your card details.</AlertDescription>
          </div>
        </div>
      </Alert>
      <Alert variant="warning">
        <div className="flex flex-row items-start gap-[var(--spacing-component-md)]">
          <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Your API key expires in 7 days.</AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  ),
};
