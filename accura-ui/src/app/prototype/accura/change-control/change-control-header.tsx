"use client"

import { ApplicationHeader } from "@/components/application-header"

import {
  changeControlWorkflowSteps,
  initialChangeControlRecords,
} from "./mock-data"

export function ChangeControlHeader({
  mobileNavigationOpen,
  onMobileNavigationToggle,
}: {
  mobileNavigationOpen: boolean
  onMobileNavigationToggle: () => void
}) {
  const first = initialChangeControlRecords.find((record) =>
    changeControlWorkflowSteps.some(
      (step) =>
        step.status === record.status &&
        step.status !== "Draft" &&
        step.status !== "Closed"
    )
  )

  return (
    <ApplicationHeader
      title="Change control"
      user={{ name: "Sarah Johnson", role: "QA Approver", initials: "SJ" }}
      initialNotifications={
        first
          ? [
              {
                id: `change-control-${first.id}`,
                module: "Change Control",
                recordId: first.id,
                title: "Awaiting change control review",
                description: `${first.title} is at ${first.status}. Review the current step before the next workflow action.`,
                timestamp: "Demo activity",
                kind: "Action required",
                unread: true,
                href: "/prototype/accura/change-control",
              },
            ]
          : []
      }
      mobileNavigationOpen={mobileNavigationOpen}
      onMobileNavigationToggle={onMobileNavigationToggle}
    />
  )
}
