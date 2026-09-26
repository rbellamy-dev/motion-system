import { useState } from 'react'
import { useMotionContext } from '@/motion'
import { tokenNames, type SpringConfig, type SpringToken } from '@/tokens'
import { Button, Select, Slider, Toggle } from '@/ui'
import { usePlayback } from './playback'

const SPRING_NAMES = tokenNames('spring')

export function ControlPanel() {
  const { settings, updateSettings, resetSettings, osReducedMotion } = useMotionContext()
  const { paused, setPaused } = usePlayback()
  const [editing, setEditing] = useState<SpringToken>('bouncy')
  const spring = settings.springs[editing]

  const updateSpring = (patch: Partial<SpringConfig>) =>
    updateSettings({ springs: { ...settings.springs, [editing]: { ...spring, ...patch } } })

  return (
    <aside aria-labelledby="controls-title" className="space-y-6 rounded-[1.25rem] border-2 border-ink bg-surface p-5">
      <div>
        <h2 id="controls-title" className="text-xl font-extrabold">
          Controls
        </h2>
        <p className="text-muted">Change these and the whole page follows, hero included.</p>
      </div>

      <Slider
        label="Time scale"
        value={settings.timeScale}
        min={0.5}
        max={4}
        step={0.25}
        format={(v) => `${v}×`}
        onChange={(timeScale) => updateSettings({ timeScale })}
      />

      <fieldset className="space-y-4 border-t-2 border-ink/10 pt-5">
        <Select label="Edit spring" value={editing} options={SPRING_NAMES} onChange={setEditing} />
        <Slider
          label="Duration"
          value={spring.duration}
          min={100}
          max={1000}
          step={25}
          format={(v) => `${v}ms`}
          onChange={(duration) => updateSpring({ duration })}
        />
        <Slider
          label="Bounce"
          value={spring.bounce}
          min={0}
          max={0.8}
          step={0.05}
          format={(v) => v.toFixed(2)}
          onChange={(bounce) => updateSpring({ bounce })}
        />
      </fieldset>

      <div className="space-y-5 border-t-2 border-ink/10 pt-5">
        <Toggle
          label="Reduce motion"
          description={osReducedMotion ? 'On in your system settings.' : 'Movement becomes a short fade.'}
          checked={settings.reducedMotion || osReducedMotion}
          disabled={osReducedMotion}
          onChange={(reducedMotion) => updateSettings({ reducedMotion })}
        />
        <Toggle
          label="Pause previews"
          description="Stops the looping token races."
          checked={paused}
          onChange={setPaused}
        />
      </div>

      <Button variant="secondary" className="w-full" onClick={resetSettings}>
        Reset to tokens
      </Button>
    </aside>
  )
}
