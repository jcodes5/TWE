"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users, DollarSign, Target, TrendingUp, Settings, UserPlus,
  Calendar, BarChart3, Globe, Shield, Mail, FileText
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { JWTPayload } from "@/lib/auth"
import DashboardLayout from "@/components/layout/DashboardLayout"

const adminStats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Active Campaigns",
    value: "24",
    change: "+3",
    icon: Target,
    color: "text-green-600"
  },
  {
    title: "Total Donations",
    value: "$127,450",
    change: "+18%",
    icon: DollarSign,
    color: "text-purple-600"
  },
  {
    title: "Volunteer Hours",
    value: "8,920",
    change: "+25%",
    icon: TrendingUp,
    color: "text-orange-600"
  }
]

const recentActivities = [
  { message: "New volunteer registered: Sarah Johnson", time: "2 hours ago" },
  { message: "Large donation received: $5,000", time: "4 hours ago" },
  { message: "Ocean Cleanup campaign reached 90% funding", time: "6 hours ago" },
  { message: "Monthly volunteer meeting scheduled", time: "1 day ago" },
  { message: "System maintenance completed", time: "2 days ago" }
]

const pendingApprovals = [
  { id: 1, title: "Urban Garden Initiative", submitter: "Mike Chen", type: "Campaign" },
  { id: 2, title: "Beach Cleanup Day", submitter: "Lisa Park", type: "Event" },
  { id: 3, title: "Team Leader Application", submitter: "David Wilson", type: "Volunteer" }
]

export default function AdminDashboard({ user }: { user: JWTPayload }) {
  const [tab, setTab] = useState("overview")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-hartone font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.email || "Admin"}
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* === Overview Tab === */}
          <TabsContent value="overview" className="space-y-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {adminStats.map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-5 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-green-500">{stat.change} from last month</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <p className="text-sm text-gray-800 dark:text-gray-100">{activity.message}</p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Pending Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          by {item.submitter} • {item.type}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <Button size="sm" variant="outline">Reject</Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* === Users Tab === */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard label="Volunteers" value="1,847" icon={Users} color="text-blue-600" />
                  <StatCard label="Sponsors" value="892" icon={DollarSign} color="text-green-600" />
                  <StatCard label="Admins" value="12" icon={Shield} color="text-purple-600" />
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <Button className="bg-green-dark hover:bg-green-light text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === Campaigns Tab === */}
          <TabsContent value="campaigns">
            <StatGrid
              title="Campaign Overview"
              stats={[
                { label: "Active", value: "24", icon: Target, color: "text-green-600" },
                { label: "Planned", value: "8", icon: Calendar, color: "text-blue-600" },
                { label: "Completed", value: "156", icon: BarChart3, color: "text-purple-600" },
                { label: "Countries", value: "42", icon: Globe, color: "text-orange-600" },
              ]}
            />
            <Button className="mt-4 bg-green-dark text-white">
              <Target className="w-4 h-4 mr-2" />
              Create New Campaign
            </Button>
          </TabsContent>

          {/* === Finances Tab === */}
          <TabsContent value="finances">
            <StatGrid
              title="Financial Overview"
              stats={[
                { label: "Total Donations", value: "$127,450", icon: DollarSign, color: "text-green-600" },
                { label: "Expenses", value: "$89,230", icon: TrendingUp, color: "text-red-600" },
                { label: "Net Impact", value: "$38,220", icon: BarChart3, color: "text-blue-600" },
              ]}
            />
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button className="bg-green-dark text-white">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send to Board
              </Button>
            </div>
          </TabsContent>

          {/* === Reports Tab === */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Available Reports</h3>
                  {["Monthly Impact", "Volunteer Engagement", "Financial Summary", "Campaign Performance"].map((label, i) => (
                    <Button key={i} variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {label} Report
                    </Button>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Quick Stats</h3>
                  <StatItem label="New users this month" value="+234" />
                  <StatItem label="Campaigns launched" value="8" />
                  <StatItem label="Goals achieved" value="15" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

// Utility Components
function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="text-center">
      <CardContent className="p-4">
        <Icon className={`mx-auto h-8 w-8 ${color} mb-2`} />
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
      </CardContent>
    </Card>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
      <span className="text-sm">{label}</span>
      <Badge>{value}</Badge>
    </div>
  )
}

function StatGrid({ title, stats }: { title: string; stats: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <StatCard key={i} label={label} value={value} icon={Icon} color={color} />
        ))}
      </CardContent>
    </Card>
  )
}
