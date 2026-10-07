import * as React from "react"
import { Loading02 } from "@untitledui/icons"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ─── Spinner ──────────────────────────────────────────────────────────────────
// Code-only component — no Figma component set (figmaNodeId: null).
// An indeterminate activity indicator for small areas: inside a button, an
// input, a pill. For a region whose layout is known use Skeleton; for a
// measurable task use Progress.
//
// Icon:   Loading02 (@untitledui/icons) — the same icon Toast uses for its
//         loading state, so there is one spinner in the system.
// Colour: currentColor — inherits the foreground of whatever it sits in, so it
//         is correct on every Button variant and in both themes with no token.
// Motion: animate-spin, stopped under prefers-reduced-motion.
//
// Sizes:  sm 14px · md 16px (default, matches Button's icon slot) · lg 24px
//
// Accessibility: decorative by default (aria-hidden). Pass `label` when the
// spinner is the only thing announcing the wait — it then renders
// role="status" with screen-reader-only text.

const spinnerVariants = cva("shrink-0 animate-spin motion-reduce:animate-none", {
  variants: {
    size: {
      sm: "size-3.5",
      md: "size-4",
      lg: "size-6",
    },
  },
  defaultVariants: { size: "md" },
})

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  /** Screen-reader text. Omit when surrounding text already says what is loading. */
  label?: string
}

function Spinner({ size, className, label }: SpinnerProps) {
  const icon = <Loading02 aria-hidden="true" className={cn(spinnerVariants({ size }), className)} />
  if (!label) return icon
  return (
    <span role="status" className="inline-flex">
      {icon}
      <span className="sr-only">{label}</span>
    </span>
  )
}

export { Spinner, spinnerVariants }
export type { SpinnerProps }
