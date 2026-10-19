import { useEffect, useState } from 'react'
import { Move, Shuttle, Stagger, StaggerItem, useMotionToken } from '@/motion'
import { cn } from '@/lib/cn'
import { keyClasses } from '@/ui/Button'
import { TONE_BARS, TONES, type Tone } from './tones'

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
  const [pendingFlip, setPendingFlip] = useState(0)

  const play = (tone: Tone) => {
    setReplay((r) => r + 1)
    if (tone === active) {
      setAtEnd((v) => !v)
      return
    }
    // A different key mounts a different puck, which would appear already at its destination.
    // Mount it where the last one rested, then flip on the next frame so it has somewhere to travel from.
    setActive(tone)
    setPendingFlip((n) => n + 1)
  }

  useEffect(() => {
    if (!pendingFlip) return
    const id = requestAnimationFrame(() => setAtEnd((v) => !v))
    return () => cancelAnimationFrame(id)
  }, [pendingFlip])

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
    <div className="rounded-lg border border-line bg-surface p-4 sm:p-5">
      {/* Screen: the darkest step of the palette, with a scope grid behind the puck */}
      <div className="rounded-2xl bg-screen p-4 text-ink">
        {/* Clipped so overshooting tokens stay inside the screen; the puck still rests at its ends. */}
        <div className="screen-grid flex h-24 items-center lg:h-34 overflow-hidden rounded-xl bg-ink/3 px-3">
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
          <span className="text-muted tabular-nums">{readout[active]}</span>
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
              'flex min-h-16 flex-col items-start justify-between gap-1 rounded-xl p-2.5 text-left font-medium',
              'transition duration-(--duration-instant) ease-standard',
              'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-easing',
              'bg-surface text-ink hover:bg-paper',
              TONE_BARS[tone],
              keyClasses,
            )}
          >
            <span aria-hidden="true" className={cn('size-2.5 rounded-full', TONES[tone], active !== tone && 'opacity-30')} />
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
