import { Construction } from 'lucide-react'

interface PagePlaceholderProps {
  title: string
  description: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Construction className="h-12 w-12 text-muted-foreground/40 mb-4" />
      <h2 className="text-lg font-semibold text-muted-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground/70 mt-1 max-w-md">{description}</p>
    </div>
  )
}
