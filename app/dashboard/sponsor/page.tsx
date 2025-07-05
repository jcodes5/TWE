
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Heart, 
  Calendar, 
  BarChart3,
  Award,
  Users,
  Globe,
  Download,
  Eye,
  CreditCard,
  FileText,
  Settings
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const sponsorStats = [
  {
    title: "Total Donated",
    value: "$12,450",
    change: "+$850 this month",
    icon: <DollarSign className="h-8 w-8" />,
    color: "text-green-600"
  },
  {
    title: "Projects Funded",
    value: "18",
    change: "+3 this quarter",
    icon: <Target className="h-8 w-8" />,
    color: "text-blue-600"
  },
  {
    title: "Impact Score",
    value: "9.2/10",
    change: "+0.3 improvement",
    icon: <TrendingUp className="h-8 w-8" />,
    color: "text-purple-600"
  },
  {
    title: "People Helped",
    value: "2,847",
    change: "+567 this month",
    icon: <Users className="h-8 w-8" />,
    color: "text-orange-600"
  }
]

const fundedProjects = [
  {
    id: 1,
    title: "Ocean Cleanup Initiative",
    donated: 2500,
    goal: 10000,
    progress: 78,
    category: "Conservation",
    status: "Active",
    impact: "Removed 15,000 lbs of plastic waste",
    location: "Pacific Coast"
  },
  {
    id: 2,
    title: "Amazon Reforestation",
    donated: 1800,
    goal: 5000,
    progress: 92,
    category: "Climate Action", 
    status: "Near Complete",
    impact: "Planted 8,500 trees",
    location: "Brazil"
  },
  {
    id: 3,
    title: "Solar Energy Project",
    donated: 3200,
    goal: 8000,
    progress: 45,
    category: "Renewable Energy",
    status: "Active",
    impact: "Powered 150 homes",
    location: "Morocco"
  }
]

const donationHistory = [
  { date: "March 1, 2024", amount: 500, project: "Ocean Cleanup Initiative", method: "Credit Card" },
  { date: "February 15, 2024", amount: 250, project: "Urban Gardens", method: "Bank Transfer" },
  { date: "February 1, 2024", amount: 1000, project: "Amazon Reforestation", method: "Credit Card" },
  { date: "January 20, 2024", amount: 300, project: "Solar Energy Project", method: "PayPal" },
  { date: "January 5, 2024", amount: 750, project: "Water Conservation", method: "Credit Card" }
]

const impactReports = [
  {
    title: "Q1 2024 Impact Report",
    date: "March 2024",
    projects: 8,
    totalFunded: "$4,250",
    beneficiaries: 1247
  },
  {
    title: "Q4 2023 Impact Report", 
    date: "December 2023",
    projects: 6,
    totalFunded: "$3,800",
    beneficiaries: 892
  },
  {
    title: "Q3 2023 Impact Report",
    date: "September 2023", 
    projects: 4,
    totalFunded: "$2,900",
    beneficiaries: 634
  }
]

const suggestedProjects = [
  {
    title: "Coral Restoration Program",
    goal: 15000,
    raised: 8500,
    category: "Conservation",
    urgency: "High",
    location: "Australia"
  },
  {
    title: "Clean Water Initiative",
    goal: 12000,
    raised: 4200,
    category: "Water Resources",
    urgency: "Medium",
    location: "Kenya"
  },
  {
    title: "Plastic Recycling Hub",
    goal: 8000,
    raised: 2100,
    category: "Waste Management",
    urgency: "High",
    location: "Philippines"
  }
]

export default function SponsorDashboard() {
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
                Sponsor Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Thank you for your continued support, Alex! Your impact is making a difference.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark">
                <Heart className="h-4 w-4 mr-2" />
                Make Donation
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="impact">Impact Reports</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sponsorStats.map((stat, index) => (
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
                              {stat.change}
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
                {/* Recent Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Recently Funded Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {fundedProjects.slice(0, 3).map((project) => (
                        <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-black dark:text-white">
                              {project.title}
                            </h3>
                            <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Your contribution: ${project.donated.toLocaleString()}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>${(project.goal * project.progress / 100).toLocaleString()} / ${project.goal.toLocaleString()}</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                            Impact: {project.impact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Donation Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Donation Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">$12,450</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Total Donated</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">$850</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">This Month</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black dark:text-white mb-3">Donation Categories</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Conservation</span>
                            <span className="text-sm font-medium">$4,200 (34%)</span>
                          </div>
                          <Progress value={34} className="h-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Climate Action</span>
                            <span className="text-sm font-medium">$3,800 (31%)</span>
                          </div>
                          <Progress value={31} className="h-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Renewable Energy</span>
                            <span className="text-sm font-medium">$4,450 (35%)</span>
                          </div>
                          <Progress value={35} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recognition Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Your Impact Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Award className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                      <p className="font-semibold text-black dark:text-white">Platinum Supporter</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">$10,000+ contributed</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Globe className="h-12 w-12 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold text-black dark:text-white">Global Impact</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Projects in 8 countries</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <p className="font-semibold text-black dark:text-white">Community Champion</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">2+ years of support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Funded Projects</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Track the progress and impact of projects you've supported
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {fundedProjects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-black dark:text-white">
                              {project.title}
                            </h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline">{project.category}</Badge>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                📍 {project.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ${project.donated.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Your contribution</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Funding Progress</span>
                            <span className="text-sm text-gray-600">
                              ${(project.goal * project.progress / 100).toLocaleString()} / ${project.goal.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={project.progress} className="h-3" />
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="text-sm font-medium text-black dark:text-white mb-1">
                            Current Impact:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {project.impact}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark">
                              <Heart className="h-4 w-4 mr-2" />
                              Add Donation
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donations" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Donation History</CardTitle>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donationHistory.map((donation, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-black dark:text-white">
                              {donation.project}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {donation.date} • {donation.method}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${donation.amount}
                          </p>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Receipt
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-black dark:text-white">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Expires 12/26</p>
                          </div>
                        </div>
                        <Badge>Primary</Badge>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 border-dashed border-gray-300">
                      <div className="text-center">
                        <Button variant="outline" className="w-full">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Add Payment Method
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Impact Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {impactReports.map((report, index) => (
                      <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-black dark:text-white">
                              {report.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">{report.date}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{report.projects}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Projects</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{report.totalFunded}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Funded</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">{report.beneficiaries.toLocaleString()}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Beneficiaries</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discover" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Projects</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Discover new projects that match your interests and impact goals
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {suggestedProjects.map((project, index) => (
                      <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-black dark:text-white">
                              {project.title}
                            </h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline">{project.category}</Badge>
                              <Badge variant={project.urgency === 'High' ? 'destructive' : 'secondary'}>
                                {project.urgency} Priority
                              </Badge>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                📍 {project.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Funding Progress</span>
                            <span className="text-sm text-gray-600">
                              ${project.raised.toLocaleString()} / ${project.goal.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={(project.raised / project.goal) * 100} className="h-3" />
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            ${(project.goal - project.raised).toLocaleString()} needed to reach goal
                          </p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Learn More
                            </Button>
                            <Button size="sm" className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark">
                              <Heart className="h-4 w-4 mr-2" />
                              Support Project
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
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
