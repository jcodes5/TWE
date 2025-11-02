"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Leaf, Droplets, Sun, Recycle, Globe, Zap, AlertCircle, Loader2 } from 'lucide-react'
import { FALLBACK_CATEGORIES, getCategoryMetadata } from '@/lib/categories'

interface CategoryData {
  name: string
  icon: string
  count: number
  color: string
}

export default function BlogCategories() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeCategory, setActiveCategory] = useState("All")
  const [categories, setCategories] = useState<CategoryData[]>(FALLBACK_CATEGORIES.map(cat => ({
    name: cat.name,
    icon: cat.icon === Globe ? 'Globe' : cat.icon === Sun ? 'Sun' : cat.icon === Zap ? 'Zap' : cat.icon === Leaf ? 'Leaf' : cat.icon === Droplets ? 'Droplets' : 'Recycle',
    count: cat.count || 0,
    color: cat.color
  })))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const response = await fetch('/api/categories/blog')
        if (!response.ok) throw new Error('Failed to fetch categories')
        
        const data = await response.json()
        const fetchedCategories = data.categories.map((cat: any) => ({
          name: cat.name,
          icon: cat.icon,
          count: cat.count,
          color: cat.color
        }))
        
        setCategories(fetchedCategories)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError('Failed to load categories')
        // Keep fallback categories
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Get icon component based on icon name
  const getIcon = (iconName: string) => {
    const iconProps = { className: "h-5 w-5" }
    
    switch (iconName) {
      case 'Sun': return <Sun {...iconProps} />
      case 'Zap': return <Zap {...iconProps} />
      case 'Leaf': return <Leaf {...iconProps} />
      case 'Droplets': return <Droplets {...iconProps} />
      case 'Recycle': return <Recycle {...iconProps} />
      default: return <Globe {...iconProps} />
    }
  }

  // Handle loading state
  if (loading) {
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
          
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-green-dark" />
            <span className="ml-2 text-lg text-gray-600 dark:text-gray-300">Loading categories...</span>
          </div>
        </div>
      </section>
    )
  }

  // Handle error state
  if (error) {
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
          
          <div className="flex items-center justify-center py-16">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <span className="ml-2 text-lg text-gray-600 dark:text-gray-300">Error loading categories</span>
          </div>
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
                  {getIcon(category.icon)}
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
