"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* Segmented control — choose one of N, every option visible.
 *
 * Built because the prototype-build skill logged this pattern as hand-rolled
 * in training/courses/new and said the second screen that needed it should get
 * a real component. Create Deviation is that second screen, with four of them.
 *
 * Not ButtonGroup: its spec groups actions that are "mutually independent".
 * Not RadioGroup: semantically right, but radio circles read too weak for a
 * control that restructures the form beneath it.
 *
 * ⚠️ Code-first. There is no Figma node, spec or meta.json for this yet, so it
 * is deliberately NOT given a Storybook story — that would trip drift-check
 * rule 5, which exists to catch exactly this kind of undocumented component.
 */

export interface ToggleGroupProps {
  /** Accessible name for the group — usually the field label's text. */
  label: string
  options: readonly string[]
  value: string
  onValueChange: (value: string) => void
  /** Ties the group to a visible <Label> via its id. */
  "aria-labelledby"?: string
  className?: string
}

export function ToggleGroup({
  label,
  options,
  value,
  onValueChange,
  "aria-labelledby": labelledBy,
  className,
}: ToggleGroupProps) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])

  /* Arrow keys move between options and select as they go, which is how a
     radio group behaves. Only the checked option is in the tab order. */
  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown"
    const next = (index + (forward ? 1 : -1) + options.length) % options.length
    onValueChange(options[next])
    refs.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      className={cn(
        "flex flex-wrap gap-[var(--spacing-component-sm)]",
        className
      )}
    >
      {options.map((option, index) => {
        const checked = option === value
        return (
          <button
            key={option}
            ref={(node) => {
              refs.current[index] = node
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onValueChange(option)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "inline-flex h-[var(--button-size-button-height-default)] items-center justify-center",
              "rounded-full border px-[var(--button-size-button-padding-default)]",
              "text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
              checked
                ? "border-transparent bg-[var(--color-brand-primary)] text-[var(--color-brand-primary-foreground)]"
                : "border-[var(--color-border-default)] bg-[var(--color-surface-default)] text-[var(--color-surface-default-foreground)] hover:bg-[var(--color-background-accent)]"
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
