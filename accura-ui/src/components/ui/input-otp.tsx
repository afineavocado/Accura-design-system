"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

// ─── InputOTP ─────────────────────────────────────────────────────────────────
// Built on input-otp by Guilherme Rodz, wrapped by shadcn.
// Tokens (from Input-OTP.md — verified against Figma 58:17340):
//
// _input-otp-slot — 40×40px, no radius (radius is on otp-group):
//   Empty:    fill background/default · stroke border/default 1px INSIDE
//   Active:   fill background/default · stroke border/focus 1px INSIDE + fake caret
//   Filled:   fill background/default · stroke border/default 1px INSIDE · digit foreground
//   Disabled: fill background/muted   · stroke border/disabled · text text/disabled
//   Invalid:  fill background/default · stroke border/error 1px INSIDE · digit foreground
//
// otp-group: radius/md + stroke (same color as slots in that state)
// separator: color/background/muted/foreground
// group gap: spacing/component/sm = gap-2

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-[calc(var(--opacity-disabled)/100)]",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

// ─── InputOTPGroup ────────────────────────────────────────────────────────────
// The bordered container around a set of slots. radius/md + border/default.
// invalid=true → border/error. Uses `group` + `data-invalid` so slots can
// switch their inset shadow via group-data-[invalid=true]: selector.

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <div
    ref={ref}
    data-invalid={invalid || undefined}
    className={cn(
      "group flex items-center",
      className
    )}
    {...props}
  />
))
InputOTPGroup.displayName = "InputOTPGroup"

// ─── InputOTPSlot ─────────────────────────────────────────────────────────────
// Individual 40×40px cell. No radius (group owns radius via overflow-hidden).
// Slots within a group share borders — each slot except the first gets border-l.

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { slots } = inputOTPContext

  const slot = slots[index]
  if (!slot) return null

  const { char, hasFakeCaret, isActive } = slot

  return (
    <div
      ref={ref}
      className={cn(
        // Base — 40×40px fixed square
        "relative flex h-10 w-10 items-center justify-center",
        "text-sm font-medium",
        "transition-all",
        // Per-slot border — top + bottom + right; first slot adds left
        "border-y border-r border-[var(--color-border-default)]",
        "first:border-l",
        // Corner radius on outer slots (same radius as the ring below — seamless)
        "first:rounded-l-[var(--radius-md)] last:rounded-r-[var(--radius-md)]",
        // Fill + text
        "bg-[var(--color-background-default)]",
        "text-[var(--color-background-default-foreground)]",
        // Active state — ring-2 outside + z-10 so ring renders above adjacent slots
        // Shadcn pattern: ring follows slot's own border-radius — no mismatch
        isActive && [
          "z-10",
          "ring-2 ring-offset-0",
          "group-data-[invalid]:ring-[var(--color-border-error)]",
          "ring-[var(--color-border-focus)]",
        ],
        // Invalid border on all slots when group is invalid
        "group-data-[invalid]:border-[var(--color-border-error)]",
        className
      )}
      {...props}
    >
      {/* Digit or empty */}
      {char !== null ? (
        <span>{char}</span>
      ) : null}

      {/* Fake caret — Active state only */}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-[var(--color-background-default-foreground)] duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

// ─── InputOTPSeparator ────────────────────────────────────────────────────────
// Dash "–" between groups for Type=3+3.
// fill: color/background/muted/foreground

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" aria-hidden="true" {...props}>
    <Minus className="h-4 w-4 text-[var(--color-background-muted-foreground)]" />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
