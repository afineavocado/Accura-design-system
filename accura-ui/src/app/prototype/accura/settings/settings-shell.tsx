"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Building2, ClipboardCheck, FileText, GraduationCap, RefreshCw, TriangleAlert, Users } from "lucide-react"

import { ApplicationHeader } from "@/components/application-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AppNavItems, AppSidebar } from "../app-sidebar"
import { settingsHref, settingsSections, type SettingsSection } from "./mock-data"

/* Module sections reuse the app sidebar's icon (app-sidebar.tsx), so one icon
   means one module everywhere. Organisation and Users have no sidebar item. */
const sectionIcons: Record<SettingsSection["icon"], React.ElementType> = {
  organisation: Building2,
  documents: FileText,
  training: GraduationCap,
  capa: ClipboardCheck,
  change: RefreshCw,
  deviations: TriangleAlert,
  users: Users,
}

/* Current section/tab from the URL: /settings/[section]/[tab]. */
function useSettingsLocation() {
  const pathname = usePathname()
  const [, sectionSlug, tabSlug] = pathname.match(/\/settings\/([^/]+)\/?([^/]*)/) ?? []
  const section = settingsSections.find((s) => s.slug === sectionSlug)
  return { pathname, section, tabSlug }
}

/* Settings layout — two levels.
   Level 1: sections in a vertical menu beside the app sidebar (with icons).
   Level 2: the section's pages as line tabs above the content. */
export function SettingsShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)]">
        <AppSidebar />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ApplicationHeader
            title="Settings"
            user={{ name: "Amit Kothari", role: "Admin", initials: "AK" }}
            initialNotifications={[]}
            mobileNavigationOpen={mobileNavOpen}
            onMobileNavigationToggle={() => setMobileNavOpen((open) => !open)}
          />
          {mobileNavOpen && (
            <div className="border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)] p-[var(--spacing-component-md)] lg:hidden">
              <AppNavItems />
            </div>
          )}
          <div className="flex min-h-0 flex-1">
            <SettingsMenu />
            <section className="min-h-0 min-w-0 flex-1 overflow-y-auto p-[var(--spacing-component-lg)] lg:p-8">
              <div className="mx-auto flex w-full max-w-[960px] flex-col gap-[var(--spacing-component-xl)]">
                <MobileSettingsMenu />
                <SectionTabs />
                {children}
              </div>
            </section>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

function SettingsMenu() {
  const { section: current } = useSettingsLocation()

  return (
    <nav
      aria-label="Settings sections"
      className="hidden w-60 shrink-0 overflow-y-auto border-r border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-[var(--spacing-component-md)] py-[var(--spacing-component-lg)] md:block"
    >
      <ul className="flex flex-col gap-[var(--spacing-component-xs)]">
        {settingsSections.map((section) => {
          const Icon = sectionIcons[section.icon]
          const active = current?.slug === section.slug
          return (
            <li key={section.slug}>
              <Link
                href={settingsHref(section.slug, section.tabs[0].slug)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] px-[var(--spacing-component-sm)] py-[var(--spacing-component-sm)] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] ${
                  active
                    ? "bg-[var(--color-surface-accent)] font-medium text-[var(--color-brand-primary)]"
                    : "text-[var(--color-surface-default-foreground)] hover:bg-[var(--color-background-muted)]"
                }`}
              >
                <Icon className={`size-4 shrink-0 ${active ? "" : "text-[var(--color-icon-muted)]"}`} />
                {section.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* Level 2. Hidden when a section has one page (Documents) — a single tab is noise. */
function SectionTabs() {
  const { pathname, section } = useSettingsLocation()
  if (!section || section.tabs.length < 2) return null

  return (
    <Tabs value={pathname} aria-label={`${section.label} settings`} className="w-full">
      <TabsList variant="line" className="flex w-full justify-start overflow-x-auto">
        {section.tabs.map((tab) => {
          const href = settingsHref(section.slug, tab.slug)
          return (
            <TabsTrigger key={tab.slug} variant="line" value={href} asChild>
              <Link href={href} className="shrink-0">{tab.label}</Link>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}

/* Below md the section menu collapses into a Select; tabs scroll sideways. */
function MobileSettingsMenu() {
  const { section } = useSettingsLocation()
  const router = useRouter()

  return (
    <div className="md:hidden">
      <Select
        value={section?.slug}
        onValueChange={(slug) => {
          const next = settingsSections.find((s) => s.slug === slug)
          if (next) router.push(settingsHref(next.slug, next.tabs[0].slug))
        }}
      >
        <SelectTrigger aria-label="Settings section">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {settingsSections.map((s) => (
            <SelectItem key={s.slug} value={s.slug}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/* Page header: title + one-line description, primary action aligned right. */
export function ScreenHeading({ heading, subtitle, action }: { heading: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-component-xs)]">
        <h2 className="font-heading text-xl font-semibold text-[var(--color-background-default-foreground)]">{heading}</h2>
        {subtitle && <p className="text-sm text-[var(--color-text-secondary)]">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
