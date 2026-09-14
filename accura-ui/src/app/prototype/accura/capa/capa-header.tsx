"use client"

import { ApplicationHeader } from "@/components/application-header"

import { initialCapaRecords } from "./mock-data"

/* One header definition for the three CAPA pages. Previously each page built
   its own — the same duplication that once left Training invisible from the
   CAPA sidebar. */
export function CapaHeader({
  mobileNavigationOpen,
  onMobileNavigationToggle,
}: {
  mobileNavigationOpen: boolean
  onMobileNavigationToggle: () => void
}) {
  const awaitingApproval = initialCapaRecords.filter((record) =>
    ["In Review", "In Approval", "Final Approval"].includes(record.status)
  )
  const first = awaitingApproval[0]

  return (
    <ApplicationHeader
      user={{ name: "Sarah Johnson", role: "QA Approver", initials: "SJ" }}
      initialNotifications={
        first
          ? [
              {
                id: `capa-${first.id}`,
                module: "CAPA",
                recordId: first.id,
                title: "Awaiting your approval",
                description: `${first.title} is at ${first.status}. You are the approver on this record.`,
                timestamp: "Demo activity",
                kind: "Action required",
                unread: true,
                href: `/prototype/accura/capa/${first.id}`,
              },
            ]
          : []
      }
      mobileNavigationOpen={mobileNavigationOpen}
      onMobileNavigationToggle={onMobileNavigationToggle}
    />
  )
}
