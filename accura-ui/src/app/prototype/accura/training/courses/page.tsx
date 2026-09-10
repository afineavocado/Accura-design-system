"use client"

import * as React from "react"
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

import { useRowClick } from "../../row-click"
import { TablePagination, usePagination } from "../../table-pagination"
import { TrainingShell, TrainingTabs } from "../training-shell"
import {
  allCourses,
  triggerModes,
  triggerVariant,
  type Course,
} from "../mock-data"

function CourseRow({
  course,
  router,
}: {
  course: Course
  router: ReturnType<typeof useRouter>
}) {
  const href = `/prototype/accura/training/courses/${course.id}`
  const onClick = useRowClick<HTMLTableRowElement>(() => router.push(href))

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell>
        <Link
          href={href}
          className="font-medium text-[var(--color-brand-primary)] hover:underline"
        >
          {course.name}
        </Link>
        <div className="text-xs text-[var(--color-text-secondary)]">
          {course.description}
        </div>
      </TableCell>
      {/* Methods are the course definition — chips, because a course can carry
          several and they are labels rather than a single value. */}
      <TableCell>
        <div className="flex flex-wrap gap-[var(--spacing-component-xs)]">
          {course.methods.map((method) => (
            <Badge key={method} variant="secondary" shape="pill" size="md">
              {method}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="tabular-nums">{course.assessments}</TableCell>
      {/* A course no role links to is trained by nobody. */}
      <TableCell
        className={
          course.roles === 0
            ? "tabular-nums text-[var(--color-text-tertiary)]"
            : "tabular-nums"
        }
      >
        {course.roles}
      </TableCell>
      <TableCell>
        <Badge
          variant={triggerVariant[course.trigger]}
          shape="pill"
          size="md"
        >
          {course.trigger}
        </Badge>
        {course.triggerDetail && (
          <div className="mt-[var(--spacing-component-xxs)] text-xs text-[var(--color-text-secondary)]">
            {course.triggerDetail}
          </div>
        )}
      </TableCell>
      {/* The row's own action — creates an assessment ROUND, not a method
          (Q28). A real button, not the card's plain text: it is the most
          consequential control on the screen. useRowClick ignores clicks on
          it, so it does not also navigate. */}
      <TableCell className="text-right">
        <Button asChild variant="outline" size="sm">
          <Link href={`${href}/assessments/new`}>
            <Plus className="h-4 w-4" />
            Create Assessment
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default function TrainingCoursesPage() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [trigger, setTrigger] = React.useState("all")

  const visibleCourses = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return allCourses.filter((course) => {
      const matchesQuery =
        !q ||
        [course.name, course.description, ...course.methods].some((value) =>
          value.toLowerCase().includes(q)
        )
      return matchesQuery && (trigger === "all" || course.trigger === trigger)
    })
  }, [query, trigger])

  const paged = usePagination(visibleCourses)

  return (
    <TrainingShell>
      <TrainingTabs />

      <div className="flex flex-col gap-[var(--spacing-component-sm)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-[var(--spacing-component-sm)] sm:flex-row">
          <div className="relative flex-1 sm:max-w-[380px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses..."
              aria-label="Search courses"
              className="pl-9"
            />
          </div>
          {/* Filtering by trigger answers "which courses never assign
              themselves?" — the question Q31 says is currently unreadable.
              Labels match the Edit Course control exactly. */}
          <Select value={trigger} onValueChange={setTrigger}>
            <SelectTrigger
              className="sm:w-[180px]"
              aria-label="Filter by trigger"
            >
              <SelectValue placeholder="Trigger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All triggers</SelectItem>
              {triggerModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild size="sm">
          <Link href="/prototype/accura/training/courses/new">
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[28%]">Course</TableHead>
              <TableHead>Assessment methods</TableHead>
              <TableHead>Assessments</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.visible.map((course) => (
              <CourseRow key={course.id} course={course} router={router} />
            ))}
            {visibleCourses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-[var(--color-text-secondary)]"
                >
                  No courses match this search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination {...paged} noun="courses" />
    </TrainingShell>
  )
}
