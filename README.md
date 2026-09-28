# Motion System

A motion system in three layers: tokens, primitives that read them, and real UI patterns built only from those primitives. It ships with a playground where you tune springs and drag easing curves live, watch every demo follow, then export the tokens as JSON, TypeScript or CSS.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Three layers

Each layer only uses the one above it.

| Layer | Folder | What it is |
|---|---|---|
| **1. Tokens** | `src/tokens/` | The numbers: durations, easings, springs, stagger, distance, scale. All in `tokens.json`. |
| **2. Primitives** | `src/motion/` | Components that turn tokens into movement: `Reveal`, `Presence`, `Stagger`, `Move`, `Shuttle`. The only code that uses the animation library. |
| **3. Patterns** | `src/patterns/` | Real UI built only from primitives: modal, list, toast. No timing values of their own. |

The rest of the code:

- **`src/playground/`**: the demo page (hero instrument, token races, tuning, controls, export).
- **`src/ui/`**: plain inputs (Button, Slider, Select, Toggle, SegmentedControl, CurveEditor).

## tokens.json is the source of truth

Every motion value lives in one file: [`src/tokens/tokens.json`](src/tokens/tokens.json). It uses the [W3C Design Tokens (DTCG)](https://www.designtokens.org/) format, so tools like Tokens Studio and Style Dictionary can read it too.

### Exporting tokens

Download the tokens from the playground in three formats:

| Format | What you get |
|---|---|
| **JSON** | The `tokens.json` file itself |
| **TypeScript** | Typed constants, plus types for every token name |
| **CSS** | Custom properties on `:root` |

- **They never drift apart.** TypeScript and CSS are generated from the JSON when you click download (`src/tokens/exporters.ts`).
- **Edited or original.** After editing in the playground (the **Edit** button on each panel), choose whether to export your edited values or the original file. Edited JSON keeps every `$type` and `$description`; only the values change.
- **Time scale is never exported.** It's playback speed for previewing, not a token.
- **Springs in CSS:** CSS has no spring timing, so springs export as a duration and a bounce for JavaScript to read.

### How the code reads them

`src/tokens/motion.ts` holds no values of its own. It:

1. reads `tokens.json`
2. converts DTCG values into plain numbers (`{ "value": 160, "unit": "ms" }` → `160`)
3. checks them (for example, easing curves must stay within 0–1)
4. turns the token names into TypeScript types, so a typo like `'bouncyy'` is caught

Springs have no DTCG type, so each spring is a small group: a `duration` plus a `number` for bounce.

## How a token reaches the screen

1. `tokens.json` defines `quick` as 160ms; `tokens/motion.ts` reads it.
2. `MotionConfigProvider` applies the playground's settings (time scale, spring edits, reduced motion) and
   - hands the resolved tokens to primitives through context, and
   - writes them to CSS variables (`--duration-quick`, `--ease-standard`) on `:root`.
3. JS animations use `useMotionToken().tween('quick', 'exit')`, and CSS transitions use Tailwind classes like `duration-(--duration-quick) ease-standard`. Both stay in sync.

## Rules

- **Only `src/motion/` imports `motion`.** Everything else uses primitives, so the animation library could be swapped in one folder.
- **No raw timing values outside `tokens.json`.** Components ask for `'quick'`, never `160`.
- **Exits are faster than entrances.** Presence enters with a spring and leaves with `quick` + `exit`.
- **Reduced motion is handled once**, in `useMotionToken`: transitions become a short fade and nothing travels. It respects the OS setting and the playground toggle. CSS follows the same switch: the provider sets `[data-reduced-motion]` on `<html>`, and anything that moves or scales in CSS sits behind the `full-motion:` Tailwind variant. Colour and opacity changes stay.
- One component per file, typed props, variants as typed maps + `cn()`.
