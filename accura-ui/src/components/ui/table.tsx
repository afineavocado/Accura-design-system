import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Table ────────────────────────────────────────────────────────────────────
// shadcn Table — semantic HTML elements, token-correct styling.
// Tokens (from Table.md — Figma 124:8531 / 105:25960):
//
// Container (caller wraps): border/default · radius/base · overflow-hidden
// TableHeader / TableFooter: bg color/surface/raised
// TableHead (<th>):  h-12 px-4 · text-xs font-medium · color/surface/raised/foreground
// TableRow (<tr>):   border-b color/border/default · hover: background/accent
// TableCell (<td>):  p-4 · color/surface/default/foreground
// TableCaption:      color/text/secondary

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-[var(--color-surface-raised)]", className)}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-[var(--color-surface-raised)] font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[var(--color-border-default)] transition-colors",
      "hover:bg-[var(--color-background-accent)]",
      "data-[state=selected]:bg-[var(--color-background-accent)]",
      "data-[state=selected]:border-l-2 data-[state=selected]:border-l-[var(--color-brand-primary)]",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

// TableHead: h-12 (48px) + horizontal padding. Consistent with shadcn.
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle",
      "text-xs font-medium text-[var(--color-surface-raised-foreground)]",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

// TableCell: p-4 (16px all sides) + align-middle. Content determines row height.
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle",
      "text-sm text-[var(--color-surface-default-foreground)]",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-[var(--color-text-secondary)]", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell, TableCaption,
}
