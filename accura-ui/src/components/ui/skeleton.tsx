import { cn } from "@/lib/utils"

// ─── Skeleton ─────────────────────────────────────────────────────────────────
// Code-only component — no Figma component set (figmaNodeId: null).
// A single <div> with three properties:
//   background: color/background/muted — page canvas muted surface (NOT surface/muted)
//   animation:  animate-pulse — respects prefers-reduced-motion via Tailwind
//   radius:     rounded-md by default — overridable via className
//
// No variants, no props beyond className. Compose multiple instances to mirror
// the layout of the real content it replaces.
//
// Usage: wrap the loading region in aria-busy="true" — individual Skeleton
// elements are decorative and have no role.

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--color-background-muted)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
