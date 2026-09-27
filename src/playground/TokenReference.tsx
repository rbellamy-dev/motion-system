import { useState, type ReactNode, type RefObject } from 'react'
import { Move, Presence, Stagger, StaggerItem, useMotionContext, useMotionToken } from '@/motion'
import { cn } from '@/lib/cn'
import { countChangedTokens, isTokenChanged, tokenNames, type TokenGroup } from '@/tokens'
import { Button, CurveEditor, Slider } from '@/ui'
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
 * Panels stack full width, so "Tune" can put each token's control on the same row as its race
 * without anything reflowing.
 */
export function TokenReference() {
  const { tokens: live } = useMotionToken()
  const { settings, setToken, resetTokens } = useMotionContext()
  const base = settings.tokens
  const [tuning, setTuning] = useState<TokenGroup | null>(null)
  const interval = live.duration.slow * LOOP_HOLD

  const tuneProps = (group: TokenGroup): TuneProps => ({
    open: tuning === group,
    onToggle: () => setTuning((current) => (current === group ? null : group)),
    changed: countChangedTokens(base, group),
    onReset: () => resetTokens(group),
  })
  // A row's control, only while its family is being tuned.
  const control = (group: TokenGroup, node: ReactNode) => (tuning === group ? node : undefined)

  return (
    <div className="space-y-5">
      <RacePanel tone="duration" title="Duration" note="Same curve, different lengths." interval={interval} tune={tuneProps('duration')}>
        {(on) =>
          DURATIONS.map((name) => (
            <RaceRow
              key={name}
              name={name}
              value={ms(live.duration[name])}
              changed={isTokenChanged(base, 'duration', name)}
              control={control(
                'duration',
                <Slider
                  hideLabel
                  label={`${name} duration`}
                  value={base.duration[name]}
                  min={20}
                  max={1000}
                  step={10}
                  format={ms}
                  onChange={(value) => setToken('duration', name, value)}
                />,
              )}
            >
              <Track on={on}>
                <Move duration={name} className={cn(DOT, TONES.duration)} />
              </Track>
            </RaceRow>
          ))
        }
      </RacePanel>

      <RacePanel
        tone="easing"
        title="Easing"
        note="Same length, different shapes. Watch where each speeds up."
        interval={interval}
        tune={tuneProps('easing')}
      >
        {(on) =>
          EASINGS.map((name) => (
            <RaceRow
              key={name}
              name={name}
              value={`[${live.easing[name].join(', ')}]`}
              changed={isTokenChanged(base, 'easing', name)}
              controlFirst
              control={control(
                'easing',
                <CurveEditor
                  label={name}
                  value={base.easing[name]}
                  onChange={(curve) => setToken('easing', name, curve)}
                  className="size-28 sm:size-36"
                />,
              )}
            >
              <Track on={on}>
                <Move duration="slow" ease={name} className={cn(DOT, TONES.easing)} />
              </Track>
            </RaceRow>
          ))
        }
      </RacePanel>

      <RacePanel tone="spring" title="Spring" note="Physics for things people move directly." interval={interval} tune={tuneProps('spring')}>
        {(on) =>
          SPRINGS.map((name) => {
            const spring = base.spring[name]
            return (
              <RaceRow
                key={name}
                name={name}
                value={`${ms(live.spring[name].duration)} · bounce ${live.spring[name].bounce}`}
                changed={isTokenChanged(base, 'spring', name)}
                control={control(
                  'spring',
                  <div className="grid grid-cols-2 gap-4">
                    <Slider
                      label="Duration"
                      value={spring.duration}
                      min={100}
                      max={1000}
                      step={25}
                      format={ms}
                      onChange={(duration) => setToken('spring', name, { ...spring, duration })}
                    />
                    <Slider
                      label="Bounce"
                      value={spring.bounce}
                      min={0}
                      max={0.8}
                      step={0.05}
                      format={(v) => v.toFixed(2)}
                      onChange={(bounce) => setToken('spring', name, { ...spring, bounce })}
                    />
                  </div>,
                )}
              >
                <Track on={on}>
                  <Move spring={name} className={cn(DOT, TONES.spring)} />
                </Track>
              </RaceRow>
            )
          })
        }
      </RacePanel>

      <RacePanel tone="stagger" title="Stagger" note="The gap between siblings. Keep the whole run short." interval={interval} tune={tuneProps('stagger')}>
        {(on) =>
          STAGGERS.map((name) => (
            <RaceRow
              key={name}
              name={name}
              value={ms(live.stagger[name])}
              changed={isTokenChanged(base, 'stagger', name)}
              control={control(
                'stagger',
                <Slider
                  hideLabel
                  label={`${name} stagger`}
                  value={base.stagger[name]}
                  min={0}
                  max={200}
                  step={5}
                  format={ms}
                  onChange={(value) => setToken('stagger', name, value)}
                />,
              )}
            >
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

interface TuneProps {
  open: boolean
  onToggle: () => void
  /** How many tokens in this family differ from tokens.json. */
  changed: number
  onReset: () => void
}

interface RacePanelProps {
  tone: Tone
  title: string
  note: string
  interval: number
  /** Omit for families that can't be tuned yet. */
  tune?: TuneProps
  children: (on: boolean) => ReactNode
}

function RacePanel({ tone, title, note, interval, tune, children }: RacePanelProps) {
  const { ref, on } = usePreviewLoop(interval)

  return (
    <section
      ref={ref as RefObject<HTMLElement>}
      className="rounded-[1.25rem] border-2 border-ink bg-surface p-5"
    >
      <div className="mb-5 flex flex-wrap items-start gap-3">
        <span aria-hidden="true" className={cn('mt-1 size-4 shrink-0 rounded-full border-2 border-ink', TONES[tone])} />
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-extrabold">{title}</h3>
          <p className="text-muted">{note}</p>
        </div>
        {tune && (
          <div className="flex shrink-0 items-center gap-2">
            {tune.open && tune.changed > 0 && (
              <>
                <span className="text-sm text-muted">{tune.changed} changed</span>
                <Button size="sm" variant="ghost" onClick={tune.onReset}>
                  Reset
                </Button>
              </>
            )}
            <Button size="sm" variant={tune.open ? 'primary' : 'secondary'} aria-expanded={tune.open} onClick={tune.onToggle}>
              {tune.open ? 'Done' : 'Tune'}
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">{children(on)}</div>
    </section>
  )
}

/**
 * Name and value share one line above a full-width track. While tuning, the row's control
 * sits beside the race on wide screens and just under it on narrow ones.
 */
function RaceRow({
  name,
  value,
  changed = false,
  control,
  controlFirst = false,
  children,
}: {
  name: string
  value: string
  changed?: boolean
  control?: ReactNode
  /** Put the control before the race (for tall controls like the curve editor), vertically centred. */
  controlFirst?: boolean
  children: ReactNode
}) {
  const race = (
    <div className="min-w-0 space-y-1.5">
      {/* The value drops under the name only when the row is too narrow for both. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="flex items-center gap-1.5 font-mono text-sm font-medium">
          {name}
          {changed && (
            <>
              <span aria-hidden="true" className="size-2 rounded-full bg-accent ring-2 ring-ink" />
              <span className="sr-only">(changed)</span>
            </>
          )}
        </p>
        <p className="font-mono text-xs whitespace-nowrap text-muted tabular-nums">{value}</p>
      </div>
      {children}
    </div>
  )

  if (!control) return race

  if (controlFirst) {
    return (
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:gap-6">
        <Presence show variant="fade">
          {control}
        </Presence>
        {race}
      </div>
    )
  }

  return (
    <div className="grid items-end gap-x-10 gap-y-3 lg:grid-cols-2">
      {race}
      <Presence show variant="fade" className="pb-2">
        {control}
      </Presence>
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
