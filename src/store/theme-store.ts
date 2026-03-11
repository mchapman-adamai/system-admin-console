import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

function applyThemeToDocument(theme: 'light' | 'dark') {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light'
          applyThemeToDocument(next)
          return { theme: next }
        }),
    }),
    {
      name: 'adam-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDocument(state.theme)
        }
      },
    },
  ),
)
