"use client"

import { useSyncExternalStore } from "react"

import { seeds, type DeviationRecord } from "./mock-data"

/* Session state for the deviation demo.
 *
 * Deliberately in memory only — no localStorage, unlike Documents. A reload
 * puts every record back to its seeded state, which is what a demo wants:
 * anyone can click Approve, Reject and Cancel through the whole lifecycle and
 * reset by refreshing, without a "reset demo" button that exists nowhere in
 * the real product. */

let snapshot: DeviationRecord[] = seeds
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useDeviations() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => seeds
  )
}

export function useDeviation(key: string) {
  return useDeviations().find((record) => record.key === key)
}

/** Replace one record and notify. Callers pass the already-transitioned record
 *  so the lifecycle rules stay in mock-data.ts rather than leaking in here. */
export function saveDeviation(record: DeviationRecord) {
  snapshot = snapshot.map((entry) => (entry.key === record.key ? record : entry))
  listeners.forEach((notify) => notify())
}

/** Every record, for the ID minter and the listing counts. */
export function allDeviations() {
  return snapshot
}
