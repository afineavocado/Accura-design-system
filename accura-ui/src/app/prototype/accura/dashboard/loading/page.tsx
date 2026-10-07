"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  ClipboardCheck,
  Download,
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
} from "@/components/ui/record-row-action"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
import { Toaster } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

import { useDocuments } from "../../documents/store"
import { daysUntil, formatShortDate, healthBadge } from "../mock-data"
import {
  myActions,
  priorities,
  priorityVariant,
  tiles,
  upcoming,
  type InboxRow,
  type Tile,
} from "../inbox/inbox-data"
import { AppSplash } from "@/components/app-splash"
import { RouteProgressBar } from "@/components/route-progress-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetError } from "@/components/widget-error"
import { useLoadPhase } from "@/hooks/use-delayed-loading"

import { DemoShell } from "./demo-shell"

/* Loader demo — the Dashboard (Layout A+ v2) replayed through each loading
   scenario, for the loader recommendation to Amit (2026-10-07). Not linked
   from the sidebar. Every loading piece is the shared one (components/ui,
   components/, hooks/) — this page only drives them. The tile and row markup
   is copied from ../inbox/page.tsx, minus links, so that page stays untouched.
   The behaviour it demonstrates is written down in the Loading section of
   docs/skills/accura-prototype-build/accura-design-patterns.md. */

/* ── Demo controls ─────────────────────────────────────────────── */

const speeds = {
  fast: { label: "Fast", ms: 200 },
  normal: { label: "Normal", ms: 1500 },
  slow: { label: "Slow", ms: 4000 },
} as const
type Speed = keyof typeof speeds

const scenarios = [
  {
    id: "app",
    label: "1 · App load",
    note: "A splash only while the session is checked. Then the shell appears at once and the content fills in as skeletons.",
  },
  {
    id: "page",
    label: "2 · Page load",
    note: "Sidebar and header stay. A thin bar at the very top shows navigation; the content area mirrors its final layout in skeletons.",
  },
  {
    id: "widgets",
    label: "3 · Widget load",
    note: "Each widget loads on its own. Documents fails on purpose: the error and Retry stay inside that tile, the rest keeps working.",
  },
  {
    id: "refresh",
    label: "4 · Refresh",
    note: "Data already on screen stays — no skeleton. The whole page content dims and locks, with Updating… centred on screen. Changing the tab or priority filter does the same.",
  },
  {
    id: "button",
    label: "5 · Button action",
    note: "Short action: a spinner replaces the label, the button keeps its width and is disabled until it finishes.",
  },
  {
    id: "long",
    label: "6 · Long task",
    note: "Long task: percentage progress in a toast, so people can keep working. The toast turns into the result when done.",
  },
] as const
type ScenarioId = (typeof scenarios)[number]["id"]

const fastNote = "Fast: everything finishes in under 300 ms, so no loader appears at all — that is the point."

/* ── Dashboard pieces ──────────────────────────────────────────── */

type RegionState = "loading" | "ready" | "error"
type TableState = "loading" | "ready" | "refreshing"

const tabs = [
  { value: "mine", label: "My actions" },
  { value: "upcoming", label: "Upcoming" },
] as const
type TabValue = (typeof tabs)[number]["value"]

const tileClass =
  "flex flex-col gap-[var(--spacing-component-sm)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] p-[var(--spacing-component-md)]"

const areaIcon: Record<Tile["area"], LucideIcon> = {
  Training: GraduationCap,
  CAPA: ClipboardCheck,
  Documents: FileText,
  "Non-Conformance": TriangleAlert,
  Audits: FileSearch,
  Risks: ShieldAlert,
}

function TileHeading({ tile }: { tile: Tile }) {
  const Icon = areaIcon[tile.area]
  return (
    <span className="flex min-w-0 items-center gap-[var(--spacing-component-sm)]">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] text-[var(--button-secondary-bg-hover)]"
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold text-[var(--color-surface-overlay-foreground)]">{tile.area}</span>
    </span>
  )
}

function MetricTile({ tile }: { tile: Tile }) {
  const badge = healthBadge[tile.health]
  return (
    <div className={cn(tileClass, !tile.connected && "opacity-60")}>
      <span className="flex items-center justify-between gap-[var(--spacing-component-xs)]">
        <TileHeading tile={tile} />
        <Badge variant={badge.variant} shape="pill" size="sm">
          {badge.label}
        </Badge>
      </span>
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
    </div>
  )
}

/* Same box, same rows, same heights as MetricTile — nothing moves on swap. */
function TileSkeleton({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden="true" className={cn(tileClass, hidden && "invisible")}>
      <span className="flex items-center justify-between gap-[var(--spacing-component-xs)]">
        <span className="flex items-center gap-[var(--spacing-component-sm)]">
          <Skeleton className="size-8 rounded-[var(--radius-full)]" />
          <Skeleton className="h-4 w-24" />
        </span>
        <Skeleton className="h-5 w-16 rounded-[var(--radius-full)]" />
      </span>
      {/* Line boxes match the real text (45px display line, 20px body line). */}
      <span className="flex flex-col">
        <span className="flex h-[45px] items-center">
          <Skeleton className="h-9 w-12" />
        </span>
        <span className="flex h-5 items-center">
          <Skeleton className="h-4 w-44" />
        </span>
      </span>
    </div>
  )
}

function TileRegion({ tile, state, onRetry }: { tile: Tile; state: RegionState; onRetry: () => void }) {
  const phase = useLoadPhase(state === "loading")
  if (phase === "loader") return <TileSkeleton />
  if (phase === "wait") return <TileSkeleton hidden />
  if (state === "error") {
    return (
      <div className={tileClass}>
        <TileHeading tile={tile} />
        <WidgetError what={tile.area} onRetry={onRetry} />
      </div>
    )
  }
  return <MetricTile tile={tile} />
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
  return (
    <TableRow>
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
      {row.href ? <RecordRowAction href={row.href} label={`Open ${row.record}`} /> : <TableCell />}
    </TableRow>
  )
}

/* A text-sm line over a text-xs line, at the real line heights (20 + 16). */
function TwoLineBones({ first, second }: { first: string; second: string }) {
  return (
    <span className="flex flex-col">
      <span className="flex h-5 items-center">
        <Skeleton className={cn("h-4", first)} />
      </span>
      <span className="flex h-4 items-center">
        <Skeleton className={cn("h-3", second)} />
      </span>
    </span>
  )
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <TwoLineBones first="w-32" second="w-48" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24 rounded-[var(--radius-full)]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16 rounded-[var(--radius-full)]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <TwoLineBones first="w-16" second="w-12" />
      </TableCell>
      <TableCell />
    </TableRow>
  )
}

/* Real column headers even while loading — they are known up front. */
function RecordsTable({ rows, skeleton, hidden }: { rows: InboxRow[]; skeleton?: boolean; hidden?: boolean }) {
  return (
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
      <TableBody aria-hidden={skeleton || undefined} className={hidden ? "invisible" : undefined}>
        {skeleton
          ? Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)
          : rows.map((r) => <Row key={r.id} row={r} />)}
      </TableBody>
    </Table>
  )
}

function RecordsRegion({ state, rows, emptyText }: { state: TableState; rows: InboxRow[]; emptyText: string }) {
  const phase = useLoadPhase(state === "loading")

  if (phase !== "content") {
    return (
      <Card className="overflow-x-auto p-0">
        <RecordsTable rows={[]} skeleton hidden={phase === "wait"} />
      </Card>
    )
  }
  /* Refresh dimming is page-level (PageBusy in DemoShell), so nothing here. */
  return (
    <Card className="overflow-x-auto p-0">
      {rows.length ? (
        <RecordsTable rows={rows} />
      ) : (
        <p className="p-[var(--spacing-component-xl)] text-center text-sm text-[var(--color-text-secondary)]">{emptyText}</p>
      )}
    </Card>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function DashboardLoaderDemoPage() {
  const docs = useDocuments()
  const tileList = tiles(docs)
  const failingTile = tileList.findIndex((t) => t.area === "Documents")

  const [speed, setSpeed] = React.useState<Speed>("normal")
  const [scenario, setScenario] = React.useState<ScenarioId | null>(null)
  const [splash, setSplash] = React.useState(false)
  const [routing, setRouting] = React.useState(false)
  const [tileStates, setTileStates] = React.useState<RegionState[]>(() => tileList.map(() => "ready"))
  const [tableState, setTableState] = React.useState<TableState>("ready")
  const [exporting, setExporting] = React.useState(false)
  const [reporting, setReporting] = React.useState(false)

  /* The selects change at once; the table follows when the refresh lands. */
  const [tab, setTab] = React.useState<TabValue>("mine")
  const [priority, setPriority] = React.useState("All")
  const [shown, setShown] = React.useState({ tab: "mine" as TabValue, priority: "All" })

  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const reportRun = React.useRef(0)
  const after = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms))
  }
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  React.useEffect(() => clearTimers, [])

  const ms = speeds[speed].ms
  const allTiles = (s: RegionState) => tileList.map(() => s)
  const setTile = (i: number, s: RegionState) =>
    setTileStates((prev) => prev.map((v, j) => (j === i ? s : v)))

  const refresh = (next: { tab: TabValue; priority: string }) => {
    setTableState("refreshing")
    after(ms, () => {
      setShown(next)
      setTableState("ready")
    })
  }

  const exportCsv = () => {
    setExporting(true)
    after(ms, () => {
      setExporting(false)
      toast.success("Records exported", { description: "dashboard-records.csv downloaded" })
    })
  }

  const generateReport = () => {
    /* A fresh id per run. Reusing one would update the previous run's "ready"
       toast, and Sonner merges options — its Download action would carry over
       into the in-progress state. Actions belong to the finished result only. */
    const id = `audit-report-${++reportRun.current}`
    const total = Math.max(ms * 3, 2000)
    const step = 100 / (total / 250)
    let pct = 0
    setReporting(true)
    const show = () =>
      toast.loading("Generating audit report", {
        id,
        // Content column takes the full width beside the icon so the bar fills it.
        classNames: { content: "min-w-0 flex-1" },
        description: (
          <span className="mt-[var(--spacing-component-xs)] flex w-full flex-col gap-[var(--spacing-component-xs)]">
            <Progress value={Math.round(pct)} size="sm" aria-label="Audit report progress" />
            <span>{Math.round(pct)}% · you can keep working</span>
          </span>
        ),
      })
    show()
    const tick = () => {
      pct = Math.min(100, pct + step)
      if (pct < 100) {
        show()
        after(250, tick)
      } else {
        setReporting(false)
        toast.success("Audit report ready", {
          id,
          description: "Q3-audit-report.pdf",
          action: { label: "Download", onClick: () => {} },
        })
      }
    }
    after(250, tick)
  }

  const run = (id: ScenarioId) => {
    clearTimers()
    setScenario(id)
    setSplash(false)
    setRouting(false)
    setExporting(false)
    setTileStates(allTiles("ready"))
    setTableState("ready")

    if (id === "app") {
      setSplash(true)
      setTileStates(allTiles("loading"))
      setTableState("loading")
      after(ms * 0.6, () => setSplash(false))
      after(ms * 1.6, () => {
        setTileStates(allTiles("ready"))
        setTableState("ready")
      })
    } else if (id === "page") {
      setRouting(true)
      setTileStates(allTiles("loading"))
      setTableState("loading")
      after(ms, () => {
        setRouting(false)
        setTileStates(allTiles("ready"))
        setTableState("ready")
      })
    } else if (id === "widgets") {
      setTileStates(allTiles("loading"))
      setTableState("loading")
      tileList.forEach((_, i) =>
        after(ms * (0.4 + i * 0.25), () => setTile(i, i === failingTile ? "error" : "ready"))
      )
      after(ms * 1.4, () => setTableState("ready"))
    } else if (id === "refresh") {
      refresh({ tab, priority })
    } else if (id === "button") {
      exportCsv()
    } else if (id === "long") {
      generateReport()
    }
  }

  const retryTile = (i: number) => {
    setTile(i, "loading")
    after(ms, () => setTile(i, "ready"))
  }

  const rowsByTab: Record<TabValue, InboxRow[]> = { mine: myActions(docs), upcoming: upcoming(docs) }
  const all = rowsByTab[shown.tab]
  const visible = shown.priority === "All" ? all : all.filter((r) => r.priority === shown.priority)
  const overviewBusy = tileStates.some((s) => s === "loading")
  const note = speed === "fast" ? fastNote : scenarios.find((s) => s.id === scenario)?.note

  return (
    <>
      <AppSplash active={splash} />
      <RouteProgressBar active={routing} />
      <Toaster position="bottom-right" />
      <DemoShell busy={tableState === "refreshing"}>
        {/* Demo controls — dashed so it never reads as product UI. */}
        <section
          aria-label="Loader demo controls"
          className="flex flex-col gap-[var(--spacing-component-md)] rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-overlay)] p-[var(--spacing-component-md)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
            <span className="flex flex-col">
              <span className="text-sm font-semibold">Loader demo</span>
              <span className="text-xs text-[var(--color-text-secondary)]">Demo controls · not part of the product UI</span>
            </span>
            <Tabs value={speed} onValueChange={(v) => setSpeed(v as Speed)}>
              <TabsList aria-label="Network speed">
                {(Object.keys(speeds) as Speed[]).map((k) => (
                  <TabsTrigger key={k} value={k}>
                    {speeds[k].label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-wrap gap-[var(--spacing-component-sm)]">
            {scenarios.map((s) => (
              <Button
                key={s.id}
                size="sm"
                variant={scenario === s.id ? "default" : "outline"}
                aria-pressed={scenario === s.id}
                onClick={() => run(s.id)}
              >
                {s.label}
              </Button>
            ))}
          </div>
          <p className="min-h-5 text-sm text-[var(--color-text-secondary)]">
            {note ?? "Pick a scenario. Clicking it again replays it."}
          </p>
        </section>

        <section
          aria-labelledby="glance-title"
          aria-busy={overviewBusy || undefined}
          className="flex flex-col gap-[var(--spacing-component-sm)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
            <h2 id="glance-title" className="font-sans text-base font-semibold">
              Overview
            </h2>
            <Button
              variant="outline"
              size="sm"
              loading={reporting}
              loadingLabel="Generating audit report"
              onClick={() => {
                setScenario("long")
                generateReport()
              }}
            >
              <FileText />
              Generate audit report
            </Button>
          </div>
          {overviewBusy && <span role="status" className="sr-only">Loading overview</span>}
          <div className="grid grid-cols-1 gap-[var(--spacing-component-md)] sm:grid-cols-2 lg:grid-cols-3">
            {tileList.map((t, i) => (
              <TileRegion key={t.area} tile={t} state={tileStates[i]} onRetry={() => retryTile(i)} />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="records-title"
          aria-busy={tableState !== "ready" || undefined}
          className="flex flex-col gap-[var(--spacing-component-sm)]"
        >
          <div className="flex items-center justify-between gap-[var(--spacing-component-sm)]">
            <h2 id="records-title" className="font-sans text-base font-semibold">
              Records
            </h2>
            <Button
              variant="outline"
              size="sm"
              loading={exporting}
              loadingLabel="Exporting records"
              onClick={() => {
                setScenario("button")
                exportCsv()
              }}
            >
              <Download />
              Export CSV
            </Button>
          </div>
          {tableState === "loading" && <span role="status" className="sr-only">Loading records</span>}
          <div className="flex items-end">
            <Tabs
              value={tab}
              onValueChange={(v) => {
                setTab(v as TabValue)
                setScenario("refresh")
                refresh({ tab: v as TabValue, priority })
              }}
              className="shrink-0"
            >
              <TabsList variant="line">
                {tabs.map((t) => (
                  <TabsTrigger key={t.value} variant="line" value={t.value}>
                    {t.label} ({rowsByTab[t.value].length})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Separator className="flex-1" />
          </div>
          <div className="flex items-center justify-end">
            <Select
              value={priority}
              onValueChange={(v) => {
                setPriority(v)
                setScenario("refresh")
                refresh({ tab, priority: v })
              }}
            >
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
          <RecordsRegion
            state={tableState}
            rows={visible}
            emptyText={shown.priority === "All" ? "No records in this tab." : `No ${shown.priority.toLowerCase()} priority records.`}
          />
        </section>
      </DemoShell>
    </>
  )
}
