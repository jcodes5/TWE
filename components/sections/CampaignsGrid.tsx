"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, MapPin, Calendar, Users, Target, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const campaigns = [
  {
    id: 1,
    title: "Ocean Cleanup Initiative",
    description: "Join us in removing plastic waste from our oceans and protecting marine life for future generations.",
    image: "/placeholder.svg?height=300&width=400",
    location: "Pacific Coast",
    startDate: "Jan 15, 2025",
    endDate: "Dec 31, 2025",
    progress: 75,
    participants: 1250,
    goal: "Remove 100,000 lbs of plastic",
    category: "Conservation",
    status: "Active",
    urgency: "High",
    impact: "International",
    likes: 324,
    featured: true,
  },
  {
    id: 2,
    title: "Urban Forest Project",
    description: "Planting trees in urban areas to improve air quality and create green spaces for communities.",
    image: "/placeholder.svg?height=300&width=400",
    location: "Major Cities",
    startDate: "Mar 1, 2025",
    endDate: "Nov 30, 2025",
    progress: 60,
    participants: 890,
    goal: "Plant 50,000 trees",
    category: "Climate Action",
    status: "Active",
    urgency: "Medium",
    impact: "National",
    likes: 256,
    featured: false,
  },
  {
    id: 3,
    title: "Renewable Energy Advocacy",
    description: "Promoting solar and wind energy adoption in local communities through education and policy.",
    image: "/placeholder.svg?height=300&width=400",
    location: "Global",
    startDate: "Ongoing",
    endDate: "Ongoing",
    progress: 85,
    participants: 2100,
    goal: "100 communities transitioned",
    category: "Renewable Energy",
    status: "Active",
    urgency: "High",
    impact: "International",
    likes: 412,
    featured: false,
  },
  {
    id: 4,
    title: "Sustainable Agriculture Initiative",
    description: "Supporting farmers in adopting sustainable practices that protect soil and increase yields.",
    image: "/placeholder.svg?height=300&width=400",
    location: "Rural Communities",
    startDate: "Apr 1, 2025",
    endDate: "Sep 30, 2025",
    progress: 40,
    participants: 567,
    goal: "Train 1,000 farmers",
    category: "Sustainable Agriculture",
    status: "Active",
    urgency: "Medium",
    impact: "Regional",
    likes: 189,
    featured: false,
  },
  {
    id: 5,
    title: "Water Conservation Program",
    description: "Implementing water-saving technologies and practices in drought-affected regions.",
    image: "/placeholder.svg?height=300&width=400",
    location: "Southwest USA",
    startDate: "Feb 15, 2025",
    endDate: "Aug 15, 2025",
    progress: 30,
    participants: 445,
    goal: "Save 1M gallons daily",
    category: "Water Resources",
    status: "Active",
    urgency: "High",
    impact: "Regional",
    likes: 298,
    featured: false,
  },
  {
    id: 6,
    title: "Climate Education Outreach",
    description: "Bringing climate science education to schools and communities worldwide.",
    image: "/placeholder.svg?height=300&width=400",
    location: "Global",
    startDate: "Jan 1, 2025",
    endDate: "Dec 31, 2025",
    progress: 55,
    participants: 1800,
    goal: "Reach 100,000 students",
    category: "Education",
    status: "Active",
    urgency: "Medium",
    impact: "International",
    likes: 367,
    featured: false,
  },
]

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export default function CampaignsGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-black dark:text-white mb-6">
            Active Campaigns
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of environmental advocates in campaigns that are making a real difference around the world.
          </p>
        </motion.div>

        {/* Featured Campaign */}
        {campaigns.filter((campaign) => campaign.featured)[0] && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-500 group">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={campaigns.filter((campaign) => campaign.featured)[0].image || "/placeholder.svg"}
                    alt={campaigns.filter((campaign) => campaign.featured)[0].title}
                    width={400}
                    height={300}
                    className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-green-light text-green-dark">Featured</Badge>
                    <Badge className={getUrgencyColor(campaigns.filter((campaign) => campaign.featured)[0].urgency)}>
                      {campaigns.filter((campaign) => campaign.featured)[0].urgency} Priority
                    </Badge>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <Badge
                      variant="outline"
                      className="text-green-dark dark:text-green-light border-green-dark dark:border-green-light"
                    >
                      {campaigns.filter((campaign) => campaign.featured)[0].category}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-hartone font-bold text-black dark:text-white mb-4 group-hover:text-green-dark dark:group-hover:text-green-light transition-colors duration-300">
                    {campaigns.filter((campaign) => campaign.featured)[0].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {campaigns.filter((campaign) => campaign.featured)[0].description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {campaigns.filter((campaign) => campaign.featured)[0].location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      {campaigns.filter((campaign) => campaign.featured)[0].participants.toLocaleString()} participants
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Target className="h-4 w-4 mr-2" />
                      {campaigns.filter((campaign) => campaign.featured)[0].goal}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {campaigns.filter((campaign) => campaign.featured)[0].startDate}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span>Progress</span>
                      <span>{campaigns.filter((campaign) => campaign.featured)[0].progress}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={
                          isInView ? { width: `${campaigns.filter((campaign) => campaign.featured)[0].progress}%` } : {}
                        }
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="bg-gradient-to-r from-green-light to-green-dark h-3 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {campaigns.filter((campaign) => campaign.featured)[0].likes}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 dark:text-gray-400 hover:text-green-dark dark:hover:text-green-light"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark transition-all duration-300">
                      Join Campaign
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Regular Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {campaigns
            .filter((campaign) => !campaign.featured)
            .map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={campaign.image || "/placeholder.svg"}
                        alt={campaign.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                          {campaign.category}
                        </Badge>
                        <Badge className={getUrgencyColor(campaign.urgency)}>{campaign.urgency}</Badge>
                      </div>
                      <div className="absolute top-4 right-4 bg-green-light text-green-dark px-3 py-1 rounded-full text-sm font-semibold">
                        {campaign.progress}% Complete
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-3 group-hover:text-green-dark dark:group-hover:text-green-light transition-colors duration-300">
                      {campaign.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                      {campaign.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {campaign.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {campaign.participants.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Target className="h-4 w-4 mr-1" />
                        {campaign.goal}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${campaign.progress}%` } : {}}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="bg-green-light h-2 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {campaign.likes}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 dark:text-gray-400 hover:text-green-dark dark:hover:text-green-light p-1"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {campaign.impact}
                      </Badge>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <Button
                      className="w-full group-hover:bg-green-light group-hover:text-green-dark group-hover:border-green-light transition-colors duration-300"
                      variant="outline"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark transition-all duration-300 px-8 py-4"
          >
            View All Campaigns
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
