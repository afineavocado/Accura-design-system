"use client"

import Link from "next/link"
import { Folder as FolderIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  basePath,
  folderGroups,
  folders,
  formatDate,
  type Folder,
} from "./mock-data"

/* Folder index.
 *
 * No toolbar here on purpose. Knowledge Hub sits in the footer navigation — it
 * is a reference utility, not a workflow module — and seven curated folders do
 * not need search. The toolbar appears one level down, where files accumulate.
 *
 * Cards rather than the usual table is a deliberate deviation from "default to a
 * table": this is a curated seven-item entry point, and the card carries a
 * description and two counts, not a bare label. Revisit if the set grows. */

function FolderCard({ folder }: { folder: Folder }) {
  const count = folder.resources.length

  return (
    <Link
      href={`${basePath}/${folder.slug}`}
      className="group rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
    >
      <Card className="h-full gap-[var(--spacing-component-md)] transition-colors group-hover:border-[var(--color-brand-primary)]">
        <CardHeader className="flex-row items-center gap-[var(--spacing-component-md)]">
          <FolderIcon
            className="size-5 shrink-0 text-[var(--color-brand-primary)]"
            aria-hidden="true"
          />
          <CardTitle className="min-w-0 truncate">
            {folder.name}
            {folder.edition && (
              <span className="font-normal text-[var(--color-text-secondary)]">
                {" "}
                : {folder.edition}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="gap-[var(--spacing-component-md)]">
          <p className="text-sm leading-normal text-[var(--color-text-secondary)]">
            {folder.description}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {count} {count === 1 ? "resource" : "resources"}
            <span aria-hidden="true"> · </span>
            Reviewed {formatDate(folder.lastReviewed)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function KnowledgeHubIndexPage() {
  return (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <p className="max-w-[70ch] text-sm leading-normal text-[var(--color-text-secondary)]">
        Templates, checklists and guides you can reuse. Select a folder to view
        its files. Downloading a resource does not add it to your quality
        system: use it as the starting point for a controlled document.
      </p>

      {folderGroups.map((group) => {
        const inGroup = folders.filter((folder) => folder.group === group)
        if (inGroup.length === 0) return null

        return (
          <section
            key={group}
            aria-label={group}
            className="flex flex-col gap-[var(--spacing-component-md)]"
          >
            <div className="flex items-center gap-[var(--spacing-component-md)]">
              <h2 className="font-sans text-xs font-medium uppercase text-[var(--color-text-secondary)]">
                {group}
              </h2>
              <Separator className="flex-1" />
            </div>

            <div className="grid gap-[var(--spacing-component-lg)] sm:grid-cols-2 xl:grid-cols-3">
              {inGroup.map((folder) => (
                <FolderCard key={folder.slug} folder={folder} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
