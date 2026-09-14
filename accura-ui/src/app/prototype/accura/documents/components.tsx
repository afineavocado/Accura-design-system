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
      style={
        status === "Superseded"
          ? {
              opacity: "calc(var(--opacity-disabled) / 100)",
              textDecoration: "line-through",
            }
          : undefined
      }
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
