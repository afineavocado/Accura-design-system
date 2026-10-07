"use client"

import Image from "next/image"

import { Progress } from "@/components/ui/progress"
import { useDelayedLoading } from "@/hooks/use-delayed-loading"

/* First app load, only while the shell cannot be drawn yet (checking the
   session). On the sidebar teal, so the hand-off to the shell does not flash
   white. As soon as the session is known, render the shell and let each region
   show its own skeleton — do not keep the splash up for data.

   Mount once at the app root. Not wired up yet: the prototype has no session
   check. */
export function AppSplash({ active, message = "Signing you in…" }: { active: boolean; message?: string }) {
  const show = useDelayedLoading(active)
  if (!show) return null
  return (
    <div
      role="status"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-[var(--spacing-component-lg)] bg-[var(--color-sidebar-background)] text-[var(--color-sidebar-foreground)]"
    >
      <Image src="/accura-logo.png" alt="Accura" width={156} height={54} priority />
      <Progress value={null} size="sm" aria-label={message} className="w-40 bg-[var(--color-sidebar-accent)]" />
      <span className="text-sm opacity-80">{message}</span>
    </div>
  )
}
