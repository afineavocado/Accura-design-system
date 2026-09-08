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
//   current:  color/background/default   · 2px border + number color/brand/primary
//   upcoming: color/background/muted     · 2px stepper/border · number color/text/secondary
//
// Label:
//   complete / current: color/background/default/foreground (current is semibold)
//   upcoming:           color/text/secondary
//
// Connector — 2px, coloured by the PRECEDING step:
//   after a complete step: color/brand/primary
//   otherwise:             color/border/default

type StepStatus = "complete" | "current" | "upcoming"

export interface Step {
  /** Short label — 1–3 words reads best */
  label: string
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

// ─── Label ────────────────────────────────────────────────────────────────────

function StepLabel({ status, children }: { status: StepStatus; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "text-sm leading-none whitespace-nowrap transition-colors",
        status === "upcoming"
          ? "text-[var(--color-text-secondary)]"
          : "text-[var(--color-background-default-foreground)]",
        status === "current" && "font-semibold"
      )}
    >
      {children}
    </span>
  )
}

// ─── Connector ────────────────────────────────────────────────────────────────
// Colour comes from the step it leaves, not the one it arrives at.

function StepConnector({ status, orientation }: { status: StepStatus; orientation: "horizontal" | "vertical" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block rounded-[var(--radius-full)] transition-colors",
        orientation === "horizontal" ? "h-0.5 flex-1 min-w-4" : "w-0.5 flex-1 min-h-4",
        status === "complete"
          ? "bg-[var(--color-brand-primary)]"
          : "bg-[var(--color-border-default)]"
      )}
    />
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
      className={cn("flex", isHorizontal ? "flex-row items-center" : "flex-col", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const status = statusOf(i, currentStep)
        const isLast = i === steps.length - 1
        const clickable = Boolean(onStepClick) && status !== "upcoming"

        const content = (
          <>
            <StepIndicator status={status} number={i + 1} />
            <StepLabel status={status}>{step.label}</StepLabel>
            {/* Screen readers get the status; the number alone is meaningless */}
            <span className="sr-only">
              {status === "complete" ? ", completed" : status === "current" ? ", current step" : ", not started"}
            </span>
          </>
        )

        return (
          <li
            key={step.label + i}
            aria-current={status === "current" ? "step" : undefined}
            className={cn(
              "flex",
              isHorizontal
                ? ["items-center gap-3", !isLast && "flex-1"]
                : "flex-col gap-0"
            )}
          >
            {isHorizontal ? (
              <>
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => onStepClick?.(i + 1)}
                    className="flex items-center gap-2 rounded-[var(--radius-md)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                  >
                    {content}
                  </button>
                ) : (
                  <span className="flex items-center gap-2">{content}</span>
                )}
                {!isLast && <StepConnector status={status} orientation="horizontal" />}
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <div className="flex flex-col items-center self-stretch">
                    {clickable ? (
                      <button
                        type="button"
                        onClick={() => onStepClick?.(i + 1)}
                        className="rounded-[var(--radius-full)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                      >
                        <StepIndicator status={status} number={i + 1} />
                      </button>
                    ) : (
                      <StepIndicator status={status} number={i + 1} />
                    )}
                    {!isLast && <StepConnector status={status} orientation="vertical" />}
                  </div>
                  {/* h-6 matches the indicator so the label centres against it.
                      Step spacing comes from the connector's min-height, not padding. */}
                  <div className="flex items-center h-6">
                    <StepLabel status={status}>{step.label}</StepLabel>
                    <span className="sr-only">
                      {status === "complete" ? ", completed" : status === "current" ? ", current step" : ", not started"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </li>
        )
      })}
    </ol>
  )
}
