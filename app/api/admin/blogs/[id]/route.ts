import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, AuditAction, EntityType, PostStatus } from '@prisma/client'
import { logAudit } from '@/lib/audit'

async function updateBlogHandler(request: NextRequest & { user: any }, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { title, content, excerpt, image, category, status } = body

    const post = await prisma.blogPost.update({
      where: { id },
      data: { title, content, excerpt, image, category, status },
    })

    await logAudit({ entityType: EntityType.BLOG_POST, entityId: id, action: AuditAction.UPDATE, performedById: request.user.userId, changedData: body })

    return NextResponse.json({ post })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update blog post' }, { status: 500 })
  }
}

async function deleteBlogHandler(request: NextRequest & { user: any }, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await prisma.blogPost.delete({ where: { id } })
    await logAudit({ entityType: EntityType.BLOG_POST, entityId: id, action: AuditAction.DELETE, performedById: request.user.userId })
    return NextResponse.json({ message: 'Blog post deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete blog post' }, { status: 500 })
  }
}

export const PUT = withAuth(updateBlogHandler, [UserRole.ADMIN])
export const DELETE = withAuth(deleteBlogHandler, [UserRole.ADMIN])
