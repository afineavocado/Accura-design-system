"use client"

import * as React from "react"
import { CheckCircle2, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  dateFormatOptions,
  languageOptions,
  separatorOptions,
  sequenceLengthOptions,
  timeFormatOptions,
  timeZoneOptions,
  type FormTab,
} from "./mock-data"
import { ScreenHeading } from "./settings-shell"

/* Save feedback. "Saved" only appears after a save and clears on the next edit,
   so it never claims a state that is no longer true. */
function SaveBar({ label, saved, disabled }: { label: string; saved: boolean; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-component-md)]">
      <Button type="submit" disabled={disabled}>
        {label}
      </Button>
      <p aria-live="polite" className="flex items-center gap-[var(--spacing-component-xs)] text-sm text-[var(--color-text-secondary)]">
        {saved && (
          <>
            <CheckCircle2 className="size-4 text-[var(--color-status-success)]" />
            Saved
          </>
        )}
      </p>
    </div>
  )
}

function Field({ id, label, required, children }: { id: string; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[var(--spacing-component-sm)]">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children}
    </div>
  )
}

/* §2 */
export function RecordNumberingScreen({ tab }: { tab: FormTab }) {
  const [prefix, setPrefix] = React.useState("ACME")
  const [separator, setSeparator] = React.useState("-")
  const [length, setLength] = React.useState("6")
  const [year, setYear] = React.useState(true)
  const [subType, setSubType] = React.useState(true)
  const [saved, setSaved] = React.useState(false)
  const touch = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    setSaved(false)
  }

  const cleanPrefix = prefix.trim().toUpperCase()
  const prefixError = !cleanPrefix ? "Enter an organisation prefix." : !/^[A-Z0-9]{2,8}$/.test(cleanPrefix) ? "Use 2–8 letters or numbers." : null

  // Audit A3: the spec never defines where the sub-type code comes from. GEN is the spec's example.
  const preview = [cleanPrefix || "PREFIX", "SOP", subType && "GEN", year && "2026", "1".padStart(Number(length), "0")]
    .filter(Boolean)
    .join(separator === "none" ? "" : separator)

  return (
    <>
      <ScreenHeading heading={tab.heading} subtitle={tab.subtitle} />
      {/* Preview first: it is the result every field below changes. */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <output aria-live="polite" className="block rounded-[var(--radius-md)] bg-[var(--color-background-muted)] p-[var(--spacing-component-lg)] font-mono text-lg font-semibold text-[var(--color-background-default-foreground)]">
            {preview}
          </output>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Format</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            className="flex flex-col gap-[var(--spacing-component-xl)]"
            onSubmit={(e) => {
              e.preventDefault()
              if (!prefixError) setSaved(true)
            }}
          >
            <Field id="rn-prefix" label="Organisation prefix" required>
              <Input
                id="rn-prefix"
                value={prefix}
                onChange={(e) => touch(setPrefix)(e.target.value.toUpperCase())}
                className="sm:max-w-[240px]"
                aria-invalid={!!prefixError || undefined}
                aria-describedby="rn-prefix-hint"
              />
              <p id="rn-prefix-hint" className={`text-xs ${prefixError ? "text-[var(--color-text-invalid)]" : "text-[var(--color-text-secondary)]"}`}>
                {prefixError ?? "Appears at the start of every record number."}
              </p>
            </Field>

            <div className="flex flex-col gap-[var(--spacing-component-sm)]">
              <span className="text-sm font-medium text-[var(--color-background-default-foreground)]">Document type</span>
              <p className="flex items-start gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] bg-[var(--color-background-muted)] p-[var(--spacing-component-md)] text-sm text-[var(--color-text-secondary)]">
                <Info className="mt-0.5 size-4 shrink-0" />
                Always included (e.g. SOP, WI, POL) — configured under Documents → Document Types.
              </p>
            </div>

            <div className="grid gap-[var(--spacing-component-xl)] sm:grid-cols-2">
              <Field id="rn-separator" label="Separator">
                <Select value={separator || "none"} onValueChange={touch(setSeparator)}>
                  <SelectTrigger id="rn-separator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {separatorOptions.map((o) => (
                      <SelectItem key={o.label} value={o.value || "none"}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field id="rn-length" label="Sequence length">
                <Select value={length} onValueChange={touch(setLength)}>
                  <SelectTrigger id="rn-length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sequenceLengthOptions.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} digits ({"1".padStart(n, "0")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="flex flex-col gap-[var(--spacing-component-md)]">
              <div className="flex items-center gap-[var(--spacing-component-sm)]">
                <Checkbox id="rn-year" checked={year} onCheckedChange={(v) => touch(setYear)(v === true)} />
                <Label htmlFor="rn-year">Include year in record number</Label>
              </div>
              <div className="flex items-center gap-[var(--spacing-component-sm)]">
                <Checkbox id="rn-subtype" checked={subType} onCheckedChange={(v) => touch(setSubType)(v === true)} />
                <Label htmlFor="rn-subtype">Include document sub-type</Label>
              </div>
            </div>

            <SaveBar label="Save Record Numbering" saved={saved} />
          </form>
        </CardContent>
      </Card>
    </>
  )
}

/* §5 */
export function PreferencesScreen({ tab }: { tab: FormTab }) {
  const [values, setValues] = React.useState({ tz: "Australia/Sydney", lang: "English", date: "DD-MMM-YYYY", time: "12" })
  const [saved, setSaved] = React.useState(false)
  const set = (key: keyof typeof values) => (v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }))
    setSaved(false)
  }

  const fields: { key: keyof typeof values; id: string; label: string; options: { value: string; label: string }[] }[] = [
    { key: "tz", id: "pref-tz", label: "Time zone", options: timeZoneOptions.map((v) => ({ value: v, label: v })) },
    { key: "lang", id: "pref-lang", label: "Language", options: languageOptions.map((v) => ({ value: v, label: v })) },
    { key: "date", id: "pref-date", label: "Date format", options: dateFormatOptions },
    { key: "time", id: "pref-time", label: "Time format", options: timeFormatOptions },
  ]

  return (
    <>
      <ScreenHeading heading={tab.heading} subtitle={tab.subtitle} />
      <Card>
        <CardHeader>
          <CardTitle>Display</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-[var(--spacing-component-xl)]"
            onSubmit={(e) => {
              e.preventDefault()
              setSaved(true)
            }}
          >
            {fields.map((f) => (
              <Field key={f.key} id={f.id} label={f.label}>
                <Select value={values[f.key]} onValueChange={set(f.key)}>
                  <SelectTrigger id={f.id} className="sm:max-w-[320px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {f.options.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ))}
            <p className="text-xs text-[var(--color-text-secondary)]">
              Applies system-wide, including Audit Trail timestamps.
            </p>
            <SaveBar label="Save Preferences" saved={saved} />
          </form>
        </CardContent>
      </Card>
    </>
  )
}
