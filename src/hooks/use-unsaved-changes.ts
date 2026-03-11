import { useCallback, useState } from 'react'

/**
 * Lightweight hook for tracking form dirty state.
 *
 * Usage:
 *   const { isDirty, markDirty, reset } = useUnsavedChanges()
 *
 * Call `markDirty()` whenever a field value changes.
 * Call `reset()` after a successful save or discard to clear the flag.
 * Bind `isDirty` to the SaveBar's visibility.
 */
export function useUnsavedChanges() {
  const [isDirty, setIsDirty] = useState(false)

  const markDirty = useCallback(() => {
    setIsDirty(true)
  }, [])

  const reset = useCallback(() => {
    setIsDirty(false)
  }, [])

  return { isDirty, markDirty, reset } as const
}
