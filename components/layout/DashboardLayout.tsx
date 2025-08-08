"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users, DollarSign, Target, TrendingUp, Settings, UserPlus,
  Calendar, BarChart3, Globe, Shield, Mail, FileText
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, Badge } from "@/components/ui/button"

export default function AdminDashboardPage() {
  // State for table data (could be fetched from API)
  const [tableData] = useState([
    { id: 1, name: "Sarah Johnson", role: "volunteer", status: "active", activity: 85, activityLevel: "high", lastActive: "2 hours ago" },
    { id: 2, name: "Mike Chen", role: "admin", status: "active", activity: 65, activityLevel: "medium", lastActive: "4 hours ago" },
    { id: 3, name: "Lisa Park", role: "sponsor", status: "pending", activity: 30, activityLevel: "low", lastActive: "1 day ago" },
    { id: 4, name: "David Wilson", role: "volunteer", status: "inactive", activity: 15, activityLevel: "low", lastActive: "2 days ago" },
  ])
  
  const totalRows = 25
  
  // Team members data
  const teamMembers = [
    { name: "Emma Thompson", role: "admin" },
    { name: "James Anderson", role: "volunteer" },
    { name: "Olivia Martinez", role: "volunteer" },
    { name: "William Brown", role: "sponsor" },
    { name: "Sophia Lee", role: "volunteer" },
    { name: "Daniel Wilson", role: "admin" }
  ]
  
  return (
    <div className="p-6 space-y-6">
      {/* Header with quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Users", value: "2,847", change: "+12%", icon: <Users className="h-6 w-6 text-blue-600" /> },
          { title: "Donations", value: "$127,450", change: "+18%", icon: <DollarSign className="h-6 w-6 text-green-600" /> },
          { title: "Active Campaigns", value: "24", change: "+3", icon: <Target className="h-6 w-6 text-purple-600" /> },
          { title: "Volunteer Hours", value: "8,920", change: "+25%", icon: <TrendingUp className="h-6 w-6 text-orange-600" /> }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{stat.title}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-black dark:text-white">{stat.value}</p>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-3 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.min(parseInt(stat.change), 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main content area with sidebar and charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add navigation links or filters here */}
            </CardContent>
          </Card>
        </div>
        
        {/* Main content and charts */}
        <div className="lg:col-span-3 space-y-6">
          {/* Recent Activities and Approvals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Activities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <Badge variant="outline">Live</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { message: "New volunteer registered: Sarah Johnson", time: "2 hours ago", icon: Calendar },
                  { message: "Large donation received: $5,000", time: "4 hours ago", icon: DollarSign },
                  { message: "Ocean Cleanup campaign reached 90% funding", time: "6 hours ago", icon: Target }
                ].map((act, i) => (
                  <div 
                    key={i} 
                    className="flex gap-3 items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full">
                      <act.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-black dark:text-white font-medium">{act.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{act.time}</p>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Calendar className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">
                  View All Activities
                </Button>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Pending Approvals
                </CardTitle>
                <Badge>{3}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Urban Garden Initiative", type: "Campaign", submitter: "Mike Chen" },
                  { title: "Beach Cleanup Day", type: "Event", submitter: "Lisa Park" },
                  { title: "Team Leader Application", type: "Volunteer", submitter: "David Wilson" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.type} • {item.submitter}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-2">
                  <Shield className="w-4 h-4 mr-2" />
                  View All Requests
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Distribution</CardTitle>
                <Button variant="ghost" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  This Month
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  {/* Simple bar chart visualization */}
                  <div className="absolute bottom-0 left-0 right-0 h-5/6 flex items-end justify-around px-4">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const height = Math.floor(Math.random() * 60) + 40;
                      return (
                        <div 
                          key={i} 
                          className="w-8 bg-blue-500 rounded-t-md group hover:bg-blue-600 transition-colors"
                          style={{ height: `${height}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-0 w-full text-center text-xs">
                            {height}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Y-axis labels */}
                  <div className="absolute top-0 left-0 bottom-0 right-0 flex items-start justify-end pr-4 pointer-events-none">
                    {[0, 25, 50, 75, 100].reverse().map((label) => (
                      <div 
                        key={label} 
                        className="text-xs text-gray-500 dark:text-gray-400 h-1/4 flex items-end"
                      >
                        {label}%
                      </div>
                    ))}
                  </div>
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/6 flex items-center justify-around px-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div 
                        key={day} 
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Performance</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="px-3 py-1 text-xs">
                    Daily
                  </Button>
                  <Button variant="outline" size="sm" className="px-3 py-1 text-xs">
                    Weekly
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative">
                  {/* Line chart visualization */}
                  <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const height = Math.floor(Math.random() * 70);
                      return (
                        <div key={i} className="w-6 flex flex-col items-center">
                          <div 
                            className="w-full bg-purple-500 rounded-t group hover:bg-purple-600 transition-colors"
                            style={{ height: `${height}%` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-0 w-full text-center text-xs">
                              {height}k
                            </div>
                          </div>
                          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{i+1}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Y-axis labels */}
                  <div className="absolute top-0 left-0 bottom-0 right-0 flex items-start justify-end pr-4 pointer-events-none">
                    {[0, 25, 50, 75, 100].reverse().map((label) => (
                      <div 
                        key={label} 
                        className="text-xs text-gray-500 dark:text-gray-400 h-1/5 flex items-end"
                      >
                        {label}k
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Active Users</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span>Sessions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Data Table */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-black dark:text-white">{member.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Right sidebar with quick actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Target className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
              <Button className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent News</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add recent news items here */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-black dark:text-white">New volunteer program launched</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-black dark:text-white">Major donation received</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
