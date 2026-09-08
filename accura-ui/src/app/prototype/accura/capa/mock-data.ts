export const capaStatuses = [
  "Close",
  "Action in Progress",
  "In Approval",
  "In Review",
  "Draft",
] as const

export type CapaStatus = (typeof capaStatuses)[number]

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
}

export const initialCapaRecords: CapaRecord[] = [
  { key: "0008", id: "CAPA-0008", title: "test", status: "Close", dueDate: "May 22, 2025", owner: "Sarah Johnson", ownerTeam: "QA", approver: "Emily Zhang", approverTeam: "Regulatory", source: "Risk Assessment", sourceId: "DEV-2026-0089" },
  { key: "0005", id: "CAPA-0005", title: "testv", status: "Action in Progress", statusDetail: "1/3", dueDate: "May 22, 2025", owner: "Sarah Johnson", ownerTeam: "QA", approver: "Emily Zhang", approverTeam: "Regulatory", source: "Risk Assessment", sourceId: "DEV-2026-0089" },
  { key: "0006", id: "CAPA-0006", title: "test", status: "In Approval", dueDate: "May 22, 2025", owner: "Sarah Johnson", ownerTeam: "QA", approver: "Emily Zhang", approverTeam: "Regulatory", source: "Risk Assessment", sourceId: "DEV-2026-0089" },
  { key: "0004-a", id: "CAPA-0004", title: "test", status: "Close", dueDate: "May 22, 2025", owner: "Sarah Johnson", ownerTeam: "QA", approver: "Emily Zhang", approverTeam: "Regulatory", source: "Risk Assessment", sourceId: "DEV-2026-0089" },
  { key: "0004-b", id: "CAPA-0004", title: "test", status: "In Review", dueDate: "May 22, 2025", owner: "Sarah Johnson", ownerTeam: "QA", approver: "Emily Zhang", approverTeam: "Regulatory", source: "Risk Assessment", sourceId: "DEV-2026-0089" },
  { key: "0004-c", id: "CAPA-0004", title: "test", status: "In Review", dueDate: "May 22, 2025", owner: "Sarah Johnson", ownerTeam: "QA", approver: "Emily Zhang", approverTeam: "Regulatory", source: "Risk Assessment", sourceId: "DEV-2026-0089" },
  { key: "0003", id: "CAPA-0003", title: "test", status: "Draft", dueDate: "May 22, 2025", owner: "Sarah Johnson", ownerTeam: "QA", approver: "Emily Zhang", approverTeam: "Regulatory", source: "Risk Assessment", sourceId: "DEV-2026-0089" },
  { key: "0002", id: "CAPA-0002", title: "test", status: "Draft", dueDate: "May 22, 2025", owner: "Sarah Johnson", ownerTeam: "QA", approver: "Emily Zhang", approverTeam: "Regulatory", source: "Risk Assessment", sourceId: "DEV-2026-0089" },
]
