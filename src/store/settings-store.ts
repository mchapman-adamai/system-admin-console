import { create } from 'zustand'
import type { OrgSettings } from '@/data/types'
import { TENANT_ORG_ID } from '@/store/org-store'

// ---------------------------------------------------------------------------
// Default org settings -- sensible baselines matching the PRD.
// These are used as the initial state for the organisation until overridden.
// ---------------------------------------------------------------------------

const defaultOrgSettings: OrgSettings = {
  auth: {
    sso: { enabled: true, provider: 'Azure AD', protocol: 'saml' },
    mfa: {
      required: true,
      methods: ['authenticator_app'],
      stepUpForVoting: true,
      stepUpForESignature: true,
    },
    session: {
      webPortalTimeoutMinutes: 30,
      concurrentSessionsAllowed: false,
      loginRetryLimit: 5,
      lockoutDurationMinutes: 15,
    },
  },
  password: {
    minimumLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    expiryDays: 90,
    disallowReuse: 5,
    dictionaryStrength: 'standard',
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
      protectedFields: ['financials', 'personal_data'],
    },
  },
  deviceSecurity: {
    registration: {
      required: true,
      maxDevicesPerUser: 3,
      autoApproveNewDevices: false,
    },
    session: {
      autoSignOutMinutes: 5,
      doNotSignOutDuringMeeting: true,
      biometricUnlock: true,
      rememberSignOn: false,
    },
    offline: {
      enabled: true,
      maxDurationDays: 7,
      purgeOnLogout: true,
      syncIntervalMinutes: 15,
    },
    localData: {
      encrypted: true,
      deleteOnSignOut: true,
    },
    meeting: {
      inMeetingLockMinutes: 0,
      gracePeriodMinutes: 5,
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
    retentionDays: 365,
  },
  lifecycle: {
    autoSuspendOnTermExpiry: true,
    termExpiryWarningDays: 30,
    retainAuditDataAfterOffboarding: true,
    dataRetentionDays: 365,
    allowSelfServiceReactivation: false,
  },
}

// ---------------------------------------------------------------------------
// Deep-clone helper (structuredClone is available in all modern runtimes).
// ---------------------------------------------------------------------------
function deepClone<T>(obj: T): T {
  return structuredClone(obj)
}

// ---------------------------------------------------------------------------
// Immutable deep-set helper.
// Sets a value at the given key path and returns a new top-level object.
// Example: deepSet(settings, ['auth','mfa','required'], false)
// ---------------------------------------------------------------------------
function deepSet<T extends Record<string, unknown>>(
  obj: T,
  path: string[],
  value: unknown,
): T {
  if (path.length === 0) return obj
  if (path.length === 1) {
    return { ...obj, [path[0]]: value }
  }
  const [head, ...rest] = path
  return {
    ...obj,
    [head]: deepSet(
      (obj[head] ?? {}) as Record<string, unknown>,
      rest,
      value,
    ),
  } as T
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface SettingsState {
  /** Current (possibly edited) settings for the tenant org. */
  settings: OrgSettings | null

  /** Last-saved snapshot (used to detect dirty state). */
  saved: OrgSettings | null

  /** Whether settings differ from their saved snapshot. */
  hasUnsavedChanges: boolean

  /** Return the settings for the tenant org (creates from defaults if needed). */
  getSettings: () => OrgSettings

  /** Update a single nested value within the tenant org's settings. */
  updateSettings: (path: string[], value: unknown) => void

  /** Persist all current settings (simulated). */
  saveChanges: () => void

  /** Revert to the last-saved snapshot. */
  discardChanges: () => void
}

function computeDirty(
  settings: OrgSettings | null,
  saved: OrgSettings | null,
): boolean {
  if (!settings || !saved) return false
  return JSON.stringify(settings) !== JSON.stringify(saved)
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  settings: null,
  saved: null,
  hasUnsavedChanges: false,

  getSettings: () => {
    const { settings } = get()
    if (settings) return settings

    // Initialise from defaults
    const fresh = deepClone(defaultOrgSettings)
    set({
      settings: fresh,
      saved: deepClone(fresh),
    })
    return fresh
  },

  updateSettings: (path: string[], value: unknown) => {
    const current = get().getSettings()
    const updated = deepSet(current as unknown as Record<string, unknown>, path, value) as unknown as OrgSettings

    set((state) => ({
      settings: updated,
      hasUnsavedChanges: computeDirty(updated, state.saved),
    }))
  },

  saveChanges: () => {
    set((state) => ({
      saved: state.settings ? deepClone(state.settings) : null,
      hasUnsavedChanges: false,
    }))
  },

  discardChanges: () => {
    set((state) => ({
      settings: state.saved ? deepClone(state.saved) : null,
      hasUnsavedChanges: false,
    }))
  },
}))
