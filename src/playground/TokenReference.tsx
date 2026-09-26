import type { ReactNode } from 'react'
import { Move, Stagger, StaggerItem, useMotionToken } from '@/motion'
import { cn } from '@/lib/cn'
import type { DurationToken, EasingToken, SpringToken, StaggerToken } from '@/tokens'
import { useLoop } from './useLoop'

const DURATIONS: DurationToken[] = ['instant', 'quick', 'base', 'slow']
const EASINGS: EasingToken[] = ['standard', 'enter', 'exit', 'emphasized']
const SPRINGS: SpringToken[] = ['snappy', 'gentle', 'bouncy']
const STAGGERS: StaggerToken[] = ['tight', 'loose']
const STAGGER_DOTS = 5
/** Each loop waits this many "slow" durations, so even the slowest demo finishes and rests. */
const LOOP_HOLD = 3

export function TokenReference() {
  const { tokens } = useMotionToken()
  const on = useLoop(tokens.duration.slow * LOOP_HOLD)

  return (
    <div className="space-y-8">
      <TokenGroup title="Duration" note="Same curve, different lengths. Small moves get short durations.">
        {DURATIONS.map((name) => (
          <TokenCard key={name} name={name} value={`${Math.round(tokens.duration[name])}ms`}>
            <Track on={on}>
              <Move duration={name} className="size-5 rounded-full bg-accent" />
            </Track>
          </TokenCard>
        ))}
      </TokenGroup>

      <TokenGroup title="Easing" note="Same duration (slow), different shapes. Watch where each one speeds up.">
        {EASINGS.map((name) => (
          <TokenCard key={name} name={name} value={`[${tokens.easing[name].join(', ')}]`}>
            <Track on={on}>
              <Move duration="slow" ease={name} className="size-5 rounded-full bg-accent" />
            </Track>
          </TokenCard>
        ))}
      </TokenGroup>

      <TokenGroup title="Spring" note="Physics for things the user directly moves. Bounce adds personality.">
        {SPRINGS.map((name) => (
          <TokenCard
            key={name}
            name={name}
            value={`${Math.round(tokens.spring[name].duration)}ms · bounce ${tokens.spring[name].bounce}`}
          >
            <Track on={on}>
              <Move spring={name} className="size-5 rounded-full bg-accent" />
            </Track>
          </TokenCard>
        ))}
      </TokenGroup>

      <TokenGroup title="Stagger" note="Delay between siblings. Keep the whole sequence short.">
        {STAGGERS.map((name) => (
          <TokenCard key={name} name={name} value={`${Math.round(tokens.stagger[name])}ms`}>
            {/* Changing the key remounts the list, replaying the stagger each loop. */}
            <Stagger key={String(on)} gap={name} className="flex h-10 items-center gap-2">
              {Array.from({ length: STAGGER_DOTS }, (_, i) => (
                <StaggerItem key={i}>
                  <div className="size-5 rounded-md bg-accent" />
                </StaggerItem>
              ))}
            </Stagger>
          </TokenCard>
        ))}
      </TokenGroup>
    </div>
  )
}

function TokenGroup({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted">{note}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  )
}

function TokenCard({ name, value, children }: { name: string; value: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-surface p-4 ring-1 ring-line">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <span className="font-mono text-sm font-medium">{name}</span>
        <span className="truncate font-mono text-xs text-muted">{value}</span>
      </div>
      {children}
    </div>
  )
}

/** A rail the dot travels along. `on` flips it between the two ends. */
function Track({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className={cn('flex h-10 items-center rounded-full bg-paper px-2.5', on ? 'justify-end' : 'justify-start')}>
      {children}
    </div>
  )
}
