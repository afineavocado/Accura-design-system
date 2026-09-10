"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ComboboxField } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { TrainingShell } from "../../training-shell"
import { courseOptions, userOptions } from "../../mock-data"

/* Frame matches Create CAPA: centred max-w-5xl column, back link, page
   heading, one Card per group, actions right-aligned at the foot. */
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

export default function CreateTrainingRolePage() {
  const [courses, setCourses] = React.useState<string[]>([])
  const [users, setUsers] = React.useState<string[]>([])

  return (
    <TrainingShell>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-[var(--spacing-layout-sm)]">
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <Link
            href="/prototype/accura/training/roles"
            className="inline-flex w-fit items-center gap-1 text-sm text-[var(--color-brand-primary)] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back to Roles
          </Link>
          <h2 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">
            Create Training Role
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Role Details</CardTitle>
          </CardHeader>
          <CardContent className="gap-[var(--spacing-component-lg)]">
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <RequiredLabel htmlFor="role-name">Role name</RequiredLabel>
              <Input id="role-name" placeholder="e.g. GMP Operator" />
            </div>

            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <RequiredLabel htmlFor="role-description">
                Description
              </RequiredLabel>
              <Textarea
                id="role-description"
                rows={3}
                placeholder="Describe who this role is for and what it covers..."
              />
            </div>

            {/* ComboboxField multiple = dropdown of real options plus removable
                chips. Both are the component's own — nothing hand-rolled. */}
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
              description="Assign users to this role. They receive its courses immediately."
              options={[...userOptions]}
              multiple
              value={users}
              onValueChange={(value) => setUsers((value as string[]) ?? [])}
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-component-sm)] pb-[var(--spacing-layout-md)]">
          <Button asChild variant="ghost">
            <Link href="/prototype/accura/training/roles">Cancel</Link>
          </Button>
          <Button disabled={courses.length === 0}>Create Role</Button>
        </div>
      </div>
    </TrainingShell>
  )
}
