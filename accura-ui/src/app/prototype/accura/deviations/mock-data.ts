import type { BadgeProps } from "@/components/ui/badge"

/* Deviation module — all demo data and all derived logic.
 *
 * Kept in one file on purpose: the lifecycle rules here (overdue, step index,
 * next action) are the part worth reviewing against the brief later, without
 * reading any screen code. Spec: flow/deviation-spec.md · brief:
 * flow/brief/Deviation_Module_Business_Flow.md */

export const basePath = "/prototype/accura/deviations"

/* Demo "today". Overdue is a function of the date, so a hardcoded value keeps
   the seeded set stable — otherwise the screenshots in the spec stop matching
   the screen a week later. */
export const today = "2026-09-15"

// ─── Lifecycle ──────────────────────────────────────────────────────────────

/* The six sequential states, in order. The array IS the order — stepIndex and
   the stepper both read from it, so there is no second list to keep in sync. */
export const lifecycle = [
  "Draft",
  "In Review",
  "Investigation In Progress",
  "CAPA Pending",
  "In Approval",
  "Approved",
] as const

export type LifecycleStatus = (typeof lifecycle)[number]

/* Cancelled is terminal and sits outside the sequence — it is reachable from
   several states and belongs to no step. Overdue is deliberately NOT a status:
   see isOverdue. */
export type DeviationStatus = LifecycleStatus | "Cancelled"

export const statusVariants: Record<DeviationStatus, BadgeProps["variant"]> = {
  Draft: "outline",
  "In Review": "warning",
  "Investigation In Progress": "blue",
  "CAPA Pending": "violet",
  "In Approval": "secondary",
  Approved: "success",
  Cancelled: "outline",
}

/** 1-based position in the stepper. Cancelled has no step. */
export function stepIndex(status: DeviationStatus) {
  const i = lifecycle.indexOf(status as LifecycleStatus)
  return i === -1 ? null : i + 1
}

// ─── Enums (brief §13) ──────────────────────────────────────────────────────

export const departments = [
  "Quality Assurance",
  "Quality Control",
  "Manufacturing",
  "Packaging",
  "Engineering",
  "Cold Chain Storage",
  "Supply Chain",
  "Regulatory Affairs",
] as const

export const classifications = ["Planned", "Unplanned"] as const
export const categories = ["Major", "Minor", "Critical"] as const
export const severities = ["High", "Medium", "Low"] as const

export const incidentTypes = [
  "Document",
  "Process",
  "Equipment",
  "Facility",
  "Utility",
  "Computer System",
  "Material",
  "Supplier",
  "Regulatory",
  "Planned",
  "Analytical Method",
] as const

export type Department = (typeof departments)[number]
export type Classification = (typeof classifications)[number]
export type Category = (typeof categories)[number]
export type Severity = (typeof severities)[number]
export type IncidentType = (typeof incidentTypes)[number]

// ─── People ─────────────────────────────────────────────────────────────────

/* The live product renders raw `auth0|6a7d…` identifiers in Raised By and in
   every signature, while resolving Reviewers to "Sarah Johnson (QA)" on the
   same screen (spec §8.8). The prototype resolves everywhere. */
export type Person = { name: string; role: string; initials: string }

export const people = {
  amit: { name: "Amit Kothari", role: "Production Lead", initials: "AK" },
  sarah: { name: "Sarah Johnson", role: "QA", initials: "SJ" },
  john: { name: "John Baker", role: "Dept Owner", initials: "JB" },
  lisa: { name: "Lisa Chen", role: "QC Lead", initials: "LC" },
  maria: { name: "Maria Santos", role: "QA Manager", initials: "MS" },
} satisfies Record<string, Person>

export const currentUser = people.sarah

export function display(person: Person) {
  return `${person.name} (${person.role})`
}

// ─── Record shape ───────────────────────────────────────────────────────────

export type ImpactedProduct = {
  product: string
  batch: string
  description: string
}

export type DeviationRecord = {
  /** Assigned on Submit for Review, never on Save as Draft (brief §5 Step 1),
   *  so a Draft genuinely has none. */
  id: string | null
  key: string
  title: string
  status: DeviationStatus
  dateRaised: string
  raisedBy: Person
  /** Origin unspecified by either brief — not a field on Create, yet every
   *  record has one and Overdue depends on it. Seeded. See spec §8.2. */
  dueDate: string
  department: Department
  owner: Person
  classification: Classification
  category: Category
  severity: Severity
  incidentType: IncidentType
  productImpacted: boolean
  details: string
  reviewers: Person[]
  impactedProducts: ImpactedProduct[]
  immediateAction?: string
  riskAnalysis?: string
  rootCauseAnalysis?: string
  impactAnalysis?: string
  capaRef?: { id: string; title: string; status: string }
  /** Set when the record was cancelled; reason is required at that point.
   *  `from` is the state it was cancelled out of — the stepper shows that
   *  step, because Cancelled itself has no position (spec §9). */
  cancelled?: {
    reason: string
    by: Person
    timestamp: string
    from: LifecycleStatus
  }
}

// ─── Seed set ───────────────────────────────────────────────────────────────

/* Every status is represented at least once, and the two exception conditions
   (overdue, cancelled) are crossed with a lifecycle status rather than
   standing alone — an overdue record is still In Review, which is the whole
   point of Overdue being a flag and not a state.
 *
 * DEV-0001/0002 mirror the live records; the live set uses two different ID
 * formats (spec §8.1) and the prototype normalises to one. */
export const seeds: DeviationRecord[] = [
  {
    id: null,
    key: "draft-1",
    title: "Chilled room 3 temperature excursion during night shift",
    status: "Draft",
    dateRaised: "2026-09-15",
    raisedBy: people.amit,
    dueDate: "2026-10-15",
    department: "Cold Chain Storage",
    owner: people.amit,
    classification: "Unplanned",
    category: "Major",
    severity: "High",
    incidentType: "Facility",
    productImpacted: true,
    details:
      "Chilled room 3 logged 9.4 °C for 40 minutes overnight. Door seal suspected. Stock moved to room 5 pending assessment.",
    reviewers: [],
    impactedProducts: [],
  },
  {
    id: "ACME/DEV/2026/000001",
    key: "dev-0001",
    title: "Batch record page missing operator signature",
    status: "In Review",
    dateRaised: "2026-09-09",
    raisedBy: people.amit,
    dueDate: "2026-10-08",
    department: "Quality Control",
    owner: people.amit,
    classification: "Unplanned",
    category: "Minor",
    severity: "Medium",
    incidentType: "Process",
    productImpacted: false,
    details:
      "Page 4 of the batch record was filed without the operator signature for the weighing step.",
    reviewers: [people.sarah],
    impactedProducts: [
      { product: "PRD-104", batch: "B-123", description: "Held pending review" },
    ],
  },
  {
    id: "ACME/DEV/2026/000002",
    key: "dev-0002",
    title: "Capping torque out of specification on line 2",
    status: "In Review",
    dateRaised: "2026-08-04",
    raisedBy: people.amit,
    dueDate: "2026-09-03", // overdue against `today`
    department: "Packaging",
    owner: people.john,
    classification: "Unplanned",
    category: "Major",
    severity: "High",
    incidentType: "Equipment",
    productImpacted: true,
    details:
      "In-process check found capping torque below the lower limit on 12 units.",
    reviewers: [people.sarah, people.lisa],
    impactedProducts: [
      { product: "PRD-220", batch: "B-884", description: "12 units quarantined" },
    ],
  },
  {
    id: "ACME/DEV/2026/000003",
    key: "dev-0003",
    title: "Production staff fall near machine that makes Pizza",
    status: "Investigation In Progress",
    dateRaised: "2026-09-10",
    raisedBy: people.amit,
    dueDate: "2026-10-10",
    department: "Manufacturing",
    owner: people.amit,
    classification: "Unplanned",
    category: "Critical",
    severity: "High",
    incidentType: "Facility",
    productImpacted: false,
    details: "Operator slipped on spilled oil adjacent to the forming machine.",
    reviewers: [people.sarah],
    impactedProducts: [],
    immediateAction: "Area cordoned, spill cleared, shift briefing issued.",
  },
  {
    id: "ACME/DEV/2026/000004",
    key: "dev-0004",
    title: "Autoclave cycle aborted mid-run",
    status: "Investigation In Progress",
    dateRaised: "2026-07-28",
    raisedBy: people.lisa,
    dueDate: "2026-08-27", // overdue against `today`
    department: "Engineering",
    owner: people.lisa,
    classification: "Unplanned",
    category: "Major",
    severity: "Medium",
    incidentType: "Equipment",
    productImpacted: true,
    details: "Cycle 4471 aborted at 18 minutes with a door-seal pressure fault.",
    reviewers: [people.sarah],
    impactedProducts: [
      { product: "PRD-018", batch: "B-771", description: "Load reprocessed" },
    ],
    immediateAction: "Load quarantined, autoclave taken out of service.",
    riskAnalysis: "Sterility assurance not demonstrated for the aborted load.",
  },
  {
    id: "ACME/DEV/2026/000005",
    key: "dev-0005",
    title: "Supplier certificate of analysis missing two assay results",
    status: "CAPA Pending",
    dateRaised: "2026-08-20",
    raisedBy: people.sarah,
    dueDate: "2026-09-19",
    department: "Supply Chain",
    owner: people.john,
    classification: "Unplanned",
    category: "Minor",
    severity: "Low",
    incidentType: "Supplier",
    productImpacted: false,
    details: "CoA for lot SUP-9912 omitted the assay and water-content results.",
    reviewers: [people.sarah],
    impactedProducts: [],
    immediateAction: "Lot placed on hold, supplier contacted.",
    riskAnalysis: "Low — material not yet released to production.",
    rootCauseAnalysis:
      "Supplier template updated without notification; missing fields not caught at goods-in.",
    impactAnalysis: "No product released. One lot on hold.",
  },
  {
    id: "ACME/DEV/2026/000006",
    key: "dev-0006",
    title: "Cleaning validation swab taken from the wrong port",
    status: "In Approval",
    dateRaised: "2026-09-11",
    raisedBy: people.amit,
    dueDate: "2026-10-11",
    department: "Manufacturing",
    owner: people.amit,
    classification: "Unplanned",
    category: "Minor",
    severity: "Low",
    incidentType: "Process",
    productImpacted: false,
    details:
      "Swab for vessel V-12 was taken from port B rather than port A as specified.",
    reviewers: [people.sarah],
    impactedProducts: [],
    immediateAction: "Re-swab performed from the specified port.",
    riskAnalysis: "Low — re-swab within the same clean hold window.",
    rootCauseAnalysis: "Port labelling on the vessel had faded.",
    impactAnalysis: "No impact to released product.",
    capaRef: {
      id: "ACME/CAPA/2026/000017",
      title: "Re-label sampling ports across vessel fleet",
      status: "Completed",
    },
  },
  {
    id: "ACME/DEV/2026/000007",
    key: "dev-0007",
    title: "Planned maintenance overran into production window",
    status: "Approved",
    dateRaised: "2026-07-02",
    raisedBy: people.john,
    dueDate: "2026-08-01",
    department: "Engineering",
    owner: people.john,
    classification: "Planned",
    category: "Minor",
    severity: "Low",
    incidentType: "Planned",
    productImpacted: false,
    details: "Scheduled HVAC service overran by 3 hours, delaying line start.",
    reviewers: [people.sarah, people.lisa],
    impactedProducts: [],
    immediateAction: "Line start rescheduled; no product at risk.",
    riskAnalysis: "None — no product exposure.",
    rootCauseAnalysis: "Service scope underestimated at planning.",
    impactAnalysis: "Schedule only.",
    capaRef: {
      id: "ACME/CAPA/2026/000016",
      title: "Revise maintenance window estimates",
      status: "Completed",
    },
  },
  {
    id: "ACME/DEV/2026/000008",
    key: "dev-0008",
    title: "Label reconciliation discrepancy of 40 labels",
    status: "Approved",
    dateRaised: "2026-06-15",
    raisedBy: people.amit,
    dueDate: "2026-07-15",
    department: "Packaging",
    owner: people.lisa,
    classification: "Unplanned",
    category: "Critical",
    severity: "High",
    incidentType: "Material",
    productImpacted: true,
    details: "Reconciliation at end of run showed 40 labels unaccounted for.",
    reviewers: [people.sarah, people.maria],
    impactedProducts: [
      { product: "PRD-301", batch: "B-402", description: "Batch held, then released" },
    ],
    immediateAction: "Line cleared and reconciled; batch held.",
    riskAnalysis: "High — potential mislabelling.",
    rootCauseAnalysis: "Damaged labels discarded without recording.",
    impactAnalysis: "All labels accounted for after review of waste records.",
    capaRef: {
      id: "ACME/CAPA/2026/000012",
      title: "Label waste recording at line clearance",
      status: "Completed",
    },
  },
  {
    id: "ACME/DEV/2026/000009",
    key: "dev-0009",
    title: "Duplicate report of the chilled room excursion",
    status: "Cancelled",
    dateRaised: "2026-09-12",
    raisedBy: people.lisa,
    dueDate: "2026-10-12",
    department: "Cold Chain Storage",
    owner: people.lisa,
    classification: "Unplanned",
    category: "Major",
    severity: "High",
    incidentType: "Facility",
    productImpacted: false,
    details: "Second report of the same overnight temperature excursion.",
    reviewers: [people.sarah],
    impactedProducts: [],
    cancelled: {
      reason: "Duplicate of the chilled room 3 excursion already under review.",
      by: people.sarah,
      timestamp: "2026-09-12T09:20:00Z",
      from: "In Review",
    },
  },
]

// ─── Derived logic ──────────────────────────────────────────────────────────

/* Overdue is a flag, never a status (brief §6, invariant: "the underlying
   lifecycle status is not altered"). The live product nonetheless lists it
   among the Status filter options — spec §8.13. Keeping it derived means a
   record can be both In Review and overdue, which is what actually happens. */
export function isOverdue(record: DeviationRecord, asOf: string = today) {
  if (record.status === "Approved" || record.status === "Cancelled") return false
  return asOf > record.dueDate
}

/** Whose move it is. Drives the registry's secondary line and, later, the CTA.
 *  Returns null for the two terminal states — a closed record has no next move,
 *  and a placeholder dash is noise, not information. */
export function nextAction(record: DeviationRecord): string | null {
  switch (record.status) {
    case "Draft":
      return "Submit for review"
    case "In Review":
      return "Triage and containment"
    case "Investigation In Progress":
      return "Root cause analysis"
    case "CAPA Pending":
      return "Link or decline CAPA"
    case "In Approval":
      return "Awaiting signatures"
    case "Approved":
    case "Cancelled":
      return null
  }
}

export function displayDate(date: string) {
  return new Date(date + (date.length === 10 ? "T00:00:00" : "")).toLocaleDateString(
    "en-US",
    { month: "short", day: "2-digit", year: "numeric" }
  )
}

/** A Draft has no Deviation ID until Submit mints one. */
export function displayId(record: DeviationRecord) {
  return record.id ?? "Not assigned"
}

// ─── Signatures ─────────────────────────────────────────────────────────────

/* Statements are verbatim from brief §13.7 — legal commitment copy is not
   paraphrased. */
export const statements = {
  department: "I approve this deviation and authorise advancing it to investigation.",
  owner: "As deviation owner, I approve the investigation and its outcome.",
  reviewer: (person: Person) =>
    `As reviewer (${display(person)}), I approve this deviation.`,
}

export type Signature = {
  role: string
  by: Person
  timestamp: string
  statement: string
}

/* Which signatures exist is a function of how far the record has travelled,
   not a stored list — so the two can never disagree.
 *
 *   In Review  → Investigation   department owner signs
 *   CAPA Pending → In Approval   deviation owner signs
 *   In Approval  → Approved      every named reviewer signs
 *
 * Note the department owner's statement is captured at step 2 but only
 * surfaces in the Signatures block, which is a lifetime ledger rather than a
 * list of approval-stage signatures (spec §8.10). */
export function signatures(record: DeviationRecord): {
  captured: Signature[]
  pending: Person[]
} {
  const reached = (status: LifecycleStatus) => {
    const at = record.cancelled?.from ?? (record.status as LifecycleStatus)
    const i = lifecycle.indexOf(at)
    return i >= lifecycle.indexOf(status)
  }

  const captured: Signature[] = []
  const stamp = (offsetDays: number) =>
    new Date(Date.parse(record.dateRaised + "T09:00:00Z") + offsetDays * 864e5).toISOString()

  if (reached("Investigation In Progress")) {
    captured.push({
      role: "Department owner approval",
      by: record.owner,
      timestamp: stamp(1),
      statement: statements.department,
    })
  }
  if (reached("In Approval")) {
    captured.push({
      role: "Deviation owner approval",
      by: record.owner,
      timestamp: stamp(3),
      statement: statements.owner,
    })
  }
  if (record.status === "Approved") {
    record.reviewers.forEach((person, i) =>
      captured.push({
        role: `Reviewer — ${display(person)}`,
        by: person,
        timestamp: stamp(4 + i),
        statement: statements.reviewer(person),
      })
    )
    return { captured, pending: [] }
  }

  return {
    captured,
    pending: record.status === "In Approval" ? record.reviewers : [],
  }
}

// ─── Audit trail ────────────────────────────────────────────────────────────

export type AuditEvent = {
  id: string
  timestamp: string
  name: string
  role?: string
  action: string
  record: string
  meaning?: string
  fromStatus?: string
  toStatus?: string
}

/* Derived from how far the record has travelled, for the same reason as
   signatures: a hand-written trail drifts from the record it describes.
 *
 * The live product's trail shows each transition twice at an identical
 * timestamp (spec §8.5). That is a defect under an append-only policy, so it
 * is not reproduced here. */
export function auditEvents(record: DeviationRecord): AuditEvent[] {
  const events: AuditEvent[] = []
  const at = record.cancelled?.from ?? (record.status as LifecycleStatus)
  const travelled = lifecycle.slice(0, lifecycle.indexOf(at) + 1)
  const id = record.id ?? "Draft"
  const stamp = (offsetDays: number) =>
    new Date(Date.parse(record.dateRaised + "T09:00:00Z") + offsetDays * 864e5).toISOString()

  events.push({
    id: `${record.key}-created`,
    timestamp: stamp(0),
    name: record.raisedBy.name,
    role: record.raisedBy.role,
    action: "Deviation created",
    record: id,
  })

  travelled.slice(1).forEach((status, i) => {
    events.push({
      id: `${record.key}-to-${i}`,
      timestamp: stamp(i + 1),
      name: record.owner.name,
      role: record.owner.role,
      action: "Status changed",
      record: id,
      fromStatus: lifecycle[i],
      toStatus: status,
    })
  })

  signatures(record).captured.forEach((signature, i) =>
    events.push({
      id: `${record.key}-sig-${i}`,
      timestamp: signature.timestamp,
      name: signature.by.name,
      role: signature.by.role,
      action: `Signed — ${signature.role}`,
      record: id,
      meaning: signature.statement,
    })
  )

  if (record.cancelled) {
    events.push({
      id: `${record.key}-cancelled`,
      timestamp: record.cancelled.timestamp,
      name: record.cancelled.by.name,
      role: record.cancelled.by.role,
      action: "Cancelled",
      record: id,
      meaning: record.cancelled.reason,
      fromStatus: record.cancelled.from,
      toStatus: "Cancelled",
    })
  }

  return events
}

// ─── Block visibility ───────────────────────────────────────────────────────

/* Which blocks a given status shows. The detail page is one accumulating page,
   not six layouts (spec §10 preamble): each state locks what came before and
   reveals one more block. */
export function visibleBlocks(record: DeviationRecord) {
  const at = record.cancelled?.from ?? (record.status as LifecycleStatus)
  const i = lifecycle.indexOf(at)
  const closed = record.status === "Approved" || record.status === "Cancelled"
  return {
    review: i >= lifecycle.indexOf("In Review"),
    investigation: i >= lifecycle.indexOf("Investigation In Progress"),
    capa: i >= lifecycle.indexOf("CAPA Pending"),
    /* Shown as soon as a signature exists, rather than only from In Approval.
       The live product hides earlier signatures until step 5; showing them is
       more honest and costs nothing. */
    signatures: signatures(record).captured.length > 0,
    /** Only the current state's own block is editable, and never once closed. */
    editable: closed ? null : (record.status as LifecycleStatus),
  }
}
