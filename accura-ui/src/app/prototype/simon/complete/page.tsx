'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Item } from '@/components/ui/item'
import { Card, CardContent } from '@/components/ui/card'
import { CircleCheck, MapPin, Clock, Shield, FileCheck } from 'lucide-react'
import { jobs } from '../mock-data'

export default function CompletePage() {
  const router = useRouter()
  const job = jobs[0]

  const milestones = [
    { icon: <MapPin className="h-5 w-5" />, label: 'Checked In', detail: 'GPS verified at site' },
    { icon: <FileCheck className="h-5 w-5" />, label: 'TBM Completed', detail: 'Toolbox meeting submitted' },
    { icon: <Shield className="h-5 w-5" />, label: 'HAF Completed', detail: 'Hazard assessment submitted' },
    { icon: <CircleCheck className="h-5 w-5" />, label: 'Safety Acknowledgement', detail: 'Confirmation recorded' },
  ]

  return (
    <div className="flex flex-col flex-1 px-6 pt-8 pb-8 gap-8">
      {/* Success hero */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 rounded-full bg-[var(--color-status-success-subtle)] flex items-center justify-center">
          <CircleCheck className="h-8 w-8 text-[var(--color-icon-success)]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-background-default-foreground)]">
            You're ready to work!
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            All compliance requirements completed.
          </p>
        </div>
        {/* Job Status label + Badge — separate label from value */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-secondary)]">Job Status</span>
          <Badge variant="success" shape="pill" size="sm">In Progress</Badge>
        </div>
      </div>

      {/* Job info — Card component, icon/muted token, h-4 w-4 */}
      <Card className="p-3">
        <CardContent className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-[var(--color-background-default-foreground)]">{job.customer}</p>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-[var(--color-icon-muted)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">{job.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 shrink-0 text-[var(--color-icon-muted)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              Check-in: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Milestones — Item Variant=Outline, success trailing check via action prop */}
      <div className="flex flex-col gap-2">
        {milestones.map((m, i) => (
          <Item
            key={i}
            type="icon"
            variant="outline"
            size="default"
            icon={<span className="text-[var(--color-icon-success)]">{m.icon}</span>}
            title={m.label}
            description={m.detail}
            action={<CircleCheck className="h-5 w-5 text-[var(--color-icon-success)]" />}
          />
        ))}
      </div>

      <Button className="w-full mt-auto" onClick={() => router.push('/prototype/simon/jobs')}>
        Back to My Jobs
      </Button>
    </div>
  )
}
