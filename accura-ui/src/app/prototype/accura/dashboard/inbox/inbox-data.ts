import type { BadgeProps } from "@/components/ui/badge"

import { canViewCapaDetail, capaStatusVariant, initialCapaRecords } from "../../capa/mock-data"
import {
  documentHref,
  responsible,
  workflowVariants,
  type DemoDocument,
} from "../../documents/mock-data"
import { prototypeUser } from "../../shell-mock-data"
import { assignedAssessments, trainingUsers, userStatusVariant } from "../../training/mock-data"
import {
  dashboardBase,
  daysUntil,
  healthBadge,
  moduleCards,
  TODAY,
  type Area,
  type Health,
} from "../mock-data"

/* Layout A+ data. Everything the inbox shows is shaped here so the page only
   renders. Derived from module mock data where it exists; placeholders for
   unbuilt modules are kept out of statuses entirely ("Not connected"). */

/* ── Tiles ─────────────────────────────────────────────────────── */

/* Each connected tile links to its module list, pre-filtered to exactly the
   records it counts. The bar is a status breakdown: one segment per status,
   coloured with the owning module's own badge variant. */
export type Segment = { label: string; count: number; variant: BadgeProps["variant"] }

export type Tile = {
  area: Area
  connected: boolean
  health: Health
  /** Headline count and what it counts — the problem, named. */
  attention: number
  attentionLabel: string
  total: number
  totalNoun: string
  segments: Segment[]
  href?: string
}

export function tiles(docs: DemoDocument[]): Tile[] {
  const cards = moduleCards(docs)
  const card = (a: Area) => cards.find((c) => c.area === a)!

  /* Training — user statuses. */
  const trainingSegments: Segment[] = (["Overdue", "Pending", "Up to date"] as const).map((st) => ({
    label: st,
    count: trainingUsers.filter((u) => u.status === st).length,
    variant: userStatusVariant[st],
  }))

  /* CAPA — open records by due window (14 d, spec §2.3.2). */
  const openCapas = initialCapaRecords.filter((c) => c.status !== "Close")
  const capaLate = openCapas.filter((c) => daysUntil(c.dueDate) < 0).length
  const capaSoon = openCapas.filter((c) => {
    const d = daysUntil(c.dueDate)
    return d >= 0 && d <= 14
  }).length
  const capaSegments: Segment[] = [
    { label: "Overdue", count: capaLate, variant: "error" },
    { label: "Due ≤14 days", count: capaSoon, variant: "warning" },
    { label: "Later", count: openCapas.length - capaLate - capaSoon, variant: "success" },
  ]

  /* Documents — workflow stage, Documents' own stage colours. */
  const inWorkflow = docs.filter((d) => d.status !== "Approved")
  const docSegments: Segment[] = (["Draft", "In Review", "In QA Approval"] as const).map((st) => ({
    label: st,
    count: inWorkflow.filter((d) => d.status === st).length,
    variant: workflowVariants[st],
  }))

  const connected: Tile[] = [
    {
      area: "Training",
      connected: true,
      health: card("Training").health,
      attention: trainingSegments[0].count,
      attentionLabel: "overdue",
      total: trainingUsers.length,
      totalNoun: "users",
      segments: trainingSegments,
      href: `${dashboardBase}/training?status=Overdue`,
    },
    {
      area: "CAPA",
      connected: true,
      // RAG uses 7 d, the count 14 d — audit B-01.
      health: card("CAPA").health,
      attention: capaLate + capaSoon,
      attentionLabel: capaLate ? "overdue or due soon" : "due within 14 days",
      total: openCapas.length,
      totalNoun: "open",
      segments: capaSegments,
      href: `${dashboardBase}/capa?due=14d`,
    },
    {
      area: "Documents",
      connected: true,
      health: card("Documents").health,
      attention: docSegments[2].count,
      attentionLabel: "awaiting approval",
      total: inWorkflow.length,
      totalNoun: "in workflow",
      segments: docSegments,
      href: `${dashboardBase}/documents?workflow=${encodeURIComponent("In QA Approval")}`,
    },
  ]
  // Worst first, so the module that needs you leads the row.
  const rank: Record<Health, number> = { red: 0, yellow: 1, green: 2 }
  connected.sort((a, b) => rank[a.health] - rank[b.health])

  /* Unbuilt modules: sample numbers (dashboard mocks), same anatomy, dimmed
     and non-interactive. Their segment colours are neutral picks, since those
     modules have no status maps yet. */
  const notConnected: Tile[] = [
    {
      area: "Non-Conformance",
      connected: false,
      health: card("Non-Conformance").health,
      attention: 1,
      attentionLabel: "critical",
      total: 7,
      totalNoun: "open",
      segments: [
        { label: "Critical", count: 1, variant: "error" },
        { label: "Other", count: 6, variant: "secondary" },
      ],
    },
    {
      area: "Audits",
      connected: false,
      health: card("Audits").health,
      attention: 1,
      attentionLabel: "in the next 30 days",
      total: 3,
      totalNoun: "active",
      segments: [
        { label: "Upcoming", count: 1, variant: "warning" },
        { label: "In progress", count: 2, variant: "blue" },
      ],
    },
    {
      area: "Risks",
      connected: false,
      health: card("Risks").health,
      attention: 2,
      attentionLabel: "reviews due",
      total: 18,
      totalNoun: "active",
      segments: [
        { label: "Review due", count: 2, variant: "warning" },
        { label: "Current", count: 16, variant: "success" },
      ],
    },
  ]
  return [...connected, ...notConnected]
}

export { healthBadge }

/* ── Table rows ────────────────────────────────────────────────── */

export const priorities = ["High", "Medium", "Low"] as const
export type Priority = (typeof priorities)[number]
export const priorityVariant: Record<Priority, BadgeProps["variant"]> = {
  High: "error",
  Medium: "warning",
  Low: "secondary",
}

export type InboxRow = {
  id: string
  record: string
  detail: string
  /** The record's own status, as its module shows it. */
  status: string
  /** Colour from the owning module's own status→variant map, never re-chosen here. */
  statusVariant: BadgeProps["variant"]
  priority: Priority
  module: Area | "Governance"
  /** ISO. Absent when the source record has no due date — audit A-06. */
  due?: string
  /** For undated sign-offs: days in the current stage. */
  waitingDays?: number
  href?: string
  cta?: string
  notBuilt?: boolean
}

/* High = late or due within 2 days · Medium = your sign-off, or due within 7
   days · Low = everything else. Spec §2.2.3 tiers, collapsed to three levels
   so one filter can hold them. */
function priorityFor(due: string | undefined, signOff: boolean): Priority {
  if (due) {
    const d = daysUntil(due)
    if (d <= 2) return "High"
    if (d <= 7) return "Medium"
  }
  return signOff ? "Medium" : "Low"
}

const DAY = 86_400_000
/* Entered current stage = latest activity or signature. Seed data stamps
   every record on 2026-09-12, so ages are demo values. */
function daysInStage(d: DemoDocument) {
  const stamps = [...d.activity.map((a) => a.timestamp), ...d.signatures.map((s) => s.timestamp)]
  const since = stamps.sort().at(-1) ?? `${TODAY}T00:00:00Z`
  return Math.max(0, Math.floor((new Date(`${TODAY}T12:00:00Z`).getTime() - new Date(since).getTime()) / DAY))
}
function isoFromDisplay(date: string) {
  const d = new Date(`${date} 12:00`)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const rank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }
const byPriorityThenDue = (a: InboxRow, b: InboxRow) =>
  rank[a.priority] - rank[b.priority] || (a.due ?? "0").localeCompare(b.due ?? "0")

function capaHref(c: (typeof initialCapaRecords)[number]) {
  // Detail exists only for early statuses; others open the list.
  return canViewCapaDetail(c) ? `${dashboardBase}/capa/${c.id}` : `${dashboardBase}/capa`
}

export function myActions(docs: DemoDocument[]): InboxRow[] {
  const rows: InboxRow[] = []

  for (const d of docs) {
    if (d.status !== "In QA Approval" && d.status !== "In Review") continue
    if (responsible(d).name !== prototypeUser.name) continue
    const approve = d.status === "In QA Approval"
    rows.push({
      id: `doc-${d.id}-${d.revision}`,
      record: d.id,
      detail: `${d.name} · ${d.revision}`,
      status: d.status,
      statusVariant: workflowVariants[d.status],
      priority: priorityFor(undefined, true),
      module: "Documents",
      waitingDays: daysInStage(d),
      href: documentHref(d),
      cta: approve ? "Approve" : "Review",
    })
  }

  for (const u of trainingUsers.filter((t) => t.status === "Overdue")) {
    // The prototype's assessment list belongs to Amit Kothari.
    const late = assignedAssessments.filter((a) => a.overdue)
    const due = late.map((a) => isoFromDisplay(a.dueDate)).sort()[0]
    rows.push({
      id: `training-${u.id}`,
      record: u.name,
      detail: `${late.length} courses overdue: ${late.map((a) => a.course).join(", ")}`,
      status: u.status,
      statusVariant: userStatusVariant[u.status],
      priority: priorityFor(due, false),
      module: "Training",
      due,
      href: `${dashboardBase}/training/${u.id}`,
      cta: "View",
    })
  }

  // Mirrors the shell notification; CAPA data names Sarah Johnson — audit A-03.
  const capa = initialCapaRecords.find((c) => c.id === "CAPA-0005")!
  const capaDue = isoFromDisplay(capa.dueDate)
  rows.push({
    id: capa.id,
    record: capa.id,
    detail: capa.title,
    status: capa.status,
    statusVariant: capaStatusVariant[capa.status],
    priority: priorityFor(capaDue, true),
    module: "CAPA",
    due: capaDue,
    href: capaHref(capa),
    cta: "Review",
  })

  rows.push(
    { id: "ra-2026-0012", record: "RA-2026-0012", detail: "Periodic risk review", status: "Active", statusVariant: "secondary", priority: priorityFor("2026-09-20", true), module: "Risks", due: "2026-09-20", notBuilt: true },
    { id: "aud-012", record: "AUD-012", detail: "Corrective actions awaiting closure", status: "CAPA Followup", statusVariant: "secondary", priority: priorityFor("2026-09-30", false), module: "Audits", due: "2026-09-30", notBuilt: true },
  )
  return rows.sort(byPriorityThenDue)
}

/* Unbuilt modules (Risks, Audits, Governance) have no status map yet, so their
   statuses stay neutral "secondary" rather than inventing a colour. */

/* Upcoming = everything with a date in the next 30 days that is NOT already
   in My actions, so a record never appears in both tabs. */
export function upcoming(docs: DemoDocument[]): InboxRow[] {
  const mine = new Set(myActions(docs).map((r) => r.record))
  const capas: InboxRow[] = initialCapaRecords
    .filter((c) => c.status !== "Close" && !mine.has(c.id))
    .map((c) => {
      const due = isoFromDisplay(c.dueDate)
      return { id: `up-${c.id}`, record: c.id, detail: c.title, status: c.status, statusVariant: capaStatusVariant[c.status], priority: priorityFor(due, false), module: "CAPA" as const, due, href: capaHref(c), cta: "View" }
    })
  const mocks: InboxRow[] = [
    { id: "up-aud-2026-003", record: "AUD-2026-003", detail: "Internal audit", status: "Scheduled", statusVariant: "secondary", priority: priorityFor("2026-09-24", false), module: "Audits", due: "2026-09-24", notBuilt: true },
    { id: "up-supplier", record: "Supplier review", detail: "Critical vendor requalification", status: "Scheduled", statusVariant: "secondary", priority: priorityFor("2026-10-04", false), module: "Audits", due: "2026-10-04", notBuilt: true },
    { id: "up-mr", record: "Management review", detail: "ISO 13485 §5.6", status: "Scheduled", statusVariant: "secondary", priority: priorityFor("2026-10-10", false), module: "Governance", due: "2026-10-10", notBuilt: true },
  ]
  return [...capas, ...mocks]
    .filter((r) => r.due && daysUntil(r.due) >= 0 && daysUntil(r.due) <= 30)
    .sort((a, b) => a.due!.localeCompare(b.due!))
}

export function summary(mine: InboxRow[]) {
  const late = mine.filter((r) => r.due && daysUntil(r.due) < 0).length
  const signOff = mine.filter((r) => r.cta === "Approve" || r.cta === "Review").filter((r) => !r.due).length
  const week = mine.filter((r) => r.due && daysUntil(r.due) >= 0 && daysUntil(r.due) <= 7).length
  const parts = [
    late && `${late} overdue`,
    signOff && `${signOff} waiting on your sign-off`,
    week && `${week} due this week`,
  ].filter(Boolean) as string[]
  if (!parts.length) return null
  const last = parts.pop()
  return { late, text: `You have ${parts.length ? `${parts.join(", ")} and ${last}` : last}.` }
}
