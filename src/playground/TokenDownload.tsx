import { useState } from 'react'
import { exportTokens, type ExportFormat, type TokenFile } from '@/tokens'
import { Button, SegmentedControl } from '@/ui'

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

/** Pick a format and download the committed tokens in it. */
export function TokenDownload() {
  const [format, setFormat] = useState<ExportFormat>('json')
  const file = () => exportTokens(format)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SegmentedControl label="Token file format" value={format} options={FORMAT_OPTIONS} onChange={setFormat} />
      <Button variant="secondary" onClick={() => downloadFile(file())}>
        Download {file().filename}
      </Button>
    </div>
  )
}
