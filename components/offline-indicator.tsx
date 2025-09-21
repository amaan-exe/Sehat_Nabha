"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useOffline } from "@/hooks/use-offline"
import { Wifi, WifiOff, RefreshCw, Clock, AlertTriangle } from "lucide-react"

interface OfflineIndicatorProps {
  showDetails?: boolean
}

export function OfflineIndicator({ showDetails = false }: OfflineIndicatorProps) {
  const { isOnline, isSyncing, pendingSyncCount, lastSyncTime, forcSync } = useOffline()

  if (!showDetails) {
    return (
      <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center space-x-1">
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span className="text-xs">{isOnline ? "Online" : "Offline"}</span>
        {isSyncing && <RefreshCw className="h-3 w-3 animate-spin" />}
      </Badge>
    )
  }

  return (
    <Card className={!isOnline ? "border-secondary" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isOnline ? <Wifi className="h-5 w-5 text-primary" /> : <WifiOff className="h-5 w-5 text-secondary" />}
          <span>Connection Status</span>
        </CardTitle>
        <CardDescription>{isOnline ? "Connected to internet" : "Working offline"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Status</span>
          <Badge variant={isOnline ? "default" : "secondary"}>{isOnline ? "Online" : "Offline"}</Badge>
        </div>

        {isSyncing && (
          <div className="flex items-center justify-between">
            <span>Syncing</span>
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">In progress</span>
            </div>
          </div>
        )}

        {pendingSyncCount > 0 && (
          <div className="flex items-center justify-between">
            <span>Pending Sync</span>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{pendingSyncCount} items</span>
            </Badge>
          </div>
        )}

        {lastSyncTime && (
          <div className="flex items-center justify-between">
            <span>Last Sync</span>
            <span className="text-sm text-muted-foreground">{lastSyncTime.toLocaleTimeString()}</span>
          </div>
        )}

        {!isOnline && (
          <div className="p-3 bg-secondary/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Offline Mode</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your data is being saved locally and will sync when connection is restored.
            </p>
          </div>
        )}

        {isOnline && pendingSyncCount > 0 && (
          <Button size="sm" variant="outline" onClick={forcSync} disabled={isSyncing} className="w-full bg-transparent">
            {isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
