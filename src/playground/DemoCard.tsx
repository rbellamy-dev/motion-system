import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface DemoCardProps {
  title: string
  /** The choreography rule this demo illustrates. */
  rule: string
  children: ReactNode
  /** Height class for the stage area. */
  stageClassName?: string
}

export function DemoCard({ title, rule, children, stageClassName = 'h-72' }: DemoCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
      <div className={cn('bg-paper/60', stageClassName)}>{children}</div>
      <div className="border-t border-line p-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted">{rule}</p>
      </div>
    </article>
  )
}
