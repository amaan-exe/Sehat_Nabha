"use client"

import { useState, useEffect } from "react"
import { offlineDB } from "@/lib/offline-db"
import { syncManager } from "@/lib/sync-manager"

interface OfflineState {
  isOnline: boolean
  isSyncing: boolean
  pendingSyncCount: number
  lastSyncTime: Date | null
}

export function useOffline() {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingSyncCount: 0,
    lastSyncTime: null,
  })

  useEffect(() => {
    const updateOnlineStatus = () => {
      setState((prev) => ({
        ...prev,
        isOnline: navigator.onLine,
      }))
    }

    const updateSyncStatus = () => {
      setState((prev) => ({
        ...prev,
        isSyncing: syncManager.getSyncStatus(),
      }))
    }

    // Update pending sync count
    const updatePendingCount = async () => {
      try {
        const queue = await offlineDB.getSyncQueue()
        setState((prev) => ({
          ...prev,
          pendingSyncCount: queue.length,
        }))
      } catch (error) {
        console.error("[v0] Failed to get sync queue count:", error)
      }
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Update sync status periodically
    const syncStatusInterval = setInterval(updateSyncStatus, 1000)
    const pendingCountInterval = setInterval(updatePendingCount, 5000)

    // Initial updates
    updateOnlineStatus()
    updateSyncStatus()
    updatePendingCount()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
      clearInterval(syncStatusInterval)
      clearInterval(pendingCountInterval)
    }
  }, [])

  const saveOfflineData = async (
    type: "patient" | "prescription" | "medicine" | "consultation" | "user",
    id: string,
    data: any,
  ) => {
    try {
      await offlineDB.saveOfflineData(type, id, data)
      await syncManager.queueForSync("create", type, data)
      console.log(`[v0] Saved ${type} data offline:`, id)
    } catch (error) {
      console.error(`[v0] Failed to save ${type} data offline:`, error)
      throw error
    }
  }

  const getOfflineData = async (type: "patient" | "prescription" | "medicine" | "consultation" | "user") => {
    try {
      return await offlineDB.getOfflineData(type)
    } catch (error) {
      console.error(`[v0] Failed to get ${type} data offline:`, error)
      return []
    }
  }

  const forcSync = async () => {
    if (state.isOnline) {
      await syncManager.syncPendingData()
      setState((prev) => ({
        ...prev,
        lastSyncTime: new Date(),
      }))
    }
  }

  return {
    ...state,
    saveOfflineData,
    getOfflineData,
    forcSync,
  }
}
