"use client"

import * as React from "react"
import { Check, CircleDashed, Copy, ExternalLink, Search, TriangleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListEmptySearch } from "../prototype/accura/list-empty-state"

import {
  catalog,
  copyId,
  moduleLabels,
  statusLabels,
  typeLabels,
  type CatalogItem,
  type ItemType,
  type Status,
  type Step,
} from "./catalog-types"
import { LoadingPlayground } from "./loading-playground"
import { patternPreviews } from "./pattern-previews"
import { storyModules } from "./stories.generated"
import { StoryPreview, storyLayout } from "./story-preview"

// Storybook runs locally; a deployment links to it only when NEXT_PUBLIC_STORYBOOK_URL names a
// deployed one. Otherwise the links are hidden rather than pointing every visitor at localhost.
const STORYBOOK =
  process.env.NEXT_PUBLIC_STORYBOOK_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:6007" : null)
// The viewport a template preview is rendered at before it is scaled into its card.
const ROUTE_VIEWPORT = { width: 1440, height: 900 }

const statusVariant: Record<Status, "success" | "blue" | "secondary" | "error"> = {
  stable: "success",
  "in-review": "blue",
  draft: "secondary",
  deprecated: "error",
}

const typeOrder: ItemType[] = ["layout", "template", "pattern", "component"]
const ALL = "all"
// Not an item type: a tab of its own that runs the loading demo with its controls.
const LOADING = "loading"

/* ── Copy ID ─────────────────────────────────────────────────────────────── */

function CopyIdButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])
  return (
    <Button
      variant="outline"
      size="sm"
      aria-label={`Copy ID ${value}`}
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => setCopied(true))
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : "Copy ID"}
    </Button>
  )
}

/* ── Previews ────────────────────────────────────────────────────────────── */

function RoutePreview({ src, title }: { src: string; title: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(0)
  React.useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / ROUTE_VIEWPORT.width)
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className="relative aspect-[16/10] w-full overflow-hidden">
      {scale > 0 && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{
            width: ROUTE_VIEWPORT.width,
            height: ROUTE_VIEWPORT.height,
            transform: `scale(${scale})`,
          }}
        />
      )}
    </div>
  )
}

function Preview({ item, story }: { item: CatalogItem; story?: string }) {
  if (item.preview) return <RoutePreview src={item.preview} title={`${item.name} preview`} />

  let body: React.ReactNode = (
    <p className="flex items-center gap-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">
      <CircleDashed className="size-4 text-[var(--color-icon-muted)]" />
      Behaviour only, nothing to render
    </p>
  )
  let fullscreen = false
  const mod = storyModules[item.id]
  if (mod && story) {
    body = <StoryPreview mod={mod} exportName={story} />
    fullscreen = storyLayout(mod, story) === "fullscreen"
  } else if (patternPreviews[item.id]) {
    body = patternPreviews[item.id]()
  }

  /* `transform` makes this box the containing block for fixed-position
     children, so a sidebar or overlay rendered by a story stays inside the
     card instead of covering the page. Full-screen stories render at double
     size and are scaled to half. */
  return (
    <div className="relative h-56 w-full overflow-auto [transform:translateZ(0)]">
      {fullscreen ? (
        <div className="h-[200%] w-[200%] origin-top-left scale-50">{body}</div>
      ) : (
        // `-safe` centring: content wider or taller than the box starts at the edge and scrolls, instead of being cut off on both sides.
        <div className="flex min-h-full items-center-safe justify-center-safe p-[var(--spacing-component-lg)]">
          {body}
        </div>
      )}
    </div>
  )
}

/* ── Status ──────────────────────────────────────────────────────────────── */

const stepText: Record<Step, string> = {
  done: "done",
  inherited: "inherited from Agentic, unverified",
  no: "not done",
  "n/a": "not applicable",
}

function PipelineSteps({ item }: { item: CatalogItem }) {
  if (item.type !== "component") return null
  const p = item.pipeline
  if (!p)
    return (
      <span className="text-xs text-[var(--color-text-secondary)]">
        Not in Storybook Status.md
      </span>
    )
  const steps: [string, Step][] = [
    ["Tokens", p.tokens],
    ["Story", p.storyWritten],
    ["Verified", p.storyVerified],
  ]
  return (
    <ul className="flex flex-wrap items-center gap-[var(--spacing-component-sm)] text-xs text-[var(--color-text-secondary)]">
      {steps.map(([label, step]) => (
        <li
          key={label}
          className="flex items-center gap-[var(--spacing-component-xxs)]"
          title={`${label}: ${stepText[step]}`}
        >
          {step === "done" ? (
            <Check className="size-3.5 text-[var(--color-icon-success)]" />
          ) : step === "inherited" ? (
            <TriangleAlert className="size-3.5 text-[var(--color-icon-warning)]" />
          ) : (
            <CircleDashed className="size-3.5 text-[var(--color-icon-muted)]" />
          )}
          <span>{label}</span>
          <span className="sr-only">{stepText[step]}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── Details ─────────────────────────────────────────────────────────────── */

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[var(--spacing-component-xs)]">
      <dt className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] px-[var(--spacing-component-xs)] font-mono text-xs break-all">
      {children}
    </code>
  )
}

function Details({ item, onPick }: { item: CatalogItem; onPick: (id: string) => void }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          Details
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{item.name}</SheetTitle>
          <SheetDescription>{item.id}</SheetDescription>
        </SheetHeader>
        <dl className="flex flex-col gap-[var(--spacing-component-lg)] px-[var(--spacing-component-lg)] pb-[var(--spacing-component-lg)]">
          <DetailRow label="What it is">{item.description}</DetailRow>
          {item.note && <DetailRow label="Note">{item.note}</DetailRow>}
          <DetailRow label="Status">
            {statusLabels[item.status]} · {catalog.statuses[item.status]}
          </DetailRow>
          {item.import && item.exports && item.exports.length > 0 && (
            <DetailRow label="Import">
              <Code>{`import { ${item.exports.join(", ")} } from "${item.import}"`}</Code>
            </DetailRow>
          )}
          {item.props && item.props.length > 0 && (
            <DetailRow label="Props">
              <ul className="flex flex-col gap-[var(--spacing-component-xs)]">
                {item.props.map((p) => (
                  <li key={p.prop}>
                    <Code>{p.prop}</Code>{" "}
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {p.values.join(" | ")} · default {String(p.default)}
                    </span>
                  </li>
                ))}
              </ul>
            </DetailRow>
          )}
          {item.uses && item.uses.length > 0 && (
            <DetailRow label="Built from">
              <ul className="flex flex-wrap gap-[var(--spacing-component-xs)]">
                {item.uses.map((id) => (
                  <li key={id}>
                    <button
                      type="button"
                      className="text-[var(--color-text-link)] hover:underline"
                      onClick={() => onPick(id)}
                    >
                      {id}
                    </button>
                  </li>
                ))}
              </ul>
            </DetailRow>
          )}
          <DetailRow label="Used in">
            {item.usedIn.length ? item.usedIn.map((m) => moduleLabels[m] ?? m).join(", ") : "No module imports it"}
          </DetailRow>
          {item.examples && (
            <DetailRow label="Live examples">
              <ul className="flex flex-col gap-[var(--spacing-component-xs)]">
                {item.examples.map((href) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-[var(--spacing-component-xxs)] text-[var(--color-text-link)] hover:underline"
                    >
                      {href.replace("/prototype/accura/", "")}
                      <ExternalLink className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </DetailRow>
          )}
          <DetailRow label="Files">
            <ul className="flex flex-col gap-[var(--spacing-component-xs)]">
              {[...item.files, ...(item.meta ? [item.meta] : []), ...(item.doc ? [item.doc] : [])].map((f) => (
                <li key={f}>
                  <Code>{f}</Code>
                </li>
              ))}
            </ul>
          </DetailRow>
        </dl>
      </SheetContent>
    </Sheet>
  )
}

/* ── Card ────────────────────────────────────────────────────────────────── */

function ItemCard({
  item,
  highlighted,
  onPick,
}: {
  item: CatalogItem
  highlighted: boolean
  onPick: (id: string) => void
}) {
  const stories = item.stories ?? []
  const [story, setStory] = React.useState(stories[0]?.export)
  const id = copyId(item, story)
  const current = stories.find((s) => s.export === story)

  return (
    <article
      id={item.id}
      className={[
        "flex scroll-mt-[var(--spacing-layout-md)] flex-col overflow-hidden rounded-[var(--radius-base)] border bg-[var(--color-surface-default)]",
        highlighted
          ? "border-[var(--color-border-brand)]"
          : "border-[var(--color-border-default)]",
      ].join(" ")}
    >
      <div className="border-b border-[var(--color-border-default)] bg-[var(--color-background-muted)]">
        <Preview item={item} story={story} />
      </div>
      <div className="flex flex-1 flex-col gap-[var(--spacing-component-md)] p-[var(--spacing-component-lg)]">
        <div className="flex items-start justify-between gap-[var(--spacing-component-sm)]">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">{item.name}</h3>
            <p className="truncate font-mono text-xs text-[var(--color-text-secondary)]" title={id}>
              {id}
            </p>
          </div>
          <Badge variant={statusVariant[item.status]} shape="pill" className="shrink-0 whitespace-nowrap">
            {statusLabels[item.status]}
          </Badge>
        </div>

        {stories.length > 1 && (
          <Select value={story} onValueChange={setStory}>
            <SelectTrigger aria-label={`${item.name} story`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stories.map((s) => (
                <SelectItem key={s.export} value={s.export}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <PipelineSteps item={item} />
        {item.note && (
          <p className="flex items-start gap-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">
            <TriangleAlert className="mt-px size-3.5 shrink-0 text-[var(--color-icon-warning)]" />
            {item.note}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-[var(--spacing-component-xs)]">
          <CopyIdButton value={id} />
          <Details item={item} onPick={onPick} />
          {STORYBOOK && current?.storybookId && (
            <Button variant="ghost" size="sm" asChild>
              <a
                href={`${STORYBOOK}/?path=/story/${current.storybookId}`}
                target="_blank"
                rel="noreferrer"
              >
                Storybook
                <ExternalLink />
              </a>
            </Button>
          )}
          {item.preview && (
            <Button variant="ghost" size="sm" asChild>
              <a href={item.preview} target="_blank" rel="noreferrer">
                Open
                <ExternalLink />
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

/* ── Loading tab ───────────────────────────────────────────────────────── */

// Controls above a small scene that runs each loading case. The full Dashboard demo
// stays one click away under Open.
function LoadingTab() {
  const item = catalog.items.find((i) => i.id === "acc-pat-loading")
  if (!item?.preview) return null
  return (
    <section className="flex flex-col gap-[var(--spacing-component-sm)]">
      <div className="flex flex-wrap items-start justify-between gap-[var(--spacing-component-sm)]">
        <div className="flex max-w-3xl flex-col gap-[var(--spacing-component-xs)]">
          <h2 className="text-base font-semibold">
            {item.name}{" "}
            <span className="font-mono text-xs font-normal text-[var(--color-text-secondary)]">
              {item.id}
            </span>
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{item.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-[var(--spacing-component-xs)]">
          <CopyIdButton value={item.id} />
          <Button variant="ghost" size="sm" asChild>
            <a href={item.preview} target="_blank" rel="noreferrer">
              Full demo
              <ExternalLink />
            </a>
          </Button>
        </div>
      </div>
      <LoadingPlayground />
    </section>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export function CatalogView() {
  const [query, setQuery] = React.useState("")
  const [type, setType] = React.useState<string>(ALL)
  const [layer, setLayer] = React.useState<string>(ALL)
  const [moduleFilter, setModuleFilter] = React.useState<string>(ALL)
  const [status, setStatus] = React.useState<string>(ALL)
  const [highlight, setHighlight] = React.useState<string | null>(null)

  const clear = () => {
    setQuery("")
    setType(ALL)
    setLayer(ALL)
    setModuleFilter(ALL)
    setStatus(ALL)
  }

  // Jump to an item from a "Built from" link: clear filters so it is on the page, then scroll.
  const pick = (id: string) => {
    clear()
    setHighlight(id)
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    )
  }

  const q = query.trim().toLowerCase()
  const visible = catalog.items.filter(
    (i) =>
      (type === ALL || i.type === type) &&
      (layer === ALL || i.layer === layer) &&
      (moduleFilter === ALL || i.usedIn.includes(moduleFilter)) &&
      (status === ALL || i.status === status) &&
      (!q || i.id.includes(q) || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
  )
  const groups = typeOrder
    .map((t) => ({ type: t, items: visible.filter((i) => i.type === t) }))
    .filter((g) => g.items.length > 0)
  const total = catalog.items.length

  return (
    <div className="min-h-screen bg-[var(--color-background-muted)]">
      <header className="border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-component-xl)] py-[var(--spacing-component-lg)]">
        <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-background-default-foreground)]">
              Accura catalog
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {catalog.counts.layout} layout · {catalog.counts.template} templates ·{" "}
              {catalog.counts.pattern} patterns · {catalog.counts.component} components. Copy an ID
              and give it to your agent.
            </p>
          </div>
          {STORYBOOK && (
            <Button variant="outline" size="sm" asChild>
              <a href={STORYBOOK} target="_blank" rel="noreferrer">
                Open Storybook
                <ExternalLink />
              </a>
            </Button>
          )}
        </div>
      </header>

      <main className="flex flex-col gap-[var(--spacing-component-md)] p-[var(--spacing-component-lg)] lg:p-[var(--spacing-component-xl)]">
        {type !== LOADING && (
        <div className="flex w-full flex-wrap items-center gap-[var(--spacing-component-sm)]">
          <div className="relative min-w-[240px] flex-1 sm:max-w-[380px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or ID"
              aria-label="Search the catalog"
              className="pl-9"
            />
          </div>
          <Select value={layer} onValueChange={setLayer}>
            <SelectTrigger className="w-[160px]" aria-label="Filter by layer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Shell and local</SelectItem>
              <SelectItem value="shell">Shell (Agentic)</SelectItem>
              <SelectItem value="local">Local (Accura)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-[180px]" aria-label="Filter by module">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All modules</SelectItem>
              {Object.entries(moduleLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {(Object.keys(statusLabels) as Status[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        )}

        <Tabs value={type} onValueChange={setType}>
          <TabsList variant="line">
            <TabsTrigger variant="line" value={ALL}>
              All
            </TabsTrigger>
            {typeOrder.map((t) => (
              <TabsTrigger key={t} variant="line" value={t}>
                {typeLabels[t]}
              </TabsTrigger>
            ))}
            <TabsTrigger variant="line" value={LOADING}>
              Loading
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {type === LOADING ? (
          <LoadingTab />
        ) : (
        <>
        <p className="text-xs text-[var(--color-text-secondary)]" aria-live="polite">
          {visible.length === total ? `${total} items` : `${visible.length} of ${total} items`}
        </p>

        {groups.length === 0 ? (
          <div className="rounded-[var(--radius-base)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
            <ListEmptySearch noun="items" onClear={clear} />
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.type} className="flex flex-col gap-[var(--spacing-component-sm)]">
              <h2 className="text-base font-semibold">
                {typeLabels[g.type]}{" "}
                <span className="text-sm font-normal text-[var(--color-text-secondary)]">
                  {g.items.length}
                </span>
              </h2>
              <div
                className={[
                  "grid gap-[var(--spacing-component-lg)]",
                  g.type === "layout" || g.type === "template"
                    ? "grid-cols-[repeat(auto-fill,minmax(360px,1fr))]"
                    : "grid-cols-[repeat(auto-fill,minmax(300px,1fr))]",
                ].join(" ")}
              >
                {g.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    highlighted={highlight === item.id}
                    onPick={pick}
                  />
                ))}
              </div>
            </section>
          ))
        )}
        </>
        )}
      </main>
    </div>
  )
}
