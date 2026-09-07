"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    // Stroke: color/border/default 1px — bottom border acts as separator between items
    className={cn("border-b border-[var(--color-border-default)]", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Layout — no horizontal padding, full-width, label left / chevron right
        "flex flex-1 items-center justify-between",
        // Spacing — padding T/B: spacing/component/lg (16px); gap: spacing/component/sm (8px)
        "py-[var(--spacing-component-lg)] gap-[var(--spacing-component-sm)]",
        // Typography — label/md weight, default foreground
        "font-medium text-sm text-[var(--color-surface-default-foreground)]",
        // Transition
        "transition-all",
        // Focus ring — color/ring 2px outside
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2",
        // Disabled — color/text/disabled on label + chevron
        "disabled:text-[var(--color-text-disabled)] disabled:cursor-not-allowed",
        // Chevron rotation when open
        "[&[data-state=open]_svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className="h-4 w-4 shrink-0 transition-transform duration-200"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    {/* padding bottom: spacing/component/lg (16px) · no top padding per spec */}
    {/* text color: color/text/secondary */}
    <div className={cn(
      "pb-[var(--spacing-component-lg)] pt-0",
      "text-[var(--color-text-secondary)]",
      className
    )}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
