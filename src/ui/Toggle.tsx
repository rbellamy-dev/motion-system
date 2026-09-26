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
        <p id={labelId} className="text-sm font-medium">
          {label}
        </p>
        {description && (
          <p id={descriptionId} className="mt-0.5 text-xs text-muted">
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
          'relative h-6 w-10 shrink-0 rounded-full',
          'transition-colors duration-(--duration-quick) ease-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          'disabled:opacity-50',
          checked ? 'bg-accent' : 'bg-line',
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 size-4 rounded-full bg-surface shadow-sm',
            'full-motion:transition-transform full-motion:duration-(--duration-quick) full-motion:ease-standard',
            checked && 'translate-x-4',
          )}
        />
      </button>
    </div>
  )
}
