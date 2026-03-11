import type { Organisation } from './types'

export const organisations: Organisation[] = [
  {
    id: 'org-acme-001',
    name: 'Acme Holdings Ltd',
    industry: 'Financial Services',
    primaryRegion: 'United Kingdom',
    createdAt: '2024-06-15T09:00:00Z',
    userCount: 30,
    status: 'active',
  },
  {
    id: 'org-northbridge-001',
    name: 'Northbridge Capital',
    industry: 'Investment Management',
    primaryRegion: 'United States',
    createdAt: '2025-01-22T14:30:00Z',
    userCount: 12,
    status: 'active',
  },
]

export const currentOrg = organisations.find(o => o.id === 'org-acme-001')!
