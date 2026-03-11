import { organisations } from '@/data/organisations'
import { useOrgStore } from '@/store/org-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Globe, Factory, CalendarDays, Users, Activity } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatDate } from '@/lib/utils'

export default function OrganisationSettingsPage() {
  const orgId = useOrgStore((s) => s.currentOrgId)
  const org = organisations.find((o) => o.id === orgId)

  if (!org) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organisation Settings</h1>
          <p className="text-muted-foreground">Organisation not found</p>
        </div>
      </div>
    )
  }

  const infoItems = [
    { icon: Building2, label: 'Organisation Name', value: org.name },
    { icon: Factory, label: 'Industry', value: org.industry },
    { icon: Globe, label: 'Primary Region', value: org.primaryRegion },
    { icon: CalendarDays, label: 'Created', value: formatDate(org.createdAt) },
    { icon: Users, label: 'Total Users', value: String(org.userCount) },
    { icon: Activity, label: 'Status', value: org.status, isBadge: true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Organisation Settings</h1>
        <p className="text-muted-foreground">View details for your current organisation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{org.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                  {item.isBadge ? (
                    <StatusBadge status={item.value as 'active' | 'suspended'} />
                  ) : (
                    <p className="text-sm font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
