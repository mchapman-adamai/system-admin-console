import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  KeyRound,
  UserMinus,
  UserCheck,
  Tablet,
  Smartphone,
  Laptop,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'
import { roles } from '@/data/roles'
import { TENANT_ORG_ID } from '@/store/org-store'
import { useUserStore } from '@/store/user-store'
import { useDeviceStore } from '@/store/device-store'
import { useAuditStore } from '@/store/audit-store'
import { useProfileStore } from '@/store/profile-store'
import { formatRelativeTime, roleDisplayName } from '@/lib/utils'
import { StatusBadge } from '@/components/shared/status-badge'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { RoleType, AuditAction } from '@/data/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const DEVICE_ICONS: Record<string, typeof Tablet> = {
  tablet: Tablet,
  mobile: Smartphone,
  laptop: Laptop,
}

const ACTION_LABELS: Record<AuditAction, string> = {
  login: 'Login',
  logout: 'Logout',
  login_failed: 'Login Failed',
  updated_mfa_policy: 'Updated MFA Policy',
  updated_password_policy: 'Updated Password Policy',
  updated_session_policy: 'Updated Session Policy',
  created_meeting: 'Created Meeting',
  viewed_document: 'Viewed Document',
  download_blocked: 'Download Blocked',
  user_created: 'User Created',
  user_suspended: 'User Suspended',
  user_offboarded: 'User Offboarded',
  role_modified: 'Role Modified',
  permission_changed: 'Permission Changed',
  device_registered: 'Device Registered',
  device_deactivated: 'Device Deactivated',
  config_changed: 'Config Changed',
  export_attempted: 'Export Attempted',
  password_reset_requested: 'Password Reset Requested',
  profile_assigned: 'Profile Assigned',
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

type Tab = 'overview' | 'devices' | 'activity' | 'policies'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'devices', label: 'Devices' },
  { id: 'activity', label: 'Activity' },
  { id: 'policies', label: 'Policies' },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const users = useUserStore((s) => s.users)
  const updateUser = useUserStore((s) => s.updateUser)
  const suspendUser = useUserStore((s) => s.suspendUser)
  const reactivateUser = useUserStore((s) => s.reactivateUser)
  const offboardUser = useUserStore((s) => s.offboardUser)
  const devices = useDeviceStore((s) => s.devices)
  const auditEntries = useAuditStore((s) => s.entries)
  const addAuditEntry = useAuditStore((s) => s.addEntry)
  const profiles = useProfileStore((s) => s.profiles)

  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [editRole, setEditRole] = useState<RoleType | ''>('')
  const [editMfa, setEditMfa] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [offboardOpen, setOffboardOpen] = useState(false)

  const user = useMemo(() => users.find((u) => u.id === id) ?? null, [users, id])

  // Sync edit state when user changes
  const [trackedId, setTrackedId] = useState('')
  if (user && user.id !== trackedId) {
    setTrackedId(user.id)
    setEditRole(user.role)
    setEditMfa(user.mfaEnabled)
    setHasChanges(false)
  }

  const userDevices = useMemo(
    () => devices.filter((d) => d.userId === id),
    [devices, id],
  )

  const userAuditEntries = useMemo(
    () => auditEntries.filter((e) => e.userId === id),
    [auditEntries, id],
  )

  const assignedProfile = useMemo(
    () => profiles.find((p) => p.id === user?.profileId) ?? null,
    [profiles, user?.profileId],
  )

  if (!user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/people/users')}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Users
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    )
  }

  const fullName = `${user.firstName} ${user.lastName}`
  const role = roles.find((r) => r.id === user.role)
  const isOffboarded = user.status === 'offboarded'
  const isSuspended = user.status === 'suspended'
  const isActive = user.status === 'active'

  const handleRoleChange = (value: string | null) => {
    if (!value) return
    setEditRole(value as RoleType)
    setHasChanges(value !== user.role || editMfa !== user.mfaEnabled)
  }

  const handleMfaChange = (value: boolean) => {
    setEditMfa(value)
    setHasChanges(editRole !== user.role || value !== user.mfaEnabled)
  }

  const handleSaveChanges = () => {
    const updates: Partial<{ role: RoleType; mfaEnabled: boolean }> = {}
    if (editRole !== user.role) updates.role = editRole as RoleType
    if (editMfa !== user.mfaEnabled) updates.mfaEnabled = editMfa
    updateUser(user.id, updates)
    addAuditEntry({
      userId: 'usr-004',
      userName: 'Olivia Clarke',
      action: 'role_modified',
      objectType: 'user',
      objectName: fullName,
      details: `Updated user: ${Object.keys(updates).join(', ')}`,
      organisationId: TENANT_ORG_ID,
    })
    toast.success('User updated successfully')
    setHasChanges(false)
  }

  const handleResetPassword = () => {
    addAuditEntry({
      userId: 'usr-004',
      userName: 'Olivia Clarke',
      action: 'password_reset_requested',
      objectType: 'user',
      objectName: fullName,
      details: `Password reset email sent to ${user.email}`,
      organisationId: TENANT_ORG_ID,
    })
    toast.success(`Password reset email sent to ${user.email}`)
  }

  const handleSuspend = () => {
    suspendUser(user.id)
    addAuditEntry({
      userId: 'usr-004',
      userName: 'Olivia Clarke',
      action: 'user_suspended',
      objectType: 'user',
      objectName: fullName,
      details: `Suspended user ${fullName}`,
      organisationId: TENANT_ORG_ID,
    })
    toast.success('User suspended')
  }

  const handleReactivate = () => {
    reactivateUser(user.id)
    addAuditEntry({
      userId: 'usr-004',
      userName: 'Olivia Clarke',
      action: 'user_created',
      objectType: 'user',
      objectName: fullName,
      details: `Reactivated user ${fullName}`,
      organisationId: TENANT_ORG_ID,
    })
    toast.success('User reactivated')
  }

  const handleOffboard = () => {
    offboardUser(user.id)
    addAuditEntry({
      userId: 'usr-004',
      userName: 'Olivia Clarke',
      action: 'user_offboarded',
      objectType: 'user',
      objectName: fullName,
      details: `Offboarded user ${fullName}`,
      organisationId: TENANT_ORG_ID,
    })
    toast.success('User offboarded')
  }

  const handleProfileChange = (profileId: string | null) => {
    if (!profileId) return
    const newProfileId = profileId === 'none' ? undefined : profileId
    updateUser(user.id, { profileId: newProfileId })
    const profileName = profiles.find((p) => p.id === newProfileId)?.name ?? 'None'
    addAuditEntry({
      userId: 'usr-004',
      userName: 'Olivia Clarke',
      action: 'profile_assigned',
      objectType: 'user',
      objectName: fullName,
      details: `Assigned profile "${profileName}" to ${fullName}`,
      organisationId: TENANT_ORG_ID,
    })
    toast.success(`Profile updated to "${profileName}"`)
  }

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/people/users')}>
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to Users
      </Button>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
              <StatusBadge status={user.status} />
            </div>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOffboarded && (
            <Button variant="outline" onClick={() => setResetPasswordOpen(true)}>
              <KeyRound className="mr-1.5 h-4 w-4" />
              Reset Password
            </Button>
          )}
          {isActive && (
            <Button variant="destructive" onClick={() => setSuspendOpen(true)}>
              <UserMinus className="mr-1.5 h-4 w-4" />
              Suspend
            </Button>
          )}
          {isSuspended && (
            <>
              <Button onClick={handleReactivate}>
                <UserCheck className="mr-1.5 h-4 w-4" />
                Reactivate
              </Button>
              <Button variant="destructive" onClick={() => setOffboardOpen(true)}>
                Offboard
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Offboarded notice */}
      {isOffboarded && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          This user has been offboarded. Their account is read-only.
        </div>
      )}

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.id === 'devices' && userDevices.length > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground">({userDevices.length})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Info Grid */}
          <div className="rounded-lg border bg-card">
            <div className="border-b px-6 py-4">
              <h3 className="text-base font-semibold">User Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-6">
              <div>
                <Label className="text-muted-foreground text-xs">Role</Label>
                {isOffboarded ? (
                  <p className="text-sm font-medium mt-1">{roleDisplayName(user.role)}</p>
                ) : (
                  <Select value={editRole || user.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="governance_professional">Governance Professional</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="observer">Observer</SelectItem>
                      <SelectItem value="system_administrator">System Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">MFA Enabled</Label>
                {isOffboarded ? (
                  <p className="text-sm font-medium mt-1">{user.mfaEnabled ? 'Yes' : 'No'}</p>
                ) : (
                  <div className="mt-2">
                    <Switch checked={editMfa} onCheckedChange={handleMfaChange} />
                  </div>
                )}
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Last Active</Label>
                <p className="text-sm font-medium mt-1">{formatRelativeTime(user.lastActiveAt)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Created</Label>
                <p className="text-sm font-medium mt-1">{formatRelativeTime(user.createdAt)}</p>
              </div>
              {user.termExpiryDate && (
                <div>
                  <Label className="text-muted-foreground text-xs">Term Expiry</Label>
                  <p className="text-sm font-medium mt-1">{user.termExpiryDate}</p>
                </div>
              )}
            </div>
            {hasChanges && !isOffboarded && (
              <div className="flex items-center justify-end gap-2 border-t px-6 py-3 bg-muted/30">
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditRole(user.role)
                  setEditMfa(user.mfaEnabled)
                  setHasChanges(false)
                }}>
                  Discard
                </Button>
                <Button size="sm" onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            )}
          </div>

          {/* Individual Record */}
          {user.individualId && (
            <div className="rounded-lg border bg-card px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-muted-foreground text-xs">Individual Record</Label>
                  <p className="text-sm font-medium mt-1">
                    {user.individualId} — {fullName}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Assigned Profile */}
          <div className="rounded-lg border bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-muted-foreground text-xs">Assigned Profile</Label>
                {assignedProfile ? (
                  <Link
                    to={`/profiles/${assignedProfile.id}`}
                    className="text-sm font-medium mt-1 text-primary hover:underline block"
                  >
                    {assignedProfile.name}
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">No profile assigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Permissions */}
          {role && (
            <div className="rounded-lg border bg-card px-6 py-4">
              <Label className="text-muted-foreground text-xs">Permissions</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {role.permissions.map((perm) => (
                  <Badge key={perm} variant="secondary" className="text-xs">
                    {perm.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="rounded-lg border bg-card">
          {userDevices.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No devices registered for this user
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>App Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userDevices.map((device) => {
                  const DeviceIcon = DEVICE_ICONS[device.deviceType] ?? Laptop
                  return (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.deviceName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">{device.deviceType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={device.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatRelativeTime(device.registeredAt)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {device.lastUsedAppVersion ?? '-'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="rounded-lg border bg-card">
          {userAuditEntries.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No activity found for this user
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Object</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAuditEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {format(parseISO(entry.timestamp), 'd MMM yyyy, HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                        {ACTION_LABELS[entry.action]}
                      </span>
                    </TableCell>
                    <TableCell>{entry.objectName}</TableCell>
                    <TableCell className="max-w-[300px] truncate text-muted-foreground">
                      {entry.details ?? '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="space-y-6">
          <div className="rounded-lg border bg-card px-6 py-4">
            <Label className="text-muted-foreground text-xs">Assigned Profile</Label>
            {isOffboarded ? (
              <p className="text-sm font-medium mt-1">
                {assignedProfile?.name ?? 'No profile assigned'}
              </p>
            ) : (
              <Select
                value={user.profileId ?? 'none'}
                onValueChange={handleProfileChange}
              >
                <SelectTrigger className="mt-1 w-full max-w-xs">
                  <SelectValue placeholder="Select a profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No profile</SelectItem>
                  {profiles.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {assignedProfile && (
              <p className="text-sm text-muted-foreground mt-2">
                {assignedProfile.description}
              </p>
            )}
            {assignedProfile && (
              <Link
                to={`/profiles/${assignedProfile.id}`}
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                View profile settings
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        title="Reset Password"
        description={`This will send a password reset email to ${user.email}. Are you sure?`}
        confirmLabel="Send Reset Email"
        onConfirm={handleResetPassword}
      />
      <ConfirmDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        title="Suspend User"
        description={`Are you sure you want to suspend ${fullName}? They will lose access immediately.`}
        confirmLabel="Suspend"
        variant="destructive"
        onConfirm={handleSuspend}
      />
      <ConfirmDialog
        open={offboardOpen}
        onOpenChange={setOffboardOpen}
        title="Offboard User"
        description={`Are you sure you want to offboard ${fullName}? This action cannot be undone.`}
        confirmLabel="Offboard"
        variant="destructive"
        onConfirm={handleOffboard}
      />
    </div>
  )
}
