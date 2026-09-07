"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

// ─── Tabs ─────────────────────────────────────────────────────────────────────
// Tokens (from Tabs.md — verified against Figma 59:17766 / 59:17793):
//
// TabsList — Variant=Default:
//   fill: color/surface/raised · radius: radius/lg · padding: spacing/component/xxs · gap: spacing/component/xxs
// TabsList — Variant=Line:
//   fill: transparent · border-bottom: color/border/default · no padding · gap: spacing/component/xxs
//
// TabsTrigger — Type=Default:
//   Default:  transparent fill · text: color/text/secondary
//   Hover:    color/surface/accent fill · text: color/text/secondary
//   Active:   color/surface/default fill · shadow: shadows/2xs · text: color/surface/default/foreground
//   Disabled: transparent fill · text: color/text/disabled
//
// TabsTrigger — Type=Line:
//   Default:  transparent fill · text: color/text/secondary · indicator: brand/primary opacity 0
//   Active:   transparent fill · text: color/surface/default/foreground · indicator: brand/primary opacity 1
//   Disabled: transparent fill · text: color/text/disabled · indicator: brand/primary opacity 0
//   (No Hover state on Type=Line)
//
// Typography: label/sm = text-xs font-medium leading-none

const Tabs = TabsPrimitive.Root

// ─── TabsList ─────────────────────────────────────────────────────────────────

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: "default" | "line"
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-[var(--spacing-component-xxs)]",
      // Variant=Default — filled pill container
      variant === "default" && [
        "rounded-[var(--radius-lg)]",
        "bg-[var(--color-surface-raised)]",
        "p-[var(--spacing-component-xxs)]",
      ],
      // Variant=Line — transparent with bottom border only
      variant === "line" && [
        "rounded-none",
        "border-b border-[var(--color-border-default)]",
        "bg-transparent",
        "p-0",
      ],
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

// ─── TabsTrigger ──────────────────────────────────────────────────────────────

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: "default" | "line"
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base — shared across both variants
      "inline-flex items-center justify-center whitespace-nowrap",
      "text-xs font-medium leading-none",
      "transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
      "disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]",

      // ── Type=Default ──────────────────────────────────────────────────────
      variant === "default" && [
        "rounded-[var(--radius-md)]",
        "px-[var(--spacing-component-md)] py-[var(--spacing-component-xs-plus)]",
        // Gap for optional leading icon ↔ label (no effect when label-only)
        "gap-[var(--spacing-component-xs-plus)]",
        // Resting text
        "text-[var(--color-text-secondary)]",
        // Hover — surface/accent fill
        "hover:bg-[var(--color-surface-accent)]",
        // Active — surface/default fill + shadows/2xs (= shadow-sm value)
        "data-[state=active]:bg-[var(--color-surface-default)]",
        "data-[state=active]:text-[var(--color-surface-default-foreground)]",
        "data-[state=active]:shadow-sm",
      ],

      // ── Type=Line ─────────────────────────────────────────────────────────
      // Indicator: 2px bottom border always present (transparent → brand/primary on active).
      // Keeps all Line states at consistent height — matches Figma indicator at opacity 0/1.
      variant === "line" && [
        "rounded-none",
        "px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]",
        // Gap for optional leading icon ↔ label (no effect when label-only)
        "gap-[var(--spacing-component-xs)]",
        // Resting text
        "text-[var(--color-text-secondary)]",
        // Indicator — always present, transparent by default
        "border-b-2 border-transparent",
        // Active — indicator becomes brand/primary, text becomes surface/default/foreground
        "data-[state=active]:border-[var(--color-brand-primary)]",
        "data-[state=active]:text-[var(--color-surface-default-foreground)]",
      ],

      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// ─── TabsContent ──────────────────────────────────────────────────────────────

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
