# Motion System

A small motion system: tokens, primitives that read them, and real UI patterns built only from those primitives. It ships with a playground where you can change tokens live and watch every demo follow.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Three layers

```
1. Tokens        src/tokens/        durations, easings, springs, stagger, distance
        ↓                            (plain data, the single source of truth)
2. Primitives    src/motion/        Reveal · Presence · Stagger · Move · useMotionToken
        ↓                            (the only code that imports the `motion` library)
3. Choreography  src/choreography/  Modal · List · Toast
                                     (built only from primitives, with no timing values of their own)
```

`src/playground/` is the page UI (token reference, control panel, demo cards) and `src/ui/` holds plain atoms (Button, Slider, Select, Toggle).

## How a token reaches the screen

1. `tokens/motion.ts` defines `quick: 160`.
2. `MotionConfigProvider` applies playground settings (time scale, spring edits) and
   - hands the resolved tokens to primitives through context, and
   - writes them to CSS variables (`--duration-quick`, `--ease-standard`) on `:root`.
3. JS animations use `useMotionToken().tween('quick', 'exit')`, and CSS transitions use Tailwind classes like `duration-(--duration-quick) ease-standard`. Both stay in sync.

## Rules

- **Only `src/motion/` imports `motion`.** Everything else uses primitives, so the animation library could be swapped in one folder.
- **No raw timing values outside `src/tokens/`.** Components ask for `'quick'`, never `160`.
- **Exits are faster than entrances.** Presence enters with a spring and leaves with `quick` + `exit`.
- **Reduced motion is handled once**, in `useMotionToken`: transitions become a short fade and nothing travels. It respects the OS setting and the playground toggle. CSS follows the same switch: the provider sets `[data-reduced-motion]` on `<html>`, and anything that moves or scales in CSS sits behind the `full-motion:` Tailwind variant. Colour and opacity changes stay.
- One component per file, typed props, variants as typed maps + `cn()`.

## Next

- Motion tokens per brand theme (plug into the component library)
- Storybook stories per primitive
- A "when not to animate" doc
