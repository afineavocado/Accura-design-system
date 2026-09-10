"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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

import { useRowClick } from "../row-click"
import { TablePagination, usePagination } from "../table-pagination"
import { TrainingShell, TrainingTabs } from "./training-shell"
import {
  trainingUsers,
  userStatuses,
  userStatusVariant,
  type TrainingUser,
} from "./mock-data"

function UserRow({
  user,
  router,
}: {
  user: TrainingUser
  router: ReturnType<typeof useRouter>
}) {
  const href = `/prototype/accura/training/${user.id}`
  const onClick = useRowClick<HTMLTableRowElement>(() => router.push(href))

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell>
        {/* The name stays a real link — the row click is the convenience. */}
        <Link
          href={href}
          className="font-medium text-[var(--color-brand-primary)] hover:underline"
        >
          {user.name}
        </Link>
        <div className="text-xs text-[var(--color-text-secondary)]">
          {user.email}
        </div>
      </TableCell>
      <TableCell>{user.department}</TableCell>
      <TableCell>{user.accessLevel}</TableCell>
      <TableCell>
        <Badge variant={userStatusVariant[user.status]} shape="pill" size="md">
          {user.status}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export default function TrainingUsersPage() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState("all")

  const visibleUsers = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return trainingUsers.filter((user) => {
      const matchesQuery =
        !q ||
        [user.name, user.email, user.department].some((value) =>
          value.toLowerCase().includes(q)
        )
      return matchesQuery && (status === "all" || user.status === status)
    })
  }, [query, status])

  const paged = usePagination(visibleUsers)

  return (
    <TrainingShell>
      <TrainingTabs />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1 sm:max-w-[380px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search User"
            aria-label="Search users"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-[180px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {userStatuses.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Access level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.visible.map((user) => (
              <UserRow key={user.id} user={user} router={router} />
            ))}
            {visibleUsers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-sm text-[var(--color-text-secondary)]"
                >
                  No users match this search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination {...paged} noun="users" />
    </TrainingShell>
  )
}
