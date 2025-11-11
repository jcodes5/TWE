import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole } from '@prisma/client'
import { notificationWebSocket } from '@/lib/websocket'
import { Prisma } from '@prisma/client'

async function analyticsHandler(request: NextRequest & { user: any }) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y
    const category = searchParams.get('category') || undefined

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Build where clause for date filtering
    const whereClause: any = {
      createdAt: {
        gte: startDate
      }
    }

    if (category) {
      whereClause.category = category
    }

    // Get basic counts
    const [
      totalImages,
      activeImages,
      pendingImages,
      inactiveImages,
      archivedImages,
      imagesByCategory,
      imagesByStatus,
      uploadsByDate,
      topImages,
      recentActivity
    ] = await Promise.all([
      // Total images
      prisma.galleryImage.count(),
      
      // Images by status
      prisma.galleryImage.count({ where: { status: 'ACTIVE' as any } }),
      prisma.galleryImage.count({ where: { status: 'PENDING_REVIEW' as any } }),
      prisma.galleryImage.count({ where: { status: 'INACTIVE' as any } }),
      prisma.galleryImage.count({ where: { status: 'ARCHIVED' as any } }),

      // Images by category
      prisma.galleryImage.groupBy({
        by: ['category'],
        _count: { id: true },
        where: whereClause.category ? { category: whereClause.category } : undefined
      }),

      // Images by status (with period filter)
      prisma.galleryImage.groupBy({
        by: ['category'],
        _count: { id: true },
        where: whereClause
      }),

      // Uploads by date (for timeline chart)
      prisma.$queryRaw`
        SELECT
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM gallery_images
        WHERE createdAt >= ${startDate}
        ${category ? Prisma.sql`AND category = ${category}` : Prisma.empty}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,

      // Top images (most recently updated)
      prisma.galleryImage.findMany({
        where: whereClause,
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          url: true,
          category: true,
          createdAt: true,
          altText: true
        }
      }),

      // Recent activity (last 20 actions)
      prisma.auditLog.findMany({
        where: {
          entityType: 'GALLERY_IMAGE',
          createdAt: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          performedBy: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })
    ])

    // Calculate growth rate
    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()))
    const previousPeriodUploads = await prisma.galleryImage.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate
        }
      }
    })

    const currentPeriodUploads = await prisma.galleryImage.count({
      where: whereClause
    })

    const growthRate = previousPeriodUploads > 0 
      ? ((currentPeriodUploads - previousPeriodUploads) / previousPeriodUploads) * 100 
      : 0

    // Calculate average uploads per day
    const daysDiff = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const avgUploadsPerDay = daysDiff > 0 ? currentPeriodUploads / daysDiff : 0

    // Most active users
    const mostActiveUsers = await prisma.auditLog.groupBy({
      by: ['performedById'],
      where: {
        entityType: 'GALLERY_IMAGE',
        createdAt: {
          gte: startDate
        }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    })

    // Get user details for most active users
    const userIds = mostActiveUsers.map(user => user.performedById)
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    })

    const activeUsersWithDetails = mostActiveUsers.map(userActivity => ({
      ...userActivity,
      user: users.find(user => user.id === userActivity.performedById)
    }))

    // Format analytics response - simplified to avoid Prisma type issues
    const analytics = {
      overview: {
        totalImages,
        activeImages,
        pendingImages,
        inactiveImages,
        archivedImages,
        growthRate: Math.round(growthRate * 100) / 100,
        avgUploadsPerDay: Math.round(avgUploadsPerDay * 100) / 100,
        period: period
      },
      
      categories: imagesByCategory.map((cat: any) => ({
        name: cat.category || 'Uncategorized',
        count: cat._count.id,
        percentage: Math.round((cat._count.id / totalImages) * 100 * 100) / 100
      })),

      timeline: (uploadsByDate as any[]).map(item => ({
        date: item.date,
        count: Number(item.count)
      })),

      topImages: topImages.slice(0, 10).map(image => ({
        id: image.id,
        title: image.title,
        url: image.url,
        category: image.category,
        createdAt: image.createdAt
      })),

      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        action: activity.action,
        entityId: activity.entityId,
        performedBy: activity.performedBy,
        createdAt: activity.createdAt,
        changedData: activity.changedData
      })),

      mostActiveUsers: activeUsersWithDetails.map(user => ({
        userId: user.performedById,
        activityCount: (user as any)._count.id,
        user: user.user
      }))
    }

    return NextResponse.json(analytics)

  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch analytics data' 
    }, { status: 500 })
  }
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const GET = withAuth(analyticsHandler, [UserRole.ADMIN])