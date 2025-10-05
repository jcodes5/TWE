"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, AlertTriangle, Info } from "lucide-react"

interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  type: "info" | "warning" | "success"
  read: boolean
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New User Registration",
      description: "A new volunteer has registered: John Doe",
      timestamp: "2 minutes ago",
      type: "info",
      read: false
    },
    {
      id: "2",
      title: "Campaign Update Required",
      description: "Climate Action campaign needs your attention",
      timestamp: "1 hour ago",
      type: "warning",
      read: false
    },
    {
      id: "3",
      title: "Donation Received",
      description: "$500 donation received for Reforestation project",
      timestamp: "3 hours ago",
      type: "success",
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Notifications</CardTitle>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="rounded-full">
            {unreadCount}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Recent notifications</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg border ${notification.read ? 'bg-muted/30' : 'bg-background'} space-y-2`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium leading-none">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
                    {!notification.read && (
                      <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}