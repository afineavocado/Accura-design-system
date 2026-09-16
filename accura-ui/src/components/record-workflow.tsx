"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Stepper } from "@/components/ui/stepper";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function RecordSection({
  title,
  description,
  collapsible = false,
  defaultOpen = true,
  children,
}: {
  title: string;
  description?: string;
  /** Locked, read-once blocks can fold to their header. Off by default, so
   *  existing callers are unchanged. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const folded = collapsible && !open;

  return (
    <Card className="text-[var(--color-surface-overlay-foreground)]">
      <CardHeader>
        {collapsible ? (
          /* A button rather than <summary>: the heading stays a real heading
             for assistive tech, and the control keeps the design system's
             focus ring. Same shape as Training's audit-trail toggle. */
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-[var(--spacing-component-sm)] text-left"
          >
            <CardTitle>
              <h2 className="font-sans">{title}</h2>
            </CardTitle>
            <ChevronDown
              aria-hidden="true"
              className={
                open
                  ? "size-4 shrink-0 rotate-180 text-[var(--color-icon-muted)] transition-transform"
                  : "size-4 shrink-0 text-[var(--color-icon-muted)] transition-transform"
              }
            />
          </button>
        ) : (
          <CardTitle>
            <h2 className="font-sans">{title}</h2>
          </CardTitle>
        )}
        {description && !folded && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {!folded && <CardContent>{children}</CardContent>}
    </Card>
  );
}

/** Shared phase-gate composition. Display only: stage navigation cannot bypass a gate. */
export function PhaseGateStepper({
  steps,
  currentStep,
  waitingFor,
}: {
  steps: { label: string; description?: string }[];
  currentStep: number;
  waitingFor: string;
}) {
  return (
    <RecordSection title="Workflow" description={waitingFor}>
      <div className="hidden md:block">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          aria-label="Record workflow"
        />
      </div>
      <div className="md:hidden">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          orientation="vertical"
          aria-label="Record workflow"
        />
      </div>
    </RecordSection>
  );
}

/** Ratio applies to the space remaining after the semantic grid gap. */
export function RecordDetailLayout({
  progress,
  main,
  audit,
  ratio = "65/35",
}: {
  progress: ReactNode;
  main: ReactNode;
  audit: ReactNode;
  ratio?: "65/35" | "70/30";
}) {
  return (
    <div className="space-y-[var(--spacing-layout-sm)]">
      {progress}
      <div
        className={`grid items-start gap-[var(--spacing-layout-sm)] ${
          ratio === "70/30"
            ? "xl:grid-cols-[minmax(0,70fr)_minmax(0,30fr)]"
            : "xl:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]"
        }`}
      >
        <div className="min-w-0 space-y-[var(--spacing-layout-sm)]">{main}</div>
        <aside
          aria-label="Record actions and audit trail"
          className="min-w-0 space-y-[var(--spacing-layout-sm)]"
        >
          {audit}
        </aside>
      </div>
    </div>
  );
}

export type SignatureReceipt = {
  name: string;
  role: string;
  account: string;
  meaning: string;
  record: string;
  timestamp: string;
  action?: string;
  fromStatus?: string;
  toStatus?: string;
  invalidatedAt?: string;
};

/** Demo presentation only. Production must authenticate and bind immutable signatures server-side. */
export function ElectronicSignatureModal({
  open,
  onOpenChange,
  title,
  record,
  signer,
  meaning,
  onSign,
  actionLabel = "Sign and approve",
  reasonRequired = false,
  description = "Verify your identity to sign this regulated record.",
  reasonLabel = "Reason",
  reasonPlaceholder = "Explain this decision",
  recordLabel = "Document · revision",
  attestationSubject = "revision",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  record: string;
  signer: { name: string; role: string; account: string };
  meaning: string;
  onSign: (receipt: SignatureReceipt) => void;
  actionLabel?: string;
  reasonRequired?: boolean;
  /** What signing this will do. Defaults to the generic identity line. */
  description?: string;
  /** "Reason for rejection" reads better than a bare "Reason" when the dialog
   *  serves more than one decision. */
  reasonLabel?: string;
  reasonPlaceholder?: string;
  /** What `record` is. Was hardcoded to Documents' own wording, which read
   *  "Document · revision" above a deviation ID. */
  recordLabel?: string;
  /** The noun in the attestation line: "I have reviewed this ___". */
  attestationSubject?: string;
}) {
  const [confirmation, setConfirmation] = useState(false);
  const [credential, setCredential] = useState("");
  const [reason, setReason] = useState("");
  const [displayTime, setDisplayTime] = useState("");

  /* Clear every field each time the dialog opens, and stamp the time then.
     The modal stays mounted, so without this a second signing inherits the
     first one's reason, its typed credential and its ticked attestation — and
     shows the timestamp of when the page loaded rather than of the signing.

     Adjusted during render rather than in an effect: React documents this as
     the way to reset state when a prop changes, and it avoids the extra pass a
     setState-in-effect would cost. */
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setConfirmation(false);
      setCredential("");
      setReason("");
      setDisplayTime(
        new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC")
      );
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Electronic Signature — 21 CFR Part 11</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-[var(--spacing-component-md)]">
          <div className="space-y-[var(--spacing-component-sm)]">
            <Label htmlFor="signature-name">Full Name</Label>
            <Input
              id="signature-name"
              value={signer.name}
              readOnly
              className="bg-[var(--color-background-accent)]"
            />
          </div>
          <div className="space-y-[var(--spacing-component-sm)]">
            <Label htmlFor="signature-role">Role at Sign-off</Label>
            <Input
              id="signature-role"
              value={signer.role}
              readOnly
              className="bg-[var(--color-background-accent)]"
            />
          </div>
          <div className="col-span-2 space-y-[var(--spacing-component-sm)]">
            <Label htmlFor="signature-time">Time and Date</Label>
            <Input
              id="signature-time"
              value={displayTime}
              readOnly
              className="bg-[var(--color-background-accent)]"
            />
          </div>
        </div>
        <dl className="space-y-[var(--spacing-component-sm)] text-xs text-[var(--color-text-secondary)]">
          <div>
            <dt className="text-[var(--color-text-secondary)]">{recordLabel}</dt>
            <dd className="font-medium">{record}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-secondary)]">{title}</dt>
            <dd>{meaning}</dd>
          </div>
        </dl>
        {reasonRequired && (
          <div className="space-y-[var(--spacing-component-sm)]">
            <Label required htmlFor="decision-reason">{reasonLabel}</Label>
            <Input
              id="decision-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={reasonPlaceholder}
              required
            />
          </div>
        )}
        <div className="space-y-[var(--spacing-component-sm)]">
          <Label htmlFor="demo-credential">Enter password</Label>
          <Input
            id="demo-credential"
            type="password"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Enter your password"
            autoComplete="off"
            aria-describedby="demo-auth-note"
          />
          <p
            id="demo-auth-note"
            className="text-xs text-[var(--color-text-secondary)]"
          >
            Prototype only. Type “demo”; do not enter a real password. No
            authentication or legally binding signature is performed.
          </p>
        </div>
        <div className="flex items-start gap-[var(--spacing-component-sm)]">
          <Checkbox
            id="signature-intent"
            checked={confirmation}
            onCheckedChange={(value) => setConfirmation(value === true)}
          />
          <Label
            htmlFor="signature-intent"
            className="text-sm font-normal leading-normal"
          >
            I have reviewed this {attestationSubject} and intend to sign with
            the meaning stated above.
          </Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            disabled={
              !confirmation ||
              credential !== "demo" ||
              (reasonRequired && !reason.trim())
            }
            onClick={() => {
              onSign({
                ...signer,
                record,
                meaning: reasonRequired
                  ? `${meaning} Reason: ${reason.trim()}`
                  : meaning,
                timestamp: new Date().toISOString(),
              });
              onOpenChange(false);
            }}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
