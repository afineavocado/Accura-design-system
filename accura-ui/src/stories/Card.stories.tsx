import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Source: card.meta.json (category, variants, tokens)
// Patterns: card.examples.tsx
// Note: Card variants are example compositions — not a closed set of modes.
// The shell (fill, border, radius, padding, gap) is what the component owns.

const meta = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Shell check ──────────────────────────────────────────────────────────────
// Verify: white fill, #e4e4e7 border, 8px radius, 24px padding, 16px gap

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description — secondary text token.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-text-secondary)]">Card body content.</p>
      </CardContent>
    </Card>
  ),
};

// ─── Action variant ───────────────────────────────────────────────────────────

export const Action: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Upgrade your plan</CardTitle>
        <CardDescription>Get access to advanced features and priority support.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Upgrade to Pro</Button>
      </CardFooter>
    </Card>
  ),
};

// ─── Form variant ─────────────────────────────────────────────────────────────

export const Form: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email and password to continue.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="flex-1">Cancel</Button>
        <Button className="flex-1">Sign in</Button>
      </CardFooter>
    </Card>
  ),
};

// ─── Info / metric variant ────────────────────────────────────────────────────

export const Info: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <CardDescription>vs. last month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[var(--color-surface-overlay-foreground)]">$12,450</span>
          <Badge variant="success" shape="pill">+8.2%</Badge>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Revenue increased by $944 vs. the previous period.
        </p>
      </CardContent>
    </Card>
  ),
};

// ─── Border variant — color/border/strong ─────────────────────────────────────

export const Border: Story = {
  render: () => (
    <Card className="w-80 border-[var(--color-border-strong)]">
      <CardHeader>
        <CardTitle>Pro plan</CardTitle>
        <CardDescription>Everything you need for a growing team.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[var(--color-surface-overlay-foreground)]">
          $49<span className="text-base font-normal text-[var(--color-text-secondary)]">/mo</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get started</Button>
      </CardFooter>
    </Card>
  ),
};

// ─── Item / settings variant ──────────────────────────────────────────────────
// NOTE: The Figma Item variant uses the `item` sub-component for each row.
// `item` has no implementation yet — rows below are plain divs as placeholders.
// Revisit once Item is built.

export const Item: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what you want to be notified about.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        {['Email digest', 'Push notifications', 'Weekly report'].map((item) => (
          <div key={item} className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-[var(--color-surface-overlay-foreground)]">{item}</span>
            <Button size="sm" variant="outline">Configure</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  ),
};

// ─── Social media variant ─────────────────────────────────────────────────────
// card-header: Avatar + username + follow button
// Image contained inside padded shell (no bleed — spec does not call out p-0 for this variant)

export const SocialMedia: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[var(--spacing-component-sm)]">
            <Avatar size="default">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-[var(--color-surface-overlay-foreground)]">
                Jane Doe
              </span>
              <span className="text-xs text-[var(--color-text-secondary)]">@janedoe</span>
            </div>
          </div>
          <Button size="sm" variant="outline">Follow</Button>
        </div>
      </CardHeader>
      <div className="w-full aspect-video bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] flex items-center justify-center">
        <span className="text-xs text-[var(--color-text-secondary)]">Image placeholder</span>
      </div>
      <CardContent>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Sharing something I've been working on. Excited to show everyone soon!
        </p>
      </CardContent>
    </Card>
  ),
};

// ─── Image-vertical variant ───────────────────────────────────────────────────
// Full-width image bleeds to top edge — card shell: p-0 gap-0 overflow-hidden
// Content wrapper re-applies spacing/component/xl padding below the image

export const ImageVertical: Story = {
  render: () => (
    <Card className="w-80 p-0 gap-0 overflow-hidden">
      <div className="w-full aspect-video bg-[var(--color-surface-muted)] flex items-center justify-center">
        <span className="text-xs text-[var(--color-text-secondary)]">Image placeholder</span>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-component-xl)]">
        <CardHeader>
          <CardTitle>Product name</CardTitle>
          <CardDescription>A short description of the product or article preview.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full">View details</Button>
        </CardFooter>
      </div>
    </Card>
  ),
};

// ─── Image-down variant ───────────────────────────────────────────────────────
// Content at top, full-width image bleeds to bottom edge
// Shell: p-0 gap-0 overflow-hidden — content wrapper owns the padding

export const ImageDown: Story = {
  render: () => (
    <Card className="w-80 p-0 gap-0 overflow-hidden">
      <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-component-xl)]">
        <CardHeader>
          <CardTitle>Announcement</CardTitle>
          <CardDescription>
            Supporting text leads the card. The image below provides visual context.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="flex-1">Dismiss</Button>
          <Button className="flex-1">Learn more</Button>
        </CardFooter>
      </div>
      <div className="w-full aspect-video bg-[var(--color-surface-muted)] flex items-center justify-center">
        <span className="text-xs text-[var(--color-text-secondary)]">Image placeholder</span>
      </div>
    </Card>
  ),
};

// ─── Image-horizontal variant ─────────────────────────────────────────────────
// Square image bleeds to left edge, content on right
// Shell: flex-row p-0 overflow-hidden — content wrapper owns padding on right side

export const ImageHorizontal: Story = {
  render: () => (
    <Card className="w-80 flex-row p-0 overflow-hidden">
      <div className="w-32 shrink-0 bg-[var(--color-surface-muted)] flex items-center justify-center">
        <span className="text-xs text-[var(--color-text-secondary)]">Image</span>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)] p-[var(--spacing-component-xl)] flex-1">
        <CardHeader>
          <CardTitle>Product name</CardTitle>
          <CardDescription>Brief supporting description.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="sm" className="w-full">Add to cart</Button>
        </CardFooter>
      </div>
    </Card>
  ),
};

// ─── All shells side by side — visual check ───────────────────────────────────

export const ShellComparison: Story = {
  render: () => (
    <div className="flex gap-4 items-start">
      <Card className="w-56">
        <CardHeader>
          <CardTitle>Default border</CardTitle>
          <CardDescription>color/border/default</CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-56 border-[var(--color-border-strong)]">
        <CardHeader>
          <CardTitle>Strong border</CardTitle>
          <CardDescription>color/border/strong</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
};
