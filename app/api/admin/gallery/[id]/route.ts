import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, AuditAction, EntityType } from '@prisma/client'
import { logAudit } from '@/lib/audit'

async function updateGalleryHandler(request: NextRequest & { user: any }, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { title, category, description, takenAt, location } = body

    const image = await prisma.galleryImage.update({
      where: { id },
      data: { title, category, description, takenAt: takenAt ? new Date(takenAt) : undefined, location },
    })

    await logAudit({ entityType: EntityType.GALLERY_IMAGE, entityId: id, action: AuditAction.UPDATE, performedById: request.user.userId, changedData: body })

    return NextResponse.json({ image })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update gallery image' }, { status: 500 })
  }
}

async function deleteGalleryHandler(request: NextRequest & { user: any }, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const img = await prisma.galleryImage.findUnique({ where: { id } })
    await prisma.galleryImage.delete({ where: { id } })
    await logAudit({ entityType: EntityType.GALLERY_IMAGE, entityId: id, action: AuditAction.DELETE, performedById: request.user.userId, changedData: { publicId: img?.publicId } })
    return NextResponse.json({ message: 'Gallery image deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete gallery image' }, { status: 500 })
  }
}

export const PUT = withAuth(updateGalleryHandler, [UserRole.ADMIN])
export const DELETE = withAuth(deleteGalleryHandler, [UserRole.ADMIN])
