"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

// ─── Drawer ───────────────────────────────────────────────────────────────────
// Tokens (from Drawer.md — verified against Figma 74:691):
//
// DrawerOverlay (backdrop):
//   fill: color/background/inverted @ opacity/overlay (50%)
//
// DrawerContent (panel):
//   fill:   color/surface/default
//   stroke: color/border/default · 1px
//   radius: radius/lg on exposed edge only
//     Direction=Bottom: top-left + top-right rounded, bottom = 0
//     Direction=Right:  top-left + bottom-left rounded, right = 0
//
// handle-bar (Direction=Bottom only):
//   padding T/B: spacing/component/lg (16px) — no L/R padding
//   handle pill: 100×8px · fill color/background/muted · radius/full
//
// DrawerHeader:
//   padding: spacing/component/lg (16px) all sides
//   gap: spacing/component/xxs (2px) — Figma confirmed
//   title fill:       color/background/default/foreground
//   description fill: color/background/muted/foreground
//
// DrawerFooter:
//   layout: VERTICAL (buttons stacked — Figma confirmed)
//   padding: spacing/component/lg (16px) all sides
//   gap: spacing/component/sm (8px) between buttons

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close

// ─── DrawerOverlay ────────────────────────────────────────────────────────────

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-[var(--color-background-inverted)]/50",
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

// ─── DrawerContent ────────────────────────────────────────────────────────────
// Direction=Bottom: rounded-t (top-left + top-right). Anchored to bottom edge.
// Direction=Right:  rounded-l (top-left + bottom-left). Anchored to right edge.
// Direction passed via Vaul root — content class applies radius per direction.
// Handle-bar (with pill) is rendered for Bottom direction by default.
// Pass showHandle={false} to hide it for Right/Responsive drawers.

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  showHandle?: boolean
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(({ className, children, showHandle = true, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col",
        // Bottom direction (default) — slides from bottom, top corners rounded
        "inset-x-0 bottom-0 rounded-t-[var(--radius-lg)]",
        // Surface
        "border border-[var(--color-border-default)]",
        "bg-[var(--color-surface-default)]",
        className
      )}
      {...props}
    >
      {/* handle-bar — Direction=Bottom only */}
      {showHandle && (
        <div className="flex items-center justify-center py-[var(--spacing-component-lg)]">
          <div className="h-2 w-[100px] rounded-full bg-[var(--color-background-muted)]" />
        </div>
      )}
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

// ─── DrawerHeader ─────────────────────────────────────────────────────────────
// Padding: spacing/component/lg (16px) all sides. Gap: spacing/component/xxs (2px).
// Always left-aligned — no responsive text-center override.

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col",
      "p-[var(--spacing-component-lg)]",
      "gap-[var(--spacing-component-xxs)]",
      className
    )}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

// ─── DrawerFooter ─────────────────────────────────────────────────────────────
// Layout: VERTICAL (stacked buttons — Figma confirmed).
// Padding: spacing/component/lg (16px). Gap: spacing/component/sm (8px).
// Order: btn-primary first (top), btn-outline second (bottom).

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col",
      "p-[var(--spacing-component-lg)]",
      "gap-[var(--spacing-component-sm)]",
      className
    )}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

// ─── DrawerTitle ──────────────────────────────────────────────────────────────
// heading/md: 18px / Semi Bold / leading-snug
// fill: color/background/default/foreground (not surface/overlay/foreground — see spec)

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-snug",
      "text-[var(--color-background-default-foreground)]",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

// ─── DrawerDescription ────────────────────────────────────────────────────────
// fill: color/background/muted/foreground

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-[var(--color-background-muted-foreground)]",
      className
    )}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
