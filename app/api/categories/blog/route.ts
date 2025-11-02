import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// GET /api/categories/blog - Fetch unique blog categories from database
export async function GET() {
  try {
    // Get unique categories from published blog posts
    const categories = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        category: true
      },
      distinct: ['category']
    })

    // Map to get just the category names and sort alphabetically
    const categoryNames = categories
      .map(item => item.category)
      .filter(Boolean)
      .sort()

    // Create category objects with default metadata
    const categoriesWithMetadata = categoryNames.map((category, index) => {
      // Assign default icons and colors based on common environmental categories
      const getCategoryIcon = (categoryName: string) => {
        const name = categoryName.toLowerCase()
        if (name.includes('climate')) return 'Sun'
        if (name.includes('renewable') || name.includes('energy')) return 'Zap'
        if (name.includes('conservation') || name.includes('nature')) return 'Leaf'
        if (name.includes('water')) return 'Droplets'
        if (name.includes('sustain')) return 'Recycle'
        return 'Globe'
      }

      const getCategoryColor = (categoryName: string) => {
        const name = categoryName.toLowerCase()
        if (name.includes('climate')) return 'from-yellow-400 to-orange-500'
        if (name.includes('renewable') || name.includes('energy')) return 'from-blue-400 to-cyan-500'
        if (name.includes('conservation') || name.includes('nature')) return 'from-green-400 to-green-600'
        if (name.includes('water')) return 'from-blue-500 to-teal-500'
        if (name.includes('sustain')) return 'from-purple-400 to-purple-600'
        return 'from-gray-400 to-gray-600'
      }

      const getCategoryIconComponent = (iconName: string) => {
        // This will be handled on the frontend - we just return the icon name
        return iconName
      }

      return {
        name: category,
        icon: getCategoryIconComponent(getCategoryIcon(category)),
        color: getCategoryColor(category),
        count: 0 // Will be updated below
      }
    })

    // Get count for each category
    const categoriesWithCounts = await Promise.all(
      categoriesWithMetadata.map(async (cat) => {
        const count = await prisma.blogPost.count({
          where: {
            category: cat.name,
            status: 'PUBLISHED'
          }
        })
        return {
          ...cat,
          count
        }
      })
    )

    // Add "All" category at the beginning
    const totalCount = await prisma.blogPost.count({
      where: { status: 'PUBLISHED' }
    })

    const allCategories = [
      {
        name: "All",
        icon: "Globe",
        count: totalCount,
        color: "from-gray-400 to-gray-600"
      },
      ...categoriesWithCounts
    ]

    return NextResponse.json({ 
      categories: allCategories,
      total: totalCount 
    })
  } catch (error: any) {
    console.error('Error fetching blog categories:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}