import { redirect } from "next/navigation"

import { settingsHref, settingsSections } from "./mock-data"

/* Settings opens on the first section's first tab. */
export default function SettingsIndexPage() {
  const first = settingsSections[0]
  redirect(settingsHref(first.slug, first.tabs[0].slug))
}
