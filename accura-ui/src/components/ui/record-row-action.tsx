"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead, useTableOverflow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/** Last column of a scrollable Table. Keeps the action in the visible scrollport.
 * Hover/focus reveal is progressive enhancement: touch and keyboard keep access.
 * Uses shared Table overflow detection; fitting tables keep normal inline actions.
 */
export function RecordRowAction({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const overflow = useTableOverflow();
  return (
    <TableCell
      data-record-row-action=""
      className={cn(
        "w-[calc(var(--button-size-button-height-default)+2*var(--spacing-component-md))] min-w-[calc(var(--button-size-button-height-default)+2*var(--spacing-component-md))] p-[var(--spacing-component-md)]",
        overflow &&
          "sticky right-0 z-10 opacity-100 [@media(hover:hover)_and_(pointer:fine)]:pointer-events-none [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [tr:hover_&]:pointer-events-auto [tr:hover_&]:opacity-100 [tr:focus-within_&]:pointer-events-auto [tr:focus-within_&]:opacity-100"
      )}
    >
      <div
        data-record-action-container=""
        className={cn(
          "flex items-center justify-center",
          overflow &&
            "absolute inset-0 bg-[var(--color-surface-overlay)] text-[var(--color-surface-overlay-foreground)] p-[var(--spacing-component-md)] shadow-[var(--shadow-md)]"
        )}
      >
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={href}
            aria-label={label}
            title={label}
            onClick={(event) => event.stopPropagation()}
          >
            <Eye aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </TableCell>
  );
}

export function RecordRowActionHeading() {
  const overflow = useTableOverflow();
  return (
    <TableHead
      scope="col"
      className={cn(
        overflow && "sticky right-0 z-10 bg-[var(--color-surface-raised)]"
      )}
    >
      <span className="sr-only">Open record</span>
    </TableHead>
  );
}
