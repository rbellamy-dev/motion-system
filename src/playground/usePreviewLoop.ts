import { useEffect, useRef, useState } from 'react'
import { usePlayback } from './playback'

/**
 * Flips a boolean every `intervalMs` so a preview can loop, but only while it's on screen,
 * the tab is visible and the viewer hasn't paused previews. Attach `ref` to the preview's container.
 */
export function usePreviewLoop<T extends Element = HTMLDivElement>(intervalMs: number) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const [on, setOn] = useState(false)
  const { running } = usePlayback()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || !running) return
    const id = window.setInterval(() => setOn((prev) => !prev), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, inView, running])

  return { ref, on }
}
