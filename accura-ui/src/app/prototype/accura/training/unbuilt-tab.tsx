"use client"

import { TrainingShell, TrainingTabs } from "./training-shell"

/* The four unbuilt tabs render this rather than 404ing. A prototype that
   dead-ends reads as broken; one that says "not built yet" reads as scoped. */
export function UnbuiltTab({ name }: { name: string }) {
  return (
    <TrainingShell>
      <TrainingTabs />
      <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] p-8 text-center">
        <p className="text-sm font-medium text-[var(--color-surface-default-foreground)]">
          Not built in this prototype
        </p>
        <p className="max-w-[380px] text-sm text-[var(--color-text-secondary)]">
          The <span className="capitalize">{name}</span> tab is documented in
          flow/training-module.md but has not been prototyped yet.
        </p>
      </div>
    </TrainingShell>
  )
}
