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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ListEmptySearch } from "../list-empty-state"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { globalRoles, initialUsers, moduleRoles, type FormTab, type SettingsUser } from "./mock-data"
import { RowMenu } from "./row-menu"
import { ScreenHeading } from "./settings-shell"

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-")

/* §19 */
export function UsersScreen({ tab }: { tab: FormTab }) {
  const [users, setUsers] = React.useState(initialUsers)
  const [editing, setEditing] = React.useState<SettingsUser | "new" | null>(null)
  const [deleting, setDeleting] = React.useState<SettingsUser | null>(null)
  const [query, setQuery] = React.useState("")
  const q = query.trim().toLowerCase()
  const visible = q ? users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q)) : users

  return (
    <>
      <ScreenHeading
        heading={tab.heading}
        subtitle={tab.subtitle}
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" />
            Invite user
          </Button>
        }
      />

      <div className="relative w-full sm:max-w-[380px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
        <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email..." aria-label="Search users" className="pl-9" />
      </div>

      {visible.length === 0 ? (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
          <ListEmptySearch noun="users" onClear={() => setQuery("")} />
        </div>
      ) : (
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[1%]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((user) => {
              const roles = [...user.globalRoles, ...user.moduleRoles]
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-[var(--spacing-component-xs)]">
                      {roles.map((r) => (
                        <Badge key={r} variant={user.globalRoles.includes(r) ? "success" : "outline"} shape="pill" size="md">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "success" : "warning"} shape="pill" size="md">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <RowMenu
                        label={user.name}
                        items={[
                          { label: "Edit roles", onSelect: () => setEditing(user) },
                          ...(user.status === "Invited" ? [{ label: "Resend invite", onSelect: () => {} }] : []),
                          { label: "Remove user", onSelect: () => setDeleting(user), destructive: true },
                        ]}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      )}

      <UserDialog
        key={editing === "new" ? "new" : editing?.id ?? "closed"}
        editing={editing}
        users={users}
        onCancel={() => setEditing(null)}
        onSave={(user) => {
          setUsers((list) => (editing === "new" ? [...list, user] : list.map((u) => (u.id === user.id ? user : u))))
          setEditing(null)
        }}
      />

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will lose access to Accura One. Records they created or signed keep their name in the Audit Trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setUsers((list) => list.filter((u) => u.id !== deleting?.id))
                setDeleting(null)
              }}
            >
              Remove user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

/* §19.2 — module roles as Checkbox groups (spec shows pill toggles; no toggle
   component exists in the design system — audit C3). */
function UserDialog({
  editing,
  users,
  onCancel,
  onSave,
}: {
  editing: SettingsUser | "new" | null
  users: SettingsUser[]
  onCancel: () => void
  onSave: (user: SettingsUser) => void
}) {
  const base = editing && editing !== "new" ? editing : null
  const [name, setName] = React.useState(base?.name ?? "")
  const [email, setEmail] = React.useState(base?.email ?? "")
  const [mods, setMods] = React.useState<string[]>(base?.moduleRoles ?? [])
  const [globals, setGlobals] = React.useState<string[]>(base?.globalRoles ?? [])
  const [submitted, setSubmitted] = React.useState(false)

  const toggle = (list: string[], set: (v: string[]) => void, key: string, on: boolean) =>
    set(on ? [...list, key] : list.filter((k) => k !== key))

  const nameError = !name.trim() ? "Enter a name." : null
  const emailError = !email.trim()
    ? "Enter an email address."
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? "Enter a valid email address."
      : users.some((u) => u.id !== base?.id && u.email.toLowerCase() === email.trim().toLowerCase())
        ? "A user with this email already exists."
        : null
  const rolesError = mods.length + globals.length === 0 ? "Assign at least one role." : null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (nameError || emailError || rolesError) return
    onSave({
      id: base?.id ?? `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      // Keep the spec's module order regardless of click order.
      moduleRoles: moduleRoles.flatMap((m) => m.roles.map((r) => `${m.module}: ${r}`)).filter((k) => mods.includes(k)),
      globalRoles: globalRoles.map((g) => g.role).filter((r) => globals.includes(r)),
      status: base?.status ?? "Invited",
    })
  }

  const err = (msg: string | null, id: string) =>
    submitted && msg ? (
      <p id={id} className="text-xs text-[var(--color-text-invalid)]">
        {msg}
      </p>
    ) : null

  return (
    <Dialog open={editing !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={submit} noValidate className="flex flex-col gap-[var(--spacing-component-lg)]">
          <DialogHeader>
            <DialogTitle>{base ? "Edit user" : "Invite user"}</DialogTitle>
            <DialogDescription>A user can hold different roles in different modules.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-[var(--spacing-component-lg)] sm:grid-cols-2">
            <div className="flex flex-col gap-[var(--spacing-component-sm)]">
              <Label htmlFor="user-name" required state={submitted && nameError ? "invalid" : "default"}>
                Name
              </Label>
              <Input id="user-name" value={name} autoFocus onChange={(e) => setName(e.target.value)} aria-invalid={(submitted && !!nameError) || undefined} aria-describedby="user-name-error" />
              {err(nameError, "user-name-error")}
            </div>
            <div className="flex flex-col gap-[var(--spacing-component-sm)]">
              <Label htmlFor="user-email" required state={submitted && emailError ? "invalid" : "default"}>
                Email
              </Label>
              <Input id="user-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={(submitted && !!emailError) || undefined} aria-describedby="user-email-error" />
              {err(emailError, "user-email-error")}
            </div>
          </div>

          <fieldset className="flex flex-col gap-[var(--spacing-component-md)]">
            <legend className="mb-[var(--spacing-component-md)] text-sm font-semibold text-[var(--color-background-default-foreground)]">Module roles</legend>
            {moduleRoles.map((m) => (
              <div key={m.module} className="flex flex-col gap-[var(--spacing-component-sm)] border-t border-[var(--color-border-default)] pt-[var(--spacing-component-md)] sm:flex-row sm:gap-4">
                <span className="text-sm font-medium text-[var(--color-text-secondary)] sm:w-32 sm:shrink-0">{m.module}</span>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {m.roles.map((r) => {
                    const key = `${m.module}: ${r}`
                    const id = `role-${slug(key)}`
                    return (
                      <div key={key} className="flex items-center gap-[var(--spacing-component-sm)]">
                        <Checkbox id={id} checked={mods.includes(key)} onCheckedChange={(v) => toggle(mods, setMods, key, v === true)} />
                        <Label htmlFor={id} className="font-normal">
                          {r}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </fieldset>

          <fieldset className="flex flex-col gap-[var(--spacing-component-md)]">
            <legend className="mb-[var(--spacing-component-md)] text-sm font-semibold text-[var(--color-background-default-foreground)]">Global roles</legend>
            {globalRoles.map((g) => {
              const id = `global-${slug(g.role)}`
              return (
                <div key={g.role} className="flex items-start gap-[var(--spacing-component-sm)]">
                  <Checkbox id={id} className="mt-0.5" checked={globals.includes(g.role)} onCheckedChange={(v) => toggle(globals, setGlobals, g.role, v === true)} aria-describedby={`${id}-desc`} />
                  <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                    <Label htmlFor={id}>{g.role}</Label>
                    <p id={`${id}-desc`} className="text-xs text-[var(--color-text-secondary)]">
                      {g.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </fieldset>
          {err(rolesError, "user-roles-error")}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{base ? "Save changes" : "Send invite"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* §20 — read-only. No add/edit/delete controls by design. */
export function RolesScreen({ tab }: { tab: FormTab }) {
  return (
    <>
      <ScreenHeading heading={tab.heading} subtitle={tab.subtitle} />
      <Card>
        <CardHeader>
          <CardTitle>Module roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Module</TableHead>
                  <TableHead>Roles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moduleRoles.map((m) => (
                  <TableRow key={m.module}>
                    <TableCell className="font-medium">{m.module}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-[var(--spacing-component-sm)]">
                        {m.roles.map((r) => (
                          <Badge key={r} variant="success" shape="pill" size="md">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Global roles</CardTitle>
          <CardDescription>Cross-cutting roles that apply across all modules.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-[var(--spacing-component-lg)] md:grid-cols-3">
          {globalRoles.map((g) => (
            <div key={g.role} className="flex flex-col gap-[var(--spacing-component-xs)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-[var(--spacing-component-lg)]">
              <span className="text-sm font-semibold text-[var(--color-surface-overlay-foreground)]">{g.role}</span>
              <span className="text-sm text-[var(--color-text-secondary)]">{g.description}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
