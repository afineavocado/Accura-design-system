"use client"

import * as React from "react"

/* Row-click for data tables.
 *
 * The row is a convenience target, never the only one: each row still carries a
 * real <a> or <button> in its first cell, which is what keyboard, middle-click
 * and copy-link use. The guard stops a click on that control from firing twice.
 *
 * Do not add role="button"/tabIndex/onKeyDown to the <TableRow>. That
 * reimplements what the inner control already does natively, and announces the
 * whole row as one target to a screen reader. */
export function useRowClick<T extends HTMLElement>(action: () => void) {
  return React.useCallback(
    (event: React.MouseEvent<T>) => {
      if ((event.target as HTMLElement).closest("a, button")) return
      action()
    },
    [action]
  )
}
