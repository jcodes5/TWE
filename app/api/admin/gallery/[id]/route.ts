import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, AuditAction, EntityType } from '@prisma/client'
import { logAudit } from '@/lib/audit'
import { notificationWebSocket } from '@/lib/websocket'

async function updateGalleryHandler(request: NextRequest & { user: any }, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { 
      title, 
      category, 
      description, 
      altText,
      tags,
      takenAt, 
      location,
      status,
      sortOrder,
      // Image editing properties
      filters,
      rotation,
      cropArea,
      // Thumbnail properties
      thumbnailUrl,
      width,
      height,
      fileSize,
      format
    } = body

    // Check if image exists
    const existingImage = await prisma.galleryImage.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        altText: true,
        tags: true,
        category: true,
        location: true,
        takenAt: true,
        status: true,
        sortOrder: true,
        thumbnailUrl: true,
        width: true,
        height: true,
        fileSize: true,
        format: true
      }
    })

    if (!existingImage) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 })
    }

    // Prepare update data, only including fields that are provided
    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title
    if (category !== undefined) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (altText !== undefined) updateData.altText = altText
    if (tags !== undefined) updateData.tags = tags
    if (takenAt !== undefined) updateData.takenAt = takenAt ? new Date(takenAt) : null
    if (location !== undefined) updateData.location = location
    if (status !== undefined) updateData.status = status
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl
    if (width !== undefined) updateData.width = width
    if (height !== undefined) updateData.height = height
    if (fileSize !== undefined) updateData.fileSize = fileSize
    if (format !== undefined) updateData.format = format

    // Add updated timestamp
    updateData.updatedAt = new Date()

    const image = await prisma.galleryImage.update({
      where: { id },
      data: updateData,
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
    })

    // Log the changes for audit trail
    const changedData: any = {}
    Object.keys(updateData).forEach(key => {
      if (key !== 'updatedAt' && updateData[key] !== existingImage[key as keyof typeof existingImage]) {
        changedData[key] = {
          old: existingImage[key as keyof typeof existingImage],
          new: updateData[key]
        }
      }
    })

    if (Object.keys(changedData).length > 0) {
      await logAudit({
        entityType: EntityType.GALLERY_IMAGE,
        entityId: id,
        action: AuditAction.UPDATE,
        performedById: request.user.userId,
        changedData
      })

      // Broadcast real-time update
      notificationWebSocket.broadcastGalleryUpdate({
        action: 'update',
        imageId: id,
        title: image.title,
        category: image.category,
        changes: Object.keys(changedData),
        message: `Image "${image.title}" was updated`
      })
    }

    return NextResponse.json({ image })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update gallery image' }, { status: 500 })
  }
}

async function deleteGalleryHandler(request: NextRequest & { user: any }, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    
    // Get image details before deletion for audit log
    const img = await prisma.galleryImage.findUnique({ 
      where: { id },
      select: {
        publicId: true,
        title: true,
        category: true,
        url: true
      }
    })

    if (!img) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 })
    }

    // Delete the image from database
    await prisma.galleryImage.delete({ where: { id } })

    // Log audit trail
    await logAudit({
      entityType: EntityType.GALLERY_IMAGE,
      entityId: id,
      action: AuditAction.DELETE,
      performedById: request.user.userId,
      changedData: {
        publicId: img.publicId,
        title: img.title,
        category: img.category,
        url: img.url
      }
    })

    // Broadcast real-time update
    notificationWebSocket.broadcastGalleryUpdate({
      action: 'delete',
      imageId: id,
      title: img.title,
      category: img.category,
      message: `Image "${img.title}" was deleted`
    })

    return NextResponse.json({
      message: 'Gallery image deleted successfully',
      deletedImage: {
        id,
        title: img.title,
        publicId: img.publicId
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete gallery image' }, { status: 500 })
  }
}

async function getGalleryImageHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    
    const image = await prisma.galleryImage.findUnique({
      where: { id },
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
    })

    if (!image) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 })
    }

    return NextResponse.json({ image })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch gallery image' }, { status: 500 })
  }
}

export const GET = withAuth(getGalleryImageHandler, [UserRole.ADMIN])
export const PUT = withAuth(updateGalleryHandler, [UserRole.ADMIN])
export const DELETE = withAuth(deleteGalleryHandler, [UserRole.ADMIN])
