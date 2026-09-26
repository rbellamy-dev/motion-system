// TEMPORARY: previews style directions. Remove this file, its <ThemeSwitcher /> in App,
// the themes.css import in main.tsx, and the extra fonts in index.html once a direction is chosen.
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

const THEMES = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'studio', label: 'Dark studio' },
  { id: 'blueprint', label: 'Blueprint' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'fold', label: 'Fold' },
] as const

type ThemeId = (typeof THEMES)[number]['id']

const STORAGE_KEY = 'motion-system:theme-preview'

function readStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return THEMES.some((t) => t.id === stored) ? (stored as ThemeId) : 'neutral'
  } catch {
    return 'neutral'
  }
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>(readStoredTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Preview still works without persistence.
    }
  }, [theme])

  return (
    <div
      role="radiogroup"
      aria-label="Style direction"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] gap-1 overflow-x-auto rounded-full bg-surface p-1 shadow-lg ring-1 ring-line"
    >
      {THEMES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={theme === id}
          onClick={() => setTheme(id)}
          className={cn(
            'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap',
            'transition-colors duration-(--duration-quick) ease-standard',
            'focus-visible:outline-2 focus-visible:outline-accent',
            theme === id ? 'bg-ink text-paper' : 'text-muted hover:text-ink',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
