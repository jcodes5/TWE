import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AuthService } from '@/lib/auth'

const JWT_SECRET = process.env.JWT_SECRET || '691033f8e7ea42af9d13a9fcf40551a5831b91b4e3f7eaea561f72a9d989f5441c1c5c751a6059fc2c7b3ce6e04e4699b42343835a473c80e15752def1c4173c'

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  
  console.log('Cookies from request:', {
    accessToken: accessToken?.slice(0, 20) + '...',
    refreshToken: refreshToken?.slice(0, 20) + '...'
  })
  
  let payload = null
  if (accessToken) {
    payload = AuthService.verifyAccessToken(accessToken, JWT_SECRET)
    console.log('Verified payload:', payload)
  }
  
  const response = NextResponse.json({
    message: 'Cookie test',
    cookies: {
      accessToken: accessToken ? `${accessToken.slice(0, 20)}...` : null,
      refreshToken: refreshToken ? `${refreshToken.slice(0, 20)}...` : null,
    },
    payload
  })
  
  return response
}