import { cn } from "@/lib/utils"

// ─── Skeleton ─────────────────────────────────────────────────────────────────
// Code-only component — no Figma component set (figmaNodeId: null).
// A single <div> with three properties:
//   background: color/background/skeleton — zinc/200 (dark: zinc/700). Was
//               color/background/muted until 2026-10-07: ~1.1:1 on a white card
//   animation:  animate-pulse — stopped under prefers-reduced-motion by
//               motion-reduce:animate-none. Tailwind's animate-pulse does NOT
//               do this on its own (an earlier comment here said it did).
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
        "animate-pulse motion-reduce:animate-none rounded-md bg-[var(--color-background-skeleton)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
