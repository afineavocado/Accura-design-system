import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Dialog,
  DialogClose,
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

// Source: dialog.meta.json — verified against Figma 266:131
// Tokens: popup fill color/surface/overlay · border color/border/default · radius/lg
//   padding spacing/component/lg (16px) · gap spacing/component/lg (16px)
//   No shadow (Figma: 0 effects). Overlay: color/background/inverted @ 50%.
//
// Cross-check (meta.json Type variants):
//   Form ✓  No close button ✓  Sticky footer ✓  Scrollable ✓

const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Type=Form ────────────────────────────────────────────────────────────────
// Short data-collection task with inline cancel + action footer.
// Click "Open dialog" to see the popup, backdrop, and token rendering.

export const Form: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your display name and email address.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-[var(--spacing-component-lg)]">
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Phuong Lam" />
          </div>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="phuong@example.com" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// ─── Type=No close button ─────────────────────────────────────────────────────
// showClose={false} — no × button. Dismiss via Escape or backdrop click only.
// Use for informational prompts or programmatic multi-step flows.

export const NoCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View announcement</Button>
      </DialogTrigger>
      <DialogContent showClose={false}>
        <DialogHeader>
          <DialogTitle>System maintenance</DialogTitle>
          <DialogDescription>
            The system will be unavailable on Saturday 31 May from 02:00 to 04:00 UTC
            for scheduled maintenance. No data will be lost.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
};

// ─── Type=Sticky footer ───────────────────────────────────────────────────────
// DialogContent: p-0 gap-0 — sections own their own spacing.
// heading: pt-spacing/xl pb-spacing/lg px-spacing/lg
// body: scrollable, px-spacing/lg py-spacing/lg
// footer: color/background/subtle fill · color/border/subtle top border

export const StickyFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New project</Button>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 flex flex-col max-h-[80vh]">
        <DialogHeader className="px-[var(--spacing-component-lg)] pt-[var(--spacing-component-xl)] pb-[var(--spacing-component-lg)]">
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Fill in the details to set up your new project workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-[var(--spacing-component-lg)] py-[var(--spacing-component-lg)] flex flex-col gap-[var(--spacing-component-lg)]">
          {['Project name', 'Description', 'Team', 'Deadline'].map((field) => (
            <div key={field} className="flex flex-col gap-[var(--spacing-component-xs)]">
              <Label htmlFor={field.toLowerCase().replace(' ', '-')}>{field}</Label>
              <Input
                id={field.toLowerCase().replace(' ', '-')}
                placeholder={`Enter ${field.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
        {/* Sticky footer — color/background/subtle + color/border/subtle top border */}
        <div className="flex flex-row justify-end gap-[var(--spacing-component-sm)] border-t border-[var(--color-border-subtle)] bg-[var(--color-background-subtle)] px-[var(--spacing-component-lg)] py-[var(--spacing-component-lg)]">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Create project</Button>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

// ─── Type=Scrollable ──────────────────────────────────────────────────────────
// heading + scrollable body only — no footer.
// Use for read-only long content: changelogs, privacy policies, previews.

export const Scrollable: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View terms</Button>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 flex flex-col max-h-[80vh]">
        <DialogHeader className="px-[var(--spacing-component-lg)] pt-[var(--spacing-component-xl)] pb-[var(--spacing-component-lg)]">
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>
            Please read these terms carefully before using our service.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-[var(--spacing-component-lg)] py-[var(--spacing-component-lg)] flex flex-col gap-[var(--spacing-component-lg)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <p key={i} className="text-sm text-[var(--color-text-secondary)]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  ),
};

// ─── Destructive confirmation ──────────────────────────────────────────────────
// Form type used for a delete confirmation — destructive action button.
// Note: for simple "Are you sure?" with no fields, use Alert Dialog instead.

export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. All your data will be permanently removed
            from our servers. Type your email to confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <Label htmlFor="confirm-email">Confirm email</Label>
          <Input id="confirm-email" placeholder="phuong@example.com" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
