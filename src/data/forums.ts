import type { Forum } from './types'

export const forums: Forum[] = [
  {
    id: 'forum-001',
    name: 'Acme Holdings Main Board',
    type: 'board',
    organisationId: 'org-acme-001',
    memberCount: 8,
    status: 'active',
  },
  {
    id: 'forum-002',
    name: 'Audit Committee',
    type: 'committee',
    organisationId: 'org-acme-001',
    memberCount: 4,
    status: 'active',
  },
  {
    id: 'forum-003',
    name: 'Risk Committee',
    type: 'committee',
    organisationId: 'org-acme-001',
    memberCount: 5,
    status: 'active',
  },
  {
    id: 'forum-004',
    name: 'Compensation Committee',
    type: 'committee',
    organisationId: 'org-acme-001',
    memberCount: 3,
    status: 'active',
  },
  {
    id: 'forum-005',
    name: 'Strategy Review',
    type: 'working_group',
    organisationId: 'org-acme-001',
    memberCount: 6,
    status: 'active',
  },
  {
    id: 'forum-006',
    name: 'Digital Transformation',
    type: 'working_group',
    organisationId: 'org-acme-001',
    memberCount: 5,
    status: 'active',
  },
]
