"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useRowClick } from "../../row-click"
import { TablePagination, usePagination } from "../../table-pagination"
import { TrainingShell, TrainingTabs } from "../training-shell"
import { trainingRoles, type TrainingRole } from "../mock-data"

function RoleRow({
  role,
  router,
}: {
  role: TrainingRole
  router: ReturnType<typeof useRouter>
}) {
  const href = `/prototype/accura/training/roles/${role.id}`
  const onClick = useRowClick<HTMLTableRowElement>(() => router.push(href))

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell>
        <Link
          href={href}
          className="font-medium text-[var(--color-brand-primary)] hover:underline"
        >
          {role.name}
        </Link>
        <div className="text-xs text-[var(--color-text-secondary)]">
          {role.description}
        </div>
      </TableCell>
      <TableCell className="tabular-nums">{role.courses}</TableCell>
      {/* A role with courses but nobody in it is worth seeing. */}
      <TableCell
        className={
          role.users === 0
            ? "tabular-nums text-[var(--color-text-tertiary)]"
            : "tabular-nums"
        }
      >
        {role.users}
      </TableCell>
      <TableCell className="tabular-nums">{role.assessments}</TableCell>
    </TableRow>
  )
}

export default function TrainingRolesPage() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")

  const visibleRoles = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return trainingRoles
    return trainingRoles.filter((role) =>
      [role.name, role.description].some((value) =>
        value.toLowerCase().includes(q)
      )
    )
  }, [query])

  const paged = usePagination(visibleRoles)

  return (
    <TrainingShell>
      <TrainingTabs />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-[380px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles..."
            aria-label="Search training roles"
            className="pl-9"
          />
        </div>
        <Button asChild size="sm">
          <Link href="/prototype/accura/training/roles/new">
            <Plus className="h-4 w-4" />
            Create Role
          </Link>
        </Button>
      </div>

      {/* A table, not the product's card grid: the counts are the role's whole
          meaning, and as numeric columns they sort. Cards bury them in footer
          prose and stop scanning at ~a dozen roles. */}
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[52%]">Training role</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Assessments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.visible.map((role) => (
              <RoleRow key={role.id} role={role} router={router} />
            ))}
            {visibleRoles.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-sm text-[var(--color-text-secondary)]"
                >
                  No roles match this search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination {...paged} noun="training roles" />

    </TrainingShell>
  )
}
