
import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }

    const result = await AuthService.refreshAccessToken(refreshToken)

    const response = NextResponse.json({
      message: 'Token refreshed successfully',
    })

    response.cookies.set('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Token refresh failed' },
      { status: 401 }
    )
  }
}
