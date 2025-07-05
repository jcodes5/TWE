
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole } from '@prisma/client'

async function getUsersHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const role = searchParams.get('role')

    const where = role ? { role: role as UserRole } : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

async function createUserHandler(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, phone, role, password } = body

    if (!email || !firstName || !lastName || !role || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        role,
        password: await require('@/lib/auth').AuthService.hashPassword(password),
        verified: true, // Admin-created users are auto-verified
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
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(getUsersHandler, [UserRole.ADMIN])
export const POST = withAuth(createUserHandler, [UserRole.ADMIN])
