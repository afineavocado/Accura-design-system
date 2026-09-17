export const changeControlStatuses = [
  "Draft",
  "Impact Assessment",
  "QA Approval",
  "Action in Progress",
  "Pending Closure",
  "Final QA Approval",
  "Closed",
] as const

export type ChangeControlStatus = (typeof changeControlStatuses)[number]
export type ChangeControlBadgeVariant =
  | "secondary"
  | "warning"
  | "blue"
  | "violet"
  | "orange"
  | "success"
  | "dashed"

export const changeControlWorkflowSteps: Array<{
  status: ChangeControlStatus
}> = [
  { status: "Draft" },
  { status: "Impact Assessment" },
  { status: "QA Approval" },
  { status: "Action in Progress" },
  { status: "Pending Closure" },
  { status: "Final QA Approval" },
  { status: "Closed" },
]

export const changeControlStatusVariant: Record<
  ChangeControlStatus,
  ChangeControlBadgeVariant
> = {
  Draft: "secondary",
  "Impact Assessment": "orange",
  "QA Approval": "blue",
  "Action in Progress": "warning",
  "Pending Closure": "dashed",
  "Final QA Approval": "violet",
  Closed: "success",
}

export type ChangeControlRecord = {
  key: string
  id: string
  title: string
  status: ChangeControlStatus
  dateRaised: string
  targetImplementationDate: string
  owner: string
  affectedDepartments: string[]
  raisedBy?: string
  department?: string
  type?: string
  classification?: string
  category?: string
  description?: string
  riskAssessment?: string
  departmentAssessments?: DepartmentAssessment[]
  changeActions?: ChangeAction[]
  auditTrail?: AuditTrailItem[]
}

export type DepartmentAssessment = {
  department: string
  impacted: boolean
  status: "Pending" | "Impacted" | "Not Impacted" | "Signed"
  impactSummary: string
  reason?: string
  signer?: string
  priority?: "Low" | "Medium" | "High" | "Critical"
}

// Every department in `affectedDepartments` needs a matching `Pending`
// DepartmentAssessment as soon as a record enters "Impact Assessment" —
// otherwise Step 2 has no department to render and falls back to the
// Draft-only "not submitted yet" placeholder despite already being past Draft.
export function pendingAssessmentsFor(
  affectedDepartments: string[]
): DepartmentAssessment[] {
  return affectedDepartments.map((department) => ({
    department,
    impacted: false,
    status: "Pending",
    impactSummary: "",
  }))
}

export type ChangeActionComment = {
  author: string
  timestamp: string
  text: string
}

export type ChangeAction = {
  id: string
  department?: string
  title: string
  owner: string
  dueDate: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "In Progress" | "Done"
  evidenceStatus: "Missing" | "Attached"
  evidenceFiles?: string[]
  comments?: ChangeActionComment[]
  completedAt?: string
}

export type AuditTrailItem = {
  actor: string
  timestamp: string
  action: string
  from?: ChangeControlStatus
  to?: ChangeControlStatus
}

export const initialChangeControlRecords: ChangeControlRecord[] = [
  {
    key: "cc-2026-001",
    id: "CC-2026-001",
    title: "Update tablet coating process parameters",
    status: "Impact Assessment",
    dateRaised: "Aug 28, 2026",
    targetImplementationDate: "Nov 15, 2026",
    owner: "John Baker",
    affectedDepartments: ["Production", "Quality Assurance", "Engineering"],
    raisedBy: "Amit Kothari",
    department: "Production",
    type: "Process",
    classification: "Permanent",
    category: "Major",
    description:
      "Adjust spray rate and inlet air temperature for the tablet coating process to improve coating uniformity following recent batch variability.",
    riskAssessment:
      "Moderate GMP risk. Product quality impact is controlled when batch record instructions, QA verification, and implementation evidence are complete before release.",
    departmentAssessments: [
      {
        department: "Production",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "Coating process parameters and batch record instructions must be updated before the next validation batch.",
        signer: "Michael Chen",
        priority: "High",
      },
      {
        department: "Quality Assurance",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "QA must verify process risk, approve implementation evidence, and confirm batch record revision.",
        signer: "Sarah Johnson",
        priority: "High",
      },
      {
        department: "Engineering",
        impacted: false,
        status: "Pending",
        impactSummary: "",
      },
    ],
    changeActions: [],
    auditTrail: [
      {
        actor: "Amit Kothari",
        timestamp: "Sep 19, 2026 9:30 AM",
        action: "Submitted for Impact Assessment",
        from: "Draft",
        to: "Impact Assessment",
      },
      {
        actor: "Amit Kothari",
        timestamp: "Aug 28, 2026 10:05 AM",
        action: "Created Change Control",
      },
    ],
  },
  {
    key: "cc-2026-002",
    id: "CC-2026-002",
    title: "Revise purified water sampling point",
    status: "QA Approval",
    dateRaised: "Sep 12, 2026",
    targetImplementationDate: "Oct 10, 2026",
    owner: "Anna Hoang",
    affectedDepartments: ["Quality Control", "Engineering"],
    raisedBy: "Anna Hoang",
    department: "Quality Control",
    type: "Facility",
    classification: "Permanent",
    category: "Major",
    description:
      "Relocate the purified water sampling point to improve operator access and maintain routine monitoring coverage.",
    riskAssessment:
      "QA approval required because the change affects routine utility sampling and trend continuity.",
    departmentAssessments: [
      {
        department: "Quality Control",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "Relocating the sampling point requires updated SOP steps and operator retraining before the next monitoring cycle.",
        signer: "Anna Hoang",
        priority: "High",
      },
      {
        department: "Engineering",
        impacted: false,
        status: "Not Impacted",
        impactSummary: "No piping or utility system changes required.",
        reason: "The relocation reuses the existing tap point; no new piping work is needed.",
        signer: "David Lee",
      },
    ],
    changeActions: [
      {
        id: "A-101",
        department: "Quality Control",
        title: "Update purified water sampling SOP with new location",
        owner: "Anna Hoang",
        dueDate: "Oct 05, 2026",
        priority: "High",
        status: "Open",
        evidenceStatus: "Missing",
      },
    ],
    auditTrail: [
      {
        actor: "Anna Hoang",
        timestamp: "Sep 15, 2026 2:10 PM",
        action: "Submitted for QA Approval",
        from: "Impact Assessment",
        to: "QA Approval",
      },
      {
        actor: "Anna Hoang",
        timestamp: "Sep 13, 2026 9:00 AM",
        action: "Submitted for Impact Assessment",
        from: "Draft",
        to: "Impact Assessment",
      },
      {
        actor: "Anna Hoang",
        timestamp: "Sep 12, 2026 8:15 AM",
        action: "Created Change Control",
      },
    ],
  },
  {
    key: "cc-2026-003",
    id: "CC-2026-003",
    title: "Update tablet coating process parameters",
    status: "Draft",
    dateRaised: "Aug 28, 2026",
    targetImplementationDate: "Nov 15, 2026",
    owner: "John Baker",
    affectedDepartments: ["Production", "Quality Assurance", "Engineering"],
    raisedBy: "John Baker",
    department: "Production",
    type: "Facility",
    classification: "Temporary",
    category: "Major",
    description:
      "Adjust spray rate and inlet air temperature for the tablet coating process to improve coating uniformity following recent batch variability.",
    riskAssessment: "-",
    departmentAssessments: [],
    changeActions: [],
    auditTrail: [
      {
        actor: "John Baker",
        timestamp: "Aug 28, 2026 9:00 AM",
        action: "Created Change Control",
      },
    ],
  },
  {
    key: "cc-2026-004",
    id: "CC-2026-004",
    title: "Qualify backup incubator for microbiology",
    status: "Action in Progress",
    dateRaised: "Aug 03, 2026",
    targetImplementationDate: "Sep 30, 2026",
    owner: "Lisa Tran",
    affectedDepartments: ["Microbiology", "Facilities", "Quality Assurance"],
    raisedBy: "Lisa Tran",
    department: "Microbiology",
    type: "Equipment",
    classification: "Temporary",
    category: "Major",
    description:
      "Qualify a backup incubator for microbiology testing continuity while the primary incubator is serviced.",
    riskAssessment:
      "Testing continuity is maintained if qualification evidence is attached before routine use.",
    departmentAssessments: [
      {
        department: "Microbiology",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "Backup incubator must be qualified and logged before it can be used for routine micro testing.",
        signer: "Lisa Tran",
        priority: "High",
      },
      {
        department: "Facilities",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "Backup incubator placement requires a calibrated power outlet and a temperature-monitoring point in the equipment room.",
        signer: "David Lee",
        priority: "Medium",
      },
      {
        department: "Quality Assurance",
        impacted: false,
        status: "Not Impacted",
        impactSummary: "No change to the microbiology test method or acceptance criteria.",
        reason: "The qualification only covers equipment continuity, not the test method itself.",
        signer: "Sarah Johnson",
      },
    ],
    changeActions: [
      {
        id: "A-201",
        department: "Microbiology",
        title: "Complete temperature mapping qualification for backup incubator",
        owner: "Lisa Tran",
        dueDate: "Sep 25, 2026",
        priority: "High",
        status: "In Progress",
        evidenceStatus: "Attached",
        evidenceFiles: ["Backup incubator temperature mapping.pdf"],
        comments: [
          {
            author: "Lisa Tran",
            timestamp: "Sep 18, 2026 · 3:40 PM",
            text: "Mapping run complete, attaching the report for review.",
          },
        ],
      },
      {
        id: "A-202",
        department: "Facilities",
        title: "Install calibrated monitoring point for backup incubator",
        owner: "David Lee",
        dueDate: "Sep 28, 2026",
        priority: "Medium",
        status: "Open",
        evidenceStatus: "Missing",
      },
    ],
    auditTrail: [
      {
        actor: "Sarah Johnson",
        timestamp: "Aug 18, 2026 11:00 AM",
        action: "QA approved change plan",
        from: "QA Approval",
        to: "Action in Progress",
      },
      {
        actor: "Lisa Tran",
        timestamp: "Aug 10, 2026 4:20 PM",
        action: "Submitted for QA Approval",
        from: "Impact Assessment",
        to: "QA Approval",
      },
      {
        actor: "Lisa Tran",
        timestamp: "Aug 05, 2026 9:15 AM",
        action: "Submitted for Impact Assessment",
        from: "Draft",
        to: "Impact Assessment",
      },
      {
        actor: "Lisa Tran",
        timestamp: "Aug 03, 2026 8:00 AM",
        action: "Created Change Control",
      },
    ],
  },
  {
    key: "cc-2026-005",
    id: "CC-2026-005",
    title: "Retire temporary gowning room procedure",
    status: "Pending Closure",
    dateRaised: "Jul 22, 2026",
    targetImplementationDate: "Sep 25, 2026",
    owner: "John Smith",
    affectedDepartments: ["Manufacturing", "Quality Assurance"],
    raisedBy: "John Smith",
    department: "Manufacturing",
    type: "Document",
    classification: "Temporary",
    category: "Minor",
    description:
      "Retire the temporary gowning room procedure after the permanent room is released for routine operation.",
    riskAssessment: "Low risk after QA confirms training completion and document withdrawal.",
    departmentAssessments: [
      {
        department: "Manufacturing",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "The temporary gowning room procedure must be formally withdrawn once the permanent room is released.",
        signer: "John Smith",
        priority: "Medium",
      },
      {
        department: "Quality Assurance",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "QA must confirm operator retraining and archive the withdrawn procedure.",
        signer: "Sarah Johnson",
        priority: "Low",
      },
    ],
    changeActions: [
      {
        id: "A-301",
        department: "Manufacturing",
        title: "Withdraw temporary gowning room procedure from controlled documents",
        owner: "John Smith",
        dueDate: "Sep 18, 2026",
        priority: "Medium",
        status: "Done",
        evidenceStatus: "Attached",
        evidenceFiles: ["Gowning procedure withdrawal record.pdf"],
        completedAt: "Sep 17, 2026 · 10:05 AM",
        comments: [
          {
            author: "John Smith",
            timestamp: "Sep 17, 2026 · 10:05 AM",
            text: "Procedure withdrawn and archived per document control.",
          },
        ],
      },
      {
        id: "A-302",
        department: "Quality Assurance",
        title: "Confirm operator retraining on permanent gowning room",
        owner: "Sarah Johnson",
        dueDate: "Sep 20, 2026",
        priority: "Low",
        status: "Done",
        evidenceStatus: "Attached",
        evidenceFiles: ["Gowning retraining attendance log.pdf"],
        completedAt: "Sep 19, 2026 · 2:30 PM",
        comments: [
          {
            author: "Sarah Johnson",
            timestamp: "Sep 19, 2026 · 2:30 PM",
            text: "Retraining confirmed for all shift operators.",
          },
        ],
      },
    ],
    auditTrail: [
      {
        actor: "John Smith",
        timestamp: "Sep 20, 2026 8:45 AM",
        action: "All change actions completed, moved to Pending Closure",
        from: "Action in Progress",
        to: "Pending Closure",
      },
      {
        actor: "Sarah Johnson",
        timestamp: "Aug 05, 2026 1:00 PM",
        action: "QA approved change plan",
        from: "QA Approval",
        to: "Action in Progress",
      },
      {
        actor: "John Smith",
        timestamp: "Jul 28, 2026 9:30 AM",
        action: "Submitted for QA Approval",
        from: "Impact Assessment",
        to: "QA Approval",
      },
      {
        actor: "John Smith",
        timestamp: "Jul 24, 2026 10:00 AM",
        action: "Submitted for Impact Assessment",
        from: "Draft",
        to: "Impact Assessment",
      },
      {
        actor: "John Smith",
        timestamp: "Jul 22, 2026 9:00 AM",
        action: "Created Change Control",
      },
    ],
  },
  {
    key: "cc-2026-006",
    id: "CC-2026-006",
    title: "Approve new balance calibration interval",
    status: "Final QA Approval",
    dateRaised: "Jul 08, 2026",
    targetImplementationDate: "Sep 18, 2026",
    owner: "Priya Shah",
    affectedDepartments: ["Quality Control", "Metrology"],
    raisedBy: "Priya Shah",
    department: "Quality Control",
    type: "Equipment",
    classification: "Permanent",
    category: "Major",
    description:
      "Approve a new calibration interval for analytical balances based on metrology trend data.",
    riskAssessment:
      "QA must verify historical calibration performance and final evidence before closure.",
    departmentAssessments: [
      {
        department: "Quality Control",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "QC must update the calibration schedule to the new interval across all analytical balances.",
        signer: "Priya Shah",
        priority: "Medium",
      },
      {
        department: "Metrology",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "Metrology must revalidate the interval against historical drift data before rollout.",
        signer: "David Lee",
        priority: "High",
      },
    ],
    changeActions: [
      {
        id: "A-401",
        department: "Metrology",
        title: "Revalidate calibration interval against 12-month drift trend",
        owner: "David Lee",
        dueDate: "Aug 25, 2026",
        priority: "High",
        status: "Done",
        evidenceStatus: "Attached",
        evidenceFiles: ["Balance calibration trend analysis.pdf"],
        completedAt: "Aug 24, 2026 · 11:15 AM",
        comments: [
          {
            author: "David Lee",
            timestamp: "Aug 24, 2026 · 11:15 AM",
            text: "Trend analysis supports the extended interval; report attached.",
          },
        ],
      },
      {
        id: "A-402",
        department: "Quality Control",
        title: "Update calibration schedule for all analytical balances",
        owner: "Priya Shah",
        dueDate: "Aug 28, 2026",
        priority: "Medium",
        status: "Done",
        evidenceStatus: "Attached",
        evidenceFiles: ["Updated calibration schedule.pdf"],
        completedAt: "Aug 27, 2026 · 3:50 PM",
        comments: [
          {
            author: "Priya Shah",
            timestamp: "Aug 27, 2026 · 3:50 PM",
            text: "Schedule updated in the calibration management system.",
          },
        ],
      },
    ],
    auditTrail: [
      {
        actor: "Priya Shah",
        timestamp: "Sep 01, 2026 9:20 AM",
        action: "Change Owner signed off and submitted for Final QA Approval",
        from: "Pending Closure",
        to: "Final QA Approval",
      },
      {
        actor: "Priya Shah",
        timestamp: "Aug 29, 2026 8:00 AM",
        action: "All change actions completed, moved to Pending Closure",
        from: "Action in Progress",
        to: "Pending Closure",
      },
      {
        actor: "David Lee",
        timestamp: "Jul 20, 2026 10:30 AM",
        action: "QA approved change plan",
        from: "QA Approval",
        to: "Action in Progress",
      },
      {
        actor: "Priya Shah",
        timestamp: "Jul 12, 2026 2:00 PM",
        action: "Submitted for QA Approval",
        from: "Impact Assessment",
        to: "QA Approval",
      },
      {
        actor: "Priya Shah",
        timestamp: "Jul 09, 2026 9:00 AM",
        action: "Submitted for Impact Assessment",
        from: "Draft",
        to: "Impact Assessment",
      },
      {
        actor: "Priya Shah",
        timestamp: "Jul 08, 2026 8:30 AM",
        action: "Created Change Control",
      },
    ],
  },
  {
    key: "cc-2026-007",
    id: "CC-2026-007",
    title: "Close cold-room alarm threshold update",
    status: "Closed",
    dateRaised: "Jun 14, 2026",
    targetImplementationDate: "Aug 01, 2026",
    owner: "Anna Hoang",
    affectedDepartments: ["Warehouse", "Engineering", "Quality Assurance"],
    raisedBy: "Anna Hoang",
    department: "Warehouse",
    type: "Facility",
    classification: "Permanent",
    category: "Minor",
    description:
      "Close the cold-room alarm threshold update after engineering verification and QA review.",
    riskAssessment:
      "Closed with all evidence retained for inspection and alarm records updated.",
    departmentAssessments: [
      {
        department: "Warehouse",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "Warehouse team must confirm alarm response procedures reflect the new threshold.",
        signer: "Anna Hoang",
        priority: "Medium",
      },
      {
        department: "Engineering",
        impacted: true,
        status: "Impacted",
        impactSummary:
          "Engineering must reconfigure and verify the cold-room alarm threshold in the monitoring system.",
        signer: "David Lee",
        priority: "High",
      },
      {
        department: "Quality Assurance",
        impacted: false,
        status: "Not Impacted",
        impactSummary: "No change to product release criteria.",
        reason:
          "The threshold change tightens the alarm margin only; storage specifications are unchanged.",
        signer: "Sarah Johnson",
      },
    ],
    changeActions: [
      {
        id: "A-501",
        department: "Engineering",
        title: "Reconfigure cold-room alarm threshold in monitoring system",
        owner: "David Lee",
        dueDate: "Jul 20, 2026",
        priority: "High",
        status: "Done",
        evidenceStatus: "Attached",
        evidenceFiles: ["Alarm threshold configuration record.pdf"],
        completedAt: "Jul 19, 2026 · 1:20 PM",
        comments: [
          {
            author: "David Lee",
            timestamp: "Jul 19, 2026 · 1:20 PM",
            text: "Threshold updated and verified against the monitoring system log.",
          },
        ],
      },
      {
        id: "A-502",
        department: "Warehouse",
        title: "Update alarm response procedure with new threshold",
        owner: "Anna Hoang",
        dueDate: "Jul 22, 2026",
        priority: "Medium",
        status: "Done",
        evidenceStatus: "Attached",
        evidenceFiles: ["Cold-room alarm response SOP rev2.pdf"],
        completedAt: "Jul 21, 2026 · 9:40 AM",
        comments: [
          {
            author: "Anna Hoang",
            timestamp: "Jul 21, 2026 · 9:40 AM",
            text: "SOP updated and distributed to warehouse shift leads.",
          },
        ],
      },
    ],
    auditTrail: [
      {
        actor: "Sarah Johnson",
        timestamp: "Aug 01, 2026 3:00 PM",
        action: "Final QA approved and closed",
        from: "Final QA Approval",
        to: "Closed",
      },
      {
        actor: "Anna Hoang",
        timestamp: "Jul 28, 2026 10:00 AM",
        action: "Change Owner signed off and submitted for Final QA Approval",
        from: "Pending Closure",
        to: "Final QA Approval",
      },
      {
        actor: "Anna Hoang",
        timestamp: "Jul 23, 2026 9:00 AM",
        action: "All change actions completed, moved to Pending Closure",
        from: "Action in Progress",
        to: "Pending Closure",
      },
      {
        actor: "Sarah Johnson",
        timestamp: "Jul 15, 2026 11:00 AM",
        action: "QA approved change plan",
        from: "QA Approval",
        to: "Action in Progress",
      },
      {
        actor: "Anna Hoang",
        timestamp: "Jun 20, 2026 2:00 PM",
        action: "Submitted for QA Approval",
        from: "Impact Assessment",
        to: "QA Approval",
      },
      {
        actor: "Anna Hoang",
        timestamp: "Jun 16, 2026 9:00 AM",
        action: "Submitted for Impact Assessment",
        from: "Draft",
        to: "Impact Assessment",
      },
      {
        actor: "Anna Hoang",
        timestamp: "Jun 14, 2026 8:00 AM",
        action: "Created Change Control",
      },
    ],
  },
]
