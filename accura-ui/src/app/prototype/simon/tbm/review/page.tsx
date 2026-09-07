'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { ChevronLeft, CircleCheck } from 'lucide-react'
import { safetyQuestions } from '../../mock-data'

export default function TBMReviewPage() {
  const router = useRouter()
  const [answers, setAnswers] = React.useState<Record<number, 'yes' | 'no'>>({})
  const [submitted, setSubmitted] = React.useState(false)
  const [supervisorAlert, setSupervisorAlert] = React.useState(false)

  const allAnswered = safetyQuestions.every((_, i) => answers[i] !== undefined)
  const hasNo = Object.values(answers).some(a => a === 'no')

  const handleSubmit = () => {
    if (!allAnswered) return
    if (hasNo) setSupervisorAlert(true)
    setSubmitted(true)
    setTimeout(() => router.push('/prototype/simon/haf'), 1500)
  }

  return (
    <div className="flex flex-col flex-1 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-4 pb-4 border-b border-[var(--color-border-default)]">
        <button onClick={() => router.back()} className="text-[var(--color-icon-default)]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-[var(--color-background-default-foreground)]">TBM Review & Safety</h1>
      </div>

      <div className="flex flex-col gap-6 px-6 pt-6 overflow-y-auto">

        {/* TBM Summary */}
        <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CircleCheck className="h-4 w-4 text-[var(--color-icon-success)]" />
            <p className="text-sm font-semibold text-[var(--color-background-default-foreground)]">Toolbox Meeting Submitted</p>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            All safety information has been recorded. Please confirm your understanding below.
          </p>
        </div>

        {/* Safety Confirmation */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-[var(--color-background-default-foreground)]">Worker Safety Confirmation</p>
          <p className="text-xs text-[var(--color-text-secondary)]">All questions are required.</p>
        </div>

        {supervisorAlert && (
          <Alert variant="warning">
            One or more answers indicate a concern. Your supervisor has been notified.
          </Alert>
        )}

        {safetyQuestions.map((q, i) => (
          <div key={i} className="flex flex-col gap-2 p-4 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
            <p className="text-sm text-[var(--color-background-default-foreground)]">
              <span className="font-medium">Q{i + 1}.</span> {q}
            </p>
            <RadioGroup
              value={answers[i] ?? ''}
              onValueChange={v => setAnswers(prev => ({ ...prev, [i]: v as 'yes' | 'no' }))}
            >
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id={`q${i}-yes`} />
                  <Label htmlFor={`q${i}-yes`}>Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id={`q${i}-no`} />
                  <Label htmlFor={`q${i}-no`}>No</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        ))}

        <Button
          className="w-full h-12 text-base"
          disabled={!allAnswered || submitted}
          onClick={handleSubmit}
        >
          {submitted ? 'Redirecting to HAF…' : 'Submit & Continue to HAF'}
        </Button>
      </div>
    </div>
  )
}
