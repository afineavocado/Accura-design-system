"use client"

import { Progress } from "@/components/ui/progress"
import { useDelayedLoading } from "@/hooks/use-delayed-loading"

/* Navigation feedback: a 2px indeterminate Progress pinned to the top edge of
   the window while the next page loads. Sidebar and header stay as they are;
   the destination's content area shows its own skeletons.

   Mount once, high in the app, and drive `active` from navigation start/end.
   Not wired up yet: the prototype's mock data makes navigation near-instant,
   so under the shared 300ms delay it would never show. */
export function RouteProgressBar({ active }: { active: boolean }) {
  const show = useDelayedLoading(active)
  if (!show) return null
  return (
    <Progress
      value={null}
      aria-label="Loading page"
      className="fixed inset-x-0 top-0 z-50 h-0.5 rounded-none bg-transparent"
    />
  )
}
