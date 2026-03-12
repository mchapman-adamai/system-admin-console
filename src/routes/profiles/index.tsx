import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useProfileStore } from '@/store/profile-store'
import { useUserStore } from '@/store/user-store'
import { formatRelativeTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TENANT_ORG_ID } from '@/store/org-store'

export default function ProfilesPage() {
  const navigate = useNavigate()
  const profiles = useProfileStore((s) => s.profiles)
  const addProfile = useProfileStore((s) => s.addProfile)
  const users = useUserStore((s) => s.users)

  const getAssignedCount = (profileId: string) =>
    users.filter((u) => u.profileId === profileId).length

  const handleCreateProfile = () => {
    addProfile({
      name: `New Profile ${profiles.length + 1}`,
      description: 'Configure the settings for this profile',
      organisationId: TENANT_ORG_ID,
      createdAt: new Date().toISOString(),
      settings: {},
    })
    toast.success('Profile created')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profiles</h1>
          <p className="text-muted-foreground">
            Create and manage security profiles to assign policy settings to users
          </p>
        </div>
        <Button onClick={handleCreateProfile}>
          <Plus className="mr-1.5 h-4 w-4" />
          Create Profile
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Assigned Users</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No profiles created yet.
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow
                  key={profile.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/profiles/${profile.id}`)}
                >
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[300px] truncate">
                    {profile.description}
                  </TableCell>
                  <TableCell>{getAssignedCount(profile.id)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatRelativeTime(profile.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
