import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

// Source: spinner.meta.json — code-only, no Figma component (figmaNodeId: null)
// Icon: Loading02 (@untitledui/icons) — the same icon Toast uses for its loading state.
// Colour: currentColor — no token of its own; inherits the foreground it sits in.
// Sizes: sm=14px · md=16px (default) · lg=24px
// Motion: animate-spin, stopped under prefers-reduced-motion.
//
// When to use: small areas only — a button, an input, a pill. A region whose
// layout is known uses Skeleton; a measurable task uses Progress.

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  args: { size: 'md' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-[var(--spacing-component-xl)] text-[var(--color-background-default-foreground)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
          <Spinner size={size} />
          <span className="text-xs text-[var(--color-text-secondary)]">
            {size} — {size === 'sm' ? '14px' : size === 'md' ? '16px (default)' : '24px'}
          </span>
        </div>
      ))}
    </div>
  ),
};

// ─── Inherits colour ──────────────────────────────────────────────────────────
// currentColor: correct on every Button variant without a token of its own.
// These buttons use `loading`, which is how Spinner normally appears.

export const InButtons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-component-sm)]">
      <Button loading loadingLabel="Saving changes">Save changes</Button>
      <Button variant="outline" loading loadingLabel="Exporting records">Export CSV</Button>
      <Button variant="secondary" loading loadingLabel="Saving draft">Save draft</Button>
      <Button variant="destructive" loading loadingLabel="Deleting">Delete</Button>
    </div>
  ),
};

// ─── With label ───────────────────────────────────────────────────────────────
// When the spinner is the only thing saying "loading", give it a label: it then
// renders role="status" with screen-reader-only text.

export const WithLabel: Story = {
  args: { label: 'Loading assignees' },
  render: (args) => (
    <div className="flex items-center gap-[var(--spacing-component-sm)] text-sm text-[var(--color-text-secondary)]">
      <Spinner {...args} size="sm" />
      <span aria-hidden="true">Searching…</span>
    </div>
  ),
};
