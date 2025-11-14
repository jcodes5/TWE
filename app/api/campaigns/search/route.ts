import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

// Define enum types inline since Prisma client hasn't been regenerated
type CampaignStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED"
type UrgencyLevel = "HIGH" | "MEDIUM" | "LOW"
type ImpactLevel = "INTERNATIONAL" | "NATIONAL" | "REGIONAL" | "LOCAL"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50) // Max 50 items per page
    const offset = (page - 1) * limit

    // Search and filters
    const status = searchParams.get('status')
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const urgency = searchParams.get('urgency')
    const impactLevel = searchParams.get('impactLevel')
    
    // Date filters
    const startDateFrom = searchParams.get('startDateFrom')
    const startDateTo = searchParams.get('startDateTo')
    const endDateFrom = searchParams.get('endDateFrom')
    const endDateTo = searchParams.get('endDateTo')
    
    // Sort options
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'title' | 'goal' | 'startDate'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    // Build where clause
    const where: any = {
      status: status ? status as CampaignStatus : "ACTIVE"
    }

    // Only apply filters to searches if they're explicitly set
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
        { location: { contains: q } },
      ]
    }

    if (category && category !== 'all') {
      where.category = { contains: category }
    }

    if (location && location !== 'all') {
      where.location = { contains: location }
    }

    if (urgency && urgency !== 'all') {
      where.urgency = urgency as UrgencyLevel
    }

    if (impactLevel && impactLevel !== 'all') {
      where.impactLevel = impactLevel as ImpactLevel
    }

    // Date range filters
    if (startDateFrom || startDateTo) {
      where.startDate = {}
      if (startDateFrom) where.startDate.gte = new Date(startDateFrom)
      if (startDateTo) where.startDate.lte = new Date(startDateTo)
    }

    if (endDateFrom || endDateTo) {
      where.endDate = {}
      if (endDateFrom) where.endDate.gte = new Date(endDateFrom)
      if (endDateTo) where.endDate.lte = new Date(endDateTo)
    }

    // Execute query with count
    const [campaigns, totalCount] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          _count: {
            select: {
              donations: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.campaign.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        q,
        status,
        category,
        location,
        urgency,
        impactLevel,
        sortBy,
        sortOrder,
      },
    })
  } catch (error: any) {
    console.error('Campaign search error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to search campaigns',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    )
  }
}