import { create } from 'zustand'
import type { AuditLogEntry, AuditAction } from '@/data/types'
import { auditLogs as seedLogs } from '@/data/audit-logs'

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface AuditState {
  entries: AuditLogEntry[]

  /** Prepend a new audit log entry with an auto-generated ID and timestamp. */
  addEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void
}

let nextId = seedLogs.length + 1

function generateAuditId(): string {
  const id = `audit-${String(nextId).padStart(3, '0')}`
  nextId += 1
  return id
}

export const useAuditStore = create<AuditState>()((set) => ({
  entries: [...seedLogs],

  addEntry: (entry) =>
    set((state) => ({
      entries: [
        {
          ...entry,
          id: generateAuditId(),
          timestamp: new Date().toISOString(),
        },
        ...state.entries,
      ],
    })),
}))
