"use client"

import * as React from "react"
import Link from "next/link"
import { notFound, useParams, useRouter } from "next/navigation"
import { ChevronLeft, Pencil } from "lucide-react"

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

import { useRowClick } from "../../../row-click"
import { TrainingShell } from "../../training-shell"
import {
  trainingRoles,
  userStatusVariant,
  type RoleMember,
} from "../../mock-data"

function MemberRow({
  member,
  courses,
  router,
}: {
  member: RoleMember
  courses: number
  router: ReturnType<typeof useRouter>
}) {
  const href = `/prototype/accura/training/${member.id}`
  const onClick = useRowClick<HTMLTableRowElement>(() => router.push(href))

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell>
        <Link
          href={href}
          className="font-medium text-[var(--color-brand-primary)] hover:underline"
        >
          {member.name}
        </Link>
        <div className="text-xs text-[var(--color-text-secondary)]">
          {member.email}
        </div>
      </TableCell>
      <TableCell>{member.department}</TableCell>
      <TableCell
        className={
          member.outstanding === 0
            ? "tabular-nums text-[var(--color-text-tertiary)]"
            : "tabular-nums"
        }
      >
        {member.outstanding} of {courses}
      </TableCell>
      <TableCell>
        <Badge variant={userStatusVariant[member.status]} shape="pill" size="md">
          {member.status}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export default function TrainingRoleDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const role = trainingRoles.find((candidate) => candidate.id === params.id)

  if (!role) notFound()

  return (
    <TrainingShell>
      <div>
        <Link
          href="/prototype/accura/training/roles"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-brand-primary)] hover:underline"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Roles
        </Link>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            {/* Description sits under the title, not in a card of its own —
                one line of prose does not need a surface. */}
            <h2 className="text-xl font-semibold text-[var(--color-surface-default-foreground)]">
              {role.name}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {role.description}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/prototype/accura/training/roles/${role.id}/edit`}>
              <Pencil className="h-4 w-4" />
              Edit role
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses ({role.courses})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[38%]">Course</TableHead>
                <TableHead>Assessment method</TableHead>
                <TableHead>Linked document</TableHead>
                <TableHead>Assessments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {role.courseList.map((course) => (
                <TableRow key={course.key}>
                  <TableCell>
                    <span className="font-medium text-[var(--color-brand-primary)]">
                      {course.course}
                    </span>
                  </TableCell>
                  <TableCell>{course.method}</TableCell>
                  <TableCell>
                    {course.document ?? (
                      <span className="text-[var(--color-text-tertiary)]">—</span>
                    )}
                    {/* A role is what decides who gets retrained when a document
                        moves; this is where you would notice it fired. */}
                    {course.supersededFrom && (
                      <div className="text-xs text-[var(--color-status-warning-subtle-foreground)]">
                        {course.supersededFrom} superseded
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {course.assessments}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-baseline justify-between gap-3">
          <CardTitle>Assigned users ({role.users})</CardTitle>
          {/* Status here is scoped to this role. A person's overall status
              would be misleading — they may be overdue on another role. */}
          <span className="text-xs text-[var(--color-text-secondary)]">
            Status is for this role&rsquo;s courses only
          </span>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[34%]">Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {role.memberSample.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  courses={role.courses}
                  router={router}
                />
              ))}
              {role.memberSample.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-sm text-[var(--color-text-secondary)]"
                  >
                    No users are assigned to this role.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {role.users > role.memberSample.length && (
        <p className="text-xs text-[var(--color-text-secondary)]">
          Showing {role.memberSample.length} of {role.users}
        </p>
      )}
    </TrainingShell>
  )
}
