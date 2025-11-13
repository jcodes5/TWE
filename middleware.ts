import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AuthService } from '@/lib/auth'
import { SecurityService } from '@/lib/security'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const ipAddress = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown'

  // Only protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Validate access token
    if (accessToken) {
      const payload = AuthService.verifyAccessToken(accessToken)
      if (!payload) {
        // Token invalid, try refresh
        if (refreshToken) {
          // In a real implementation, you'd refresh here
          // For now, redirect to login
          return NextResponse.redirect(new URL('/auth/login', request.url))
        }
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      // Log admin access for security monitoring
      if (payload.role === 'ADMIN') {
        SecurityService.logSecurityEvent({
          userId: payload.userId,
          ipAddress,
          action: 'ADMIN_ACCESS',
          details: { path: pathname }
        })
      }
    }
  }

  // Add security headers
  const response = NextResponse.next()

  // HTTPS enforcement
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
}
