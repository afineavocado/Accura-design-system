"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

// ─── Select ───────────────────────────────────────────────────────────────────
// Tokens (from Select.md — verified against Figma 74:757):
//
// SelectTrigger — per state (all h-9 = 36px):
//   Default:  fill color/background/default · stroke color/input/border
//   Hover:    fill color/background/default · stroke color/border/hover
//   Open:     fill color/background/default · stroke color/border/focus + focus ring
//   Filled:   fill color/background/default · stroke color/input/border · value text foreground
//   Disabled: fill color/background/muted  · stroke color/border/disabled (NO opacity — explicit tokens)
//   Invalid:  fill color/background/default · stroke color/border/error
//
//   Placeholder text:  color/input/placeholder (all states except Filled and Disabled)
//   Value text:        color/background/default/foreground (Filled)
//   Disabled text:     color/text/disabled
//   Icon:              color/icon/default (all states except Disabled)
//   Icon disabled:     color/icon/disabled
//
// SelectContent: color/surface/overlay fill · color/border/default border · radius/md
// SelectItem hover: color/background/accent fill · color/background/accent/foreground text
// SelectItem disabled: opacity/disabled

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

// ─── SelectTrigger ────────────────────────────────────────────────────────────

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base — 36px height, full width, flex row
      "group flex h-9 w-full items-center justify-between",
      // Shape
      "rounded-[var(--radius-md)]",
      // Surface — Default
      "border border-[var(--color-input-border)] bg-[var(--color-input-bg)]",
      // Spacing
      "px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]",
      // Typography
      "text-sm text-[var(--color-background-default-foreground)]",
      // Placeholder text
      "data-[placeholder]:text-[var(--color-input-placeholder)]",
      // Hover state
      "hover:border-[var(--color-border-hover)]",
      // Open (focus) state
      "data-[state=open]:border-[var(--color-border-focus)]",
      "data-[state=open]:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]",
      "focus:outline-none",
      // Disabled state — explicit tokens, no opacity on the whole trigger
      "disabled:cursor-not-allowed",
      "disabled:bg-[var(--color-surface-muted)]",
      "disabled:border-[var(--color-border-disabled)]",
      "disabled:text-[var(--color-text-disabled)]",
      "disabled:data-[placeholder]:text-[var(--color-text-disabled)]",
      // Invalid state — compound selectors force higher specificity than data-[state=open]
      "[&[aria-invalid]]:border-[var(--color-border-error)]",
      "[&[aria-invalid]]:hover:border-[var(--color-border-error)]",
      "[&[aria-invalid][data-state=open]]:border-[var(--color-border-error)]",
      "[&[aria-invalid]]:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-border-error)_20%,transparent)]",
      // Clip long values
      "[&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-icon-default)] group-disabled:text-[var(--color-icon-disabled)]" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// ─── SelectScrollUpButton / SelectScrollDownButton ────────────────────────────

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4 text-[var(--color-icon-default)]" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4 text-[var(--color-icon-default)]" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

// ─── SelectContent ────────────────────────────────────────────────────────────
// Dropdown panel — color/surface/overlay fill, color/border/default border, radius/md.

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem]",
        "overflow-y-auto overflow-x-hidden",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--color-border-default)]",
        "bg-[var(--color-surface-overlay)]",
        "text-[var(--color-surface-overlay-foreground)]",
        "shadow-[var(--shadow-sm)]",
        // Animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "origin-[--radix-select-content-transform-origin]",
        position === "popper" && [
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1",
          "data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        ],
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          // Container: spacing/component/xxs (2px) padding all sides, gap between items
          "flex flex-col gap-0.5 p-0.5",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

// ─── SelectLabel ──────────────────────────────────────────────────────────────
// Group label — label/sm style, muted foreground.

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "py-1.5 pl-8 pr-2 text-xs font-medium text-[var(--color-text-secondary)]",
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

// ─── SelectItem ───────────────────────────────────────────────────────────────
// Hover: color/background/accent fill + accent/foreground text.
// Disabled: opacity/disabled on the item.

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // Layout — h-8 = 32px, flex row, vertically centered
      "flex h-8 w-full cursor-default select-none items-center",
      // Shape — radius/md per spec
      "rounded-[var(--radius-md)]",
      // Spacing — sm L/R (8px), xxs T/B implicit via h-8 + items-center
      "px-2",
      // Typography
      "text-sm text-[var(--color-background-default-foreground)]",
      "outline-none",
      // State: Hover / Focused — background/accent + foreground
      "focus:bg-[var(--color-background-accent)]",
      "focus:text-[var(--color-background-accent-foreground)]",
      // State: Selected — brand/primary text, transparent bg (no checkmark per spec)
      "data-[state=checked]:text-[var(--color-brand-primary)]",
      // State: Disabled
      "data-[disabled]:pointer-events-none",
      "data-[disabled]:text-[var(--color-text-disabled)]",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

// ─── SelectSeparator ──────────────────────────────────────────────────────────

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[var(--color-border-default)]", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
