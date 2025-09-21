interface OfflineData {
  id: string
  type: "patient" | "prescription" | "medicine" | "consultation" | "user"
  data: any
  timestamp: number
  synced: boolean
}

interface SyncQueue {
  id: string
  action: "create" | "update" | "delete"
  type: string
  data: any
  timestamp: number
  retryCount: number
}

class OfflineDB {
  private db: IDBDatabase | null = null
  private readonly dbName = "SehatNabhaDB"
  private readonly version = 1

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create offline data store
        if (!db.objectStoreNames.contains("offlineData")) {
          const offlineStore = db.createObjectStore("offlineData", { keyPath: "id" })
          offlineStore.createIndex("type", "type", { unique: false })
          offlineStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        // Create sync queue store
        if (!db.objectStoreNames.contains("syncQueue")) {
          const syncStore = db.createObjectStore("syncQueue", { keyPath: "id" })
          syncStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        // Create cache store for critical data
        if (!db.objectStoreNames.contains("criticalCache")) {
          const cacheStore = db.createObjectStore("criticalCache", { keyPath: "key" })
          cacheStore.createIndex("timestamp", "timestamp", { unique: false })
        }
      }
    })
  }

  async saveOfflineData(type: OfflineData["type"], id: string, data: any): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["offlineData"], "readwrite")
    const store = transaction.objectStore("offlineData")

    const offlineData: OfflineData = {
      id: `${type}_${id}`,
      type,
      data,
      timestamp: Date.now(),
      synced: false,
    }

    await new Promise<void>((resolve, reject) => {
      const request = store.put(offlineData)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getOfflineData(type: OfflineData["type"]): Promise<any[]> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["offlineData"], "readonly")
    const store = transaction.objectStore("offlineData")
    const index = store.index("type")

    return new Promise((resolve, reject) => {
      const request = index.getAll(type)
      request.onsuccess = () => {
        const results = request.result.map((item) => item.data)
        resolve(results)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async addToSyncQueue(action: SyncQueue["action"], type: string, data: any): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["syncQueue"], "readwrite")
    const store = transaction.objectStore("syncQueue")

    const syncItem: SyncQueue = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    }

    await new Promise<void>((resolve, reject) => {
      const request = store.add(syncItem)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getSyncQueue(): Promise<SyncQueue[]> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["syncQueue"], "readonly")
    const store = transaction.objectStore("syncQueue")

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async removeSyncItem(id: string): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["syncQueue"], "readwrite")
    const store = transaction.objectStore("syncQueue")

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async cacheCriticalData(key: string, data: any): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["criticalCache"], "readwrite")
    const store = transaction.objectStore("criticalCache")

    const cacheItem = {
      key,
      data,
      timestamp: Date.now(),
    }

    await new Promise<void>((resolve, reject) => {
      const request = store.put(cacheItem)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getCriticalData(key: string): Promise<any> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(["criticalCache"], "readonly")
    const store = transaction.objectStore("criticalCache")

    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.data : null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async clearExpiredCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.init()

    const cutoffTime = Date.now() - maxAge
    const transaction = this.db!.transaction(["criticalCache"], "readwrite")
    const store = transaction.objectStore("criticalCache")
    const index = store.index("timestamp")

    const range = IDBKeyRange.upperBound(cutoffTime)
    const request = index.openCursor(range)

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result
      if (cursor) {
        cursor.delete()
        cursor.continue()
      }
    }
  }
}

export const offlineDB = new OfflineDB()
