import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Fingerprint, Shield, Mail, FileSpreadsheet, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { ReactNode } from 'react'

interface Integration {
  id: string
  name: string
  description: string
  icon: ReactNode
  status: 'active' | 'pending' | 'disabled'
  statusLabel: string
  configurable?: boolean
}

const integrations: Integration[] = [
  {
    id: 'nafath',
    name: 'Nafath',
    description: 'Saudi national digital identity verification for secure user authentication and e-signing',
    icon: <Fingerprint className="h-6 w-6" />,
    status: 'active',
    statusLabel: 'Connected',
    configurable: true,
  },
  {
    id: 'azure-ad',
    name: 'Azure AD',
    description: 'Microsoft Entra ID single sign-on integration for enterprise identity management',
    icon: <Shield className="h-6 w-6" />,
    status: 'active',
    statusLabel: 'Connected',
  },
  {
    id: 'outlook-sync',
    name: 'Outlook Sync',
    description: 'Synchronise meeting invitations and calendar events with Microsoft Outlook',
    icon: <Mail className="h-6 w-6" />,
    status: 'pending',
    statusLabel: 'Not Connected',
  },
  {
    id: 'ms-office',
    name: 'MS Office',
    description: 'Enable in-app viewing and annotation of Word, Excel, and PowerPoint documents',
    icon: <FileSpreadsheet className="h-6 w-6" />,
    status: 'disabled',
    statusLabel: 'Not Connected',
  },
]

export default function IntegrationsOverviewPage() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  // Nafath config state
  const [dirty, setDirty] = useState(false)
  const [nafathEnabled, setNafathEnabled] = useState(true)
  const [verificationLevel, setVerificationLevel] = useState('high')
  const [apiEndpoint, setApiEndpoint] = useState('https://api.nafath.sa/v2')
  const [clientId, setClientId] = useState('adam-prod-client-9a2f')

  if (selectedIntegration === 'nafath') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => { setSelectedIntegration(null); setDirty(false) }}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Integrations
        </Button>

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Fingerprint className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Nafath</h1>
              <p className="text-muted-foreground">Configure national digital identity integration</p>
            </div>
          </div>
        </div>

        <PolicySection title="Nafath Integration" description="Enable and configure national identity verification for your users">
          <SettingRow
            type="toggle"
            label="Enable Nafath Integration"
            description="Activate Nafath as a national digital identity verification method"
            securityLevel="governance_critical"
            value={nafathEnabled}
            onChange={(v) => { setNafathEnabled(v); setDirty(true) }}
          />
          <SettingRow
            type="select"
            label="Verification Level"
            description="Choose the verification depth required during Nafath authentication"
            securityLevel="high"
            value={verificationLevel}
            onChange={(v) => { setVerificationLevel(v); setDirty(true) }}
            options={[
              { value: 'basic', label: 'Basic' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
        </PolicySection>

        <PolicySection title="Configuration" description="API connection settings for Nafath identity services">
          <SettingRow type="custom" label="API Endpoint" description="The base URL for the Nafath verification API">
            <Input
              value={apiEndpoint}
              onChange={(e) => { setApiEndpoint(e.target.value); setDirty(true) }}
              className="w-[280px]"
            />
          </SettingRow>
          <SettingRow type="custom" label="Client ID" description="Your registered Nafath application client identifier">
            <Input
              type="password"
              value={clientId}
              onChange={(e) => { setClientId(e.target.value); setDirty(true) }}
              className="w-[280px]"
            />
          </SettingRow>
        </PolicySection>

        <SaveBar
          show={dirty}
          onSave={() => { setDirty(false); toast.success('Nafath settings saved successfully') }}
          onDiscard={() => {
            setNafathEnabled(true)
            setVerificationLevel('high')
            setApiEndpoint('https://api.nafath.sa/v2')
            setClientId('adam-prod-client-9a2f')
            setDirty(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">View and configure platform integrations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className={integration.configurable ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''}
            onClick={() => integration.configurable && setSelectedIntegration(integration.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    {integration.icon}
                  </div>
                  <CardTitle>{integration.name}</CardTitle>
                </div>
                <StatusBadge status={integration.status === 'active' ? 'approved' : integration.status === 'pending' ? 'pending' : 'disabled'} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{integration.description}</p>
              {integration.configurable && (
                <p className="text-xs text-primary mt-2">Click to configure →</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
