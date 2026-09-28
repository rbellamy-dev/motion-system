import { useState } from 'react'
import { Presence, useMotionContext } from '@/motion'
import { countChangedTokens } from '@/tokens'
import { Button, Slider, Toggle } from '@/ui'
import { usePlayback } from './playback'
import { TokenDownload } from './TokenDownload'

/**
 * Page-wide playback and accessibility. Individual tokens are tuned on their panels.
 * Export options are one toggle away, so the panel stays light until you want them.
 */
export function ControlPanel() {
  const { settings, updateSettings, resetSettings, osReducedMotion } = useMotionContext()
  const { paused, setPaused } = usePlayback()
  const changes = countChangedTokens(settings.tokens)
  const [showExport, setShowExport] = useState(false)

  return (
    <aside aria-labelledby="controls-title" className="space-y-6 rounded-[1.25rem] border-2 border-ink bg-surface p-5">
      <div>
        <h2 id="controls-title" className="text-xl font-extrabold">
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

      <div className="space-y-4 border-t-2 border-ink/10 pt-5">
        <Toggle
          label="Show export options"
          description={
            changes > 0
              ? `${changes} ${changes === 1 ? 'token' : 'tokens'} edited. Time scale is never exported.`
              : 'Download the tokens as JSON, TypeScript or CSS.'
          }
          checked={showExport}
          onChange={setShowExport}
        />
        <Presence show={showExport} variant="fade">
          <TokenDownload stacked />
        </Presence>
      </div>

      <Button variant="secondary" className="w-full" onClick={resetSettings}>
        Reset everything
      </Button>
    </aside>
  )
}
