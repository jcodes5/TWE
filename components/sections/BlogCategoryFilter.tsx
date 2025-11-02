"use client"

import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Globe, 
  Leaf, 
  Droplets, 
  Sun, 
  Recycle, 
  Zap, 
  Search,
  X,
  ArrowUpDown,
  Filter,
  SlidersHorizontal
} from 'lucide-react'
import { useBlogFilter, type BlogPostItem } from '@/hooks/useBlogFilter'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface BlogCategoryFilterProps {
  posts: BlogPostItem[]
  onFilterChange?: (filteredPosts: BlogPostItem[]) => void
  showSearch?: boolean
  showSort?: boolean
  className?: string
  layout?: 'grid' | 'scroll'
}

const categoryIcons: Record<string, React.ReactNode> = {
  "All": <Globe className="h-5 w-5" />,
  "Climate Science": <Sun className="h-5 w-5" />,
  "Renewable Energy": <Zap className="h-5 w-5" />,
  "Conservation": <Leaf className="h-5 w-5" />,
  "Water Resources": <Droplets className="h-5 w-5" />,
  "Sustainability": <Recycle className="h-5 w-5" />,
}

export default function BlogCategoryFilter({ 
  posts, 
  onFilterChange,
  showSearch = true,
  showSort = true,
  className = "",
  layout = "grid"
}: BlogCategoryFilterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const {
    selectedCategory,
    searchQuery,
    sortBy,
    sortOrder,
    setSelectedCategory,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    resetFilters,
    filteredPosts,
    categories,
    categoryCounts,
    hasActiveFilters
  } = useBlogFilter(posts)

  // Notify parent component of filtered results
  React.useEffect(() => {
    onFilterChange?.(filteredPosts)
  }, [filteredPosts, onFilterChange])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, category: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setSelectedCategory(category)
    }
  }

  if (!posts || posts.length === 0) {
    return (
      <section className={`py-20 bg-white dark:bg-gray-900 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Articles Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              There are currently no blog posts to filter.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className={`py-20 bg-white dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore articles organized by environmental topics and areas of focus.
          </p>
        </motion.div>

        {/* Search and Sort Controls */}
        {(showSearch || showSort) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-4 mb-8"
          >
            {/* Search Input */}
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                  aria-label="Search blog articles"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Sort Controls */}
            {showSort && (
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'category')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  aria-label="Sort by"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="category">Sort by Category</option>
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Active Filters and Reset */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center gap-2 mb-8"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {selectedCategory}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setSelectedCategory("All")}
                  aria-label={`Remove ${selectedCategory} filter`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setSearchQuery("")}
                  aria-label="Remove search filter"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          </motion.div>
        )}

        {/* Category Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`
            ${layout === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4' 
              : 'flex gap-4 overflow-x-auto pb-4'
            }
          `}
          role="toolbar"
          aria-label="Blog category filters"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onClick={() => setSelectedCategory(category.name)}
              onKeyDown={(e) => handleKeyDown(e, category.name)}
              className={`
                group relative p-6 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                ${selectedCategory === category.name
                  ? "bg-gradient-to-r from-green-light to-green-dark text-white shadow-lg scale-105"
                  : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-102"
                }
                ${layout === 'scroll' ? 'flex-shrink-0 min-w-[140px]' : ''}
              `}
              role="button"
              aria-pressed={selectedCategory === category.name}
              aria-label={`Filter by ${category.name} category, ${categoryCounts[category.name]} articles`}
              tabIndex={0}
            >
              <div className="flex flex-col items-center space-y-3">
                <div
                  className={`
                    p-3 rounded-xl transition-colors duration-300
                    ${selectedCategory === category.name
                      ? "bg-white/20"
                      : "bg-gradient-to-r text-white"
                    }
                  `}
                  style={{
                    background: selectedCategory === category.name 
                      ? "rgba(255, 255, 255, 0.2)" 
                      : `linear-gradient(to right, var(--tw-gradient-stops))`
                  }}
                >
                  {categoryIcons[category.name] || categoryIcons["All"]}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <span className="text-xs opacity-75">
                    {categoryCounts[category.name]} articles
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8 text-gray-600 dark:text-gray-400"
        >
          Showing <span className="font-semibold text-green-dark">{filteredPosts.length}</span> of{' '}
          <span className="font-semibold">{posts.length}</span> articles
          {selectedCategory !== "All" && (
            <span> in <span className="font-semibold">{selectedCategory}</span></span>
          )}
        </motion.div>
      </div>
    </section>
  )
}