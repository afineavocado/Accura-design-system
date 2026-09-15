/* Knowledge Hub demo data.
 *
 * Reconstructed from the two supplied screenshots plus Amit's brief, then
 * extended with the fields the audit found missing. Everything beyond the seven
 * folder names and `sample.md` is PROPOSED, not confirmed — see README.md.
 *
 * Dates are stored ISO and formatted by the view. A pre-formatted string can
 * neither be sorted nor reformatted. */

/** Who stands behind the resource. This drives whether `Use as template` is
 *  offered: an external reference may be readable but not adaptable. */
export type Authority = "Accura template" | "Guidance" | "External reference"

export type ResourceType = "Template" | "Checklist" | "Guide" | "Example"

export type Resource = {
  slug: string
  title: string
  fileName: string
  fileType: "DOCX" | "XLSX" | "PDF" | "MD"
  resourceType: ResourceType
  authority: Authority
  /** Which standard edition this was written against. Empty for product docs. */
  reviewedAgainst?: string
  /** ISO date — the view labels and formats it. */
  lastUpdated: string
  /** Amit's brief: current resources are placeholders. */
  placeholder: boolean
  summary: string
}

export type Folder = {
  slug: string
  name: string
  /** Shown beside the name. Absent for non-standard collections. */
  edition?: string
  group: FolderGroup
  description: string
  /** ISO date. */
  lastReviewed: string
  resources: Resource[]
}

export type FolderGroup = "Standards and regulatory" | "Using Accura"

/** Group order is curated, not alphabetical: specialists arrive looking for a
 *  standard, so that band leads. */
export const folderGroups: FolderGroup[] = [
  "Standards and regulatory",
  "Using Accura",
]

const authorityVariant: Record<Authority, "success" | "blue" | "outline"> = {
  "Accura template": "success",
  Guidance: "blue",
  "External reference": "outline",
}

/** Status colour is data, never markup. */
export function authorityBadge(authority: Authority) {
  return authorityVariant[authority]
}

/** `Use as template` copies content into a new controlled Document. An external
 *  reference is licensed to its publisher, so it can be read but not adapted. */
export function canUseAsTemplate(resource: Resource) {
  return resource.authority !== "External reference"
}

/* Content guideline: one date format across the product, `12 Jun 2026`.
   The month list is explicit because `toLocaleDateString` with `month: "short"`
   returns a four-letter "Sept", which reads as a second format beside "Jun". */
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export function formatDate(iso: string) {
  const date = new Date(iso)
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export const basePath = "/prototype/accura/knowledge-hub"

export const folders: Folder[] = [
  {
    slug: "iso-9001",
    name: "ISO 9001",
    edition: "2015",
    group: "Standards and regulatory",
    description: "Quality management system templates and audit preparation.",
    lastReviewed: "2026-06-18",
    resources: [
      {
        slug: "quality-manual",
        title: "Quality manual template",
        fileName: "quality-manual-template.docx",
        fileType: "DOCX",
        resourceType: "Template",
        authority: "Accura template",
        reviewedAgainst: "ISO 9001:2015",
        lastUpdated: "2026-06-18",
        placeholder: true,
        summary:
          "Skeleton quality manual with clause mapping, scope statement and process interaction diagram placeholders.",
      },
      {
        slug: "management-review",
        title: "Management review agenda",
        fileName: "management-review-agenda.docx",
        fileType: "DOCX",
        resourceType: "Template",
        authority: "Accura template",
        reviewedAgainst: "ISO 9001:2015",
        lastUpdated: "2026-05-02",
        placeholder: true,
        summary:
          "Agenda and minutes structure covering every input and output the clause requires.",
      },
      {
        slug: "internal-audit-checklist",
        title: "Internal audit checklist",
        fileName: "internal-audit-checklist.xlsx",
        fileType: "XLSX",
        resourceType: "Checklist",
        authority: "Accura template",
        reviewedAgainst: "ISO 9001:2015",
        lastUpdated: "2026-04-11",
        placeholder: true,
        summary:
          "Clause-by-clause audit prompts with evidence and finding columns.",
      },
    ],
  },
  {
    slug: "iso-13485",
    name: "ISO 13485",
    edition: "2016",
    group: "Standards and regulatory",
    description: "Medical device quality system records and design controls.",
    lastReviewed: "2026-05-29",
    resources: [
      {
        slug: "design-history-file",
        title: "Design history file index",
        fileName: "dhf-index.xlsx",
        fileType: "XLSX",
        resourceType: "Template",
        authority: "Accura template",
        reviewedAgainst: "ISO 13485:2016",
        lastUpdated: "2026-05-29",
        placeholder: true,
        summary:
          "Index linking design inputs, outputs, reviews, verification and validation records.",
      },
      {
        slug: "risk-management-plan",
        title: "Risk management plan outline",
        fileName: "risk-management-plan.docx",
        fileType: "DOCX",
        resourceType: "Template",
        authority: "Accura template",
        reviewedAgainst: "ISO 13485:2016",
        lastUpdated: "2026-03-20",
        placeholder: true,
        summary:
          "Plan structure covering scope, responsibilities, acceptability criteria and review points.",
      },
    ],
  },
  {
    slug: "iso-15189",
    name: "ISO 15189",
    edition: "2022",
    group: "Standards and regulatory",
    description: "Medical laboratory competence, quality and result reporting.",
    lastReviewed: "2026-07-01",
    resources: [
      {
        slug: "competency-assessment",
        title: "Competency assessment record",
        fileName: "competency-assessment.docx",
        fileType: "DOCX",
        resourceType: "Template",
        authority: "Accura template",
        reviewedAgainst: "ISO 15189:2022",
        lastUpdated: "2026-07-01",
        placeholder: true,
        summary:
          "Per-analyst competency record with initial and ongoing assessment rounds.",
      },
      {
        slug: "transition-2012-2022",
        title: "Moving from the 2012 edition",
        fileName: "iso15189-transition.pdf",
        fileType: "PDF",
        resourceType: "Guide",
        authority: "Guidance",
        reviewedAgainst: "ISO 15189:2022",
        lastUpdated: "2026-02-14",
        placeholder: true,
        summary:
          "What changed between the 2012 and 2022 editions, and which records need rework.",
      },
    ],
  },
  {
    slug: "iso-17025",
    name: "ISO/IEC 17025",
    edition: "2017",
    group: "Standards and regulatory",
    description:
      "Testing and calibration laboratory competence, method validation and uncertainty.",
    lastReviewed: "2026-07-22",
    resources: [
      {
        slug: "method-validation",
        title: "Method validation protocol",
        fileName: "method-validation-protocol.docx",
        fileType: "DOCX",
        resourceType: "Template",
        authority: "Accura template",
        reviewedAgainst: "ISO/IEC 17025:2017",
        lastUpdated: "2026-07-22",
        placeholder: true,
        summary:
          "Protocol covering scope, performance characteristics, acceptance criteria and the validation report.",
      },
      {
        slug: "uncertainty-budget",
        title: "Measurement uncertainty budget",
        fileName: "uncertainty-budget.xlsx",
        fileType: "XLSX",
        resourceType: "Template",
        authority: "Accura template",
        reviewedAgainst: "ISO/IEC 17025:2017",
        lastUpdated: "2026-06-09",
        placeholder: true,
        summary:
          "Worked budget with contribution table, combined and expanded uncertainty.",
      },
      {
        slug: "proficiency-testing",
        title: "Proficiency testing policy",
        fileName: "proficiency-testing-policy.docx",
        fileType: "DOCX",
        resourceType: "Template",
        authority: "Accura template",
        reviewedAgainst: "ISO/IEC 17025:2017",
        lastUpdated: "2026-04-30",
        placeholder: true,
        summary:
          "Policy for interlaboratory comparison planning, evaluation and follow-up of outliers.",
      },
      {
        slug: "accreditation-body-guidance",
        title: "Accreditation body guidance notes",
        fileName: "accreditation-guidance.pdf",
        fileType: "PDF",
        resourceType: "Guide",
        authority: "External reference",
        reviewedAgainst: "ISO/IEC 17025:2017",
        lastUpdated: "2026-01-16",
        placeholder: true,
        summary:
          "Published guidance from an accreditation body. Read only, retained under its own licence.",
      },
    ],
  },
  {
    slug: "gmp-pics",
    name: "GMP PIC/S",
    group: "Standards and regulatory",
    description:
      "Pharmaceutical manufacturing practice, deviations and batch record control.",
    lastReviewed: "2026-06-03",
    resources: [
      {
        slug: "deviation-investigation",
        title: "Deviation investigation template",
        fileName: "deviation-investigation.docx",
        fileType: "DOCX",
        resourceType: "Template",
        authority: "Accura template",
        lastUpdated: "2026-06-03",
        placeholder: true,
        summary:
          "Investigation structure with immediate actions, root cause analysis and CAPA linkage.",
      },
    ],
  },
  {
    slug: "accura-software",
    name: "Accura Software",
    group: "Using Accura",
    description: "Release notes, validation pack and platform documentation.",
    lastReviewed: "2026-09-13",
    resources: [
      {
        slug: "sample",
        title: "Sample resource",
        fileName: "sample.md",
        fileType: "MD",
        resourceType: "Example",
        authority: "Guidance",
        lastUpdated: "2026-09-13",
        placeholder: true,
        summary:
          "Placeholder file carried over from the current build. Replace before any customer demo.",
      },
    ],
  },
  {
    slug: "user-guides",
    name: "User Guides",
    group: "Using Accura",
    description: "How to run each module, written for end users.",
    lastReviewed: "2026-08-27",
    resources: [
      {
        slug: "getting-started-documents",
        title: "Getting started with Documents",
        fileName: "documents-getting-started.pdf",
        fileType: "PDF",
        resourceType: "Guide",
        authority: "Guidance",
        lastUpdated: "2026-08-27",
        placeholder: true,
        summary:
          "Draft to approved walkthrough, including reviewer and QA signing steps.",
      },
      {
        slug: "capa-module-guide",
        title: "CAPA module guide",
        fileName: "capa-guide.pdf",
        fileType: "PDF",
        resourceType: "Guide",
        authority: "Guidance",
        lastUpdated: "2026-08-27",
        placeholder: true,
        summary:
          "Raising a CAPA, assigning actions and closing with final approval.",
      },
      /* An empty folder is a real state the demo must show, so this one is
         deliberately thin rather than absent. */
    ],
  },
]

export function getFolder(slug: string) {
  return folders.find((folder) => folder.slug === slug)
}

export function getResource(folderSlug: string, resourceSlug: string) {
  const folder = getFolder(folderSlug)
  const resource = folder?.resources.find((item) => item.slug === resourceSlug)
  return folder && resource ? { folder, resource } : undefined
}

export const resourceTypes: ResourceType[] = [
  "Template",
  "Checklist",
  "Guide",
  "Example",
]

export const authorities: Authority[] = [
  "Accura template",
  "Guidance",
  "External reference",
]
