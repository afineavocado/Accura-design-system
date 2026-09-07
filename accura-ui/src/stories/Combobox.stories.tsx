import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComboboxField } from '@/components/ui/combobox';

// Source: combobox.meta.json — Figma 75:9166 / 148:2191
// Built on @base-ui/react Combobox
//
// Variants covered:
//   Type=Basic (Default, Filled, Invalid, Disabled) ✓
//   Type=Search (Default, Filled, Disabled) ✓
//   Type=Basic State=Filled-chips (multi-select) ✓

const people = [
  { value: "ada", label: "Ada Lovelace" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "margaret", label: "Margaret Hamilton" },
  { value: "radia", label: "Radia Perlman" },
];

const meta = {
  title: 'Forms/Combobox',
  component: ComboboxField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ComboboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic — Default ───────────────────────────────────────────────────────────

export const Basic: Story = {
  render: () => (
    <div className="w-[280px]">
      <ComboboxField
        id="owner"
        label="Owner"
        placeholder="Select an owner"
        description="Choose one person responsible for this project."
        options={people}
      />
    </div>
  ),
};

// ─── Basic — Filled ────────────────────────────────────────────────────────────

export const Filled: Story = {
  render: () => (
    <div className="w-[280px]">
      <ComboboxField
        id="owner-filled"
        label="Owner"
        placeholder="Select an owner"
        defaultValue="grace"
        options={people}
      />
    </div>
  ),
};

// ─── Basic — Invalid ───────────────────────────────────────────────────────────

export const Invalid: Story = {
  render: () => (
    <div className="w-[280px]">
      <ComboboxField
        id="reviewer"
        label="Reviewer"
        placeholder="Select a reviewer"
        state="invalid"
        aria-invalid="true"
        description="At least one reviewer is required."
        options={people}
      />
    </div>
  ),
};

// ─── Basic — Disabled ──────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div className="w-[280px]">
      <ComboboxField
        id="owner-disabled"
        label="Owner"
        placeholder="Select an owner"
        state="disabled"
        description="This field cannot be edited."
        options={people}
      />
    </div>
  ),
};

// ─── Search ────────────────────────────────────────────────────────────────────

export const Search: Story = {
  render: () => (
    <div className="w-[280px]">
      <ComboboxField
        id="assignee"
        label="Assignee"
        type="search"
        placeholder="Search people"
        description="Type to filter the list."
        options={people}
      />
    </div>
  ),
};

// ─── Search — Disabled ─────────────────────────────────────────────────────────

export const SearchDisabled: Story = {
  render: () => (
    <div className="w-[280px]">
      <ComboboxField
        id="assignee-disabled"
        label="Assignee"
        type="search"
        placeholder="Search people"
        state="disabled"
        options={people}
      />
    </div>
  ),
};

// ─── Multi-select (chips) ──────────────────────────────────────────────────────

export const MultiSelect: Story = {
  render: () => (
    <div className="w-[280px]">
      <ComboboxField
        id="members"
        label="Members"
        placeholder="Add members"
        multiple
        defaultValue={["ada", "grace"]}
        options={people}
        description="Select all that apply."
      />
    </div>
  ),
};

// ─── Tag Input — pure free-form ────────────────────────────────────────────────
// No options list. Type anything + Enter or comma to create a chip.

export const TagInput: Story = {
  render: () => (
    <div className="w-[280px]">
      <ComboboxField
        id="labels"
        label="Labels"
        type="tag-input"
        placeholder="Add a label…"
        description="Press Enter or comma to add. Backspace to remove."
      />
    </div>
  ),
};

// ─── Tag Input — with suggestions ──────────────────────────────────────────────
// Has an options list for suggestions, but also allows free-form values.

export const TagInputWithSuggestions: Story = {
  render: () => (
    <div className="w-[280px]">
      <ComboboxField
        id="tags"
        label="Tags"
        type="tag-input"
        placeholder="Add tags…"
        options={[
          { value: "design", label: "Design" },
          { value: "engineering", label: "Engineering" },
          { value: "marketing", label: "Marketing" },
          { value: "research", label: "Research" },
        ]}
        description="Choose from suggestions or type your own."
      />
    </div>
  ),
};

// ─── Tag Input — Invalid ───────────────────────────────────────────────────────

export const TagInputInvalid: Story = {
  render: () => (
    <div className="w-[280px]">
      <ComboboxField
        id="labels-invalid"
        label="Labels"
        type="tag-input"
        placeholder="Add a label…"
        state="invalid"
        description="At least one label is required."
      />
    </div>
  ),
};

// ─── All states ────────────────────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[280px]">
      <ComboboxField id="s1" label="Default" placeholder="Select an owner" options={people} />
      <ComboboxField id="s2" label="Filled" placeholder="Select an owner" defaultValue="ada" options={people} />
      <ComboboxField id="s3" label="Invalid" placeholder="Select a reviewer" state="invalid" description="Required field." options={people} />
      <ComboboxField id="s4" label="Disabled" placeholder="Select an owner" state="disabled" options={people} />
      <ComboboxField id="s5" label="Search" type="search" placeholder="Search people" options={people} />
      <ComboboxField id="s6" label="Multi-select" placeholder="Add members" multiple defaultValue={["ada"]} options={people} description="Select all that apply." />
    </div>
  ),
};
