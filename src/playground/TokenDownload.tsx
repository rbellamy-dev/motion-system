import { useState } from 'react'
import { useMotionContext } from '@/motion'
import { countChangedTokens, exportTokens, type ExportFormat, type TokenFile } from '@/tokens'
import { Button, SegmentedControl } from '@/ui'

type Source = 'tuned' | 'original'

const FORMAT_OPTIONS = [
  { value: 'json', label: 'JSON' },
  { value: 'ts', label: 'TS' },
  { value: 'css', label: 'CSS' },
] as const satisfies readonly { value: ExportFormat; label: string }[]

function downloadFile({ filename, mimeType, content }: TokenFile) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  // Revoke on the next tick so the browser has started the download first.
  setTimeout(() => URL.revokeObjectURL(url))
}

interface TokenDownloadProps {
  /** One tight row for the narrow sidebar: the format picker beside a short Download button. */
  compact?: boolean
}

/**
 * Pick a format and download the tokens. Once any token has been tuned, a second choice
 * appears: export your tuned values or the original tokens.json. Time scale is never exported.
 */
export function TokenDownload({ compact = false }: TokenDownloadProps) {
  const { settings } = useMotionContext()
  const [format, setFormat] = useState<ExportFormat>('json')
  const [source, setSource] = useState<Source>('tuned')
  const changes = countChangedTokens(settings.tokens)
  const exportTuned = changes > 0 && source === 'tuned'
  const file = () => exportTokens(format, exportTuned ? settings.tokens : undefined)

  const formatPicker = (
    <SegmentedControl
      label="Token file format"
      value={format}
      options={FORMAT_OPTIONS}
      onChange={setFormat}
      dense={compact}
      className={compact ? 'min-w-0 flex-1' : undefined}
    />
  )
  const sourcePicker = changes > 0 && (
    <SegmentedControl
      label="Which values to export"
      value={source}
      options={[
        { value: 'tuned', label: `Edited (${changes})` },
        { value: 'original', label: 'Original' },
      ]}
      onChange={setSource}
      dense={compact}
    />
  )

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {sourcePicker}
        <div className="flex items-stretch gap-2">
          {formatPicker}
          <Button
            variant="secondary"
            className="h-auto shrink-0 px-3 text-sm"
            onClick={() => downloadFile(file())}
            aria-label={`Download ${file().filename}`}
          >
            Download
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {formatPicker}
      {sourcePicker}
      <Button variant="secondary" onClick={() => downloadFile(file())}>
        Download {file().filename}
      </Button>
    </div>
  )
}
