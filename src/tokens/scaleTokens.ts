import type { MotionTokens } from './motion'

function mapValues<K extends string, V, R>(obj: Record<K, V>, fn: (value: V) => R): Record<K, R> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value as V)]),
  ) as Record<K, R>
}

/**
 * Stretches every time-based token by `timeScale`.
 * 1 = as designed, 2 = twice as slow (handy for inspecting motion), 0.5 = twice as fast.
 */
export function scaleTokens(tokens: MotionTokens, timeScale: number): MotionTokens {
  const scale = (ms: number) => ms * timeScale

  return {
    ...tokens,
    duration: mapValues(tokens.duration, scale),
    stagger: mapValues(tokens.stagger, scale),
    spring: mapValues(tokens.spring, (s) => ({ ...s, duration: scale(s.duration) })),
  }
}
