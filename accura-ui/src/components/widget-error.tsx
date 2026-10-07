import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

/* A widget that failed to load shows its error and a way to try again inside
   itself; the rest of the page keeps working. Render it in the widget's own
   container in place of the content. For a whole page that failed, or for a
   list that loaded with no results, use Empty instead. */
export function WidgetError({
  what,
  description,
  onRetry,
}: {
  /** What failed to load, as it is named on screen: "Documents", "open CAPAs". */
  what: string
  description?: string
  onRetry: () => void
}) {
  return (
    <div role="alert" className="flex flex-1 flex-col items-start justify-center gap-[var(--spacing-component-sm)]">
      <span className="flex items-center gap-[var(--spacing-component-sm)] text-sm font-medium text-[var(--color-surface-overlay-foreground)]">
        <CircleAlert className="h-4 w-4 shrink-0 text-[var(--color-icon-danger)]" aria-hidden="true" />
        Couldn’t load {what}
      </span>
      {description && <span className="text-xs text-[var(--color-text-secondary)]">{description}</span>}
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}
