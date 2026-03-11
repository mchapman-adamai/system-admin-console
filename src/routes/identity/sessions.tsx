import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store/settings-store'

export default function SessionsPage() {
  const settings = useSettingsStore((s) => s.getSettings())
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [dirty, setDirty] = useState(false)

  const session = settings.auth.session

  const update = (path: string[], value: any) => {
    updateSettings(['auth', 'session', ...path], value)
    setDirty(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>
        <p className="text-muted-foreground">Configure session timeout, concurrent access, and lockout policies</p>
      </div>

      <PolicySection title="Session Timeout" description="Control how long sessions remain active">
        <SettingRow
          type="number"
          label="Web Portal Timeout"
          description="Minutes of inactivity before session expires"
          securityLevel="high"
          value={session.webPortalTimeoutMinutes}
          onChange={(v) => update(['webPortalTimeoutMinutes'], v)}
          min={1}
          max={120}
          suffix="minutes"
          lastModified="Modified by System, 1 Mar 2026"
        />
      </PolicySection>

      <PolicySection title="Concurrent Sessions" description="Control multiple simultaneous logins">
        <SettingRow
          type="toggle"
          label="Allow Concurrent Sessions"
          description="Allow users to be signed in from multiple devices simultaneously"
          securityLevel="medium"
          value={session.concurrentSessionsAllowed}
          onChange={(v) => update(['concurrentSessionsAllowed'], v)}
        />
      </PolicySection>

      <PolicySection title="Login Security" description="Protect against brute-force attacks">
        <SettingRow
          type="number"
          label="Login Retry Limit"
          description="Failed login attempts before account lockout"
          securityLevel="high"
          value={session.loginRetryLimit}
          onChange={(v) => update(['loginRetryLimit'], v)}
          min={3}
          max={10}
          suffix="attempts"
        />
        <SettingRow
          type="number"
          label="Lockout Duration"
          description="Minutes an account remains locked after exceeding retry limit"
          securityLevel="medium"
          value={session.lockoutDurationMinutes}
          onChange={(v) => update(['lockoutDurationMinutes'], v)}
          min={5}
          max={1440}
          suffix="minutes"
        />
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('Session settings saved successfully')
        }}
        onDiscard={() => setDirty(false)}
      />
    </div>
  )
}
