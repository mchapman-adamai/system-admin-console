import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SaveBarProps {
  show: boolean
  onSave: () => void
  onDiscard: () => void
  className?: string
}

export function SaveBar({ show, onSave, onDiscard, className }: SaveBarProps) {
  if (!show) return null

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t bg-card px-6 py-3 shadow-lg animate-in slide-in-from-bottom-2',
        className
      )}
    >
      <p className="text-sm font-medium">You have unsaved changes</p>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onDiscard}>
          Discard
        </Button>
        <Button size="sm" onClick={onSave}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
