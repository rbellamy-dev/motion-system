import { useEffect, useRef, useState } from 'react'
import { Stagger, StaggerItem } from '@/motion'
import { Button } from '@/ui'

interface Toast {
  id: number
  message: string
}

const MESSAGES = ['Tokens saved', 'Spring updated', 'Build passed', 'Theme published']
/** How long a toast stays readable. A product rule, not a motion token. */
const TOAST_LIFETIME_MS = 3000
const MAX_VISIBLE = 3

export function ToastDemo() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Set<number>())

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const dismiss = (id: number) => setToasts((prev) => prev.filter((toast) => toast.id !== id))

  const show = () => {
    const id = nextId.current++
    setToasts((prev) => [...prev, { id, message: MESSAGES[id % MESSAGES.length] }].slice(-MAX_VISIBLE))

    const timer = window.setTimeout(() => {
      timers.current.delete(timer)
      dismiss(id)
    }, TOAST_LIFETIME_MS)
    timers.current.add(timer)
  }

  return (
    <div className="relative h-full p-3">
      <Button size="sm" onClick={show}>
        Show toast
      </Button>

      {toasts.length === 0 && (
        <p
          aria-hidden="true"
          className="absolute inset-x-4 bottom-4 grid h-24 place-items-center rounded-xl border-2 border-dashed border-ink/25 text-sm text-muted"
        >
          Toasts stack here.
        </p>
      )}

      <Stagger role="status" aria-live="polite" className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
        {toasts.map((toast) => (
          <StaggerItem key={toast.id} spring="gentle">
            <div className="flex items-center justify-between rounded-xl border-2 border-ink bg-ink px-4 py-3 text-paper">
              <span>{toast.message}</span>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-md px-1 text-paper/70 transition-colors duration-(--duration-quick) ease-standard hover:text-paper focus-visible:outline-3 focus-visible:outline-easing"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}
