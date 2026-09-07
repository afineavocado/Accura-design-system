'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction
} from '@/components/ui/alert-dialog'
import { ChevronLeft } from 'lucide-react'
import { hazards, dailyConditions, safetyEquipment, jobs } from '../mock-data'
import { useSimonPortal } from '../use-portal'

// Defined outside component — prevents remount on every keystroke
function Section({ title, required, children }: { title: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-[var(--color-background-default-foreground)]">
        {title}
        {required && <span className="text-[var(--color-text-invalid)] ml-1" aria-hidden="true">*</span>}
      </p>
      {children}
    </div>
  )
}

export default function TBMPage() {
  const router = useRouter()
  const job = jobs[0]

  const [ladder, setLadder] = React.useState<'yes' | 'no' | ''>('')
  const [rooms, setRooms] = React.useState<string[]>([])
  const [selectedHazards, setSelectedHazards] = React.useState<string[]>([])
  const [conditions, setConditions] = React.useState<string[]>([])
  const [equipment, setEquipment] = React.useState<string[]>([])
  const [initiative, setInitiative] = React.useState('')
  const [initiativeTouched, setInitiativeTouched] = React.useState(false)
  const [notes, setNotes] = React.useState('')
  const [showInProgress, setShowInProgress] = React.useState(false)
  const portal = useSimonPortal()

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])

  const initiativeValid = initiative.length >= 50
  const canSubmit = ladder !== '' && rooms.length > 0 && selectedHazards.length > 0
    && conditions.length > 0 && equipment.length > 0 && initiativeValid

  const handleSubmit = () => {
    if (!canSubmit) return
    router.push('/prototype/simon/tbm/review')
  }

  return (
    <div className="flex flex-col flex-1 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-4 pb-4 border-b border-[var(--color-border-default)]">
        <button onClick={() => router.back()} className="text-[var(--color-icon-default)]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-[var(--color-background-default-foreground)]">Toolbox Meeting</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">{job.customer}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6 pt-6 overflow-y-auto">

        {/* Required legend */}
        <p className="text-xs text-[var(--color-text-secondary)]">
          Fields marked <span className="text-[var(--color-text-invalid)]">*</span> are required.
        </p>

        {/* Section 1 — Ladder */}
        <Section title="1. Ladder Inspection" required>
          <p className="text-sm text-[var(--color-text-secondary)]">Is a ladder being used today?</p>
          <RadioGroup value={ladder} onValueChange={v => setLadder(v as 'yes' | 'no')}>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="ladder-yes" />
                <Label htmlFor="ladder-yes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="ladder-no" />
                <Label htmlFor="ladder-no">No</Label>
              </div>
            </div>
          </RadioGroup>
        </Section>

        {/* Section 2 — Rooms */}
        <Section title="2. What are we completing today?" required>
          <div className="grid grid-cols-2 gap-2">
            {job.rooms.map(room => (
              <div key={room} className="flex items-center gap-2">
                <Checkbox
                  id={`room-${room}`}
                  checked={rooms.includes(room)}
                  onCheckedChange={() => toggle(rooms, setRooms, room)}
                />
                <Label htmlFor={`room-${room}`} className="font-normal text-sm">{room}</Label>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 3 — Hazards */}
        <Section title="3. Job-site Hazards" required>
          <div className="flex flex-col gap-2">
            {hazards.map(h => (
              <div key={h} className="flex items-center gap-2">
                <Checkbox
                  id={`hazard-${h}`}
                  checked={selectedHazards.includes(h)}
                  onCheckedChange={() => toggle(selectedHazards, setSelectedHazards, h)}
                />
                <Label htmlFor={`hazard-${h}`} className="font-normal text-sm">{h}</Label>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 4 — Daily Conditions */}
        <Section title="4. Daily Conditions" required>
          <div className="grid grid-cols-2 gap-2">
            {dailyConditions.map(c => (
              <div key={c} className="flex items-center gap-2">
                <Checkbox
                  id={`cond-${c}`}
                  checked={conditions.includes(c)}
                  onCheckedChange={() => toggle(conditions, setConditions, c)}
                />
                <Label htmlFor={`cond-${c}`} className="font-normal text-sm">{c}</Label>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 5 — Safety Equipment */}
        <Section title="5. Safety Equipment" required>
          <div className="grid grid-cols-2 gap-2">
            {safetyEquipment.map(e => (
              <div key={e} className="flex items-center gap-2">
                <Checkbox
                  id={`equip-${e}`}
                  checked={equipment.includes(e)}
                  onCheckedChange={() => toggle(equipment, setEquipment, e)}
                />
                <Label htmlFor={`equip-${e}`} className="font-normal text-sm">{e}</Label>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 6 — Safety Initiative */}
        <Section title="6. Safety Initiative" required>
          <p className="text-sm text-[var(--color-text-secondary)]">
            How will you control the hazards, secure ladders and minimise the risk of injury?
          </p>
          <Textarea
            placeholder="Describe your safety initiative… (minimum 50 characters)"
            value={initiative}
            onChange={e => setInitiative(e.target.value)}
            onBlur={() => setInitiativeTouched(true)}
            aria-invalid={(initiativeTouched && !initiativeValid) || undefined}
            rows={4}
          />
          <p className={`text-xs ${initiativeValid ? 'text-[var(--color-text-secondary)]' : initiativeTouched ? 'text-[var(--color-text-invalid)]' : 'text-[var(--color-text-secondary)]'}`}>
            {initiative.length} / 50 characters minimum
          </p>
        </Section>

        {/* Section 7 — Team Huddle Notes */}
        <Section title="7. Team Huddle Notes (Optional)">
          <Textarea
            placeholder="Any additional notes from the team huddle…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />
        </Section>

        {/* Submit */}
        <div className="flex flex-col gap-3 pb-4">
          <Button className="w-full h-12 text-base" disabled={!canSubmit} onClick={handleSubmit}>
            Submit
          </Button>
          {!canSubmit && (
            <p className="text-xs text-center text-[var(--color-text-secondary)]">
              Complete all required fields to submit.
            </p>
          )}
        </div>
      </div>

      {/* TBM In Progress modal */}
      <AlertDialog open={showInProgress} onOpenChange={setShowInProgress}>
        <AlertDialogContent container={portal}>
          <AlertDialogHeader>
            <AlertDialogTitle>Toolbox Meeting In Progress</AlertDialogTitle>
            <AlertDialogDescription>
              A Toolbox Meeting form is currently being completed. Please wait until it is finished, then try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full" onClick={() => setShowInProgress(false)}>
              OK, Got It
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
