import { createContext, useContext } from 'react'
import { motionTokens, type MotionTokens, type SpringConfig, type SpringToken } from '@/tokens'

/** The knobs the playground can turn. tokens.json stays the source of truth; these are live overrides. */
export interface MotionSettings {
  /** Multiplies every duration and stagger. 1 = as designed. */
  timeScale: number
  springs: Record<SpringToken, SpringConfig>
  /** Playground override. The OS "reduce motion" setting is always respected too. */
  reducedMotion: boolean
}

export const defaultSettings: MotionSettings = {
  timeScale: 1,
  springs: motionTokens.spring,
  reducedMotion: false,
}

export interface MotionContextValue {
  /** Tokens after settings are applied. Primitives read these, never tokens.json directly. */
  tokens: MotionTokens
  settings: MotionSettings
  updateSettings: (patch: Partial<MotionSettings>) => void
  resetSettings: () => void
  /** True if either the OS or the playground asks for reduced motion. */
  reducedMotion: boolean
  /** True only when the OS asks for reduced motion (the playground can't turn it off). */
  osReducedMotion: boolean
}

export const MotionContext = createContext<MotionContextValue | null>(null)

export function useMotionContext(): MotionContextValue {
  const context = useContext(MotionContext)
  if (!context) throw new Error('Motion hooks must be used inside <MotionConfigProvider>')
  return context
}
