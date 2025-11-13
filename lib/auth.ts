
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './database.ts'
import { UserRole } from '@prisma/client'
import { SecurityService } from './security'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
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

  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET!, { expiresIn: '15m' })
  }

  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET!, { expiresIn: '7d' })
  }

  static verifyAccessToken(token: string, secret: string = JWT_SECRET): JWTPayload | null {
    try {
      return jwt.verify(token, secret) as unknown as JWTPayload
    } catch (err: any) {
      console.error('❌ Access token invalid:', err.message)
      return null
    }
  }

  static verifyRefreshToken(token: string, secret: string = JWT_REFRESH_SECRET): JWTPayload | null {
    try {
      return jwt.verify(token, secret) as unknown as JWTPayload
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
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    })

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      if (refreshToken) {
        await this.removeRefreshToken(token)
      }
      return false
    }

    return true
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

    const accessToken = this.generateAccessToken(payload)
    const refreshToken = this.generateRefreshToken(payload)

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
    const payload = this.verifyRefreshToken(refreshToken)
    
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

    const accessToken = this.generateAccessToken(newPayload)

    return { accessToken }
  }
}
