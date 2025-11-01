import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, AuditAction, EntityType } from '@prisma/client'
import { logAudit } from '@/lib/audit'

interface BatchOperation {
  type: 'delete' | 'status_change' | 'category_change' | 'tag_operations'
  targetIds: string[]
  value?: any
}

async function batchOperationHandler(request: NextRequest & { user: any }) {
  try {
    const body = await request.json()
    const { type, targetIds, value }: BatchOperation = body

    if (!type || !targetIds || !Array.isArray(targetIds) || targetIds.length === 0) {
      return NextResponse.json({ error: 'Invalid batch operation data' }, { status: 400 })
    }

    const results = []
    const errors = []

    for (const id of targetIds) {
      try {
        let updateData: any = {}
        let action: AuditAction

        switch (type) {
          case 'delete':
            // Get image info before deletion for audit log
            const imgToDelete = await prisma.galleryImage.findUnique({
              where: { id },
              select: { publicId: true, title: true }
            })

            await prisma.galleryImage.delete({ where: { id } })
            action = AuditAction.DELETE
            updateData = { publicId: imgToDelete?.publicId, title: imgToDelete?.title }
            break

          case 'status_change':
            if (!value) {
              throw new Error('Status value is required')
            }
            updateData = { status: value }
            action = AuditAction.UPDATE
            break

          case 'category_change':
            if (!value) {
              throw new Error('Category value is required')
            }
            updateData = { category: value }
            action = AuditAction.UPDATE
            break

          case 'tag_operations':
            if (!value || typeof value !== 'string') {
              throw new Error('Tags value is required')
            }
            const tags = value.split(',').map(tag => tag.trim()).filter(Boolean)
            updateData = { tags }
            action = AuditAction.UPDATE
            break

          default:
            throw new Error(`Unsupported batch operation type: ${type}`)
        }

        if (type !== 'delete') {
          await prisma.galleryImage.update({
            where: { id },
            data: updateData,
          })
        }

        // Log audit trail
        await logAudit({
          entityType: EntityType.GALLERY_IMAGE,
          entityId: id,
          action,
          performedById: request.user.userId,
          changedData: updateData,
        })

        results.push({ id, success: true, action, data: updateData })
      } catch (error: any) {
        errors.push({ 
          id, 
          success: false, 
          error: error.message || `Failed to ${type} image ${id}` 
        })
      }
    }

    const successCount = results.length
    const errorCount = errors.length

    return NextResponse.json({
      message: `Batch operation completed. ${successCount} successful, ${errorCount} failed.`,
      results: {
        successful: results,
        errors: errors,
      },
      summary: {
        total: targetIds.length,
        success: successCount,
        failed: errorCount,
      }
    })

  } catch (error: any) {
    console.error('Batch operation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Batch operation failed' 
    }, { status: 500 })
  }
}

export const POST = withAuth(batchOperationHandler, [UserRole.ADMIN])