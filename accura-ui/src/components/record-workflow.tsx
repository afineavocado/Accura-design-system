"use client";

import { useState, type ReactNode } from "react";
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
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-[var(--spacing-component-xl)] text-[var(--color-surface-overlay-foreground)]">
      <CardHeader>
        <CardTitle>
          <h2 className="font-sans">{title}</h2>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  record: string;
  signer: { name: string; role: string; account: string };
  meaning: string;
  onSign: (receipt: SignatureReceipt) => void;
}) {
  const [confirmation, setConfirmation] = useState(false);
  const [credential, setCredential] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Confirm your identity and the meaning of this electronic signature.
          </DialogDescription>
        </DialogHeader>
        <dl className="space-y-[var(--spacing-component-md)] text-sm">
          <div>
            <dt className="text-[var(--color-text-secondary)]">
              Document · revision
            </dt>
            <dd className="font-medium">{record}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-secondary)]">Signing as</dt>
            <dd>
              {signer.name} · {signer.role}
            </dd>
            <dd className="text-[var(--color-text-secondary)]">
              {signer.account}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--color-text-secondary)]">
              Signature meaning
            </dt>
            <dd>{meaning}</dd>
          </div>
        </dl>
        <div className="space-y-[var(--spacing-component-sm)]">
          <Label htmlFor="demo-credential">Demo confirmation</Label>
          <Input
            id="demo-credential"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Type demo"
            autoComplete="off"
            aria-describedby="demo-auth-note"
          />
          <p
            id="demo-auth-note"
            className="text-xs text-[var(--color-text-secondary)]"
          >
            Simulation only. Type “demo”; do not enter a real password. No
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
            I have reviewed this revision and intend to sign with the meaning
            stated above.
          </Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={!confirmation || credential !== "demo"}
            onClick={() => {
              onSign({
                ...signer,
                record,
                meaning,
                timestamp: new Date().toISOString(),
              });
              onOpenChange(false);
            }}
          >
            Sign and approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
