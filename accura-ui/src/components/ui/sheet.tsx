"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { XClose } from "@untitledui/icons";

import { cn } from "@/lib/utils"

// ─── Sheet ────────────────────────────────────────────────────────────────────
// Built on Radix UI Dialog (same primitive as Dialog — NOT Vaul like Drawer).
// Tokens (from Sheet.md — verified against Figma 98:57748):
//
// Shell:
//   fill:    color/surface/overlay
//   stroke:  color/border/default · 1px
//   radius:  radius/lg on exposed edge only (screen-edge corners = 0)
//   padding: none on root — each section owns its spacing
//   shadow:  none (Figma: 0 effects)
//
// sheet-header (H layout):
//   padding: spacing/component/lg (16px) all sides
//   gap:     spacing/component/md (12px) — between text-block and close button
//   title:   color/surface/overlay/foreground
//   description: color/text/secondary
//
// sheet-body (SLOT):
//   padding: spacing/component/lg (16px)
//
// sheet-footer (V layout — stacked buttons):
//   padding:   spacing/component/lg (16px)
//   gap:       spacing/component/sm (8px)
//   separator: color/border/default (top stroke)

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

// ─── SheetOverlay ─────────────────────────────────────────────────────────────

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
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
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

// ─── sheetVariants ────────────────────────────────────────────────────────────
// No root padding or gap — each section (header/body/footer) owns its spacing.
// Radius on exposed edge only — screen-edge corners stay at 0.

const sheetVariants = cva(
  [
    "fixed z-50 flex flex-col",
    // Surface — no shadow (Figma: 0 effects)
    "bg-[var(--color-surface-overlay)]",
    "border border-[var(--color-border-default)]",
    // Animation
    "transition ease-in-out",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:duration-300 data-[state=open]:duration-500",
  ].join(" "),
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0",
          "rounded-b-[var(--radius-lg)]",
          "border-t-0",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ].join(" "),
        bottom: [
          "inset-x-0 bottom-0",
          "rounded-t-[var(--radius-lg)]",
          "border-b-0",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ].join(" "),
        left: [
          "inset-y-0 left-0 h-full w-full max-w-[380px]",
          "rounded-r-[var(--radius-lg)]",
          "border-l-0",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ].join(" "),
        right: [
          "inset-y-0 right-0 h-full w-full max-w-[380px]",
          "rounded-l-[var(--radius-lg)]",
          "border-r-0",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ].join(" "),
      },
    },
    defaultVariants: { side: "right" },
  }
)

// ─── SheetContent ─────────────────────────────────────────────────────────────

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close
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
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

// ─── SheetHeader ──────────────────────────────────────────────────────────────
// Figma: H layout — [text-block (title + description)] + [close-button]
// In code: close button is absolute in SheetContent; header holds text-block only.
// padding: spacing/component/lg · gap: spacing/component/sm (title → description in text-block)

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col",
      "p-[var(--spacing-component-lg)]",
      "gap-[var(--spacing-component-sm)]",
      // Right-pad to leave room for the absolute close button
      "pr-[calc(var(--spacing-component-lg)+2rem)]",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

// ─── SheetFooter ──────────────────────────────────────────────────────────────
// Figma: V layout (stacked buttons — VERTICAL confirmed), top separator border.
// padding: spacing/component/lg · gap: spacing/component/sm

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-auto flex flex-col",
      "border-t border-[var(--color-border-default)]",
      "p-[var(--spacing-component-lg)]",
      "gap-[var(--spacing-component-sm)]",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

// ─── SheetTitle ───────────────────────────────────────────────────────────────
// fill: color/surface/overlay/foreground

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-snug",
      "text-[var(--color-surface-overlay-foreground)]",
      className
    )}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

// ─── SheetDescription ─────────────────────────────────────────────────────────
// fill: color/text/secondary

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--color-text-secondary)]", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
