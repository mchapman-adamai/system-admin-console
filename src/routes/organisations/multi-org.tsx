import { useState } from 'react'
import { organisations } from '@/data/organisations'
import { useOrgStore } from '@/store/org-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { StatusBadge } from '@/components/shared/status-badge'
import { toast } from 'sonner'
import { Building2, Users, Globe } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function MultiOrgPage() {
  const currentOrgId = useOrgStore((s) => s.currentOrgId)
  const [allowOrgSwitching, setAllowOrgSwitching] = useState(true)
  const [sharedIdentity, setSharedIdentity] = useState(false)
  const [dirty, setDirty] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Multi-Org Configuration</h1>
        <p className="text-muted-foreground">Manage organisations and cross-org settings</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {organisations.map((org) => (
          <Card key={org.id} className={org.id === currentOrgId ? 'ring-2 ring-sky-500' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {org.name}
                </CardTitle>
                {org.id === currentOrgId && (
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                    Current
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{org.primaryRegion}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{org.userCount} users</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created {formatDate(org.createdAt)}</span>
                  <StatusBadge status={org.status} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PolicySection title="Cross-Organisation Settings" description="Configure how organisations interact with each other">
        <SettingRow
          type="toggle"
          label="Allow Organisation Switching"
          description="Allow users with access to multiple organisations to switch between them without re-authenticating"
          securityLevel="medium"
          value={allowOrgSwitching}
          onChange={(v) => {
            setAllowOrgSwitching(v)
            setDirty(true)
          }}
        />
        <SettingRow
          type="toggle"
          label="Shared Identity Across Organisations"
          description="Use a single identity and credential set across all organisations for this user"
          securityLevel="high"
          value={sharedIdentity}
          onChange={(v) => {
            setSharedIdentity(v)
            setDirty(true)
          }}
        />
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('Multi-org settings saved successfully')
        }}
        onDiscard={() => {
          setAllowOrgSwitching(true)
          setSharedIdentity(false)
          setDirty(false)
        }}
      />
    </div>
  )
}
