import { useMemo } from 'react'
import { Shield, Users, Lock } from 'lucide-react'
import { roles } from '@/data/roles'
import { users } from '@/data/users'
import { useOrgStore } from '@/store/org-store'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function formatPermission(permission: string): string {
  return permission
    .replace(/^(cannot_|can_)/, '')
    .replace(/_/g, ' ')
}

function formatRestriction(restriction: string): string {
  return restriction
    .replace(/^cannot_/, '')
    .replace(/_/g, ' ')
}

export default function RolesPage() {
  const orgId = useOrgStore((s) => s.currentOrgId)

  const orgUsers = useMemo(
    () => users.filter((u) => u.organisationId === orgId),
    [orgId]
  )

  const rolesWithCounts = useMemo(
    () =>
      roles.map((role) => ({
        ...role,
        orgUserCount: orgUsers.filter((u) => u.role === role.id).length,
      })),
    [orgUsers]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Roles & Permissions
        </h1>
        <p className="text-muted-foreground">
          Configure role-based access and permission matrices
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rolesWithCounts.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {role.displayName}
              </CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {role.orgUserCount}{' '}
                  {role.orgUserCount === 1 ? 'user' : 'users'} in this
                  organisation
                </span>
              </div>

              {/* Permissions */}
              <div>
                <p className="text-sm font-medium mb-2">Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((perm) => (
                    <Badge
                      key={perm}
                      variant="secondary"
                      className="text-xs capitalize"
                    >
                      {formatPermission(perm)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Restrictions */}
              {role.restrictions.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium">Restrictions</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {role.restrictions.map((restriction) => (
                      <Badge
                        key={restriction}
                        variant="outline"
                        className="text-xs capitalize text-muted-foreground"
                      >
                        {formatRestriction(restriction)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {role.isCustom ? (
                  <Badge variant="outline" className="text-xs">
                    Custom Role
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    System Role
                  </Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
