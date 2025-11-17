
import jwt from 'jsonwebtoken'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { prisma } from './database.ts'
import { UserRole } from '@prisma/client'
import { SecurityService } from './security'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '691033f8e7ea42af9d13a9fcf40551a5831b91b4e3f7eaea561f72a9d989f5441c1c5c751a6059fc2c7b3ce6e04e4699b42343835a473c80e15752def1c4173c')
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || '609ca7079b56560affd38835676c292eb5b586d0ad6f89e1d79486e6990e4672f042ecf08357bc4dbe84b8ca429f38ef214c879ebbdeba091eb074d5359c4e14')

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET environment variables are required')
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static async generateAccessToken(payload: JWTPayload): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(JWT_SECRET)
  }

  static async generateRefreshToken(payload: JWTPayload): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_REFRESH_SECRET)
  }

  static async verifyAccessToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      return payload as JWTPayload
    } catch (err: any) {
      console.error('❌ Access token invalid:', err.message)
      return null
    }
  }

  static async verifyRefreshToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
      return payload as JWTPayload
    } catch (err: any) {
      console.error('❌ Refresh token invalid:', err.message)
      return null
    }
  }

  static async storeRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    })
  }

  static async removeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token },
    })
  }

  static async validateRefreshToken(token: string): Promise<boolean> {
    try {
      // Use a more direct approach to avoid crypto module issues in edge runtime
      const refreshToken = await prisma.refreshToken.findUnique({
        where: { token },
      })

      if (!refreshToken) {
        return false
      }

      // Check if token is expired
      if (refreshToken.expiresAt < new Date()) {
        // Delete expired token
        await this.removeRefreshToken(token)
        return false
      }

      return true
    } catch (error) {
      console.error('Error validating refresh token:', error)
      return false
    }
  }

  static async register(userData: {
    email: string
    firstName: string
    lastName: string
    phone?: string
    password: string
    role: UserRole
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await this.hashPassword(userData.password)

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    })

    return user
  }

  static async login(email: string, password: string, ipAddress: string = 'unknown', userAgent?: string) {
    // Check rate limiting
    const rateLimitKey = `login:${ipAddress}`
    const canProceed = await SecurityService.checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes
    if (!canProceed) {
      await SecurityService.logSecurityEvent({
        ipAddress,
        userAgent,
        action: 'RATE_LIMIT_EXCEEDED',
        details: { email }
      })
      throw new Error('Too many login attempts. Please try again later.')
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      await SecurityService.handleFailedLogin(email, ipAddress)
      throw new Error('Invalid credentials')
    }

    // Check if account is locked
    if (SecurityService.isAccountLocked(user)) {
      await SecurityService.logSecurityEvent({
        userId: user.id,
        ipAddress,
        userAgent,
        action: 'ACCOUNT_LOCKED',
        details: { email }
      })
      throw new Error('Account is temporarily locked due to too many failed attempts.')
    }

    const passwordMatch = await this.comparePassword(password, user.password)
    if (!passwordMatch) {
      await SecurityService.handleFailedLogin(email, ipAddress)
      throw new Error('Invalid credentials')
    }

    // Check if MFA is required for admin users
    if (user.role === UserRole.ADMIN) {
      // For now, we'll assume MFA is not enforced yet
      // This will be updated when the schema includes MFA fields
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = await this.generateAccessToken(payload)
    const refreshToken = await this.generateRefreshToken(payload)

    await this.storeRefreshToken(user.id, refreshToken)
    await SecurityService.handleSuccessfulLogin(user.id, ipAddress)

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
      },
      accessToken,
      refreshToken,
      requiresMFA: user.role === UserRole.ADMIN // Will be updated with actual MFA check
    }
  }

  static async refreshAccessToken(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken)
    
    if (!payload || !(await this.validateRefreshToken(refreshToken))) {
      throw new Error('Invalid refresh token')
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const newPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = await this.generateAccessToken(newPayload)

    return { accessToken }
  }
}
