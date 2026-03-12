import { cn } from '@/lib/utils'
import type { SecurityHealthWidget } from '@/data/types'

const statusColors = {
  good: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
}

const statusTrack = {
  good: 'bg-emerald-100 dark:bg-emerald-900/30',
  warning: 'bg-amber-100 dark:bg-amber-900/30',
  critical: 'bg-red-100 dark:bg-red-900/30',
}

const statusText = {
  good: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  critical: 'text-red-600 dark:text-red-400',
}

export function HealthWidget({ widget }: { widget: SecurityHealthWidget }) {
  const percentage = widget.unit === '%' ? widget.value : Math.round((widget.value / widget.maxValue) * 100)
  const displayValue = widget.unit === '%' ? `${widget.value}%` : widget.value

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{widget.label}</p>
        <span className={cn('text-2xl font-bold', statusText[widget.status])}>{displayValue}</span>
      </div>
      <div className={cn('h-2 rounded-full', statusTrack[widget.status])}>
        <div
          className={cn('h-2 rounded-full transition-all', statusColors[widget.status])}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {widget.recommendation && (
        <p className="text-xs text-muted-foreground">{widget.recommendation}</p>
      )}
    </div>
  )
}
