"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { Spinner } from "@/components/ui/spinner"
import { useDelayedLoading } from "@/hooks/use-delayed-loading"
import { cn } from "@/lib/utils"

/* Page-level refresh: data already on screen stays, the whole content dims and
   locks, and an "Updating…" pill sits centred on the part of the content that
   is visible on screen — wherever it is scrolled to. Sidebar and header are
   outside it and stay sharp.

   Use for tab, filter, sort and reload changes on a page that already shows
   data. Not for a first load (use skeletons) and not for one widget (that
   widget handles its own state).

   Works inside any module shell: wrap the content column you want dimmed and
   pass its layout classes through `className`, so no wrapper is added. The
   pill is portalled and positioned from the visible rect, so the shell's
   scroll structure does not matter.

   Timing: locks at once (no input on stale data), dims and shows the pill after
   the shared 300ms delay, keeps them at least 500ms. */
export function PageBusy({
  busy,
  label = "Updating…",
  className,
  children,
}: {
  busy: boolean
  label?: string
  className?: string
  children: React.ReactNode
}) {
  const show = useDelayedLoading(busy)
  const locked = busy || show
  const ref = React.useRef<HTMLDivElement>(null)
  const [centre, setCentre] = React.useState<{ x: number; y: number } | null>(null)

  React.useLayoutEffect(() => {
    if (!show) return
    const el = ref.current
    if (!el) return
    const scroller = scrollParent(el)
    const update = () => {
      const r = el.getBoundingClientRect()
      const s = scroller?.getBoundingClientRect()
      const top = Math.max(r.top, s?.top ?? 0, 0)
      const bottom = Math.min(r.bottom, s?.bottom ?? innerHeight, innerHeight)
      const left = Math.max(r.left, s?.left ?? 0, 0)
      const right = Math.min(r.right, s?.right ?? innerWidth, innerWidth)
      setCentre({ x: (left + right) / 2, y: (top + bottom) / 2 })
    }
    update()
    addEventListener("scroll", update, true)
    addEventListener("resize", update)
    return () => {
      removeEventListener("scroll", update, true)
      removeEventListener("resize", update)
    }
  }, [show])

  return (
    <>
      <div
        ref={ref}
        inert={locked || undefined}
        aria-busy={busy || undefined}
        className={cn(
          "transition-opacity",
          // 50% is a placeholder until a dimming token exists — see the open
          // decision on one "busy/stale" opacity token (docs/handover/loading.md).
          show && "pointer-events-none opacity-50",
          className
        )}
      >
        {children}
      </div>
      {show &&
        centre &&
        createPortal(
          <span
            role="status"
            style={{ left: centre.x, top: centre.y }}
            className="pointer-events-none fixed z-40 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-full)] border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] px-[var(--spacing-component-md)] py-[var(--spacing-component-xs)] text-sm text-[var(--color-surface-overlay-foreground)]"
          >
            <Spinner size="sm" />
            {label}
          </span>,
          document.body
        )}
    </>
  )
}

function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const { overflowY } = getComputedStyle(p)
    if (overflowY === "auto" || overflowY === "scroll") return p
  }
  return null
}
