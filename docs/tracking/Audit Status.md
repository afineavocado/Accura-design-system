# Audit Status — Accura

Tracks which components have been audited **in Accura's Figma file**, what rules were active at the time, and what needs re-auditing when new rules are added.

> ⚠️ **Reset 2026-09-08.** This file previously carried Agentic's audit log. Those audits were run against Agentic's Figma file (`YWfTOUTpFZ0BNxHobfUqme`) and **do not transfer** — Accura is a different file with a different brand ramp, sidebar, button radius and status borders. An audit only certifies the file it ran against.

**Accura's Figma file:** `32llw6anFsjPISJrrp1and` — `[Accura] Agentic Design System`

---

## Current state: no components audited

**Zero R1–R8 audits have been run against Accura's Figma file.**

This is the largest gap in the system. The component *specs* are complete and the *code* is token-bound, but nothing has verified that Accura's Figma components are correctly bound to Accura's tokens.

| Audited | Count |
|---|---|
| Components in Accura's Figma | ~36 |
| Audited under Accura | **0** |

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

## Rule set in force

Audits run against `docs/skills/Component Audit Skill.md` (R1–R8), inherited unchanged from Agentic. The rules are system-agnostic; only the token *values* they check against are Accura's.

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

## Suggested audit order

Start where Accura deviates most from the inherited defaults — those are the components most likely to be wrong:

1. **`button`** — pill radius plus the full brand ramp across 6 types × 5 states
2. **`input` / `select` / `combobox`** — the pale status borders and the focus ring
3. **`sidebar`** — partially verified; finish it and resolve the `ring` divergence
4. **`badge` / `alert` / `toast`** — status fills and paired foregrounds
5. Everything else

---

## Before starting an audit

1. Read `docs/skills/Component Audit Skill.md` — the full R1–R8 process and report format.
2. Confirm figma-cli is connected to **Accura's** file, not Agentic's:
   ```bash
   cd ~/figma-cli && node src/index.js eval "return figma.root.name"
   ```
   It must print `[Accura] Agentic Design System`.
3. Check token values against `accura-theme.md`, **not** `docs/design-system-rules.md` — the latter carries Agentic's values.
4. Record findings here as you go. Never fix without showing the report first.
