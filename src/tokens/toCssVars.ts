import type { MotionTokens } from './motion'

/**
 * Turns tokens into CSS custom properties, so CSS-only transitions
 * (e.g. `duration-(--duration-quick) ease-standard`) share the same timing as JS animations.
 */
export function toCssVars(tokens: MotionTokens): Record<string, string> {
  const vars: Record<string, string> = {}

  for (const [name, ms] of Object.entries(tokens.duration)) {
    vars[`--duration-${name}`] = `${ms}ms`
  }
  for (const [name, [x1, y1, x2, y2]] of Object.entries(tokens.easing)) {
    vars[`--ease-${name}`] = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
  }

  return vars
}
