"use client"

import * as React from "react"

import { ApplicationHeader } from "@/components/application-header"
import { SidebarProvider } from "@/components/ui/sidebar"

import { AppNavItems, AppSidebar } from "../app-sidebar"
import { basePath, currentUser, isOverdue, seeds } from "./mock-data"

/* One shell for every Deviation page, as in Documents and Training. The module
   title lives in ApplicationHeader, not in page content. */
export default function DeviationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobile, setMobile] = React.useState(false)

  /* Notify on the thing this user can act on: a record waiting on their
     signature. Falls back to the first overdue record. */
  const awaiting = seeds.find((record) => record.status === "In Approval")
  const overdue = seeds.filter((record) => isOverdue(record))

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)] text-[var(--color-background-default-foreground)]">
        <AppSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ApplicationHeader
            title="Deviations"
            user={currentUser}
            initialNotifications={
              awaiting
                ? [
                    {
                      id: `deviation-${awaiting.key}`,
                      module: "Deviation",
                      recordId: awaiting.id ?? "Draft",
                      title: "Awaiting your signature",
                      description: `${awaiting.title} is at In Approval. You are a named reviewer on this record.`,
                      timestamp: "Demo activity",
                      kind: "Action required",
                      unread: true,
                      href: `${basePath}/${awaiting.key}`,
                    },
                    ...overdue.slice(0, 1).map((record) => ({
                      id: `deviation-overdue-${record.key}`,
                      module: "Deviation" as const,
                      recordId: record.id ?? "Draft",
                      title: "Overdue",
                      description: `${record.title} passed its due date and is still at ${record.status}.`,
                      timestamp: "Demo activity",
                      kind: "Update" as const,
                      unread: true,
                      href: `${basePath}/${record.key}`,
                    })),
                  ]
                : []
            }
            mobileNavigationOpen={mobile}
            onMobileNavigationToggle={() => setMobile(!mobile)}
          />
          {mobile && (
            <nav
              aria-label="Mobile navigation"
              className="border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)] p-[var(--spacing-component-md)] lg:hidden"
            >
              <AppNavItems />
            </nav>
          )}
          <main className="min-h-0 flex-1 overflow-y-auto p-[var(--spacing-component-lg)] lg:p-[var(--spacing-component-xl)]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
