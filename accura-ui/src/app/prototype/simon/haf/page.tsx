'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ChevronLeft } from 'lucide-react'
import { hafQuestions, jobs, worker } from '../mock-data'

export default function HAFPage() {
  const router = useRouter()
  const job = jobs[0]
  const [answers, setAnswers] = React.useState<Record<number, 'yes' | 'no'>>({})
  const [agreed, setAgreed] = React.useState(false)
  const [signed, setSigned] = React.useState(false)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const drawing = React.useRef(false)

  const allAnswered = hafQuestions.every((_, i) => answers[i] !== undefined)
  const canSubmit = allAnswered && agreed && signed

  // Simple canvas signature
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    drawing.current = true
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = canvasRef.current!.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = canvasRef.current!.getBoundingClientRect()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#18181b'
    ctx.lineCap = 'round'
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
    setSigned(true)
  }
  const endDraw = () => { drawing.current = false }

  const clearSignature = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !canvasRef.current) return
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setSigned(false)
  }

  return (
    <div className="flex flex-col flex-1 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-4 pb-4 border-b border-[var(--color-border-default)]">
        <button onClick={() => router.back()} className="text-[var(--color-icon-default)]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-[var(--color-background-default-foreground)]">Hazard Assessment Form</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">HAF</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 pt-6 overflow-y-auto">

        {/* Pre-filled info */}
        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-background-muted)] flex flex-col gap-3">
          <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">Site Information</p>
          {[
            { label: 'Operator Name', value: worker.name },
            { label: 'Client Name', value: job.customer },
            { label: 'Site Address', value: job.address },
            { label: 'Job Description', value: job.description },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <Label className="text-xs">{label}</Label>
              <Input value={value} readOnly className="bg-[var(--color-background-default)] text-sm" />
            </div>
          ))}
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-[var(--color-background-default-foreground)]">Assessment Questions</p>
        </div>

        {hafQuestions.map((q, i) => (
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
                  <RadioGroupItem value="yes" id={`haf-q${i}-yes`} />
                  <Label htmlFor={`haf-q${i}-yes`}>Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id={`haf-q${i}-no`} />
                  <Label htmlFor={`haf-q${i}-no`}>No</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        ))}

        {/* Signature */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Owner / Operator Signature <span className="text-[var(--color-text-invalid)]">*</span></Label>
            <button onClick={clearSignature} className="text-xs text-[var(--color-text-link)]">Clear</button>
          </div>
          <canvas
            ref={canvasRef}
            width={342}
            height={100}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            className={`w-full rounded-[var(--radius-md)] border cursor-crosshair bg-white ${signed ? 'border-[var(--color-border-default)]' : 'border-[var(--color-input-border)]'}`}
            style={{ touchAction: 'none' }}
          />
          {!signed && <p className="text-xs text-[var(--color-text-secondary)]">Sign above with your mouse or finger</p>}
        </div>

        {/* Agreement */}
        <div className="flex items-start gap-3 p-4 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
          <Checkbox
            id="agree"
            checked={agreed}
            onCheckedChange={v => setAgreed(!!v)}
            className="mt-0.5"
          />
          <Label htmlFor="agree" className="font-normal text-sm leading-relaxed cursor-pointer">
            I have read and understand all safety protocols for this job.
          </Label>
        </div>

        <Button className="w-full h-12 text-base" disabled={!canSubmit} onClick={() => router.push('/prototype/simon/complete')}>
          Submit HAF
        </Button>
      </div>
    </div>
  )
}
