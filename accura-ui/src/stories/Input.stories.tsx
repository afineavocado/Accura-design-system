import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CircleCheck, Search } from 'lucide-react';

// Source: input.meta.json (category, variants, tokens)
// Patterns: input.examples.tsx
// Note: shadcn has no InputField wrapper — the input-field pattern is composed:
//   Label + Input + <p> description in a flex-col gap-[spacing/component/xs] div.

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'url', 'tel'],
      description: 'HTML input type',
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    type: 'text',
    placeholder: 'Enter text…',
    className: 'w-[280px]',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default — border: color/input/border ─────────────────────────────────────

export const Default: Story = {};

// ─── Filled — typed value, same border as Default ─────────────────────────────

export const Filled: Story = {
  args: { defaultValue: 'Agentic Design System', placeholder: 'Project name' },
};

// ─── Disabled — fill: color/background/muted · border: color/border/disabled ──

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'agentic.design', placeholder: 'Domain' },
};

// ─── Invalid — border: color/border/error (via aria-invalid) ──────────────────

export const Invalid: Story = {
  args: {
    type: 'email',
    defaultValue: 'not-an-email',
    placeholder: 'name@example.com',
    'aria-invalid': 'true' as unknown as boolean,
  },
};

// ─── Email / Password types ────────────────────────────────────────────────────

export const Email: Story = {
  args: { type: 'email', placeholder: 'name@example.com' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: '••••••••' },
};

// ─── Input-field composition — label + input + description ────────────────────
// Correct pattern for any form field — wraps Label, Input, and description <p>.
// gap: spacing/component/xs (4px) between label, input, and description.

export const WithField: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-[280px]">
      <Label htmlFor="email-story">Email</Label>
      <Input id="email-story" type="email" placeholder="name@example.com" />
      <p className="text-sm text-[var(--color-text-secondary)]">Use your work email.</p>
    </div>
  ),
};

// ─── Input-field — Invalid state with error description ────────────────────────

export const WithFieldInvalid: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-[280px]">
      <Label htmlFor="invalid-story">Email</Label>
      <Input
        id="invalid-story"
        type="email"
        defaultValue="not-an-email"
        aria-invalid="true"
      />
      <p className="text-sm text-[var(--color-text-invalid)]">Email must contain @.</p>
    </div>
  ),
};

// ─── Input-field — Disabled ────────────────────────────────────────────────────

export const WithFieldDisabled: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-[280px]">
      <Label htmlFor="disabled-story">Domain</Label>
      <Input id="disabled-story" defaultValue="agentic.design" disabled />
      <p className="text-sm text-[var(--color-text-disabled)]">
        Managed by your organization.
      </p>
    </div>
  ),
};

// ─── With leading icon ─────────────────────────────────────────────────────────
// No native leadingIcon prop — icon positioned absolutely inside a relative wrapper.

export const WithLeadingIcon: Story = {
  render: () => (
    <div className="relative w-[280px]">
      <Search
        className="pointer-events-none absolute left-[var(--spacing-component-md)] top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-default)]"
        aria-hidden="true"
      />
      <Input className="pl-9" placeholder="Search projects…" aria-label="Search projects" />
    </div>
  ),
};

// ─── With trailing icon ───────────────────────────────────────────────────────
// Decorative / status icon on the right — no click action.
// Icon color: color/icon/success (valid), color/icon/default (neutral).

export const WithTrailingIcon: Story = {
  render: () => (
    <div className="relative w-[280px]">
      <Input className="pr-9" type="email" defaultValue="name@example.com" />
      <CircleCheck
        className="pointer-events-none absolute right-[var(--spacing-component-md)] top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-success)]"
        aria-hidden="true"
      />
    </div>
  ),
};

// ─── With trailing button ─────────────────────────────────────────────────────
// Attached outline button — spec: trailing-button INSTANCE (button, outline style).
// Border join: input rounded-r-none border-r-0 + button rounded-l-none.
// Button left border serves as the shared divider. Heights both 36px (h-9).

export const WithTrailingButton: Story = {
  render: () => (
    <div className="flex w-[280px]">
      <Input
        className="rounded-r-none border-r-0"
        placeholder="Search projects…"
      />
      <Button variant="outline" size="sm" className="h-9 rounded-l-none shrink-0">
        Search
      </Button>
    </div>
  ),
};

// ─── With trailing text (unit) ────────────────────────────────────────────────

export const WithTrailingText: Story = {
  render: () => (
    <div className="relative w-[280px]">
      <Input className="pr-12" placeholder="0.00" type="number" />
      <span className="pointer-events-none absolute right-[var(--spacing-component-md)] top-1/2 -translate-y-1/2 text-sm text-[var(--color-background-muted-foreground)]">
        USD
      </span>
    </div>
  ),
};

// ─── All states side by side ───────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[280px]">
      <Input placeholder="Default" />
      <Input defaultValue="Filled value" />
      <Input placeholder="Hover — mouse over to see" />
      <Input placeholder="Focused — click to see" />
      <Input placeholder="Disabled" defaultValue="agentic.design" disabled />
      <Input
        type="email"
        defaultValue="not-an-email"
        placeholder="name@example.com"
        aria-invalid="true"
      />
    </div>
  ),
};
