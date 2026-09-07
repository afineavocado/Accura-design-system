"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { CornerDownLeft } from "@untitledui/icons"

// ─── Token reference ───────────────────────────────────────────────────────────
// Bot bubble:  bg=surface/default · border=border/default · text=background/default/foreground
// User bubble: bg=brand/primary · text=brand/primary/foreground · no border
// Timestamp:   text=text/secondary
// Avatar:      size=sm (32px)
// Radius:      radius/2xl (14px) for bubble, squared corner = radius/sm (4px) · radius/full for avatar (handled by Avatar)
// Spacing:     gap-component-sm (8px) between avatar + bubble · gap-component-xs (4px) inside bubble

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatBubbleProps {
  /** Who sent this message */
  role: "bot" | "user"
  /** Message content */
  children: React.ReactNode
  /** Timestamp string e.g. "2:34 PM" */
  timestamp?: string
  /** Avatar image src — for bot only */
  avatarSrc?: string
  /** Avatar fallback initials — for bot only */
  avatarFallback?: string
  className?: string
}

// ─── ChatBubble ───────────────────────────────────────────────────────────────

export function ChatBubble({
  role,
  children,
  timestamp,
  avatarSrc,
  avatarFallback = "AI",
  className,
}: ChatBubbleProps) {
  const isBot = role === "bot"

  return (
    <div
      className={cn(
        "flex gap-2 w-full",
        isBot ? "flex-row" : "flex-row-reverse",
        className
      )}
    >
      {/* Avatar — bot only */}
      {isBot && (
        <Avatar size="sm" src={avatarSrc} fallback={avatarFallback} name={avatarFallback} className="shrink-0 mt-0.5" />
      )}

      {/* Bubble + timestamp */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[75%]",
          isBot ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "px-3 py-2",
            "rounded-[var(--radius-2xl)] text-sm leading-relaxed",
            isBot
              ? [
                  "bg-[var(--color-surface-default)]",
                  "border border-[var(--color-border-default)]",
                  "text-[var(--color-background-default-foreground)]",
                  "rounded-tl-[var(--radius-sm)]", // pointed corner toward avatar
                ]
              : [
                  "bg-[var(--color-brand-primary)]",
                  "text-[var(--color-brand-primary-foreground)]",
                  "rounded-tr-[var(--radius-sm)]", // pointed corner on user side
                ]
          )}
        >
          {children}
        </div>

        {timestamp && (
          <span className="text-xs text-[var(--color-text-secondary)] px-1">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── ChatLog ────────────────────────────────────────────────────────────────
// Accessible container for a list of messages. role="log" + aria-live="polite"
// makes screen readers announce new messages automatically as they arrive.

export interface ChatLogProps {
  children: React.ReactNode
  /** Accessible name for the message region */
  label?: string
  className?: string
}

export function ChatLog({ children, label = "Chat messages", className }: ChatLogProps) {
  return (
    <div
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label={label}
      className={cn("flex flex-col gap-4", className)}
    >
      {children}
    </div>
  )
}

// ─── TypingIndicator ──────────────────────────────────────────────────────────
// Shown while bot is "thinking" — three animated dots

export function TypingIndicator({ avatarFallback = "AI", avatarSrc }: { avatarSrc?: string; avatarFallback?: string }) {
  return (
    <div className="flex gap-2 w-full flex-row">
      <Avatar size="sm" src={avatarSrc} fallback={avatarFallback} name={avatarFallback} className="shrink-0 mt-0.5" />

      <div
        className={cn(
          "px-3 py-2",
          "rounded-[var(--radius-2xl)] rounded-tl-[var(--radius-sm)]",
          "bg-[var(--color-surface-default)] border border-[var(--color-border-default)]",
          "flex items-center gap-1"
        )}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-icon-muted)] animate-bounce motion-reduce:animate-none"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── SuggestionChip ───────────────────────────────────────────────────────────
// Clickable question chip shown below bot messages

export interface SuggestionChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function SuggestionChip({ children, className, ...props }: SuggestionChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center px-3 h-8",
        "rounded-[var(--radius-full)]",
        "border border-[var(--color-border-default)]",
        "bg-[var(--color-background-default)]",
        "text-sm text-[var(--color-background-default-foreground)]",
        "hover:bg-[var(--color-surface-accent)] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── ChatInput ────────────────────────────────────────────────────────────────
// Input + send button combined

export interface ChatInputProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "Type a message...",
  disabled,
}: ChatInputProps) {
  const [internal, setInternal] = React.useState("")
  const controlled = value !== undefined
  const current = controlled ? value : internal

  function handleSend() {
    if (!current.trim()) return
    onSend?.(current.trim())
    if (!controlled) setInternal("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        "px-3 h-12",
        "rounded-[var(--radius-full)]",
        "border border-[var(--color-border-default)]",
        "bg-[var(--color-background-default)]",
        "focus-within:ring-2 focus-within:ring-[var(--color-border-focus)]",
        "transition-shadow"
      )}
    >
      <input
        className="flex-1 bg-transparent text-sm text-[var(--color-background-default-foreground)] placeholder:text-[var(--color-input-placeholder)] outline-none"
        placeholder={placeholder}
        value={current}
        onChange={controlled ? onChange : (e) => setInternal(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Chat input"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !current.trim()}
        aria-label="Send message"
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
          current.trim()
            ? "bg-[var(--color-brand-primary)] text-[var(--color-brand-primary-foreground)] hover:opacity-90"
            : "bg-[var(--color-surface-default)] text-[var(--color-icon-muted)] cursor-not-allowed"
        )}
      >
        <CornerDownLeft className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
