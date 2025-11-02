"use client"

import React, { useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { 
  ArrowRight, 
  Calendar, 
  User, 
  Loader2, 
  AlertCircle, 
  Grid3X3,
  List,
  RefreshCw,
  Search,
  Filter,
  BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useBlogFilter, type BlogPostItem } from '@/hooks/useBlogFilter'
import Image from "next/image"
import Link from "next/link"

interface BlogGridClientProps {
  posts: BlogPostItem[]
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  onFilterChange?: (filteredPosts: BlogPostItem[]) => void
  showFilters?: boolean
  showSearch?: boolean
  layout?: 'grid' | 'list' | 'masonry'
  loading?: boolean
  error?: string | null
  className?: string
  postsPerPage?: number
  enablePagination?: boolean
}

export default function BlogGridClient({ 
  posts, 
  selectedCategory,
  onCategoryChange,
  onFilterChange,
  showFilters = false,
  showSearch = false,
  layout = 'grid',
  loading = false,
  error = null,
  className = "",
  postsPerPage = 12,
  enablePagination = true
}: BlogGridClientProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'featured' | 'grid'>('grid')

  // Use the blog filter hook if filters are enabled
  const filterData = showFilters ? useBlogFilter(posts) : null
  const filteredPosts = filterData?.filteredPosts || posts
  const effectiveSelectedCategory = filterData?.selectedCategory || selectedCategory || "All"

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredPosts])

  // Notify parent of filtered results
  useEffect(() => {
    onFilterChange?.(filteredPosts)
  }, [filteredPosts, onFilterChange])

  // Handle category change if provided
  useEffect(() => {
    if (onCategoryChange && selectedCategory) {
      onCategoryChange(selectedCategory)
    }
  }, [selectedCategory, onCategoryChange])

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const paginatedPosts = enablePagination ? filteredPosts.slice(startIndex, endIndex) : filteredPosts

  const featured = paginatedPosts[0]
  const rest = paginatedPosts.slice(1)

  // Handle loading state
  if (loading) {
    return (
      <section ref={ref} className={`py-20 bg-gray-50 dark:bg-gray-800 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6">
              Latest Articles
            </h2>
          </motion.div>
          
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-green-dark" />
            <span className="ml-2 text-lg text-gray-600 dark:text-gray-300">Loading articles...</span>
          </div>
        </div>
      </section>
    )
  }

  // Handle error state
  if (error) {
    return (
      <section ref={ref} className={`py-20 bg-gray-50 dark:bg-gray-800 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6">
              Latest Articles
            </h2>
          </motion.div>

          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error loading articles:</strong> {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className={`py-20 bg-gray-50 dark:bg-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6">
            Latest Articles
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Updates, research, and stories from the frontlines of environmental action.
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant={viewMode === 'featured' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('featured')}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              Featured View
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              Grid View
            </Button>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-between items-center mb-8 text-sm text-gray-600 dark:text-gray-400"
        >
          <div>
            Showing <span className="font-semibold text-green-dark">{paginatedPosts.length}</span> of{' '}
            <span className="font-semibold">{filteredPosts.length}</span> articles
            {effectiveSelectedCategory !== "All" && (
              <span> in <span className="font-semibold">{effectiveSelectedCategory}</span></span>
            )}
          </div>
          
          {filteredPosts.length > 0 && (
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{filteredPosts.length} total articles</span>
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center py-16"
          >
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {effectiveSelectedCategory !== "All" 
                ? `No articles found in the ${effectiveSelectedCategory} category.`
                : "No articles match your current search criteria."
              }
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                if (onCategoryChange) {
                  onCategoryChange("All")
                }
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Featured Article */}
            {viewMode === 'featured' && featured && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-16"
              >
                <div className="mb-6">
                  <Badge variant="secondary" className="mb-4">
                    Featured Article
                  </Badge>
                </div>
                
                <Link href={`/blog/${featured.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-500 group cursor-pointer">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div className="relative overflow-hidden">
                        <Image
                          src={featured.image || "/placeholder.svg"}
                          alt={featured.title}
                          width={500}
                          height={300}
                          className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          priority
                        />
                        <div className="absolute top-4 left-4 bg-green-light text-green-dark px-3 py-1 rounded-full text-sm font-semibold">
                          {featured.category}
                        </div>
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <h3 className="text-3xl font-bold text-black dark:text-white mb-3 group-hover:text-green-dark dark:group-hover:text-green-light transition-colors duration-300">
                          {featured.title}
                        </h3>
                        {featured.excerpt && (
                          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed line-clamp-3">
                            {featured.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {featured.author ? `${featured.author.firstName} ${featured.author.lastName}` : "TW&E"}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(featured.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Button className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark transition-all duration-300">
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )}

            {/* Articles Grid/List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={`
                ${layout === 'grid' 
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' 
                  : layout === 'list'
                  ? 'space-y-6'
                  : 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6'
                }
              `}
            >
              {(viewMode === 'grid' ? paginatedPosts : rest).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className={`
                    ${layout === 'list' ? 'w-full' : 'break-inside-avoid'}
                  `}
                >
                  <Link href={`/blog/${post.id}`}>
                    <Card className={`
                      h-full hover:shadow-xl transition-shadow duration-300 group cursor-pointer
                      ${layout === 'list' ? 'flex flex-row' : ''}
                    `}>
                      <CardHeader className={`
                        p-0
                        ${layout === 'list' ? 'w-1/3 flex-shrink-0' : ''}
                      `}>
                        <div className={`
                          relative overflow-hidden
                          ${layout === 'list' ? 'h-full rounded-l-lg' : 'rounded-t-lg'}
                        `}>
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            width={500}
                            height={300}
                            className={`
                              w-full object-cover group-hover:scale-105 transition-transform duration-300
                              ${layout === 'list' ? 'h-full' : 'h-48'}
                            `}
                          />
                          <div className="absolute top-4 left-4 bg-green-light text-green-dark px-3 py-1 rounded-full text-xs font-semibold">
                            {post.category}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <div className={layout === 'list' ? 'w-2/3 flex flex-col' : ''}>
                        <CardContent className={`
                          p-6
                          ${layout === 'list' ? 'flex-1 flex flex-col justify-between' : ''}
                        `}>
                          <div>
                            <h3 className={`
                              font-semibold text-black dark:text-white mb-2 line-clamp-2 group-hover:text-green-dark dark:group-hover:text-green-light transition-colors duration-300
                              ${layout === 'list' ? 'text-xl' : 'text-xl'}
                            `}>
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {post.author ? `${post.author.firstName} ${post.author.lastName}` : "TW&E"}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className={`
                          p-6 pt-0
                          ${layout === 'list' ? 'flex justify-end' : 'flex justify-end'}
                        `}>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {enablePagination && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex justify-center items-center gap-2 mt-12"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
