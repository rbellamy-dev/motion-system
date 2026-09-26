import type { ReactNode, RefObject } from 'react'
import { Move, Stagger, StaggerItem, useMotionToken } from '@/motion'
import { cn } from '@/lib/cn'
import { tokenNames } from '@/tokens'
import { TONES, type Tone } from './tones'
import { usePreviewLoop } from './usePreviewLoop'

// Names come from tokens.json, so a new token shows up here automatically.
const DURATIONS = tokenNames('duration')
const EASINGS = tokenNames('easing')
const SPRINGS = tokenNames('spring')
const STAGGERS = tokenNames('stagger')
const STAGGER_DOTS = 5
/** Each loop waits this many "slow" durations, so even the slowest token finishes and rests. */
const LOOP_HOLD = 3

const ms = (v: number) => `${Math.round(v)}ms`

/**
 * One panel per token family. Every token in a family races on the same width of track,
 * started at the same moment, so the difference is visible side by side.
 */
export function TokenReference() {
  const { tokens } = useMotionToken()
  const interval = tokens.duration.slow * LOOP_HOLD

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <RacePanel tone="duration" title="Duration" note="Same curve, different lengths." interval={interval}>
        {(on) =>
          DURATIONS.map((name) => (
            <RaceRow key={name} name={name} value={ms(tokens.duration[name])}>
              <Track on={on}>
                <Move duration={name} className={cn(DOT, TONES.duration)} />
              </Track>
            </RaceRow>
          ))
        }
      </RacePanel>

      <RacePanel tone="easing" title="Easing" note="Same length, different shapes. Watch where each speeds up." interval={interval}>
        {(on) =>
          EASINGS.map((name) => (
            <RaceRow key={name} name={name} value={`[${tokens.easing[name].join(', ')}]`}>
              <Track on={on}>
                <Move duration="slow" ease={name} className={cn(DOT, TONES.easing)} />
              </Track>
            </RaceRow>
          ))
        }
      </RacePanel>

      <RacePanel tone="spring" title="Spring" note="Physics for things people move directly." interval={interval}>
        {(on) =>
          SPRINGS.map((name) => (
            <RaceRow
              key={name}
              name={name}
              value={`${ms(tokens.spring[name].duration)} · bounce ${tokens.spring[name].bounce}`}
            >
              <Track on={on}>
                <Move spring={name} className={cn(DOT, TONES.spring)} />
              </Track>
            </RaceRow>
          ))
        }
      </RacePanel>

      <RacePanel tone="stagger" title="Stagger" note="The gap between siblings. Keep the whole run short." interval={interval}>
        {(on) =>
          STAGGERS.map((name) => (
            <RaceRow key={name} name={name} value={ms(tokens.stagger[name])}>
              {/* Changing the key remounts the list, replaying the stagger each loop. */}
              <Stagger key={String(on)} gap={name} className="flex h-10 items-center gap-2">
                {Array.from({ length: STAGGER_DOTS }, (_, i) => (
                  <StaggerItem key={i}>
                    <div className={cn('size-6 rounded-md border-2 border-ink', TONES.stagger)} />
                  </StaggerItem>
                ))}
              </Stagger>
            </RaceRow>
          ))
        }
      </RacePanel>
    </div>
  )
}

const DOT = 'size-6 rounded-full border-2 border-ink'

interface RacePanelProps {
  tone: Tone
  title: string
  note: string
  interval: number
  children: (on: boolean) => ReactNode
}

function RacePanel({ tone, title, note, interval, children }: RacePanelProps) {
  const { ref, on } = usePreviewLoop(interval)

  return (
    <section ref={ref as RefObject<HTMLElement>} className="rounded-[1.25rem] border-2 border-ink bg-surface p-5">
      <div className="mb-5 flex items-start gap-3">
        <span aria-hidden="true" className={cn('mt-1 size-4 shrink-0 rounded-full border-2 border-ink', TONES[tone])} />
        <div>
          <h3 className="text-xl font-extrabold">{title}</h3>
          <p className="text-muted">{note}</p>
        </div>
      </div>
      <div className="space-y-3">{children(on)}</div>
    </section>
  )
}

function RaceRow({ name, value, children }: { name: string; value: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3">
      <div className="min-w-0">
        <p className="font-mono text-sm font-medium">{name}</p>
        <p className="font-mono text-xs wrap-break-word text-muted tabular-nums">{value}</p>
      </div>
      {children}
    </div>
  )
}

/** A rail the dot travels along. `on` flips it between the two ends. */
function Track({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className={cn('flex h-10 items-center rounded-full bg-paper px-2', on ? 'justify-end' : 'justify-start')}>
      {children}
    </div>
  )
}
