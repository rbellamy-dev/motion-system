import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { DurationToken, EasingToken, SpringToken } from '@/tokens'
import { useMotionToken } from './useMotionToken'

type MoveTiming =
  | { spring: SpringToken; duration?: never; ease?: never }
  | { duration: DurationToken; ease?: EasingToken; spring?: never }

type MoveProps = MoveTiming & {
  children?: ReactNode
  className?: string
}

/**
 * Animates an element whenever its position in the layout changes.
 * Move it with normal CSS (e.g. change the parent's justify-content) and it glides there.
 */
export function Move({ children, className, ...timing }: MoveProps) {
  const m = useMotionToken()
  const transition = timing.spring ? m.spring(timing.spring) : m.tween(timing.duration, timing.ease)

  return (
    <motion.div layout={m.layout} className={className} transition={transition}>
      {children}
    </motion.div>
  )
}
