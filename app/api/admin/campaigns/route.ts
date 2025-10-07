import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, CampaignStatus, AuditAction, EntityType } from '@prisma/client'
import { logAudit } from '@/lib/audit'

async function getCampaignsHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const where = status ? { status: status as CampaignStatus } : {}

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
        orderBy: { createdAt: 'desc' },
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
    const { title, description, content, image, goal, category, location, status } = body

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
