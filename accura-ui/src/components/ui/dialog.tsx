"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XClose } from "@untitledui/icons";

import { cn } from "@/lib/utils"

// ─── Dialog ───────────────────────────────────────────────────────────────────
// Tokens (from Dialog.md — verified against Figma 266:131):
//
// DialogOverlay (backdrop):
//   fill: color/background/inverted @ opacity/overlay (50%)
//
// DialogContent (popup):
//   fill:    color/surface/default
//   stroke:  color/border/default · 1px · INSIDE
//   radius:  radius/lg (8px)
//   padding: spacing/component/lg (16px) all sides — Form / No close button types
//   gap:     spacing/component/lg (16px)
//   shadow:  none (Figma: 0 effects)
//
// DialogTitle:  color/surface/default/foreground
// DialogDescription: color/text/secondary
// DialogFooter gap (Form): spacing/component/sm (8px)
// DialogHeader gap: spacing/component/xs (4px)

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

// ─── DialogOverlay ────────────────────────────────────────────────────────────

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      // Backdrop: color/background/inverted at opacity/overlay (50%)
      "bg-[var(--color-background-inverted)]/50",
      // Animations
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// ─── DialogContent ────────────────────────────────────────────────────────────
// showClose prop (default true) — set to false for Type=No close button.

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showClose?: boolean
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, showClose = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Position — centered
        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
        // Layout
        "flex flex-col w-full max-w-lg",
        // Shape — no shadow (Figma: 0 effects)
        "rounded-[var(--radius-lg)]",
        "border border-[var(--color-border-default)]",
        "bg-[var(--color-surface-default)]",
        // Spacing — spacing/component/lg (16px) padding + gap
        "p-[var(--spacing-component-lg)]",
        "gap-[var(--spacing-component-lg)]",
        // Animations
        "duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
      {showClose && (
        <DialogPrimitive.Close
          className={cn(
            "absolute right-[var(--spacing-component-md)] top-[var(--spacing-component-md)]",
            "rounded-[var(--radius-sm)]",
            "text-[var(--color-text-secondary)]",
            "opacity-70 transition-opacity hover:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]",
            "data-[state=open]:bg-[var(--color-background-accent)]",
            "data-[state=open]:text-[var(--color-background-accent-foreground)]",
            "disabled:pointer-events-none",
          )}
        >
          <XClose className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// ─── DialogHeader ─────────────────────────────────────────────────────────────
// V AUTO-LAYOUT, gap: spacing/component/xs (4px). Always left-aligned.

const DialogHeader = ({
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
DialogHeader.displayName = "DialogHeader"

// ─── DialogFooter ─────────────────────────────────────────────────────────────
// H AUTO-LAYOUT, gap: spacing/component/sm (8px). Buttons right-aligned.

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter"

// ─── DialogTitle ──────────────────────────────────────────────────────────────
// heading/md: 18px / Semi Bold / leading-snug
// fill: color/surface/overlay/foreground

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-snug",
      "text-[var(--color-surface-default-foreground)]",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// ─── DialogDescription ────────────────────────────────────────────────────────
// body/sm: 14px / Regular
// fill: color/text/secondary

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-[var(--color-text-secondary)]",
      className
    )}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
