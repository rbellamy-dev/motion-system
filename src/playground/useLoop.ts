import { useEffect, useState } from 'react'

/** Flips a boolean every `intervalMs`, so demos can loop forever. */
export function useLoop(intervalMs: number): boolean {
  const [on, setOn] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => setOn((prev) => !prev), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])

  return on
}
