"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { RecordAuditDrawer, type RecordAuditEvent } from "@/components/record-audit-drawer"
import {
  ElectronicSignatureModal,
  PhaseGateStepper,
  RecordSection,
} from "@/components/record-workflow"
import { StateChange } from "@/components/state-change"
import { ListEmptySearch } from "../prototype/accura/list-empty-state"
import { ListSummary } from "../prototype/accura/list-summary"
import { TablePagination, usePagination } from "../prototype/accura/table-pagination"

/* Sample props for the shared patterns, which have no stories. Each renders the
   real component from its real file; only the data is made up. */

const auditEvents: RecordAuditEvent[] = [
  {
    id: "e1",
    timestamp: "2026-09-18T09:12:44Z",
    name: "Tom Bradley",
    role: "Reviewer",
    account: "tom.bradley",
    action: "Status changed",
    record: "CC-2026-001",
    fromStatus: "In Review",
    toStatus: "In Approval",
    meaning: "Reviewed and approved for QA sign-off",
  },
  {
    id: "e2",
    timestamp: "2026-09-17T14:03:10Z",
    name: "Sarah Chen",
    role: "Initiator",
    account: "sarah.chen",
    action: "Change control created",
    record: "CC-2026-001",
  },
]

function SignaturePreview() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Sign and approve</Button>
      <ElectronicSignatureModal
        open={open}
        onOpenChange={setOpen}
        title="Approve change control"
        record="CC-2026-001"
        recordLabel="Change control"
        signer={{ name: "Sarah Chen", role: "QA Approver", account: "sarah.chen" }}
        meaning="I approve this change control"
        onSign={() => setOpen(false)}
      />
    </>
  )
}

function PaginationPreview() {
  const rows = React.useMemo(() => Array.from({ length: 42 }, (_, i) => i), [])
  const p = usePagination(rows)
  // A listing footer is page-wide; at card width it wraps, so it keeps its own width and scrolls.
  return (
    <div className="w-max shrink-0">
      <TablePagination
        page={p.page}
        setPage={p.setPage}
        pageSize={p.pageSize}
        setPageSize={p.setPageSize}
        totalPages={p.totalPages}
        total={p.total}
        noun="change controls"
      />
    </div>
  )
}

export const patternPreviews: Record<string, () => React.ReactNode> = {
  "acc-pat-phase-gate-stepper": () => (
    <div className="w-full">
      <PhaseGateStepper
        steps={[
          { label: "Draft" },
          { label: "In Review" },
          { label: "In Approval" },
          { label: "Approved" },
        ]}
        currentStep={1}
        waitingFor="Waiting for Tom Bradley · Reviewer"
      />
    </div>
  ),
  "acc-pat-record-section": () => (
    <div className="w-full">
      <RecordSection title="Change details" description="What is changing and why">
        <p className="text-sm">Replace the filling line torque sensor with the validated model.</p>
      </RecordSection>
    </div>
  ),
  "acc-pat-electronic-signature": () => <SignaturePreview />,
  "acc-pat-audit-trail": () => <RecordAuditDrawer record="CC-2026-001" events={auditEvents} />,
  "acc-pat-state-change": () => (
    <div className="flex flex-col items-start">
      <StateChange from="In Review" to="In Approval" direction="forward" />
      <StateChange from="In Approval" to="In Review" direction="backward" />
      <StateChange from="Open" to="Cancelled" direction="cancel" />
    </div>
  ),
  "acc-pat-list-summary": () => (
    <div className="w-full">
      <ListSummary showing={3} total={12} noun="change controls" onClear={() => {}} />
    </div>
  ),
  "acc-pat-list-empty-state": () => (
    <div className="w-full">
      <ListEmptySearch noun="change controls" onClear={() => {}} />
    </div>
  ),
  "acc-pat-table-pagination": () => <PaginationPreview />,
}
