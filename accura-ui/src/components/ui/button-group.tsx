"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── ButtonGroup ──────────────────────────────────────────────────────────────
// Custom component — no shadcn base.
// Tokens (from Button-group.md — verified against Figma 52:11151):
//
// Container: color/surface/default · color/border/default 1px · radius/md
// Separators: 1px divider divs auto-injected between children via inline style
//   (inline style bypasses Tailwind compilation — guaranteed to work)
//
// Buttons inside MUST use variant="ghost"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", children, ...props }, ref) => {
    const childArray = React.Children.toArray(children)

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex overflow-hidden",
          orientation === "horizontal" ? "flex-row items-stretch" : "flex-col",
          "rounded-[var(--radius-md)]",
          "border border-[var(--color-border-default)]",
          "bg-[var(--color-surface-default)]",
          // Strip child button radii — ! beats Button's own rounded-md
          orientation === "horizontal"
            ? "[&>button]:!rounded-none [&>button:first-of-type]:!rounded-l-[var(--radius-md)] [&>button:last-of-type]:!rounded-r-[var(--radius-md)]"
            : "[&>button]:!rounded-none [&>button:first-of-type]:!rounded-t-[var(--radius-md)] [&>button:last-of-type]:!rounded-b-[var(--radius-md)]",
          className
        )}
        {...props}
      >
        {childArray.map((child, i) => (
          <React.Fragment key={i}>
            {child}
            {i < childArray.length - 1 && (
              // Separator divider — inline style so no Tailwind compilation needed
              <div
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  alignSelf: "stretch",
                  backgroundColor: "var(--color-border-default)",
                  width: orientation === "horizontal" ? "1px" : "100%",
                  height: orientation === "horizontal" ? "auto" : "1px",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }
