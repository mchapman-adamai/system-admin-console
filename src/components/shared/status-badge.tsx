import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StatusVariant = 'active' | 'suspended' | 'offboarded' | 'pending' | 'approved' | 'disabled'

const variantStyles: Record<StatusVariant, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  suspended: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  offboarded: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  disabled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

interface StatusBadgeProps {
  status: StatusVariant
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0 font-medium capitalize',
        variantStyles[status],
        className
      )}
    >
      {status}
    </Badge>
  )
}
