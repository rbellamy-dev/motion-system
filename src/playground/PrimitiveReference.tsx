import { useState, type ReactNode } from 'react'
import { Move, Presence, Reveal, Stagger, StaggerItem } from '@/motion'
import { cn } from '@/lib/cn'
import { Button } from '@/ui'
import { TONES, type Tone } from './tones'

const STAGGER_ROWS = ['w-full', 'w-4/5', 'w-11/12', 'w-3/5']

export function PrimitiveReference() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <RevealExample />
      <PresenceExample />
      <StaggerExample />
      <MoveExample />
    </div>
  )
}

function RevealExample() {
  const [replayKey, setReplayKey] = useState(0)

  return (
    <PrimitiveCard
      name="Reveal"
      tone="easing"
      description="Fades content up into place when it first appears, on load or on scroll."
      code={'<Reveal inView>…</Reveal>'}
      action={<ActionButton onClick={() => setReplayKey((k) => k + 1)}>Replay</ActionButton>}
    >
      <Reveal key={replayKey}>
        <Block tone="easing" />
      </Reveal>
    </PrimitiveCard>
  )
}

function PresenceExample() {
  const [show, setShow] = useState(true)

  return (
    <PrimitiveCard
      name="Presence"
      tone="spring"
      description="Mounts and unmounts content. Springs in, exits faster on the exit curve."
      code={'<Presence show={open} variant="scale">…</Presence>'}
      action={<ActionButton onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</ActionButton>}
    >
      <Presence show={show} variant="scale">
        <Block tone="spring" />
      </Presence>
    </PrimitiveCard>
  )
}

function StaggerExample() {
  const [replayKey, setReplayKey] = useState(0)

  return (
    <PrimitiveCard
      name="Stagger"
      tone="stagger"
      description="Animates a list. Items cascade in; removed items fade and siblings close the gap."
      code={'<Stagger gap="loose"><StaggerItem>…</StaggerItem></Stagger>'}
      action={<ActionButton onClick={() => setReplayKey((k) => k + 1)}>Replay</ActionButton>}
    >
      <Stagger key={replayKey} gap="loose" className="w-40 space-y-2">
        {STAGGER_ROWS.map((width) => (
          <StaggerItem key={width}>
            <div className={cn('h-3.5 rounded-full border border-line', TONES.stagger, width)} />
          </StaggerItem>
        ))}
      </Stagger>
    </PrimitiveCard>
  )
}

function MoveExample() {
  const [atEnd, setAtEnd] = useState(false)

  return (
    <PrimitiveCard
      name="Move"
      tone="spring"
      description="Glides an element to its new spot whenever the layout changes."
      code={'<Move spring="bouncy" />'}
      action={<ActionButton onClick={() => setAtEnd((v) => !v)}>Move</ActionButton>}
    >
      <div className={cn('flex w-full', atEnd ? 'justify-end' : 'justify-start')}>
        <Move spring="bouncy" className={cn('size-9 rounded-full border border-line', TONES.spring)} />
      </div>
    </PrimitiveCard>
  )
}

interface PrimitiveCardProps {
  name: string
  /** The token family this primitive mostly shows off. */
  tone: Tone
  description: string
  /** A one-line usage example. */
  code: string
  action: ReactNode
  children: ReactNode
}

/** Stage on top (controls top-left, like the pattern demos), explanation and usage below. */
function PrimitiveCard({ name, tone, description, code, action, children }: PrimitiveCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-line bg-surface">
      <div className="relative grid h-44 place-items-center border-b border-line bg-paper px-8">
        <div className="absolute top-3 left-3">{action}</div>
        {children}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className={cn('size-3 rounded-full border border-line', TONES[tone])} />
          <h3 className="text-xl font-medium">{name}</h3>
        </div>
        <p className="text-muted">{description}</p>
        <code className="mt-auto block font-mono text-sm wrap-break-word text-ink">
          <Highlighted code={code} />
        </code>
      </div>
    </article>
  )
}

/** Props whose value names a token, so `spring="bouncy"` shows "bouncy" in spring's colour. */
const TOKEN_PROPS: Partial<Record<string, Tone>> = { spring: 'spring', gap: 'stagger' }
const TONE_TEXT: Record<Tone, string> = {
  duration: 'text-duration',
  easing: 'text-easing',
  spring: 'text-spring',
  stagger: 'text-stagger',
}

// A tag opening, a prop with a value, a bare prop, a tag end, then anything else one character at a time.
const JSX_PART = /(<\/?)([A-Z]\w*)|(\w+)=("[^"]*"|\{[^}]*\})|(\w+)|(\/?>)|([\s\S])/g

/**
 * Highlights a one-line JSX example. Colour keeps its one meaning: only a token's name takes a colour,
 * its family's. Everything else is ink, with names brighter than the punctuation around them.
 */
function Highlighted({ code }: { code: string }) {
  const dim = 'text-muted/60'
  return [...code.matchAll(JSX_PART)].map((m) => {
    const [, open, tag, prop, value, bare, close, other] = m
    const key = m.index
    if (tag) {
      return (
        <span key={key}>
          <span className={dim}>{open}</span>
          <span className="font-medium">{tag}</span>
        </span>
      )
    }
    if (prop) {
      const tone = TOKEN_PROPS[prop]
      const inner = value.slice(1, -1)
      return (
        <span key={key}>
          <span className="text-muted">{prop}</span>
          <span className={dim}>={value[0]}</span>
          <span className={tone ? cn('font-medium', TONE_TEXT[tone]) : undefined}>{inner}</span>
          <span className={dim}>{value.at(-1)}</span>
        </span>
      )
    }
    if (bare) return <span key={key} className="text-muted">{bare}</span>
    if (close) return <span key={key} className={dim}>{close}</span>
    return <span key={key} className={other === '…' ? dim : undefined}>{other}</span>
  })
}

function ActionButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Button size="sm" variant="secondary" onClick={onClick}>
      {children}
    </Button>
  )
}

function Block({ tone }: { tone: Tone }) {
  return <div className={cn('h-14 w-32 rounded-xl border border-line', TONES[tone])} />
}
