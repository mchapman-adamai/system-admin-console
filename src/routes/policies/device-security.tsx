import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store/settings-store'

export default function DeviceSecurityPage() {
  const settings = useSettingsStore((s) => s.getSettings())
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [dirty, setDirty] = useState(false)

  const session = settings.deviceSecurity.session

  const update = (path: string[], value: unknown) => {
    updateSettings(['deviceSecurity', 'session', ...path], value)
    setDirty(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Device Security</h1>
        <p className="text-muted-foreground">
          Configure biometric unlock, auto-lock, and session controls for devices
        </p>
      </div>

      <PolicySection
        title="Session Controls"
        description="Manage automatic sign-out, biometric authentication, and session persistence"
      >
        <SettingRow
          type="number"
          label="Auto Sign-Out"
          description="Automatically sign out the user after a period of inactivity on the device"
          securityLevel="high"
          value={session.autoSignOutMinutes}
          onChange={(v) => update(['autoSignOutMinutes'], v)}
          min={1}
          max={120}
          suffix="minutes"
        />
        <SettingRow
          type="toggle"
          label="Biometric Unlock"
          description="Allow users to unlock the application using fingerprint or face recognition on supported devices"
          securityLevel="medium"
          value={session.biometricUnlock}
          onChange={(v) => update(['biometricUnlock'], v)}
        />
        <SettingRow
          type="toggle"
          label="Remember Sign-On"
          description="Allow the app to remember the user's session across app restarts on trusted devices"
          securityLevel="high"
          value={session.rememberSignOn}
          onChange={(v) => update(['rememberSignOn'], v)}
        />
      </PolicySection>

      <PolicySection
        title="Meeting Behaviour"
        description="Control how device sessions behave during active meetings"
      >
        <SettingRow
          type="toggle"
          label="Do Not Sign Out During Meeting"
          description="Prevent automatic sign-out while the user is actively participating in a meeting"
          securityLevel="governance_critical"
          value={session.doNotSignOutDuringMeeting}
          onChange={(v) => update(['doNotSignOutDuringMeeting'], v)}
        />
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('Device security settings saved successfully')
        }}
        onDiscard={() => setDirty(false)}
      />
    </div>
  )
}
