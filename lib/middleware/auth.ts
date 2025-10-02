import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../auth'
import { UserRole } from '@prisma/client'

export function withAuth(handler: Function, requiredRoles?: UserRole[]) {
  return async (request: NextRequest, context?: any) => {
    try {
      const authHeader = request.headers.get('Authorization')
      const headerToken = authHeader?.replace('Bearer ', '')
      const cookieToken = request.cookies.get('accessToken')?.value
      const token = headerToken || cookieToken

      if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 })
      }

      const payload = AuthService.verifyAccessToken(token)

      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }

      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }

      // Add user info to request
      const enhancedRequest = request as NextRequest & { user: typeof payload }
      enhancedRequest.user = payload

      return handler(enhancedRequest, context)
    } catch (error) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}
