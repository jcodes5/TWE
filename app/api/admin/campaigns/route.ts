import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, CampaignStatus, AuditAction, EntityType } from '@prisma/client'
import { logAudit } from '@/lib/audit'
import { createAndBroadcastNotification } from '@/lib/websocket'

// Define enum types inline since Prisma client hasn't been regenerated
enum UrgencyLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}
enum ImpactLevel {
  INTERNATIONAL = "INTERNATIONAL",
  NATIONAL = "NATIONAL",
  REGIONAL = "REGIONAL",
  LOCAL = "LOCAL"
}

async function getCampaignsHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const q = searchParams.get('q') || ''
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'title' | 'goal'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const urgency = searchParams.get('urgency')
    const impactLevel = searchParams.get('impactLevel')
    const startDateFrom = searchParams.get('startDateFrom')
    const startDateTo = searchParams.get('startDateTo')
    const endDateFrom = searchParams.get('endDateFrom')
    const endDateTo = searchParams.get('endDateTo')

    const where: any = {}
    if (status) where.status = status as CampaignStatus
    if (category) where.category = { contains: category }
    if (location) where.location = { contains: location }
    if (urgency) where.urgency = urgency as UrgencyLevel
    if (impactLevel) where.impactLevel = impactLevel as ImpactLevel
    
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
    
    if (q) where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { category: { contains: q, mode: 'insensitive' } },
      { location: { contains: q, mode: 'insensitive' } },
    ]

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              donations: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.campaign.count({ where }),
    ])

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

async function createCampaignHandler(request: NextRequest & { user: any }) {
  try {
    const body = await request.json()
    const { title, description, content, image, goal, category, location, status, startDate, endDate, urgency, impactLevel } = body

    if (!title || !description || !content || !goal || !category || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        content,
        image,
        goal,
        category,
        location,
        status: status || CampaignStatus.DRAFT,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        urgency: urgency || UrgencyLevel.MEDIUM,
        impactLevel: impactLevel || ImpactLevel.REGIONAL,
        createdById: request.user.userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    await logAudit({ entityType: EntityType.CAMPAIGN, entityId: campaign.id, action: AuditAction.CREATE, performedById: request.user.userId, changedData: { title, category, status: status || CampaignStatus.DRAFT } })

    // Create notification for new campaign creation
    await createAndBroadcastNotification(
      "New Campaign Created",
      `Campaign "${title}" has been created and is ${status || CampaignStatus.DRAFT}`,
      "SUCCESS"
    )

    return NextResponse.json({ campaign })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create campaign' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(getCampaignsHandler, [UserRole.ADMIN])
export const POST = withAuth(createCampaignHandler, [UserRole.ADMIN])
