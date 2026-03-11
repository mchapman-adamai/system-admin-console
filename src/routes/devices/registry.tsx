import { useState } from 'react'
import { registeredDevices } from '@/data/devices'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { Smartphone, Tablet, Laptop, CheckCircle, XCircle } from 'lucide-react'
import type { RegisteredDevice } from '@/data/types'

const deviceTypeIcon = (type: RegisteredDevice['deviceType']) => {
  switch (type) {
    case 'mobile':
      return <Smartphone className="h-4 w-4 text-muted-foreground" />
    case 'tablet':
      return <Tablet className="h-4 w-4 text-muted-foreground" />
    case 'laptop':
      return <Laptop className="h-4 w-4 text-muted-foreground" />
  }
}

export default function DeviceRegistryPage() {
  const [devices, setDevices] = useState(registeredDevices)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredDevices = statusFilter === 'all'
    ? devices
    : devices.filter((d) => d.status === statusFilter)

  const handleApprove = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, status: 'approved' as const } : d))
    )
    toast.success('Device approved successfully')
  }

  const handleDeactivate = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, status: 'disabled' as const } : d))
    )
    toast.success('Device deactivated')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Device Registry</h1>
        <p className="text-muted-foreground">View and manage registered devices, approve or deactivate access</p>
      </div>

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.deviceName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {deviceTypeIcon(device.deviceType)}
                    <span className="capitalize">{device.deviceType}</span>
                  </div>
                </TableCell>
                <TableCell>{device.userName}</TableCell>
                <TableCell>
                  <StatusBadge status={device.status} />
                </TableCell>
                <TableCell>{formatDate(device.registeredAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {device.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(device.id)}
                        className="gap-1.5"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                    )}
                    {device.status === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivate(device.id)}
                        className="gap-1.5 text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Deactivate
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredDevices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No devices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
