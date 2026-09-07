import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarLogo,
  SidebarBrand,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  FileText,
  BarChart3,
  Settings,
  Search,
  Bell,
} from 'lucide-react';

// ─── NorthwindShell ───────────────────────────────────────────────────────────
// The single, reusable app frame: sidebar nav + topbar. Screens render their
// content via `children` — never re-implement the shell per screen.
//
//   <NorthwindShell active="Dashboard" title="Dashboard"> <DashboardContent/> </NorthwindShell>

const mainNav = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Orders', icon: ShoppingCart, badge: 12 },
  { label: 'Customers', icon: Users },
  { label: 'Products', icon: Package },
  { label: 'Invoices', icon: FileText },
] as const;

export function NorthwindShell({
  active = 'Dashboard',
  title,
  children,
}: {
  active?: string;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background-default)]">
      <SidebarProvider>
        <Sidebar type="default">
          <SidebarHeader>
            <SidebarLogo>
              <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-sidebar-primary)] text-[var(--color-sidebar-primary-foreground)] text-sm font-semibold">
                N
              </div>
            </SidebarLogo>
            <SidebarBrand title="Northwind" caption="Sales workspace" />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              {mainNav.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem
                    key={item.label}
                    icon={<Icon />}
                    label={item.label}
                    href="#"
                    badge={'badge' in item ? item.badge : undefined}
                    active={item.label === active}
                  />
                );
              })}
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Insights</SidebarGroupLabel>
              <SidebarMenuItem icon={<BarChart3 />} label="Reports" href="#" active={active === 'Reports'} />
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenuItem icon={<Settings />} label="Settings" href="#" active={active === 'Settings'} />
          </SidebarFooter>
        </Sidebar>

        {/* Main column: topbar + content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-lg)]">
            <h1 className="text-base font-semibold text-[var(--color-background-default-foreground)]">{title ?? active}</h1>
            <div className="flex items-center gap-[var(--spacing-component-sm)]">
              <div className="flex h-9 w-64 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-[var(--spacing-component-md)]">
                <Search className="size-4 text-[var(--color-icon-default)]" aria-hidden="true" />
                <span className="text-sm text-[var(--color-input-placeholder)]">Search…</span>
              </div>
              <button
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-icon-default)] hover:bg-[var(--color-background-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              >
                <Bell className="size-4" aria-hidden="true" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-brand-primary)]" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-xs font-medium text-[var(--color-surface-muted-foreground)]">
                JD
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-[var(--spacing-component-lg)]">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
