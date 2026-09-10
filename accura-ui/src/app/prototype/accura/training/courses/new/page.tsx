"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Plus, X } from "lucide-react"

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

import { TrainingShell } from "../../training-shell"
import {
  assessmentMethods,
  documentBackedMethods,
  documentOptions,
  roleOptions,
  triggerModes,
  type TriggerMode,
} from "../../mock-data"

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

export default function CreateCoursePage() {
  const [roles, setRoles] = React.useState<string[]>([])
  const [methods, setMethods] = React.useState<MethodBlock[]>([])
  const [trigger, setTrigger] = React.useState<TriggerMode>("No automatic trigger")

  const addMethod = () =>
    setMethods((current) => [
      ...current,
      { key: crypto.randomUUID(), method: "Acknowledge", documents: [] },
    ])

  const updateMethod = (key: string, patch: Partial<MethodBlock>) =>
    setMethods((current) =>
      current.map((block) => (block.key === key ? { ...block, ...patch } : block))
    )

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
            Create Course
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Course Details</CardTitle>
          </CardHeader>
          <CardContent className="gap-[var(--spacing-component-lg)]">
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <RequiredLabel htmlFor="course-name">Course name</RequiredLabel>
              <Input id="course-name" placeholder="e.g. GMP Fundamentals" />
            </div>
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <RequiredLabel htmlFor="course-description">
                Description
              </RequiredLabel>
              <Textarea
                id="course-description"
                rows={3}
                placeholder="Describe the course content and objectives..."
              />
            </div>
            <ComboboxField
              id="course-roles"
              label="Linked roles"
              placeholder="Search roles to link..."
              description="Roles whose members are trained on this course."
              options={[...roleOptions]}
              multiple
              value={roles}
              onValueChange={(value) => setRoles((value as string[]) ?? [])}
            />
          </CardContent>
        </Card>

        {/* Card and button both say "assessment method" — this defines the
            course, it does not send a round. See Q28. */}
        <Card>
          <CardHeader className="flex-row items-baseline justify-between gap-3">
            <CardTitle className="text-xl">Assessment methods</CardTitle>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {methods.length} {methods.length === 1 ? "method" : "methods"}
            </span>
          </CardHeader>
          <CardContent className="gap-[var(--spacing-component-lg)]">
            {methods.length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)]">
                No assessment methods yet. Add one or more — Acknowledge and Read
                &amp; acknowledge attach controlled documents; Quiz, Written and
                Practical capture a response.
              </p>
            )}

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
                      setMethods((current) =>
                        current.filter((item) => item.key !== block.key)
                      )
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

                {/* Documents only appear for the two methods that attach one.
                    Options are pinned to a VERSION — Q29. */}
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

            <Button variant="outline" className="w-fit" onClick={addMethod}>
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
            <Link href="/prototype/accura/training/courses">Cancel</Link>
          </Button>
          <Button disabled={methods.length === 0}>Create Course</Button>
        </div>
      </div>
    </TrainingShell>
  )
}
