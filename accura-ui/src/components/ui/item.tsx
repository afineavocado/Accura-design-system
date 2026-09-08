import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// ─── Item ─────────────────────────────────────────────────────────────────────
// Custom component — no shadcn base.
// Tokens (from Item.md — verified against Figma 65:815):
//
// Container — per Variant:
//   Default:  transparent · no stroke · radius/lg
//   Outline:  color/surface/default · color/border/default 1px · radius/lg
//   Muted:    color/surface/muted · no stroke · radius/lg
//
// Container — padding + gap per Size (Figma confirmed):
//   Default: spacing/component/md (12px) all sides + gap
//   Sm:      spacing/component/sm  (8px)  all sides + gap
//   Xs:      spacing/component/xs-plus (6px) all sides + gap
//
// Alignment (Figma confirmed):
//   items-start: Type=Icon (16px icon vs 37px content) · Type=Link (chevron anchors to title)
//   items-center: Default · Avatar · Image · Header
//
// Text:
//   title:       color/surface/default/foreground · text-sm font-medium
//   description: color/surface/muted/foreground · text-sm
//   content gap: spacing/component/xxs (2px)

// ─── Variants ─────────────────────────────────────────────────────────────────

const itemVariants = cva(
  "flex w-full rounded-[var(--radius-lg)]",
  {
    variants: {
      variant: {
        default: "",
        outline: "bg-[var(--color-surface-default)] border border-[var(--color-border-default)]",
        muted: "bg-[var(--color-surface-muted)]",
      },
      size: {
        default: "p-3 gap-3",   // spacing/component/md = 12px
        sm: "p-2 gap-2",        // spacing/component/sm = 8px
        xs: "p-1.5 gap-1.5",   // spacing/component/xs-plus = 6px
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof itemVariants> {
  /** Leading type — controls which leading element appears */
  type?: "default" | "icon" | "avatar" | "image" | "header" | "link"
  /** Primary label */
  title: React.ReactNode
  /** Supporting text — role, date, status, count */
  description?: React.ReactNode
  /** Type=Icon: icon element (h-4 w-4 recommended) */
  icon?: React.ReactNode
  /** Type=Avatar: avatar src for AvatarImage */
  avatarSrc?: string
  /** Type=Avatar: fallback initials */
  avatarFallback?: string
  /** Type=Image: image src for 32×32 thumbnail */
  imageSrc?: string
  imageAlt?: string
  /** Type=Header: cover image src */
  headerSrc?: string
  headerAlt?: string
  /** Action button — conditionally rendered. Hide for Type=Link and Type=Header. */
  action?: React.ReactNode
  /** Type=Link: wraps the row in an <a> — the whole row becomes the target */
  href?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      className,
      variant,
      size,
      type = "default",
      title,
      description,
      icon,
      avatarSrc,
      avatarFallback,
      imageSrc,
      imageAlt,
      headerSrc,
      headerAlt,
      action,
      href,
      ...props
    },
    ref
  ) => {
    // Alignment: Icon and Link use top-align (16px element vs taller content)
    const isTopAligned = type === "icon" || type === "link"
    // Header uses vertical layout
    const isVertical = type === "header"

    // ── Content block (title + description) ──
    const contentBlock = (
      <div className="flex flex-col gap-0.5 flex-1 min-w-0"> {/* spacing/component/xxs = 2px */}
        <span className="text-sm font-medium leading-snug text-[var(--color-surface-default-foreground)]">
          {title}
        </span>
        {description && (
          <span className="text-sm leading-snug text-[var(--color-surface-muted-foreground)]">
            {description}
          </span>
        )}
      </div>
    )

    // ── Leading element ──
    const leadingElement = (() => {
      if (type === "icon" && icon) {
        return (
          <span className="shrink-0 text-[var(--color-surface-default-foreground)]">
            {icon}
          </span>
        )
      }
      if (type === "avatar") {
        // Avatar takes props (src / fallback), not compound children — see AvatarProps in avatar.tsx
        return (
          <Avatar
            size="default"
            className="shrink-0"
            src={avatarSrc}
            fallback={avatarFallback ?? "?"}
          />
        )
      }
      if (type === "image") {
        return (
          <div className="h-8 w-8 shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-surface-muted)]">
            {imageSrc
              ? <img src={imageSrc} alt={imageAlt ?? ""} className="h-full w-full object-cover" />
              : null}
          </div>
        )
      }
      return null
    })()

    // ── Trailing element (action or chevron) ──
    const trailingElement = (() => {
      if (type === "link") {
        return (
          <ChevronRight
            className="h-4 w-4 shrink-0 text-[var(--color-surface-default-foreground)]"
            aria-hidden="true"
          />
        )
      }
      if (type !== "header" && action) {
        return <span className="shrink-0">{action}</span>
      }
      return null
    })()

    // ── Header type — vertical layout ──
    if (type === "header") {
      return (
        <div
          ref={ref}
          className={cn(
            itemVariants({ variant, size }),
            "flex-col p-0",
            className
          )}
          {...props}
        >
          {/* Cover image — bleeds to container edge */}
          <div className="w-full bg-[var(--color-surface-muted)] overflow-hidden rounded-t-[var(--radius-lg)]"
            style={{ height: size === "xs" ? "72px" : size === "sm" ? "96px" : "120px" }}
          >
            {headerSrc && (
              <img src={headerSrc} alt={headerAlt ?? ""} className="w-full h-full object-cover" />
            )}
          </div>
          {/* Content row — padding applied here, not on container */}
          <div className={cn(
            "flex flex-1",
            size === "sm" ? "p-2" : size === "xs" ? "p-1.5" : "p-3"
          )}>
            {contentBlock}
          </div>
        </div>
      )
    }

    // ── Link type — wrap in <a> ──
    const rowContent = (
      <>
        {leadingElement}
        {contentBlock}
        {trailingElement}
      </>
    )

    if (type === "link" && href !== undefined) {
      return (
        <a
          href={href}
          className={cn(
            itemVariants({ variant, size }),
            isTopAligned ? "items-start" : "items-center",
            "hover:bg-[var(--color-surface-accent)] transition-colors no-underline",
            className
          )}
        >
          {rowContent}
        </a>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          itemVariants({ variant, size }),
          isTopAligned ? "items-start" : "items-center",
          className
        )}
        {...props}
      >
        {rowContent}
      </div>
    )
  }
)
Item.displayName = "Item"

export { Item }
