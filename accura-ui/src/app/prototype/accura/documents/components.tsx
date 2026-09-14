"use client";

import { createContext } from "react";
export const DocumentActionHost = createContext<HTMLElement | null>(null);

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  basePath,
  getUseStatus,
  workflowVariants,
  useStatusVariants,
  type DemoDocument,
  type Stage,
} from "./mock-data";

export function PageHeading({ detail = false }: { detail?: boolean }) {
  return (
    <div className="mb-[var(--spacing-layout-sm)] flex flex-wrap items-start justify-between gap-[var(--spacing-component-lg)]">
      <div>
        <h1 className="text-xl font-semibold">Documents</h1>
        <p className="mt-[var(--spacing-component-xs)] text-sm text-[var(--color-text-secondary)]">
          {detail
            ? "Manage this revision, its approval progress, and controlled use."
            : "Find the right revision, see who acts next, and check whether a document is effective."}
        </p>
      </div>
      <Button variant={detail ? "outline" : "default"} asChild>
        <Link href={`${basePath}/new`}>
          <Plus className="size-4" />
          Create Document
        </Link>
      </Button>
    </div>
  );
}
export function WorkflowBadge({ status }: { status: Stage }) {
  return (
    <Badge
      className="whitespace-nowrap"
      shape="pill"
      size="md"
      variant={workflowVariants[status]}
    >
      {status}
    </Badge>
  );
}
export function UseBadge({ doc }: { doc: DemoDocument }) {
  const status = getUseStatus(doc);
  return (
    <Badge
      className="whitespace-nowrap"
      shape="pill"
      size="md"
      variant={useStatusVariants[status]}
    >
      {status}
    </Badge>
  );
}
export function Choice({
  label,
  value,
  options,
  onChange,
  prefix = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  prefix?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue>{prefix ? `${label}: ${value}` : value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem value={option} key={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
