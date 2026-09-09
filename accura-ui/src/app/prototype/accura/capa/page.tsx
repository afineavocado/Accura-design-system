"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarLogo,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
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

function AccuraLogo() {
  return (
    <SidebarLogo className="h-9 w-[104px]">
      <Image
        src="/accura-logo.png"
        alt="Accura"
        width={104}
        height={36}
        className="h-full w-full object-contain"
        priority
      />
    </SidebarLogo>
  )
}

function SidebarNavigation() {
  return (
    <>
      <SidebarHeader className="h-14 px-6">
        <AccuraLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="gap-1 px-3 py-4">
          <SidebarMenuItem
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            href="#"
          />
          <SidebarMenuItem
            icon={<ClipboardCheck className="h-4 w-4" />}
            label="CAPA"
            href="/prototype/accura/capa"
            active
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-1 px-3 py-3">
        <SidebarMenuItem
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
          href="#"
        />
        <SidebarMenuItem
          icon={<LogOut className="h-4 w-4" />}
          label="Logout"
          href="#"
        />
      </SidebarFooter>
    </>
  )
}

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

export default function CapaListingPage() {
  const router = useRouter()
  const records = initialCapaRecords
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState("all")
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
      return matchesQuery && matchesStatus && matchesSource
    })
  }, [query, records, source, status])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visibleRecords = filteredRecords.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  )

  return (
    <SidebarProvider>
        <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)]">
          <Sidebar type="default" collapsible="none" className="hidden lg:flex">
            <SidebarNavigation />
          </Sidebar>

          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <header className="flex h-14 shrink-0 items-center border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-4 md:px-6">
              <Button
                variant="ghost"
                size="icon-sm"
                className="mr-2 lg:hidden"
                aria-label="Toggle navigation"
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen((open) => !open)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-base font-medium text-[var(--color-background-default-foreground)]">
                CAPA
              </h1>
            </header>

            {mobileNavOpen && (
              <div className="border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)] p-3 lg:hidden">
                <SidebarMenuItem icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" href="#" />
                <SidebarMenuItem icon={<ClipboardCheck className="h-4 w-4" />} label="CAPA" href="/prototype/accura/capa" active />
              </div>
            )}

            <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 md:p-5 lg:p-6">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_160px_160px]">
                  <div className="relative sm:col-span-2 lg:col-span-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
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
                    <SelectTrigger aria-label="Filter by status">
                      <SelectValue placeholder="Status: All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Status: All</SelectItem>
                      {capaStatuses.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
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
                    <SelectTrigger aria-label="Filter by source">
                      <SelectValue placeholder="Source: All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Source: All</SelectItem>
                      {sourceOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button asChild className="self-start xl:self-auto">
                  <Link href="/prototype/accura/capa/new">Create CAPA</Link>
                </Button>
              </div>

              <div className="overflow-hidden rounded-[var(--radius-base)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                {visibleRecords.length ? (
                  <Table className="min-w-[960px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-10 px-3 text-[11px] uppercase tracking-wide">CAPA ID</TableHead>
                        <TableHead className="h-10 px-3 text-[11px] uppercase tracking-wide">Title</TableHead>
                        <TableHead className="h-10 px-3 text-[11px] uppercase tracking-wide">Status</TableHead>
                        <TableHead className="h-10 px-3 text-[11px] uppercase tracking-wide">Due date</TableHead>
                        <TableHead className="h-10 px-3 text-[11px] uppercase tracking-wide">Owner</TableHead>
                        <TableHead className="h-10 px-3 text-[11px] uppercase tracking-wide">QA approver</TableHead>
                        <TableHead className="h-10 px-3 text-[11px] uppercase tracking-wide">Source</TableHead>
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
                          <TableCell className="px-3 py-1.5">
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
                          <TableCell className="px-3 py-1.5 text-xs">{record.title}</TableCell>
                          <TableCell className="px-3 py-1.5"><StatusBadge record={record} /></TableCell>
                          <TableCell className="whitespace-nowrap px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">{record.dueDate}</TableCell>
                          <TableCell className="px-3 py-1.5">
                            <div className="flex flex-col text-xs leading-4">
                              <span>{record.owner}</span>
                              <span className="text-[var(--color-text-secondary)]">{record.ownerTeam}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-1.5">
                            <div className="flex flex-col text-xs leading-4">
                              <span>{record.approver}</span>
                              <span className="text-[var(--color-text-secondary)]">{record.approverTeam}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-1.5">
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
                  <Empty
                    className="min-h-80 justify-center"
                    icon={<Search className="h-5 w-5 text-[var(--color-icon-muted)]" />}
                    title="No CAPA records found"
                    description="Try changing your search or filter selections."
                    primaryAction={
                      <Button
                        onClick={() => {
                          setQuery("")
                          setStatus("all")
                          setSource("all")
                        }}
                      >
                        Clear filters
                      </Button>
                    }
                  />
                )}
              </div>

              {filteredRecords.length > 0 && (
                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
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
