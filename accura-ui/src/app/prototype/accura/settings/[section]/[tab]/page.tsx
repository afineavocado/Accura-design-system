"use client"

import { useParams } from "next/navigation"

import { settingsSections } from "../../mock-data"
import { SettingsShell } from "../../settings-shell"
import { LookupScreen } from "../../lookup-screen"
import { PreferencesScreen, RecordNumberingScreen } from "../../form-screens"
import { RolesScreen, UsersScreen } from "../../users-screens"

export default function SettingsTabPage() {
  const { section: sectionSlug, tab: tabSlug } = useParams<{ section: string; tab: string }>()
  const section = settingsSections.find((s) => s.slug === sectionSlug)
  const tab = section?.tabs.find((t) => t.slug === tabSlug)

  if (!section || !tab) {
    return (
      <SettingsShell>
        <p className="text-sm text-[var(--color-text-secondary)]">
          This settings screen is not part of the prototype.
        </p>
      </SettingsShell>
    )
  }

  return (
    <SettingsShell>
      {tab.kind === "lookup" && <LookupScreen key={tab.heading} tab={tab} />}
      {tab.kind === "record-numbering" && <RecordNumberingScreen tab={tab} />}
      {tab.kind === "preferences" && <PreferencesScreen tab={tab} />}
      {tab.kind === "users" && <UsersScreen tab={tab} />}
      {tab.kind === "roles" && <RolesScreen tab={tab} />}
    </SettingsShell>
  )
}
