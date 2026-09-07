import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, Ellipsis } from "lucide-react"

import { cn } from "@/lib/utils"

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
// Tokens (from Breadcrumb.md — verified against Figma 291:223 / 52:13919):
//   BreadcrumbLink default    = color/text/secondary
//   BreadcrumbLink hover      = color/background/default/foreground
//   BreadcrumbLink focus ring = color/ring, 2px, radius/sm
//   BreadcrumbPage (current)  = color/background/default/foreground
//   Separator chevron stroke  = color/background/default/foreground
//   Separator slash/dot fill  = color/background/muted/foreground
//   Gap between items         = spacing/component/xs (4px)

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & { separator?: React.ReactNode }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-[var(--spacing-component-xs)] break-words text-sm",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-[var(--spacing-component-xs)]", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

// ─── BreadcrumbLink ───────────────────────────────────────────────────────────
// Current=False: default = color/text/secondary, hover = color/background/default/foreground
// Focus: color/ring ring, 2px, radius/sm

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"
  return (
    <Comp
      ref={ref}
      className={cn(
        "text-[var(--color-text-secondary)]",
        "transition-colors hover:text-[var(--color-background-default-foreground)]",
        "focus-visible:outline-none",
        "focus-visible:rounded-[var(--radius-sm)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
        className
      )}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

// ─── BreadcrumbPage ───────────────────────────────────────────────────────────
// Current=True: color/background/default/foreground — non-interactive, not focusable

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn(
      "font-normal text-[var(--color-background-default-foreground)]",
      className
    )}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

// ─── BreadcrumbSeparator ──────────────────────────────────────────────────────
// Chevron: color/background/default/foreground stroke (via icon)
// Slash / Dot: pass as children — color/background/muted/foreground

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(
      "text-[var(--color-background-muted-foreground)] [&>svg]:h-3.5 [&>svg]:w-3.5",
      className
    )}
    {...props}
  >
    {children ?? (
      <ChevronRight className="text-[var(--color-background-default-foreground)]" />
    )}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

// ─── BreadcrumbEllipsis ───────────────────────────────────────────────────────
// Display-only — no built-in expand/collapse logic (see Breadcrumb.md Behavior)

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <Ellipsis className="h-4 w-4 text-[var(--color-text-secondary)]" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
