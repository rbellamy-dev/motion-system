import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Presence } from '@/motion'
import { Button } from '@/ui'
import { ControlPanel } from './ControlPanel'

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

/**
 * The controls on phones and tablets: a floating button that slides the panel up as a sheet,
 * so the settings are a tap away anywhere on the page instead of one block near the top.
 * The page stays where it was underneath, so you can change a setting and watch the demo it affects.
 */
export function ControlSheet() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const sheetId = useId()
  const close = () => setOpen(false)

  // While open: focus into the sheet, close on Escape, return focus to the button after.
  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      trigger?.focus()
    }
  }, [open])

  // Keep Tab inside the sheet while it's open.
  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !sheetRef.current) return
    const focusable = sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
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
    <>
      <Button
        ref={triggerRef}
        className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 shadow-lg"
        aria-expanded={open}
        aria-controls={sheetId}
        onClick={() => setOpen(true)}
      >
        Controls
      </Button>

      <Presence show={open} variant="fade" className="fixed inset-0 z-50 bg-screen/60">
        <div className="size-full" onClick={close} aria-hidden="true" />
      </Presence>

      <Presence
        show={open}
        variant="sheet"
        spring="gentle"
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[calc(100dvh-2rem)] max-w-xl overflow-y-auto"
      >
        <div ref={sheetRef} id={sheetId} role="dialog" aria-modal="true" aria-labelledby="controls-title" onKeyDown={trapFocus}>
          <ControlPanel
            onClose={close}
            className="rounded-b-none border-b-0 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          />
        </div>
      </Presence>
    </>
  )
}
