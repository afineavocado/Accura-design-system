"use client";

import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  StateChange,
  type StateChangeDirection,
} from "@/components/state-change";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
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
  transitionDirection,
}: {
  record: string;
  events: RecordAuditEvent[];
  /** Whether a transition moved the record forward, back a stage, or killed
   *  it. Only the module knows its own lifecycle; modules that only ever move
   *  forward omit this. */
  transitionDirection?: (from: string, to: string) => StateChangeDirection;
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
                className="space-y-[var(--spacing-component-xs)] border-b border-[var(--color-border-default)] py-[var(--spacing-component-lg)] text-[var(--color-surface-overlay-foreground)] last:border-0"
              >
                <p className="text-sm font-medium">{event.name}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {event.role && `${event.role} · `}
                  {event.account && `${event.account} · `}
                  <time dateTime={event.timestamp}>
                    {new Date(event.timestamp).toLocaleString("en-US", {
                      day: "numeric",
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
                </p>
                <p className="text-sm">{event.action}</p>

                {/* The pill carries the transition, so the bare "from → to"
                    line this used to print is gone. */}
                {event.toStatus &&
                  (event.fromStatus ? (
                    <StateChange
                      from={event.fromStatus}
                      to={event.toStatus}
                      direction={
                        transitionDirection?.(event.fromStatus, event.toStatus) ??
                        "forward"
                      }
                    />
                  ) : (
                    <p className="text-sm">{event.toStatus}</p>
                  ))}

                {event.meaning && (
                  <div className="space-y-[var(--spacing-component-sm)]">
                    <Badge variant="secondary" shape="pill" size="md">
                      Signature recorded
                    </Badge>
                    <p className="text-sm">{event.meaning}</p>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="py-[var(--spacing-component-lg)] text-sm text-[var(--color-text-secondary)]">
              No audit events yet. Activity will appear when this record is
              saved or submitted.
            </li>
          )}
        </ol>
        {/* Every module that hand-rolled this drawer had one, and the brief
            lists Export Audit Report beside View audit trail as a universal
            detail-page control. Leaving it out of the shared component meant
            Deviations and Documents silently lacked it. */}
        <SheetFooter>
          <Button className="w-full">Export Audit Report</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
