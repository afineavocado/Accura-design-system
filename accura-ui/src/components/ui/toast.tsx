"use client"

import { CircleAlert, TriangleAlert, CircleCheck, Info } from "lucide-react";
import { Loading02 } from "@untitledui/icons";
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

// ─── Toaster ──────────────────────────────────────────────────────────────────
// Token bindings (per Toast spec):
//   container fill     = color/surface/overlay
//   container stroke   = color/border/default
//   container radius   = radius/lg
//   container shadow   = none (not in spec)
//   title              = color/surface/overlay/foreground
//   description        = color/text/secondary
//   icon/Success       = color/icon/success
//   icon/Error         = color/icon/danger
//   icon/Warning       = color/icon/warning
//   icon/Loading       = color/surface/overlay/foreground
//   actionButton       = outline button style (color/background/default fg + border/default border)
//   cancelButton       = color/surface/muted bg + color/surface/muted/foreground text

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheck className="h-4 w-4 text-[var(--color-icon-success)]" />
        ),
        info: (
          <Info className="h-4 w-4 text-[var(--color-surface-overlay-foreground)]" />
        ),
        warning: (
          <TriangleAlert className="h-4 w-4 text-[var(--color-icon-warning)]" />
        ),
        error: (
          <CircleAlert className="h-4 w-4 text-[var(--color-icon-danger)]" />
        ),
        loading: (
          <Loading02 className="h-4 w-4 animate-spin text-[var(--color-surface-overlay-foreground)]" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--color-surface-overlay)] group-[.toaster]:text-[var(--color-surface-overlay-foreground)] group-[.toaster]:border-[var(--color-border-default)] group-[.toaster]:rounded-[var(--radius-lg)]",
          title:
            "group-[.toast]:text-[var(--color-surface-overlay-foreground)]",
          description:
            "group-[.toast]:text-[var(--color-text-secondary)]",
          actionButton:
            "group-[.toast]:bg-[var(--color-background-default)] group-[.toast]:text-[var(--color-background-default-foreground)] group-[.toast]:border group-[.toast]:border-[var(--color-border-default)]",
          cancelButton:
            "group-[.toast]:bg-[var(--color-surface-muted)] group-[.toast]:text-[var(--color-surface-muted-foreground)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
