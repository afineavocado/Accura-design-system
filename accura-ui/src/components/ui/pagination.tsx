import * as React from "react"
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react"

import { cn } from "@/lib/utils"

// ─── Pagination ───────────────────────────────────────────────────────────────
// Tokens (from Pagination.md — verified against Figma 59:17863):
//
// _pagination-item sizes: 32×32px fixed (h-8 w-8), radius: radius/md
//
// Page Default:  fill color/background/default  · border color/border/default  · text color/background/default/foreground
// Page Hover:    fill color/background/accent    · border color/border/default  · text color/background/accent/foreground
// Page Active:   fill color/brand/primary        · no border                    · text color/brand/primary/foreground
// Page Disabled: fill color/background/muted     · border color/border/disabled · text color/text/disabled
//
// Prev/Next Default:  same fill/border as Page Default · icon stroke color/background/default/foreground
// Prev/Next Hover:    same fill/border as Page Hover   · icon stroke color/background/accent/foreground
// Prev/Next Disabled: fill color/background/muted · border color/border/disabled · icon stroke color/icon/disabled
//
// Ellipsis: fill color/background/default · border color/border/default · text color/background/muted/foreground
//
// PaginationContent gap (Basic/More/Disabled): spacing/component/xxs (2px)
// Override gap in story for Simple/WithTotal/ShowAll variants.

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "flex flex-row items-center gap-[var(--spacing-component-xxs)]",
      className
    )}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

// ─── PaginationLink ───────────────────────────────────────────────────────────
// 32×32px square page number button.
// Does NOT use buttonVariants — tokens differ from Button.

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-sm transition-colors",
      // Default / non-active
      !isActive && [
        "border border-[var(--color-border-default)]",
        "bg-[var(--color-background-default)]",
        "text-[var(--color-background-default-foreground)]",
        "hover:bg-[var(--color-background-accent)]",
        "hover:text-[var(--color-background-accent-foreground)]",
      ],
      // Active — brand fill, no border
      isActive && [
        "border border-transparent",
        "bg-[var(--color-brand-primary)]",
        "text-[var(--color-brand-primary-foreground)]",
      ],
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

// ─── PaginationPrevious ───────────────────────────────────────────────────────
// Icon-only 32×32px (Figma: chevron-left only, no text).
// "Previous" label is sr-only for screen readers.
// Disabled via aria-disabled="true" — <a> does not support the disabled attribute.

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<"a">) => (
  <a
    aria-label="Go to previous page"
    className={cn(
      "flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] transition-colors",
      "border border-[var(--color-border-default)]",
      "bg-[var(--color-background-default)]",
      "text-[var(--color-background-default-foreground)]",
      "hover:bg-[var(--color-background-accent)]",
      "hover:text-[var(--color-background-accent-foreground)]",
      // Disabled state
      "[aria-disabled=true]:pointer-events-none",
      "[aria-disabled=true]:bg-[var(--color-background-muted)]",
      "[aria-disabled=true]:border-[var(--color-border-disabled)]",
      "[aria-disabled=true]:text-[var(--color-icon-disabled)]",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous</span>
  </a>
)
PaginationPrevious.displayName = "PaginationPrevious"

// ─── PaginationNext ───────────────────────────────────────────────────────────

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<"a">) => (
  <a
    aria-label="Go to next page"
    className={cn(
      "flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] transition-colors",
      "border border-[var(--color-border-default)]",
      "bg-[var(--color-background-default)]",
      "text-[var(--color-background-default-foreground)]",
      "hover:bg-[var(--color-background-accent)]",
      "hover:text-[var(--color-background-accent-foreground)]",
      "[aria-disabled=true]:pointer-events-none",
      "[aria-disabled=true]:bg-[var(--color-background-muted)]",
      "[aria-disabled=true]:border-[var(--color-border-disabled)]",
      "[aria-disabled=true]:text-[var(--color-icon-disabled)]",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next</span>
  </a>
)
PaginationNext.displayName = "PaginationNext"

// ─── PaginationEllipsis ───────────────────────────────────────────────────────
// 32×32px non-interactive cell. Text: color/background/muted/foreground.

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden="true"
    className={cn(
      "flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-sm",
      "border border-[var(--color-border-default)]",
      "bg-[var(--color-background-default)]",
      "text-[var(--color-background-muted-foreground)]",
      className
    )}
    {...props}
  >
    <Ellipsis className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
