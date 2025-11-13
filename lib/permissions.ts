import { UserRole } from '@prisma/client'
import { SecurityService } from './security'

export interface UserPermissions {
  id: string
  role: UserRole
  permissions?: string[] | null
}

export class PermissionService {
  // Check if user has a specific permission
  static hasPermission(user: UserPermissions, requiredPermission: string): boolean {
    // Admins have all permissions
    if (user.role === UserRole.ADMIN) {
      return true
    }

    // Check custom permissions if they exist
    if (user.permissions) {
      return SecurityService.hasPermission(user.permissions, requiredPermission)
    }

    // Fall back to role-based permissions
    const rolePermissions = SecurityService.getDefaultPermissions(user.role)
    return SecurityService.hasPermission(rolePermissions, requiredPermission)
  }

  // Check if user has any of the required permissions
  static hasAnyPermission(user: UserPermissions, requiredPermissions: string[]): boolean {
    return requiredPermissions.some(permission => this.hasPermission(user, permission))
  }

  // Check if user has all required permissions
  static hasAllPermissions(user: UserPermissions, requiredPermissions: string[]): boolean {
    return requiredPermissions.every(permission => this.hasPermission(user, permission))
  }

  // Middleware function for API routes
  static requirePermission(requiredPermission: string) {
    return async (request: Request, user: UserPermissions) => {
      if (!this.hasPermission(user, requiredPermission)) {
        throw new Error(`Insufficient permissions: ${requiredPermission} required`)
      }
    }
  }

  // Common permission checks
  static canManageUsers(user: UserPermissions): boolean {
    return this.hasPermission(user, 'users:write')
  }

  static canViewUsers(user: UserPermissions): boolean {
    return this.hasPermission(user, 'users:read')
  }

  static canManageCampaigns(user: UserPermissions): boolean {
    return this.hasPermission(user, 'campaigns:write')
  }

  static canViewCampaigns(user: UserPermissions): boolean {
    return this.hasPermission(user, 'campaigns:read')
  }

  static canManageBlog(user: UserPermissions): boolean {
    return this.hasPermission(user, 'blog:write')
  }

  static canViewBlog(user: UserPermissions): boolean {
    return this.hasPermission(user, 'blog:read')
  }

  static canManageGallery(user: UserPermissions): boolean {
    return this.hasPermission(user, 'gallery:write')
  }

  static canViewGallery(user: UserPermissions): boolean {
    return this.hasPermission(user, 'gallery:read')
  }

  static canManageContacts(user: UserPermissions): boolean {
    return this.hasPermission(user, 'contacts:write')
  }

  static canViewContacts(user: UserPermissions): boolean {
    return this.hasPermission(user, 'contacts:read')
  }

  static canManageSettings(user: UserPermissions): boolean {
    return this.hasPermission(user, 'settings:write')
  }

  static canViewSettings(user: UserPermissions): boolean {
    return this.hasPermission(user, 'settings:read')
  }

  static canViewAuditLogs(user: UserPermissions): boolean {
    return this.hasPermission(user, 'audit:read')
  }

  static canManageSecurity(user: UserPermissions): boolean {
    return this.hasPermission(user, 'security:write')
  }

  static canViewSecurity(user: UserPermissions): boolean {
    return this.hasPermission(user, 'security:read')
  }
}