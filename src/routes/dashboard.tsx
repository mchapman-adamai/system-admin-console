import { MetricCard } from '@/components/shared/metric-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Users, UserCheck, LayoutGrid, Columns3, CalendarDays, ShieldAlert, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { dashboardMetrics } from '@/data/dashboard'
import { auditLogs } from '@/data/audit-logs'
import { formatRelativeTime } from '@/lib/utils'

const COLORS = ['#0ea5e9', '#e2e8f0']

export default function DashboardPage() {
  const metrics = dashboardMetrics
  const recentActivity = auditLogs.slice(0, 8)
  const complianceData = [
    { name: 'Compliant', value: metrics.compliancePercentage },
    { name: 'Remaining', value: 100 - metrics.compliancePercentage },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your governance platform</p>
      </div>

      {/* Metric Cards */}
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Login Trend Chart */}
        <div className="rounded-xl border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Login Activity</h3>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={metrics.loginTrend}>
              <defs>
                <linearGradient id="loginGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis className="text-xs" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="count" stroke="#0ea5e9" fill="url(#loginGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Security Posture + Compliance */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-1">Security Posture</h3>
            <p className="text-sm text-muted-foreground mb-3">Policy compliance score</p>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceData}
                      innerRadius={30}
                      outerRadius={42}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {complianceData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {metrics.securityPostureScore}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{metrics.compliancePercentage}% compliant</p>
                <p className="text-muted-foreground">
                  {metrics.compliancePercentage >= 90 ? 'Excellent' : metrics.compliancePercentage >= 70 ? 'Good' : 'Needs attention'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/identity/mfa">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  Configure MFA <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
              <Link to="/people/users">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  Manage Users <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
              <Link to="/audit/activity-log">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  View Audit Log <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* User Activity Chart + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-1">User Activity</h3>
          <p className="text-sm text-muted-foreground mb-4">Active vs inactive users this week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics.userActivityTrend}>
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
              <Bar dataKey="active" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Active" />
              <Bar dataKey="inactive" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Inactive" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Latest audit events</p>
            </div>
            <Link to="/audit/activity-log">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 text-sm">
                <div className="mt-1 h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">
                    <span className="font-medium">{entry.userName}</span>{' '}
                    <span className="text-muted-foreground">{entry.action.replace(/_/g, ' ')}</span>{' '}
                    {entry.objectName && <span className="text-muted-foreground">— {entry.objectName}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
