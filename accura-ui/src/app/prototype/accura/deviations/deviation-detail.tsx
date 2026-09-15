"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import { Ban, ChevronLeft, Clock3, Plus, X } from "lucide-react"

import { RecordAuditDrawer } from "@/components/record-audit-drawer"
import { RecordSection } from "@/components/record-workflow"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Item } from "@/components/ui/item"
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

  /* Which state, if any, has something to fill in. Drives the layout, and is
     read by blocks defined below `workspace`, so it must be its own value. */
  const hasWorkspace =
    blocks.editable === "In Review" ||
    blocks.editable === "Investigation In Progress" ||
    blocks.editable === "CAPA Pending"


  const incidentBlock = (
    <RecordSection title="Incident Details">
      <div
        className={
          hasWorkspace
            ? "grid gap-[var(--spacing-component-md)]"
            : "grid gap-[var(--spacing-component-lg)] sm:grid-cols-2 lg:grid-cols-3"
        }
      >
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
                <Field
              label="QA reviewer"
              value={record.qaReviewer ? display(record.qaReviewer) : null}
            />
            <Field label="Details" value={record.details} />
              </div>
            </RecordSection>
  )

  const reviewBlock = (
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
  )

  const investigationBlock = (
    <>
                <RecordSection
              collapsible={blocks.editable !== "Investigation In Progress"}
              defaultOpen={!hasWorkspace}
              title="Risk Analysis"
            >
                  {editingInvestigation ? (
                    <div className="space-y-[var(--spacing-component-sm)]">
                      <Label required htmlFor="risk">Risk analysis</Label>
                      <Textarea
                        id="risk"
                        defaultValue={record.riskAnalysis ?? ""}
                        placeholder="Assess the risk arising from this deviation..."
                      />
                    </div>
                  ) : (
                    <Field label="Risk analysis" value={record.riskAnalysis} />
                  )}
                </RecordSection>

                <RecordSection
              collapsible={blocks.editable !== "Investigation In Progress"}
              defaultOpen={!hasWorkspace}
              title="Investigation Report"
            >
                  {editingInvestigation ? (
                    <div className="space-y-[var(--spacing-component-lg)]">
                      <div className="space-y-[var(--spacing-component-sm)]">
                        <Label required htmlFor="rca">Root cause analysis</Label>
                        <Textarea
                          id="rca"
                          defaultValue={record.rootCauseAnalysis ?? ""}
                          placeholder="Document the root cause analysis..."
                        />
                      </div>
                      <div className="space-y-[var(--spacing-component-sm)]">
                        <Label required htmlFor="impact">Impact analysis</Label>
                        <Textarea
                          id="impact"
                          defaultValue={record.impactAnalysis ?? ""}
                          placeholder="Analyse the impact of the deviation..."
                        />
                      </div>
                      <div className="space-y-[var(--spacing-component-sm)]">
                        <Label>Supporting files</Label>
                        <div>
                          <Button variant="outline" size="sm">
                            <Plus className="size-4" />
                            Attach files
                          </Button>
                        </div>
                      </div>
                      {/* Persists the block without advancing the lifecycle —
                          the same contract as Save impacted products. */}
                      <div>
                        <Button variant="outline" size="sm">
                          Save investigation report
                        </Button>
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
  )

  const capaEditable =
    blocks.editable === "Investigation In Progress" ||
    blocks.editable === "CAPA Pending"

  const capaBlock = (
    <RecordSection
      collapsible={hasWorkspace && !capaEditable}
      defaultOpen={!hasWorkspace}
      title="Associated CAPAs"
      description={
        record.capaRef
          ? undefined
          : "No CAPAs associated yet. Search and select a CAPA (or create a new one) to move this deviation to CAPA Pending."
      }
    >
      <div className="space-y-[var(--spacing-component-lg)]">
        {record.capaRef && (
          <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-component-md)] rounded-[var(--radius-md)] bg-[var(--color-background-muted)] p-[var(--spacing-component-md)]">
            <div className="min-w-0">
              <Link
                href="/prototype/accura/capa"
                className="text-sm font-medium text-[var(--color-brand-primary)] hover:underline"
              >
                {record.capaRef.id}
              </Link>
              <p className="text-sm">{record.capaRef.title}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Associated</p>
            </div>
            <div className="flex shrink-0 items-center gap-[var(--spacing-component-sm)]">
              <Badge
                shape="pill"
                variant={record.capaRef.status === "Completed" ? "success" : "warning"}
                className="whitespace-nowrap"
              >
                {record.capaRef.status}
              </Badge>
              {capaEditable && record.capaRef.status !== "Completed" && (
                <Button variant="ghost" size="sm">
                  Mark completed
                </Button>
              )}
              {capaEditable && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${record.capaRef.id}`}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          </div>
        )}
        {capaEditable && (
          <div className="space-y-[var(--spacing-component-sm)]">
            <Label htmlFor="capa-search">Associate a CAPA</Label>
            <Input id="capa-search" placeholder="Search CAPAs to add..." />
            <p className="text-xs text-[var(--color-text-secondary)]">
              Selecting a CAPA associates it immediately.
            </p>
            {/* Outline, not ghost: this leaves the module and creates a
                record. Ghost is for actions that sit inside a row. */}
            <Button variant="outline" size="sm" asChild>
              <Link href="/prototype/accura/capa">
                <Plus className="size-4" />
                Create new CAPA
              </Link>
            </Button>
          </div>
        )}
      </div>
    </RecordSection>
  )
  const signaturesBlock = (
    <RecordSection collapsible defaultOpen={!hasWorkspace} title="Signatures">
                <ol className="flex flex-col gap-[var(--spacing-component-sm)]">
                  {captured.map((signature) => (
                    <li key={signature.role + signature.timestamp}>
                      <Item
                        variant="outline"
                        type="avatar"
                        avatarFallback={signature.by.initials}
                        title={signature.role}
                        description={
                          <>
                            <span className="block text-xs">
                              {display(signature.by)} ·{" "}
                              {new Date(signature.timestamp).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                            <span className="mt-[var(--spacing-component-xs)] block">
                              {signature.statement}
                            </span>
                          </>
                        }
                      />
                    </li>
                  ))}
                </ol>
                {pending.length > 0 && (
                  <p className="mt-[var(--spacing-component-lg)] text-sm text-[var(--color-text-secondary)]">
                    Owner signed. Awaiting {pending.map(display).join(", ")}.
                  </p>
                )}
              </RecordSection>
  )

  /* The block the current state asks the user to fill in. Draft has none in
     this prototype — the create form is its own screen — and the two closed
     states have none by definition. */
  const workspace = !hasWorkspace ? null : (
    <>
      {blocks.editable === "In Review" && reviewBlock}
      {blocks.editable === "Investigation In Progress" && investigationBlock}
      {capaEditable && capaBlock}
    </>
  )

  /* Whatever the workspace already renders must not repeat in the rail. */
  const inWorkspace = new Set(
    [
      blocks.editable === "In Review" ? "review" : null,
      blocks.editable === "Investigation In Progress" ? "investigation" : null,
      capaEditable ? "capa" : null,
    ].filter(Boolean) as string[]
  )

  /* Every block the record shows, in lifecycle order. Both layouts read from
     this one list so neither can drift from the other. */
  const present = [
    { key: "incident", node: incidentBlock, shown: true },
    { key: "review", node: reviewBlock, shown: blocks.review },
    { key: "investigation", node: investigationBlock, shown: blocks.investigation },
    { key: "capa", node: capaBlock, shown: blocks.capa },
    { key: "signatures", node: signaturesBlock, shown: blocks.signatures },
  ].filter((block) => block.shown)

  const reference = present
    .filter((block) => !inWorkspace.has(block.key))
    .map((block) => <Fragment key={block.key}>{block.node}</Fragment>)

  /* Copy and placement follow the product: two text-style actions on the
     left, the primary on the right (spec §5.7). Reject is a real transition
     there — sending a record back one stage — not a route to Cancelled, which
     is what the briefs describe (spec §12.2). */
  const actionBar = closed ? null : (
    <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
      <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
        {record.status !== "Draft" && (
          <>
            <Button variant="ghost" size="sm">
              Reject — send back one stage
            </Button>
            <Button variant="ghost" size="sm">
              Cancel deviation
            </Button>
          </>
        )}
      </div>
      <Button>{primaryAction(record)}</Button>
    </div>
  )

  /* No workspace means the page is a dossier, so two equal columns rather than
     a 35% rail with nothing to sit beside.

     Membership is assigned, not computed. The left column carries what the
     record IS — the incident, what was done about it, and the CAPA it
     produced — and stays open. The right carries the supporting analysis and
     the signature ledger, which fold. Splitting by height instead would put
     blocks wherever the arithmetic landed them. */
  const dossierColumns = [
    [
      { key: "incident", node: incidentBlock, shown: true },
      { key: "review", node: reviewBlock, shown: blocks.review },
      { key: "capa", node: capaBlock, shown: blocks.capa },
    ],
    [
      { key: "investigation", node: investigationBlock, shown: blocks.investigation },
      { key: "signatures", node: signaturesBlock, shown: blocks.signatures },
    ],
  ].map((column) => column.filter((block) => block.shown))

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
        <Alert
          variant="destructive"
          className="mb-[var(--spacing-layout-sm)] flex-row items-start gap-[var(--spacing-component-md)]"
        >
          <Ban className="mt-px size-4 shrink-0" aria-hidden="true" />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <AlertTitle>Cancelled by {display(record.cancelled.by)}</AlertTitle>
            <AlertDescription>
              {record.cancelled.reason} Cancelled from {record.cancelled.from}.
              The record stays searchable and read-only; it cannot be reopened.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {overdue && (
        <Alert
          variant="warning"
          className="mb-[var(--spacing-layout-sm)] flex-row items-start gap-[var(--spacing-component-md)]"
        >
          <Clock3 className="mt-px size-4 shrink-0" aria-hidden="true" />
          <div className="flex flex-col gap-[var(--spacing-component-xxs)]">
            <AlertTitle>Overdue</AlertTitle>
            <AlertDescription>
              Due {displayDate(record.dueDate)}. The lifecycle status is
              unchanged; this is an escalation flag only.
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="mb-[var(--spacing-layout-sm)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-[var(--spacing-component-lg)]">
        <Stepper
          steps={steps}
          currentStep={current}
          aria-label="Deviation lifecycle"
        />
      </div>

      {/* Layout follows the work, not the record shape. While a state has
          something to fill in, that block takes the main column and everything
          already locked sits in a reference rail beside it. Once the record is
          read-only there is no workspace, so the blocks run down two equal
          columns instead — a 35% rail with nothing to flank is just a narrow
          column of dossier. */}
      {workspace ? (
        <div className="grid gap-[var(--spacing-layout-sm)] lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:items-start">
          <div className="space-y-[var(--spacing-layout-sm)]">{workspace}</div>
          <aside className="space-y-[var(--spacing-layout-sm)] lg:sticky lg:top-0">
            {reference}
          </aside>
        </div>
      ) : (
        <div className="grid gap-[var(--spacing-layout-sm)] lg:grid-cols-2 lg:items-start">
          {dossierColumns.map((column, i) => (
            <div key={i} className="space-y-[var(--spacing-layout-sm)]">
              {column.map((block) => (
                <Fragment key={block.key}>{block.node}</Fragment>
              ))}
              {i === 1 && actionBar}
            </div>
          ))}
        </div>
      )}

      {/* In the dossier layout the action belongs to the Signatures block it
          acts on, so it sits at the foot of that column. Left where it was, it
          hung 181px below the card because the grid is as tall as its tallest
          column. */}
      {workspace && !closed && (
        <div className="mt-[var(--spacing-layout-sm)]">{actionBar}</div>
      )}
    </>
  )
}

/* Button copy is verbatim from brief §13.9 where it specifies one. */
function primaryAction(record: DeviationRecord): string {
  switch (record.status) {
    case "Draft":
      return "Submit for Review"
    case "In Review":
      return "Approve & sign — advance to investigation"
    case "Investigation In Progress":
    case "CAPA Pending":
      /* The product labels both of these "Done" rather than naming the
         transition (spec §10.25). */
      return "Done"
    case "In Approval":
      return `Sign as ${display(signatures(record).pending[0] ?? record.owner)}`
    default:
      /* Unreachable: the action bar renders only for open records. */
      return "Open record"
  }
}
