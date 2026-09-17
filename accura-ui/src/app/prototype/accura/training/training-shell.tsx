"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ApplicationHeader } from "@/components/application-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AppNavItems, AppSidebar } from "../app-sidebar"
import { currentUser, reviewItems } from "./mock-data"

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
          {/* The shared header, same as Documents — notifications and account
              on the right. The module title lives in page content, not here. */}
          <ApplicationHeader
            title="Training"
            user={{
              name: currentUser.name,
              role: currentUser.roleAtSignOff,
              initials: currentUser.name
                .split(" ")
                .map((part) => part[0])
                .join(""),
            }}
            initialNotifications={[
              {
                id: "training-review-queue",
                module: "Training",
                recordId: `${reviewItems.length} records`,
                title: "Awaiting your sign-off",
                description:
                  "Completed assessments are waiting for a Training Manager signature.",
                timestamp: "Demo activity",
                kind: "Action required",
                unread: true,
                href: "/prototype/accura/training/review",
              },
            ]}
            mobileNavigationOpen={mobileNavOpen}
            onMobileNavigationToggle={() => setMobileNavOpen((open) => !open)}
          />
          {mobileNavOpen && (
            <div className="border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)] p-[var(--spacing-component-md)] lg:hidden">
              <AppNavItems />
            </div>
          )}

          <section className="flex min-h-0 flex-1 flex-col gap-[var(--spacing-component-lg)] overflow-y-auto p-[var(--spacing-component-lg)] lg:p-6">
            {children}
          </section>
        </main>
      </div>
    </SidebarProvider>
  )
}
