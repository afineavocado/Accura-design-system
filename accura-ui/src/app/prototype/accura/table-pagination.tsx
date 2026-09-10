"use client"

import * as React from "react"

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

/* Page state for a list. Keeps `page` inside the valid range when the filtered
   set shrinks — otherwise filtering down to two rows while on page 3 shows an
   empty table. */
export function usePagination<T>(items: T[], initialPageSize = 10) {
  const [pageSize, setPageSize] = React.useState(initialPageSize)
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visible = items.slice((safePage - 1) * pageSize, safePage * pageSize)

  return {
    visible,
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    total: items.length,
  }
}

/* The listing footer, shared by every table list in the prototype. */
export function TablePagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
  total,
  noun = "results",
  pageSizes = [5, 10, 20],
}: {
  page: number
  setPage: (page: number) => void
  pageSize: number
  setPageSize: (size: number) => void
  totalPages: number
  total: number
  noun?: string
  pageSizes?: number[]
}) {
  if (total === 0) return null

  return (
    <div className="flex flex-col gap-[var(--spacing-component-md)] text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-[var(--spacing-component-sm)] text-[var(--color-text-secondary)]">
        <span>Rows per page</span>
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
            {pageSizes.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>
          {total} {noun}
        </span>
      </div>

      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              onClick={(event) => {
                event.preventDefault()
                if (page > 1) setPage(page - 1)
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  href="#"
                  isActive={page === number}
                  onClick={(event) => {
                    event.preventDefault()
                    setPage(number)
                  }}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === totalPages}
              onClick={(event) => {
                event.preventDefault()
                if (page < totalPages) setPage(page + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
