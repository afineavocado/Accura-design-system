"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useRowClick } from "../../row-click"
import { ListEmptySearch } from "../../list-empty-state"
import { ListSummary } from "../../list-summary"
import { TablePagination, usePagination } from "../../table-pagination"
import { TrainingShell, TrainingTabs } from "../training-shell"
import {
  assessmentRounds,
  roundStatuses,
  roundStatusVariant,
  type AssessmentListRow,
} from "../mock-data"

function RoundRow({
  round,
  router,
}: {
  round: AssessmentListRow
  router: ReturnType<typeof useRouter>
}) {
  const href = `/prototype/accura/training/assessments/${round.id}`
  const onClick = useRowClick<HTMLTableRowElement>(() => router.push(href))
  const percent = Math.round((round.completed / round.total) * 100)

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell>
        <Link
          href={href}
          className="font-medium text-[var(--color-brand-primary)] hover:underline"
        >
          {round.name}
        </Link>
        <div className="text-xs text-[var(--color-text-secondary)]">
          {round.id.toUpperCase()}
        </div>
      </TableCell>
      <TableCell>
        <Link
          href={`/prototype/accura/training/courses/${round.courseId}`}
          className="text-[var(--color-brand-primary)] hover:underline"
        >
          {round.course}
        </Link>
      </TableCell>
      {/* Overdue sits on the date, not the status — the same rule as the user
          detail. A round can be overdue and still in progress. */}
      <TableCell>
        <div>{round.due}</div>
        {round.overdue && (
          <div className="text-xs text-[var(--color-text-invalid)]">
            overdue
          </div>
        )}
      </TableCell>
      {/* A fraction alone makes the reader do arithmetic; the bar carries the
          proportion, which is what this column is scanned for. */}
      <TableCell>
        <div className="tabular-nums">
          {round.completed} of {round.total}
        </div>
        <Progress
          value={percent}
          size="sm"
          className="mt-[var(--spacing-component-xs)] w-24"
          aria-label={`${percent}% complete`}
        />
      </TableCell>
      <TableCell>
        <Badge variant={roundStatusVariant[round.status]} shape="pill" size="md">
          {round.status}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export default function TrainingAssessmentsPage() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState("all")

  const visibleRounds = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return assessmentRounds.filter((round) => {
      const matchesQuery =
        !q ||
        [round.name, round.course, round.id].some((value) =>
          value.toLowerCase().includes(q)
        )
      return matchesQuery && (status === "all" || round.status === status)
    })
  }, [query, status])

  const paged = usePagination(visibleRounds)

  const clearFilters = () => { setQuery(""); setStatus("all") }

  return (
    <TrainingShell>
      <TrainingTabs />

      <div className="flex flex-col gap-[var(--spacing-component-sm)] sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-[380px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search assessments..."
            aria-label="Search assessments"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-[180px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {roundStatuses.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ListSummary
        showing={visibleRounds.length}
        total={assessmentRounds.length}
        noun="assessments"
        onClear={clearFilters}
      />

      {visibleRounds.length === 0 ? (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
          <ListEmptySearch noun="assessments" onClear={clearFilters} />
        </div>
      ) : (
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32%]">Assessment</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.visible.map((round) => (
              <RoundRow key={round.id} round={round} router={router} />
            ))}
          </TableBody>
        </Table>
      </div>
      )}

      {visibleRounds.length > 0 && <TablePagination {...paged} noun="assessments" />}
    </TrainingShell>
  )
}
