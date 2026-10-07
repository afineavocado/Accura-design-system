"use client"

import * as React from "react"

/* The one timing rule for every loader in Accura — see the Loading section of
   docs/skills/accura-prototype-build/accura-design-patterns.md.

   - Wait LOADING_DELAY_MS before showing anything, so fast responses never flash.
   - Once shown, keep it LOADING_MIN_VISIBLE_MS, so it never flickers off. */
export const LOADING_DELAY_MS = 300
export const LOADING_MIN_VISIBLE_MS = 500

/** Whether a loader should be visible right now, given whether work is in flight. */
export function useDelayedLoading(
  loading: boolean,
  delay = LOADING_DELAY_MS,
  minVisible = LOADING_MIN_VISIBLE_MS
) {
  const [show, setShow] = React.useState(false)
  const shownAt = React.useRef(0)

  React.useEffect(() => {
    if (loading) {
      if (show) return
      const t = setTimeout(() => {
        shownAt.current = Date.now()
        setShow(true)
      }, delay)
      return () => clearTimeout(t)
    }
    if (!show) return
    const remaining = Math.max(0, minVisible - (Date.now() - shownAt.current))
    const t = setTimeout(() => setShow(false), remaining)
    return () => clearTimeout(t)
  }, [loading, show, delay, minVisible])

  return show
}

/**
 * For regions that swap a placeholder for content:
 * - `"wait"`    loading, still inside the delay — render the placeholder invisibly so nothing shifts
 * - `"loader"`  show the placeholder (skeleton)
 * - `"content"` show the real content
 */
export function useLoadPhase(loading: boolean): "wait" | "loader" | "content" {
  const show = useDelayedLoading(loading)
  return show ? "loader" : loading ? "wait" : "content"
}
