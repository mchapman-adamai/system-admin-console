export interface Organisation {
  id: string
  name: string
  industry: string
  primaryRegion: string
  createdAt: string
  userCount: number
  status: 'active' | 'suspended'
}

export type RoleType = 'governance_professional' | 'director' | 'observer' | 'system_administrator'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: RoleType
  organisationId: string
  status: 'active' | 'suspended' | 'offboarded'
  lastActiveAt: string
  createdAt: string
  mfaEnabled: boolean
  devices: string[]
  termExpiryDate?: string
}

export interface Role {
  id: RoleType
  displayName: string
  description: string
  permissions: string[]
  restrictions: string[]
  isCustom: boolean
  userCount: number
}

export interface Forum {
  id: string
  name: string
  type: 'board' | 'committee' | 'working_group'
  organisationId: string
  memberCount: number
  status: 'active' | 'archived'
}

export interface AuthenticationSettings {
  sso: { enabled: boolean; provider: string; protocol: 'saml' | 'oidc' }
  mfa: {
    required: boolean
    methods: ('authenticator_app' | 'sms')[]
    stepUpForVoting: boolean
    stepUpForESignature: boolean
  }
  session: {
    webPortalTimeoutMinutes: number
    concurrentSessionsAllowed: boolean
    loginRetryLimit: number
    lockoutDurationMinutes: number
  }
}

export interface PasswordPolicy {
  minimumLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSymbols: boolean
  expiryDays: number
  disallowReuse: number
  dictionaryStrength: 'off' | 'standard' | 'strict'
  resetEmailValidityHours: number
  minimumPasswordAgeDays: number
}

export interface ContentProtectionSettings {
  documentExport: boolean
  printing: boolean
  copyPaste: boolean
  annotationExport: boolean
  disableAnnotations: boolean
  watermark: {
    enabled: boolean
    text: string
    includeUserName: boolean
    includeDate: boolean
    includeOrgName: boolean
    opacity: number
    placement: 'diagonal' | 'header' | 'footer'
  }
  sensitiveContent: {
    fieldLevelProtection: boolean
    protectedFields: string[]
  }
}

export interface DeviceSecuritySettings {
  registration: {
    required: boolean
    maxDevicesPerUser: number
    autoApproveNewDevices: boolean
  }
  session: {
    autoSignOutMinutes: number
    doNotSignOutDuringMeeting: boolean
    biometricUnlock: boolean
    rememberSignOn: boolean
  }
  offline: {
    enabled: boolean
    maxDurationDays: number
    purgeOnLogout: boolean
    syncIntervalMinutes: number
  }
  localData: {
    encrypted: boolean
    deleteOnSignOut: boolean
  }
  meeting: {
    inMeetingLockMinutes: number
    gracePeriodMinutes: number
    screenOverlayDetection: boolean
  }
  documentHandling: {
    exportPasswordRequired: boolean
    allowCopyPasteOut: boolean
    allowCopyPasteIn: boolean
    allowRsvpUpdates: boolean
  }
}

export interface RegisteredDevice {
  id: string
  userId: string
  userName: string
  deviceName: string
  deviceType: 'tablet' | 'mobile' | 'laptop'
  status: 'approved' | 'pending' | 'disabled'
  registeredAt: string
  lastUsedAppVersion?: string
}

export type AuditAction =
  | 'login' | 'logout' | 'login_failed'
  | 'updated_mfa_policy' | 'updated_password_policy' | 'updated_session_policy'
  | 'created_meeting' | 'viewed_document' | 'download_blocked'
  | 'user_created' | 'user_suspended' | 'user_offboarded'
  | 'role_modified' | 'permission_changed'
  | 'device_registered' | 'device_deactivated'
  | 'config_changed' | 'export_attempted'

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: AuditAction
  objectType: string
  objectName: string
  details?: string
  organisationId: string
}

export interface AuditSettings {
  loggingEnabled: boolean
  categories: {
    authentication: boolean
    configurationChanges: boolean
    permissionChanges: boolean
    documentAccess: boolean
    meetingParticipation: boolean
  }
  retentionDays: number
}

export interface NotificationItem {
  id: string
  type: 'security_alert' | 'pending_approval' | 'system_event' | 'policy_change'
  title: string
  description: string
  timestamp: string
  read: boolean
  severity: 'info' | 'warning' | 'critical'
}

export interface DashboardMetrics {
  totalUsers: number
  activeDirectors: number
  boards: number
  committees: number
  meetingsThisMonth: number
  securityAlertsThisWeek: number
  securityPostureScore: number
  compliancePercentage: number
  loginTrend: { date: string; count: number }[]
  userActivityTrend: { date: string; active: number; inactive: number }[]
}

export interface LifecycleSettings {
  autoSuspendOnTermExpiry: boolean
  termExpiryWarningDays: number
  retainAuditDataAfterOffboarding: boolean
  dataRetentionDays: number
  allowSelfServiceReactivation: boolean
}

export interface OrgSettings {
  auth: AuthenticationSettings
  password: PasswordPolicy
  contentProtection: ContentProtectionSettings
  deviceSecurity: DeviceSecuritySettings
  audit: AuditSettings
  lifecycle: LifecycleSettings
}
