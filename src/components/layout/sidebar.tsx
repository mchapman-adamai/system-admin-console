import { NavLink } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  KeyRound,
  ShieldCheck,
  Lock,
  Timer,
  Users,
  UserCog,
  UserMinus,
  Building2,
  Shield,
  Layers,
  FileText,
  Droplets,
  Smartphone,
  WifiOff,
  Video,
  Laptop,
  ClipboardCheck,
  Activity,
  Settings2,
  Puzzle,
  Fingerprint,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/store/sidebar-store"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "PEOPLE",
    items: [
      { label: "Users", path: "/people/users", icon: Users },
      { label: "Roles & Permissions", path: "/people/roles", icon: UserCog },
      { label: "Lifecycle & Offboarding", path: "/people/lifecycle", icon: UserMinus },
    ],
  },
  {
    label: "ORGANISATIONS",
    items: [
      { label: "Organisation Settings", path: "/organisations/settings", icon: Building2 },
      { label: "Security Policies", path: "/organisations/security-policies", icon: Shield },
    ],
  },
  {
    label: "PROFILES",
    items: [
      { label: "Profiles", path: "/profiles", icon: Layers },
    ],
  },
  {
    label: "POLICIES",
    items: [
      { label: "Content Protection", path: "/policies/content-protection", icon: FileText },
      { label: "Watermarks", path: "/policies/watermarks", icon: Droplets },
      { label: "Device Security", path: "/policies/device-security", icon: Smartphone },
      { label: "Offline & App Data", path: "/policies/offline", icon: WifiOff },
      { label: "Meeting Controls", path: "/policies/meeting-controls", icon: Video },
    ],
  },
  {
    label: "IDENTITY",
    items: [
      { label: "SSO & Login", path: "/identity/sso", icon: KeyRound },
      { label: "MFA", path: "/identity/mfa", icon: ShieldCheck },
      { label: "Password Policy", path: "/identity/password-policy", icon: Lock },
      { label: "Sessions", path: "/identity/sessions", icon: Timer },
    ],
  },
  {
    label: "DEVICES",
    items: [
      { label: "Device Registry", path: "/devices/registry", icon: Laptop },
      { label: "Registration Rules", path: "/devices/registration-rules", icon: ClipboardCheck },
    ],
  },
  {
    label: "AUDIT",
    items: [
      { label: "Activity Log", path: "/audit/activity-log", icon: Activity },
      { label: "Log Settings & Retention", path: "/audit/log-settings", icon: Settings2 },
    ],
  },
  {
    label: "INTEGRATIONS",
    items: [
      { label: "Overview", path: "/integrations/overview", icon: Puzzle },
      { label: "National Identity", path: "/integrations/national-identity", icon: Fingerprint },
    ],
  },
]

function SidebarNavItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon

  const linkContent = (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive &&
            "border-l-2 border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground",
          !isActive && "border-l-2 border-transparent",
          collapsed && "justify-center px-2"
        )
      }
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger className="w-full" render={<div />}>
          {linkContent}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}

function SidebarNavGroup({
  group,
  collapsed,
}: {
  group: NavGroup
  collapsed: boolean
}) {
  const { expandedGroups, toggleGroup } = useSidebarStore()
  const isExpanded = expandedGroups[group.label] ?? true

  if (collapsed) {
    return (
      <div className="space-y-0.5 px-2">
        {group.items.map((item) => (
          <SidebarNavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </div>
    )
  }

  return (
    <div className="px-2">
      <button
        type="button"
        onClick={() => toggleGroup(group.label)}
        className="flex w-full items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors"
      >
        <span>{group.label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            !isExpanded && "-rotate-90"
          )}
        />
      </button>
      {isExpanded && (
        <div className="space-y-0.5">
          {group.items.map((item) => (
            <SidebarNavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebarStore()

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-16" : "w-[280px]"
      )}
    >
      {/* Logo / Brand */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-sidebar-border px-4",
          collapsed && "justify-center px-2"
        )}
      >
        {collapsed ? (
          <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            A
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">
                Adam.ai
              </span>
              <span className="text-[11px] text-sidebar-foreground/50">
                Admin Console
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable navigation area */}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-1 py-3">
          {/* Dashboard - always visible at top */}
          <div className="px-2">
            <SidebarNavItem
              item={{ label: "Dashboard", path: "/dashboard", icon: LayoutDashboard }}
              collapsed={collapsed}
            />
          </div>

          {/* Separator */}
          <div className="mx-4 my-1 h-px bg-sidebar-border" />

          {/* Navigation groups */}
          <div className="flex flex-col gap-2">
            {navGroups.map((group) => (
              <SidebarNavGroup key={group.label} group={group} collapsed={collapsed} />
            ))}
          </div>
        </nav>
      </div>

      {/* Bottom section - General Settings + collapse toggle */}
      <div className="shrink-0 border-t border-sidebar-border">
        <div className="px-2 py-2">
          <SidebarNavItem
            item={{ label: "General Settings", path: "/settings", icon: Settings }}
            collapsed={collapsed}
          />
        </div>
        <div
          className={cn(
            "flex border-t border-sidebar-border px-2 py-2",
            collapsed ? "justify-center" : "justify-end"
          )}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleCollapsed}
            className="text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
