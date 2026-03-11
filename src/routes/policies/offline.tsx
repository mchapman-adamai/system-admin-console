import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store/settings-store'

export default function OfflinePage() {
  const settings = useSettingsStore((s) => s.getSettings())
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const hasUnsavedChanges = useSettingsStore((s) => s.hasUnsavedChanges)
  const saveChanges = useSettingsStore((s) => s.saveChanges)
  const discardChanges = useSettingsStore((s) => s.discardChanges)

  const offline = settings.deviceSecurity.offline
  const localData = settings.deviceSecurity.localData

  const updateOffline = (path: string[], value: unknown) => {
    updateSettings(['deviceSecurity', 'offline', ...path], value)
  }

  const updateLocalData = (path: string[], value: unknown) => {
    updateSettings(['deviceSecurity', 'localData', ...path], value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Offline & App Data</h1>
        <p className="text-muted-foreground">
          Manage offline access duration, sync intervals, encryption, and data purge rules
        </p>
      </div>

      <PolicySection
        title="Offline Access"
        description="Control whether users can access documents without an active network connection"
      >
        <SettingRow
          type="toggle"
          label="Enable Offline Access"
          description="Allow users to view previously synced documents when offline"
          securityLevel="high"
          value={offline.enabled}
          onChange={(v) => updateOffline(['enabled'], v)}
        />
        <SettingRow
          type="number"
          label="Maximum Offline Duration"
          description="Maximum number of days a device can remain offline before requiring re-authentication"
          securityLevel="medium"
          value={offline.maxDurationDays}
          onChange={(v) => updateOffline(['maxDurationDays'], v)}
          min={1}
          max={30}
          suffix="days"
        />
        <SettingRow
          type="number"
          label="Sync Interval"
          description="How frequently the app syncs data with the server when online"
          value={offline.syncIntervalMinutes}
          onChange={(v) => updateOffline(['syncIntervalMinutes'], v)}
          min={5}
          max={120}
          suffix="minutes"
        />
      </PolicySection>

      <PolicySection
        title="Local Data"
        description="Control how application data is stored and handled on user devices"
      >
        <SettingRow
          type="toggle"
          label="Encrypt Local Data"
          description="Encrypt all locally cached documents and app data at rest on the device"
          securityLevel="governance_critical"
          value={localData.encrypted}
          onChange={(v) => updateLocalData(['encrypted'], v)}
        />
        <SettingRow
          type="toggle"
          label="Delete Data on Sign-Out"
          description="Automatically remove all cached data from the device when the user signs out"
          securityLevel="high"
          value={localData.deleteOnSignOut}
          onChange={(v) => updateLocalData(['deleteOnSignOut'], v)}
        />
        <SettingRow
          type="toggle"
          label="Purge on Logout"
          description="Immediately purge all offline data and sync state when the user logs out"
          securityLevel="high"
          value={offline.purgeOnLogout}
          onChange={(v) => updateOffline(['purgeOnLogout'], v)}
        />
      </PolicySection>

      <SaveBar
        show={hasUnsavedChanges}
        onSave={() => {
          saveChanges()
          toast.success('Offline & app data settings saved successfully')
        }}
        onDiscard={() => {
          discardChanges()
        }}
      />
    </div>
  )
}
