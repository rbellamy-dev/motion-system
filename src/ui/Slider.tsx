import { useId, type CSSProperties } from 'react'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  format?: (value: number) => string
  /** Hide the visible label and value when the surrounding UI already shows them. Still labelled for screen readers. */
  hideLabel?: boolean
}

export function Slider({ label, value, min, max, step, onChange, format = String, hideLabel = false }: SliderProps) {
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
      aria-label={hideLabel ? label : undefined}
      aria-valuetext={format(value)}
      // --fill drives the orange filled part of the track (styled in styles/index.css, .range).
      style={{ '--fill': `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
      className="range w-full focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-easing"
    />
  )

  if (hideLabel) return input

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
