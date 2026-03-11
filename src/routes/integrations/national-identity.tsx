import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function NationalIdentityPage() {
  const [dirty, setDirty] = useState(false)
  const [enabled, setEnabled] = useState(true)
  const [verificationLevel, setVerificationLevel] = useState('high')
  const [apiEndpoint, setApiEndpoint] = useState('https://api.nafath.sa/v2')
  const [clientId, setClientId] = useState('adam-prod-client-9a2f')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">National Identity</h1>
        <p className="text-muted-foreground">Configure Nafath national digital identity integration</p>
      </div>

      <PolicySection title="Nafath Integration" description="Enable and configure national identity verification for your users">
        <SettingRow
          type="toggle"
          label="Enable Nafath Integration"
          description="Activate Nafath as a national digital identity verification method"
          securityLevel="governance_critical"
          value={enabled}
          onChange={(v) => {
            setEnabled(v)
            setDirty(true)
          }}
        />
        <SettingRow
          type="select"
          label="Verification Level"
          description="Choose the verification depth required during Nafath authentication"
          securityLevel="high"
          value={verificationLevel}
          onChange={(v) => {
            setVerificationLevel(v)
            setDirty(true)
          }}
          options={[
            { value: 'basic', label: 'Basic' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      </PolicySection>

      <PolicySection title="Configuration" description="API connection settings for Nafath identity services">
        <SettingRow
          type="custom"
          label="API Endpoint"
          description="The base URL for the Nafath verification API"
        >
          <Input
            value={apiEndpoint}
            onChange={(e) => {
              setApiEndpoint(e.target.value)
              setDirty(true)
            }}
            className="w-[280px]"
          />
        </SettingRow>
        <SettingRow
          type="custom"
          label="Client ID"
          description="Your registered Nafath application client identifier"
        >
          <Input
            type="password"
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value)
              setDirty(true)
            }}
            className="w-[280px]"
          />
        </SettingRow>
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('National identity settings saved successfully')
        }}
        onDiscard={() => {
          setEnabled(true)
          setVerificationLevel('high')
          setApiEndpoint('https://api.nafath.sa/v2')
          setClientId('adam-prod-client-9a2f')
          setDirty(false)
        }}
      />
    </div>
  )
}
