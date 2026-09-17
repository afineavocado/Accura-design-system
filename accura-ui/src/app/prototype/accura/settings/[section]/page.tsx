import { notFound, redirect } from "next/navigation"

import { settingsHref, settingsSections } from "../mock-data"

/* A section URL lands on its first tab (§1 card interaction). */
export default async function SettingsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const match = settingsSections.find((s) => s.slug === section)
  if (!match) notFound()
  redirect(settingsHref(match.slug, match.tabs[0].slug))
}
