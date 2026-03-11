import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org-store'
import { useSettingsStore } from '@/store/settings-store'

export default function PasswordPolicyPage() {
  const orgId = useOrgStore((s) => s.currentOrgId)
  const settings = useSettingsStore((s) => s.getSettings(orgId))
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [dirty, setDirty] = useState(false)

  const pw = settings.password

  const update = (path: string[], value: any) => {
    updateSettings(orgId, ['password', ...path], value)
    setDirty(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Password Policy</h1>
        <p className="text-muted-foreground">Configure password complexity, expiry, and reuse requirements</p>
      </div>

      <PolicySection title="Complexity Requirements" description="Set minimum requirements for password strength">
        <SettingRow
          type="number"
          label="Minimum Length"
          description="Minimum number of characters required"
          securityLevel="high"
          value={pw.minimumLength}
          onChange={(v) => update(['minimumLength'], v)}
          min={8}
          max={128}
          suffix="characters"
        />
        <SettingRow
          type="toggle"
          label="Require Uppercase"
          description="Password must contain at least one uppercase letter"
          value={pw.requireUppercase}
          onChange={(v) => update(['requireUppercase'], v)}
        />
        <SettingRow
          type="toggle"
          label="Require Lowercase"
          description="Password must contain at least one lowercase letter"
          value={pw.requireLowercase}
          onChange={(v) => update(['requireLowercase'], v)}
        />
        <SettingRow
          type="toggle"
          label="Require Numbers"
          description="Password must contain at least one digit"
          value={pw.requireNumbers}
          onChange={(v) => update(['requireNumbers'], v)}
        />
        <SettingRow
          type="toggle"
          label="Require Symbols"
          description="Password must contain at least one special character"
          value={pw.requireSymbols}
          onChange={(v) => update(['requireSymbols'], v)}
        />
        <SettingRow
          type="select"
          label="Dictionary Strength Check"
          description="Check passwords against a dictionary of common/weak passwords"
          securityLevel="medium"
          value={pw.dictionaryStrength}
          onChange={(v) => update(['dictionaryStrength'], v)}
          options={[
            { value: 'off', label: 'Off' },
            { value: 'standard', label: 'Standard' },
            { value: 'strict', label: 'Strict' },
          ]}
        />
      </PolicySection>

      <PolicySection title="Expiry & Reuse" description="Control password lifecycle and history">
        <SettingRow
          type="number"
          label="Password Expiry"
          description="Days before users must change their password"
          securityLevel="medium"
          value={pw.expiryDays}
          onChange={(v) => update(['expiryDays'], v)}
          min={0}
          max={365}
          suffix="days"
        />
        <SettingRow
          type="number"
          label="Disallow Reuse"
          description="Number of previous passwords that cannot be reused"
          value={pw.disallowReuse}
          onChange={(v) => update(['disallowReuse'], v)}
          min={0}
          max={24}
          suffix="passwords"
        />
        <SettingRow
          type="number"
          label="Minimum Password Age"
          description="Days before a password can be changed again"
          value={pw.minimumPasswordAgeDays}
          onChange={(v) => update(['minimumPasswordAgeDays'], v)}
          min={0}
          max={30}
          suffix="days"
        />
      </PolicySection>

      <PolicySection title="Account Recovery" description="Password reset and recovery settings">
        <SettingRow
          type="number"
          label="Reset Email Validity"
          description="Hours a password reset link remains valid"
          value={pw.resetEmailValidityHours}
          onChange={(v) => update(['resetEmailValidityHours'], v)}
          min={1}
          max={72}
          suffix="hours"
        />
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('Password policy saved successfully')
        }}
        onDiscard={() => setDirty(false)}
      />
    </div>
  )
}
