// ---------------------------------------------------------------------------
// Navigation structure and route paths for the Adam.ai admin console.
// ---------------------------------------------------------------------------

export interface NavItem {
  label: string
  path: string
  icon: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export type NavEntry = NavItem | NavGroup

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'items' in entry
}

// ---------------------------------------------------------------------------
// Route path constants
// ---------------------------------------------------------------------------

export const ROUTES = {
  DASHBOARD: '/',

  // Identity
  SSO_LOGIN: '/identity/sso',
  MFA: '/identity/mfa',
  PASSWORD_POLICY: '/identity/password-policy',
  SESSIONS: '/identity/sessions',

  // People
  USERS: '/people/users',
  ROLES_PERMISSIONS: '/people/roles',
  LIFECYCLE: '/people/lifecycle',

  // Organisations
  ORG_SETTINGS: '/organisations/settings',
  MULTI_ORG: '/organisations/multi-org',
  SECURITY_POLICIES: '/organisations/security-policies',

  // Policies
  CONTENT_PROTECTION: '/policies/content-protection',
  WATERMARKS: '/policies/watermarks',
  DEVICE_SECURITY: '/policies/device-security',
  OFFLINE_APP_DATA: '/policies/offline',
  MEETING_CONTROLS: '/policies/meeting-controls',

  // Devices
  DEVICE_REGISTRY: '/devices/registry',
  REGISTRATION_RULES: '/devices/registration-rules',

  // Audit
  ACTIVITY_LOG: '/audit/activity-log',
  LOG_SETTINGS: '/audit/log-settings',

  // Integrations
  INTEGRATIONS_OVERVIEW: '/integrations/overview',
  NATIONAL_IDENTITY: '/integrations/national-identity',
} as const

// ---------------------------------------------------------------------------
// Full sidebar navigation definition
// ---------------------------------------------------------------------------

export const NAV_STRUCTURE: NavEntry[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
  },
  {
    label: 'Identity',
    items: [
      { label: 'SSO & Login', path: ROUTES.SSO_LOGIN, icon: 'KeyRound' },
      { label: 'MFA', path: ROUTES.MFA, icon: 'ShieldCheck' },
      { label: 'Password Policy', path: ROUTES.PASSWORD_POLICY, icon: 'Lock' },
      { label: 'Sessions', path: ROUTES.SESSIONS, icon: 'Clock' },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Users', path: ROUTES.USERS, icon: 'Users' },
      { label: 'Roles & Permissions', path: ROUTES.ROLES_PERMISSIONS, icon: 'Shield' },
      { label: 'Lifecycle & Offboarding', path: ROUTES.LIFECYCLE, icon: 'UserMinus' },
    ],
  },
  {
    label: 'Organisations',
    items: [
      { label: 'Organisation Settings', path: ROUTES.ORG_SETTINGS, icon: 'Building2' },
      { label: 'Multi-Org Configuration', path: ROUTES.MULTI_ORG, icon: 'Network' },
      { label: 'Security Policies', path: ROUTES.SECURITY_POLICIES, icon: 'ShieldAlert' },
    ],
  },
  {
    label: 'Policies',
    items: [
      { label: 'Content Protection', path: ROUTES.CONTENT_PROTECTION, icon: 'FileShield' },
      { label: 'Watermarks', path: ROUTES.WATERMARKS, icon: 'Droplets' },
      { label: 'Device Security', path: ROUTES.DEVICE_SECURITY, icon: 'Smartphone' },
      { label: 'Offline & App Data', path: ROUTES.OFFLINE_APP_DATA, icon: 'HardDrive' },
      { label: 'Meeting Controls', path: ROUTES.MEETING_CONTROLS, icon: 'Video' },
    ],
  },
  {
    label: 'Devices',
    items: [
      { label: 'Device Registry', path: ROUTES.DEVICE_REGISTRY, icon: 'Tablet' },
      { label: 'Registration Rules', path: ROUTES.REGISTRATION_RULES, icon: 'ClipboardList' },
    ],
  },
  {
    label: 'Audit',
    items: [
      { label: 'Activity Log', path: ROUTES.ACTIVITY_LOG, icon: 'ScrollText' },
      { label: 'Log Settings & Retention', path: ROUTES.LOG_SETTINGS, icon: 'Settings' },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { label: 'Overview', path: ROUTES.INTEGRATIONS_OVERVIEW, icon: 'Blocks' },
      { label: 'National Identity', path: ROUTES.NATIONAL_IDENTITY, icon: 'Fingerprint' },
    ],
  },
]
