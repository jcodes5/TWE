
import { PrismaClient, UserRole } from '@prisma/client'
import { AuthService } from '../lib/auth.ts'

const prisma = new PrismaClient()

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required')
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existingAdmin) {
      return
    }

    // Create admin user
    const adminUser = await AuthService.register({
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'User',
      password: adminPassword,
      role: UserRole.ADMIN,
    })

    // Mark as verified
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { verified: true },
    })

    // Admin user created successfully
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin()
