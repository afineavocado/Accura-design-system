import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-[var(--spacing-component-xs)] border font-medium leading-none transition-colors [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-brand-primary)] border-transparent text-[var(--color-brand-primary-foreground)]",
        secondary:
          "bg-[var(--color-surface-accent)] border-[var(--color-border-default)] text-[var(--color-surface-accent-foreground)]",
        destructive:
          "bg-[var(--color-brand-destructive)] border-transparent text-[var(--color-brand-destructive-foreground)]",
        outline:
          "bg-transparent border-[var(--color-border-default)] text-[var(--color-surface-default-foreground)]",
        dashed:
          "bg-transparent border-dashed border-[var(--color-border-strong)] text-[var(--color-surface-default-foreground)]",
        // Status variants — Pill shape only per spec
        success:
          "bg-[var(--color-status-success-subtle)] border-transparent text-[var(--color-status-success-subtle-foreground)]",
        warning:
          "bg-[var(--color-status-warning-subtle)] border-[var(--color-border-warning)] text-[var(--color-status-warning-subtle-foreground)]",
        error:
          "bg-[var(--color-status-danger-subtle)] border-[var(--color-border-error)] text-[var(--color-status-danger-subtle-foreground)]",
        blue:
          "bg-[var(--color-status-info-subtle)] border-[var(--color-border-subtle)] text-[var(--color-status-info-subtle-foreground)]",
        // Presence variants — Pill shape only, dot-slot rendered in JSX
        online:
          "bg-transparent border-[var(--color-border-default)] text-[var(--color-surface-default-foreground)]",
        offline:
          "bg-transparent border-[var(--color-border-default)] text-[var(--color-surface-default-foreground)]",
        // Notification counter — always Small + Pill, number only
        notification:
          "bg-[var(--color-brand-primary)] border-transparent text-[var(--color-brand-primary-foreground)]",
      },
      shape: {
        // Shape controls geometry (radius) only
        default: "rounded-[var(--radius-md)]",
        pill: "rounded-full",
      },
      size: {
        // Small: 16px h, 4px px, label/sm (12px = text-xs)
        sm: "h-[var(--badge-badge-height-small)] px-[var(--spacing-component-xs)] text-xs",
        // Medium: 20px h, 8px px, label/sm (12px = text-xs)
        md: "h-[var(--badge-badge-height-medium)] px-[var(--spacing-component-sm)] text-xs",
        // Large: 24px h, 8px px, label/md (14px = text-sm)
        lg: "h-[var(--badge-badge-height-large)] px-[var(--spacing-component-sm)] text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "default",
      size: "sm",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// Presence dot colors — tokenised, not hardcoded
const dotToken: Partial<Record<NonNullable<BadgeProps["variant"]>, string>> = {
  online: "var(--color-status-success)",
  offline: "var(--color-status-offline)",
}

function Badge({ className, variant, shape, size, children, ...props }: BadgeProps) {
  const dot = variant && dotToken[variant]
  return (
    <div
      className={cn(badgeVariants({ variant, shape, size }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="shrink-0 rounded-full"
          style={{ width: 6, height: 6, backgroundColor: dot }}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
