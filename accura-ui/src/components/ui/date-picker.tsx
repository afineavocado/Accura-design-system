"use client"

import * as React from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import * as Popover from "@radix-ui/react-popover"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// ─── Date Picker ──────────────────────────────────────────────────────────────
// Tokens (from Date-picker.md — Figma 58:15976):
//
// trigger states:
//   Closed:  bg/default · input/border  1px
//   Hover:   background/subtle · input/border 1px
//   Focus:   bg/default · border/focus 1px
//   Open:    bg/default · border/default 1px
//
// text:   color/input/placeholder (placeholder)
// icon:   ChevronDown (Default) · Calendar (Range/Input)
// radius: radius/md
// gap:    spacing/component/sm

export interface DatePickerProps {
  id?: string
  label?: string
  type?: "default" | "range" | "input"
  placeholder?: string
  value?: Date | DateRange
  onChange?: (value: Date | DateRange | undefined) => void
  disabled?: boolean
  className?: string
}

function DatePicker({
  id,
  label,
  type = "default",
  placeholder,
  value,
  onChange,
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    type === "default" || type === "input" ? (value as Date | undefined) : undefined
  )
  const [range, setRange] = React.useState<DateRange | undefined>(
    type === "range" ? (value as DateRange | undefined) : undefined
  )

  const triggerLabel = React.useMemo(() => {
    if (type === "range") {
      if (!range?.from) return null
      if (!range.to) return format(range.from, "MMM d, yyyy")
      return `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`
    }
    return date ? format(date, "MMM d, yyyy") : null
  }, [type, date, range])

  const TriggerIcon = type === "default" ? ChevronDown : CalendarIcon

  return (
    <div className={cn("flex flex-col gap-[var(--spacing-component-xs)]", className)}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--color-background-default-foreground)]"
        >
          {label}
        </label>
      )}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            id={id}
            disabled={disabled}
            aria-expanded={open}
            className={cn(
              "inline-flex items-center gap-[var(--spacing-component-sm)]",
              "h-9 w-full rounded-[var(--radius-md)]",
              "border px-[var(--spacing-component-md)]",
              "text-sm outline-none transition-colors text-left",
              // State: Closed
              "bg-[var(--color-input-bg)] border-[var(--color-input-border)]",
              // State: Hover
              "hover:bg-[var(--color-input-bg)] hover:border-[var(--color-border-hover)]",
              // State: Focus
              "focus-visible:bg-[var(--color-input-bg)] focus-visible:border-[var(--color-border-focus)]",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-0",
              // State: Open
              open && "bg-[var(--color-input-bg)] border-[var(--color-border-focus)]",
              // Disabled
              disabled && "cursor-not-allowed opacity-[calc(var(--opacity-disabled)/100)]"
            )}
          >
            <span className={cn(
              "flex-1 truncate",
              triggerLabel
                ? "text-[var(--color-background-default-foreground)]"
                : "text-[var(--color-input-placeholder)]"
            )}>
              {triggerLabel ?? placeholder ?? "Pick a date"}
            </span>
            <TriggerIcon className="h-4 w-4 shrink-0 text-[var(--color-icon-default)]" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            className={cn(
              "z-50 rounded-[var(--radius-lg)]",
              "border border-[var(--color-border-default)]",
              "bg-[var(--color-surface-overlay)]",
              "shadow-[var(--shadow-md)]",
              "outline-none",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            )}
          >
            {type === "range" ? (
              <CalendarComponent
                mode="range"
                selected={range}
                onSelect={(r: any) => {
                  setRange(r)
                  onChange?.(r)
                  if (r?.from && r?.to) setOpen(false)
                }}
                numberOfMonths={2}
                className="border-none shadow-none bg-transparent"
              />
            ) : (
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(d: any) => {
                  setDate(d)
                  onChange?.(d)
                  setOpen(false)
                }}
                className="border-none shadow-none bg-transparent"
              />
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

export { DatePicker }
