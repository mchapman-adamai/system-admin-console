import { create } from 'zustand'
import type { RegisteredDevice } from '@/data/types'
import { registeredDevices as seedDevices } from '@/data/devices'

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface DeviceState {
  devices: RegisteredDevice[]

  /** Set device status to 'approved'. */
  approveDevice: (id: string) => void

  /** Set device status to 'disabled'. */
  deactivateDevice: (id: string) => void

  /** Re-enable a disabled device by setting status to 'approved'. */
  reactivateDevice: (id: string) => void

  /** Remove a device from the list entirely. */
  removeDevice: (id: string) => void

  /** Add a new device to the registry. */
  addDevice: (device: RegisteredDevice) => void
}

export const useDeviceStore = create<DeviceState>()((set) => ({
  devices: [...seedDevices],

  approveDevice: (id) =>
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, status: 'approved' as const } : d,
      ),
    })),

  deactivateDevice: (id) =>
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, status: 'disabled' as const } : d,
      ),
    })),

  reactivateDevice: (id) =>
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, status: 'approved' as const } : d,
      ),
    })),

  removeDevice: (id) =>
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id),
    })),

  addDevice: (device) =>
    set((state) => ({
      devices: [...state.devices, device],
    })),
}))
