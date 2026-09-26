import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { DurationToken } from '@/tokens'
import { useMotionToken } from './useMotionToken'

interface RevealProps {
  children: ReactNode
  className?: string
  duration?: DurationToken
  /** Wait until scrolled into view (once) instead of animating on mount. */
  inView?: boolean
}

/** Fades content up into place. For content appearing on page load or scroll. */
export function Reveal({ children, className, duration = 'slow', inView = false }: RevealProps) {
  const m = useMotionToken()
  const hidden = { opacity: 0, y: m.distance('md') }
  const shown = { opacity: 1, y: 0 }

  return (
    <motion.div
      className={className}
      initial={hidden}
      {...(inView
        ? { whileInView: shown, viewport: { once: true, amount: 0.2 } }
        : { animate: shown })}
      transition={m.tween(duration, 'enter')}
    >
      {children}
    </motion.div>
  )
}
