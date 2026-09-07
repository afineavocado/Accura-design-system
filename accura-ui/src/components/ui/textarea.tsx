import * as React from "react"

import { cn } from "@/lib/utils"

// ─── Textarea ─────────────────────────────────────────────────────────────────
// Tokens (from Input.md — Textarea is Type=Textarea in the Figma input component set):
//   fill         = color/input/bg (all states except Disabled)
//   fill         = color/surface/muted (Disabled)
//   stroke       = color/input/border (Default, Filled)
//   stroke       = color/border/hover (Hover)
//   stroke       = color/border/focus (Focused — paired with focus/ring box-shadow)
//   stroke       = color/border/disabled (Disabled)
//   stroke       = color/border/error (Invalid, via aria-invalid)
//   radius       = radius/md
//   padding X    = spacing/component/md (12px)
//   padding Y    = spacing/component/sm (8px) — textarea uses sm, Input uses xs
//   placeholder  = color/input/placeholder
//   value text   = color/background/default/foreground
//   disabled text = color/text/disabled
//   min-height   = 120px (spec)

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Layout
        "flex min-h-[120px] w-full",
        // Shape
        "rounded-[var(--radius-md)]",
        // Surface
        "border border-[var(--color-input-border)] bg-[var(--color-input-bg)]",
        // Spacing
        "px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]",
        // Typography
        "text-sm text-[var(--color-background-default-foreground)]",
        // Placeholder
        "placeholder:text-[var(--color-input-placeholder)]",
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
        // Invalid — red border always, red ring instead of blue
        "[&[aria-invalid]]:border-[var(--color-border-error)]",
        "[&[aria-invalid]:focus-visible]:border-[var(--color-border-error)]",
        "[&[aria-invalid]]:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-border-error)_20%,transparent)]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
