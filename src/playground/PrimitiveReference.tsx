import { useState, type ReactNode } from 'react'
import { Move, Presence, Reveal, Stagger, StaggerItem } from '@/motion'
import { cn } from '@/lib/cn'
import { Button } from '@/ui'

const STAGGER_ROWS = ['w-full', 'w-4/5', 'w-11/12', 'w-3/5']

export function PrimitiveReference() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
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
      description="Fades content up into place when it first appears, on load or on scroll."
      code={'<Reveal inView>…</Reveal>'}
      action={<ActionButton onClick={() => setReplayKey((k) => k + 1)}>Replay</ActionButton>}
    >
      <Reveal key={replayKey}>
        <Block />
      </Reveal>
    </PrimitiveCard>
  )
}

function PresenceExample() {
  const [show, setShow] = useState(true)

  return (
    <PrimitiveCard
      name="Presence"
      description="Mounts and unmounts content. Springs in, exits faster on the exit curve."
      code={'<Presence show={open} variant="scale">…</Presence>'}
      action={<ActionButton onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</ActionButton>}
    >
      <Presence show={show} variant="scale">
        <Block />
      </Presence>
    </PrimitiveCard>
  )
}

function StaggerExample() {
  const [replayKey, setReplayKey] = useState(0)

  return (
    <PrimitiveCard
      name="Stagger"
      description="Animates a list. Items cascade in; removed items fade and siblings close the gap."
      code={'<Stagger gap="loose"><StaggerItem>…</StaggerItem></Stagger>'}
      action={<ActionButton onClick={() => setReplayKey((k) => k + 1)}>Replay</ActionButton>}
    >
      <Stagger key={replayKey} gap="loose" className="w-40 space-y-2">
        {STAGGER_ROWS.map((width) => (
          <StaggerItem key={width}>
            <div className={cn('h-3 rounded-full bg-accent', width)} />
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
      description="Glides an element to its new spot whenever the layout changes."
      code={'<Move spring="bouncy" />'}
      action={<ActionButton onClick={() => setAtEnd((v) => !v)}>Move</ActionButton>}
    >
      <div className={cn('flex w-full', atEnd ? 'justify-end' : 'justify-start')}>
        <Move spring="bouncy" className="size-8 rounded-full bg-accent" />
      </div>
    </PrimitiveCard>
  )
}

interface PrimitiveCardProps {
  name: string
  description: string
  /** A one-line usage example. */
  code: string
  action: ReactNode
  children: ReactNode
}

function PrimitiveCard({ name, description, code, action, children }: PrimitiveCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-surface ring-1 ring-line">
      <div className="px-4 pt-4">
        <h3 className="font-mono text-sm font-medium">{name}</h3>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <div className="m-4 grid h-36 place-items-center rounded-lg bg-paper px-6">{children}</div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line px-4 py-3">
        <code className="truncate font-mono text-xs text-muted" title={code}>
          {code}
        </code>
        {action}
      </div>
    </article>
  )
}

function ActionButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Button size="sm" variant="secondary" className="shrink-0" onClick={onClick}>
      {children}
    </Button>
  )
}

function Block() {
  return <div className="h-12 w-28 rounded-lg bg-accent" />
}
