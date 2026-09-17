"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { ChevronLeft, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { AppNavItems, AppSidebar } from "../../app-sidebar"
import { ChangeControlHeader } from "../change-control-header"
import {
  initialChangeControlRecords,
  pendingAssessmentsFor,
  type ChangeControlRecord,
  type ChangeControlStatus,
} from "../mock-data"

const storedRecordsKey = "accura-change-control-records"

const changeOwnerOptions = [
  { value: "john-baker", label: "John Baker", fallback: "JB" },
  { value: "anna-hoang-1", label: "Anna Hoang", fallback: "CH" },
  { value: "anna-hoang-2", label: "Anna Hoang", fallback: "CH" },
  { value: "anna-hoang-3", label: "Anna Hoang", fallback: "CH" },
  { value: "john-smith", label: "John Smith", fallback: "FE" },
  { value: "lisa-tran", label: "Lisa Tran", fallback: "BF" },
]

const departmentOptions = [
  { value: "production", label: "Production" },
  { value: "quality-assurance", label: "Quality Assurance" },
  { value: "packaging", label: "Packaging" },
  { value: "engineering", label: "Engineering" },
  { value: "quality-control", label: "Quality Control" },
  { value: "development", label: "Development" },
]

// Picks the chosen department plus 0-2 other distinct departments at random,
// so a newly created record ends up with 1-3 affected departments instead of
// always just the one the form's single "Department" field selects — matches
// the multi-department scenarios already used throughout the seed data.
function randomAffectedDepartments(primary: string) {
  const others = departmentOptions
    .map((option) => option.label)
    .filter((label) => label !== primary)
  const maxExtra = Math.min(2, others.length)
  const extraCount = Math.floor(Math.random() * (maxExtra + 1))
  const shuffled = [...others].sort(() => Math.random() - 0.5)
  return [primary, ...shuffled.slice(0, extraCount)]
}

const changeTypeOptions = [
  { value: "document", label: "Document" },
  { value: "process", label: "Process" },
  { value: "equipment", label: "Equipment" },
  { value: "facility", label: "Facility" },
  { value: "utility", label: "Utility" },
  { value: "computer-system", label: "Computer System" },
  { value: "material", label: "Material" },
  { value: "supplier", label: "Supplier" },
  { value: "regulatory", label: "Regulatory" },
  { value: "temporary", label: "Temporary" },
  { value: "emergency", label: "Emergency" },
  { value: "analytical-method", label: "Analytical Method" },
]

const classificationOptions = [
  { value: "permanent", label: "Permanent" },
  { value: "temporary", label: "Temporary" },
  { value: "emergency", label: "Emergency" },
]

const categoryOptions = [
  { value: "minor", label: "Minor" },
  { value: "major", label: "Major" },
  { value: "critical", label: "Critical" },
]

type FormValues = {
  title: string
  targetDate?: Date
  department: string
  changeOwner: string
  changeType: string
  classification: string
  category: string
  description: string
  riskAssessment: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

function optionLabel(
  options: Array<{ value: string; label: string }>,
  value: string,
  fallback: string
) {
  return options.find((option) => option.value === value)?.label ?? fallback
}

/* Unset stays undefined rather than becoming "-": the detail page already
   renders "—" for a missing value, and a stored hyphen defeated that. */
function optionLabelOrNothing(
  options: Array<{ value: string; label: string }>,
  value: string
) {
  return options.find((option) => option.value === value)?.label
}

function optionValue(
  options: Array<{ value: string; label: string }>,
  label?: string
) {
  if (!label) return ""

  const normalizedLabel = label.trim().toLowerCase()

  return (
    options.find((option) => option.label.toLowerCase() === normalizedLabel)
      ?.value ?? ""
  )
}

function parseDisplayDate(value?: string) {
  if (!value || value === "-") return undefined

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? undefined : date
}

function readStoredRecords() {
  if (typeof window === "undefined") return []

  try {
    const parsed = JSON.parse(window.localStorage.getItem(storedRecordsKey) ?? "[]")
    return Array.isArray(parsed) ? (parsed as ChangeControlRecord[]) : []
  } catch {
    return []
  }
}

function writeStoredRecord(record: ChangeControlRecord) {
  const records = readStoredRecords()
  const nextRecords = [
    record,
    ...records.filter((item) => item.id !== record.id),
  ]

  window.localStorage.setItem(storedRecordsKey, JSON.stringify(nextRecords))
}

function findChangeControlRecord(id: string) {
  return (
    readStoredRecords().find((item) => item.id === id) ??
    initialChangeControlRecords.find((item) => item.id === id)
  )
}

function recordToFormValues(record?: ChangeControlRecord): FormValues {
  return {
    title: record?.title ?? "",
    targetDate: parseDisplayDate(record?.targetImplementationDate),
    department: optionValue(departmentOptions, record?.department),
    changeOwner: optionValue(changeOwnerOptions, record?.owner),
    changeType: optionValue(changeTypeOptions, record?.type),
    classification: optionValue(classificationOptions, record?.classification),
    category: optionValue(categoryOptions, record?.category),
    description: record?.description === "-" ? "" : record?.description ?? "",
    riskAssessment:
      record?.riskAssessment === "-" ? "" : record?.riskAssessment ?? "",
  }
}

function invalidAttr(error?: string) {
  return error ? true : undefined
}

function SelectField({
  id,
  label,
  placeholder,
  options,
  value,
  error,
  onValueChange,
}: {
  id: string
  label: string
  placeholder: string
  options: Array<{ value: string; label: string }>
  value: string
  error?: string
  onValueChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-component-xs)]">
      <Label required htmlFor={id} state={error ? "invalid" : "default"}>
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} aria-label={label} aria-invalid={invalidAttr(error)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FieldError>{error}</FieldError>}
    </div>
  )
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium leading-none text-[var(--color-text-invalid)]">
      {children}
    </p>
  )
}

export default function NewChangeControlPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const mode = searchParams.get("mode")
  const recordId = searchParams.get("id") ?? "CC-2026-001"
  const isEdit = mode === "edit"
  const editRecord = isEdit ? findChangeControlRecord(recordId) : undefined
  const [validationAttempted, setValidationAttempted] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([])
  const [values, setValues] = React.useState<FormValues>(() =>
    recordToFormValues(editRecord)
  )

  const errors = React.useMemo<FormErrors>(() => {
    if (!validationAttempted) return {}

    return getRequiredFieldErrors()
  }, [validationAttempted, values])

  function updateValue<Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key]
  ) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function getRequiredFieldErrors(): FormErrors {
    return {
      title: values.title.trim() ? undefined : "This field is required",
      targetDate: values.targetDate ? undefined : "This field is required",
      department: values.department ? undefined : "This field is required",
      changeOwner: values.changeOwner ? undefined : "This field is required",
      changeType: values.changeType ? undefined : "This field is required",
      classification: values.classification ? undefined : "This field is required",
      category: values.category ? undefined : "This field is required",
      description: values.description.trim() ? undefined : "This field is required",
    }
  }

  function hasRequiredFieldErrors(nextErrors: FormErrors) {
    return Object.values(nextErrors).some(Boolean)
  }

  function validateRequiredFields() {
    setValidationAttempted(true)
    return getRequiredFieldErrors()
  }

  function buildRecord(status: ChangeControlStatus) {
    const storedRecords = readStoredRecords()
    const nextNumber = initialChangeControlRecords.length + storedRecords.length + 1
    const id = isEdit ? recordId : `CC-2026-${String(nextNumber).padStart(3, "0")}`
    const targetImplementationDate = values.targetDate
      ? format(values.targetDate, "MMM d, yyyy")
      : "-"
    const owner = optionLabel(changeOwnerOptions, values.changeOwner, "Unassigned")
    const department = optionLabel(departmentOptions, values.department, "Unassigned")
    const affectedDepartments =
      editRecord?.affectedDepartments && editRecord.affectedDepartments.length
        ? editRecord.affectedDepartments
        : randomAffectedDepartments(department)
    const departmentAssessments =
      editRecord?.departmentAssessments && editRecord.departmentAssessments.length
        ? editRecord.departmentAssessments
        : status === "Impact Assessment"
          ? pendingAssessmentsFor(affectedDepartments)
          : []

    return {
      ...editRecord,
      key: id.toLowerCase(),
      id,
      title: values.title.trim() || "Untitled Change Control",
      status,
      dateRaised: editRecord?.dateRaised ?? "Sep 16, 2026",
      targetImplementationDate,
      owner,
      affectedDepartments,
      raisedBy: editRecord?.raisedBy ?? "Sarah Johnson",
      department,
      type: optionLabelOrNothing(changeTypeOptions, values.changeType),
      classification: optionLabelOrNothing(classificationOptions, values.classification),
      category: optionLabelOrNothing(categoryOptions, values.category),
      description: values.description.trim() || undefined,
      riskAssessment: values.riskAssessment.trim() || undefined,
      departmentAssessments,
      changeActions: editRecord?.changeActions ?? [],
      auditTrail: [
        ...(editRecord?.auditTrail ?? []),
        {
          actor: "Sarah Johnson",
          timestamp: "Sep 16, 2026 10:30 AM",
          action: isEdit
            ? "Edited Change Control"
            : status === "Draft"
              ? "Saved draft"
              : "Submitted for Impact Assessment",
          ...(status === "Impact Assessment"
            ? { from: "Draft" as const, to: "Impact Assessment" as const }
            : {}),
        },
      ],
    } satisfies ChangeControlRecord
  }

  function saveDraft() {
    const nextErrors = validateRequiredFields()

    if (hasRequiredFieldErrors(nextErrors)) return

    const nextRecord = buildRecord("Draft")
    writeStoredRecord(nextRecord)
    router.push(`/prototype/accura/change-control/${nextRecord.id}`)
  }

  function submitForImpactAssessment() {
    const nextErrors = validateRequiredFields()

    if (hasRequiredFieldErrors(nextErrors)) return

    writeStoredRecord(buildRecord("Impact Assessment"))
    router.push("/prototype/accura/change-control")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)]">
        <AppSidebar />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ChangeControlHeader
            mobileNavigationOpen={mobileNavOpen}
            onMobileNavigationToggle={() => setMobileNavOpen((open) => !open)}
          />

          {mobileNavOpen && (
            <div className="border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)] p-[var(--spacing-component-md)] lg:hidden">
              <AppNavItems />
            </div>
          )}

          <div className="flex min-h-0 flex-1 overflow-y-auto p-[var(--spacing-component-lg)] lg:p-[var(--spacing-component-xl)]">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-[var(--spacing-layout-sm)]">
              <div className="flex flex-col gap-[var(--spacing-component-sm)]">
                <Button
                  asChild
                  variant="link"
                  className="h-auto w-fit p-0 text-sm no-underline hover:no-underline"
                >
                  <Link href="/prototype/accura/change-control">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Change Controls
                  </Link>
                </Button>
                <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                  <h1 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">
                    {isEdit ? "Edit Change Control" : "New Change Control"}
                  </h1>
                  <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                    {isEdit
                      ? `${recordId} is editable while the record remains in an active workflow state. Save progress to keep the current status, or submit when the change is ready for the next workflow step.`
                      : "The Change Control ID, Status, Date Raised and Raised By are generated automatically. You can save at any time; a partially completed record is kept as a draft. On submission, every department is notified to declare whether it is impacted."}
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Change Control Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-[var(--spacing-component-lg)] md:grid-cols-2">
                  <div className="flex flex-col gap-[var(--spacing-component-xs)] md:col-span-2">
                    <Label
                      required
                      htmlFor="change-title"
                      state={errors.title ? "invalid" : "default"}
                    >
                      Title
                    </Label>
                    <Input
                      id="change-title"
                      placeholder="Enter title"
                      value={values.title}
                      onChange={(event) => updateValue("title", event.target.value)}
                      aria-invalid={invalidAttr(errors.title)}
                    />
                    {errors.title && <FieldError>{errors.title}</FieldError>}
                  </div>

                  <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                    <Label
                      required
                      htmlFor="target-date"
                      state={errors.targetDate ? "invalid" : "default"}
                    >
                      Target implementation date
                    </Label>
                    <DatePicker
                      id="target-date"
                      type="input"
                      placeholder="Select date"
                      value={values.targetDate}
                      onChange={(value) =>
                        updateValue(
                          "targetDate",
                          value instanceof Date ? value : undefined
                        )
                      }
                      className={errors.targetDate ? "[&_button]:border-[var(--color-border-error)] [&_button]:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-border-error)_20%,transparent)]" : undefined}
                    />
                    {errors.targetDate && <FieldError>{errors.targetDate}</FieldError>}
                  </div>

                  <SelectField
                    id="department"
                    label="Department"
                    placeholder="Select department"
                    options={departmentOptions}
                    value={values.department}
                    onValueChange={(value) => updateValue("department", value)}
                    error={errors.department}
                  />

                  <div className="flex flex-col gap-[var(--spacing-component-xs)] md:col-span-2">
                    <Label
                      required
                      htmlFor="change-owner"
                      state={errors.changeOwner ? "invalid" : "default"}
                    >
                      Change owner
                    </Label>
                    <Select
                      value={values.changeOwner}
                      onValueChange={(value) => updateValue("changeOwner", value)}
                    >
                      <SelectTrigger
                        id="change-owner"
                        aria-label="Change owner"
                        aria-invalid={invalidAttr(errors.changeOwner)}
                      >
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {changeOwnerOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center gap-[var(--spacing-component-sm)]">
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-xs font-medium text-[var(--color-surface-muted-foreground)]">
                                {option.fallback}
                              </span>
                              <span>{option.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.changeOwner && <FieldError>{errors.changeOwner}</FieldError>}
                    <p className="text-sm leading-5 text-[var(--color-text-secondary)]">
                      The Change Owner owns the Change Control end-to-end.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-[var(--spacing-component-lg)] md:col-span-2 md:grid-cols-3">
                    <SelectField
                      id="change-type"
                      label="Change control type"
                      placeholder="Select type"
                      options={changeTypeOptions}
                      value={values.changeType}
                      onValueChange={(value) => updateValue("changeType", value)}
                      error={errors.changeType}
                    />

                    <SelectField
                      id="classification"
                      label="Classification"
                      placeholder="Select classification"
                      options={classificationOptions}
                      value={values.classification}
                      onValueChange={(value) => updateValue("classification", value)}
                      error={errors.classification}
                    />

                    <SelectField
                      id="category"
                      label="Category"
                      placeholder="Select category"
                      options={categoryOptions}
                      value={values.category}
                      onValueChange={(value) => updateValue("category", value)}
                      error={errors.category}
                    />
                  </div>

                  <div className="flex flex-col gap-[var(--spacing-component-xs)] md:col-span-2">
                    <Label
                      required
                      htmlFor="description"
                      state={errors.description ? "invalid" : "default"}
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      className="min-h-[80px]"
                      placeholder="Describe the proposed change and the reason for it..."
                      value={values.description}
                      onChange={(event) =>
                        updateValue("description", event.target.value)
                      }
                      aria-invalid={invalidAttr(errors.description)}
                    />
                    {errors.description && <FieldError>{errors.description}</FieldError>}
                  </div>

                  <div className="flex flex-col gap-[var(--spacing-component-xs)] md:col-span-2">
                    <Label htmlFor="risk-assessment">
                      Risk assessment
                    </Label>
                    <Textarea
                      id="risk-assessment"
                      className="min-h-[80px]"
                      placeholder="Assess the risks associated with this change and any mitigations..."
                      value={values.riskAssessment}
                      onChange={(event) =>
                        updateValue("riskAssessment", event.target.value)
                      }
                    />
                    <p className="text-sm leading-5 text-[var(--color-text-secondary)]">
                      Optionally attach supporting risk assessment documents below
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      aria-hidden="true"
                      tabIndex={-1}
                      className="hidden"
                      onChange={(event) =>
                        setSelectedFiles(
                          Array.from(event.target.files ?? []).map((file) => file.name)
                        )
                      }
                    />
                    <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-fit"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Upload file
                      </Button>
                      {selectedFiles.length > 0 && (
                        <div className="text-sm leading-5 text-[var(--color-text-secondary)]">
                          {selectedFiles.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-component-sm)] pb-[var(--spacing-layout-md)]">
                <Button asChild variant="ghost">
                  <Link href="/prototype/accura/change-control">Cancel</Link>
                </Button>
                <Button variant="outline" onClick={saveDraft}>
                  {isEdit ? "Save Changes" : "Save as Draft"}
                </Button>
                <Button onClick={submitForImpactAssessment}>
                  Submit for Impact Assessment
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
