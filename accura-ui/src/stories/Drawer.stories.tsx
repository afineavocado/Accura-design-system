import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Responsive helper — switches between Drawer (mobile) and Dialog (desktop)
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 640px)').matches : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

// Source: drawer.meta.json — verified against Figma 74:691
//
// Tokens:
//   Panel fill: color/surface/overlay · border: color/border/default
//   Handle: 100×8px · color/background/muted · radius/full
//   handle-bar padding T/B: spacing/component/lg (16px)
//   Header padding: spacing/component/lg · gap: spacing/component/xxs (2px — Figma confirmed)
//   Footer layout: VERTICAL (stacked) · padding: spacing/component/lg · gap: spacing/component/sm
//   Title: color/background/default/foreground
//   Description: color/background/muted/foreground
//   Overlay: color/background/inverted @ 50%
//
// Cross-check (meta.json Direction variants):
//   Bottom ✓  Right ✓  Responsive ✓

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Direction=Bottom ─────────────────────────────────────────────────────────
// Slides from bottom. Handle-bar shown (showHandle default=true).
// Radius: top-left + top-right = radius/lg. Bottom corners = 0 (screen edge).
// Use for mobile-first: filters, confirmations, quick actions.

export const Bottom: Story = {
  render: () => (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit filters</DrawerTitle>
          <DrawerDescription>Adjust the filters for this view.</DrawerDescription>
        </DrawerHeader>
        <div className="p-[var(--spacing-component-lg)] flex flex-col gap-[var(--spacing-component-lg)]">
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="filter-status">Status</Label>
            <Input id="filter-status" placeholder="All statuses" />
          </div>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="filter-date">Date range</Label>
            <Input id="filter-date" placeholder="Last 30 days" />
          </div>
        </div>
        <DrawerFooter>
          <Button className="w-full">Apply filters</Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

// ─── Direction=Right ──────────────────────────────────────────────────────────
// Slides from right. No handle-bar (showHandle={false}).
// Radius: top-left + bottom-left = radius/lg. Right corners = 0 (screen edge).
// Use for desktop side panels: detail views, settings, inspector panes.

export const Right: Story = {
  render: () => (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Open details</Button>
      </DrawerTrigger>
      <DrawerContent
        showHandle={false}
        className="inset-x-auto inset-y-0 right-0 left-auto h-full w-80 rounded-l-[var(--radius-lg)] rounded-r-none border-l border-t-0 border-b-0"
      >
        <DrawerHeader>
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Review metadata and settings for this project.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-[var(--spacing-component-lg)] flex flex-col gap-[var(--spacing-component-lg)]">
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="proj-name">Project name</Label>
            <Input id="proj-name" defaultValue="Accura Design System" />
          </div>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="proj-owner">Owner</Label>
            <Input id="proj-owner" defaultValue="Phuong Lam" />
          </div>
        </div>
        <DrawerFooter>
          <Button className="w-full">Save changes</Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Dismiss</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

// ─── Direction=Responsive ─────────────────────────────────────────────────────
// Bottom on mobile → centred floating panel on desktop (all-corner radius).
// Handle shown on mobile, hidden at sm+.
// Use when one component must work across breakpoints.

// Responsive — Drawer on mobile, Dialog on desktop
// This is the correct pattern: Vaul's drawer cannot be repositioned via CSS.
// Use useIsDesktop() to switch components at the breakpoint.
export const Responsive: Story = {
  render: () => {
    const isDesktop = useIsDesktop();

    const content = (
      <>
        <div className="p-[var(--spacing-component-lg)] flex flex-col gap-[var(--spacing-component-lg)]">
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="resp-theme">Theme</Label>
            <Input id="resp-theme" defaultValue="System" />
          </div>
        </div>
      </>
    );

    if (isDesktop) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open settings</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick settings</DialogTitle>
              <DialogDescription>Adjust your preferences.</DialogDescription>
            </DialogHeader>
            {content}
            <DialogFooter>
              <Button className="w-full">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer direction="bottom">
        <DrawerTrigger asChild>
          <Button variant="outline">Open settings</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Quick settings</DrawerTitle>
            <DrawerDescription>Adjust your preferences.</DrawerDescription>
          </DrawerHeader>
          {content}
          <DrawerFooter>
            <Button className="w-full">Save</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};

// ─── With form content ────────────────────────────────────────────────────────

export const WithForm: Story = {
  render: () => (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button>Create project</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New project</DrawerTitle>
          <DrawerDescription>Fill in the details to create your project.</DrawerDescription>
        </DrawerHeader>
        <div className="p-[var(--spacing-component-lg)] flex flex-col gap-[var(--spacing-component-lg)]">
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="form-name">Project name</Label>
            <Input id="form-name" placeholder="Enter project name" />
          </div>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="form-desc">Description</Label>
            <Input id="form-desc" placeholder="Optional description" />
          </div>
        </div>
        <DrawerFooter>
          <Button type="submit" className="w-full">Create project</Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
