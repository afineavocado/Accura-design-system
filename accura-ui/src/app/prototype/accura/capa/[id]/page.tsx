"use client"

import * as React from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import {
  ChevronLeft,
  CircleCheck,
  Clock3,
  Mail,
  Menu,
  PenTool,
  UserRound,
} from "lucide-react"

import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Stepper } from "@/components/ui/stepper"
import { AppNavItems, AppSidebar } from "../../app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import {
  auditRecords,
  canViewCapaDetail,
  capaStatusVariant,
  getCapaRecord,
  signerIdentity,
  type CapaStatus,
} from "../mock-data"

const progressSteps = [
  { label: "Draft", description: "Completed" },
  { label: "In Review", description: "by Sarah Johnson (QA)" },
  { label: "In Approval", description: "by Sarah Johnson (QA)" },
  { label: "Action in Progress", description: "0/0 Actions Submitted" },
  { label: "Final Approval", description: "by Sarah Johnson (QA)" },
  { label: "Close", description: "by Sarah Johnson (QA)" },
]

const statusStep: Record<CapaStatus, number> = {
  Draft: 1,
  "In Review": 2,
  "In Approval": 3,
  "Action in Progress": 4,
  "Final Approval": 5,
  Close: 6,
}


function IdentityField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-[var(--spacing-component-md)]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-surface-muted-foreground)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm leading-normal text-[var(--color-text-secondary)]">{label}</p>
        <p className="truncate text-sm leading-normal text-[var(--color-surface-default-foreground)]" title={value}>
          {value}
        </p>
      </div>
    </div>
  )
}

export default function CapaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const capa = getCapaRecord(id)
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const [signatureOpen, setSignatureOpen] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [attested, setAttested] = React.useState(false)
  const [isApproved, setIsApproved] = React.useState(false)

  if (!capa || !canViewCapaDetail(capa)) notFound()

  const effectiveStatus: CapaStatus = isApproved ? "In Approval" : capa.status
  const detailFields = [
    { label: "CAPA ID", value: capa.id },
    { label: "Status", value: effectiveStatus, badge: true },
    { label: "Title", value: capa.title },
    { label: "Source", value: capa.source },
    { label: "Linked Source", value: `${capa.sourceId} — Equipment f...` },
    { label: "Type", value: capa.type },
    { label: "Department", value: capa.department },
    { label: "Owner", value: `${capa.owner} (${capa.ownerTeam})` },
    { label: "QA Approver", value: `${capa.approver} (${capa.approverTeam})` },
    { label: "Raised By", value: capa.raisedBy },
    { label: "Date Raised", value: capa.dateRaised },
    { label: "Due Date", value: capa.dueDate },
  ]

  function handleSignatureOpenChange(open: boolean) {
    setSignatureOpen(open)
    if (!open) {
      setPassword("")
      setAttested(false)
    }
  }

  function handleSignatureSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!password || !attested) return

    if (effectiveStatus === "In Review") setIsApproved(true)
    handleSignatureOpenChange(false)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)]">
        <AppSidebar />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-layout-xs)] md:px-[var(--spacing-layout-sm)]">
            <Button
              variant="ghost"
              size="icon-sm"
              className="mr-[var(--spacing-component-sm)] lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <span className="text-base font-medium text-[var(--color-background-default-foreground)]">CAPA</span>
          </header>

          {mobileNavOpen && (
            <div className="border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-background)] p-[var(--spacing-component-md)] lg:hidden">
              <AppNavItems />
            </div>
          )}

          <section className="min-h-0 flex-1 overflow-y-auto px-[var(--spacing-layout-xs)] py-[var(--spacing-layout-sm)] md:px-[var(--spacing-layout-md)] lg:px-[var(--spacing-layout-lg)]">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-[var(--spacing-layout-sm)]">
              <div className="flex flex-col gap-[var(--spacing-component-md)] sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-[var(--spacing-component-sm)]">
                  <Button asChild variant="link" className="h-auto w-fit p-0 text-xs no-underline hover:no-underline">
                    <Link href="/prototype/accura/capa">
                      <ChevronLeft className="h-4 w-4" />
                      Back to CAPAs
                    </Link>
                  </Button>
                  <h1 className="text-xl font-semibold text-[var(--color-background-default-foreground)]">{capa.title}</h1>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="self-start sm:self-auto">
                      <Clock3 className="h-4 w-4" />
                      View audit trail
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Audit Trail Record</SheetTitle>
                      <SheetDescription>{capa.id}</SheetDescription>
                    </SheetHeader>

                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[var(--spacing-component-lg)]">
                      {auditRecords.map((record, index) => (
                        <React.Fragment key={record.id}>
                          {index > 0 && <Separator />}
                          <article className="flex gap-[var(--spacing-component-md)] py-[var(--spacing-component-lg)]">
                            <Avatar size="lg" fallback={record.initials} name={record.user} />
                            <div className="min-w-0 flex-1">
                              <p className="text-base font-semibold leading-snug text-[var(--color-surface-overlay-foreground)]">
                                {record.user}
                              </p>
                              <time className="mt-[var(--spacing-component-xs)] block text-sm text-[var(--color-text-secondary)]">
                                {record.timestamp}
                              </time>
                              <p className="mt-[var(--spacing-component-sm)] text-sm leading-5 text-[var(--color-surface-overlay-foreground)]">
                                {record.activity}
                              </p>
                              <div className="mt-[var(--spacing-component-sm)] flex flex-col gap-[var(--spacing-component-sm)] sm:flex-row sm:items-center sm:justify-between">
                                <span className="font-mono text-xs leading-4 text-[var(--color-text-secondary)]">{record.hash}</span>
                                <span className="inline-flex shrink-0 items-center gap-[var(--spacing-component-xs)] text-sm font-medium leading-none text-[var(--color-text-success)]">
                                  <CircleCheck className="h-4 w-4 text-[var(--color-icon-success)]" />
                                  Verified
                                </span>
                              </div>
                            </div>
                          </article>
                        </React.Fragment>
                      ))}
                    </div>

                    <SheetFooter>
                      <Button className="w-full">Export Audit Report</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              <Card className="overflow-x-auto p-[var(--spacing-component-lg)]">
                <Stepper
                  steps={progressSteps}
                  currentStep={statusStep[effectiveStatus]}
                  aria-label="CAPA progress"
                  className="min-w-[780px]"
                />
              </Card>

              <div className="grid grid-cols-1 gap-[var(--spacing-component-lg)] lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
                <Card>
                  <CardHeader><CardTitle>CAPA Details</CardTitle></CardHeader>
                  <Separator />
                  <CardContent className="grid grid-cols-1 gap-[var(--spacing-component-lg)] sm:grid-cols-2 lg:grid-cols-3">
                    {detailFields.map((field) => (
                      <div key={field.label} className="min-w-0">
                        <div className="text-xs font-medium uppercase text-[var(--color-text-secondary)]">{field.label}</div>
                        <div className="mt-[var(--spacing-component-xs)] truncate text-sm leading-normal text-[var(--color-surface-overlay-foreground)]" title={field.value}>
                          {field.badge ? (
                            <Badge variant={capaStatusVariant[effectiveStatus]} shape="pill" size="md">
                              {field.value}
                            </Badge>
                          ) : field.value}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>1 action</CardDescription>
                  </CardHeader>
                  <Separator />
                  <CardContent className="gap-[var(--spacing-component-md)]">
                    <div className="flex items-center justify-between gap-[var(--spacing-component-md)]">
                      <span className="text-sm font-medium text-[var(--color-surface-overlay-foreground)]">Action 1</span>
                      <Badge variant="success" shape="pill" size="md">Accepted</Badge>
                    </div>
                    <p className="text-sm leading-normal text-[var(--color-surface-overlay-foreground)]">asdad</p>
                    <div className="flex flex-col gap-[var(--spacing-component-xs)] text-sm leading-normal">
                      <p>
                        <span className="text-[var(--color-text-secondary)]">Owner: </span>
                        <span className="text-[var(--color-surface-overlay-foreground)]">Sarah Johnson (QA)</span>
                      </p>
                      <p>
                        <span className="text-[var(--color-text-secondary)]">Due date: </span>
                        <span className="text-[var(--color-surface-overlay-foreground)]">2026-09-16</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-[var(--spacing-component-lg)] pb-[var(--spacing-layout-xs)] sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-normal text-[var(--color-background-default-foreground)]">
                  QA reviews the CAPA plan and can approve or reject it. Both require an electronic signature.
                </p>
                <div className="flex shrink-0 items-center gap-[var(--spacing-component-md)] self-end sm:self-auto">
                  <Button variant="destructiveSecondary" size="sm">Reject</Button>
                  <Dialog open={signatureOpen} onOpenChange={handleSignatureOpenChange}>
                    <DialogTrigger asChild>
                      <Button size="sm">Approve &amp; Sign</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Electronic Signature — 21 CFR Part 11</DialogTitle>
                        <DialogDescription>
                          Verify your identity to approve this regulated record.
                        </DialogDescription>
                      </DialogHeader>

                      <form className="flex flex-col gap-[var(--spacing-component-lg)]" onSubmit={handleSignatureSubmit}>
                        <div className="flex flex-col gap-[var(--spacing-component-sm)] rounded-[var(--radius-lg)] border border-[var(--color-border-success)] bg-[var(--color-status-success-subtle)] p-[var(--spacing-component-lg)] text-sm text-[var(--color-text-secondary)]">
                          <div className="flex items-center justify-between gap-[var(--spacing-component-md)]">
                            <span>Record</span>
                            <span className="font-medium">{capa.id}</span>
                          </div>
                          <div className="flex items-center justify-between gap-[var(--spacing-component-md)]">
                            <span>Signature meaning</span>
                            <span className="text-right font-medium">Approve CAPA review</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-[var(--spacing-component-lg)] sm:grid-cols-2">
                          <IdentityField icon={<UserRound className="h-4 w-4" />} label="Full name" value={signerIdentity.fullName} />
                          <IdentityField icon={<Mail className="h-4 w-4" />} label="Email" value={signerIdentity.email} />
                          <IdentityField icon={<PenTool className="h-4 w-4" />} label="Role at sign-off" value={signerIdentity.role} />
                          <IdentityField icon={<Clock3 className="h-4 w-4" />} label="Timestamp UTC" value={signerIdentity.timestamp} />
                        </div>

                        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                          <Label htmlFor="signature-password">Re-enter Password</Label>
                          <Input
                            id="signature-password"
                            type="password"
                            placeholder="Re-enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            required
                          />
                        </div>

                        <div className="flex min-h-11 items-start gap-[var(--spacing-component-sm)]">
                          <Checkbox
                            id="signature-attestation"
                            checked={attested}
                            onCheckedChange={(checked) => setAttested(checked === true)}
                            className="mt-[var(--spacing-component-xxs)]"
                            required
                          />
                          <Label
                            htmlFor="signature-attestation"
                            className="cursor-pointer text-sm font-normal leading-normal text-[var(--color-surface-default-foreground)]"
                          >
                            By entering my credentials, I confirm that this review complies with formal requirements as equivalent to my handwritten signature.
                          </Label>
                        </div>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" disabled={!password || !attested}>
                            Submit
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </SidebarProvider>
  )
}
