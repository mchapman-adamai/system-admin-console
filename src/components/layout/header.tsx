import { Bell, LogOut, Moon, Search, Sun, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useThemeStore } from "@/store/theme-store"
import { OrgSwitcher } from "@/components/layout/org-switcher"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HeaderProps {
  /** Number of unread notifications shown on the bell badge */
  unreadCount?: number
}

export function Header({ unreadCount = 3 }: HeaderProps) {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      {/* Left section: Org switcher + breadcrumbs */}
      <div className="flex items-center gap-3">
        <OrgSwitcher />
        <Separator orientation="vertical" className="!h-5" />
        <Breadcrumbs />
      </div>

      {/* Right section: actions */}
      <div className="flex items-center gap-1">
        {/* Search trigger */}
        <Tooltip>
          <TooltipTrigger
            className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="size-4" />
          </TooltipTrigger>
          <TooltipContent>
            <span>Search</span>
            <kbd
              data-slot="kbd"
              className="ml-1.5 inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground"
            >
              {"\u2318"}K
            </kbd>
          </TooltipContent>
        </Tooltip>

        {/* Notification bell */}
        <Tooltip>
          <TooltipTrigger
            className="relative inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-medium",
                  "bg-destructive text-destructive-foreground",
                  "border-2 border-background"
                )}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger
            onClick={toggleTheme}
            className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {theme === "light" ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {theme === "light" ? "Dark mode" : "Light mode"}
          </TooltipContent>
        </Tooltip>

        {/* Separator */}
        <Separator orientation="vertical" className="!h-5 mx-1" />

        {/* User avatar menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-md px-2 py-1 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar size="sm">
              <AvatarFallback className="text-[10px] font-medium">SA</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col text-left md:flex">
              <span className="text-xs font-medium leading-tight">System Admin</span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Super Administrator
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">System Admin</span>
                <span className="text-xs font-normal text-muted-foreground">
                  admin@adam.ai
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut className="size-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
