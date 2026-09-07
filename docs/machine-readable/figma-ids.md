# Figma IDs

> # ⚠️ WRONG FILE — these are AGENTIC's IDs, not Accura's
>
> | | |
> |---|---|
> | File key below | `YWfTOUTpFZ0BNxHobfUqme` — **Agentic**, a different file |
> | **Accura's file** | **`32llw6anFsjPISJrrp1and`** — `[Accura] Agentic Design System` |
>
> Node IDs are **per-file**. Every ID in this document points into Agentic's file and will
> resolve to the wrong node — or nothing — in Accura's. **Do not use them to build, audit or
> instantiate anything in Accura.**
>
> Re-pull the real IDs from Accura's file before relying on this:
> ```bash
> cd ~/figma-cli && node src/index.js eval "return figma.currentPage.findAll(n => n.type === 'COMPONENT_SET').map(s => ({ name: s.name, id: s.id }))"
> ```
> (with the FigCli plugin running in `[Accura] Agentic Design System`)
>
> Known-good Accura IDs so far — `sidebar` component set `95:15648` (Type=Default, State=Expanded),
> `264:6014` (Type=Default, State=Collapsed). Collections: Primitives `1:2`, Semantics `1:129`, Components `17:4484`.
>
> This file is retained only as the **structural template** for what should be recorded.

Reference file for all stable Figma node IDs and effect style IDs used in this design system.
Figma file key: `YWfTOUTpFZ0BNxHobfUqme`

> These IDs are session-stable. If a node is deleted and recreated its ID changes — re-audit after structural changes.

---

## Effect Style IDs — Shadows

| Style | ID |
|---|---|
| `shadows/2xs` | `S:6b3cd3403b2d90a1b7fa2f4e6c228fe98418c274,` |
| `shadows/xs` | `S:84de5721d57b58a370cc7e88e947b2578b314d15,` |
| `shadows/sm` | `S:6752bf7b6d1af555483807ed18632fc99cf19620,` |
| `shadows/shadow` | `S:a570715bf063446dc80fa095ce0b135e521e507d,` |
| `shadows/md` | `S:73e7a5606ccd6777e065e02c1004374e6f636152,` |
| `shadows/lg` | `S:1583b106a6ba613f2af52a88d0c682982400de83,` |
| `shadows/xl` | `S:7f919c89590d370c834095488e8f3dc68be67e6f,` |
| `shadows/2xl` | `S:1ccc171f7333e24051c1d9eb7dd562d94c8aaf15,` |
| `focus/destructive` | `S:6f2ef7b7077bbbd3bd3d6472997e0e42177dcb1a,` |
| `focus/ring` | `S:9782ceadf378680d47127e040865496af711f648,` |

---

## Text Style IDs — Typography

| Style | ID |
|---|---|
| `display/lg` | `S:360e42fcf8d0a3cf4eb2485b95c0e84141a88ffe,` |
| `display/md` | `S:27651ba6bc5e5c0455fb8445baece861071c26fb,` |
| `display/sm` | `S:15db8fbbac39a327203b87beb4a99b2ed6b97d14,` |
| `heading/xl` | `S:1b92b1006c71a40db6efab661a432382291ff8cc,` |
| `heading/lg` | `S:08d92dbcc200186cb0bec1dea8b0828c356f3f1c,` |
| `heading/md` | `S:ac4ad1a17a9607229272f4aa0bb08a9568513824,` |
| `heading/sm` | `S:2cc1b8fea261bb345051432310577947dc41b6c9,` |
| `heading/xs` | `S:fec7afeccd76fbce5ca016900727499c6946c3b7,` |
| `body/lg` | `S:6d27909f70624948fe8e92ff8512a143b329e73f,` |
| `body/md` | `S:b432dbe1c961781d97dd277c33360e41907f23d7,` |
| `body/sm` | `S:643f17a7b0b91d933a70908efa73faf0412e1788,` |
| `body/xs` | `S:e558112dda3a77fa4aca1eb5951b82477a6e3ecb,` |
| `label/lg` | `S:31462b34f613ea9f3563d85ba2ef25601ffcb3a4,` |
| `label/md` | `S:ce5449863ea16bd16e46421e9fc5c8ac29e8acd0,` |
| `label/sm` | `S:67792eed009542c23d2eebd066a0c77e2341dc5e,` |
| `code/md` | `S:9a2392172cc05d78f3dd24d7f4a5fc376b7cb9bf,` |
| `code/sm` | `S:5ec8eab95fecbbc703c91517fbb1bf18b110e37b,` |

---

## Key Component Node IDs

| Component | Node ID |
|---|---|
| Icon Placeholder | `159:34829` |
| chevron-right | `159:35234` |
| chevron-left | `159:35297` |
| chevron-down | `159:35236` |
| check | `159:34742` |
| search-lg | `159:34831` |
| search-sm | `159:34821` |

**Deleted — DO NOT USE:** `15:38855`, `15:1410`, `15:1412`, `15:1404`, `15:1398`

---

## Variable Collection IDs

| Collection | ID |
|---|---|
| Primitives | `1:2` |
| Semantics | `1:129` |
| Component tokens | `17:4484` |
