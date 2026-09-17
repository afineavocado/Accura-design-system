"use client"

import * as React from "react"
import * as Popover from "@radix-ui/react-popover"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

/* Prototype-only row action menu. The design system has no DropdownMenu yet
   (see flow/Setting Module/Setting_Module_Log.md §1.5) — this is a Popover with buttons, styled from tokens. */
export type RowMenuItem = { label: string; onSelect: () => void; destructive?: boolean; disabled?: boolean }

export function RowMenu({ label, items }: { label: string; items: RowMenuItem[] }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${label}`}>
          <MoreHorizontal className="size-4" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={4}
          className="z-50 flex min-w-40 flex-col rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] p-[var(--spacing-component-xs)]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
              className={`rounded-[var(--radius-sm)] px-[var(--spacing-component-sm)] py-[var(--spacing-component-sm)] text-left text-sm hover:bg-[var(--color-background-muted)] focus-visible:bg-[var(--color-background-muted)] focus-visible:outline-none disabled:pointer-events-none disabled:text-[var(--color-text-disabled)] ${
                item.destructive ? "text-[var(--color-text-invalid)]" : "text-[var(--color-surface-overlay-foreground)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
