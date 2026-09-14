"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Field label with the required marker. Implements `label` from
// docs/component-specs/Form-shared.md:
//
//   label                  — H auto-layout, gap: spacing/component/xs
//     ├─ label-text        — TEXT
//     └─ label-required    — TEXT (the asterisk; hidden when not required)
//
// label state | label-text                          | label-required
// ------------|-------------------------------------|--------------------
// Default     | color/background/default/foreground | color/status/danger
// Disabled    | color/text/disabled                 | color/text/disabled
// Invalid     | color/text/invalid                  | color/text/invalid
//
// The asterisk was specified in Figma and never implemented here, so every
// consumer wrote its own — six copies in the prototypes, and one that rendered
// black because it inherited the label colour. Pass `required`; do not hand-roll
// an asterisk, and do not recolour the fills on the instance (the spec's rule).

const labelVariants = cva(
  "inline-flex items-center gap-[var(--spacing-component-xs)] text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      state: {
        default: "text-[var(--color-background-default-foreground)]",
        disabled: "text-[var(--color-text-disabled)]",
        invalid: "text-[var(--color-text-invalid)]",
      },
    },
    defaultVariants: { state: "default" },
  }
)

// The marker follows the field state, except in Default where it is danger.
const requiredVariants = cva("", {
  variants: {
    state: {
      default: "text-[var(--color-status-danger)]",
      disabled: "text-[var(--color-text-disabled)]",
      invalid: "text-[var(--color-text-invalid)]",
    },
  },
  defaultVariants: { state: "default" },
})

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /** Shows the asterisk, announced as "(required)" to assistive tech. */
  required?: boolean
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, state, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ state }), className)}
    {...props}
  >
    {children}
    {required && (
      <>
        <span aria-hidden="true" className={cn(requiredVariants({ state }))}>
          *
        </span>
        <span className="sr-only">(required)</span>
      </>
    )}
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
