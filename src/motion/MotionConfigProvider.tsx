import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { MotionConfig, useReducedMotion as useOsReducedMotion } from 'motion/react'
import { motionTokens, scaleTokens, toCssVars } from '@/tokens'
import { MotionContext, defaultSettings, type MotionSettings } from './context'

export function MotionConfigProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MotionSettings>(defaultSettings)
  const osReducedMotion = useOsReducedMotion() ?? false
  const reducedMotion = osReducedMotion || settings.reducedMotion

  const tokens = useMemo(
    () => scaleTokens({ ...motionTokens, spring: settings.springs }, settings.timeScale),
    [settings.springs, settings.timeScale],
  )

  // Keep CSS variables in sync so CSS transitions follow the same live tokens.
  useLayoutEffect(() => {
    const root = document.documentElement
    for (const [name, value] of Object.entries(toCssVars(tokens))) {
      root.style.setProperty(name, value)
    }
  }, [tokens])

  // Lets CSS opt out of movement via the `full-motion:` variant (see styles/index.css).
  useLayoutEffect(() => {
    document.documentElement.toggleAttribute('data-reduced-motion', reducedMotion)
  }, [reducedMotion])

  const updateSettings = useCallback((patch: Partial<MotionSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetSettings = useCallback(() => setSettings(defaultSettings), [])

  const value = useMemo(
    () => ({ tokens, settings, updateSettings, resetSettings, reducedMotion, osReducedMotion }),
    [tokens, settings, updateSettings, resetSettings, reducedMotion, osReducedMotion],
  )

  return (
    <MotionContext.Provider value={value}>
      {/* Backup only. Primitives handle reduced motion themselves via useMotionToken,
          because Motion's setting alone doesn't stop layout animations. */}
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>{children}</MotionConfig>
    </MotionContext.Provider>
  )
}
