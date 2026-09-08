import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // focus/destructive = red glow (DROP_SHADOW rgb(220,38,38) @40% spread 3px) — replaces color/ring
// All other variants use color/ring (blue, 2px) via focus-visible:ring-*
"inline-flex items-center justify-center gap-[var(--button-size-button-spacing)] whitespace-nowrap rounded-[var(--button-size-button-radius-2)] text-sm leading-none font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-[calc(var(--opacity-disabled)/100)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--button-primary-bg-bg)] text-[var(--button-primary-fg-fg)] hover:bg-[var(--button-primary-bg-hover)] active:bg-[var(--button-primary-bg-active)]",
        destructive:
          // focus/destructive: red @ 40% opacity, 3px spread (Figma effect style)
          // ring-0 cancels the base ring-2; explicit box-shadow gives correct 3px spread
          "bg-[var(--button-destructive-bg-bg)] text-[var(--button-destructive-fg-fg)] hover:bg-[var(--button-destructive-bg-hover)] active:bg-[var(--button-destructive-bg-active)] focus-visible:ring-0 focus-visible:[box-shadow:0_0_0_3px_rgba(220,38,38,0.4)]",
        // Low-emphasis destructive. Use when a destructive action sits beside a
        // primary one that must stay dominant (CAPA "Reject" next to "Approve &
        // Sign"). Two solid fills give the user no default path, and solid red
        // vs solid green measures 1.20:1 against each other — indistinguishable
        // by lightness, so the meaning rides entirely on hue.
        // Structure mirrors `secondary` (brand 100/50/200/900) on the red ramp.
        // Shares `destructive`'s red focus glow — same consequence class.
        destructiveSecondary:
          "border border-[var(--button-destructive-secondary-border-default)] bg-[var(--button-destructive-secondary-bg-bg)] text-[var(--button-destructive-secondary-fg-fg)] hover:bg-[var(--button-destructive-secondary-bg-hover)] active:bg-[var(--button-destructive-secondary-bg-active)] focus-visible:ring-0 focus-visible:[box-shadow:0_0_0_3px_rgba(220,38,38,0.4)]",
        outline:
          "border border-[var(--button-outline-border-default)] bg-[var(--button-outline-bg-bg)] text-[var(--button-outline-fg-fg)] hover:bg-[var(--button-outline-bg-hover)] hover:border-[var(--button-outline-border-hover)] active:bg-[var(--button-outline-bg-active)] active:border-[var(--button-outline-border-active)] focus-visible:border-[var(--button-outline-border-focus)] disabled:border-[var(--button-outline-border-disabled)]",
        secondary:
          "bg-[var(--button-secondary-bg-bg)] text-[var(--button-secondary-fg-fg)] hover:bg-[var(--button-secondary-bg-hover)] active:bg-[var(--button-secondary-bg-active)]",
        ghost:
          "bg-transparent text-[var(--button-ghost-fg-fg)] hover:bg-[var(--button-ghost-bg-hover)] active:bg-[var(--button-ghost-bg-active)]",
        link:
          "text-[var(--button-link-fg-default)] underline-offset-4 hover:underline hover:text-[var(--button-link-fg-hover)] active:text-[var(--button-link-fg-active)] disabled:text-[var(--button-link-fg-disabled)]",
      },
      size: {
        default:
          "h-[var(--button-size-button-height-default)] px-[var(--button-size-button-padding-default)]",
        sm:
          "h-[var(--button-size-button-height-small)] px-[var(--button-size-button-padding-small)] text-xs",
        lg:
          "h-[var(--button-size-button-height-large)] rounded-[var(--button-size-button-radius-1)] px-[var(--button-size-button-padding-default)]",
        icon:
          "h-[var(--button-size-button-height-default)] w-[var(--button-size-button-height-default)]",
        "icon-sm":
          "h-[var(--button-size-button-height-small)] w-[var(--button-size-button-height-small)]",
        "icon-lg":
          "h-[var(--button-size-button-height-large)] w-[var(--button-size-button-height-large)] rounded-[var(--button-size-button-radius-1)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
