"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, MapPin, Calendar, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export type CampaignItem = {
  id: string
  title: string
  description: string
  image: string | null
  location: string
  category: string
  startDate?: string | null
  endDate?: string | null
  goal: number
  raised: number
  status: string
}

export default function CampaignsGridClient({ campaigns }: { campaigns: CampaignItem[] }) {
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
          <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6">
            Active Campaigns
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join campaigns making a real difference around the world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {campaigns.map((c, index) => {
            const progress = c.goal > 0 ? Math.min(100, Math.round((c.raised / c.goal) * 100)) : 0
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 group">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={c.image || "/placeholder.svg"}
                        alt={c.title}
                        width={500}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-green-light text-green-dark">{c.category}</Badge>
                        <Badge variant="outline" className="border-green-dark text-green-dark dark:border-green-light dark:text-green-light">
                          {c.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-2 line-clamp-2">
                      {c.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">{c.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {c.location}
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        ${""}{c.raised.toLocaleString()} / ${""}{c.goal.toLocaleString()}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-light to-green-dark h-3 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex justify-end">
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
