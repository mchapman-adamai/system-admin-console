import { create } from 'zustand'
import type { NotificationItem } from '@/data/types'

// ---------------------------------------------------------------------------
// Seed data -- representative notifications for the admin console.
// ---------------------------------------------------------------------------

const seedNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    type: 'security_alert',
    title: 'Multiple failed login attempts detected',
    description:
      'User james.thornton@acme.com has exceeded the login retry limit of 5 attempts. The account has been temporarily locked.',
    timestamp: '2026-03-11T14:45:00Z',
    read: false,
    severity: 'critical',
  },
  {
    id: 'notif-002',
    type: 'pending_approval',
    title: 'New device pending approval',
    description:
      'Daniel Wu has registered a new iPad Pro and it is awaiting administrator approval.',
    timestamp: '2026-03-11T11:20:00Z',
    read: false,
    severity: 'warning',
  },
  {
    id: 'notif-003',
    type: 'policy_change',
    title: 'Password policy updated',
    description:
      'The minimum password length for Acme Holdings Ltd has been increased from 10 to 12 characters.',
    timestamp: '2026-03-10T16:05:00Z',
    read: false,
    severity: 'info',
  },
  {
    id: 'notif-004',
    type: 'system_event',
    title: 'SSO certificate expiring soon',
    description:
      'The SAML signing certificate for Azure AD will expire in 14 days. Please renew it to avoid login disruptions.',
    timestamp: '2026-03-10T09:00:00Z',
    read: true,
    severity: 'warning',
  },
  {
    id: 'notif-005',
    type: 'security_alert',
    title: 'Unrecognised device login blocked',
    description:
      'A login attempt from an unregistered device was blocked for emma.rodriguez@northbridge.com.',
    timestamp: '2026-03-09T22:15:00Z',
    read: true,
    severity: 'critical',
  },
  {
    id: 'notif-006',
    type: 'system_event',
    title: 'Audit log export completed',
    description:
      'The scheduled weekly audit log export for Acme Holdings Ltd has been completed successfully.',
    timestamp: '2026-03-09T06:00:00Z',
    read: true,
    severity: 'info',
  },
]

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface NotificationState {
  notifications: NotificationItem[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

function countUnread(items: NotificationItem[]): number {
  return items.filter((n) => !n.read).length
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: seedNotifications,
  unreadCount: countUnread(seedNotifications),

  markAsRead: (id: string) =>
    set((state) => {
      const next = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      )
      return { notifications: next, unreadCount: countUnread(next) }
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}))
