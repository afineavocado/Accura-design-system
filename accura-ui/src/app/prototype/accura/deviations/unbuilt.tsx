import Link from "next/link"

import { Button } from "@/components/ui/button"

import { basePath } from "./mock-data"

/* Routes the registry links to but that are not prototyped yet. A dead end
   reads as broken; a notice reads as scoped. Pattern from Training. */
export function Unbuilt({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] p-[var(--spacing-component-2xl)] text-center">
      <p className="text-sm font-medium text-[var(--color-surface-default-foreground)]">
        Not built in this prototype
      </p>
      <p className="max-w-[420px] text-sm text-[var(--color-text-secondary)]">
        {name} is specified in flow/deviation-spec.md {detail}
      </p>
      <Button variant="outline" asChild className="mt-[var(--spacing-component-sm)]">
        <Link href={basePath}>Back to Deviations</Link>
      </Button>
    </div>
  )
}
