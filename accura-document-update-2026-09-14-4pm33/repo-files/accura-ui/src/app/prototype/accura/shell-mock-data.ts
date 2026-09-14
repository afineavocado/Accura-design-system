import type {
  ApplicationNotification,
  ApplicationUser,
} from "@/components/application-header"

export const prototypeUser: ApplicationUser = {
  name: "Dr. Sarah Chen",
  role: "QA Approver",
  initials: "SC",
}

export const prototypeNotifications: ApplicationNotification[] = [
  {
    id: "notification-document-approval",
    module: "Document",
    recordId: "SOP-002",
    title: "QA approval required",
    description: "Change Control Process is ready for your approval.",
    timestamp: "8 minutes ago",
    kind: "Action required",
    unread: true,
    href: "/prototype/accura/documents/SOP-002",
  },
  {
    id: "notification-capa-review",
    module: "CAPA",
    recordId: "CAPA-0005",
    title: "Review assigned to you",
    description: "Review the investigation summary before it moves to approval.",
    timestamp: "42 minutes ago",
    kind: "Action required",
    unread: true,
    href: "/prototype/accura/capa/CAPA-0005",
  },
  {
    id: "notification-document-returned",
    module: "Document",
    recordId: "SOP-004",
    title: "Document returned by QA",
    description: "Section 2 needs clarification before the document is resubmitted.",
    timestamp: "2 hours ago",
    kind: "Update",
    unread: true,
    href: "/prototype/accura/documents/SOP-004",
  },
  {
    id: "notification-capa-approved",
    module: "CAPA",
    recordId: "CAPA-0006",
    title: "CAPA moved to approval",
    description: "The reviewer signed the record and completed the review stage.",
    timestamp: "Yesterday",
    kind: "Update",
    unread: false,
    href: "/prototype/accura/capa/CAPA-0006",
  },
]
