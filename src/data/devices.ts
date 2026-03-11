import type { RegisteredDevice } from './types'

export const registeredDevices: RegisteredDevice[] = [
  {
    id: 'dev-001',
    userId: 'usr-001',
    userName: 'Sarah Bennett',
    deviceName: 'iPad Pro 12.9" (6th generation)',
    deviceType: 'tablet',
    status: 'approved',
    registeredAt: '2024-08-12T10:30:00Z',
    lastUsedAppVersion: '4.2.1',
  },
  {
    id: 'dev-002',
    userId: 'usr-002',
    userName: 'James Thornton',
    deviceName: 'iPhone 15 Pro Max',
    deviceType: 'mobile',
    status: 'pending',
    registeredAt: '2026-03-10T08:15:00Z',
    lastUsedAppVersion: '4.2.1',
  },
  {
    id: 'dev-003',
    userId: 'usr-003',
    userName: 'Daniel Wu',
    deviceName: 'MacBook Pro 16" (M3 Pro)',
    deviceType: 'laptop',
    status: 'approved',
    registeredAt: '2025-04-20T14:00:00Z',
    lastUsedAppVersion: '4.1.8',
  },
  {
    id: 'dev-004',
    userId: 'usr-005',
    userName: 'Emma Rodriguez',
    deviceName: 'iPad Air 11" (M2)',
    deviceType: 'tablet',
    status: 'disabled',
    registeredAt: '2025-02-05T09:45:00Z',
    lastUsedAppVersion: '4.0.3',
  },
]
