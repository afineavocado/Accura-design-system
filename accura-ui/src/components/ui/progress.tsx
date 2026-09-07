"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ─── Progress ─────────────────────────────────────────────────────────────────
// Tokens (from Progress.md — verified against Figma 110:8283):
//
// Track:  color/background/muted · radius/full
// Fill (Loading/Indeterminate): color/brand/primary · radius/full
// Fill (Complete, value=100):   color/status/success · radius/full
//
// Sizes (Figma confirmed):
//   SM → h-1 (4px)   MD → h-2 (8px, default)   LG → h-3 (12px)
//
// State in code is driven by value prop only:
//   value 0–99 → Loading    value=100 → Complete    value=null → Indeterminate
// Figma State/Size props are design documentation — no separate state prop in code.

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-[var(--color-background-muted)]",
  {
    variants: {
      size: {
        sm: "h-1",   // 4px
        md: "h-2",   // 8px — default
        lg: "h-3",   // 12px
      },
    },
    defaultVariants: { size: "md" },
  }
)

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, ...props }, ref) => {
  const isComplete = value === 100;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ size }), className)}
      {...props}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 rounded-full transition-all",
          // Complete → color/status/success · Loading/Indeterminate → color/brand/primary
          isComplete
            ? "bg-[var(--color-status-success)]"
            : "bg-[var(--color-brand-primary)]"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
