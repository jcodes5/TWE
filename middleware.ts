import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AuthService } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 👀 Read tokens - improved with better error handling
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  console.log('🌍 middleware pathname:', pathname)
  console.log('🍪 accessToken:', accessToken?.slice(0, 20) + '...')
  console.log('🍪 refreshToken:', refreshToken?.slice(0, 20) + '...')

  // 🚫 Only protect /dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    console.log('Skipping middleware for non-dashboard route')
    return NextResponse.next()
  }

  let payload = null
  
  // Try to verify access token if it exists
  if (accessToken) {
    try {
      payload = await AuthService.verifyAccessToken(accessToken)
      console.log('✅ Access token payload:', payload)
    } catch (error) {
      console.warn('❌ Invalid access token:', error)
    }
  }

  // If access token is not valid but refresh token exists, try to refresh
  if (!payload && refreshToken) {
    try {
      const refreshPayload = await AuthService.verifyRefreshToken(refreshToken)
      console.log('🔄 Refresh token payload:', refreshPayload)

      if (refreshPayload) {
        // Generate new access token
        const newAccessToken = await AuthService.generateAccessToken(refreshPayload)
        console.log('🆕 Generated new access token:', newAccessToken?.slice(0, 20) + '...')

        // Inject into cookies
          const response = NextResponse.next()
        response.cookies.set('accessToken', newAccessToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 15 * 60 // 15 minutes
        })

        payload = refreshPayload // treat as valid for routing
        console.log('✅ Access token refreshed')
        return response
      }
    } catch (err) {
      console.warn('🔁 Token refresh failed:', err)
    }
  }

  // ❌ No valid tokens at all
  if (!payload) {
    console.log('❌ No valid tokens, redirecting to login')
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const userRole = payload.role
  console.log('👥 User role:', userRole)

  // 🔁 Role-based redirect
  if (pathname === '/dashboard') {
    console.log('🔀 Redirecting based on role')
    switch (userRole) {
      case UserRole.ADMIN: 
        console.log('Redirecting ADMIN to admin dashboard')
        return NextResponse.redirect(new URL('/dashboard/admin', request.url))
      case UserRole.VOLUNTEER: 
        console.log('Redirecting VOLUNTEER to volunteer dashboard')
        return NextResponse.redirect(new URL('/dashboard/volunteer', request.url))
      case UserRole.SPONSOR: 
        console.log('Redirecting SPONSOR to sponsor dashboard')
        return NextResponse.redirect(new URL('/dashboard/sponsor', request.url))
      default: 
        console.log('Redirecting unknown role to login')
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // 🔐 Role guards
  console.log('🔐 Checking role guards for path:', pathname)
  if (pathname.startsWith('/dashboard/admin') && userRole !== UserRole.ADMIN) {
    console.log('🚫 Unauthorized access to admin area by user with role:', userRole)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  if (pathname.startsWith('/dashboard/volunteer') && userRole !== UserRole.VOLUNTEER && userRole !== UserRole.ADMIN) {
    console.log('🚫 Unauthorized access to volunteer area by user with role:', userRole)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  if (pathname.startsWith('/dashboard/sponsor') && userRole !== UserRole.SPONSOR && userRole !== UserRole.ADMIN) {
    console.log('🚫 Unauthorized access to sponsor area by user with role:', userRole)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  console.log('✅ Access granted')
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}