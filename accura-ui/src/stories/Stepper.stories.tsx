import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import * as React from 'react';
import { Stepper } from '@/components/ui/stepper';

// Source: docs/component-specs/Stepper.md — code-only, no Figma set.
//
// Tokens:
//   complete indicator: color/brand/primary · check color/brand/primary/foreground
//   current indicator:  color/background/default · 2px color/brand/primary
//   upcoming indicator: color/background/muted · color/text/secondary
//   connector: color/brand/primary after a complete step, else color/border/default
//   label: color/background/default/foreground (semibold when current) · color/text/secondary

const meta = {
  title: 'Feedback/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    currentStep: { control: { type: 'number', min: 1 } },
  },
  args: { orientation: 'horizontal', currentStep: 2 },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

// The real Accura CAPA workflow — see flow/create-capa.md
// `description` is optional — Draft and Closed carry none.
const capaSteps = [
  { label: 'Draft' },
  { label: 'In Review', description: 'by Sarah Johnson (QA)' },
  { label: 'In Approval', description: 'by Sarah Johnson (QA)' },
  { label: 'Action In Progress', description: '0/0 Actions Submitted' },
  { label: 'Final Approval', description: 'by Amit Patel' },
  { label: 'Closed' },
];

// Same flow with no supporting lines — labels only
const capaStepsPlain = capaSteps.map(({ label }) => ({ label }));

// ─── Default — CAPA workflow, step 2 active ───────────────────────────────────

export const Default: Story = {
  args: { steps: capaSteps, currentStep: 2, orientation: 'horizontal' },
  render: (args) => (
    <div className="w-full max-w-5xl p-6 bg-[var(--color-background-default)]">
      <Stepper {...args} aria-label="CAPA progress" />
    </div>
  ),
};

// ─── Progression ──────────────────────────────────────────────────────────────

export const FirstStep: Story = {
  args: { steps: capaSteps, currentStep: 1 },
  render: (args) => (
    <div className="w-full max-w-5xl p-6 bg-[var(--color-background-default)]">
      <Stepper {...args} aria-label="CAPA progress" />
    </div>
  ),
};

export const LastStep: Story = {
  args: { steps: capaSteps, currentStep: 6 },
  render: (args) => (
    <div className="w-full max-w-5xl p-6 bg-[var(--color-background-default)]">
      <Stepper {...args} aria-label="CAPA progress" />
    </div>
  ),
};

export const AllComplete: Story = {
  args: { steps: capaSteps, currentStep: 7 },
  render: (args) => (
    <div className="w-full max-w-5xl p-6 bg-[var(--color-background-default)]">
      <Stepper {...args} aria-label="CAPA progress" />
    </div>
  ),
};

// ─── No descriptions — labels only ────────────────────────────────────────────

export const WithoutDescriptions: Story = {
  args: { steps: capaStepsPlain, currentStep: 2 },
  render: (args) => (
    <div className="w-full max-w-5xl p-6 bg-[var(--color-background-default)]">
      <Stepper {...args} aria-label="CAPA progress" />
    </div>
  ),
};

// ─── Short — 3 steps ──────────────────────────────────────────────────────────

export const ThreeSteps: Story = {
  args: {
    steps: [{ label: 'Details' }, { label: 'Review' }, { label: 'Submit' }],
    currentStep: 2,
  },
  render: (args) => (
    <div className="w-full max-w-2xl p-6 bg-[var(--color-background-default)]">
      <Stepper {...args} />
    </div>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  args: { steps: capaSteps, currentStep: 2, orientation: 'vertical' },
  render: (args) => (
    <div className="w-80 p-6 bg-[var(--color-background-default)]">
      <Stepper {...args} aria-label="CAPA progress" />
    </div>
  ),
};

// ─── Interactive — complete and current are clickable, upcoming are not ───────

export const Clickable: Story = {
  args: { steps: capaSteps, currentStep: 3 },
  render: function Render(args) {
    // Progress is where the process actually is — clicking to review an earlier
    // step must NOT rewind it, or the later steps become "upcoming", turn
    // unclickable, and strand the user with no way back to the current step.
    const progress = args.currentStep;
    const [viewing, setViewing] = React.useState(progress);

    return (
      <div className="w-full max-w-5xl p-6 bg-[var(--color-background-default)] flex flex-col gap-4">
        <Stepper
          {...args}
          currentStep={progress}
          onStepClick={setViewing}
          aria-label="CAPA progress"
        />
        <p className="text-sm text-[var(--color-text-secondary)]">
          Progress is at step {progress} — <strong>{capaSteps[progress - 1].label}</strong>.
          Viewing step {viewing} — <strong>{capaSteps[viewing - 1].label}</strong>.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Click any completed step to review it, then click step {progress} to come back.
          Upcoming steps stay disabled — you cannot skip ahead.
        </p>
      </div>
    );
  },
};
