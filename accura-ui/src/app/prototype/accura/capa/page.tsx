"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ListEmptySearch } from "../list-empty-state"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CapaHeader } from "././capa-header"
import { AppNavItems, AppSidebar } from "../app-sidebar"
import { ListSummary } from "../list-summary"
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
  canViewCapaDetail,
  capaStatuses,
  capaStatusVariant,
  initialCapaRecords,
  type CapaRecord,
} from "./mock-data"
// Same frozen "today" as the Dashboard, so its CAPA card and this filter agree.
import { daysUntil } from "../dashboard/mock-data"


function StatusBadge({ record }: { record: CapaRecord }) {
  const label = record.statusDetail
    ? `${record.status} (${record.statusDetail})`
    : record.status

  return (
    <Badge variant={capaStatusVariant[record.status]} shape="pill" size="md">
      {label}
    </Badge>
  )
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>
const param = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined)

/* Filters can be pre-set from the URL (the Dashboard cards link here).
   Read from page props, not useSearchParams: that hook needs a Suspense
   boundary, and inside one the Select triggers rendered blank. */
export default function CapaListingPage({ searchParams }: { searchParams: SearchParams }) {
  const params = React.use(searchParams)
  return <CapaListing initialStatus={param(params.status)} initialDue={param(params.due)} />
}

const dueOptions = [
  { value: "all", label: "All due dates" },
  { value: "14d", label: "Due within 14 days" },
] as const

function CapaListing({ initialStatus, initialDue }: { initialStatus?: string; initialDue?: string }) {
  const router = useRouter()
  const records = initialCapaRecords
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState(initialStatus ?? "all")
  // ?due=14d — the Dashboard CAPA card lands on the open CAPAs it counts.
  const [due, setDue] = React.useState(initialDue ?? "all")
  const [source, setSource] = React.useState("all")
  const [pageSize, setPageSize] = React.useState(10)
  const [page, setPage] = React.useState(1)
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  const sourceOptions = React.useMemo(
    () => Array.from(new Set(records.map((record) => record.source))),
    [records]
  )

  const filteredRecords = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return records.filter((record) => {
      const matchesQuery =
        !normalizedQuery ||
        [record.id, record.title, record.source, record.sourceId].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        )
      const matchesStatus = status === "all" || record.status === status
      const matchesSource = source === "all" || record.source === source
      const matchesDue =
        due === "all" ||
        (record.status !== "Close" && daysUntil(record.dueDate) <= 14)
      return matchesQuery && matchesStatus && matchesSource && matchesDue
    })
  }, [due, query, records, source, status])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visibleRecords = filteredRecords.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  )


  const clearFilters = () => {
    setQuery("")
    setStatus("all")
    setDue("all")
    setSource("all")
    setPage(1)
  }

  return (
    <SidebarProvider>
        <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)]">
          <AppSidebar />

          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <CapaHeader
              mobileNavigationOpen={mobileNavOpen}
              onMobileNavigationToggle={() => setMobileNavOpen((open) => !open)}
            />

            {mobileNavOpen && (
              <div className="border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)] p-[var(--spacing-component-md)] lg:hidden">
              <AppNavItems />
              </div>
            )}

            <section className="flex min-h-0 flex-1 flex-col gap-[var(--spacing-component-md)] overflow-y-auto p-[var(--spacing-component-lg)] md:p-5 lg:p-6">
              <div className="flex w-full flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-[var(--spacing-component-sm)]">
                  <div className="relative min-w-[240px] flex-1 sm:max-w-[380px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                    <Input
                      type="search"
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value)
                        setPage(1)
                      }}
                      placeholder="Search CAPA ID, title, or source..."
                      aria-label="Search CAPA records"
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
                    <SelectTrigger className="w-[160px]" aria-label="Filter by status">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      {capaStatuses.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={due}
                    onValueChange={(value) => {
                      setDue(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[180px]" aria-label="Filter by due date">
                      <SelectValue placeholder="All due dates" />
                    </SelectTrigger>
                    <SelectContent>
                      {dueOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={source}
                    onValueChange={(value) => {
                      setSource(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[160px]" aria-label="Filter by source">
                      <SelectValue placeholder="All sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All sources</SelectItem>
                      {sourceOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button asChild className="shrink-0">
                  <Link href="/prototype/accura/capa/new">
                    <Plus className="size-4" />
                    Create CAPA
                  </Link>
                </Button>
              </div>

              <ListSummary
                showing={filteredRecords.length}
                total={records.length}
                noun="results"
                onClear={clearFilters}
              />

              <div className="overflow-hidden rounded-[var(--radius-base)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                {visibleRecords.length ? (
                  <Table className="min-w-[960px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>CAPA ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due date</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>QA approver</TableHead>
                        <TableHead>Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleRecords.map((record) => {
                        const detailAvailable = canViewCapaDetail(record)

                        return (
                        <TableRow
                          key={record.key}
                          className={detailAvailable ? "cursor-pointer" : "hover:bg-transparent"}
                          onClick={(event) => {
                            if (!detailAvailable || (event.target as HTMLElement).closest("a, button")) return
                            router.push(`/prototype/accura/capa/${record.id}`)
                          }}
                        >
                          <TableCell>
                            {detailAvailable ? (
                              <Button asChild variant="ghost" size="sm" className="h-auto p-0 text-xs font-medium text-[var(--color-brand-primary)] hover:bg-transparent hover:underline">
                                <Link href={`/prototype/accura/capa/${record.id}`}>{record.id}</Link>
                              </Button>
                            ) : (
                              <span className="text-xs font-medium text-[var(--color-surface-default-foreground)]">
                                {record.id}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{record.title}</TableCell>
                          <TableCell><StatusBadge record={record} /></TableCell>
                          <TableCell className="whitespace-nowrap text-[var(--color-text-secondary)]">{record.dueDate}</TableCell>
                          <TableCell>
                            <div className="flex flex-col text-xs leading-4">
                              <span>{record.owner}</span>
                              <span className="text-[var(--color-text-secondary)]">{record.ownerTeam}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-xs leading-4">
                              <span>{record.approver}</span>
                              <span className="text-[var(--color-text-secondary)]">{record.approverTeam}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-xs leading-4">
                              <span>{record.source}</span>
                              <span className="text-xs font-normal text-[var(--color-text-link)] underline underline-offset-2">
                                {record.sourceId}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <ListEmptySearch noun="CAPA records" onClear={clearFilters} />
                )}
              </div>

              {filteredRecords.length > 0 && (
                <div className="flex flex-col gap-[var(--spacing-component-md)] text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-[var(--spacing-component-sm)] text-[var(--color-text-secondary)]">
                    <span>Showing</span>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(value) => {
                        setPageSize(Number(value))
                        setPage(1)
                      }}
                    >
                      <SelectTrigger className="h-8 w-20" aria-label="Rows per page">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20].map((size) => (
                          <SelectItem key={size} value={String(size)}>1-{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>of {filteredRecords.length} results</span>
                  </div>

                  <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          aria-disabled={safePage === 1}
                          onClick={(event) => {
                            event.preventDefault()
                            if (safePage > 1) setPage(safePage - 1)
                          }}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                        <PaginationItem key={number}>
                          <PaginationLink
                            href="#"
                            isActive={safePage === number}
                            onClick={(event) => {
                              event.preventDefault()
                              setPage(number)
                            }}
                          >
                            {number}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          aria-disabled={safePage === totalPages}
                          onClick={(event) => {
                            event.preventDefault()
                            if (safePage < totalPages) setPage(safePage + 1)
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </section>
          </main>
        </div>

    </SidebarProvider>
  )
}
