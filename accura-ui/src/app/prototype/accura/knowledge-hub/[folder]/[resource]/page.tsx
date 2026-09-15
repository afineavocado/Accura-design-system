"use client"

import * as React from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { ChevronLeft, Download, FileText, Info } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RecordDetailLayout } from "@/components/record-workflow"
import {
  authorityBadge,
  basePath,
  canUseAsTemplate,
  formatDate,
  getResource,
} from "../../mock-data"

/* Resource detail.
 *
 * Reuses RecordDetailLayout at 70/30 so this screen sits at the same rhythm as
 * Document and CAPA detail. Preview earns the wide column: it needs the width.
 * Metadata is a single-column label/value list, so it reads fine in the rail.
 *
 * No stepper — a reference resource has no workflow — and no bottom task bar,
 * because there is no multi-step task to complete. The primary action sits
 * beside the record title, once. */

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium uppercase text-[var(--color-text-secondary)]">
        {label}
      </div>
      <div className="mt-[var(--spacing-component-xs)] text-sm leading-normal text-[var(--color-surface-overlay-foreground)]">
        {value}
      </div>
    </div>
  )
}

export default function ResourceDetailPage() {
  const { folder: folderSlug, resource: resourceSlug } = useParams<{
    folder: string
    resource: string
  }>()

  const found = getResource(folderSlug, resourceSlug)
  if (!found) notFound()

  const { folder, resource } = found
  const adaptable = canUseAsTemplate(resource)

  return (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div className="flex flex-col gap-[var(--spacing-component-md)] sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-[var(--spacing-component-sm)]">
          <Button
            asChild
            variant="link"
            className="h-auto w-fit p-0 text-sm no-underline hover:no-underline"
          >
            <Link href={`${basePath}/${folder.slug}`}>
              <ChevronLeft className="size-4" />
              Back to {folder.name}
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-[var(--spacing-component-sm)]">
            <h1 className="text-xl font-semibold text-[var(--color-background-default-foreground)]">
              {resource.title}
            </h1>
            <Badge
              variant={authorityBadge(resource.authority)}
              shape="pill"
              size="md"
            >
              {resource.authority}
            </Badge>
            {resource.placeholder && (
              <Badge variant="dashed" shape="pill" size="md">
                Sample
              </Badge>
            )}
          </div>

          <p className="text-sm text-[var(--color-text-secondary)]">
            {resource.fileName}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-[var(--spacing-component-sm)] self-start sm:self-auto">
          <Button variant="outline">
            <Download className="size-4" />
            Download
          </Button>
          {adaptable && <Button>Use as template</Button>}
        </div>
      </div>

      <RecordDetailLayout
        ratio="70/30"
        progress={null}
        main={
          <>
            {resource.placeholder && (
              <Alert variant="warning">
                <Info className="size-4" />
                <AlertTitle>Sample content</AlertTitle>
                <AlertDescription>
                  This is placeholder material for the prototype. Replace it
                  before anyone relies on it.
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
                <div className="flex min-h-[420px] flex-col items-center justify-center gap-[var(--spacing-component-md)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] p-[var(--spacing-component-xl)] text-center">
                  <FileText
                    className="size-8 text-[var(--color-icon-muted)]"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-[var(--color-surface-muted-foreground)]">
                    {resource.fileType} preview
                  </p>
                  <p className="max-w-[46ch] text-sm leading-normal text-[var(--color-text-secondary)]">
                    {resource.summary}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        }
        audit={
          <>
            <Card>
              <CardHeader>
                <CardTitle>Resource details</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="gap-[var(--spacing-component-lg)]">
                <Field label="Type" value={resource.resourceType} />
                <Field label="Source" value={resource.authority} />
                <Field label="File type" value={resource.fileType} />
                <Field
                  label="Reviewed against"
                  value={resource.reviewedAgainst ?? "Not applicable"}
                />
                <Field
                  label="Last updated"
                  value={formatDate(resource.lastUpdated)}
                />
                <Field
                  label="Folder"
                  value={
                    <Link
                      href={`${basePath}/${folder.slug}`}
                      className="text-[var(--color-brand-primary)] hover:underline"
                    >
                      {folder.name}
                      {folder.edition ? ` : ${folder.edition}` : ""}
                    </Link>
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Using this resource</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
                <p className="text-sm leading-normal text-[var(--color-text-secondary)]">
                  {adaptable
                    ? "Use as template creates a new Draft in Documents and records where it came from, so the origin stays traceable at audit."
                    : "This is published by an external body and kept under its own licence. It can be read and downloaded, but not adapted into a controlled document."}
                </p>
              </CardContent>
            </Card>
          </>
        }
      />
    </div>
  )
}
