"use client"

import { useState, useEffect } from 'react'
import BlogCategoryFilter from '@/components/sections/BlogCategoryFilter'
import BlogGridClient from '@/components/sections/BlogGridClient'
import { BlogPostItem } from '@/hooks/useBlogFilter'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, RefreshCw, Settings } from "lucide-react"

// Sample data for demonstration
const samplePosts: BlogPostItem[] = [
  {
    id: '1',
    title: 'Climate Change Impact on Arctic Wildlife',
    excerpt: 'A comprehensive study examining how rising temperatures are affecting polar bear populations and Arctic ecosystems.',
    image: '/blog_img.jpg',
    category: 'Climate Science',
    createdAt: '2024-01-15T10:00:00Z',
    author: { firstName: 'Dr. Sarah', lastName: 'Johnson' }
  },
  {
    id: '2',
    title: 'Solar Energy Innovations in 2024',
    excerpt: 'Latest breakthroughs in photovoltaic technology and how they\'re making solar power more accessible worldwide.',
    image: '/blog_img.jpg',
    category: 'Renewable Energy',
    createdAt: '2024-01-20T14:30:00Z',
    author: { firstName: 'Mike', lastName: 'Chen' }
  },
  {
    id: '3',
    title: 'Ocean Conservation Success Stories',
    excerpt: 'Highlighting marine protected areas and successful conservation efforts that are restoring ocean health.',
    image: '/blog_img.jpg',
    category: 'Conservation',
    createdAt: '2024-01-25T09:15:00Z',
    author: { firstName: 'Emma', lastName: 'Wilson' }
  },
  {
    id: '4',
    title: 'Water Scarcity Solutions for Rural Communities',
    excerpt: 'Innovative water collection and purification technologies helping address global water shortage challenges.',
    image: '/blog_img.jpg',
    category: 'Water Resources',
    createdAt: '2024-02-01T11:45:00Z',
    author: { firstName: 'Ahmed', lastName: 'Hassan' }
  },
  {
    id: '5',
    title: 'Sustainable Living: A Complete Guide',
    excerpt: 'Practical tips and strategies for reducing your environmental footprint in daily life.',
    image: '/blog_img.jpg',
    category: 'Sustainability',
    createdAt: '2024-02-05T16:20:00Z',
    author: { firstName: 'Lisa', lastName: 'Green' }
  },
  {
    id: '6',
    title: 'Wind Energy: Turning Breezes into Power',
    excerpt: 'How modern wind turbine technology is revolutionizing renewable energy generation.',
    image: '/blog_img.jpg',
    category: 'Renewable Energy',
    createdAt: '2024-02-10T08:30:00Z',
    author: { firstName: 'David', lastName: 'Rodriguez' }
  },
  {
    id: '7',
    title: 'Forest Restoration: Healing Our Planet',
    excerpt: 'Global initiatives to restore degraded forests and their critical role in climate regulation.',
    image: '/blog_img.jpg',
    category: 'Conservation',
    createdAt: '2024-02-15T13:45:00Z',
    author: { firstName: 'Anna', lastName: 'Kowalski' }
  },
  {
    id: '8',
    title: 'Climate Modeling and Future Predictions',
    excerpt: 'Understanding how climate scientists use advanced modeling to predict future environmental changes.',
    image: '/blog_img.jpg',
    category: 'Climate Science',
    createdAt: '2024-02-20T10:15:00Z',
    author: { firstName: 'Dr. Robert', lastName: 'Thompson' }
  },
  {
    id: '9',
    title: 'Smart Cities and Environmental Innovation',
    excerpt: 'How urban planning and technology are creating more sustainable and eco-friendly cities.',
    image: '/blog_img.jpg',
    category: 'Sustainability',
    createdAt: '2024-02-25T15:30:00Z',
    author: { firstName: 'Maria', lastName: 'Santos' }
  },
  {
    id: '10',
    title: 'Desalination Technologies: Ocean to Freshwater',
    excerpt: 'Breakthrough advances in desalination technology addressing global water security challenges.',
    image: '/blog_img.jpg',
    category: 'Water Resources',
    createdAt: '2024-03-01T12:00:00Z',
    author: { firstName: 'James', lastName: 'Miller' }
  }
]

interface BlogFilterExampleState {
  loading: boolean
  error: string | null
  simulatedPosts: BlogPostItem[]
  activeTab: string
  showAdvancedOptions: boolean
}

export default function BlogFilterExample() {
  const [state, setState] = useState<BlogFilterExampleState>({
    loading: false,
    error: null,
    simulatedPosts: samplePosts,
    activeTab: 'basic',
    showAdvancedOptions: false
  })
  
  const [filteredPosts, setFilteredPosts] = useState<BlogPostItem[]>([])

  // Simulate loading posts from an API
  const loadPosts = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate random success/failure for demo
      if (Math.random() > 0.1) { // 90% success rate
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          simulatedPosts: samplePosts 
        }))
      } else {
        throw new Error('Failed to load blog posts. Please try again.')
      }
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      }))
    }
  }

  // Add a new post to simulate dynamic content
  const addNewPost = () => {
    const newPost: BlogPostItem = {
      id: Date.now().toString(),
      title: `New Environmental Article ${Date.now()}`,
      excerpt: 'This is a newly added post to demonstrate dynamic filtering.',
      image: '/blog_img.jpg',
      category: ['Climate Science', 'Renewable Energy', 'Conservation', 'Water Resources', 'Sustainability'][Math.floor(Math.random() * 5)],
      createdAt: new Date().toISOString(),
      author: { firstName: 'Guest', lastName: 'Author' }
    }
    
    setState(prev => ({
      ...prev,
      simulatedPosts: [newPost, ...prev.simulatedPosts]
    }))
  }

  // Reset to original data
  const resetData = () => {
    setState(prev => ({
      ...prev,
      simulatedPosts: samplePosts
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Blog Filter Component Demo
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Explore the enhanced blog category filtering system
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  showAdvancedOptions: !prev.showAdvancedOptions 
                }))}
              >
                <Settings className="h-4 w-4 mr-2" />
                Options
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={loadPosts}
                disabled={state.loading}
              >
                {state.loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Reload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Options Panel */}
      {state.showAdvancedOptions && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Demo Controls:
                </span>
                <Button variant="outline" size="sm" onClick={addNewPost}>
                  Add Random Post
                </Button>
                <Button variant="outline" size="sm" onClick={resetData}>
                  Reset Data
                </Button>
              </div>
              
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Total Posts: {state.simulatedPosts.length}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {state.error && (
          <Alert className="mb-8" variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {/* Demo Tabs */}
        <Tabs value={state.activeTab} onValueChange={(value) => 
          setState(prev => ({ ...prev, activeTab: value }))
        } className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Usage</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
            <TabsTrigger value="integrated">Integrated Layout</TabsTrigger>
          </TabsList>

          {/* Basic Usage Tab */}
          <TabsContent value="basic" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Simple Category Filter</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Basic implementation with category filtering only.
                </p>
              </CardHeader>
              <CardContent>
                <BlogCategoryFilter 
                  posts={state.simulatedPosts}
                  showSearch={false}
                  showSort={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Features Tab */}
          <TabsContent value="advanced" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Enhanced Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Filter with Search</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Full-featured filter with search and sorting.
                  </p>
                </CardHeader>
                <CardContent>
                  <BlogCategoryFilter 
                    posts={state.simulatedPosts}
                    showSearch={true}
                    showSort={true}
                    layout="scroll"
                    onFilterChange={setFilteredPosts}
                  />
                </CardContent>
              </Card>

              {/* Results Display */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Results</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Real-time filtered results: {filteredPosts.length} posts
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredPosts.slice(0, 10).map(post => (
                      <div 
                        key={post.id}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <h4 className="font-medium text-sm mb-1">{post.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {post.category} • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {filteredPosts.length > 10 && (
                      <p className="text-xs text-gray-500 text-center py-2">
                        ... and {filteredPosts.length - 10} more posts
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integrated Layout Tab */}
          <TabsContent value="integrated" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Complete Blog Page Layout</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Integrated filter and grid layout with pagination.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <BlogCategoryFilter 
                    posts={state.simulatedPosts}
                    onFilterChange={setFilteredPosts}
                    showSearch={true}
                    showSort={true}
                  />
                  
                  <BlogGridClient 
                    posts={filteredPosts.length > 0 ? filteredPosts : state.simulatedPosts}
                    layout="grid"
                    postsPerPage={6}
                    enablePagination={true}
                    loading={state.loading}
                    error={state.error}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Alternative Layout */}
            <Card>
              <CardHeader>
                <CardTitle>List Layout with Filters</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Different layout option showing list view with integrated filtering.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <BlogCategoryFilter 
                    posts={state.simulatedPosts}
                    layout="scroll"
                    showSearch={false}
                    showSort={true}
                  />
                  
                  <BlogGridClient 
                    posts={state.simulatedPosts}
                    layout="list"
                    postsPerPage={4}
                    enablePagination={true}
                    showFilters={false}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Performance Metrics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Performance & Usage Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Real-time filtering with search</li>
                  <li>• Multiple sorting options</li>
                  <li>• Keyboard navigation support</li>
                  <li>• Responsive design</li>
                  <li>• Loading and error states</li>
                  <li>• Accessible markup</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Integration Notes</h4>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Hook separates logic from UI</li>
                  <li>• Components are fully typed</li>
                  <li>• Supports dark mode</li>
                  <li>• Optimized with React.memo</li>
                  <li>• Customizable via props</li>
                  <li>• Extensible architecture</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}