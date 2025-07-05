
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole } from '@prisma/client'

async function updateUserHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, phone, role, verified } = body

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        email,
        firstName,
        lastName,
        phone,
        role,
        verified,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

async function deleteUserHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}

export const PUT = withAuth(updateUserHandler, [UserRole.ADMIN])
export const DELETE = withAuth(deleteUserHandler, [UserRole.ADMIN])
