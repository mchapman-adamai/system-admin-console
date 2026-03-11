import { create } from 'zustand'
import type { User, RoleType } from '@/data/types'
import { users as seedUsers } from '@/data/users'
import { TENANT_ORG_ID } from '@/store/org-store'

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface UserState {
  users: User[]

  /** Add a new user with an auto-generated ID. */
  addUser: (user: Omit<User, 'id'>) => void

  /** Partially update an existing user by ID. */
  updateUser: (id: string, partial: Partial<Omit<User, 'id'>>) => void

  /** Set user status to 'suspended'. */
  suspendUser: (id: string) => void

  /** Set user status to 'active'. */
  reactivateUser: (id: string) => void

  /** Set user status to 'offboarded'. */
  offboardUser: (id: string) => void

  /** Remove a user from the list entirely. */
  deleteUser: (id: string) => void
}

let nextId = seedUsers.length + 1

function generateUserId(): string {
  const id = `usr-${String(nextId).padStart(3, '0')}`
  nextId += 1
  return id
}

export const useUserStore = create<UserState>()((set) => ({
  users: seedUsers.filter((u) => u.organisationId === TENANT_ORG_ID),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, { ...user, id: generateUserId() }],
    })),

  updateUser: (id, partial) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, ...partial } : u,
      ),
    })),

  suspendUser: (id) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, status: 'suspended' as const } : u,
      ),
    })),

  reactivateUser: (id) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, status: 'active' as const } : u,
      ),
    })),

  offboardUser: (id) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, status: 'offboarded' as const } : u,
      ),
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
}))
