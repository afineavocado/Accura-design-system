export const capaStatuses = [
  "Draft",
  "In Review",
  "In Approval",
  "Action in Progress",
  "Final Approval",
  "Close",
] as const

export type CapaStatus = (typeof capaStatuses)[number]
export type CapaBadgeVariant = "default" | "secondary" | "success" | "warning" | "blue" | "violet"

export const capaStatusVariant: Record<CapaStatus, CapaBadgeVariant> = {
  Draft: "secondary",
  "In Review": "warning",
  "In Approval": "blue",
  "Action in Progress": "warning",
  "Final Approval": "violet",
  Close: "success",
}

export const detailSupportedStatuses: readonly CapaStatus[] = [
  "Draft",
  "In Review",
  "In Approval",
]

export type CapaRecord = {
  key: string
  id: string
  title: string
  status: CapaStatus
  statusDetail?: string
  dueDate: string
  owner: string
  ownerTeam: string
  approver: string
  approverTeam: string
  source: string
  sourceId: string
  type: string
  department: string
  raisedBy: string
  dateRaised: string
}

const sharedRecordData = {
  owner: "Sarah Johnson",
  ownerTeam: "QA",
  approver: "Sarah Johnson",
  approverTeam: "QA",
  source: "Risk Assessment",
  sourceId: "RA-2026-0012",
  type: "Corrective Action",
  department: "Manufacturing",
  raisedBy: "auth0|6a7d4c2ce723991a0af...",
  dateRaised: "2026-09-02",
}

export const initialCapaRecords: CapaRecord[] = [
  { key: "0003", id: "CAPA-0003", title: "Draft CAPA", status: "Draft", dueDate: "Oct 1, 2026", ...sharedRecordData },
  { key: "0005", id: "CAPA-0005", title: "Test abc", status: "In Review", dueDate: "Oct 1, 2026", ...sharedRecordData },
  { key: "0006", id: "CAPA-0006", title: "Test abc", status: "In Approval", dueDate: "Oct 1, 2026", ...sharedRecordData },
  { key: "0007", id: "CAPA-0007", title: "Action follow-up", status: "Action in Progress", statusDetail: "1/2", dueDate: "Oct 15, 2026", ...sharedRecordData },
  { key: "0008", id: "CAPA-0008", title: "Final review", status: "Final Approval", dueDate: "Oct 20, 2026", ...sharedRecordData },
  { key: "0009", id: "CAPA-0009", title: "Closed CAPA", status: "Close", dueDate: "Sep 30, 2026", ...sharedRecordData },
]

export const auditRecords = [
  {
    id: "audit-1",
    initials: "SJ",
    user: "Sarah Johnson (QA)",
    timestamp: "2026-09-02 11:15:04 UTC",
    activity: "Created CAPA Draft record from linked RA-2026-0012",
    hash: "SHA256:646nh....4b12",
  },
  {
    id: "audit-2",
    initials: "SJ",
    user: "Sarah Johnson (QA)",
    timestamp: "2026-09-04 09:42:18 UTC",
    activity: "Approved CAPA review with electronic signature",
    hash: "SHA256:82kmp....9f31",
  },
]

export const signerIdentity = {
  fullName: "Sarah Johnson",
  email: "sarah.johnson@accura.one",
  role: "QA Approver",
  timestamp: "2026-09-04 09:42:18 UTC",
}

export function canViewCapaDetail(record: CapaRecord) {
  return detailSupportedStatuses.includes(record.status)
}

export function getCapaRecord(id: string) {
  return initialCapaRecords.find((record) => record.id === id)
}
