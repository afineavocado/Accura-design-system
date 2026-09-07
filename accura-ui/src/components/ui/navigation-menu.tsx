"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Navigation Menu ───────────────────────────────────────────────────────────
// Tokens (from Navigation Menu.md — Figma 127:193 / 127:353 / 127:157):
//
// nav-button:
//   container fill: color/background/default (all states)
//   hover fill:     color/background/accent
//   focus ring:     color/ring 2px OUTSIDE
//   label:          color/background/default/foreground (active) · color/text/disabled (disabled)
//   icon/chevron:   color/background/default/foreground (active) · color/icon/disabled (disabled)
//   radius:         radius/md
//   padding:        spacing/component/sm T/B · spacing/component/md L/R
//   gap:            spacing/component/xs
//
// nav-panel:
//   fill:           color/surface/overlay
//   stroke:         color/border/default 1px INSIDE
//   radius:         radius/base (8px)
//   shadow:         shadows/shadow
//   padding:        spacing/component/lg (16px all sides)
//   gap:            spacing/component/sm (8px)
//
// nav-panel-link:
//   hover fill:     color/background/accent
//   focus ring:     color/ring 2px OUTSIDE
//   title:          color/surface/default/foreground (active) · color/text/disabled (disabled)
//   description:    color/text/secondary (active) · color/text/disabled (disabled)
//   radius:         radius/md
//   padding:        spacing/component/sm T/B · spacing/component/md L/R
//   gap:            spacing/component/xs

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

// nav-button Type=Trigger
const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      "group inline-flex items-center justify-center gap-[var(--spacing-component-xs)]",
      "rounded-[var(--radius-md)]",
      "px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]",
      "text-sm font-medium",
      "bg-[var(--color-background-default)] text-[var(--color-background-default-foreground)]",
      "hover:bg-[var(--color-background-accent)] hover:text-[var(--color-background-accent-foreground)]",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-0",
      "disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]",
      "transition-colors",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        "text-[var(--color-background-default-foreground)]",
        "group-hover:text-[var(--color-background-accent-foreground)]",
        "group-data-[state=open]:rotate-180"
      )}
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

// nav-panel container
const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 md:absolute",
      // Animate in/out
      "data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in",
      "data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out",
      "data-[motion=from-end]:slide-in-from-right-52",
      "data-[motion=from-start]:slide-in-from-left-52",
      "data-[motion=to-end]:slide-out-to-right-52",
      "data-[motion=to-start]:slide-out-to-left-52",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

// Type=Link nav-button
const NavigationMenuLink = NavigationMenuPrimitive.Link

// Shared viewport — renders the active panel content
const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className="absolute left-0 top-full flex justify-center">
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 overflow-hidden",
        "rounded-[var(--radius-base)]",
        "border border-[var(--color-border-default)]",
        "bg-[var(--color-surface-overlay)]",
        "shadow-[var(--shadow-sm)]",
        "h-[var(--radix-navigation-menu-viewport-height)]",
        "w-full md:w-[var(--radix-navigation-menu-viewport-width)]",
        "data-[state=open]:animate-in data-[state=open]:zoom-in-90",
        "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95",
        "transition-[width,height] duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

// nav-panel-link — title + description row inside a panel
const NavigationMenuPanelLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    title: string
    description?: string
    disabled?: boolean
  }
>(({ title, description, disabled, className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link asChild>
    <a
      ref={ref}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex flex-col gap-[var(--spacing-component-xs)]",
        "rounded-[var(--radius-md)]",
        "px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]",
        "transition-colors outline-none",
        disabled
          ? "pointer-events-none opacity-[calc(var(--opacity-disabled)/100)]"
          : [
              "hover:bg-[var(--color-background-accent)]",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-0",
            ],
        className
      )}
      {...props}
    >
      <span className={cn(
        "text-sm font-medium leading-snug",
        disabled ? "text-[var(--color-text-disabled)]" : "text-[var(--color-surface-overlay-foreground)]"
      )}>
        {title}
      </span>
      {description && (
        <span className={cn(
          "text-xs leading-snug",
          disabled ? "text-[var(--color-text-disabled)]" : "text-[var(--color-text-secondary)]"
        )}>
          {description}
        </span>
      )}
    </a>
  </NavigationMenuPrimitive.Link>
))
NavigationMenuPanelLink.displayName = "NavigationMenuPanelLink"

// Indicator — the small arrow pointing up from the viewport
const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
      "data-[state=visible]:animate-in data-[state=visible]:fade-in",
      "data-[state=hidden]:animate-out data-[state=hidden]:fade-out",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-[var(--color-border-default)] shadow-[var(--shadow-md)]" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  NavigationMenuPanelLink,
}
