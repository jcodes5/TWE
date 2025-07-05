"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Users, Trophy, Star, Plus, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/DashboardLayout"

const upcomingEvents = [
  {
    id: 1,
    title: "Beach Cleanup Drive",
    date: "March 15, 2024",
    time: "9:00 AM - 2:00 PM",
    location: "Santa Monica Beach",
    participants: 45,
    maxParticipants: 60,
    type: "Conservation",
    status: "registered"
  },
  {
    id: 2,
    title: "Urban Garden Workshop",
    date: "March 20, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Community Center",
    participants: 28,
    maxParticipants: 30,
    type: "Education",
    status: "available"
  },
  {
    id: 3,
    title: "Tree Planting Initiative",
    date: "March 25, 2024",
    time: "8:00 AM - 12:00 PM",
    location: "Central Park",
    participants: 67,
    maxParticipants: 80,
    type: "Climate Action",
    status: "available"
  }
]

const achievements = [
  { title: "Eco Warrior", description: "Completed 20+ environmental projects", earned: true },
  { title: "Team Player", description: "Collaborated in 15+ team activities", earned: true },
  { title: "Time Champion", description: "Contributed 100+ volunteer hours", earned: true },
  { title: "Impact Leader", description: "Reached 2000 impact points", earned: false, progress: 92 },
  { title: "Mentor", description: "Guided 10+ new volunteers", earned: false, progress: 60 }
]

const volunteerStats = {
  totalHours: 156,
  projectsCompleted: 23,
  impactPoints: 1840,
  rank: "Silver Advocate"
}

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardLayout userType="volunteer" userName="Jane Doe">
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Volunteer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Ready to make an impact today?</p>
          </div>
          <Button className="w-full sm:w-auto bg-green-dark hover:bg-green-dark/90 text-white dark:bg-green-light dark:text-green-dark dark:hover:bg-green-light/90">
            <Plus className="h-4 w-4 mr-2" />
            Join New Project
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{volunteerStats.totalHours}</div>
              <p className="text-xs text-muted-foreground">+12 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projects Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{volunteerStats.projectsCompleted}</div>
              <p className="text-xs text-muted-foreground">+3 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Impact Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{volunteerStats.impactPoints}</div>
              <p className="text-xs text-muted-foreground">+250 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{volunteerStats.rank}</div>
              <p className="text-xs text-muted-foreground">160 points to Gold</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>Your next volunteering opportunities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-card">
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                        </div>
                      </div>
                      <Badge variant={event.status === "registered" ? "default" : "secondary"}>
                        {event.status === "registered" ? "Registered" : "Available"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                  <CardDescription>Your latest accomplishments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.slice(0, 3).map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                      <div className={`p-2 rounded-full ${achievement.earned ? 'bg-green-light/20 text-green-dark dark:bg-green-dark/20 dark:text-green-light' : 'bg-muted text-muted-foreground'}`}>
                        <Star className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">{achievement.description}</p>
                        {!achievement.earned && achievement.progress && (
                          <Progress value={achievement.progress} className="mt-2 h-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>All Events</CardTitle>
                    <CardDescription>Find and join environmental events</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{event.participants}/{event.maxParticipants} participants</span>
                            <Progress value={(event.participants / event.maxParticipants) * 100} className="w-20 h-2" />
                          </div>
                        </div>
                        <Button 
                          variant={event.status === "registered" ? "outline" : "default"}
                          className={event.status !== "registered" ? "bg-green-dark hover:bg-green-dark/90 text-white dark:bg-green-light dark:text-green-dark dark:hover:bg-green-light/90" : ""}
                        >
                          {event.status === "registered" ? "Registered" : "Join Event"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>Track your progress and unlock new badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-full ${achievement.earned ? 'bg-green-light/20 text-green-dark dark:bg-green-dark/20 dark:text-green-light' : 'bg-muted text-muted-foreground'}`}>
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{achievement.title}</h3>
                            {achievement.earned && (
                              <Badge variant="default" className="bg-green-light/20 text-green-dark dark:bg-green-dark/20 dark:text-green-light">
                                Earned
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {!achievement.earned && achievement.progress && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <Progress value={achievement.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}