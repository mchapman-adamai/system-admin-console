import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Fingerprint, Shield, Mail, FileSpreadsheet } from 'lucide-react'
import type { ReactNode } from 'react'

interface Integration {
  id: string
  name: string
  description: string
  icon: ReactNode
  status: 'active' | 'pending' | 'disabled'
  statusLabel: string
}

const integrations: Integration[] = [
  {
    id: 'nafath',
    name: 'Nafath',
    description: 'Saudi national digital identity verification for secure user authentication and e-signing',
    icon: <Fingerprint className="h-6 w-6" />,
    status: 'active',
    statusLabel: 'Connected',
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">View and configure platform integrations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id}>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
