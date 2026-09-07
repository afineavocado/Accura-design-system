import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ─── Empty ────────────────────────────────────────────────────────────────────
// Custom component — no shadcn/Radix base. Purely presentational.
// Tokens (from Empty.md — verified against Figma 97:34667):
//
// Container — per Variant:
//   Default:    transparent · no stroke · no radius
//   Outline:    transparent · color/border/default 1px · radius/lg
//   Background: color/background/subtle fill · no stroke · radius/lg
//   Padding: spacing/component/2xl (32px) all sides
//   Gap (header → content): spacing/component/lg (16px)
//
// header: gap spacing/component/sm (8px)
// media:  36×36px · radius/lg · fill color/background/subtle (Default/Outline)
//                                    color/surface/default (Background variant)
// title:       color/background/default/foreground
// description: color/text/secondary
// content: gap spacing/component/sm (8px)

const emptyVariants = cva(
  "flex flex-col items-center text-center p-8 gap-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "rounded-[var(--radius-lg)] border border-[var(--color-border-default)]",
        background: "rounded-[var(--radius-lg)] bg-[var(--color-background-subtle)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

interface EmptyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyVariants> {
  /** Icon element — wrap in a React element, sized to h-5 w-5. aria-hidden handled internally. */
  icon?: React.ReactNode
  /** Primary label — what is missing */
  title: string
  /** Supporting sentence — what the user should do next */
  description?: string
  /** Primary action button element */
  primaryAction?: React.ReactNode
  /** Secondary action button element */
  secondaryAction?: React.ReactNode
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  (
    { className, variant, icon, title, description, primaryAction, secondaryAction, ...props },
    ref
  ) => {
    // Media container fill: switches between variants
    const mediaClass =
      variant === "background"
        ? "bg-[var(--color-surface-default)]"
        : "bg-[var(--color-background-subtle)]"

    const hasActions = primaryAction || secondaryAction

    return (
      <div ref={ref} className={cn(emptyVariants({ variant }), className)} {...props}>
        {/* header — media + title + description */}
        <div className="flex flex-col items-center gap-2">
          {icon && (
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)]",
                mediaClass
              )}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          {/* heading/sm — 16px / Semi Bold / leading-snug (Figma confirmed) */}
          <p className="text-base font-semibold leading-snug text-[var(--color-background-default-foreground)]">
            {title}
          </p>
          {description && (
            <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">
              {description}
            </p>
          )}
        </div>

        {/* content — action buttons */}
        {hasActions && (
          <div className="flex flex-row items-center gap-2">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
    )
  }
)
Empty.displayName = "Empty"

export { Empty }
