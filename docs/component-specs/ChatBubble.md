# ChatBubble

A conversational chat UI kit for AI/agent surfaces. **Code-only — no published Figma component set.** Ships five parts in one file: `ChatBubble` (a message), `ChatLog` (accessible message container), `TypingIndicator` (thinking dots), `SuggestionChip` (a clickable follow-up), and `ChatInput` (text field + send button).

> **Status:** `needs review`. Documented retroactively 2026-07-02 (the component existed in Storybook with no spec). Code is token/icon/spacing/motion compliant as of 2026-07-02. Still unverified against any Figma source and not Phase-3 story-verified.

---

## Variant Matrix

`ChatBubble` has a single variant; the other three parts are stateless (no variants).

| Property | Options | Default |
|---|---|---|
| `role` | `bot`, `user` | `bot` |

| Part | Variants | Notes |
|---|---|---|
| `ChatBubble` | `role=bot` / `role=user` | Only differs by alignment, fill, and pointed-corner side |
| `ChatLog` | — | Wraps the message list; adds `role=log` + `aria-live` for screen readers |
| `TypingIndicator` | — | Always bot-side (avatar + animated dots) |
| `SuggestionChip` | — | Pill button; standard button states (hover/focus) |
| `ChatInput` | — | Send button has active/idle states driven by input content |

---

## Sizes

No size variant. Fixed dimensions:

| Element | Value | Notes |
|---|---|---|
| Avatar | `size=sm` (32px) | Bot messages + TypingIndicator only |
| Bubble max width | 75% of container | Prevents full-width messages |
| SuggestionChip height | 32px (`h-8`) | — |
| ChatInput height | 48px (`h-12`) | — |
| Send button | 32×32px | Circular |

---

## Component Properties

### `ChatBubble`
| Property | Type | Default | Notes |
|---|---|---|---|
| `role` | VARIANT | `bot` | `bot` = left, avatar, surface fill · `user` = right, no avatar, brand fill |
| `children` | SLOT | — | Message content (open-ended) |
| `timestamp` | TEXT | — | Optional, e.g. `"2:34 PM"` |
| `avatarSrc` | TEXT | — | Bot avatar image (bot only) |
| `avatarFallback` | TEXT | `"AI"` | Bot avatar initials (bot only) |

### `ChatInput`
| Property | Type | Default | Notes |
|---|---|---|---|
| `value` / `onChange` | — | — | Controlled mode (both required together) |
| `onSend` | — | — | Fires on Enter or send-button click |
| `placeholder` | TEXT | `"Type a message..."` | — |
| `disabled` | BOOLEAN | `false` | Locks input + send |

### `SuggestionChip`
Standard `<button>` — accepts all button attributes plus `children`.

### `ChatLog`
| Property | Type | Default | Notes |
|---|---|---|---|
| `children` | SLOT | — | The message list (ChatBubble / TypingIndicator instances) |
| `label` | TEXT | `"Chat messages"` | Accessible name for the live region |
| `className` | TEXT | — | Layout overrides (defaults to `flex flex-col gap-4`) |

---

## Structure

### role=bot
```
ChatBubble (flex-row, gap-2)
  ├─ Avatar (size=sm)                    — bot only, top-aligned
  └─ column (flex-col, gap-1, items-start, max-w-75%)
       ├─ bubble                         — surface fill, border, pointed top-left corner
       └─ timestamp                      — optional, text/secondary
```

### role=user
```
ChatBubble (flex-row-reverse, gap-2)
  └─ column (flex-col, gap-1, items-end, max-w-75%)
       ├─ bubble                         — brand fill, no border, pointed top-right corner
       └─ timestamp                      — optional, text/secondary
```

### TypingIndicator
```
row (flex-row, gap-2)
  ├─ Avatar (size=sm)
  └─ bubble (pointed top-left)
       └─ 3 × dot                        — animate-bounce, staggered 150ms, motion-reduce:animate-none
```

### ChatInput
```
container (flex-row, gap-2, h-12, radius-full, border)
  ├─ input (transparent, flex-1)
  └─ send button (32×32, circular)       — active vs idle by input content
```

### ChatLog
```
ChatLog (flex-col, gap-4, role=log, aria-live=polite)
  └─ children                            — ChatBubble / TypingIndicator instances
```

---

## Token Bindings

### ChatBubble — per role
| Element | Property | `role=bot` | `role=user` |
|---|---|---|---|
| bubble | fill | `color/surface/default` | `color/brand/primary` |
| bubble | border | `color/border/default` (1px) | none |
| bubble | text | `color/background/default/foreground` | `color/brand/primary/foreground` |
| bubble | radius | `radius/2xl` (20px), `radius/sm` top-left | `radius/2xl` (20px), `radius/sm` top-right |
| timestamp | text | `color/text/secondary` | `color/text/secondary` |

### TypingIndicator
| Element | Property | Token |
|---|---|---|
| bubble | fill | `color/surface/default` |
| bubble | border | `color/border/default` |
| dots | fill | `color/icon/muted` |

### SuggestionChip
| State | Property | Token |
|---|---|---|
| default | fill | `color/background/default` |
| default | border | `color/border/default` |
| default | text | `color/background/default/foreground` |
| hover | fill | `color/surface/accent` |
| focus | ring | `color/border/focus` |

### ChatInput
| Element | Property | Token |
|---|---|---|
| container | fill | `color/background/default` |
| container | border | `color/border/default` |
| container | focus ring | `color/border/focus` (focus-within) |
| input | placeholder | `color/input/placeholder` |
| send (active) | fill / fg | `color/brand/primary` / `color/brand/primary/foreground` |
| send (idle) | fill / fg | `color/surface/default` / `color/icon/muted` |

### Spacing (Tailwind utilities — not CSS-var)
| Context | Token | Utility |
|---|---|---|
| avatar ↔ bubble gap | `spacing/component/sm` (8px) | `gap-2` |
| bubble ↔ timestamp gap | `spacing/component/xs` (4px) | `gap-1` |
| bubble padding | `spacing/component/md` / `sm` | `px-3 py-2` |

### Icons
`CornerDownLeft` from `@untitledui/icons` (send button). Never `lucide-react`.

---

## Accessibility

| Property | Value |
|---|---|
| Role | Bubbles: none (plain text). Controls: native `<button>` / `<input>`. |
| Screen reader name | ChatInput field `aria-label="Chat input"` · send button `aria-label="Send message"` |
| Keyboard | ChatInput: `Enter` sends · `Shift+Enter` reserved for newline · send disabled when empty |
| Focus indicator | `color/border/focus` ring on ChatInput (focus-within) and SuggestionChip (focus-visible) |
| Reduced motion | TypingIndicator dots use `motion-reduce:animate-none` — bounce stops under `prefers-reduced-motion` |

> **Provided by `ChatLog`:** wrap your messages in `ChatLog` and new messages are announced to screen readers automatically (`role="log" aria-live="polite" aria-relevant="additions"`). No extra work for the consumer.

---

## Behavior

| Element | Behavior |
|---|---|
| `ChatInput` | Controlled+uncontrolled — uses `value`/`onChange` when provided, internal state otherwise |
| Send | `Enter` (no Shift) or button click fires `onSend(trimmedValue)`; input clears in uncontrolled mode |
| Send button | Idle (muted) when input empty/whitespace; active (brand) when there is content; disabled when `disabled` |
| `TypingIndicator` | Purely presentational — no state; render it in place of a bubble while a response is pending |

### Motion
| Transition | Properties |
|---|---|
| Typing dots | `animate-bounce`, staggered 150ms per dot, 1s duration |

> Reduced motion: dots freeze (`motion-reduce:animate-none`). No color/fill is animated.

---

## Usage Rules

- `role=bot` = a message authored by the assistant/agent (left, avatar, surface fill).
- `role=user` = a message authored by the person (right, no avatar, brand fill).
- Use `TypingIndicator` for an unknown-duration "thinking" state — not for deterministic progress (use `progress`).
- Use `SuggestionChip` for tappable follow-up prompts under a bot reply — not as a general-purpose button.
- ChatBubble ≠ a comment thread or record list — use `item` in a list for non-conversational content.

---

## Best Practice

### Use cases
- An AI assistant panel where bot and user messages alternate.
- An in-app support/agent chat surface.
- A prompt playground showing conversation history with a send input.
- Showing a "thinking" state via `TypingIndicator` while a response streams in.
- Offering quick follow-up questions under a bot reply via `SuggestionChip`.

### Per-variant examples
| Variant | When to reach for it | Real UI examples |
|---|---|---|
| `role=bot` | Any assistant/agent message | Streamed answer · system explanation · error reply |
| `role=user` | Any message from the person | User question · follow-up request |

### Compared to similar components
| If the situation is… | Use | Not |
|---|---|---|
| Two-party conversation with directional alignment | `chat-bubble` | `item` |
| Non-conversational list of records with metadata | `item` | `chat-bubble` |
| Unknown-duration wait for a response | `TypingIndicator` | `progress` |
| Deterministic % completion | `progress` | `TypingIndicator` |

---

## Do Not

| ❌ Wrong | ✅ Correct |
|---|---|
| Show an avatar on `role=user` | Avatar is bot-only |
| Import icons from `lucide-react` | `@untitledui/icons` (`CornerDownLeft`) |
| CSS-var spacing (`px-[var(--spacing-component-md)]`) | Tailwind utilities (`px-3`, `gap-2`) |
| Leave typing dots animating under reduced motion | `motion-reduce:animate-none` |
| Rely on default announcement of new messages | Wrap messages in `ChatLog` |

---

## Open Questions

_Remove when resolved._

**Is there an intended Figma component for Chat, or is this deliberately code-only?**
Currently no Figma component set is located. If code-only, mark `codeOnly` and drop the Figma-parity gate. If a Figma source is intended, build it and run parity.

_Resolved 2026-07-02:_ "Chat" confirmed as an official category (added to the category→title map). Live-region announcement is now provided by the `ChatLog` wrapper.
