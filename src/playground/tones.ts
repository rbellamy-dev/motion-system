/** Each token family has one colour across the page, so colour always means "which kind of token". */
export const TONES = {
  duration: 'bg-duration',
  easing: 'bg-easing',
  spring: 'bg-spring',
  stagger: 'bg-stagger',
} as const

/** A 3px bar across the top of a key in its family's colour, so the key itself stays a quiet surface. */
export const TONE_BARS = {
  duration: 'shadow-[inset_0_3px_0_var(--color-duration)]',
  easing: 'shadow-[inset_0_3px_0_var(--color-easing)]',
  spring: 'shadow-[inset_0_3px_0_var(--color-spring)]',
  stagger: 'shadow-[inset_0_3px_0_var(--color-stagger)]',
} as const

export type Tone = keyof typeof TONES
