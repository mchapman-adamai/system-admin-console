import { Building2, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOrgStore } from "@/store/org-store"
import { organisations } from "@/data/organisations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function OrgSwitcher() {
  const { currentOrgId, switchOrg } = useOrgStore()
  const currentOrg = organisations.find((org) => org.id === currentOrgId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-8 items-center gap-2 rounded-lg px-2 text-sm font-normal outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Building2 className="size-4 text-muted-foreground" />
        <span className="max-w-[180px] truncate font-medium">
          {currentOrg?.name ?? "Select Organisation"}
        </span>
        <ChevronsUpDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8} className="w-[260px]">
        <DropdownMenuLabel>Organisations</DropdownMenuLabel>
        {organisations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => switchOrg(org.id)}
            className="flex items-center gap-2"
          >
            <div
              className={cn(
                "flex size-6 items-center justify-center rounded-md text-[10px] font-bold",
                org.id === currentOrgId
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {org.name.charAt(0)}
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">{org.name}</span>
              <span className="text-xs text-muted-foreground">{org.industry}</span>
            </div>
            {org.id === currentOrgId && (
              <Check className="size-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
