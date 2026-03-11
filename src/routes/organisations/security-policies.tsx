import { organisations } from '@/data/organisations'
import { orgSettings } from '@/data/settings'
import { CheckCircle, XCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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

interface ComparisonRow {
  label: string
  getValue: (settings: (typeof orgSettings)[string]) => string | boolean | number
}

const comparisonRows: ComparisonRow[] = [
  {
    label: 'MFA Required',
    getValue: (s) => s.auth.mfa.required,
  },
  {
    label: 'Device Registration Required',
    getValue: (s) => s.deviceSecurity.registration.required,
  },
  {
    label: 'Printing Allowed',
    getValue: (s) => s.contentProtection.printing,
  },
  {
    label: 'Session Timeout',
    getValue: (s) => `${s.auth.session.webPortalTimeoutMinutes} min`,
  },
  {
    label: 'Password Min Length',
    getValue: (s) => `${s.password.minimumLength} characters`,
  },
  {
    label: 'Concurrent Sessions',
    getValue: (s) => s.auth.session.concurrentSessionsAllowed,
  },
  {
    label: 'Watermark Enabled',
    getValue: (s) => s.contentProtection.watermark.enabled,
  },
  {
    label: 'Document Export Allowed',
    getValue: (s) => s.contentProtection.documentExport,
  },
  {
    label: 'Audit Retention',
    getValue: (s) => `${s.audit.retentionDays} days`,
  },
  {
    label: 'SSO Provider',
    getValue: (s) => s.auth.sso.provider,
  },
]

export default function SecurityPoliciesPage() {
  const orgs = organisations
  const settings = orgSettings

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Security Policies</h1>
        <p className="text-muted-foreground">Compare security settings across organisations</p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Policy</TableHead>
              {orgs.map((org) => (
                <TableHead key={org.id}>{org.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonRows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium">{row.label}</TableCell>
                {orgs.map((org) => {
                  const s = settings[org.id]
                  if (!s) {
                    return (
                      <TableCell key={org.id} className="text-muted-foreground">
                        N/A
                      </TableCell>
                    )
                  }
                  const value = row.getValue(s)
                  return (
                    <TableCell key={org.id}>
                      {typeof value === 'boolean' ? (
                        <BooleanCell value={value} />
                      ) : (
                        <span className="text-sm">{value}</span>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
