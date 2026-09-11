// Mock data for the Training module prototype.
// Content mirrors flow/training-module.md §14 (Users list), §15 (User detail)
// and §20 (History record panel). Statuses are typed unions mapped to Badge
// variants so status colour is data, never markup.

export type BadgeVariant =
  | "default" | "secondary" | "success" | "warning" | "error" | "blue"

/* ── User-level training status — §16. Product-native (see the Status filter). */
export const userStatuses = ["Up to date", "Pending", "Overdue"] as const
export type UserStatus = (typeof userStatuses)[number]

export const userStatusVariant: Record<UserStatus, BadgeVariant> = {
  "Up to date": "success",
  Pending: "warning",
  Overdue: "error",
}

/* ── Assigned Assessments — unfinished work only. `Completed` belongs in history. */
export const assignmentStatuses = [
  "Assigned", "In progress", "Awaiting review",
] as const
export type AssignmentStatus = (typeof assignmentStatuses)[number]

export const assignmentStatusVariant: Record<AssignmentStatus, BadgeVariant> = {
  Assigned: "secondary",
  "In progress": "blue",
  "Awaiting review": "warning",
}

/* ── Training History — terminal states. `Completed` = finished but never
   reviewed, which is every record in the product today. See §19. */
export const historyStatuses = [
  "Approved", "Completed", "Superseded", "Rejected",
] as const
export type HistoryStatus = (typeof historyStatuses)[number]

export const historyStatusVariant: Record<HistoryStatus, BadgeVariant> = {
  Approved: "success",
  Completed: "secondary",
  Superseded: "warning",
  Rejected: "error",
}

export type TrainingUser = {
  id: string
  name: string
  email: string
  department: string
  accessLevel: string
  status: UserStatus
}

export type Assignment = {
  key: string
  course: string
  method: string
  document?: string
  assessments: number
  dueDate: string
  overdue?: boolean
  status: AssignmentStatus
}

export type Signature = {
  name: string
  meaning: string
  timestamp: string
  /** Trainee signing their own completion with no independent review. */
  selfSigned?: boolean
}

export type AuditEvent = {
  actor: string
  email?: string
  timestamp: string
  event: string
  note?: string
  /** Rendered as `old → new`, old struck through. */
  change?: { from: string; to: string }
}

export type HistoryRecord = {
  key: string
  assessmentId: string
  course: string
  method: string
  document: string
  documentVersion: string
  documentEffective: string
  /** null = still current. A string names the version that replaced it. */
  supersededBy: string | null
  /** Only meaningful when superseded: has retraining been assigned? */
  retrainingAssigned?: string | null
  assignedDate: string
  dueDate: string
  completedDate: string
  viaRole: string
  score?: string
  evidence?: { filename: string; size: string; uploaded: string }
  signatures: Signature[]
  auditTrail: AuditEvent[]
  status: HistoryStatus
}

export const trainingUsers: TrainingUser[] = [
  {
    id: "amit-kothari",
    name: "Amit Kothari",
    email: "amit@accura.one",
    department: "Quality Assurance",
    accessLevel: "Trainee",
    status: "Overdue",
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    email: "sarah@accura.one",
    department: "Quality Assurance",
    accessLevel: "Training Manager",
    status: "Up to date",
  },
  {
    id: "lena-fischer",
    name: "Lena Fischer",
    email: "lena@accura.one",
    department: "Manufacturing",
    accessLevel: "Trainee",
    status: "Pending",
  },
  {
    id: "tom-reilly",
    name: "Tom Reilly",
    email: "tom@accura.one",
    department: "Manufacturing",
    accessLevel: "Trainee",
    status: "Up to date",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    email: "priya@accura.one",
    department: "Engineering",
    accessLevel: "Trainee",
    status: "Up to date",
  },
]

export type RoleCourse = {
  key: string
  course: string
  method: string
  /** null = the course has no linked document (a quiz, say). */
  document: string | null
  /** Set when an earlier version of the document was superseded. */
  supersededFrom?: string
  assessments: number
}

export type RoleMember = {
  id: string
  name: string
  email: string
  department: string
  /** Outstanding assessments for THIS role's courses only, not overall. */
  outstanding: number
  status: UserStatus
  /** What removing this user from the role would affect — see §21 Q27.
   *  Completed records are never deleted; they are evidence. */
  impact: { notStarted: number; inProgress: number; completed: number }
}

export type TrainingRole = {
  id: string
  name: string
  description: string
  courses: number
  users: number
  /** Sum of assessments across the role's courses — derived, not stored. */
  assessments: number
  courseList: RoleCourse[]
  /** A page of members, not all of them — `users` holds the true count. */
  memberSample: RoleMember[]
}

export const trainingRoles: TrainingRole[] = [
  {
    id: "qa-analyst",
    name: "QA analyst",
    description: "Analysts in the QA team",
    courses: 4,
    users: 12,
    assessments: 6,
    courseList: [
      { key: "document-control", course: "Document control", method: "Read & acknowledge", document: "SOP-002 v3.0", assessments: 2 },
      { key: "equipment-calibration", course: "Equipment calibration", method: "Acknowledge", document: "SOP-001 v2.0", supersededFrom: "v1.0", assessments: 2 },
      { key: "annual-gmp", course: "Annual GMP refresher", method: "Quiz", document: null, assessments: 1 },
      { key: "data-integrity", course: "Data integrity", method: "Read & acknowledge", document: "SOP-021 v1.0", assessments: 1 },
    ],
    memberSample: [
      { id: "amit-kothari", name: "Amit Kothari", email: "amit@accura.one", department: "Quality Assurance", outstanding: 3, status: "Overdue", impact: { notStarted: 2, inProgress: 1, completed: 4 } },
      { id: "lena-fischer", name: "Lena Fischer", email: "lena@accura.one", department: "Manufacturing", outstanding: 1, status: "Pending", impact: { notStarted: 1, inProgress: 0, completed: 2 } },
      { id: "sarah-johnson", name: "Sarah Johnson", email: "sarah@accura.one", department: "Quality Assurance", outstanding: 0, status: "Up to date", impact: { notStarted: 0, inProgress: 0, completed: 4 } },
      { id: "tom-reilly", name: "Tom Reilly", email: "tom@accura.one", department: "Manufacturing", outstanding: 0, status: "Up to date", impact: { notStarted: 0, inProgress: 0, completed: 4 } },
    ],
  },
  {
    id: "cleanroom-access",
    name: "Cleanroom access",
    description: "Anyone entering grade C",
    courses: 2,
    users: 28,
    assessments: 3,
    courseList: [
      { key: "cleanroom-gowning", course: "Cleanroom gowning", method: "Practical", document: null, assessments: 2 },
      { key: "waste-segregation", course: "Waste segregation", method: "Quiz", document: "SOP-030 v2.0", assessments: 1 },
    ],
    memberSample: [
      { id: "amit-kothari", name: "Amit Kothari", email: "amit@accura.one", department: "Quality Assurance", outstanding: 1, status: "Pending", impact: { notStarted: 1, inProgress: 0, completed: 2 } },
    ],
  },
  {
    id: "admin-role",
    name: "Admin role",
    description: "Admin role desc",
    courses: 1,
    users: 1,
    assessments: 2,
    courseList: [
      { key: "admin-course", course: "Admin course", method: "Acknowledge", document: "SOP-014 v1.0", assessments: 2 },
    ],
    memberSample: [
      { id: "sarah-johnson", name: "Sarah Johnson", email: "sarah@accura.one", department: "Quality Assurance", outstanding: 0, status: "Up to date", impact: { notStarted: 0, inProgress: 0, completed: 4 } },
    ],
  },
  {
    id: "test-training-role",
    name: "Test training role",
    description: "Desc",
    courses: 2,
    users: 1,
    assessments: 2,
    courseList: [
      { key: "how-to-use-eqms", course: "How to use eQMS", method: "Read & acknowledge", document: "SOP-014 v1.0", assessments: 1 },
      { key: "admin-course-2", course: "Admin course", method: "Quiz", document: null, assessments: 1 },
    ],
    memberSample: [
      { id: "lena-fischer", name: "Lena Fischer", email: "lena@accura.one", department: "Manufacturing", outstanding: 0, status: "Up to date", impact: { notStarted: 0, inProgress: 0, completed: 4 } },
    ],
  },
  {
    /* Courses but nobody in it — a real finding, and the reason the count is a
       column rather than card-footer prose. */
    id: "warehouse-operative",
    name: "Warehouse operative",
    description: "Goods-in and dispatch",
    courses: 3,
    users: 0,
    assessments: 4,
    courseList: [
      { key: "goods-in", course: "Goods-in inspection", method: "Practical", document: null, assessments: 2 },
      { key: "dispatch", course: "Dispatch procedure", method: "Read & acknowledge", document: "SOP-040 v1.0", assessments: 1 },
      { key: "manual-handling", course: "Manual handling", method: "Quiz", document: null, assessments: 1 },
    ],
    memberSample: [],
  },
]

/* The user detail rail shows the same roles — derived, never re-typed, so the
   two screens cannot drift apart. */
export const assignedRoles = trainingRoles.filter((role) =>
  ["qa-analyst", "cleanroom-access"].includes(role.id)
)

export const assignedAssessments: Assignment[] = [
  {
    key: "cleanroom-gowning",
    course: "Cleanroom gowning",
    method: "Practical",
    assessments: 1,
    dueDate: "8 Sep 2026",
    overdue: true,
    status: "Awaiting review",
  },
  {
    key: "equipment-calibration-v2",
    course: "Equipment calibration",
    method: "Acknowledge",
    document: "SOP-001 v2.0",
    assessments: 1,
    dueDate: "6 Sep 2026",
    overdue: true,
    status: "In progress",
  },
  {
    key: "annual-gmp",
    course: "Annual GMP refresher",
    method: "Quiz",
    assessments: 3,
    dueDate: "30 Sep 2026",
    status: "In progress",
  },
  {
    key: "data-integrity",
    course: "Data integrity",
    method: "Read & acknowledge",
    document: "SOP-021 v1.0",
    assessments: 1,
    dueDate: "15 Oct 2026",
    status: "Assigned",
  },
]

export const trainingHistory: HistoryRecord[] = [
  {
    key: "document-control",
    assessmentId: "ACME/ASMT/2026/000004",
    course: "Document control",
    method: "Read & acknowledge",
    document: "SOP-002 Document control",
    documentVersion: "Version 3.0",
    documentEffective: "effective 1 Mar 2026",
    supersededBy: null,
    assignedDate: "2 Sep 2026",
    dueDate: "15 Sep 2026",
    completedDate: "9 Sep 2026",
    viaRole: "QA analyst",
    evidence: {
      filename: "gowning-checklist-signed.pdf",
      size: "218 KB",
      uploaded: "9 Sep 2026",
    },
    signatures: [
      { name: "Amit Kothari", meaning: "Assessment completion", timestamp: "9 Sep 2026, 14:02" },
      { name: "Sarah Johnson", meaning: "Training Manager sign-off", timestamp: "10 Sep 2026, 09:15" },
    ],
    auditTrail: [
      {
        actor: "Sarah Johnson", email: "sarah@accura.one",
        timestamp: "10 Sep 2026, 09:15",
        event: "Signed (Training Manager sign-off)",
        change: { from: "Awaiting review", to: "Approved" },
      },
      {
        actor: "Amit Kothari", email: "amit@accura.one",
        timestamp: "9 Sep 2026, 14:02",
        event: "Signed (Assessment completion)",
        note: "Evidence attached: gowning-checklist-signed.pdf",
        change: { from: "In progress", to: "Awaiting review" },
      },
      {
        actor: "Amit Kothari", email: "amit@accura.one",
        timestamp: "4 Sep 2026, 10:38",
        event: "Opened SOP-002 v3.0",
        change: { from: "Assigned", to: "In progress" },
      },
      {
        actor: "System",
        timestamp: "2 Sep 2026, 08:00",
        event: "Created",
        note: "Assigned via role QA analyst · due 15 Sep 2026",
      },
    ],
    status: "Approved",
  },
  {
    key: "how-to-use-eqms",
    assessmentId: "ACME/ASMT/2026/000002",
    course: "How to use eQMS",
    method: "Read & acknowledge",
    document: "SOP-014 Using the eQMS",
    documentVersion: "Version 1.0",
    documentEffective: "effective 4 Jan 2026",
    supersededBy: null,
    assignedDate: "3 Sep 2026",
    dueDate: "17 Sep 2026",
    completedDate: "10 Sep 2026",
    viaRole: "QA analyst",
    signatures: [
      {
        name: "Amit Kothari", meaning: "Assessment completion",
        timestamp: "10 Sep 2026, 12:59", selfSigned: true,
      },
    ],
    auditTrail: [
      {
        actor: "Amit Kothari", email: "amit@accura.one",
        timestamp: "10 Sep 2026, 12:59",
        event: "Signed (Assessment completion)",
        change: { from: "Pending", to: "Completed" },
      },
      {
        actor: "System",
        timestamp: "3 Sep 2026, 08:00",
        event: "Created",
        note: "Assigned via role QA analyst · due 17 Sep 2026",
      },
    ],
    status: "Completed",
  },
  {
    key: "equipment-calibration-v1",
    assessmentId: "ACME/ASMT/2026/000001",
    course: "Equipment calibration",
    method: "Acknowledge",
    document: "SOP-001 Equipment calibration",
    documentVersion: "Version 1.0",
    documentEffective: "effective 2 Jan 2026",
    supersededBy: "v2.0",
    retrainingAssigned: "6 Sep 2026",
    assignedDate: "1 Mar 2026",
    dueDate: "20 Mar 2026",
    completedDate: "14 Mar 2026",
    viaRole: "QA analyst",
    signatures: [
      { name: "Amit Kothari", meaning: "Assessment completion", timestamp: "14 Mar 2026, 11:20" },
      { name: "Sarah Johnson", meaning: "Training Manager sign-off", timestamp: "15 Mar 2026, 08:40" },
    ],
    auditTrail: [
      {
        actor: "System",
        timestamp: "6 Sep 2026, 08:00",
        event: "Superseded by SOP-001 v2.0",
        note: "Retraining assigned · due 6 Sep 2026",
        change: { from: "Approved", to: "Superseded" },
      },
      {
        actor: "Sarah Johnson", email: "sarah@accura.one",
        timestamp: "15 Mar 2026, 08:40",
        event: "Signed (Training Manager sign-off)",
        change: { from: "Awaiting review", to: "Approved" },
      },
      {
        actor: "Amit Kothari", email: "amit@accura.one",
        timestamp: "14 Mar 2026, 11:20",
        event: "Signed (Assessment completion)",
        change: { from: "In progress", to: "Awaiting review" },
      },
      {
        actor: "System",
        timestamp: "1 Mar 2026, 08:00",
        event: "Created",
        note: "Assigned via role QA analyst · due 20 Mar 2026",
      },
    ],
    status: "Superseded",
  },
  {
    key: "waste-segregation",
    assessmentId: "ACME/ASMT/2026/000003",
    course: "Waste segregation",
    method: "Quiz",
    document: "SOP-030 Waste segregation",
    documentVersion: "Version 2.0",
    documentEffective: "effective 12 Jun 2026",
    supersededBy: null,
    assignedDate: "10 Aug 2026",
    dueDate: "31 Aug 2026",
    completedDate: "21 Aug 2026",
    viaRole: "Cleanroom access",
    score: "scored 4 of 10",
    signatures: [
      { name: "Amit Kothari", meaning: "Assessment completion", timestamp: "21 Aug 2026, 16:05" },
      { name: "Sarah Johnson", meaning: "Training Manager review", timestamp: "22 Aug 2026, 10:12" },
    ],
    auditTrail: [
      {
        actor: "Sarah Johnson", email: "sarah@accura.one",
        timestamp: "22 Aug 2026, 10:12",
        event: "Rejected (Training Manager review)",
        note: "Reason: Assessment score below pass mark",
        change: { from: "Awaiting review", to: "Rejected" },
      },
      {
        actor: "Amit Kothari", email: "amit@accura.one",
        timestamp: "21 Aug 2026, 16:05",
        event: "Signed (Assessment completion)",
        note: "Quiz scored 4 of 10",
        change: { from: "In progress", to: "Awaiting review" },
      },
      {
        actor: "System",
        timestamp: "10 Aug 2026, 08:00",
        event: "Created",
        note: "Assigned via role Cleanroom access · due 31 Aug 2026",
      },
    ],
    status: "Rejected",
  },
]

/* Trigger mode — the brief's three schedule types (Q8), labelled exactly as
   the Edit Course segmented control labels them. Rendered as a badge rather
   than grey footer prose: this is the mechanism that makes the module a system
   rather than a list, and `No automatic trigger` means the course never
   assigns itself. See Q31. */
export const triggerModes = [
  "Specific date",
  "Recurring period",
  "No automatic trigger",
] as const
export type TriggerMode = (typeof triggerModes)[number]

export const triggerVariant: Record<TriggerMode, BadgeVariant> = {
  "Specific date": "blue",
  "Recurring period": "success",
  "No automatic trigger": "secondary",
}

/* Round-level lifecycle (§16). The words match the participant record's one
   level up — Q18's collision — so the two maps are kept separate deliberately.
   A round is `Completed` when every participant is; that is not the same event
   as any one person completing. */
export const roundStatuses = ["Assigned", "In progress", "Completed"] as const
export type RoundStatus = (typeof roundStatuses)[number]

export const roundStatusVariant: Record<RoundStatus, BadgeVariant> = {
  Assigned: "secondary",
  "In progress": "blue",
  Completed: "success",
}

export type AssessmentRound = {
  id: string
  name: string
  due: string
  completed: number
  total: number
  status: RoundStatus
}

export type Course = {
  id: string
  name: string
  description: string
  /** Assessment *methods* — the course definition. Not rounds. See Q28. */
  methods: string[]
  /** Assessment *rounds* sent from this course. */
  assessments: number
  roles: number
  trigger: TriggerMode
  /** Only set when the trigger is a specific date or a recurring period. */
  triggerDetail?: string
  /** The course definition — method plus the document VERSION it binds (Q29). */
  methodDetail?: { method: string; document?: string }[]
  /** Rounds sent from this course. */
  rounds?: AssessmentRound[]
}

/* Every course in the module. The Roles form picks from this. */
export const allCourses: Course[] = [
  {
    id: "document-control",
    name: "Document control",
    description: "Raising, reviewing and issuing controlled documents",
    methods: ["Read & acknowledge"],
    assessments: 2,
    roles: 1,
    trigger: "Specific date",
    triggerDetail: "30 Sep 2026",
    methodDetail: [
      { method: "Read & acknowledge", document: "SOP-002 v3.0 · Document control" },
    ],
    rounds: [
      /* One closed round, one open. Two open rounds of the same course at once
         would mean a person owing it twice — see Q33. */
      { id: "asmt-0004", name: "Document control - Assessment", due: "15 Jun 2026", completed: 12, total: 12, status: "Completed" },
      { id: "asmt-0009", name: "Document control - Assessment 2", due: "30 Sep 2026", completed: 3, total: 12, status: "In progress" },
    ],
  },
  {
    id: "equipment-calibration",
    name: "Equipment calibration",
    description: "Calibration schedule and out-of-tolerance handling",
    methods: ["Acknowledge"],
    assessments: 2,
    roles: 1,
    trigger: "Recurring period",
    triggerDetail: "every 12 months",
  },
  {
    id: "annual-gmp",
    name: "Annual GMP refresher",
    description: "Yearly refresher on good manufacturing practice",
    methods: ["Quiz"],
    assessments: 1,
    roles: 2,
    trigger: "Recurring period",
    triggerDetail: "every 12 months",
  },
  {
    id: "data-integrity",
    name: "Data integrity",
    description: "ALCOA+ principles and record-keeping",
    methods: ["Read & acknowledge"],
    assessments: 1,
    roles: 1,
    trigger: "Specific date",
    triggerDetail: "15 Oct 2026",
  },
  {
    id: "cleanroom-gowning",
    name: "Cleanroom gowning",
    description: "Gowning procedure for grade C areas",
    methods: ["Practical"],
    assessments: 2,
    roles: 1,
    trigger: "No automatic trigger",
  },
  {
    id: "waste-segregation",
    name: "Waste segregation",
    description: "Sorting and disposal of process waste",
    methods: ["Quiz"],
    assessments: 1,
    roles: 1,
    trigger: "No automatic trigger",
  },
  {
    id: "how-to-use-eqms",
    name: "How to use eQMS",
    description: "Navigating the quality management system",
    methods: ["Read & acknowledge", "Quiz"],
    assessments: 1,
    roles: 2,
    trigger: "Specific date",
    triggerDetail: "30 Sep 2026",
  },
  {
    id: "goods-in",
    name: "Goods-in inspection",
    description: "Receiving, checking and booking in deliveries",
    methods: ["Practical", "Written"],
    assessments: 2,
    /* No role links it — nobody is trained on it. Visible as a 0. */
    roles: 0,
    trigger: "No automatic trigger",
  },
]

/* Dropdown options — derived from the lists above, never re-typed. */
export const courseOptions = allCourses.map((course) => ({
  value: course.id,
  label: course.name,
}))

export const userOptions = trainingUsers.map((user) => ({
  value: user.id,
  label: `${user.name} · ${user.department}`,
}))

/* Assessment methods a course can carry — the brief's four types. */
export const assessmentMethods = [
  "Acknowledge",
  "Read & acknowledge",
  "Quiz",
  "Written",
  "Practical",
] as const
export type AssessmentMethod = (typeof assessmentMethods)[number]

/* Methods that attach a controlled document; the rest capture a response. */
export const documentBackedMethods: readonly string[] = [
  "Acknowledge",
  "Read & acknowledge",
]

/* Controlled documents, each pinned to a VERSION — see Q29. A course bound to
   a document rather than a document version cannot evidence what anyone was
   trained on. */
export const documentOptions = [
  { value: "sop-001-v2", label: "SOP-001 v2.0 · Equipment calibration" },
  { value: "sop-002-v3", label: "SOP-002 v3.0 · Document control" },
  { value: "sop-014-v1", label: "SOP-014 v1.0 · Using the eQMS" },
  { value: "sop-021-v1", label: "SOP-021 v1.0 · Data integrity" },
  { value: "sop-030-v2", label: "SOP-030 v2.0 · Waste segregation" },
  { value: "sop-040-v1", label: "SOP-040 v1.0 · Dispatch procedure" },
]

export const roleOptions = trainingRoles.map((role) => ({
  value: role.id,
  label: role.name,
}))

/* Every assessment round in the module, across all courses. The Assessments
   tab lists these — level 2, a batch sent to a group. Not one person's record,
   which is Participant Progress. */
/* One person inside a round — level 3, Participant Progress. */
export type Participant = {
  id: string
  name: string
  email: string
  status: "Assigned" | "In progress" | "Completed"
  completedDate?: string
  signedBy?: string
  comment?: string
}

export type AssessmentListRow = AssessmentRound & {
  courseId: string
  course: string
  overdue?: boolean
  notes?: string
  created?: string
  participants?: Participant[]
  /** Round-level audit trail. Whether the product's trail is the round's or
      the participant's is unresolved — see Q20. */
  auditTrail?: AuditEvent[]
}

export const assessmentRounds: AssessmentListRow[] = [
  {
    id: "asmt-0011", courseId: "annual-gmp", course: "Annual GMP refresher",
    name: "Annual GMP refresher - Assessment 3", due: "30 Sep 2026",
    completed: 18, total: 31, status: "In progress",
  },
  {
    id: "asmt-0007", courseId: "equipment-calibration", course: "Equipment calibration",
    name: "Equipment calibration - Assessment 2", due: "6 Sep 2026",
    completed: 11, total: 12, status: "In progress", overdue: true,
    notes: "Triggered by SOP-001 moving to v2.0. Everyone trained on v1.0 must re-acknowledge.",
    created: "6 Aug 2026",
    auditTrail: [
      {
        actor: "Priya Nair", email: "priya@accura.one",
        timestamp: "21 Aug 2026, 09:14",
        event: "Signed (Assessment completion)",
        change: { from: "In progress", to: "Completed" },
      },
      {
        actor: "Tom Reilly", email: "tom@accura.one",
        timestamp: "19 Aug 2026, 16:41",
        event: "Signed (Assessment completion)",
        change: { from: "In progress", to: "Completed" },
      },
      {
        actor: "System",
        timestamp: "6 Aug 2026, 08:00",
        event: "Created",
        note: "Triggered by SOP-001 v2.0 · assigned to 12 users via QA analyst",
      },
    ],
    participants: [
      { id: "amit-kothari", name: "Amit Kothari", email: "amit@accura.one", status: "In progress" },
      { id: "sarah-johnson", name: "Sarah Johnson", email: "sarah@accura.one", status: "Completed", completedDate: "12 Aug 2026", signedBy: "Sarah Johnson" },
      { id: "lena-fischer", name: "Lena Fischer", email: "lena@accura.one", status: "Completed", completedDate: "14 Aug 2026", signedBy: "Lena Fischer", comment: "Re-read section 4" },
      { id: "tom-reilly", name: "Tom Reilly", email: "tom@accura.one", status: "Completed", completedDate: "19 Aug 2026", signedBy: "Tom Reilly" },
      { id: "priya-nair", name: "Priya Nair", email: "priya@accura.one", status: "Completed", completedDate: "21 Aug 2026", signedBy: "Priya Nair" },
    ],
  },
  {
    id: "asmt-0002", courseId: "how-to-use-eqms", course: "How to use eQMS",
    name: "How to use eQMS - Assessment 1", due: "17 Sep 2026",
    completed: 9, total: 14, status: "In progress",
  },
  {
    id: "asmt-0009", courseId: "document-control", course: "Document control",
    name: "Document control - Assessment 2", due: "30 Sep 2026",
    completed: 3, total: 12, status: "In progress",
  },
  {
    id: "asmt-0010", courseId: "data-integrity", course: "Data integrity",
    name: "Data integrity - Assessment 1", due: "15 Oct 2026",
    completed: 5, total: 12, status: "In progress",
  },
  {
    id: "asmt-0012", courseId: "cleanroom-gowning", course: "Cleanroom gowning",
    name: "Cleanroom gowning - Assessment 1", due: "8 Sep 2026",
    completed: 21, total: 28, status: "In progress", overdue: true,
  },
  {
    id: "asmt-0004", courseId: "document-control", course: "Document control",
    name: "Document control - Assessment", due: "15 Jun 2026",
    completed: 12, total: 12, status: "Completed",
  },
  {
    id: "asmt-0003", courseId: "waste-segregation", course: "Waste segregation",
    name: "Waste segregation - Assessment 1", due: "31 Aug 2026",
    completed: 28, total: 28, status: "Completed",
  },
]

/* The Review queue — participant records awaiting a manager's signature.
 *
 * Only methods that are NOT self-evidencing reach here (Q10): Practical,
 * Written, and failed quizzes. Acknowledge, Read & acknowledge and passed
 * quizzes never enter the queue, which is what stops it filling with records
 * nobody needs to read. */
export type ReviewItem = {
  id: string
  userId: string
  name: string
  department: string
  course: string
  method: string
  /** Days since the trainee completed and signed. The primary sort. */
  waitingDays: number
  due: string
  overdue?: boolean
  /** What reviewing this will involve — visible before opening. */
  evidence: string
  evidenceIsFile?: boolean
  /** Set on a failed auto-graded quiz — the Q14 case with no defined route. */
  score?: string
  document?: string
}

export const reviewItems: ReviewItem[] = [
  {
    id: "rev-001", userId: "amit-kothari", name: "Amit Kothari",
    department: "Quality Assurance", course: "Cleanroom gowning",
    method: "Practical", waitingDays: 9, due: "8 Sep 2026", overdue: true,
    evidence: "gowning-checklist.pdf", evidenceIsFile: true,
  },
  {
    id: "rev-002", userId: "tom-reilly", name: "Tom Reilly",
    department: "Manufacturing", course: "Goods-in inspection",
    method: "Written", waitingDays: 6, due: "22 Sep 2026",
    evidence: "Written answer",
  },
  {
    id: "rev-003", userId: "lena-fischer", name: "Lena Fischer",
    department: "Manufacturing", course: "Waste segregation",
    method: "Quiz", waitingDays: 3, due: "30 Sep 2026",
    evidence: "10 answers", score: "scored 4 of 10 — failed",
    document: "SOP-030 v2.0",
  },
  {
    id: "rev-004", userId: "priya-nair", name: "Priya Nair",
    department: "Engineering", course: "Cleanroom gowning",
    method: "Practical", waitingDays: 1, due: "22 Oct 2026",
    evidence: "gowning-priya.jpg", evidenceIsFile: true,
  },
]

/* Excluded from the reviewer's own queue — a manager signing off their own
   training is an audit finding in a GxP system (Q6). */
export const ownRecordsAwaitingOtherManager = 2

/* Structured rejection reasons (Q15). An auditor seeing `rejected then
   approved` will ask what changed, so the reason is not free text alone. */
export const rejectionReasons = [
  "Evidence insufficient",
  "Did not meet required standard",
  "Wrong document version",
  "Other",
] as const

/* The signed-in reviewer. Their own records are excluded from their queue. */
export const currentUser = {
  name: "Sarah Johnson",
  email: "sarah@accura.one",
  roleAtSignOff: "Training Manager",
}
