"use client";

import { useSyncExternalStore } from "react";
import {
  seeds,
  contextSeeds,
  normalizeDocument,
  recordKey,
  type DemoDocument,
} from "./mock-data";

const storageKey = "accura-documents-demo-v1";
const initial = [...seeds, ...contextSeeds].map(normalizeDocument);
let snapshot = initial;
let hydrated = false;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!hydrated) {
    hydrated = true;
    window.addEventListener("storage", (event) => {
      if (event.key !== storageKey || !event.newValue) return;
      try {
        const saved = JSON.parse(event.newValue);
        if (
          Array.isArray(saved) &&
          saved.every(
            (d) =>
              typeof d.id === "string" &&
              Array.isArray(d.signatures) &&
              Array.isArray(d.activity)
          )
        ) {
          snapshot = saved.map(normalizeDocument);
          listeners.forEach((notify) => notify());
        }
      } catch {
        /* Leave current demo data intact. */
      }
    });
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (
        Array.isArray(saved) &&
        saved.every(
          (d) =>
            typeof d.id === "string" &&
            Array.isArray(d.activity) &&
            Array.isArray(d.signatures)
        )
      )
        snapshot = [
          ...saved.map(normalizeDocument),
          ...contextSeeds.filter(
            (sample) =>
              !saved.some(
                (d: DemoDocument) => recordKey(d) === recordKey(sample)
              )
          ),
        ];
    } catch {
      /* This isolated demo can continue in memory. */
    }
    listener();
  }
  return () => {
    listeners.delete(listener);
  };
}
export function useDocuments() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => initial
  );
}
export function saveDocument(doc: DemoDocument) {
  doc = normalizeDocument(doc);
  const key = recordKey(doc);
  snapshot = snapshot.some((d) => recordKey(d) === key)
    ? snapshot.map((d) => (recordKey(d) === key ? doc : d))
    : [doc, ...snapshot];
  // Supersession is atomic with approval; never overwrite another revision.
  if (doc.status === "Approved" && doc.lifecycle === "Current") {
    snapshot = snapshot.map((d) =>
      d.id === doc.id &&
      recordKey(d) !== key &&
      d.status === "Approved" &&
      d.lifecycle === "Current"
        ? {
            ...d,
            lifecycle: "Superseded",
            supersededBy: key,
            activity: [
              {
                text: `Superseded by ${doc.revision} on replacement approval`,
                name: "System",
                timestamp: doc.approvedAt || new Date().toISOString(),
              },
              ...d.activity,
            ],
          }
        : d
    );
  }
  try {
    localStorage.setItem(storageKey, JSON.stringify(snapshot));
  } catch {
    /* No production persistence is implied. */
  }
  listeners.forEach((listener) => listener());
}
