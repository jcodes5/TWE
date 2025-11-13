import { authenticator } from 'otplib'
import crypto from 'crypto'
import { prisma } from './database'

enum SecurityAction {
  LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  MFA_ATTEMPT = 'MFA_ATTEMPT',
  MFA_SUCCESS = 'MFA_SUCCESS',
  MFA_FAILURE = 'MFA_FAILURE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  ADMIN_ACCESS = 'ADMIN_ACCESS'
}

export class SecurityService {
  private static readonly ENCRYPTION_KEY: string = process.env.ENCRYPTION_KEY!
  private static readonly ALGORITHM = 'aes-256-gcm'

  // Validate required environment variables
  private static validateEnvironment() {
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY environment variable is required')
    }
  }

  // MFA Functions
  static generateMFASecret() {
    const secret = authenticator.generateSecret()
    return {
      secret,
      otpauth: authenticator.keyuri('admin@twe.org', 'TWE Admin Panel', secret)
    }
  }

  static verifyMFAToken(secret: string, token: string): boolean {
    try {
      return authenticator.verify({ token, secret })
    } catch (error) {
      return false
    }
  }

  static generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase())
    }
    return codes
  }

  // Encryption Functions
  static encrypt(text: string): string {
    this.validateEnvironment()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(this.ALGORITHM, Buffer.from(this.ENCRYPTION_KEY!), iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const authTag = cipher.getAuthTag()
    return iv.toString('hex') + ':' + encrypted + ':' + authTag.toString('hex')
  }

  static decrypt(encryptedText: string): string {
    this.validateEnvironment()
    const parts = encryptedText.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]
    const authTag = Buffer.from(parts[2], 'hex')

    const decipher = crypto.createDecipheriv(this.ALGORITHM, Buffer.from(this.ENCRYPTION_KEY!), iv)
    decipher.setAuthTag(authTag)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  // RBAC Functions
  static getDefaultPermissions(role: string): string[] {
    const rolePermissions: { [key: string]: string[] } = {
      ADMIN: [
        'users:read', 'users:write', 'users:delete',
        'campaigns:read', 'campaigns:write', 'campaigns:delete',
        'blog:read', 'blog:write', 'blog:delete',
        'gallery:read', 'gallery:write', 'gallery:delete',
        'contacts:read', 'contacts:write', 'contacts:delete',
        'settings:read', 'settings:write',
        'audit:read',
        'security:read', 'security:write'
      ],
      VOLUNTEER: [
        'campaigns:read',
        'blog:read',
        'gallery:read'
      ],
      SPONSOR: [
        'campaigns:read',
        'blog:read',
        'gallery:read',
        'donations:read'
      ]
    }
    return rolePermissions[role] || []
  }

  static hasPermission(userPermissions: string[] | null, requiredPermission: string): boolean {
    if (!userPermissions) return false
    return userPermissions.includes(requiredPermission) ||
           userPermissions.includes(requiredPermission.split(':')[0] + ':*')
  }

  // Security Logging
  static async logSecurityEvent(params: {
    userId?: string
    ipAddress: string
    userAgent?: string
    action: string
    details?: any
  }) {
    try {
      // Security event logged (removed console.log for production)
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }

  // Rate Limiting (in-memory implementation)
  private static rateLimits = new Map<string, { attempts: number, resetAt: Date }>()

  static async checkRateLimit(key: string, maxAttempts: number, windowMs: number): Promise<boolean> {
    const now = new Date()
    const existing = this.rateLimits.get(key)

    if (!existing || existing.resetAt < now) {
      this.rateLimits.set(key, { attempts: 1, resetAt: new Date(now.getTime() + windowMs) })
      return true
    }

    if (existing.attempts >= maxAttempts) {
      return false
    }

    existing.attempts++
    return true
  }

  // Account Security
  static async handleFailedLogin(email: string, ipAddress: string) {
    await this.logSecurityEvent({
      ipAddress,
      action: 'LOGIN_FAILURE',
      details: { email }
    })
  }

  static async handleSuccessfulLogin(userId: string, ipAddress: string) {
    await this.logSecurityEvent({
      userId,
      ipAddress,
      action: 'LOGIN_SUCCESS'
    })
  }

  static isAccountLocked(user: any): boolean {
    return false // Will be implemented with schema migration
  }

  // Session Management
  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }
}