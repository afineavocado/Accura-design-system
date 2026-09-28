import catalogJson from "./catalog.json"

/* Types for catalog.json, which build-catalog.mjs generates. The JSON is the
   source; these only describe it for the page. */

export type ItemType = "layout" | "template" | "pattern" | "component"
export type Status = "draft" | "in-review" | "stable" | "deprecated"
export type Step = "done" | "inherited" | "no" | "n/a"

export type CatalogStory = {
  export: string
  name: string
  storybookId: string | null
}

export type CatalogItem = {
  id: string
  type: ItemType
  layer: "shell" | "local"
  name: string
  description: string
  status: Status
  note?: string
  category?: string
  pipeline?: { tokens: Step; storyWritten: Step; storyVerified: Step } | null
  files: string[]
  exports?: string[]
  import?: string
  props?: { prop: string; values: string[]; default: string }[]
  stories?: CatalogStory[]
  uses?: string[]
  usedIn: string[]
  doc?: string
  preview?: string
  examples?: string[]
  meta?: string
}

export const catalog = catalogJson as unknown as {
  idFormat: string
  statuses: Record<Status, string>
  counts: Record<ItemType, number>
  items: CatalogItem[]
}

export const typeLabels: Record<ItemType, string> = {
  layout: "Layouts",
  template: "Templates",
  pattern: "Patterns",
  component: "Components",
}

export const statusLabels: Record<Status, string> = {
  draft: "Draft",
  "in-review": "In review",
  stable: "Stable",
  deprecated: "Deprecated",
}

export const moduleLabels: Record<string, string> = {
  dashboard: "Dashboard",
  capa: "CAPA",
  "change-control": "Change Control",
  deviations: "Deviations",
  documents: "Documents",
  "knowledge-hub": "Knowledge Hub",
  settings: "Settings",
  training: "Training",
}

/* `agt-cmp-badge` plus the chosen story, `agt-cmp-badge#success`. The Default
   story is the item itself, so it adds nothing. */
export function copyId(item: CatalogItem, storyExport?: string) {
  if (!storyExport || storyExport === "Default") return item.id
  const slug = storyExport
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
  return `${item.id}#${slug}`
}
