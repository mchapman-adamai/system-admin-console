import { useSettingsStore } from '@/store/settings-store'
import { CheckCircle, XCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { OrgSettings } from '@/data/types'

function BooleanCell({ value }: { value: boolean }) {
  return value ? (
    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
      <CheckCircle className="h-4 w-4" />
      <span className="text-sm">Enabled</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
      <XCircle className="h-4 w-4" />
      <span className="text-sm">Disabled</span>
    </div>
  )
}

interface PolicyRow {
  category: string
  label: string
  getValue: (settings: OrgSettings) => string | boolean | number
}

const policyRows: PolicyRow[] = [
  {
    category: 'Authentication',
    label: 'SSO Enabled',
    getValue: (s) => s.auth.sso.enabled,
  },
  {
    category: 'Authentication',
    label: 'SSO Provider',
    getValue: (s) => s.auth.sso.provider,
  },
  {
    category: 'Authentication',
    label: 'MFA Required',
    getValue: (s) => s.auth.mfa.required,
  },
  {
    category: 'Authentication',
    label: 'Session Timeout',
    getValue: (s) => `${s.auth.session.webPortalTimeoutMinutes} min`,
  },
  {
    category: 'Authentication',
    label: 'Concurrent Sessions',
    getValue: (s) => s.auth.session.concurrentSessionsAllowed,
  },
  {
    category: 'Authentication',
    label: 'Login Retry Limit',
    getValue: (s) => `${s.auth.session.loginRetryLimit} attempts`,
  },
  {
    category: 'Password',
    label: 'Minimum Length',
    getValue: (s) => `${s.password.minimumLength} characters`,
  },
  {
    category: 'Password',
    label: 'Password Expiry',
    getValue: (s) => `${s.password.expiryDays} days`,
  },
  {
    category: 'Password',
    label: 'Dictionary Check',
    getValue: (s) => s.password.dictionaryStrength,
  },
  {
    category: 'Content',
    label: 'Document Export Allowed',
    getValue: (s) => s.contentProtection.documentExport,
  },
  {
    category: 'Content',
    label: 'Printing Allowed',
    getValue: (s) => s.contentProtection.printing,
  },
  {
    category: 'Content',
    label: 'Copy & Paste Allowed',
    getValue: (s) => s.contentProtection.copyPaste,
  },
  {
    category: 'Content',
    label: 'Watermark Enabled',
    getValue: (s) => s.contentProtection.watermark.enabled,
  },
  {
    category: 'Content',
    label: 'Field-Level Protection',
    getValue: (s) => s.contentProtection.sensitiveContent.fieldLevelProtection,
  },
  {
    category: 'Devices',
    label: 'Device Registration Required',
    getValue: (s) => s.deviceSecurity.registration.required,
  },
  {
    category: 'Devices',
    label: 'Max Devices Per User',
    getValue: (s) => s.deviceSecurity.registration.maxDevicesPerUser,
  },
  {
    category: 'Devices',
    label: 'Biometric Unlock',
    getValue: (s) => s.deviceSecurity.session.biometricUnlock,
  },
  {
    category: 'Devices',
    label: 'Offline Access',
    getValue: (s) => s.deviceSecurity.offline.enabled,
  },
  {
    category: 'Devices',
    label: 'Screen Overlay Detection',
    getValue: (s) => s.deviceSecurity.meeting.screenOverlayDetection,
  },
  {
    category: 'Audit',
    label: 'Logging Enabled',
    getValue: (s) => s.audit.loggingEnabled,
  },
  {
    category: 'Audit',
    label: 'Audit Retention',
    getValue: (s) => `${s.audit.retentionDays} days`,
  },
]

export default function SecurityPoliciesPage() {
  const settings = useSettingsStore((s) => s.getSettings())

  // Group rows by category for visual separation
  let lastCategory = ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Security Policies</h1>
        <p className="text-muted-foreground">Summary of all current security settings for your organisation</p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Category</TableHead>
              <TableHead className="w-[250px]">Policy</TableHead>
              <TableHead>Current Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policyRows.map((row) => {
              const showCategory = row.category !== lastCategory
              lastCategory = row.category
              const value = row.getValue(settings)

              return (
                <TableRow key={row.label}>
                  <TableCell className="font-medium text-muted-foreground">
                    {showCategory ? row.category : ''}
                  </TableCell>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell>
                    {typeof value === 'boolean' ? (
                      <BooleanCell value={value} />
                    ) : (
                      <span className="text-sm">{value}</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
