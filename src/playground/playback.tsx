import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * Controls the playground's looping previews. Separate from the motion system on purpose:
 * pausing demos is a page concern, not something primitives need to know about.
 */
interface PlaybackValue {
  /** The viewer asked to stop looping previews (WCAG 2.2.2: moving content must be pausable). */
  paused: boolean
  setPaused: (paused: boolean) => void
  /** Loops may run: not paused and the tab is visible. */
  running: boolean
}

const PlaybackContext = createContext<PlaybackValue | null>(null)

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible')

  useEffect(() => {
    const onChange = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  const value = useMemo(() => ({ paused, setPaused, running: !paused && pageVisible }), [paused, pageVisible])

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>
}

export function usePlayback(): PlaybackValue {
  const context = useContext(PlaybackContext)
  if (!context) throw new Error('usePlayback must be used inside <PlaybackProvider>')
  return context
}
