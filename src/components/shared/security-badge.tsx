import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

type SecurityLevel = 'high' | 'medium' | 'low' | 'governance_critical'

const levelStyles: Record<SecurityLevel, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  governance_critical: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const levelLabels: Record<SecurityLevel, string> = {
  high: 'High Impact',
  medium: 'Medium Impact',
  low: 'Low Impact',
  governance_critical: 'Governance Critical',
}

interface SecurityBadgeProps {
  level: SecurityLevel
  className?: string
}

export function SecurityBadge({ level, className }: SecurityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0 text-xs font-medium gap-1',
        levelStyles[level],
        className
      )}
    >
      {level === 'governance_critical' && <Shield className="h-3 w-3" />}
      {levelLabels[level]}
    </Badge>
  )
}
