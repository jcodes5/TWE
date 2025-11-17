import { PrismaClient, UserRole } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function fixAdminRole() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL environment variable is required')
    }

    console.log('Updating admin user role to ADMIN for email:', adminEmail)

    const updatedUser = await prisma.user.update({
      where: { email: adminEmail },
      data: { role: UserRole.ADMIN },
      select: { id: true, email: true, role: true, firstName: true, lastName: true }
    })

    console.log('Admin user updated successfully:', updatedUser)
  } catch (error) {
    console.error('Error updating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAdminRole()