import { useSettingsStore } from '@/store/settings-store'
import { useProfileStore } from '@/store/profile-store'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { OrgSettings } from '@/data/types'

// ---------------------------------------------------------------------------
// Deep merge helper (same as in profile-detail)
// ---------------------------------------------------------------------------

function deepMerge<T>(base: T, override: Partial<T> | undefined): T {
  if (!override) return base
  if (typeof base !== 'object' || base === null) return (override as T) ?? base
  const result = { ...base } as Record<string, unknown>
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const overrideVal = (override as Record<string, unknown>)[key]
    const baseVal = result[key]
    if (typeof baseVal === 'object' && baseVal !== null && typeof overrideVal === 'object' && overrideVal !== null && !Array.isArray(baseVal)) {
      result[key] = deepMerge(baseVal, overrideVal as Partial<typeof baseVal>)
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal
    }
  }
  return result as T
}

// ---------------------------------------------------------------------------
// Status components
// ---------------------------------------------------------------------------

type PolicyStatus = 'enabled' | 'disabled' | 'partial'

function StatusCell({ status }: { status: PolicyStatus }) {
  if (status === 'enabled') {
    return (
      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">Enabled</span>
      </div>
    )
  }
  if (status === 'disabled') {
    return (
      <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
        <XCircle className="h-4 w-4" />
        <span className="text-sm">Disabled</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm">Partial</span>
    </div>
  )
}

function ValueCell({ value }: { value: string | boolean | number }) {
  if (typeof value === 'boolean') {
    return <StatusCell status={value ? 'enabled' : 'disabled'} />
  }
  return <span className="text-sm">{value}</span>
}

// ---------------------------------------------------------------------------
// Policy row definition
// ---------------------------------------------------------------------------

interface PolicyRow {
  category: string
  label: string
  getValue: (settings: OrgSettings) => string | boolean | number
  /** If true, this value can vary per profile */
  perProfile?: boolean
}

const policyRows: PolicyRow[] = [
  { category: 'Authentication', label: 'SSO Enabled', getValue: (s) => s.auth.sso.enabled },
  { category: 'Authentication', label: 'SSO Provider', getValue: (s) => s.auth.sso.provider },
  { category: 'Authentication', label: 'MFA Required', getValue: (s) => s.auth.mfa.required },
  { category: 'Authentication', label: 'Session Timeout', getValue: (s) => `${s.auth.session.webPortalTimeoutMinutes} min` },
  { category: 'Authentication', label: 'Concurrent Sessions', getValue: (s) => s.auth.session.concurrentSessionsAllowed },
  { category: 'Authentication', label: 'Login Retry Limit', getValue: (s) => `${s.auth.session.loginRetryLimit} attempts` },
  { category: 'Password', label: 'Minimum Length', getValue: (s) => `${s.password.minimumLength} characters` },
  { category: 'Password', label: 'Password Expiry', getValue: (s) => `${s.password.expiryDays} days` },
  { category: 'Password', label: 'Dictionary Check', getValue: (s) => s.password.dictionaryStrength },
  { category: 'Content', label: 'Document Export', getValue: (s) => s.contentProtection.documentExport, perProfile: true },
  { category: 'Content', label: 'Printing', getValue: (s) => s.contentProtection.printing, perProfile: true },
  { category: 'Content', label: 'Copy & Paste', getValue: (s) => s.contentProtection.copyPaste, perProfile: true },
  { category: 'Content', label: 'Watermark Enabled', getValue: (s) => s.contentProtection.watermark.enabled, perProfile: true },
  { category: 'Content', label: 'Field-Level Protection', getValue: (s) => s.contentProtection.sensitiveContent.fieldLevelProtection, perProfile: true },
  { category: 'Devices', label: 'Max Devices Per User', getValue: (s) => s.deviceSecurity.registration.maxDevicesPerUser },
  { category: 'Devices', label: 'Biometric Unlock', getValue: (s) => s.deviceSecurity.session.biometricUnlock, perProfile: true },
  { category: 'Devices', label: 'Offline Access', getValue: (s) => s.deviceSecurity.offline.enabled, perProfile: true },
  { category: 'Devices', label: 'Screen Overlay Detection', getValue: (s) => s.deviceSecurity.meeting.screenOverlayDetection, perProfile: true },
  { category: 'Audit', label: 'Logging Enabled', getValue: (s) => s.audit.loggingEnabled },
  { category: 'Audit', label: 'Audit Retention', getValue: (s) => `${s.audit.retentionDays} days` },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SecurityPoliciesPage() {
  const orgDefaults = useSettingsStore((s) => s.getSettings())
  const profiles = useProfileStore((s) => s.profiles)

  // For per-profile settings, compute the effective value across profiles
  function getEffectiveStatus(row: PolicyRow): { value: string | boolean | number; status: PolicyStatus; profileBreakdown?: string } {
    const orgValue = row.getValue(orgDefaults)

    if (!row.perProfile || typeof orgValue !== 'boolean') {
      return {
        value: orgValue,
        status: typeof orgValue === 'boolean' ? (orgValue ? 'enabled' : 'disabled') : 'enabled',
      }
    }

    // For boolean per-profile settings, check each profile
    let enabledCount = 0
    let disabledCount = 0
    const profileDetails: string[] = []

    for (const profile of profiles) {
      const merged = deepMerge(orgDefaults, profile.settings)
      const profileVal = row.getValue(merged)
      if (profileVal === true) {
        enabledCount++
        profileDetails.push(`${profile.name}: On`)
      } else {
        disabledCount++
        profileDetails.push(`${profile.name}: Off`)
      }
    }

    if (enabledCount > 0 && disabledCount > 0) {
      return {
        value: orgValue,
        status: 'partial',
        profileBreakdown: profileDetails.join(', '),
      }
    }

    return {
      value: orgValue,
      status: orgValue ? 'enabled' : 'disabled',
    }
  }

  let lastCategory = ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Security Policies Overview</h1>
        <p className="text-muted-foreground">
          Consolidated view of security settings across your organisation. Settings marked "Partial" vary by profile.
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          Enabled across all profiles
        </div>
        <div className="flex items-center gap-1.5">
          <XCircle className="h-3.5 w-3.5 text-red-500" />
          Disabled across all profiles
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          Varies by profile
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Category</TableHead>
              <TableHead className="w-[250px]">Policy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Scope</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policyRows.map((row) => {
              const showCategory = row.category !== lastCategory
              lastCategory = row.category
              const effective = getEffectiveStatus(row)

              return (
                <TableRow key={row.label}>
                  <TableCell className="font-medium text-muted-foreground">
                    {showCategory ? row.category : ''}
                  </TableCell>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell>
                    {effective.status === 'partial' ? (
                      <div>
                        <StatusCell status="partial" />
                        {effective.profileBreakdown && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">{effective.profileBreakdown}</p>
                        )}
                      </div>
                    ) : typeof effective.value === 'boolean' ? (
                      <StatusCell status={effective.value ? 'enabled' : 'disabled'} />
                    ) : (
                      <span className="text-sm">{effective.value}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.perProfile ? (
                      <Badge variant="outline" className="text-[10px]">Per Profile</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Org-wide</Badge>
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
