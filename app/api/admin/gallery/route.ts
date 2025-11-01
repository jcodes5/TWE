import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, AuditAction, EntityType } from '@prisma/client'
import { logAudit } from '@/lib/audit'

async function getGalleryHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category') || undefined
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined
    const sortBy = searchParams.get('sortBy') || 'sortOrder'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Build where clause
    const where: any = {}
    
    if (category && category !== '') {
      where.category = category
    }
    
    if (status && status !== '') {
      where.status = status as any
    }
    
    if (search && search !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Build orderBy clause
    let orderBy: any = {}
    
    if (sortBy === 'createdAt') {
      orderBy = { createdAt: sortOrder === 'desc' ? 'desc' : 'asc' }
    } else if (sortBy === 'title') {
      orderBy = { title: sortOrder === 'desc' ? 'desc' : 'asc' }
    } else {
      orderBy = { sortOrder: sortOrder === 'desc' ? 'desc' : 'asc' }
    }

    const [images, total] = await Promise.all([
      prisma.galleryImage.findMany({ 
        where, 
        orderBy, 
        skip: (page - 1) * limit, 
        take: limit,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      prisma.galleryImage.count({ where }),
    ])

    return NextResponse.json({ 
      images, 
      pagination: { 
        page, 
        limit, 
        total, 
        pages: Math.ceil(total / limit) 
      } 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch gallery images' }, { status: 500 })
  }
}

async function createGalleryHandler(request: NextRequest & { user: any }) {
  try {
    const body = await request.json()
    const { 
      title, 
      url, 
      publicId, 
      category, 
      description, 
      altText, 
      tags,
      takenAt, 
      location,
      width,
      height,
      fileSize,
      format,
      thumbnailUrl,
      status = 'PENDING_REVIEW'
    } = body

    if (!title || !url || !publicId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the highest sortOrder and add 1
    const maxOrderResult = await prisma.galleryImage.aggregate({
      _max: { sortOrder: true } as any
    })
    const nextSortOrder = ((maxOrderResult as any)._max?.sortOrder || 0) + 1

    const image = await prisma.galleryImage.create({
      data: {
        title,
        url,
        publicId,
        category: category || null,
        description: description || null,
        altText: altText || null,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : null,
        takenAt: takenAt ? new Date(takenAt) : null,
        location: location || null,
        width: width || null,
        height: height || null,
        fileSize: fileSize || null,
        format: format || null,
        thumbnailUrl: thumbnailUrl || null,
        status: status as any,
        sortOrder: nextSortOrder,
        createdById: request.user.userId,
      },
    })

    await logAudit({ 
      entityType: EntityType.GALLERY_IMAGE, 
      entityId: image.id, 
      action: AuditAction.CREATE, 
      performedById: request.user.userId, 
      changedData: { title, category, location, status }
    })

    return NextResponse.json({ image })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create gallery image' }, { status: 500 })
  }
}

export const GET = withAuth(getGalleryHandler, [UserRole.ADMIN])
export const POST = withAuth(createGalleryHandler, [UserRole.ADMIN])
