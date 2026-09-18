import {
  initialChangeControlRecords,
  type ChangeControlRecord,
} from "./mock-data"

/* Session storage for the Change Control demo.
 *
 * One rule, and everything here exists to enforce it:
 *
 *   **A seeded record always comes from the seeds. It is never read back from
 *   localStorage, and it is never written to localStorage.**
 *
 * Why. `localStorage` used to be merged ahead of the seeds by id, so a stored
 * copy of a seeded record shadowed the seed permanently, per browser, with no
 * way back. On 2026-09-18 that hid CC-2026-003 — the only Draft in the set —
 * for one person while everyone else saw it, which is the same class of defect
 * as the tombstone list removed on 2026-09-17 and the reason this file exists.
 *
 * What it costs. Editing a seeded record still works for the whole session,
 * because the pages hold the edited record in React state — but it does not
 * survive a reload. That is deliberate, it matches what Deviations already
 * does, and it is what "seeds always win" means: refreshing is how you reset
 * the demo, and there is no reset button to build.
 *
 * Records you *create* are not seeded, so they persist as they always did. */

export const storedRecordsKey = "accura-change-control-records"

const seededIds = new Set(initialChangeControlRecords.map((record) => record.id))

/** True for the seven records in `mock-data.ts`, false for anything created here. */
export function isSeededRecord(id: string) {
  return seededIds.has(id)
}

/* Reading also heals: a browser that stored a seeded record before this rule
   existed still holds it, and dropping it on read is what un-hides the seed
   without asking anyone to clear their storage by hand. */
export function readStoredRecords(): ChangeControlRecord[] {
  if (typeof window === "undefined") return []

  let parsed: unknown
  try {
    parsed = JSON.parse(window.localStorage.getItem(storedRecordsKey) ?? "[]")
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []

  const records = parsed as ChangeControlRecord[]
  const kept = records.filter((record) => !isSeededRecord(record.id))
  if (kept.length !== records.length) {
    try {
      window.localStorage.setItem(storedRecordsKey, JSON.stringify(kept))
    } catch {
      /* Storage full or blocked. The filtered list is still what we return, so
         the seed shows correctly this session and healing retries next load. */
    }
  }
  return kept
}

/** Persists a created record. A seeded id is kept in memory and not written —
 *  the returned list is what the caller should put in state. */
export function writeStoredRecord(
  record: ChangeControlRecord
): ChangeControlRecord[] {
  const records = readStoredRecords()
  const next = [record, ...records.filter((item) => item.id !== record.id)]

  if (typeof window !== "undefined" && !isSeededRecord(record.id)) {
    try {
      window.localStorage.setItem(storedRecordsKey, JSON.stringify(next))
    } catch {
      /* Nothing to do — the caller still gets the updated list for this session. */
    }
  }
  return next
}

/** Created records first, then the seeds. `stored` comes back from
 *  `readStoredRecords()` already healed, so on load it holds no seeded ids and
 *  every seed renders as written. Within a session it may hold an edited seed,
 *  and that copy wins here — which is what makes an edit visible in the list
 *  until the page is reloaded. */
export function mergeWithSeeds(
  stored: ChangeControlRecord[]
): ChangeControlRecord[] {
  const storedIds = new Set(stored.map((record) => record.id))
  return [
    ...stored,
    ...initialChangeControlRecords.filter((record) => !storedIds.has(record.id)),
  ]
}

/** One record by id. A seeded id resolves to the seed unless this session has
 *  already changed it — in-session edits still show; they just do not persist. */
export function resolveRecord(
  stored: ChangeControlRecord[],
  id: string
): ChangeControlRecord | null {
  return (
    stored.find((record) => record.id === id) ??
    initialChangeControlRecords.find((record) => record.id === id) ??
    null
  )
}
