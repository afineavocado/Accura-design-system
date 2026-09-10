"use client"

import * as React from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { ChevronLeft, Download } from "lucide-react"

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

import { HistoryRecordPanel } from "../history-panel"
import { TrainingShell } from "../training-shell"
import {
  assignedAssessments,
  assignedRoles,
  assignmentStatusVariant,
  historyStatusVariant,
  trainingHistory,
  trainingUsers,
  userStatusVariant,
  type HistoryRecord,
} from "../mock-data"

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {/* The table gets its own surface inside the card: radius/md, one step
          below the card's radius/lg, which is how a nested surface reads. */}
      <CardContent className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
        {children}
      </CardContent>
    </Card>
  )
}

export default function TrainingUserDetailPage() {
  const params = useParams<{ id: string }>()
  const user = trainingUsers.find((candidate) => candidate.id === params.id)
  const [activeRecord, setActiveRecord] = React.useState<HistoryRecord | null>(null)

  if (!user) notFound()

  return (
    <TrainingShell>
      <div>
        <Link
          href="/prototype/accura/training"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-brand-primary)] hover:underline"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Users
        </Link>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[var(--color-surface-default-foreground)]">
              {user.name}
            </h2>
            <Badge variant={userStatusVariant[user.status]} shape="pill" size="md">
              {user.status}
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export Record
          </Button>
        </div>
      </div>

      {/* Read-only. No approve, reject, checkboxes or bulk bar — actions live
          in Review and on Participant Progress. See §15. */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <Panel title="Assigned Assessments">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedAssessments.map((assignment) => (
                  <TableRow key={assignment.key}>
                    <TableCell>
                      <div className="text-[var(--color-surface-default-foreground)]">
                        {assignment.course}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {assignment.method}
                        {assignment.document && ` · ${assignment.document}`}
                      </div>
                    </TableCell>
                    <TableCell>{assignment.assessments}</TableCell>
                    <TableCell>
                      <div>{assignment.dueDate}</div>
                      {/* Overdue sits on the date, not the status — it is a
                          fact about a date and coexists with any state. */}
                      {assignment.overdue && (
                        <div className="text-xs text-[var(--color-status-danger-subtle-foreground)]">
                          overdue
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={assignmentStatusVariant[assignment.status]}
                        shape="pill"
                        size="md"
                      >
                        {assignment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>

          <Panel title="Training History">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Signed off by</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingHistory.map((record) => {
                  /* The last signature is the one that settled the record. */
                  const signer = record.signatures[record.signatures.length - 1]
                  return (
                    <TableRow
                      key={record.key}
                      className="cursor-pointer"
                      onClick={(event) => {
                        if ((event.target as HTMLElement).closest("a, button"))
                          return
                        setActiveRecord(record)
                      }}
                    >
                      <TableCell>
                        {/* A button, not a link: this opens a panel rather
                            than navigating. The row click is the convenience. */}
                        <button
                          type="button"
                          onClick={() => setActiveRecord(record)}
                          className="text-left font-medium text-[var(--color-brand-primary)] hover:underline"
                        >
                          {record.course}
                        </button>
                        <div className="text-xs text-[var(--color-text-secondary)]">
                          {record.method} · {record.documentVersion.replace("Version ", "v")}
                          {record.score && ` · ${record.score}`}
                        </div>
                        {record.supersededBy && (
                          <div className="text-xs text-[var(--color-brand-primary)]">
                            Replaced by {record.supersededBy} →
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{record.completedDate}</TableCell>
                      {/* `Signed off by` names whoever actually signed and when.
                          Self-signed records are not called out here — see §19;
                          the panel carries the signature detail. */}
                      <TableCell>
                        <div className="text-[var(--color-surface-default-foreground)]">
                          {signer.name}
                        </div>
                        <div className="text-xs text-[var(--color-text-secondary)]">
                          {signer.timestamp.split(",")[0]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={historyStatusVariant[record.status]}
                          shape="pill"
                          size="md"
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Panel>
        </div>

        {/* Roles answer *why this person owes these things* — context, not
            content, so they sit in the rail. */}
        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>General info</CardTitle>
            </CardHeader>
            <dl className="flex flex-col gap-3">
              {[
                ["Department", user.department],
                ["Email", user.email],
                ["Access level", user.accessLevel],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                    {term}
                  </dt>
                  <dd className="text-sm text-[var(--color-surface-default-foreground)]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned roles ({assignedRoles.length})</CardTitle>
            </CardHeader>
            <ul className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
              {assignedRoles.map((role) => (
                <li
                  key={role.name}
                  className="flex justify-between gap-3 py-2 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm text-[var(--color-surface-default-foreground)]">
                      {role.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {role.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
                    {role.courses} courses
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>

      <HistoryRecordPanel
        record={activeRecord}
        open={activeRecord !== null}
        onOpenChange={(open) => {
          if (!open) setActiveRecord(null)
        }}
      />
    </TrainingShell>
  )
}
