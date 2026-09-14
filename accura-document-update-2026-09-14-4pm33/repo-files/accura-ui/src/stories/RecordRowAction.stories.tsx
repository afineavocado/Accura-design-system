import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  RecordRowAction,
  RecordRowActionHeading,
} from "@/components/record-row-action";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const meta = {
  title: "Patterns/RecordRowAction",
  component: RecordRowAction,
  parameters: { layout: "padded" },
} satisfies Meta<typeof RecordRowAction>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ScrollableListing: Story = {
  args: {
    href: "#record-preview",
    label: "Open Document Control Procedure · v2.0",
  },
  render: (args) => (
    <div className="max-w-xl space-y-[var(--spacing-component-lg)]">
      <p className="text-sm text-[var(--color-text-secondary)]">
        Hover a row or Tab to its link. Scroll horizontally: the ghost view
        action stays at the right edge. Touch devices always show it.
      </p>
      <div className="overflow-hidden rounded-[var(--radius-base)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Revision</TableHead>
              <TableHead>Workflow</TableHead>
              <TableHead>Owner</TableHead>
              <RecordRowActionHeading />
            </TableRow>
          </TableHeader>
          <TableBody>
            {["Document Control Procedure", "Change Control Process"].map(
              (name) => (
                <TableRow key={name}>
                  <TableCell>
                    <a
                      href="#record-preview"
                      className="text-[var(--color-brand-primary)]"
                    >
                      {name}
                    </a>
                  </TableCell>
                  <TableCell>v2.0</TableCell>
                  <TableCell>Approved</TableCell>
                  <TableCell>James Wilson</TableCell>
                  <RecordRowAction {...args} label={`Open ${name} · v2.0`} />
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
      <p id="record-preview" className="text-sm">
        Preview destination
      </p>
    </div>
  ),
};

export const FittingListing: Story = {
  args: ScrollableListing.args,
  render: (args) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <RecordRowActionHeading />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Document Control Procedure</TableCell>
          <RecordRowAction {...args} />
        </TableRow>
      </TableBody>
    </Table>
  ),
};
