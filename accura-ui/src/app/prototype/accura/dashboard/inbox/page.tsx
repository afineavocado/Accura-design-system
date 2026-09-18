"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ClipboardCheck,
  FileSearch,
  FileText,
  GraduationCap,
  ShieldAlert,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import {
  RecordRowAction,
  RecordRowActionHeading,
} from "@/components/record-row-action"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useDocuments } from "../../documents/store"
import { ListSummary } from "../../list-summary"
import { useRowClick } from "../../row-click"
import { DashboardShell } from "../dashboard-shell"
import { daysUntil, formatShortDate } from "../mock-data"
import {
  healthBadge,
  myActions,
  priorities,
  priorityVariant,
  summary,
  tiles,
  upcoming,
  type InboxRow,
  type Tile,
} from "./inbox-data"

/* Layout A+ v2.
   Key metrics and the table are independent: a tile links to its module list
   pre-filtered to the same records it counts (or is static when the module has
   no matching filter). The table lists records with its own Priority filter. */

const tabs = [
  { value: "mine", label: "My actions" },
  { value: "upcoming", label: "Upcoming" },
] as const
type TabValue = (typeof tabs)[number]["value"]

const tileClass =
  "flex flex-col gap-[var(--spacing-component-sm)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] p-[var(--spacing-component-md)]"

/* Same icons as the sidebar where the module is there (Deviations →
   Non-Conformance); Audits and Risks have no sidebar item yet. */
const areaIcon: Record<Tile["area"], LucideIcon> = {
  Training: GraduationCap,
  CAPA: ClipboardCheck,
  Documents: FileText,
  "Non-Conformance": TriangleAlert,
  Audits: FileSearch,
  Risks: ShieldAlert,
}

function MetricTile({ tile }: { tile: Tile }) {
  const Icon = areaIcon[tile.area]
  const badge = healthBadge[tile.health]
  const body = (
    <>
      <span className="flex items-center justify-between gap-[var(--spacing-component-xs)]">
        <span className="flex min-w-0 items-center gap-[var(--spacing-component-sm)]">
          {/* Icon chip: brand ramp /800 fill (color/brand/primary), /50 icon.
              /50 (#e6f7ee) has NO semantic token — the only variable carrying it
              is the component token button/secondary/bg-hover, borrowed here.
              The paired foreground of brand/primary is white; /50 departs from
              the paired-surface rule by request. */}
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] text-[var(--button-secondary-bg-hover)]"
          >
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[var(--color-surface-overlay-foreground)]">{tile.area}</span>
        </span>
        <Badge variant={badge.variant} shape="pill" size="sm">
          {badge.label}
        </Badge>
      </span>
      {/* Big number on its own line, description beneath (display/md 36px,
          Albert Sans). Numbers inside the description are bold. */}
      <span className="flex flex-col">
        <span className="font-heading text-4xl font-semibold leading-[45px] tracking-[-1.5px] text-[var(--color-surface-overlay-foreground)]">
          {tile.attention}
        </span>
        <span className="text-sm text-[var(--color-text-secondary)]">
          {tile.attentionLabel} · of{" "}
          <span className="font-semibold text-[var(--color-surface-overlay-foreground)]">{tile.total}</span>{" "}
          {tile.totalNoun}
        </span>
      </span>
    </>
  )
  if (!tile.connected) {
    // Same anatomy as a live tile, dimmed: sample data for a module not built yet.
    return (
      <div aria-disabled="true" className={`${tileClass} opacity-60`}>
        {body}
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">Module not built · sample data</span>
      </div>
    )
  }
  return tile.href ? (
    <Link
      href={tile.href}
      aria-label={`${tile.area}: ${tile.attention} ${tile.attentionLabel} of ${tile.total} ${tile.totalNoun}. ${tile.segments.map((s) => `${s.count} ${s.label}`).join(", ")}. Open filtered list`}
      className={`${tileClass} hover:bg-[var(--color-surface-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]`}
    >
      {body}
    </Link>
  ) : (
    <div className={tileClass}>{body}</div>
  )
}

function DueCell({ row }: { row: InboxRow }) {
  if (!row.due) {
    return (
      <span className="flex flex-col">
        <span className="text-[var(--color-text-secondary)]">No due date</span>
        {row.waitingDays !== undefined && (
          <span className="text-xs text-[var(--color-text-secondary)]">Waiting {row.waitingDays} days</span>
        )}
      </span>
    )
  }
  const d = daysUntil(row.due)
  return (
    <span className="flex flex-col">
      <span>{formatShortDate(row.due)}</span>
      <span className={d < 0 ? "text-xs text-[var(--color-text-invalid)]" : "text-xs text-[var(--color-text-secondary)]"}>
        {d < 0 ? `${-d} days late` : d === 0 ? "Today" : `In ${d} day${d === 1 ? "" : "s"}`}
      </span>
    </span>
  )
}

function Row({ row }: { row: InboxRow }) {
  const router = useRouter()
  const onClick = useRowClick<HTMLTableRowElement>(() => {
    if (row.href) router.push(row.href)
  })
  return (
    <TableRow className={row.href ? "cursor-pointer" : undefined} onClick={onClick}>
      <TableCell>
        <span className="flex flex-col">
          {row.href ? (
            <Link href={row.href} className="font-medium text-[var(--color-brand-primary)] hover:underline">
              {row.record}
            </Link>
          ) : (
            <span className="font-medium">{row.record}</span>
          )}
          <span className="text-xs text-[var(--color-text-secondary)]">
            {row.detail}
            {row.notBuilt && " · Module not built"}
          </span>
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={row.statusVariant} shape="pill" size="md">
          {row.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={priorityVariant[row.priority]} shape="pill" size="md">
          {row.priority}
        </Badge>
      </TableCell>
      <TableCell>{row.module}</TableCell>
      <TableCell>
        <DueCell row={row} />
      </TableCell>
      {/* Shared row action (eye icon), same as Documents. Unbuilt modules
          have nowhere to open, so their cell stays empty. */}
      {row.href ? (
        <RecordRowAction href={row.href} label={`Open ${row.record}`} />
      ) : (
        <TableCell />
      )}
    </TableRow>
  )
}

export default function DashboardInboxPage() {
  const docs = useDocuments()
  const [tab, setTab] = React.useState<TabValue>("mine")
  const [priority, setPriority] = React.useState("All")

  const tileList = tiles(docs)
  const rows: Record<TabValue, InboxRow[]> = { mine: myActions(docs), upcoming: upcoming(docs) }
  const all = rows[tab]
  const visible = priority === "All" ? all : all.filter((r) => r.priority === priority)
  const notice = summary(rows.mine)

  return (
    <DashboardShell>
      {notice && (
        <Alert variant={notice.late ? "destructive" : "warning"}>
          <div className="flex flex-row items-center gap-[var(--spacing-component-md)]">
            <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
            <AlertTitle className="leading-5">{notice.text}</AlertTitle>
          </div>
        </Alert>
      )}

      <section aria-labelledby="glance-title" className="flex flex-col gap-[var(--spacing-component-sm)]">
        <div className="flex flex-wrap items-baseline justify-between gap-[var(--spacing-component-sm)]">
          <h2 id="glance-title" className="font-sans text-base font-semibold">
            Overview
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)]">Whole organization · updated 08:30</p>
        </div>
        <div className="grid grid-cols-1 gap-[var(--spacing-component-md)] sm:grid-cols-2 lg:grid-cols-3">
          {tileList.map((t) => (
            <MetricTile key={t.area} tile={t} />
          ))}
        </div>
      </section>

      <section aria-labelledby="records-title" className="flex flex-col gap-[var(--spacing-component-sm)]">
        <h2 id="records-title" className="font-sans text-base font-semibold">
          Records
        </h2>
        {/* Separator continues the tab list's own bottom border, so the two
            read as one full-width line. */}
        <div className="flex items-end">
          <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="shrink-0">
            <TabsList variant="line">
              {tabs.map((t) => (
                <TabsTrigger key={t.value} variant="line" value={t.value}>
                  {t.label} ({rows[t.value].length})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Separator className="flex-1" />
        </div>

        {/* Count left, filter right — the filter acts on the count beside it. */}
        <div className="flex items-center gap-[var(--spacing-component-md)]">
          <div className="min-w-0 flex-1">
            <ListSummary
              showing={visible.length}
              total={all.length}
              noun="records"
              onClear={() => setPriority("All")}
            />
          </div>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-[160px] shrink-0" aria-label="Filter by priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All priorities</SelectItem>
              {priorities.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="overflow-x-auto p-0">
          {visible.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Due date</TableHead>
                  <RecordRowActionHeading />
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((r) => (
                  <Row key={r.id} row={r} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-[var(--spacing-component-xl)] text-center text-sm text-[var(--color-text-secondary)]">
              {priority === "All" ? "No records in this tab." : `No ${priority.toLowerCase()} priority records.`}
            </p>
          )}
        </Card>
      </section>
    </DashboardShell>
  )
}
