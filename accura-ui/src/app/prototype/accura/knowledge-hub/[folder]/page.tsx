"use client"

import * as React from "react"
import Link from "next/link"
import { notFound, useParams, useRouter } from "next/navigation"
import { ChevronLeft, FileText, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  RecordRowAction,
  RecordRowActionHeading,
} from "@/components/record-row-action"
import { ListSummary } from "../../list-summary"
import { useRowClick } from "../../row-click"
import {
  authorities,
  authorityBadge,
  basePath,
  formatDate,
  getFolder,
  resourceTypes,
  type Resource,
} from "../mock-data"

function ResourceRow({
  resource,
  href,
}: {
  resource: Resource
  href: string
}) {
  const router = useRouter()
  const onClick = useRowClick<HTMLTableRowElement>(() => router.push(href))

  return (
    <TableRow className="cursor-pointer" onClick={onClick}>
      <TableCell>
        <div className="flex min-w-0 items-center gap-[var(--spacing-component-sm)]">
          <FileText
            className="size-4 shrink-0 text-[var(--color-icon-muted)]"
            aria-hidden="true"
          />
          <Link
            href={href}
            className="min-w-0 truncate font-medium text-[var(--color-brand-primary)] hover:underline"
          >
            {resource.title}
          </Link>
          {resource.placeholder && (
            <Badge variant="dashed" shape="pill" size="sm">
              Sample
            </Badge>
          )}
        </div>
        <p className="mt-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">
          {resource.fileName}
        </p>
      </TableCell>

      <TableCell>{resource.resourceType}</TableCell>

      <TableCell>
        <Badge
          variant={authorityBadge(resource.authority)}
          shape="pill"
          size="md"
        >
          {resource.authority}
        </Badge>
      </TableCell>

      <TableCell className="text-[var(--color-text-secondary)]">
        {resource.reviewedAgainst ?? "—"}
      </TableCell>

      <TableCell className="whitespace-nowrap">
        {formatDate(resource.lastUpdated)}
      </TableCell>

      <RecordRowAction href={href} label={`Open ${resource.title}`} />
    </TableRow>
  )
}

export default function FolderContentsPage() {
  const { folder: folderSlug } = useParams<{ folder: string }>()
  const folder = getFolder(folderSlug)

  const [search, setSearch] = React.useState("")
  const [type, setType] = React.useState("All")
  const [authority, setAuthority] = React.useState("All")

  if (!folder) notFound()

  const query = search.trim().toLowerCase()
  const filtered = folder.resources.filter((resource) => {
    const matchesQuery =
      query === "" ||
      resource.title.toLowerCase().includes(query) ||
      resource.fileName.toLowerCase().includes(query) ||
      resource.summary.toLowerCase().includes(query)
    const matchesType = type === "All" || resource.resourceType === type
    const matchesAuthority =
      authority === "All" || resource.authority === authority

    return matchesQuery && matchesType && matchesAuthority
  })

  const isFiltered =
    query !== "" || type !== "All" || authority !== "All"

  function clearFilters() {
    setSearch("")
    setType("All")
    setAuthority("All")
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <Button
          asChild
          variant="link"
          className="h-auto w-fit p-0 text-sm no-underline hover:no-underline"
        >
          <Link href={basePath}>
            <ChevronLeft className="size-4" />
            Back to folders
          </Link>
        </Button>

        {/* heading/lg — 20px, the record-title step used on every detail page. */}
        <h1 className="text-xl font-semibold text-[var(--color-background-default-foreground)]">
          {folder.name}
          {folder.edition && (
            <span className="font-normal text-[var(--color-text-secondary)]">
              {" "}
              : {folder.edition}
            </span>
          )}
        </h1>
        <p className="max-w-[70ch] text-sm leading-normal text-[var(--color-text-secondary)]">
          {folder.description}
        </p>
      </div>

      {folder.resources.length === 0 ? (
        <Empty
          icon={<FileText />}
          title="No resources published yet"
          description="This folder is prepared but its content is still being written. Check back, or browse another folder."
          primaryAction={
            <Button asChild variant="outline">
              <Link href={basePath}>Back to folders</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex w-full flex-wrap items-center justify-between gap-[var(--spacing-component-sm)]">
            <div
              className="flex min-w-0 flex-1 flex-wrap items-center gap-[var(--spacing-component-sm)]"
              aria-label="Resource filters"
            >
              <div className="relative min-w-[240px] flex-1 sm:max-w-[380px]">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-icon-muted)]"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  aria-label="Search resources"
                  placeholder="Search by title or file name…"
                  className="pl-9"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="flex-none">
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-[160px]" aria-label="Type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All types</SelectItem>
                    {resourceTypes.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-none">
                <Select value={authority} onValueChange={setAuthority}>
                  <SelectTrigger className="w-[180px]" aria-label="Source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All sources</SelectItem>
                    {authorities.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[var(--spacing-component-sm)]">
            <ListSummary
              showing={filtered.length}
              total={folder.resources.length}
              noun="resources"
              onClear={isFiltered ? clearFilters : undefined}
            />

            {filtered.length === 0 ? (
              <Empty
                variant="background"
                icon={<Search />}
                title="No resources match your filters"
                description="Try a different search term, or clear the filters to see everything in this folder."
                primaryAction={
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                <Table className="min-w-[900px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">Title</TableHead>
                      <TableHead scope="col">Type</TableHead>
                      <TableHead scope="col">Source</TableHead>
                      <TableHead scope="col">Reviewed against</TableHead>
                      <TableHead scope="col">Last updated</TableHead>
                      <RecordRowActionHeading />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((resource) => (
                      <ResourceRow
                        key={resource.slug}
                        resource={resource}
                        href={`${basePath}/${folder.slug}/${resource.slug}`}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
