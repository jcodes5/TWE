
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './database.ts'
import { UserRole } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || '691033f8e7ea42af9d13a9fcf40551a5831b91b4e3f7eaea561f72a9d989f5441c1c5c751a6059fc2c7b3ce6e04e4699b42343835a473c80e15752def1c4173c'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '609ca7079b56560affd38835676c292eb5b586d0ad6f89e1d79486e6990e4672f042ecf08357bc4dbe84b8ca429f38ef214c879ebbdeba091eb074d5359c4e14'

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
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
  }

  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
  }

  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch {
      return null
    }
  }

  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload
    } catch {
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

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new Error('Invalid credentials')
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const accessToken = this.generateAccessToken(payload)
    const refreshToken = this.generateRefreshToken(payload)

    await this.storeRefreshToken(user.id, refreshToken)

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
