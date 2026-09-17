import * as React from "react"

/* `old → new` with the old value struck through, in one tinted pill — the
   pattern the product's own Assessment Audit Trail uses. It was written in
   Training (`history-panel.tsx`) and is shared from here now that the audit
   drawer renders it too; there is one audit-trail treatment in the product,
   not three.

   Training's version hardcoded the success tint, because training only ever
   moves forward. Deviations moves backward — rejecting sends a record back one
   stage — and a return rendered in green, with the state it returned to struck
   out in red, reads as an approval. Hence `direction`. */
export type StateChangeDirection = "forward" | "backward" | "cancel"

const tone: Record<StateChangeDirection, { border: string; bg: string; to: string }> = {
  forward: {
    border: "border-[var(--color-border-success)]",
    bg: "bg-[var(--color-status-success-subtle)]",
    to: "text-[var(--color-status-success-subtle-foreground)]",
  },
  backward: {
    border: "border-[var(--color-border-warning)]",
    bg: "bg-[var(--color-status-warning-subtle)]",
    to: "text-[var(--color-status-warning-subtle-foreground)]",
  },
  cancel: {
    border: "border-[var(--color-border-error)]",
    bg: "bg-[var(--color-status-danger-subtle)]",
    to: "text-[var(--color-status-danger-subtle-foreground)]",
  },
}

export function StateChange({
  from,
  to,
  direction = "forward",
  className,
}: {
  from: string
  to: string
  direction?: StateChangeDirection
  className?: string
}) {
  const t = tone[direction]
  return (
    <span
      className={[
        "mt-[var(--spacing-component-xs-plus)] inline-flex items-center gap-[var(--spacing-component-xs-plus)] rounded-full border px-[var(--spacing-component-sm)] py-0.5 text-xs",
        t.border,
        t.bg,
        className ?? "",
      ].join(" ")}
    >
      <span className="text-[var(--color-text-secondary)]">Status</span>
      <s className="text-[var(--color-status-danger-subtle-foreground)]">{from}</s>
      <span aria-hidden="true" className="text-[var(--color-text-secondary)]">
        →
      </span>
      <span className={t.to}>{to}</span>
    </span>
  )
}
