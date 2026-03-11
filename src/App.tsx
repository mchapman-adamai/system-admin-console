import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { useThemeStore } from '@/store/theme-store'
import { useEffect } from 'react'

// Route pages
import DashboardPage from '@/routes/dashboard'
import SSOPage from '@/routes/identity/sso'
import MFAPage from '@/routes/identity/mfa'
import PasswordPolicyPage from '@/routes/identity/password-policy'
import SessionsPage from '@/routes/identity/sessions'
import UsersPage from '@/routes/people/users'
import RolesPage from '@/routes/people/roles'
import LifecyclePage from '@/routes/people/lifecycle'
import OrgSettingsPage from '@/routes/organisations/settings'
import MultiOrgPage from '@/routes/organisations/multi-org'
import SecurityPoliciesPage from '@/routes/organisations/security-policies'
import ContentProtectionPage from '@/routes/policies/content-protection'
import WatermarksPage from '@/routes/policies/watermarks'
import DeviceSecurityPage from '@/routes/policies/device-security'
import OfflinePage from '@/routes/policies/offline'
import MeetingControlsPage from '@/routes/policies/meeting-controls'
import DeviceRegistryPage from '@/routes/devices/registry'
import RegistrationRulesPage from '@/routes/devices/registration-rules'
import ActivityLogPage from '@/routes/audit/activity-log'
import LogSettingsPage from '@/routes/audit/log-settings'
import IntegrationsOverviewPage from '@/routes/integrations/overview'
import NationalIdentityPage from '@/routes/integrations/national-identity'
import GeneralSettingsPage from '@/routes/settings/general'

function App() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <div className="mx-auto max-w-6xl">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Identity */}
              <Route path="/identity/sso" element={<SSOPage />} />
              <Route path="/identity/mfa" element={<MFAPage />} />
              <Route path="/identity/password-policy" element={<PasswordPolicyPage />} />
              <Route path="/identity/sessions" element={<SessionsPage />} />
              {/* People */}
              <Route path="/people/users" element={<UsersPage />} />
              <Route path="/people/roles" element={<RolesPage />} />
              <Route path="/people/lifecycle" element={<LifecyclePage />} />
              {/* Organisations */}
              <Route path="/organisations/settings" element={<OrgSettingsPage />} />
              <Route path="/organisations/multi-org" element={<MultiOrgPage />} />
              <Route path="/organisations/security-policies" element={<SecurityPoliciesPage />} />
              {/* Policies */}
              <Route path="/policies/content-protection" element={<ContentProtectionPage />} />
              <Route path="/policies/watermarks" element={<WatermarksPage />} />
              <Route path="/policies/device-security" element={<DeviceSecurityPage />} />
              <Route path="/policies/offline" element={<OfflinePage />} />
              <Route path="/policies/meeting-controls" element={<MeetingControlsPage />} />
              {/* Devices */}
              <Route path="/devices/registry" element={<DeviceRegistryPage />} />
              <Route path="/devices/registration-rules" element={<RegistrationRulesPage />} />
              {/* Audit */}
              <Route path="/audit/activity-log" element={<ActivityLogPage />} />
              <Route path="/audit/log-settings" element={<LogSettingsPage />} />
              {/* Integrations */}
              <Route path="/integrations/overview" element={<IntegrationsOverviewPage />} />
              <Route path="/integrations/national-identity" element={<NationalIdentityPage />} />
              {/* Settings */}
              <Route path="/settings" element={<GeneralSettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
