"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AppNavItems, AppSidebar } from "../app-sidebar"

/* Tabs from §1. Only Users is built; the rest render an unbuilt notice rather
   than dead links — a prototype that 404s reads as broken, not unfinished. */
export const trainingTabs = [
  { label: "Users", href: "/prototype/accura/training" },
  { label: "Roles", href: "/prototype/accura/training/roles" },
  { label: "Courses", href: "/prototype/accura/training/courses" },
  { label: "Assessments", href: "/prototype/accura/training/assessments" },
  { label: "Review", href: "/prototype/accura/training/review" },
] as const

/* The tab bar is its own component so the detail screen can omit it — a
   detail page is not a sibling of the tabs, it sits underneath one.

   Tabs Type=Line carries the design-system styling; each trigger is rendered
   `asChild` around a Link so these stay real navigation (routes, not panels)
   while keeping the component's tokens and active indicator. */
export function TrainingTabs() {
  const pathname = usePathname()

  return (
    <Tabs value={pathname} aria-label="Training sections">
      <TabsList variant="line">
        {trainingTabs.map((tab) => (
          <TabsTrigger key={tab.label} variant="line" value={tab.href} asChild>
            <Link href={tab.href}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export function TrainingShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)]">
        <AppSidebar />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-4 md:px-6">
            <Button
              variant="ghost"
              size="icon-sm"
              className="mr-2 lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="font-sans text-base font-medium text-[var(--color-background-default-foreground)]">
              Training
            </h1>
          </header>

          {mobileNavOpen && (
            <div className="border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)] p-3 lg:hidden">
              <AppNavItems />
            </div>
          )}

          <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:p-6">
            {children}
          </section>
        </main>
      </div>
    </SidebarProvider>
  )
}
