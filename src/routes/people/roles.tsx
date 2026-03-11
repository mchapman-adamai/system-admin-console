import { useState, useMemo } from 'react'
import { Shield, Users, Lock, Edit, Save } from 'lucide-react'
import { roles } from '@/data/roles'
import { users } from '@/data/users'
import { TENANT_ORG_ID } from '@/store/org-store'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { Role } from '@/data/types'

/** All known permissions across every role so we can offer toggles for each. */
const ALL_PERMISSIONS = Array.from(
  new Set(roles.flatMap((r) => r.permissions))
).sort()

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

// ---------------------------------------------------------------------------
// Edit Permissions Dialog
// ---------------------------------------------------------------------------

function EditPermissionsDialog({
  role,
  open,
  onOpenChange,
  onSave,
}: {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (roleId: Role['id'], permissions: string[]) => void
}) {
  const [editedPermissions, setEditedPermissions] = useState<string[]>([])

  // Sync local state whenever the dialog opens with a new role
  const handleOpenChange = (next: boolean) => {
    if (next && role) {
      setEditedPermissions([...role.permissions])
    }
    onOpenChange(next)
  }

  if (!role) return null

  const togglePermission = (permission: string) => {
    setEditedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    )
  }

  const handleSave = () => {
    onSave(role.id, editedPermissions)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Edit Permissions &mdash; {role.displayName}
          </DialogTitle>
          <DialogDescription>
            Toggle permissions for this role. Restrictions are informational and
            cannot be changed here.
          </DialogDescription>
        </DialogHeader>

        {/* Permissions as switches */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Permissions</p>
          <div className="space-y-2">
            {ALL_PERMISSIONS.map((perm) => (
              <div
                key={perm}
                className="flex items-center justify-between gap-4 rounded-md border px-3 py-2"
              >
                <Label
                  htmlFor={`perm-${perm}`}
                  className="text-sm capitalize cursor-pointer flex-1"
                >
                  {formatPermission(perm)}
                </Label>
                <Switch
                  id={`perm-${perm}`}
                  size="sm"
                  checked={editedPermissions.includes(perm)}
                  onCheckedChange={() => togglePermission(perm)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Restrictions (read-only info) */}
        {role.restrictions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function RolesPage() {
  // Local editable copy of roles data
  const [localRoles, setLocalRoles] = useState<Role[]>(() =>
    roles.map((r) => ({ ...r }))
  )

  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const orgUsers = useMemo(
    () => users.filter((u) => u.organisationId === TENANT_ORG_ID),
    []
  )

  const rolesWithCounts = useMemo(
    () =>
      localRoles.map((role) => ({
        ...role,
        orgUserCount: orgUsers.filter((u) => u.role === role.id).length,
      })),
    [orgUsers, localRoles]
  )

  const handleEditClick = (role: Role) => {
    setEditingRole(role)
    setDialogOpen(true)
  }

  const handleSavePermissions = (
    roleId: Role['id'],
    permissions: string[]
  ) => {
    setLocalRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
    )
    toast.success('Role permissions updated')
  }

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
            <CardFooter className="flex items-center justify-between">
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
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => handleEditClick(role)}
              >
                <Edit className="h-3.5 w-3.5" />
                Edit Permissions
              </Button>
            </CardFooter>

            {/* Note for system roles */}
            {!role.isCustom && (
              <div className="px-6 pb-4 -mt-2">
                <p className="text-xs text-muted-foreground italic">
                  System roles have default permissions that apply to all users
                  with this role
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Edit Permissions Dialog */}
      <EditPermissionsDialog
        role={editingRole}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSavePermissions}
      />
    </div>
  )
}
