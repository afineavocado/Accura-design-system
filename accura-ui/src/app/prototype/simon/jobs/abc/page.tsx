'use client'

import { useRouter } from 'next/navigation'
import { jobs } from '../../mock-data'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, MapPin, Clock } from 'lucide-react'

export default function JobPlannerPage() {
  const router = useRouter()
  const job = jobs[0] // abc = first job

  return (
    <div className="flex flex-col flex-1 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-[var(--color-border-default)]">
        <button onClick={() => router.back()} className="text-[var(--color-icon-default)]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-[var(--color-background-default-foreground)] truncate">{job.customer}</h1>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-[var(--color-text-secondary)]" />
            <p className="text-xs text-[var(--color-text-secondary)] truncate">{job.address}</p>
          </div>
        </div>
        <Badge variant="success" shape="pill" size="sm">In Progress</Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="planner" className="flex-1 flex flex-col">
        <TabsList className="mx-6 mt-4">
          <TabsTrigger value="planner">Planner</TabsTrigger>
          <TabsTrigger value="info">Job Info</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="planner" className="flex-1 flex flex-col px-6 pt-4 gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Production Planner</p>
          </div>

          {/* Hours + progress */}
          <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-[var(--color-text-secondary)]">Planned</p>
                <p className="text-lg font-semibold text-[var(--color-background-default-foreground)]">{job.plannedHours}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--color-text-secondary)]">Worked</p>
                <p className="text-lg font-semibold text-[var(--color-brand-primary)]">{job.workedHours}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--color-text-secondary)]">Progress</p>
                <p className="text-lg font-semibold text-[var(--color-background-default-foreground)]">{job.progress}%</p>
              </div>
            </div>
            <Progress value={job.progress} />
          </div>

          {/* Rooms */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-[var(--color-text-secondary)]">Rooms</p>
            {job.rooms.map(room => (
              <div key={room} className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-background-muted)]">
                <div className="h-2 w-2 rounded-full bg-[var(--color-brand-primary)]" />
                <span className="text-sm text-[var(--color-background-default-foreground)]">{room}</span>
              </div>
            ))}
          </div>

          {/* Tasks */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-[var(--color-text-secondary)]">Tasks</p>
            {job.tasks.map((task, i) => (
              <div key={task} className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-background-muted)]">
                <span className="text-xs text-[var(--color-text-secondary)] w-4">{i + 1}.</span>
                <span className="text-sm text-[var(--color-background-default-foreground)]">{task}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <Button className="w-full h-12 text-base" onClick={() => router.push('/prototype/simon/check-in')}>
              Check In
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="info" className="px-6 pt-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[var(--color-text-secondary)]">Customer</p>
              <p className="text-sm font-medium text-[var(--color-background-default-foreground)]">{job.customer}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[var(--color-text-secondary)]">Address</p>
              <p className="text-sm font-medium text-[var(--color-background-default-foreground)]">{job.address}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[var(--color-text-secondary)]">Description</p>
              <p className="text-sm font-medium text-[var(--color-background-default-foreground)]">{job.description}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="px-6 pt-4">
          <div className="flex items-center gap-2 p-4 rounded-[var(--radius-lg)] bg-[var(--color-background-muted)]">
            <Clock className="h-4 w-4 text-[var(--color-text-secondary)]" />
            <p className="text-sm text-[var(--color-text-secondary)]">Scheduled: {job.date} · {job.plannedHours}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
