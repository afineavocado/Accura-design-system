"use client"

import * as React from "react"
import { toast } from "sonner"

import { AppSplash } from "@/components/app-splash"
import { PageBusy } from "@/components/page-busy"
import { RouteProgressBar } from "@/components/route-progress-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
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
import { WidgetError } from "@/components/widget-error"
import { useLoadPhase } from "@/hooks/use-delayed-loading"
import { cn } from "@/lib/utils"

/* The catalog's Loading tab: the six cases of acc-pat-loading on a small scene
   instead of the whole Dashboard. Controls sit above the scene, outside it.
   Every loader is the shared one; this file only drives them, like the full
   demo at /prototype/accura/dashboard/loading, whose cases and speeds it copies.

   The scene is the shell minus the sidebar: a header over the content.
   It has `transform`, which makes it the containing block for the
   fixed-position loaders (AppSplash, RouteProgressBar, the Toaster), so they
   stay inside the frame instead of covering the catalog. */

const speeds = {
  fast: { label: "Fast", ms: 200 },
  normal: { label: "Normal", ms: 1500 },
  slow: { label: "Slow", ms: 4000 },
} as const
type Speed = keyof typeof speeds

const scenarios = [
  { id: "app", label: "App load", note: "A splash only while the session is checked. Then the shell appears at once and the content fills in as skeletons." },
  { id: "page", label: "Page load", note: "Sidebar and header stay. A thin bar at the very top shows navigation; the content mirrors its final layout in skeletons." },
  { id: "widgets", label: "Widget load", note: "Each widget loads on its own. Documents fails on purpose: the error and Try again stay inside that tile." },
  { id: "refresh", label: "Refresh", note: "Data already on screen stays, no skeleton. The content dims and locks, with Updating… centred on it." },
  { id: "button", label: "Button action", note: "A spinner replaces the label, the button keeps its width and is disabled until it finishes." },
  { id: "long", label: "Long task", note: "Percentage progress in a toast, so people can keep working. The toast turns into the result when done." },
] as const
type ScenarioId = (typeof scenarios)[number]["id"]

const fastNote = "Fast: everything finishes in under 300 ms, so no loader appears at all. That is the point."
const TOASTER = "catalog-loading"

type RegionState = "loading" | "ready" | "error"

const tiles = [
  { area: "Training", value: 1, label: "overdue" },
  { area: "CAPA", value: 3, label: "due within 14 days" },
  { area: "Documents", value: 1, label: "awaiting approval" },
] as const
const failing = 2

const rows = [
  { record: "CC-2026-014", status: "In review", variant: "blue", due: "21 Oct 2026" },
  { record: "DEV-2026-008", status: "Open", variant: "warning", due: "24 Oct 2026" },
  { record: "CAPA-2026-003", status: "Overdue", variant: "error", due: "2 Oct 2026" },
] as const

const tileClass =
  "flex flex-col gap-[var(--spacing-component-xs)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] p-[var(--spacing-component-md)]"

/* Same box and line heights as the tile, so nothing moves on swap. */
function TileSkeleton({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden="true" className={cn(tileClass, hidden && "invisible")}>
      <span className="flex h-5 items-center">
        <Skeleton className="h-4 w-20" />
      </span>
      <span className="flex h-8 items-center">
        <Skeleton className="h-7 w-8" />
      </span>
      <span className="flex h-4 items-center">
        <Skeleton className="h-3 w-28" />
      </span>
    </div>
  )
}

function TileRegion({ index, state, onRetry }: { index: number; state: RegionState; onRetry: () => void }) {
  const tile = tiles[index]
  const phase = useLoadPhase(state === "loading")
  if (phase === "loader") return <TileSkeleton />
  if (phase === "wait") return <TileSkeleton hidden />
  if (state === "error") {
    return (
      <div className={tileClass}>
        <span className="text-sm font-semibold">{tile.area}</span>
        <WidgetError what={tile.area} onRetry={onRetry} />
      </div>
    )
  }
  return (
    <div className={tileClass}>
      <span className="text-sm font-semibold text-[var(--color-surface-overlay-foreground)]">{tile.area}</span>
      <span className="font-heading text-2xl font-semibold text-[var(--color-surface-overlay-foreground)]">
        {tile.value}
      </span>
      <span className="text-xs text-[var(--color-text-secondary)]">{tile.label}</span>
    </div>
  )
}

function RecordsRegion({ loading }: { loading: boolean }) {
  const phase = useLoadPhase(loading)
  const skeleton = phase !== "content"
  return (
    <Card className="overflow-hidden p-0">
      <Table>
        {/* Real column headers even while loading: they are known up front. */}
        <TableHeader>
          <TableRow>
            <TableHead>Record</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody aria-hidden={skeleton || undefined} className={phase === "wait" ? "invisible" : undefined}>
          {rows.map((r) => (
            <TableRow key={r.record}>
              <TableCell>
                {skeleton ? (
                  <span className="flex h-5 items-center">
                    <Skeleton className="h-4 w-28" />
                  </span>
                ) : (
                  <span className="font-medium">{r.record}</span>
                )}
              </TableCell>
              <TableCell>
                {skeleton ? (
                  <Skeleton className="h-6 w-20 rounded-[var(--radius-full)]" />
                ) : (
                  <Badge variant={r.variant} shape="pill" size="md">
                    {r.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {skeleton ? (
                  <span className="flex h-5 items-center">
                    <Skeleton className="h-4 w-20" />
                  </span>
                ) : (
                  r.due
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export function LoadingPlayground() {
  const [speed, setSpeed] = React.useState<Speed>("slow")
  const [scenario, setScenario] = React.useState<ScenarioId | null>(null)
  const [splash, setSplash] = React.useState(false)
  const [routing, setRouting] = React.useState(false)
  const [tileStates, setTileStates] = React.useState<RegionState[]>(() => tiles.map(() => "ready"))
  const [tableLoading, setTableLoading] = React.useState(false)
  const [refreshing, setRefreshing] = React.useState(false)
  const [exporting, setExporting] = React.useState(false)
  const [reporting, setReporting] = React.useState(false)

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
  const allTiles = (s: RegionState) => tiles.map(() => s)
  const setTile = (i: number, s: RegionState) =>
    setTileStates((prev) => prev.map((v, j) => (j === i ? s : v)))

  const generateReport = () => {
    /* A fresh id per run: Sonner merges options, so a reused id would carry the
       previous run's Download action into the in-progress toast. */
    const id = `catalog-report-${++reportRun.current}`
    const total = Math.max(ms * 3, 2000)
    const step = 100 / (total / 250)
    let pct = 0
    setReporting(true)
    const show = () =>
      toast.loading("Generating audit report", {
        id,
        toasterId: TOASTER,
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
          toasterId: TOASTER,
          description: "Q3-audit-report.pdf",
          action: { label: "Download", onClick: () => {} },
        })
      }
    }
    after(250, tick)
  }

  const run = (id: ScenarioId) => {
    clearTimers()
    toast.dismiss()
    setScenario(id)
    setSplash(false)
    setRouting(false)
    setRefreshing(false)
    setExporting(false)
    setReporting(false)
    setTileStates(allTiles("ready"))
    setTableLoading(false)

    if (id === "app") {
      setSplash(true)
      setTileStates(allTiles("loading"))
      setTableLoading(true)
      after(ms * 0.6, () => setSplash(false))
      after(ms * 1.6, () => {
        setTileStates(allTiles("ready"))
        setTableLoading(false)
      })
    } else if (id === "page") {
      setRouting(true)
      setTileStates(allTiles("loading"))
      setTableLoading(true)
      after(ms, () => {
        setRouting(false)
        setTileStates(allTiles("ready"))
        setTableLoading(false)
      })
    } else if (id === "widgets") {
      setTileStates(allTiles("loading"))
      setTableLoading(true)
      tiles.forEach((_, i) => after(ms * (0.4 + i * 0.25), () => setTile(i, i === failing ? "error" : "ready")))
      after(ms * 1.4, () => setTableLoading(false))
    } else if (id === "refresh") {
      setRefreshing(true)
      after(ms, () => setRefreshing(false))
    } else if (id === "button") {
      setExporting(true)
      after(ms, () => {
        setExporting(false)
        toast.success("Records exported", { toasterId: TOASTER, description: "records.csv downloaded" })
      })
    } else if (id === "long") {
      generateReport()
    }
  }

  const retryTile = (i: number) => {
    setTile(i, "loading")
    after(ms, () => setTile(i, "ready"))
  }

  const note = speed === "fast" ? fastNote : scenarios.find((s) => s.id === scenario)?.note

  const current = scenarios.find((s) => s.id === scenario)

  return (
    <div className="grid items-start gap-[var(--spacing-component-lg)] lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Control: what to run. */}
      <aside
        aria-label="Loading control"
        className="flex flex-col gap-[var(--spacing-component-lg)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-[var(--spacing-component-lg)]"
      >
        <span className="text-sm font-semibold">Loading control</span>
        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Speed</span>
          <Tabs value={speed} onValueChange={(v) => setSpeed(v as Speed)}>
            <TabsList aria-label="Network speed" className="w-full">
              {(Object.keys(speeds) as Speed[]).map((k) => (
                <TabsTrigger key={k} value={k} className="flex-1">
                  {speeds[k].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Case</span>
          {scenarios.map((s, i) => (
            <Button
              key={s.id}
              size="sm"
              variant={scenario === s.id ? "default" : "ghost"}
              aria-pressed={scenario === s.id}
              onClick={() => run(s.id)}
              className="w-full justify-start"
            >
              {i + 1} · {s.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]" aria-live="polite">
          {note ?? "Pick a case. Clicking it again replays it."}
        </p>
      </aside>

      {/* Preview: what it looks like, on a dotted stage so it never reads as catalog UI. */}
      <section aria-label="Preview" className="flex min-w-0 flex-col gap-[var(--spacing-component-sm)]">
        <span className="flex items-center gap-[var(--spacing-component-sm)] text-xs font-medium text-[var(--color-text-secondary)]">
          Preview
          {current && (
            <Badge variant="secondary" size="sm">
              {current.label} · {speeds[speed].label}
            </Badge>
          )}
        </span>
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] bg-[radial-gradient(var(--color-border-hover)_1px,transparent_1px)] [background-size:var(--spacing-component-lg)_var(--spacing-component-lg)] p-[var(--spacing-component-xl)]">
          <div className="relative mx-auto flex h-[440px] w-full max-w-[880px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] [transform:translateZ(0)]">
            <AppSplash active={splash} />
            <RouteProgressBar active={routing} />
            <Toaster id={TOASTER} position="bottom-right" />

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex h-12 shrink-0 items-center border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-md)] text-sm font-semibold">
                Dashboard
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--color-background-muted)]">
                <PageBusy
                  busy={refreshing}
                  className="flex flex-col gap-[var(--spacing-component-md)] p-[var(--spacing-component-md)]"
                >
                  <div className="flex items-center justify-between gap-[var(--spacing-component-sm)]">
                    <span className="text-sm font-semibold">Overview</span>
                    <span className="flex gap-[var(--spacing-component-xs)]">
                      <Button variant="outline" size="sm" loading={exporting} loadingLabel="Exporting" onClick={() => run("button")}>
                        Export CSV
                      </Button>
                      <Button variant="outline" size="sm" disabled={reporting} onClick={() => run("long")}>
                        Generate report
                      </Button>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-[var(--spacing-component-sm)]">
                    {tiles.map((t, i) => (
                      <TileRegion key={t.area} index={i} state={tileStates[i]} onRetry={() => retryTile(i)} />
                    ))}
                  </div>
                  <RecordsRegion loading={tableLoading} />
                </PageBusy>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
