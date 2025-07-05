
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AuthService } from './lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Dashboard route protection
  if (pathname.startsWith('/dashboard')) {
    // Check if user is authenticated using access token
    const accessToken = request.cookies.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Verify the access token
    const payload = AuthService.verifyAccessToken(accessToken)
    
    if (!payload) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check user role and redirect accordingly
    const userRole = payload.role

    if (pathname === '/dashboard') {
      // Redirect to appropriate dashboard based on user role
      switch (userRole) {
        case 'ADMIN':
          return NextResponse.redirect(new URL('/dashboard/admin', request.url))
        case 'VOLUNTEER':
          return NextResponse.redirect(new URL('/dashboard/volunteer', request.url))
        case 'SPONSOR':
          return NextResponse.redirect(new URL('/dashboard/sponsor', request.url))
        default:
          return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    // Check if user is accessing the correct dashboard type
    if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (pathname.startsWith('/dashboard/volunteer') && userRole !== 'VOLUNTEER') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (pathname.startsWith('/dashboard/sponsor') && userRole !== 'SPONSOR') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
