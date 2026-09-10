"use client"

import * as React from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { ChevronLeft, FileText, Pencil, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { TrainingShell } from "../../training-shell"
import {
  allCourses,
  roundStatusVariant,
  trainingRoles,
  triggerVariant,
} from "../../mock-data"

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>()
  const course = allCourses.find((candidate) => candidate.id === params.id)

  const linkedRoles = React.useMemo(
    () =>
      course
        ? trainingRoles.filter((role) =>
            role.courseList.some((item) => item.course === course.name)
          )
        : [],
    [course]
  )

  if (!course) notFound()

  const methods: { method: string; document?: string }[] =
    course.methodDetail ?? course.methods.map((m) => ({ method: m }))
  const rounds = course.rounds ?? []

  return (
    <TrainingShell>
      <div>
        <Link
          href="/prototype/accura/training/courses"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-brand-primary)] hover:underline"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Courses
        </Link>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            {/* Description as a subline, not its own card — see §22.2. */}
            <h2 className="text-xl font-semibold text-[var(--color-surface-default-foreground)]">
              {course.name}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {course.description}
            </p>
            {/* The trigger is the brief's central mechanism (Q31), so it sits
                in the header rather than in a metadata card. */}
            <div className="mt-2 flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
              <Badge
                variant={triggerVariant[course.trigger]}
                shape="pill"
                size="md"
              >
                {course.trigger}
              </Badge>
              {course.triggerDetail && (
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {course.triggerDetail}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-[var(--spacing-component-sm)]">
            <Button asChild variant="outline" size="sm">
              <Link href={`/prototype/accura/training/courses/${course.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit course
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link
                href={`/prototype/accura/training/courses/${course.id}/assessments/new`}
              >
                <Plus className="h-4 w-4" />
                Create Assessment
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main + right rail, matching the User detail screen: the thing on the
          left, the context around it on the right. Methods and linked roles
          are lists, not tables — two rows do not need a header, and nothing
          here sorts or is compared. */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <Card>
          <CardHeader className="flex-row items-baseline justify-between gap-3">
            <CardTitle>Assessments ({rounds.length})</CardTitle>
            <span className="text-xs text-[var(--color-text-secondary)]">
              rounds sent from this course
            </span>
          </CardHeader>
          <CardContent className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[44%]">Assessment</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rounds.map((round) => (
                  <TableRow key={round.id}>
                    <TableCell>
                      <span className="font-medium text-[var(--color-brand-primary)]">
                        {round.name}
                      </span>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {round.id.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>{round.due}</TableCell>
                    <TableCell className="tabular-nums">
                      {round.completed} of {round.total}
                    </TableCell>
                    {/* Round status — `Completed` means every participant is
                        done, not any one of them. See Q18. */}
                    <TableCell>
                      <Badge
                        variant={roundStatusVariant[round.status]}
                        shape="pill"
                        size="md"
                      >
                        {round.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {rounds.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-sm text-[var(--color-text-secondary)]"
                    >
                      No assessments sent yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment methods ({methods.length})</CardTitle>
            </CardHeader>
            {/* Each method is its own outlined panel — it is a self-contained
                definition (type + document), not a row to compare against its
                neighbours. radius/md, one step below the card's radius/lg. */}
            <CardContent className="gap-[var(--spacing-component-sm)]">
              {methods.map((entry, index) => (
                <div
                  key={`${entry.method}-${index}`}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-[var(--spacing-component-md)]"
                >
                  <Badge variant="secondary" shape="pill" size="md">
                    {entry.method}
                  </Badge>
                  {entry.document ? (
                    <div className="mt-[var(--spacing-component-sm)] flex items-start gap-[var(--spacing-component-xs)]">
                      <FileText
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-icon-muted)]"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <a
                          href="#"
                          className="block text-sm text-[var(--color-brand-primary)] hover:underline"
                        >
                          {entry.document.split(" · ")[0]}
                        </a>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {entry.document.split(" · ")[1] ?? "Controlled document"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-[var(--spacing-component-sm)] text-xs text-[var(--color-text-secondary)]">
                      Captures a response — no document
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Linked roles ({linkedRoles.length})</CardTitle>
            </CardHeader>
            <CardContent className="gap-0 divide-y divide-[var(--color-border-subtle)]">
              {linkedRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex justify-between gap-3 py-[var(--spacing-component-md)] first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/prototype/accura/training/roles/${role.id}`}
                      className="text-sm font-medium text-[var(--color-brand-primary)] hover:underline"
                    >
                      {role.name}
                    </Link>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {role.description}
                    </p>
                  </div>
                  <span className="shrink-0 tabular-nums text-xs text-[var(--color-text-secondary)]">
                    {role.users} users
                  </span>
                </div>
              ))}
              {linkedRoles.length === 0 && (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  No role links to this course, so nobody is trained on it.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </TrainingShell>
  )
}

