import * as React from "react"

import { cn } from "@/lib/utils"

// ─── Card shell ───────────────────────────────────────────────────────────────
// Tokens:
//   fill       = color/surface/overlay    → var(--color-surface-overlay)    #ffffff
//   stroke     = color/border/default     → var(--color-border-default)     #e4e4e7  (default)
//              = color/border/strong      → use className override for Border variant
//   radius     = radius/lg               → var(--radius-lg)                 8px
//   padding    = spacing/component/lg    → var(--spacing-component-lg)      16px (all sides)
//   gap        = spacing/component/lg    → var(--spacing-component-lg)      16px (between sections)
//   (16px is the data/default density; pass p-[var(--spacing-component-xl)] for prose/feature cards)
//
// No shadow — spec does not include a shadow token on the card shell.
// Padding lives HERE — not repeated on CardHeader / CardContent / CardFooter.

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col",
      "rounded-[var(--radius-lg)]",
      "border border-[var(--color-border-default)]",
      "bg-[var(--color-surface-overlay)]",
      "p-[var(--spacing-component-lg)]",
      "gap-[var(--spacing-component-lg)]",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// ─── CardHeader ───────────────────────────────────────────────────────────────
// Tokens:
//   gap = spacing/component/xs → var(--spacing-component-xs) 4px
// No padding — Card shell owns all padding.

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-[var(--spacing-component-xs)]",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// ─── CardTitle ────────────────────────────────────────────────────────────────
// Text style: heading/sm — 16px / Semi Bold / 0px tracking / 22px lh
// Token: color/surface/overlay/foreground → var(--color-surface-overlay-foreground) #18181b

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-base font-semibold leading-snug",
      "text-[var(--color-surface-overlay-foreground)]",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// ─── CardDescription ─────────────────────────────────────────────────────────
// Text style: body/sm — 14px / Regular / 0px tracking
// Token: color/text/secondary → var(--color-text-secondary) #52525b

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm text-[var(--color-text-secondary)]",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// ─── CardContent ─────────────────────────────────────────────────────────────
// Default: V AUTO-LAYOUT, gap = spacing/component/lg (16px)
// No padding — Card shell owns all padding.

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-[var(--spacing-component-lg)]",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

// ─── CardFooter ───────────────────────────────────────────────────────────────
// H AUTO-LAYOUT, gap = spacing/component/sm (8px)
// No padding — Card shell owns all padding.

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-[var(--spacing-component-sm)]",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
