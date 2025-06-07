"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { MapPin, Users, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mapLocations = [
  {
    id: 1,
    name: "Ocean Cleanup Initiative",
    location: "Pacific Coast",
    coordinates: { x: 15, y: 45 },
    participants: 1250,
    category: "Conservation",
    status: "Active",
    description: "Removing plastic waste from ocean waters",
  },
  {
    id: 2,
    name: "Amazon Reforestation",
    location: "Brazil",
    coordinates: { x: 35, y: 70 },
    participants: 890,
    category: "Climate Action",
    status: "Active",
    description: "Planting native trees in deforested areas",
  },
  {
    id: 3,
    name: "Solar Energy Project",
    location: "Morocco",
    coordinates: { x: 50, y: 35 },
    participants: 567,
    category: "Renewable Energy",
    status: "Active",
    description: "Installing solar panels in rural communities",
  },
  {
    id: 4,
    name: "Water Conservation",
    location: "India",
    coordinates: { x: 75, y: 40 },
    participants: 1100,
    category: "Water Resources",
    status: "Active",
    description: "Implementing water-saving technologies",
  },
  {
    id: 5,
    name: "Urban Gardens",
    location: "Netherlands",
    coordinates: { x: 52, y: 25 },
    participants: 445,
    category: "Sustainable Agriculture",
    status: "Active",
    description: "Creating green spaces in urban areas",
  },
  {
    id: 6,
    name: "Coral Restoration",
    location: "Australia",
    coordinates: { x: 85, y: 75 },
    participants: 678,
    category: "Conservation",
    status: "Active",
    description: "Restoring damaged coral reef ecosystems",
  },
]

export default function CampaignsMap() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedLocation, setSelectedLocation] = useState<(typeof mapLocations)[0] | null>(null)

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-black dark:text-white mb-6">
            Global Impact Map
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our worldwide network of environmental campaigns and see the global reach of our collective action.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-gradient-to-br from-green-light/10 to-green-dark/10 border-green-light/20">
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-xl overflow-hidden">
                {/* Simplified World Map Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 100 60" className="w-full h-full">
                    {/* Simplified continent shapes */}
                    <path
                      d="M10,20 Q15,15 25,18 Q35,22 40,25 Q45,20 50,22 Q55,25 60,23 Q70,20 75,25 Q80,30 85,28 Q90,25 95,30 L95,45 Q90,50 80,48 Q70,45 60,47 Q50,50 40,48 Q30,45 20,47 Q15,50 10,45 Z"
                      fill="currentColor"
                      className="text-green-dark/30"
                    />
                    <path
                      d="M20,35 Q25,30 35,33 Q45,37 50,35 Q60,32 70,35 Q75,40 80,38 L80,55 Q75,58 65,56 Q55,53 45,55 Q35,58 25,56 Q20,53 20,50 Z"
                      fill="currentColor"
                      className="text-green-dark/30"
                    />
                  </svg>
                </div>

                {/* Campaign Markers */}
                {mapLocations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="absolute cursor-pointer group"
                    style={{
                      left: `${location.coordinates.x}%`,
                      top: `${location.coordinates.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                          selectedLocation?.id === location.id ? "bg-green-dark" : "bg-green-light hover:bg-green-dark"
                        } transition-colors duration-200`}
                      />

                      {/* Pulse Animation */}
                      <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="absolute inset-0 w-4 h-4 bg-green-light rounded-full"
                      />

                      {/* Tooltip */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {location.name}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Legend */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-light rounded-full mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Active Campaigns</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-dark rounded-full mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Selected Campaign</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">Click markers for details</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Campaign Details Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {selectedLocation ? (
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <Badge className="mb-2">{selectedLocation.category}</Badge>
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{selectedLocation.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{selectedLocation.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2 text-green-dark dark:text-green-light" />
                      {selectedLocation.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2 text-green-dark dark:text-green-light" />
                      {selectedLocation.participants.toLocaleString()} participants
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Target className="h-4 w-4 mr-2 text-green-dark dark:text-green-light" />
                      Status: {selectedLocation.status}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full bg-green-light hover:bg-green-dark text-green-dark hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg font-medium">
                      Join This Campaign
                    </button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Select a Campaign</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Click on any marker on the map to view campaign details and learn how you can get involved.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="p-6 bg-gradient-to-br from-green-light/10 to-green-dark/10 border-green-light/20">
              <CardContent className="p-0">
                <h4 className="font-semibold text-black dark:text-white mb-4">Global Impact</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Active Campaigns</span>
                    <span className="font-semibold text-green-dark dark:text-green-light">{mapLocations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Total Participants</span>
                    <span className="font-semibold text-green-dark dark:text-green-light">
                      {mapLocations.reduce((sum, loc) => sum + loc.participants, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Countries</span>
                    <span className="font-semibold text-green-dark dark:text-green-light">25+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
