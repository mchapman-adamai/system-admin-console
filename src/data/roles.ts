import type { Role } from './types'

export const roles: Role[] = [
  {
    id: 'governance_professional',
    displayName: 'Governance Professional',
    description:
      'Company secretaries and governance officers responsible for meeting preparation, document management, and compliance oversight.',
    permissions: [
      'create_meetings',
      'upload_documents',
      'manage_agendas',
      'manage_annotations',
      'view_audit_logs',
      'manage_meeting_packs',
      'send_invitations',
      'manage_resolutions',
      'archive_meetings',
    ],
    restrictions: [
      'cannot_manage_users',
      'cannot_configure_authentication',
      'cannot_configure_device_policies',
    ],
    isCustom: false,
    userCount: 2,
  },
  {
    id: 'director',
    displayName: 'Director',
    description:
      'Board members and committee members who attend meetings, review documents, and participate in voting and decision-making.',
    permissions: [
      'view_documents',
      'annotate_documents',
      'vote_on_resolutions',
      'attend_meetings',
      'view_meeting_packs',
      'submit_declarations',
      'e_sign_documents',
    ],
    restrictions: [
      'cannot_manage_users',
      'cannot_manage_policies',
      'cannot_upload_documents',
      'cannot_create_meetings',
      'cannot_view_audit_logs',
    ],
    isCustom: false,
    userCount: 3,
  },
  {
    id: 'observer',
    displayName: 'Observer',
    description:
      'External advisors, auditors, or guests with read-only access to meeting materials and documents.',
    permissions: [
      'view_meeting_materials',
      'view_documents',
      'view_meeting_packs',
    ],
    restrictions: [
      'cannot_vote',
      'cannot_annotate',
      'cannot_upload_documents',
      'cannot_create_meetings',
      'cannot_manage_users',
      'cannot_manage_policies',
      'cannot_view_audit_logs',
    ],
    isCustom: false,
    userCount: 1,
  },
  {
    id: 'system_administrator',
    displayName: 'System Administrator',
    description:
      'Platform administrators responsible for user management, security configuration, device policies, content protection, and audit settings.',
    permissions: [
      'manage_users',
      'configure_authentication',
      'configure_device_policies',
      'configure_content_protection',
      'configure_audit_settings',
      'view_audit_logs',
      'manage_roles',
      'manage_organisations',
      'register_devices',
      'manage_integrations',
    ],
    restrictions: [
      'cannot_view_document_content',
      'cannot_attend_meetings_as_participant',
      'cannot_vote_on_resolutions',
    ],
    isCustom: false,
    userCount: 1,
  },
]
