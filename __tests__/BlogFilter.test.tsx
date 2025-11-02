/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
import React from 'react'

import { render, screen, fireEvent, waitFor, renderHook, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import BlogCategoryFilter  from '@/components/sections/BlogCategoryFilter'
import BlogGridClient  from '@/components/sections/BlogGridClient'
import { useBlogFilter } from '@/hooks/useBlogFilter'

// Mock data for testing
const mockPosts = [
  {
    id: '1',
    title: 'Climate Change Impact on Polar Bears',
    excerpt: 'A comprehensive look at how climate change is affecting polar bear populations.',
    image: '/blog-polar-bears.jpg',
    category: 'Climate Science',
    createdAt: '2024-01-15T10:00:00Z',
    author: { firstName: 'Dr. Jane', lastName: 'Smith' }
  },
  {
    id: '2',
    title: 'Solar Energy Innovations in 2024',
    excerpt: 'Latest developments in solar panel technology and renewable energy solutions.',
    image: '/solar-panels.jpg',
    category: 'Renewable Energy',
    createdAt: '2024-01-20T14:30:00Z',
    author: { firstName: 'Mike', lastName: 'Johnson' }
  },
  {
    id: '3',
    title: 'Ocean Conservation Strategies',
    excerpt: 'Effective methods for protecting marine ecosystems and biodiversity.',
    image: '/ocean-conservation.jpg',
    category: 'Conservation',
    createdAt: '2024-01-25T09:15:00Z',
    author: { firstName: 'Sarah', lastName: 'Wilson' }
  },
  {
    id: '4',
    title: 'Water Scarcity Solutions',
    excerpt: 'Innovative approaches to addressing global water shortage challenges.',
    image: '/water-scarcity.jpg',
    category: 'Water Resources',
    createdAt: '2024-02-01T11:45:00Z',
    author: { firstName: 'Ahmed', lastName: 'Hassan' }
  },
  {
    id: '5',
    title: 'Sustainable Living Practices',
    excerpt: 'Practical tips for reducing your environmental footprint in daily life.',
    image: '/sustainable-living.jpg',
    category: 'Sustainability',
    createdAt: '2024-02-05T16:20:00Z',
    author: { firstName: 'Emma', lastName: 'Davis' }
  }
]

describe('BlogCategoryFilter', () => {
  test('renders category filter with all categories', () => {
    render(<BlogCategoryFilter posts={mockPosts} />)
    
    expect(screen.getByText('Browse by Category')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Climate Science')).toBeInTheDocument()
    expect(screen.getByText('Renewable Energy')).toBeInTheDocument()
    expect(screen.getByText('Conservation')).toBeInTheDocument()
  })

  test('displays correct article counts for each category', () => {
    render(<BlogCategoryFilter posts={mockPosts} />)
    
    expect(screen.getByText('5 articles')).toBeInTheDocument() // All
    expect(screen.getByText('1 articles')).toBeInTheDocument() // Each specific category
  })

  test('filters posts when category is selected', async () => {
    const user = userEvent.setup()
    render(<BlogCategoryFilter posts={mockPosts} />)
    
    const climateScienceButton = screen.getByText('Climate Science')
    await user.click(climateScienceButton)
    
    await waitFor(() => {
      expect(screen.getByText('1 articles')).toBeInTheDocument()
    })
  })

  test('search functionality works', async () => {
    const user = userEvent.setup()
    render(<BlogCategoryFilter posts={mockPosts} />)
    
    const searchInput = screen.getByPlaceholderText('Search articles...')
    await user.type(searchInput, 'climate')
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('climate')
    })
  })

  test('clear search works', async () => {
    const user = userEvent.setup()
    render(<BlogCategoryFilter posts={mockPosts} />)
    
    const searchInput = screen.getByPlaceholderText('Search articles...')
    await user.type(searchInput, 'solar')
    
    const clearButton = screen.getByLabelText('Clear search')
    await user.click(clearButton)
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('')
    })
  })

  test('reset filters works', async () => {
    const user = userEvent.setup()
    render(<BlogCategoryFilter posts={mockPosts} />)
    
    // Apply some filters
    const searchInput = screen.getByPlaceholderText('Search articles...')
    await user.type(searchInput, 'solar')
    
    const climateButton = screen.getByText('Climate Science')
    await user.click(climateButton)
    
    // Clear all
    const clearAllButton = screen.getByText('Clear All')
    await user.click(clearAllButton)
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('')
      expect(screen.getByText('5 articles')).toBeInTheDocument() // Should show all again
    })
  })

  test('keyboard navigation works', async () => {
    const user = userEvent.setup()
    render(<BlogCategoryFilter posts={mockPosts} />)
    
    const climateButton = screen.getByText('Climate Science')
    climateButton.focus()
    
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(climateButton).toHaveAttribute('aria-pressed', 'true')
    })
  })

  test('shows empty state when no posts match filters', async () => {
    const user = userEvent.setup()
    render(<BlogCategoryFilter posts={mockPosts} />)
    
    const searchInput = screen.getByPlaceholderText('Search articles...')
    await user.type(searchInput, 'nonexistent keyword')
    
    await waitFor(() => {
      expect(screen.getByText('No articles found')).toBeInTheDocument()
    })
  })

  test('results summary updates correctly', async () => {
    const user = userEvent.setup()
    render(<BlogCategoryFilter posts={mockPosts} />)
    
    // Initially should show all posts
    expect(screen.getByText('Showing 5 of 5 articles')).toBeInTheDocument()
    
    // Filter by category
    const climateButton = screen.getByText('Climate Science')
    await user.click(climateButton)
    
    await waitFor(() => {
      expect(screen.getByText('Showing 1 of 5 articles')).toBeInTheDocument()
      expect(screen.getByText('in Climate Science')).toBeInTheDocument()
    })
  })
})

describe('BlogGridClient', () => {
  test('renders loading state correctly', () => {
    render(<BlogGridClient posts={[]} loading={true} />)
    
    expect(screen.getByText('Loading articles...')).toBeInTheDocument()
  })

  test('renders error state correctly', () => {
    render(<BlogGridClient posts={[]} error="Failed to load articles" />)
    
    expect(screen.getByText('Error loading articles: Failed to load articles')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  test('renders featured article correctly', async () => {
    render(<BlogGridClient posts={mockPosts} />)
    
    expect(screen.getByText('Featured Article')).toBeInTheDocument()
    expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument()
  })

  test('view mode toggle works', async () => {
    const user = userEvent.setup()
    render(<BlogGridClient posts={mockPosts} />)
    
    const gridViewButton = screen.getByText('Grid View')
    await user.click(gridViewButton)
    
    // Featured article should be hidden in grid view
    await waitFor(() => {
      expect(screen.queryByText('Featured Article')).not.toBeInTheDocument()
    })
  })

  test('pagination works correctly', async () => {
    const user = userEvent.setup()
    render(<BlogGridClient posts={mockPosts} postsPerPage={2} />)
    
    // Should show first 2 articles
    expect(screen.getByText('Showing 2 of 5 articles')).toBeInTheDocument()
    
    // Go to next page
    const nextButton = screen.getByText('Next')
    await user.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Showing 2 of 5 articles')).toBeInTheDocument()
    })
  })
})

describe('useBlogFilter Hook', () => {
  test('initial state is correct', () => {
    const { result } = renderHook(() => useBlogFilter(mockPosts))
    
    expect(result.current.selectedCategory).toBe('All')
    expect(result.current.searchQuery).toBe('')
    expect(result.current.sortBy).toBe('date')
    expect(result.current.sortOrder).toBe('desc')
    expect(result.current.filteredPosts).toHaveLength(5)
  })

  test('category filtering works', () => {
    const { result } = renderHook(() => useBlogFilter(mockPosts))
    
    act(() => {
      result.current.setSelectedCategory('Climate Science')
    })
    
    expect(result.current.filteredPosts).toHaveLength(1)
    expect(result.current.filteredPosts[0].category).toBe('Climate Science')
  })

  test('search filtering works', () => {
    const { result } = renderHook(() => useBlogFilter(mockPosts))
    
    act(() => {
      result.current.setSearchQuery('climate')
    })
    
    expect(result.current.filteredPosts).toHaveLength(1)
    expect(result.current.filteredPosts[0].title).toContain('Climate')
  })

  test('sorting works correctly', () => {
    const { result } = renderHook(() => useBlogFilter(mockPosts))
    
    act(() => {
      result.current.setSortBy('title')
      result.current.setSortOrder('asc')
    })
    
    const titles = result.current.filteredPosts.map(post => post.title)
    const sortedTitles = [...titles].sort()
    
    expect(titles).toEqual(sortedTitles)
  })

  test('reset filters works', () => {
    const { result } = renderHook(() => useBlogFilter(mockPosts))
    
    // Apply some filters
    act(() => {
      result.current.setSelectedCategory('Climate Science')
      result.current.setSearchQuery('test')
      result.current.setSortBy('title')
    })
    
    // Reset
    act(() => {
      result.current.resetFilters()
    })
    
    expect(result.current.selectedCategory).toBe('All')
    expect(result.current.searchQuery).toBe('')
    expect(result.current.sortBy).toBe('date')
    expect(result.current.filteredPosts).toHaveLength(5)
  })
})