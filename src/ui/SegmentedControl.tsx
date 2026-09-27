import { useId } from 'react'
import { cn } from '@/lib/cn'

interface SegmentedControlProps<T extends string> {
  /** Names the group for screen readers. */
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
  className?: string
}

/** A row of mutually exclusive options. Native radios underneath, so arrow keys and screen readers just work. */
export function SegmentedControl<T extends string>({ label, value, options, onChange, className }: SegmentedControlProps<T>) {
  const name = useId()

  return (
    <fieldset className={cn('flex rounded-xl border-2 border-ink bg-surface p-1', className)}>
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <label key={option.value} className="relative flex-1">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span
            className={cn(
              'block cursor-pointer rounded-lg px-3 py-1.5 text-center font-bold whitespace-nowrap coarse:py-2.5',
              'transition-colors duration-(--duration-instant) ease-standard',
              'peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-easing',
              value === option.value ? 'bg-ink text-paper' : 'text-muted hover:text-ink',
            )}
          >
            {option.label}
          </span>
        </label>
      ))}
    </fieldset>
  )
}
