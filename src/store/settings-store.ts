import { create } from 'zustand'
import type { OrgSettings } from '@/data/types'

// ---------------------------------------------------------------------------
// Default org settings -- sensible baselines matching the PRD.
// These are used as the initial state for every organisation until overridden.
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
  /** Map of orgId -> current (possibly edited) settings. */
  settingsMap: Record<string, OrgSettings>

  /** Map of orgId -> last-saved snapshot (used to detect dirty state). */
  savedMap: Record<string, OrgSettings>

  /** Whether any org's settings differ from their saved snapshot. */
  hasUnsavedChanges: boolean

  /** Return the settings for a given org (creates from defaults if needed). */
  getSettings: (orgId: string) => OrgSettings

  /** Update a single nested value within an org's settings. */
  updateSettings: (orgId: string, path: string[], value: unknown) => void

  /** Persist all current settings (simulated). */
  saveChanges: () => void

  /** Revert to the last-saved snapshot. */
  discardChanges: () => void
}

function computeDirty(
  settingsMap: Record<string, OrgSettings>,
  savedMap: Record<string, OrgSettings>,
): boolean {
  for (const orgId of Object.keys(settingsMap)) {
    if (JSON.stringify(settingsMap[orgId]) !== JSON.stringify(savedMap[orgId])) {
      return true
    }
  }
  return false
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  settingsMap: {},
  savedMap: {},
  hasUnsavedChanges: false,

  getSettings: (orgId: string) => {
    const { settingsMap } = get()
    if (settingsMap[orgId]) return settingsMap[orgId]

    // Initialise from defaults
    const fresh = deepClone(defaultOrgSettings)
    set((state) => ({
      settingsMap: { ...state.settingsMap, [orgId]: fresh },
      savedMap: { ...state.savedMap, [orgId]: deepClone(fresh) },
    }))
    return fresh
  },

  updateSettings: (orgId: string, path: string[], value: unknown) => {
    const current = get().getSettings(orgId)
    const updated = deepSet(current as unknown as Record<string, unknown>, path, value) as unknown as OrgSettings

    set((state) => {
      const nextMap = { ...state.settingsMap, [orgId]: updated }
      return {
        settingsMap: nextMap,
        hasUnsavedChanges: computeDirty(nextMap, state.savedMap),
      }
    })
  },

  saveChanges: () => {
    set((state) => ({
      savedMap: deepClone(state.settingsMap),
      hasUnsavedChanges: false,
    }))
  },

  discardChanges: () => {
    set((state) => ({
      settingsMap: deepClone(state.savedMap),
      hasUnsavedChanges: false,
    }))
  },
}))
