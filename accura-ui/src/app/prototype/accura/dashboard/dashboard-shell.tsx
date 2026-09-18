"use client"

import * as React from "react"

import { ApplicationHeader } from "@/components/application-header"
import { SidebarProvider } from "@/components/ui/sidebar"

import { AppNavItems, AppSidebar } from "../app-sidebar"
import { prototypeNotifications, prototypeUser } from "../shell-mock-data"
import { TODAY } from "./mock-data"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const firstName = prototypeUser.name.replace(/^Dr\. /, "").split(" ")[0]

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)] text-[var(--color-background-default-foreground)]">
        <AppSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ApplicationHeader
            title="Dashboard"
            user={prototypeUser}
            initialNotifications={prototypeNotifications}
            mobileNavigationOpen={mobileNavOpen}
            onMobileNavigationToggle={() => setMobileNavOpen(!mobileNavOpen)}
          />
          {mobileNavOpen && (
            <nav
              aria-label="Mobile navigation"
              className="border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)] p-[var(--spacing-component-md)] lg:hidden"
            >
              <AppNavItems />
            </nav>
          )}
          <main className="min-h-0 flex-1 overflow-y-auto p-[var(--spacing-component-lg)] lg:p-[var(--spacing-component-xl)]">
            {/* Content column capped at 1100px and centred, matching the Knowledge
                Hub page; the sidebar sits outside the cap. */}
            <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-[var(--spacing-component-lg)]">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Good morning, {firstName} ·{" "}
                  {new Date(`${TODAY}T12:00:00`).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
