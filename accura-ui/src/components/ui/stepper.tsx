"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Stepper ──────────────────────────────────────────────────────────────────
// Custom component — shadcn/ui has no stepper.
// Tokens (from Stepper.md):
//
// Indicator — 24×24, radius/full:
//   complete: color/brand/primary        · check  color/brand/primary/foreground
//   current:  color/background/default   · 2px color/brand/primary · number brand/primary
//   upcoming: color/background/muted     · 2px stepper/border · number color/text/secondary
//
// Label (text-sm) — sits BELOW the indicator:
//   complete: color/background/default/foreground, semibold
//   current:  color/brand/primary, semibold
//   upcoming: color/text/secondary
//
// Description (text-xs, optional):
//   complete / current: color/text/secondary
//   upcoming:           color/text/tertiary
//
// Connector — 2px, coloured by the step it LEAVES:
//   after a complete step: color/brand/primary
//   otherwise:             color/border/default

type StepStatus = "complete" | "current" | "upcoming"

export interface Step {
  /** Short label — 1–3 words reads best */
  label: string
  /** Optional supporting line under the label — owner, count, timestamp */
  description?: string
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLOListElement>, "onClick"> {
  /** Ordered steps */
  steps: Step[]
  /** Active step — **1-based**. `2` means the second step is current. */
  currentStep: number
  orientation?: "horizontal" | "vertical"
  /** Makes complete and current steps clickable. Upcoming steps stay disabled. */
  onStepClick?: (stepNumber: number) => void
  /** Accessible name for the list */
  "aria-label"?: string
}

function statusOf(index: number, currentStep: number): StepStatus {
  const step = index + 1
  if (step < currentStep) return "complete"
  if (step === currentStep) return "current"
  return "upcoming"
}

const statusWord: Record<StepStatus, string> = {
  complete: ", completed",
  current: ", current step",
  upcoming: ", not started",
}

// ─── Indicator ────────────────────────────────────────────────────────────────

function StepIndicator({ status, number }: { status: StepStatus; number: number }) {
  return (
    <span
      className={cn(
        "grid place-items-center shrink-0 h-6 w-6 rounded-[var(--radius-full)]",
        "text-xs font-medium leading-none transition-colors",
        status === "complete" &&
          "bg-[var(--color-brand-primary)] text-[var(--color-brand-primary-foreground)]",
        status === "current" &&
          "bg-[var(--color-background-default)] border-2 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]",
        status === "upcoming" &&
          "bg-[var(--color-background-muted)] border-2 border-[var(--stepper-border)] text-[var(--color-text-secondary)]"
      )}
    >
      {status === "complete" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : number}
    </span>
  )
}

// ─── Label + optional description ─────────────────────────────────────────────

function StepText({
  status,
  label,
  description,
  align,
}: {
  status: StepStatus
  label: string
  description?: string
  align: "center" | "left"
}) {
  return (
    <span
      className={cn(
        "flex flex-col gap-0.5 min-w-0",
        align === "center" ? "items-center text-center" : "items-start text-left"
      )}
    >
      <span
        className={cn(
          "text-sm leading-tight transition-colors",
          status === "complete" &&
            "font-semibold text-[var(--color-background-default-foreground)]",
          status === "current" && "font-semibold text-[var(--color-brand-primary)]",
          status === "upcoming" && "text-[var(--color-text-secondary)]"
        )}
      >
        {label}
      </span>
      {description && (
        <span
          className={cn(
            "text-xs leading-tight transition-colors",
            status === "upcoming"
              ? "text-[var(--color-text-tertiary)]"
              : "text-[var(--color-text-secondary)]"
          )}
        >
          {description}
        </span>
      )}
      <span className="sr-only">{statusWord[status]}</span>
    </span>
  )
}

// ─── Connector ────────────────────────────────────────────────────────────────
// A line between two indicators takes the colour of the step it leaves.

function line(done: boolean, orientation: "horizontal" | "vertical", visible = true) {
  return cn(
    "block rounded-[var(--radius-full)] transition-colors",
    orientation === "horizontal" ? "h-0.5 flex-1" : "w-0.5 flex-1 min-h-4",
    !visible && "invisible",
    done ? "bg-[var(--color-brand-primary)]" : "bg-[var(--color-border-default)]"
  )
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

export function Stepper({
  steps,
  currentStep,
  orientation = "horizontal",
  onStepClick,
  className,
  "aria-label": ariaLabel = "Progress",
  ...props
}: StepperProps) {
  const isHorizontal = orientation === "horizontal"

  return (
    <ol
      aria-label={ariaLabel}
      className={cn("flex", isHorizontal ? "flex-row items-start" : "flex-col", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const status = statusOf(i, currentStep)
        const isFirst = i === 0
        const isLast = i === steps.length - 1
        const clickable = Boolean(onStepClick) && status !== "upcoming"
        const prevComplete = i > 0 && statusOf(i - 1, currentStep) === "complete"

        const indicator = clickable ? (
          <button
            type="button"
            onClick={() => onStepClick?.(i + 1)}
            aria-label={`${step.label}${statusWord[status]}`}
            className="rounded-[var(--radius-full)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            <StepIndicator status={status} number={i + 1} />
          </button>
        ) : (
          <StepIndicator status={status} number={i + 1} />
        )

        if (isHorizontal) {
          return (
            <li
              key={step.label + i}
              aria-current={status === "current" ? "step" : undefined}
              className="flex-1 flex flex-col items-center gap-2 min-w-0"
            >
              {/* Half-connectors either side of the indicator meet at each midpoint,
                  keeping the line level with the circles and clear of the text below.
                  The outer halves render invisible so spacing stays symmetrical. */}
              <div className="flex items-center w-full">
                <span aria-hidden="true" className={line(prevComplete, "horizontal", !isFirst)} />
                <span className="mx-2 shrink-0">{indicator}</span>
                <span
                  aria-hidden="true"
                  className={line(status === "complete", "horizontal", !isLast)}
                />
              </div>
              <StepText
                status={status}
                label={step.label}
                description={step.description}
                align="center"
              />
            </li>
          )
        }

        return (
          <li
            key={step.label + i}
            aria-current={status === "current" ? "step" : undefined}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center self-stretch">
              {indicator}
              {!isLast && (
                <span aria-hidden="true" className={line(status === "complete", "vertical")} />
              )}
            </div>
            {/* pb-5 sets the gap to the next step; the connector stretches to match */}
            <div className={cn(!isLast && "pb-5")}>
              <StepText
                status={status}
                label={step.label}
                description={step.description}
                align="left"
              />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
