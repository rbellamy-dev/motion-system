import { useState } from 'react'
import { useMotionContext } from '@/motion'
import type { SpringConfig, SpringToken } from '@/tokens'
import { Button, Select, Slider, Toggle } from '@/ui'

const SPRING_NAMES: readonly SpringToken[] = ['snappy', 'gentle', 'bouncy']

export function ControlPanel() {
  const { settings, updateSettings, resetSettings, osReducedMotion } = useMotionContext()
  const [editing, setEditing] = useState<SpringToken>('bouncy')
  const spring = settings.springs[editing]

  const updateSpring = (patch: Partial<SpringConfig>) =>
    updateSettings({ springs: { ...settings.springs, [editing]: { ...spring, ...patch } } })

  return (
    <aside className="space-y-6 rounded-2xl bg-surface p-5 ring-1 ring-line">
      <div>
        <h2 className="font-semibold">Controls</h2>
        <p className="text-sm text-muted">Every demo on the page reads these live.</p>
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

      <fieldset className="space-y-4 border-t border-line pt-5">
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

      <div className="border-t border-line pt-5">
        <Toggle
          label="Reduce motion"
          description={
            osReducedMotion ? 'On in your system settings.' : 'Movement becomes a short fade.'
          }
          checked={settings.reducedMotion || osReducedMotion}
          disabled={osReducedMotion}
          onChange={(reducedMotion) => updateSettings({ reducedMotion })}
        />
      </div>

      <Button variant="secondary" className="w-full" onClick={resetSettings}>
        Reset to tokens
      </Button>
    </aside>
  )
}
