"use client"

import * as React from "react"

/* Sample props for shared patterns that have no stories. Each preview renders
   the REAL component from its real file; only the data is made up. Keys are
   catalog IDs from catalog-entries.json. A pattern with no entry here shows
   "Behaviour only, nothing to render" (right for hooks).

   Rules learned the hard way:
   - Overlays (modal, sheet): render the trigger, hold `open` in state.
   - Hooks that need props from a hook (pagination): wrap in a small component.
   - Page-wide pieces (list footers): wrap in `w-max shrink-0` so they keep
     their width and scroll inside the card instead of wrapping.
   - Realistic data from the product's own domain, never lorem ipsum. */

// ADAPT: import your shared patterns.
// import { StatusPill } from "@/components/status-pill"

export const patternPreviews: Record<string, () => React.ReactNode> = {
  // ADAPT: one entry per renderable pattern.
  // "xxx-pat-status-pill": () => <StatusPill from="Draft" to="In Review" />,
}
