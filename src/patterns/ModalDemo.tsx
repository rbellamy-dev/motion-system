import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Presence } from '@/motion'
import { Button } from '@/ui'

export function ModalDemo() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const close = () => setOpen(false)

  // While open: focus the dialog's main action, close on Escape, return focus to the trigger after.
  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    confirmRef.current?.focus()

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      trigger?.focus()
    }
  }, [open])

  // Keep Tab inside the dialog while it's open.
  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="relative grid h-full place-items-center overflow-hidden">
      <Button ref={triggerRef} size="sm" className="absolute top-3 left-3" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <p aria-hidden="true" className="px-8 text-center text-sm text-muted">
        The dialog opens over this stage.
      </p>

      <Presence show={open} variant="fade" className="absolute inset-0 bg-ink/40">
        <div className="size-full" onClick={close} aria-hidden="true" />
      </Presence>

      <div className="pointer-events-none absolute inset-0 grid place-items-center p-6">
        <Presence show={open} variant="scale" spring="gentle" className="pointer-events-auto w-full max-w-xs">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onKeyDown={trapFocus}
            className="rounded-[1.25rem] border-2 border-ink bg-surface p-5"
          >
            <h3 id={titleId} className="text-lg font-extrabold">
              Publish changes?
            </h3>
            <p className="mt-1 text-muted">Your motion tokens will update across every product.</p>
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
