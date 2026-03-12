import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { AttentionItem } from '@/data/types'

const priorityBg = {
  critical: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-sky-500',
}

export function AttentionItemCard({ item }: { item: AttentionItem }) {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-xs font-bold text-white rounded-full h-6 w-6 flex items-center justify-center', priorityBg[item.priority])}>
            {item.count}
          </span>
          <h4 className="font-semibold text-sm">{item.title}</h4>
        </div>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
      <Link to={item.actionPath}>
        <Button variant="ghost" size="sm" className="text-xs h-7 px-0 text-sky-600 hover:text-sky-700 dark:text-sky-400">
          {item.actionLabel} <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </Link>
    </div>
  )
}
