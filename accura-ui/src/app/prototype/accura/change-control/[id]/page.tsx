"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Building,
  Building2,
  CheckCircle2,
  ChevronLeft,
  CornerDownLeft,
  Download,
  FileCheck2,
  FileText,
  List as ListIcon,
  Paperclip,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { ElectronicSignatureModal } from "@/components/record-workflow"
import {
  RecordAuditDrawer,
  type RecordAuditEvent,
} from "@/components/record-audit-drawer"
import type { StateChangeDirection } from "@/components/state-change"
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
import { Stepper } from "@/components/ui/stepper"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AppNavItems, AppSidebar } from "../../app-sidebar"
import { ChangeControlHeader } from "../change-control-header"
import {
  changeControlStatusVariant,
  changeControlStatuses,
  changeControlWorkflowSteps,
  initialChangeControlRecords,
  pendingAssessmentsFor,
  type AuditTrailItem,
  type ChangeAction,
  type ChangeActionComment,
  type ChangeControlRecord,
  type ChangeControlStatus,
  type DepartmentAssessment,
} from "../mock-data"


const storedRecordsKey = "accura-change-control-records"

// Kept in sync with the people/departments already used as real signers
// across the Change Control table's seed records (mock-data.ts) — e.g.
// Michael Chen signs for Production, Sarah Johnson for Quality Assurance,
// and David Lee for Engineering/Facilities/Metrology in every record where
// those departments appear.
const pointOfContactOptions = [
  { value: "michael-chen", label: "Michael Chen - Production", name: "Michael Chen" },
  { value: "sarah-johnson", label: "Sarah Johnson - QA Approver", name: "Sarah Johnson" },
  { value: "david-lee", label: "David Lee - Engineering", name: "David Lee" },
] as const

function defaultPointOfContactFor(department: string) {
  const normalized = department.toLowerCase()
  if (
    normalized.includes("engineering") ||
    normalized.includes("facilities") ||
    normalized.includes("metrology")
  ) {
    return "david-lee"
  }
  if (normalized.includes("quality assurance")) return "sarah-johnson"
  return "michael-chen"
}

type SignedAssessmentState = {
  type: "impacted" | "not-impacted"
  signer: string
  signedAt: string
  assessmentText: string
  actions?: ChangeAction[]
}

type ImpactAssessmentActionState = {
  assessments: DepartmentAssessment[]
  actions: ChangeAction[]
}

type ActionDraft = {
  id: string
  description: string
  owner: string
  dueDate?: Date
  priority: string
}

const statusOrder = new Map(
  changeControlStatuses.map((status, index) => [status, index])
)

function atOrAfter(status: ChangeControlStatus, target: ChangeControlStatus) {
  return (statusOrder.get(status) ?? 0) >= (statusOrder.get(target) ?? 0)
}

function actorFor(record: ChangeControlRecord, to: ChangeControlStatus) {
  return record.auditTrail?.find((item) => item.to === to)?.actor
}

function stepDescription(
  record: ChangeControlRecord,
  status: ChangeControlStatus,
  assessments: DepartmentAssessment[],
  actions: ChangeAction[]
): string {
  switch (status) {
    case "Draft":
      return record.raisedBy ? `Created by ${record.raisedBy}` : "—"
    case "Impact Assessment": {
      const roster = record.departmentAssessments ?? []
      if (!atOrAfter(record.status, "Impact Assessment") || !roster.length) return "—"
      const declared =
        record.status === "Impact Assessment"
          ? assessments.length
          : roster.filter((item) => item.status !== "Pending").length
      return `${declared}/${roster.length} Impact Assessed`
    }
    case "QA Approval": {
      const actor = actorFor(record, "Action in Progress")
      return actor ? `Approved by ${actor}` : "—"
    }
    case "Action in Progress": {
      if (!atOrAfter(record.status, "Action in Progress") || !actions.length) return "—"
      const done = actions.filter((item) => item.status === "Done").length
      return `${done}/${actions.length} Actions Submitted`
    }
    case "Pending Closure": {
      const actor = actorFor(record, "Final QA Approval")
      return actor ? `Submitted by ${actor}` : "—"
    }
    case "Final QA Approval": {
      const actor = actorFor(record, "Closed")
      return actor ? `Approved by ${actor}` : "—"
    }
    case "Closed": {
      const actor = actorFor(record, "Closed")
      return actor ? `Closed by ${actor}` : "—"
    }
    default:
      return "—"
  }
}

/* The trail as the shared drawer wants it. Direction is derived from the
   lifecycle index rather than stored, so a backward move reads as a return
   rather than an approval. Timestamps are already ISO UTC in the seeds, as
   they are in Deviations and Documents. */
function auditEventsFor(record: ChangeControlRecord): RecordAuditEvent[] {
  return visibleAuditTrailItems(record).map((item, index) => ({
    id: `${record.id}-${index}`,
    timestamp: item.timestamp,
    name: item.actor,
    action: item.action,
    record: record.id,
    fromStatus: item.from,
    toStatus: item.to,
  }))
}

function transitionDirectionFor(from: string, to: string): StateChangeDirection {
  const a = changeControlStatuses.indexOf(from as ChangeControlStatus)
  const b = changeControlStatuses.indexOf(to as ChangeControlStatus)
  return a > -1 && b > -1 && b < a ? "backward" : "forward"
}

function visibleAuditTrailItems(record: ChangeControlRecord) {
  const currentStatusIndex = statusOrder.get(record.status) ?? 0

  return (record.auditTrail ?? []).filter((item) => {
    if (!item.from || !item.to) return true

    return (statusOrder.get(item.to) ?? 0) <= currentStatusIndex
  })
}

function priorityDotColor(priority?: string) {
  if (priority === "Critical") return "var(--color-status-danger)"
  if (priority === "High") return "var(--color-status-danger)"
  if (priority === "Medium") return "var(--color-status-warning)"
  return "var(--color-status-success)"
}

function actionOwnerName(owner: string) {
  const ownerLabels: Record<string, string> = {
    "lisa-chen": "Lisa Chen",
    "michael-chen": "Michael Chen",
    "sarah-johnson": "Sarah Johnson",
  }

  return ownerLabels[owner] ?? owner
}

function formatActionDueDate(date?: Date) {
  if (!date) return "-"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function actionPriority(priority: string): ChangeAction["priority"] {
  if (
    priority === "Low" ||
    priority === "Medium" ||
    priority === "High" ||
    priority === "Critical"
  ) {
    return priority
  }

  return "Medium"
}

function formatActionCount(count: number) {
  return `${count} ${count === 1 ? "action" : "actions"}`
}

function PriorityBadge({ priority }: { priority?: string }) {
  return (
    <span className="inline-flex h-5 w-fit items-center gap-[var(--spacing-component-xs-plus)] rounded-full border border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-sm)] text-xs font-medium leading-none text-[var(--color-background-default-foreground)]">
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: priorityDotColor(priority) }}
      />
      {priority ?? "Medium"}
    </span>
  )
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
  if (typeof window === "undefined") return []

  const records = readStoredRecords()
  const nextRecords = records.some((item) => item.id === record.id)
    ? records.map((item) => (item.id === record.id ? record : item))
    : [record, ...records]

  window.localStorage.setItem(storedRecordsKey, JSON.stringify(nextRecords))
  return nextRecords
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium uppercase leading-3 text-[var(--color-text-tertiary)]">
        {label}
      </div>
      <div
        className="mt-[6px] text-sm leading-normal text-[var(--color-background-default-foreground)]"
        title={value}
      >
        {value}
      </div>
    </div>
  )
}

function SectionHeader({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    /* `surface/brand/subtle`, not `status/success/subtle`: the same hex, but a
       name that means "a brand-tinted surface" rather than "this succeeded".
       The token was added for this on 2026-09-17. */
    <div className={`flex ${description ? "items-start" : "items-center"} gap-[var(--spacing-component-lg)] border-b border-[var(--color-border-default)] bg-[var(--color-surface-brand-subtle)] px-[var(--spacing-component-xl)] py-[var(--spacing-component-md)]`}>
      {/* 20px glyph in a 32px tile at radius/sm. It was a 24px glyph in a 40px
          tile at radius/base, which read as a button and set the header's
          height above its own title. radius/md was tried in between and still
          read too round at this size — nothing documents what a small icon
          container should use, so this is a judgement, not a rule. */}
      <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-brand-secondary-hover)] bg-[var(--color-surface-default)] text-[var(--color-icon-brand)]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        {/* CardTitle carries the house heading — 16px semibold, neutral. It
            was link-coloured, on a heading that is not a link. The inner h2
            keeps the document outline, the way Documents writes it. */}
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        {description && (
          <p className="mt-[var(--spacing-component-xs)] max-w-[760px] text-sm leading-normal text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

function SectionCard({
  id,
  icon,
  title,
  description,
  action,
  children,
}: {
  id: string
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card id={id} className="overflow-hidden rounded-[var(--radius-lg)] gap-0 p-0">
      <SectionHeader
        icon={icon}
        title={title}
        description={description}
        action={action}
      />
      <CardContent className="bg-[var(--color-background-default)] p-[var(--spacing-component-lg)]">
        {children}
      </CardContent>
    </Card>
  )
}

function DetailsSection({ record }: { record: ChangeControlRecord }) {
  const detailRows = [
    [
      { label: "RAISED BY", value: record.raisedBy ?? record.owner },
      { label: "DATE RAISED", value: record.dateRaised },
      {
        label: "TARGET IMPLEMENT DATE",
        value: record.targetImplementationDate,
      },
      { label: "ORIGINAL DEPARTMENT", value: record.department ?? "—" },
    ],
    [
      { label: "OWNER", value: record.owner },
      { label: "TYPE", value: record.type ?? "—" },
      { label: "CLASSIFICATION", value: record.classification ?? "—" },
      { label: "CATEGORY", value: record.category ?? "—" },
    ],
  ]

  const fullWidthDetails = [
    { label: "TITLE", value: record.title },
    { label: "DESCRIPTION", value: record.description ?? "—" },
    { label: "RISK ASSESSMENT", value: record.riskAssessment ?? "—" },
  ]

  return (
    <SectionCard
      id="details"
      icon={<FileText className="size-5" />}
      title="Details"
      action={
        record.status === "Draft" ? (
          /* Outline, not ghost: a ghost button is invisible until hovered, and
             on the tinted header band its hover fill (#f4f4f5 grey) blooms
             against the green. Outline is what Deviations and Documents use
             for an action inside a card header. */
          <Button asChild variant="outline" size="sm">
            <Link
              href={`/prototype/accura/change-control/new?mode=edit&id=${encodeURIComponent(record.id)}`}
            >
              <Pencil className="size-4" />
              Edit Details
            </Link>
          </Button>
        ) : null
      }
    >
      <div className="flex flex-col gap-[var(--spacing-component-xl)]">
        {detailRows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {row.map((field) => (
              <DetailField
                key={field.label}
                label={field.label}
                value={field.value}
              />
            ))}
          </div>
        ))}

        {fullWidthDetails.map((field) => (
          <DetailField
            key={field.label}
            label={field.label}
            value={field.value}
          />
        ))}
      </div>
    </SectionCard>
  )
}

const changeControlSigner = {
  name: "Sarah Johnson",
  role: "QA Approver",
  account: "sarah.johnson@accura.one",
}

/* Every signature in this module goes through the shared 21 CFR Part 11 modal.
   Six bespoke dialogs used to carry their own identity block, credential field
   and attestation sentence — six copies of regulated wording with nothing
   governing them, and none carrying the Part 11 title or the demo-credential
   warning. These wrappers keep each gate's copy and hand the rest to the
   shared component. */
function ChangeControlSignature({
  open,
  onOpenChange,
  recordId,
  title,
  meaning,
  actionLabel,
  reasonLabel,
  reasonRequired,
  onSigned,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  recordId: string
  title: string
  meaning: string
  actionLabel: string
  reasonLabel: string
  reasonRequired: boolean
  onSigned: (reason: string) => void
}) {
  return (
    <ElectronicSignatureModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      record={recordId}
      recordLabel="Change control"
      attestationSubject="change control"
      signer={changeControlSigner}
      meaning={meaning}
      actionLabel={actionLabel}
      reasonLabel={reasonLabel}
      reasonRequired={reasonRequired}
      reasonPlaceholder="Add a comment"
      onSign={(receipt) => onSigned(receipt.reason ?? "")}
    />
  )
}

function DepartmentSignatureDialog({
  open,
  onOpenChange,
  recordId,
  department,
  type,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  recordId: string
  department: string
  type: "impacted" | "not-impacted"
  onConfirm: (values: { reason?: string; note?: string }) => void
}) {
  const isNotImpacted = type === "not-impacted"

  return (
    <ChangeControlSignature
      open={open}
      onOpenChange={onOpenChange}
      recordId={recordId}
      title={
        isNotImpacted
          ? `Declare not impacted for ${department}`
          : `Sign impact assessment for ${department}`
      }
      meaning={isNotImpacted ? "Declare not impacted" : "Sign impact assessment"}
      actionLabel={
        isNotImpacted ? "Sign & Confirm Not Impacted" : "Sign & Confirm Impacted"
      }
      reasonLabel={
        isNotImpacted ? "Reason not impacted" : "Additional note (optional)"
      }
      reasonRequired={isNotImpacted}
      onSigned={(reason) =>
        onConfirm(isNotImpacted ? { reason } : { note: reason })
      }
    />
  )
}

function SignedDepartmentCard({
  department,
  type,
  signer,
  signedAt,
  assessmentText,
  actionCount,
}: {
  department: string
  type: "impacted" | "not-impacted"
  signer: string
  signedAt: string
  assessmentText: string
  actionCount?: number
}) {
  const isImpacted = type === "impacted"

  return (
    <Card className="gap-[var(--spacing-component-sm)]">
      <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
        <Building className="size-5 shrink-0 text-[var(--color-icon-muted)]" />
        {/* Sentence case, and no "Department" suffix — the section is already
            titled Affected Departments, and uppercase at 14px shouts. */}
        <span className="min-w-0 text-[15px] font-medium leading-snug text-[var(--color-background-default-foreground)]">
          {department}
        </span>
        {/* The four statuses are Pending · Impacted · Not Impacted · Signed.
            This badge used to read "Approved" for an impacted department, a
            word the UI invented that claims more than what happened: the
            department declared an impact and signed its assessment, it did not
            approve the change. Impacted is also not a success, so no green. */}
        {/* Option B: opposite weights. These were `secondary` and `outline` —
            a #f4f4f5 fill against a transparent one, same border, same text,
            indistinguishable at a glance. */}
        <Badge variant={isImpacted ? "blue" : "dashed"} shape="pill" size="md">
          {isImpacted ? "Impacted" : "Not impacted"}
        </Badge>
        {isImpacted && !!actionCount && (
          <span className="ml-auto text-xs text-[var(--color-text-secondary)]">
            {formatActionCount(actionCount)}
          </span>
        )}
      </div>

      {/* Who and when on one line, as in the audit trail entry. */}
      <p className="text-xs text-[var(--color-text-secondary)]">
        {signer} · signed {signedAt}
      </p>

      {/* The assessment is what a reviewer reads. It used to sit fifth on a
          wrapped 72px row, behind its own label, and truncate. */}
      {assessmentText.trim() && (
        <p className="text-sm leading-normal text-[var(--color-background-default-foreground)]">
          {assessmentText}
        </p>
      )}
    </Card>
  )
}

function AssessmentCard({
  assessment,
  readOnly,
  recordId,
  signedAssessment,
  onSignedAssessmentChange,
  actionCount,
}: {
  assessment: DepartmentAssessment
  readOnly: boolean
  recordId: string
  /** Actions this department owns. An impacted department with none is the
   *  thing a reviewer needs to catch, so the count is on the card. */
  actionCount?: number
  signedAssessment?: SignedAssessmentState
  onSignedAssessmentChange?: (
    department: string,
    signedAssessment: SignedAssessmentState
  ) => void
}) {
  const createActionDraft = React.useCallback(
    (index: number): ActionDraft => ({
      id: `action-${index}-${Date.now()}`,
      description: "",
      owner: "",
      dueDate: undefined,
      priority: "",
    }),
    []
  )

  const [stage, setStage] = React.useState<
    "default" | "impacted" | "actions" | "not-impacted"
  >(readOnly ? (assessment.impacted ? "actions" : "not-impacted") : "default")
  const [error, setError] = React.useState<
    "missing-action" | "incomplete-action" | null
  >(null)
  const [actionDrafts, setActionDrafts] = React.useState<ActionDraft[]>([])
  const [signatureType, setSignatureType] = React.useState<
    "impacted" | "not-impacted" | null
  >(null)
  const [impactSummary, setImpactSummary] = React.useState(
    readOnly ? (assessment.impactSummary ?? "") : ""
  )
  const [pointOfContact, setPointOfContact] = React.useState<string>(() =>
    defaultPointOfContactFor(assessment.department)
  )
  const pointOfContactName =
    pointOfContactOptions.find((option) => option.value === pointOfContact)
      ?.name ?? pointOfContactOptions[0].name
  const impactedSelected = stage === "impacted" || stage === "actions"
  const notImpactedSelected = stage === "not-impacted"
  const hasDraftAction = actionDrafts.length > 0
  const actionComplete = actionDrafts.every(
    (draft) => draft.description && draft.owner && draft.dueDate && draft.priority
  )
  const statusLabel = readOnly
    ? assessment.status
    : notImpactedSelected
      ? "Not Impacted"
      : "Pending"

  function startImpactedAssessment() {
    setStage("impacted")
    setError(null)
  }

  function markNotImpacted() {
    setError(null)
    setSignatureType("not-impacted")
  }

  function addAction() {
    setStage("actions")
    setError(null)
    setActionDrafts((drafts) => [
      ...drafts,
      createActionDraft(drafts.length + 1),
    ])
  }

  function updateAction(id: string, nextDraft: Partial<ActionDraft>) {
    setActionDrafts((drafts) =>
      drafts.map((draft) =>
        draft.id === id ? { ...draft, ...nextDraft } : draft
      )
    )
    setError(null)
  }

  function removeAction(id: string) {
    setActionDrafts((drafts) => drafts.filter((draft) => draft.id !== id))
    setError(null)
  }

  function saveImpacted() {
    if (stage !== "actions" || !hasDraftAction) {
      setError("missing-action")
      return
    }

    if (!actionComplete) {
      setStage("actions")
      setError("incomplete-action")
      return
    }

    setError(null)
    setSignatureType("impacted")
  }

  function saveNotImpacted() {
    setError(null)
    setSignatureType("not-impacted")
  }

  function confirmDepartmentSignature(values: { reason?: string; note?: string }) {
    const type = signatureType ?? "impacted"
    const signedActions =
      type === "impacted"
        ? actionDrafts.map((draft, index) => ({
            id: `${recordId}-${assessment.department}-${index + 1}`,
            department: assessment.department,
            title: draft.description,
            owner: actionOwnerName(draft.owner),
            dueDate: formatActionDueDate(draft.dueDate),
            priority: actionPriority(draft.priority),
            status: "Open" as const,
            evidenceStatus: "Missing" as const,
          }))
        : undefined
    const nextSignedAssessment: SignedAssessmentState = {
      type,
      signer: pointOfContactName,
      signedAt: "Sep 15, 2026",
      assessmentText:
        type === "impacted"
          ? impactSummary.trim() || values.note?.trim() || ""
          : values.reason || "This is the reason",
      actions: signedActions,
    }

    onSignedAssessmentChange?.(assessment.department, nextSignedAssessment)
    setStage(type === "impacted" ? "actions" : "not-impacted")
    setError(null)
  }

  if (signedAssessment) {
    return (
      <SignedDepartmentCard
        department={assessment.department}
        type={signedAssessment.type}
        signer={signedAssessment.signer}
        signedAt={signedAssessment.signedAt}
        assessmentText={signedAssessment.assessmentText}
        actionCount={actionCount}
      />
    )
  }

  if (readOnly && assessment.status !== "Pending") {
    return (
      <SignedDepartmentCard
        department={assessment.department}
        type={assessment.impacted ? "impacted" : "not-impacted"}
        signer={assessment.signer ?? "Sarah Johnson"}
        signedAt="Sep 15, 2026"
        assessmentText={
          assessment.impacted
            ? assessment.impactSummary
            : (assessment.reason ?? "This is the reason")
        }
        actionCount={actionCount}
      />
    )
  }

  return (
    <>
      <Card
        className={[
          "gap-[var(--spacing-component-md)]",
          impactedSelected && !readOnly
            ? "border-[var(--color-border-brand)] bg-[var(--color-background-default)]"
            : "border-[var(--color-border-default)] bg-[var(--color-background-subtle)]",
        ].join(" ")}
      >
      <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-component-md)]">
        <div className="flex min-w-0 items-center gap-[var(--spacing-component-sm)]">
          <Building className="size-5 shrink-0 text-[var(--color-icon-muted)]" />
          <div className="min-w-0 text-[15px] font-medium leading-snug text-[var(--color-background-default-foreground)]">
            {assessment.department}
          </div>
          <Badge
            variant={
              readOnly && assessment.status === "Signed"
                ? "success"
                : notImpactedSelected
                  ? "secondary"
                  : "warning"
            }
            shape="pill"
            size="md"
          >
            {statusLabel}
          </Badge>
        </div>
        {readOnly && assessment.signer && (
          <div className="flex flex-wrap gap-[var(--spacing-component-md)] text-xs text-[var(--color-text-secondary)]">
            <span>Declared by: {assessment.signer}</span>
            <span>Signed: Sep 15, 2026</span>
          </div>
        )}
      </div>

      {(stage === "default" || impactedSelected) && !readOnly && (
        <div className="flex max-w-[280px] flex-col gap-[var(--spacing-component-xs)]">
          <Label>Point of contact</Label>
          <Select value={pointOfContact} onValueChange={setPointOfContact}>
            <SelectTrigger aria-label="Point of contact">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pointOfContactOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {stage === "default" && !readOnly && (
        <div className="flex justify-end gap-[var(--spacing-component-sm)]">
          <Button variant="outline" onClick={markNotImpacted}>
            Not Impacted
          </Button>
          <Button onClick={startImpactedAssessment}>Impacted - Assess</Button>
        </div>
      )}

      {notImpactedSelected && readOnly && (
        <div className="mt-[var(--spacing-component-md)] flex flex-wrap gap-[var(--spacing-component-sm)] text-sm">
          <span className="font-medium text-[var(--color-text-secondary)]">
            Reason not impacted:
          </span>
          <span className="text-[var(--color-background-default-foreground)]">
            {assessment.reason ?? "This department is not impacted by the proposed change."}
          </span>
        </div>
      )}

      {impactedSelected && (
        <div className="flex flex-col gap-[var(--spacing-component-lg)]">
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label>Impact Assessment (optional)</Label>
            <Textarea
              value={readOnly ? assessment.impactSummary : impactSummary}
              onChange={(event) => setImpactSummary(event.target.value)}
              readOnly={readOnly}
              className="min-h-[98px]"
              placeholder="Summarize the impact of the change on this department"
            />
          </div>

          <div className="flex items-center gap-[var(--spacing-component-sm)] text-sm font-medium text-[var(--color-background-default-foreground)]">
            <ListIcon className="size-5 text-[var(--color-icon-muted)]" />
            Change actions
          </div>

          {stage === "actions" && (
            <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
              <Table className="min-w-[920px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10">#</TableHead>
                    <TableHead className="min-w-[260px]">Description</TableHead>
                    <TableHead className="min-w-[190px]">Action Owner</TableHead>
                    <TableHead className="min-w-[180px]">Due Date</TableHead>
                    <TableHead className="min-w-[150px]">Priority</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {readOnly ? (
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>
                        Update controlled procedure and batch record instructions
                      </TableCell>
                      <TableCell>
                        {assessment.signer ?? "Department owner"}
                      </TableCell>
                      <TableCell>Oct 02, 2026</TableCell>
                      <TableCell>
                        <PriorityBadge priority={assessment.priority} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled
                          aria-label="Remove action"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    actionDrafts.map((draft, index) => (
                      <TableRow key={draft.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            value={draft.description}
                            onChange={(event) =>
                              updateAction(draft.id, {
                                description: event.target.value,
                              })
                            }
                            placeholder="e.g Update SOP"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={draft.owner}
                            onValueChange={(owner) =>
                              updateAction(draft.id, { owner })
                            }
                          >
                            <SelectTrigger aria-label={`Action ${index + 1} owner`}>
                              <SelectValue placeholder="Select owner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lisa-chen">Lisa Chen</SelectItem>
                              <SelectItem value="michael-chen">
                                Michael Chen
                              </SelectItem>
                              <SelectItem value="sarah-johnson">
                                Sarah Johnson
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <DatePicker
                            type="input"
                            placeholder="Select date"
                            value={draft.dueDate}
                            onChange={(value) =>
                              updateAction(draft.id, {
                                dueDate: value instanceof Date ? value : undefined,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={draft.priority}
                            onValueChange={(priority) =>
                              updateAction(draft.id, { priority })
                            }
                          >
                            <SelectTrigger
                              aria-label={`Action ${index + 1} priority`}
                            >
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeAction(draft.id)}
                            aria-label={`Remove action ${index + 1}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {error === "missing-action" && (
            <p className="text-sm font-medium leading-none text-[var(--color-text-invalid)]">
              Add at least one change action for this department before signing.
            </p>
          )}

          {error === "incomplete-action" && (
            <p className="text-sm font-medium leading-none text-[var(--color-text-invalid)]">
              Each action needs a description, an action owner and a due date.
            </p>
          )}
        </div>
      )}

      {impactedSelected && !readOnly && (
        <div className="flex flex-wrap justify-between gap-[var(--spacing-component-sm)]">
          <Button variant="outline" onClick={addAction}>
            <Plus className="size-4" />
            Add Action
          </Button>
          <div className="flex gap-[var(--spacing-component-sm)]">
            <Button variant="ghost" onClick={() => setStage("default")}>
              Cancel
            </Button>
            <Button onClick={saveImpacted}>Save & Sign (Impacted)</Button>
          </div>
        </div>
      )}

      {notImpactedSelected && !readOnly && (
        <div className="flex flex-wrap justify-between gap-[var(--spacing-component-sm)]">
          <div className="flex gap-[var(--spacing-component-sm)]">
            <Button variant="ghost" onClick={() => setStage("default")}>
              Cancel
            </Button>
            <Button onClick={saveNotImpacted}>Save & Sign (Not Impacted)</Button>
          </div>
        </div>
      )}
      </Card>

      {signatureType && (
        <DepartmentSignatureDialog
          open={Boolean(signatureType)}
          onOpenChange={(open) => {
            if (!open) setSignatureType(null)
          }}
          recordId={recordId}
          department={assessment.department}
          type={signatureType}
          onConfirm={confirmDepartmentSignature}
        />
      )}
    </>
  )
}

function ImpactAssessmentSection({
  record,
  onDeclarationStatusChange,
  onGeneratedActionsChange,
}: {
  record: ChangeControlRecord
  onDeclarationStatusChange?: (allDepartmentsDeclared: boolean) => void
  onGeneratedActionsChange?: (state: ImpactAssessmentActionState) => void
}) {
  const assessments = record.departmentAssessments ?? []
  const savedActions = record.changeActions ?? []
  const readOnly = record.status !== "Impact Assessment"
  const [signedAssessments, setSignedAssessments] = React.useState<
    Record<string, SignedAssessmentState>
  >(() => signedAssessmentsFromSavedState(assessments, savedActions))
  const declaredDepartmentCount = Object.keys(signedAssessments).length
  const allDepartmentsDeclared =
    record.status === "Impact Assessment" &&
    assessments.length > 0 &&
    assessments.every((assessment) =>
      Boolean(signedAssessments[assessment.department])
    )

  React.useEffect(() => {
    setSignedAssessments(
      signedAssessmentsFromSavedState(
        record.departmentAssessments ?? [],
        record.changeActions ?? []
      )
    )
  }, [record.id, record.status, record.departmentAssessments, record.changeActions])

  React.useEffect(() => {
    onDeclarationStatusChange?.(allDepartmentsDeclared)
  }, [allDepartmentsDeclared, onDeclarationStatusChange])

  React.useEffect(() => {
    const generatedAssessments = assessments.flatMap((assessment) => {
      const signedAssessment = signedAssessments[assessment.department]

      if (!signedAssessment) return []

      return [
        {
          ...assessment,
          impacted: signedAssessment.type === "impacted",
          status:
            signedAssessment.type === "impacted"
              ? ("Signed" as const)
              : ("Not Impacted" as const),
          signer: signedAssessment.signer,
          impactSummary:
            signedAssessment.type === "impacted"
              ? signedAssessment.assessmentText
              : "",
          reason:
            signedAssessment.type === "not-impacted"
              ? signedAssessment.assessmentText
              : assessment.reason,
        },
      ]
    })
    const generatedActions = Object.values(signedAssessments).flatMap(
      (signedAssessment) =>
        signedAssessment.type === "impacted"
          ? (signedAssessment.actions ?? [])
          : []
    )

    onGeneratedActionsChange?.({
      assessments: generatedAssessments,
      actions: generatedActions,
    })
  }, [assessments, onGeneratedActionsChange, signedAssessments])

  function handleSignedAssessmentChange(
    department: string,
    signedAssessment: SignedAssessmentState
  ) {
    setSignedAssessments((current) => ({
      ...current,
      [department]: signedAssessment,
    }))
  }

  return (
    <SectionCard
      id="impact-assessment"
      icon={<Building2 className="size-5" />}
      title="Affected Departments & Impact Assessment"
      description={
        record.status === "Draft"
          ? undefined
          : "On submission, every department is notified. Each department declares whether it is impacted: impacted departments assess the impact, define change actions and sign; not-impacted departments record a reason and sign off."
      }
    >
      <div className="flex flex-col gap-[var(--spacing-component-xl)]">
        {assessments.length ? (
          <>
            <p className="text-sm leading-normal text-[var(--color-background-default-foreground)]">
              {declaredDepartmentCount} of {assessments.length} departments have
              declared.
            </p>
            {assessments.map((assessment) => (
              <AssessmentCard
                key={assessment.department}
                assessment={assessment}
                readOnly={readOnly}
                recordId={record.id}
                signedAssessment={signedAssessments[assessment.department]}
                onSignedAssessmentChange={handleSignedAssessmentChange}
                actionCount={
                  savedActions.filter((action) =>
                    departmentActionMatches(action, assessment)
                  ).length
                }
              />
            ))}
          </>
        ) : (
          <p className="text-sm leading-normal text-[var(--color-background-default-foreground)]">
            Departments are notified to declare their impact once this Change
            Control is submitted for assessment.
          </p>
        )}
      </div>
    </SectionCard>
  )
}

function departmentActionMatches(
  action: ChangeAction,
  assessment: DepartmentAssessment
) {
  if (action.department) return action.department === assessment.department

  return Boolean(assessment.signer && action.owner === assessment.signer)
}

function signedAssessmentsFromSavedState(
  assessments: DepartmentAssessment[],
  actions: ChangeAction[]
) {
  return assessments.reduce<Record<string, SignedAssessmentState>>(
    (signedState, assessment) => {
      if (assessment.status === "Pending") return signedState

      signedState[assessment.department] = {
        type: assessment.impacted ? "impacted" : "not-impacted",
        signer: assessment.signer ?? "Sarah Johnson",
        signedAt: "Sep 15, 2026",
        assessmentText: assessment.impacted
          ? assessment.impactSummary
          : (assessment.reason ?? ""),
        actions: assessment.impacted
          ? actions.filter((action) => departmentActionMatches(action, assessment))
          : undefined,
      }

      return signedState
    },
    {}
  )
}

const actionStatusVariant: Record<ChangeAction["status"], BadgeProps["variant"]> = {
  Open: "secondary",
  "In Progress": "warning",
  Done: "success",
}

function ChangeActionsSection({
  assessments,
  actions,
  recordId,
  useActionCards = false,
}: {
  assessments: DepartmentAssessment[]
  actions: ChangeAction[]
  recordId: string
  useActionCards?: boolean
}) {
  const actionGroups = assessments
    .filter(
      (assessment) =>
        assessment.impacted &&
        assessment.status !== "Pending" &&
        assessment.status !== "Not Impacted"
    )
    .map((assessment) => ({
      assessment,
      actions: actions.filter((action) =>
        departmentActionMatches(action, assessment)
      ),
    }))
    .filter((group) => group.actions.length > 0)

  if (!actionGroups.length) return null

  return (
    <SectionCard
      id="change-actions"
      icon={<ListIcon className="size-5" />}
      title="Change Actions"
      description="Each affected department defines and executes its own actions. Every action has its own status: Draft → In Review → Implementation in Progress → Completed. The Action Owner need not be the Impact Owner."
    >
      <div className="flex flex-col gap-[var(--spacing-component-lg)]">
        {actionGroups.map(({ assessment, actions }) => (
          /* One department block for both states. This section used to render
             a department as a bare uppercase header plus a five-column table
             at QA Approval, and as a bare header plus stacked cards at Action
             in Progress — the same concept drawn two ways, and neither
             matching the department card in the section above. The card and
             its header are now shared; only what sits inside differs, because
             an action in progress carries evidence, comments and a signature
             that no table row can hold. */
          <Card
            key={assessment.department}
            className="gap-[var(--spacing-component-sm)]"
          >
            <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
              <Building className="size-5 shrink-0 text-[var(--color-icon-muted)]" />
              <span className="min-w-0 text-[15px] font-medium leading-snug text-[var(--color-background-default-foreground)]">
                {assessment.department}
              </span>
              <Badge variant="blue" shape="pill" size="md">
                Impacted
              </Badge>
              <span className="ml-auto text-xs text-[var(--color-text-secondary)]">
                {formatActionCount(actions.length)}
                {actions.some((action) => action.status === "Done") &&
                  ` · ${actions.filter((action) => action.status === "Done").length} done`}
              </span>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)]">
              {assessment.signer ?? "Department owner"} · signed Sep 15, 2026
            </p>

            {useActionCards ? (
              <div className="mt-[var(--spacing-component-sm)] flex flex-col gap-[var(--spacing-component-md)]">
                {actions.map((action) => (
                  <ActionExecutionCard
                    key={action.id}
                    action={action}
                    recordId={recordId}
                    onChange={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start gap-[var(--spacing-component-md)] border-t border-[var(--color-border-default)] py-[var(--spacing-component-md)]"
                  >
                    <span className="shrink-0 text-sm font-medium text-[var(--color-brand-primary)]">
                      {action.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
                        <span className="text-sm font-medium text-[var(--color-background-default-foreground)]">
                          {action.title}
                        </span>
                        {/* The data's own words — Open · In Progress · Done.
                            The section description above still narrates a
                            different set (Draft → In Review → Implementation
                            in Progress → Completed); spec §7.15. */}
                        <Badge
                          variant={actionStatusVariant[action.status]}
                          shape="pill"
                          size="md"
                        >
                          {action.status}
                        </Badge>
                        <PriorityBadge priority={action.priority} />
                      </div>
                      <p className="mt-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">
                        {action.owner} · due {action.dueDate}
                        {action.evidenceFiles?.length
                          ? ` · ${action.evidenceFiles.length} file${action.evidenceFiles.length > 1 ? "s" : ""}`
                          : ""}
                        {action.comments?.length
                          ? ` · ${action.comments.length} comment${action.comments.length > 1 ? "s" : ""}`
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </SectionCard>
  )
}

function actionStatusBadge(state: "default" | "filled" | "completed") {
  if (state === "completed") {
    return (
      <Badge variant="success" shape="pill" size="md">
        Completed
      </Badge>
    )
  }

  return (
    <Badge variant="warning" shape="pill" size="md">
      In Review
    </Badge>
  )
}

function ActionExecutionSignatureDialog({
  open,
  onOpenChange,
  recordId,
  actionTitle,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  recordId: string
  actionTitle: string
  onConfirm: (values: { note: string }) => void
}) {
  return (
    <ChangeControlSignature
      open={open}
      onOpenChange={onOpenChange}
      recordId={recordId}
      title={`Complete action: ${actionTitle}`}
      meaning="Complete action"
      actionLabel="Sign & Complete"
      reasonLabel="Completion note"
      reasonRequired
      onSigned={(note) => onConfirm({ note })}
    />
  )
}

function ActionExecutionCard({
  action,
  recordId,
  onChange,
}: {
  action: ChangeAction
  recordId: string
  onChange: (next: ChangeAction) => void
}) {
  const [commentDraft, setCommentDraft] = React.useState("")
  const [signatureOpen, setSignatureOpen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const evidenceFiles = action.evidenceFiles ?? []
  const comments = action.comments ?? []
  const state: "default" | "filled" | "completed" =
    action.status === "Done"
      ? "completed"
      : evidenceFiles.length > 0 || comments.length > 0
        ? "filled"
        : "default"
  const readOnly = state === "completed"

  function addEvidenceFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    const names = Array.from(files).map((file) => file.name)
    onChange({
      ...action,
      evidenceFiles: [...evidenceFiles, ...names],
      evidenceStatus: "Attached",
    })
  }

  function removeEvidenceFile(name: string) {
    const nextFiles = evidenceFiles.filter((file) => file !== name)
    onChange({
      ...action,
      evidenceFiles: nextFiles,
      evidenceStatus: nextFiles.length > 0 ? "Attached" : "Missing",
    })
  }

  function sendComment() {
    if (!commentDraft.trim()) return

    const nextComment: ChangeActionComment = {
      author: "Sarah Johnson",
      timestamp: "Sep 16, 2026 · 12:12 PM",
      text: commentDraft.trim(),
    }
    onChange({ ...action, comments: [...comments, nextComment] })
    setCommentDraft("")
  }

  function handleComposerKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      sendComment()
    }
  }

  function confirmCompletion(values: { note: string }) {
    const completedAt = "Sep 16, 2026 · 12:12 PM"
    const nextComment: ChangeActionComment = {
      author: "Sarah Johnson",
      timestamp: completedAt,
      text: values.note,
    }

    onChange({
      ...action,
      status: "Done",
      completedAt,
      comments: [...comments, nextComment],
    })
  }

  return (
    <Card
      className={[
        "gap-[var(--spacing-component-md)]",
        readOnly
          ? "border-[var(--color-border-default)] bg-[var(--color-background-subtle)]"
          : "border-l-4 border-y border-r border-[var(--color-border-default)] border-l-[var(--color-brand-primary)] bg-[var(--color-background-subtle)]",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-start justify-between gap-[var(--spacing-component-sm)]">
        <div className="flex min-w-0 items-baseline gap-[var(--spacing-component-sm)]">
          <span className="shrink-0 text-sm font-medium text-[var(--color-brand-primary)]">
            {action.id}
          </span>
          <span className="min-w-0 text-sm font-medium leading-normal text-[var(--color-background-default-foreground)]">
            {action.title}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-[var(--spacing-component-xs)]">
          <PriorityBadge priority={action.priority} />
          {actionStatusBadge(state)}
        </div>
      </div>

      {/* One byline. Owner, Due and Completed & Signed each used to carry a
          label the value already implies, and an icon competing with the
          status badge. */}
      <p className="text-xs text-[var(--color-text-secondary)]">
        {action.owner} · due {action.dueDate}
        {action.completedAt && ` · completed ${action.completedAt}`}
      </p>

      <div className="mt-[var(--spacing-component-lg)] flex flex-col gap-[var(--spacing-component-sm)]">
        {evidenceFiles.length > 0 && (
          <div className="flex flex-col gap-[var(--spacing-component-sm)]">
            {evidenceFiles.map((file) => (
              <div
                key={file}
                className="flex items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]"
              >
                <FileCheck2 className="size-4 shrink-0 text-[var(--color-icon-muted)]" />
                <span className="min-w-0 flex-1 truncate text-sm text-[var(--color-background-default-foreground)]">
                  {file}
                </span>
                {readOnly ? (
                  <Download className="size-4 shrink-0 text-[var(--color-icon-muted)]" />
                ) : (
                  <button
                    type="button"
                    aria-label={`Remove ${file}`}
                    onClick={() => removeEvidenceFile(file)}
                    className="shrink-0 text-[var(--color-icon-muted)] hover:text-[var(--color-background-default-foreground)]"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {comments.length > 0 && (
          <div className="flex flex-col gap-[var(--spacing-component-md)] border-l-2 border-[var(--color-border-default)] pl-[var(--spacing-component-md)]">
            {comments.map((comment, commentIndex) => (
              <div key={`${comment.author}-${commentIndex}`}>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {comment.author} · {comment.timestamp}
                </p>
                <p className="mt-[var(--spacing-component-xs)] text-sm leading-normal text-[var(--color-background-default-foreground)]">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {!readOnly && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            aria-hidden="true"
            tabIndex={-1}
            className="hidden"
            onChange={(event) => {
              addEvidenceFiles(event.target.files)
              event.target.value = ""
            }}
          />
          <TooltipProvider>
            <div className="mt-[var(--spacing-component-lg)] flex items-center gap-[var(--spacing-component-sm)] rounded-full border border-[var(--color-border-default)] bg-[var(--color-background-default)] pl-2 pr-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Upload evidence"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex size-7 shrink-0 items-center justify-center text-[var(--color-icon-muted)] hover:text-[var(--color-background-default-foreground)]"
                  >
                    <Plus className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Upload evidences</TooltipContent>
              </Tooltip>
              <input
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder="Upload evidences or leave comments"
                aria-label="Upload evidences or leave comments"
                className="h-8 flex-1 min-w-0 bg-transparent text-sm text-[var(--color-background-default-foreground)] outline-none placeholder:text-[var(--color-text-tertiary)]"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="Send comment"
                    onClick={sendComment}
                    className="flex size-7 shrink-0 items-center justify-center text-[var(--color-icon-muted)] hover:text-[var(--color-background-default-foreground)]"
                  >
                    <CornerDownLeft className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Send</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <Button className="mt-[var(--spacing-component-lg)]" onClick={() => setSignatureOpen(true)}>
            Marked as completed
          </Button>

          <ActionExecutionSignatureDialog
            open={signatureOpen}
            onOpenChange={setSignatureOpen}
            recordId={recordId}
            actionTitle={action.title}
            onConfirm={confirmCompletion}
          />
        </>
      )}
    </Card>
  )
}

function ActionExecutionSection({
  assessments,
  actions,
  recordId,
  onActionsChange,
}: {
  assessments: DepartmentAssessment[]
  actions: ChangeAction[]
  recordId: string
  onActionsChange?: (actions: ChangeAction[]) => void
}) {
  const [actionsState, setActionsState] = React.useState<ChangeAction[]>(actions)

  React.useEffect(() => {
    setActionsState(actions)
  }, [recordId, actions])

  React.useEffect(() => {
    onActionsChange?.(actionsState)
  }, [actionsState, onActionsChange])

  function handleActionChange(nextAction: ChangeAction) {
    setActionsState((current) =>
      current.map((item) => (item.id === nextAction.id ? nextAction : item))
    )
  }

  const actionGroups = assessments
    .filter(
      (assessment) =>
        assessment.impacted &&
        assessment.status !== "Pending" &&
        assessment.status !== "Not Impacted"
    )
    .map((assessment) => ({
      assessment,
      actions: actionsState.filter((action) =>
        departmentActionMatches(action, assessment)
      ),
    }))
    .filter((group) => group.actions.length > 0)

  if (!actionGroups.length) return null

  return (
    <SectionCard
      id="change-actions"
      icon={<ListIcon className="size-5" />}
      title="Change Actions"
      description="Each affected department defines and executes its own actions. Every action has its own status: Draft → In Review → Implementation in Progress → Completed. The Action Owner need not be the Impact Owner."
    >
      <div className="flex flex-col gap-[var(--spacing-component-lg)]">
        {actionGroups.map(({ assessment, actions: groupActions }) => (
          /* Same department block as the read-only state — only the rows
             inside differ, because an action in progress carries evidence,
             comments and a signature. */
          <Card
            key={assessment.department}
            className="gap-[var(--spacing-component-sm)]"
          >
            <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
              <Building className="size-5 shrink-0 text-[var(--color-icon-muted)]" />
              <span className="min-w-0 text-[15px] font-medium leading-snug text-[var(--color-background-default-foreground)]">
                {assessment.department}
              </span>
              <Badge variant="blue" shape="pill" size="md">
                Impacted
              </Badge>
              <span className="ml-auto text-xs text-[var(--color-text-secondary)]">
                {formatActionCount(groupActions.length)}
                {groupActions.some((action) => action.status === "Done") &&
                  ` · ${groupActions.filter((action) => action.status === "Done").length} done`}
              </span>
            </div>

            <div className="flex flex-col gap-[var(--spacing-component-md)]">
              {groupActions.map((action) => (
                <ActionExecutionCard
                  key={action.id}
                  action={action}
                  recordId={recordId}
                  onChange={handleActionChange}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </SectionCard>
  )
}

type EvidenceCardEntry = {
  fileName: string
  department: string
  actionTitle: string
}

function evidenceEntriesFromActions(actions: ChangeAction[]): EvidenceCardEntry[] {
  return actions.flatMap((action) =>
    action.status === "Done"
      ? (action.evidenceFiles ?? []).map((fileName) => ({
          fileName,
          department: action.department ?? "General",
          actionTitle: action.title,
        }))
      : []
  )
}

function EvidenceSection({ actions }: { actions: ChangeAction[] }) {
  const items = evidenceEntriesFromActions(actions)

  if (!items.length) return null

  return (
    <SectionCard
      id="evidence"
      icon={<Paperclip className="size-5" />}
      title="Evidence"
      description="Consolidated view of all evidence attached to Change Actions across departments."
    >
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        {items.map((item, index) => (
          <div
            key={`${item.fileName}-${index}`}
            className="flex items-center justify-between gap-[var(--spacing-component-sm)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] p-[var(--spacing-component-md)]"
          >
            <div className="flex min-w-0 items-start gap-[var(--spacing-component-sm)]">
              <FileCheck2 className="mt-0.5 size-5 shrink-0 text-[var(--color-icon-muted)]" />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-[var(--color-background-default-foreground)]">
                  {item.fileName}
                </div>
                <div className="mt-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">
                  {item.department} department · {item.actionTitle}
                </div>
              </div>
            </div>
            <Download className="size-4 shrink-0 text-[var(--color-icon-muted)]" />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function QaDecisionDialog({
  open,
  onOpenChange,
  record,
  decision,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: ChangeControlRecord
  decision: "approve" | "reject"
  onConfirm: (values: { comment?: string; reason?: string }) => void
}) {
  const isReject = decision === "reject"

  return (
    <ChangeControlSignature
      open={open}
      onOpenChange={onOpenChange}
      recordId={record.id}
      title={
        isReject ? "QA rejection" : "QA approval"
      }
      meaning={isReject ? "Reject change plan" : "Approve change plan"}
      actionLabel={isReject ? "Sign & Reject" : "Sign & Approve"}
      reasonLabel={isReject ? "Reason for rejection" : "Comment (optional)"}
      reasonRequired={isReject}
      onSigned={(text) =>
        onConfirm(isReject ? { reason: text } : { comment: text })
      }
    />
  )
}

function ChangeOwnerSignOffDialog({
  open,
  onOpenChange,
  record,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: ChangeControlRecord
  onConfirm: (values: { note: string }) => void
}) {
  return (
    <ChangeControlSignature
      open={open}
      onOpenChange={onOpenChange}
      recordId={record.id}
      title="Change owner sign-off"
      meaning="Change Owner sign-off"
      actionLabel="Sign & Submit for QA Approval"
      reasonLabel="Sign-off note (optional)"
      reasonRequired={false}
      onSigned={(note) => onConfirm({ note })}
    />
  )
}

function SubmitForQaApprovalDialog({
  open,
  onOpenChange,
  record,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: ChangeControlRecord
  onConfirm: (values: { note: string }) => void
}) {
  return (
    <ChangeControlSignature
      open={open}
      onOpenChange={onOpenChange}
      recordId={record.id}
      title="Submit for QA approval"
      meaning="Submit for QA Approval"
      actionLabel="Sign & Submit for QA Approval"
      reasonLabel="Additional note (optional)"
      reasonRequired={false}
      onSigned={(note) => onConfirm({ note })}
    />
  )
}

function FinalQaDecisionDialog({
  open,
  onOpenChange,
  record,
  decision,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: ChangeControlRecord
  decision: "approve" | "reject"
  onConfirm: (values: { comment?: string; reason?: string }) => void
}) {
  const isReject = decision === "reject"

  return (
    <ChangeControlSignature
      open={open}
      onOpenChange={onOpenChange}
      recordId={record.id}
      title={
        isReject ? "Final QA rejection" : "Final QA approval"
      }
      meaning={
        isReject ? "Reject & return to Pending Closure" : "Final QA Approval"
      }
      actionLabel={isReject ? "Sign & Reject" : "Sign, Approve & Close"}
      reasonLabel={isReject ? "Reason for rejection" : "Comment (optional)"}
      reasonRequired={isReject}
      onSigned={(text) =>
        onConfirm(isReject ? { reason: text } : { comment: text })
      }
    />
  )
}

function ActionBar({
  status,
  onPrimary,
  onQaApprove,
  onQaReject,
  onPendingClosureSignOff,
  onFinalQaApprove,
  onFinalQaReject,
  canSubmitForQa = true,
}: {
  status: ChangeControlStatus
  onPrimary: () => void
  onQaApprove?: () => void
  onQaReject?: () => void
  onPendingClosureSignOff?: () => void
  onFinalQaApprove?: () => void
  onFinalQaReject?: () => void
  canSubmitForQa?: boolean
}) {
  const primaryLabel: Record<ChangeControlStatus, string> = {
    Draft: "Submit for Impact Assessment",
    "Impact Assessment": "Submit for QA Approval",
    "QA Approval": "QA Approve",
    "Action in Progress": "Submit closure package",
    "Pending Closure": "Sign off & Submit for Final QA",
    "Final QA Approval": "Approve and close",
    Closed: "Closed",
  }

  if (status === "Closed") {
    return null
  }

  if (status === "Action in Progress") {
    return null
  }

  if (status === "Impact Assessment" && !canSubmitForQa) {
    return null
  }

  if (status === "QA Approval") {
    return (
      <div className="flex flex-col gap-[var(--spacing-component-md)] pb-[var(--spacing-layout-md)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium leading-none text-[var(--color-background-default-foreground)]">
          Awaiting QA approval of the proposed change actions.
        </p>
        <div className="flex flex-wrap justify-end gap-[var(--spacing-component-sm)]">
          <Button variant="destructiveSecondary" onClick={onQaReject}>
            QA Reject
          </Button>
          <Button onClick={onQaApprove}>QA Approve</Button>
        </div>
      </div>
    )
  }

  if (status === "Pending Closure") {
    return (
      <div className="flex flex-col gap-[var(--spacing-component-md)] pb-[var(--spacing-layout-md)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium leading-none text-[var(--color-background-default-foreground)]">
          All actions are complete. Review, sign off, and submit for final QA
          approval.
        </p>
        <div className="flex flex-wrap justify-end gap-[var(--spacing-component-sm)]">
          <Button onClick={onPendingClosureSignOff}>
            {primaryLabel[status]}
          </Button>
        </div>
      </div>
    )
  }

  if (status === "Final QA Approval") {
    return (
      <div className="flex flex-col gap-[var(--spacing-component-md)] pb-[var(--spacing-layout-md)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium leading-none text-[var(--color-background-default-foreground)]">
          Awaiting final QA approval and closure.
        </p>
        <div className="flex flex-wrap justify-end gap-[var(--spacing-component-sm)]">
          <Button variant="destructiveSecondary" onClick={onFinalQaReject}>
            Reject
          </Button>
          <Button onClick={onFinalQaApprove}>Approve &amp; Close</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-component-sm)] pb-[var(--spacing-layout-md)]">
      <Button asChild variant="ghost">
        <Link href="/prototype/accura/change-control">Cancel</Link>
      </Button>
      {status === "Draft" && <Button variant="outline">Save as Draft</Button>}
      <Button onClick={onPrimary}>{primaryLabel[status]}</Button>
    </div>
  )
}

function ScrollToSectionNav({
  activeSection,
  onSectionClick,
  items,
}: {
  activeSection: string
  onSectionClick: (id: string) => void
  items: Array<{
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }>
}) {
  return (
    <TooltipProvider>
      {/* Hand-rolled on purpose: ButtonGroup groups actions that are
          "mutually independent" (Button-group.md), and this is navigation with
          a current item. Logged in accura-design-patterns.md under the known
          gaps. Container mirrors ButtonGroup's own treatment — radius/md, a
          1px border, separators between children — and the buttons are ghost
          Buttons so focus, hover and disabled come from the system. */}
      <div className="fixed right-0 top-1/2 hidden -translate-y-1/2 overflow-hidden rounded-l-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] lg:flex lg:flex-col">
        {items.map((item, index) => {
          const Icon = item.icon
          const active = activeSection === item.id

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={item.label}
                  aria-pressed={active}
                  onClick={() => onSectionClick(item.id)}
                  className={[
                    "size-10 rounded-none",
                    index < items.length - 1
                      ? "border-b border-[var(--color-border-default)]"
                      : "",
                    active
                      ? "bg-[var(--color-surface-brand-subtle)] text-[var(--color-brand-primary)]"
                      : "text-[var(--color-icon-muted)]",
                  ].join(" ")}
                >
                  <Icon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

export default function ChangeControlDetailPage() {
  const params = useParams<{ id?: string }>()
  const router = useRouter()
  const recordId = decodeURIComponent(params.id ?? "")
  const [storedRecords, setStoredRecords] = React.useState<ChangeControlRecord[]>([])
  const [storedRecordsLoaded, setStoredRecordsLoaded] = React.useState(false)
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const [qaDecision, setQaDecision] = React.useState<"approve" | "reject" | null>(
    null
  )
  const [pendingClosureSignOffOpen, setPendingClosureSignOffOpen] =
    React.useState(false)
  const [submitForQaApprovalOpen, setSubmitForQaApprovalOpen] =
    React.useState(false)
  const [finalQaDecision, setFinalQaDecision] = React.useState<
    "approve" | "reject" | null
  >(null)
  const [activeSection, setActiveSection] = React.useState("details")
  const [impactAssessmentReadyForQa, setImpactAssessmentReadyForQa] =
    React.useState(false)
  const [impactAssessmentActionState, setImpactAssessmentActionState] =
    React.useState<ImpactAssessmentActionState>({
      assessments: [],
      actions: [],
    })
  const [actionExecutionActions, setActionExecutionActions] = React.useState<
    ChangeAction[]
  >([])
  const previousRecordId = React.useRef(recordId)

  React.useEffect(() => {
    setStoredRecords(readStoredRecords())
    setStoredRecordsLoaded(true)
  }, [])

  React.useEffect(() => {
    if (previousRecordId.current === recordId) return
    previousRecordId.current = recordId
    setImpactAssessmentActionState({ assessments: [], actions: [] })
    setActionExecutionActions([])
  }, [recordId])

  const handleGeneratedActionsChange = React.useCallback(
    (state: ImpactAssessmentActionState) => {
      setImpactAssessmentActionState(state)
    },
    []
  )

  const handleActionExecutionChange = React.useCallback(
    (actions: ChangeAction[]) => {
      setActionExecutionActions(actions)
    },
    []
  )

  const record =
    storedRecords.find((item) => item.id === recordId) ??
    initialChangeControlRecords.find((item) => item.id === recordId) ??
    null

  // Self-heals records that reached "Impact Assessment" or later without ever
  // getting Pending assessments generated for their affected departments (e.g.
  // records created before pendingAssessmentsFor() existed) — otherwise Step 2
  // renders zero department cards and falls back to the Draft-only placeholder
  // even though the table already shows a later status.
  React.useEffect(() => {
    if (!record) return
    if (record.status === "Draft") return
    if ((record.departmentAssessments?.length ?? 0) > 0) return
    if ((record.affectedDepartments?.length ?? 0) === 0) return

    const healedRecord = {
      ...record,
      departmentAssessments: pendingAssessmentsFor(record.affectedDepartments),
    }
    const nextRecords = writeStoredRecord(healedRecord)
    setStoredRecords(nextRecords)
  }, [record])

  React.useEffect(() => {
    if (!record || record.status !== "Action in Progress") return
    if (actionExecutionActions.length === 0) return

    const allCompleted = actionExecutionActions.every(
      (action) => action.status === "Done"
    )
    if (!allCompleted) return

    const nextRecord = withAuditTrail(
      {
        ...record,
        status: "Pending Closure",
        changeActions: actionExecutionActions,
      },
      {
        actor: "Sarah Johnson",
        timestamp: "Sep 22, 2026 09:42 AM",
        action: "All change actions completed, moved to Pending Closure",
        from: "Action in Progress",
        to: "Pending Closure",
      }
    )

    persistDetailRecord(nextRecord)
    setActiveSection("details")
  }, [record, actionExecutionActions])

  if (!record) {
    if (!storedRecordsLoaded) {
      return (
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)]">
            <AppSidebar />
            <main className="flex min-h-0 min-w-0 flex-1 flex-col">
              <ChangeControlHeader
                mobileNavigationOpen={mobileNavOpen}
                onMobileNavigationToggle={() => setMobileNavOpen((open) => !open)}
              />
              <section className="flex min-h-0 flex-1 items-center justify-center p-[var(--spacing-component-xl)]">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Loading Change Control...
                </p>
              </section>
            </main>
          </div>
        </SidebarProvider>
      )
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
            <section className="flex min-h-0 flex-1 items-center justify-center p-[var(--spacing-component-xl)]">
              <div className="text-center">
                <h1 className="text-lg font-medium text-[var(--color-background-default-foreground)]">
                  Change Control not found
                </h1>
                <p className="mt-[var(--spacing-component-sm)] text-sm text-[var(--color-text-secondary)]">
                  No record exists for {recordId}.
                </p>
                <Button asChild className="mt-[var(--spacing-component-lg)]">
                  <Link href="/prototype/accura/change-control">
                    Back to Change Controls
                  </Link>
                </Button>
              </div>
            </section>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  const currentRecord =
    record.status !== "Draft" &&
    (record.departmentAssessments?.length ?? 0) === 0 &&
    (record.affectedDepartments?.length ?? 0) > 0
      ? {
          ...record,
          departmentAssessments: pendingAssessmentsFor(record.affectedDepartments),
        }
      : record
  const currentStep =
    changeControlWorkflowSteps.findIndex((step) => step.status === currentRecord.status) + 1

  const generatedImpactAssessmentActions =
    currentRecord.status === "Impact Assessment"
      ? impactAssessmentActionState.actions
      : []
  const visibleChangeActionAssessments =
    currentRecord.status === "Impact Assessment"
      ? impactAssessmentActionState.assessments
      : (currentRecord.departmentAssessments ?? [])
  const visibleChangeActions =
    currentRecord.status === "Impact Assessment"
      ? generatedImpactAssessmentActions
      : currentRecord.status === "Action in Progress"
        ? actionExecutionActions
        : (currentRecord.changeActions ?? [])
  const recordProgressSteps = changeControlWorkflowSteps.map((step) => ({
    label: step.status,
    description: stepDescription(
      currentRecord,
      step.status,
      visibleChangeActionAssessments,
      visibleChangeActions
    ),
  }))
  const showActions =
    atOrAfter(currentRecord.status, "QA Approval") || visibleChangeActions.length > 0
  /* EvidenceSection renders nothing until an action completes with files, so
     deriving the nav item from status alone left the rail's last button
     pointing at an element that does not exist. */
  const showEvidence =
    evidenceEntriesFromActions(visibleChangeActions).length > 0

  const scrollItems = [
    { id: "details", label: "Details", icon: FileText },
    {
      id: "impact-assessment",
      label: "Affected Departments & Impact Assessment",
      icon: Building2,
    },
    ...(showActions
      ? [{ id: "change-actions", label: "Change Actions", icon: ListIcon }]
      : []),
    ...(showEvidence
      ? [{ id: "evidence", label: "Evidence", icon: Paperclip }]
      : []),
  ]

  function handleSectionClick(sectionId: string) {
    setActiveSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  function persistDetailRecord(nextRecord: ChangeControlRecord) {
    const nextRecords = writeStoredRecord(nextRecord)
    setStoredRecords(nextRecords)
    router.replace(`/prototype/accura/change-control/${nextRecord.id}`)
  }

  function withAuditTrail(
    nextRecord: ChangeControlRecord,
    item: AuditTrailItem
  ): ChangeControlRecord {
    return {
      ...nextRecord,
      auditTrail: [item, ...(nextRecord.auditTrail ?? [])],
    }
  }

  function submitForImpactAssessment() {
    const nextRecord = withAuditTrail(
      {
        ...currentRecord,
        status: "Impact Assessment",
        departmentAssessments:
          currentRecord.departmentAssessments &&
          currentRecord.departmentAssessments.length
            ? currentRecord.departmentAssessments
            : pendingAssessmentsFor(currentRecord.affectedDepartments ?? []),
      },
      {
        actor: currentRecord.raisedBy ?? currentRecord.owner,
        timestamp: "Sep 22, 2026 09:42 AM",
        action: "Submitted for Impact Assessment",
        from: "Draft",
        to: "Impact Assessment",
      }
    )

    persistDetailRecord(nextRecord)
    setActiveSection("details")
  }

  function handlePrimaryAction() {
    if (currentRecord.status === "Draft") {
      submitForImpactAssessment()
      return
    }

    setSubmitForQaApprovalOpen(true)
  }

  function submitForQaApproval() {
    const nextRecord = withAuditTrail(
      {
        ...currentRecord,
        status: "QA Approval",
        departmentAssessments:
          impactAssessmentActionState.assessments.length > 0
            ? impactAssessmentActionState.assessments
            : (currentRecord.departmentAssessments ?? []),
        changeActions:
          impactAssessmentActionState.actions.length > 0
            ? impactAssessmentActionState.actions
            : (currentRecord.changeActions ?? []),
      },
      {
        actor: "Sarah Johnson",
        timestamp: "Sep 22, 2026 09:42 AM",
        action: "Submitted for QA Approval",
        from: "Impact Assessment",
        to: "QA Approval",
      }
    )

    persistDetailRecord(nextRecord)
    setActiveSection("details")
  }

  function approveQaPlan(values: { comment?: string }) {
    const nextRecord = withAuditTrail(
      {
        ...currentRecord,
        status: "Action in Progress",
        changeActions: (currentRecord.changeActions ?? []).map((action) => ({
          ...action,
          status: action.status === "Open" ? ("In Progress" as const) : action.status,
        })),
      },
      {
        actor: "Sarah Johnson",
        timestamp: "Sep 22, 2026 09:42 AM",
        action: values.comment
          ? `QA approved change plan: ${values.comment}`
          : "QA approved change plan",
        from: "QA Approval",
        to: "Action in Progress",
      }
    )

    persistDetailRecord(nextRecord)
    setQaDecision(null)
    setActiveSection("details")
  }

  function rejectQaPlan(values: { reason?: string }) {
    const nextRecord = withAuditTrail(
      {
        ...currentRecord,
        status: "Impact Assessment",
      },
      {
        actor: "Sarah Johnson",
        timestamp: "Sep 22, 2026 09:42 AM",
        action: values.reason
          ? `QA rejected change plan: ${values.reason}`
          : "QA rejected change plan",
        from: "QA Approval",
        to: "Impact Assessment",
      }
    )

    persistDetailRecord(nextRecord)
    setQaDecision(null)
    setImpactAssessmentReadyForQa(true)
    setImpactAssessmentActionState({
      assessments: nextRecord.departmentAssessments ?? [],
      actions: nextRecord.changeActions ?? [],
    })
    setActiveSection("impact-assessment")
  }

  function signOffPendingClosure(values: { note: string }) {
    const nextRecord = withAuditTrail(
      {
        ...currentRecord,
        status: "Final QA Approval",
      },
      {
        actor: "Sarah Johnson",
        timestamp: "Sep 22, 2026 09:42 AM",
        action: values.note
          ? `Change Owner signed off and submitted for Final QA Approval: ${values.note}`
          : "Change Owner signed off and submitted for Final QA Approval",
        from: "Pending Closure",
        to: "Final QA Approval",
      }
    )

    persistDetailRecord(nextRecord)
    setPendingClosureSignOffOpen(false)
    setActiveSection("details")
  }

  function approveFinalQa(values: { comment?: string }) {
    const nextRecord = withAuditTrail(
      {
        ...currentRecord,
        status: "Closed",
      },
      {
        actor: "Sarah Johnson",
        timestamp: "Sep 22, 2026 09:42 AM",
        action: values.comment
          ? `Final QA approved and closed: ${values.comment}`
          : "Final QA approved and closed",
        from: "Final QA Approval",
        to: "Closed",
      }
    )

    persistDetailRecord(nextRecord)
    setFinalQaDecision(null)
    setActiveSection("details")
  }

  function rejectFinalQa(values: { reason?: string }) {
    const nextRecord = withAuditTrail(
      {
        ...currentRecord,
        status: "Pending Closure",
      },
      {
        actor: "Sarah Johnson",
        timestamp: "Sep 22, 2026 09:42 AM",
        action: values.reason
          ? `Final QA rejected: ${values.reason}`
          : "Final QA rejected",
        from: "Final QA Approval",
        to: "Pending Closure",
      }
    )

    persistDetailRecord(nextRecord)
    setFinalQaDecision(null)
    setActiveSection("details")
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

          <section className="relative min-h-0 flex-1 overflow-y-auto p-[var(--spacing-component-lg)] lg:p-[var(--spacing-component-xl)]">
            <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-[var(--spacing-layout-sm)]">
              <div className="flex flex-col gap-[var(--spacing-component-sm)]">
                <Button
                  asChild
                  variant="link"
                  className="h-auto w-fit p-0 text-sm no-underline hover:no-underline"
                >
                  <Link href="/prototype/accura/change-control">
                    <ChevronLeft className="size-4" />
                    Back to Change Controls
                  </Link>
                </Button>

                <div className="flex flex-col gap-[var(--spacing-component-md)] sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-[10px]">
                      <span className="text-sm font-medium leading-snug text-[var(--color-text-link)]">
                        {record.id}
                      </span>
                      <Badge
                        variant={changeControlStatusVariant[record.status]}
                        shape="pill"
                        size="sm"
                      >
                        {record.status}
                      </Badge>
                    </div>
                    <h1 className="mt-[var(--spacing-component-xs)] text-xl font-medium leading-7 text-[var(--color-background-default-foreground)]">
                      {record.title}
                    </h1>
                    <p className="mt-[var(--spacing-component-xs)] text-sm leading-normal text-[var(--color-text-secondary)]">
                      Change Owner: {record.owner}
                    </p>
                  </div>

                  <RecordAuditDrawer
                    record={record.id}
                    events={auditEventsFor(record)}
                    transitionDirection={transitionDirectionFor}
                  />
                </div>
              </div>

              <Card className="overflow-x-auto rounded-[var(--radius-lg)] px-[var(--spacing-component-lg)] py-[var(--spacing-component-md)]">
                <Stepper
                  steps={recordProgressSteps}
                  currentStep={currentStep}
                  aria-label="Change Control progress"
                  className="min-w-[900px]"
                />
              </Card>

              <DetailsSection record={record} />
              <ImpactAssessmentSection
                record={record}
                onDeclarationStatusChange={setImpactAssessmentReadyForQa}
                onGeneratedActionsChange={handleGeneratedActionsChange}
              />

              {showActions && record.status === "Action in Progress" && (
                <ActionExecutionSection
                  assessments={visibleChangeActionAssessments}
                  actions={record.changeActions ?? []}
                  recordId={record.id}
                  onActionsChange={handleActionExecutionChange}
                />
              )}
              {showActions && record.status !== "Action in Progress" && (
                <ChangeActionsSection
                  assessments={visibleChangeActionAssessments}
                  actions={visibleChangeActions}
                  recordId={record.id}
                  useActionCards={
                    record.status === "Pending Closure" ||
                    record.status === "Final QA Approval" ||
                    record.status === "Closed"
                  }
                />
              )}

              {showEvidence && <EvidenceSection actions={visibleChangeActions} />}

              {record.status === "Closed" && (
                <div className="flex items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-lg)] border border-[var(--color-border-success)] bg-[var(--color-status-success-subtle)] p-[var(--spacing-component-lg)] text-sm font-medium text-[var(--color-status-success-subtle-foreground)]">
                  <CheckCircle2 className="size-4 shrink-0" />
                  This Change Control is closed.
                </div>
              )}

              {record.status === "Impact Assessment" && (
                <Alert variant="warning">
                  <AlertDescription>
                    Every department declares whether it is impacted, then assesses
                    and signs (or signs off as not impacted). Once all departments
                    have declared and impacted departments have actions, the record
                    moves to QA automatically.
                  </AlertDescription>
                </Alert>
              )}

              {record.status === "Action in Progress" && (
                <Alert variant="warning">
                  <AlertDescription>
                    Implementation is underway. Work the change actions above; the
                    record moves to Pending Closure automatically once every action
                    is completed and verified.
                  </AlertDescription>
                </Alert>
              )}

              <ActionBar
                status={record.status}
                canSubmitForQa={
                  record.status !== "Impact Assessment" ||
                  impactAssessmentReadyForQa
                }
                onPrimary={handlePrimaryAction}
                onQaApprove={() => setQaDecision("approve")}
                onQaReject={() => setQaDecision("reject")}
                onPendingClosureSignOff={() => setPendingClosureSignOffOpen(true)}
                onFinalQaApprove={() => setFinalQaDecision("approve")}
                onFinalQaReject={() => setFinalQaDecision("reject")}
              />
            </div>

            <ScrollToSectionNav
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
              items={scrollItems}
            />
          </section>
        </main>

        {qaDecision && (
          <QaDecisionDialog
            open={Boolean(qaDecision)}
            onOpenChange={(open) => {
              if (!open) setQaDecision(null)
            }}
            record={record}
            decision={qaDecision}
            onConfirm={qaDecision === "approve" ? approveQaPlan : rejectQaPlan}
          />
        )}
        <ChangeOwnerSignOffDialog
          open={pendingClosureSignOffOpen}
          onOpenChange={setPendingClosureSignOffOpen}
          record={record}
          onConfirm={signOffPendingClosure}
        />
        <SubmitForQaApprovalDialog
          open={submitForQaApprovalOpen}
          onOpenChange={setSubmitForQaApprovalOpen}
          record={record}
          onConfirm={() => submitForQaApproval()}
        />
        {finalQaDecision && (
          <FinalQaDecisionDialog
            open={Boolean(finalQaDecision)}
            onOpenChange={(open) => {
              if (!open) setFinalQaDecision(null)
            }}
            record={record}
            decision={finalQaDecision}
            onConfirm={
              finalQaDecision === "approve" ? approveFinalQa : rejectFinalQa
            }
          />
        )}
      </div>
    </SidebarProvider>
  )
}
