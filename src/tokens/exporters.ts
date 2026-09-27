/**
 * Turns the tokens into downloadable files. tokens.json stays the only source:
 * untouched tokens export as the file itself; tuned tokens are written back into the same
 * DTCG structure. CSS and TypeScript are generated from the same values, so formats never drift.
 */
import tokensJson from './tokens.json?raw'
import { countChangedTokens } from './diff'
import { motionTokens, type MotionTokens } from './motion'
import { toCssVars } from './toCssVars'

export const EXPORT_FORMATS = ['json', 'ts', 'css'] as const
export type ExportFormat = (typeof EXPORT_FORMATS)[number]

export interface TokenFile {
  filename: string
  mimeType: string
  content: string
}

const GENERATED_NOTE = 'Generated from tokens.json (W3C Design Tokens format). Edit tokens.json, not this file.'

/** CSS custom properties on :root. Springs have no CSS timing function, so they're exported as numbers for JS to read. */
export function toCss(tokens: MotionTokens): string {
  const vars: Record<string, string> = { ...toCssVars(tokens) }

  for (const [name, ms] of Object.entries(tokens.stagger)) vars[`--stagger-${name}`] = `${ms}ms`
  for (const [name, { duration, bounce }] of Object.entries(tokens.spring)) {
    vars[`--spring-${name}-duration`] = `${duration}ms`
    vars[`--spring-${name}-bounce`] = String(bounce)
  }
  for (const [name, px] of Object.entries(tokens.distance)) vars[`--distance-${name}`] = `${px}px`
  for (const [name, value] of Object.entries(tokens.scale)) vars[`--scale-${name}`] = String(value)

  const lines = Object.entries(vars).map(([name, value]) => `  ${name}: ${value};`)
  return [
    `/* Motion tokens. ${GENERATED_NOTE} */`,
    '/* Springs: CSS has no spring timing function, so duration and bounce are exported for JavaScript to read. */',
    '',
    ':root {',
    ...lines,
    '}',
    '',
  ].join('\n')
}

/** Typed constants plus token-name types, ready to import in any TypeScript project. */
export function toTypeScript(tokens: MotionTokens): string {
  const block = (name: string, comment: string, record: Record<string, unknown>) =>
    [
      `/** ${comment} */`,
      `export const ${name} = {`,
      ...Object.entries(record).map(([key, value]) => `  ${key}: ${formatValue(value)},`),
      '} as const',
      '',
    ].join('\n')

  return [
    '/**',
    ' * Motion tokens.',
    ` * ${GENERATED_NOTE}`,
    ' */',
    '',
    block('duration', 'Milliseconds.', tokens.duration),
    block('easing', 'Cubic-bezier control points [x1, y1, x2, y2].', tokens.easing),
    block('spring', 'Perceived duration in milliseconds, bounce from 0 (none) to 1.', tokens.spring),
    block('stagger', 'Delay between siblings, in milliseconds.', tokens.stagger),
    block('distance', 'Pixels.', tokens.distance),
    block('scale', 'Starting scale (1 = full size).', tokens.scale),
    'export const motionTokens = { duration, easing, spring, stagger, distance, scale } as const',
    '',
    'export type DurationToken = keyof typeof duration',
    'export type EasingToken = keyof typeof easing',
    'export type SpringToken = keyof typeof spring',
    'export type StaggerToken = keyof typeof stagger',
    'export type DistanceToken = keyof typeof distance',
    'export type ScaleToken = keyof typeof scale',
    '',
  ].join('\n')
}

type DtcgNode = Record<string, unknown> & { $value?: unknown }
type DtcgGroup = Record<string, DtcgNode>

/**
 * tokens.json with new values written in. Only `$value`s change, so `$type`, `$description`
 * and the file's structure survive the round trip.
 */
export function toDtcgJson(tokens: MotionTokens): string {
  const file = JSON.parse(tokensJson) as { motion: Record<string, DtcgGroup> }
  const groups = file.motion
  const unit = (value: number, u: string) => ({ value, unit: u })

  for (const [name, v] of Object.entries(tokens.duration)) groups.duration[name].$value = unit(v, 'ms')
  for (const [name, v] of Object.entries(tokens.easing)) groups.easing[name].$value = [...v]
  for (const [name, v] of Object.entries(tokens.stagger)) groups.stagger[name].$value = unit(v, 'ms')
  for (const [name, v] of Object.entries(tokens.distance)) groups.distance[name].$value = unit(v, 'px')
  for (const [name, v] of Object.entries(tokens.scale)) groups.scale[name].$value = v
  for (const [name, { duration, bounce }] of Object.entries(tokens.spring)) {
    const spring = groups.spring[name] as Record<string, DtcgNode>
    spring.duration.$value = unit(duration, 'ms')
    spring.bounce.$value = bounce
  }

  return `${JSON.stringify(file, null, 2)}\n`
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return `[${value.join(', ')}]`
  if (value && typeof value === 'object') {
    return `{ ${Object.entries(value).map(([k, v]) => `${k}: ${formatValue(v)}`).join(', ')} }`
  }
  return String(value)
}

/**
 * Tokens as a file in the chosen format. Pass tuned tokens to export them; by default it's
 * the committed tokens.json. Time scale is never part of `tokens`, so it can't leak in.
 */
export function exportTokens(format: ExportFormat, tokens: MotionTokens = motionTokens): TokenFile {
  switch (format) {
    case 'json': {
      // Untouched tokens export byte-for-byte as the committed file.
      const content = countChangedTokens(tokens) === 0 ? tokensJson : toDtcgJson(tokens)
      return { filename: 'tokens.json', mimeType: 'application/json', content }
    }
    case 'ts':
      return { filename: 'tokens.ts', mimeType: 'text/typescript', content: toTypeScript(tokens) }
    case 'css':
      return { filename: 'tokens.css', mimeType: 'text/css', content: toCss(tokens) }
  }
}
