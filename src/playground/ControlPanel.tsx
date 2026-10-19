import { useMotionContext } from '@/motion'
import { Button, Slider, Toggle } from '@/ui'
import { usePlayback } from './playback'
import { TokenDownload } from './TokenDownload'

/**
 * Page-wide playback and accessibility. Individual tokens are tuned on their panels.
 * Export sits at the bottom as one compact row, always there, so the panel never grows taller.
 */
export function ControlPanel() {
  const { settings, updateSettings, resetSettings, osReducedMotion } = useMotionContext()
  const { paused, setPaused } = usePlayback()

  return (
    <aside aria-labelledby="controls-title" className="space-y-6 rounded-lg border border-line bg-surface p-5">
      <div>
        <h2 id="controls-title" className="text-xl font-medium">
          Controls
        </h2>
        <p className="text-muted">Playback for the whole page. Edit individual tokens on their panels.</p>
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

      <div className="space-y-5 border-t border-line pt-5">
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

      <div className="border-t border-line pt-5">
        <TokenDownload compact />
      </div>

      <Button variant="secondary" className="w-full" onClick={resetSettings}>
        Reset everything
      </Button>
    </aside>
  )
}
