import { useRef, useState } from 'react'
import { Stagger, StaggerItem } from '@/motion'
import { Button } from '@/ui'

interface Item {
  id: number
  label: string
}

const LABELS = ['Design tokens', 'Primitives', 'Choreography', 'Reduced motion', 'Case study', 'Storybook', 'Deploy']
const INITIAL_COUNT = 4

const makeItem = (id: number): Item => ({ id, label: LABELS[id % LABELS.length] })

export function ListDemo() {
  const [items, setItems] = useState<Item[]>(() => Array.from({ length: INITIAL_COUNT }, (_, i) => makeItem(i)))
  const [replayKey, setReplayKey] = useState(0)
  const nextId = useRef(INITIAL_COUNT)

  const add = () => setItems((prev) => [...prev, makeItem(nextId.current++)])
  const remove = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id))

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div className="flex gap-2">
        <Button size="sm" onClick={add}>
          Add item
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setReplayKey((k) => k + 1)}>
          Replay stagger
        </Button>
      </div>

      <div className="relative min-h-0 flex-1">
        <Stagger key={replayKey} gap="loose" className="h-full overflow-y-auto">
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <div className="flex items-center justify-between border-b-2 border-ink/10 py-1 pr-1 pl-1">
                <span>{item.label}</span>
                <Button size="sm" variant="ghost" onClick={() => remove(item.id)} aria-label={`Remove ${item.label}`}>
                  ✕
                </Button>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {items.length === 0 && (
          <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-muted">
            All clear. Add an item to watch it arrive.
          </p>
        )}
      </div>
    </div>
  )
}
