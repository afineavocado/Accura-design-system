import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Source: select.meta.json — verified against Figma 74:757 (select-trigger) + 146:3751 (select-field)
// shadcn has no SelectField wrapper — select-field is composed: Label + Select + description <p>.
//
// Cross-check (meta.json State variants):
//   Default ✓  Hover ✓ (interaction)  Open ✓ (interaction)
//   Filled ✓  Disabled ✓  Invalid ✓
//   Slots: WithField ✓  WithGroups ✓

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default — State=Default ───────────────────────────────────────────────────
// Trigger: color/background/default fill · color/input/border stroke.
// Placeholder: color/input/placeholder.

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="review">In review</SelectItem>
        <SelectItem value="published">Published</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ─── Filled — State=Filled ────────────────────────────────────────────────────
// Value text: color/background/default/foreground (not placeholder).

export const Filled: Story = {
  render: () => (
    <Select defaultValue="review">
      <SelectTrigger className="w-[280px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="review">In review</SelectItem>
        <SelectItem value="published">Published</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ─── Disabled — State=Disabled ────────────────────────────────────────────────
// Fill: color/background/muted · Border: color/border/disabled.
// No opacity — disabled uses explicit fill/border tokens (Figma confirmed).

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="us">
      <SelectTrigger className="w-[280px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">United States</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ─── Invalid — State=Invalid ───────────────────────────────────────────────────
// Border: color/border/error via aria-invalid="true".

export const Invalid: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]" aria-invalid="true">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ─── select-field — Default ────────────────────────────────────────────────────
// Composition: Label + Select + description <p>.
// gap: spacing/component/xs (4px). Description: color/text/secondary.

export const WithField: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-[280px]">
      <Label htmlFor="status-story">Status</Label>
      <Select>
        <SelectTrigger id="status-story">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="review">In review</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Choose the current workflow state.
      </p>
    </div>
  ),
};

// ─── select-field — Invalid ────────────────────────────────────────────────────
// Label: color/text/invalid. Description: color/text/secondary (context, not error text).
// Trigger border: color/border/error via aria-invalid.

export const WithFieldInvalid: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-[280px]">
      <Label htmlFor="role-story" className="text-[var(--color-text-invalid)]">
        Role
      </Label>
      <Select>
        <SelectTrigger id="role-story" aria-invalid="true">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Please select a role to continue.
      </p>
    </div>
  ),
};

// ─── select-field — Disabled ───────────────────────────────────────────────────

export const WithFieldDisabled: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-[280px]">
      <Label htmlFor="country-story" className="text-[var(--color-text-disabled)]">
        Country
      </Label>
      <Select disabled defaultValue="us">
        <SelectTrigger id="country-story">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-[var(--color-text-disabled)]">
        Managed by your organization.
      </p>
    </div>
  ),
};

// ─── With option groups ─────────────────────────────────────────────────────────
// SelectGroup + SelectLabel for categorised options.

export const WithGroups: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)] w-[280px]">
      <Label htmlFor="timezone-story">Timezone</Label>
      <Select>
        <SelectTrigger id="timezone-story">
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern Time (EST)</SelectItem>
            <SelectItem value="cst">Central Time (CST)</SelectItem>
            <SelectItem value="pst">Pacific Time (PST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

// ─── With separator ─────────────────────────────────────────────────────────────

export const WithSeparator: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectSeparator />
        <SelectItem value="viewer">Viewer (read-only)</SelectItem>
        <SelectItem value="guest" disabled>Guest (unavailable)</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ─── All trigger states ─────────────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[280px]">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="a">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Filled value</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger aria-invalid="true">
          <SelectValue placeholder="Invalid — red border" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
