import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

// Source: Alert.md (alert-dialog section) — Figma 152:3240
// Separate shadcn component from Alert (inline banner) — follows one-story-per-component rule.
//
// Tokens: fill color/surface/overlay · border color/border/default · radius/lg
//   padding spacing/component/xl (24px) · gap spacing/component/lg (16px) · no shadow
//   Overlay: color/background/inverted @ 50%.
//
// Use AlertDialog for: "Are you sure?" confirmations, destructive action gates,
//   mandatory acknowledgements. Never use Dialog for simple confirmations.
//
// Cross-check (Alert.md alert-dialog variant matrix):
//   Type: Default ✓  Destructive ✓
//   Align: Left ✓  Center ✓
//   Footer: Inline ✓  Full-width ✓

const meta = {
  title: 'Overlay/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default — Type=Default, Align=Left, Footer=Inline ────────────────────────
// Standard confirmation. Cancel (outline) + Action (primary) buttons.
// role="alertdialog" — Escape does NOT close (unlike Dialog) — user must choose.
//
// Type=Default is for confirmations the user can walk back — publish, submit,
// send. Anything irreversible belongs in the Destructive story below; a delete
// behind a primary (green) button reads as "safe to proceed" and is a bug.

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Publish changes</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publish these changes?</AlertDialogTitle>
          <AlertDialogDescription>
            The updated CAPA will become visible to everyone in the workspace.
            You can keep editing it after publishing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Publish</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// ─── Destructive — Type=Destructive ───────────────────────────────────────────
// Every irreversible confirm — delete, revoke, overwrite — uses variant="destructive"
// (button/destructive/bg/bg, #ef4444). AlertDialogAction is already a button, so do
// NOT wrap a nested <Button> via asChild: Radix Slot concatenates both class strings
// with no tailwind-merge and primary wins on source order. Pass the prop instead.

export const Destructive: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Revoke access</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke admin access?</AlertDialogTitle>
          <AlertDialogDescription>
            This user will immediately lose all admin privileges. They will need
            to be re-invited to regain access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Revoke access</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// ─── Delete workspace — the canonical destructive confirmation ────────────────
// Kept as its own story because "delete + cannot be undone" is the case most
// likely to be copied. It must be red.

export const DeleteWorkspace: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete workspace</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the workspace and all its projects.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete workspace</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// ─── Center align — Align=Center ──────────────────────────────────────────────
// Title and description centered. Pass className to header and footer.

export const CenterAlign: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Log out</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center text-center">
          <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to sign in again to access your workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Log out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// ─── Full-width footer — Footer=Full-width ────────────────────────────────────
// Buttons span full width, stacked vertically.

export const FullWidthFooter: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Archive project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive this project?</AlertDialogTitle>
          <AlertDialogDescription>
            Archived projects are hidden from your workspace but can be restored
            at any time from settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-[var(--spacing-component-sm)]">
          <AlertDialogAction className="w-full">Archive project</AlertDialogAction>
          <AlertDialogCancel className="mt-0 w-full">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// ─── Destructive + Center align ────────────────────────────────────────────────

export const DestructiveCentered: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center text-center">
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            All your data, projects, and settings will be permanently deleted.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center">
          <AlertDialogCancel>Keep account</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete account</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
