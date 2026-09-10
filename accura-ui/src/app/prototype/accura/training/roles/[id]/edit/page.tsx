"use client"

import * as React from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ComboboxField } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { TrainingShell } from "../../../training-shell"
import {
  courseOptions,
  trainingRoles,
  userOptions,
  type RoleMember,
} from "../../../mock-data"

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

/* One sentence per affected group, in the order that matters: what is lost,
   then what is kept. Zero counts are omitted rather than printed as "0". */
function impactSentences(member: RoleMember) {
  const { notStarted, inProgress, completed } = member.impact
  const lines: string[] = []
  if (notStarted > 0)
    lines.push(
      `${notStarted} assignment${notStarted === 1 ? "" : "s"} not started will be withdrawn.`
    )
  if (inProgress > 0)
    lines.push(
      `${inProgress} in progress will be cancelled — any evidence already uploaded is discarded.`
    )
  if (completed > 0)
    lines.push(
      `${completed} completed record${completed === 1 ? " is" : "s are"} kept. Training history is evidence and is never deleted.`
    )
  if (lines.length === 0) lines.push("This user has no training under this role.")
  return lines
}

export default function EditTrainingRolePage() {
  const params = useParams<{ id: string }>()
  const role = trainingRoles.find((candidate) => candidate.id === params.id)

  const [courses, setCourses] = React.useState<string[]>(
    role ? role.courseList.map((course) => course.key) : []
  )
  const [users, setUsers] = React.useState<string[]>(
    role ? role.memberSample.map((member) => member.id) : []
  )
  /* A pending removal, held until it is confirmed. */
  const [removing, setRemoving] = React.useState<RoleMember | null>(null)

  if (!role) notFound()

  /* Removing a user has consequences for records already in flight, so it is
     confirmed rather than applied on click. Adding is not. See §21 Q27. */
  const onUsersChange = (next: string[]) => {
    const removed = users.filter((id) => !next.includes(id))
    if (removed.length === 0) {
      setUsers(next)
      return
    }
    const member = role.memberSample.find((m) => m.id === removed[0])
    if (!member) {
      setUsers(next)
      return
    }
    setRemoving(member)
  }

  return (
    <TrainingShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-[var(--spacing-layout-sm)]">
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <Link
            href={`/prototype/accura/training/roles/${role.id}`}
            className="inline-flex w-fit items-center gap-1 text-sm text-[var(--color-brand-primary)] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back to {role.name}
          </Link>
          <h2 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">
            Edit Training Role
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Role Details</CardTitle>
          </CardHeader>
          <CardContent className="gap-[var(--spacing-component-lg)]">
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <RequiredLabel htmlFor="role-name">Role name</RequiredLabel>
              <Input id="role-name" defaultValue={role.name} />
            </div>

            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <RequiredLabel htmlFor="role-description">
                Description
              </RequiredLabel>
              <Textarea
                id="role-description"
                rows={3}
                defaultValue={role.description}
              />
            </div>

            <ComboboxField
              id="role-courses"
              label="Courses"
              placeholder="Search courses to add..."
              description="Add the courses that make up this role."
              options={[...courseOptions]}
              multiple
              value={courses}
              onValueChange={(value) => setCourses((value as string[]) ?? [])}
            />

            <ComboboxField
              id="role-users"
              label="Assigned users"
              placeholder="Search users to assign..."
              description="Adding a user assigns this role's courses immediately. Removing one asks first."
              options={[...userOptions]}
              multiple
              value={users}
              onValueChange={(value) => onUsersChange((value as string[]) ?? [])}
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-component-sm)] pb-[var(--spacing-layout-md)]">
          <Button asChild variant="ghost">
            <Link href={`/prototype/accura/training/roles/${role.id}`}>
              Cancel
            </Link>
          </Button>
          <Button disabled={courses.length === 0}>Save Changes</Button>
        </div>
      </div>

      <AlertDialog
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open) setRemoving(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {removing?.name} from {role.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {removing &&
                impactSentences(removing).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {/* variant is a real prop — never className={buttonVariants(...)} */}
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (removing) {
                  setUsers((current) =>
                    current.filter((id) => id !== removing.id)
                  )
                }
                setRemoving(null)
              }}
            >
              Remove user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TrainingShell>
  )
}
