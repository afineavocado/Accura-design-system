"use client"

import * as React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Settings,
  TriangleAlert,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarLogo,
  SidebarMenuItem,
  SidebarToggle,
  useSidebar,
} from "@/components/ui/sidebar"

/* One nav definition for the whole prototype. Previously each page built its
   own, so CAPA's sidebar had no Training item and the module vanished on
   navigation. Add a module here, not in a page. */
export const platformNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#" },
  { label: "Documents", icon: FileText, href: "#" },
  { label: "CAPA", icon: ClipboardCheck, href: "/prototype/accura/capa" },
  { label: "Change Control", icon: RefreshCw, href: "#" },
  { label: "Training", icon: GraduationCap, href: "/prototype/accura/training" },
  { label: "Deviations", icon: TriangleAlert, href: "#" },
  { label: "Reports", icon: BarChart3, href: "#" },
] as const

const footerNav = [
  { label: "Knowledge Hub", icon: BookOpen, href: "#" },
  { label: "Setting", icon: Settings, href: "#" },
  { label: "Log Out", icon: LogOut, href: "#" },
] as const

/* Active = this href or anything beneath it, so the module stays lit on
   detail routes such as /training/amit-kothari. `#` never matches. */
function useIsActive() {
  const pathname = usePathname()
  return React.useCallback(
    (href: string) =>
      href !== "#" && (pathname === href || pathname.startsWith(`${href}/`)),
    [pathname]
  )
}

export function AppNavItems() {
  const isActive = useIsActive()

  return (
    <>
      {platformNav.map(({ label, icon: Icon, href }) => (
        <SidebarMenuItem
          key={label}
          icon={<Icon className="h-4 w-4" />}
          label={label}
          href={href}
          active={isActive(href)}
        />
      ))}
    </>
  )
}

function AccuraLogo() {
  const { collapsed } = useSidebar()
  if (collapsed) return null

  return (
    <SidebarLogo className="h-9 w-[104px]">
      <Image
        src="/accura-logo.png"
        alt="Accura"
        width={104}
        height={36}
        className="h-full w-full object-contain"
        priority
      />
    </SidebarLogo>
  )
}

export function AppSidebar() {
  const isActive = useIsActive()

  return (
    <Sidebar type="default" collapsible="icon" className="hidden lg:flex">
      <SidebarHeader className="h-14 justify-between px-4">
        <AccuraLogo />
        <SidebarToggle className="shrink-0 rounded-full bg-[var(--color-sidebar-accent)]">
          <ChevronLeft className="h-4 w-4" />
        </SidebarToggle>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="gap-1 px-3 py-4">
          <SidebarGroupLabel className="mb-1">Platform</SidebarGroupLabel>
          <AppNavItems />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-1 px-3 py-3">
        {footerNav.map(({ label, icon: Icon, href }) => (
          <SidebarMenuItem
            key={label}
            icon={<Icon className="h-4 w-4" />}
            label={label}
            href={href}
            active={isActive(href)}
          />
        ))}
      </SidebarFooter>
    </Sidebar>
  )
}
