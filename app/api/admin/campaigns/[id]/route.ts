import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, AuditAction, EntityType, CampaignStatus } from '@prisma/client'
import { logAudit } from '@/lib/audit'

async function updateCampaignHandler(request: NextRequest & { user: any }, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { title, description, content, image, goal, category, location, status } = body

    const campaign = await prisma.campaign.update({
      where: { id },
      data: { title, description, content, image, goal, category, location, status },
    })

    await logAudit({ entityType: EntityType.CAMPAIGN, entityId: id, action: AuditAction.UPDATE, performedById: request.user.userId, changedData: body })

    return NextResponse.json({ campaign })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update campaign' }, { status: 500 })
  }
}

async function deleteCampaignHandler(request: NextRequest & { user: any }, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await prisma.campaign.delete({ where: { id } })
    await logAudit({ entityType: EntityType.CAMPAIGN, entityId: id, action: AuditAction.DELETE, performedById: request.user.userId })
    return NextResponse.json({ message: 'Campaign deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete campaign' }, { status: 500 })
  }
}

export const PUT = withAuth(updateCampaignHandler, [UserRole.ADMIN])
export const DELETE = withAuth(deleteCampaignHandler, [UserRole.ADMIN])
