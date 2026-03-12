import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  X,
  Plus,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  UserCheck,
  Edit,
} from 'lucide-react'
import { toast } from 'sonner'
import { roles } from '@/data/roles'
import { TENANT_ORG_ID } from '@/store/org-store'
import { useUserStore } from '@/store/user-store'
import { useAuditStore } from '@/store/audit-store'
import { formatRelativeTime, roleDisplayName } from '@/lib/utils'
import { StatusBadge } from '@/components/shared/status-badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User, RoleType } from '@/data/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// ---------------------------------------------------------------------------
// Add User Dialog
// ---------------------------------------------------------------------------

function AddUserDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const addUser = useUserStore((s) => s.addUser)
  const addAuditEntry = useAuditStore((s) => s.addEntry)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<RoleType>('governance_professional')
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [termExpiryDate, setTermExpiryDate] = useState('')

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setRole('governance_professional')
    setMfaEnabled(false)
    setTermExpiryDate('')
  }

  const canSubmit =
    firstName.trim() !== '' && lastName.trim() !== '' && email.trim() !== ''

  const handleCreate = () => {
    if (!canSubmit) return

    const newUser: Omit<User, 'id'> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      role,
      organisationId: TENANT_ORG_ID,
      status: 'active',
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      mfaEnabled,
      devices: [],
      ...(role === 'director' && termExpiryDate
        ? { termExpiryDate }
        : {}),
    }

    addUser(newUser)

    addAuditEntry({
      userId: 'usr-004', // current admin
      userName: 'Olivia Clarke',
      action: 'user_created',
      objectType: 'user',
      objectName: `${firstName.trim()} ${lastName.trim()}`,
      details: `Created user ${firstName.trim()} ${lastName.trim()} with role ${roleDisplayName(role)}`,
      organisationId: TENANT_ORG_ID,
    })

    toast.success('User created successfully')
    resetForm()
    onOpenChange(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm()
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account in the organisation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-first-name">First Name</Label>
              <Input
                id="add-first-name"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-last-name">Last Name</Label>
              <Input
                id="add-last-name"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-email">Email</Label>
            <Input
              id="add-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as RoleType)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="governance_professional">
                  Governance Professional
                </SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="observer">Observer</SelectItem>
                <SelectItem value="system_administrator">
                  System Administrator
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === 'director' && (
            <div className="space-y-1.5">
              <Label htmlFor="add-term-expiry">
                Term Expiry Date{' '}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="add-term-expiry"
                type="date"
                value={termExpiryDate}
                onChange={(e) => setTermExpiryDate(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
            <div>
              <Label htmlFor="add-mfa" className="cursor-pointer">
                MFA Enabled
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Require multi-factor authentication
              </p>
            </div>
            <Switch
              id="add-mfa"
              checked={mfaEnabled}
              onCheckedChange={setMfaEnabled}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button disabled={!canSubmit} onClick={handleCreate}>
            <UserPlus className="mr-1.5 h-4 w-4" />
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Row Actions Dropdown
// ---------------------------------------------------------------------------

function RowActionsDropdown({
  user,
  onViewDetails,
}: {
  user: User
  onViewDetails: () => void
}) {
  const suspendUser = useUserStore((s) => s.suspendUser)
  const reactivateUser = useUserStore((s) => s.reactivateUser)
  const addAuditEntry = useAuditStore((s) => s.addEntry)

  const handleSuspend = () => {
    suspendUser(user.id)
    addAuditEntry({
      userId: 'usr-004',
      userName: 'Olivia Clarke',
      action: 'user_suspended',
      objectType: 'user',
      objectName: `${user.firstName} ${user.lastName}`,
      details: `Suspended user ${user.firstName} ${user.lastName}`,
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
      objectName: `${user.firstName} ${user.lastName}`,
      details: `Reactivated user ${user.firstName} ${user.lastName}`,
      organisationId: TENANT_ORG_ID,
    })
    toast.success('User reactivated')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-xs" />
        }
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails()
          }}
        >
          <Edit className="mr-1.5 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {user.status === 'active' && (
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              handleSuspend()
            }}
          >
            <UserMinus className="mr-1.5 h-4 w-4" />
            Suspend
          </DropdownMenuItem>
        )}
        {user.status === 'suspended' && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleReactivate()
            }}
          >
            <UserCheck className="mr-1.5 h-4 w-4" />
            Reactivate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ---------------------------------------------------------------------------
// Users Page
// ---------------------------------------------------------------------------

export default function UsersPage() {
  const users = useUserStore((s) => s.users)
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const filteredUsers = useMemo(() => {
    let result = users

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      )
    }

    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter((u) => u.status === statusFilter)
    }

    return result
  }, [users, search, roleFilter, statusFilter])

  const hasActiveFilters =
    search !== '' || roleFilter !== 'all' || statusFilter !== 'all'

  const clearFilters = () => {
    setSearch('')
    setRoleFilter('all')
    setStatusFilter('all')
  }

  const handleRowClick = (user: User) => {
    navigate(`/people/users/${user.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            User Directory
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts, search and filter the user directory
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={(value: string | null) => value && setRoleFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="governance_professional">
              Governance Professional
            </SelectItem>
            <SelectItem value="director">Director</SelectItem>
            <SelectItem value="observer">Observer</SelectItem>
            <SelectItem value="system_administrator">
              System Administrator
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value: string | null) => value && setStatusFilter(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="offboarded">Offboarded</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} users
      </p>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <p className="text-muted-foreground">
                    {hasActiveFilters
                      ? 'No users match the current filters.'
                      : 'No users found.'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>{roleDisplayName(user.role)}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatRelativeTime(user.lastActiveAt)}
                  </TableCell>
                  <TableCell>
                    <RowActionsDropdown
                      user={user}
                      onViewDetails={() => handleRowClick(user)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <AddUserDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  )
}
