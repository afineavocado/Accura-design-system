"use client";
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

// Source: input-otp.meta.json — Figma verified 58:17340 / 58:17437
// Built on input-otp library + shadcn wrapper. Single hidden <input> underneath.
//
// Tokens (slot states, Figma confirmed):
//   Empty:    background/default · border/default
//   Active:   background/default · border/focus + ring glow
//   Filled:   background/default · border/default · digit foreground
//   Disabled: background/muted   · border/disabled (opacity/disabled on container)
//   Invalid:  background/default · border/error · digit foreground
//   Group:    radius/md · overflow-hidden (clips slot corners)
//   Separator: background/muted/foreground
//
// Cross-check (meta.json Type variants): 6-Slot ✓  3+3 ✓  4-Slot ✓
// States: Empty ✓  Active(interaction) ✓  Disabled ✓  Invalid ✓

const meta = {
  title: 'Forms/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Type=6-Slot — email/authenticator ────────────────────────────────────────

export const SixSlot: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="story-6">Verification code</Label>
      <InputOTP id="story-6" maxLength={6} pattern={REGEXP_ONLY_DIGITS} autoComplete="one-time-code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-[var(--color-text-secondary)]">
        We sent a 6-digit code to your email.
      </p>
    </div>
  ),
};

// ─── Type=3+3 — formatted invite / recovery code ──────────────────────────────

export const ThreePlusThree: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="story-3-3">Invite code</Label>
      <InputOTP id="story-3-3" maxLength={6} autoComplete="one-time-code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Enter the code in XXX–XXX format.
      </p>
    </div>
  ),
};

// ─── Type=4-Slot — PIN ────────────────────────────────────────────────────────

export const FourSlot: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="story-4">PIN</Label>
      <InputOTP id="story-4" maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Enter your 4-digit PIN.
      </p>
    </div>
  ),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────
// opacity/disabled on container via has-[:disabled].

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="story-disabled">Verification code</Label>
      <InputOTP id="story-disabled" maxLength={6} disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
};

// ─── Invalid — after incorrect code submitted ──────────────────────────────────
// border/error on group. Show error message below — one message for whole control.

export const Invalid: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="story-invalid" className="text-[var(--color-text-invalid)]">
        Verification code
      </Label>
      <InputOTP id="story-invalid" maxLength={6} aria-invalid="true">
        <InputOTPGroup invalid>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-[var(--color-text-invalid)]">
        The code you entered is incorrect. Please try again.
      </p>
    </div>
  ),
};

// ─── All types ────────────────────────────────────────────────────────────────

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-[var(--color-text-secondary)]">6-Slot</p>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-[var(--color-text-secondary)]">3+3</p>
        <InputOTP maxLength={6}>
          <InputOTPGroup>{[0,1,2].map(i => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>{[3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-[var(--color-text-secondary)]">4-Slot</p>
        <InputOTP maxLength={4}>
          <InputOTPGroup>{[0,1,2,3].map(i => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
        </InputOTP>
      </div>
    </div>
  ),
};
