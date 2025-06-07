"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"

const campaigns = [
  {
    id: 1,
    title: "Ocean Cleanup Initiative",
    description: "Join us in removing plastic waste from our oceans and protecting marine life.",
    image: "/placeholder.svg?height=300&width=400",
    location: "Pacific Coast",
    date: "Ongoing",
    progress: 75,
  },
  {
    id: 2,
    title: "Urban Forest Project",
    description: "Planting trees in urban areas to improve air quality and create green spaces.",
    image: "/placeholder.svg?height=300&width=400",
    location: "Major Cities",
    date: "2024-2025",
    progress: 60,
  },
  {
    id: 3,
    title: "Renewable Energy Advocacy",
    description: "Promoting solar and wind energy adoption in local communities.",
    image: "/placeholder.svg?height=300&width=400",
    location: "Global",
    date: "Year-round",
    progress: 85,
  },
]

export default function Campaigns() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
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
            Discover our ongoing environmental initiatives and join the movement for positive change
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 group">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-green-light text-green-dark px-3 py-1 rounded-full text-sm font-semibold">
                      {campaign.progress}% Complete
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3">{campaign.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{campaign.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {campaign.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {campaign.date}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${campaign.progress}%` } : {}}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                        className="bg-green-light h-2 rounded-full"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-green-light group-hover:text-green-dark group-hover:border-green-light transition-colors duration-300"
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
