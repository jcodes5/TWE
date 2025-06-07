"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Leaf, Droplets, Sun, Recycle, Globe, Zap } from 'lucide-react'

const categories = [
  { name: "All", icon: <Globe className="h-5 w-5" />, count: 124, color: "from-gray-400 to-gray-600" },
  { name: "Climate Science", icon: <Sun className="h-5 w-5" />, count: 32, color: "from-yellow-400 to-orange-500" },
  { name: "Renewable Energy", icon: <Zap className="h-5 w-5" />, count: 28, color: "from-blue-400 to-cyan-500" },
  { name: "Conservation", icon: <Leaf className="h-5 w-5" />, count: 24, color: "from-green-400 to-green-600" },
  { name: "Water Resources", icon: <Droplets className="h-5 w-5" />, count: 18, color: "from-blue-500 to-teal-500" },
  { name: "Sustainability", icon: <Recycle className="h-5 w-5" />, count: 22, color: "from-purple-400 to-purple-600" },
]

export default function BlogCategories() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeCategory, setActiveCategory] = useState("All")

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-hartone font-bold text-black dark:text-white mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore articles organized by environmental topics and areas of focus.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onClick={() => setActiveCategory(category.name)}
              className={`group relative p-6 rounded-2xl transition-all duration-300 ${
                activeCategory === category.name
                  ? "bg-gradient-to-r from-green-light to-green-dark text-white shadow-lg scale-105"
                  : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div
                  className={`p-3 rounded-xl ${
                    activeCategory === category.name
                      ? "bg-white/20"
                      : `bg-gradient-to-r ${category.color}`
                  } text-white`}
                >
                  {category.icon}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <span className="text-xs opacity-75">{category.count} articles</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
