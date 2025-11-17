import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import { AuthService } from '../lib/auth'
import * as jwt from 'jsonwebtoken'

dotenv.config()

const prisma = new PrismaClient()

async function testLogin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      throw new Error('Admin credentials not found in environment variables')
    }

    console.log('Testing login for admin user:', adminEmail)

    // Check user in database
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    console.log('User found in database:', {
      id: user?.id,
      email: user?.email,
      role: user?.role,
    })

    // Test login
    const result = await AuthService.login(adminEmail, adminPassword, 'localhost', 'test')
    console.log('Login result:', {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
    })

    // Test JWT token generation
    const payload = {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
    }

    console.log('Payload for JWT:', payload)

    const accessToken = AuthService.generateAccessToken(payload)
    console.log('Generated access token (first 20 chars):', accessToken?.slice(0, 20) + '...')

    // Test JWT verification
    const verifiedPayload = AuthService.verifyAccessToken(accessToken)
    console.log('Verified payload:', verifiedPayload)

    // Test redirect URL logic
    const redirectUrl = 
      result.user.role === 'ADMIN'
        ? '/dashboard/admin'
        : result.user.role === 'SPONSOR'
        ? '/dashboard/sponsor'
        : '/dashboard/volunteer'
    
    console.log('Calculated redirect URL:', redirectUrl)

  } catch (error) {
    console.error('Error during test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()