import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart, AlertTriangle, Lock, KeyRound, UserX, Clock, Smartphone, ShieldOff, Search, Filter } from 'lucide-react'
import { customerAlerts } from '@/data/customer-alerts'
import { formatRelativeTime, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CustomerAlertType } from '@/data/types'

const typeIcons: Record<CustomerAlertType, typeof Lock> = {
  account_locked: Lock,
  password_expiring: KeyRound,
  account_suspended: UserX,
  login_failures: AlertTriangle,
  inactive_director: Clock,
  device_pending: Smartphone,
  mfa_not_enabled: ShieldOff,
}

const typeLabels: Record<CustomerAlertType, string> = {
  account_locked: 'Account Locked',
  password_expiring: 'Password Expiring',
  account_suspended: 'Account Suspended',
  login_failures: 'Login Failures',
  inactive_director: 'Inactive Director',
  device_pending: 'Device Pending',
  mfa_not_enabled: 'MFA Not Enabled',
}

const severityStyles = {
  critical: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
  warning: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
  info: 'border-l-sky-500 bg-sky-50/50 dark:bg-sky-950/20',
}

const severityBadge = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
}

export default function CustomerAlertsPage() {
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const alerts = useMemo(() => {
    return customerAlerts.filter((a) => {
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false
      if (typeFilter !== 'all' && a.type !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          a.affectedUser.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, severityFilter, typeFilter])

  const criticalCount = customerAlerts.filter((a) => a.severity === 'critical' && !a.resolved).length
  const warningCount = customerAlerts.filter((a) => a.severity === 'warning' && !a.resolved).length
  const totalUnresolved = customerAlerts.filter((a) => !a.resolved).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/30">
              <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Customer Assistance Alerts</h1>
              <p className="text-muted-foreground">
                Proactive alerts for VIP directors and executives who may need help
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Unresolved</p>
          <p className="text-3xl font-semibold mt-1">{totalUnresolved}</p>
        </div>
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">Critical</p>
          <p className="text-3xl font-semibold text-red-700 dark:text-red-300 mt-1">{criticalCount}</p>
        </div>
        <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 p-4">
          <p className="text-sm text-amber-600 dark:text-amber-400">Warnings</p>
          <p className="text-3xl font-semibold text-amber-700 dark:text-amber-300 mt-1">{warningCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={severityFilter} onValueChange={(v) => v && setSeverityFilter(v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="account_locked">Account Locked</SelectItem>
            <SelectItem value="password_expiring">Password Expiring</SelectItem>
            <SelectItem value="account_suspended">Suspended</SelectItem>
            <SelectItem value="login_failures">Login Failures</SelectItem>
            <SelectItem value="inactive_director">Inactive</SelectItem>
            <SelectItem value="device_pending">Device Pending</SelectItem>
            <SelectItem value="mfa_not_enabled">MFA Missing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {alerts.length} of {customerAlerts.length} alerts
      </p>

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = typeIcons[alert.type]
          return (
            <div
              key={alert.id}
              className={cn(
                'rounded-lg border border-l-4 p-4',
                severityStyles[alert.severity]
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <Icon className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      <span className={cn('text-[10px] font-medium uppercase px-1.5 py-0.5 rounded', severityBadge[alert.severity])}>
                        {alert.severity}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {typeLabels[alert.type]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{alert.affectedUser}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <Link to={alert.actionPath} className="shrink-0">
                  <Button
                    size="sm"
                    variant={alert.severity === 'critical' ? 'default' : 'outline'}
                    className="text-xs h-8"
                  >
                    {alert.actionLabel}
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
        {alerts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No alerts match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
