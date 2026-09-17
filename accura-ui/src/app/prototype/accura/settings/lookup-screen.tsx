"use client"

import * as React from "react"
import { Plus, Search } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { LookupRow, LookupTab } from "./mock-data"
import { RowMenu } from "./row-menu"
import { ScreenHeading } from "./settings-shell"

type Draft = { name: string; abbreviation: string; description: string }
const emptyDraft: Draft = { name: "", abbreviation: "", description: "" }

/* One screen for all 14 lookup tables (§21.1). State is in-memory: a reload
   restores the spec's data, which is what a review build wants. */
export function LookupScreen({ tab }: { tab: LookupTab }) {
  const [items, setItems] = React.useState<LookupRow[]>(tab.rows)
  const [query, setQuery] = React.useState("")
  const [editing, setEditing] = React.useState<LookupRow | "new" | null>(null)
  const [deleting, setDeleting] = React.useState<LookupRow | null>(null)

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((row) =>
      [row.name, row.description, row.abbreviation ?? ""].some((v) => v.toLowerCase().includes(q))
    )
  }, [items, query])

  const save = (draft: Draft) => {
    const clean = {
      name: draft.name.trim(),
      description: draft.description.trim(),
      abbreviation: tab.withAbbreviation ? draft.abbreviation.trim().toUpperCase() : undefined,
    }
    if (editing === "new") {
      setItems((list) => [...list, { id: `new-${Date.now()}`, ...clean }])
    } else if (editing) {
      setItems((list) => list.map((row) => (row.id === editing.id ? { ...row, ...clean } : row)))
    }
    setEditing(null)
  }

  /* Ordered lookups (Low → Critical): order is meaning, so it is editable.
     Menu items rather than drag, so it works by keyboard. Prototype-only. */
  const move = (id: string, delta: number) =>
    setItems((list) => {
      const i = list.findIndex((r) => r.id === id)
      const j = i + delta
      if (j < 0 || j >= list.length) return list
      const next = [...list]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const cols = 3 + (tab.withAbbreviation ? 1 : 0) + (tab.ordered ? 1 : 0)

  return (
    <>
      <ScreenHeading
        heading={tab.heading}
        subtitle={tab.subtitle}
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" />
            Add {tab.entity}
          </Button>
        }
      />

      {(tab.searchable || items.length > 8) && (
        <div className="relative w-full sm:max-w-[380px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${tab.noun}...`}
            aria-label={`Search ${tab.noun}`}
            className="pl-9"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <Table>
          <TableHeader>
            <TableRow>
              {tab.ordered && <TableHead className="w-12">#</TableHead>}
              <TableHead className="w-[32%]">Name</TableHead>
              {tab.withAbbreviation && <TableHead>Abbreviation</TableHead>}
              <TableHead>Description</TableHead>
              <TableHead className="w-[1%] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row, index) => (
              <TableRow key={row.id}>
                {tab.ordered && <TableCell className="tabular-nums text-[var(--color-text-secondary)]">{index + 1}</TableCell>}
                <TableCell className="font-medium">{row.name}</TableCell>
                {tab.withAbbreviation && (
                  <TableCell>
                    <Badge variant="success" shape="pill" size="md">
                      {row.abbreviation}
                    </Badge>
                  </TableCell>
                )}
                <TableCell className="text-[var(--color-text-secondary)]">
                  {row.description || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <RowMenu
                      label={row.name}
                      items={[
                        { label: "Edit", onSelect: () => setEditing(row) },
                        ...(tab.ordered && !query
                          ? [
                              { label: "Move up", onSelect: () => move(row.id, -1), disabled: index === 0 },
                              { label: "Move down", onSelect: () => move(row.id, 1), disabled: index === visible.length - 1 },
                            ]
                          : []),
                        { label: "Delete", onSelect: () => setDeleting(row), destructive: true },
                      ]}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={cols} className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
                  {items.length === 0
                    ? `No ${tab.noun} yet. Add one to make it available in forms.`
                    : `No ${tab.noun} match this search.`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <LookupDialog
        key={editing === "new" ? "new" : editing?.id ?? "closed"}
        tab={tab}
        editing={editing}
        items={items}
        onCancel={() => setEditing(null)}
        onSave={save}
      />

      <DeleteDialog
        tab={tab}
        row={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={(row) => {
          setItems((list) => list.filter((r) => r.id !== row.id))
          setDeleting(null)
        }}
      />
    </>
  )
}

function LookupDialog({
  tab,
  editing,
  items,
  onCancel,
  onSave,
}: {
  tab: LookupTab
  editing: LookupRow | "new" | null
  items: LookupRow[]
  onCancel: () => void
  onSave: (draft: Draft) => void
}) {
  const isNew = editing === "new"
  const [draft, setDraft] = React.useState<Draft>(
    editing && editing !== "new"
      ? { name: editing.name, abbreviation: editing.abbreviation ?? "", description: editing.description }
      : emptyDraft
  )
  const [submitted, setSubmitted] = React.useState(false)

  const selfId = editing && editing !== "new" ? editing.id : null
  const others = items.filter((r) => r.id !== selfId)
  const nameError = !draft.name.trim()
    ? "Enter a name."
    : others.some((r) => r.name.toLowerCase() === draft.name.trim().toLowerCase())
      ? "This name already exists."
      : null
  const abbr = draft.abbreviation.trim().toUpperCase()
  const abbrError = !tab.withAbbreviation
    ? null
    : !abbr
      ? "Enter an abbreviation."
      : !/^[A-Z0-9]{2,6}$/.test(abbr)
        ? "Use 2–6 letters or numbers."
        : others.some((r) => r.abbreviation === abbr)
          ? "This abbreviation is already used by another document type."
          : null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (nameError || abbrError) return
    onSave(draft)
  }

  const verb = isNew ? "Add" : "Edit"
  const inUse = editing && editing !== "new" ? editing.inUse : undefined

  return (
    <Dialog open={editing !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <form onSubmit={submit} noValidate className="flex flex-col gap-[var(--spacing-component-lg)]">
          <DialogHeader>
            <DialogTitle>
              {verb} {tab.entity}
            </DialogTitle>
            <DialogDescription>
              {isNew
                ? `Adds a value to ${tab.heading}. It becomes selectable in forms straight away.`
                : inUse
                  ? `Used by ${inUse} records. Changes apply to those records and to future selections.`
                  : `Changes apply to future selections.`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="lookup-name" required state={submitted && nameError ? "invalid" : "default"}>
              Name
            </Label>
            <Input
              id="lookup-name"
              value={draft.name}
              autoFocus
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              aria-invalid={(submitted && !!nameError) || undefined}
              aria-describedby={submitted && nameError ? "lookup-name-error" : undefined}
            />
            {submitted && nameError && (
              <p id="lookup-name-error" className="text-xs text-[var(--color-text-invalid)]">{nameError}</p>
            )}
          </div>

          {tab.withAbbreviation && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="lookup-abbr" required state={submitted && abbrError ? "invalid" : "default"}>
                Abbreviation
              </Label>
              <Input
                id="lookup-abbr"
                value={draft.abbreviation}
                onChange={(e) => setDraft({ ...draft, abbreviation: e.target.value.toUpperCase() })}
                placeholder="e.g. SOP"
                aria-invalid={(submitted && !!abbrError) || undefined}
                aria-describedby="lookup-abbr-hint"
              />
              <p
                id="lookup-abbr-hint"
                className={`text-xs ${submitted && abbrError ? "text-[var(--color-text-invalid)]" : "text-[var(--color-text-secondary)]"}`}
              >
                {submitted && abbrError ? abbrError : "Unique. Used in the Document ID, e.g. ACME-SOP-2026-000001."}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="lookup-description">Description</Label>
            <Input
              id="lookup-description"
              value={draft.description}
              placeholder="Optional"
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{isNew ? `Add ${tab.entity}` : "Save changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* §7 delete guard: a referenced value cannot be deleted. The blocked state has
   one action — there is nothing to confirm. */
function DeleteDialog({
  tab,
  row,
  onCancel,
  onConfirm,
}: {
  tab: LookupTab
  row: LookupRow | null
  onCancel: () => void
  onConfirm: (row: LookupRow) => void
}) {
  const blocked = !!row?.inUse

  return (
    <AlertDialog open={row !== null} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        {row && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {blocked ? `Can't delete ${row.name}` : `Delete ${row.name}?`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {blocked
                  ? `${row.name} is used by ${row.inUse} active records. Reassign those records to another value, or close them, before deleting it.`
                  : `${row.name} will no longer be available in ${tab.heading}. This can't be undone.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {blocked ? (
                <AlertDialogCancel>Close</AlertDialogCancel>
              ) : (
                <>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={() => onConfirm(row)}>
                    Delete
                  </AlertDialogAction>
                </>
              )}
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
