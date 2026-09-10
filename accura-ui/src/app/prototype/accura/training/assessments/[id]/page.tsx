"use client"

import * as React from "react"
import Link from "next/link"
import { notFound, useParams, useRouter } from "next/navigation"
import { ChevronLeft, Download, FileText, ScrollText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useRowClick } from "../../../row-click"
import { TrainingShell } from "../../training-shell"
import {
  allCourses,
  assessmentRounds,
  assignmentStatusVariant,
  roundStatusVariant,
  type Participant,
} from "../../mock-data"

/* Participant rows reuse the row-click + real-link pattern from every other
   table in the module. The name goes to that person's record. */
function ParticipantRow({
  participant,
  router,
}: {
  participant: Participant
  router: ReturnType<typeof useRouter>
}) {
  const href = `/prototype/accura/training/${participant.id}`
  const onClick = useRowClick<HTMLTableRowElement>(() => router.push(href))

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell>
        <Link
          href={href}
          className="font-medium text-[var(--color-brand-primary)] hover:underline"
        >
          {participant.name}
        </Link>
        <div className="text-xs text-[var(--color-text-secondary)]">
          {participant.email}
        </div>
      </TableCell>
      <TableCell>
        {participant.completedDate ?? (
          <span className="text-[var(--color-text-tertiary)]">—</span>
        )}
        {participant.comment && (
          <div className="text-xs text-[var(--color-text-secondary)]">
            {participant.comment}
          </div>
        )}
      </TableCell>
      {/* Whoever actually signed. Self-signed is the norm today because review
          does not exist — the column states it rather than implying approval. */}
      <TableCell>
        {participant.signedBy ? (
          <span>{participant.signedBy}</span>
        ) : (
          <span className="text-[var(--color-text-tertiary)]">Not signed</span>
        )}
      </TableCell>
      <TableCell>
        <Badge
          variant={assignmentStatusVariant[participant.status === "Completed" ? "Assigned" : participant.status]}
          shape="pill"
          size="md"
        >
          {participant.status}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export default function AssessmentDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const round = assessmentRounds.find((item) => item.id === params.id)
  const [trailOpen, setTrailOpen] = React.useState(false)

  if (!round) notFound()

  const course = allCourses.find((item) => item.id === round.courseId)
  const methods: { method: string; document?: string }[] =
    course?.methodDetail ?? course?.methods.map((m) => ({ method: m })) ?? []
  const participants = round.participants ?? []
  const percent = Math.round((round.completed / round.total) * 100)

  return (
    <TrainingShell>
      <div>
        <Link
          href="/prototype/accura/training/assessments"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-brand-primary)] hover:underline"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Assessments
        </Link>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-surface-default-foreground)]">
              {round.name}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {round.id.toUpperCase()} ·{" "}
              <Link
                href={`/prototype/accura/training/courses/${round.courseId}`}
                className="text-[var(--color-brand-primary)] hover:underline"
              >
                {round.course}
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-[var(--spacing-component-sm)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTrailOpen(true)}
            >
              <ScrollText className="h-4 w-4" />
              View Audit Trail
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main + right rail, matching the User and Course detail screens. */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <Card>
          <CardHeader className="flex-row items-baseline justify-between gap-3">
            <CardTitle>Participant progress ({participants.length})</CardTitle>
            <span className="text-xs text-[var(--color-text-secondary)]">
              one record per person
            </span>
          </CardHeader>
          <CardContent className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[34%]">Name</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Signed off by</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => (
                  <ParticipantRow
                    key={participant.id}
                    participant={participant}
                    router={router}
                  />
                ))}
                {participants.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-sm text-[var(--color-text-secondary)]"
                    >
                      No participant records for this assessment.
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
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="gap-[var(--spacing-component-md)]">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                  Status
                </p>
                <div className="mt-[var(--spacing-component-xxs)]">
                  <Badge
                    variant={roundStatusVariant[round.status]}
                    shape="pill"
                    size="md"
                  >
                    {round.status}
                  </Badge>
                </div>
              </div>
              {/* Replaces the stepper (Q19): a count plus a bar stays true at
                  every ratio, where three steps cannot express a partial group. */}
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                  Progress
                </p>
                <p className="tabular-nums text-sm text-[var(--color-surface-default-foreground)]">
                  {round.completed} of {round.total} completed
                </p>
                <Progress
                  value={percent}
                  size="sm"
                  className="mt-[var(--spacing-component-xs)]"
                  aria-label={`${percent}% complete`}
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                  Due date
                </p>
                <p className="text-sm text-[var(--color-surface-default-foreground)]">
                  {round.due}
                </p>
                {round.overdue && (
                  <p className="text-xs text-[var(--color-status-danger-subtle-foreground)]">
                    overdue
                  </p>
                )}
              </div>
              {round.created && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                    Created
                  </p>
                  <p className="text-sm text-[var(--color-surface-default-foreground)]">
                    {round.created}
                  </p>
                </div>
              )}
              {/* One notes field, not the product's Notes + Description pair
                  with nothing explaining which is which. See Q22. */}
              {round.notes && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                    Notes
                  </p>
                  <p className="text-sm text-[var(--color-surface-default-foreground)]">
                    {round.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Named `Assessment methods`, not `Assessments` — the card holds
              level-1 definitions inside a level-2 round. See Q1. */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment methods ({methods.length})</CardTitle>
            </CardHeader>
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

        </aside>
      </div>
      {/* Round-level trail, in the Sheet pattern used by the history record
          panel. State changes render `~~old~~ → new`, the product's own. */}
      <Sheet open={trailOpen} onOpenChange={setTrailOpen}>
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-[420px]">
          <SheetHeader>
            <SheetTitle>Assessment Audit Trail</SheetTitle>
            <SheetDescription>{round.id.toUpperCase()}</SheetDescription>
          </SheetHeader>

          <ol className="flex flex-col gap-4 px-4 py-4">
            {(round.auditTrail ?? []).map((event) => (
              <li
                key={event.event + event.timestamp}
                className="border-t border-[var(--color-border-default)] pt-4 first:border-t-0 first:pt-0"
              >
                <p className="text-sm font-medium text-[var(--color-surface-default-foreground)]">
                  {event.actor}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {event.email ? `${event.email} · ` : ""}
                  {event.timestamp}
                </p>
                <p className="mt-1 text-sm text-[var(--color-surface-default-foreground)]">
                  {event.event}
                </p>
                {event.note && (
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {event.note}
                  </p>
                )}
                {event.change && (
                  <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-success)] bg-[var(--color-status-success-subtle)] px-2 py-0.5 text-xs">
                    <span className="text-[var(--color-text-secondary)]">Status</span>
                    <s className="text-[var(--color-status-danger-subtle-foreground)]">
                      {event.change.from}
                    </s>
                    <span aria-hidden="true" className="text-[var(--color-text-secondary)]">→</span>
                    <span className="text-[var(--color-status-success-subtle-foreground)]">
                      {event.change.to}
                    </span>
                  </span>
                )}
              </li>
            ))}
            {(round.auditTrail ?? []).length === 0 && (
              <li className="text-sm text-[var(--color-text-secondary)]">
                No audit events recorded for this assessment.
              </li>
            )}
          </ol>

          <SheetFooter>
            <Button className="w-full">
              <Download className="h-4 w-4" />
              Export Audit Report
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </TrainingShell>
  )
}
