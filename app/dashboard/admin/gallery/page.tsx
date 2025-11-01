"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ComprehensiveGalleryManager from "@/components/admin/ComprehensiveGalleryManager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Camera, 
  Image as ImageIcon, 
  Upload, 
  Eye,
  Users,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react"

interface GalleryStats {
  total: number
  active: number
  pending: number
  inactive: number
  archived: number
  categories: { name: string; count: number }[]
  recentActivity: { id: string; action: string; image: string; user: string; date: string }[]
}

export default function GalleryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("manage")

  // Mock stats data - in real app, this would come from API
  const stats: GalleryStats = {
    total: 156,
    active: 89,
    pending: 23,
    inactive: 32,
    archived: 12,
    categories: [
      { name: "Events", count: 45 },
      { name: "Campaigns", count: 38 },
      { name: "Team", count: 28 },
      { name: "Community", count: 25 },
      { name: "Projects", count: 15 },
      { name: "Documentation", count: 5 }
    ],
    recentActivity: [
      {
        id: "1",
        action: "uploaded",
        image: "campaign-event-1.jpg",
        user: "John Doe",
        date: "2 minutes ago"
      },
      {
        id: "2",
        action: "edited",
        image: "team-photo.jpg",
        user: "Jane Smith",
        date: "15 minutes ago"
      },
      {
        id: "3",
        action: "deleted",
        image: "old-banner.jpg",
        user: "Mike Johnson",
        date: "1 hour ago"
      }
    ]
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    router.push("/auth/login")
    return null
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "uploaded":
        return <Upload className="w-4 h-4 text-green-500" />
      case "edited":
        return <Settings className="w-4 h-4 text-blue-500" />
      case "deleted":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <ImageIcon className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
              <p className="mt-2 text-gray-600">
                Manage your image gallery with advanced tools and features
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                <Users className="w-4 h-4 mr-1" />
                {session.user?.email}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Camera className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Images</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Archived</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.archived}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manage">
              <Camera className="w-4 h-4 mr-2" />
              Manage Gallery
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Clock className="w-4 h-4 mr-2" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-6">
            <ComprehensiveGalleryManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Categories Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Images by Category</CardTitle>
                  <CardDescription>
                    Distribution of images across different categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.categories.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-3" style={{
                            backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                          }} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(category.count / stats.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upload Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Uploads</CardTitle>
                  <CardDescription>
                    Last 10 uploaded images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Sample Image {i + 1}</p>
                          <p className="text-sm text-gray-600">
                            Uploaded {Math.floor(Math.random() * 24) + 1} hours ago
                          </p>
                        </div>
                        <Badge variant="outline">
                          {['Events', 'Campaigns', 'Team', 'Community'][Math.floor(Math.random() * 4)]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions performed on gallery images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.user} {activity.action} <span className="text-blue-600">{activity.image}</span>
                        </p>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                      <Badge variant={activity.action === 'deleted' ? 'destructive' : 'secondary'}>
                        {activity.action}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
