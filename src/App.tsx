import type { ReactNode } from 'react'
import { ListDemo, ModalDemo, ToastDemo } from '@/choreography'
import { MotionConfigProvider, Reveal } from '@/motion'
import {
  ControlPanel,
  DemoCard,
  HeroToy,
  PlaybackProvider,
  PrimitiveReference,
  TokenDownload,
  TokenReference,
} from '@/playground'
import { site } from '@/site'

const DEMOS = [
  {
    title: 'Modal',
    rule: 'Enter with a spring, leave with a quick exit curve. Exits are always faster than entrances.',
    Demo: ModalDemo,
    className: '',
  },
  {
    title: 'Toast',
    rule: 'New toasts push older ones up. Nothing teleports; the stack caps at three.',
    Demo: ToastDemo,
    className: '',
  },
  {
    title: 'List',
    rule: 'Stagger on first load only. When an item leaves, it fades first, then siblings close the gap.',
    Demo: ListDemo,
    className: 'md:col-span-2',
  },
]

const RULES = [
  { title: 'Tokens are data.', body: 'Every value lives in tokens.json. Code only reads it, so tuning motion never means editing components.' },
  { title: 'Only primitives touch the library.', body: 'One folder imports the animation library. Everything else asks a primitive, so the library could be swapped in one place.' },
  { title: 'Components ask by name.', body: "A component asks for 'quick', never 160. No raw timing lives outside the token file." },
  { title: 'Exits are faster than entrances.', body: 'People care about what is arriving. Leaving things get out of the way.' },
  { title: 'Reduced motion is designed once.', body: 'Movement becomes a short fade, in one hook, for every primitive. Feedback stays; travel goes.' },
]

const linkClass =
  'font-bold underline decoration-2 underline-offset-4 decoration-accent hover:decoration-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-easing rounded-sm'

export default function App() {
  return (
    <MotionConfigProvider>
      <PlaybackProvider>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <header className="grid items-center gap-10 pt-10 pb-20 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pt-20 lg:pb-28">
            <Reveal>
              <h1 className="font-display text-display font-black">How things move.</h1>
              <p className="mt-6 max-w-[48ch] text-lg text-muted">
                A motion system in three layers: tokens hold the numbers, primitives turn them into movement, and
                every pattern is built only from primitives. Change a token and the whole page follows.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <TokenDownload />
                {site.repoUrl && (
                  <a href={site.repoUrl} className={linkClass}>
                    Source
                  </a>
                )}
              </div>
            </Reveal>
            <Reveal duration="slow">
              <HeroToy />
            </Reveal>
          </header>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
            {/* First in the DOM so tab order matches the mobile layout; sits on the right on large screens. */}
            <div className="lg:order-last">
              <div className="lg:sticky lg:top-6">
                <ControlPanel />
              </div>
            </div>

            <main className="min-w-0 space-y-24">
              <Section title="Tokens" lede="The raw material. Tokens in the same family race side by side, so you feel the difference instead of reading it.">
                <TokenReference />
              </Section>

              <Section title="Primitives" lede="The API. Components that read tokens so nobody else has to, and handle reduced motion for you.">
                <PrimitiveReference />
              </Section>

              <Section title="Patterns" lede="Real interface moments built only from primitives, each following one rule.">
                <div className="grid gap-5 md:grid-cols-2">
                  {DEMOS.map(({ title, rule, Demo, className }) => (
                    <div key={title} className={className}>
                      <DemoCard title={title} rule={rule}>
                        <Demo />
                      </DemoCard>
                    </div>
                  ))}
                </div>
              </Section>
            </main>
          </div>

          <Closing />
        </div>
      </PlaybackProvider>
    </MotionConfigProvider>
  )
}

function Section({ title, lede, children }: { title: string; lede: string; children: ReactNode }) {
  return (
    <Reveal inView>
      <section>
        <div className="mb-8">
          <h2 className="font-display text-title font-extrabold">{title}</h2>
          <p className="mt-3 max-w-[60ch] text-lg text-muted">{lede}</p>
        </div>
        {children}
      </section>
    </Reveal>
  )
}

function Closing() {
  return (
    <Reveal inView>
      <footer className="mt-32 border-t-2 border-ink pt-16 pb-20">
        <h2 className="font-display text-title font-extrabold">Rules it keeps.</h2>
        <ol className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {RULES.map((rule) => (
            <li key={rule.title}>
              <p className="text-lg font-extrabold">{rule.title}</p>
              <p className="mt-1 max-w-[42ch] text-muted">{rule.body}</p>
            </li>
          ))}
        </ol>
        {site.repoUrl && (
          <p className="mt-16">
            <a href={site.repoUrl} className={linkClass}>
              Source
            </a>
          </p>
        )}
      </footer>
    </Reveal>
  )
}
