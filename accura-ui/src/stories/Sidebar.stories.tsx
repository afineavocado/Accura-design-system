import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarLogo,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarFooter,
  SidebarToggle,
  useSidebar,
} from '@/components/ui/sidebar';
import { PanelsTopLeft, SquareCheck, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

// Source: Figma [Accura] Agentic Design System — sidebar 95:15648
//   Type=Default, State=Expanded  (256×720)
//   Type=Default, State=Collapsed (56×720)
// Floating and Inset variants are intentionally not storied for Accura.
//
// Tokens:
//   Panel: sidebar/background (#00393f) · sidebar/border (right edge)
//   Nav item default: transparent · sidebar/foreground
//   Nav item hover/active: sidebar/accent (brand/900) · sidebar/accent/foreground (white)
//   Group label: sidebar/foreground @ 60%
//   Focus ring: sidebar/ring
//   Logo: branding slot — NOT token-bound, size only

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wordmark is white-on-transparent, so it only reads on the dark sidebar panel.
// Hidden when collapsed — 56px cannot hold a 104px wordmark.
function AccuraLogo() {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return (
    <SidebarLogo className="h-9 w-[104px]">
      <img src="/accura-logo.png" alt="Accura" className="h-full w-full object-contain" />
    </SidebarLogo>
  );
}

// Chevron points the way the panel will move: left to collapse, right to expand.
function CollapseToggle() {
  const { collapsed } = useSidebar();
  const Icon = collapsed ? ChevronRight : ChevronLeft;
  return (
    <SidebarToggle aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
      <Icon className="h-4 w-4" />
    </SidebarToggle>
  );
}

function SidebarShell() {
  return (
    <>
      <SidebarHeader className="justify-between">
        <AccuraLogo />
        <CollapseToggle />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenuItem
            icon={<PanelsTopLeft className="h-4 w-4" />}
            label="Dashboard"
            href="#"
            active
          />
          <SidebarMenuItem
            icon={<SquareCheck className="h-4 w-4" />}
            label="CAPA"
            href="#"
          />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-[var(--spacing-component-xs)]">
        <SidebarMenuItem icon={<Settings className="h-4 w-4" />} label="Setting" href="#" />
        <SidebarMenuItem icon={<LogOut className="h-4 w-4" />} label="Log Out" href="#" />
      </SidebarFooter>
    </>
  );
}

// ─── Default (Type=Default, State=Expanded — 256px) ───────────────────────────

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <div className="flex h-[560px]">
        <Sidebar type="default" collapsible="icon">
          <SidebarShell />
        </Sidebar>
        <main className="flex-1 p-6 bg-[var(--color-background-default)]">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Main content area — press Cmd+B or use the toggle to collapse.
          </p>
        </main>
      </div>
    </SidebarProvider>
  ),
};

// ─── Default Collapsed (Type=Default, State=Collapsed — 56px) ─────────────────

export const DefaultCollapsed: Story = {
  render: () => (
    <SidebarProvider defaultCollapsed>
      <div className="flex h-[560px]">
        <Sidebar type="default" collapsible="icon">
          <SidebarShell />
        </Sidebar>
        <main className="flex-1 p-6 bg-[var(--color-background-default)]">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Collapsed to icons — press Cmd+B or use the toggle to expand.
          </p>
        </main>
      </div>
    </SidebarProvider>
  ),
};
