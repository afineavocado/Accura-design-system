import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ─── Alert shell ──────────────────────────────────────────────────────────────
// Tokens:
//   fill     = color/background/default (all variants)
//   stroke   = color/border/default (Default) | color/border/error (Destructive) | color/yellow/200 (Warning)
//   radius   = radius/lg
//   padding  = spacing/component/lg (16px)
//   gap      = spacing/component/sm (8px) — flat layout: title ↔ description
//
// Layout: flex-col (flat, no icon). For icon layout use explicit composition in
// the story: flex-row wrapper > icon + flex-col content (gap spacing/component/xxs).
//
// Text colors cascade via CSS descendant selectors on data-alert-title / data-alert-desc.
// Icon color cascades via [&_svg] selector.
//
// Warning uses primitive yellow tokens — intentional design decision (no semantic warning tokens).

const alertVariants = cva(
  "flex flex-col w-full rounded-[var(--radius-lg)] border p-[var(--spacing-component-lg)] gap-[var(--spacing-component-sm)]",
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--color-background-default)]",
          "border-[var(--color-border-default)]",
          "[&_[data-alert-title]]:text-[var(--color-background-default-foreground)]",
          "[&_[data-alert-desc]]:text-[var(--color-background-muted-foreground)]",
          "[&_svg]:text-[var(--color-background-default-foreground)]",
        ].join(" "),
        destructive: [
          "bg-[var(--color-background-default)]",
          "border-[var(--color-border-error)]",
          "[&_[data-alert-title]]:text-[var(--color-text-invalid)]",
          "[&_[data-alert-desc]]:text-[var(--color-text-secondary)]",
          "[&_svg]:text-[var(--color-icon-danger)]",
        ].join(" "),
        warning: [
          "bg-[var(--color-yellow-50)]",
          "border-[var(--color-yellow-200)]",
          "[&_[data-alert-title]]:text-[var(--color-yellow-900)]",
          "[&_[data-alert-desc]]:text-[var(--color-yellow-800)]",
          "[&_svg]:text-[var(--color-icon-warning)]",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

// ─── AlertTitle ───────────────────────────────────────────────────────────────
// Text style: label/md — 14px / Medium / leading-none
// Color: driven by parent Alert variant via [data-alert-title] selector

const AlertTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-alert-title=""
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

// ─── AlertDescription ─────────────────────────────────────────────────────────
// Text style: body/sm — 14px / Regular
// Color: driven by parent Alert variant via [data-alert-desc] selector

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-alert-desc=""
    className={cn("text-sm", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
