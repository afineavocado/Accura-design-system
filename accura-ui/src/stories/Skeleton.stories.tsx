import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton } from '@/components/ui/skeleton';

// Source: skeleton.meta.json — code-only, no Figma component (figmaNodeId: null)
// Single token: color/background/muted (bg-[var(--color-background-muted)])
// No variants, no props. Compose multiple instances to mirror real content layout.
// Wrap loading region in aria-busy="true" — individual Skeleton elements are decorative.
//
// Composition patterns (from meta.json compositionPatterns):
//   Circle + text lines ✓  Full-width rectangle ✓
//   Multiple text lines ✓  Row with circle + line ✓  Grid of rectangles ✓

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Text lines ────────────────────────────────────────────────────────────────
// Title + body paragraph. Varying widths prevent visual monotony.

export const TextLines: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-80" aria-busy="true" aria-label="Loading content">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
};

// ─── Avatar + name row ─────────────────────────────────────────────────────────
// Circle for avatar, lines for name + secondary text.

export const AvatarRow: Story = {
  render: () => (
    <div className="flex items-center gap-3 w-64" aria-busy="true" aria-label="Loading user">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  ),
};

// ─── Card with image ───────────────────────────────────────────────────────────

export const CardWithImage: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72" aria-busy="true" aria-label="Loading card">
      <Skeleton className="h-44 w-full rounded-[var(--radius-lg)]" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  ),
};

// ─── List rows ─────────────────────────────────────────────────────────────────

export const ListRows: Story = {
  render: () => (
    <div className="w-72" aria-busy="true" aria-label="Loading list">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2.5 border-b border-[var(--color-border-default)] last:border-0"
        >
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-3.5 w-10 shrink-0" />
        </div>
      ))}
    </div>
  ),
};

// ─── Card grid ─────────────────────────────────────────────────────────────────

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[480px]" aria-busy="true" aria-label="Loading cards">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-28 w-full rounded-[var(--radius-lg)]" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  ),
};

// ─── Widget ────────────────────────────────────────────────────────────────────

export const Widget: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-64" aria-busy="true" aria-label="Loading widget">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    </div>
  ),
};

// ─── Form layout ───────────────────────────────────────────────────────────────

export const FormLayout: Story = {
  render: () => (
    <div className="flex flex-col gap-5 w-80" aria-busy="true" aria-label="Loading form">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-9 w-full rounded-[var(--radius-md)]" />
        </div>
      ))}
      <Skeleton className="h-9 w-24 rounded-[var(--radius-md)]" />
    </div>
  ),
};
