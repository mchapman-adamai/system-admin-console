import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useProfileStore } from '@/store/profile-store'
import { useUserStore } from '@/store/user-store'
import { useSettingsStore } from '@/store/settings-store'
import { formatRelativeTime, roleDisplayName } from '@/lib/utils'
import type { OrgSettings } from '@/data/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = 'content-protection' | 'watermarks' | 'device-security' | 'offline' | 'meeting-controls'

const TABS: { id: Tab; label: string }[] = [
  { id: 'content-protection', label: 'Content Protection' },
  { id: 'watermarks', label: 'Watermarks' },
  { id: 'device-security', label: 'Device Security' },
  { id: 'offline', label: 'Offline & App Data' },
  { id: 'meeting-controls', label: 'Meeting Controls' },
]

// ---------------------------------------------------------------------------
// Deep merge: profile settings override org defaults
// ---------------------------------------------------------------------------

function deepMerge<T>(base: T, override: Partial<T> | undefined): T {
  if (!override) return base
  if (typeof base !== 'object' || base === null) return (override as T) ?? base

  const result = { ...base } as Record<string, unknown>
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const overrideVal = (override as Record<string, unknown>)[key]
    const baseVal = result[key]
    if (
      typeof baseVal === 'object' &&
      baseVal !== null &&
      typeof overrideVal === 'object' &&
      overrideVal !== null &&
      !Array.isArray(baseVal)
    ) {
      result[key] = deepMerge(baseVal, overrideVal as Partial<typeof baseVal>)
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal
    }
  }
  return result as T
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const profiles = useProfileStore((s) => s.profiles)
  const updateProfileSettings = useProfileStore((s) => s.updateProfileSettings)
  const users = useUserStore((s) => s.users)
  const orgDefaults = useSettingsStore((s) => s.getSettings())

  const [activeTab, setActiveTab] = useState<Tab>('content-protection')
  const [savedSnapshot, setSavedSnapshot] = useState<string>('')
  const [dirty, setDirty] = useState(false)

  const profile = useMemo(() => profiles.find((p) => p.id === id) ?? null, [profiles, id])

  // Track dirty state
  const currentSnapshot = JSON.stringify(profile?.settings ?? {})
  if (profile && savedSnapshot === '') {
    setSavedSnapshot(currentSnapshot)
  }
  if (profile && !dirty && savedSnapshot !== '' && currentSnapshot !== savedSnapshot) {
    setDirty(true)
  }

  const assignedUsers = useMemo(
    () => users.filter((u) => u.profileId === id),
    [users, id],
  )

  const settings: OrgSettings = useMemo(
    () => deepMerge(orgDefaults, profile?.settings),
    [orgDefaults, profile?.settings],
  )

  const update = useCallback(
    (path: string[], value: unknown) => {
      if (!id) return
      updateProfileSettings(id, path, value)
      setDirty(true)
    },
    [id, updateProfileSettings],
  )

  const handleSave = () => {
    setSavedSnapshot(JSON.stringify(profile?.settings ?? {}))
    setDirty(false)
    toast.success('Profile settings saved successfully')
  }

  const handleDiscard = () => {
    // For prototype, just reset dirty flag
    setDirty(false)
    setSavedSnapshot(currentSnapshot)
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/profiles')}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Profiles
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </div>
    )
  }

  const cp = settings.contentProtection
  const wm = settings.contentProtection.watermark
  const session = settings.deviceSecurity.session
  const offline = settings.deviceSecurity.offline
  const localData = settings.deviceSecurity.localData
  const meeting = settings.deviceSecurity.meeting
  const docHandling = settings.deviceSecurity.documentHandling

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/profiles')}>
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to Profiles
      </Button>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="text-muted-foreground">{profile.description}</p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Protection */}
      {activeTab === 'content-protection' && (
        <div className="space-y-6">
          <PolicySection title="Document Controls" description="Restrict how users can extract or reproduce document content">
            <SettingRow type="toggle" label="Document Export" description="Allow users to export board pack documents to PDF or other formats" securityLevel="high" value={cp.documentExport} onChange={(v) => update(['contentProtection', 'documentExport'], v)} />
            <SettingRow type="toggle" label="Printing" description="Allow users to print documents from within the application" securityLevel="high" value={cp.printing} onChange={(v) => update(['contentProtection', 'printing'], v)} />
            <SettingRow type="toggle" label="Copy & Paste" description="Allow users to copy text content from documents to the clipboard" securityLevel="medium" value={cp.copyPaste} onChange={(v) => update(['contentProtection', 'copyPaste'], v)} />
          </PolicySection>
          <PolicySection title="Annotation Controls" description="Manage how users interact with document annotations">
            <SettingRow type="toggle" label="Annotation Export" description="Allow users to export their annotations separately from documents" securityLevel="medium" value={cp.annotationExport} onChange={(v) => update(['contentProtection', 'annotationExport'], v)} />
            <SettingRow type="toggle" label="Disable Annotations" description="Prevent all users from creating or viewing annotations on documents" value={cp.disableAnnotations} onChange={(v) => update(['contentProtection', 'disableAnnotations'], v)} />
          </PolicySection>
          <PolicySection title="Sensitive Content" description="Protect specific data fields from unauthorised access">
            <SettingRow type="toggle" label="Field-Level Protection" description="Enable granular protection on sensitive data fields within documents and board packs" securityLevel="governance_critical" value={cp.sensitiveContent.fieldLevelProtection} onChange={(v) => update(['contentProtection', 'sensitiveContent', 'fieldLevelProtection'], v)} />
            <SettingRow type="custom" label="Protected Fields" description="Data fields that are masked or restricted based on user role and permissions">
              <div className="flex flex-wrap gap-2 max-w-[300px] justify-end">
                {cp.sensitiveContent.protectedFields.length > 0 ? (
                  cp.sensitiveContent.protectedFields.map((field) => (
                    <Badge key={field} variant="secondary" className="text-xs">
                      {field.replace(/_/g, ' ')}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No protected fields</span>
                )}
              </div>
            </SettingRow>
          </PolicySection>
        </div>
      )}

      {/* Watermarks */}
      {activeTab === 'watermarks' && (
        <div className="space-y-6">
          <PolicySection title="Watermark Settings" description="Enable and configure watermark content displayed on documents">
            <SettingRow type="toggle" label="Enable Watermarks" description="Overlay a watermark on all documents viewed within the application" securityLevel="high" value={wm.enabled} onChange={(v) => update(['contentProtection', 'watermark', 'enabled'], v)} />
            <SettingRow type="custom" label="Watermark Text" description="The primary text displayed in the watermark overlay">
              <Input value={wm.text} onChange={(e) => update(['contentProtection', 'watermark', 'text'], e.target.value)} className="w-[200px]" placeholder="e.g. CONFIDENTIAL" />
            </SettingRow>
            <SettingRow type="toggle" label="Include User Name" description="Append the viewing user's name to the watermark text" value={wm.includeUserName} onChange={(v) => update(['contentProtection', 'watermark', 'includeUserName'], v)} />
            <SettingRow type="toggle" label="Include Date" description="Append the current date to the watermark text" value={wm.includeDate} onChange={(v) => update(['contentProtection', 'watermark', 'includeDate'], v)} />
            <SettingRow type="toggle" label="Include Organisation Name" description="Append the organisation name to the watermark text" value={wm.includeOrgName} onChange={(v) => update(['contentProtection', 'watermark', 'includeOrgName'], v)} />
          </PolicySection>
          <PolicySection title="Appearance" description="Control the visual presentation of the watermark">
            <SettingRow type="slider" label="Opacity" description="How visible the watermark appears over document content" value={wm.opacity} onChange={(v) => update(['contentProtection', 'watermark', 'opacity'], v)} min={0} max={100} step={5} suffix="%" />
            <SettingRow type="select" label="Placement" description="Where the watermark is positioned on the document" value={wm.placement} onChange={(v) => update(['contentProtection', 'watermark', 'placement'], v)} options={[{ value: 'diagonal', label: 'Diagonal' }, { value: 'header', label: 'Header' }, { value: 'footer', label: 'Footer' }]} />
          </PolicySection>
        </div>
      )}

      {/* Device Security */}
      {activeTab === 'device-security' && (
        <div className="space-y-6">
          <PolicySection title="Session Controls" description="Manage automatic sign-out, biometric authentication, and session persistence">
            <SettingRow type="number" label="Auto Sign-Out" description="Automatically sign out the user after a period of inactivity on the device" securityLevel="high" value={session.autoSignOutMinutes} onChange={(v) => update(['deviceSecurity', 'session', 'autoSignOutMinutes'], v)} min={1} max={120} suffix="minutes" />
            <SettingRow type="toggle" label="Biometric Unlock" description="Allow users to unlock the application using fingerprint or face recognition on supported devices" securityLevel="medium" value={session.biometricUnlock} onChange={(v) => update(['deviceSecurity', 'session', 'biometricUnlock'], v)} />
            <SettingRow type="toggle" label="Remember Sign-On" description="Allow the app to remember the user's session across app restarts on trusted devices" securityLevel="high" value={session.rememberSignOn} onChange={(v) => update(['deviceSecurity', 'session', 'rememberSignOn'], v)} />
          </PolicySection>
          <PolicySection title="Meeting Behaviour" description="Control how device sessions behave during active meetings">
            <SettingRow type="toggle" label="Do Not Sign Out During Meeting" description="Prevent automatic sign-out while the user is actively participating in a meeting" securityLevel="governance_critical" value={session.doNotSignOutDuringMeeting} onChange={(v) => update(['deviceSecurity', 'session', 'doNotSignOutDuringMeeting'], v)} />
          </PolicySection>
        </div>
      )}

      {/* Offline & App Data */}
      {activeTab === 'offline' && (
        <div className="space-y-6">
          <PolicySection title="Offline Access" description="Control whether users can access documents without an active network connection">
            <SettingRow type="toggle" label="Enable Offline Access" description="Allow users to view previously synced documents when offline" securityLevel="high" value={offline.enabled} onChange={(v) => update(['deviceSecurity', 'offline', 'enabled'], v)} />
            <SettingRow type="number" label="Maximum Offline Duration" description="Maximum number of days a device can remain offline before requiring re-authentication" securityLevel="medium" value={offline.maxDurationDays} onChange={(v) => update(['deviceSecurity', 'offline', 'maxDurationDays'], v)} min={1} max={30} suffix="days" />
            <SettingRow type="number" label="Sync Interval" description="How frequently the app syncs data with the server when online" value={offline.syncIntervalMinutes} onChange={(v) => update(['deviceSecurity', 'offline', 'syncIntervalMinutes'], v)} min={5} max={120} suffix="minutes" />
          </PolicySection>
          <PolicySection title="Local Data" description="Control how application data is stored and handled on user devices">
            <SettingRow type="toggle" label="Encrypt Local Data" description="Encrypt all locally cached documents and app data at rest on the device" securityLevel="governance_critical" value={localData.encrypted} onChange={(v) => update(['deviceSecurity', 'localData', 'encrypted'], v)} />
            <SettingRow type="toggle" label="Delete Data on Sign-Out" description="Automatically remove all cached data from the device when the user signs out" securityLevel="high" value={localData.deleteOnSignOut} onChange={(v) => update(['deviceSecurity', 'localData', 'deleteOnSignOut'], v)} />
            <SettingRow type="toggle" label="Purge on Logout" description="Immediately purge all offline data and sync state when the user logs out" securityLevel="high" value={offline.purgeOnLogout} onChange={(v) => update(['deviceSecurity', 'offline', 'purgeOnLogout'], v)} />
          </PolicySection>
        </div>
      )}

      {/* Meeting Controls */}
      {activeTab === 'meeting-controls' && (
        <div className="space-y-6">
          <PolicySection title="In-Meeting Security" description="Control how the application behaves during active board and committee meetings">
            <SettingRow type="number" label="In-Meeting Lock" description="Automatically lock the device screen after this period of inactivity during a meeting" securityLevel="high" value={meeting.inMeetingLockMinutes} onChange={(v) => update(['deviceSecurity', 'meeting', 'inMeetingLockMinutes'], v)} min={0} max={30} suffix="minutes" />
            <SettingRow type="number" label="Grace Period" description="Time allowed after locking before requiring full re-authentication" securityLevel="medium" value={meeting.gracePeriodMinutes} onChange={(v) => update(['deviceSecurity', 'meeting', 'gracePeriodMinutes'], v)} min={0} max={15} suffix="minutes" />
            <SettingRow type="toggle" label="Screen Overlay Detection" description="Detect and block screen recording or overlay applications while meeting documents are displayed" securityLevel="governance_critical" value={meeting.screenOverlayDetection} onChange={(v) => update(['deviceSecurity', 'meeting', 'screenOverlayDetection'], v)} />
          </PolicySection>
          <PolicySection title="Document Handling" description="Control how documents can be interacted with during and after meetings">
            <SettingRow type="toggle" label="Export Password Required" description="Require a password when exporting meeting documents or board packs" securityLevel="high" value={docHandling.exportPasswordRequired} onChange={(v) => update(['deviceSecurity', 'documentHandling', 'exportPasswordRequired'], v)} />
            <SettingRow type="toggle" label="Allow Copy/Paste Out" description="Allow users to copy content from meeting documents to external applications" securityLevel="high" value={docHandling.allowCopyPasteOut} onChange={(v) => update(['deviceSecurity', 'documentHandling', 'allowCopyPasteOut'], v)} />
            <SettingRow type="toggle" label="Allow Copy/Paste In" description="Allow users to paste content from external applications into meeting documents" value={docHandling.allowCopyPasteIn} onChange={(v) => update(['deviceSecurity', 'documentHandling', 'allowCopyPasteIn'], v)} />
            <SettingRow type="toggle" label="Allow RSVP Updates" description="Allow participants to update their RSVP status after the initial meeting invitation" value={docHandling.allowRsvpUpdates} onChange={(v) => update(['deviceSecurity', 'documentHandling', 'allowRsvpUpdates'], v)} />
          </PolicySection>
        </div>
      )}

      {/* Assigned Users */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-6 py-4">
          <h3 className="text-base font-semibold">Assigned Users</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {assignedUsers.length} user{assignedUsers.length !== 1 ? 's' : ''} assigned to this profile
          </p>
        </div>
        {assignedUsers.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No users assigned to this profile
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/people/users/${user.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{roleDisplayName(user.role)}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <SaveBar
        show={dirty}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  )
}
