import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Validation failed', details: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { user, accessToken, refreshToken } = await AuthService.login(email, password)

    const response = new NextResponse(
      JSON.stringify({
        message: 'Login successful',
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
        },
        token: accessToken,
        redirectUrl:
          user.role === 'ADMIN'
            ? '/dashboard/admin'
            : user.role === 'SPONSOR'
            ? '/dashboard/sponsor'
            : '/dashboard/volunteer',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    response.cookies.set('userRole', user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: 'Unexpected error during login' },
      { status: 500 }
    )
  }
}
