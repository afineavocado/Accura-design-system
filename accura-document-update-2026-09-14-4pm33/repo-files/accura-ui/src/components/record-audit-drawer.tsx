"use client";

import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export type RecordAuditEvent = {
  id: string;
  timestamp: string;
  name: string;
  action: string;
  record: string;
  role?: string;
  account?: string;
  meaning?: string;
  fromStatus?: string;
  toStatus?: string;
};

/** Shared presentation: callers supply module events; no invented verification or workflow rules. */
export function RecordAuditDrawer({
  record,
  events,
}: {
  record: string;
  events: RecordAuditEvent[];
}) {
  const ordered = [...events].sort(
    (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)
  );
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Clock3 className="size-4" />
          View audit trail
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Audit Trail Record</SheetTitle>
          <SheetDescription>{record} · Latest first · UTC</SheetDescription>
        </SheetHeader>
        <ol className="min-h-0 flex-1 overflow-y-auto px-[var(--spacing-component-lg)]">
          {ordered.length ? (
            ordered.map((event) => (
              <li
                key={event.id}
                className="space-y-[var(--spacing-component-sm)] border-b border-[var(--color-border-default)] py-[var(--spacing-component-lg)] text-[var(--color-surface-overlay-foreground)] last:border-0"
              >
                <p className="text-base font-semibold">{event.name}</p>
                {event.role && (
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {event.role}
                  </p>
                )}
                <time
                  dateTime={event.timestamp}
                  className="block text-xs text-[var(--color-text-secondary)]"
                >
                  {new Date(event.timestamp).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: "UTC",
                    hour12: false,
                  })}{" "}
                  UTC
                </time>
                <p className="text-sm">{event.action}</p>
                {event.toStatus && (
                  <p className="text-sm">
                    {event.fromStatus && `${event.fromStatus} → `}
                    {event.toStatus}
                  </p>
                )}
                {event.meaning && (
                  <div className="space-y-[var(--spacing-component-sm)]">
                    <Badge variant="secondary" shape="pill" size="md">
                      Signature recorded
                    </Badge>
                    <p className="text-sm">{event.meaning}</p>
                    {event.account && (
                      <p className="break-all text-xs text-[var(--color-text-secondary)]">
                        {event.account}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {event.record}
                </p>
              </li>
            ))
          ) : (
            <li className="py-[var(--spacing-component-lg)] text-sm text-[var(--color-text-secondary)]">
              No audit events yet. Activity will appear when this record is
              saved or submitted.
            </li>
          )}
        </ol>
      </SheetContent>
    </Sheet>
  );
}
