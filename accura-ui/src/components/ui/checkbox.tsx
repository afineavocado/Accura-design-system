"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

// ─── Checkbox ─────────────────────────────────────────────────────────────────
// Tokens (from Checkbox.md — verified against Figma 59:18266):
//   16×16px · radius/md (6px)
//
// State       | Fill                      | Stroke
// ------------|---------------------------|-----------------------------
// Unchecked   | transparent               | color/input/border 1px INSIDE
// Hover       | color/background/accent   | color/brand/primary 1px INSIDE
// Focus       | transparent               | color/ring 2px OUTSIDE
// Checked     | color/brand/primary       | none
// Indeterminate | color/brand/primary     | none
// Disabled    | color/background/muted    | color/border/disabled 1px INSIDE
// CheckedDis. | color/background/muted    | color/border/disabled 1px INSIDE
// Invalid     | transparent               | color/border/error 1px INSIDE
//
// Checked/Indeterminate indicator color: color/brand/primary/foreground
// Checked Disabled indicator color: color/background/muted/foreground
//
// Indeterminate: Minus icon (dash). Uses group modifier to toggle icons per state.

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base — 16×16px square
      "group peer h-4 w-4 shrink-0",
      // Shape
      "rounded-[var(--radius-md)]",
      // Default (Unchecked): transparent fill + input/border stroke
      "border border-[var(--color-input-border)]",
      // Hover state
      "hover:bg-[var(--color-background-accent)]",
      "hover:border-[var(--color-brand-primary)]",
      // Focus ring — OUTSIDE, no offset
      "focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
      // Checked — brand/primary fill, no border needed (fill covers it)
      "data-[state=checked]:bg-[var(--color-brand-primary)]",
      "data-[state=checked]:border-transparent",
      // Indeterminate — same fill as Checked
      "data-[state=indeterminate]:bg-[var(--color-brand-primary)]",
      "data-[state=indeterminate]:border-transparent",
      // Disabled — muted fill + disabled border (no opacity — explicit tokens)
      "disabled:cursor-not-allowed",
      "disabled:bg-[var(--color-background-muted)]",
      "disabled:border-[var(--color-border-disabled)]",
      // Invalid — red border + red ring instead of blue
      "[&[aria-invalid]]:border-[var(--color-border-error)]",
      "[&[aria-invalid]:focus-visible]:ring-[var(--color-border-error)]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      {/* Check icon — shown when state=checked */}
      <Check
        className={cn(
          "h-3 w-3 text-[var(--color-brand-primary-foreground)]",
          // Hide when indeterminate
          "group-data-[state=indeterminate]:hidden",
          // Checked Disabled: use muted/foreground
          "group-data-[state=checked]:group-disabled:text-[var(--color-background-muted-foreground)]",
        )}
      />
      {/* Minus/dash icon — shown when state=indeterminate */}
      <Minus
        className={cn(
          "h-3 w-3 text-[var(--color-brand-primary-foreground)]",
          // Hide when checked
          "group-data-[state=checked]:hidden",
        )}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
