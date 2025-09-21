import { offlineDB } from "./offline-db"

interface SyncConfig {
  maxRetries: number
  retryDelay: number
  batchSize: number
}

class SyncManager {
  private config: SyncConfig = {
    maxRetries: 3,
    retryDelay: 5000,
    batchSize: 10,
  }

  private isOnline = navigator.onLine
  private syncInProgress = false

  constructor() {
    this.setupEventListeners()
    this.startPeriodicSync()
  }

  private setupEventListeners(): void {
    window.addEventListener("online", () => {
      console.log("[v0] Connection restored, starting sync...")
      this.isOnline = true
      this.syncPendingData()
    })

    window.addEventListener("offline", () => {
      console.log("[v0] Connection lost, switching to offline mode")
      this.isOnline = false
    })
  }

  private startPeriodicSync(): void {
    // Sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncPendingData()
      }
    }, 30000)
  }

  async syncPendingData(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return

    this.syncInProgress = true
    console.log("[v0] Starting background sync...")

    try {
      const syncQueue = await offlineDB.getSyncQueue()
      const batches = this.createBatches(syncQueue, this.config.batchSize)

      for (const batch of batches) {
        await this.processBatch(batch)
      }

      console.log("[v0] Background sync completed successfully")
    } catch (error) {
      console.error("[v0] Background sync failed:", error)
    } finally {
      this.syncInProgress = false
    }
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }
    return batches
  }

  private async processBatch(batch: any[]): Promise<void> {
    const promises = batch.map((item) => this.syncItem(item))
    await Promise.allSettled(promises)
  }

  private async syncItem(item: any): Promise<void> {
    try {
      // Simulate API call - in real app, this would be actual API endpoints
      await this.simulateAPICall(item)

      // Remove from sync queue on success
      await offlineDB.removeSyncItem(item.id)
      console.log(`[v0] Synced ${item.type} successfully`)
    } catch (error) {
      console.error(`[v0] Failed to sync ${item.type}:`, error)

      // Increment retry count
      item.retryCount = (item.retryCount || 0) + 1

      if (item.retryCount >= this.config.maxRetries) {
        console.error(`[v0] Max retries reached for ${item.type}, removing from queue`)
        await offlineDB.removeSyncItem(item.id)
      }
    }
  }

  private async simulateAPICall(item: any): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200))

    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      throw new Error("Simulated network error")
    }

    console.log(`[v0] API call for ${item.action} ${item.type}:`, item.data)
  }

  async queueForSync(action: "create" | "update" | "delete", type: string, data: any): Promise<void> {
    await offlineDB.addToSyncQueue(action, type, data)

    // Try immediate sync if online
    if (this.isOnline) {
      setTimeout(() => this.syncPendingData(), 1000)
    }
  }

  getConnectionStatus(): boolean {
    return this.isOnline
  }

  getSyncStatus(): boolean {
    return this.syncInProgress
  }
}

export const syncManager = new SyncManager()
