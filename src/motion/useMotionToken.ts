import { useMemo } from 'react'
import type { Transition } from 'motion/react'
import type {
  DistanceToken,
  DurationToken,
  EasingToken,
  ScaleToken,
  SpringToken,
  StaggerToken,
} from '@/tokens'
import { useMotionContext } from './context'

const toSeconds = (ms: number) => ms / 1000

/**
 * Turns token names into Motion transitions.
 * This is the only place token values become animation config, so reduced motion
 * is handled once: every transition collapses to a short fade, nothing travels or scales,
 * and layout changes snap instead of gliding.
 */
export function useMotionToken() {
  const { tokens, reducedMotion } = useMotionContext()

  return useMemo(() => {
    const fade: Transition = {
      duration: toSeconds(tokens.duration.quick),
      ease: tokens.easing.standard,
    }

    return {
      tokens,
      reducedMotion,
      tween: (d: DurationToken, e: EasingToken = 'standard'): Transition =>
        reducedMotion
          ? fade
          : { duration: toSeconds(tokens.duration[d]), ease: tokens.easing[e] },
      spring: (s: SpringToken): Transition =>
        reducedMotion
          ? fade
          : {
              type: 'spring',
              visualDuration: toSeconds(tokens.spring[s].duration),
              bounce: tokens.spring[s].bounce,
            },
      /** Seconds between siblings. */
      stagger: (s: StaggerToken) => (reducedMotion ? 0 : toSeconds(tokens.stagger[s])),
      /** Pixels to travel. */
      distance: (d: DistanceToken) => (reducedMotion ? 0 : tokens.distance[d]),
      /** Starting scale. */
      scale: (s: ScaleToken) => (reducedMotion ? 1 : tokens.scale[s]),
      /** Whether layout changes should glide. Off in reduced motion, so things snap into place. */
      layout: !reducedMotion,
    }
  }, [tokens, reducedMotion])
}
