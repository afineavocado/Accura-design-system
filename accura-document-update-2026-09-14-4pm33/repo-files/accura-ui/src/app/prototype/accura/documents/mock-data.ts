import type { SignatureReceipt } from "@/components/record-workflow";
import type { BadgeProps } from "@/components/ui/badge";

export const basePath = "/prototype/accura/documents";
export const stages = [
  "Draft",
  "In Review",
  "In QA Approval",
  "Approved",
] as const;
export type Stage = (typeof stages)[number];
export const workflowVariants: Record<Stage, BadgeProps["variant"]> = {
  Draft: "secondary",
  "In Review": "warning",
  "In QA Approval": "blue",
  Approved: "success",
};
export type UseStatus =
  | "Not effective"
  | "Pending effective"
  | "Effective"
  | "Superseded"
  | "Obsolete"
  | "External record";
export const useStatusVariants: Record<UseStatus, BadgeProps["variant"]> = {
  "Not effective": "secondary",
  "Pending effective": "blue",
  Effective: "success",
  Superseded: "secondary",
  Obsolete: "destructive",
  "External record": "secondary",
};
export const actors = {
  owner: {
    name: "James Wilson",
    role: "Document Owner",
    account: "james.wilson@example.com",
    initials: "JW",
  },
  reviewer: {
    name: "Tom Bradley",
    role: "Reviewer",
    account: "tom.bradley@example.com",
    initials: "TB",
  },
  qa: {
    name: "Dr. Sarah Chen",
    role: "QA Approver",
    account: "sarah.chen@example.com",
    initials: "SC",
  },
};
export type DemoDocument = {
  category?: "Normal" | "Pre-approved / External";
  lifecycle?: "Current" | "Superseded" | "Obsolete";
  author?: typeof actors.owner;
  owner?: typeof actors.owner;
  previousRevision?: string;
  supersededBy?: string;
  obsolete?: { reason: string; name: string; timestamp: string };
  returned?: {
    reason: string;
    name: string;
    timestamp: string;
    fromStatus: string;
  };
  uploadHistory?: {
    file: string;
    sourceKey?: string;
    sample: boolean;
    timestamp: string;
  }[];
  id: string;
  name: string;
  type: string;
  department: string;
  revision: string;
  status: Stage;
  file: string;
  sample: boolean;
  effectiveDate: string;
  effectiveDateOverride?: string;
  approvedAt?: string;
  reviewer?: string;
  qaApprover?: string;
  sourceKey?: string;
  attachments?: { key: string; name: string; size: number }[];
  signatures: SignatureReceipt[];
  activity: { text: string; name: string; timestamp: string }[];
  content: { purpose: string; scope: string; procedure?: string[] };
  relatedDocuments?: string[];
  referredDocuments?: string[];
};
// Self-contained happy-path fixtures; legacy prototype routes have been removed.
const initialDocuments: {
  id: string;
  name: string;
  type: string;
  department: string;
  version: string;
  status: Stage | "In QA Approval";
  content: DemoDocument["content"];
  relatedDocuments: string[];
  referredDocuments: string[];
}[] = [
  {
    id: "SOP-001",
    name: "Document Control Procedure",
    type: "SOP",
    department: "Quality Assurance",
    version: "v2.0",
    status: "Approved",
    content: {
      purpose:
        "To define the process for creating, reviewing, approving, distributing, and retiring controlled documents.",
      scope:
        "This procedure applies to all controlled documents used within the quality management system.",
      procedure: [
        "Create and identify the controlled document using the approved numbering convention.",
        "Route the document through review and quality approval.",
        "Publish the approved version and retain the original source file.",
      ],
    },
    relatedDocuments: [
      "SOP-002: Change Control Process",
      "SOP-003: CAPA Management",
    ],
    referredDocuments: ["POL-001: Quality Policy"],
  },
  {
    id: "SOP-002",
    name: "Change Control Process",
    type: "SOP",
    department: "Quality Assurance",
    version: "v1.0",
    status: "In QA Approval",
    content: {
      purpose:
        "To establish a systematic approach for managing changes to controlled documents, processes, equipment, and systems.",
      scope:
        "This procedure applies to all changes that may affect product quality, safety, or regulatory compliance.",
      procedure: [
        "Change Initiation: Submit a Change Request (CR) form describing the proposed change.",
        "Impact Assessment: Evaluate the impact on related processes and documents.",
        "Approval: Route for review and approval based on change classification.",
        "Implementation: Execute the approved change within the specified timeline.",
      ],
    },
    relatedDocuments: ["SOP-001: Document Control Procedure"],
    referredDocuments: [],
  },
  {
    id: "SOP-003",
    name: "CAPA Management",
    type: "SOP",
    department: "Quality Assurance",
    version: "v1.0",
    status: "In Review",
    content: {
      purpose:
        "To define the process for identifying, investigating, and resolving Corrective and Preventive Actions (CAPAs).",
      scope:
        "This procedure applies to all quality events requiring root cause analysis and corrective/preventive action.",
    },
    relatedDocuments: ["SOP-004: Deviation Handling"],
    referredDocuments: ["SOP-005: Risk Assessment Procedure"],
  },
  {
    id: "SOP-004",
    name: "Deviation Handling",
    type: "SOP",
    department: "Manufacturing",
    version: "v2.0",
    status: "Draft",
    content: {
      purpose:
        "To define a controlled process for documenting, investigating, and closing deviations from approved procedures.",
      scope:
        "This procedure applies to deviations observed in manufacturing, testing, warehousing, and supporting operations.",
    },
    relatedDocuments: [
      "SOP-003: CAPA Management",
      "SOP-005: Risk Assessment Procedure",
    ],
    referredDocuments: [],
  },
  {
    id: "SOP-005",
    name: "Risk Assessment Procedure",
    type: "SOP",
    department: "Quality Assurance",
    version: "v1.0",
    status: "Approved",
    content: {
      purpose:
        "To define a consistent approach for identifying, assessing, and controlling quality and compliance risks.",
      scope:
        "This procedure applies to quality events, changes, deviations, and new or modified processes.",
      procedure: [
        "Identify the risk.",
        "Assess severity and likelihood.",
        "Define controls and document the decision.",
      ],
    },
    relatedDocuments: ["SOP-003: CAPA Management"],
    referredDocuments: [],
  },
  {
    id: "POL-001",
    name: "Quality Policy",
    type: "POL",
    department: "Quality Assurance",
    version: "v3.0",
    status: "Approved",
    content: {
      purpose:
        "To define the organization’s commitment to product quality, compliance, and continuous improvement.",
      scope:
        "This policy applies to every department and process within the Accura quality management system.",
    },
    relatedDocuments: [],
    referredDocuments: ["SOP-001: Document Control Procedure"],
  },
];
export const seeds: DemoDocument[] = initialDocuments.map((d, index) => ({
  id: d.id,
  name: d.name,
  type: d.type,
  department: d.department,
  revision: d.version,
  status: d.status,
  file: `${d.id}.docx`,
  sample: true,
  effectiveDate:
    d.status === "Approved" ? (index === 5 ? "2026-10-01" : "2025-06-11") : "",
  signatures:
    d.status === "Draft" || d.status === "In Review"
      ? []
      : [
          {
            ...actors.reviewer,
            record: `${d.id} · ${d.version}`,
            meaning: "I approve this document following technical review.",
            timestamp: "2025-06-10T09:00:00Z",
          },
          ...(d.status === "Approved"
            ? [
                {
                  ...actors.qa,
                  record: `${d.id} · ${d.version}`,
                  meaning:
                    "I approve this document for controlled use from its effective date.",
                  timestamp: "2025-06-11T09:00:00Z",
                },
              ]
            : []),
        ],
  activity: [
    {
      text: `Demo record initialized · ${d.status}`,
      name: "Demo system",
      timestamp: "2026-09-12T02:00:00Z",
    },
  ],
  content: d.content,
  relatedDocuments: d.relatedDocuments.map((id) => id.split(":")[0]),
  referredDocuments: d.referredDocuments.map((id) => id.split(":")[0]),
}));
export function newDocument(id: string): DemoDocument {
  return {
    id,
    name: "",
    type: "SOP",
    department: "Quality Assurance",
    revision: "v1.0",
    status: "Draft",
    file: "",
    sample: false,
    effectiveDate: "",
    reviewer: actors.reviewer.name,
    qaApprover: actors.qa.name,
    attachments: [],
    signatures: [],
    activity: [],
    content: {
      purpose:
        "To define a controlled process for documenting, investigating, and closing deviations from approved procedures.",
      scope: "Manufacturing, testing, warehousing, and supporting operations.",
      procedure: [
        "Record the deviation and identify the affected process.",
        "Assess the impact and assign an investigation owner.",
        "Document the investigation and approved actions.",
        "Verify completion and retain the controlled record.",
      ],
    },
  };
}
export function getUseStatus(doc: DemoDocument): UseStatus {
  if (doc.lifecycle === "Obsolete" || doc.lifecycle === "Superseded")
    return doc.lifecycle;
  if (doc.status !== "Approved") return "Not effective";
  if (doc.category === "Pre-approved / External") return "External record";
  return doc.effectiveDate &&
    doc.effectiveDate <= new Date().toLocaleDateString("en-CA")
    ? "Effective"
    : "Pending effective";
}
export function displayDate(date: string) {
  return date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";
}
export function displayTime(date: string) {
  return (
    new Date(date).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }) + " UTC"
  );
}
export function responsible(doc: DemoDocument) {
  return doc.status === "In Review"
    ? reviewerFor(doc)
    : doc.status === "In QA Approval"
    ? qaFor(doc)
    : doc.owner || actors.owner;
}
// Existing people from the project's original Document fixtures; one selected per gate.
export const reviewers = [
  actors.reviewer,
  {
    name: "Priya Nair",
    role: "Reviewer",
    account: "priya.nair@example.com",
    initials: "PN",
  },
];
export const qaApprovers = [
  actors.qa,
  {
    name: "Emily Zhang",
    role: "QA Approver",
    account: "emily.zhang@example.com",
    initials: "EZ",
  },
];
export function reviewerFor(doc: DemoDocument) {
  return reviewers.find((p) => p.name === doc.reviewer) || actors.reviewer;
}
export function qaFor(doc: DemoDocument) {
  return qaApprovers.find((p) => p.name === doc.qaApprover) || actors.qa;
}
export function approvalEffectiveDate(approvalTimestamp: string) {
  const date = new Date(approvalTimestamp);
  date.setDate(date.getDate() + 14);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}
export function nextAction(doc: DemoDocument) {
  if (doc.lifecycle === "Superseded" || doc.lifecycle === "Obsolete")
    return "View history";
  if (doc.returned && doc.status === "Draft") return "Revise and resubmit";
  if (doc.category === "Pre-approved / External" && doc.status === "Draft")
    return "Sign and submit";
  return {
    Draft: "Complete and submit",
    "In Review": "Review document",
    "In QA Approval": "QA approval",
    Approved: "No action required",
  }[doc.status];
}

export const documentTypes = ["SOP", "POL", "WI", "FRM"];
export const departments = [
  "Quality Assurance",
  "Manufacturing",
  "Regulatory Affairs",
];
export function recordKey(doc: Pick<DemoDocument, "id" | "revision">) {
  return `${doc.id.replaceAll("/", "~")}--${doc.revision}`;
}
export function documentHref(doc: Pick<DemoDocument, "id" | "revision">) {
  return `${basePath}/${encodeURIComponent(recordKey(doc))}`;
}
export function isRetired(doc: DemoDocument) {
  return doc.lifecycle === "Superseded" || doc.lifecycle === "Obsolete";
}
export function normalizeDocument(doc: DemoDocument): DemoDocument {
  return {
    ...doc,
    status:
      (doc.status as string) === "In Approval" ? "In QA Approval" : doc.status,
    category: doc.category || "Normal",
    lifecycle: doc.lifecycle || "Current",
    author: doc.author || { ...actors.owner, role: "Author" },
    owner: doc.owner || actors.owner,
    department:
      doc.department === "Regulatory" ? "Regulatory Affairs" : doc.department,
    relatedDocuments: doc.relatedDocuments?.map((id) => id.split(":")[0]),
    referredDocuments: doc.referredDocuments?.map((id) => id.split(":")[0]),
  };
}
export function nextDocumentId(docs: DemoDocument[], type: string) {
  const max = Math.max(
    0,
    ...docs
      .filter((d) => d.type === type)
      .map((d) => Number(d.id.split(/[/-]/).at(-1)) || 0)
  );
  return `ACME/${type}/2026/${String(max + 1).padStart(6, "0")}`;
}

// Additional fixtures demonstrate the newly requested contexts without changing saved records.
export const contextSeeds: DemoDocument[] = [
  normalizeDocument({
    ...newDocument("ACME/WI/2026/000002"),
    name: "Equipment cleaning instruction",
    type: "WI",
    department: "Manufacturing",
    file: "Cleaning-instruction.doc",
    sample: true,
    returned: {
      reason: "Clarify which equipment is covered before resubmission.",
      name: actors.qa.name,
      timestamp: "2026-09-13T09:00:00Z",
      fromStatus: "In QA Approval",
    },
    content: {
      purpose: "Define the equipment cleaning procedure.",
      scope: "Manufacturing equipment; scope awaiting clarification.",
    },
    signatures: [
      {
        ...actors.owner,
        role: "Author",
        record: "ACME/WI/2026/000002 · v1.0",
        meaning: "I submit this revision for review.",
        action: "Author submission signed",
        fromStatus: "Draft",
        toStatus: "In Review",
        timestamp: "2026-09-12T09:00:00Z",
        invalidatedAt: "2026-09-13T09:00:00Z",
      },
      {
        ...actors.reviewer,
        record: "ACME/WI/2026/000002 · v1.0",
        meaning: "I approve this revision following review.",
        action: "Review approval signed",
        fromStatus: "In Review",
        toStatus: "In QA Approval",
        timestamp: "2026-09-12T10:00:00Z",
        invalidatedAt: "2026-09-13T09:00:00Z",
      },
      {
        ...actors.qa,
        record: "ACME/WI/2026/000002 · v1.0",
        meaning:
          "I return this revision to Draft. Reason: Clarify which equipment is covered before resubmission.",
        action: "Rejection signed — returned to Draft",
        fromStatus: "In QA Approval",
        toStatus: "Draft",
        timestamp: "2026-09-13T09:00:00Z",
      },
    ],
  }),
  normalizeDocument({
    ...seeds[0],
    revision: "v1.0",
    lifecycle: "Superseded",
    supersededBy: recordKey(seeds[0]),
    signatures: [],
    activity: [
      {
        text: "Superseded by v2.0 on replacement approval (sample history)",
        name: "Demo system",
        timestamp: "2025-06-11T09:00:00Z",
      },
    ],
  }),
  normalizeDocument({
    ...newDocument("ACME/FRM/2026/000001"),
    name: "External calibration certificate",
    type: "FRM",
    category: "Pre-approved / External",
    department: "Regulatory Affairs",
    status: "Approved",
    file: "Calibration-certificate.doc",
    sample: true,
    content: {
      purpose:
        "Externally approved calibration evidence retained in the document repository.",
      scope: "Supporting equipment documentation.",
    },
    signatures: [
      {
        ...actors.owner,
        role: "Author",
        record: "ACME/FRM/2026/000001 · v1.0",
        meaning: "I acknowledge external approval and submit this record.",
        timestamp: "2026-09-12T09:00:00Z",
        action: "External acknowledgement signed",
        fromStatus: "Draft",
        toStatus: "Approved",
      },
    ],
  }),
  normalizeDocument({
    ...newDocument("ACME/WI/2026/000001"),
    name: "Retired equipment instruction",
    type: "WI",
    status: "Approved",
    lifecycle: "Obsolete",
    file: "Retired-instruction.doc",
    sample: true,
    effectiveDate: "2025-06-11",
    obsolete: {
      reason: "Equipment has been retired; instruction no longer required.",
      name: actors.owner.name,
      timestamp: "2026-09-12T09:00:00Z",
    },
    activity: [
      {
        text: "Marked Obsolete — equipment retired (sample history)",
        name: actors.owner.name,
        timestamp: "2026-09-12T09:00:00Z",
      },
    ],
  }),
];
