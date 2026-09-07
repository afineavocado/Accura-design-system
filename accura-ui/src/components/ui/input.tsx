import * as React from "react"

import { cn } from "@/lib/utils"

// ─── Input ────────────────────────────────────────────────────────────────────
// Tokens:
//   fill         = color/input/bg (all states except Disabled)
//   fill         = color/surface/muted (Disabled)
//   stroke       = color/input/border (Default, Filled)
//   stroke       = color/border/hover (Hover)
//   stroke       = color/border/focus (Focused — paired with focus/ring box-shadow)
//   stroke       = color/border/disabled (Disabled)
//   stroke       = color/border/error (Invalid, via aria-invalid)
//   radius       = radius/md
//   padding X    = spacing/component/md (12px)
//   padding Y    = spacing/component/xs (4px)
//   placeholder  = color/input/placeholder
//   value text   = color/surface/default/foreground (Filled)
//   disabled text = color/text/disabled
//   height       = 36px (h-9)

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Layout
          "flex h-9 w-full",
          // Shape
          "rounded-[var(--radius-md)]",
          // Surface
          "border border-[var(--color-input-border)] bg-[var(--color-input-bg)]",
          // Spacing
          "px-[var(--spacing-component-md)] py-[var(--spacing-component-xs)]",
          // Typography
          "text-sm text-[var(--color-surface-default-foreground)]",
          // Placeholder
          "placeholder:text-[var(--color-input-placeholder)]",
          // File input
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--color-surface-default-foreground)]",
          // Hover state
          "hover:border-[var(--color-border-hover)]",
          // Focus state — border + ring glow
          "focus-visible:outline-none",
          "focus-visible:border-[var(--color-border-focus)]",
          "focus-visible:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]",
          // Disabled state
          "disabled:cursor-not-allowed",
          "disabled:bg-[var(--color-surface-muted)]",
          "disabled:text-[var(--color-text-disabled)]",
          "disabled:placeholder:text-[var(--color-text-disabled)]",
          "disabled:border-[var(--color-border-disabled)]",
          // Invalid — compound selectors force higher specificity than focus-visible
          "[&[aria-invalid]]:border-[var(--color-border-error)]",
          "[&[aria-invalid]:focus-visible]:border-[var(--color-border-error)]",
          "[&[aria-invalid]]:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-border-error)_20%,transparent)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
