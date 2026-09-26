/** Each token family has one colour across the page, so colour always means "which kind of token". */
export const TONES = {
  duration: 'bg-duration',
  easing: 'bg-easing',
  spring: 'bg-spring',
  stagger: 'bg-stagger',
} as const

export type Tone = keyof typeof TONES
