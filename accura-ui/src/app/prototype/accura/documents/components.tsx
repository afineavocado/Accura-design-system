"use client";

import { createContext } from "react";
export const DocumentActionHost = createContext<HTMLElement | null>(null);

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  getUseStatus,
  workflowVariants,
  useStatusVariants,
  type DemoDocument,
  type Stage,
} from "./mock-data";

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
  allLabel,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  /** Filters only: what "All" reads as — "All departments", not
   *  "Department: All". Matches Training. The stored value stays "All", so
   *  filter logic is untouched. The old `Label: value` prefix doubled the
   *  string, which clipped longer values inside a fixed-width trigger.
   *  Form selects have no "All" option and omit this. */
  allLabel?: string;
}) {
  const display = (option: string) =>
    allLabel && option === "All" ? allLabel : option;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue>{display(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem value={option} key={option}>
            {display(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
