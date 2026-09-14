'use client';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Source: docs/component-specs/Form-shared.md — `label`, 3 variants (label state).
//
// Structure: H auto-layout, gap spacing/component/xs
//   label-text      — TEXT
//   label-required  — TEXT (the asterisk; hidden unless `required`)
//
// Tokens:
//   label state=Default   text color/background/default/foreground · asterisk color/status/danger
//   label state=Disabled  text color/text/disabled                 · asterisk color/text/disabled
//   label state=Invalid   text color/text/invalid                  · asterisk color/text/invalid
//
// The asterisk follows the field state in Disabled and Invalid; only in Default
// does it diverge from the label text.
//
// Spec rule: the parent field owns `state` — never set it by hand on an instance,
// and never recolour the fills. Pass `required`; do not hand-roll an asterisk.

const meta = {
  title: 'Forms/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Document name' },
};

export const Required: Story = {
  args: { children: 'Document name', required: true },
};

export const Disabled: Story = {
  args: { children: 'Document name', required: true, state: 'disabled' },
};

export const Invalid: Story = {
  args: { children: 'Document name', required: true, state: 'invalid' },
};

// All three states side by side — the asterisk only diverges from the label
// text in Default.
export const AllStates: Story = {
  args: { children: 'Label' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)]">
      {(['default', 'disabled', 'invalid'] as const).map((state) => (
        <div
          key={state}
          className="flex flex-col gap-[var(--spacing-component-xs)]"
        >
          <Label htmlFor={`field-${state}`} state={state} required>
            Document name
          </Label>
          <Input
            id={`field-${state}`}
            placeholder="e.g. SOP-001"
            disabled={state === 'disabled'}
            aria-invalid={state === 'invalid' || undefined}
          />
        </div>
      ))}
    </div>
  ),
};

// Not required: no asterisk, and nothing announced to assistive tech.
export const WithField: Story = {
  args: { children: 'Label' },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)]">
      <Label htmlFor="department">Department</Label>
      <Input id="department" placeholder="Quality Assurance" />
    </div>
  ),
};
