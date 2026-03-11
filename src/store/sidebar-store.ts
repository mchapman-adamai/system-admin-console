import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  collapsed: boolean
  toggleCollapsed: () => void
  setCollapsed: (collapsed: boolean) => void
  expandedGroups: Record<string, boolean>
  toggleGroup: (group: string) => void
  setGroupExpanded: (group: string, expanded: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (collapsed: boolean) => set({ collapsed }),
      expandedGroups: {
        IDENTITY: true,
        PEOPLE: true,
        ORGANISATIONS: true,
        POLICIES: true,
        DEVICES: true,
        AUDIT: true,
        INTEGRATIONS: true,
      },
      toggleGroup: (group: string) =>
        set((state) => ({
          expandedGroups: {
            ...state.expandedGroups,
            [group]: !state.expandedGroups[group],
          },
        })),
      setGroupExpanded: (group: string, expanded: boolean) =>
        set((state) => ({
          expandedGroups: {
            ...state.expandedGroups,
            [group]: expanded,
          },
        })),
    }),
    {
      name: 'adam-sidebar',
    },
  ),
)
