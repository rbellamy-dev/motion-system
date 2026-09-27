import type { ReactNode } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import type { DistanceToken, SpringToken, StaggerToken } from '@/tokens'
import { useMotionToken } from './useMotionToken'

interface StaggerProps {
  children: ReactNode
  /** Delay between each item on first render. */
  gap?: StaggerToken
  className?: string
  role?: string
  'aria-live'?: 'polite' | 'assertive' | 'off'
}

/**
 * An animated list. Items stagger in on mount; items added later animate in,
 * removed items animate out and their siblings slide into the gap.
 * Children should be <StaggerItem> elements with stable keys.
 */
export function Stagger({ children, gap = 'tight', className, ...aria }: StaggerProps) {
  const m = useMotionToken()
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: m.stagger(gap) } },
  }

  return (
    <motion.ul className={className} variants={variants} initial="hidden" animate="visible" {...aria}>
      <AnimatePresence>{children}</AnimatePresence>
    </motion.ul>
  )
}

interface StaggerItemProps {
  children: ReactNode
  spring?: SpringToken
  /** How far each item rises as it enters. Small by default; larger makes a cascade easier to see. */
  distance?: DistanceToken
  className?: string
}

export function StaggerItem({ children, spring = 'snappy', distance = 'sm', className }: StaggerItemProps) {
  const m = useMotionToken()
  // Only `hidden` / `visible` are variants, so they're inherited from <Stagger> (which staggers them).
  // `exit` must stay an object: giving an item any variant *label* of its own makes Motion stop
  // inheriting from the parent, and the items would render without animating.
  const variants: Variants = {
    hidden: { opacity: 0, y: m.distance(distance) },
    visible: { opacity: 1, y: 0, transition: m.spring(spring) },
  }

  return (
    <motion.li
      className={className}
      layout={m.layout}
      variants={variants}
      exit={{ opacity: 0, scale: m.scale('subtle'), transition: m.tween('quick', 'exit') }}
      transition={m.spring(spring)}
    >
      {children}
    </motion.li>
  )
}
