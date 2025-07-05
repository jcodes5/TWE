
import { PrismaClient, UserRole } from '@prisma/client'
import { AuthService } from '../lib/auth.ts'

const prisma = new PrismaClient()

async function seedAdmin() {
  try {
    const adminEmail = 'admin@twe.org'
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user
    const adminUser = await AuthService.register({
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'User',
      password: 'tweadmin123', // Change this in production
      role: UserRole.ADMIN,
    })

    // Mark as verified
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { verified: true },
    })

    console.log('Admin user created successfully!')
    console.log('Email: admin@twe.org')
    console.log('Password: tweadmin123')
    console.log('Please change the password after first login!')
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin()
