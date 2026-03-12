import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ShieldAlert, Lock, Smartphone, Bot, FileWarning, X } from 'lucide-react'
import type { DashboardAlert } from '@/data/types'
import { formatRelativeTime } from '@/lib/utils'

const priorityStyles = {
  critical: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
  warning: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
  info: 'border-l-sky-500 bg-sky-50/50 dark:bg-sky-950/20',
}

const priorityBadge = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
}

function getAlertIcon(title: string) {
  if (title.toLowerCase().includes('locked')) return Lock
  if (title.toLowerCase().includes('device')) return Smartphone
  if (title.toLowerCase().includes('suspicious')) return ShieldAlert
  if (title.toLowerCase().includes('bot')) return Bot
  if (title.toLowerCase().includes('minutes')) return FileWarning
  return AlertTriangle
}

export function AlertCard({ alert, onDismiss }: { alert: DashboardAlert; onDismiss?: (id: string) => void }) {
  const Icon = getAlertIcon(alert.title)

  return (
    <div className={cn('rounded-lg border border-l-4 p-4 space-y-2', priorityStyles[alert.priority])}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Icon className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm">{alert.title}</h4>
              <span className={cn('text-[10px] font-medium uppercase px-1.5 py-0.5 rounded', priorityBadge[alert.priority])}>
                {alert.priority}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{alert.description}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(alert.timestamp)}</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={() => onDismiss(alert.id)}
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex justify-end">
        <Link to={alert.actionPath}>
          <Button size="sm" variant={alert.priority === 'critical' ? 'default' : 'outline'} className="text-xs h-7">
            {alert.actionLabel}
          </Button>
        </Link>
      </div>
    </div>
  )
}
