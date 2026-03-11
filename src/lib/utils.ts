import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import type { RoleType } from "@/data/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format an ISO date string to a human-readable date.
 * Example: "11 Mar 2026"
 */
export function formatDate(date: string): string {
  return format(parseISO(date), 'd MMM yyyy')
}

/**
 * Format an ISO date string as a relative time string.
 * Example: "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true })
}

/**
 * Map a RoleType enum value to its human-readable display name.
 */
const ROLE_DISPLAY_NAMES: Record<RoleType, string> = {
  governance_professional: 'Governance Professional',
  director: 'Director',
  observer: 'Observer',
  system_administrator: 'System Administrator',
}

export function roleDisplayName(role: RoleType): string {
  return ROLE_DISPLAY_NAMES[role] ?? role
}
