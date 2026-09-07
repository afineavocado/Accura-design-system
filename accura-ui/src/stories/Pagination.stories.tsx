import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Source: pagination.meta.json (category, variants, tokens)
// Spec: Component markdown/Pagination.md — verified against Figma 59:17863 / 59:18253
// All items: 32×32px (h-8 w-8), radius/md.
// Prev/Next: icon-only (Figma spec) — "Previous"/"Next" text is sr-only.

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic — Type=Basic ────────────────────────────────────────────────────────
// Prev · 1 · 2 · [3] · 4 · 5 · Next — small fixed page count.
// Gap: spacing/component/xxs (2px).

export const Basic: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>3</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">5</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// ─── More — Type=More ──────────────────────────────────────────────────────────
// Prev · 1 · … · 3 · [4] · 5 · … · 10 · Next — large dataset, windowed pages.

export const More: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>4</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">5</PaginationLink></PaginationItem>
        <PaginationItem><PaginationEllipsis /></PaginationItem>
        <PaginationItem><PaginationLink href="#">10</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// ─── Simple — Type=Simple ──────────────────────────────────────────────────────
// Prev · [1 / 10] · Next — compact layout for mobile or narrow containers.
// page-indicator: fill color/background/default, stroke color/border/default, radius/md.
// Gap: spacing/component/sm (8px).

export const Simple: Story = {
  render: () => (
    <Pagination>
      <PaginationContent className="gap-[var(--spacing-component-sm)]">
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem>
          <div className="flex h-8 items-center gap-[var(--spacing-component-xs-plus)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-sm)] text-sm">
            <span className="text-[var(--color-background-default-foreground)]">1</span>
            <span className="text-[var(--color-background-muted-foreground)]">/</span>
            <span className="text-[var(--color-background-muted-foreground)]">10</span>
          </div>
        </PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// ─── Disabled — Type=Disabled ─────────────────────────────────────────────────
// All items disabled — loading state or temporarily unavailable.
// Fill: color/background/muted · Border: color/border/disabled · Text: color/text/disabled.

export const Disabled: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" aria-disabled="true" />
        </PaginationItem>
        {[1, 2, 3, 4, 5].map((n) => (
          <PaginationItem key={n}>
            <PaginationLink
              href="#"
              aria-disabled="true"
              className="pointer-events-none bg-[var(--color-background-muted)] border-[var(--color-border-disabled)] text-[var(--color-text-disabled)]"
            >
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="#" aria-disabled="true" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// ─── With Total — Type=With Total ─────────────────────────────────────────────
// "Total 100 items" · Prev · pages · Next
// Label fill: color/background/muted/foreground. Gap: spacing/component/lg (16px).

export const WithTotal: Story = {
  render: () => (
    <Pagination className="justify-start">
      <div className="flex items-center gap-[var(--spacing-component-lg)]">
        <span className="text-sm text-[var(--color-background-muted-foreground)]">
          Total 100 items
        </span>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#" isActive>3</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">5</PaginationLink></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </div>
    </Pagination>
  ),
};

// ─── First page — Prev disabled ────────────────────────────────────────────────

export const FirstPage: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" aria-disabled="true" />
        </PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">5</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// ─── Last page — Next disabled ─────────────────────────────────────────────────

export const LastPage: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>5</PaginationLink></PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" aria-disabled="true" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

// ─── With Changer — Type=With Changer ────────────────────────────────────────
// Prev · pages · Next · [10 / page ▼]
// size-changer: fill color/background/default, stroke color/border/default, radius/md
// Gap: spacing/component/sm (8px) between page items and size-changer.

export const WithChanger: Story = {
  render: () => (
    <Pagination className="justify-start">
      <div className="flex items-center gap-[var(--spacing-component-sm)]">
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#" isActive>3</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">5</PaginationLink></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
        <select className="flex h-8 cursor-pointer appearance-none items-center rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-sm)] text-sm text-[var(--color-background-default-foreground)] focus-visible:outline-none focus-visible:border-[var(--color-border-focus)]">
          <option>10 / page</option>
          <option>25 / page</option>
          <option>50 / page</option>
        </select>
      </div>
    </Pagination>
  ),
};

// ─── Show All — Type=Show All ─────────────────────────────────────────────────
// "Total N items" · Prev · pages · Next · [size-changer] · "Go to [  ] page"
// Gap: spacing/component/md (12px) between all sections.
// Most feature-complete layout — for complex data tables.

export const ShowAll: Story = {
  render: () => (
    <Pagination className="justify-start">
      <div className="flex items-center gap-[var(--spacing-component-md)]">
        <span className="text-sm text-[var(--color-background-muted-foreground)]">
          Total 85 items
        </span>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#" isActive>3</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">5</PaginationLink></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
        <select className="flex h-8 cursor-pointer appearance-none items-center rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-sm)] text-sm text-[var(--color-background-default-foreground)] focus-visible:outline-none focus-visible:border-[var(--color-border-focus)]">
          <option>10 / page</option>
          <option>25 / page</option>
          <option>50 / page</option>
        </select>
        <div className="flex items-center gap-[var(--spacing-component-sm)] text-sm">
          <span className="text-[var(--color-background-muted-foreground)]">Go to</span>
          <input
            type="number"
            className="h-8 w-12 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-sm)] text-center text-sm text-[var(--color-background-default-foreground)] focus-visible:outline-none focus-visible:border-[var(--color-border-focus)] focus-visible:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]"
            placeholder="3"
          />
          <span className="text-[var(--color-background-muted-foreground)]">page</span>
        </div>
      </div>
    </Pagination>
  ),
};

// ─── With Jumper — Type=With Jumper ───────────────────────────────────────────
// Prev · pages · Next · "Go to [  ] page"
// jumper: label color/background/muted/foreground, input: border/default, gap: spacing/component/sm

export const WithJumper: Story = {
  render: () => (
    <Pagination className="justify-start">
      <div className="flex items-center gap-[var(--spacing-component-sm)]">
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#" isActive>3</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">4</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">5</PaginationLink></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
        <div className="flex items-center gap-[var(--spacing-component-sm)] text-sm">
          <span className="text-[var(--color-background-muted-foreground)]">Go to</span>
          <input
            type="number"
            className="h-8 w-12 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-sm)] text-center text-sm text-[var(--color-background-default-foreground)] focus-visible:outline-none focus-visible:border-[var(--color-border-focus)] focus-visible:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]"
            placeholder="3"
          />
          <span className="text-[var(--color-background-muted-foreground)]">page</span>
        </div>
      </div>
    </Pagination>
  ),
};
