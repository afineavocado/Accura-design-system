# Documents

The spec for this module is **`flow/documents-spec.md`** at the repository root. Route:
`/prototype/accura/documents` on `:3001`.

Three documents used to sit in this folder — this README at 55 lines, `FUNCTIONAL-SPEC-MAPPING.md`
and `TRAINING-MAPPING.md`. They were folded into that spec and deleted on 2026-09-18, because three
of their facts had gone stale against the code: all three described a 65:35 detail layout where
`document-detail.tsx` renders 70/30, and all three pointed at `docs/demo-design-contract.md`, which
no longer exists.

What they carried is in the spec: the functional-spec trace in §7, the deliberate differences from
the house patterns in §4.1, storage in §2. Recover the originals with
`git show HEAD~1 -- accura-ui/src/app/prototype/accura/documents/`.
