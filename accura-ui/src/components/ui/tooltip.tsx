"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

// ─── Tooltip ──────────────────────────────────────────────────────────────────
// Tokens (from Tooltip.md — Figma 74:1682 / 74:1699):
//
// Component tokens alias the semantic inverted surface (auto-inverts per mode):
//   tooltip/bg → color/background/inverted → Light: zinc/900 #18181b · Dark: zinc/50 #fafafa
//   tooltip/fg → color/background/inverted/foreground → Light: white #ffffff · Dark: black #000000
//
//   tokens.css sets --tooltip-bg: var(--color-background-inverted) so the .dark
//   override of --color-background-inverted cascades automatically — no component-
//   level dark class needed.
//
// Bubble fill:   tooltip/bg (--tooltip-bg)
// Label fill:    tooltip/fg (--tooltip-fg)
// Padding:       spacing/component/md (12px) L/R · spacing/component/xs-plus (6px) T/B
// Radius:        radius/md
// Text style:    label/sm — text-xs font-medium leading-none
// Border:        none — tooltip is a filled pill with no stroke
// Shadow:        none
//
// Provider: delayDuration=300ms (system default — faster than Radix's 700ms), skipDelayDuration=300ms.

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Layout
      "z-50 overflow-visible",
      // Shape — no border, no shadow (just a filled dark pill)
      "rounded-[var(--radius-md)]",
      // Surface — component tokens: always-dark regardless of theme
      "bg-[var(--tooltip-bg)]",
      "text-[var(--tooltip-fg)]",
      // Spacing — spacing/component/md (12px) × spacing/component/xs-plus (6px)
      "px-[var(--spacing-component-md)] py-[var(--spacing-component-xs-plus)]",
      // Typography — label/sm: 12px / Medium / leading-none
      "text-xs font-medium leading-none",
      // Animations
      "animate-in fade-in-0 zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "origin-[--radix-tooltip-content-transform-origin]",
      className
    )}
    {...props}
  >
    {children}
    {/* Arrow — same fill as bubble (--tooltip-bg), Radix auto-rotates per side */}
    <TooltipPrimitive.Arrow
      className="fill-[var(--tooltip-bg)] stroke-[var(--tooltip-bg)]"
      width={11}
      height={5}
      style={{ strokeWidth: 1, strokeLinejoin: "round" }}
    />
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
