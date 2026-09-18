"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Clock3, Mail, PenTool, UserRound } from "lucide-react";
import { Stepper } from "@/components/ui/stepper";
import { cn } from "@/lib/utils";
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
  /** What the signer typed, unmixed with `meaning`. Callers that store the
   *  reason on the record need it on its own; `meaning` keeps the combined
   *  sentence for display. */
  reason?: string;
  record: string;
  timestamp: string;
  action?: string;
  fromStatus?: string;
  toStatus?: string;
  invalidatedAt?: string;
};

/* One line of signer identity: a circular icon, a label, and a read-only value.
 *
 * Read-only identity used to be three disabled <Input>s, which said "you could
 * type here" about facts the signer cannot change, and cost a full field's
 * height each. This is the presentation CAPA arrived at and the one adopted
 * system-wide on 2026-09-22. */
function IdentityField({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-[var(--spacing-component-md)]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-surface-muted-foreground)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm leading-normal text-[var(--color-text-secondary)]">
          {label}
        </p>
        <p
          className="truncate text-sm leading-normal text-[var(--color-surface-default-foreground)]"
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

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
  tone = "default",
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
  /** The noun in the attestation line. */
  attestationSubject?: string;
  /** `danger` tints the record panel for a rejection. A reject signature that
   *  looks exactly like an approve signature is the wrong affordance on a
   *  regulated record. */
  tone?: "default" | "danger";
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
      /* House format — accura-design-patterns.md → Dates and times. Was
         `2026-09-22 09:42:18 UTC`, an ISO string with the T swapped out. */
      setDisplayTime(
        new Date().toLocaleString("en-US", {
          timeZone: "UTC",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " UTC"
      );
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Electronic Signature - 21 CFR Part 11</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* What is being signed, and what signing it means. Stated once, at the
            top, on its own surface — the two facts a signature is worthless
            without. */}
        <div
          className={cn(
            "flex flex-col gap-[var(--spacing-component-sm)] rounded-[var(--radius-lg)] border p-[var(--spacing-component-lg)] text-sm text-[var(--color-text-secondary)]",
            tone === "danger"
              ? "border-[var(--color-border-error)] bg-[var(--color-status-danger-subtle)]"
              : "border-[var(--color-border-success)] bg-[var(--color-status-success-subtle)]"
          )}
        >
          <div className="flex items-center justify-between gap-[var(--spacing-component-md)]">
            <span>{recordLabel}</span>
            <span
              className={cn(
                "text-right font-medium",
                tone === "danger"
                  ? "text-[var(--color-text-invalid)]"
                  : "text-[var(--color-text-success)]"
              )}
              title={title}
            >
              {record}
            </span>
          </div>
          <div className="flex items-center justify-between gap-[var(--spacing-component-md)]">
            <span>Signature meaning</span>
            <span className="text-right font-medium text-[var(--color-surface-default-foreground)]">
              {meaning}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[var(--spacing-component-lg)] sm:grid-cols-2">
          <IdentityField
            icon={<UserRound className="size-4" />}
            label="Full name"
            value={signer.name}
          />
          <IdentityField
            icon={<Mail className="size-4" />}
            label="Email"
            value={signer.account}
          />
          <IdentityField
            icon={<PenTool className="size-4" />}
            label="Role at sign-off"
            value={signer.role}
          />
          <IdentityField
            icon={<Clock3 className="size-4" />}
            label="Timestamp UTC"
            value={displayTime}
          />
        </div>

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
          <Label required htmlFor="demo-credential">
            Re-enter password
          </Label>
          <Input
            id="demo-credential"
            type="password"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Re-enter your password"
            autoComplete="off"
            aria-describedby="demo-auth-note"
            required
          />
          {/* The only one of the three signature dialogs that said the
              credential is fake. Kept: a password field with no such note asks
              for a real password. */}
          <p
            id="demo-auth-note"
            className="text-xs text-[var(--color-text-secondary)]"
          >
            Prototype only; do not enter a real password. No authentication or
            legally binding signature is performed.
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
            By entering my credentials, I confirm that this {attestationSubject}{" "}
            complies with formal requirements as equivalent to my handwritten
            signature.
          </Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={
              !confirmation ||
              credential.trim().length === 0 ||
              (reasonRequired && !reason.trim())
            }
            onClick={() => {
              onSign({
                ...signer,
                record,
                meaning: reasonRequired
                  ? `${meaning} Reason: ${reason.trim()}`
                  : meaning,
                reason: reason.trim() || undefined,
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
