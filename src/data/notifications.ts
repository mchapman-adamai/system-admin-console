import type { NotificationItem } from './types'

export const notifications: NotificationItem[] = [
  {
    id: 'notif-001',
    type: 'security_alert',
    title: 'Multiple Failed Login Attempts Detected',
    description:
      'Lucas Meyer (Northbridge Capital) had 2 consecutive failed login attempts before successfully authenticating. Review account activity.',
    timestamp: '2026-03-12T11:16:30Z',
    read: false,
    severity: 'warning',
  },
  {
    id: 'notif-002',
    type: 'pending_approval',
    title: 'Device Registration Pending Approval',
    description:
      'James Thornton has registered a new device (iPhone 15 Pro Max) that requires administrator approval before access is granted.',
    timestamp: '2026-03-12T09:14:02Z',
    read: false,
    severity: 'info',
  },
  {
    id: 'notif-003',
    type: 'policy_change',
    title: 'Password Policy Updated',
    description:
      'Olivia Clarke increased the minimum password length from 10 to 12 characters for Acme Holdings Ltd. All users must update their passwords at next login.',
    timestamp: '2026-03-12T10:15:00Z',
    read: false,
    severity: 'info',
  },
  {
    id: 'notif-004',
    type: 'security_alert',
    title: 'Document Export Blocked',
    description:
      'James Thornton attempted to export "Risk Register - Q1 2026" which was blocked by the content protection policy. This is the second blocked export this week.',
    timestamp: '2026-03-12T13:00:00Z',
    read: false,
    severity: 'critical',
  },
  {
    id: 'notif-005',
    type: 'system_event',
    title: 'Device Deactivated Due to Inactivity',
    description:
      'iPad Air 11" (M2) registered to Emma Rodriguez was automatically disabled due to 30+ days of inactivity per device security policy.',
    timestamp: '2026-03-12T11:45:00Z',
    read: true,
    severity: 'info',
  },
  {
    id: 'notif-006',
    type: 'policy_change',
    title: 'Session Timeout Reduced',
    description:
      'Web portal session timeout for Acme Holdings Ltd was reduced from 15 minutes to 10 minutes by Olivia Clarke.',
    timestamp: '2026-03-12T13:15:42Z',
    read: true,
    severity: 'info',
  },
  {
    id: 'notif-007',
    type: 'security_alert',
    title: 'MFA Not Enabled for Observer Account',
    description:
      'Lucas Meyer (Northbridge Capital) does not have multi-factor authentication enabled. Organisation policy requires MFA for all users.',
    timestamp: '2026-03-11T08:00:00Z',
    read: false,
    severity: 'warning',
  },
  {
    id: 'notif-008',
    type: 'system_event',
    title: 'User Account Suspended',
    description:
      'Thomas Grant (Acme Holdings Ltd) account was suspended by Olivia Clarke pending annual compliance review.',
    timestamp: '2026-03-12T15:00:00Z',
    read: false,
    severity: 'warning',
  },
]
