# `tokens/` — the DTCG export

**These files are not what ships.** The runtime source of truth is
`accura-ui/src/app/tokens.css`. Everything here is an export, and an export is
only worth anything while it still matches.

| | |
|---|---|
| `primitives.tokens.json` | raw ramps — the only file with literal values |
| `semantics.tokens.json` · `semantics.dark.tokens.json` | aliases onto primitives |
| `components.tokens.json` | component tokens, aliasing semantics |
| `tokens.tokens.json` | all of the above in one file |
| `output/` | Style Dictionary build — **not consumed by the app** |
| `sd.build.mjs` | `npm run build` here regenerates `output/` — **a build artifact, not tracked in git.** On 2026-09-17 the committed copy was three tokens behind the export and looked authoritative; it is now gitignored and rebuilt on demand |

## Check it before trusting it

```bash
node tokens/token-parity.mjs
```

Resolves every `{alias}` chain and compares against the `:root` block of
`tokens.css`. Four differences are known and explained in the script's `KNOWN`
map; anything else fails, and the failure names the token and both values.

Run it before quoting a value out of these files, and after any token change.

## Why this exists

The export sat here for six days saying the body font was `SF Pro` while the
app shipped `Inter`. Three documents repeated it, and it was only caught when
someone asked. The prose warning that these files might be stale had been
there the whole time — a warning only helps a reader who already suspects.

350 of the values were fine. The problem was never that the export was bad; it
was that nobody could tell which parts to trust without reading it by hand.

## If a value here is wrong

Fix `tokens.css` if the app is wrong. Fix the export if the export is wrong.
Add to `KNOWN` with a reason if the difference is deliberate. Do not leave it
failing silently — a check nobody can pass is a check everybody ignores.
