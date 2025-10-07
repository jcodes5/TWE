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

    const where = category ? { category } : {}

    const [images, total] = await Promise.all([
      prisma.galleryImage.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.galleryImage.count({ where }),
    ])

    return NextResponse.json({ images, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch gallery images' }, { status: 500 })
  }
}

async function createGalleryHandler(request: NextRequest & { user: any }) {
  try {
    const body = await request.json()
    const { title, url, publicId, category, description, takenAt, location } = body

    if (!title || !url || !publicId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const image = await prisma.galleryImage.create({
      data: {
        title,
        url,
        publicId,
        category,
        description,
        takenAt: takenAt ? new Date(takenAt) : undefined,
        location,
        createdById: request.user.userId,
      },
    })

    await logAudit({ entityType: EntityType.GALLERY_IMAGE, entityId: image.id, action: AuditAction.CREATE, performedById: request.user.userId, changedData: { title, category, location } })

    return NextResponse.json({ image })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create gallery image' }, { status: 500 })
  }
}

export const GET = withAuth(getGalleryHandler, [UserRole.ADMIN])
export const POST = withAuth(createGalleryHandler, [UserRole.ADMIN])
