import { useState, useMemo } from 'react'
import { auditLogs } from '@/data/audit-logs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'
import { Search, Download } from 'lucide-react'
import type { AuditAction } from '@/data/types'

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
}

function formatTimestamp(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy, HH:mm:ss')
}

export default function ActivityLogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')

  const uniqueActions = useMemo(() => {
    const actions = new Set(auditLogs.map((log) => log.action))
    return Array.from(actions).sort()
  }, [])

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesAction = actionFilter === 'all' || log.action === actionFilter
      const matchesSearch =
        searchQuery === '' ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.objectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        ACTION_LABELS[log.action].toLowerCase().includes(searchQuery.toLowerCase())
      return matchesAction && matchesSearch
    })
  }, [actionFilter, searchQuery])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground">Search, filter, and export the audit trail</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user, object, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {uniqueActions.map((action) => (
              <SelectItem key={action} value={action}>
                {ACTION_LABELS[action]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => toast.info('Preparing export...')}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredLogs.length} of {auditLogs.length} entries
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Object</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {formatTimestamp(log.timestamp)}
                </TableCell>
                <TableCell className="font-medium">{log.userName}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                    {ACTION_LABELS[log.action]}
                  </span>
                </TableCell>
                <TableCell>{log.objectName}</TableCell>
                <TableCell className="max-w-[300px] truncate text-muted-foreground">
                  {log.details ?? '-'}
                </TableCell>
              </TableRow>
            ))}
            {filteredLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No audit log entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
