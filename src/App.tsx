import type { ReactNode } from 'react'
import { ListDemo, ModalDemo, ToastDemo } from '@/choreography'
import { MotionConfigProvider, Reveal } from '@/motion'
import { ControlPanel, DemoCard, PrimitiveReference, ThemeSwitcher, TokenReference } from '@/playground'

const LAYERS = [
  { name: 'Tokens', detail: 'durations, easings, springs, stagger' },
  { name: 'Primitives', detail: 'Reveal, Presence, Stagger, Move' },
  { name: 'Choreography', detail: 'real UI patterns built from primitives' },
]

const DEMOS = [
  {
    title: 'Modal',
    rule: 'Enter with a spring, leave with a quick exit curve. Exits are always faster than entrances.',
    Demo: ModalDemo,
  },
  {
    title: 'List',
    rule: 'Stagger on first load only. When an item leaves, it fades first, then siblings close the gap.',
    Demo: ListDemo,
  },
  {
    title: 'Toast',
    rule: 'New toasts push older ones up. Nothing teleports; the stack caps at three.',
    Demo: ToastDemo,
  },
]

export default function App() {
  return (
    <MotionConfigProvider>
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-28 sm:px-6 lg:pt-16">
        <Reveal>
          <header className="max-w-2xl">
            <p className="font-mono text-xs tracking-widest text-accent uppercase">Motion system · v0.1</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">How things move</h1>
            <p className="mt-4 text-muted">
              A small set of motion tokens, a few primitives that read them, and real interface patterns
              built only from those primitives. Change a token and everything follows.
            </p>
            <ol className="mt-6 flex flex-wrap gap-2">
              {LAYERS.map((layer, i) => (
                <li key={layer.name} className="rounded-full bg-surface px-3 py-1.5 text-sm ring-1 ring-line">
                  <span className="font-mono text-muted">{i + 1}</span> <span className="font-medium">{layer.name}</span>
                  <span className="text-muted"> · {layer.detail}</span>
                </li>
              ))}
            </ol>
          </header>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_280px]">
          <main className="min-w-0 space-y-16">
            <Section index="01" title="Tokens" lede="The raw material. Each card loops so you can feel the difference.">
              <TokenReference />
            </Section>

            <Section
              index="02"
              title="Primitives"
              lede="The API. Components that read tokens so nobody else has to. Each one handles reduced motion for you."
            >
              <PrimitiveReference />
            </Section>

            <Section index="03" title="Choreography" lede="How the primitives combine in real interface patterns.">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {DEMOS.map(({ title, rule, Demo }) => (
                  <DemoCard key={title} title={title} rule={rule}>
                    <Demo />
                  </DemoCard>
                ))}
              </div>
            </Section>
          </main>

          <div className="order-first lg:order-none">
            <div className="lg:sticky lg:top-6">
              <ControlPanel />
            </div>
          </div>
        </div>
      </div>
      <ThemeSwitcher /> {/* TEMPORARY */}
    </MotionConfigProvider>
  )
}

function Section({ index, title, lede, children }: { index: string; title: string; lede: string; children: ReactNode }) {
  return (
    <Reveal inView>
      <section>
        <div className="mb-6 border-b border-line pb-4">
          <p className="font-mono text-xs text-muted">{index}</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted">{lede}</p>
        </div>
        {children}
      </section>
    </Reveal>
  )
}
