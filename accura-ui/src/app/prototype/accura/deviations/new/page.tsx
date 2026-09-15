"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ComboboxField } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  basePath,
  categories,
  classifications,
  departments,
  display,
  incidentTypes,
  people,
  severities,
} from "../mock-data"

/* Create New Deviation — spec §3.
 *
 * Save as Draft bypasses validation, Submit for Review runs it and mints the
 * Deviation ID (brief §5 Step 1). Neither is wired: the transitions are the
 * logic phase.
 *
 * Due Date is deliberately absent, matching the product. Every record has one
 * and the whole Overdue rule depends on it, but it is not a field here and
 * neither brief says where it comes from — spec §10.2. */

const reviewerOptions = Object.values(people).map((person) => ({
  value: person.name,
  label: display(person),
}))

function Choice({
  id,
  label,
  options,
  value,
  onValueChange,
  required = true,
}: {
  id: string
  label: string
  options: readonly string[]
  value: string
  onValueChange: (value: string) => void
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-component-xs)]">
      <Label required={required} id={`${id}-label`}>
        {label}
      </Label>
      <RadioGroup
        aria-labelledby={`${id}-label`}
        value={value}
        onValueChange={onValueChange}
        className="flex flex-wrap gap-[var(--spacing-component-lg)]"
      >
        {options.map((option) => (
          <div
            key={option}
            className="flex items-center gap-[var(--spacing-component-sm)]"
          >
            <RadioGroupItem id={`${id}-${option}`} value={option} />
            <Label htmlFor={`${id}-${option}`} className="font-normal">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default function CreateDeviationPage() {
  const [classification, setClassification] = useState("")
  const [category, setCategory] = useState("")
  const [severity, setSeverity] = useState("")
  const [productImpacted, setProductImpacted] = useState("No")

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-[var(--spacing-layout-sm)]">
      {/* Back link and title as one group, then cards, then the footer —
          the shape CAPA and Training create screens already use. */}
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <Button
        asChild
        variant="link"
        className="h-auto w-fit p-0 text-sm no-underline hover:no-underline"
      >
          <Link href={basePath}>
            <ChevronLeft className="size-4" />
            Back to Deviations
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">
          Create New Deviation
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Incident Details</CardTitle>
        </CardHeader>
        {/* No spacing class: CardContent already lays out as a column at
            spacing/component/lg. Adding space-y stacked margins on top and
            doubled every gap to 32px. */}
        <CardContent>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label required htmlFor="title">
              Title / short description
            </Label>
            <Input id="title" placeholder="Short description of the incident" />
          </div>

          <div className="grid gap-[var(--spacing-component-lg)] md:grid-cols-2">
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <Label required htmlFor="department">
                Department
              </Label>
              <Select>
                <SelectTrigger id="department" className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <Label required htmlFor="owner">
                Deviation owner
              </Label>
              <Input id="owner" defaultValue="amit@accura.one" />
            </div>
          </div>

          {/* Optional, 0..n, added as chips the moment one is picked. */}
          <ComboboxField
            id="reviewers"
            label="Reviewers"
            type="tag-input"
            multiple
            options={reviewerOptions}
            placeholder="Search reviewers to add..."
            description="Add zero or more reviewers. Selecting a name adds it immediately."
          />

          <Choice
            id="classification"
            label="Classification"
            options={classifications}
            value={classification}
            onValueChange={setClassification}
          />

          <Choice
            id="category"
            label="Category"
            options={categories}
            value={category}
            onValueChange={setCategory}
          />

          <Choice
            id="severity"
            label="Severity"
            options={severities}
            value={severity}
            onValueChange={setSeverity}
          />

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label required htmlFor="incident-type">
              Incident type
            </Label>
            <Select>
              <SelectTrigger id="incident-type" className="w-full">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                {incidentTypes.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Choice
            id="product-impacted"
            label="Product impacted?"
            options={["Yes", "No"] as const}
            value={productImpacted}
            onValueChange={setProductImpacted}
            required={false}
          />

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label required htmlFor="details">
              Incident details
            </Label>
            <Textarea
              id="details"
              placeholder="Describe the incident in detail..."
              className="min-h-32"
            />
          </div>

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label>Attachments</Label>
            <div>
              <Button variant="outline" size="sm">
                <Plus className="size-4" />
                Attach files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-component-sm)] pb-[var(--spacing-layout-md)]">
        <Button variant="ghost" asChild>
          <Link href={basePath}>Cancel</Link>
        </Button>
        <Button variant="outline">Save as Draft</Button>
        <Button>Submit for Review</Button>
      </div>
    </div>
  )
}
