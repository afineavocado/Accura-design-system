"use client";

import { useState, type ReactNode } from "react";
import { DocumentActionHost } from "./components";
import { usePathname } from "next/navigation";
import { ApplicationHeader } from "@/components/application-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toast";
import { AppNavItems, AppSidebar } from "../app-sidebar";
import { actors, basePath, responsible } from "./mock-data";
import { useDocuments } from "./store";

export default function DemoLayout({ children }: { children: ReactNode }) {
  const [actionHost, setActionHost] = useState<HTMLDivElement | null>(null);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const docs = useDocuments();
  const current = docs.find((d) => pathname.endsWith("/" + d.id));
  const user = current ? responsible(current) : actors.owner;
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)] text-[var(--color-background-default-foreground)]">
        <AppSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ApplicationHeader
            user={user}
            initialNotifications={[
              {
                id: "review-sop003",
                module: "Document",
                recordId: "SOP-003",
                title: "Review requested",
                description:
                  "CAPA Management is ready for review. You are associated with this record.",
                timestamp: "Demo activity",
                kind: "Update",
                unread: true,
                href: basePath + "/SOP-003",
              },
            ]}
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
            <DocumentActionHost.Provider value={actionHost}>{children}</DocumentActionHost.Provider>
          </main>
          <div ref={setActionHost} className="shrink-0" />
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
