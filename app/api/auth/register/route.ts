
import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, userType } = body

    if (!firstName || !lastName || !email || !password || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Map userType to UserRole enum
    const roleMap: Record<string, UserRole> = {
      volunteer: UserRole.VOLUNTEER,
      sponsor: UserRole.SPONSOR,
    }

    const role = roleMap[userType]
    if (!role) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      )
    }

    const user = await AuthService.register({
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
    })

    return NextResponse.json({
      message: 'User registered successfully',
      user,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    )
  }
}
