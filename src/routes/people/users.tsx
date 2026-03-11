import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { users } from '@/data/users'
import { roles } from '@/data/roles'
import { TENANT_ORG_ID } from '@/store/org-store'
import { formatRelativeTime, roleDisplayName } from '@/lib/utils'
import { StatusBadge } from '@/components/shared/status-badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
import type { User, RoleType } from '@/data/types'

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

function UserDetailDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!user) return null

  const role = roles.find((r) => r.id === user.role)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Account information for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="font-medium">{roleDisplayName(user.role)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <div className="mt-0.5">
                <StatusBadge status={user.status} />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">MFA Enabled</p>
              <p className="font-medium">{user.mfaEnabled ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Devices</p>
              <p className="font-medium">
                {user.devices.length === 0
                  ? 'None registered'
                  : `${user.devices.length} registered`}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Active</p>
              <p className="font-medium">
                {formatRelativeTime(user.lastActiveAt)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">
                {formatRelativeTime(user.createdAt)}
              </p>
            </div>
            {user.termExpiryDate && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Term Expiry</p>
                <p className="font-medium">{user.termExpiryDate}</p>
              </div>
            )}
          </div>
          {role && (
            <div>
              <p className="text-sm text-muted-foreground mb-1.5">
                Permissions
              </p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((perm) => (
                  <Badge key={perm} variant="secondary" className="text-xs">
                    {perm.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const orgUsers = useMemo(
    () => users.filter((u) => u.organisationId === TENANT_ORG_ID),
    []
  )

  const filteredUsers = useMemo(() => {
    let result = orgUsers

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
  }, [orgUsers, search, roleFilter, statusFilter])

  const hasActiveFilters =
    search !== '' || roleFilter !== 'all' || statusFilter !== 'all'

  const clearFilters = () => {
    setSearch('')
    setRoleFilter('all')
    setStatusFilter('all')
  }

  const handleRowClick = (user: User) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          User Directory
        </h1>
        <p className="text-muted-foreground">
          Manage user accounts, search and filter the user directory
        </p>
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
        <Select value={roleFilter} onValueChange={setRoleFilter}>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
        Showing {filteredUsers.length} of {orgUsers.length} users
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Detail Dialog */}
      <UserDetailDialog
        user={selectedUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
