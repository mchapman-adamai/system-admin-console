import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OrgState {
  currentOrgId: string
  switchOrg: (orgId: string) => void
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      currentOrgId: 'org-acme-001',
      switchOrg: (orgId: string) => set({ currentOrgId: orgId }),
    }),
    {
      name: 'adam-current-org',
    },
  ),
)
