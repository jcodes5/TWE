"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect, useCallback, useMemo } from "react"
import { MapPin, Users, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCampaignMapData } from "@/lib/location-coordinates"

type CampaignMapData = {
  id: string
  name: string
  location: string
  coordinates: { x: number; y: number }
  participants: number
  category: string
  status: string
  description: string
}

interface CampaignsMapProps {
  filters?: {
    q?: string
    category?: string
    location?: string
    urgency?: string
    impactLevel?: string
  }
}

export default function CampaignsMap({ filters = {} }: CampaignsMapProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [campaignLocations, setCampaignLocations] = useState<CampaignMapData[]>([])
  const [selectedLocation, setSelectedLocation] = useState<CampaignMapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFiltersKey, setLastFiltersKey] = useState("")

  // Memoize the current filters to create a stable dependency key
  const currentFiltersKey = useMemo(() => {
    const params = {
      q: filters.q || "",
      category: filters.category || "all",
      location: filters.location || "all",
      urgency: filters.urgency || "all",
      impactLevel: filters.impactLevel || "all"
    }
    return Object.values(params).join("|")
  }, [filters.q, filters.category, filters.location, filters.urgency, filters.impactLevel])

  // Debounced load function
  const loadCampaignData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query parameters
      const params = new URLSearchParams()
      if (filters.q) params.set('q', filters.q)
      if (filters.category && filters.category !== 'all') params.set('category', filters.category)
      if (filters.location && filters.location !== 'all') params.set('location', filters.location)
      if (filters.urgency && filters.urgency !== 'all') params.set('urgency', filters.urgency)
      if (filters.impactLevel && filters.impactLevel !== 'all') params.set('impactLevel', filters.impactLevel)
      
      const response = await fetch(`/api/campaigns/map?${params.toString()}`, {
        headers: {
          'Cache-Control': 'max-age=30' // Cache for 30 seconds
        }
      })
      const data = await response.json()
      
      if (response.ok && data.campaigns) {
        setCampaignLocations(data.campaigns)
        
        // Select the first campaign by default
        if (data.campaigns.length > 0) {
          setSelectedLocation(data.campaigns[0])
        }
      } else {
        throw new Error(data.error || 'Failed to load campaigns')
      }
    } catch (err) {
      console.error('Failed to load campaign map data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Load campaigns for the map with debouncing
  useEffect(() => {
    // Only load if filters have actually changed
    if (currentFiltersKey !== lastFiltersKey) {
      setLastFiltersKey(currentFiltersKey)
      
      // Debounce the API call to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        loadCampaignData()
      }, 200) // 200ms debounce
      
      return () => clearTimeout(timeoutId)
    }
  }, [currentFiltersKey, lastFiltersKey, loadCampaignData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-light hover:bg-green-dark'
      case 'COMPLETED':
        return 'bg-blue-100 hover:bg-blue-200'
      default:
        return 'bg-gray-100 hover:bg-gray-200'
    }
  }

  // Loading state
  if (loading) {
    return (
      <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading campaign map...</p>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-light hover:bg-green-dark text-green-dark hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Empty state
  if (campaignLocations.length === 0) {
    return (
      <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-black dark:text-white mb-6">
              Global Impact Map
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              No active campaigns to display at the moment. Check back soon!
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

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
                {campaignLocations.map((location, index) => (
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
                    <span className="font-semibold text-green-dark dark:text-green-light">{campaignLocations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Total Participants</span>
                    <span className="font-semibold text-green-dark dark:text-green-light">
                      {campaignLocations.reduce((sum, loc) => sum + loc.participants, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Countries</span>
                    <span className="font-semibold text-green-dark dark:text-green-light">
                      {new Set(campaignLocations.map(loc => loc.location)).size}+
                    </span>
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
