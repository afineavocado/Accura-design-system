import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
  SidebarSubItem,
  SidebarFooter,
  SidebarToggle,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  BarChart01,
  Users,
  Settings01,
  HelpCircle,
  Bell,
  File06,
  Menu01,
} from 'lucide-react';

// Source: sidebar.meta.json — Figma 95:18202 / 95:15354 / 95:15549 / 95:14510 / 95:14511
//
// Tokens:
//   Panel: sidebar/background · sidebar/border (right edge)
//   Nav item default: transparent · sidebar/foreground
//   Nav item hover/active: sidebar/accent · sidebar/accent/foreground
//   Group label: sidebar/foreground (60% opacity)
//   Badge: brand/primary · brand/primary/foreground
//   Focus ring: sidebar/ring
//   Logo: 28×28px, NOT token-bound (branding slot)

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const navItems = [
  { icon: <LayoutGrid className="h-4 w-4" />, label: 'Dashboard', active: true },
  { icon: <BarChart01 className="h-4 w-4" />, label: 'Analytics', badge: '3' },
  { icon: <File06 className="h-4 w-4" />, label: 'Projects' },
  { icon: <Users className="h-4 w-4" />, label: 'Team' },
];

const bottomItems = [
  { icon: <Settings01 className="h-4 w-4" />, label: 'Settings' },
  { icon: <HelpCircle className="h-4 w-4" />, label: 'Help' },
];

// ─── Default (Type=Default, expanded) ─────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <div className="flex h-[500px]">
        <Sidebar type="default" collapsible="none">
          <SidebarHeader>
            <SidebarLogo>
              <div className="h-7 w-7 rounded-md bg-[var(--color-brand-primary)] flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
            </SidebarLogo>
            <SidebarBrand title="Agentic" caption="Design System" />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label} {...item} href="#" />
              ))}
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarMenuItem icon={<Bell className="h-4 w-4" />} label="Notifications" href="#" badge="12" />
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.label} {...item} href="#" />
            ))}
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-6 bg-[var(--color-background-default)]">
          <p className="text-sm text-[var(--color-text-secondary)]">Main content area</p>
        </main>
      </div>
    </SidebarProvider>
  ),
};

// ─── With sub-items ────────────────────────────────────────────────────────────

export const WithSubItems: Story = {
  render: () => (
    <SidebarProvider>
      <div className="flex h-[500px]">
        <Sidebar type="default" collapsible="none">
          <SidebarHeader>
            <SidebarLogo>
              <div className="h-7 w-7 rounded-md bg-[var(--color-brand-primary)] flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
            </SidebarLogo>
            <SidebarBrand title="Agentic" caption="Design System" />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarMenuItem icon={<LayoutGrid className="h-4 w-4" />} label="Dashboard" href="#" active />
              <SidebarMenuItem icon={<BarChart01 className="h-4 w-4" />} label="Analytics" href="#" />
              <SidebarSubItem label="Overview" href="#" />
              <SidebarSubItem label="Reports" href="#" active />
              <SidebarSubItem label="Exports" href="#" />
              <SidebarMenuItem icon={<Users className="h-4 w-4" />} label="Team" href="#" />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6 bg-[var(--color-background-default)]" />
      </div>
    </SidebarProvider>
  ),
};

// ─── Collapsible (icon mode) ───────────────────────────────────────────────────

export const Collapsible: Story = {
  render: () => (
    <SidebarProvider>
      <div className="flex h-[500px]">
        <Sidebar type="default" collapsible="icon">
          <SidebarHeader>
            <SidebarLogo>
              <div className="h-7 w-7 rounded-md bg-[var(--color-brand-primary)] flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
            </SidebarLogo>
            <SidebarBrand title="Agentic" caption="Design System" />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label} {...item} href="#" />
              ))}
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarToggle>
              <Menu01 className="h-4 w-4" />
            </SidebarToggle>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-6 bg-[var(--color-background-default)]">
          <p className="text-sm text-[var(--color-text-secondary)]">Press Cmd+B or click the toggle to collapse</p>
        </main>
      </div>
    </SidebarProvider>
  ),
};

// ─── Floating (Type=Floating) ──────────────────────────────────────────────────

export const Floating: Story = {
  render: () => (
    <SidebarProvider>
      <div className="flex h-[500px] bg-[var(--color-background-muted)] p-4 gap-4">
        <Sidebar type="floating" collapsible="none">
          <SidebarHeader>
            <SidebarLogo>
              <div className="h-7 w-7 rounded-md bg-[var(--color-brand-primary)] flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
            </SidebarLogo>
            <SidebarBrand title="Agentic" caption="Design System" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label} {...item} href="#" />
              ))}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 rounded-[var(--radius-lg)] bg-[var(--color-background-default)] p-6">
          <p className="text-sm text-[var(--color-text-secondary)]">Main content</p>
        </main>
      </div>
    </SidebarProvider>
  ),
};
