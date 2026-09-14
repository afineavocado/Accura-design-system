"use client";

import { useState, useContext, type ReactNode } from "react";
import { DocumentActionHost } from "./components";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
    <Card className="p-[var(--spacing-component-xl)] text-[var(--color-surface-overlay-foreground)]">
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
  const existing = docs.find((d) => d.id === id);
  if (id !== "new" && !existing)
    return (
      <>
        <p>Document not found in this prototype.</p>
        <Button asChild variant="link">
          <Link href={basePath}>Back to Documents</Link>
        </Button>
      </>
    );
  const nextId = `SOP-${String(
    Math.max(
      0,
      ...docs
        .filter((d) => d.type === "SOP")
        .map((d) => Number(d.id.split("-")[1]))
    ) + 1
  ).padStart(3, "0")}`;
  return (
    <DetailEditor
      key={`${id}-${existing?.activity[0]?.timestamp || "new"}`}
      initial={existing || newDocument(nextId)}
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
  const [signing, setSigning] = useState(false);
  const actionHost = useContext(DocumentActionHost);
  const draft = doc.status === "Draft";
  const approved = doc.status === "Approved";
  const actor = responsible(doc);
  const reviewer = reviewerFor(doc);
  const qa = qaFor(doc);
  const plannedDate =
    doc.effectiveDateOverride ||
    approvalEffectiveDate(new Date().toISOString());
  const workflowSteps = [
    { label: "Draft", description: actors.owner.name },
    { label: "In Review", description: reviewer.name },
    { label: "In Approval", description: qa.name },
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
      fromStatus:
        signature.role === "QA Approver" ? "In Approval" : "In Review",
      toStatus: signature.role === "QA Approver" ? "Approved" : "In Approval",
    };
    if (match) Object.assign(match, entry);
    else
      auditEvents.push({
        ...entry,
        id: `signature-${i}`,
        action:
          signature.role === "QA Approver"
            ? "Final approval signed"
            : "Review approval signed",
      });
  });
  const ready = Boolean(doc.name.trim() && doc.file && reviewer && qa);
  const update = (patch: Partial<DemoDocument>) =>
    setDoc((prev) => ({ ...prev, ...patch }));
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
  const submit = () => {
    persist(
      { ...doc, status: "In Review" },
      `Submitted for review · PDF conversion simulated · assigned to ${reviewer.name}`
    );
    toast.success("Submitted for review");
    if (isNew) router.replace(`${basePath}/${doc.id}`);
  };
  const signed = (receipt: SignatureReceipt) => {
    const status = doc.status === "In Review" ? "In Approval" : "Approved";
    const effectiveDate =
      status === "Approved"
        ? doc.effectiveDateOverride || approvalEffectiveDate(receipt.timestamp)
        : "";
    persist(
      {
        ...doc,
        status,
        effectiveDate,
        approvedAt: status === "Approved" ? receipt.timestamp : undefined,
        signatures: [...doc.signatures, receipt],
      },
      status === "Approved"
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
        : "Review complete — ready for QA approval"
    );
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
            {doc.id} · {doc.revision} · Normal document · Current revision
          </p>
        </div>
        <RecordAuditDrawer
          record={`${doc.id} · ${doc.revision}`}
          events={auditEvents}
        />
      </div>
      <RecordDetailLayout
        ratio="70/30"
        progress={
          <Card className="p-[var(--spacing-component-xl)]">
            <CardContent>
              <div className="hidden md:block">
                <Stepper
                  className="[&>li:first-child]:flex-[0.5] [&>li:last-child]:flex-[0.5]"
                  steps={workflowSteps}
                  currentStep={approved ? 5 : stages.indexOf(doc.status) + 1}
                  aria-label="Record workflow"
                />
              </div>
              <div className="md:hidden">
                <Stepper
                  steps={workflowSteps}
                  currentStep={approved ? 5 : stages.indexOf(doc.status) + 1}
                  orientation="vertical"
                  aria-label="Record workflow"
                />
              </div>
            </CardContent>
          </Card>
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
                    <Label htmlFor="document-name">Document name *</Label>
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
                      <Label>Document type *</Label>
                      {isNew ? (
                        <Choice
                          label="Document type"
                          value={doc.type}
                          options={["SOP", "POL"]}
                          onChange={(type) =>
                            update({
                              type,
                              id: `${type}-${String(
                                Math.max(
                                  0,
                                  ...documents
                                    .filter((d) => d.type === type)
                                    .map((d) => Number(d.id.split("-")[1]))
                                ) + 1
                              ).padStart(3, "0")}`,
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
                      <Label>Department *</Label>
                      <Choice
                        label="Department"
                        value={doc.department}
                        options={[
                          "Quality Assurance",
                          "Manufacturing",
                          "Regulatory",
                        ]}
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
                    ["Document owner", actors.owner.name],
                    ["QA approver", qa.name],
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
                      {doc.effectiveDate ? (
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
                    <dt className={infoLabel}>Document owner</dt>
                    <dd>{actors.owner.name}</dd>
                  </div>
                  <div>
                    <dt className={infoLabel}>Effective date</dt>
                    <dd>
                      <Badge variant="secondary" shape="pill" size="md">
                        Automatic
                      </Badge>
                      <span> : Approval Date plus 14 Days</span>
                    </dd>
                  </div>
                </dl>
              )}
              {draft && (
                <div className="space-y-[var(--spacing-component-lg)]">
                  <div className={gap}>
                    <Label>Reviewer *</Label>
                    <Choice
                      label="Reviewer"
                      value={reviewer.name}
                      options={reviewers.map((p) => p.name)}
                      onChange={(value) => update({ reviewer: value })}
                    />
                  </div>
                  <div className={gap}>
                    <Label>QA approver *</Label>
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
                        .filter((d) => d.id !== doc.id)
                        .map((d) => ({
                          value: d.id,
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
                            {id} · {documents.find((d) => d.id === id)?.name}
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
        actionHost &&
        createPortal(
          <footer
            aria-label="Document actions"
            className="relative z-10 flex flex-col gap-[var(--spacing-component-lg)] border-t border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] p-[var(--spacing-component-lg)] text-[var(--color-surface-overlay-foreground)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rotate-180 before:shadow-[var(--shadow-lg)] lg:flex-row lg:items-center lg:justify-between lg:px-[var(--spacing-component-xl)]"
          >
            <div className="min-w-0 space-y-[var(--spacing-component-sm)]">
              {doc.status === "In Approval" ? (
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
                    Submit for Review
                    <ArrowRight className="size-4" />
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full lg:min-w-64"
                  disabled={
                    doc.status === "In Approval" &&
                    doc.effectiveDateOverride === ""
                  }
                  onClick={() => setSigning(true)}
                >
                  {doc.status === "In Review"
                    ? "Sign review"
                    : "Sign final approval"}
                </Button>
              )}
            </div>
          </footer>,
          actionHost
        )}
      {signing && (
        <ElectronicSignatureModal
          open={signing}
          onOpenChange={setSigning}
          title={
            doc.status === "In Review" ? "Sign review" : "Sign final approval"
          }
          record={`${doc.id} · ${doc.name} · ${doc.revision}`}
          signer={actor}
          meaning={
            doc.status === "In Review"
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
