"use client"

import * as React from "react"
import { DayPicker, CaptionProps, useNavigation } from "react-day-picker"
import { format, setMonth, setYear, startOfMonth } from "date-fns"
import { ChevronLeft, ChevronRight, ChevronDown, Clock } from "lucide-react"
import * as Popover from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

// ─── Calendar ─────────────────────────────────────────────────────────────────
// Tokens (from Calendar.md — Figma 28:4073):
//
// Container: surface/default · border/default · radius/lg · spacing/component/md pad
// Day Default:      transparent · background/default/foreground
// Day Today:        background/accent fill · accent/foreground
// Day Selected:     brand/primary fill · primary/foreground
// Day Range-Middle: background/accent fill
// Day Outside/Disabled: text/secondary · text/disabled
// Month pill (month-year selector):
//   Default:  transparent · background/default/foreground
//   Hover:    background/accent · accent/foreground
//   Selected: brand/primary · primary/foreground
//   Disabled: text/disabled

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
type View = "days" | "months" | "years"

// ─── Shared nav button class ──────────────────────────────────────────────────

const navBtnClass = cn(
  "inline-flex items-center justify-center h-7 w-7",
  "rounded-[var(--radius-md)]",
  "border border-[var(--color-border-default)]",
  "bg-[var(--color-background-default)]",
  "text-[var(--color-background-default-foreground)]",
  "hover:bg-[var(--color-background-accent)]",
  "disabled:pointer-events-none disabled:opacity-[calc(var(--opacity-disabled)/100)]",
  "transition-colors outline-none",
  "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
)

// ─── Custom Caption ───────────────────────────────────────────────────────────

function CaptionWithToggle({
  displayMonth,
  view,
  onToggleView,
  onPrev,
  onNext,
}: {
  displayMonth: Date
  view: View
  onToggleView: (next: View) => void
  onPrev: () => void
  onNext: () => void
}) {
  const monthLabel = format(displayMonth, "MMMM")
  const yearLabel  = format(displayMonth, "yyyy")
  const inSubView  = view !== "days"

  return (
    <div className="flex items-center justify-between pb-[var(--spacing-component-sm)]">
      <button onClick={onPrev} aria-label="Previous" className={navBtnClass}>
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-0.5">
        {/* Month button — always visible, active when in months view */}
        <button
          onClick={() => onToggleView(view === "months" ? "days" : "months")}
          className={cn(
            "inline-flex items-center gap-0.5 px-2 py-1 rounded-[var(--radius-md)]",
            "text-sm font-medium transition-colors outline-none",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
            view === "months"
              ? "bg-[var(--color-background-accent)] text-[var(--color-background-accent-foreground)]"
              : "text-[var(--color-background-default-foreground)] hover:bg-[var(--color-background-accent)]"
          )}
        >
          {monthLabel}
          <ChevronDown className={cn("h-3 w-3 transition-transform", view === "months" && "rotate-180")} />
        </button>

        {/* Year button — always visible, active when in years view */}
        <button
          onClick={() => onToggleView(view === "years" ? "days" : "years")}
          className={cn(
            "inline-flex items-center gap-0.5 px-2 py-1 rounded-[var(--radius-md)]",
            "text-sm font-medium transition-colors outline-none",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
            view === "years"
              ? "bg-[var(--color-background-accent)] text-[var(--color-background-accent-foreground)]"
              : "text-[var(--color-background-default-foreground)] hover:bg-[var(--color-background-accent)]"
          )}
        >
          {yearLabel}
          <ChevronDown className={cn("h-3 w-3 transition-transform", view === "years" && "rotate-180")} />
        </button>
      </div>

      <button onClick={onNext} aria-label="Next" className={navBtnClass}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

// ─── Pill grid (shared by month + year) ──────────────────────────────────────

function PillGrid({
  items,
  selectedIndex,
  onSelect,
}: {
  items: string[]
  selectedIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      {items.map((label, i) => (
        <button
          key={label}
          onClick={() => onSelect(i)}
          className={cn(
            "flex items-center justify-center h-9 w-full rounded-[var(--radius-md)]",
            "text-sm font-medium transition-colors outline-none",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
            i === selectedIndex
              ? "bg-[var(--color-brand-primary)] text-[var(--color-brand-primary-foreground)]"
              : "text-[var(--color-background-default-foreground)] hover:bg-[var(--color-background-accent)] hover:text-[var(--color-background-accent-foreground)]"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── Calendar (core) ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CalendarProps = any

// Shared day classNames used by both single and multi-month modes
const dayClassNames = (classNames?: Record<string, string>) => ({
  table: "w-full [&_tbody_tr+tr]:mt-0.5",
  head_row: "flex",
  head_cell: cn(
    "h-8 flex-1 flex items-center justify-center",
    "text-xs font-medium",
    "text-[var(--color-text-secondary)]",
    "rounded-[var(--radius-md)]"
  ),
  row: "flex w-full",
  cell: cn(
    "relative flex-1 p-0 text-center text-sm",
    "focus-within:relative focus-within:z-20",
    "[&:has([aria-selected].day-range-middle)]:bg-[var(--color-background-accent)]",
    "[&:has([aria-selected].day-outside)]:bg-[var(--color-background-accent)]/50",
    "[&:has([aria-selected])]:rounded-[var(--radius-md)]",
    "[&:has([aria-selected].day-range-end)]:rounded-r-[var(--radius-md)]",
    "[&:has([aria-selected].day-range-start)]:rounded-l-[var(--radius-md)]"
  ),
  day: cn(
    "inline-flex items-center justify-center h-8 w-8",
    "rounded-[var(--radius-md)]",
    "text-sm font-normal",
    "text-[var(--color-background-default-foreground)]",
    "hover:bg-[var(--color-background-accent)]",
    "hover:text-[var(--color-background-accent-foreground)]",
    "aria-selected:opacity-100",
    "transition-colors outline-none",
    "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
  ),
  day_today: cn(
    "bg-[var(--color-background-accent)]",
    "text-[var(--color-background-accent-foreground)]",
    "font-medium"
  ),
  day_selected: cn(
    "bg-[var(--color-brand-primary)]",
    "text-[var(--color-brand-primary-foreground)]",
    "hover:bg-[var(--color-brand-primary-hover)]",
    "hover:text-[var(--color-brand-primary-foreground)]"
  ),
  day_range_start: cn(
    "day-range-start",
    "bg-[var(--color-brand-primary)]",
    "text-[var(--color-brand-primary-foreground)]",
    "hover:bg-[var(--color-brand-primary-hover)]",
    "rounded-r-none"
  ),
  day_range_end: cn(
    "day-range-end",
    "bg-[var(--color-brand-primary)]",
    "text-[var(--color-brand-primary-foreground)]",
    "hover:bg-[var(--color-brand-primary-hover)]",
    "rounded-l-none"
  ),
  day_range_middle: cn(
    "day-range-middle",
    "bg-[var(--color-background-accent)]",
    "text-[var(--color-background-accent-foreground)]",
    "hover:bg-[var(--color-background-accent)]",
    "rounded-none",
    "aria-selected:bg-[var(--color-background-accent)]",
    "aria-selected:text-[var(--color-background-accent-foreground)]"
  ),
  day_outside: cn(
    "day-outside",
    "text-[var(--color-text-secondary)]",
    "opacity-50",
    // When outside day is selected/range-start/range-end — restore full opacity + foreground
    "aria-selected:opacity-100",
    "aria-selected:text-[var(--color-brand-primary-foreground)]"
  ),
  day_disabled: "text-[var(--color-text-disabled)] pointer-events-none opacity-[calc(var(--opacity-disabled)/100)]",
  day_hidden: "invisible",
  ...classNames,
})

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const isMultiMonth = (props.numberOfMonths ?? 1) > 1

  // ── Multi-month (Range) — use DayPicker's built-in caption, styled ────────
  if (isMultiMonth) {
    return (
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(
          "p-[var(--spacing-component-md)]",
          "rounded-[var(--radius-lg)]",
          "border border-[var(--color-border-default)]",
          "bg-[var(--color-surface-default)]",
          className
        )}
        classNames={{
          months: "flex flex-row gap-8",
          month: "flex flex-col gap-2",
          caption: "flex justify-center items-center relative pb-2",
          caption_label: "text-sm font-medium text-[var(--color-background-default-foreground)]",
          nav: "flex items-center gap-1",
          nav_button: navBtnClass,
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          ...dayClassNames(classNames),
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />
    )
  }

  // ── Single month — custom caption with month/year selector ────────────────
  const [view, setView] = React.useState<View>("days")
  const [displayMonth, setDisplayMonth] = React.useState<Date>(
    (props.month as Date | undefined) ?? new Date()
  )

  const yearStart  = Math.floor(displayMonth.getFullYear() / 12) * 12
  const yearLabels = Array.from({ length: 12 }, (_, i) => String(yearStart + i))

  const handlePrev = () => {
    if (view === "years")  setDisplayMonth(d => setYear(d, yearStart - 12))
    else if (view === "months") setDisplayMonth(d => setYear(d, d.getFullYear() - 1))
    else setDisplayMonth(d => { const p = new Date(d); p.setMonth(p.getMonth() - 1); return p })
  }

  const handleNext = () => {
    if (view === "years")  setDisplayMonth(d => setYear(d, yearStart + 12))
    else if (view === "months") setDisplayMonth(d => setYear(d, d.getFullYear() + 1))
    else setDisplayMonth(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n })
  }

  const handleToggle = (next: View) => {
    setView(prev => prev === next ? "days" : next)
  }

  return (
    <div className={cn(
      "w-[260px] p-[var(--spacing-component-md)]",
      "rounded-[var(--radius-lg)]",
      "border border-[var(--color-border-default)]",
      "bg-[var(--color-surface-default)]",
      className
    )}>
      <CaptionWithToggle
        displayMonth={displayMonth}
        view={view}
        onToggleView={handleToggle}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {view === "months" && (
        <PillGrid
          items={MONTH_NAMES}
          selectedIndex={displayMonth.getMonth()}
          onSelect={(i) => {
            setDisplayMonth(d => startOfMonth(setMonth(d, i)))
            setView("days")
          }}
        />
      )}

      {view === "years" && (
        <PillGrid
          items={yearLabels}
          selectedIndex={yearLabels.indexOf(String(displayMonth.getFullYear()))}
          onSelect={(i) => {
            setDisplayMonth(d => setYear(d, yearStart + i))
            setView("months")
          }}
        />
      )}

      {view === "days" && (
        <DayPicker
          showOutsideDays={showOutsideDays}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          classNames={{
            months: "flex flex-col",
            month: "flex flex-col",
            caption: "hidden",
            caption_label: "hidden",
            nav: "hidden",
            ...dayClassNames(classNames),
          }}
          {...props}
        />
      )}
    </div>
  )
}
Calendar.displayName = "Calendar"

// ─── Preset option type ───────────────────────────────────────────────────────

export interface CalendarPreset {
  label: string
  getValue: () => { from: Date; to: Date }
}

// ─── CalendarWithPresets ──────────────────────────────────────────────────────
// Type=Presets: preset shortcut list on left + calendar on right

interface CalendarWithPresetsProps {
  presets?: CalendarPreset[]
  className?: string
}

function CalendarWithPresets({ presets, className }: CalendarWithPresetsProps) {
  const [selected, setSelected] = React.useState<{ from: Date; to: Date } | undefined>()
  const [activePreset, setActivePreset] = React.useState<string | null>(null)

  const handlePreset = (preset: CalendarPreset) => {
    const value = preset.getValue()
    setSelected(value)
    setActivePreset(preset.label)
  }

  return (
    <div className={cn(
      "flex rounded-[var(--radius-lg)] border border-[var(--color-border-default)] overflow-hidden",
      "bg-[var(--color-surface-default)]",
      className
    )}>
      {/* Preset list */}
      <div className="flex flex-col gap-1 p-[var(--spacing-component-md)] border-r border-[var(--color-border-default)] w-40 shrink-0">
        {(presets ?? defaultPresets).map((p) => (
          <button
            key={p.label}
            onClick={() => handlePreset(p)}
            className={cn(
              "text-left px-[var(--spacing-component-sm)] py-[var(--spacing-component-xs)] rounded-[var(--radius-md)]",
              "text-sm transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
              activePreset === p.label
                ? "bg-[var(--color-background-accent)] text-[var(--color-background-accent-foreground)] font-medium"
                : "text-[var(--color-background-default-foreground)] hover:bg-[var(--color-background-accent)]"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <Calendar
        mode="range"
        selected={selected}
        onSelect={(r: { from: Date; to: Date } | undefined) => {
          setSelected(r)
          setActivePreset(null)
        }}
        className="border-0 rounded-none"
      />
    </div>
  )
}

const defaultPresets: CalendarPreset[] = [
  { label: "Today",      getValue: () => { const t = new Date(); return { from: t, to: t } } },
  { label: "Yesterday",  getValue: () => { const t = new Date(); t.setDate(t.getDate() - 1); return { from: t, to: t } } },
  { label: "Last 7 days", getValue: () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 6); return { from, to } } },
  { label: "Last 30 days", getValue: () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 29); return { from, to } } },
  { label: "This month", getValue: () => { const now = new Date(); return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date(now.getFullYear(), now.getMonth() + 1, 0) } } },
]

// ─── TimePicker ───────────────────────────────────────────────────────────────
// Custom time picker — two scrollable columns (HH / MM) in a popover.
// Tokens: surface/overlay container · border/default · radius/md · shadow/sm
// Selected row: brand/primary · primary/foreground
// Hover row: background/accent · accent/foreground

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTES = ["00","05","10","15","20","25","30","35","40","45","50","55"]

function TimeColumn({
  items,
  selected,
  onSelect,
}: {
  items: string[]
  selected: string
  onSelect: (val: string) => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  // Scroll selected item into centre on mount / change
  React.useEffect(() => {
    const el = ref.current?.querySelector("[data-selected=true]") as HTMLElement | null
    el?.scrollIntoView({ block: "center", behavior: "instant" })
  }, [selected])

  return (
    <div
      ref={ref}
      className="flex flex-col gap-0.5 overflow-y-auto h-48 scrollbar-none"
      style={{ scrollbarWidth: "none" }}
    >
      {items.map((val) => {
        const isSelected = val === selected
        return (
          <button
            key={val}
            data-selected={isSelected}
            onClick={() => onSelect(val)}
            className={cn(
              "flex items-center justify-center h-8 w-12 shrink-0 rounded-[var(--radius-md)]",
              "text-sm font-medium transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
              isSelected
                ? "bg-[var(--color-brand-primary)] text-[var(--color-brand-primary-foreground)]"
                : "text-[var(--color-background-default-foreground)] hover:bg-[var(--color-background-accent)] hover:text-[var(--color-background-accent-foreground)]"
            )}
          >
            {val}
          </button>
        )
      })}
    </div>
  )
}

// ─── CalendarWithTime ─────────────────────────────────────────────────────────
// Type=Date-Time Picker: calendar + time input section

interface CalendarWithTimeProps {
  className?: string
}

function CalendarWithTime({ className }: CalendarWithTimeProps) {
  const [date, setDate]       = React.useState<Date | undefined>()
  const [hours, setHours]     = React.useState("12")
  const [minutes, setMinutes] = React.useState("00")
  const [open, setOpen]       = React.useState(false)
  const [inputVal, setInputVal] = React.useState("12:00")

  // Sync typed input → columns
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputVal(val)
    const match = val.match(/^(\d{1,2}):(\d{2})$/)
    if (match) {
      const h = String(Math.min(23, parseInt(match[1]))).padStart(2, "0")
      const m = String(Math.min(59, parseInt(match[2]))).padStart(2, "0")
      setHours(h)
      // Snap minutes to nearest 5
      const snapped = MINUTES.reduce((prev, cur) =>
        Math.abs(parseInt(cur) - parseInt(m)) < Math.abs(parseInt(prev) - parseInt(m)) ? cur : prev
      )
      setMinutes(snapped)
    }
  }

  // Sync column selection → input
  const handleHourSelect = (h: string) => {
    setHours(h)
    setInputVal(`${h}:${minutes}`)
  }
  const handleMinuteSelect = (m: string) => {
    setMinutes(m)
    setInputVal(`${hours}:${m}`)
  }

  return (
    <div className={cn(
      "rounded-[var(--radius-lg)] border border-[var(--color-border-default)] overflow-hidden",
      "bg-[var(--color-surface-default)]",
      className
    )}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="border-0 rounded-none w-full"
      />

      {/* Time section */}
      <div className="border-t border-[var(--color-border-default)] p-3">
        <p className="text-sm font-medium text-[var(--color-background-default-foreground)] mb-2">
          Time
        </p>

        <Popover.Root open={open} onOpenChange={setOpen}>
          {/* Trigger container — input + clock icon button */}
          <div className={cn(
            "flex items-center gap-[var(--spacing-component-sm)]",
            "h-9 w-full rounded-[var(--radius-md)]",
            "border border-[var(--color-input-border)]",
            "bg-[var(--color-background-default)]",
            "px-[var(--spacing-component-md)]",
            "transition-colors",
            "focus-within:border-[var(--color-border-focus)]",
            "focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]",
            open && "border-[var(--color-border-focus)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ring)_20%,transparent)]"
          )}>
            {/* Typeable input */}
            <input
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              placeholder="HH:MM"
              className={cn(
                "flex-1 bg-transparent text-sm outline-none",
                "text-[var(--color-background-default-foreground)]",
                "placeholder:text-[var(--color-input-placeholder)]"
              )}
            />

            {/* Clock icon — trailing, toggles popover */}
            <Popover.Trigger asChild>
              <button
                type="button"
                className="shrink-0 outline-none"
                tabIndex={-1}
                aria-label="Open time picker"
              >
                <Clock className="h-4 w-4 text-[var(--color-icon-default)]" />
              </button>
            </Popover.Trigger>
          </div>

          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
              className={cn(
                "z-50 rounded-[var(--radius-lg)]",
                "border border-[var(--color-border-default)]",
                "bg-[var(--color-surface-overlay)]",
                "p-0.5 shadow-[var(--shadow-sm)]",
                "outline-none",
                "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              )}
            >
              <div className="flex gap-0.5 items-start">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] pb-1">HH</span>
                  <TimeColumn items={HOURS} selected={hours} onSelect={handleHourSelect} />
                </div>
                <div className="flex items-center h-48 pt-7">
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">:</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] pb-1">MM</span>
                  <TimeColumn items={MINUTES} selected={minutes} onSelect={handleMinuteSelect} />
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  )
}

export { Calendar, CalendarWithPresets, CalendarWithTime }
export type { CalendarWithPresetsProps, CalendarWithTimeProps }
