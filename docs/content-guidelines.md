# Content & UX Writing Guidelines

Voice-neutral writing mechanics for any product built on the Agentic Design System. These are usability rules, not brand voice — tone/personality belongs to whoever uses the system, not to the system itself.

---

## Capitalization

- Sentence case for everything: buttons, headings, labels, menu items, tooltips, table headers.
- Don't Title Case UI text (no "Create New Project").
- Proper nouns and acronyms keep their normal casing (Figma, API, ID).

## Buttons & actions

- Start with a verb: "Create project", "Delete file", "Save changes" — not "Submit", "OK", "New".
- Be specific about the outcome, especially for destructive actions: "Delete 3 items" beats "Delete".
- Keep labels short — 1-3 words. If it needs a sentence, it's not a button label.

## Errors & validation

- State what happened, then how to fix it. "This field can't be empty" not "Invalid input" or "Error".
- Never blame the user. No "You entered the wrong password" — use "That password didn't work. Try again."
- Be specific: "File must be under 10MB" not "Upload failed".

## Empty states

- Say what's missing and what to do next. "No projects yet — create your first one to get started."
- Avoid empty states that just say "Nothing here" with no next action.

## General punctuation & formatting

- No em dashes in copy — use a comma instead.
- Oxford comma in lists of three or more.
- Use "select" or "choose" instead of "click" (covers touch and mouse).
- Numbers: use numerals (3, not "three") in UI, except at the start of a sentence.
- Dates/times: be consistent within a product (e.g. `12 Jun 2026`, `14:00`); don't mix formats.

## Tone (left to the consumer)

This system stays voice-neutral on purpose. Personality, formality, humor, and brand-specific terminology are decisions for the product/brand using the system — not prescribed here.

---

*Add to `llms.txt` under "Rules and Process" if this should be read every session.*
