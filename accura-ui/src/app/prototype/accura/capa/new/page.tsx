"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarLogo,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--color-background-default-foreground)]">
      {children} <span className="text-[var(--color-text-invalid)]">*</span>
    </label>
  )
}

function AccuraLogo() {
  return (
    <SidebarLogo className="h-9 w-[104px]">
      <Image
        src="/accura-logo.png"
        alt="Accura"
        width={104}
        height={36}
        className="h-full w-full object-contain"
        priority
      />
    </SidebarLogo>
  )
}

function SidebarNavigation() {
  return (
    <>
      <SidebarHeader className="h-14 px-[var(--spacing-component-xl)]"><AccuraLogo /></SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="gap-[var(--spacing-component-xs)] px-[var(--spacing-component-md)] py-[var(--spacing-component-lg)]">
          <SidebarMenuItem icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" href="#" />
          <SidebarMenuItem icon={<ClipboardCheck className="h-4 w-4" />} label="CAPA" href="/prototype/accura/capa" active />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-[var(--spacing-component-xs)] px-[var(--spacing-component-md)] py-[var(--spacing-component-md)]">
        <SidebarMenuItem icon={<Settings className="h-4 w-4" />} label="Settings" href="#" />
        <SidebarMenuItem icon={<LogOut className="h-4 w-4" />} label="Logout" href="#" />
      </SidebarFooter>
    </>
  )
}

function SelectField({
  id,
  label,
  placeholder,
  defaultValue,
  value,
  onValueChange,
  disabled,
  options,
}: {
  id: string
  label: string
  placeholder: string
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  options: Array<{ value: string; label: string; disabled?: boolean }>
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-component-xs)]">
      <RequiredLabel htmlFor={id}>{label}</RequiredLabel>
      <Select defaultValue={defaultValue} value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} aria-label={label}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function CreateCapaPage() {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const [source, setSource] = React.useState("")
  const [sourceLink, setSourceLink] = React.useState("")

  const sourceLinkOptions = source === "risk-assessment"
    ? [{ value: "ra-2026-0012", label: "RA-2026-0012 — Equipment failure" }]
    : source === "deviation"
      ? [{ value: "dev-2026-0089", label: "DEV-2026-0089" }]
      : [{ value: "no-audit-records", label: "No audit records available", disabled: true }]

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background-muted)]">
        <Sidebar type="default" collapsible="none" className="hidden lg:flex">
          <SidebarNavigation />
        </Sidebar>

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
              <SidebarMenuItem icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" href="#" />
              <SidebarMenuItem icon={<ClipboardCheck className="h-4 w-4" />} label="CAPA" href="/prototype/accura/capa" active />
            </div>
          )}

          <div className="flex min-h-0 flex-1 overflow-y-auto px-[var(--spacing-layout-xs)] py-[var(--spacing-layout-sm)] md:px-[var(--spacing-layout-md)] lg:px-[var(--spacing-layout-lg)]">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-[var(--spacing-layout-sm)]">
              <div className="flex flex-col gap-[var(--spacing-component-sm)]">
                <Button asChild variant="link" className="h-auto w-fit p-0 text-sm no-underline hover:no-underline">
                  <Link href="/prototype/accura/capa">
                    <ChevronLeft className="h-4 w-4" />
                    Back to CAPAs
                  </Link>
                </Button>
                <h1 className="text-2xl font-semibold text-[var(--color-background-default-foreground)]">
                  Create New CAPA
                </h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">CAPA Details</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="grid grid-cols-1 gap-[var(--spacing-component-lg)] md:grid-cols-2">
                  <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                    <RequiredLabel htmlFor="capa-title">Title</RequiredLabel>
                    <Input id="capa-title" placeholder="Enter title" />
                  </div>

                  <SelectField
                    id="capa-type"
                    label="Type"
                    placeholder="Select CAPA type"
                    defaultValue="corrective"
                    options={[
                      { value: "corrective", label: "Corrective Action" },
                      { value: "preventive", label: "Preventive Action" },
                    ]}
                  />

                  <SelectField
                    id="capa-source"
                    label="Source"
                    placeholder="Select CAPA source"
                    value={source}
                    onValueChange={(value) => {
                      setSource(value)
                      setSourceLink("")
                    }}
                    options={[
                      { value: "risk-assessment", label: "Risk Assessment" },
                      { value: "audit", label: "Audit" },
                      { value: "deviation", label: "Deviation" },
                    ]}
                  />

                  <SelectField
                    id="source-link"
                    label="Source Link"
                    placeholder="Select source link"
                    value={sourceLink}
                    onValueChange={setSourceLink}
                    disabled={!source}
                    options={sourceLinkOptions}
                  />

                  <SelectField
                    id="department"
                    label="Department"
                    placeholder="Select department"
                    options={[
                      { value: "quality", label: "Quality Assurance" },
                      { value: "regulatory", label: "Regulatory" },
                      { value: "operations", label: "Operations" },
                    ]}
                  />

                  <SelectField
                    id="qa-approver"
                    label="QA Approver"
                    placeholder="Select QA approver"
                    options={[
                      { value: "emily-zhang", label: "Emily Zhang" },
                      { value: "sarah-johnson", label: "Sarah Johnson" },
                    ]}
                  />

                  <SelectField
                    id="owner"
                    label="Owner"
                    placeholder="Select owner"
                    defaultValue="john-doe"
                    options={[
                      { value: "john-doe", label: "John Doe (Owner)" },
                      { value: "sarah-johnson", label: "Sarah Johnson" },
                    ]}
                  />

                  <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                    <RequiredLabel htmlFor="due-date">Due Date</RequiredLabel>
                    <DatePicker id="due-date" type="input" placeholder="Select due date" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-xl">Actions</CardTitle>
                  <span className="text-sm text-[var(--color-text-secondary)]">0 actions</span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    No actions added yet. Add one or more actions with a description, owner and due date. All fields are required for each action.
                  </p>
                  <Button variant="outline" className="w-fit">+ Add Action</Button>
                </CardContent>
              </Card>

              <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-component-sm)] pb-[var(--spacing-layout-md)]">
                <Button variant="ghost">Cancel</Button>
                <Button variant="outline">Save as Draft</Button>
                <Button>Submit</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
