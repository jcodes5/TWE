
import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (refreshToken) {
      await AuthService.removeRefreshToken(refreshToken)
    }

    const response = NextResponse.json({
      message: 'Logout successful',
    })

    // Clear cookies
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    response.cookies.delete('userRole')

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 500 }
    )
  }
}
