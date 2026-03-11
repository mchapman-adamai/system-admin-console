import { Building2 } from "lucide-react"
import { currentOrg } from "@/data/organisations"

export function OrgSwitcher() {
  return (
    <div className="flex h-8 items-center gap-2 rounded-lg px-2 text-sm font-normal">
      <Building2 className="size-4 text-muted-foreground" />
      <span className="max-w-[180px] truncate font-medium">
        {currentOrg.name}
      </span>
    </div>
  )
}
