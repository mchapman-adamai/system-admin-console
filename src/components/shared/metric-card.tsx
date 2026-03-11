import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: { value: number; isPositive: boolean }
  className?: string
}

export function MetricCard({ label, value, icon: Icon, trend, className }: MetricCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
    </div>
  )
}
