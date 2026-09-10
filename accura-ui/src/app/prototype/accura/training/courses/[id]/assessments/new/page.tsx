"use client"

import * as React from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ComboboxField } from "@/components/ui/combobox"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { TrainingShell } from "../../../../training-shell"
import {
  allCourses,
  trainingRoles,
  userOptions,
} from "../../../../mock-data"

function RequiredLabel({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-[var(--color-background-default-foreground)]"
    >
      {children} <span className="text-[var(--color-text-invalid)]">*</span>
    </label>
  )
}

export default function CreateAssessmentPage() {
  const params = useParams<{ id: string }>()
  const course = allCourses.find((candidate) => candidate.id === params.id)

  /* Which roles link to this course, and therefore who is pre-filled. Named
     explicitly so the assignment's provenance is visible — see Q30. */
  const linkedRoles = React.useMemo(
    () =>
      course
        ? trainingRoles.filter((role) =>
            role.courseList.some((item) => item.course === course.name)
          )
        : [],
    [course]
  )

  const prefilled = React.useMemo(
    () =>
      Array.from(
        new Set(
          linkedRoles.flatMap((role) => role.memberSample.map((m) => m.id))
        )
      ),
    [linkedRoles]
  )

  const [assignees, setAssignees] = React.useState<string[]>(prefilled)

  if (!course) notFound()

  const added = assignees.filter((id) => !prefilled.includes(id))
  const removed = prefilled.filter((id) => !assignees.includes(id))

  return (
    <TrainingShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-[var(--spacing-layout-sm)]">
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <Link
            href="/prototype/accura/training/courses"
            className="inline-flex w-fit items-center gap-1 text-sm text-[var(--color-brand-primary)] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back to Courses
          </Link>
          <h2 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">
            Create Assessment
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            For course{" "}
            <span className="font-medium text-[var(--color-surface-default-foreground)]">
              {course.name}
            </span>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Assessment Details</CardTitle>
          </CardHeader>
          <CardContent className="gap-[var(--spacing-component-lg)]">
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <RequiredLabel htmlFor="assessment-name">
                Assessment name
              </RequiredLabel>
              <Input
                id="assessment-name"
                defaultValue={`${course.name} - Assessment`}
              />
            </div>

            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <RequiredLabel htmlFor="assessment-due">Due date</RequiredLabel>
              <DatePicker
                id="assessment-due"
                type="input"
                placeholder="Select date"
              />
            </div>

            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <label
                htmlFor="assessment-notes"
                className="text-sm font-medium text-[var(--color-background-default-foreground)]"
              >
                Notes
              </label>
              <Textarea
                id="assessment-notes"
                rows={3}
                placeholder="Reason for this assessment, any special instructions..."
              />
            </div>

            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <ComboboxField
                id="assessment-assignees"
                label="Assign to"
                placeholder="Search users to assign..."
                options={[...userOptions]}
                multiple
                value={assignees}
                onValueChange={(value) =>
                  setAssignees((value as string[]) ?? [])
                }
              />
              {/* Q30: the assignment is a snapshot of role membership, and
                  editing it breaks the link back to the role. Say which roles
                  filled it, and flag any hand edits before they are saved. */}
              <p className="text-xs text-[var(--color-text-secondary)]">
                {linkedRoles.length > 0 ? (
                  <>
                    Pre-filled from{" "}
                    {linkedRoles.map((role) => role.name).join(" and ")}. Add or
                    remove as needed.
                  </>
                ) : (
                  <>
                    No role links to this course, so nobody is pre-filled. Anyone
                    you add here is assigned by hand.
                  </>
                )}
              </p>
              {(added.length > 0 || removed.length > 0) && (
                <p className="text-xs text-[var(--color-status-warning-subtle-foreground)]">
                  {added.length > 0 &&
                    `${added.length} assigned by hand — their record will not trace back to a role. `}
                  {removed.length > 0 &&
                    `${removed.length} removed from the pre-filled list — they stay in the role but skip this round.`}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-component-sm)] pb-[var(--spacing-layout-md)]">
          <Button asChild variant="ghost">
            <Link href="/prototype/accura/training/courses">Cancel</Link>
          </Button>
          <Button disabled={assignees.length === 0}>Create Assessment</Button>
        </div>
      </div>
    </TrainingShell>
  )
}
