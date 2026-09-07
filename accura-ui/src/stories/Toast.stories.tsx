'use client';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

// Source: toast.meta.json (category, variants, tokens)
// Patterns: toast.examples.tsx
// Note: Toast is imperative — no JSX at the call site.
// <Toaster /> lives in the decorator; toast() is called from onClick handlers.

const meta = {
  title: 'Feedback/Toast',
  component: Toaster,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Toaster closeButton />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default — neutral, no status icon ───────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast('Settings saved.')}>
      Show default toast
    </Button>
  ),
};

// ─── Success ──────────────────────────────────────────────────────────────────
// Icon: color/icon/success

export const Success: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.success('File uploaded successfully.', {
          description: 'Your file is now available in the library.',
        })
      }
    >
      Show success toast
    </Button>
  ),
};

// ─── Error ────────────────────────────────────────────────────────────────────
// Icon: color/icon/danger
// Always include a description naming what failed and what the user can do.

export const Error: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.error('Upload failed.', {
          description: 'Check your network connection and try again.',
          duration: 6000,
        })
      }
    >
      Show error toast
    </Button>
  ),
};

// ─── Warning ──────────────────────────────────────────────────────────────────
// Icon: color/icon/warning

export const Warning: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.warning('Session expires in 5 minutes.', {
          description: 'Save your work to avoid losing changes.',
        })
      }
    >
      Show warning toast
    </Button>
  ),
};

// ─── Loading → Success ────────────────────────────────────────────────────────
// Loading persists indefinitely — must be resolved programmatically.
// Icon: color/surface/overlay/foreground (spinner)

export const Loading: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        const id = toast.loading('Uploading file…');
        setTimeout(() => toast.success('Upload complete!', { id }), 2500);
      }}
    >
      Show loading → success (2.5s)
    </Button>
  ),
};

// ─── Promise pattern ──────────────────────────────────────────────────────────
// Transitions Loading → Success or Error automatically based on promise resolution.

export const Promise: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        const uploadFile = () =>
          new Promise<void>((resolve) => setTimeout(resolve, 2000));

        toast.promise(uploadFile(), {
          loading: 'Uploading file…',
          success: 'File uploaded successfully.',
          error: 'Upload failed.',
        });
      }}
    >
      Show promise toast (2s)
    </Button>
  ),
};

// ─── With action ──────────────────────────────────────────────────────────────
// action-btn = outline button style. Clicking dismisses the toast.

export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast('Contact removed.', {
          description: 'This contact has been deleted from your list.',
          action: {
            label: 'Undo',
            onClick: () => toast.success('Contact restored.'),
          },
        })
      }
    >
      Show toast with action
    </Button>
  ),
};

// ─── All types side by side ───────────────────────────────────────────────────

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => toast('Preference saved.')}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success('Payment processed.')}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Could not send message.', {
            description: 'Check your connection and try again.',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning('Storage 90% full.', {
            description: 'Free up space to continue uploading.',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.loading('Generating report…');
          setTimeout(() => toast.success('Report ready.', { id }), 2000);
        }}
      >
        Loading
      </Button>
    </div>
  ),
};
