import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, AuditAction, EntityType } from '@prisma/client'
import { logAudit } from '@/lib/audit'

interface SortOrderUpdate {
  id: string
  sortOrder: number
}

async function reorderHandler(request: NextRequest & { user: any }) {
  try {
    const body = await request.json()
    const { order }: { order: SortOrderUpdate[] } = body

    if (!order || !Array.isArray(order) || order.length === 0) {
      return NextResponse.json({ error: 'Invalid reorder data' }, { status: 400 })
    }

    // Validate that all IDs exist and sortOrder values are valid
    const ids = order.map(item => item.id)
    const existingImages = await prisma.galleryImage.findMany({
      where: { id: { in: ids } },
      select: { id: true, title: true, sortOrder: true }
    })

    if (existingImages.length !== order.length) {
      const existingIds = new Set(existingImages.map(img => img.id))
      const missingIds = ids.filter(id => !existingIds.has(id))
      return NextResponse.json({ 
        error: 'Some images not found', 
        missingIds 
      }, { status: 400 })
    }

    // Perform bulk update
    const results = []
    const errors = []

    for (const sortUpdate of order) {
      try {
        const { id, sortOrder } = sortUpdate

        if (typeof sortOrder !== 'number' || sortOrder < 0) {
          throw new Error(`Invalid sort order: ${sortOrder}`)
        }

        await prisma.galleryImage.update({
          where: { id },
          data: { 
            sortOrder,
            updatedAt: new Date()
          },
        })

        results.push({ id, sortOrder, success: true })
      } catch (error: any) {
        errors.push({ 
          id: sortUpdate.id, 
          success: false, 
          error: error.message || 'Failed to update sort order' 
        })
      }
    }

    // Log audit trail for the reorder operation
    await logAudit({
      entityType: EntityType.GALLERY_IMAGE,
      entityId: 'batch_reorder',
      action: AuditAction.UPDATE,
      performedById: request.user.userId,
      changedData: {
        operation: 'batch_reorder',
        changes: order.map(item => ({
          id: item.id,
          oldSortOrder: existingImages.find(img => img.id === item.id)?.sortOrder,
          newSortOrder: item.sortOrder
        }))
      },
    })

    const successCount = results.length
    const errorCount = errors.length

    return NextResponse.json({
      message: `Reorder operation completed. ${successCount} successful, ${errorCount} failed.`,
      results: {
        successful: results,
        errors: errors,
      },
      summary: {
        total: order.length,
        success: successCount,
        failed: errorCount,
      }
    })

  } catch (error: any) {
    console.error('Reorder operation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Reorder operation failed' 
    }, { status: 500 })
  }
}

export const POST = withAuth(reorderHandler, [UserRole.ADMIN])