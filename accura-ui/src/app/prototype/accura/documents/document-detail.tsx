"use client";

import { useState, useContext, type ReactNode } from "react";
import { DocumentActionHost } from "./components";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ActionGroup, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ComboboxField } from "@/components/ui/combobox";
import { DocumentFiles, DocumentAttachments } from "./document-files";
import {
  RecordDetailLayout,
  ElectronicSignatureModal,
  type SignatureReceipt,
} from "@/components/record-workflow";
import { Choice, UseBadge, WorkflowBadge } from "./components";
import {
  actors,
  basePath,
  displayDate,
  newDocument,
  responsible,
  stages,
  reviewers,
  qaApprovers,
  reviewerFor,
  qaFor,
  approvalEffectiveDate,
  recordKey,
  documentHref,
  isRetired,
  normalizeDocument,
  nextDocumentId,
  documentTypes,
  departments,
  displayTime,
  type DemoDocument,
} from "./mock-data";
import { useDocuments, saveDocument } from "./store";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import {
  RecordAuditDrawer,
  type RecordAuditEvent,
} from "@/components/record-audit-drawer";

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="text-[var(--color-surface-overlay-foreground)]">
      <CardHeader className="border-b border-[var(--color-border-default)] pb-[var(--spacing-component-lg)]">
        <CardTitle>
          <h2 className="font-sans">{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
const infoLabel =
  "mb-[var(--spacing-component-sm)] text-xs uppercase text-[var(--color-text-secondary)]";
const gap = "space-y-[var(--spacing-component-sm)]";

export default function DocumentDetail({ id }: { id: string }) {
  const docs = useDocuments();
  const existing =
    docs.find((d) => recordKey(d) === id) ||
    docs.find((d) => d.id === id && !isRetired(d)) ||
    docs.find((d) => d.id === id);
  if (id !== "new" && !existing)
    return (
      <>
        <p>Document not found in this prototype.</p>
        <Button asChild variant="link">
          <Link href={basePath}>Back to Documents</Link>
        </Button>
      </>
    );
  const nextId = nextDocumentId(docs, "SOP");
  return (
    <DetailEditor
      key={`${id}-${existing?.activity[0]?.timestamp || "new"}`}
      initial={existing || normalizeDocument(newDocument(nextId))}
      isNew={id === "new"}
    />
  );
}

function DetailEditor({
  initial,
  isNew,
}: {
  initial: DemoDocument;
  isNew: boolean;
}) {
  const router = useRouter();
  const documents = useDocuments();
  const [doc, setDoc] = useState(initial);
  const [signing, setSigning] = useState<
    "submit" | "approve" | "reject" | "obsolete" | null
  >(null);
  const actionHost = useContext(DocumentActionHost);
  const retired = isRetired(doc);
  const external = doc.category === "Pre-approved / External";
  const draft = doc.status === "Draft" && !retired;
  const approved = doc.status === "Approved";
  const actor =
    signing === "obsolete" || signing === "submit"
      ? doc.author || actors.owner
      : responsible(doc);
  const reviewer = reviewerFor(doc);
  const qa = qaFor(doc);
  const plannedDate =
    doc.effectiveDateOverride ||
    approvalEffectiveDate(new Date().toISOString());
  const workflowSteps = external
    ? [
        { label: "Draft", description: doc.author?.name || actors.owner.name },
        { label: "Submitted / Signed", description: "Author acknowledgement" },
        { label: "Approved", description: "No QA gate" },
      ]
    : [
        { label: "Draft", description: actors.owner.name },
        { label: "In Review", description: reviewer.name },
        { label: "In QA Approval", description: qa.name },
        { label: "Approved", description: "Read-only document" },
      ];
  const auditEvents: RecordAuditEvent[] = doc.activity.map((event, i) => ({
    ...event,
    id: `activity-${i}`,
    action: event.text,
    record: `${doc.id} · ${doc.revision}`,
  }));
  doc.signatures.forEach((signature, i) => {
    // Older local data stores the signature receipt and its activity separately.
    // Merge only a matching signing event; never suppress unrelated status/activity events.
    const match = auditEvents.find(
      (event) =>
        !event.meaning &&
        event.name === signature.name &&
        /signed/i.test(event.action) &&
        Math.abs(
          Date.parse(event.timestamp) - Date.parse(signature.timestamp)
        ) < 5000
    );
    const entry = {
      ...signature,
      meaning:
        signature.meaning +
        (signature.invalidatedAt
          ? ` · Historical only — invalidated on ${displayTime(
              signature.invalidatedAt
            )}`
          : ""),
      fromStatus: signature.fromStatus,
      toStatus: signature.toStatus,
    };
    if (match) Object.assign(match, entry);
    else
      auditEvents.push({
        ...entry,
        id: `signature-${i}`,
        action:
          signature.action ||
          (signature.role === "QA Approver"
            ? "Final approval signed"
            : "Review approval signed"),
      });
  });
  const ready = Boolean(
    doc.name.trim() && doc.file && (external || (reviewer && qa))
  );
  const update = (patch: Partial<DemoDocument>) =>
    setDoc((prev) => ({
      ...prev,
      ...patch,
      ...(patch.file &&
      prev.file &&
      (patch.file !== prev.file || patch.sourceKey !== prev.sourceKey)
        ? {
            uploadHistory: [
              ...(prev.uploadHistory || []),
              {
                file: prev.file,
                sourceKey: prev.sourceKey,
                sample: prev.sample,
                timestamp: new Date().toISOString(),
              },
            ],
            activity: [
              {
                text: `Draft file replaced: ${prev.file} → ${patch.file}. Previous upload retained.`,
                name: prev.author?.name || actors.owner.name,
                timestamp: new Date().toISOString(),
              },
              ...prev.activity,
            ],
          }
        : {}),
    }));
  const persist = (next: DemoDocument, text: string, name = actor.name) => {
    const updated = {
      ...next,
      activity: [
        { text, name, timestamp: new Date().toISOString() },
        ...next.activity,
      ],
    };
    saveDocument(updated);
    setDoc(updated);
    return updated;
  };
  const saveAndExit = () => {
    persist(
      { ...doc, name: doc.name.trim() || "Untitled document" },
      "Draft saved"
    );
    toast.success("Draft saved to Documents");
    router.push(basePath);
  };
  const submit = () => setSigning("submit");
  const createRevision = () => {
    const pending = documents.find(
      (d) => d.id === doc.id && !isRetired(d) && d.status !== "Approved"
    );
    if (pending) {
      router.push(documentHref(pending));
      return;
    }
    const revision = `v${
      Math.max(
        ...documents
          .filter((d) => d.id === doc.id)
          .map((d) => parseInt(d.revision.replace("v", ""), 10) || 1)
      ) + 1
    }.0`;
    const next: DemoDocument = {
      ...doc,
      revision,
      status: "Draft",
      lifecycle: "Current",
      previousRevision: recordKey(doc),
      supersededBy: undefined,
      obsolete: undefined,
      returned: undefined,
      approvedAt: undefined,
      effectiveDate: "",
      effectiveDateOverride: undefined,
      signatures: [],
      uploadHistory: [],
      activity: [
        {
          text: `New revision ${revision} created from ${doc.revision}; fresh signatures required`,
          name: doc.author?.name || actors.owner.name,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    saveDocument(next);
    router.push(documentHref(next));
  };
  const signed = (receipt: SignatureReceipt) => {
    const action = signing;
    if (
      draft &&
      (action === "obsolete" || action === "reject" || action === "approve")
    )
      return;
    if (action === "reject" || action === "obsolete") {
      const reason = receipt.meaning
        .split("Reason: ")
        .slice(1)
        .join("Reason: ");
      const entry = {
        ...receipt,
        action:
          action === "reject"
            ? "Rejection signed, returned to Draft"
            : "Obsolete decision signed",
        fromStatus: doc.status,
        toStatus: action === "reject" ? "Draft" : "Obsolete",
      };
      persist(
        {
          ...doc,
          ...(action === "reject"
            ? {
                status: "Draft" as const,
                returned: {
                  reason,
                  name: actor.name,
                  timestamp: receipt.timestamp,
                  fromStatus: doc.status,
                },
                effectiveDate: "",
                effectiveDateOverride: undefined,
                approvedAt: undefined,
              }
            : {
                lifecycle: "Obsolete" as const,
                obsolete: {
                  reason,
                  name: actor.name,
                  timestamp: receipt.timestamp,
                },
              }),
          signatures: [
            ...doc.signatures.map((s) =>
              action === "reject" &&
              (!s.action ||
                /approval|submission|acknowledgement/i.test(s.action))
                ? { ...s, invalidatedAt: s.invalidatedAt || receipt.timestamp }
                : s
            ),
            entry,
          ],
        },
        entry.action
      );
      toast.success(
        action === "reject"
          ? "Returned to Draft: fresh signatures required"
          : "Document marked Obsolete"
      );
      return;
    }
    const status =
      action === "submit"
        ? external
          ? "Approved"
          : "In Review"
        : doc.status === "In Review"
        ? "In QA Approval"
        : "Approved";
    const effectiveDate =
      status === "Approved" && !external
        ? doc.effectiveDateOverride || approvalEffectiveDate(receipt.timestamp)
        : "";
    persist(
      {
        ...doc,
        status,
        effectiveDate,
        approvedAt: status === "Approved" ? receipt.timestamp : undefined,
        returned: undefined,
        signatures: [
          ...doc.signatures,
          {
            ...receipt,
            action:
              action === "submit"
                ? external
                  ? "External acknowledgement signed · Submitted / Signed → Approved"
                  : "Author submission signed"
                : status === "Approved"
                ? "QA approval signed"
                : "Review approval signed",
            fromStatus: doc.status,
            toStatus: status,
          },
        ],
      },
      action === "submit"
        ? external
          ? "External acknowledgement signed · Submitted / Signed → Approved (no QA gate)"
          : `Author submission signed · assigned to ${reviewer.name}`
        : status === "Approved"
        ? `QA approval signed · effective date ${displayDate(
            effectiveDate
          )} · ${
            doc.effectiveDateOverride ? "QA override" : "approval + 14 days"
          }`
        : `Review signed · assigned to ${qa.name}`
    );
    toast.success(
      status === "Approved"
        ? "Document approved"
        : "Review complete, ready for QA approval"
    );
    if (isNew) router.replace(documentHref(doc));
  };
  return (
    <>
      <Link
        href={basePath}
        onClick={() => {
          if (draft)
            persist(
              { ...doc, name: doc.name.trim() || "Untitled document" },
              "Draft saved"
            );
        }}
        className="mb-[var(--spacing-component-lg)] inline-flex items-center gap-[var(--spacing-component-xs)] text-sm text-[var(--color-brand-primary)] hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to Documents
      </Link>
      <div className="mb-[var(--spacing-layout-sm)] flex flex-wrap items-start justify-between gap-[var(--spacing-component-lg)]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
            <h1 className="text-xl font-semibold">
              {isNew && draft ? "Create document" : doc.name}
            </h1>
            <WorkflowBadge status={doc.status} />
            <UseBadge doc={doc} />
          </div>
          <p className="mt-[var(--spacing-component-sm)] text-xs text-[var(--color-text-secondary)]">
            {doc.id} · {doc.revision} · {doc.category || "Normal"} ·{" "}
            {retired
              ? "Historical record"
              : doc.status === "Approved"
              ? "Current approved revision"
              : "Working revision"}
          </p>
        </div>
        <ActionGroup aria-label="Document actions">
          {approved && !retired && (
            <Button onClick={createRevision}>New version</Button>
          )}
          {!retired && !isNew && (draft || approved) && (
            <Button
              variant="outline"
              disabled={draft}
              onClick={() => setSigning("obsolete")}
            >
              Mark as Obsolete
            </Button>
          )}
          <RecordAuditDrawer
            record={`${doc.id} · ${doc.revision}`}
            events={auditEvents}
          />
        </ActionGroup>
      </div>
      {((doc.returned && draft) || retired || doc.previousRevision) && (
        <Alert
          variant={
            (doc.returned && draft) || doc.lifecycle === "Obsolete"
              ? "destructive"
              : "default"
          }
          className="mb-[var(--spacing-layout-sm)]"
        >
          <AlertTitle>
            {doc.lifecycle === "Obsolete"
              ? "Obsolete: not available for use"
              : doc.lifecycle === "Superseded"
              ? "Superseded: historical revision"
              : doc.returned
              ? `Returned to Draft by ${doc.returned.name}`
              : approved
              ? "Replacement revision approved"
              : "New revision in progress"}
          </AlertTitle>
          <AlertDescription>
            {doc.lifecycle === "Obsolete"
              ? `${doc.obsolete?.reason || "No longer required or in use."} · ${
                  doc.obsolete?.name || "Author"
                }${
                  doc.obsolete
                    ? ` · ${displayTime(doc.obsolete.timestamp)}`
                    : ""
                }. Retained for history.`
              : doc.lifecycle === "Superseded"
              ? "Replaced on approval of a newer revision. This revision is no longer effective."
              : doc.returned
              ? `${doc.returned.fromStatus} · ${displayTime(
                  doc.returned.timestamp
                )} · ${
                  doc.returned.reason
                }. Previous submission/approval signatures are historical only; resubmit with a new signature.`
              : approved
              ? external
                ? "The previous revision is now Superseded. This external record was submitted with author acknowledgement."
                : `The previous revision is now Superseded. This revision is available for controlled use from ${displayDate(
                    doc.effectiveDate
                  )}.`
              : "The previous approved revision is unchanged until this revision is approved. Fresh signatures are required."}
            {(doc.supersededBy || doc.previousRevision) && (
              <Link
                className="ml-[var(--spacing-component-sm)] text-[var(--color-brand-primary)] underline"
                href={`${basePath}/${encodeURIComponent(
                  doc.supersededBy || doc.previousRevision!
                )}`}
              >
                {doc.supersededBy
                  ? "View replacement revision"
                  : "View previous revision"}
              </Link>
            )}
          </AlertDescription>
        </Alert>
      )}
      {isNew && draft && (
        <div className="mb-[var(--spacing-layout-sm)]">
          <InfoSection title="Document category">
            <RadioGroup
              value={doc.category || "Normal"}
              onValueChange={(value) =>
                update({ category: value as DemoDocument["category"] })
              }
              aria-label="Document category"
              className="grid gap-[var(--spacing-component-lg)] sm:grid-cols-2"
            >
              {(["Normal", "Pre-approved / External"] as const).map(
                (category, i) => (
                  <label
                    key={category}
                    className="flex cursor-pointer items-start gap-[var(--spacing-component-md)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] p-[var(--spacing-component-lg)] has-[[data-state=checked]]:border-[var(--color-brand-primary)]"
                  >
                    <RadioGroupItem id={`category-${i}`} value={category} />
                    <span>
                      <span className="block text-sm font-medium">
                        {category}
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {i === 0
                          ? "Author signs submission, then Reviewer and QA approve."
                          : "Author signs acknowledgement. Already approved externally; no Reviewer or QA gate."}
                      </span>
                    </span>
                  </label>
                )
              )}
            </RadioGroup>
          </InfoSection>
        </div>
      )}
      <RecordDetailLayout
        ratio="70/30"
        progress={
          !retired && (
            <Card>
              <CardContent>
                <div className="hidden md:block">
                  <Stepper
                    className="[&>li:first-child]:flex-[0.5] [&>li:last-child]:flex-[0.5]"
                    steps={workflowSteps}
                    currentStep={
                      approved
                        ? workflowSteps.length + 1
                        : stages.indexOf(doc.status) + 1
                    }
                    aria-label="Record workflow"
                  />
                </div>
                <div className="md:hidden">
                  <Stepper
                    steps={workflowSteps}
                    currentStep={
                      approved
                        ? workflowSteps.length + 1
                        : stages.indexOf(doc.status) + 1
                    }
                    orientation="vertical"
                    aria-label="Record workflow"
                  />
                </div>
              </CardContent>
            </Card>
          )
        }
        main={
          <>
            <DocumentFiles doc={doc} update={update} />
            <DocumentAttachments doc={doc} update={update} />
          </>
        }
        audit={
          <>
            <InfoSection title="Document details">
              {draft ? (
                <>
                  <div className={gap}>
                    <Label required htmlFor="document-name">Document name</Label>
                    <Input
                      id="document-name"
                      value={doc.name}
                      onChange={(e) => update({ name: e.target.value })}
                      placeholder="Enter document name"
                      required
                    />
                  </div>
                  <div className="grid gap-[var(--spacing-component-lg)]">
                    <div className={gap}>
                      <Label required>Document type</Label>
                      {isNew ? (
                        <Choice
                          label="Document type"
                          value={doc.type}
                          options={documentTypes}
                          onChange={(type) =>
                            update({
                              type,
                              id: nextDocumentId(documents, type),
                            })
                          }
                        />
                      ) : (
                        <Input
                          aria-label="Document type"
                          value={doc.type}
                          readOnly
                        />
                      )}
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Type is locked after creation.
                      </p>
                    </div>
                    <div className={gap}>
                      <Label required>Department</Label>
                      <Choice
                        label="Department"
                        value={doc.department}
                        options={departments}
                        onChange={(department) => update({ department })}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <dl className="grid gap-[var(--spacing-component-xl)] text-sm">
                  {[
                    ["Document ID", doc.id],
                    ["Document type", doc.type],
                    ["Title", doc.name],
                    ["Department", doc.department],
                    ["Category", doc.category || "Normal"],
                    ["Author", doc.author?.name || actors.owner.name],
                    ["Document owner", doc.owner?.name || actors.owner.name],
                    ...(!external
                      ? [
                          ["Reviewer", reviewer.name],
                          ["QA approver", qa.name],
                        ]
                      : []),
                    ["Revision", doc.revision],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <dt className={infoLabel}>{label}</dt>
                      <dd className="break-words">{value}</dd>
                    </div>
                  ))}
                  <div className="min-w-0">
                    <dt className={infoLabel}>Effective date</dt>
                    <dd>
                      {external ? (
                        "Not applicable: external approval"
                      ) : doc.effectiveDate ? (
                        displayDate(doc.effectiveDate)
                      ) : (
                        <>
                          <Badge variant="secondary" shape="pill" size="md">
                            Automatic
                          </Badge>
                          <span> : Approval Date plus 14 Days</span>
                        </>
                      )}
                    </dd>
                  </div>
                </dl>
              )}
              {draft && (
                <dl className="grid gap-[var(--spacing-component-xl)] text-sm">
                  <div>
                    <dt className={infoLabel}>Author / Document owner</dt>
                    <dd>{doc.author?.name || actors.owner.name}</dd>
                  </div>
                  <div>
                    <dt className={infoLabel}>Effective date</dt>
                    <dd>
                      {external ? (
                        "Not applicable: external approval"
                      ) : (
                        <>
                          <Badge variant="secondary" shape="pill" size="md">
                            Automatic
                          </Badge>
                          <span> : Approval Date plus 14 Days</span>
                        </>
                      )}
                    </dd>
                  </div>
                </dl>
              )}
              {draft && !external && (
                <div className="space-y-[var(--spacing-component-lg)]">
                  <div className={gap}>
                    <Label required>Reviewer</Label>
                    <Choice
                      label="Reviewer"
                      value={reviewer.name}
                      options={reviewers.map((p) => p.name)}
                      onChange={(value) => update({ reviewer: value })}
                    />
                  </div>
                  <div className={gap}>
                    <Label required>QA approver</Label>
                    <Choice
                      label="QA approver"
                      value={qa.name}
                      options={qaApprovers.map((p) => p.name)}
                      onChange={(value) => update({ qaApprover: value })}
                    />
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    One reviewer in this demo. Review and QA assignments are
                    locked after submission.
                  </p>
                </div>
              )}
            </InfoSection>
            <InfoSection title="Document links">
              <div className="grid gap-[var(--spacing-component-lg)]">
                {(
                  [
                    {
                      label: "Related review documents",
                      field: "relatedDocuments",
                    },
                    {
                      label: "Reference documents",
                      field: "referredDocuments",
                    },
                  ] as const
                ).map(({ label, field }) =>
                  draft ? (
                    <ComboboxField
                      key={field}
                      id={field}
                      label={label}
                      multiple
                      value={doc[field] || []}
                      placeholder="Select documents"
                      options={documents
                        .filter((d) => d.id !== doc.id && !isRetired(d))
                        .map((d) => ({
                          value: recordKey(d),
                          label: `${d.id} · ${d.name} · ${d.revision}`,
                        }))}
                      onValueChange={(value) =>
                        update({ [field]: Array.isArray(value) ? value : [] })
                      }
                    />
                  ) : (
                    <div key={field}>
                      <p className="mb-[var(--spacing-component-sm)] text-xs text-[var(--color-text-secondary)]">
                        {label}
                      </p>
                      {doc[field]?.length ? (
                        doc[field]!.map((id) => (
                          <Link
                            key={id}
                            className="block text-sm font-medium text-[var(--color-brand-primary)] hover:underline"
                            href={`${basePath}/${id}`}
                          >
                            {documents.find(
                              (d) => recordKey(d) === id || d.id === id
                            )?.name || id}
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          None linked
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </InfoSection>
          </>
        }
      />
      {!approved &&
        !retired &&
        actionHost &&
        createPortal(
          <footer
            aria-label="Document actions"
            className="relative z-10 flex flex-col gap-[var(--spacing-component-lg)] border-t border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] p-[var(--spacing-component-lg)] text-[var(--color-surface-overlay-foreground)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rotate-180 before:shadow-[var(--shadow-lg)] lg:flex-row lg:items-center lg:justify-between lg:px-[var(--spacing-component-xl)]"
          >
            <div className="min-w-0 space-y-[var(--spacing-component-sm)]">
              {doc.status === "In QA Approval" ? (
                <>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    The effective date defaults to 14 days after approval
                  </p>
                  <div className="flex flex-wrap items-center gap-[var(--spacing-component-md)]">
                    {doc.effectiveDateOverride !== undefined ? (
                      <Input
                        aria-label="QA effective date"
                        className="w-auto"
                        type="date"
                        value={doc.effectiveDateOverride}
                        onChange={(e) =>
                          update({ effectiveDateOverride: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">
                        {displayDate(plannedDate)}
                      </p>
                    )}
                    <div className="flex items-center gap-[var(--spacing-component-sm)]">
                      <Checkbox
                        id="override-effective"
                        checked={doc.effectiveDateOverride !== undefined}
                        onCheckedChange={(checked) =>
                          update({
                            effectiveDateOverride: checked
                              ? plannedDate
                              : undefined,
                          })
                        }
                      />
                      <Label htmlFor="override-effective">
                        Override effective date
                      </Label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">
                    {draft
                      ? "Complete this draft before submitting"
                      : "Review the document, then sign your approval"}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {draft
                      ? "Document name and source file are required. Cancel keeps your draft."
                      : `Assigned to ${actor.name} · ${actor.role}`}
                  </p>
                </>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-[var(--spacing-component-sm)]">
              {draft ? (
                <>
                  <Button variant="ghost" onClick={saveAndExit}>
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={saveAndExit}>
                    Save as Draft
                  </Button>
                  <Button disabled={!ready} onClick={submit}>
                    {external
                      ? "Sign and submit"
                      : "Sign and submit for review"}
                    <ArrowRight className="size-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setSigning("reject")}
                  >
                    Reject
                  </Button>
                  <Button
                    disabled={
                      doc.status === "In QA Approval" &&
                      doc.effectiveDateOverride === ""
                    }
                    onClick={() => setSigning("approve")}
                  >
                    {doc.status === "In Review"
                      ? "Sign review"
                      : "Sign final approval"}
                  </Button>
                </>
              )}
            </div>
          </footer>,
          actionHost
        )}
      {signing && (
        <ElectronicSignatureModal
          open={Boolean(signing)}
          onOpenChange={(open) => {
            if (!open) setSigning(null);
          }}
          actionLabel={
            signing === "submit"
              ? "Sign and submit"
              : signing === "reject"
              ? "Sign and reject"
              : signing === "obsolete"
              ? "Sign and mark Obsolete"
              : "Sign and approve"
          }
          reasonRequired={signing === "reject" || signing === "obsolete"}
          title={
            signing === "submit"
              ? external
                ? "Sign external acknowledgement"
                : "Sign author submission"
              : signing === "reject"
              ? "Reject and return to Draft"
              : signing === "obsolete"
              ? "Mark document as Obsolete"
              : doc.status === "In Review"
              ? "Sign review"
              : "Sign final approval"
          }
          record={`${doc.id} · ${doc.name} · ${doc.revision}`}
          signer={actor}
          meaning={
            signing === "reject"
              ? "I reject this submission and return it to the author for revision."
              : signing === "obsolete"
              ? "I confirm this document is no longer required for use. It will remain searchable as a read-only historical record."
              : signing === "submit"
              ? external
                ? "I acknowledge this document was approved externally and submit it as a pre-approved record."
                : "I confirm this revision is complete and submit it for review."
              : doc.status === "In Review"
              ? "I approve this document following technical review."
              : `I approve this document for controlled use from ${displayDate(
                  plannedDate
                )}.`
          }
          onSign={signed}
        />
      )}
    </>
  );
}
