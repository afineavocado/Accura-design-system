"use client";

import { useSyncExternalStore } from "react";
import { seeds, type DemoDocument } from "./mock-data";

const storageKey = "accura-documents-demo-v1";
let snapshot = seeds;
let hydrated = false;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!hydrated) {
    hydrated = true;
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
        snapshot = saved;
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
    () => seeds
  );
}
export function saveDocument(doc: DemoDocument) {
  snapshot = snapshot.some((d) => d.id === doc.id)
    ? snapshot.map((d) => (d.id === doc.id ? doc : d))
    : [doc, ...snapshot];
  try {
    localStorage.setItem(storageKey, JSON.stringify(snapshot));
  } catch {
    /* No production persistence is implied. */
  }
  listeners.forEach((listener) => listener());
}
