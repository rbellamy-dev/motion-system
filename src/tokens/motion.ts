/**
 * Motion tokens: the single source of truth for how things move.
 * Everything else (CSS variables, primitives, demos) reads from here.
 * Times are in milliseconds; the motion layer converts them to seconds.
 */

export type CubicBezier = readonly [number, number, number, number]

export interface SpringConfig {
  /** How long the spring *appears* to take, in ms. */
  duration: number
  /** 0 = no overshoot, 1 = very bouncy. */
  bounce: number
}

/** How long a transition takes. Bigger elements and bigger moves get longer durations. */
export const duration = {
  instant: 80,
  quick: 160,
  base: 240,
  slow: 400,
} as const

/** The shape of a transition over time. */
export const easing = {
  /** Things moving within the screen. */
  standard: [0.2, 0, 0, 1],
  /** Things arriving: start fast, settle gently. */
  enter: [0, 0, 0.2, 1],
  /** Things leaving: start gently, accelerate away. */
  exit: [0.4, 0, 1, 1],
  /** Hero moments that deserve extra attention. */
  emphasized: [0.05, 0.7, 0.1, 1],
} as const satisfies Record<string, CubicBezier>

/** Physics-based motion for things the user directly causes. */
export const spring = {
  snappy: { duration: 200, bounce: 0 },
  gentle: { duration: 400, bounce: 0.1 },
  bouncy: { duration: 450, bounce: 0.4 },
} as const satisfies Record<string, SpringConfig>

/** Delay between siblings entering one after another. */
export const stagger = {
  tight: 30,
  loose: 60,
} as const

/** How far things travel when entering or leaving, in px. */
export const distance = {
  sm: 8,
  md: 16,
} as const

/** Starting scale for things that grow into place (1 = full size). */
export const scale = {
  subtle: 0.96,
} as const

export type DurationToken = keyof typeof duration
export type EasingToken = keyof typeof easing
export type SpringToken = keyof typeof spring
export type StaggerToken = keyof typeof stagger
export type DistanceToken = keyof typeof distance
export type ScaleToken = keyof typeof scale

export interface MotionTokens {
  duration: Record<DurationToken, number>
  easing: Record<EasingToken, CubicBezier>
  spring: Record<SpringToken, SpringConfig>
  stagger: Record<StaggerToken, number>
  distance: Record<DistanceToken, number>
  scale: Record<ScaleToken, number>
}

export const motionTokens: MotionTokens = { duration, easing, spring, stagger, distance, scale }
