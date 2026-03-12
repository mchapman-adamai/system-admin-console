import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store/settings-store'

export default function RegistrationRulesPage() {
  const settings = useSettingsStore((s) => s.getSettings())
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [dirty, setDirty] = useState(false)

  const registration = settings.deviceSecurity.registration

  const update = (path: string[], value: unknown) => {
    updateSettings(['deviceSecurity', 'registration', ...path], value)
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
          description="When enabled, new device registrations are automatically approved. When disabled, an administrator must manually approve each new device before it can access the platform."
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
