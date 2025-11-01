"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, Filter, X, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

type Campaign = {
  id: string
  title: string
  description: string
  content: string
  image?: string | null
  goal: number
  raised: number
  category: string
  location: string
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  startDate?: string | null
  endDate?: string | null
  urgency: "HIGH" | "MEDIUM" | "LOW"
  impactLevel: "INTERNATIONAL" | "NATIONAL" | "REGIONAL" | "LOCAL"
  createdAt: string
  _count?: { donations: number }
}

type SearchFilters = {
  q: string
  category: string
  location: string
  urgency: string
  impactLevel: string
  sortBy: string
  sortOrder: string
}

type SearchResponse = {
  campaigns: Campaign[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters: SearchFilters
}

interface CampaignSearchClientProps {
  onFiltersChange?: (filters: {
    q: string
    category: string
    location: string
    urgency: string
    impactLevel: string
  }) => void
  mapFilters?: {
    q?: string
    category?: string
    location?: string
    urgency?: string
    impactLevel?: string
  }
}

export function CampaignSearchClient({ onFiltersChange, mapFilters }: CampaignSearchClientProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [error, setError] = useState<string | null>(null)
  
  // Initialize filters, prioritizing parent-provided filters for map integration
  const [filters, setFilters] = useState<SearchFilters>({
    q: mapFilters?.q || "",
    category: mapFilters?.category || "all",
    location: mapFilters?.location || "all",
    urgency: mapFilters?.urgency || "all",
    impactLevel: mapFilters?.impactLevel || "all",
    sortBy: "createdAt",
    sortOrder: "desc"
  })

  const limit = 12 // Items per page for public interface

  // Load campaigns with proper error handling
  const loadCampaigns = useCallback(async (resetPage = false) => {
    setLoading(true)
    setError(null)
    const currentPage = resetPage ? 1 : page
    
    try {
      const params = new URLSearchParams()
        if (filters.q) params.set('q', filters.q)
        if (filters.category && filters.category !== 'all') params.set('category', filters.category)
        if (filters.location && filters.location !== 'all') params.set('location', filters.location)
        if (filters.urgency && filters.urgency !== 'all') params.set('urgency', filters.urgency)
        if (filters.impactLevel && filters.impactLevel !== 'all') params.set('impactLevel', filters.impactLevel)
        params.set('page', String(currentPage))
        params.set('limit', String(limit))
        params.set('sortBy', filters.sortBy)
        params.set('sortOrder', filters.sortOrder)
      
      const res = await fetch(`/api/campaigns/search?${params.toString()}`)
      const data = await res.json() as any
      
      if (res.ok) {
        const typed = data as SearchResponse
        setCampaigns(typed.campaigns || [])
        setTotalPages(typed.pagination?.pages || 1)
        if (resetPage) setPage(1)
      } else {
        const errMsg = data?.error || data?.message || res.statusText || 'Failed to load campaigns'
        setError(errMsg)
        setCampaigns([])
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error)
      setError('Network error. Please try again.')
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }, [filters, page, limit])

  // Debounced search for text input
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCampaigns(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [filters.q, loadCampaigns])

  // Load on other filter changes
  useEffect(() => {
    if (filters.q) return // Skip if q is being debounced
    loadCampaigns(true)
  }, [
    filters.category, 
    filters.location, 
    filters.urgency, 
    filters.impactLevel,
    filters.sortBy,
    filters.sortOrder,
    loadCampaigns
  ])

  // Load on page change
  useEffect(() => {
    if (!filters.q) { // Only reload if not debouncing q
      loadCampaigns(false)
    }
  }, [page, loadCampaigns])

  const updateFilter = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setError(null) // Clear error when user changes filters
    
    // Update parent map filters for cross-component sync
    if (onFiltersChange && ['q', 'category', 'location', 'urgency', 'impactLevel'].includes(key)) {
      onFiltersChange({
        q: key === 'q' ? value : filters.q,
        category: key === 'category' ? value : filters.category,
        location: key === 'location' ? value : filters.location,
        urgency: key === 'urgency' ? value : filters.urgency,
        impactLevel: key === 'impactLevel' ? value : filters.impactLevel
      })
    }
  }, [filters, onFiltersChange])

  // Update filters when parent map filters change
  useEffect(() => {
    if (mapFilters) {
      setFilters(prev => ({
        ...prev,
        q: mapFilters.q || prev.q,
        category: mapFilters.category || prev.category,
        location: mapFilters.location || prev.location,
        urgency: mapFilters.urgency || prev.urgency,
        impactLevel: mapFilters.impactLevel || prev.impactLevel
      }))
    }
  }, [mapFilters])

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      q: "",
      category: "all",
      location: "all",
      urgency: "all",
      impactLevel: "all",
      sortBy: "createdAt",
      sortOrder: "desc"
    }
    setFilters(clearedFilters)
    setError(null)
    setPage(1)
    
    // Update parent map filters
    if (onFiltersChange) {
      onFiltersChange({
        q: "",
        category: "all",
        location: "all",
        urgency: "all",
        impactLevel: "all"
      })
    }
  }, [onFiltersChange])

  const getUrgencyColor = useCallback((urgency: string) => {
    switch (urgency) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }, [])

  const getImpactColor = useCallback((impact: string) => {
    switch (impact) {
      case 'INTERNATIONAL':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'NATIONAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'REGIONAL':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
      case 'LOCAL':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }, [])

  const progressPercentage = useCallback((campaign: Campaign) => {
    return campaign.goal > 0 
      ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100)) 
      : 0
  }, [])

  // Improved pagination rendering
  const renderPagination = () => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
      const pages = []
      const showPages = Math.min(5, totalPages)
      
      if (totalPages <= 5) {
        // Show all pages if 5 or fewer
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Complex pagination logic
        const start = Math.max(1, page - 2)
        const end = Math.min(totalPages, page + 2)
        
        if (start > 1) {
          pages.push(1)
          if (start > 2) pages.push('...')
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
        
        if (end < totalPages) {
          if (end < totalPages - 1) pages.push('...')
          pages.push(totalPages)
        }
      }
      
      return pages
    }

    const pageNumbers = getPageNumbers()

    return (
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="text-gray-400 px-2">
                  ...
                </span>
              )
            }
            
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNum as number)}
                className="w-10 h-10"
              >
                {pageNum}
              </Button>
            )
          })}
        </div>
        
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-black dark:text-white mb-6">
            Browse Campaigns
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover and join environmental campaigns that match your interests and location.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Main search row */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search campaigns, categories, or locations..."
                    value={filters.q}
                    onChange={(e) => updateFilter('q', e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? 'bg-green-light text-green-dark' : ''}
                    disabled={loading}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  
                  <Select value={viewMode} onValueChange={(value: 'grid' | 'list') => setViewMode(value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">
                        <Grid className="h-4 w-4" />
                      </SelectItem>
                      <SelectItem value="list">
                        <List className="h-4 w-4" />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Advanced filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Climate Action">Climate Action</SelectItem>
                          <SelectItem value="Conservation">Conservation</SelectItem>
                          <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                          <SelectItem value="Water Resources">Water Resources</SelectItem>
                          <SelectItem value="Sustainable Agriculture">Sustainable Agriculture</SelectItem>
                          <SelectItem value="Urban Planning">Urban Planning</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="Global">Global</SelectItem>
                          <SelectItem value="North America">North America</SelectItem>
                          <SelectItem value="Europe">Europe</SelectItem>
                          <SelectItem value="Asia">Asia</SelectItem>
                          <SelectItem value="Africa">Africa</SelectItem>
                          <SelectItem value="South America">South America</SelectItem>
                          <SelectItem value="Oceania">Oceania</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filters.urgency} onValueChange={(value) => updateFilter('urgency', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Urgency</SelectItem>
                          <SelectItem value="HIGH">High Priority</SelectItem>
                          <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                          <SelectItem value="LOW">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filters.impactLevel} onValueChange={(value) => updateFilter('impactLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Impact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Impact</SelectItem>
                          <SelectItem value="INTERNATIONAL">International</SelectItem>
                          <SelectItem value="NATIONAL">National</SelectItem>
                          <SelectItem value="REGIONAL">Regional</SelectItem>
                          <SelectItem value="LOCAL">Local</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground" disabled={loading}>
                        <X className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                      
                      <div className="flex gap-2">
                        <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="createdAt">Latest</SelectItem>
                            <SelectItem value="title">Name</SelectItem>
                            <SelectItem value="goal">Goal</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value)}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desc">Desc</SelectItem>
                            <SelectItem value="asc">Asc</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-dark mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading campaigns...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
            <Button variant="outline" onClick={() => loadCampaigns(true)}>
              Try Again
            </Button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No campaigns found matching your criteria.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Campaign Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8'
                : 'space-y-6 mb-8'
            }>
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {viewMode === 'grid' ? (
                    <Card className="h-full hover:shadow-xl transition-shadow duration-300 group cursor-pointer overflow-hidden">
                      <div className="relative">
                        <img
                          src={campaign.image || "/placeholder.svg"}
                          alt={campaign.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge variant="secondary">{campaign.category}</Badge>
                          <Badge className={getUrgencyColor(campaign.urgency)}>{campaign.urgency}</Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-black dark:text-white mb-2 line-clamp-2">
                          {campaign.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {campaign.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>{campaign.location}</span>
                            <span>{progressPercentage(campaign)}% Complete</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-light h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage(campaign)}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}
                          </div>
                          <Badge className={getImpactColor(campaign.impactLevel)}>
                            {campaign.impactLevel}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <img
                            src={campaign.image || "/placeholder.svg"}
                            alt={campaign.title}
                            className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-semibold text-black dark:text-white line-clamp-1">
                                {campaign.title}
                              </h3>
                              <div className="flex gap-2 ml-4 flex-wrap">
                                <Badge variant="secondary">{campaign.category}</Badge>
                                <Badge className={getUrgencyColor(campaign.urgency)}>{campaign.urgency}</Badge>
                                <Badge className={getImpactColor(campaign.impactLevel)}>
                                  {campaign.impactLevel}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                              {campaign.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {campaign.location} • {campaign._count?.donations || 0} donations
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  ${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}
                                </div>
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-green-light h-2 rounded-full"
                                    style={{ width: `${progressPercentage(campaign)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </section>
  )
}

export default CampaignSearchClient
