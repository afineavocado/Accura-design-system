"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// ─── AlertDialog ──────────────────────────────────────────────────────────────
// Tokens (from Alert.md — Figma 152:3240):
//
// AlertDialogOverlay (backdrop):
//   fill: color/background/inverted @ opacity/overlay (50%)
//
// AlertDialogContent (popup):
//   fill:    color/surface/overlay
//   stroke:  color/border/default · 1px · INSIDE
//   radius:  radius/lg
//   padding: spacing/component/xl (24px) — alert-dialog uses xl, Dialog uses lg
//   gap:     spacing/component/lg (16px)
//   shadow:  none
//
// AlertDialogTitle:       color/surface/overlay/foreground
// AlertDialogDescription: color/text/secondary
// AlertDialogFooter gap:  spacing/component/sm (8px)
// AlertDialogHeader gap:  spacing/component/xs (4px)
//
// AlertDialogAction/Cancel use buttonVariants — button component owns its tokens.
// Do not override button fills from inside this component.

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

// ─── AlertDialogOverlay ───────────────────────────────────────────────────────

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50",
      "bg-[var(--color-background-inverted)]/50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

// ─── AlertDialogContent ───────────────────────────────────────────────────────
// padding: spacing/component/xl (24px) — note: larger than Dialog's spacing/component/lg

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
    container?: HTMLElement | null
  }
>(({ className, container, ...props }, ref) => (
  <AlertDialogPortal container={container ?? undefined}>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
        "flex flex-col w-full max-w-lg",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--color-border-default)]",
        "bg-[var(--color-surface-overlay)]",
        "p-[var(--spacing-component-xl)]",
        "gap-[var(--spacing-component-lg)]",
        // No shadow — spec has no shadow effect
        "duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

// ─── AlertDialogHeader ────────────────────────────────────────────────────────

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-[var(--spacing-component-xs)]",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

// ─── AlertDialogFooter ────────────────────────────────────────────────────────
// Default: Inline layout — buttons right-aligned with spacing/component/sm gap.

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-row justify-end gap-[var(--spacing-component-sm)]",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

// ─── AlertDialogTitle ─────────────────────────────────────────────────────────

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-snug",
      "text-[var(--color-surface-overlay-foreground)]",
      className
    )}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

// ─── AlertDialogDescription ───────────────────────────────────────────────────

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--color-text-secondary)]", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

// ─── AlertDialogAction ────────────────────────────────────────────────────────
// Uses buttonVariants — pass variant="destructive" for destructive confirmations.
// Button component owns all token bindings — do not override fills here.

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

// ─── AlertDialogCancel ────────────────────────────────────────────────────────

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), className)}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
