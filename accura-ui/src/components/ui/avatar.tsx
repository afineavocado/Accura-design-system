"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ─── Size CVA ─────────────────────────────────────────────────────────────────
// SM=32px · Default=40px · LG=56px  (spec: all fixed square, never hug/fill)

const avatarSizeVariants = cva(
  "flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm:      "h-8 w-8",    // 32 × 32px — spec Size=SM
        default: "h-10 w-10",  // 40 × 40px — spec Size=Default
        lg:      "h-14 w-14",  // 56 × 56px — spec Size=LG
      },
    },
    defaultVariants: { size: "sm" },
  }
)

// ─── Primitive sub-components ─────────────────────────────────────────────────
// Exported for advanced composition; the unified Avatar wrapper covers most uses.

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarSizeVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarSizeVariants({ size }), className)}
    {...props}
  />
))
AvatarRoot.displayName = "AvatarRoot"

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> &
    Pick<VariantProps<typeof avatarSizeVariants>, "size">
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      // Tokens: fill = color/surface/muted, text = color/surface/muted/foreground
      "flex h-full w-full items-center justify-center rounded-full font-medium",
      "bg-[var(--color-surface-muted)] text-[var(--color-surface-muted-foreground)]",
      // Text size: label/sm (12px = text-xs) for SM, label/md (14px = text-sm) for Default + LG
      size === "sm" ? "text-xs" : "text-sm",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// ─── Indicator (avatar-indicator sub-component) ────────────────────────────────
// Presence dot — pure filled circle, no stroke (spec: "No stroke — the indicator is a pure filled dot")
//
// Token map:
//   online  → color/status/success  = var(--color-status-success)  #22c55e
//   offline → color/status/offline  = var(--color-status-offline)  #e4e4e7
//
// Size pairing (spec):
//   size=Default (8px)  — use with Size=SM avatars
//   size=large   (12px) — use with Size=Default and Size=LG avatars

const indicatorFill: Record<"online" | "offline", string> = {
  online:  "var(--color-status-success)",
  offline: "var(--color-status-offline)",
}

const indicatorPx: Record<"sm" | "default" | "lg", number> = {
  sm:      8,
  default: 12,
  lg:      12,
}

// ─── Unified Avatar wrapper ────────────────────────────────────────────────────

export interface AvatarProps {
  /** Avatar size — sm=32px / default=40px / lg=56px */
  size?: "sm" | "default" | "lg"
  /** Photo URL — AvatarImage renders when provided; falls back to initials on error */
  src?: string
  /** Full name — used as accessible alt text */
  name?: string
  /** 1–2 initials — shown when image is absent or fails to load */
  fallback?: string
  /** Show online/offline presence indicator */
  badge?: "online" | "offline"
  /** Accessible label for the indicator, e.g. "Online" */
  badgeLabel?: string
  className?: string
}

function Avatar({
  size = "sm",
  src,
  name = "",
  fallback,
  badge,
  badgeLabel,
  className,
}: AvatarProps) {
  const dotColor = badge ? indicatorFill[badge] : null
  const dotPx    = indicatorPx[size]

  return (
    // Outer div is the positioning context for the indicator dot.
    // AvatarRoot has overflow-hidden (clips the circle) so the indicator
    // must live outside it — here, as an absolute sibling.
    <div className={cn("relative inline-flex shrink-0", className)}>
      <AvatarRoot size={size}>
        {src && <AvatarImage src={src} alt={name} />}
        <AvatarFallback size={size}>{fallback}</AvatarFallback>
      </AvatarRoot>
      {dotColor && (
        <span
          aria-hidden="true"
          role="img"
          aria-label={badgeLabel}
          className="absolute bottom-0 right-0 rounded-full"
          style={{ width: dotPx, height: dotPx, backgroundColor: dotColor }}
        />
      )}
    </div>
  )
}

Avatar.displayName = "Avatar"

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback }
