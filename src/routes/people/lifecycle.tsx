import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { StatusBadge } from '@/components/shared/status-badge'
import { toast } from 'sonner'

interface LifecycleSettings {
  autoSuspendOnTermExpiry: boolean
  termExpiryWarningDays: number
  retainAuditDataAfterOffboarding: boolean
  dataRetentionDays: number
  allowSelfServiceReactivation: boolean
}

const defaultSettings: LifecycleSettings = {
  autoSuspendOnTermExpiry: true,
  termExpiryWarningDays: 30,
  retainAuditDataAfterOffboarding: true,
  dataRetentionDays: 365,
  allowSelfServiceReactivation: false,
}

export default function LifecyclePage() {
  const [settings, setSettings] = useState<LifecycleSettings>(defaultSettings)
  const [dirty, setDirty] = useState(false)

  const update = <K extends keyof LifecycleSettings>(
    key: K,
    value: LifecycleSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Lifecycle & Offboarding
        </h1>
        <p className="text-muted-foreground">
          Manage user lifecycle states, term expiry, and offboarding
          configuration
        </p>
      </div>

      {/* User States */}
      <PolicySection
        title="User States"
        description="The three lifecycle states that a user account can be in"
      >
        <div className="py-4 space-y-4">
          <div className="flex items-start gap-4">
            <StatusBadge status="active" className="mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Active</p>
              <p className="text-sm text-muted-foreground">
                The user has full access to the platform according to their
                assigned role and permissions. They can log in, access documents,
                and participate in meetings.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <StatusBadge status="suspended" className="mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Suspended</p>
              <p className="text-sm text-muted-foreground">
                The user account is temporarily disabled. They cannot log in or
                access any platform features. Suspension can be triggered
                manually by an administrator or automatically when a director's
                term expires.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <StatusBadge status="offboarded" className="mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Offboarded</p>
              <p className="text-sm text-muted-foreground">
                The user has been permanently removed from active participation.
                All access is revoked and device registrations are cleared.
                Audit data may be retained according to retention policies.
              </p>
            </div>
          </div>
        </div>
      </PolicySection>

      {/* Term Expiry Settings */}
      <PolicySection
        title="Term Expiry Settings"
        description="Configure how the system handles director term expirations"
      >
        <SettingRow
          type="toggle"
          label="Auto-suspend on term expiry"
          description="Automatically suspend director accounts when their term expiry date is reached. Suspended directors cannot log in until their term is renewed."
          securityLevel="high"
          value={settings.autoSuspendOnTermExpiry}
          onChange={(v) => update('autoSuspendOnTermExpiry', v)}
        />
        <SettingRow
          type="number"
          label="Term expiry warning days"
          description="Number of days before term expiry to send warning notifications to the director and governance professionals."
          value={settings.termExpiryWarningDays}
          onChange={(v) => update('termExpiryWarningDays', v)}
          min={1}
          max={180}
          suffix="days"
        />
      </PolicySection>

      {/* Offboarding Configuration */}
      <PolicySection
        title="Offboarding Configuration"
        description="Control how user data and audit trails are handled during offboarding"
      >
        <SettingRow
          type="toggle"
          label="Retain audit data after offboarding"
          description="Keep audit log entries associated with offboarded users for compliance and investigation purposes. If disabled, audit entries are anonymised."
          securityLevel="governance_critical"
          value={settings.retainAuditDataAfterOffboarding}
          onChange={(v) => update('retainAuditDataAfterOffboarding', v)}
        />
        <SettingRow
          type="number"
          label="Data retention after offboarding"
          description="Number of days to retain personal data and documents associated with an offboarded user before permanent deletion."
          value={settings.dataRetentionDays}
          onChange={(v) => update('dataRetentionDays', v)}
          min={30}
          max={2555}
          suffix="days"
        />
        <SettingRow
          type="toggle"
          label="Allow self-service reactivation"
          description="Permit suspended users to request reactivation of their accounts through a self-service workflow, subject to administrator approval."
          securityLevel="medium"
          value={settings.allowSelfServiceReactivation}
          onChange={(v) => update('allowSelfServiceReactivation', v)}
        />
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('Lifecycle settings saved successfully')
        }}
        onDiscard={() => {
          setSettings(defaultSettings)
          setDirty(false)
        }}
      />
    </div>
  )
}
