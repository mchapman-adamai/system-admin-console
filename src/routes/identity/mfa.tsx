import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store/settings-store'

export default function MFAPage() {
  const settings = useSettingsStore((s) => s.getSettings())
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const hasUnsavedChanges = useSettingsStore((s) => s.hasUnsavedChanges)
  const saveChanges = useSettingsStore((s) => s.saveChanges)
  const discardChanges = useSettingsStore((s) => s.discardChanges)

  const mfa = settings.auth.mfa

  const update = (path: string[], value: any) => {
    updateSettings(['auth', 'mfa', ...path], value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">MFA Configuration</h1>
        <p className="text-muted-foreground">Configure multi-factor authentication requirements for your organisation</p>
      </div>

      <PolicySection title="MFA Requirement" description="Enforce multi-factor authentication for all users">
        <SettingRow
          type="toggle"
          label="Require MFA"
          description="All users must authenticate with a second factor on every login"
          securityLevel="high"
          value={mfa.required}
          onChange={(v) => update(['required'], v)}
          lastModified="Modified by Olivia Clarke, 12 Mar 2026"
        />
      </PolicySection>

      <PolicySection title="Authentication Methods" description="Select which MFA methods are available to users">
        <SettingRow
          type="toggle"
          label="Authenticator App"
          description="Allow authentication via TOTP authenticator applications (Google Authenticator, Authy, etc.)"
          securityLevel="high"
          value={mfa.methods.includes('authenticator_app')}
          onChange={(v) => {
            const methods = v
              ? [...mfa.methods, 'authenticator_app' as const]
              : mfa.methods.filter((m) => m !== 'authenticator_app')
            update(['methods'], methods)
          }}
        />
        <SettingRow
          type="toggle"
          label="SMS Verification"
          description="Allow authentication via SMS one-time codes sent to registered phone numbers"
          securityLevel="medium"
          value={mfa.methods.includes('sms')}
          onChange={(v) => {
            const methods = v
              ? [...mfa.methods, 'sms' as const]
              : mfa.methods.filter((m) => m !== 'sms')
            update(['methods'], methods)
          }}
        />
      </PolicySection>

      <PolicySection title="Step-Up Authentication" description="Require additional verification for sensitive actions">
        <SettingRow
          type="toggle"
          label="Step-up for Voting"
          description="Require re-authentication before casting votes on resolutions"
          securityLevel="governance_critical"
          value={mfa.stepUpForVoting}
          onChange={(v) => update(['stepUpForVoting'], v)}
        />
        <SettingRow
          type="toggle"
          label="Step-up for E-Signature"
          description="Require re-authentication before applying electronic signatures"
          securityLevel="governance_critical"
          value={mfa.stepUpForESignature}
          onChange={(v) => update(['stepUpForESignature'], v)}
        />
      </PolicySection>

      <SaveBar
        show={hasUnsavedChanges}
        onSave={() => {
          saveChanges()
          toast.success('MFA settings saved successfully')
        }}
        onDiscard={() => {
          discardChanges()
        }}
      />
    </div>
  )
}
