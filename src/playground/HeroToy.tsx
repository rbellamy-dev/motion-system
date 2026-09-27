import { useEffect, useState } from 'react'
import { Move, Shuttle, Stagger, StaggerItem, useMotionToken } from '@/motion'
import { cn } from '@/lib/cn'
import { keyClasses } from '@/ui/Button'
import { TONES, type Tone } from './tones'

interface ToyKey {
  tone: Tone
  label: string
  /** The token this key plays, shown on the screen. */
  token: string
}

const KEYS: ToyKey[] = [
  { tone: 'duration', label: 'Duration', token: 'duration.base' },
  { tone: 'easing', label: 'Easing', token: 'easing.emphasized' },
  { tone: 'spring', label: 'Spring', token: 'spring.bouncy' },
  { tone: 'stagger', label: 'Stagger', token: 'stagger.loose' },
]

const STAGGER_BLOCKS = 5
/** First-load demo: play one key shortly after the page settles, so the first screen moves. */
const INTRO_DELAY_MS = 700

/**
 * The hero: a small instrument with one key per token family. Every key plays a real token
 * through a real primitive, so the first thing a visitor touches is the system itself.
 */
export function HeroToy() {
  const { tokens } = useMotionToken()
  const [active, setActive] = useState<Tone>('spring')
  const [atEnd, setAtEnd] = useState(false)
  const [replay, setReplay] = useState(0)

  const play = (tone: Tone) => {
    setActive(tone)
    setAtEnd((v) => !v)
    setReplay((r) => r + 1)
  }

  useEffect(() => {
    const id = window.setTimeout(() => setAtEnd(true), INTRO_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [])

  const readout: Record<Tone, string> = {
    duration: `${Math.round(tokens.duration.base)}ms`,
    easing: `[${tokens.easing.emphasized.join(', ')}]`,
    spring: `${Math.round(tokens.spring.bouncy.duration)}ms · bounce ${tokens.spring.bouncy.bounce}`,
    stagger: `${Math.round(tokens.stagger.loose)}ms apart`,
  }
  const key = KEYS.find((k) => k.tone === active) ?? KEYS[0]

  return (
    <div className="rounded-[1.75rem] border-2 border-ink bg-surface p-4 sm:p-5">
      {/* Screen */}
      <div className="rounded-2xl bg-ink p-4 text-paper">
        {/* Clipped so overshooting tokens stay inside the screen; the puck still rests at its ends. */}
        <div className="flex h-24 items-center overflow-hidden rounded-xl bg-paper/10 px-3">
          {active === 'stagger' ? (
            <Stagger key={replay} gap="loose" className="flex w-full justify-between">
              {Array.from({ length: STAGGER_BLOCKS }, (_, i) => (
                <StaggerItem key={i}>
                  <div className={cn('size-10 rounded-lg', TONES.stagger)} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <div className={cn('flex w-full', atEnd ? 'justify-end' : 'justify-start')}>
              <Puck tone={active} atEnd={atEnd} />
            </div>
          )}
        </div>
        <p className="mt-3 flex flex-wrap justify-between gap-x-4 font-mono text-sm" aria-live="polite">
          <span>{key.token}</span>
          <span className="text-paper/70 tabular-nums">{readout[active]}</span>
        </p>
      </div>

      {/* Keys */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {KEYS.map(({ tone, label }) => (
          <button
            key={tone}
            type="button"
            onClick={() => play(tone)}
            aria-label={`Play ${label.toLowerCase()}`}
            className={cn(
              'flex h-16 flex-col items-start justify-between rounded-xl p-2.5 text-left font-extrabold',
              'transition duration-(--duration-instant) ease-standard',
              'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-easing',
              TONES[tone],
              keyClasses,
            )}
          >
            <span aria-hidden="true" className={cn('size-2.5 rounded-full bg-ink', active !== tone && 'opacity-30')} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** The puck plays whichever token its key represents. */
function Puck({ tone, atEnd }: { tone: Exclude<Tone, 'stagger'>; atEnd: boolean }) {
  const className = cn('size-12 rounded-full', TONES[tone])
  if (tone === 'spring') return <Shuttle atEnd={atEnd} spring="bouncy" className={className} />
  if (tone === 'easing') return <Move duration="slow" ease="emphasized" className={className} />
  return <Move duration="base" className={className} />
}
