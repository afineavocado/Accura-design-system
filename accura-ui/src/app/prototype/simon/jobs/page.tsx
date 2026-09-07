'use client'

import { useRouter } from 'next/navigation'
import { jobs } from '../mock-data'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, MapPin as MapPin, Clock, Calendar } from 'lucide-react'

const statusVariant: Record<string, 'success' | 'blue' | 'default'> = {
  'In Progress': 'success',
  'Upcoming': 'blue',
  'Completed': 'default',
}

export default function JobsPage() {
  const router = useRouter()
  const today = jobs.filter(j => j.status === 'In Progress')
  const other = jobs.filter(j => j.status !== 'In Progress')

  const JobCard = ({ job }: { job: typeof jobs[0] }) => (
    <button
      onClick={() => router.push(`/prototype/simon/jobs/${job.id}`)}
      className="w-full flex flex-col gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:bg-[var(--color-background-accent)] transition-colors text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--color-background-default-foreground)]">{job.customer}</p>
        <Badge variant={statusVariant[job.status]} shape="pill" size="sm">{job.status}</Badge>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{job.address}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <Calendar className="h-3.5 w-3.5" />
            <span>{job.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <Clock className="h-3.5 w-3.5" />
            <span>{job.workedHours} worked</span>
          </div>
        </div>
      </div>
    </button>
  )

  return (
    <div className="flex flex-col flex-1 px-6 pt-4 pb-8 gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-[var(--color-icon-default)]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--color-background-default-foreground)]">My Jobs</h1>
      </div>

      {/* Today */}
      {today.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">Today</p>
          {today.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      )}

      {/* Other */}
      {other.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">Other Jobs</p>
          {other.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      )}
    </div>
  )
}
