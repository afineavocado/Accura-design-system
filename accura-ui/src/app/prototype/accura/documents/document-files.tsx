"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Paperclip,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecordSection } from "@/components/record-workflow";
import { downloadBlob, retainFile, retrieveFile } from "./file-storage";
import { displayDate, displayTime, type DemoDocument } from "./mock-data";

const supported = ".doc,.docx,.xls,.xlsx,.ppt,.pptx";
const paragraphs = (doc: DemoDocument) => [
  doc.name || "Deviation Handling",
  "1. Purpose",
  doc.content.purpose,
  "2. Scope",
  doc.content.scope,
  "3. Procedure",
  ...(doc.content.procedure || [
    "Follow the documented procedure and retain the associated records.",
  ]),
];

// PDF fixture renderer, not a DOCX/Office converter. Download stamping is intentionally separate.
export function buildDemoPdf(doc: DemoDocument, stamp?: string) {
  const wrap = (line: string) => line.match(/.{1,76}(?:\s|$)/g) || [line];
  const approved = doc.status === "Approved";
  const body = paragraphs(doc).flatMap((line) => [...wrap(line), ""]);
  const pages = approved
    ? [
        [
          "DOCUMENT METADATA",
          "",
          `Name: ${doc.name}`,
          `Document ID: ${doc.id}`,
          `Revision: ${doc.revision}`,
          "Document kind: Normal document",
          `Department: ${doc.department}`,
          `Effective date: ${displayDate(doc.effectiveDate)}`,
          "",
          "Prototype metadata page - example only",
        ],
        body,
        [
          "APPROVAL RECORD",
          "",
          ...doc.signatures.flatMap((s) => [
            s.name,
            s.role,
            displayTime(s.timestamp),
            ...wrap(s.meaning),
            "",
          ]),
          `Record: ${doc.id} / ${doc.revision}`,
          "",
          "Prototype signatures - not production electronic signatures",
        ],
      ]
    : [body];
  const escape = (s: string) =>
    s.replace(/[^\x20-\x7e]/g, "-").replace(/([\\()])/g, "\\$1");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  const kids: string[] = [];
  pages.forEach((lines, index) => {
    const pageId = objects.length + 1;
    kids.push(`${pageId} 0 R`);
    const content = [
      ...(approved ? [`ACCURA | ${doc.id} | ${doc.revision}`, ""] : []),
      ...lines,
    ];
    let stream = `BT /F1 11 Tf 48 780 Td 16 TL ${content
      .map((line, i) => `${i ? "T* " : ""}(${escape(line)}) Tj`)
      .join("\n")} ET`;
    if (approved)
      stream += `\nBT /F1 9 Tf 48 48 Td (${escape(
        `${doc.id} | Effective ${displayDate(doc.effectiveDate)} | Page ${
          index + 1
        } of ${pages.length}`
      )}) Tj ET`;
    if (stamp) stream += `\nBT /F1 8 Tf 48 28 Td (${escape(stamp)}) Tj ET`;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${
        pageId + 1
      } 0 R >>`,
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    );
  });
  objects[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${
    pages.length
  } >>`;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((n) => `${String(n).padStart(10, "0")} 00000 n \n`)
    .join("")}trailer\n<< /Size ${
    objects.length + 1
  } /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}

function PdfPreview({ doc }: { doc: DemoDocument }) {
  const [page, setPage] = useState(1);
  const approved = doc.status === "Approved";
  const total = approved ? 3 : 1;
  return (
    <div
      className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-default)]"
      aria-label="PDF preview (simulated)"
    >
      <div className="flex items-center justify-between gap-[var(--spacing-component-sm)] bg-[var(--color-surface-raised)] p-[var(--spacing-component-md)] text-xs text-[var(--color-text-secondary)]">
        <span>PDF preview · simulated</span>
        <div className="flex items-center gap-[var(--spacing-component-sm)]">
          <Button
            size="icon-sm"
            variant="ghost"
            disabled={page === 1}
            aria-label="Previous PDF page"
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span aria-live="polite">
            Page {page} of {total}
          </span>
          <Button
            size="icon-sm"
            variant="ghost"
            disabled={page === total}
            aria-label="Next PDF page"
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <article className="min-h-[440px] space-y-[var(--spacing-component-xl)] bg-[var(--color-background-default)] p-[var(--spacing-component-xl)] text-sm leading-relaxed text-[var(--color-background-default-foreground)]">
        {approved && (
          <header className="flex flex-wrap justify-between border-b border-[var(--color-border-default)] pb-[var(--spacing-component-md)] text-xs">
            <strong>ACCURA</strong>
            <span>
              {doc.id} · {doc.revision}
            </span>
          </header>
        )}
        {approved && page === 1 ? (
          <>
            <h3 className="text-lg font-semibold">Document metadata</h3>
            <dl className="grid gap-[var(--spacing-component-lg)] sm:grid-cols-2">
              {[
                ["Document", doc.name],
                ["ID / Revision", `${doc.id} / ${doc.revision}`],
                ["Document kind", "Normal document"],
                ["Department", doc.department],
                ["Effective date", displayDate(doc.effectiveDate)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-[var(--color-text-secondary)]">
                    {label}
                  </dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : approved && page === 3 ? (
          <>
            <h3 className="text-lg font-semibold">Approval record</h3>
            {doc.signatures.map((s) => (
              <div
                className="space-y-[var(--spacing-component-xs)]"
                key={s.role}
              >
                <p className="font-medium">
                  {s.name} · {s.role}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {displayTime(s.timestamp)}
                </p>
                <p>{s.meaning}</p>
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold">{doc.name}</h3>
            <section>
              <h4 className="font-semibold">1. Purpose</h4>
              <p>{doc.content.purpose}</p>
            </section>
            <section>
              <h4 className="font-semibold">2. Scope</h4>
              <p>{doc.content.scope}</p>
            </section>
            <section>
              <h4 className="font-semibold">3. Procedure</h4>
              <ol className="list-decimal space-y-[var(--spacing-component-sm)] pl-[var(--spacing-component-lg)]">
                {(
                  doc.content.procedure || [
                    "Follow the documented process and retain the associated records.",
                  ]
                ).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </section>
          </>
        )}
        {approved && (
          <footer className="border-t border-[var(--color-border-default)] pt-[var(--spacing-component-md)] text-xs text-[var(--color-text-secondary)]">
            {doc.id} · Effective {displayDate(doc.effectiveDate)} · Page {page}{" "}
            of {total}
          </footer>
        )}
      </article>
    </div>
  );
}

export function DocumentFiles({
  doc,
  update,
}: {
  doc: DemoDocument;
  update: (patch: Partial<DemoDocument>) => void;
}) {
  const [busy, setBusy] = useState(false);
  const draft = doc.status === "Draft";
  const approved = doc.status === "Approved";
  const original = async () => {
    if (doc.sample) {
      // A real Word-readable RTF fixture, identified as .doc rather than pretending it is DOCX.
      const safe = (text: string) =>
        text.replace(/[\\{}]/g, " ").replace(/[^\x20-\x7e]/g, "-");
      downloadBlob(
        new Blob(
          [`{\\rtf1\\ansi ${paragraphs(doc).map(safe).join("\\par ")}}`],
          { type: "application/msword" }
        ),
        `${doc.id}-sample.doc`
      );
      return;
    }
    const file = doc.sourceKey ? await retrieveFile(doc.sourceKey) : undefined;
    if (file) downloadBlob(file, doc.file);
    else
      toast.info(
        "This older demo record contains only a filename. Add a file in a new draft to test original-file download."
      );
  };
  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const saved = await retainFile(file);
      update({ file: saved.name, sourceKey: saved.key, sample: false });
    } finally {
      setBusy(false);
    }
  };
  return (
    <RecordSection
      title={draft ? "Document file" : approved ? "Approved PDF" : "Review PDF"}
      description={
        draft
          ? "Attach the original Word, Excel, or PowerPoint file. PDF conversion takes place on submission."
          : approved
          ? "Read-only PDF with header, footer, and first/last metadata pages."
          : "PDF is available from submission. Reviewers can download the original, but cannot replace it."
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-component-md)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-[var(--spacing-component-lg)]">
        <div className="flex min-w-0 items-center gap-[var(--spacing-component-md)]">
          <FileText className="size-5 shrink-0 text-[var(--color-icon-muted)]" />
          <div className="min-w-0">
            <p className="break-all text-sm font-medium">
              {draft
                ? doc.file || "No file uploaded"
                : `${doc.id}-${doc.revision}.pdf`}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {draft ? "Original source" : `Source: ${doc.file}`} ·{" "}
              {doc.revision}
            </p>
          </div>
        </div>
        {doc.file && (
          <Button variant="outline" size="sm" onClick={original}>
            <Download className="size-4" />
            Download original
          </Button>
        )}
      </div>
      {draft && (
        <div className="space-y-[var(--spacing-component-sm)]">
          <Label required htmlFor="document-upload">Document file</Label>
          <Input
            id="document-upload"
            type="file"
            accept={supported}
            disabled={busy}
            onChange={(e) => void upload(e.target.files?.[0])}
          />
          <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() =>
                update({
                  file: "Deviation-Handling.doc",
                  sample: true,
                  sourceKey: undefined,
                  name: doc.name || "Deviation Handling",
                })
              }
            >
              Use sample Word file
            </Button>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {busy
                ? "Saving file locally…"
                : "DOC/DOCX, XLS/XLSX, PPT/PPTX · Stored only in this browser"}
            </p>
          </div>
        </div>
      )}
      {doc.file &&
        (draft ? (
          <div className="space-y-[var(--spacing-component-lg)] border-t border-[var(--color-border-default)] pt-[var(--spacing-component-lg)]">
            <p className="text-xs text-[var(--color-text-secondary)]">
              Original-format preview ·{" "}
              {doc.sample
                ? "Word sample (simulated rendering)"
                : "Office viewer not connected"}
            </p>
            {doc.sample ? (
              <article
                className="space-y-[var(--spacing-component-lg)] text-sm leading-relaxed"
                aria-label="Original document preview"
              >
                <h3 className="text-lg font-semibold">{doc.name}</h3>
                <h4 className="font-semibold">1. Purpose</h4>
                <p>{doc.content.purpose}</p>
                <h4 className="font-semibold">2. Scope</h4>
                <p>{doc.content.scope}</p>
              </article>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">
                Your original file is retained locally and can be downloaded.
                Use the sample to see the demo preview; this prototype does not
                render or convert arbitrary Office files.
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {doc.sample
                ? "PDF fixture for the sample document."
                : "Illustrative PDF fixture, not the converted content of your uploaded file."}{" "}
              {approved
                ? "3 pages · metadata + content + approval record."
                : "No approval metadata or download stamp in the review copy."}
            </p>
            <PdfPreview key={doc.status} doc={doc} />
            <div className="flex flex-wrap items-center gap-[var(--spacing-component-md)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const stamp = `Downloaded ${displayTime(
                    new Date().toISOString()
                  )} | PROTOTYPE COPY`;
                  downloadBlob(
                    new Blob([buildDemoPdf(doc, stamp)], {
                      type: "application/pdf",
                    }),
                    `${doc.id}-${doc.revision}-demo.pdf`
                  );
                }}
              >
                <Download className="size-4" />
                Download PDF
              </Button>
              <span className="text-xs text-[var(--color-text-secondary)]">
                Stamp added to this download only.
              </span>
            </div>
          </>
        ))}
    </RecordSection>
  );
}

export function DocumentAttachments({
  doc,
  update,
}: {
  doc: DemoDocument;
  update: (patch: Partial<DemoDocument>) => void;
}) {
  const [busy, setBusy] = useState(false);
  const items = doc.attachments || [];
  const add = async (files: FileList | null) => {
    if (!files) return;
    const chosen = Array.from(files).slice(0, 5 - items.length);
    setBusy(true);
    try {
      update({
        attachments: [...items, ...(await Promise.all(chosen.map(retainFile)))],
      });
    } finally {
      setBusy(false);
    }
  };
  return (
    <RecordSection
      title="Pre-approved attachments"
      description={`${items.length} of 5 attachments · Already approved; excluded from this document's review and approval workflow.`}
    >
      {items.length ? (
        <ul className="space-y-[var(--spacing-component-md)]">
          {items.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-[var(--spacing-component-md)]"
            >
              <Paperclip className="size-4 shrink-0 text-[var(--color-icon-muted)]" />
              <div className="min-w-0 flex-1">
                <p className="break-all text-sm font-medium">{item.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {Math.max(1, Math.ceil(item.size / 1024))} KB · Pre-approved
                </p>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={`Download ${item.name}`}
                onClick={async () => {
                  const blob = await retrieveFile(item.key);
                  if (blob) downloadBlob(blob, item.name);
                }}
              >
                <Download className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">
          No attachments added.
        </p>
      )}
      {doc.status === "Draft" && (
        <div className="space-y-[var(--spacing-component-sm)]">
          <Label htmlFor="attachments-upload">
            Add pre-approved attachments
          </Label>
          <Input
            id="attachments-upload"
            type="file"
            multiple
            disabled={busy || items.length >= 5}
            onChange={(e) => void add(e.target.files)}
          />
          <p className="text-xs text-[var(--color-text-secondary)]">
            {busy
              ? "Saving attachments…"
              : items.length >= 5
              ? "5-attachment limit reached."
              : `Select up to ${
                  5 - items.length
                } files. Attachments stay unchanged during review.`}
          </p>
        </div>
      )}
    </RecordSection>
  );
}
