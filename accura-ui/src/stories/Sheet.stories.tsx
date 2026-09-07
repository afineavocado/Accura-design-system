import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Source: sheet.meta.json — verified against Figma 98:57748
// Built on Radix UI Dialog (NOT Vaul). No swipe-to-dismiss, no drag handle.
// Key difference from Drawer: Sheet = Radix Dialog, Drawer = Vaul (gesture library).
//
// Tokens:
//   Shell fill: color/surface/overlay · border: color/border/default · no shadow
//   Radius: radius/lg on exposed edge only · screen-edge corners = 0
//   Header: H layout · padding spacing/lg · gap spacing/md
//   Body slot: padding spacing/lg
//   Footer: VERTICAL stacked · border-top border/default · padding spacing/lg · gap spacing/sm
//   Title: color/surface/overlay/foreground · Description: color/text/secondary
//
// Cross-check (meta.json Side variants):
//   Horizontal → side="right" ✓  side="left" ✓
//   Vertical   → side="bottom" ✓  side="top" ✓

const meta = {
  title: 'Overlay/Sheet',
  component: Sheet,
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Side=Horizontal / side="right" — filter panel ───────────────────────────
// 380px wide, full height. Rounded left edge (top-left + bottom-left = radius/lg).
// Use for: detail views, settings, filter panels, edit forms.

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open (right)</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile. Save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-[var(--spacing-component-lg)] flex flex-col gap-[var(--spacing-component-lg)]">
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="r-name">Name</Label>
            <Input id="r-name" defaultValue="Phuong Lam" />
          </div>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="r-email">Email</Label>
            <Input id="r-email" defaultValue="phuong@example.com" />
          </div>
        </div>
        <SheetFooter>
          <Button className="w-full">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

// ─── Side=Horizontal / side="left" — navigation drawer ───────────────────────
// Rounded right edge. Use for: navigation panels, sidebar menus.

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open (left)</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Browse sections of the app.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-[var(--spacing-component-lg)] flex flex-col gap-[var(--spacing-component-xxs)]">
          {['Dashboard', 'Projects', 'Team', 'Settings', 'Help'].map((item) => (
            <a
              key={item}
              href="#"
              className="flex items-center px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] text-sm rounded-[var(--radius-md)] text-[var(--color-surface-overlay-foreground)] hover:bg-[var(--color-background-accent)] transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
};

// ─── Side=Vertical / side="bottom" — bottom action sheet ─────────────────────
// Full width. Rounded top edge. Use for: quick actions, command palettes.

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open (bottom)</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Share post</SheetTitle>
          <SheetDescription>Choose how you want to share this post.</SheetDescription>
        </SheetHeader>
        <div className="p-[var(--spacing-component-lg)] flex gap-[var(--spacing-component-sm)]">
          <Button variant="outline" className="flex-1">Copy link</Button>
          <Button variant="outline" className="flex-1">Twitter</Button>
          <Button variant="outline" className="flex-1">LinkedIn</Button>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

// ─── Side=Vertical / side="top" — search / command palette ───────────────────
// Full width. Rounded bottom edge. Use for: global search, command palette.

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open (top)</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
          <SheetDescription>Search across all content.</SheetDescription>
        </SheetHeader>
        <div className="p-[var(--spacing-component-lg)]">
          <Input placeholder="Type to search…" />
        </div>
      </SheetContent>
    </Sheet>
  ),
};

// ─── Scrollable body ──────────────────────────────────────────────────────────
// sheet-body must have overflow-y:auto in code — it doesn't scroll by default.
// Header and footer stay fixed; body scrolls independently.

export const ScrollableBody: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open scrollable panel</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>Review and update all project configuration.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-[var(--spacing-component-lg)] flex flex-col gap-[var(--spacing-component-lg)]">
          {['Name', 'Description', 'Owner', 'Team', 'Tags', 'Deadline', 'Budget', 'Priority'].map((field) => (
            <div key={field} className="flex flex-col gap-[var(--spacing-component-xs)]">
              <Label htmlFor={`sc-${field}`}>{field}</Label>
              <Input id={`sc-${field}`} placeholder={`Enter ${field.toLowerCase()}`} />
            </div>
          ))}
        </div>
        <SheetFooter>
          <Button className="w-full">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
