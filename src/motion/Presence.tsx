import type { ReactNode } from 'react'
import { AnimatePresence, motion, type TargetAndTransition } from 'motion/react'
import type { SpringToken } from '@/tokens'
import { useMotionToken } from './useMotionToken'

export type PresenceVariant = 'fade' | 'rise' | 'scale'

interface PresenceProps {
  show: boolean
  children: ReactNode
  variant?: PresenceVariant
  /** Spring used on the way in. The way out is always a quick exit tween. */
  spring?: SpringToken
  className?: string
}

/**
 * Mounts and unmounts content with an enter and exit animation.
 * Choreography rule baked in: enter with a spring, leave faster with an exit curve.
 */
export function Presence({ show, children, variant = 'rise', spring = 'snappy', className }: PresenceProps) {
  const m = useMotionToken()

  const hiddenStates: Record<PresenceVariant, TargetAndTransition> = {
    fade: { opacity: 0 },
    rise: { opacity: 0, y: m.distance('md') },
    scale: { opacity: 0, scale: m.scale('subtle') },
  }
  const hidden = hiddenStates[variant]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={className}
          initial={hidden}
          animate={{ opacity: 1, y: 0, scale: 1, transition: m.spring(spring) }}
          exit={{ ...hidden, transition: m.tween('quick', 'exit') }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
