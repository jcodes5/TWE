
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Settings, 
  UserPlus, 
  Calendar,
  BarChart3,
  Globe,
  Shield,
  Mail,
  FileText
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const adminStats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12%",
    icon: <Users className="h-8 w-8" />,
    color: "text-blue-600"
  },
  {
    title: "Active Campaigns",
    value: "24",
    change: "+3",
    icon: <Target className="h-8 w-8" />,
    color: "text-green-600"
  },
  {
    title: "Total Donations",
    value: "$127,450",
    change: "+18%",
    icon: <DollarSign className="h-8 w-8" />,
    color: "text-purple-600"
  },
  {
    title: "Volunteer Hours",
    value: "8,920",
    change: "+25%",
    icon: <TrendingUp className="h-8 w-8" />,
    color: "text-orange-600"
  }
]

const recentActivities = [
  { type: "user", message: "New volunteer registered: Sarah Johnson", time: "2 hours ago" },
  { type: "donation", message: "Large donation received: $5,000", time: "4 hours ago" },
  { type: "campaign", message: "Ocean Cleanup campaign reached 90% funding", time: "6 hours ago" },
  { type: "event", message: "Monthly volunteer meeting scheduled", time: "1 day ago" },
  { type: "alert", message: "System maintenance completed", time: "2 days ago" }
]

const pendingApprovals = [
  { id: 1, type: "Campaign", title: "Urban Garden Initiative", submitter: "Mike Chen", status: "pending" },
  { id: 2, type: "Event", title: "Beach Cleanup Day", submitter: "Lisa Park", status: "pending" },
  { id: 3, type: "Volunteer", title: "Team Leader Application", submitter: "David Wilson", status: "pending" }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-hartone font-bold text-black dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage your organization's operations and growth
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="finances">Finances</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {stat.title}
                            </p>
                            <p className="text-2xl font-bold text-black dark:text-white">
                              {stat.value}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              {stat.change} from last month
                            </p>
                          </div>
                          <div className={stat.color}>
                            {stat.icon}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium text-black dark:text-white">
                              {activity.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Approvals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Pending Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingApprovals.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-black dark:text-white">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              by {item.submitter} • {item.type}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Reject</Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Approve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage volunteers, sponsors, and admin users
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-blue-50 dark:bg-blue-900/20">
                      <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">1,847</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Volunteers</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 dark:bg-green-900/20">
                      <CardContent className="p-4 text-center">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">892</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Sponsors</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 dark:bg-purple-900/20">
                      <CardContent className="p-4 text-center">
                        <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">12</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Admins</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New User
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Management</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Monitor and manage all environmental campaigns
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-green-50 dark:bg-green-900/20">
                      <CardContent className="p-4 text-center">
                        <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">24</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Active</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 dark:bg-blue-900/20">
                      <CardContent className="p-4 text-center">
                        <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">8</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Planned</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 dark:bg-purple-900/20">
                      <CardContent className="p-4 text-center">
                        <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">156</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-orange-50 dark:bg-orange-900/20">
                      <CardContent className="p-4 text-center">
                        <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-orange-600">42</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Countries</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Button className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark">
                    <Target className="h-4 w-4 mr-2" />
                    Create New Campaign
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finances" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Track donations, expenses, and financial health
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-green-50 dark:bg-green-900/20">
                      <CardContent className="p-4 text-center">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">$127,450</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Donations</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50 dark:bg-red-900/20">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-600">$89,230</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Expenses</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 dark:bg-blue-900/20">
                      <CardContent className="p-4 text-center">
                        <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">$38,220</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Net Impact</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex space-x-3">
                    <Button className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Send to Board
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reports & Analytics</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Generate comprehensive reports and insights
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-black dark:text-white">Available Reports</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Monthly Impact Report
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Volunteer Engagement Report
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Financial Summary Report
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Target className="h-4 w-4 mr-2" />
                          Campaign Performance Report
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-black dark:text-white">Quick Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium">New users this month</span>
                          <Badge>+234</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium">Campaigns launched</span>
                          <Badge>8</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium">Goals achieved</span>
                          <Badge>15</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
