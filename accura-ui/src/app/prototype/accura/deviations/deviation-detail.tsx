"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Plus, X } from "lucide-react"

import { RecordAuditDrawer } from "@/components/record-audit-drawer"
import { RecordSection } from "@/components/record-workflow"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stepper } from "@/components/ui/stepper"
import { Textarea } from "@/components/ui/textarea"

import {
  auditEvents,
  basePath,
  display,
  displayDate,
  displayId,
  isOverdue,
  lifecycle,
  signatures,
  statusVariants,
  stepIndex,
  visibleBlocks,
  type DeviationRecord,
  type ImpactedProduct,
} from "./mock-data"

/* Deviation detail — spec §4–§6.
 *
 * One accumulating page, not six layouts: each state locks the blocks before
 * it and reveals one more. `visibleBlocks` owns that rule so the screen never
 * decides it inline. */

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
        {label}
      </p>
      <div className="mt-[var(--spacing-component-xs)] text-sm">
        {value || (
          <span className="italic text-[var(--color-text-secondary)]">
            Not provided
          </span>
        )}
      </div>
    </div>
  )
}

function ImpactedProductList({
  rows,
  editable,
  onChange,
}: {
  rows: ImpactedProduct[]
  editable: boolean
  onChange: (rows: ImpactedProduct[]) => void
}) {
  if (!editable) {
    if (!rows.length)
      return (
        <p className="text-sm italic text-[var(--color-text-secondary)]">
          None recorded
        </p>
      )
    return (
      <ul className="space-y-[var(--spacing-component-sm)]">
        {rows.map((row, i) => (
          <li
            key={i}
            className="rounded-[var(--radius-md)] bg-[var(--color-background-muted)] p-[var(--spacing-component-md)] text-sm"
          >
            <p className="font-medium">
              {row.product} · Batch {row.batch}
            </p>
            <p className="text-[var(--color-text-secondary)]">
              {row.description}
            </p>
          </li>
        ))}
      </ul>
    )
  }

  const set = (i: number, patch: Partial<ImpactedProduct>) =>
    onChange(rows.map((row, j) => (i === j ? { ...row, ...patch } : row)))

  return (
    <div className="space-y-[var(--spacing-component-md)]">
      {rows.map((row, i) => (
        <Card key={i} className="bg-[var(--color-background-muted)]">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium">Product {i + 1}</p>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove product ${i + 1}`}
              onClick={() => onChange(rows.filter((_, j) => j !== i))}
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="grid gap-[var(--spacing-component-md)] md:grid-cols-2">
            <div className="space-y-[var(--spacing-component-sm)]">
              <Label htmlFor={`product-${i}`}>Product (id or name)</Label>
              <Input
                id={`product-${i}`}
                value={row.product}
                onChange={(e) => set(i, { product: e.target.value })}
              />
            </div>
            <div className="space-y-[var(--spacing-component-sm)]">
              <Label htmlFor={`batch-${i}`}>Batch number</Label>
              <Input
                id={`batch-${i}`}
                value={row.batch}
                onChange={(e) => set(i, { batch: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-[var(--spacing-component-sm)]">
            <Label htmlFor={`desc-${i}`}>Description</Label>
            <Textarea
              id={`desc-${i}`}
              value={row.description}
              onChange={(e) => set(i, { description: e.target.value })}
            />
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onChange([...rows, { product: "", batch: "", description: "" }])
        }
      >
        <Plus className="size-4" />
        Add Impacted Product
      </Button>
    </div>
  )
}

export function DeviationDetail({ record }: { record: DeviationRecord }) {
  const blocks = visibleBlocks(record)
  const { captured, pending } = signatures(record)
  const overdue = isOverdue(record)
  const closed = record.status === "Approved" || record.status === "Cancelled"

  const [immediateAction, setImmediateAction] = useState(
    record.immediateAction ?? ""
  )
  const [products, setProducts] = useState(record.impactedProducts)

  const editingReview = blocks.editable === "In Review"
  const editingInvestigation = blocks.editable === "Investigation In Progress"

  const steps = lifecycle.map((label) => ({ label }))
  const current =
    stepIndex(record.cancelled?.from ?? record.status) ?? lifecycle.length

  return (
    <>
      <Link
        href={basePath}
        className="mb-[var(--spacing-component-md)] inline-flex items-center gap-[var(--spacing-component-xs)] text-sm font-medium text-[var(--color-brand-primary)] hover:underline"
      >
        <ChevronLeft className="size-4" />
        Back to Deviations
      </Link>

      <div className="mb-[var(--spacing-layout-sm)] flex flex-wrap items-start justify-between gap-[var(--spacing-component-md)]">
        <div className="flex min-w-0 flex-wrap items-center gap-[var(--spacing-component-sm)]">
          <h1 className="text-lg font-semibold">{record.title}</h1>
          <Badge
            shape="pill"
            variant={statusVariants[record.status]}
            className="whitespace-nowrap"
          >
            {record.status}
          </Badge>
        </div>
        <div className="flex shrink-0 items-center gap-[var(--spacing-component-md)]">
          <span className="text-sm text-[var(--color-text-secondary)]">
            {displayId(record)}
          </span>
          <RecordAuditDrawer
            record={displayId(record)}
            events={auditEvents(record)}
          />
        </div>
      </div>

      {record.cancelled && (
        <Alert variant="destructive" className="mb-[var(--spacing-layout-sm)]">
          <AlertTitle>Cancelled by {display(record.cancelled.by)}</AlertTitle>
          <AlertDescription>
            {record.cancelled.reason} Cancelled from {record.cancelled.from}. The
            record stays searchable and read-only; it cannot be reopened.
          </AlertDescription>
        </Alert>
      )}

      {overdue && (
        <Alert className="mb-[var(--spacing-layout-sm)]">
          <AlertTitle>Overdue</AlertTitle>
          <AlertDescription>
            Due {displayDate(record.dueDate)}. The lifecycle status is unchanged
            — this is an escalation flag only.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-[var(--spacing-layout-sm)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-[var(--spacing-component-lg)]">
        <Stepper
          steps={steps}
          currentStep={current}
          aria-label="Deviation lifecycle"
        />
      </div>

      <div className="space-y-[var(--spacing-layout-sm)]">
        <RecordSection title="Incident Details">
          <div className="grid gap-[var(--spacing-component-lg)] md:grid-cols-2 lg:grid-cols-4">
            <Field label="Date raised" value={displayDate(record.dateRaised)} />
            <Field label="Raised by" value={display(record.raisedBy)} />
            <Field label="Due date" value={displayDate(record.dueDate)} />
            <Field label="Department" value={record.department} />
            <Field label="Owner" value={display(record.owner)} />
            <Field label="Classification" value={record.classification} />
            <Field label="Category" value={record.category} />
            <Field label="Severity" value={record.severity} />
            <Field label="Incident type" value={record.incidentType} />
            <Field
              label="Product impacted"
              value={record.productImpacted ? "Yes" : "No"}
            />
          </div>
          <div className="mt-[var(--spacing-component-lg)] grid gap-[var(--spacing-component-lg)]">
            <Field
              label="Reviewers"
              value={
                record.reviewers.length
                  ? record.reviewers.map(display).join(", ")
                  : null
              }
            />
            <Field label="Details" value={record.details} />
          </div>
        </RecordSection>

        {blocks.review && (
          <RecordSection
            title="Review Details"
            description={
              editingReview
                ? "Triage and containment. Record what was done at the time of detection."
                : undefined
            }
          >
            {editingReview ? (
              <div className="space-y-[var(--spacing-component-lg)]">
                <div className="space-y-[var(--spacing-component-sm)]">
                  <Label htmlFor="immediate-action">Immediate action taken</Label>
                  <Textarea
                    id="immediate-action"
                    value={immediateAction}
                    onChange={(e) => setImmediateAction(e.target.value)}
                    placeholder="Describe any immediate containment / correction taken..."
                  />
                </div>
                <div className="space-y-[var(--spacing-component-sm)]">
                  <div className="flex items-center justify-between">
                    <Label>Impacted products</Label>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {products.length}{" "}
                      {products.length === 1 ? "product" : "products"}
                    </span>
                  </div>
                  <ImpactedProductList
                    rows={products}
                    editable
                    onChange={setProducts}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-[var(--spacing-component-lg)]">
                <Field label="Immediate action taken" value={record.immediateAction} />
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                    Impacted products
                  </p>
                  <div className="mt-[var(--spacing-component-sm)]">
                    <ImpactedProductList
                      rows={record.impactedProducts}
                      editable={false}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            )}
          </RecordSection>
        )}

        {blocks.investigation && (
          <>
            <RecordSection title="Risk Analysis">
              {editingInvestigation ? (
                <div className="space-y-[var(--spacing-component-sm)]">
                  <Label htmlFor="risk">Risk analysis</Label>
                  <Textarea
                    id="risk"
                    defaultValue={record.riskAnalysis ?? ""}
                    placeholder="Assess the risk this deviation presents..."
                  />
                </div>
              ) : (
                <Field label="Risk analysis" value={record.riskAnalysis} />
              )}
            </RecordSection>

            <RecordSection title="Investigation Report">
              {editingInvestigation ? (
                <div className="space-y-[var(--spacing-component-lg)]">
                  <div className="space-y-[var(--spacing-component-sm)]">
                    <Label htmlFor="rca">Root cause analysis</Label>
                    <Textarea
                      id="rca"
                      defaultValue={record.rootCauseAnalysis ?? ""}
                      placeholder="5-Why, Fishbone, or narrative..."
                    />
                  </div>
                  <div className="space-y-[var(--spacing-component-sm)]">
                    <Label htmlFor="impact">Impact analysis</Label>
                    <Textarea
                      id="impact"
                      defaultValue={record.impactAnalysis ?? ""}
                      placeholder="Effect on product lots, records and related systems..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-[var(--spacing-component-lg)]">
                  <Field label="Root cause analysis" value={record.rootCauseAnalysis} />
                  <Field label="Impact analysis" value={record.impactAnalysis} />
                </div>
              )}
            </RecordSection>
          </>
        )}

        {blocks.capa && (
          <RecordSection
            title="Associated CAPAs"
            description={
              record.capaRef
                ? undefined
                : "No CAPA linked yet. A justified no-CAPA decision is an equally valid outcome."
            }
          >
            {record.capaRef ? (
              <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-component-md)] rounded-[var(--radius-md)] bg-[var(--color-background-muted)] p-[var(--spacing-component-md)]">
                <div className="min-w-0">
                  <Link
                    href="/prototype/accura/capa"
                    className="text-sm font-medium text-[var(--color-brand-primary)] hover:underline"
                  >
                    {record.capaRef.id}
                  </Link>
                  <p className="text-sm">{record.capaRef.title}</p>
                </div>
                <Badge shape="pill" variant="success" className="whitespace-nowrap">
                  {record.capaRef.status}
                </Badge>
              </div>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/prototype/accura/capa">Link to CAPA module</Link>
              </Button>
            )}
          </RecordSection>
        )}

        {blocks.signatures && (
          <RecordSection
            title="Signatures"
            description="Every signature carries the signer, the time, and what the signature means."
          >
            <ol className="flex flex-col gap-[var(--spacing-component-lg)]">
              {captured.map((signature) => (
                <li key={signature.role + signature.timestamp}>
                  <p className="text-sm font-medium text-[var(--color-surface-default-foreground)]">
                    {signature.role}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {display(signature.by)} ·{" "}
                    {new Date(signature.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-[var(--spacing-component-xs)] text-sm text-[var(--color-text-secondary)]">
                    {signature.statement}
                  </p>
                </li>
              ))}
            </ol>
            {pending.length > 0 && (
              <p className="mt-[var(--spacing-component-lg)] text-sm text-[var(--color-text-secondary)]">
                Owner signed. Awaiting {pending.map(display).join(", ")}.
              </p>
            )}
          </RecordSection>
        )}
      </div>

      {!closed && (
        <div className="mt-[var(--spacing-layout-sm)] flex flex-wrap items-center justify-end gap-[var(--spacing-component-sm)]">
          {record.status === "In Review" && (
            <Button variant="outline">Cancel — invalid or duplicate</Button>
          )}
          <Button>{primaryAction(record)}</Button>
        </div>
      )}
    </>
  )
}

/* Button copy is verbatim from brief §13.9 where it specifies one. */
function primaryAction(record: DeviationRecord) {
  switch (record.status) {
    case "Draft":
      return "Submit for Review"
    case "In Review":
      return "Approve & sign — advance to investigation"
    case "Investigation In Progress":
      return "Complete investigation"
    case "CAPA Pending":
      return "Advance to approval"
    case "In Approval":
      return `Sign as ${display(signatures(record).pending[0] ?? record.owner)}`
    default:
      return "—"
  }
}
