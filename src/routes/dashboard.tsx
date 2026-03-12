import { useState } from 'react'
import { MetricCard } from '@/components/shared/metric-card'
import { AlertCard } from '@/components/shared/alert-card'
import { HealthWidget } from '@/components/shared/health-widget'
import { Users, UserCheck, LayoutGrid, Columns3, CalendarDays, ShieldAlert, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { dashboardMetrics } from '@/data/dashboard'
import { cn } from '@/lib/utils'

const priorityBorder = {
  critical: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-sky-500',
}

const priorityBg = {
  critical: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-sky-500',
}

export default function DashboardPage() {
  const metrics = dashboardMetrics
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const visibleAlerts = metrics.alerts.filter((a) => !dismissedAlerts.has(a.id))

  // Merge alerts + attention items into one "Action Required" list
  const allActionItems = [
    ...visibleAlerts.map((a) => ({ type: 'alert' as const, data: a })),
    ...metrics.attentionItems.map((a) => ({ type: 'attention' as const, data: a })),
  ]

  function handleDismiss(id: string) {
    setDismissedAlerts((prev) => new Set(prev).add(id))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Governance administration control centre</p>
      </div>

      {/* Section 1: Action Required — merged alerts + attention items */}
      {allActionItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold">Action Required</h2>
              <span className="text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 rounded-full px-2 py-0.5">
                {allActionItems.length}
              </span>
            </div>
          </div>

          {/* Alert cards */}
          {visibleAlerts.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2 mb-3">
              {visibleAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onDismiss={handleDismiss} />
              ))}
            </div>
          )}

          {/* Attention items */}
          {metrics.attentionItems.length > 0 && (
            <div className="rounded-xl border bg-card divide-y">
              {metrics.attentionItems.map((item) => (
                <div key={item.id} className={cn('flex items-center gap-4 px-5 py-3.5 border-l-4', priorityBorder[item.priority])}>
                  <span className={cn('text-xs font-bold text-white rounded-full h-7 w-7 flex items-center justify-center shrink-0', priorityBg[item.priority])}>
                    {item.count}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Link to={item.actionPath} className="shrink-0">
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-sky-600 hover:text-sky-700 dark:text-sky-400">
                      {item.actionLabel} <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Section 2: Operational Metrics */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Operational Metrics</h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Total Users" value={metrics.totalUsers} icon={Users} />
          <MetricCard label="Active Directors" value={metrics.activeDirectors} icon={UserCheck} />
          <MetricCard label="Boards" value={metrics.boards} icon={LayoutGrid} />
          <MetricCard label="Committees" value={metrics.committees} icon={Columns3} />
          <MetricCard label="Meetings This Month" value={metrics.meetingsThisMonth} icon={CalendarDays} />
          <MetricCard
            label="Security Alerts"
            value={metrics.securityAlertsThisWeek}
            icon={ShieldAlert}
            className={metrics.securityAlertsThisWeek > 0 ? 'border-amber-200 dark:border-amber-900' : ''}
          />
        </div>
      </section>

      {/* Section 3: Activity Trends */}
      <section>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Authentication Activity</h3>
              <p className="text-sm text-muted-foreground">Logins, failed attempts, and new device registrations — last 7 days</p>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={metrics.loginTrend}>
              <defs>
                <linearGradient id="loginGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="count" name="Successful Logins" stroke="#0ea5e9" fill="url(#loginGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="failed" name="Failed Attempts" stroke="#ef4444" fill="url(#failedGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="newDevices" name="New Devices" stroke="#8b5cf6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Section 4: Security & Governance Health */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Security & Governance Health</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {metrics.securityHealth.map((widget) => (
            <HealthWidget key={widget.id} widget={widget} />
          ))}
        </div>
      </section>
    </div>
  )
}
