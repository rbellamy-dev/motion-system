import { useMotionContext } from './context'

/** True when the OS setting or the playground toggle asks for reduced motion. */
export function useReducedMotion(): boolean {
  return useMotionContext().reducedMotion
}
