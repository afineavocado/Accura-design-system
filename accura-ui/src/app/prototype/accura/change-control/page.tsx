"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as Popover from "@radix-ui/react-popover"
import { Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react"

import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AppNavItems, AppSidebar } from "../app-sidebar"
import { ListSummary } from "../list-summary"
import { useRowClick } from "../row-click"
import { TablePagination, usePagination } from "../table-pagination"
import { ChangeControlHeader } from "./change-control-header"
import {
  changeControlStatuses,
  changeControlStatusVariant,
  initialChangeControlRecords,
  type ChangeControlRecord,
} from "./mock-data"

const storedRecordsKey = "accura-change-control-records"
const deletedRecordIdsKey = "accura-deleted-change-control-record-ids"

function StatusBadge({ record }: { record: ChangeControlRecord }) {
  return (
    <Badge
      className="whitespace-nowrap"
      variant={changeControlStatusVariant[record.status]}
      shape="pill"
      size="md"
    >
      {record.status}
    </Badge>
  )
}

function avatarFallback(name: string) {
  return name.trim().slice(0, 2).toUpperCase()
}

function TruncatedTitle({ text }: { text: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [isTruncated, setIsTruncated] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => setIsTruncated(element.scrollHeight > element.clientHeight + 1)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [text])

  const content = (
    <span ref={ref} className="line-clamp-2 break-words">
      {text}
    </span>
  )

  if (!isTruncated) return content

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent className="max-w-xs">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Fits as many department badges as possible within 2 rows, then collapses
// the rest into a "+N" badge. A hidden clone of the full list is kept
// permanently in the DOM (visibility:hidden, absolutely positioned so it
// never affects layout) purely so the measurement can re-run correctly on
// every resize — the visible list alone can't be re-measured once trimmed,
// since the trimmed-away badges are no longer in the DOM to grow back into.
function AffectedDepartmentsCell({
  departments,
  rowKey,
}: {
  departments: string[]
  rowKey: string
}) {
  const measureRef = React.useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = React.useState(departments.length)

  React.useLayoutEffect(() => {
    const container = measureRef.current
    if (!container) return

    function measure() {
      if (!container) return
      const badgeEls = Array.from(
        container.querySelectorAll<HTMLElement>(".dept-measure-chip")
      )
      const overflowEl = container.querySelector<HTMLElement>(
        ".dept-overflow-chip"
      )
      if (badgeEls.length === 0) return

      const maxRows = 2
      let rows = 0
      let lastTop = Number.NaN
      let cutoff = badgeEls.length
      for (let i = 0; i < badgeEls.length; i++) {
        const top = badgeEls[i].offsetTop
        if (top !== lastTop) {
          rows++
          lastTop = top
        }
        if (rows > maxRows) {
          cutoff = i
          break
        }
      }

      if (cutoff >= departments.length) {
        setVisibleCount(departments.length)
        return
      }

      const overflowWidth = overflowEl?.offsetWidth ?? 44
      const containerWidth = container.clientWidth
      let visible = cutoff
      while (visible > 0) {
        const last = badgeEls[visible - 1]
        const lastRight = last.offsetLeft + last.offsetWidth
        if (containerWidth - lastRight >= overflowWidth + 4) break
        visible--
      }
      setVisibleCount(Math.max(visible, 1))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [departments])

  const overflowCount = departments.length - visibleCount
  const visibleDepartments = departments.slice(0, visibleCount)
  const overflowDepartments = departments.slice(visibleCount)

  return (
    <div className="relative">
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 flex w-full flex-wrap items-start gap-1"
      >
        {departments.map((item) => (
          <Badge
            key={`${rowKey}-measure-${item}`}
            variant="outline"
            shape="pill"
            size="md"
            className="dept-measure-chip shrink-0 whitespace-nowrap"
          >
            {item}
          </Badge>
        ))}
        <Badge
          variant="secondary"
          shape="pill"
          size="md"
          className="dept-overflow-chip shrink-0 whitespace-nowrap"
        >
          +{departments.length}
        </Badge>
      </div>

      <div className="flex max-h-[68px] flex-wrap items-start gap-[var(--spacing-component-xs)] overflow-hidden">
        {visibleDepartments.map((item) => (
          <Badge
            key={`${rowKey}-${item}`}
            variant="outline"
            shape="pill"
            size="md"
            className="max-w-[160px] shrink-0 truncate whitespace-nowrap"
            title={item}
          >
            {item}
          </Badge>
        ))}
        {overflowCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="secondary"
                  shape="pill"
                  size="md"
                  className="shrink-0 cursor-default whitespace-nowrap"
                >
                  +{overflowCount}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{overflowDepartments.join(", ")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}

function readDeletedRecordIds() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(deletedRecordIdsKey) ?? "[]"
    )

    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

function ChangeControlRowActions({
  record,
  onDelete,
}: {
  record: ChangeControlRecord
  onDelete: (record: ChangeControlRecord) => void
}) {
  const detailHref = `/prototype/accura/change-control/${record.id}`
  const editHref = `/prototype/accura/change-control/new?mode=edit&id=${encodeURIComponent(record.id)}`
  const isDraft = record.status === "Draft"

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`More actions for ${record.id}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={4}
          className="z-50 flex min-w-[160px] flex-col gap-0.5 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] p-1 shadow-[var(--shadow-md)]"
        >
          <Button
            asChild
            variant="ghost"
            className="h-8 justify-start rounded-[var(--radius-md)] px-2 text-sm"
          >
            <Link href={detailHref}>
              <Eye className="h-4 w-4" />
              View
            </Link>
          </Button>

          {isDraft && (
            <>
              <Button
                asChild
                variant="ghost"
                className="h-8 justify-start rounded-[var(--radius-md)] px-2 text-sm"
              >
                <Link href={editHref}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-8 justify-start rounded-[var(--radius-md)] px-2 text-sm text-[var(--color-text-invalid)] hover:text-[var(--color-text-invalid)]"
                onClick={() => onDelete(record)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

/* One row. A component rather than JSX inside the map because `useRowClick` is
   a hook — and the row-click rule is the shared one: the row is a convenience
   target, the ID cell keeps the real link for keyboard and middle-click.

   No padding or type overrides on the cells. TableCell is p-4 and 14px/400 by
   design (table.tsx:130); this listing used to pass `px-4 py-2` on all eight
   cells and `text-xs font-medium` on the ID, which made its rows 8px tighter
   and its body text a size smaller than every other listing in the product. */
function ChangeControlRow({
  record,
  onDelete,
}: {
  record: ChangeControlRecord
  onDelete: (record: ChangeControlRecord) => void
}) {
  const router = useRouter()
  const href = `/prototype/accura/change-control/${record.id}`
  const onClick = useRowClick<HTMLTableRowElement>(() => router.push(href))

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell className="truncate whitespace-nowrap">
        <Link
          href={href}
          className="font-medium text-[var(--color-brand-primary)] hover:underline"
          title={record.id}
        >
          {record.id}
        </Link>
      </TableCell>
      <TableCell>
        <TruncatedTitle text={record.title} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-[var(--spacing-component-sm)]">
          <Avatar size="sm" name={record.owner} fallback={avatarFallback(record.owner)} />
          <span className="min-w-0 truncate" title={record.owner}>
            {record.owner}
          </span>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap text-[var(--color-text-secondary)]">
        {record.dateRaised}
      </TableCell>
      <TableCell className="whitespace-nowrap text-[var(--color-text-secondary)]">
        {record.targetImplementationDate}
      </TableCell>
      <TableCell>
        <AffectedDepartmentsCell
          departments={record.affectedDepartments}
          rowKey={record.key}
        />
      </TableCell>
      <TableCell>
        <StatusBadge record={record} />
      </TableCell>
      <TableCell className="sticky right-0 bg-[var(--color-surface-default)] text-right shadow-[-1px_0_0_var(--color-border-default)]">
        <ChangeControlRowActions record={record} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  )
}

export default function ChangeControlListingPage() {
  const [storedRecords, setStoredRecords] = React.useState<ChangeControlRecord[]>([])
  const [deletedRecordIds, setDeletedRecordIds] = React.useState<string[]>([])
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [department, setDepartment] = React.useState("all")
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  React.useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(storedRecordsKey) ?? "[]")
      setStoredRecords(Array.isArray(parsed) ? (parsed as ChangeControlRecord[]) : [])
      setDeletedRecordIds(readDeletedRecordIds())
    } catch {
      setStoredRecords([])
      setDeletedRecordIds([])
    }
  }, [])

  const records = React.useMemo(() => {
    const storedIds = new Set(storedRecords.map((record) => record.id))
    const deletedIds = new Set(deletedRecordIds)
    return [
      ...storedRecords.filter((record) => !deletedIds.has(record.id)),
      ...initialChangeControlRecords.filter(
        (record) => !storedIds.has(record.id) && !deletedIds.has(record.id)
      ),
    ]
  }, [deletedRecordIds, storedRecords])

  function deleteRecord(record: ChangeControlRecord) {
    const nextStoredRecords = storedRecords.filter((item) => item.id !== record.id)
    const nextDeletedRecordIds = Array.from(
      new Set([...deletedRecordIds, record.id])
    )

    setStoredRecords(nextStoredRecords)
    setDeletedRecordIds(nextDeletedRecordIds)
    window.localStorage.setItem(storedRecordsKey, JSON.stringify(nextStoredRecords))
    window.localStorage.setItem(
      deletedRecordIdsKey,
      JSON.stringify(nextDeletedRecordIds)
    )
  }

  const departments = React.useMemo(
    () =>
      Array.from(
        new Set(
          records.flatMap((record) =>
            record.affectedDepartments.filter((department) => !department.startsWith("+"))
          )
        )
      ),
    [records]
  )

  const filteredRecords = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return records.filter((record) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          record.id,
          record.title,
          record.owner,
          ...record.affectedDepartments,
        ].some((value) => value.toLowerCase().includes(normalizedQuery))
      const matchesStatus = status === "all" || record.status === status
      const matchesDepartment =
        department === "all" || record.affectedDepartments.includes(department)

      return matchesQuery && matchesStatus && matchesDepartment
    })
  }, [department, query, records, status])

  /* Paging, the summary row and the footer are the shared listing helpers every
     other module uses. This page had assembled its own from the Pagination
     primitives, which is why its footer read "10 results" where the others read
     "10 of 24 change controls" and offered a way back to all of them. */
  const pagination = usePagination(filteredRecords)
  const { visible: visibleRecords, setPage } = pagination

  const clearFilters = () => {
    setQuery("")
    setStatus("all")
    setDepartment("all")
    setPage(1)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)]">
        <AppSidebar />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ChangeControlHeader
            mobileNavigationOpen={mobileNavOpen}
            onMobileNavigationToggle={() => setMobileNavOpen((open) => !open)}
          />

          {mobileNavOpen && (
            <div className="border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)] p-[var(--spacing-component-md)] lg:hidden">
              <AppNavItems />
            </div>
          )}

          <section className="flex min-h-0 flex-1 flex-col gap-[var(--spacing-component-md)] p-[var(--spacing-component-lg)] lg:p-[var(--spacing-component-xl)]">
            <div className="flex w-full flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[var(--spacing-component-sm)]">
                <div className="relative min-w-[240px] flex-1 sm:max-w-[380px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                  <Input
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value)
                      setPage(1)
                    }}
                    placeholder="Search ID, title, owner, or department..."
                    aria-label="Search change controls"
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
                  <SelectTrigger className="w-[180px]" aria-label="Filter by status">
                    <SelectValue placeholder="Status: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Status: All</SelectItem>
                    {changeControlStatuses.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={department}
                  onValueChange={(value) => {
                    setDepartment(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[190px]" aria-label="Filter by department">
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    {departments.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button asChild className="shrink-0">
                <Link href="/prototype/accura/change-control/new">
                  <Plus className="h-4 w-4" />
                  Create Change Control
                </Link>
              </Button>
            </div>

            <ListSummary
              showing={filteredRecords.length}
              total={records.length}
              noun="change controls"
              onClear={clearFilters}
            />

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-base)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
              {visibleRecords.length ? (
                <div className="min-h-0 flex-1 overflow-auto">
                  <Table className="[table-layout:fixed]">
                    <TableHeader className="sticky top-0 z-20 bg-[var(--color-surface-default)] shadow-[0_1px_0_var(--color-border-default)]">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[130px] whitespace-nowrap bg-[var(--color-surface-default)]">
                          ID
                        </TableHead>
                        <TableHead className="w-auto bg-[var(--color-surface-default)]">
                          TITLE
                        </TableHead>
                        <TableHead className="w-[180px] bg-[var(--color-surface-default)]">
                          CHANGE OWNER
                        </TableHead>
                        <TableHead className="w-[120px] bg-[var(--color-surface-default)]">
                          DATE RAISED
                        </TableHead>
                        <TableHead className="w-[120px] bg-[var(--color-surface-default)]">
                          TARGET IMPL.
                        </TableHead>
                        <TableHead className="w-auto bg-[var(--color-surface-default)]">
                          AFFECTED DEPTS
                        </TableHead>
                        <TableHead className="w-[150px] bg-[var(--color-surface-default)]">
                          STATUS
                        </TableHead>
                        <TableHead className="sticky right-0 z-10 w-12 bg-[var(--color-surface-default)] shadow-[-1px_0_0_var(--color-border-default)]">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleRecords.map((record) => (
                        <ChangeControlRow
                          key={record.key}
                          record={record}
                          onDelete={deleteRecord}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Empty
                  className="min-h-80 justify-center"
                  icon={<Search className="h-5 w-5 text-[var(--color-icon-muted)]" />}
                  title="No change controls found"
                  description="Try changing your search or filter selections."
                  primaryAction={
                    <Button onClick={clearFilters}>Clear filters</Button>
                  }
                />
              )}
            </div>

            {filteredRecords.length > 0 && (
              <TablePagination {...pagination} noun="change controls" />
            )}
          </section>
        </main>
      </div>
    </SidebarProvider>
  )
}
