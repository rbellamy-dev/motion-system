import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
}

/**
 * Toy-key buttons: an ink outline with a hard "key depth" shadow that the button presses into.
 * The press travel sits behind `full-motion:`, so reduced motion keeps the colour change only.
 */
export const keyClasses =
  'border-2 border-ink shadow-[0_3px_0_var(--color-ink)] full-motion:active:translate-y-[3px] active:shadow-none'

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn('bg-accent text-ink hover:brightness-105', keyClasses),
  secondary: cn('bg-surface text-ink hover:bg-paper', keyClasses),
  ghost: 'text-muted hover:bg-ink/5 hover:text-ink',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm coarse:h-11',
  md: 'h-11 px-5 text-base',
}

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold',
        'transition duration-(--duration-instant) ease-standard',
        'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-easing',
        'disabled:pointer-events-none disabled:opacity-40',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}
