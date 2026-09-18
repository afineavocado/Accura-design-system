# Audit Status — Accura

> ## ⛔ Retired 2026-09-18 — R1–R8 auditing is not part of this project
>
> The R1–R8 process in `docs/skills/Component Audit Skill.md` inspects **Figma** components and
> compares their bound variables to the token set. **This project does not work in Figma**
> (`CLAUDE.md` → *We do not work in Figma*), so the audit could never be run here and was never
> debt this repo could clear. It had been carried as a ❌ and as "the largest gap in the system"
> since 2026-09-08; both were wrong, because they measured the repo against a process that does
> not apply to it.
>
> **Nothing replaces it, and nothing needs to.** What R1–R8 checked in Figma, this project checks
> in the code and the browser:
>
> | R1–R8 checked | Here instead |
> |---|---|
> | unbound fills, strokes, radius | `node tokens/token-parity.mjs`, and the no-hardcoded-values rule |
> | wrong semantic group, paired surfaces | `docs/skills/accura-screen-audit/` — read each token name as a sentence |
> | restated values drifting from tokens | `node docs/machine-readable/drift-check.mjs` rule 6 |
> | rendered text styles | `node accura-ui/audit-styles.mjs <urls>` |
>
> `meta.auditRules` and `meta.lastAuditDate` were cleared to `null` in all 38 `.meta.json` files on
> the same day. Thirty-five carried `R1–R8` / `2026-05-28`, which were **Agentic's** audits against
> **Agentic's** file — an audit only certifies the file it ran against, so they never applied here.
>
> The rest of this file is kept as the record: what the rules were, and what was observed in
> Accura's Figma file before the decision. It is provenance, not a to-do list.

**Accura's Figma file, for reference:** `32llw6anFsjPISJrrp1and` — `[Accura] Agentic Design System`

---

## What is known without an audit

Observed while working in the file, not from a systematic pass:

| Component | Observation | Date |
|---|---|---|
| `sidebar` (`95:18202`) | Structure read and matched to code. `sidebar/accent` and `accent/foreground` reconciled to `brand/900` / white. **`sidebar/ring` still `blue/500` in Figma** while code uses brand green — a live divergence. | 2026-09-08 |
| `button` | Component tokens resolve `Button radius 1` and `radius 2` to `9999` (pill), where Agentic uses 12px / 8px. | 2026-09-07 |
| `color/border/error·success·warning` | Sit at red/300, green/400, yellow/300 — markedly paler than Agentic's 500/700. Not yet confirmed as intentional (Q10). | 2026-09-07 |
| `color/ring` | `brand/500` `#17bb77` = **2.50:1 against white**, below the WCAG 1.4.11 3:1 floor for non-text indicators (Q11). | 2026-09-07 |

---

## Rule set that was in force — reference only

Audits ran against `docs/skills/Component Audit Skill.md` (R1–R8), inherited unchanged from Agentic. Recorded here because the *reasoning* in the rules is still worth reading when auditing a screen; the process that applied them is retired.

| # | Rule | What it catches |
|---|---|---|
| R1 | Unbound fills / strokes / radius | Tokens not bound at all |
| R2 | Wrong semantic group | `surface` vs `background` confusion |
| R3 | Paired-surface rule | `/foreground` used on a non-matching background |
| R4–R6 | State-aware token correctness | Invalid / Warning / Success states using the wrong token |
| R7 | Layer naming | TEXT nodes named after their content |
| R8 | Sub-component fill overrides | Parent repainting a child inside an instance |

**Re-audit trigger:** any component audited before a new rule was added is `needs re-audit` for that rule.

---

## ~~Suggested audit order~~ · ~~Before starting an audit~~ — removed 2026-09-18

Both sections described how to start a process this project does not run. They are in git history
if the decision is ever reversed.
