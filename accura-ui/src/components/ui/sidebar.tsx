"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// Tokens (from Sidebar.md — Figma 95:18202):
//
// Container:
//   Default/Inset fill:  color/sidebar/background · border: color/sidebar/border (right only)
//   Floating fill:       color/sidebar/background · no border · radius/lg
//
// Header:
//   fill: color/sidebar/background · pad: sm T/B · md L/R · gap: lg
//   Logo: 28×28px FIXED — NOT token-bound (branding slot)
//   title/caption: color/sidebar/foreground
//
// nav item (sidebar-menu-1):
//   Default: transparent · foreground text/icon
//   Hover:   sidebar/accent fill · accent/foreground
//   Active:  sidebar/accent fill · accent/foreground (persistent)
//   radius/md · pad L/R: sm · gap: sm
//
// sub-item (_sidebar-menu-2):
//   same fill states · left-pad: 2xl for indent
//
// badge: brand/primary fill · brand/primary/foreground · radius/full

// ─── Context ──────────────────────────────────────────────────────────────────

interface SidebarContextValue {
  collapsed: boolean
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  toggle: () => {},
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode
  defaultCollapsed?: boolean
}) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  // Cmd+B / Ctrl+B keyboard shortcut
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault()
        setCollapsed((c) => !c)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((c) => !c) }}>
      {children}
    </SidebarContext.Provider>
  )
}

// ─── Sidebar container ────────────────────────────────────────────────────────

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  type?: "default" | "floating" | "inset"
  collapsible?: "none" | "icon"
}

export function Sidebar({
  type = "default",
  collapsible = "icon",
  className,
  children,
  ...props
}: SidebarProps) {
  const { collapsed } = useSidebar()
  const isCollapsed = collapsible !== "none" && collapsed

  return (
    <aside
      aria-label="Sidebar navigation"
      data-collapsed={isCollapsed}
      className={cn(
        "flex flex-col h-full transition-all duration-200",
        // Width
        isCollapsed ? "w-14" : "w-60",
        // Type tokens
        type === "floating"
          ? [
              "rounded-[var(--radius-lg)]",
              "bg-[var(--color-sidebar-background)]",
            ]
          : [
              "bg-[var(--color-sidebar-background)]",
              "border-r border-[var(--color-sidebar-border)]",
            ],
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center",
        "px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]",
        "gap-[var(--spacing-component-lg)]",
        "bg-[var(--color-sidebar-background)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Logo slot (branding — NOT token-bound) ───────────────────────────────────

export function SidebarLogo({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0",
        "h-7 w-7", // 28×28px FIXED per spec
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Header text block ────────────────────────────────────────────────────────

export function SidebarBrand({
  title,
  caption,
  className,
}: {
  title: string
  caption?: string
  className?: string
}) {
  const { collapsed } = useSidebar()
  if (collapsed) return null

  return (
    <div className={cn("flex flex-col gap-[var(--spacing-component-xxs)] min-w-0", className)}>
      <span className="text-sm font-semibold truncate text-[var(--color-sidebar-foreground)]">
        {title}
      </span>
      {caption && (
        <span className="text-xs truncate text-[var(--color-sidebar-foreground)] opacity-70">
          {caption}
        </span>
      )}
    </div>
  )
}

// ─── Content area ─────────────────────────────────────────────────────────────

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-y-auto",
        "gap-[var(--spacing-component-md)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Group ────────────────────────────────────────────────────────────────────

export function SidebarGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col",
        "p-[var(--spacing-component-md)]",
        "gap-[var(--spacing-component-sm)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Group label (_sidebar-group-label) ──────────────────────────────────────

export function SidebarGroupLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar()
  if (collapsed) return null

  return (
    <div
      className={cn(
        "text-xs font-medium uppercase tracking-wide",
        "text-[var(--color-sidebar-foreground)] opacity-60",
        "px-[var(--spacing-component-sm)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Nav item (sidebar-menu-1) ────────────────────────────────────────────────

interface SidebarMenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode
  label: string
  active?: boolean
  badge?: string | number
  disabled?: boolean
}

export function SidebarMenuItem({
  icon,
  label,
  active,
  badge,
  disabled,
  className,
  ...props
}: SidebarMenuItemProps) {
  const { collapsed } = useSidebar()

  return (
    <a
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex items-center gap-[var(--spacing-component-sm)]",
        "rounded-[var(--radius-md)]",
        "px-[var(--spacing-component-sm)] h-9",
        "text-sm font-medium outline-none transition-colors",
        "text-[var(--color-sidebar-foreground)]",
        !active && !disabled && "hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]",
        active && "bg-[var(--color-sidebar-accent)] text-[var(--color-sidebar-accent-foreground)]",
        disabled && "pointer-events-none opacity-[calc(var(--opacity-disabled)/100)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-sidebar-ring)]",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="h-4 w-4 shrink-0 flex items-center justify-center">
          {icon}
        </span>
      )}
      {!collapsed && (
        <span className="flex-1 truncate">{label}</span>
      )}
      {!collapsed && badge && (
        <SidebarBadge>{badge}</SidebarBadge>
      )}
    </a>
  )
}

// ─── Sub-item (_sidebar-menu-2) ───────────────────────────────────────────────

interface SidebarSubItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string
  active?: boolean
  disabled?: boolean
}

export function SidebarSubItem({
  label,
  active,
  disabled,
  className,
  ...props
}: SidebarSubItemProps) {
  const { collapsed } = useSidebar()
  if (collapsed) return null

  return (
    <a
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex items-center h-8",
        "rounded-[var(--radius-md)]",
        // Left indent: spacing/component/2xl (32px)
        "pl-[var(--spacing-component-2xl)] pr-[var(--spacing-component-sm)]",
        "text-sm outline-none transition-colors",
        "text-[var(--color-sidebar-foreground)]",
        !active && !disabled && "hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]",
        active && "bg-[var(--color-sidebar-accent)] text-[var(--color-sidebar-accent-foreground)]",
        disabled && "pointer-events-none opacity-[calc(var(--opacity-disabled)/100)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-sidebar-ring)]",
        className
      )}
      {...props}
    >
      <span className="truncate">{label}</span>
    </a>
  )
}

// ─── Badge (_sidebar-badge) ───────────────────────────────────────────────────

export function SidebarBadge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[18px] h-[18px]",
        "rounded-[var(--radius-full)]",
        "px-[var(--spacing-component-xxs)]",
        "text-xs font-medium leading-none",
        "bg-[var(--color-brand-primary)] text-[var(--color-brand-primary-foreground)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto",
        "px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]",
        "border-t border-[var(--color-sidebar-border)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Toggle button ────────────────────────────────────────────────────────────

export function SidebarToggle({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle } = useSidebar()

  return (
    <button
      onClick={toggle}
      aria-label="Toggle sidebar"
      className={cn(
        "inline-flex items-center justify-center h-8 w-8",
        "rounded-[var(--radius-md)]",
        "text-[var(--color-sidebar-foreground)]",
        "hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]",
        "transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-sidebar-ring)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
