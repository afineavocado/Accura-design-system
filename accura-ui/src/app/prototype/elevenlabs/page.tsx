'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Item } from '@/components/ui/item'
import {
  Home01, Grid01, List, Settings01, User01, MusicNote01,
  MessageChatSquare, Bell, Folder, ChevronRight,
  Microphone01, BookOpen, Image01, Lightning01, MusicNote02,
  VideoRecorder, MagicWand01, Users, Archive,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Mock data ────────────────────────────────────────────────────────────────

const voices = [
  { name: 'Garaudi - Warm, Calm and Clear', desc: 'Garaudi - Indonesia Javanese Male Voice. Good for audiobook...', color: 'bg-blue-500', initials: 'G' },
  { name: 'Mizani - Warm, Engaging and Friendly', desc: 'Mizani - A warm and engaging middle-aged male voice with a friendl...', color: 'bg-orange-400', initials: 'M' },
  { name: 'Meraki - Somber, Calm and Soft', desc: 'Meraki female Indonesian voice - Middle aged Indonesian woman wit...', color: 'bg-purple-400', initials: 'Me' },
  { name: 'Mila Rahmadania - Nuetral and Clear', desc: 'Mila Rahmadhania - A versatile female voice-over artist with a natura...', color: 'bg-sky-400', initials: 'Mi' },
  { name: 'Ganesh - Warm, Intimidating and Clear', desc: 'Ganesh - Energetic & Enthusiastic Voice - A clear, warm, and...', color: 'bg-green-500', initials: 'Ga' },
]

const featureCards = [
  { label: 'Instant speech', icon: <Microphone01 className="h-6 w-6" />, bg: 'bg-blue-100', iconColor: 'text-blue-600', accent: '#3b82f6' },
  { label: 'Audiobook', icon: <BookOpen className="h-6 w-6" />, bg: 'bg-red-100', iconColor: 'text-red-500', accent: '#ef4444' },
  { label: 'Image & Video', icon: <Image01 className="h-6 w-6" />, bg: 'bg-emerald-100', iconColor: 'text-emerald-600', accent: '#10b981' },
  { label: 'ElevenAgents', icon: <Lightning01 className="h-6 w-6" />, bg: 'bg-yellow-100', iconColor: 'text-yellow-600', accent: '#f59e0b' },
  { label: 'Music', icon: <MusicNote02 className="h-6 w-6" />, bg: 'bg-orange-100', iconColor: 'text-orange-500', accent: '#f97316' },
  { label: 'Dubbed video', icon: <VideoRecorder className="h-6 w-6" />, bg: 'bg-teal-100', iconColor: 'text-teal-600', accent: '#14b8a6' },
]

const chatMessages = [
  { role: 'user', text: 'Do I need to use credits to upscale the generated result?' },
  { role: 'assistant', text: 'Based on the documentation, yes, upscaling does consume credits.\n\nWhen you upscale images or videos in the Image & Video tool, it\'s treated as a separate generation step that uses credits. The exact cost depends on the upscaling model and the resolution increase (upscaling can boost resolution by up to 4x).\n\nThe credit cost is shown transparently before you confirm the upscaling, so you\'ll always see how many credits will be used before proceeding.' },
]

const creatorCards = [
  { label: 'Voice Design', desc: 'Design an entirely new voice from a text prompt', icon: <MagicWand01 className="h-5 w-5 text-white" />, bg: 'bg-red-500' },
  { label: 'Clone your Voice', desc: 'Create a realistic digital clone of your voice', icon: <Microphone01 className="h-5 w-5 text-white" />, bg: 'bg-emerald-500' },
  { label: 'Voice Collections', desc: 'Curated AI voices for every use case', icon: <Archive className="h-5 w-5 text-white" />, bg: 'bg-slate-500' },
]

const sideNavItems = [
  { icon: <Home01 className="h-5 w-5" />, active: true },
  { icon: <Grid01 className="h-5 w-5" /> },
  { icon: <List className="h-5 w-5" /> },
  { icon: <Lightning01 className="h-5 w-5" /> },
  { icon: <Archive className="h-5 w-5" /> },
  { icon: <User01 className="h-5 w-5" />, bottom: true },
  { icon: <MusicNote01 className="h-5 w-5" />, bottom: true },
  { icon: <MessageChatSquare className="h-5 w-5" />, bottom: true },
  { icon: <Settings01 className="h-5 w-5" />, bottom: true },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ElevenLabsHome() {
  const [chatInput, setChatInput] = React.useState('')

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background-default)]">

      {/* ── Left sidebar — icon only ─────────────────────────────────── */}
      <aside className="w-14 shrink-0 flex flex-col items-center py-3 gap-1 border-r border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        {/* Toggle */}
        <button className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-icon-default)] hover:bg-[var(--color-background-accent)] mb-2">
          <Grid01 className="h-4 w-4" />
        </button>
        {/* Orange dot brand mark */}
        <div className="w-7 h-7 rounded-full bg-orange-500 mb-3" />

        {sideNavItems.filter(i => !i.bottom).map((item, idx) => (
          <button
            key={idx}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] transition-colors",
              item.active
                ? "bg-[var(--color-background-accent)] text-[var(--color-background-accent-foreground)]"
                : "text-[var(--color-icon-muted)] hover:bg-[var(--color-background-accent)] hover:text-[var(--color-background-accent-foreground)]"
            )}
          >
            {item.icon}
          </button>
        ))}

        <div className="flex-1" />

        {sideNavItems.filter(i => i.bottom).map((item, idx) => (
          <button
            key={idx}
            className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-icon-muted)] hover:bg-[var(--color-background-accent)]"
          >
            {item.icon}
          </button>
        ))}
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-[var(--color-border-default)]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-background-default-foreground)]">Home</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-xs h-8">Feedback</Button>
            <Button variant="ghost" size="sm" className="text-xs h-8">Docs</Button>
            <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
              <MessageChatSquare className="h-3.5 w-3.5" /> Ask
            </Button>
            <button className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-icon-muted)] hover:bg-[var(--color-background-accent)]">
              <Folder className="h-4 w-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-icon-muted)] hover:bg-[var(--color-background-accent)]">
              <Bell className="h-4 w-4" />
            </button>
            <Avatar size="sm" fallback="S" />
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

          {/* Affiliate banner */}
          <button className="flex items-center gap-2 self-start hover:opacity-80 transition-opacity">
            <Badge variant="default" shape="pill" size="sm">New</Badge>
            <span className="text-sm text-[var(--color-background-default-foreground)]">Become an affiliate, earn with every referral</span>
            <ChevronRight className="h-4 w-4 text-[var(--color-icon-muted)]" />
          </button>

          {/* Welcome */}
          <div>
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">My Workspace</p>
            <h1 className="text-3xl font-bold text-[var(--color-background-default-foreground)]">Good morning, Sam lee</h1>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-6 gap-3">
            {featureCards.map((card) => (
              <button
                key={card.label}
                className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-background-accent)] transition-colors overflow-hidden text-left"
              >
                {/* Illustration area */}
                <div className="h-28 flex items-center justify-center bg-[var(--color-background-muted)] relative">
                  <div className={cn('w-14 h-14 rounded-full flex items-center justify-center', card.bg)}>
                    <span className={card.iconColor}>{card.icon}</span>
                  </div>
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-sm font-medium text-[var(--color-background-default-foreground)]">{card.label}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom two-column section */}
          <div className="grid grid-cols-2 gap-6">

            {/* Latest from library */}
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-[var(--color-background-default-foreground)]">Latest from the library</h2>
              <div className="flex flex-col">
                {voices.map((voice) => (
                  <Item
                    key={voice.name}
                    type="icon"
                    icon={
                      <Avatar size="sm" fallback={voice.initials} className={cn(voice.color)} />
                    }
                    title={voice.name}
                    description={voice.desc}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" className="self-start">Explore Library</Button>
            </div>

            {/* Create or clone a voice */}
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-[var(--color-background-default-foreground)]">Create or clone a voice</h2>
              <div className="flex flex-col gap-3">
                {creatorCards.map((card) => (
                  <button
                    key={card.label}
                    className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-background-accent)] transition-colors text-left"
                  >
                    <div className={cn('w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0', card.bg)}>
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-background-default-foreground)]">{card.label}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{card.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Right chat panel ─────────────────────────────────────────── */}
      <aside className="w-80 shrink-0 flex flex-col border-l border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        {/* Chat header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--color-border-default)]">
          <div className="flex items-center gap-2">
            <MessageChatSquare className="h-4 w-4 text-[var(--color-icon-default)]" />
            <span className="text-sm font-medium text-[var(--color-background-default-foreground)]">New chat</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-icon-muted)] hover:bg-[var(--color-background-accent)]">
              <span className="text-lg leading-none">+</span>
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-icon-muted)] hover:bg-[var(--color-background-accent)]">
              <Settings01 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={cn('flex flex-col gap-1', msg.role === 'user' ? 'items-end' : 'items-start')}>
              {msg.role === 'user' ? (
                <div className="bg-[var(--color-background-muted)] rounded-[var(--radius-lg)] px-3 py-2 max-w-[85%]">
                  <p className="text-sm text-[var(--color-background-default-foreground)]">{msg.text}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-[var(--color-background-default-foreground)] leading-relaxed whitespace-pre-line">
                    {msg.text.split('**').map((part, j) =>
                      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat input */}
        <div className="p-3 border-t border-[var(--color-border-default)]">
          <div className={cn(
            "flex items-center gap-2 h-10 rounded-[var(--radius-md)]",
            "border border-[var(--color-input-border)] bg-[var(--color-background-default)]",
            "px-3 focus-within:border-[var(--color-border-focus)]"
          )}>
            <input
              type="text"
              placeholder="Ask anything..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-input-placeholder)] text-[var(--color-background-default-foreground)]"
            />
            <button className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--color-background-default-foreground)] text-[var(--color-background-default)] hover:opacity-80">
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </aside>

    </div>
  )
}
