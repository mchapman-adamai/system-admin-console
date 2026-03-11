import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { SecurityBadge } from './security-badge'
import type { ReactNode } from 'react'

type SecurityLevel = 'high' | 'medium' | 'low' | 'governance_critical'

interface BaseSettingRowProps {
  label: string
  description?: string
  securityLevel?: SecurityLevel
  lastModified?: string
  className?: string
}

interface ToggleSettingProps extends BaseSettingRowProps {
  type: 'toggle'
  value: boolean
  onChange: (value: boolean) => void
}

interface NumberSettingProps extends BaseSettingRowProps {
  type: 'number'
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  suffix?: string
}

interface SelectSettingProps extends BaseSettingRowProps {
  type: 'select'
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

interface SliderSettingProps extends BaseSettingRowProps {
  type: 'slider'
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
}

interface CustomSettingProps extends BaseSettingRowProps {
  type: 'custom'
  children: ReactNode
}

type SettingRowProps =
  | ToggleSettingProps
  | NumberSettingProps
  | SelectSettingProps
  | SliderSettingProps
  | CustomSettingProps

export function SettingRow(props: SettingRowProps) {
  const { label, description, securityLevel, lastModified, className } = props

  return (
    <div className={cn('flex items-start justify-between gap-8 py-4', className)}>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label}</span>
          {securityLevel && <SecurityBadge level={securityLevel} />}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {lastModified && (
          <p className="text-xs text-muted-foreground/70">{lastModified}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {props.type === 'toggle' && (
          <Switch checked={props.value} onCheckedChange={props.onChange} />
        )}
        {props.type === 'number' && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={props.value}
              onChange={(e) => props.onChange(Number(e.target.value))}
              min={props.min}
              max={props.max}
              className="w-20 text-right"
            />
            {props.suffix && (
              <span className="text-sm text-muted-foreground">{props.suffix}</span>
            )}
          </div>
        )}
        {props.type === 'select' && (
          <Select value={props.value} onValueChange={props.onChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {props.type === 'slider' && (
          <div className="flex items-center gap-3 w-[200px]">
            <Slider
              value={[props.value]}
              onValueChange={([v]) => props.onChange(v)}
              min={props.min}
              max={props.max}
              step={props.step ?? 1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-12 text-right">
              {props.value}{props.suffix ?? ''}
            </span>
          </div>
        )}
        {props.type === 'custom' && props.children}
      </div>
    </div>
  )
}
