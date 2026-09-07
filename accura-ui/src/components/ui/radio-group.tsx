"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

// ─── RadioGroup ───────────────────────────────────────────────────────────────
// Container — manages mutual exclusion. No visual tokens on the root itself.
// Default gap-2 between items; override per usage (e.g. gap-0 for tight lists).

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn("grid gap-2", className)}
    {...props}
    ref={ref}
  />
))
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

// ─── RadioGroupItem ───────────────────────────────────────────────────────────
// Maps to Figma `radio` sub-component (96:33420) — the 16×16 indicator circle.
//
// Tokens (Figma confirmed):
//   Unchecked border:  color/input/border (zinc/300 — one step darker than border/default)
//   Checked border:    color/brand/primary
//   Disabled border:   color/border/disabled
//   Focus ring:        color/ring · 2px · OUTSIDE (no offset)
//   Invalid border:    color/border/error (via aria-invalid)
//   Disabled opacity:  opacity/disabled (0.6)
//
//   Dot (Checked only): 8×8px div · fill color/brand/primary · radius/full
//   The dot is a plain <div> — Figma shows it as a filled FRAME, not an SVG icon.

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      // Base — 16×16 circle
      "aspect-square h-4 w-4 rounded-full",
      // Border — unchecked default
      "border border-[var(--color-input-border)]",
      // Checked — border switches to brand/primary
      "data-[state=checked]:border-[var(--color-brand-primary)]",
      // Focus ring — OUTSIDE, no offset
      "focus:outline-none",
      "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
      // Disabled
      "disabled:cursor-not-allowed",
      "disabled:opacity-[calc(var(--opacity-disabled)/100)]",
      "disabled:border-[var(--color-border-disabled)]",
      // Invalid — red border + red ring instead of blue
      "[&[aria-invalid]]:border-[var(--color-border-error)]",
      "[&[aria-invalid]:focus-visible]:ring-[var(--color-border-error)]",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      {/* Dot: 8×8px filled circle — color/brand/primary, radius/full */}
      <div className="h-2 w-2 rounded-full bg-[var(--color-brand-primary)]" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
