import { useId } from 'react'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  format?: (value: number) => string
}

export function Slider({ label, value, min, max, step, onChange, format = String }: SliderProps) {
  const id = useId()

  const input = (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-valuetext={format(value)}
      className="w-full accent-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-easing"
    />
  )

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-bold">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm text-muted tabular-nums">
          {format(value)}
        </output>
      </div>
      {input}
    </div>
  )
}
