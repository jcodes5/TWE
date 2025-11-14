import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { getCampaignMapData } from '@/lib/location-coordinates'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get filters from search params
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const urgency = searchParams.get('urgency')
    const impactLevel = searchParams.get('impactLevel')
    
    // Build where clause for campaigns
    const where: any = {
      status: 'ACTIVE'
    }

    // Apply filters
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
      where.urgency = urgency as any
    }

    if (impactLevel && impactLevel !== 'all') {
      where.impactLevel = impactLevel as any
    }

    // Get campaigns
    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        _count: {
          select: {
            donations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit for map performance
    })

    // Convert to map data format
    const mapData = getCampaignMapData(campaigns)

    return NextResponse.json({
      campaigns: mapData,
      total: campaigns.length,
      filters: {
        q,
        category,
        location,
        urgency,
        impactLevel,
      },
    })
  } catch (error: any) {
    console.error('Campaign map API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to load campaign map data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    )
  }
}