import { useState } from 'react'
import { PolicySection } from '@/components/shared/policy-section'
import { SettingRow } from '@/components/shared/setting-row'
import { SaveBar } from '@/components/shared/save-bar'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/store/theme-store'
import { toast } from 'sonner'
import { Download, Upload } from 'lucide-react'

export default function GeneralSettingsPage() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const [dateFormat, setDateFormat] = useState('dd-MMM-yyyy')
  const [language, setLanguage] = useState('en')
  const [dirty, setDirty] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">General Settings</h1>
        <p className="text-muted-foreground">Configure theme, regional preferences, and data management</p>
      </div>

      <PolicySection title="Appearance" description="Customise the look and feel of the admin console">
        <SettingRow
          type="toggle"
          label="Dark Mode"
          description="Switch between light and dark themes for the admin interface"
          value={theme === 'dark'}
          onChange={() => toggleTheme()}
        />
      </PolicySection>

      <PolicySection title="Regional" description="Set date format and language preferences">
        <SettingRow
          type="select"
          label="Date Format"
          description="Choose how dates are displayed throughout the application"
          value={dateFormat}
          onChange={(v) => {
            setDateFormat(v)
            setDirty(true)
          }}
          options={[
            { value: 'dd-MMM-yyyy', label: 'DD-MMM-YYYY (11-Mar-2026)' },
            { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (03/11/2026)' },
            { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (11/03/2026)' },
            { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (2026-03-11)' },
          ]}
        />
        <SettingRow
          type="select"
          label="Language"
          description="Set the display language for the admin console"
          value={language}
          onChange={(v) => {
            setLanguage(v)
            setDirty(true)
          }}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ar', label: 'Arabic' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
          ]}
        />
      </PolicySection>

      <PolicySection title="Data" description="Export or import your admin console configuration">
        <SettingRow type="custom" label="Export Configuration" description="Download a JSON file containing all current settings and policies">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => toast.info('Preparing configuration export...')}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </SettingRow>
        <SettingRow type="custom" label="Import Configuration" description="Upload a JSON configuration file to restore settings">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => toast.info('Import dialog opening...')}
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </SettingRow>
      </PolicySection>

      <SaveBar
        show={dirty}
        onSave={() => {
          setDirty(false)
          toast.success('General settings saved successfully')
        }}
        onDiscard={() => {
          setDateFormat('dd-MMM-yyyy')
          setLanguage('en')
          setDirty(false)
        }}
      />
    </div>
  )
}
