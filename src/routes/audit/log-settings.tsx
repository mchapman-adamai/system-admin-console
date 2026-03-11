import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store/settings-store'

export default function LogSettingsPage() {
  const settings = useSettingsStore((s) => s.getSettings())
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [dirty, setDirty] = useState(false)

  const audit = settings.audit

  const updateCategory = (key: string, value: boolean) => {
    updateSettings(['audit', 'categories', key], value)
    setDirty(true)
  }

  const updateRetention = (value: number) => {
    updateSettings(['audit', 'retentionDays'], value)
    setDirty(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Log Settings & Retention</h1>
        <p className="text-muted-foreground">Configure logging categories and retention period</p>
      </div>

      <PolicySection title="Logging Categories" description="Select which types of events are recorded in the audit log">
        <SettingRow
          type="toggle"
          label="Authentication Events"
          description="Log user login, logout, and failed authentication attempts"
          securityLevel="high"
          value={audit.categories.authentication}
          onChange={(v) => updateCategory('authentication', v)}
        />
        <SettingRow
          type="toggle"
          label="Configuration Changes"
          description="Log changes to security policies, settings, and system configuration"
          securityLevel="high"
          value={audit.categories.configurationChanges}
          onChange={(v) => updateCategory('configurationChanges', v)}
        />
        <SettingRow
          type="toggle"
          label="Permission Changes"
          description="Log role assignments, permission modifications, and access control changes"
          securityLevel="governance_critical"
          value={audit.categories.permissionChanges}
          onChange={(v) => updateCategory('permissionChanges', v)}
        />
        <SettingRow
          type="toggle"
          label="Document Access"
          description="Log when users view, download, or interact with board documents"
          securityLevel="medium"
          value={audit.categories.documentAccess}
          onChange={(v) => updateCategory('documentAccess', v)}
        />
        <SettingRow
          type="toggle"
          label="Meeting Participation"
          description="Log meeting joins, attendance, and in-meeting activity"
          value={audit.categories.meetingParticipation}
          onChange={(v) => updateCategory('meetingParticipation', v)}
        />
      </PolicySection>

      <PolicySection title="Retention" description="Configure how long audit logs are kept before automatic purge">
        <SettingRow
          type="number"
          label="Retention Period"
          description="Number of days audit log entries are retained before being automatically deleted"
          value={audit.retentionDays}
          onChange={updateRetention}
          min={30}
          max={2555}
          suffix="days"
        />
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('Log settings saved successfully')
        }}
        onDiscard={() => setDirty(false)}
      />
    </div>
  )
}
