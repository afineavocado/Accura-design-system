"use client"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"

/* The empty state for a filtered listing. One component so the nine listings
 * cannot drift again — before 2026-09-18 they rendered four different things,
 * and one (Deviations) rendered nothing at all.
 *
 * Pattern and reasoning: accura-design-patterns.md → Tables and lists → Empty
 * state. In short: replace the table, do not leave a header with no rows under
 * it; put `Clear filters` here rather than relying on the one in ListSummary,
 * which sits above a table the reader has stopped looking at.
 *
 * `min-h-80` is the one value here with no token behind it. It is a block
 * height, not a spacing step — 320px keeps the empty state roughly where the
 * table was so the page does not jump when the last row filters out. Kept in
 * this file alone rather than repeated at nine call sites. */

export function ListEmptySearch({
  noun,
  onClear,
}: {
  /** Plural, lower case — "change controls", "deviations", "users". */
  noun: string
  onClear: () => void
}) {
  return (
    <Empty
      className="min-h-80 justify-center"
      icon={<Search className="size-5 text-[var(--color-icon-muted)]" />}
      title={`No ${noun} found`}
      description="Try changing your search or filter selections."
      primaryAction={<Button onClick={onClear}>Clear filters</Button>}
    />
  )
}

/* The other empty — nothing to filter in the first place. Different copy, and
 * `Clear filters` would be a dead end, so the caller supplies the way forward
 * (usually a create action) or nothing at all. */
export function ListEmptySet({
  title,
  description,
  icon,
  action,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <Empty
      className="min-h-80 justify-center"
      icon={icon ?? <Search className="size-5 text-[var(--color-icon-muted)]" />}
      title={title}
      description={description}
      primaryAction={action}
    />
  )
}
