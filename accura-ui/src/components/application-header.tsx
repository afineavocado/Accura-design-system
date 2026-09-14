"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bell,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Menu,
  RefreshCcw,
  TriangleAlert,
  X,
} from "lucide-react"

import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type NotificationModule =
  | "Document"
  | "CAPA"
  | "Change Control"
  | "Deviation"
  | "Training"

export type ApplicationNotification = {
  id: string
  module: NotificationModule
  recordId: string
  title: string
  description: string
  timestamp: string
  kind: "Action required" | "Update"
  unread: boolean
  href?: string
}

export type ApplicationUser = {
  name: string
  role: string
  initials: string
  avatarSrc?: string
}

type ApplicationHeaderProps = {
  user: ApplicationUser
  initialNotifications: ApplicationNotification[]
  mobileNavigationOpen?: boolean
  onMobileNavigationToggle?: () => void
}

const notificationIcons: Record<NotificationModule, React.ElementType> = {
  Document: FileText,
  CAPA: ClipboardCheck,
  "Change Control": RefreshCcw,
  Deviation: TriangleAlert,
  Training: GraduationCap,
}

function NotificationContent({
  notification,
}: {
  notification: ApplicationNotification
}) {
  const Icon = notificationIcons[notification.module]

  return (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-surface-muted-foreground)]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-[var(--spacing-component-xs)]">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            {notification.module} · {notification.recordId}
          </span>
          <Badge
            variant={notification.kind === "Action required" ? "warning" : "blue"}
            shape="pill"
            size="sm"
          >
            {notification.kind}
          </Badge>
        </span>
        <span className="mt-[var(--spacing-component-xs)] block text-sm font-medium leading-snug text-[var(--color-surface-default-foreground)]">
          {notification.title}
        </span>
        <span className="mt-[var(--spacing-component-xxs)] block text-sm leading-snug text-[var(--color-text-secondary)]">
          {notification.description}
        </span>
        <span className="mt-[var(--spacing-component-xs)] block text-xs text-[var(--color-text-tertiary)]">
          {notification.timestamp}
        </span>
      </span>

      {notification.unread && (
        <span
          className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand-primary)]"
          aria-label="Unread"
        />
      )}
    </>
  )
}

export function ApplicationHeader({
  user,
  initialNotifications,
  mobileNavigationOpen = false,
  onMobileNavigationToggle,
}: ApplicationHeaderProps) {
  const [notifications, setNotifications] =
    React.useState(initialNotifications)

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length

  function markAsRead(notificationId: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, unread: false }
          : notification
      )
    )
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, unread: false }))
    )
  }

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-layout-xs)] md:px-[var(--spacing-layout-sm)]">
      {onMobileNavigationToggle && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileNavigationOpen}
          onClick={onMobileNavigationToggle}
        >
          {mobileNavigationOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      )}

      <div className="ml-auto flex items-center gap-[var(--spacing-component-md)]">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {unreadCount > 0 && (
                <Badge
                  variant="notification"
                  shape="pill"
                  size="sm"
                  className="absolute -right-1.5 -top-1.5 min-w-4 justify-center px-1"
                  aria-hidden="true"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="sm:max-w-[420px]">
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>
                Updates from records you are associated with.
              </SheetDescription>
            </SheetHeader>

            <div className="flex min-h-0 flex-1 flex-col border-t border-[var(--color-border-default)]">
              <div className="flex items-center justify-between px-[var(--spacing-component-lg)] py-[var(--spacing-component-sm)]">
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                  {unreadCount
                    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                    : "You are all caught up"}
                </p>
                {unreadCount > 0 && (
                  <Button variant="link" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto border-t border-[var(--color-border-default)]">
                {notifications.map((notification) => {
                  const itemClassName = cn(
                    "flex w-full items-start gap-[var(--spacing-component-md)] border-b border-[var(--color-border-default)] p-[var(--spacing-component-lg)] text-left transition-colors",
                    "hover:bg-[var(--color-background-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-ring)]",
                    notification.unread &&
                      "bg-[var(--color-background-subtle)]"
                  )

                  if (notification.href) {
                    return (
                      <SheetClose asChild key={notification.id}>
                        <Link
                          href={notification.href}
                          className={itemClassName}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <NotificationContent notification={notification} />
                        </Link>
                      </SheetClose>
                    )
                  }

                  return (
                    <button
                      type="button"
                      key={notification.id}
                      className={itemClassName}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <NotificationContent notification={notification} />
                    </button>
                  )
                })}
              </div>

              <p className="border-t border-[var(--color-border-default)] p-[var(--spacing-component-lg)] text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Notifications are limited to records where you are an owner,
                assignee, reviewer, approver, or follower.
              </p>
            </div>
          </SheetContent>
        </Sheet>

        <div
          className="flex items-center gap-[var(--spacing-component-sm)] border-l border-[var(--color-border-default)] pl-[var(--spacing-component-md)]"
          aria-label={`${user.name}, ${user.role}`}
        >
          <Avatar
            size="sm"
            src={user.avatarSrc}
            fallback={user.initials}
            name={user.name}
          />
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-40 truncate text-sm font-medium text-[var(--color-background-default-foreground)]">
              {user.name}
            </p>
            <p className="max-w-40 truncate text-xs text-[var(--color-text-secondary)]">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
