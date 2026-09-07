import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import {
  Bold01,
  Italic01,
  Underline01,
  AlignLeft01,
  AlignCenter,
  AlignRight01,
  ZoomIn,
  ZoomOut,
  List,
  LayoutGrid01,
} from 'lucide-react';

// Source: button-group.meta.json — Figma verified 52:11151
// Custom component — no shadcn base.
// Composable API: put <Button variant="ghost"> children directly inside <ButtonGroup>.
// Separators are CSS divide-x / divide-y — no explicit separator elements needed.
//
// Tokens:
//   Container: color/surface/default fill · color/border/default border · radius/md · overflow-hidden
//   Separators: color/border/default (via divide-*)
//   Buttons: Ghost variant only (group border provides the visual container)
//
// Cross-check (meta.json variants):
//   Orientation: Horizontal ✓  Vertical ✓
//   Number: 2 ✓  3 ✓

const meta = {
  title: 'Actions/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  args: { orientation: 'horizontal' },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Horizontal, Number=2 ─────────────────────────────────────────────────────
// Ghost Default size (40px tall). Text labels.

export const HorizontalTwo: Story = {
  render: () => (
    <ButtonGroup aria-label="View mode">
      <Button variant="ghost">List</Button>
      <Button variant="ghost">Grid</Button>
    </ButtonGroup>
  ),
};

// ─── Horizontal, Number=3 ─────────────────────────────────────────────────────

export const HorizontalThree: Story = {
  render: () => (
    <ButtonGroup aria-label="Time period">
      <Button variant="ghost">Month</Button>
      <Button variant="ghost">Week</Button>
      <Button variant="ghost">Day</Button>
    </ButtonGroup>
  ),
};

// ─── Horizontal — icon-only buttons ───────────────────────────────────────────
// Alignment group — each button needs aria-label for icon-only accessibility.

export const HorizontalIcons: Story = {
  render: () => (
    <ButtonGroup aria-label="Text alignment">
      <Button variant="ghost" size="icon" aria-label="Align left">
        <AlignLeft01 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Align right">
        <AlignRight01 className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

// ─── Horizontal — text formatting ─────────────────────────────────────────────

export const TextFormatting: Story = {
  render: () => (
    <ButtonGroup aria-label="Text formatting">
      <Button variant="ghost" size="icon" aria-label="Bold">
        <Bold01 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Italic">
        <Italic01 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Underline">
        <Underline01 className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

// ─── Vertical, Number=2 ───────────────────────────────────────────────────────
// Ghost Icon Large (44×44px). Icon-only. aria-label required on every button.

export const VerticalTwo: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" aria-label="Zoom controls">
      <Button variant="ghost" size="icon" aria-label="Zoom in">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Zoom out">
        <ZoomOut className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

// ─── Vertical, Number=3 ───────────────────────────────────────────────────────

export const VerticalThree: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" aria-label="View options">
      <Button variant="ghost" size="icon" aria-label="List view">
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Grid view">
        <LayoutGrid01 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Zoom in">
        <ZoomIn className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

// ─── All variants side by side ────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col gap-3 items-start">
        <span className="text-xs text-[var(--color-text-secondary)]">Horizontal 2</span>
        <ButtonGroup aria-label="View mode">
          <Button variant="ghost">List</Button>
          <Button variant="ghost">Grid</Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-3 items-start">
        <span className="text-xs text-[var(--color-text-secondary)]">Horizontal 3</span>
        <ButtonGroup aria-label="Period">
          <Button variant="ghost">Month</Button>
          <Button variant="ghost">Week</Button>
          <Button variant="ghost">Day</Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-3 items-start">
        <span className="text-xs text-[var(--color-text-secondary)]">Vertical 2</span>
        <ButtonGroup orientation="vertical" aria-label="Zoom">
          <Button variant="ghost" size="icon" aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-3 items-start">
        <span className="text-xs text-[var(--color-text-secondary)]">Vertical 3</span>
        <ButtonGroup orientation="vertical" aria-label="Alignment">
          <Button variant="ghost" size="icon" aria-label="Align left"><AlignLeft01 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" aria-label="Align center"><AlignCenter className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" aria-label="Align right"><AlignRight01 className="h-4 w-4" /></Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};
