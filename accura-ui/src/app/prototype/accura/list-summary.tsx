"use client"

/* The row between a toolbar and its table: how many records are showing, and a
 * way back to all of them.
 *
 * Copy states what is true. Unfiltered it is a count; filtered it says how many
 * of how many — "3 documents · All records" while a filter is applied reads as
 * a contradiction.
 *
 * Clear is a link-styled action, not a Button. A ghost Button carries its own
 * colour and 36px height, which overrode the row's text-secondary and made a
 * 12px row 36px tall. */
export function ListSummary({
  showing,
  total,
  noun,
  onClear,
}: {
  showing: number
  total: number
  /** Plural, lower case — "documents", "training roles". */
  noun: string
  /** Omit when the list has no filters. */
  onClear?: () => void
}) {
  const filtered = showing !== total

  return (
    <div className="flex min-h-8 items-center justify-between gap-[var(--spacing-component-sm)] text-xs text-[var(--color-text-secondary)]">
      <p aria-live="polite">
        {filtered ? `${showing} of ${total} ${noun}` : `${total} ${noun}`}
      </p>
      {filtered && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 font-medium text-[var(--color-brand-primary)] hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
