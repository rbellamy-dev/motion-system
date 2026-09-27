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
            <div className={cn('h-3.5 rounded-full border-2 border-ink', TONES.stagger, width)} />
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
        <Move spring="bouncy" className={cn('size-9 rounded-full border-2 border-ink', TONES.spring)} />
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
    <article className="flex flex-col overflow-hidden rounded-[1.25rem] border-2 border-ink bg-surface">
      <div className="relative grid h-44 place-items-center border-b-2 border-ink bg-paper px-8">
        <div className="absolute top-3 left-3">{action}</div>
        {children}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className={cn('size-3 rounded-full border-2 border-ink', TONES[tone])} />
          <h3 className="font-mono font-medium">{name}</h3>
        </div>
        <p className="text-muted">{description}</p>
        <code className="mt-auto block font-mono text-sm wrap-break-word text-ink/80">{code}</code>
      </div>
    </article>
  )
}

function ActionButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Button size="sm" variant="secondary" onClick={onClick}>
      {children}
    </Button>
  )
}

function Block({ tone }: { tone: Tone }) {
  return <div className={cn('h-14 w-32 rounded-xl border-2 border-ink', TONES[tone])} />
}
