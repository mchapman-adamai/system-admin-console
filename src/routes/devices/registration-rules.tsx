import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org-store'
import { useSettingsStore } from '@/store/settings-store'

export default function RegistrationRulesPage() {
  const orgId = useOrgStore((s) => s.currentOrgId)
  const settings = useSettingsStore((s) => s.getSettings(orgId))
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [dirty, setDirty] = useState(false)

  const registration = settings.deviceSecurity.registration

  const update = (path: string[], value: unknown) => {
    updateSettings(orgId, ['deviceSecurity', 'registration', ...path], value)
    setDirty(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Registration Rules</h1>
        <p className="text-muted-foreground">Configure device registration policies for your organisation</p>
      </div>

      <PolicySection title="Registration Policy" description="Control how new devices are registered and approved">
        <SettingRow
          type="toggle"
          label="Device Registration Required"
          description="Users must register their devices before accessing the platform"
          securityLevel="high"
          value={registration.required}
          onChange={(v) => update(['required'], v)}
        />
        <SettingRow
          type="number"
          label="Max Devices Per User"
          description="Maximum number of devices a single user can register"
          value={registration.maxDevicesPerUser}
          onChange={(v) => update(['maxDevicesPerUser'], v)}
          min={1}
          max={10}
          suffix="devices"
        />
        <SettingRow
          type="toggle"
          label="Auto-Approve New Devices"
          description="Automatically approve new device registrations without admin review"
          securityLevel="medium"
          value={registration.autoApproveNewDevices}
          onChange={(v) => update(['autoApproveNewDevices'], v)}
        />
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('Registration rules saved successfully')
        }}
        onDiscard={() => setDirty(false)}
      />
    </div>
  )
}
