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
import UserDetailPage from '@/routes/people/user-detail'
import RolesPage from '@/routes/people/roles'
import LifecyclePage from '@/routes/people/lifecycle'
import OrgSettingsPage from '@/routes/organisations/settings'
import SecurityPoliciesPage from '@/routes/organisations/security-policies'
// Policies routes removed — policy settings live inside Profiles
import ProfilesPage from '@/routes/profiles/index'
import ProfileDetailPage from '@/routes/profiles/profile-detail'
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
              <Route path="/people/users/:id" element={<UserDetailPage />} />
              <Route path="/people/roles" element={<RolesPage />} />
              {/* Lifecycle hidden for now */}
              {/* Organisations */}
              <Route path="/organisations/settings" element={<OrgSettingsPage />} />
              <Route path="/organisations/security-policies" element={<SecurityPoliciesPage />} />
              {/* Profiles */}
              <Route path="/profiles" element={<ProfilesPage />} />
              <Route path="/profiles/:id" element={<ProfileDetailPage />} />
              {/* Policies removed — settings live inside Profiles */}
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
