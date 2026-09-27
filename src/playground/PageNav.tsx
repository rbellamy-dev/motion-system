import { useEffect, useState } from 'react'
import { Presence } from '@/motion'
import { cn } from '@/lib/cn'

export interface NavLink {
  /** The id of the section it jumps to. */
  id: string
  label: string
}

interface PageNavProps {
  title: string
  links: readonly NavLink[]
  /** Id of the page's own headline. The bar's title fades in only once that has scrolled away. */
  titleTargetId?: string
}

/**
 * A bar pinned to the top of the page with links to each section. The section you're reading
 * is highlighted (and marked aria-current), so the bar doubles as a "you are here".
 */
export function PageNav({ title, links, titleTargetId }: PageNavProps) {
  const [current, setCurrent] = useState<string | null>(null)
  const [showTitle, setShowTitle] = useState(!titleTargetId)

  // Avoid repeating the headline: show the bar's title once the headline is out of view.
  useEffect(() => {
    const headline = titleTargetId ? document.getElementById(titleTargetId) : null
    if (!headline) return
    const observer = new IntersectionObserver(([entry]) => setShowTitle(!entry.isIntersecting), {
      rootMargin: '-56px 0px 0px 0px', // the bar's own height covers the top of the viewport
    })
    observer.observe(headline)
    return () => observer.disconnect()
  }, [titleTargetId])

  // A section counts as current when it crosses a band near the top of the viewport.
  useEffect(() => {
    const sections = links.map(({ id }) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    sections.forEach((section) => observer.observe(section))

    // The last section can be too short to ever reach that band, so the bottom of the page counts as it.
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) setCurrent(links[links.length - 1].id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [links])

  return (
    <nav aria-label="On this page" className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        {/* Always takes its space, so the links don't shift when the title appears. */}
        <div className="hidden min-w-0 sm:block">
          <Presence show={showTitle} variant="fade">
            <a href="#top" className="font-display text-lg font-black">
              {title}
            </a>
          </Presence>
        </div>
        {/* Links wrap to a second line rather than scrolling out of sight when text is enlarged. */}
        <ul className="flex flex-wrap gap-x-4 sm:gap-x-6">
          {links.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setCurrent(id)}
                aria-current={current === id ? 'true' : undefined}
                className={cn(
                  // min-h-11: 44px touch targets on phones.
                  'flex min-h-11 items-center rounded-sm font-bold whitespace-nowrap underline-offset-8',
                  'transition-colors duration-(--duration-quick) ease-standard',
                  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-easing',
                  current === id ? 'text-ink underline decoration-accent decoration-3' : 'text-muted hover:text-ink',
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
