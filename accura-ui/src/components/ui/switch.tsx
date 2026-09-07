"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ─── Switch ───────────────────────────────────────────────────────────────────
// Tokens (from Switch.md — verified against Figma 67:88):
//
// Track — Checked=False: color/border/default
// Track — Checked=True:  color/brand/primary
// Thumb:                 color/background/default (always — no shadow)
// Focus ring:            color/ring · 2px · OUTSIDE
// Disabled:              opacity/disabled (0.6) on entire component — no fill change
//
// Sizes (Figma confirmed):
//   Default: track 44×24px · thumb 20×20px · checked translate-x-5 (20px)
//   Sm:      track 28×16px · thumb 12×12px · checked translate-x-3 (12px)
//
// Note: border-2 border-transparent on the root is a layout device, not a real border.
// It creates 2px of inset space so the thumb sits inside the track with equal margin.

const switchTrackVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer items-center rounded-full",
    "border-2 border-transparent",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
    "disabled:cursor-not-allowed disabled:opacity-[calc(var(--opacity-disabled)/100)]",
    "data-[state=checked]:bg-[var(--color-brand-primary)]",
    "data-[state=unchecked]:bg-[var(--color-border-default)]",
  ].join(" "),
  {
    variants: {
      size: {
        default: "h-6 w-11",
        sm: "h-4 w-7",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const switchThumbVariants = cva(
  [
    "pointer-events-none block rounded-full",
    "bg-[var(--color-background-default)]",
    "transition-transform",
    "data-[state=unchecked]:translate-x-0",
  ].join(" "),
  {
    variants: {
      size: {
        default: "h-5 w-5 data-[state=checked]:translate-x-5",
        sm: "h-3 w-3 data-[state=checked]:translate-x-3",
      },
    },
    defaultVariants: { size: "default" },
  }
)

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchTrackVariants> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchTrackVariants({ size }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(switchThumbVariants({ size }))}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
