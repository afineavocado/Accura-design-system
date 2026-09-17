"use client"

import * as React from "react"
import { AlertTriangle, ChevronDown, Check, Download, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { StateChange } from "@/components/state-change"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { historyStatusVariant, type HistoryRecord } from "./mock-data"

function Section({
  label,
  children,
  action,
}: {
  label: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="border-t border-[var(--color-border-default)] pt-[var(--spacing-component-lg)]">
      <div className="mb-[var(--spacing-component-sm)] flex items-center justify-between">
        <h3 className="font-sans text-sm font-medium text-[var(--color-surface-default-foreground)]">
          {label}
        </h3>
        {action}
      </div>
      {children}
    </div>
  )
}

export function HistoryRecordPanel({
  record,
  open,
  onOpenChange,
}: {
  record: HistoryRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [trailOpen, setTrailOpen] = React.useState(true)

  if (!record) return null

  const superseded = record.supersededBy !== null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto sm:max-w-[420px]"
      >
        <SheetHeader className="pb-0">
          <SheetTitle>{record.course}</SheetTitle>
          <SheetDescription>
            {record.assessmentId} · Amit Kothari
          </SheetDescription>
          <div className="pt-[var(--spacing-component-sm)]">
            <Badge
              variant={historyStatusVariant[record.status]}
              shape="pill"
              size="md"
            >
              {record.status}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-[var(--spacing-component-lg)] px-[var(--spacing-component-lg)] pb-[var(--spacing-component-lg)] pt-[var(--spacing-component-lg)]">
          {/* Trained on leads: an acknowledgement not bound to a document
              version evidences nothing. See §20 / Q7. */}
          <Section label="Trained on">
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-[var(--spacing-component-md)]">
              <a
                href="#"
                className="text-sm font-medium text-[var(--color-brand-primary)] hover:underline"
              >
                {record.document}
              </a>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                {record.documentVersion} · {record.documentEffective}
              </p>
              {superseded ? (
                <p className="mt-[var(--spacing-component-sm)] flex items-start gap-[var(--spacing-component-xs-plus)] text-xs text-[var(--color-status-warning-subtle-foreground)]">
                  <AlertTriangle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    Superseded by {record.supersededBy} —{" "}
                    {record.retrainingAssigned
                      ? `retraining assigned ${record.retrainingAssigned}`
                      : "no retraining assigned"}
                  </span>
                </p>
              ) : (
                <p className="mt-[var(--spacing-component-sm)] flex items-center gap-[var(--spacing-component-xs-plus)] text-xs text-[var(--color-status-success-subtle-foreground)]">
                  <Check className="size-3.5 shrink-0" aria-hidden="true" />
                  Still the current version
                </p>
              )}
            </div>
          </Section>

          {/* Dates in a grid: `Completed` against `Due` is the fact being
              checked. A vertical list makes the reader do the comparison. */}
          <Section label="Assessment">
            <Badge variant="secondary" shape="pill" size="md">
              {record.method}
            </Badge>
            {record.score && (
              <span className="ml-2 text-xs text-[var(--color-text-secondary)]">
                {record.score}
              </span>
            )}
            <dl className="mt-[var(--spacing-component-md)] grid grid-cols-2 gap-[var(--spacing-component-md)]">
              {[
                ["Assigned", record.assignedDate],
                ["Due", record.dueDate],
                ["Completed", record.completedDate],
                ["Via role", record.viaRole],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                    {term}
                  </dt>
                  <dd className="text-sm text-[var(--color-surface-default-foreground)]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>

          {record.evidence && (
            <Section label="Evidence">
              <div className="flex items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]">
                <FileText
                  className="size-4 shrink-0 text-[var(--color-icon-muted)]"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <a
                    href="#"
                    className="block truncate text-sm text-[var(--color-brand-primary)] hover:underline"
                  >
                    {record.evidence.filename}
                  </a>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {record.evidence.size} · uploaded {record.evidence.uploaded}
                  </p>
                </div>
              </div>
            </Section>
          )}

          {/* Signatures as a sequence, not a field — self-signed versus
              reviewed becomes visible instead of inferred. */}
          <Section label="Signatures">
            <ol className="flex flex-col gap-[var(--spacing-component-md)]">
              {record.signatures.map((signature) => (
                <li key={signature.name + signature.timestamp}>
                  <p className="text-sm font-medium text-[var(--color-surface-default-foreground)]">
                    {signature.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {signature.meaning} · {signature.timestamp}
                  </p>
                </li>
              ))}
            </ol>
          </Section>

          <Section
            label="Audit trail"
            action={
              <button
                type="button"
                onClick={() => setTrailOpen((value) => !value)}
                aria-expanded={trailOpen}
                className="flex items-center gap-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]"
              >
                {record.auditTrail.length} events
                <ChevronDown
                  className={
                    trailOpen
                      ? "size-3.5 rotate-180 transition-transform"
                      : "size-3.5 transition-transform"
                  }
                  aria-hidden="true"
                />
              </button>
            }
          >
            {trailOpen && (
              <ol className="flex flex-col gap-[var(--spacing-component-lg)]">
                {record.auditTrail.map((event) => (
                  <li key={event.event + event.timestamp}>
                    <p className="text-sm font-medium text-[var(--color-surface-default-foreground)]">
                      {event.actor}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {event.email ? `${event.email} · ` : ""}
                      {event.timestamp}
                    </p>
                    <p className="mt-[var(--spacing-component-xs)] text-sm text-[var(--color-surface-default-foreground)]">
                      {event.event}
                    </p>
                    {event.note && (
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {event.note}
                      </p>
                    )}
                    {event.change && (
                      <StateChange from={event.change.from} to={event.change.to} />
                    )}
                  </li>
                ))}
              </ol>
            )}
          </Section>

          <div className="border-t border-[var(--color-border-default)] pt-[var(--spacing-component-lg)]">
            <Button variant="outline" size="sm" className="w-full">
              <Download className="size-4" />
              Export record
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
