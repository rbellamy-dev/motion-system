import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { MotionConfig, useReducedMotion as useOsReducedMotion } from 'motion/react'
import { motionTokens, scaleTokens, toCssVars } from '@/tokens'
import { MotionContext, defaultSettings, type MotionContextValue, type MotionSettings, type SetToken } from './context'

export function MotionConfigProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MotionSettings>(defaultSettings)
  const osReducedMotion = useOsReducedMotion() ?? false
  const reducedMotion = osReducedMotion || settings.reducedMotion

  const tokens = useMemo(
    () => scaleTokens(settings.tokens, settings.timeScale),
    [settings.tokens, settings.timeScale],
  )

  // Development only: index.css repeats the motion values as first-paint fallbacks (Tailwind needs
  // them to create the ease-* classes). Warn if they ever drift from tokens.json.
  useLayoutEffect(() => {
    if (!import.meta.env.DEV) return
    const css = getComputedStyle(document.documentElement)
    for (const [name, value] of Object.entries(toCssVars(motionTokens))) {
      const fallback = css.getPropertyValue(name).trim()
      if (fallback && fallback.replace(/\s/g, '') !== value.replace(/\s/g, '')) {
        console.warn(`index.css fallback ${name} is "${fallback}" but tokens.json says "${value}". Update index.css.`)
      }
    }
  }, [])

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

  const updateSettings = useCallback<MotionContextValue['updateSettings']>((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const setToken = useCallback<SetToken>((group, name, value) => {
    setSettings((prev) => ({
      ...prev,
      tokens: { ...prev.tokens, [group]: { ...prev.tokens[group], [name]: value } },
    }))
  }, [])

  const resetTokens = useCallback<MotionContextValue['resetTokens']>((group) => {
    setSettings((prev) => ({
      ...prev,
      tokens: group ? { ...prev.tokens, [group]: motionTokens[group] } : motionTokens,
    }))
  }, [])

  const resetSettings = useCallback(() => setSettings(defaultSettings), [])

  const value = useMemo<MotionContextValue>(
    () => ({ tokens, settings, updateSettings, setToken, resetTokens, resetSettings, reducedMotion, osReducedMotion }),
    [tokens, settings, updateSettings, setToken, resetTokens, resetSettings, reducedMotion, osReducedMotion],
  )

  return (
    <MotionContext.Provider value={value}>
      {/* Backup only. Primitives handle reduced motion themselves via useMotionToken,
          because Motion's setting alone doesn't stop layout animations. */}
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>{children}</MotionConfig>
    </MotionContext.Provider>
  )
}
