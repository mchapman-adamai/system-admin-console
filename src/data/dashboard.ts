import type { DashboardMetrics } from './types'

export const dashboardMetrics: DashboardMetrics = {
  totalUsers: 42,
  activeDirectors: 14,
  boards: 3,
  committees: 7,
  meetingsThisMonth: 12,
  securityAlertsThisWeek: 1,
  securityPostureScore: 87,
  compliancePercentage: 92,
  loginTrend: [
    { date: '2026-03-06', count: 28 },
    { date: '2026-03-07', count: 34 },
    { date: '2026-03-08', count: 12 },
    { date: '2026-03-09', count: 9 },
    { date: '2026-03-10', count: 31 },
    { date: '2026-03-11', count: 37 },
    { date: '2026-03-12', count: 25 },
  ],
  userActivityTrend: [
    { date: '2026-03-06', active: 26, inactive: 16 },
    { date: '2026-03-07', active: 30, inactive: 12 },
    { date: '2026-03-08', active: 11, inactive: 31 },
    { date: '2026-03-09', active: 8, inactive: 34 },
    { date: '2026-03-10', active: 29, inactive: 13 },
    { date: '2026-03-11', active: 33, inactive: 9 },
    { date: '2026-03-12', active: 22, inactive: 20 },
  ],
}
