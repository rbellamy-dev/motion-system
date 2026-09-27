import { useId } from 'react'
import { cn } from '@/lib/cn'

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  disabled?: boolean
}

export function Toggle({ label, checked, onChange, description, disabled }: ToggleProps) {
  const labelId = useId()
  const descriptionId = useId()

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p id={labelId} className="font-bold">
          {label}
        </p>
        {description && (
          <p id={descriptionId} className="mt-0.5 text-sm text-muted">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full border-2 border-ink',
          // An invisible 8px margin around the switch makes its tap area 44px tall.
          "before:absolute before:-inset-2 before:content-['']",
          'transition-colors duration-(--duration-quick) ease-standard',
          'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-easing',
          'disabled:opacity-50',
          checked ? 'bg-accent' : 'bg-paper',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-5 rounded-full border-2 border-ink bg-surface',
            'full-motion:transition-transform full-motion:duration-(--duration-quick) full-motion:ease-standard',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </div>
  )
}
