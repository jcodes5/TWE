import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Validation failed', details: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Validation failed', details: 'Email and password must be strings' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication failed', details: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Authentication failed', details: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Validate JWT_SECRET
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
      console.error('JWT secret not set in .env')
      return NextResponse.json(
        { error: 'Internal server error', details: 'JWT not configured' },
        { status: 500 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Prepare response
    const response = new NextResponse(JSON.stringify({
      message: 'Login successful',
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      },
      token,
      redirectUrl: user.role === 'ADMIN'
        ? '/dashboard/admin'
        : user.role === 'SPONSOR'
        ? '/dashboard/sponsor'
        : '/dashboard/volunteer'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Set the cookie
    response.cookies.set('accessToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
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
