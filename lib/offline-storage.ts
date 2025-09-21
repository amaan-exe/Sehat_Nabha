// Offline-first data management for rural connectivity
interface OfflineData {
  id: string
  type: "health-record" | "prescription" | "appointment" | "medicine-stock"
  data: any
  timestamp: number
  synced: boolean
  userId: string
}

class OfflineStorage {
  private dbName = "sehat-nabha-offline"
  private version = 1
  private db: IDBDatabase | null = null

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

        // Create object stores for different data types
        if (!db.objectStoreNames.contains("health-records")) {
          const healthStore = db.createObjectStore("health-records", { keyPath: "id" })
          healthStore.createIndex("userId", "userId", { unique: false })
          healthStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        if (!db.objectStoreNames.contains("prescriptions")) {
          const prescStore = db.createObjectStore("prescriptions", { keyPath: "id" })
          prescStore.createIndex("userId", "userId", { unique: false })
        }

        if (!db.objectStoreNames.contains("appointments")) {
          const apptStore = db.createObjectStore("appointments", { keyPath: "id" })
          apptStore.createIndex("userId", "userId", { unique: false })
        }

        if (!db.objectStoreNames.contains("sync-queue")) {
          db.createObjectStore("sync-queue", { keyPath: "id" })
        }
      }
    })
  }

  async store(type: OfflineData["type"], data: any, userId: string): Promise<string> {
    if (!this.db) await this.init()

    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const record: OfflineData = {
      id,
      type,
      data,
      timestamp: Date.now(),
      synced: false,
      userId,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [type === "health-record" ? "health-records" : type === "prescription" ? "prescriptions" : "appointments"],
        "readwrite",
      )
      const store = transaction.objectStore(
        type === "health-record" ? "health-records" : type === "prescription" ? "prescriptions" : "appointments",
      )

      const request = store.add(record)
      request.onsuccess = () => resolve(id)
      request.onerror = () => reject(request.error)
    })
  }

  async getUserData(userId: string, type?: OfflineData["type"]): Promise<OfflineData[]> {
    if (!this.db) await this.init()

    const stores = type
      ? [type === "health-record" ? "health-records" : type === "prescription" ? "prescriptions" : "appointments"]
      : ["health-records", "prescriptions", "appointments"]

    const results: OfflineData[] = []

    for (const storeName of stores) {
      const data = await new Promise<OfflineData[]>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], "readonly")
        const store = transaction.objectStore(storeName)
        const index = store.index("userId")
        const request = index.getAll(userId)

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      results.push(...data)
    }

    return results.sort((a, b) => b.timestamp - a.timestamp)
  }

  async syncWhenOnline(): Promise<void> {
    // This would sync with the server when connection is available
    console.log("[v0] Syncing offline data with server...")
    // Implementation would depend on your backend API
  }
}

export const offlineStorage = new OfflineStorage()
