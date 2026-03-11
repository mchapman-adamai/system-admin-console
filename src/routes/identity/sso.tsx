import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { toast } from 'sonner'
import { useOrgStore } from '@/store/org-store'
import { useSettingsStore } from '@/store/settings-store'

export default function SSOPage() {
  const orgId = useOrgStore((s) => s.currentOrgId)
  const settings = useSettingsStore((s) => s.getSettings(orgId))
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [dirty, setDirty] = useState(false)

  const auth = settings.auth

  const update = (path: string[], value: any) => {
    updateSettings(orgId, ['auth', ...path], value)
    setDirty(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">SSO & Login</h1>
        <p className="text-muted-foreground">Configure Single Sign-On and login authentication methods</p>
      </div>

      <PolicySection title="Single Sign-On" description="Enable SSO to allow users to authenticate through your identity provider">
        <SettingRow
          type="toggle"
          label="Enable SSO"
          description="Users can sign in using your organisation's identity provider"
          securityLevel="high"
          value={auth.sso.enabled}
          onChange={(v) => update(['sso', 'enabled'], v)}
          lastModified="Modified by Olivia Clarke, 10 Mar 2026"
        />
        <SettingRow
          type="select"
          label="SSO Protocol"
          description="Authentication protocol used by your identity provider"
          value={auth.sso.protocol}
          onChange={(v) => update(['sso', 'protocol'], v)}
          options={[
            { value: 'saml', label: 'SAML 2.0' },
            { value: 'oidc', label: 'OpenID Connect' },
          ]}
        />
        <SettingRow
          type="select"
          label="Identity Provider"
          description="Select your SSO identity provider"
          value={auth.sso.provider}
          onChange={(v) => update(['sso', 'provider'], v)}
          options={[
            { value: 'azure_ad', label: 'Azure AD' },
            { value: 'okta', label: 'Okta' },
            { value: 'google', label: 'Google Workspace' },
            { value: 'onelogin', label: 'OneLogin' },
            { value: 'custom', label: 'Custom Provider' },
          ]}
        />
      </PolicySection>

      <PolicySection title="Login Settings" description="Configure how users authenticate when SSO is not available">
        <SettingRow
          type="toggle"
          label="Allow password login"
          description="Allow users to sign in with email and password as a fallback"
          securityLevel="medium"
          value={true}
          onChange={() => setDirty(true)}
        />
        <SettingRow
          type="toggle"
          label="Remember me"
          description="Allow users to stay signed in across browser sessions"
          securityLevel="medium"
          value={false}
          onChange={() => setDirty(true)}
        />
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('SSO settings saved successfully')
        }}
        onDiscard={() => setDirty(false)}
      />
    </div>
  )
}
