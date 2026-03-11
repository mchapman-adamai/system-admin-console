import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface PolicySectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function PolicySection({ title, description, children, className }: PolicySectionProps) {
  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      <div className="border-b px-6 py-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="px-6 divide-y">{children}</div>
    </div>
  )
}
