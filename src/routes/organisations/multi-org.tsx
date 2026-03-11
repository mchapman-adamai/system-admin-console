import { currentOrg } from '@/data/organisations'
import { users } from '@/data/users'
import { TENANT_ORG_ID } from '@/store/org-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Building2, Users, Globe, Calendar, Briefcase } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useMemo } from 'react'

export default function MultiOrgPage() {
  const orgUsers = useMemo(
    () => users.filter((u) => u.organisationId === TENANT_ORG_ID),
    []
  )

  const activeUsers = orgUsers.filter((u) => u.status === 'active').length
  const suspendedUsers = orgUsers.filter((u) => u.status === 'suspended').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Subsidiary Management</h1>
        <p className="text-muted-foreground">Organisation details and subsidiary overview</p>
      </div>

      {/* Organisation Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              {currentOrg.name}
            </CardTitle>
            <StatusBadge status={currentOrg.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="text-sm font-medium">{currentOrg.industry}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Primary Region</p>
                <p className="text-sm font-medium">{currentOrg.primaryRegion}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Users</p>
                <p className="text-sm font-medium">{currentOrg.userCount} total</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm font-medium">{formatDate(currentOrg.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{orgUsers.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{activeUsers}</p>
              <p className="text-sm text-muted-foreground mt-1">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{suspendedUsers}</p>
              <p className="text-sm text-muted-foreground mt-1">Suspended Users</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
