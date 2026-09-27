import { createContext, useContext } from 'react'
import { motionTokens, type MotionTokens, type TokenGroup } from '@/tokens'

/** The knobs the playground can turn. tokens.json stays the source of truth; these are live overrides. */
export interface MotionSettings {
  /** An editable copy of the tokens. Starts as tokens.json; reset returns to it. */
  tokens: MotionTokens
  /** Multiplies every duration and stagger. 1 = as designed. Playback only, never part of the tokens. */
  timeScale: number
  /** Playground override. The OS "reduce motion" setting is always respected too. */
  reducedMotion: boolean
}

export const defaultSettings: MotionSettings = {
  tokens: motionTokens,
  timeScale: 1,
  reducedMotion: false,
}

export type SetToken = <G extends TokenGroup, N extends keyof MotionTokens[G]>(
  group: G,
  name: N,
  value: MotionTokens[G][N],
) => void

export interface MotionContextValue {
  /** Tokens after settings are applied. Primitives read these, never tokens.json directly. */
  tokens: MotionTokens
  settings: MotionSettings
  updateSettings: (patch: Partial<Omit<MotionSettings, 'tokens'>>) => void
  /** Overrides one token, e.g. setToken('duration', 'quick', 180). */
  setToken: SetToken
  /** Returns one token family (or all tokens) to the values in tokens.json. */
  resetTokens: (group?: TokenGroup) => void
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
