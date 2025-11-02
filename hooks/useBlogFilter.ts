import { useState, useMemo, useCallback } from 'react'

export interface BlogPostItem {
  id: string
  title: string
  excerpt: string | null
  image: string | null
  category: string
  createdAt: string
  author?: { firstName: string; lastName: string } | null
}

export interface CategoryConfig {
  name: string
  icon: React.ReactNode
  color: string
  gradient: string
}

export interface UseBlogFilterReturn {
  // State
  selectedCategory: string
  searchQuery: string
  sortBy: 'date' | 'title' | 'category'
  sortOrder: 'asc' | 'desc'
  
  // Actions
  setSelectedCategory: (category: string) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: 'date' | 'title' | 'category') => void
  setSortOrder: (order: 'asc' | 'desc') => void
  resetFilters: () => void
  
  // Computed
  filteredPosts: BlogPostItem[]
  categories: CategoryConfig[]
  categoryCounts: Record<string, number>
  totalPosts: number
  hasActiveFilters: boolean
}

// Icon mappings
const iconMap: Record<string, React.ReactNode> = {
  "All": null, // Will use Globe icon
  "Climate Science": null,
  "Renewable Energy": null,
  "Conservation": null,
  "Water Resources": null,
  "Sustainability": null,
  "Environmental Policy": null,
  "Biodiversity": null,
  "Pollution": null,
  "Green Technology": null,
  "Community Action": null
}

// Color mappings
const colorMap: Record<string, string> = {
  "All": "from-gray-400 to-gray-600",
  "Climate Science": "from-yellow-400 to-orange-500",
  "Renewable Energy": "from-blue-400 to-cyan-500",
  "Conservation": "from-green-400 to-green-600",
  "Water Resources": "from-blue-500 to-teal-500",
  "Sustainability": "from-purple-400 to-purple-600",
  "Environmental Policy": "from-indigo-400 to-indigo-600",
  "Biodiversity": "from-emerald-400 to-emerald-600",
  "Pollution": "from-red-400 to-red-600",
  "Green Technology": "from-teal-400 to-teal-600",
  "Community Action": "from-orange-400 to-orange-600"
}

export function useBlogFilter(posts: BlogPostItem[]): UseBlogFilterReturn {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Extract unique categories from posts
  const uniqueCategories = useMemo(() => {
    const categories = Array.from(new Set(posts.map(post => post.category)))
    return ["All", ...categories.filter(cat => cat !== "All")]
  }, [posts])

  // Create category configurations
  const categories: CategoryConfig[] = useMemo(() => {
    return uniqueCategories.map(category => ({
      name: category,
      icon: category === "All" ? null : iconMap[category] || null,
      color: colorMap[category] || "from-gray-400 to-gray-600",
      gradient: colorMap[category] || "from-gray-400 to-gray-600"
    }))
  }, [uniqueCategories])

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    uniqueCategories.forEach(category => {
      if (category === "All") {
        counts[category] = posts.length
      } else {
        counts[category] = posts.filter(post => post.category === category).length
      }
    })
    return counts
  }, [posts, uniqueCategories])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = posts

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(post => post.category === selectedCategory)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [posts, selectedCategory, searchQuery, sortBy, sortOrder])

  const resetFilters = useCallback(() => {
    setSelectedCategory("All")
    setSearchQuery("")
    setSortBy('date')
    setSortOrder('desc')
  }, [])

  const hasActiveFilters = selectedCategory !== "All" || searchQuery.trim() !== ""

  return {
    // State
    selectedCategory,
    searchQuery,
    sortBy,
    sortOrder,
    
    // Actions
    setSelectedCategory,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    resetFilters,
    
    // Computed
    filteredPosts,
    categories,
    categoryCounts,
    totalPosts: posts.length,
    hasActiveFilters
  }
}