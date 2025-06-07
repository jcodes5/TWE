"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Filter, MapPin, Target, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const filterOptions = {
  status: ["All", "Active", "Completed", "Upcoming"],
  location: ["Global", "North America", "Europe", "Asia", "Africa", "South America", "Oceania"],
  category: [
    "Climate Action",
    "Conservation",
    "Renewable Energy",
    "Water Resources",
    "Sustainable Agriculture",
    "Urban Planning",
  ],
  impact: ["Local", "Regional", "National", "International"],
}

export default function CampaignsFilter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeFilters, setActiveFilters] = useState({
    status: "All",
    location: "Global",
    category: "Climate Action",
    impact: "International",
  })

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  return (
    <section ref={ref} className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-hartone font-bold text-black dark:text-white mb-4">
            Find Your Campaign
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Filter campaigns by location, category, and impact level to find the perfect opportunity to make a
            difference.
          </p>
        </motion.div>

        <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Status Filter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="flex items-center mb-3">
                <Target className="h-5 w-5 text-green-dark dark:text-green-light mr-2" />
                <h3 className="font-semibold text-black dark:text-white">Status</h3>
              </div>
              <div className="space-y-2">
                {filterOptions.status.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange("status", option)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                      activeFilters.status === option
                        ? "bg-green-light text-green-dark"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Location Filter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center mb-3">
                <MapPin className="h-5 w-5 text-green-dark dark:text-green-light mr-2" />
                <h3 className="font-semibold text-black dark:text-white">Location</h3>
              </div>
              <div className="space-y-2">
                {filterOptions.location.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange("location", option)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                      activeFilters.location === option
                        ? "bg-green-light text-green-dark"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center mb-3">
                <Filter className="h-5 w-5 text-green-dark dark:text-green-light mr-2" />
                <h3 className="font-semibold text-black dark:text-white">Category</h3>
              </div>
              <div className="space-y-2">
                {filterOptions.category.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange("category", option)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                      activeFilters.category === option
                        ? "bg-green-light text-green-dark"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Impact Filter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center mb-3">
                <Users className="h-5 w-5 text-green-dark dark:text-green-light mr-2" />
                <h3 className="font-semibold text-black dark:text-white">Impact Level</h3>
              </div>
              <div className="space-y-2">
                {filterOptions.impact.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange("impact", option)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                      activeFilters.impact === option
                        ? "bg-green-light text-green-dark"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="text-sm text-gray-600 dark:text-gray-300">Showing campaigns matching your filters</div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  setActiveFilters({
                    status: "All",
                    location: "Global",
                    category: "Climate Action",
                    impact: "International",
                  })
                }
              >
                Reset Filters
              </Button>
              <Button className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark">
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </Card>
      </div>
    </section>
  )
}
