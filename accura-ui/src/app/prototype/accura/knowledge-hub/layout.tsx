"use client"

import { useState, type ReactNode } from "react"

import { ApplicationHeader } from "@/components/application-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppNavItems, AppSidebar } from "../app-sidebar"

/* Shell for every Knowledge Hub screen. One shell per module — never build the
   sidebar inside a page.

   The module title lives in the header bar, so no screen repeats it in page
   content. The current build shows "Knowledge Hub" in both places. */
export default function KnowledgeHubLayout({
  children,
}: {
  children: ReactNode
}) {
  const [mobile, setMobile] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)] text-[var(--color-background-default-foreground)]">
        <AppSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ApplicationHeader
            title="Knowledge Hub"
            user={{
              name: "Amit Kothari",
              role: "Quality Assurance",
              initials: "AK",
            }}
            initialNotifications={[]}
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
