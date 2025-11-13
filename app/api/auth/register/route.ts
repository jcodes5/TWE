import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { AuthService } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { createAndBroadcastNotification } from '@/lib/websocket'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, role } = body as { firstName: string; lastName: string; email: string; password: string; role?: UserRole }

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'First name, last name, email, and password are required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 })
    }

    const safeRole: UserRole = role === 'SPONSOR' ? 'SPONSOR' : 'VOLUNTEER'

    const created = await AuthService.register({
      email,
      firstName,
      lastName,
      password,
      role: safeRole,
    })

    // Create notification for new user registration
    await createAndBroadcastNotification(
      "New User Registration",
      `A new ${safeRole.toLowerCase()} has registered: ${firstName} ${lastName}`,
      "INFO"
    )

    const payload = { userId: created.id, email: created.email, role: created.role }
    const accessToken = AuthService.generateAccessToken(payload)
    const refreshToken = AuthService.generateRefreshToken(payload)
    await AuthService.storeRefreshToken(created.id, refreshToken)

    const response = NextResponse.json({
      message: 'User created successfully',
      user: created,
      redirectUrl: created.role === 'ADMIN' ? '/dashboard/admin' : '/auth/confirmation',
    }, { status: 201 })

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60,
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    response.cookies.set('userRole', created.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
