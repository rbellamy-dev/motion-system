import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { cn } from '@/lib/cn'

export type Curve = readonly [number, number, number, number]

interface CurveEditorProps {
  /** Names the curve for screen readers, e.g. "enter". */
  label: string
  value: Curve
  onChange: (curve: [number, number, number, number]) => void
  className?: string
}

// SVG units. The plot is inset so handles can overshoot above 1 and below 0.
const SIZE = 100
const PAD = 22
const PLOT = SIZE - PAD * 2

// x must stay in [0, 1] for a valid CSS cubic-bezier; y may overshoot for anticipation and overshoot.
const X_MIN = 0
const X_MAX = 1
const Y_MIN = -0.5
const Y_MAX = 1.5
const STEP = 0.01
const BIG_STEP = 0.1

const toX = (x: number) => PAD + x * PLOT
const toY = (y: number) => PAD + (1 - y) * PLOT
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const round = (v: number) => Math.round(v * 100) / 100

type HandleIndex = 0 | 1
const HANDLE_NAMES = ['first handle', 'second handle'] as const

/**
 * A cubic-bezier editor: drag either handle to reshape the curve.
 * Keyboard: Tab to a handle, arrows move it by 0.01, Shift + arrows by 0.1.
 * Time runs left to right, progress bottom to top.
 */
export function CurveEditor({ label, value, onChange, className }: CurveEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<HandleIndex | null>(null)

  const points = [
    { x: value[0], y: value[1] },
    { x: value[2], y: value[3] },
  ]

  const moveHandle = (index: HandleIndex, x: number, y: number) => {
    const next = [...value] as [number, number, number, number]
    next[index * 2] = round(clamp(x, X_MIN, X_MAX))
    next[index * 2 + 1] = round(clamp(y, Y_MIN, Y_MAX))
    onChange(next)
  }

  /** Screen position → curve coordinates, using the SVG's rendered size. */
  const fromPointer = (e: PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect()
    const vx = ((e.clientX - rect.left) / rect.width) * SIZE
    const vy = ((e.clientY - rect.top) / rect.height) * SIZE
    return { x: (vx - PAD) / PLOT, y: 1 - (vy - PAD) / PLOT }
  }

  const onPointerDown = (index: HandleIndex) => (e: PointerEvent<SVGGElement>) => {
    // Stop the browser from starting a text selection when the drag leaves the graph.
    e.preventDefault()
    // Capture keeps the drag alive even if the pointer leaves the handle or the graph.
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.focus()
    setDragging(index)
  }

  const onPointerMove = (index: HandleIndex) => (e: PointerEvent<SVGGElement>) => {
    if (dragging !== index) return
    const { x, y } = fromPointer(e)
    moveHandle(index, x, y)
  }

  const onKeyDown = (index: HandleIndex) => (e: KeyboardEvent<SVGGElement>) => {
    const step = e.shiftKey ? BIG_STEP : STEP
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    }
    const move = delta[e.key]
    if (!move) return
    e.preventDefault()
    moveHandle(index, points[index].x + move[0], points[index].y + move[1])
  }

  const start = { x: toX(0), y: toY(0) }
  const end = { x: toX(1), y: toY(1) }
  const [p1, p2] = points.map((p) => ({ x: toX(p.x), y: toY(p.y) }))

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="group"
      aria-label={`${label} curve: cubic-bezier(${value.join(', ')})`}
      className={cn('size-36 shrink-0 touch-none overflow-visible rounded-xl bg-paper select-none', className)}
    >
      {/* Plot frame and the linear reference line */}
      <rect x={PAD} y={PAD} width={PLOT} height={PLOT} fill="none" className="stroke-ink/15" strokeWidth={1} />
      <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} className="stroke-ink/15" strokeDasharray="3 3" />

      {/* Arms from each end of the curve to its handle */}
      <line x1={start.x} y1={start.y} x2={p1.x} y2={p1.y} className="stroke-ink/60" strokeWidth={1.5} />
      <line x1={end.x} y1={end.y} x2={p2.x} y2={p2.y} className="stroke-ink/60" strokeWidth={1.5} />

      <path
        d={`M ${start.x} ${start.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`}
        fill="none"
        className="stroke-easing"
        strokeWidth={4}
        strokeLinecap="round"
      />

      {([0, 1] as const).map((index) => {
        const p = index === 0 ? p1 : p2
        const point = points[index]
        return (
          <g
            key={index}
            tabIndex={0}
            role="slider"
            aria-roledescription="2D handle"
            aria-label={`${label}, ${HANDLE_NAMES[index]}`}
            aria-valuenow={point.y}
            aria-valuemin={Y_MIN}
            aria-valuemax={Y_MAX}
            aria-valuetext={`x ${point.x.toFixed(2)}, y ${point.y.toFixed(2)}`}
            onPointerDown={onPointerDown(index)}
            onPointerMove={onPointerMove(index)}
            onPointerUp={() => setDragging(null)}
            onPointerCancel={() => setDragging(null)}
            onKeyDown={onKeyDown(index)}
            className={cn('group/handle outline-none', dragging === index ? 'cursor-grabbing' : 'cursor-grab')}
          >
            {/* Invisible, larger hit area so the handle is easy to grab, including by touch. */}
            <circle cx={p.x} cy={p.y} r={11} fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={6}
              strokeWidth={2}
              className={cn(
                'fill-surface stroke-ink',
                'group-focus-visible/handle:fill-easing group-focus-visible/handle:stroke-[3px]',
                dragging === index && 'fill-easing',
              )}
            />
          </g>
        )
      })}
    </svg>
  )
}
