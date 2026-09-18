import type { BadgeProps } from "@/components/ui/badge"

import { initialCapaRecords } from "../capa/mock-data"
import {
  documentHref,
  responsible,
  type DemoDocument,
} from "../documents/mock-data"
import { prototypeUser } from "../shell-mock-data"
import { trainingUsers } from "../training/mock-data"

/* Dashboard = an aggregation layer. Documents, CAPA and Training are DERIVED
   from their module mock data so the numbers cannot drift from the listings.
   Non-Conformance, Audits and Risks have no module yet — their rows below are
   dashboard-local mocks and are flagged `unbuilt` so the UI says so. */

/* Frozen "today" so the demo is reproducible (spec examples assume 17 Sep). */
export const TODAY = "2026-09-17"
export const dashboardBase = "/prototype/accura"

const DAY = 86_400_000
export function daysUntil(date: string) {
  // CAPA stores display strings ("Oct 1, 2026"); ISO also parses. See audit A-07.
  const target = new Date(date)
  const today = new Date(`${TODAY}T00:00:00`)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / DAY)
}

export type Area =
  | "Documents"
  | "Training"
  | "CAPA"
  | "Non-Conformance"
  | "Audits"
  | "Risks"

export type Health = "green" | "yellow" | "red"
/* Status colour is data. Every level also carries a text label — no colour-only meaning. */
export const healthBadge: Record<Health, { label: string; variant: BadgeProps["variant"] }> = {
  green: { label: "On track", variant: "success" },
  yellow: { label: "Due soon", variant: "warning" },
  red: { label: "Overdue", variant: "error" },
}

export type ModuleHealth = {
  area: Area
  health: Health
  attention: string
  href?: string
  unbuilt?: boolean
}

export type Metric = { label: string; href?: string }
export type SystemMetric = {
  area: Area
  primary: Metric
  secondary: Metric
  unbuilt?: boolean
}

export type Urgency = "overdue" | "approval" | "this-week" | "closure" | "upcoming"
export const urgencyBadge: Record<Urgency, { label: string; variant: BadgeProps["variant"] }> = {
  overdue: { label: "Urgent", variant: "error" },
  approval: { label: "Approval", variant: "warning" },
  "this-week": { label: "This week", variant: "warning" },
  closure: { label: "Closure", variant: "blue" },
  upcoming: { label: "Upcoming", variant: "secondary" },
}

export type ActionItem = {
  id: string
  module: Area
  /** ISO. Absent where the source record has no due date — audit A-06. */
  due?: string
  recordKey: string
  text: string
  urgency: Urgency
  href?: string
  unbuilt?: boolean
}

export type Milestone = {
  id: string
  module: Area | "Governance"
  title: string
  date: string // ISO
  href?: string
  unbuilt?: boolean
}

function healthFrom(overdue: number, dueSoon: number): Health {
  return overdue > 0 ? "red" : dueSoon > 0 ? "yellow" : "green"
}

/* §2.1.4 waterfall. */
function attentionText(o: {
  overdue: number
  dueSoon: number
  pending?: number
  open?: number
  next?: string
}) {
  if (o.overdue) return `${o.overdue} overdue`
  if (o.dueSoon) return `${o.dueSoon} due this week`
  if (o.pending) return `${o.pending} pending approval${o.pending === 1 ? "" : "s"}`
  if (o.open) return `${o.open} open`
  if (o.next) return o.next
  return "All items current"
}

/* ── Derived: CAPA ─────────────────────────────────────────────── */
const openCapas = initialCapaRecords.filter((c) => c.status !== "Close")
const capaOverdue = openCapas.filter((c) => daysUntil(c.dueDate) < 0).length
const capaDue7 = openCapas.filter((c) => {
  const d = daysUntil(c.dueDate)
  return d >= 0 && d <= 7
}).length
// Spec §2.3.2 uses 14 days here but 7 days for RAG — kept as written. See audit A-05.
const capaDue14 = openCapas.filter((c) => {
  const d = daysUntil(c.dueDate)
  return d >= 0 && d <= 14
}).length

/* ── Derived: Training ─────────────────────────────────────────── */
const trainingOverdue = trainingUsers.filter((u) => u.status === "Overdue").length
const trainingCurrentPct = Math.round(
  (trainingUsers.filter((u) => u.status === "Up to date").length / trainingUsers.length) * 100
)

/* ── Unbuilt modules: dashboard-local mocks ────────────────────── */
const ncMock = { open: 7, critical: 1 }
const auditMock = { active: 3, upcoming: 1, nextInDays: daysUntil("2026-09-24") }
const riskMock = { active: 18, reviewsDue: 2, dueThisWeek: 1 }

/* Documents change at runtime (signing in the Documents demo), so these take
   the live list from the documents store. */
export function qualityAtAGlance(docs: DemoDocument[]): ModuleHealth[] {
  const pendingApprovals = docs.filter((d) => d.status === "In QA Approval").length
  return [
    {
      area: "Documents",
      // Documents have no due date in the data model, so RAG can only be green. Audit A-06.
      health: "green",
      attention: attentionText({ overdue: 0, dueSoon: 0, pending: pendingApprovals }),
      href: `${dashboardBase}/documents`,
    },
    {
      area: "Training",
      health: healthFrom(trainingOverdue, 0),
      attention: attentionText({ overdue: trainingOverdue, dueSoon: 0 }),
      href: `${dashboardBase}/training`,
    },
    {
      area: "CAPA",
      health: healthFrom(capaOverdue, capaDue7),
      attention: attentionText({ overdue: capaOverdue, dueSoon: capaDue7, open: openCapas.length }),
      href: `${dashboardBase}/capa`,
    },
    {
      area: "Non-Conformance",
      health: "green",
      attention: attentionText({ overdue: 0, dueSoon: 0, open: ncMock.open }),
      unbuilt: true,
    },
    {
      area: "Audits",
      health: "green",
      attention: `Next audit in ${auditMock.nextInDays} days`,
      unbuilt: true,
    },
    {
      area: "Risks",
      health: healthFrom(0, riskMock.dueThisWeek),
      attention: attentionText({ overdue: 0, dueSoon: riskMock.dueThisWeek }),
      unbuilt: true,
    },
  ]
}

export function qualitySystem(docs: DemoDocument[]): SystemMetric[] {
  const effective = docs.filter(
    (d) => d.status === "Approved" && d.effectiveDate && d.effectiveDate <= TODAY
  ).length
  const pending = docs.filter((d) => d.status !== "Approved").length
  return [
    {
      area: "Documents",
      primary: { label: `${effective} Active`, href: `${dashboardBase}/documents` },
      secondary: { label: `${pending} Pending`, href: `${dashboardBase}/documents` },
    },
    {
      area: "Training",
      primary: { label: `${trainingCurrentPct}% Current`, href: `${dashboardBase}/training` },
      secondary: { label: `${trainingOverdue} Overdue`, href: `${dashboardBase}/training` },
    },
    {
      area: "CAPA",
      primary: { label: `${openCapas.length} Open`, href: `${dashboardBase}/capa` },
      secondary: { label: `${capaDue14} Due soon`, href: `${dashboardBase}/capa` },
    },
    { area: "Non-Conformance", primary: { label: `${ncMock.open} Open` }, secondary: { label: `${ncMock.critical} Critical` }, unbuilt: true },
    { area: "Audits", primary: { label: `${auditMock.active} Active` }, secondary: { label: `${auditMock.upcoming} Upcoming` }, unbuilt: true },
    { area: "Risks", primary: { label: `${riskMock.active} Active` }, secondary: { label: `${riskMock.reviewsDue} Reviews due` }, unbuilt: true },
  ]
}

export function myActions(docs: DemoDocument[]): ActionItem[] {
  const docActions: ActionItem[] = docs
    .filter((d) => d.status === "In QA Approval" && responsible(d).name === prototypeUser.name)
    .map((d) => ({
      id: `doc-${d.id}`,
      module: "Documents" as const,
      recordKey: d.id,
      text: "Awaiting your approval",
      urgency: "approval",
      href: documentHref(d),
    }))

  const order: Urgency[] = ["overdue", "approval", "this-week", "closure", "upcoming"]
  return [
    ...docActions,
    {
      // Mirrors the existing shell notification. CAPA mock data names Sarah
      // Johnson as approver, not Sarah Chen — audit A-03.
      id: "capa-0005",
      module: "CAPA",
      due: "2026-10-01",
      recordKey: "CAPA-0005",
      text: `Review due in ${daysUntil("Oct 1, 2026")} days`,
      urgency: "upcoming",
      href: `${dashboardBase}/capa/CAPA-0005`,
    },
    {
      id: "training-overdue",
      module: "Training",
      recordKey: "Training",
      text: `${trainingOverdue} ${trainingOverdue === 1 ? "person" : "people"} overdue`,
      urgency: "overdue",
      href: `${dashboardBase}/training`,
    },
    { id: "risk-ra-0012", module: "Risks", due: "2026-09-20", recordKey: "RA-2026-0012", text: "Review due this week", urgency: "this-week", unbuilt: true },
    { id: "audit-012", module: "Audits", recordKey: "AUD-012", text: "Corrective actions awaiting closure", urgency: "closure", unbuilt: true },
  ].sort((a, b) => order.indexOf(a.urgency as Urgency) - order.indexOf(b.urgency as Urgency)) as ActionItem[]
}

export function upcomingItems(): Milestone[] {
  const capa: Milestone[] = openCapas.map((c) => ({
    id: c.id,
    module: "CAPA" as const,
    title: `${c.id} due`,
    date: new Date(`${c.dueDate} 12:00`).toISOString().slice(0, 10),
    href: `${dashboardBase}/capa`,
  }))
  const mocks: Milestone[] = [
    { id: "aud-2026-003", module: "Audits", title: "Internal audit", date: "2026-09-24", unbuilt: true },
    { id: "supplier-review", module: "Audits", title: "Supplier review", date: "2026-10-04", unbuilt: true },
    { id: "management-review", module: "Governance", title: "Management review", date: "2026-10-10", unbuilt: true },
  ]
  return [...capa, ...mocks]
    .filter((m) => {
      const d = daysUntil(m.date)
      return d >= 0 && d <= 30
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function formatShortDate(iso: string) {
  // Spec §2.4.2: "24 Sep" — en-GB would render "24 Sept".
  const d = new Date(`${iso}T12:00:00`)
  return `${d.getDate()} ${d.toLocaleDateString("en-US", { month: "short" })}`
}

/* ── Merged module card (Vanta-style layout, 2026-09-17) ──────────
   One card per module = health (Quality at a glance) + volume/watchlist
   (My quality system). One card, one answer — resolves audit B-01 visually. */
export type ModuleCard = ModuleHealth & {
  primary: Metric
  secondary: Metric
  bar?: { ok: number; total: number; okLabel: string }
}

export function moduleCards(docs: DemoDocument[]): ModuleCard[] {
  const glance = qualityAtAGlance(docs)
  const system = qualitySystem(docs)
  const effective = docs.filter(
    (d) => d.status === "Approved" && d.effectiveDate && d.effectiveDate <= TODAY
  ).length
  const bars: Partial<Record<Area, ModuleCard["bar"]>> = {
    Documents: { ok: effective, total: docs.length, okLabel: "effective" },
    Training: {
      ok: trainingUsers.filter((u) => u.status === "Up to date").length,
      total: trainingUsers.length,
      okLabel: "up to date",
    },
    CAPA: { ok: openCapas.length - capaDue14, total: openCapas.length, okLabel: "on schedule" },
    "Non-Conformance": { ok: ncMock.open - ncMock.critical, total: ncMock.open, okLabel: "non-critical" },
    Risks: { ok: riskMock.active - riskMock.reviewsDue, total: riskMock.active, okLabel: "reviewed" },
  }
  return glance.map((g) => {
    const s = system.find((m) => m.area === g.area)!
    return { ...g, primary: s.primary, secondary: s.secondary, bar: bars[g.area] }
  })
}
