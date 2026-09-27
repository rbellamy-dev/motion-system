import { useEffect, useLayoutEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import type { SpringToken } from '@/tokens'
import { useMotionToken } from './useMotionToken'

interface ShuttleProps {
  /** Which end of the track the element should be at. */
  atEnd: boolean
  spring: SpringToken
  /** Classes for the moving element itself (size, colour, shape). */
  className?: string
}

/** Folds progress past either end back inside, like a ball rebounding off a wall. */
function reflect(progress: number) {
  if (progress > 1) return 2 - progress
  if (progress < 0) return -progress
  return progress
}

/**
 * Moves an element between the two ends of its container with a spring token.
 * A bouncy spring would carry it past the end; instead that overshoot is mirrored back inward,
 * so the element rebounds off the end and never leaves its track. The rebound is exactly as
 * large as the overshoot would have been, so bouncier springs still visibly bounce more.
 */
export function Shuttle({ atEnd, spring, className }: ShuttleProps) {
  const m = useMotionToken()
  const trackRef = useRef<HTMLDivElement>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const progress = useMotionValue(atEnd ? 1 : 0)
  const travel = useMotionValue(0)
  const x = useTransform(() => reflect(progress.get()) * travel.get())

  // How far the element can travel: the track's width minus its own. Kept up to date on resize.
  useLayoutEffect(() => {
    const track = trackRef.current
    const element = elementRef.current
    if (!track || !element) return
    const measure = () => travel.set(Math.max(0, track.clientWidth - element.offsetWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [travel])

  useEffect(() => {
    const target = atEnd ? 1 : 0
    // Reduced motion: no travel at all, the element simply appears at the other end.
    if (m.reducedMotion) {
      progress.jump(target)
      return
    }
    const controls = animate(progress, target, m.spring(spring))
    return () => controls.stop()
  }, [atEnd, spring, m, progress])

  return (
    <div ref={trackRef} className="flex w-full items-center">
      <motion.div ref={elementRef} style={{ x }} className={className} />
    </div>
  )
}
