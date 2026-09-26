import { useId } from 'react'

interface SelectProps<T extends string> {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}

export function Select<T extends string>({ label, value, options, onChange }: SelectProps<T>) {
  const id = useId()

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-bold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-10 w-full rounded-xl border-2 border-ink bg-surface px-3 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-easing"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
