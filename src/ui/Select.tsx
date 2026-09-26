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
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 w-full rounded-lg bg-surface px-3 text-sm ring-1 ring-line focus-visible:outline-2 focus-visible:outline-accent"
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
