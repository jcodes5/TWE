import { PrismaClient, UserRole } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function fixAllAdminRoles() {
  try {
    // Update users that look like admin users
    const adminEmails = [
      'admin@twe.org',
      'admin@tweather.org',
      'theweatherandeverything@gmail.com'
    ]

    for (const email of adminEmails) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: UserRole.ADMIN },
        select: { id: true, email: true, role: true, firstName: true, lastName: true }
      })

      console.log('Updated user:', updatedUser)
    }
  } catch (error) {
    console.error('Error updating admin users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAllAdminRoles()