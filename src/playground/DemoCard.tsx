import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface DemoCardProps {
  title: string
  /** The rule this pattern demonstrates. */
  rule: string
  children: ReactNode
  /** Height class for the stage area. */
  stageClassName?: string
}

/** Stage on top (the demo's own controls sit top-left), the rule it demonstrates below. */
export function DemoCard({ title, rule, children, stageClassName = 'h-80' }: DemoCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[1.25rem] border-2 border-ink bg-surface">
      <div className={cn('border-b-2 border-ink bg-paper', stageClassName)}>{children}</div>
      <div className="p-5">
        <h3 className="text-xl font-extrabold">{title}</h3>
        <p className="mt-1 text-muted">{rule}</p>
      </div>
    </article>
  )
}
