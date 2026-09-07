import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuPanelLink,
} from '@/components/ui/navigation-menu';
import { LayoutGrid, BookOpen, Users, DollarSign, Star } from 'lucide-react';

// Source: navigation-menu.meta.json — Figma 127:193 / 127:353 / 127:157
//
// Tokens:
//   nav-button: bg/default · hover: bg/accent · focus: ring · label/icon: bg/default/fg
//   nav-panel:  surface/overlay · border/default · radius/base · shadow/shadow
//   nav-panel-link: hover bg/accent · title: surface/default/fg · description: text/secondary
//
// Stories cover: List panel, Grid panel, Featured panel, Type=Link, disabled states

const meta = {
  title: 'Navigation/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="p-6 bg-[var(--color-background-default)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── List panel (Layout=List) ──────────────────────────────────────────────────

export const ListPanel: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <LayoutGrid className="h-4 w-4" />
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex flex-col gap-1 p-[var(--spacing-component-lg)] w-56">
              <NavigationMenuPanelLink
                href="#"
                title="Components"
                description="Reusable design system building blocks"
              />
              <NavigationMenuPanelLink
                href="#"
                title="Templates"
                description="Ready-made page layouts and flows"
              />
              <NavigationMenuPanelLink
                href="#"
                title="Figma kit"
                description="Design tokens and component library"
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// ─── Grid panel (Layout=Grid) ──────────────────────────────────────────────────

export const GridPanel: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <BookOpen className="h-4 w-4" />
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-1 p-[var(--spacing-component-lg)] w-[480px]">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-[var(--color-text-secondary)] px-[var(--spacing-component-md)] py-1">
                  Learn
                </p>
                <NavigationMenuPanelLink href="#" title="Documentation" description="Component API and usage guides" />
                <NavigationMenuPanelLink href="#" title="Tutorials" description="Step-by-step walkthroughs" />
                <NavigationMenuPanelLink href="#" title="Changelog" description="What's new in each release" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-[var(--color-text-secondary)] px-[var(--spacing-component-md)] py-1">
                  Community
                </p>
                <NavigationMenuPanelLink href="#" title="GitHub" description="Source code and contributions" />
                <NavigationMenuPanelLink href="#" title="Discord" description="Chat with the community" />
                <NavigationMenuPanelLink href="#" title="Updates" description="Announcements and releases" />
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// ─── Featured panel (Layout=Featured) ─────────────────────────────────────────

export const FeaturedPanel: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Star className="h-4 w-4" />
            Featured
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex gap-4 p-[var(--spacing-component-lg)] w-[560px]">
              {/* Featured SLOT — 160px */}
              <div className="w-40 shrink-0 rounded-[var(--radius-md)] bg-[var(--color-background-muted)] flex items-center justify-center min-h-[120px]">
                <span className="text-xs text-[var(--color-text-secondary)]">Featured</span>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <NavigationMenuPanelLink href="#" title="What's new in v2" description="Everything that changed in our latest release" />
                <NavigationMenuPanelLink href="#" title="Migration guide" description="Upgrade from v1 step by step" />
                <NavigationMenuPanelLink href="#" title="Release notes" description="Full changelog for all versions" />
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// ─── Type=Link (direct navigation, no panel) ──────────────────────────────────

export const LinkType: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#"
            className="inline-flex items-center gap-[var(--spacing-component-xs)] rounded-[var(--radius-md)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] text-sm font-medium text-[var(--color-background-default-foreground)] hover:bg-[var(--color-background-accent)] hover:text-[var(--color-background-accent-foreground)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            <DollarSign className="h-4 w-4" />
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// ─── Full nav bar — Trigger + Link combined ────────────────────────────────────

export const FullNavBar: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Trigger — List panel */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <LayoutGrid className="h-4 w-4" />
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex flex-col gap-1 p-[var(--spacing-component-lg)] w-56">
              <NavigationMenuPanelLink href="#" title="Components" description="Design system building blocks" />
              <NavigationMenuPanelLink href="#" title="Templates" description="Ready-made layouts" />
              <NavigationMenuPanelLink href="#" title="Figma kit" description="Tokens and component library" />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Trigger — Grid panel */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Users className="h-4 w-4" />
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-1 p-[var(--spacing-component-lg)] w-[440px]">
              <div className="flex flex-col gap-1">
                <NavigationMenuPanelLink href="#" title="Documentation" description="API and usage guides" />
                <NavigationMenuPanelLink href="#" title="Tutorials" description="Step-by-step walkthroughs" />
              </div>
              <div className="flex flex-col gap-1">
                <NavigationMenuPanelLink href="#" title="GitHub" description="Source and contributions" />
                <NavigationMenuPanelLink href="#" title="Discord" description="Community chat" />
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Type=Link */}
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#"
            className="inline-flex items-center gap-[var(--spacing-component-xs)] rounded-[var(--radius-md)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] text-sm font-medium text-[var(--color-background-default-foreground)] hover:bg-[var(--color-background-accent)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            <DollarSign className="h-4 w-4" />
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// ─── Disabled panel link ───────────────────────────────────────────────────────

export const DisabledLink: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <BookOpen className="h-4 w-4" />
            Plans
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex flex-col gap-1 p-[var(--spacing-component-lg)] w-56">
              <NavigationMenuPanelLink href="#" title="Free" description="Get started at no cost" />
              <NavigationMenuPanelLink href="#" title="Pro" description="For growing teams" />
              <NavigationMenuPanelLink href="#" title="Enterprise" description="Coming soon" disabled />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
