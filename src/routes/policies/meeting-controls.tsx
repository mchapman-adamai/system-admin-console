import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store/settings-store'

export default function MeetingControlsPage() {
  const settings = useSettingsStore((s) => s.getSettings())
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [dirty, setDirty] = useState(false)

  const meeting = settings.deviceSecurity.meeting
  const docHandling = settings.deviceSecurity.documentHandling

  const updateMeeting = (path: string[], value: unknown) => {
    updateSettings(['deviceSecurity', 'meeting', ...path], value)
    setDirty(true)
  }

  const updateDocHandling = (path: string[], value: unknown) => {
    updateSettings(['deviceSecurity', 'documentHandling', ...path], value)
    setDirty(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meeting Controls</h1>
        <p className="text-muted-foreground">
          Configure in-meeting lock, grace period, screen overlay detection, and document handling rules
        </p>
      </div>

      <PolicySection
        title="In-Meeting Security"
        description="Control how the application behaves during active board and committee meetings"
      >
        <SettingRow
          type="number"
          label="In-Meeting Lock"
          description="Automatically lock the device screen after this period of inactivity during a meeting"
          securityLevel="high"
          value={meeting.inMeetingLockMinutes}
          onChange={(v) => updateMeeting(['inMeetingLockMinutes'], v)}
          min={0}
          max={30}
          suffix="minutes"
        />
        <SettingRow
          type="number"
          label="Grace Period"
          description="Time allowed after locking before requiring full re-authentication"
          securityLevel="medium"
          value={meeting.gracePeriodMinutes}
          onChange={(v) => updateMeeting(['gracePeriodMinutes'], v)}
          min={0}
          max={15}
          suffix="minutes"
        />
        <SettingRow
          type="toggle"
          label="Screen Overlay Detection"
          description="Detect and block screen recording or overlay applications while meeting documents are displayed"
          securityLevel="governance_critical"
          value={meeting.screenOverlayDetection}
          onChange={(v) => updateMeeting(['screenOverlayDetection'], v)}
        />
      </PolicySection>

      <PolicySection
        title="Document Handling"
        description="Control how documents can be interacted with during and after meetings"
      >
        <SettingRow
          type="toggle"
          label="Export Password Required"
          description="Require a password when exporting meeting documents or board packs"
          securityLevel="high"
          value={docHandling.exportPasswordRequired}
          onChange={(v) => updateDocHandling(['exportPasswordRequired'], v)}
        />
        <SettingRow
          type="toggle"
          label="Allow Copy/Paste Out"
          description="Allow users to copy content from meeting documents to external applications"
          securityLevel="high"
          value={docHandling.allowCopyPasteOut}
          onChange={(v) => updateDocHandling(['allowCopyPasteOut'], v)}
        />
        <SettingRow
          type="toggle"
          label="Allow Copy/Paste In"
          description="Allow users to paste content from external applications into meeting documents"
          value={docHandling.allowCopyPasteIn}
          onChange={(v) => updateDocHandling(['allowCopyPasteIn'], v)}
        />
        <SettingRow
          type="toggle"
          label="Allow RSVP Updates"
          description="Allow participants to update their RSVP status after the initial meeting invitation"
          value={docHandling.allowRsvpUpdates}
          onChange={(v) => updateDocHandling(['allowRsvpUpdates'], v)}
        />
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('Meeting control settings saved successfully')
        }}
        onDiscard={() => setDirty(false)}
      />
    </div>
  )
}
