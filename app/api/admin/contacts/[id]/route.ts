import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, ContactStatus } from '@prisma/client'

async function updateContactHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, assignedToId } = body as { status?: ContactStatus; assignedToId?: string | null }

    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: { status, assignedToId },
    })

    return NextResponse.json({ contact })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update contact' }, { status: 500 })
  }
}

async function deleteContactHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.contact.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Contact deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete contact' }, { status: 500 })
  }
}

export const PUT = withAuth(updateContactHandler, [UserRole.ADMIN])
export const DELETE = withAuth(deleteContactHandler, [UserRole.ADMIN])
