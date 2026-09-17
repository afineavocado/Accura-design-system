/* Settings mock data — source: flow/Setting Module 2026-Sep-17
 * (Setting_Module_Metadata_and_Screens.md v1.1). Section references (§) point there.
 *
 * `inUse` is a MOCK: the spec requires a delete guard for referenced values (§7)
 * but gives no counts. A few rows carry one so the guard can be reviewed. */

export type LookupRow = {
  id: string
  name: string
  description: string
  abbreviation?: string
  /** Number of live records referencing this value. Mock. */
  inUse?: number
}

export type LookupTab = {
  kind: "lookup"
  slug: string
  label: string
  heading: string
  subtitle?: string
  /** Entity for "Add {entity}" / "Edit {entity}" copy. */
  entity: string
  /** Plural, lower case, for the list summary. */
  noun: string
  searchable?: boolean
  /** Order carries meaning (Low → Critical) — rows can be moved. */
  ordered?: boolean
  withAbbreviation?: boolean
  rows: LookupRow[]
}

export type FormTab = {
  kind: "record-numbering" | "preferences" | "users" | "roles"
  slug: string
  label: string
  heading: string
  subtitle?: string
}

export type SettingsTab = LookupTab | FormTab

export type SettingsSection = {
  slug: string
  label: string
  icon: "organisation" | "documents" | "training" | "capa" | "change" | "deviations" | "users"
  tabs: SettingsTab[]
}

let seq = 0
const rows = (items: [string, string?, number?][]): LookupRow[] =>
  items.map(([name, description = "", inUse]) => ({
    id: `row-${++seq}`,
    name,
    description,
    inUse,
  }))

export const settingsSections: SettingsSection[] = [
  {
    slug: "organisation",
    label: "Organisation",
    icon: "organisation",
    tabs: [
      {
        kind: "record-numbering",
        slug: "record-numbering",
        label: "Record Numbering",
        heading: "Record Numbering",
        subtitle:
          "Define how record numbers are generated. The organisation prefix and document type are always included.",
      },
      {
        kind: "lookup",
        slug: "business-units",
        label: "Business Units",
        heading: "Business Units",
        subtitle: "Optional groupings of departments or teams within your organisation.",
        entity: "Unit",
        noun: "business units",
        rows: rows([["Sydney", "AU", 3]]),
      },
      {
        kind: "lookup",
        slug: "departments",
        label: "Departments",
        heading: "Departments",
        subtitle: "Manage the departments used across your organisation.",
        entity: "department",
        noun: "departments",
        searchable: true,
        rows: rows([
          ["Engineering", "Engineering Desc", 4],
          ["Quality Control", "Quality Control", 12],
          ["Reg Affairs", "Regulatory Affairs"],
        ]),
      },
      {
        kind: "preferences",
        slug: "preferences",
        label: "Preferences",
        heading: "Preferences",
        subtitle: "How dates, times and language are displayed across your QMS.",
      },
    ],
  },
  {
    slug: "documents",
    label: "Documents",
    icon: "documents",
    tabs: [
      {
        kind: "lookup",
        slug: "document-types",
        label: "Document Types",
        heading: "Document Types",
        subtitle:
          "Configure the document types used across the QMS. The abbreviation drives Document ID generation (e.g. SOP-001).",
        entity: "Type",
        noun: "document types",
        withAbbreviation: true,
        rows: [
          { id: "dt-1", name: "Standard Operating Procedure", abbreviation: "SOP", description: "Controlled procedures for operational processes", inUse: 18 },
          { id: "dt-2", name: "Work Instruction", abbreviation: "WI", description: "Step-by-step instructions for specific tasks", inUse: 7 },
          { id: "dt-3", name: "Policy", abbreviation: "POL", description: "High-level organisational directives and principles" },
          { id: "dt-4", name: "Form", abbreviation: "FRM", description: "Blank templates used to record data and evidence" },
          { id: "dt-5", name: "Specification", abbreviation: "SPEC", description: "Technical requirements and acceptance criteria" },
        ],
      },
    ],
  },
  {
    slug: "training",
    label: "Training",
    icon: "training",
    tabs: [
      {
        kind: "lookup",
        slug: "delivery-types",
        label: "Delivery Types",
        heading: "Delivery Types",
        subtitle: "Methods by which training is delivered to personnel.",
        entity: "Type",
        noun: "delivery types",
        rows: rows([
          ["Classroom", "In-person instructor-led training", 5],
          ["Online / e-Learning", "Self-paced digital course"],
          ["Virtual Classroom", "Live remote instructor-led session"],
          ["Read & Understand", "Read a controlled document and attest understanding", 9],
        ]),
      },
      {
        kind: "lookup",
        slug: "assessment-methods",
        label: "Assessment Methods",
        heading: "Assessment Methods",
        subtitle: "Methods used to assess training completion and competency.",
        entity: "Method",
        noun: "assessment methods",
        rows: rows([
          ["Quiz", "Multiple-choice or short-answer knowledge check", 6],
          ["Practical Demonstration", "Observed hands-on demonstration of competency"],
          ["Written Assessment", "Long-form written evaluation"],
          ["On the job training", "Competency assessed during supervised on-the-job performance"],
        ]),
      },
    ],
  },
  {
    slug: "capa",
    label: "CAPA",
    icon: "capa",
    tabs: [
      {
        kind: "lookup", slug: "sources", label: "Sources", heading: "CAPA Sources", subtitle: "Events that can trigger a CAPA. Shown in the Source field when a CAPA is created.",
        entity: "Source", noun: "sources",
        rows: rows([["Deviation", "", 4], ["Audit"], ["Complaint"], ["Risk Assessment"], ["Management Review"], ["Standalone"]]),
      },
      {
        kind: "lookup", slug: "classifications", label: "Classifications", heading: "CAPA Classifications", subtitle: "Whether an action corrects an existing problem or prevents a potential one.",
        entity: "Classification", noun: "classifications",
        rows: rows([["Corrective Action", "", 6], ["Preventive Action"]]),
      },
      {
        kind: "lookup", slug: "priorities", label: "Priorities", heading: "CAPA Priorities", subtitle: "Urgency levels for triaging CAPAs, from lowest to highest.", ordered: true,
        entity: "Priority", noun: "priorities",
        rows: rows([["Low"], ["Medium", "", 2], ["High"], ["Critical"]]),
      },
    ],
  },
  {
    slug: "change-management",
    label: "Change Control",
    icon: "change",
    tabs: [
      {
        kind: "lookup", slug: "change-types", label: "Change Types", heading: "Change Types", subtitle: "What a change request affects. Shown in the Change Type field.",
        entity: "Type", noun: "change types",
        rows: rows([["Document Change", "", 3], ["Process Change"], ["Equipment Change"], ["Facility Change"], ["System Change"], ["Supplier Change"]]),
      },
      {
        kind: "lookup", slug: "categories", label: "Categories", heading: "Change Categories", subtitle: "The scale of a change, used to route it to the right approval level.", ordered: true,
        entity: "Category", noun: "categories",
        rows: rows([["Minor"], ["Major"], ["Critical"]]),
      },
    ],
  },
  {
    slug: "deviations",
    label: "Deviations",
    icon: "deviations",
    tabs: [
      {
        kind: "lookup", slug: "types", label: "Types", heading: "Deviation Types", subtitle: "Where a deviation or non-conformance occurred. Shown in the Incident Type field.", searchable: true,
        entity: "Type", noun: "deviation types",
        rows: rows([["Document"], ["Process", "", 5], ["Equipment"], ["Facility"], ["Utility"], ["Computer System"], ["Material"], ["Supplier"], ["Regulatory"], ["Analytical Method"]]),
      },
      {
        kind: "lookup", slug: "categories", label: "Categories", heading: "Deviation Categories", subtitle: "GMP impact classification for deviations, from lowest to highest.", ordered: true,
        entity: "Category", noun: "categories",
        rows: rows([["Minor"], ["Major"], ["Critical"]]),
      },
      {
        // Spec §16 heading is "Severities" — breaks the {Section} {Tab} rule in §21.5. Audit A5.
        kind: "lookup", slug: "severities", label: "Severities", heading: "Severities", subtitle: "Risk-severity labels for deviations, from lowest to highest.", ordered: true,
        entity: "Severity", noun: "severities",
        rows: rows([["Low"], ["Medium"], ["High"]]),
      },
      {
        kind: "lookup", slug: "root-cause-categories", label: "Root Cause Categories", heading: "Root Cause Categories", subtitle: "Groupings used when investigating the root cause of a deviation.",
        entity: "Category", noun: "root cause categories",
        rows: rows([["Human Error"], ["Equipment / Facility"], ["Process / Method"], ["Material"], ["Environmental"]]),
      },
      {
        kind: "lookup", slug: "root-cause-methods", label: "Root Cause Methods", heading: "Root Cause Methods", subtitle: "Investigation techniques approved for root cause analysis.",
        entity: "Method", noun: "root cause methods",
        rows: rows([["5 Whys"], ["Fishbone (Ishikawa)"], ["Fault Tree Analysis"], ["FMEA"]]),
      },
    ],
  },
  {
    slug: "users",
    label: "Users",
    icon: "users",
    tabs: [
      {
        kind: "users", slug: "users", label: "Users", heading: "Users",
        subtitle: "Add users and assign their per-module and global roles.",
      },
      {
        kind: "roles", slug: "roles", label: "Roles & Permissions", heading: "Roles & Permissions",
        subtitle:
          "Fine-grained roles are scoped per module. A user can hold different roles in different modules (e.g. Author in Documents, Reviewer in CAPA).",
      },
    ],
  },
]

export const settingsHref = (section: string, tab?: string) =>
  `/prototype/accura/settings/${section}${tab ? `/${tab}` : ""}`

/* ── RBAC (§5, §19, §20) ─────────────────────────────────────────────── */

export const moduleRoles: { module: string; roles: string[] }[] = [
  { module: "Documents", roles: ["Author", "Reviewer", "QA Approver"] },
  { module: "Training", roles: ["Training Creator", "Approver"] },
  { module: "Change Control", roles: ["Change Owner", "Change Reviewer", "QA Approver"] },
  { module: "Deviation", roles: ["Deviation Creator", "Deviation Owner", "Deviation Reviewer", "QA Approver"] },
  { module: "CAPA", roles: ["CAPA Creator", "CAPA Owner", "CAPA Reviewer (Action Approver)", "QA Approver"] },
]

export const globalRoles = [
  { role: "Admin", description: "Create users, define user roles, and manage system configuration." },
  { role: "Super QA User", description: "Can act as the QA Approver for every module." },
  { role: "Super User", description: "Can act as the reviewer for every module." },
] as const

export type SettingsUser = {
  id: string
  name: string
  email: string
  /** "Module: Role" keys. */
  moduleRoles: string[]
  globalRoles: string[]
  /** Mock — not in spec. */
  status: "Active" | "Invited"
}

export const initialUsers: SettingsUser[] = [
  {
    id: "u-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    moduleRoles: ["Documents: QA Approver", "CAPA: QA Approver"],
    globalRoles: ["Super QA User"],
    status: "Active",
  },
  {
    id: "u-2",
    name: "James O'Brien",
    email: "james.obrien@example.com",
    moduleRoles: ["Documents: Author", "Deviation: Deviation Creator"],
    globalRoles: [],
    status: "Invited",
  },
]

/* ── Form options — MOCK. The spec gives only current values (audit B4, B5). ── */

export const separatorOptions = [
  { value: "-", label: "Hyphen (-)" },
  { value: "/", label: "Slash (/)" },
  { value: ".", label: "Dot (.)" },
  { value: "", label: "None" },
]
export const sequenceLengthOptions = [4, 5, 6, 7, 8]
export const timeZoneOptions = ["Australia/Sydney", "Asia/Ho_Chi_Minh", "Europe/London", "America/New_York", "UTC"]
export const languageOptions = ["English"]
export const dateFormatOptions = [
  { value: "DD-MMM-YYYY", label: "DD-MMM-YYYY (31-Dec-2026)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2026)" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2026)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2026-12-31)" },
]
export const timeFormatOptions = [
  { value: "12", label: "12-hour (2:30 PM)" },
  { value: "24", label: "24-hour (14:30)" },
]
