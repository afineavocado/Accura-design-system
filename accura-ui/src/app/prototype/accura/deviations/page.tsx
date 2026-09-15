"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

import { ListSummary } from "../list-summary"
import { useRowClick } from "../row-click"
import { TablePagination, usePagination } from "../table-pagination"
import {
  basePath,
  displayDate,
  displayId,
  isOverdue,
  lifecycle,
  nextAction,
  seeds,
  severities,
  statusVariants,
  type DeviationRecord,
} from "./mock-data"

/* Registry — spec §2. Two filters, matching the live product; our filter copy
   names the set ("All statuses") rather than prefixing the label, and Overdue
   stays out of the Status list because it is a flag, not a state. */

const statusOptions = ["All", ...lifecycle, "Cancelled"] as const

function DeviationRow({ record }: { record: DeviationRecord }) {
  const router = useRouter()
  const href = `${basePath}/${record.key}`
  const onClick = useRowClick(useCallback(() => router.push(href), [router, href]))
  const overdue = isOverdue(record)

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell className="whitespace-nowrap">
        <Link
          href={href}
          className="font-medium text-[var(--color-brand-primary)] hover:underline"
        >
          {displayId(record)}
        </Link>
      </TableCell>
      <TableCell>
        <p className="font-medium">{record.title}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {nextAction(record)}
        </p>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-[var(--spacing-component-xs)]">
          <Badge
            shape="pill"
            variant={statusVariants[record.status]}
            className="whitespace-nowrap"
          >
            {record.status}
          </Badge>
          {overdue && (
            <Badge shape="pill" variant="error" className="whitespace-nowrap">
              Overdue
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <p className="whitespace-nowrap">{record.owner.name}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">
          {record.owner.role}
        </p>
      </TableCell>
      <TableCell>{record.category}</TableCell>
      <TableCell>{record.severity}</TableCell>
      <TableCell className="whitespace-nowrap">
        {displayDate(record.dueDate)}
        {overdue && (
          <span className="block text-xs text-[var(--color-text-invalid)]">
            Past due
          </span>
        )}
      </TableCell>
    </TableRow>
  )
}

export default function DeviationsPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")
  const [severity, setSeverity] = useState("All")

  const filtered = seeds.filter((record) => {
    const haystack = [
      record.id ?? "",
      record.title,
      record.owner.name,
      record.department,
    ]
      .join(" ")
      .toLowerCase()
    return (
      haystack.includes(search.toLowerCase()) &&
      (status === "All" || record.status === status) &&
      (severity === "All" || record.severity === severity)
    )
  })

  const paged = usePagination(filtered)
  const { setPage } = paged

  const clear = () => {
    setSearch("")
    setStatus("All")
    setSeverity("All")
    setPage(1)
  }

  return (
    <>
      <div className="mb-[var(--spacing-layout-sm)] flex w-full flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[var(--spacing-component-sm)]">
          <div className="relative min-w-[240px] flex-1 sm:max-w-[380px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
            <Input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Search deviations..."
              aria-label="Search deviations"
              className="pl-9"
            />
          </div>

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-auto min-w-40" aria-label="Filter by status">
              <SelectValue>
                {status === "All" ? "All statuses" : status}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "All" ? "All statuses" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={severity}
            onValueChange={(value) => {
              setSeverity(value)
              setPage(1)
            }}
          >
            <SelectTrigger
              className="w-auto min-w-40"
              aria-label="Filter by severity"
            >
              <SelectValue>
                {severity === "All" ? "All severities" : severity}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {["All", ...severities].map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "All" ? "All severities" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button asChild className="shrink-0">
          <Link href={`${basePath}/new`}>
            <Plus className="size-4" />
            Create Deviation
          </Link>
        </Button>
      </div>

      <ListSummary
        showing={filtered.length}
        total={seeds.length}
        noun="deviations"
        onClear={clear}
      />

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Deviation ID</TableHead>
              <TableHead>Short description</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Due date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.visible.map((record: DeviationRecord) => (
              <DeviationRow key={record.key} record={record} />
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination {...paged} noun="deviations" />
    </>
  )
}
