import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store/settings-store'

export default function ContentProtectionPage() {
  const settings = useSettingsStore((s) => s.getSettings())
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [dirty, setDirty] = useState(false)

  const cp = settings.contentProtection

  const update = (path: string[], value: unknown) => {
    updateSettings(['contentProtection', ...path], value)
    setDirty(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Content Protection</h1>
        <p className="text-muted-foreground">
          Control document export, printing, copy/paste, and annotation access
        </p>
      </div>

      <PolicySection
        title="Document Controls"
        description="Restrict how users can extract or reproduce document content"
      >
        <SettingRow
          type="toggle"
          label="Document Export"
          description="Allow users to export board pack documents to PDF or other formats"
          securityLevel="high"
          value={cp.documentExport}
          onChange={(v) => update(['documentExport'], v)}
        />
        <SettingRow
          type="toggle"
          label="Printing"
          description="Allow users to print documents from within the application"
          securityLevel="high"
          value={cp.printing}
          onChange={(v) => update(['printing'], v)}
        />
        <SettingRow
          type="toggle"
          label="Copy & Paste"
          description="Allow users to copy text content from documents to the clipboard"
          securityLevel="medium"
          value={cp.copyPaste}
          onChange={(v) => update(['copyPaste'], v)}
        />
      </PolicySection>

      <PolicySection
        title="Annotation Controls"
        description="Manage how users interact with document annotations"
      >
        <SettingRow
          type="toggle"
          label="Annotation Export"
          description="Allow users to export their annotations separately from documents"
          securityLevel="medium"
          value={cp.annotationExport}
          onChange={(v) => update(['annotationExport'], v)}
        />
        <SettingRow
          type="toggle"
          label="Disable Annotations"
          description="Prevent all users from creating or viewing annotations on documents"
          value={cp.disableAnnotations}
          onChange={(v) => update(['disableAnnotations'], v)}
        />
      </PolicySection>

      <PolicySection
        title="Sensitive Content"
        description="Protect specific data fields from unauthorised access"
      >
        <SettingRow
          type="toggle"
          label="Field-Level Protection"
          description="Enable granular protection on sensitive data fields within documents and board packs"
          securityLevel="governance_critical"
          value={cp.sensitiveContent.fieldLevelProtection}
          onChange={(v) => update(['sensitiveContent', 'fieldLevelProtection'], v)}
        />
        <SettingRow
          type="custom"
          label="Protected Fields"
          description="Data fields that are masked or restricted based on user role and permissions"
        >
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

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('Content protection settings saved successfully')
        }}
        onDiscard={() => setDirty(false)}
      />
    </div>
  )
}
