import { useEffect, useRef, useCallback } from 'react'
import { useContentStore } from '../store/useContentStore'

interface UseAutoSaveOptions {
  siteId: string
  siteData: any
  enabled?: boolean
  debounceMs?: number
  onSaveSuccess?: () => void
  onSaveError?: (error: Error) => void
}

interface PendingSave {
  data: any
  timestamp: number
  retries: number
}

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

export function useAutoSave({
  siteId,
  siteData,
  enabled = true,
  debounceMs = 2000,
  onSaveSuccess,
  onSaveError
}: UseAutoSaveOptions) {
  const { content } = useContentStore()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingSaveRef = useRef<PendingSave | null>(null)
  const isSavingRef = useRef(false)
  const lastSavedRef = useRef<string | null>(null)

  // Save function with retry logic
  const saveToDatabase = useCallback(async (data: any, retries = 0): Promise<boolean> => {
    if (isSavingRef.current && retries === 0) {
      // If already saving, queue this save
      pendingSaveRef.current = {
        data,
        timestamp: Date.now(),
        retries: 0
      }
      return false
    }

    isSavingRef.current = true

    try {
      const payload = {
        siteId,
        ...siteData,
        content,
        updatedAt: new Date().toISOString()
      }

      // Check if data actually changed
      const dataStr = JSON.stringify(payload)
      if (lastSavedRef.current === dataStr) {
        isSavingRef.current = false
        return true // No changes, skip save
      }

      const response = await fetch('/api/editor/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        keepalive: true // Important: keep request alive even if page closes
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Save failed: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        lastSavedRef.current = dataStr
        onSaveSuccess?.()
        isSavingRef.current = false

        // Process any pending save
        if (pendingSaveRef.current) {
          const pending = pendingSaveRef.current
          pendingSaveRef.current = null
          setTimeout(() => saveToDatabase(pending.data, 0), 100)
        }

        return true
      } else {
        throw new Error(result.error || 'Save failed')
      }
    } catch (error) {
      console.error('Auto-save error:', error)
      
      if (retries < MAX_RETRIES) {
        // Retry after delay
        setTimeout(() => {
          saveToDatabase(data, retries + 1)
        }, RETRY_DELAY * (retries + 1))
        isSavingRef.current = false
        return false
      } else {
        // Max retries reached
        isSavingRef.current = false
        onSaveError?.(error as Error)
        return false
      }
    }
  }, [siteId, siteData, content, onSaveSuccess, onSaveError])

  // Debounced save function
  const debouncedSave = useCallback(() => {
    if (!enabled) return

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      const payload = {
        ...siteData,
        content,
        updatedAt: new Date().toISOString()
      }
      saveToDatabase(payload)
    }, debounceMs)
  }, [enabled, siteData, content, debounceMs, saveToDatabase])

  // Auto-save on content changes
  useEffect(() => {
    if (!enabled) return

    debouncedSave()

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [content, debouncedSave, enabled])

  // Save on page unload
  useEffect(() => {
    if (!enabled) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Cancel any pending debounced saves and save immediately
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }

      // Use fetch with keepalive for reliable save on page close
      const payload = {
        siteId,
        ...siteData,
        content,
        updatedAt: new Date().toISOString()
      }

      const dataStr = JSON.stringify(payload)
      if (lastSavedRef.current !== dataStr && !isSavingRef.current) {
        // Save synchronously with keepalive
        fetch('/api/editor/sites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: dataStr,
          keepalive: true // Critical: keeps request alive even after page closes
        }).catch(() => {
          // Ignore errors on page close
        })
      }
    }

    // Also handle visibility change (tab switch, minimize, etc.)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page is being hidden, save immediately
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
          debounceTimerRef.current = null
        }

        const payload = {
          siteId,
          ...siteData,
          content,
          updatedAt: new Date().toISOString()
        }

        const dataStr = JSON.stringify(payload)
        if (lastSavedRef.current !== dataStr && !isSavingRef.current) {
          saveToDatabase(payload).catch(() => {
            // Ignore errors
          })
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, siteId, siteData, content, saveToDatabase])

  // Manual save function
  const saveNow = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    const payload = {
      ...siteData,
      content,
      updatedAt: new Date().toISOString()
    }

    return await saveToDatabase(payload)
  }, [siteData, content, saveToDatabase])

  return {
    saveNow,
    isSaving: isSavingRef.current
  }
}

