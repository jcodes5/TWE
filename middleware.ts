import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  console.log('🌍 middleware pathname:', pathname)
  console.log('🍪 accessToken exists:', !!accessToken)
  console.log('🍪 refreshToken exists:', !!refreshToken)

  // Only protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Let access through, token will be validated server-side
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
