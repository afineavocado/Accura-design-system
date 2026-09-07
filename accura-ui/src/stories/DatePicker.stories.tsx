import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DatePicker } from '@/components/ui/date-picker';

// Source: date-picker.meta.json — Figma 58:15976
//
// Tokens:
//   trigger Closed:  bg/default · input/border
//   trigger Hover:   background/subtle · input/border
//   trigger Focus:   bg/default · border/focus + ring
//   trigger Open:    bg/default · border/default
//   placeholder: color/input/placeholder
//   Calendar popup: surface/overlay · border/default · radius/lg
//
// Types: Default (single) · Range (dual-month) · Input (typed date)

const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default (single date) ────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div className="w-[280px]">
      <DatePicker id="due-date" label="Due date" placeholder="Pick a date" />
    </div>
  ),
};

// ─── Range ────────────────────────────────────────────────────────────────────

export const RangeType: Story = {
  render: () => (
    <div className="w-[280px]">
      <DatePicker id="report-window" type="range" label="Report window" placeholder="Pick a date range" />
    </div>
  ),
};

// ─── No label ─────────────────────────────────────────────────────────────────

export const NoLabel: Story = {
  render: () => (
    <div className="w-[280px]">
      <DatePicker placeholder="Select date" />
    </div>
  ),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div className="w-[280px]">
      <DatePicker id="locked-date" label="Locked date" placeholder="Not available" disabled />
    </div>
  ),
};

// ─── All types ────────────────────────────────────────────────────────────────

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[280px]">
      <DatePicker id="t1" type="default" label="Type=Default" placeholder="Pick a date" />
      <DatePicker id="t2" type="range"   label="Type=Range"   placeholder="Pick a date range" />
    </div>
  ),
};
