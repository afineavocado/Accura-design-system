import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Source: radio.meta.json — verified against Figma 96:33420 (radio) + 96:33437 (radio-item)
// shadcn has no RadioItem wrapper — all radio-item patterns composed inline.
//
// Cross-check (meta.json variants):
//   Type: Basic ✓  Choice card ✓
//   State: Default ✓  Disabled ✓  Invalid ✓  (Focus is interaction — keyboard Tab)
//   Show description: True ✓  False ✓

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    defaultValue: 'option-1',
    disabled: false,
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Basic — Show description=False ────────────────────────────────────────────
// Row: flex items-center, gap spacing/component/md (12px).
// Label: label/md = text-sm font-medium, color/surface/default/foreground.
// min-h-[44px] for touch target (radio is 16×16px — row provides hit area).

export const Basic: Story = {
  render: (args) => (
    <RadioGroup {...args} aria-label="Notification channel" className="gap-0">
      {[
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS' },
        { value: 'push', label: 'Push notification' },
      ].map(({ value, label }) => (
        <div key={value} className="flex min-h-[44px] items-center gap-[var(--spacing-component-md)]">
          <RadioGroupItem value={value} id={`basic-${value}`} />
          <Label
            htmlFor={`basic-${value}`}
            className="cursor-pointer text-sm font-medium text-[var(--color-surface-default-foreground)]"
          >
            {label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

// ─── Basic — Show description=True ─────────────────────────────────────────────
// text-block: V layout, gap spacing/component/xxs (2px).
// Description: body/sm = text-sm, color/text/secondary.

export const BasicWithDescription: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" aria-label="Display density" className="gap-0 w-80">
      {[
        { value: 'default', label: 'Default', description: 'Standard spacing between items.' },
        { value: 'comfortable', label: 'Comfortable', description: 'Extra padding around list items.' },
        { value: 'compact', label: 'Compact', description: 'Maximum items visible on screen.' },
      ].map(({ value, label, description }) => (
        <div key={value} className="flex min-h-[44px] items-start gap-[var(--spacing-component-md)] py-1">
          <RadioGroupItem value={value} id={`desc-${value}`} className="mt-0.5 shrink-0" />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <Label
              htmlFor={`desc-${value}`}
              className="cursor-pointer text-sm font-medium text-[var(--color-surface-default-foreground)]"
            >
              {label}
            </Label>
            <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  ),
};

// ─── Choice card — Default ──────────────────────────────────────────────────────
// Card: border color/border/default → color/brand/primary when checked (has-[data-state=checked]).
// Radius: radius/lg. Padding: spacing/component/lg (16px). No fill — transparent.
// Focus: border switches to color/border/focus (1px INSIDE) — no outer ring on card.

export const ChoiceCard: Story = {
  render: () => (
    <RadioGroup defaultValue="pro" aria-label="Plan" className="gap-[var(--spacing-component-sm)] w-80">
      {[
        { value: 'free', label: 'Free', description: 'For personal projects and experiments.' },
        { value: 'pro', label: 'Pro', description: 'For professionals and growing teams.' },
        { value: 'enterprise', label: 'Enterprise', description: 'For large organizations.' },
      ].map(({ value, label, description }) => (
        <label
          key={value}
          htmlFor={`card-${value}`}
          className="flex cursor-pointer items-start gap-[var(--spacing-component-md)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] p-[var(--spacing-component-lg)] has-[[data-state=checked]]:border-[var(--color-brand-primary)] focus-within:border-[var(--color-border-focus)]"
        >
          <RadioGroupItem value={value} id={`card-${value}`} className="mt-0.5 shrink-0" />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <span className="text-sm font-medium text-[var(--color-surface-default-foreground)]">
              {label}
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">{description}</span>
          </div>
        </label>
      ))}
    </RadioGroup>
  ),
};

// ─── State=Disabled ────────────────────────────────────────────────────────────
// Basic disabled: label + description → color/text/disabled.
// RadioGroupItem: opacity/disabled (0.6) + border/disabled.

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="email" aria-label="Notification channel" disabled className="gap-0 w-80">
      {[
        { value: 'email', label: 'Email', description: 'Alerts sent to your inbox.' },
        { value: 'sms', label: 'SMS', description: 'Text message alerts.' },
      ].map(({ value, label, description }) => (
        <div key={value} className="flex min-h-[44px] items-start gap-[var(--spacing-component-md)] py-1">
          <RadioGroupItem value={value} id={`dis-${value}`} className="mt-0.5 shrink-0" />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <Label htmlFor={`dis-${value}`} className="text-sm font-medium text-[var(--color-text-disabled)]">
              {label}
            </Label>
            <p className="text-sm text-[var(--color-text-disabled)]">{description}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  ),
};

// ─── Choice card — Disabled ────────────────────────────────────────────────────
// Disabled Choice card: opacity/disabled on entire card frame.
// Text stays at default colors — opacity handles appearance.

export const ChoiceCardDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="pro" aria-label="Plan" disabled className="gap-[var(--spacing-component-sm)] w-80">
      {[
        { value: 'free', label: 'Free', description: 'For personal projects.' },
        { value: 'pro', label: 'Pro', description: 'For professionals.' },
      ].map(({ value, label, description }) => (
        <label
          key={value}
          htmlFor={`dis-card-${value}`}
          className="flex cursor-not-allowed items-start gap-[var(--spacing-component-md)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] p-[var(--spacing-component-lg)] opacity-[calc(var(--opacity-disabled)/100)]"
        >
          <RadioGroupItem value={value} id={`dis-card-${value}`} className="mt-0.5 shrink-0" />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <span className="text-sm font-medium text-[var(--color-surface-default-foreground)]">
              {label}
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">{description}</span>
          </div>
        </label>
      ))}
    </RadioGroup>
  ),
};

// ─── State=Invalid ──────────────────────────────────────────────────────────────
// Radio border: color/border/error (via aria-invalid). Label: color/text/invalid. Description: color/text/secondary.
// Label carries the error signal. Description stays readable as supporting context.

export const Invalid: Story = {
  render: () => (
    <RadioGroup aria-label="Required choice" className="gap-0 w-80">
      {[
        { value: 'a', label: 'Option A', description: 'Select this or Option B.' },
        { value: 'b', label: 'Option B', description: 'Select this or Option A.' },
      ].map(({ value, label, description }) => (
        <div key={value} className="flex min-h-[44px] items-start gap-[var(--spacing-component-md)] py-1">
          <RadioGroupItem
            value={value}
            id={`inv-${value}`}
            aria-invalid="true"
            className="mt-0.5 shrink-0"
          />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <Label htmlFor={`inv-${value}`} className="text-sm font-medium text-[var(--color-text-invalid)]">
              {label}
            </Label>
            <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
          </div>
        </div>
      ))}
      <p className="mt-1 text-sm text-[var(--color-text-invalid)]">Please select one option.</p>
    </RadioGroup>
  ),
};

// ─── Choice card — Invalid ─────────────────────────────────────────────────────
// Card border: color/border/error. Label: color/text/invalid. Description: color/text/secondary.

export const ChoiceCardInvalid: Story = {
  render: () => (
    <RadioGroup aria-label="Plan" className="gap-[var(--spacing-component-sm)] w-80">
      {[
        { value: 'free', label: 'Free', description: 'For personal projects.' },
        { value: 'pro', label: 'Pro', description: 'For professionals.' },
      ].map(({ value, label, description }) => (
        <label
          key={value}
          htmlFor={`inv-card-${value}`}
          className="flex cursor-pointer items-start gap-[var(--spacing-component-md)] rounded-[var(--radius-lg)] border border-[var(--color-border-error)] p-[var(--spacing-component-lg)]"
        >
          <RadioGroupItem
            value={value}
            id={`inv-card-${value}`}
            aria-invalid="true"
            className="mt-0.5 shrink-0"
          />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <span className="text-sm font-medium text-[var(--color-text-invalid)]">{label}</span>
            <span className="text-sm text-[var(--color-text-secondary)]">{description}</span>
          </div>
        </label>
      ))}
      <p className="text-sm text-[var(--color-text-invalid)]">Please select a plan.</p>
    </RadioGroup>
  ),
};

// ─── Horizontal layout ──────────────────────────────────────────────────────────

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="grid" className="flex flex-row gap-[var(--spacing-component-lg)]" aria-label="View mode">
      {['Grid', 'List', 'Compact'].map((label) => (
        <div key={label} className="flex items-center gap-[var(--spacing-component-sm)]">
          <RadioGroupItem value={label.toLowerCase()} id={`h-${label}`} />
          <Label
            htmlFor={`h-${label}`}
            className="cursor-pointer text-sm font-medium text-[var(--color-surface-default-foreground)]"
          >
            {label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  ),
};
