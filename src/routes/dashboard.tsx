import { useState } from 'react'
import { MetricCard } from '@/components/shared/metric-card'
import { AlertCard } from '@/components/shared/alert-card'
import { HealthWidget } from '@/components/shared/health-widget'
import { Users, UserCheck, LayoutGrid, Columns3, CalendarDays, ShieldAlert, TrendingUp, ArrowRight, HeartHandshake, AlertTriangle, Bot, FileCheck, Loader2, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { dashboardMetrics } from '@/data/dashboard'
import { customerAlerts } from '@/data/customer-alerts'
import { botMetrics, botInstances } from '@/data/bots'
import { minutesMetrics } from '@/data/minutes'
import { cn, formatRelativeTime } from '@/lib/utils'

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

  function handleDismiss(id: string) {
    setDismissedAlerts((prev) => new Set(prev).add(id))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Governance administration control centre</p>
      </div>

      {/* Section 1: Immediate Action Alerts */}
      {visibleAlerts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold">Immediate Action Required</h2>
              <span className="text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 rounded-full px-2 py-0.5">
                {visibleAlerts.length}
              </span>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {visibleAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onDismiss={handleDismiss} />
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Needs Attention — merged attention items + recommended actions */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Needs Attention</h2>
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
      </section>

      {/* Section 2b: Customer Assistance Alerts */}
      {(() => {
        const unresolvedAlerts = customerAlerts.filter((a) => !a.resolved)
        const criticalCount = unresolvedAlerts.filter((a) => a.severity === 'critical').length
        const warningCount = unresolvedAlerts.filter((a) => a.severity === 'warning').length
        return (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-pink-500" />
                <h2 className="text-lg font-semibold">Customer Assistance Alerts</h2>
                {criticalCount > 0 && (
                  <Badge variant="default" className="bg-red-500 text-white text-[10px]">{criticalCount} critical</Badge>
                )}
                {warningCount > 0 && (
                  <Badge variant="default" className="bg-amber-500 text-white text-[10px]">{warningCount} warnings</Badge>
                )}
              </div>
              <Link to="/customer-alerts">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="rounded-xl border bg-card divide-y">
              {unresolvedAlerts.filter((a) => a.severity === 'critical').slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center gap-4 px-5 py-3.5 border-l-4 border-l-red-500">
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.affectedUser} • {formatRelativeTime(alert.timestamp)}</p>
                  </div>
                  <Link to={alert.actionPath} className="shrink-0">
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-red-600 hover:text-red-700 dark:text-red-400">
                      {alert.actionLabel} <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
              {unresolvedAlerts.filter((a) => a.severity === 'warning').slice(0, 2).map((alert) => (
                <div key={alert.id} className="flex items-center gap-4 px-5 py-3.5 border-l-4 border-l-amber-500">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.affectedUser} • {formatRelativeTime(alert.timestamp)}</p>
                  </div>
                  <Link to={alert.actionPath} className="shrink-0">
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-amber-600 hover:text-amber-700 dark:text-amber-400">
                      {alert.actionLabel} <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )
      })()}

      {/* Section 2c: Automation Status — Bot & Minutes */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Automation Status</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Bot Status Card */}
          <Link to="/bots/command-centre" className="group">
            <div className="rounded-xl border bg-card p-5 hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/40">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Bot Attendance</h3>
                    <p className="text-[11px] text-muted-foreground">Real-time bot status</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="flex h-2 w-2"><span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span>
                    <span className="text-lg font-bold">{botMetrics.inCalls}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">In Calls</p>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-amber-500">{botMetrics.inWaitingRoom}</span>
                  <p className="text-[10px] text-muted-foreground">Waiting</p>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-blue-500">{botMetrics.queued}</span>
                  <p className="text-[10px] text-muted-foreground">Queued</p>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-red-500">{botMetrics.failedToday}</span>
                  <p className="text-[10px] text-muted-foreground">Failed</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Minutes Status Card */}
          <Link to="/minutes/command-centre" className="group">
            <div className="rounded-xl border bg-card p-5 hover:border-violet-300 dark:hover:border-violet-800 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/40">
                    <FileCheck className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Minutes Processing</h3>
                    <p className="text-[11px] text-muted-foreground">AI generation status</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-500 transition-colors" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  {minutesMetrics.processingNow > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                      <span className="text-lg font-bold text-amber-500">{minutesMetrics.processingNow}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold">{minutesMetrics.processingNow}</span>
                  )}
                  <p className="text-[10px] text-muted-foreground">Processing</p>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-blue-500">{minutesMetrics.queued}</span>
                  <p className="text-[10px] text-muted-foreground">Queued</p>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-emerald-500">{minutesMetrics.generatedToday}</span>
                  <p className="text-[10px] text-muted-foreground">Today</p>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold">{minutesMetrics.avgQualityScore}%</span>
                  <p className="text-[10px] text-muted-foreground">Quality</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Section 3: Operational Metrics */}
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

      {/* Section 4: Activity Trends */}
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

      {/* Section 5: Security & Governance Health — after activity chart */}
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
