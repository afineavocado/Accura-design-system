"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { useDocuments } from "../../documents/store"
import { DashboardShell } from "../dashboard-shell"
import {
  formatShortDate,
  healthBadge,
  moduleCards,
  myActions,
  upcomingItems,
  urgencyBadge,
  type ActionItem,
  type Milestone,
  type ModuleCard,
} from "../mock-data"

/* Earlier layout, kept for reference and no longer linked (replaced by the
   action inbox, 2026-09-17). Reachable at /dashboard/cards.

   Layout from Mobbin research (Vanta Home): module cards in the main column,
   personal work in a 70/30 rail. Merges spec widgets 1+3 into one card per
   module, and 2+4 into the rail. See Dashboard_Module_Audit.md. */

const rowLink =
  "flex items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] px-[var(--spacing-component-sm)] py-[var(--spacing-component-sm)] text-sm hover:bg-[var(--color-surface-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
const rowStatic =
  "flex items-center gap-[var(--spacing-component-sm)] px-[var(--spacing-component-sm)] py-[var(--spacing-component-sm)] text-sm"

function NotBuilt() {
  return (
    <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
      Module not built
    </span>
  )
}

function ModuleHealthCard({ card }: { card: ModuleCard }) {
  const badge = healthBadge[card.health]
  const pct = card.bar && card.bar.total ? Math.round((card.bar.ok / card.bar.total) * 100) : 0

  return (
    <Card className={card.unbuilt ? "opacity-70" : undefined}>
      <CardHeader className="flex-row items-center justify-between gap-[var(--spacing-component-sm)]">
        <CardTitle>
          {card.href ? (
            <Link href={card.href} className="hover:underline">
              {card.area}
            </Link>
          ) : (
            card.area
          )}
        </CardTitle>
        {card.href ? (
          <ChevronRight className="h-4 w-4 text-[var(--color-text-secondary)]" aria-hidden="true" />
        ) : (
          <NotBuilt />
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-[var(--spacing-component-md)]">
        <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
          <Badge variant={badge.variant} shape="pill" size="md">
            {badge.label}
          </Badge>
          <span className="text-sm text-[var(--color-surface-overlay-foreground)]">
            {card.attention}
          </span>
        </div>
        {card.bar && (
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Progress value={pct} aria-label={`${card.area}: ${card.bar.ok} of ${card.bar.total} ${card.bar.okLabel}`} />
            <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
              <span>
                {card.bar.ok} {card.bar.okLabel}
              </span>
              <span>{card.bar.total} total</span>
            </div>
          </div>
        )}
        <div className="flex gap-[var(--spacing-component-lg)] border-t border-[var(--color-border-default)] pt-[var(--spacing-component-md)] text-sm">
          <span className="font-medium">{card.primary.label}</span>
          <span className="text-[var(--color-text-secondary)]">{card.secondary.label}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function ActionRow({ item }: { item: ActionItem }) {
  const badge = urgencyBadge[item.urgency]
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="font-medium">{item.recordKey}</span>
        <span className="block text-xs text-[var(--color-text-secondary)]">
          {item.text}
          {item.unbuilt && " · Module not built"}
        </span>
      </span>
      <Badge variant={badge.variant} shape="pill" size="md" className="shrink-0">
        {badge.label}
      </Badge>
    </>
  )
  return (
    <li>
      {item.href ? (
        <Link href={item.href} className={rowLink}>
          {body}
          <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden="true" />
        </Link>
      ) : (
        <div className={rowStatic}>{body}</div>
      )}
    </li>
  )
}

function MilestoneRow({ m }: { m: Milestone }) {
  const body = (
    <>
      <time dateTime={m.date} className="w-12 shrink-0 text-xs font-medium text-[var(--color-text-secondary)]">
        {formatShortDate(m.date)}
      </time>
      <span className="min-w-0 flex-1">
        {m.title}
        {m.unbuilt && (
          <span className="block text-xs text-[var(--color-text-secondary)]">Module not built</span>
        )}
      </span>
    </>
  )
  return (
    <li>
      {m.href ? (
        <Link href={m.href} className={rowLink}>
          {body}
          <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden="true" />
        </Link>
      ) : (
        <div className={rowStatic}>{body}</div>
      )}
    </li>
  )
}

function RailGroup({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-[var(--spacing-component-xs)]">
      <h3 className="font-sans text-xs font-medium text-[var(--color-text-secondary)]">
        {title} · {count}
      </h3>
      <ul className="flex flex-col">{children}</ul>
    </section>
  )
}

export default function DashboardPage() {
  const docs = useDocuments()

  const cards = moduleCards(docs)
  const actions = myActions(docs)
  const overdue = actions.filter((a) => a.urgency === "overdue")
  const dueSoon = actions.filter((a) => a.urgency !== "overdue")
  const upcoming = upcomingItems()

  return (
    <DashboardShell>
              {/* Rail first in DOM so it leads on mobile; placed right at xl. */}
              <div className="grid grid-cols-1 gap-[var(--spacing-component-lg)] xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
                <Card className="self-start xl:order-2">
                  <CardHeader>
                    <CardTitle>My actions</CardTitle>
                    <CardDescription>Your work in the next 14 days</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-[var(--spacing-component-lg)]">
                    <RailGroup title="Overdue" count={overdue.length}>
                      {overdue.map((a) => (
                        <ActionRow key={a.id} item={a} />
                      ))}
                    </RailGroup>
                    <RailGroup title="Due soon" count={dueSoon.length}>
                      {dueSoon.map((a) => (
                        <ActionRow key={a.id} item={a} />
                      ))}
                    </RailGroup>
                    <RailGroup title="Coming up · next 30 days" count={upcoming.length}>
                      {upcoming.map((m) => (
                        <MilestoneRow key={m.id} m={m} />
                      ))}
                    </RailGroup>
                  </CardContent>
                </Card>

                <section aria-labelledby="glance-title" className="flex flex-col gap-[var(--spacing-component-md)] xl:order-1">
                  <h2 id="glance-title" className="font-sans text-base font-semibold">
                    Overview
                  </h2>
                  <div className="grid grid-cols-1 gap-[var(--spacing-component-lg)] md:grid-cols-2">
                    {cards.map((c) => (
                      <ModuleHealthCard key={c.area} card={c} />
                    ))}
                  </div>
                </section>
              </div>
    </DashboardShell>
  )
}
