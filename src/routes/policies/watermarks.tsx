import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store/settings-store'

export default function WatermarksPage() {
  const settings = useSettingsStore((s) => s.getSettings())
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [dirty, setDirty] = useState(false)

  const wm = settings.contentProtection.watermark

  const update = (path: string[], value: unknown) => {
    updateSettings(['contentProtection', 'watermark', ...path], value)
    setDirty(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Watermarks</h1>
        <p className="text-muted-foreground">
          Configure watermark text, opacity, placement, and visibility on documents
        </p>
      </div>

      <PolicySection
        title="Watermark Settings"
        description="Enable and configure watermark content displayed on documents"
      >
        <SettingRow
          type="toggle"
          label="Enable Watermarks"
          description="Overlay a watermark on all documents viewed within the application"
          securityLevel="high"
          value={wm.enabled}
          onChange={(v) => update(['enabled'], v)}
        />
        <SettingRow
          type="custom"
          label="Watermark Text"
          description="The primary text displayed in the watermark overlay"
        >
          <Input
            value={wm.text}
            onChange={(e) => update(['text'], e.target.value)}
            className="w-[200px]"
            placeholder="e.g. CONFIDENTIAL"
          />
        </SettingRow>
        <SettingRow
          type="toggle"
          label="Include User Name"
          description="Append the viewing user's name to the watermark text"
          value={wm.includeUserName}
          onChange={(v) => update(['includeUserName'], v)}
        />
        <SettingRow
          type="toggle"
          label="Include Date"
          description="Append the current date to the watermark text"
          value={wm.includeDate}
          onChange={(v) => update(['includeDate'], v)}
        />
        <SettingRow
          type="toggle"
          label="Include Organisation Name"
          description="Append the organisation name to the watermark text"
          value={wm.includeOrgName}
          onChange={(v) => update(['includeOrgName'], v)}
        />
      </PolicySection>

      <PolicySection
        title="Appearance"
        description="Control the visual presentation of the watermark"
      >
        <SettingRow
          type="slider"
          label="Opacity"
          description="How visible the watermark appears over document content"
          value={wm.opacity}
          onChange={(v) => update(['opacity'], v)}
          min={0}
          max={100}
          step={5}
          suffix="%"
        />
        <SettingRow
          type="select"
          label="Placement"
          description="Where the watermark is positioned on the document"
          value={wm.placement}
          onChange={(v) => update(['placement'], v)}
          options={[
            { value: 'diagonal', label: 'Diagonal' },
            { value: 'header', label: 'Header' },
            { value: 'footer', label: 'Footer' },
          ]}
        />
      </PolicySection>

      {/* Watermark Preview */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-6 py-4">
          <h3 className="text-base font-semibold">Preview</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Approximate preview of how the watermark will appear on documents
          </p>
        </div>
        <div className="p-6">
          <div className="relative w-full h-64 rounded-md border bg-white dark:bg-slate-950 overflow-hidden">
            {/* Simulated document lines */}
            <div className="absolute inset-0 p-6 space-y-3">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted/70" />
              <div className="h-3 w-full rounded bg-muted/70" />
              <div className="h-3 w-5/6 rounded bg-muted/70" />
              <div className="h-3 w-full rounded bg-muted/70" />
              <div className="h-3 w-2/3 rounded bg-muted/70" />
              <div className="mt-4 h-4 w-1/2 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted/70" />
              <div className="h-3 w-4/5 rounded bg-muted/70" />
            </div>

            {/* Watermark overlay */}
            {wm.enabled && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                style={{
                  ...(wm.placement === 'header' ? { alignItems: 'flex-start', paddingTop: '1rem' } : {}),
                  ...(wm.placement === 'footer' ? { alignItems: 'flex-end', paddingBottom: '1rem' } : {}),
                }}
              >
                <span
                  className="text-red-500 dark:text-red-400 font-bold text-lg whitespace-nowrap"
                  style={{
                    opacity: wm.opacity / 100,
                    transform: wm.placement === 'diagonal' ? 'rotate(-30deg)' : 'none',
                    fontSize: wm.placement === 'diagonal' ? '1.5rem' : '1rem',
                  }}
                >
                  {[
                    wm.text,
                    wm.includeUserName && 'Olivia Clarke',
                    wm.includeDate && new Date().toLocaleDateString(),
                    wm.includeOrgName && 'Acme Corp',
                  ]
                    .filter(Boolean)
                    .join(' \u00b7 ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('Watermark settings saved successfully')
        }}
        onDiscard={() => setDirty(false)}
      />
    </div>
  )
}
