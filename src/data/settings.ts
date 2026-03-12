import type { OrgSettings } from './types'

export const orgSettings: Record<string, OrgSettings> = {
  'org-acme-001': {
    auth: {
      sso: {
        enabled: true,
        provider: 'Microsoft Entra ID',
        protocol: 'saml',
      },
      mfa: {
        required: true,
        methods: ['authenticator_app', 'sms'],
        stepUpForVoting: true,
        stepUpForESignature: true,
      },
      session: {
        webPortalTimeoutMinutes: 10,
        concurrentSessionsAllowed: false,
        loginRetryLimit: 5,
        lockoutDurationMinutes: 30,
      },
    },
    password: {
      minimumLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      expiryDays: 90,
      disallowReuse: 12,
      dictionaryStrength: 'strict',
      resetEmailValidityHours: 24,
      minimumPasswordAgeDays: 1,
    },
    contentProtection: {
      documentExport: false,
      printing: false,
      copyPaste: false,
      annotationExport: false,
      disableAnnotations: false,
      watermark: {
        enabled: true,
        text: 'CONFIDENTIAL',
        includeUserName: true,
        includeDate: true,
        includeOrgName: true,
        opacity: 15,
        placement: 'diagonal',
      },
      sensitiveContent: {
        fieldLevelProtection: true,
        protectedFields: [
          'financial_projections',
          'compensation_details',
          'acquisition_targets',
          'legal_opinions',
        ],
      },
    },
    deviceSecurity: {
      registration: {
        required: true,
        maxDevicesPerUser: 2,
        autoApproveNewDevices: false,
      },
      session: {
        autoSignOutMinutes: 10,
        doNotSignOutDuringMeeting: true,
        biometricUnlock: true,
        rememberSignOn: false,
      },
      offline: {
        enabled: true,
        maxDurationDays: 7,
        purgeOnLogout: true,
        syncIntervalMinutes: 30,
      },
      localData: {
        encrypted: true,
        deleteOnSignOut: true,
      },
      meeting: {
        inMeetingLockMinutes: 5,
        gracePeriodMinutes: 2,
        screenOverlayDetection: true,
      },
      documentHandling: {
        exportPasswordRequired: true,
        allowCopyPasteOut: false,
        allowCopyPasteIn: true,
        allowRsvpUpdates: true,
      },
    },
    audit: {
      loggingEnabled: true,
      categories: {
        authentication: true,
        configurationChanges: true,
        permissionChanges: true,
        documentAccess: true,
        meetingParticipation: true,
      },
      retentionDays: 730,
    },
    lifecycle: {
      autoSuspendOnTermExpiry: true,
      termExpiryWarningDays: 30,
      retainAuditDataAfterOffboarding: true,
      dataRetentionDays: 365,
      allowSelfServiceReactivation: false,
    },
  },

  'org-northbridge-001': {
    auth: {
      sso: {
        enabled: true,
        provider: 'Okta',
        protocol: 'oidc',
      },
      mfa: {
        required: true,
        methods: ['authenticator_app'],
        stepUpForVoting: true,
        stepUpForESignature: false,
      },
      session: {
        webPortalTimeoutMinutes: 15,
        concurrentSessionsAllowed: true,
        loginRetryLimit: 3,
        lockoutDurationMinutes: 15,
      },
    },
    password: {
      minimumLength: 10,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false,
      expiryDays: 60,
      disallowReuse: 6,
      dictionaryStrength: 'standard',
      resetEmailValidityHours: 48,
      minimumPasswordAgeDays: 0,
    },
    contentProtection: {
      documentExport: false,
      printing: true,
      copyPaste: false,
      annotationExport: true,
      disableAnnotations: false,
      watermark: {
        enabled: true,
        text: 'RESTRICTED',
        includeUserName: true,
        includeDate: false,
        includeOrgName: true,
        opacity: 10,
        placement: 'footer',
      },
      sensitiveContent: {
        fieldLevelProtection: false,
        protectedFields: [],
      },
    },
    deviceSecurity: {
      registration: {
        required: false,
        maxDevicesPerUser: 3,
        autoApproveNewDevices: true,
      },
      session: {
        autoSignOutMinutes: 15,
        doNotSignOutDuringMeeting: true,
        biometricUnlock: true,
        rememberSignOn: true,
      },
      offline: {
        enabled: true,
        maxDurationDays: 3,
        purgeOnLogout: true,
        syncIntervalMinutes: 60,
      },
      localData: {
        encrypted: true,
        deleteOnSignOut: false,
      },
      meeting: {
        inMeetingLockMinutes: 3,
        gracePeriodMinutes: 5,
        screenOverlayDetection: false,
      },
      documentHandling: {
        exportPasswordRequired: false,
        allowCopyPasteOut: false,
        allowCopyPasteIn: true,
        allowRsvpUpdates: true,
      },
    },
    audit: {
      loggingEnabled: true,
      categories: {
        authentication: true,
        configurationChanges: true,
        permissionChanges: true,
        documentAccess: false,
        meetingParticipation: false,
      },
      retentionDays: 365,
    },
    lifecycle: {
      autoSuspendOnTermExpiry: false,
      termExpiryWarningDays: 14,
      retainAuditDataAfterOffboarding: true,
      dataRetentionDays: 180,
      allowSelfServiceReactivation: true,
    },
  },
}
