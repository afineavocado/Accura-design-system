"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useRowClick } from "../row-click";
import { TablePagination, usePagination } from "../table-pagination";
import Link from "next/link";
import { Search, ArrowDown, ArrowUp } from "lucide-react";
import {
  RecordRowAction,
  RecordRowActionHeading,
} from "@/components/record-row-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { PageHeading, Choice, WorkflowBadge, UseBadge } from "./components";
import {
  actors,
  displayDate,
  nextAction,
  responsible,
  stages,
  getUseStatus,
  documentTypes,
  departments,
  recordKey,
  documentHref,
  isRetired,
} from "./mock-data";
import { useDocuments } from "./store";

function DocumentRow({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const onClick = useRowClick<HTMLTableRowElement>(() => router.push(href));
  return (
    <TableRow
      className="cursor-pointer focus-within:bg-[var(--color-background-accent)]"
      onClick={onClick}
    >
      {children}
    </TableRow>
  );
}

export default function DocumentListing() {
  const docs = useDocuments();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [department, setDepartment] = useState("All");
  const [workflow, setWorkflow] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [category, setCategory] = useState("All");
  const [ascending, setAscending] = useState(true);
  const filtered = docs
    .filter(
      (d) =>
        `${d.name} ${d.id} ${actors.owner.name}`
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (type === "All" || d.type === type) &&
        (department === "All" || d.department === department) &&
        (workflow === "All" || d.status === workflow) &&
        (availability === "All" || getUseStatus(d) === availability) &&
        (category === "All" || (d.category || "Normal") === category)
    )
    .sort((a, b) => a.name.localeCompare(b.name) * (ascending ? 1 : -1));
  const paged = usePagination(filtered);
  const { setPage } = paged;
  const active =
    search ||
    [type, department, workflow, availability, category].some(
      (v) => v !== "All"
    );
  return (
    <>
      <PageHeading />
      <div
        className="mb-[var(--spacing-layout-sm)] flex w-full flex-wrap gap-[var(--spacing-component-sm)] 2xl:w-3/4 xl:w-4/5"
        aria-label="Document filters"
      >
        <div className="relative min-w-52 flex-1 basis-full sm:basis-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            type="search"
            aria-label="Search documents"
            placeholder="Search by name, ID, owner…"
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        {[
          {
            label: "Category",
            value: category,
            options: ["All", "Normal", "Pre-approved / External"],
            change: setCategory,
          },
          {
            label: "Type",
            value: type,
            options: ["All", ...documentTypes],
            change: setType,
          },
          {
            label: "Department",
            value: department,
            options: [
              "All",
              ...new Set([...departments, ...docs.map((d) => d.department)]),
            ],
            change: setDepartment,
          },
          {
            label: "Workflow",
            value: workflow,
            options: ["All", ...stages],
            change: setWorkflow,
          },
          {
            label: "Use status",
            value: availability,
            options: [
              "All",
              "Effective",
              "Pending effective",
              "Not effective",
              "External record",
              "Superseded",
              "Obsolete",
            ],
            change: setAvailability,
          },
        ].map((filter) => (
          <div
            key={filter.label}
            className={
              filter.label === "Type" ? "w-32 flex-none" : "w-40 flex-none"
            }
          >
            <Choice
              label={filter.label}
              value={filter.value}
              options={filter.options}
              prefix
              onChange={(value) => {
                filter.change(value);
                setPage(1);
              }}
            />
          </div>
        ))}
      </div>
      <div className="mb-[var(--spacing-component-md)] flex min-h-8 items-center justify-between gap-[var(--spacing-component-sm)] text-xs text-[var(--color-text-secondary)]">
        <p aria-live="polite">
          {filtered.length} revision records ·{" "}
          {active ? "Filtered results" : "All records"}
        </p>
        {active && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setType("All");
              setDepartment("All");
              setWorkflow("All");
              setAvailability("All");
              setCategory("All");
              setPage(1);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              <TableHead aria-sort={ascending ? "ascending" : "descending"}>
                <button
                  className="flex items-center gap-[var(--spacing-component-sm)] font-semibold"
                  onClick={() => setAscending(!ascending)}
                >
                  Document{" "}
                  {ascending ? (
                    <ArrowUp className="size-3" />
                  ) : (
                    <ArrowDown className="size-3" />
                  )}
                </button>
              </TableHead>
              <TableHead>Revision</TableHead>
              <TableHead>Workflow</TableHead>
              <TableHead>Use status</TableHead>
              <TableHead>Next action</TableHead>
              <TableHead>Document owner</TableHead>
              <RecordRowActionHeading />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.visible.map((doc) => (
              <DocumentRow key={recordKey(doc)} href={documentHref(doc)}>
                <TableCell className="min-w-52">
                  <Link
                    className="font-medium text-[var(--color-brand-primary)] hover:underline focus-visible:underline"
                    href={documentHref(doc)}
                  >
                    {doc.name}
                  </Link>
                  <p className="mt-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">
                    {doc.id} · {doc.type}
                    {doc.category === "Pre-approved / External"
                      ? " · External"
                      : " · Normal"}
                  </p>
                </TableCell>
                <TableCell>
                  <p>{doc.revision}</p>
                  <p className="mt-[var(--spacing-component-xs)] whitespace-nowrap text-xs text-[var(--color-text-secondary)]">
                    {isRetired(doc)
                      ? "Historical revision"
                      : doc.status === "Approved"
                      ? "Current approved revision"
                      : "Working revision"}
                  </p>
                </TableCell>
                <TableCell>
                  <WorkflowBadge status={doc.status} />
                  {doc.returned &&
                    doc.status === "Draft" &&
                    !isRetired(doc) && (
                      <p className="mt-[var(--spacing-component-xs)] text-xs text-[var(--color-text-invalid)]">
                        Returned
                      </p>
                    )}
                </TableCell>
                <TableCell>
                  <UseBadge doc={doc} />
                  <p className="mt-[var(--spacing-component-xs)] whitespace-nowrap text-xs text-[var(--color-text-secondary)]">
                    {isRetired(doc)
                      ? "Not available for use"
                      : doc.category === "Pre-approved / External" &&
                        doc.status === "Approved"
                      ? "Externally approved"
                      : doc.status === "Approved"
                      ? `${
                          getUseStatus(doc) === "Effective" ? "Since" : "From"
                        } ${displayDate(doc.effectiveDate)}`
                      : "Not available for use"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="whitespace-nowrap">
                    {doc.status === "Approved" || isRetired(doc)
                      ? "-"
                      : nextAction(doc)}
                  </p>
                  {doc.status !== "Approved" && !isRetired(doc) && (
                    <p className="mt-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">
                      {responsible(doc).name} · {responsible(doc).role}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <p className="whitespace-nowrap">
                    {doc.owner?.name || actors.owner.name}
                  </p>
                  <p className="mt-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">
                    {doc.department}
                  </p>
                </TableCell>
                <RecordRowAction
                  href={documentHref(doc)}
                  label={`Open ${doc.name} · ${doc.revision}`}
                />
              </DocumentRow>
            ))}
          </TableBody>
        </Table>
        {paged.visible.length === 0 && (
          <div className="p-[var(--spacing-layout-lg)] text-center">
            <p className="font-medium">No matching documents</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Try a different keyword or clear your filters.
            </p>
          </div>
        )}
      </div>
      <div className="mt-[var(--spacing-component-lg)]">
        <TablePagination {...paged} noun="revision records" />
      </div>
    </>
  );
}
