import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Source: accordion.meta.json (category, variants, tokens)
// Patterns: accordion.examples.tsx

const meta = {
  title: 'Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    // Accordion is a composite component — Controls panel drives the Root props only.
    // State (Closed / Open / Disabled) is demonstrated via named stories below.
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── State: Closed (default) ──────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-80">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// ─── State: Open (defaultValue shows an open item) ────────────────────────────

export const DefaultOpen: Story = {
  render: () => (
    <Accordion type="single" defaultValue="item-1" collapsible className="w-80">
      <AccordionItem value="item-1">
        <AccordionTrigger>Open by default</AccordionTrigger>
        <AccordionContent>
          This panel is open by default. The content text uses the secondary text token.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Closed by default</AccordionTrigger>
        <AccordionContent>This panel starts closed.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// ─── State: Disabled ──────────────────────────────────────────────────────────

export const WithDisabledItem: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-80">
      <AccordionItem value="item-1">
        <AccordionTrigger>Available feature</AccordionTrigger>
        <AccordionContent>This content is accessible.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Unavailable feature</AccordionTrigger>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Another available feature</AccordionTrigger>
        <AccordionContent>This content is also accessible.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// ─── type=multiple ────────────────────────────────────────────────────────────

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-80">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is included?</AccordionTrigger>
        <AccordionContent>
          Tokens, components, and usage documentation for every component in the system.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Can I customise it?</AccordionTrigger>
        <AccordionContent>
          Yes — all tokens are variable-bound and can be remapped for theming or dark mode.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. Multiple items can be open simultaneously in this mode.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
