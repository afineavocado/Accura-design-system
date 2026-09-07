'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction
} from '@/components/ui/alert-dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { ChevronLeft, MapPin, TriangleAlert, CircleCheck, CircleAlert } from 'lucide-react'
import { useSimonPortal } from '../use-portal'

type Step = 'idle' | 'location' | 'geofence-fail' | 'success' | 'tbm-alert'

export default function CheckInPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<Step>('idle')
  const [locationDenied, setLocationDenied] = React.useState(false)
  const portal = useSimonPortal()

  // Simulate check-in flow
  const startCheckIn = () => setStep('location')

  return (
    <div className="flex flex-col flex-1 px-6 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-[var(--color-icon-default)]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--color-background-default-foreground)]">Check In</h1>
      </div>

      {/* Location denied warning */}
      {locationDenied && (
        <Alert variant="destructive" className="mb-4">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Location required</AlertTitle>
          <AlertDescription>
            Location access is required to check in. Please enable location permissions and try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Map placeholder */}
      <div className="flex-1 min-h-[300px] rounded-[var(--radius-lg)] bg-[var(--color-background-muted)] flex flex-col items-center justify-center gap-3 mb-6 border border-[var(--color-border-default)]">
        <MapPin className="h-8 w-8 text-[var(--color-brand-primary)]" />
        <p className="text-sm text-[var(--color-text-secondary)]">12 Harbour View Rd, Sydney</p>
        <p className="text-xs text-[var(--color-text-secondary)]">GPS map would render here</p>
      </div>

      <Button className="w-full h-12 text-base" onClick={startCheckIn}>
        Check In
      </Button>

      {/* ── Dialogs ── */}

      {/* 1. Location permission */}
      <AlertDialog open={step === 'location'}>
        <AlertDialogContent container={portal}>
          <AlertDialogHeader>
            <AlertDialogTitle>Allow SIMON to use your location?</AlertDialogTitle>
            <AlertDialogDescription>
              Your precise location is used to verify attendance and ensure compliance with safety requirements.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <Button className="w-full" onClick={() => setStep('geofence-fail')}>Allow</Button>
            <Button variant="outline" className="w-full" onClick={() => { setStep('idle'); setLocationDenied(true) }}>Deny</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2. Geofence fail */}
      <AlertDialog open={step === 'geofence-fail'}>
        <AlertDialogContent container={portal}>
          <AlertDialogHeader>
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-[var(--color-status-warning-subtle)] flex items-center justify-center">
                <TriangleAlert className="h-6 w-6 text-[var(--color-icon-warning)]" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Looks like you're too far away</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              We'll need to confirm you're at the assigned work site before check-in. Please move closer and try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full" onClick={() => setStep('success')}>
              OK, Got It
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 3. Check-in success (auto-shows TBM alert) */}
      <AlertDialog open={step === 'success'}>
        <AlertDialogContent container={portal}>
          <AlertDialogHeader>
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-[var(--color-status-success-subtle)] flex items-center justify-center">
                <CircleCheck className="h-6 w-6 text-[var(--color-icon-success)]" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Checked in successfully</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Your attendance has been recorded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full" onClick={() => setStep('tbm-alert')}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 4. TBM mandatory alert */}
      <AlertDialog open={step === 'tbm-alert'}>
        <AlertDialogContent container={portal}>
          <AlertDialogHeader>
            <AlertDialogTitle>You have checked-in</AlertDialogTitle>
            <AlertDialogDescription>
              You still need to complete the Toolbox Meeting to avoid being automatically checked out by the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full" onClick={() => router.push('/prototype/simon/tbm')}>
              OK, Got It
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
