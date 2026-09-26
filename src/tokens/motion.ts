/**
 * Reads tokens.json (W3C DTCG format) and turns it into typed values the app can use.
 * tokens.json is the single source of truth: change or add tokens there, never here.
 * Token names are derived from the JSON, so a new token is instantly a valid, type-checked option.
 */
import tokenFile from './tokens.json'

export type CubicBezier = readonly [number, number, number, number]

export interface SpringConfig {
  /** How long the spring *appears* to take, in ms. */
  duration: number
  /** 0 = no overshoot, 1 = very bouncy. */
  bounce: number
}

const source = tokenFile.motion

/** Token names in a group, skipping DTCG metadata like `$type` and `$description`. */
type TokenNames<Group> = Exclude<keyof Group, `$${string}`>

export type DurationToken = TokenNames<typeof source.duration>
export type EasingToken = TokenNames<typeof source.easing>
export type SpringToken = TokenNames<typeof source.spring>
export type StaggerToken = TokenNames<typeof source.stagger>
export type DistanceToken = TokenNames<typeof source.distance>
export type ScaleToken = TokenNames<typeof source.scale>

export interface MotionTokens {
  duration: Record<DurationToken, number>
  easing: Record<EasingToken, CubicBezier>
  spring: Record<SpringToken, SpringConfig>
  stagger: Record<StaggerToken, number>
  distance: Record<DistanceToken, number>
  scale: Record<ScaleToken, number>
}

export type TokenGroup = keyof MotionTokens

// --- Converters: DTCG values → plain numbers ---------------------------------------------

interface UnitValue {
  value: number
  unit: string
}

function toMs({ value, unit }: UnitValue): number {
  if (unit === 'ms') return value
  if (unit === 's') return value * 1000
  throw new Error(`tokens.json: unsupported duration unit "${unit}"`)
}

const ROOT_FONT_SIZE_PX = 16

function toPx({ value, unit }: UnitValue): number {
  if (unit === 'px') return value
  if (unit === 'rem') return value * ROOT_FONT_SIZE_PX
  throw new Error(`tokens.json: unsupported dimension unit "${unit}"`)
}

function toCubicBezier(value: number[]): CubicBezier {
  if (value.length !== 4) throw new Error(`tokens.json: cubicBezier needs 4 numbers, got ${value.length}`)
  const [x1, y1, x2, y2] = value
  return [x1, y1, x2, y2]
}

/** Runs `read` over every token in a group and keeps the names as typed keys. */
function readGroup<Group extends object, Result>(
  group: Group,
  read: (token: Group[TokenNames<Group>]) => Result,
): Record<TokenNames<Group>, Result> {
  const entries = Object.entries(group)
    .filter(([name]) => !name.startsWith('$'))
    .map(([name, token]) => [name, read(token as Group[TokenNames<Group>])])
  return Object.fromEntries(entries) as Record<TokenNames<Group>, Result>
}

// --- The tokens -----------------------------------------------------------------------------

export const motionTokens: MotionTokens = {
  duration: readGroup(source.duration, (t) => toMs(t.$value)),
  easing: readGroup(source.easing, (t) => toCubicBezier(t.$value)),
  spring: readGroup(source.spring, (t) => ({ duration: toMs(t.duration.$value), bounce: t.bounce.$value })),
  stagger: readGroup(source.stagger, (t) => toMs(t.$value)),
  distance: readGroup(source.distance, (t) => toPx(t.$value)),
  scale: readGroup(source.scale, (t) => t.$value),
}

/** Token names in file order, for UIs that list every token (playground, docs). */
export function tokenNames<G extends TokenGroup>(group: G): (keyof MotionTokens[G])[] {
  return Object.keys(motionTokens[group]) as (keyof MotionTokens[G])[]
}
