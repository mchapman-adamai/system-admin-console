import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

/** Map raw path segments to human-readable labels */
const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  identity: "Identity",
  sso: "SSO & Login",
  mfa: "MFA",
  "password-policy": "Password Policy",
  sessions: "Sessions",
  people: "People",
  users: "Users",
  roles: "Roles & Permissions",
  lifecycle: "Lifecycle & Offboarding",
  organisations: "Organisations",
  settings: "Settings",
  "security-policies": "Security Policies",
  profiles: "Profiles",
  policies: "Policies",
  "content-protection": "Content Protection",
  watermarks: "Watermarks",
  "device-security": "Device Security",
  offline: "Offline & App Data",
  "meeting-controls": "Meeting Controls",
  devices: "Devices",
  registry: "Device Registry",
  "registration-rules": "Registration Rules",
  audit: "Audit",
  "activity-log": "Activity Log",
  "log-settings": "Log Settings & Retention",
  integrations: "Integrations",
  overview: "Overview",
  "national-identity": "National Identity",
}

function formatSegment(segment: string): string {
  return (
    segmentLabels[segment] ??
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  )
}

export function Breadcrumbs() {
  const location = useLocation()
  const pathSegments = location.pathname.split("/").filter(Boolean)

  if (pathSegments.length === 0) {
    return null
  }

  const crumbs = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/")
    const label = formatSegment(segment)
    const isLast = index === pathSegments.length - 1

    return { path, label, isLast }
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        to="/dashboard"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="size-3.5" />
      </Link>

      {crumbs.map((crumb) => (
        <div key={crumb.path} className="flex items-center gap-1">
          <ChevronRight className="size-3.5 text-muted-foreground/60" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground"
              )}
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
