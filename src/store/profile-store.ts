import { create } from 'zustand'
import type { Profile, OrgSettings } from '@/data/types'
import { profiles as seedProfiles } from '@/data/profiles'
import { TENANT_ORG_ID } from '@/store/org-store'

// ---------------------------------------------------------------------------
// Deep-set helper (same pattern as settings-store)
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

interface ProfileState {
  profiles: Profile[]

  addProfile: (profile: Omit<Profile, 'id'>) => void
  updateProfile: (id: string, partial: Partial<Omit<Profile, 'id'>>) => void
  updateProfileSettings: (id: string, path: string[], value: unknown) => void
  deleteProfile: (id: string) => void
}

let nextId = seedProfiles.length + 1

function generateProfileId(): string {
  const id = `prof-${String(nextId).padStart(3, '0')}`
  nextId += 1
  return id
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profiles: seedProfiles.filter((p) => p.organisationId === TENANT_ORG_ID),

  addProfile: (profile) =>
    set((state) => ({
      profiles: [...state.profiles, { ...profile, id: generateProfileId() }],
    })),

  updateProfile: (id, partial) =>
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === id ? { ...p, ...partial } : p,
      ),
    })),

  updateProfileSettings: (id, path, value) =>
    set((state) => ({
      profiles: state.profiles.map((p) => {
        if (p.id !== id) return p
        const updated = deepSet(
          (p.settings ?? {}) as Record<string, unknown>,
          path,
          value,
        ) as Partial<OrgSettings>
        return { ...p, settings: updated }
      }),
    })),

  deleteProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
    })),
}))
