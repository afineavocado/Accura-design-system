"use client"

import * as React from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { ChevronLeft, Plus, X } from "lucide-react"

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
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { TrainingShell } from "../../../training-shell"
import {
  allCourses,
  assessmentMethods,
  documentBackedMethods,
  documentOptions,
  roleOptions,
  trainingRoles,
  triggerModes,
  type TriggerMode,
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

type MethodBlock = { key: string; method: string; documents: string[] }
type Pending =
  | { kind: "role"; id: string; name: string; users: number }
  | { kind: "method"; key: string; label: string; index: number }

export default function EditCoursePage() {
  const params = useParams<{ id: string }>()
  const course = allCourses.find((candidate) => candidate.id === params.id)

  const linkedRoleIds = React.useMemo(
    () =>
      course
        ? trainingRoles
            .filter((role) =>
              role.courseList.some((item) => item.course === course.name)
            )
            .map((role) => role.id)
        : [],
    [course]
  )

  const [roles, setRoles] = React.useState<string[]>(linkedRoleIds)
  const [methods, setMethods] = React.useState<MethodBlock[]>(() =>
    (course?.methodDetail ?? course?.methods.map((m) => ({ method: m })) ?? []).map(
      (entry, index) => ({
        key: `method-${index}`,
        method: entry.method,
        documents:
          "document" in entry && entry.document
            ? [documentOptions.find((d) => d.label === entry.document)?.value ?? ""]
                .filter(Boolean)
            : [],
      })
    )
  )
  const [trigger, setTrigger] = React.useState<TriggerMode>(
    course?.trigger ?? "No automatic trigger"
  )
  const [pending, setPending] = React.useState<Pending | null>(null)

  if (!course) notFound()

  const updateMethod = (key: string, patch: Partial<MethodBlock>) =>
    setMethods((current) =>
      current.map((block) => (block.key === key ? { ...block, ...patch } : block))
    )

  /* Unlinking a role stops its members being assigned this course — the same
     class of consequence as removing a user from a role (§21 Q27), so it is
     confirmed. Linking a role is not. */
  const onRolesChange = (next: string[]) => {
    const removed = roles.filter((id) => !next.includes(id))
    if (removed.length === 0) {
      setRoles(next)
      return
    }
    const role = trainingRoles.find((item) => item.id === removed[0])
    if (!role) {
      setRoles(next)
      return
    }
    setPending({ kind: "role", id: role.id, name: role.name, users: role.users })
  }

  const roundsSent = course.rounds?.length ?? 0

  return (
    <TrainingShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-[var(--spacing-layout-sm)]">
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <Link
            href={`/prototype/accura/training/courses/${course.id}`}
            className="inline-flex w-fit items-center gap-1 text-sm text-[var(--color-brand-primary)] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back to {course.name}
          </Link>
          <h2 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">
            Edit Course
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Course Details</CardTitle>
          </CardHeader>
          <CardContent className="gap-[var(--spacing-component-lg)]">
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <RequiredLabel htmlFor="course-name">Course name</RequiredLabel>
              <Input id="course-name" defaultValue={course.name} />
            </div>
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <RequiredLabel htmlFor="course-description">
                Description
              </RequiredLabel>
              <Textarea
                id="course-description"
                rows={3}
                defaultValue={course.description}
              />
            </div>
            <ComboboxField
              id="course-roles"
              label="Linked roles"
              placeholder="Search roles to link..."
              description="Roles whose members are trained on this course. Unlinking one asks first."
              options={[...roleOptions]}
              multiple
              value={roles}
              onValueChange={(value) => onRolesChange((value as string[]) ?? [])}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-baseline justify-between gap-3">
            <CardTitle className="text-xl">Assessment methods</CardTitle>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {methods.length} {methods.length === 1 ? "method" : "methods"}
            </span>
          </CardHeader>
          <CardContent className="gap-[var(--spacing-component-lg)]">
            {methods.map((block, index) => (
              <div
                key={block.key}
                className="flex flex-col gap-[var(--spacing-component-md)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-background-muted)] p-[var(--spacing-component-md)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-surface-default-foreground)]">
                    Method {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove method ${index + 1}`}
                    onClick={() =>
                      setPending({
                        kind: "method",
                        key: block.key,
                        label: block.method,
                        index,
                      })
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                  <label
                    htmlFor={`type-${block.key}`}
                    className="text-sm font-medium text-[var(--color-background-default-foreground)]"
                  >
                    Assessment type
                  </label>
                  <Select
                    value={block.method}
                    onValueChange={(value) =>
                      updateMethod(block.key, { method: value, documents: [] })
                    }
                  >
                    <SelectTrigger id={`type-${block.key}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assessmentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {documentBackedMethods.includes(block.method) && (
                  <ComboboxField
                    id={`docs-${block.key}`}
                    label="Documents"
                    placeholder="Search controlled documents..."
                    description="Each document is pinned to a version. Trainees acknowledge that version."
                    options={documentOptions}
                    multiple
                    value={block.documents}
                    onValueChange={(value) =>
                      updateMethod(block.key, {
                        documents: (value as string[]) ?? [],
                      })
                    }
                  />
                )}
              </div>
            ))}

            <Button
              variant="outline"
              className="w-fit"
              onClick={() =>
                setMethods((current) => [
                  ...current,
                  {
                    key: crypto.randomUUID(),
                    method: "Acknowledge",
                    documents: [],
                  },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add assessment method
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Automatic Assessment Trigger</CardTitle>
          </CardHeader>
          <CardContent className="gap-[var(--spacing-component-md)]">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Optionally trigger an assessment automatically — once on a specific
              date, or on a recurring period.
            </p>
            <div
              role="radiogroup"
              aria-label="Automatic assessment trigger"
              className="flex flex-wrap gap-[var(--spacing-component-sm)]"
            >
              {["No automatic trigger", ...triggerModes.filter((m) => m !== "No automatic trigger")].map(
                (mode) => (
                  <Button
                    key={mode}
                    role="radio"
                    aria-checked={trigger === mode}
                    variant={trigger === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTrigger(mode as TriggerMode)}
                  >
                    {mode}
                  </Button>
                )
              )}
            </div>

            {trigger === "Specific date" && (
              <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                <RequiredLabel htmlFor="trigger-date">Trigger date</RequiredLabel>
                <DatePicker
                  id="trigger-date"
                  type="input"
                  placeholder="Select date"
                />
              </div>
            )}

            {trigger === "Recurring period" && (
              <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                <RequiredLabel htmlFor="trigger-period">
                  Repeat every
                </RequiredLabel>
                <Select defaultValue="12">
                  <SelectTrigger id="trigger-period" className="sm:w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 6, 12, 24].map((months) => (
                      <SelectItem key={months} value={String(months)}>
                        {months} months
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-component-sm)] pb-[var(--spacing-layout-md)]">
          <Button asChild variant="ghost">
            <Link href={`/prototype/accura/training/courses/${course.id}`}>
              Cancel
            </Link>
          </Button>
          <Button disabled={methods.length === 0}>Save Changes</Button>
        </div>
      </div>

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.kind === "role"
                ? `Unlink ${pending.name} from ${course.name}?`
                : `Remove the ${pending?.label} method?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.kind === "role" ? (
                <>
                  <span className="block">
                    {pending.users} user{pending.users === 1 ? "" : "s"} stop
                    being assigned this course from now on.
                  </span>
                  <span className="block">
                    Assessments already sent are unaffected, and completed
                    records are kept. Training history is evidence and is never
                    deleted.
                  </span>
                </>
              ) : (
                <>
                  <span className="block">
                    This changes what the course asks of trainees. Future
                    assessments will no longer include it.
                  </span>
                  <span className="block">
                    {roundsSent > 0
                      ? `${roundsSent} assessment${roundsSent === 1 ? "" : "s"} already sent keep the methods they were sent with.`
                      : "No assessments have been sent from this course yet."}
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (pending?.kind === "role") {
                  setRoles((current) =>
                    current.filter((id) => id !== pending.id)
                  )
                } else if (pending?.kind === "method") {
                  setMethods((current) =>
                    current.filter((item) => item.key !== pending.key)
                  )
                }
                setPending(null)
              }}
            >
              {pending?.kind === "role" ? "Unlink role" : "Remove method"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TrainingShell>
  )
}
