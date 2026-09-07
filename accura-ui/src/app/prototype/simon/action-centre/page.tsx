'use client'

import { useRouter } from 'next/navigation'
import { worker } from '../mock-data'
import { CalendarDays, Briefcase } from 'lucide-react'

export default function ActionCentrePage() {
  const router = useRouter()

  const cards = [
    {
      icon: <Briefcase className="h-6 w-6 text-[var(--color-brand-primary)]" />,
      title: 'Marketing Session',
      description: 'Start and manage marketing activities.',
      onClick: () => alert('Marketing Session — not in scope for this prototype.'),
    },
    {
      icon: <CalendarDays className="h-6 w-6 text-[var(--color-brand-primary)]" />,
      title: 'My Schedule',
      description: 'View your assigned calendar and jobs.',
      onClick: () => router.push('/prototype/simon/jobs'),
    },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col flex-1 px-6 pt-8 pb-8 gap-8">
      {/* Header */}
      <div>
        <p className="text-sm text-[var(--color-text-secondary)]">{greeting},</p>
        <h1 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">
          {worker.name}
        </h1>
        <p className="text-base text-[var(--color-text-secondary)] mt-2">
          What do you want to do today?
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {cards.map(card => (
          <button
            key={card.title}
            onClick={card.onClick}
            className="flex items-start gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-background-accent)] transition-colors text-left"
          >
            <div className="h-10 w-10 rounded-[var(--radius-md)] bg-[var(--color-background-accent)] flex items-center justify-center shrink-0">
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-background-default-foreground)]">{card.title}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{card.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
