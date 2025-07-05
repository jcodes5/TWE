
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "admin" | "volunteer" | "sponsor"
  userName: string
}

const navigationItems = {
  admin: [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
    { icon: Users, label: "User Management", href: "/dashboard/admin/users" },
    { icon: Heart, label: "Campaigns", href: "/dashboard/admin/campaigns" },
    { icon: Settings, label: "Settings", href: "/dashboard/admin/settings" }
  ],
  volunteer: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/volunteer" },
    { icon: Heart, label: "Opportunities", href: "/dashboard/volunteer/opportunities" },
    { icon: Users, label: "Community", href: "/dashboard/volunteer/community" },
    { icon: Settings, label: "Profile", href: "/dashboard/volunteer/profile" }
  ],
  sponsor: [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard/sponsor" },
    { icon: Heart, label: "My Projects", href: "/dashboard/sponsor/projects" },
    { icon: Users, label: "Impact Reports", href: "/dashboard/sponsor/reports" },
    { icon: Settings, label: "Account", href: "/dashboard/sponsor/account" }
  ]
}

export default function DashboardLayout({ children, userType, userName }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const navItems = navigationItems[userType]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 w-70 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TW</span>
              </div>
              <span className="font-hartone font-bold text-lg text-black dark:text-white">
                TW&E
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-light to-green-dark rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {userName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-semibold text-black dark:text-white">{userName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {userType}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-light text-green-dark'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:ml-70">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
              
              <div className="w-8 h-8 bg-gradient-to-r from-green-light to-green-dark rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {userName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
