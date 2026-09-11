"use client"

import * as React from "react"
import Link from "next/link"
import {
  AtSign,
  Check,
  Clock,
  Eye,
  FileText,
  PenLine,
  Search,
  TriangleAlert,
  User,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

import { TrainingShell, TrainingTabs } from "../training-shell"
import {
  currentUser,
  ownRecordsAwaitingOtherManager,
  rejectionReasons,
  reviewItems,
  type ReviewItem,
} from "../mock-data"

type Decision = "approved" | "rejected"
type Pending = { kind: Decision; ids: string[]; reason?: string }

const stampNow = () =>
  new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC"

function SignerIdentity({ signedAt }: { signedAt: string }) {
  return (
    <div className="grid gap-[var(--spacing-component-lg)] sm:grid-cols-2">
      {[
        { icon: User, label: "Full name", value: currentUser.name },
        { icon: AtSign, label: "Email", value: currentUser.email },
        { icon: PenLine, label: "Role at sign-off", value: currentUser.roleAtSignOff },
        { icon: Clock, label: "Timestamp UTC", value: signedAt },
      ].map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-[var(--spacing-component-sm)]">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-background-muted)]">
            <Icon className="h-4 w-4 text-[var(--color-icon-muted)]" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs text-[var(--color-text-secondary)]">{label}</span>
            <span className="block truncate text-sm text-[var(--color-surface-default-foreground)]">
              {value}
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ReviewQueuePage() {
  const [query, setQuery] = React.useState("")
  const [method, setMethod] = React.useState("all")
  /* Selection is scope and nothing else — it never carries a decision. That
     conflation was the bug: ticking a rejected row turned it into an approval. */
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  /* Which records have actually been looked at. Gates approval, not selection. */
  const [opened, setOpened] = React.useState<Set<string>>(new Set())
  const [decisions, setDecisions] = React.useState<Record<string, Decision>>({})
  const [viewing, setViewing] = React.useState<ReviewItem | null>(null)
  const [rejectingIds, setRejectingIds] = React.useState<string[] | null>(null)
  const [reason, setReason] = React.useState("")
  const [pending, setPending] = React.useState<Pending | null>(null)
  const [attested, setAttested] = React.useState(false)
  const [signedAt, setSignedAt] = React.useState("")

  const methods = React.useMemo(
    () => Array.from(new Set(reviewItems.map((item) => item.method))),
    []
  )

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return reviewItems
      .filter((item) => {
        const matchesQuery =
          !q ||
          [item.name, item.course, item.department].some((v) =>
            v.toLowerCase().includes(q)
          )
        return matchesQuery && (method === "all" || item.method === method)
      })
      /* Oldest first — the longest-waiting record is the biggest risk. */
      .sort((a, b) => b.waitingDays - a.waitingDays)
  }, [query, method])

  const outstanding = visible.filter((item) => !decisions[item.id])
  const selectedItems = outstanding.filter((item) => selected.has(item.id))
  const unopenedSelected = selectedItems.filter((item) => !opened.has(item.id))

  const toggle = (id: string, on: boolean) =>
    setSelected((current) => {
      const next = new Set(current)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })

  const startSigning = (p: Pending) => {
    setAttested(false)
    setSignedAt(stampNow())
    setPending(p)
  }

  const commit = () => {
    if (!pending) return
    setDecisions((current) => {
      const next = { ...current }
      pending.ids.forEach((id) => (next[id] = pending.kind))
      return next
    })
    setSelected(new Set())
    setPending(null)
  }

  return (
    <TrainingShell>
      <TrainingTabs />

      <div className="flex flex-col gap-[var(--spacing-component-sm)] sm:flex-row">
        <div className="relative flex-1 sm:max-w-[340px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people or courses..."
            aria-label="Search the review queue"
            className="pl-9"
          />
        </div>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="sm:w-[180px]" aria-label="Filter by method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All methods</SelectItem>
            {methods.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        {/* Decisions live in the toolbar, on the selection. */}
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-component-md)] border-b border-[var(--color-border-success)] bg-[var(--color-status-success-subtle)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]">
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {selectedItems.length} selected
              </span>
              {/* Approving attests the evidence is satisfactory, so it cannot
                  be done on a record nobody opened. Rejecting can — its causes
                  are often administrative and visible from the row. */}
              {unopenedSelected.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-[var(--color-status-warning-subtle-foreground)]">
                  <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  {unopenedSelected.length} not opened yet — open to approve
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-[var(--spacing-component-sm)]">
              <Button
                variant="destructiveSecondary"
                size="sm"
                onClick={() => {
                  setReason("")
                  setRejectingIds(selectedItems.map((i) => i.id))
                }}
              >
                <X className="h-4 w-4" />
                Reject {selectedItems.length}
              </Button>
              <Button
                size="sm"
                disabled={unopenedSelected.length > 0}
                onClick={() =>
                  startSigning({
                    kind: "approved",
                    ids: selectedItems.map((i) => i.id),
                  })
                }
              >
                <Check className="h-4 w-4" />
                Approve {selectedItems.length}
              </Button>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[44px]">
                <Checkbox
                  aria-label="Select all outstanding"
                  checked={
                    outstanding.length > 0 &&
                    selectedItems.length === outstanding.length
                  }
                  onCheckedChange={(checked) =>
                    setSelected(
                      checked ? new Set(outstanding.map((i) => i.id)) : new Set()
                    )
                  }
                />
              </TableHead>
              <TableHead className="w-[21%]">Person</TableHead>
              <TableHead className="w-[25%]">Assessment</TableHead>
              <TableHead>Waiting</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>
                <span className="sr-only">Record</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((item) => {
              const decision = decisions[item.id]
              const isOpened = opened.has(item.id)
              return (
                <TableRow
                  key={item.id}
                  className={
                    decision === "approved"
                      ? "bg-[var(--color-status-success-subtle)]"
                      : decision === "rejected"
                        ? "bg-[var(--color-status-danger-subtle)]"
                        : selected.has(item.id)
                          ? "bg-[var(--color-background-muted)]"
                          : undefined
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selected.has(item.id)}
                      disabled={!!decision}
                      aria-label={`Select ${item.name}`}
                      onCheckedChange={(c) => toggle(item.id, c === true)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/prototype/accura/training/${item.userId}`}
                      className="font-medium text-[var(--color-brand-primary)] hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="text-xs text-[var(--color-text-secondary)]">
                      {item.department}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{item.course}</div>
                    <div className="mt-[var(--spacing-component-xs)] flex flex-wrap items-center gap-[var(--spacing-component-xs)]">
                      <Badge variant="secondary" shape="pill" size="md">
                        {item.method}
                      </Badge>
                      {item.score && (
                        <span className="text-xs text-[var(--color-status-danger-subtle-foreground)]">
                          {item.score}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="tabular-nums">
                      {item.waitingDays} {item.waitingDays === 1 ? "day" : "days"}
                    </div>
                    <div
                      className={
                        item.overdue
                          ? "text-xs text-[var(--color-status-danger-subtle-foreground)]"
                          : "text-xs text-[var(--color-text-secondary)]"
                      }
                    >
                      due {item.due}
                      {item.overdue && " · overdue"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.evidenceIsFile ? (
                      <span className="inline-flex items-center gap-[var(--spacing-component-xs)]">
                        <FileText
                          className="h-4 w-4 shrink-0 text-[var(--color-icon-muted)]"
                          aria-hidden="true"
                        />
                        <span className="text-[var(--color-text-secondary)]">
                          {item.evidence}
                        </span>
                      </span>
                    ) : (
                      <span className="text-[var(--color-text-secondary)]">
                        {item.evidence}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {decision === "approved" && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-status-success-subtle-foreground)]">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        Approved
                      </span>
                    )}
                    {decision === "rejected" && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-status-danger-subtle-foreground)]">
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                        Rejected
                      </span>
                    )}
                    {!decision &&
                      (isOpened ? (
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          Opened
                        </span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOpened((c) => new Set(c).add(item.id))
                            setViewing(item)
                          }}
                        >
                          Open
                        </Button>
                      ))}
                  </TableCell>
                </TableRow>
              )
            })}
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-[var(--color-text-secondary)]"
                >
                  {reviewItems.length === 0
                    ? "Nothing awaiting your review."
                    : "No records match this search."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-[var(--color-text-secondary)]">
        {ownRecordsAwaitingOtherManager}
        {" of your own records need another manager’s sign-off — "}
        <a href="#" className="text-[var(--color-brand-primary)] hover:underline">
          view
        </a>
      </p>

      {/* Read-only: the record, its evidence, and nothing to click. Decisions
          are made on the selection, not in here. */}
      <Sheet open={viewing !== null} onOpenChange={(v) => !v && setViewing(null)}>
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-[420px]">
          <SheetHeader>
            <SheetTitle>{viewing?.course}</SheetTitle>
            <SheetDescription>
              {viewing?.name} · {viewing?.department}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-[var(--spacing-component-lg)] px-4 py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                Method
              </p>
              <div className="mt-[var(--spacing-component-xxs)] flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
                <Badge variant="secondary" shape="pill" size="md">
                  {viewing?.method}
                </Badge>
                {viewing?.score && (
                  <span className="text-xs text-[var(--color-status-danger-subtle-foreground)]">
                    {viewing.score}
                  </span>
                )}
              </div>
            </div>

            {viewing?.document && (
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                  Trained on
                </p>
                <a href="#" className="text-sm text-[var(--color-brand-primary)] hover:underline">
                  {viewing.document}
                </a>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                Evidence
              </p>
              <div className="mt-[var(--spacing-component-xs)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-[var(--spacing-component-md)]">
                {viewing?.evidenceIsFile ? (
                  <a
                    href="#"
                    className="inline-flex items-center gap-[var(--spacing-component-xs)] text-sm text-[var(--color-brand-primary)] hover:underline"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    {viewing.evidence}
                  </a>
                ) : (
                  <p className="text-sm text-[var(--color-surface-default-foreground)]">
                    {viewing?.evidence}
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                Waiting
              </p>
              <p className="text-sm text-[var(--color-surface-default-foreground)]">
                {viewing?.waitingDays} days · due {viewing?.due}
                {viewing?.overdue && " · overdue"}
              </p>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" className="w-full" onClick={() => setViewing(null)}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* One reason for the batch — a per-record reason would mean one dialog
          per record, which is what selection-first exists to avoid. See Q15. */}
      <Dialog
        open={rejectingIds !== null}
        onOpenChange={(v) => !v && setRejectingIds(null)}
      >
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>
              Reject {rejectingIds?.length}{" "}
              {rejectingIds?.length === 1 ? "record" : "records"}?
            </DialogTitle>
            <DialogDescription>
              They return to the trainees as In progress. The reason is recorded
              on each permanent training history.
            </DialogDescription>
          </DialogHeader>

          <fieldset className="flex flex-col gap-[var(--spacing-component-sm)]">
            <legend className="mb-[var(--spacing-component-sm)] text-sm font-medium text-[var(--color-background-default-foreground)]">
              Reason <span className="text-[var(--color-text-invalid)]">*</span>
            </legend>
            <RadioGroup value={reason} onValueChange={setReason}>
              {rejectionReasons.map((v) => (
                <div key={v} className="flex items-center gap-[var(--spacing-component-sm)]">
                  <RadioGroupItem value={v} id={`reason-${v}`} />
                  <Label htmlFor={`reason-${v}`} className="font-normal">
                    {v}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </fieldset>

          <Textarea
            rows={3}
            placeholder="Add a note for the trainee (optional)"
            aria-label="Note for the trainee"
          />

          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectingIds(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!reason}
              onClick={() => {
                if (rejectingIds)
                  startSigning({ kind: "rejected", ids: rejectingIds, reason })
                setRejectingIds(null)
              }}
            >
              Continue to sign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Both decisions are signed: rejecting changes a record's state and
          writes to a permanent history, exactly as approving does.
          Part 11 §11.200 allows one signature to cover the batch; §11.50
          requires its meaning to be recorded with it. */}
      <Dialog open={pending !== null} onOpenChange={(v) => !v && setPending(null)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Electronic Signature — 21 CFR Part 11</DialogTitle>
            <DialogDescription>
              Verify your identity to sign {pending?.ids.length}{" "}
              {pending?.ids.length === 1 ? "training record" : "training records"}.
            </DialogDescription>
          </DialogHeader>

          <div
            className={
              pending?.kind === "rejected"
                ? "rounded-[var(--radius-md)] border border-[var(--color-border-error)] bg-[var(--color-status-danger-subtle)] p-[var(--spacing-component-md)] text-sm"
                : "rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-[var(--spacing-component-md)] text-sm"
            }
          >
            Meaning:{" "}
            <strong>
              {pending?.kind === "rejected" ? "Reject" : "Approve"}{" "}
              {pending?.ids.length}{" "}
              {pending?.ids.length === 1
                ? "training completion"
                : "training completions"}
            </strong>
            {pending?.reason && <> — {pending.reason}</>}.
          </div>

          <SignerIdentity signedAt={signedAt} />

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="signature-password">
              Re-enter password{" "}
              <span className="text-[var(--color-text-invalid)]">*</span>
            </Label>
            <Input
              id="signature-password"
              type="password"
              autoComplete="off"
              placeholder="Re-enter your password"
            />
          </div>

          <div className="flex items-start gap-[var(--spacing-component-sm)]">
            <Checkbox
              id="attest"
              checked={attested}
              onCheckedChange={(c) => setAttested(c === true)}
            />
            <Label
              htmlFor="attest"
              className="text-sm font-normal leading-snug text-[var(--color-text-secondary)]"
            >
              By entering my credentials, I confirm that this review complies with
              formal requirements as equivalent to my handwritten signature.
            </Label>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button disabled={!attested} onClick={commit}>
              Sign &amp; submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TrainingShell>
  )
}
