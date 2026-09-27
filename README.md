# Motion System

A motion system in three layers: tokens, primitives that read them, and real UI patterns built only from those primitives. It ships with a playground where you tune springs and drag easing curves live, watch every demo follow, then export the tokens as JSON, TypeScript or CSS.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Three layers

```
1. Tokens        src/tokens/        durations, easings, springs, stagger, distance, scale
        ↓                            (tokens.json is the single source of truth)
2. Primitives    src/motion/        Reveal · Presence · Stagger · Move · Shuttle · useMotionToken
        ↓                            (the only code that imports the `motion` library)
3. Patterns      src/patterns/      Modal · List · Toast
                                     (built only from primitives, with no timing values of their own)
```

`src/playground/` is the page UI (hero instrument, token races and tuning, control panel, export, demo cards, playback/pause) and `src/ui/` holds plain inputs (Button, Slider, Select, Toggle, SegmentedControl, CurveEditor). Links live in `src/site.ts`.

## tokens.json is the source of truth

All values live in [`src/tokens/tokens.json`](src/tokens/tokens.json), in the [W3C Design Tokens (DTCG)](https://www.designtokens.org/) format that tools like Tokens Studio and Style Dictionary read.

- **Change a value:** edit `tokens.json`. No code changes. The dev server hot-reloads, so the playground shows the change immediately.
- **Add a token** (e.g. a new duration): add it to `tokens.json`. It becomes a valid, type-checked name everywhere, and the playground shows it automatically.
- **Add a new kind of token** (e.g. rotation): needs code, because a primitive has to learn to use it.

The page's download offers three formats, all from the same committed file: **JSON** (the file itself), **TypeScript** (typed constants plus token-name types) and **CSS** (custom properties on `:root`). TS and CSS are generated on click by `src/tokens/exporters.ts`, so they can't drift from the JSON. After tuning tokens in the playground (the **Tune** button on each token panel), you choose whether to export your **tuned** values or the **original** file; tuned JSON keeps every `$type` and `$description` and only swaps values. Time scale is playback speed, so it's never exported. CSS has no spring timing function, so springs export as a duration and bounce for JavaScript to read.

`tokens/motion.ts` never holds values. It reads the JSON, converts DTCG values (`{ "value": 160, "unit": "ms" }` → `160`), validates them, and derives the token names as TypeScript types. Springs have no DTCG type, so each one is a group of a `duration` and a `number` (bounce).

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

## Next


- Motion tokens per brand theme (plug into the component library)
- Storybook stories per primitive
- A "when not to animate" doc
