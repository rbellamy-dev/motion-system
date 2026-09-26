import { useEffect, useId, useRef, useState } from 'react'
import { Presence } from '@/motion'
import { Button } from '@/ui'

export function ModalDemo() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const close = () => setOpen(false)

  // While open: focus the dialog's main action, close on Escape, return focus to the trigger after.
  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    confirmRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      trigger?.focus()
    }
  }, [open])

  return (
    <div className="relative grid h-full place-items-center overflow-hidden">
      <Button ref={triggerRef} onClick={() => setOpen(true)}>
        Open modal
      </Button>

      <Presence show={open} variant="fade" className="absolute inset-0 bg-black/30">
        <div className="size-full" onClick={close} aria-hidden="true" />
      </Presence>

      <div className="pointer-events-none absolute inset-0 grid place-items-center p-6">
        <Presence show={open} variant="scale" spring="gentle" className="pointer-events-auto w-full max-w-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="rounded-2xl bg-surface p-5 shadow-xl ring-1 ring-line"
          >
            <h3 id={titleId} className="font-semibold">
              Publish changes?
            </h3>
            <p className="mt-1 text-sm text-muted">Your motion tokens will update across every product.</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={close}>
                Cancel
              </Button>
              <Button ref={confirmRef} size="sm" onClick={close}>
                Publish
              </Button>
            </div>
          </div>
        </Presence>
      </div>
    </div>
  )
}
