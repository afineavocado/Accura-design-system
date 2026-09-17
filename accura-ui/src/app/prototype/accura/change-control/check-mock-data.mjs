/**
 * Does the Change Control mock data hold together?
 *
 *   node src/app/prototype/accura/change-control/check-mock-data.mjs
 *
 * Seed data is the only thing a prototype can be wrong about silently: a screen
 * renders whatever it is given, so a record that could not exist in the real
 * process still looks convincing. Every rule below is a sentence from the brief
 * turned into a question the data has to answer.
 *
 * The brief, in six steps:
 *   1. The initiator creates the record, assigns a Change Owner, describes the
 *      change, with an optional risk assessment.
 *   2. All departments are notified. Each either declares not impacted with an
 *      explanation, or completes an impact analysis and lists the actions it
 *      will take.
 *   3. Once every department has submitted, QA reviews the whole record,
 *      including all department actions, and approves it.
 *   4. Action owners complete their actions outside the system, upload evidence
 *      and mark them done.
 *   5. When all actions are closed the Change Owner reviews, approves and signs.
 *   6. QA performs the final approval and the record is closed.
 */
import {
  changeControlStatuses,
  initialChangeControlRecords,
} from "./mock-data.ts"

const problems = []
const notes = []
const fail = (id, msg) => problems.push(`${id}: ${msg}`)
const note = (id, msg) => notes.push(`${id}: ${msg}`)

const order = new Map(changeControlStatuses.map((s, i) => [s, i]))
const atOrAfter = (status, target) =>
  (order.get(status) ?? 0) >= (order.get(target) ?? 0)

/* Every status needs a record, or a screen has no way to be seen. */
for (const status of changeControlStatuses) {
  if (!initialChangeControlRecords.some((r) => r.status === status))
    fail("coverage", `no seed record is in "${status}"`)
}

const seenIds = new Set()
const seenActionIds = new Set()

for (const record of initialChangeControlRecords) {
  const id = record.id

  // ── identity ──────────────────────────────────────────────────────────────
  if (seenIds.has(id)) fail(id, "duplicate record id")
  seenIds.add(id)
  if (!/^CC-\d{4}-\d{3}$/.test(id)) fail(id, `id does not match CC-YYYY-NNN`)
  for (const field of ["title", "owner", "dateRaised", "targetImplementationDate"])
    if (!record[field]) fail(id, `missing ${field}`)

  // ── step 1: the initiator's own fields ────────────────────────────────────
  // Past Draft these must exist: the record was submitted, so it was filled in.
  if (record.status !== "Draft") {
    for (const field of ["raisedBy", "department", "type", "classification", "category", "description"])
      if (!record[field]) fail(id, `${record.status} but no ${field} — step 1 says the initiator describes the change before submitting`)
    if (!record.riskAssessment) note(id, "no risk assessment (optional per step 1)")
  }

  const assessments = record.departmentAssessments ?? []
  const actions = record.changeActions ?? []
  const trail = record.auditTrail ?? []

  // ── step 2: every affected department declares ────────────────────────────
  if (record.status === "Draft") {
    if (assessments.length)
      fail(id, "Draft carries department assessments — departments are only notified on submission")
    if (actions.length) fail(id, "Draft carries change actions")
  } else {
    const roster = assessments.map((a) => a.department)
    for (const dept of record.affectedDepartments)
      if (!roster.includes(dept))
        fail(id, `"${dept}" is affected but has no assessment row`)
    for (const dept of roster)
      if (!record.affectedDepartments.includes(dept))
        fail(id, `assessment for "${dept}", which is not in affectedDepartments`)
  }

  for (const a of assessments) {
    if (a.impacted && a.status === "Not Impacted")
      fail(id, `${a.department}: impacted=true but status "Not Impacted"`)
    if (!a.impacted && a.status === "Impacted")
      fail(id, `${a.department}: impacted=false but status "Impacted"`)
    if (a.status === "Signed" || a.status === "Impacted") {
      if (a.impacted && !a.impactSummary)
        fail(id, `${a.department}: declared impacted with no impact summary — step 2`)
      if (!a.signer) fail(id, `${a.department}: declared but no signer`)
    }
    if (a.status === "Not Impacted" && !a.reason)
      fail(id, `${a.department}: not impacted with no explanation — step 2 requires one`)
  }

  // Past Impact Assessment nothing may still be Pending: step 3 starts only
  // "once all departments have submitted their input".
  if (atOrAfter(record.status, "QA Approval")) {
    const pending = assessments.filter((a) => a.status === "Pending")
    if (pending.length)
      fail(id, `${record.status} but ${pending.map((a) => a.department).join(", ")} still Pending — QA is notified only once every department has submitted`)

    for (const a of assessments) {
      if (!a.impacted) continue
      const owned = actions.filter(
        (x) => x.department === a.department || (!x.department && assessments.length === 1)
      )
      if (!owned.length)
        fail(id, `${a.department} is impacted but owns no action — step 2 says an impacted department lists the actions it will take`)
    }
  }

  // ── actions ───────────────────────────────────────────────────────────────
  for (const action of actions) {
    const key = `${id}/${action.id}`
    if (seenActionIds.has(key)) fail(id, `duplicate action id ${action.id}`)
    seenActionIds.add(key)
    if (!/^A-\d+$/.test(action.id)) fail(id, `action id "${action.id}" does not match A-NNN`)
    if (!action.owner) fail(id, `${action.id}: no owner`)
    if (!action.dueDate) fail(id, `${action.id}: no due date`)
    if (action.department && !record.affectedDepartments.includes(action.department))
      fail(id, `${action.id}: department "${action.department}" is not affected by this record`)

    // step 4: done means evidence uploaded, and the two evidence fields agree
    if (action.status === "Done") {
      if (!action.evidenceFiles?.length)
        fail(id, `${action.id} is Done with no evidence — step 4 says owners upload evidence, then mark done`)
      if (action.evidenceStatus !== "Attached")
        fail(id, `${action.id} is Done but evidenceStatus is "${action.evidenceStatus}"`)
      if (!action.completedAt) fail(id, `${action.id} is Done with no completedAt`)
    } else if (action.completedAt) {
      fail(id, `${action.id} has completedAt but status "${action.status}"`)
    }
    if (action.evidenceStatus === "Attached" && !action.evidenceFiles?.length)
      fail(id, `${action.id}: evidenceStatus Attached with no files`)
  }

  // step 5: the Change Owner is notified "when all actions are closed"
  if (atOrAfter(record.status, "Pending Closure") && actions.length) {
    const open = actions.filter((a) => a.status !== "Done")
    if (open.length)
      fail(id, `${record.status} but ${open.map((a) => a.id).join(", ")} not Done — closure starts only when every action is closed`)
  }

  // ── audit trail ───────────────────────────────────────────────────────────
  if (record.status !== "Draft" && !trail.length)
    fail(id, "no audit trail on a record that has moved")

  let previous = null
  for (const entry of [...trail].reverse()) {
    if (!entry.actor) fail(id, `audit entry "${entry.action}" has no actor`)
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(entry.timestamp))
      fail(id, `audit timestamp "${entry.timestamp}" is not ISO 8601 UTC`)
    else if (previous && entry.timestamp < previous)
      fail(id, `audit trail runs backwards at "${entry.action}" (${entry.timestamp} after ${previous})`)
    else previous = entry.timestamp

    if (entry.to && !order.has(entry.to)) fail(id, `audit entry moves to unknown status "${entry.to}"`)
    if (entry.from && !order.has(entry.from)) fail(id, `audit entry moves from unknown status "${entry.from}"`)
  }

  const landed = [...trail].reverse().filter((e) => e.to).at(-1)?.to
  if (trail.length && landed && landed !== record.status)
    fail(id, `status is "${record.status}" but the last transition in the trail lands on "${landed}"`)
}

/* An inventory, not a rule: how much of each screen every record can actually
   exercise. A status with a record that carries nothing still renders an empty
   screen. */
const pad = (v, n) => String(v).padEnd(n)
console.log("")
console.log(`  ${pad("record", 12)}${pad("status", 21)}${pad("depts", 7)}${pad("declared", 10)}${pad("actions", 20)}${pad("files", 7)}${pad("comments", 10)}audit`)
for (const r of initialChangeControlRecords) {
  const a = r.departmentAssessments ?? []
  const declared = a.filter((x) => x.status !== "Pending").length
  const acts = r.changeActions ?? []
  const byStatus = ["Open", "In Progress", "Done"]
    .map((s) => `${acts.filter((x) => x.status === s).length}${s[0]}`)
    .join(" ")
  const files = acts.reduce((n, x) => n + (x.evidenceFiles?.length ?? 0), 0)
  const comments = acts.reduce((n, x) => n + (x.comments?.length ?? 0), 0)
  console.log(
    `  ${pad(r.id, 12)}${pad(r.status, 21)}${pad(r.affectedDepartments.length, 7)}${pad(`${declared}/${a.length}`, 10)}${pad(`${acts.length}  (${byStatus})`, 20)}${pad(files, 7)}${pad(comments, 10)}${(r.auditTrail ?? []).length}`
  )
}

const label = problems.length ? "❌" : "✅"
console.log(`\nChange Control mock data — ${initialChangeControlRecords.length} records, ${changeControlStatuses.length} statuses\n`)
if (notes.length) {
  console.log("  Notes (allowed, but worth knowing):")
  notes.forEach((n) => console.log(`    · ${n}`))
  console.log("")
}
console.log(`  ${label} ${problems.length} problem(s)`)
problems.forEach((p) => console.log(`    ✗ ${p}`))
process.exit(problems.length ? 1 : 0)
